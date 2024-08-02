import {
  array,
  iso8601,
  number,
  object,
  optional,
  string,
  Result as Result_,
  DecodeResult,
  DecoderType,
  email,
  oneOf,
  regex,
  taggedUnion,
  constant,
  lazy,
  setFromArray,
  either,
  Decoder,
  unknown,
} from 'decoders';
import {
  COLOURS,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

const nonEmptyStringDecoder = string.refine(
  (s) => s.length > 0,
  'Must be non-empty'
);

const subscriptionDecoder = oneOf(SUBSCRIPTION_TYPES);

const stripeIdDecoder = regex(
  /^cus_[a-zA-Z0-9]{14,}$/,
  'Stripe id must be in the format cus_XXXXXXXXXXXXXX'
);

const integerDecoder = number.refine(
  (n) => Number.isInteger(n),
  'Must be an integer'
);
const nonNegativeDecoder = number.refine(
  (n) => n >= 0,
  'Must be a positive number'
);

// but no way to combine them, so let's repeat
const nonNegativeIntegerDecoder = integerDecoder.refine(
  (n) => n >= 0,
  'Must be a positive number'
);

const hexColourDecoder = regex(
  /^#[a-fA-F0-9]{6}$/,
  'Hex colour must be in the format #RRGGBB'
);
const colourDecoder = oneOf(COLOURS);
const uniqArray = <T>(decoder: Decoder<T>) =>
  array(decoder).refine(
    (a) => new Set(a).size === a.length,
    'Expected unique items'
  );
const setFromUniqArray = <T>(decoder: Decoder<T>) =>
  uniqArray(decoder).transform((a) => new Set(a));
const favouriteColoursDecoder = setFromUniqArray(
  either(hexColourDecoder, colourDecoder)
);

// note that "type" has a typo in it purposely; it shows that the lib allows to write arbitrary values here, so the feature is JS-only, it doesn't work in Typescript
// https://github.com/nvie/decoders/issues/1153
const profileDecoder0 = taggedUnion('tуpe', {
  listener: object({
    type: constant('listener'),
    boughtTracks: nonNegativeIntegerDecoder,
  }),
  artist: object({
    type: constant('artist'),
    publishedTracks: nonNegativeIntegerDecoder,
  }),
});

const profileDecoder = either(
  object({
    type: constant('listener'),
    boughtTracks: nonNegativeIntegerDecoder,
  }),
  object({
    type: constant('artist'),
    publishedTracks: nonNegativeIntegerDecoder,
  })
)

type FileSystem = (
  | {
      readonly type: 'directory';
      readonly children: readonly FileSystem[];
    }
  | {
      readonly type: 'file';
    }
) & {
  readonly name: string;
};

const fileSystemDecoder0: Decoder<FileSystem> = lazy(() =>
  taggedUnion('type', {
    directory: object({
      type: constant('directory'),
      children: array(fileSystemDecoder0).refine(
        (a) => new Set(a.map((f) => f.name)).size === a.length,
        'Expected unique names in the children'
      ),
      // no composability; have to repeat
      name: nonEmptyStringDecoder,
    }),
    file: object({
      type: constant('file'),
      // no composability; have to repeat
      name: nonEmptyStringDecoder,
    }),
  })
);

const fileSystemDecoder: Decoder<FileSystem> = lazy(() =>
  either(
    object({
      type: constant('directory'),
      children: array(fileSystemDecoder0).refine(
        (a) => new Set(a.map((f) => f.name)).size === a.length,
        'Expected unique names in the children'
      ),
      // no composability; have to repeat
      name: nonEmptyStringDecoder,
    }),
    object({
      type: constant('file'),
      // no composability; have to repeat
      name: nonEmptyStringDecoder,
    })
  )
);

const userDecoder = object({
  name: nonEmptyStringDecoder,
  email,
  createdAt: iso8601,
  updatedAt: iso8601,
  subscription: subscriptionDecoder,
  stripeId: stripeIdDecoder,
  visits: nonNegativeIntegerDecoder,
  favouriteColours: favouriteColoursDecoder,
  // crashes on parsing
  // profile: profileDecoder0,
  profile: profileDecoder,
  // crashes on parsing
  // fileSystem: fileSystemDecoder0,
  fileSystem: fileSystemDecoder,
  // not composable
}).refine(
  (u) => u.createdAt <= u.updatedAt,
  'createdAt must be less or equal than updatedAt'
);

type User = DecoderType<typeof userDecoder>;

export const decodeUser = (u: unknown): Result<string, User> =>
  mapResult(userDecoder.decode(u));

export const encodeUser = (_u: User): Result<unknown, unknown> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: false,
    acceptsTypedInput: false,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor:
      'Regex used in code, no disclaimer in docs',
  },
};

// utils
const mapResult = <T>(r: DecodeResult<T>): Result<string, T> => {
  // needed to runtime check the taggedUnion issue
  // console.log(r);
  return r.error
    ? { _tag: 'left', error: r.error.text || r.error.type }
    : { _tag: 'right', value: r.value };
};

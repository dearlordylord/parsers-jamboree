import {
  array,
  Infer,
  number,
  object,
  string,
  coerce,
  define,
  literal,
  refine,
  union,
  enums,
  intersection,
  pattern,
  integer,
  date,
  assign,
  StructError,
  set,
  Struct,
  any,
} from 'superstruct';
import {
  COLOURS,
  EMAIL_REGEX_S,
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

const MyNumber = coerce(number(), string(), (value) => parseFloat(value));

const EMAIL_REGEX = new RegExp(EMAIL_REGEX_S);
const isEmail = (value: string) => EMAIL_REGEX.test(value);

// TODO fix their example https://github.com/ianstormtaylor/superstruct/blob/main/examples/custom-types.js - `code` not in Result
const Email = define('Email', (value) => {
  // todo how to compose?
  if (typeof value !== 'string') {
    return 'not_string';
  }
  if (!isEmail(value)) {
    return 'not_email';
  } else if (value.length >= 256) {
    return 'too_long';
  } else {
    return true;
  }
});

// can go with `define` and branding but since the lib doesn't support out of the box let's skip it
const NonNegative = refine(number(), 'NonNegative', (n) => n >= 0);
// can be "min(integer(), 0)" but I went this way to show intersections
const NonNegativeInteger = intersection([NonNegative, integer()]);

// discriminated unions not exactly supported https://github.com/ianstormtaylor/superstruct/issues/1183

const ProfileListener = object({
  type: literal(PROFILE_TYPE_LISTENER),
  boughtTracks: NonNegativeInteger,
});

const ProfileArtist = object({
  type: literal(PROFILE_TYPE_ARTIST),
  publishedTracks: NonNegativeInteger,
});

const Colour = enums(COLOURS);
const HexColour = pattern(string(), /^#[a-fA-F0-9]{6}$/);
const ColourOrHex = union([Colour, HexColour]);

const StripeCustomerId = pattern(string(), /^cus_[a-zA-Z0-9]{14,}$/);

const SubscriptionType = enums(SUBSCRIPTION_TYPES);

const IsoDateString = coerce(
  date(),
  string(),
  (s) => new Date(s) /*date() will filter out invalid date objects implicitly*/
);

// loses the refinement after assign() https://github.com/ianstormtaylor/superstruct/issues/1188
const IsoDateStringRange = refine(
  object({
    createdAt: IsoDateString,
    updatedAt: IsoDateString,
  }),
  'DateRange',
  (value) => {
    if (value.createdAt > value.updatedAt) {
      return (
        `Expected 'createdAt' to be less or equal than 'updatedAt' on type 'IsoDateStringRange', ` +
        `but received ${JSON.stringify(value)}`
      );
    }
    return true;
  }
);

const uniqArray = <T>(s: Struct<T>) =>
  refine(array(s), 'UniqArray', (v) => {
    if (new Set(v).size !== v.length) {
      return `Expected unique items on type 'UniqArray', but received ${JSON.stringify(
        v
      )}`;
    }
    return true;
  });

const arrayToSet = <T>(s: Struct<T>) =>
  coerce(array(s), set(s), (v) => new Set(v));

const FavouriteColours = arrayToSet(ColourOrHex);

const NonEmptyString = refine(string(), 'NonEmptyString', (s) => {
  if (s.length === 0) {
    return `Expected non-empty string on type 'NonEmptyString', but received ${JSON.stringify(
      s
    )}`;
  }
  return true;
});

const FileSystem = any(); // TODO

const User = assign(
  object({
    name: NonEmptyString,
    email: Email,
    subscription: SubscriptionType,
    stripeId: StripeCustomerId,
    visits: NonNegativeInteger,
    favouriteColours: FavouriteColours,
    profile: union([ProfileListener, ProfileArtist]),
    fileSystem: FileSystem,
  }),
  IsoDateStringRange
);

type User = Infer<typeof User>;

export const meta: TrustedCompileTimeMeta = {
  branded: false,
};

export const decodeUser = (u: unknown): Result<string, User> => {
  try {
    const c = User.create(u);
    return { _tag: 'right', value: c };
  } catch (e: unknown) {
    if (e instanceof StructError) {
      return {
        _tag: 'left',
        error: JSON.stringify(
          {
            failures: e.failures(),
            message: e.message,
          },
          null,
          2
        ),
      };
    } else {
      return { _tag: 'left', error: 'error interpreting the error!' };
    }
  }
};

export const encodeUser = (u: User): Result<string, unknown> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

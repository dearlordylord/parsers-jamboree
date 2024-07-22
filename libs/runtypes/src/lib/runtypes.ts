import {
  Boolean,
  Number,
  String,
  Literal,
  Array,
  Result as LibResult,
  Record,
  Union,
  Template,
  Static,
  RuntypeBrand,
  Intersect,
  Lazy,
  Runtype,
} from 'runtypes';
import {
  chain,
  COLOURS,
  EMAIL_REGEX_S,
  ISO_DATE_REGEX_S,
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  PROFILE_TYPES,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

const NonNegative = Number.withConstraint((n) => n >= 0).withBrand(
  'NonNegative'
);
const Integer = Number.withConstraint((n) => n % 1 === 0).withBrand('Integer');
const NonNegativeInteger = Intersect(NonNegative, Integer).withBrand(
  'NonNegativeInteger'
);

const NonEmptyString = String.withConstraint((s) => s.length > 0).withBrand(
  'NonEmptyString'
);
type NonEmptyString = Static<typeof NonEmptyString>;
const Email = NonEmptyString.withConstraint(
  (s) => !!s.match(EMAIL_REGEX_S)
).withBrand('Email');

const StripeCustomerId = Template(
  'cus_',
  String.withConstraint((s) => s.length >= 14)
).withBrand('StripeCustomerId');

// @ts-expect-error sexy: it indeed interprets the type as `cus_${string}`
const stripeCustomerId: Static<typeof StripeCustomerId> =
  'NOT CUS_NffrFeUfNV2Hib' as 'NOT CUS_NffrFeUfNV2Hib' &
    RuntypeBrand<'StripeCustomerId'>;

// inconvenience
type TupleToLiteral<T extends readonly unknown[]> = T extends readonly [
  infer K,
  ...infer REST
]
  ? K extends string
    ? [Literal<K>, ...TupleToLiteral<REST>]
    : never
  : [];

const SubscriptionType = Union(
  ...(SUBSCRIPTION_TYPES.map((s) => Literal(s)) as TupleToLiteral<
    typeof SUBSCRIPTION_TYPES
  >)
);

const IsoDateString = String.withConstraint(
  (s) => !!s.match(ISO_DATE_REGEX_S)
).withBrand('IsoDateString');

const HexColour = String.withConstraint(
  (s) => !!s.match(/^#[a-fA-F0-9]{6}$/)
).withBrand('HexColour');

const Colour = Union(
  ...(COLOURS.map((c) => Literal(c)) as TupleToLiteral<typeof COLOURS>)
);

const HexColourOrColour = Union(HexColour, Colour);
type HexColourOrColour = Static<typeof HexColourOrColour>;

const ProfileListener = Record({
  type: Literal(PROFILE_TYPE_LISTENER),
  boughtTracks: NonNegativeInteger,
});

const ProfileArtist = Record({
  type: Literal(PROFILE_TYPE_ARTIST),
  publishedTracks: NonNegativeInteger,
});

const Profile = Union(ProfileListener, ProfileArtist);

const TemporalConcernUnsorted = Record({
  createdAt: IsoDateString,
  updatedAt: IsoDateString,
});

const TemporalConcern = TemporalConcernUnsorted.withConstraint((v) =>
  v.createdAt <= v.updatedAt
    ? true
    : `createdAt must be less or equal than updatedAt`
);

type FileSystem = (
  | {
      readonly type: 'directory';
      readonly children: readonly FileSystem[];
    }
  | {
      readonly type: 'file';
    }
) & {
  readonly name: NonEmptyString;
};

const FileSystemCommon = Record({
  name: NonEmptyString,
});

const FileSystemDirectory: Runtype<FileSystem & { type: 'directory' }> = Lazy(
  () =>
    Intersect(
      FileSystemCommon,
      Record({
        type: Literal('directory'),
        children: Array(FileSystem),
      }).withConstraint((v) =>
        new Set(v.children.map((c) => c.name)).size === v.children.length
          ? true
          : `Expected unique names, got ${JSON.stringify(
              v.children.map((c) => c.name)
            )}`
      )
    )
);

const FileSystemFile = Intersect(
  FileSystemCommon,
  Record({
    type: Literal('file'),
  })
);

const FileSystem = Union(FileSystemDirectory, FileSystemFile);

const UserJson = Intersect(
  Record({
    name: NonEmptyString,
    email: Email,
    // the lib supports no transformations
    createdAt: IsoDateString,
    updatedAt: IsoDateString,
    subscription: SubscriptionType,
    stripeId: StripeCustomerId,
    visits: NonNegativeInteger,
    favouriteColours: Array(HexColourOrColour).withConstraint((v) =>
      new Set(v).size === v.length ? true : `Expected unique items`
    ),
    profile: Profile,
    fileSystem: FileSystem,
  }),
  TemporalConcern
);

type User = Static<typeof UserJson>;

export const decodeUser = (u: unknown): Result<string, User> => {
  const firstLayerResult = UserJson.validate(u);
  const firstLayerResultMapped = mapResult(firstLayerResult);
  // the lib cannot transform, not planned https://github.com/runtypes/runtypes/issues/56
  // this function also doesn't collect errors
  return chain((u: User): Result<string, User> => {
    // const favouriteColours = new Set(u.favouriteColours);
    // if (favouriteColours.size !== u.favouriteColours.length) {
    //   return { _tag: 'left', error: 'favourite colours must be unique' };
    // }
    // const createdAt = new Date(u.createdAt);
    // if (isNaN(createdAt.getTime())) {
    //   return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
    // }
    // const updatedAt = new Date(u.updatedAt);
    // if (isNaN(updatedAt.getTime())) {
    //   return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
    // }
    return {
      _tag: 'right',
      value: u,
    };
  })(firstLayerResultMapped);
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: true,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `A default method for email validation is not provided, which makes this check pass.`,
  },
};

// actually since there's no transformation, it's just the same object; so "no-feature feature"
// BUT also we can't check if a transformed object was passed or not; so I predict plenty of errors on this front;
// the presence of transformations (and they will be present in production code) dictates that this feature is functionally, not only nominally, non-existing
export const encodeUser = (_u: User): Result<string, unknown> => ({
  _tag: 'left',
  error: 'the lib cannot do it',
});

// utils

const mapResult = <T>(r: LibResult<T>): Result<string, T> =>
  r.success
    ? { _tag: 'right', value: r.value }
    : { _tag: 'left', error: r.message /*todo code, details*/ };

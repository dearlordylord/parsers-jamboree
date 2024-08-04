import {
  Array,
  Intersect,
  Lazy,
  Literal,
  Number,
  Record,
  Result as LibResult,
  Runtype,
  RuntypeBrand,
  Static,
  String,
  Template,
  Union,
} from 'runtypes';
import {
  chain,
  COLOURS,
  EMAIL_REGEX_S,
  ISO_DATE_REGEX_S,
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  Result,
  SUBSCRIPTION_TYPES,
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

export const decodeUser = (u: unknown): Result<string, User> =>
  mapResult(UserJson.validate(u));

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
    : {
        _tag: 'left',
        error: `${r.message}\n${JSON.stringify(r.details, null, 2)}\n${r.code}`,
      };

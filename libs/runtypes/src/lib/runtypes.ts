

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
  RuntypeBrand
} from 'runtypes';
import {
  chain,
  COLOURS,
  EMAIL_REGEX_S,
  ISO_DATE_REGEX_S, PROFILE_TYPE_ARTIST, PROFILE_TYPE_LISTENER,
  PROFILE_TYPES,
  Result,
  SUBSCRIPTION_TYPES
} from '@parsers-jamboree/common';

const NonNegative = Number.withConstraint(n => n >= 0).withBrand('NonNegative');
const Integer = Number.withConstraint(n => n % 1 === 0).withBrand('Integer');
const NonNegativeInteger = Union(NonNegative, Integer).withBrand('NonNegativeInteger');

const NonEmptyString = String.withConstraint(s => s.length > 0).withBrand('NonEmptyString');
const Email = NonEmptyString.withConstraint(s => !!s.match(EMAIL_REGEX_S)).withBrand('Email');

const StripeCustomerId = Template('cus_', String.withConstraint(s => s.length >= 14)).withBrand('StripeCustomerId');

// @ts-expect-error sexy: it indeed interprets the type as `cus_${string}`
const stripeCustomerId: Static<typeof StripeCustomerId> = 'NOT CUS_NffrFeUfNV2Hib' as 'NOT CUS_NffrFeUfNV2Hib' & RuntypeBrand<'StripeCustomerId'>;

// inconvenience
type TupleToLiteral<T extends readonly unknown[]> =
  T extends readonly [infer K, ...infer REST] ?
    (K extends string ? [Literal<K>, ...TupleToLiteral<REST>] : never)
  : [];

const SubscriptionType = Union(...(SUBSCRIPTION_TYPES.map(s => Literal(s)) as TupleToLiteral<typeof SUBSCRIPTION_TYPES>));

const IsoDateString = String.withConstraint(s => !!s.match(ISO_DATE_REGEX_S)).withBrand('IsoDateString');

const HexColour = String.withConstraint(s => !!s.match(/^#[a-fA-F0-9]{6}$/)).withBrand('HexColour');

const Colour = Union(...(COLOURS.map(c => Literal(c)) as TupleToLiteral<typeof COLOURS>));

const HexColourOrColour = Union(HexColour, Colour);
type HexColourOrColour = Static<typeof HexColourOrColour>;

const ProfileType = Union(...(PROFILE_TYPES.map(t => Literal(t)) as TupleToLiteral<typeof PROFILE_TYPES>));

const ProfileListener = Record({
  type: Literal(PROFILE_TYPE_LISTENER),
  boughtTracks: NonNegativeInteger,
});

const ProfileArtist = Record({
  type: Literal(PROFILE_TYPE_ARTIST),
  publishedTracks: NonNegativeInteger,
});

const Profile = Union(ProfileListener, ProfileArtist);

const UserJson = Record({
  name: NonEmptyString,
  email: Email,
  // the lib supports no transformations
  createdAt: IsoDateString,
  updatedAt: IsoDateString,
  subscription: SubscriptionType,
  stripeId: StripeCustomerId,
  visits: NonNegativeInteger,
  favouriteColours: Array(HexColourOrColour),
  profile: Profile
});

type UserJson = Static<typeof UserJson>;

type User = Omit<Static<typeof UserJson>, 'favouriteColours' | 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
  favouriteColours: Set<HexColourOrColour>
};


export const decodeUser = (u: unknown): Result<string, User> => {
  const firstLayerResult = UserJson.validate(u);
  const firstLayerResultMapped = mapResult(firstLayerResult);
  // the lib cannot transform, not planned https://github.com/runtypes/runtypes/issues/56
  // this function also doesn't collect errors
  return chain((u: UserJson): Result<string, User> => {
    const favouriteColours = new Set(u.favouriteColours);
    if (favouriteColours.size !== u.favouriteColours.length) {
      return { _tag: 'left', error: 'favourite colours must be unique' };
    }
    const createdAt = new Date(u.createdAt);
    if (isNaN(createdAt.getTime())) {
      return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
    }
    const updatedAt = new Date(u.updatedAt);
    if (isNaN(updatedAt.getTime())) {
      return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
    }
    return {
      _tag: 'right',
      value: {
        ...u,
        favouriteColours,
        createdAt,
        updatedAt,
      }
    }
  })(firstLayerResultMapped);
};

// actually since there's no transformation, it's just the same object; so "no-feature feature"
// BUT also we can't check if a transformed object was passed or not; so I predict plenty of errors on this front;
// the presence of transformations (and they will be present in production code) dictates that this feature is functionally, not only nominally, non-existing
export const encodeUser = (_u: User): Result<string, unknown> => ({ _tag: 'left', error: 'the lib cannot do it' });

// utils

const mapResult = <T>(r: LibResult<T>): Result<string, T> =>
  r.success ? { _tag: 'right', value: r.value } : { _tag: 'left', error: r.message/*todo code, details*/ };

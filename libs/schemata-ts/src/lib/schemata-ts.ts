import { Pattern } from 'schemata-ts/schemata/Pattern';
import { Newtype } from 'schemata-ts/schemata/Newtype';
import { Refine } from 'schemata-ts/schemata/Refine';
import { Literal } from 'schemata-ts/schemata/Literal';
import { Array } from 'schemata-ts/schemata/Array';
import { Lazy } from 'schemata-ts/schemata/Lazy';
import { SetFromArray } from 'schemata-ts/schemata/SetFromArray';
import { Brand } from 'schemata-ts/schemata/Brand';
import { DateFromIsoString } from 'schemata-ts/schemata/DateFromIsoString';
import { Int } from 'schemata-ts/schemata/Int';
import { Union } from 'schemata-ts/schemata/Union';
import { Struct } from 'schemata-ts/schemata/Struct';
import { Readonly } from 'schemata-ts/schemata/Readonly';
import { EmailAddress } from 'schemata-ts/schemata/EmailAddress';
import { Intersect } from 'schemata-ts/schemata/Intersect';
import { HexColor } from 'schemata-ts/schemata/HexColor';
import { NonEmptyString } from 'schemata-ts/schemata/NonEmptyString';
import * as Nt from 'schemata-ts/newtype';
import type { OutputOf, Schema } from 'schemata-ts/Schema';
import * as k from 'kuvio';
import { pipe } from 'fp-ts/lib/function.js';
import { Ord } from 'fp-ts/lib/Ord.js';
import { Either, isRight } from 'fp-ts/lib/Either.js';
import { Ord as SOrd } from 'fp-ts/lib/string.js';
import { deriveTranscoder } from 'schemata-ts/Transcoder';
import { TranscodeErrors } from 'schemata-ts/TranscodeError';
import {
  COLOURS,
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  Result,
  SUBSCRIPTION_TYPES,
} from '@parsers-jamboree/common';

// by the pattern of schemata/UUID.ts
type StripeIdBrand = {
  readonly StripeId: unique symbol;
};

export type StripeId = Nt.Newtype<StripeIdBrand, string>;

const isoStripeId = Nt.iso<StripeId>();

const StripeIdSchema: Schema<string, StripeId> = pipe(
  Pattern(
    k.sequence(
      k.exactString('cus_'),
      k.atLeast('NffrFeUfNV2Hib'.length)(k.alnum)
    ),
    `Stripe Id of format cus_XXXXXXXXXXXXXX`
  ),
  Newtype(isoStripeId, `Stripe Id`)
);

const ColourSchema = Union(Literal(...COLOURS), HexColor);

export type Colour = OutputOf<typeof ColourSchema>;

const colourOrd: Ord<Colour> = SOrd;

// making it unique seemed too much bother;
// - Refine would operate on the output and doesn't see the input;
// - redefining SetFromArray is too far from user-friendly
// - functionality "and" doesn't seem to exist in the API (e.g. Int() AND NonNegativeFloat())
const FavouriteColoursNonUniqueSchema = SetFromArray(colourOrd)(ColourSchema);

const TemporalConcernOrderlessSchema = Struct({
  createdAt: DateFromIsoString(),
  updatedAt: DateFromIsoString(),
});

export type NonNegativeIntegerBrand = {
  readonly NonNegativeInteger: unique symbol;
};

// somehow, there's also NonNegativeFloat but no NonNegativeInteger
export const NonNegativeIntegerSchema = pipe(
  Int({ min: 0 }),
  Brand<NonNegativeIntegerBrand>()
);

type NonNegativeInteger = OutputOf<typeof NonNegativeIntegerSchema>;

const ProfileListenerSchema = Struct({
  type: Literal(PROFILE_TYPE_LISTENER),
  boughtTracks: NonNegativeIntegerSchema,
});

const ProfileArtistSchema = Struct({
  type: Literal(PROFILE_TYPE_ARTIST),
  publishedTracks: NonNegativeIntegerSchema,
});

const ProfileSchema = Union(ProfileListenerSchema, ProfileArtistSchema);

const DirectoryTypeLiteral = Literal('directory');
type FileSystem = (
  | {
      type: OutputOf<typeof DirectoryTypeLiteral>;
      children: readonly FileSystem[];
    }
  | {
      type: 'file';
    }
) & {
  name: NonEmptyString;
};

export const FileSystemSchema: Schema<FileSystem, FileSystem> = Intersect(
  Union(
    Struct({
      type: DirectoryTypeLiteral,
      children: pipe(
        Array(Lazy('FileSystem', () => FileSystemSchema)),
        Refine(
          (c): c is FileSystem[] =>
            c.length === new Set(c.map((f) => f.name)).size,
          'Uniq files/dirs'
        ),
        Readonly // workaround for twoslash syntax highlighter; not strictly necessary here
      ),
    }),
    Struct({
      type: Literal('file'),
    })
  ),
  Struct({
    name: NonEmptyString,
  })
);

export const UserTemporalOrderlessSchema = Struct({
  name: NonEmptyString,
  email: EmailAddress,
  subscription: Literal(...SUBSCRIPTION_TYPES),
  stripeId: StripeIdSchema,
  visits: NonNegativeIntegerSchema,
  favouriteColours: FavouriteColoursNonUniqueSchema,
  profile: ProfileSchema,
  fileSystem: FileSystemSchema,
}).intersect(TemporalConcernOrderlessSchema); // .strict() can be added to not allow unexpected fields

// same as user temporal ordered
export type User = OutputOf<typeof UserTemporalOrderlessSchema>;

export const UserSchema = pipe(
  UserTemporalOrderlessSchema,
  Refine(
    // refinements seem to be not very composable
    (c): c is User => c.createdAt <= c.updatedAt,
    'User'
  )
);

// struct methods / functions are no more after refinement
// export const NamelessUserSchema = UserSchema.omit('name');
// export type NamelessUser = OutputOf<typeof NamelessUserSchema>;

const userTranscoder = deriveTranscoder(UserSchema);

export const decodeUser = (user: unknown): Result<TranscodeErrors, User> =>
  mapResult(userTranscoder.decode(user));

export const encodeUser = (user: User): Result<TranscodeErrors, unknown> =>
  mapResult(userTranscoder.encode(user));

// helpers

const mapResult = <E, T>(e: Either<E, T>): Result<E, T> =>
  isRight(e)
    ? { _tag: 'right', value: e.right }
    : { _tag: 'left', error: e.left };

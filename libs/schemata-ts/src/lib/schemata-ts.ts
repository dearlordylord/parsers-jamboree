import * as S from 'schemata-ts/schemata/index';
import * as Nt from 'schemata-ts/newtype';
import type { InputOf, OutputOf, Schema } from 'schemata-ts/Schema';
import * as k from 'kuvio';
import { pipe } from 'fp-ts/function';
import { Ord } from 'fp-ts/lib/Ord';
import { Either, isRight } from 'fp-ts/lib/Either';
import { Ord as SOrd } from 'fp-ts/lib/string';
import { deriveTranscoder } from 'schemata-ts/Transcoder';
import { TranscodeErrors } from 'schemata-ts/TranscodeError';
import {
  COLOURS,
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

// by the pattern of schemata/UUID.ts
type StripeIdBrand = {
  readonly StripeId: unique symbol;
};

export type StripeId = Nt.Newtype<StripeIdBrand, string>;

const isoStripeId = Nt.iso<StripeId>();

const StripeIdSchema: Schema<string, StripeId> = pipe(
  S.Pattern(
    k.sequence(
      k.exactString('cus_'),
      k.atLeast('NffrFeUfNV2Hib'.length)(k.alnum)
    ),
    `Stripe Id of format cus_XXXXXXXXXXXXXX`
  ),
  S.Newtype(isoStripeId, `Stripe Id`)
);

const ColourSchema = S.Union(S.Literal(...COLOURS), S.HexColor);

export type Colour = OutputOf<typeof ColourSchema>;

const colourOrd: Ord<Colour> = SOrd;

// making it unique seemed too much bother;
// - Refine would operate on the output and doesn't see the input;
// - redefining SetFromArray is too far from user-friendly
// - functionality "and" doesn't seem to exist in the API (e.g. S.Int() AND S.NonNegativeFloat())
const FavouriteColoursNonUniqueSchema = S.SetFromArray(colourOrd)(ColourSchema);

const TemporalConcernOrderlessSchema = S.Struct({
  createdAt: S.DateFromIsoString(),
  updatedAt: S.DateFromIsoString(),
});

export type NonNegativeIntegerBrand = {
  readonly NonNegativeInteger: unique symbol;
};

// somehow, there's also NonNegativeFloat but no NonNegativeInteger
export const NonNegativeIntegerSchema = pipe(
  S.Int({ min: 0 }),
  S.Brand<NonNegativeIntegerBrand>()
);

type NonNegativeInteger = OutputOf<typeof NonNegativeIntegerSchema>;

const ProfileListenerSchema = S.Struct({
  type: S.Literal(PROFILE_TYPE_LISTENER),
  boughtTracks: NonNegativeIntegerSchema,
});

const ProfileArtistSchema = S.Struct({
  type: S.Literal(PROFILE_TYPE_ARTIST),
  publishedTracks: NonNegativeIntegerSchema,
});

const ProfileSchema = S.Union(ProfileListenerSchema, ProfileArtistSchema);

const DirectoryTypeLiteral = S.Literal('directory');
type FileSystem = (
  | {
      type: OutputOf<typeof DirectoryTypeLiteral>;
      children: readonly FileSystem[];
    }
  | {
      type: 'file';
    }
) & {
  name: S.NonEmptyString;
};

export const FileSystemSchema: Schema<FileSystem, FileSystem> = S.Intersect(
  S.Union(
    S.Struct({
      type: DirectoryTypeLiteral,
      children: pipe(
        S.Array(S.Lazy('FileSystem', () => FileSystemSchema)),
        S.Refine(
          (c): c is FileSystem[] =>
            c.length === new Set(c.map((f) => f.name)).size,
          'Uniq files/dirs'
        ),
        S.Readonly // workaround for twoslash syntax highlighter; not strictly necessary here
      ),
    }),
    S.Struct({
      type: S.Literal('file'),
    })
  ),
  S.Struct({
    name: S.NonEmptyString,
  })
);

export const UserTemporalOrderlessSchema = S.Struct({
  name: S.NonEmptyString,
  email: S.EmailAddress,
  subscription: S.Literal(...SUBSCRIPTION_TYPES),
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
  S.Refine(
    // refinements seem to be not very composable
    (c): c is User => c.createdAt <= c.updatedAt,
    'User'
  )
);

// struct methods / functions are no more after refinement
// export const NamelessUserSchema = UserSchema.omit('name');
// export type NamelessUser = OutputOf<typeof NamelessUserSchema>;

const userTranscoder = deriveTranscoder(UserSchema);

export const decodeUser = (user: unknown): Result<TranscodeErrors, User> => {
  const result = userTranscoder.decode(user);
  return mapResult(result);
};

export const encodeUser = (user: User): Result<TranscodeErrors, unknown> => {
  const result = userTranscoder.encode(user);
  return mapResult(result);
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: true,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: true,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `Derives RFC 5321 email with https://github.com/skeate/kuvio string combinators. In good faith, I assume it works, but also can be treated as N/A.`,
  },
};

// helpers, unrelated to the library
const mapResult = <E, T>(e: Either<E, T>): Result<E, T> =>
  isRight(e)
    ? { _tag: 'right', value: e.right }
    : { _tag: 'left', error: e.left };
const unwrapEither = <E, T>(e: Either<E, T>): T => {
  if (isRight(e)) {
    return e.right;
  } else {
    throw new Error(JSON.stringify(e.left));
  }
};

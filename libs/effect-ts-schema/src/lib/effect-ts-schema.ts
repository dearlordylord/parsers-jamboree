import { ParseResult, Schema, TreeFormatter } from '@effect/schema';
import * as Either from 'effect/Either';
import { COLOURS, ISO_DATE_REGEX, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { ParseError } from '@effect/schema/ParseResult';

const NonEmptyStringBrand = Symbol.for('NonEmptyString');

const NonEmptyString = Schema.NonEmpty.pipe(Schema.brand(NonEmptyStringBrand));
type NonEmptyString = Schema.Schema.Type<typeof NonEmptyString>;

const EmailBrand = Symbol.for('Email');

// no built-in email combinator by-design (lot of definitions out there)
const Email = NonEmptyString.pipe(
  Schema.pattern(
    /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
  )
).pipe(Schema.brand(EmailBrand));

const StripeIdBrand = Symbol.for('StripeId');

const StripeId = Schema.TemplateLiteral(
  Schema.Literal('cus_' /*can be dryed*/),
  Schema.String
)
  .pipe(Schema.pattern(/^cus_[a-zA-Z0-9]{14,}$/)) // extra check for the second part
  .pipe(Schema.brand(StripeIdBrand));

const ColourBrand = Symbol.for('Colour');

const Colour = Schema.Literal(...COLOURS).pipe(Schema.brand(ColourBrand));

const HexBrand = Symbol.for('Hex');

const Hex = Schema.String.pipe(Schema.pattern(/^#[a-fA-F0-9]{6}$/)).pipe(
  Schema.brand(HexBrand)
);

const ColourOrHex = Schema.Union(Colour, Hex);

const SubscriptionBrand = Symbol.for('Subscription');

const Subscription = Schema.Literal(...SUBSCRIPTION_TYPES).pipe(
  Schema.brand(SubscriptionBrand)
);

const NonNegativeIntegerBrand = Symbol.for('NonNegativeInteger');

const NonNegativeInteger = Schema.Int.pipe(
  Schema.nonNegative(),
  Schema.brand(NonNegativeIntegerBrand)
);

// this lib can figure out discriminator by itself
const Profile = Schema.Union(
  Schema.Struct({
    type: Schema.Literal('listener'),
    boughtTracks: NonNegativeInteger,
  }),
  Schema.Struct({
    type: Schema.Literal('artist'),
    publishedTracks: NonNegativeInteger,
  })
);

const FavouriteColours = Schema.transformOrFail(
  Schema.Array(ColourOrHex),
  Schema.SetFromSelf(Schema.typeSchema(ColourOrHex)),
  {
    strict: true,
    decode: (input, options, ast) => {
      const set = new Set(input);
      if (set.size !== input.length) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Items must be unique')
        );
      }
      return ParseResult.succeed(set);
    },
    encode: (input, options, ast) => {
      return ParseResult.succeed(Array.from(input));
    },
  }
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

const FileSystemDirectory = Schema.Struct({
  type: Schema.Literal('directory'),
  children: Schema.Array(
    Schema.suspend(
      (): Schema.Schema<FileSystem> => Schema.typeSchema(FileSystem)
    )
  ).pipe(
    Schema.filter((children) => {
      const names = new Set(children.map((c) => c.name));
      return children.length === names.size
        ? undefined
        : `Expected unique names, got ${JSON.stringify(names)}`;
    })
  ),
});

const FileSystemFile = Schema.Struct({
  type: Schema.Literal('file'),
});

const FileSystemFileOrDirectory = Schema.Union(
  FileSystemFile,
  FileSystemDirectory
);

const FileSystem = Schema.extend(
  Schema.Struct({
    name: NonEmptyString,
  }),
  FileSystemFileOrDirectory
);

// check dates with regex before feeding to browser's new Date(), for new Date() isn't uniform across.
const IsoDate = Schema.compose(Schema.String.pipe(Schema.pattern(ISO_DATE_REGEX)), Schema.DateFromString)

const UserUnentangled = Schema.Struct({
  name: NonEmptyString,
  email: Email,
  createdAt: IsoDate,
  updatedAt: IsoDate,
  subscription: Subscription,
  stripeId: StripeId,
  visits: NonNegativeInteger,
  favouriteColours: FavouriteColours,
  profile: Profile,
  fileSystem: FileSystem,
});

const UserEntangled = Schema.transformOrFail(
  UserUnentangled,
  Schema.typeSchema(UserUnentangled),
  {
    strict: true,
    decode: (u, options, ast) => {
      if (u.createdAt > u.updatedAt) {
        return ParseResult.fail(
          new ParseResult.Type(
            ast,
            u.createdAt,
            'createdAt must be less or equal than updatedAt'
          )
        );
      }
      return ParseResult.succeed(u);
    },
    encode: ParseResult.succeed,
  }
);

const User = UserEntangled;

type User = Schema.Schema.Type<typeof User>;

export const decodeUser = (u: unknown): Result<string, User> =>
  mapResult(Schema.decodeUnknownEither(User)(u));

export const encodeUser = (u: User): Result<string, unknown> => {
  return mapResult(Schema.encodeEither(User)(u));
};

// utils

const mapResult = <T>(r: Either.Either<T, ParseError>): Result<string, T> =>
  Either.isLeft(r)
    ? { _tag: 'left', error: TreeFormatter.formatErrorSync(r.left) }
    : { _tag: 'right', value: r.right };

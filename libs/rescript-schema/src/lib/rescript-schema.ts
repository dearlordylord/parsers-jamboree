import * as S from 'rescript-schema';
import {
  COLOURS,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

type TupleToLiteral<T extends readonly unknown[]> = T extends readonly [
  infer K,
  ...infer REST
]
  ? K extends string
    ? [S.Schema<K>, ...TupleToLiteral<REST>]
    : never
  : [];

// no brands
const subscriptionSchema = S.union(
  SUBSCRIPTION_TYPES.map(S.literal) as TupleToLiteral<typeof SUBSCRIPTION_TYPES>
);

const hexColourRegexString = `^#[a-fA-F0-9]{6}$`;
const hexColourSchema = S.refine(S.string, (value, s) => {
  if (!value.match(hexColourRegexString)) {
    // weird: throwing void??
    throw s.fail('Hex colour must be in the format #RRGGBB');
  }
});

const colourSchema = S.union([
  ...(COLOURS.map(S.literal) as TupleToLiteral<typeof COLOURS>),
  hexColourSchema,
]);

const timeConcernTimelessSchema = S.object({
  createdAt: S.datetime(S.string),
  updatedAt: S.datetime(S.string),
});

const timeConcernSchema = S.refine(timeConcernTimelessSchema, (value, s) => {
  if (value.createdAt > value.updatedAt) {
    throw s.fail('createdAt must be less or equal than updatedAt');
  }
});

const integerSchema = S.refine(S.number, (value, s) => {
  if (value % 1 !== 0) {
    throw s.fail('Must be an integer');
  }
});

const nonNegativeNumberSchema = S.refine(S.number, (value, s) => {
  if (value < 0) {
    throw s.fail('Must be a positive number');
  }
});

// no composability; have to repeat
const nonNegativeIntegerSchema = S.refine(integerSchema, (value, s) => {
  if (value < 0) {
    throw s.fail('Must be a positive number');
  }
});

const nonEmptyStringSchema = S.refine(S.string, (value, s) => {
  if (value.length === 0) {
    throw s.fail('Must be non-empty');
  }
});

const stripeIdRegexString = `^cus_[a-zA-Z0-9]{14,}$`;
const stripeIdSchema = S.refine(nonEmptyStringSchema, (value, s) => {
  if (!value.match(stripeIdRegexString)) {
    throw s.fail('Stripe id must be in the format cus_XXXXXXXXXXXXXX');
  }
});

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

const fileSystemSchema: S.Schema<FileSystem> = S.recursive((schema) =>
  S.union([
    S.object({
      type: S.literal('directory'),
      children: S.refine(S.array(schema), (value, s) => {
        const names = new Set(value.map((f) => f.name));
        if (names.size !== value.length) {
          throw s.fail('Expected unique names in the children');
        }
      }),
      // no composability; have to repeat
      name: nonEmptyStringSchema,
    }),
    S.object({
      type: S.literal('file'),
      // no composability; have to repeat
      name: nonEmptyStringSchema,
    }),
  ])
);

const uniqArraySchema = <T>(schema: S.Schema<T>) =>
  S.refine(S.array(schema), (value, s) => {
    const set = new Set(value);
    if (set.size !== value.length) {
      throw s.fail('Expected unique items');
    }
  });
const setSchema = <T>(schema: S.Schema<T>) =>
  S.transform(
    uniqArraySchema(schema),
    // TODO can the uniqueness be checked here?
    (a) => new Set(a),
    (a) => Array.from(a)
  );

const userSchema = S.merge(
  timeConcernSchema,
  S.object({
    name: nonEmptyStringSchema,
    email: S.email(nonEmptyStringSchema),
    subscription: subscriptionSchema,
    stripeId: stripeIdSchema,
    visits: nonNegativeIntegerSchema,
    favouriteColours: setSchema(colourSchema),
    profile: S.union([
      S.object({
        type: S.literal('listener'),
        boughtTracks: nonNegativeIntegerSchema,
      }),
      S.object({
        type: S.literal('artist'),
        publishedTracks: nonNegativeIntegerSchema,
      }),
    ]),
    fileSystem: fileSystemSchema,
  })
);

type User = S.Output<typeof userSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> =>
  mapResult(userSchema.parse(u));

export const encodeUser = (u: User): Result<unknown, unknown> =>
  mapResult(userSchema.serialize(u));

const mapResult = <T>(r: S.Result<T>): Result<string, T> => {
  if (r.success) {
    return { _tag: 'right', value: r.value };
  } else {
    return { _tag: 'left', error: r.error.message };
  }
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: false,
    acceptsTypedInput: false,
  },
  explanations: {},
};

export const EMPTY = Symbol.for('EMPTY');

export const head = <T>(a: readonly T[]) => (a.length === 0 ? EMPTY : a[0]);

export type HeadError<T> = Exclude<ReturnType<typeof head<T>>, T>;

export const TOO_MANY = Symbol.for('TOO_MANY');

export const headExclusive = <T>(a: readonly T[]) =>
  a.length > 1 ? TOO_MANY : head(a);

export type HeadExclusiveError<T> = Exclude<
  ReturnType<typeof headExclusive<T>>,
  T
>;
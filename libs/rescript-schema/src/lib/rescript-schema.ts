import * as S from "rescript-schema";
import { COLOURS, Result, SUBSCRIPTION_TYPES, TrustedCompileTimeMeta } from '@parsers-jamboree/common';

// no brands
const subscriptionSchema = S.literal(SUBSCRIPTION_TYPES);

const hexColourRegexString = `^#[a-fA-F0-9]{6}$`;
const hexColourSchema = S.refine(S.string, (value, s) => {
    if (!value.match(hexColourRegexString)) {
      // weird: throwing void??
      throw s.fail("Hex colour must be in the format #RRGGBB")
    }
});

const colourSchema = S.union([S.literal(COLOURS), hexColourSchema]);

const timeConcernTimelessSchema = S.object({
  createdAt: S.datetime(S.string),
  updatedAt: S.datetime(S.string),
});

const integerSchema = S.refine(S.number, (value, s) => {
  if (value % 1 !== 0) {
    throw s.fail("Must be an integer")
  }
});

const nonNegativeNumberSchema = S.refine(S.number, (value, s) => {
  if (value < 0) {
    throw s.fail("Must be a positive number")
  }
});

const nonNegativeIntegerSchema = S.union([nonNegativeNumberSchema, integerSchema]);

const stripeIdRegexString = `^cus_[a-zA-Z0-9]{14,}$`;
const stripeIdSchema = S.refine(S.string, (value, s) => {
  if (!value.match(stripeIdRegexString)) {
    throw s.fail("Stripe id must be in the format cus_XXXXXXXXXXXXXX")
  }
});

// .recursive is in docs but is missing from the lib api. https://github.com/DZakh/rescript-schema/issues/80
const fileSystemSchema = S.unknown

const uniqArraySchema = <T>(schema: S.Schema<T>) => S.refine(S.array(schema), (value, s) => {
  const set = new Set(value);
  if (set.size !== value.length) {
    throw s.fail("Expected unique items")
  }
});
const setSchema = <T>(schema: S.Schema<T>) => S.transform(
  uniqArraySchema(schema),
  // TODO can the uniqueness be checked here?
  a => new Set(a),
  a => Array.from(a)
)

const userSchema = S.merge(
  timeConcernTimelessSchema,
  S.object({
    name: S.string,
    email: S.email(S.string),
    subscription: subscriptionSchema,
    stripeId: stripeIdSchema,
    visits: nonNegativeIntegerSchema,
    favouriteColours: setSchema(colourSchema),
    profile: S.union([
      S.object({
        type: S.literal("listener"),
        boughtTracks: nonNegativeIntegerSchema,
      }),
      S.object({
        type: S.literal("artist"),
        publishedTracks: nonNegativeIntegerSchema,
      })

    ]),
    fileSystem: fileSystemSchema,
  })
);

type User = S.Output<typeof userSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> => mapResult(userSchema.parse(u));

export const encodeUser = (u: User): Result<unknown, unknown> => mapResult(userSchema.serialize(u));

const mapResult = <T>(r: S.Result<T>): Result<S.Error,T> => {
  if (r.success) {
    return { _tag: 'right', value: r.value };
  } else {
    return { _tag: 'left', error: r.error };
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
  explanations: {
  },
};

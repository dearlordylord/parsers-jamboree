import {
  email,
  string,
  pipe,
  object,
  minLength,
  brand,
  InferOutput,
  isoDateTime,
  literal,
  picklist,
  regex,
  integer,
  minValue,
  number,
  union,
  variant,
  custom,
  safeParse,
  SafeParseResult,
  flatten,
  array,
  check,
  transform, BaseIssue, isoTimestamp
} from 'valibot';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { BaseSchema } from 'valibot/dist';

const NonEmptyStringSchema = pipe(string(), minLength(1), brand('NonEmptyString'));

// email format specifics: https://github.com/fabian-hiller/valibot/issues/204
const EmailSchema = pipe(NonEmptyStringSchema, email(), brand('Email'));

const UserNameSchema = pipe(NonEmptyStringSchema, brand('UserName'));

const DatetimeSchema = pipe(string(), isoTimestamp());

const SubscriptionSchema = picklist(SUBSCRIPTION_TYPES);

const StripeCustomerIdSchema = pipe(string(), regex(/cus_[a-zA-Z0-9]{14,}/), brand('StripeId'));
// we can do custom<`cus_${string}`>((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)) to narrow the literal type further to cus_${string}
// but custom() function API is lacking: I have to repeat regex + output type and do string check again manually
const StripeCustomerIdSchemaOption2 = pipe(string(), custom<`cus_${string}`>((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)), brand('StripeId'));
const customerId2: InferOutput<typeof StripeCustomerIdSchemaOption2> = 'cus_NffrFeUfNV2Hib' as InferOutput<typeof StripeCustomerIdSchemaOption2> satisfies `cus_${string}`;

const NonNegativeIntegerSchema = pipe(number(), integer(), minValue(0), brand('NonNegativeInteger'));

const VisitsSchema = pipe(NonNegativeIntegerSchema, brand('Visits'));

const HexColourSchema = pipe(string(), regex(/^#[a-fA-F0-9]{6}$/), brand('HexColour'));

const ColourSchema = pipe(picklist(COLOURS), brand('Colour'));

// default set doesn't work as I would expect https://github.com/fabian-hiller/valibot/issues/685
const set = <S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: S) => pipe(
  array(schema),
  check((v) => new Set(v).size === v.length, 'Expected unique items'),
  transform((v) => new Set(v))
);

const FavouriteColoursSchema = set(union([HexColourSchema, ColourSchema]));

// we have to pass a discriminator explicitly; the lib cannot figure it out
const ProfileSchema = variant('type', [
  object({
    type: literal('listener'),
    boughtTracks: NonNegativeIntegerSchema
  }),
  object({
    type: literal('artist'),
    publishedTracks: NonNegativeIntegerSchema
  })
])

const UserSchema = object({
  name: UserNameSchema,
  email: EmailSchema,
  createdAt: DatetimeSchema,
  updatedAt: DatetimeSchema,
  subscription: SubscriptionSchema,
  stripeId: StripeCustomerIdSchema,
  visits: VisitsSchema,
  favouriteColours: FavouriteColoursSchema,
  profile: ProfileSchema
  // we can check dependent fields with custom() but I don't like the API in its current state
});

type User = InferOutput<typeof UserSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> => {
  const result = safeParse(UserSchema, u);
  return mapResult(result);
};

export const encodeUser = (u: User): Result<unknown, unknown> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

// utils

const mapResult = (r: SafeParseResult<typeof UserSchema>): Result<string, User> => {
  if (r.success) {
    return { _tag: 'right', value: r.output };
  } else {
    return { _tag: 'left', error: JSON.stringify(flatten(r.issues), null, 2) };
  }
};

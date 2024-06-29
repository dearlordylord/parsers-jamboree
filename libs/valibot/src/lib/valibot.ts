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
  transform, BaseIssue
} from 'valibot';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { BaseSchema } from 'valibot/dist';



// const igor = {
//   name: "igor",
//   email: "igor@loskutoff.com",
//   createdAt: "1990-01-01T00:00:00.000Z",
//   updatedAt: "2000-01-01T00:00:00.000Z",
//   subscription: 0,
//   stripeId: "cus_NffrFeUfNV2Hib",
//   visits: 10,
//   favouriteColours: ["red", "green", "blue", "#ac0200"].sort(),
// };

const NonEmptyStringSchema = pipe(string(), minLength(1), brand('NonEmptyString'));

// email format specifics: https://github.com/fabian-hiller/valibot/issues/204
const EmailSchema = pipe(NonEmptyStringSchema, email(), brand('Email'));

const UserNameSchema = pipe(NonEmptyStringSchema, brand('UserName'));

// isoDateTime doesn't parse iso date time at the moment but use a proprietary format https://github.com/fabian-hiller/valibot/issues/686
// const DatetimeSchema = pipe(string(), isoDateTime());

// https://stackoverflow.com/a/14322189/2123547
const DATETIME_REGEX = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
const DatetimeSchema = pipe(string(), check(v => DATETIME_REGEX.test(v), `Expected a datetime string in the format YYYY-MM-DDTHH:MM:SS.sssZ`), transform(v => new Date(v)), brand('Datetime'));

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

import { Schema, TreeFormatter } from '@effect/schema';
import * as Either from 'effect/Either'
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { ParseError } from '@effect/schema/ParseResult';

const NonEmptyStringBrand = Symbol.for("NonEmptyString");

const NonEmptyString = Schema.String
  .pipe(Schema.filter(s => s.length > 0))
  .pipe(Schema.brand(NonEmptyStringBrand))

const EmailBrand = Symbol.for("Email");

// no built-in email combinator by-design (lot of definitions out there)
const Email = NonEmptyString.pipe(Schema.pattern(
  /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
)).pipe(Schema.brand(EmailBrand));

const StripeIdBrand = Symbol.for("StripeId");

const StripeId = Schema.String.pipe(Schema.pattern(/^cus_[a-zA-Z0-9]{14,}$/)).pipe(Schema.brand(StripeIdBrand));

const ColourBrand = Symbol.for("Colour");

const Colour = Schema.Literal(...COLOURS).pipe(Schema.brand(ColourBrand));

const HexBrand = Symbol.for("Hex");

const Hex = Schema.String.pipe(Schema.pattern(/^#[a-fA-F0-9]{6}$/)).pipe(Schema.brand(HexBrand));

const ColourOrHex = Schema.Union(Colour, Hex);

const SubscriptionBrand = Symbol.for("Subscription");

const Subscription = Schema.Literal(...SUBSCRIPTION_TYPES).pipe(Schema.brand(SubscriptionBrand));

const User = Schema.Struct({
  // name: Schema.NonEmpty, exists but it doesn't brand the string and also what's up with its name?...
  name: NonEmptyString,
  email: Email,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  subscription: Subscription,
  stripeId: StripeId,
  visits: Schema.Union(Schema.Positive, Schema.Int),
  favouriteColours: Schema.Set(ColourOrHex),
});

type User = Schema.Schema.Type<typeof User>;

export const decodeUser = (u: unknown): Result<string, User> => {
  const result = Schema.decodeUnknownEither(User)(u);
  return mapResult(result);
};

export const encodeUser = (u: User): Result<string, unknown> => {
  return mapResult(Schema.encodeEither(User)(u));
};

// utils

const mapResult = <T>(r: Either.Either<T, ParseError>): Result<string, T> =>
  Either.isLeft(r) ? { _tag: 'left', error: TreeFormatter.formatErrorSync(r.left) } : { _tag: 'right', value: r.right };

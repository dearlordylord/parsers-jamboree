"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = void 0;
const schema_1 = require("@effect/schema");
const Either = require("effect/Either");
const common_1 = require("@parsers-jamboree/common");
const NonEmptyStringBrand = Symbol.for('NonEmptyString');
const NonEmptyString = schema_1.Schema.String.pipe(schema_1.Schema.filter((s) => s.length > 0)).pipe(schema_1.Schema.brand(NonEmptyStringBrand));
const EmailBrand = Symbol.for('Email');
// no built-in email combinator by-design (lot of definitions out there)
const Email = NonEmptyString.pipe(schema_1.Schema.pattern(/^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i)).pipe(schema_1.Schema.brand(EmailBrand));
const StripeIdBrand = Symbol.for('StripeId');
const StripeId = schema_1.Schema.String.pipe(schema_1.Schema.pattern(/^cus_[a-zA-Z0-9]{14,}$/)).pipe(schema_1.Schema.brand(StripeIdBrand));
const ColourBrand = Symbol.for('Colour');
const Colour = schema_1.Schema.Literal(...common_1.COLOURS).pipe(schema_1.Schema.brand(ColourBrand));
const HexBrand = Symbol.for('Hex');
const Hex = schema_1.Schema.String.pipe(schema_1.Schema.pattern(/^#[a-fA-F0-9]{6}$/)).pipe(schema_1.Schema.brand(HexBrand));
const ColourOrHex = schema_1.Schema.Union(Colour, Hex);
const SubscriptionBrand = Symbol.for('Subscription');
const Subscription = schema_1.Schema.Literal(...common_1.SUBSCRIPTION_TYPES).pipe(schema_1.Schema.brand(SubscriptionBrand));
const NonNegativeIntegerBrand = Symbol.for('NonNegativeInteger');
const NonNegativeInteger = schema_1.Schema.Union(schema_1.Schema.NonNegative, schema_1.Schema.Int).pipe(schema_1.Schema.brand(NonNegativeIntegerBrand));
// this lib can figure out discriminator by itself
// TODO add this union elswhere
const Profile = schema_1.Schema.Union(schema_1.Schema.Struct({
    type: schema_1.Schema.Literal('listener'),
    boughtTracks: NonNegativeInteger,
}), schema_1.Schema.Struct({
    type: schema_1.Schema.Literal('artist'),
    publishedTracks: NonNegativeInteger,
}));
const User = schema_1.Schema.Struct({
    // name: Schema.NonEmpty, exists but it doesn't brand the string and also what's up with its name?...
    name: NonEmptyString,
    email: Email,
    createdAt: schema_1.Schema.Date,
    updatedAt: schema_1.Schema.Date,
    subscription: Subscription,
    stripeId: StripeId,
    visits: NonNegativeInteger,
    favouriteColours: schema_1.Schema.Set(ColourOrHex),
    profile: Profile,
});
const decodeUser = (u) => {
    const result = schema_1.Schema.decodeUnknownEither(User)(u);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => {
    return mapResult(schema_1.Schema.encodeEither(User)(u));
};
exports.encodeUser = encodeUser;
// utils
const mapResult = (r) => Either.isLeft(r)
    ? { _tag: 'left', error: schema_1.TreeFormatter.formatErrorSync(r.left) }
    : { _tag: 'right', value: r.right };
//# sourceMappingURL=effect-ts-schema.js.map
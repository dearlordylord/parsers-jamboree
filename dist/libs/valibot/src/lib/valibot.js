"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = void 0;
const valibot_1 = require("valibot");
const common_1 = require("@parsers-jamboree/common");
const NonEmptyStringSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.minLength)(1), (0, valibot_1.brand)('NonEmptyString'));
// email format specifics: https://github.com/fabian-hiller/valibot/issues/204
const EmailSchema = (0, valibot_1.pipe)(NonEmptyStringSchema, (0, valibot_1.email)(), (0, valibot_1.brand)('Email'));
const UserNameSchema = (0, valibot_1.pipe)(NonEmptyStringSchema, (0, valibot_1.brand)('UserName'));
const DatetimeSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.isoTimestamp)());
const SubscriptionSchema = (0, valibot_1.picklist)(common_1.SUBSCRIPTION_TYPES);
const StripeCustomerIdSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.regex)(/cus_[a-zA-Z0-9]{14,}/), (0, valibot_1.brand)('StripeId'));
// we can do custom<`cus_${string}`>((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)) to narrow the literal type further to cus_${string}
// but custom() function API is lacking: I have to repeat regex + output type and do string check again manually
const StripeCustomerIdSchemaOption2 = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.custom)((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)), (0, valibot_1.brand)('StripeId'));
const customerId2 = 'cus_NffrFeUfNV2Hib';
const NonNegativeIntegerSchema = (0, valibot_1.pipe)((0, valibot_1.number)(), (0, valibot_1.integer)(), (0, valibot_1.minValue)(0), (0, valibot_1.brand)('NonNegativeInteger'));
const VisitsSchema = (0, valibot_1.pipe)(NonNegativeIntegerSchema, (0, valibot_1.brand)('Visits'));
const HexColourSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.regex)(/^#[a-fA-F0-9]{6}$/), (0, valibot_1.brand)('HexColour'));
const ColourSchema = (0, valibot_1.pipe)((0, valibot_1.picklist)(common_1.COLOURS), (0, valibot_1.brand)('Colour'));
// default set doesn't work as I would expect https://github.com/fabian-hiller/valibot/issues/685
const set = (schema) => (0, valibot_1.pipe)((0, valibot_1.array)(schema), (0, valibot_1.check)((v) => new Set(v).size === v.length, 'Expected unique items'), (0, valibot_1.transform)((v) => new Set(v)));
const FavouriteColoursSchema = set((0, valibot_1.union)([HexColourSchema, ColourSchema]));
// we have to pass a discriminator explicitly; the lib cannot figure it out
const ProfileSchema = (0, valibot_1.variant)('type', [
    (0, valibot_1.object)({
        type: (0, valibot_1.literal)('listener'),
        boughtTracks: NonNegativeIntegerSchema,
    }),
    (0, valibot_1.object)({
        type: (0, valibot_1.literal)('artist'),
        publishedTracks: NonNegativeIntegerSchema,
    }),
]);
const UserSchema = (0, valibot_1.object)({
    name: UserNameSchema,
    email: EmailSchema,
    createdAt: DatetimeSchema,
    updatedAt: DatetimeSchema,
    subscription: SubscriptionSchema,
    stripeId: StripeCustomerIdSchema,
    visits: VisitsSchema,
    favouriteColours: FavouriteColoursSchema,
    profile: ProfileSchema,
    // we can check dependent fields with custom() but I don't like the API in its current state
});
const decodeUser = (u) => {
    const result = (0, valibot_1.safeParse)(UserSchema, u);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => {
    return { _tag: 'left', error: 'the lib cannot do it' };
};
exports.encodeUser = encodeUser;
// utils
const mapResult = (r) => {
    if (r.success) {
        return { _tag: 'right', value: r.output };
    }
    else {
        return { _tag: 'left', error: JSON.stringify((0, valibot_1.flatten)(r.issues), null, 2) };
    }
};
//# sourceMappingURL=valibot.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.encodeUser = exports.decodeUser = void 0;
const valibot_1 = require("valibot");
const common_1 = require("@parsers-jamboree/common");
const NonEmptyStringSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.minLength)(1), (0, valibot_1.brand)('NonEmptyString'));
// email format specifics: https://github.com/fabian-hiller/valibot/issues/204
const EmailSchema = (0, valibot_1.pipe)(NonEmptyStringSchema, (0, valibot_1.email)(), (0, valibot_1.brand)('Email'));
const UserNameSchema = (0, valibot_1.pipe)(NonEmptyStringSchema, (0, valibot_1.brand)('UserName'));
const DatetimeSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.isoTimestamp)());
const SubscriptionSchema = (0, valibot_1.picklist)(common_1.SUBSCRIPTION_TYPES);
const StripeCustomerIdSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.regex)(/^cus_[a-zA-Z0-9]{14,}$/), (0, valibot_1.brand)('StripeId'));
// we can do custom<`cus_${string}`>((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)) to narrow the literal type further to cus_${string}
// but custom() function API is lacking: I have to repeat regex + output type and do string check again manually
const StripeCustomerIdSchemaOption2 = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.custom)((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)), (0, valibot_1.brand)('StripeId'));
// can't also find `special` referenced here https://github.com/fabian-hiller/valibot/issues/291
// type StripeCustomerLiteral = `cus_${string}`;
// const StripeCustomerIdSchemaOption3 = special<Key>((key:string) => {
//   const parts = key.split("-");
//   const num = parts.unshift();
//   if (Number.isNaN(Number(num))) return false;
//   const str = parts.join('-');
//   if (typeof str !== "string") return false;
//   return true;
// });
const NonNegativeIntegerSchema = (0, valibot_1.pipe)((0, valibot_1.number)(), (0, valibot_1.integer)(), (0, valibot_1.minValue)(0), (0, valibot_1.brand)('NonNegativeInteger'));
const VisitsSchema = (0, valibot_1.pipe)(NonNegativeIntegerSchema, (0, valibot_1.brand)('Visits'));
const HexColourSchema = (0, valibot_1.pipe)((0, valibot_1.string)(), (0, valibot_1.regex)(/^#[a-fA-F0-9]{6}$/), (0, valibot_1.brand)('HexColour'));
const ColourSchema = (0, valibot_1.pipe)((0, valibot_1.picklist)(common_1.COLOURS), (0, valibot_1.brand)('Colour'));
const uniqArray = (schema) => (0, valibot_1.pipe)((0, valibot_1.array)(schema), (0, valibot_1.check)((v) => new Set(v).size === v.length, 'Expected unique items'));
// default set doesn't work as I would expect https://github.com/fabian-hiller/valibot/issues/685
const set = (schema) => (0, valibot_1.pipe)(uniqArray(schema), (0, valibot_1.transform)((v) => new Set(v)));
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
const TemporalConcernUnsortedSchema = (0, valibot_1.object)({
    createdAt: DatetimeSchema,
    updatedAt: DatetimeSchema,
});
const TemporalConcernSchema = (0, valibot_1.pipe)(TemporalConcernUnsortedSchema, (0, valibot_1.forward)((0, valibot_1.partialCheck)([['createdAt'], ['updatedAt']], (input) => input.createdAt <= input.updatedAt, 'createdAt must be less or equal than updatedAt'), ['updatedAt']));
const FileSystemCommonSchema = (0, valibot_1.object)({
    name: NonEmptyStringSchema,
});
const FileSystemDirectorySchema = (0, valibot_1.intersect)([
    FileSystemCommonSchema,
    (0, valibot_1.pipe)((0, valibot_1.object)({
        type: (0, valibot_1.literal)('directory'),
        children: (0, valibot_1.array)((0, valibot_1.lazy)(() => FileSystemSchema)),
    }), (0, valibot_1.check)((v) => new Set(v.children.map((c) => c.name)).size === v.children.length, 'Expected unique names in the children')),
]);
const FileSystemFileSchema = (0, valibot_1.intersect)([
    FileSystemCommonSchema,
    (0, valibot_1.object)({
        type: (0, valibot_1.literal)('file'),
    }),
]);
const FileSystemSchema = (0, valibot_1.union)([
    FileSystemDirectorySchema,
    FileSystemFileSchema,
]);
const UserSchema = (0, valibot_1.intersect)([
    (0, valibot_1.object)({
        name: UserNameSchema,
        email: EmailSchema,
        subscription: SubscriptionSchema,
        stripeId: StripeCustomerIdSchema,
        visits: VisitsSchema,
        favouriteColours: FavouriteColoursSchema,
        profile: ProfileSchema,
        fileSystem: FileSystemSchema,
        // we can check dependent fields with custom() but I don't like the API in its current state
    }),
    TemporalConcernSchema,
]);
const decodeUser = (u) => {
    const result = (0, valibot_1.safeParse)(UserSchema, u);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
const encodeUser = (_u) => {
    return { _tag: 'left', error: 'the lib cannot do it' };
};
exports.encodeUser = encodeUser;
exports.meta = {
    items: {
        branded: true,
        typedErrors: true,
        templateLiterals: false,
        emailFormatAmbiguityIsAccountedFor: true,
    },
    explanations: {
        templateLiterals: 'Not natively supported + I didn\'t manage to hack them into working without casting, see code comments.',
        emailFormatAmbiguityIsAccountedFor: `A disclaimer is present in the doce https://valibot.dev/api/email/`,
    }
};
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
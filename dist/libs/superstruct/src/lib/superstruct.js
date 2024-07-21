"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = exports.meta = void 0;
const superstruct_1 = require("superstruct");
const common_1 = require("@parsers-jamboree/common");
const EMAIL_REGEX = new RegExp(common_1.EMAIL_REGEX_S);
const ISO_DATE_REGEXP = new RegExp(common_1.ISO_DATE_REGEX_S);
const isEmail = (value) => EMAIL_REGEX.test(value);
// TODO fix their example https://github.com/ianstormtaylor/superstruct/blob/main/examples/custom-types.js - `code` not in Result
const Email = (0, superstruct_1.define)('Email', (value) => {
    // todo how to compose?
    if (typeof value !== 'string') {
        return 'not_string';
    }
    if (!isEmail(value)) {
        return 'not_email';
    }
    else if (value.length >= 256) {
        return 'too_long';
    }
    else {
        return true;
    }
});
const IsoDateString = (0, superstruct_1.refine)((0, superstruct_1.string)(), 'IsoDateString', (s) => ISO_DATE_REGEXP.test(s));
const IsoDate = (0, superstruct_1.coerce)((0, superstruct_1.date)(), IsoDateString, (value) => new Date(value));
// can go with `define` and branding but since the lib doesn't support out of the box let's skip it
const NonNegative = (0, superstruct_1.refine)((0, superstruct_1.number)(), 'NonNegative', (n) => n >= 0);
// can be "min(integer(), 0)" but I went this way to show intersections
const NonNegativeInteger = (0, superstruct_1.intersection)([NonNegative, (0, superstruct_1.integer)()]);
// discriminated unions not exactly supported https://github.com/ianstormtaylor/superstruct/issues/1183
const ProfileListener = (0, superstruct_1.object)({
    type: (0, superstruct_1.literal)(common_1.PROFILE_TYPE_LISTENER),
    boughtTracks: NonNegativeInteger,
});
const ProfileArtist = (0, superstruct_1.object)({
    type: (0, superstruct_1.literal)(common_1.PROFILE_TYPE_ARTIST),
    publishedTracks: NonNegativeInteger,
});
const Colour = (0, superstruct_1.enums)(common_1.COLOURS);
const HexColour = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^#[a-fA-F0-9]{6}$/);
const ColourOrHex = (0, superstruct_1.union)([Colour, HexColour]);
const StripeCustomerId = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^cus_[a-zA-Z0-9]{14,}$/);
const SubscriptionType = (0, superstruct_1.enums)(common_1.SUBSCRIPTION_TYPES);
// loses the refinement after assign() https://github.com/ianstormtaylor/superstruct/issues/1188
const IsoDateStringRange = (0, superstruct_1.refine)((0, superstruct_1.object)({
    createdAt: IsoDateString,
    updatedAt: IsoDateString,
}), 'DateRange', (value) => {
    if (value.createdAt > value.updatedAt) {
        return (`Expected 'createdAt' to be less or equal than 'updatedAt' on type 'IsoDateStringRange', ` +
            `but received ${JSON.stringify(value)}`);
    }
    return true;
});
const uniqArray = (s) => (0, superstruct_1.refine)((0, superstruct_1.array)(s), 'UniqArray', (v) => {
    if (new Set(v).size !== v.length) {
        return `Expected unique items on type 'UniqArray', but received ${JSON.stringify(v)}`;
    }
    return true;
});
const arrayToSet = (s) => (0, superstruct_1.coerce)((0, superstruct_1.array)(s), (0, superstruct_1.set)(s), (v) => new Set(v));
const FavouriteColours = arrayToSet(ColourOrHex);
const NonEmptyString = (0, superstruct_1.refine)((0, superstruct_1.string)(), 'NonEmptyString', (s) => {
    if (s.length === 0) {
        return `Expected non-empty string on type 'NonEmptyString', but received ${JSON.stringify(s)}`;
    }
    return true;
});
const FileSystem = (0, superstruct_1.any)(); // TODO
const User = (0, superstruct_1.assign)((0, superstruct_1.object)({
    name: NonEmptyString,
    email: Email,
    subscription: SubscriptionType,
    stripeId: StripeCustomerId,
    visits: NonNegativeInteger,
    favouriteColours: FavouriteColours,
    profile: (0, superstruct_1.union)([ProfileListener, ProfileArtist]),
    fileSystem: FileSystem,
}), IsoDateStringRange);
exports.meta = {
    items: {
        branded: false,
        typedErrors: false,
        templateLiterals: false,
        emailFormatAmbiguityIsAccountedFor: true,
    },
    explanations: {
        typedErrors: 'Need for instanceOf runtime check, not good enough',
        emailFormatAmbiguityIsAccountedFor: 'The user of the library is prompted to create their own custom email validator.'
    }
};
const decodeUser = (u) => {
    try {
        const c = User.create(u);
        return { _tag: 'right', value: c };
    }
    catch (e) {
        if (e instanceof superstruct_1.StructError) {
            return {
                _tag: 'left',
                error: JSON.stringify({
                    failures: e.failures(),
                    message: e.message,
                }, null, 2),
            };
        }
        else {
            return { _tag: 'left', error: 'error interpreting the error!' };
        }
    }
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => {
    return { _tag: 'left', error: 'the lib cannot do it' };
};
exports.encodeUser = encodeUser;
//# sourceMappingURL=superstruct.js.map
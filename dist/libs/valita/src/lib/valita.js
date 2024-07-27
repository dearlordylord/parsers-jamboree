"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.encodeUser = exports.decodeUser = void 0;
const tslib_1 = require("tslib");
const v = tslib_1.__importStar(require("@badrap/valita"));
const common_1 = require("@parsers-jamboree/common");
const colour = v.union(...common_1.COLOURS.map(v.literal));
const hexColour = v.string().assert(s => !!s.match(/^#[a-fA-F0-9]{6}$/), 'doesn\'t look like a hex colour');
// bad composability
const fileSystemCommonDefinitionProperties = {
    name: v.string()
};
const fileSystem = v.lazy(() => v.union(v.object(Object.assign({ type: v.literal('directory'), children: v.array(fileSystem).assert(a => new Set(a.map(f => f.name)).size === a.length, 'expected unique names in the children') }, fileSystemCommonDefinitionProperties)), v.object(Object.assign({ type: v.literal('file') }, fileSystemCommonDefinitionProperties))));
const subscription = v.union(...common_1.SUBSCRIPTION_TYPES.map(v.literal));
const EMAIL_REGEX = /^[^@]+@[^@]+$/;
const ISO_DATE_REGEX = new RegExp(common_1.ISO_DATE_REGEX_S);
const isoDate = v.string().assert(s => ISO_DATE_REGEX.test(s), `expected iso date of format ${common_1.ISO_DATE_REGEX_S}`).map(s => new Date(s));
const nonNegativeInteger = v.number().assert(n => n >= 0, 'must be a positive number').assert(n => n % 1 === 0, 'must be an integer');
const user = v.object({
    name: v.string().assert(s => s.length > 0, 'name must be non-empty'),
    email: v.string().assert(s => EMAIL_REGEX.test(s), 'doesn\'t look like an email'),
    createdAt: isoDate,
    updatedAt: isoDate,
    subscription,
    stripeId: v.string().assert(s => !!s.match(/^cus_[a-zA-Z0-9]{14,}$/), 'doesn\'t look like a stripe id'),
    visits: nonNegativeInteger,
    favouriteColours: v.array(v.union(colour, hexColour)).assert(a => new Set(a).size === a.length, 'favourite colours must be unique').map(a => new Set(a)),
    profile: v.union(v.object({
        type: v.literal('listener'),
        boughtTracks: nonNegativeInteger,
    }), v.object({
        type: v.literal('artist'),
        publishedTracks: nonNegativeInteger,
    })),
    fileSystem,
}).assert(u => u.createdAt <= u.updatedAt, 'createdAt must be less or equal than updatedAt');
const decodeUser = (u) => {
    try {
        return { _tag: 'right', value: user.parse(u) };
    }
    catch (e) {
        return {
            _tag: 'left',
            error: e.message,
        };
    }
};
exports.decodeUser = decodeUser;
const encodeUser = (_u) => {
    return { _tag: 'left', error: 'the lib cannot do it' };
};
exports.encodeUser = encodeUser;
exports.meta = {
    items: {
        branded: false,
        typedErrors: false,
        templateLiterals: false,
        emailFormatAmbiguityIsAccountedFor: true,
        acceptsTypedInput: false,
    },
    explanations: {
        emailFormatAmbiguityIsAccountedFor: `Default method is not present, no mention in docs.`,
    },
};
//# sourceMappingURL=valita.js.map
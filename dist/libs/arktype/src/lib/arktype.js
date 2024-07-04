"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = void 0;
const arktype_1 = require("arktype");
const common_1 = require("@parsers-jamboree/common");
const SUBSCRIPTION_TYPES_LITERAL = common_1.SUBSCRIPTION_TYPES.map((t) => `'${t}'`).join('|');
const COLOURS_LITERAL = common_1.COLOURS.map((t) => `'${t}'`).join('|');
const hexColorRegexString = `^#[a-fA-F0-9]{6}$`;
const COLOURS_WITH_CODES_LITERAL = `(${COLOURS_LITERAL})|/${hexColorRegexString}/`;
const userJson = (0, arktype_1.type)({
    // TODO how to do compatibility? e.g. convert io-ts into name
    // TODO add user id to all the libs
    name: '0<string<255',
    email: 'email',
    // https://github.com/arktypeio/arktype/issues/909 morphs aren't really here yet
    createdAt: 'string',
    updatedAt: 'string',
    subscription: SUBSCRIPTION_TYPES_LITERAL,
    stripeId: /cus_[a-zA-Z0-9]{14,}/,
    visits: 'integer>0',
    // https://github.com/arktypeio/arktype/issues/909 morphs aren't really here yet
    favouriteColours: `(${COLOURS_WITH_CODES_LITERAL})[]`,
});
const decodeUser = (u) => {
    const result = userJson(u);
    return (0, common_1.chain)((u) => {
        const favouriteColours = new Set(u.favouriteColours);
        if (favouriteColours.size !== u.favouriteColours.length) {
            return { _tag: 'left', error: 'favourite colours must be unique' };
        }
        const createdAt = new Date(u.createdAt);
        if (isNaN(createdAt.getTime())) {
            return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
        }
        const updatedAt = new Date(u.updatedAt);
        if (isNaN(updatedAt.getTime())) {
            return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
        }
        return {
            _tag: 'right',
            value: Object.assign(Object.assign({}, u), { favouriteColours,
                createdAt,
                updatedAt }),
        };
    })(mapResult(result));
};
exports.decodeUser = decodeUser;
const encodeUser = (_u) => {
    return { _tag: 'left', error: 'the lib cannot do it' };
};
exports.encodeUser = encodeUser;
// utils
const mapResult = (r) => r instanceof arktype_1.ArkErrors
    ? { _tag: 'left', error: JSON.stringify(r) }
    : { _tag: 'right', value: r };
//# sourceMappingURL=arktype.js.map
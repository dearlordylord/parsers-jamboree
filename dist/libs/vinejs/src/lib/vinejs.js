"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUserForcedAsync = exports.IsoDate = void 0;
const tslib_1 = require("tslib");
const vine_1 = require("@vinejs/vine");
const common_1 = require("@parsers-jamboree/common");
// loses on "represent a union of literals or a string literal" check
// const coloursSchema = vine.enum(COLOURS);
// const hexColourSchema = vine.string().regex(/^#[a-fA-F0-9]{6}$/);
// doesn't work, throws in runtime (and it makes no sense to me)
// const colourOrHexSchema = vine.unionOfTypes([coloursSchema, hexColourSchema]);
// doesn't work for me either, typing makes no sense as well
// const colourOrHexSchema = vine.union([
//   vine.union.if(
//     v => v, // v given is record; coloursSchema represents a string ...
//     coloursSchema,
//   ),
//   // ...
// ])
// as per https://vinejs.dev/docs/types/union#selecting-a-fiscal-host
// it's "What" because it's not a schema yet; feeding it into vine will work compile time but will throw runtime "TypeError: refs.trackConditional is not a function"
const profileWhat = vine_1.default.group([
    vine_1.default.group.if((data) => data['type'] === common_1.PROFILE_TYPE_LISTENER, {
        type: vine_1.default.literal(common_1.PROFILE_TYPE_LISTENER),
        boughtTracks: vine_1.default.number().min(0),
    }),
    vine_1.default.group.if((data) => data['type'] === common_1.PROFILE_TYPE_ARTIST, {
        type: vine_1.default.literal(common_1.PROFILE_TYPE_ARTIST),
        publishedTracks: vine_1.default.number().min(0),
    }),
]);
const profileSchema = vine_1.default.object({
    // in total, we repeat the poor enum 3 times
    type: vine_1.default.enum(common_1.PROFILE_TYPES),
}).merge(profileWhat);
// https://vinejs.dev/docs/extend/custom_schema_types
const isIsoDate = vine_1.default.createRule((value, _, field) => {
    if (typeof value !== 'string') {
        field.report('The {{ field }} field value must be a string', 'isoDate', field);
        return;
    }
    if (!value.match(common_1.ISO_DATE_REGEX_S)) {
        field.report('The {{ field }} field value must be a valid ISO date', 'isoDate', field);
        return;
    }
    const date = new Date(value);
    // interesting api
    field.mutate(date, field);
});
class IsoDate extends vine_1.BaseLiteralType {
    constructor(options, validations) {
        super(options, validations || [isIsoDate()]);
    }
    clone() {
        return new IsoDate(this.cloneOptions(), this.cloneValidations());
    }
}
exports.IsoDate = IsoDate;
const userSchema = vine_1.default.object({
    name: vine_1.default.string().minLength(1).maxLength(255),
    email: vine_1.default.string().email(),
    // this lib's date() has special proprietary format: 1990-01-01 00:00:00
    // createdAt: vine.date(),
    // updatedAt: vine.date(),
    createdAt: new IsoDate(),
    updatedAt: new IsoDate(),
    subscription: vine_1.default.enum(common_1.SUBSCRIPTION_TYPES),
    stripeId: vine_1.default.string().regex(/^cus_[a-zA-Z0-9]{14,}$/),
    visits: vine_1.default.number().min(0),
    favouriteColours: vine_1.default.array(vine_1.default.string()), // I gave up on this one for the reasons above
    profile: profileSchema,
});
const decodeUserForcedAsync = (user) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const r = yield vine_1.default.tryValidate({
        schema: userSchema,
        data: user,
    });
    return mapResult(r);
});
exports.decodeUserForcedAsync = decodeUserForcedAsync;
const encodeUser = (user) => ({ _tag: 'left', error: 'the lib cannot do it' });
exports.encodeUser = encodeUser;
// utils
const mapResult = (r) => r[0] ? { _tag: 'left', error: JSON.stringify(r[0]) } : { _tag: 'right', value: r[1] };
//# sourceMappingURL=vinejs.js.map
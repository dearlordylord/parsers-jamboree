"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = exports.meta = void 0;
const yup_1 = require("yup");
const common_1 = require("@parsers-jamboree/common");
// let isoDate = date().required().transform((v) => {
//   // "v" is "any"
// });
// the developer's position is `let` all the time https://github.com/jquense/yup/pull/2227
let userSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required( /*implicitly filters empty strings too*/),
    email: (0, yup_1.string)().email().required(),
    createdAt: (0, yup_1.date)().required(), // no transform possible in ts
    updatedAt: (0, yup_1.date)().required(), // no transform possible in ts
    subscription: (0, yup_1.string)()
        .oneOf(common_1.SUBSCRIPTION_TYPES)
        .required( /*still "undefined" after oneOf*/),
    stripeId: (0, yup_1.string)()
        .matches(/^cus_[a-zA-Z0-9]{14,}$/)
        .required(),
    visits: (0, yup_1.number)().min(0).integer().required(),
    // favouriteColours: array().of(string().required()/*.matches(/^#[a-fA-F0-9]{6}$/) - no unions, again?*/).required().transform((v, input, ctx) => {
    //   // the fact of returning it 1) breaks the type (still array) 2) breaks the validation runtime completely ({} is returned)
    //   return new Set(v);
    // }),
    favouriteColours: (0, yup_1.mixed)((input) => input instanceof
        Set /*parse/validate the contents yourself, propagate errors yourself?*/ &&
        [...input.values()].every((v) => typeof v === 'string' &&
            (common_1.COLOURS.indexOf(v) !== -1 ||
                !!v.match(/^#[a-fA-F0-9]{6}$/))))
        .required()
        .transform((v, input, ctx) => {
        if (ctx.isType(v))
            return v;
        if (!Array.isArray(v))
            return ctx.typeError('Expected an array');
        const r = new Set(v);
        if (r.size !== v.length) {
            return ctx.typeError('Expected unique items');
        }
        if (!v.every((v) => typeof v === 'string' &&
            (common_1.COLOURS.indexOf(v) !== -1 ||
                !!v.match(/^#[a-fA-F0-9]{6}$/)))) {
            return ctx.typeError('Expected a valid colour or hex colour');
        }
        return r;
    }),
    profile: (0, yup_1.object)()
        .transform((v) => {
        // the lib doesn't seem to accept unions; we can write our own runtime check
        // if (v.type === PROFILE_TYPE_LISTENER) {
        //   return {
        //     type: PROFILE_TYPE_LISTENER,
        //     boughtTracks: v.boughtTracks /*now, this is not composable with other parsers because we're already in the world of runtime checks; we can start using parsers here too but I don't think it worth it*/,
        //   };
        // } else if (v.type === PROFILE_TYPE_ARTIST) {
        //   return {
        //     type: PROFILE_TYPE_ARTIST,
        //     publishedTracks: v.publishedTracks, /* same, unchecked */
        //   };
        // }
        // ^ as a result of the above, we still get the type `{}` from InferType method, so that's no more than a runtime check; I have to throw it away
        return v;
    })
        .required(),
});
exports.meta = {
    items: {
        branded: false,
        typedErrors: false,
        templateLiterals: false,
        emailFormatAmbiguityIsAccountedFor: true,
    },
    explanations: {
        emailFormatAmbiguityIsAccountedFor: `Default method is present with a warning https://github.com/jquense/yup?tab=readme-ov-file#stringemailmessage-string--function-schema`,
    }
};
const decodeUser = (u) => {
    try {
        return { _tag: 'right', value: userSchema.cast(u) };
    }
    catch (e) {
        return {
            _tag: 'left',
            error: e.message /*we have no idea what's the error type is*/,
        };
    }
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => ({
    _tag: 'left',
    error: 'the lib cannot do it',
});
exports.encodeUser = encodeUser;
//# sourceMappingURL=yup.js.map
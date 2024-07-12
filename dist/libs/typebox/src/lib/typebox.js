"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = exports.meta = void 0;
const typebox_1 = require("@sinclair/typebox");
const value_1 = require("@sinclair/typebox/value");
const common_1 = require("@parsers-jamboree/common");
const Colour = typebox_1.Type.Union(common_1.COLOURS.map((c) => typebox_1.Type.Literal(c)));
const ColourOrHex = typebox_1.Type.Union([Colour, typebox_1.Type.RegExp(/^#[a-fA-F0-9]{6}$/)]);
const SubscriptionType = typebox_1.Type.Union(common_1.SUBSCRIPTION_TYPES.map((c) => typebox_1.Type.Literal(c)));
const StripeId = typebox_1.Type.Transform(typebox_1.Type.String({
    // why no regex native? I assume not schema serializable?
    pattern: '^cus_[a-zA-Z0-9]{14,}$',
}))
    .Decode((value) => value)
    .Encode((value) => value);
const IsoDate = typebox_1.Type.Transform(typebox_1.Type.String({
    pattern: common_1.ISO_DATE_REGEX_S,
}))
    .Decode((value) => new Date(value))
    .Encode((value) => value.toISOString());
const Email = typebox_1.Type.Transform(typebox_1.Type.String({
    pattern: common_1.EMAIL_REGEX_S,
}))
    .Decode((value) => value)
    .Encode((value) => value);
const User = typebox_1.Type.Object({
    name: typebox_1.Type.String({
        minLength: 1, // TODO branded
    }),
    // email: Type.String({
    //   // unknown format "email" runtime error despite being in types
    //   format: 'email',
    // }),
    email: Email,
    // where's ISO8601? opinionated
    // createdAt: Type.Date(),
    createdAt: IsoDate,
    updatedAt: IsoDate,
    subscription: SubscriptionType,
    stripeId: StripeId,
    visits: typebox_1.Type.Integer({
        minimum: 0, // TODO how to define my own checks? transform?
    }),
    favouriteColours: typebox_1.Type.Transform(typebox_1.Type.Array(ColourOrHex))
        .Decode((value) => new Set(value))
        .Encode((value) => [...value]),
});
// @ts-expect-error branded string works
const _sid = 'papi';
const FormatWhat = typebox_1.Type.String({
    // should be registered in FormatRegistry, but will fail runtime if not
    format: 'what?',
});
exports.meta = {
    branded: true,
};
const decodeUser = (u) => {
    // flow control with exceptions
    try {
        const r = value_1.Value.Decode(User, u);
        return { _tag: 'right', value: r };
    }
    catch (e) {
        // type of their errors is unknown, you should additionally call error list methods?
        return { _tag: 'left', error: [...value_1.Value.Errors(User, u)] };
    }
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => {
    // flow control with exceptions
    try {
        const r = value_1.Value.Encode(User, u);
        return { _tag: 'right', value: r };
    }
    catch (e) {
        // type of their errors is unknown, you should additionally call error list methods?
        return { _tag: 'left', error: [...value_1.Value.Errors(User, u)] };
    }
};
exports.encodeUser = encodeUser;
//# sourceMappingURL=typebox.js.map
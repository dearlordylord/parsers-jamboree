"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = void 0;
const zod_1 = require("zod");
const common_1 = require("@parsers-jamboree/common");
// https://github.com/colinhacks/zod?tab=readme-ov-file#brand
const userNameSchema = zod_1.z.string().min(1).max(255).brand('userName');
const emailSchema = zod_1.z.string().email();
const stripeIdSchema = zod_1.z.string().regex(/^cus_[a-zA-Z0-9]{14,}$/);
const visitsSchema = zod_1.z.number().min(0).int();
const colourSchema = zod_1.z.enum(common_1.COLOURS).or(zod_1.z.string().regex(/^#[a-fA-F0-9]{6}$/));
const userSchema = zod_1.z.object({
    name: userNameSchema,
    email: emailSchema,
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    subscription: zod_1.z.enum(common_1.SUBSCRIPTION_TYPES),
    stripeId: stripeIdSchema,
    visits: visitsSchema,
    favouriteColours: zod_1.z.array(colourSchema),
});
const decodeUser = (u) => {
    const result = userSchema.safeParse(u);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
/* they can't do it; probably not possible because of input parsing being lenient:

const datetime = z.string().datetime();

datetime.parse("2020-01-01T00:00:00Z"); // pass
datetime.parse("2020-01-01T00:00:00.123Z"); // pass
datetime.parse("2020-01-01T00:00:00.123456Z"); // pass

- which makes it possible to encode into a different format that the input is in

*  */
const encodeUser = (_u) => ({
    _tag: 'left',
    error: 'the lib cannot do it',
});
exports.encodeUser = encodeUser;
// utils
const mapResult = (r) => {
    if (r.success) {
        return { _tag: 'right', value: r.data };
    }
    else {
        return { _tag: 'left', error: r.error };
    }
};
//# sourceMappingURL=zod.js.map
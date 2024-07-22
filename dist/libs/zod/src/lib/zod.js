"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.encodeUser = exports.decodeUser = exports.profileSchema = exports.timeConcernTimelessSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("@parsers-jamboree/common");
// https://github.com/colinhacks/zod?tab=readme-ov-file#brand
const userNameSchema = zod_1.z.string().min(1).max(255).brand('userName');
const emailSchema = zod_1.z.string().email();
const stripeIdSchema = zod_1.z.string().regex(/^cus_[a-zA-Z0-9]{14,}$/);
const nonNegativeIntegerSchema = zod_1.z.number().int().min(0);
const visitsSchema = nonNegativeIntegerSchema;
const colourSchema = zod_1.z.enum(common_1.COLOURS).or(zod_1.z.string().regex(/^#[a-fA-F0-9]{6}$/));
exports.timeConcernTimelessSchema = zod_1.z.object({
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
const favouriteColoursSchema = zod_1.z
    .array(colourSchema)
    .superRefine((v, ctx) => {
    const set = new Set(v);
    if (set.size !== v.length) {
        ctx.addIssue({
            code: 'custom',
            message: 'favourite colours must be unique',
        });
    }
    return zod_1.z.NEVER;
})
    .transform((v) => new Set(v));
const profileListenerSchema = zod_1.z.object({
    type: zod_1.z.literal('listener'),
    boughtTracks: nonNegativeIntegerSchema,
});
const profileArtistSchema = zod_1.z.object({
    type: zod_1.z.literal('artist'),
    publishedTracks: nonNegativeIntegerSchema,
});
exports.profileSchema = zod_1.z.discriminatedUnion('type', [
    profileListenerSchema,
    profileArtistSchema,
]);
// recursive structures don't to work https://github.com/colinhacks/zod/issues/3628
// type FileSystem = (
//   | {
//   readonly type: 'directory';
//   readonly children: readonly FileSystem[];
// }
//   | {
//   readonly type: 'file';
// }
//   ) & {
//   readonly name: FileSystemName;
// };
// const fileSystemNameSchema = z.string().min(1).max(255).brand('fileSystemName');
// type FileSystemName = z.infer<typeof fileSystemNameSchema>;
//
// const fileSystemBaseSchema = z.object({
//   name: fileSystemNameSchema,
// });
//
// const fileSystemDirectoryBaseSchema = fileSystemBaseSchema.merge(z.object({
//   type: z.literal('directory'),
// }));
//
// type FileSystemDirectory = z.infer<typeof fileSystemDirectoryBaseSchema> & {
//   readonly children: readonly FileSystem[];
// }
//
// const fileSystemDirectorySchema: z.ZodType<FileSystemDirectory> = fileSystemDirectoryBaseSchema.extend({
//   children: z.lazy(() => z.array(fileSystemSchema))
// });
//
// const fileSystemFileSchema = fileSystemBaseSchema.merge(z.object({
//   type: z.literal('file'),
// }));
//
// export const fileSystemSchema = z.discriminatedUnion('type', [
//   fileSystemDirectorySchema,
//   fileSystemFileSchema,
// ]);
const userSchema = zod_1.z
    .object({
    name: userNameSchema,
    email: emailSchema,
    subscription: zod_1.z.enum(common_1.SUBSCRIPTION_TYPES),
    stripeId: stripeIdSchema,
    visits: visitsSchema,
    favouriteColours: favouriteColoursSchema,
    profile: exports.profileSchema,
    fileSystemSchema: zod_1.z.any(), // https://github.com/colinhacks/zod/issues/3628
})
    .merge(exports.timeConcernTimelessSchema)
    .superRefine((v, ctx) => {
    if (v.createdAt > v.updatedAt) {
        ctx.addIssue({
            code: 'custom',
            message: 'createdAt must be less or equal than updatedAt',
        });
    }
    return zod_1.z.NEVER;
});
const decodeUser = (u) => {
    userSchema.parse(u);
    const result = userSchema.safeParse(u);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
const encodeUser = (_u) => ({
    _tag: 'left',
    error: 'the lib cannot do it',
});
exports.encodeUser = encodeUser;
exports.meta = {
    items: {
        branded: true,
        typedErrors: true,
        templateLiterals: false,
        emailFormatAmbiguityIsAccountedFor: false,
        acceptsTypedInput: false,
    },
    explanations: {
        templateLiterals: 'Recognized but not supported yet https://github.com/colinhacks/zod/issues/566#issuecomment-890422215 https://github.com/colinhacks/zod/issues/419',
        emailFormatAmbiguityIsAccountedFor: `The author's stance on emails is in GitHub https://github.com/colinhacks/zod/pull/2157 but not explicit in docs.`,
    },
};
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
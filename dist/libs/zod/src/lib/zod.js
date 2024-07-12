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
exports.meta = {
    branded: true,
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
import { z } from 'zod';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { SafeParseReturnType } from 'zod/lib/types';

// https://github.com/colinhacks/zod?tab=readme-ov-file#brand
const userNameSchema = z.string().min(1).max(255).brand('userName');

const emailSchema = z.string().email();

const stripeIdSchema = z.string().regex(/^cus_[a-zA-Z0-9]{14,}$/);

const nonNegativeIntegerSchema = z.number().int().min(0);

const visitsSchema = nonNegativeIntegerSchema;

const colourSchema = z.enum(COLOURS).or(z.string().regex(/^#[a-fA-F0-9]{6}$/));

export const timeConcernTimelessSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const favouriteColoursSchema = z
  .array(colourSchema)
  .superRefine((v, ctx) => {
    const set = new Set(v);
    if (set.size !== v.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'favourite colours must be unique',
      });
    }
    return z.NEVER;
  })
  .transform((v) => new Set(v));

const profileListenerSchema = z.object({
  type: z.literal('listener'),
  boughtTracks: nonNegativeIntegerSchema,
});

const profileArtistSchema = z.object({
  type: z.literal('artist'),
  publishedTracks: nonNegativeIntegerSchema,
});

export const profileSchema = z.discriminatedUnion('type', [
  profileListenerSchema,
  profileArtistSchema,
]);

// recursive structures don't seem to work https://github.com/colinhacks/zod/issues/3628
// there's a new solution to it: https://github.com/colinhacks/zod/issues/1500#issuecomment-2324304993 but it doesn't seem to work

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

const userSchema = z
  .object({
    name: userNameSchema,
    email: emailSchema,
    subscription: z.enum(SUBSCRIPTION_TYPES),
    stripeId: stripeIdSchema,
    visits: visitsSchema,
    favouriteColours: favouriteColoursSchema,
    profile: profileSchema,
    fileSystemSchema: z.any(), // https://github.com/colinhacks/zod/issues/3628
  })
  .merge(timeConcernTimelessSchema)
  .superRefine((v, ctx) => {
    if (v.createdAt > v.updatedAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'createdAt must be less or equal than updatedAt',
      });
    }
    return z.NEVER;
  });

type User = z.infer<typeof userSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> =>
  mapResult(userSchema.safeParse(u));

export const encodeUser = (
  _u: User
): Result<'the lib cannot do it', never> => ({
  _tag: 'left',
  error: 'the lib cannot do it',
});

// utils

const mapResult = (
  r: SafeParseReturnType<unknown, User>
): Result<unknown, User> => {
  if (r.success) {
    return { _tag: 'right', value: r.data };
  } else {
    return { _tag: 'left', error: r.error };
  }
};

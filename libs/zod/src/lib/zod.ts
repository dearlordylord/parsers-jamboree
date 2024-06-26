import {z} from 'zod';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { SafeParseReturnType } from 'zod/lib/types';

// https://github.com/colinhacks/zod?tab=readme-ov-file#brand
const userNameSchema = z.string().min(1).max(255).brand('userName');

const emailSchema = z.string().email();

const stripeIdSchema = z.string().regex(/^cus_[a-zA-Z0-9]{14,}$/);

const visitsSchema = z.number().min(0).int();

const colourSchema = z.enum(COLOURS).or(z.string().regex(/^#[a-fA-F0-9]{6}$/));

const userSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  subscription: z.enum(SUBSCRIPTION_TYPES),
  stripeId: stripeIdSchema,
  visits: visitsSchema,
  favouriteColours: z.array(colourSchema),
});

type User = z.infer<typeof userSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> => {
  const result = userSchema.safeParse(u);
  return mapResult(result);
};

/* they can't do it; probably not possible because of input parsing being lenient:

const datetime = z.string().datetime();

datetime.parse("2020-01-01T00:00:00Z"); // pass
datetime.parse("2020-01-01T00:00:00.123Z"); // pass
datetime.parse("2020-01-01T00:00:00.123456Z"); // pass

- which makes it possible to encode into a different format that the input is in

*  */
export const encodeUser = (_u: User): Result<'the lib cannot do it', never> => ({ _tag: 'left', error: 'the lib cannot do it' });

// utils

const mapResult = (r: SafeParseReturnType<unknown, User>): Result<unknown, User> => {
  if (r.success) {
    return { _tag: 'right', value: r.data };
  } else {
    return { _tag: 'left', error: r.error };
  }
};


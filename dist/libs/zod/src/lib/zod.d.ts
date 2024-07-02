import { z } from 'zod';
import { Result } from '@parsers-jamboree/common';
declare const userSchema: z.ZodObject<{
    name: z.ZodBranded<z.ZodString, "userName">;
    email: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    subscription: z.ZodEnum<["free", "pro", "enterprise"]>;
    stripeId: z.ZodString;
    visits: z.ZodNumber;
    favouriteColours: z.ZodArray<z.ZodUnion<[z.ZodEnum<["red", "green", "blue"]>, z.ZodString]>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string & z.BRAND<"userName">;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: string[];
}, {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: string[];
}>;
type User = z.infer<typeof userSchema>;
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (_u: User) => Result<'the lib cannot do it', never>;
export {};

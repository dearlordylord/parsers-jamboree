import { InferType } from 'yup';
import { Result } from '@parsers-jamboree/common';
declare let userSchema: import("yup").ObjectSchema<{
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    subscription: NonNullable<"free" | "pro" | "enterprise" | undefined>;
    stripeId: string;
    visits: number;
    favouriteColours: Set<"red" | "green" | "blue" | import("schemata-ts/schemata/HexColor").HexColor | `#${string}`>;
    profile: {};
}, import("yup").AnyObject, {
    name: undefined;
    email: undefined;
    createdAt: undefined;
    updatedAt: undefined;
    subscription: undefined;
    stripeId: undefined;
    visits: undefined;
    favouriteColours: undefined;
    profile: {};
}, "">;
type User = InferType<typeof userSchema>;
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (u: User) => Result<unknown, unknown>;
export {};

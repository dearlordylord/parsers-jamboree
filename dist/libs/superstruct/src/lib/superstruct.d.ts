import { Infer, Struct } from 'superstruct';
import { Result } from '@parsers-jamboree/common';
declare const User: Struct<{
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: unknown;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: string[];
    profile: {
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    };
}, {
    createdAt: Struct<Date, null>;
    updatedAt: Struct<Date, null>;
    name: Struct<string, null>;
    email: Struct<unknown, null>;
    subscription: Struct<"free" | "pro" | "enterprise", {
        free: "free";
        pro: "pro";
        enterprise: "enterprise";
    }>;
    stripeId: Struct<string, null>;
    visits: Struct<number, null>;
    favouriteColours: Struct<string[], Struct<string, unknown>>;
    profile: Struct<{
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    }, null>;
}>;
type User = Infer<typeof User>;
export declare const decodeUser: (u: unknown) => Result<string, User>;
export declare const encodeUser: (u: User) => Result<string, unknown>;
export {};

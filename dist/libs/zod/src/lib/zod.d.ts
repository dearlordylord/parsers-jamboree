import { z } from 'zod';
import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
export declare const timeConcernTimelessSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
}, {
    createdAt: string;
    updatedAt: string;
}>;
export declare const profileSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"listener">;
    boughtTracks: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "listener";
    boughtTracks: number;
}, {
    type: "listener";
    boughtTracks: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"artist">;
    publishedTracks: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "artist";
    publishedTracks: number;
}, {
    type: "artist";
    publishedTracks: number;
}>]>;
declare const userSchema: z.ZodEffects<z.ZodObject<z.objectUtil.extendShape<{
    name: z.ZodBranded<z.ZodString, "userName">;
    email: z.ZodString;
    subscription: z.ZodEnum<["free", "pro", "enterprise"]>;
    stripeId: z.ZodString;
    visits: z.ZodNumber;
    favouriteColours: z.ZodEffects<z.ZodEffects<z.ZodArray<z.ZodUnion<[z.ZodEnum<["red", "green", "blue"]>, z.ZodString]>, "many">, string[], string[]>, Set<string>, string[]>;
    profile: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"listener">;
        boughtTracks: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "listener";
        boughtTracks: number;
    }, {
        type: "listener";
        boughtTracks: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"artist">;
        publishedTracks: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "artist";
        publishedTracks: number;
    }, {
        type: "artist";
        publishedTracks: number;
    }>]>;
    fileSystemSchema: z.ZodAny;
}, {
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    createdAt: string;
    updatedAt: string;
    name: string & z.BRAND<"userName">;
    email: string;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: Set<string>;
    profile: {
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    };
    fileSystemSchema?: any;
}, {
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
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
    fileSystemSchema?: any;
}>, {
    createdAt: string;
    updatedAt: string;
    name: string & z.BRAND<"userName">;
    email: string;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: Set<string>;
    profile: {
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    };
    fileSystemSchema?: any;
}, {
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
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
    fileSystemSchema?: any;
}>;
type User = z.infer<typeof userSchema>;
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (_u: User) => Result<'the lib cannot do it', never>;
export declare const meta: TrustedCompileTimeMeta;
export {};

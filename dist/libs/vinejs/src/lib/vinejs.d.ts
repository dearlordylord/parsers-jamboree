import { BaseLiteralType } from '@vinejs/vine';
import { Result } from '@parsers-jamboree/common';
import { FieldOptions, Infer, Validation } from '@vinejs/vine/build/src/types';
export declare class IsoDate extends BaseLiteralType<string, Date, Date> {
    constructor(options?: FieldOptions, validations?: Validation<any>[]);
    clone(): this;
}
declare const userSchema: import("@vinejs/vine").VineObject<{
    name: import("@vinejs/vine").VineString;
    email: import("@vinejs/vine").VineString;
    createdAt: IsoDate;
    updatedAt: IsoDate;
    subscription: import("@vinejs/vine").VineEnum<readonly ["free", "pro", "enterprise"]>;
    stripeId: import("@vinejs/vine").VineString;
    visits: import("@vinejs/vine").VineNumber;
    favouriteColours: import("@vinejs/vine").VineArray<import("@vinejs/vine").VineString>;
    profile: import("@vinejs/vine").VineObject<{
        type: import("@vinejs/vine").VineEnum<readonly ["listener", "artist"]>;
    }, {
        type: "listener" | "artist";
    } & ({
        type: "listener";
        boughtTracks: string | number;
    } | {
        type: "artist";
        publishedTracks: string | number;
    }), {
        type: "listener" | "artist";
    } & ({
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    }), {
        type: "listener" | "artist";
    } & ({
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    })>;
}, {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: string | number;
    favouriteColours: string[];
    profile: {
        type: "listener" | "artist";
    } & ({
        type: "listener";
        boughtTracks: string | number;
    } | {
        type: "artist";
        publishedTracks: string | number;
    });
}, {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: string[];
    profile: {
        type: "listener" | "artist";
    } & ({
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    });
}, {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: string[];
    profile: {
        type: "listener" | "artist";
    } & ({
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    });
}>;
type User = Infer<typeof userSchema>;
export declare const decodeUserForcedAsync: (user: unknown) => Promise<Result<string, User>>;
export declare const encodeUser: (user: User) => Result<string, unknown>;
export {};

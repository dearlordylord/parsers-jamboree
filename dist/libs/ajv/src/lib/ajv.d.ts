import { PROFILE_TYPE_ARTIST, PROFILE_TYPE_LISTENER, Result, SUBSCRIPTION_TYPES, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
type UserJson = {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscription: (typeof SUBSCRIPTION_TYPES)[number];
    stripeId: string;
    visits: number;
    favouriteColours: string[];
    profile: {
        type: typeof PROFILE_TYPE_LISTENER;
        boughtTracks: number;
    } | {
        type: typeof PROFILE_TYPE_ARTIST;
        publishedTracks: number;
    };
    fileSystem: ({
        type: 'directory';
        children: FileSystem[];
    } | {
        type: 'file';
    }) & {
        name: string;
    };
};
export declare const decodeUser: (u: unknown) => Result<unknown, UserJson>;
export declare const encodeUser: (u: UserJson) => Result<string, unknown>;
export declare const meta: TrustedCompileTimeMeta;
export {};

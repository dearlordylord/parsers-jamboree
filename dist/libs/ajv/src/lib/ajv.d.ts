import { PROFILE_TYPE_ARTIST, PROFILE_TYPE_LISTENER, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
type UserJson = {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscription: typeof SUBSCRIPTION_TYPES[number];
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
};
type User = Omit<UserJson, 'favouriteColours' | 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
    favouriteColours: Set<string>;
};
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (u: User) => Result<string, unknown>;
export {};

import { igor } from './checker';
import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
type Breaker<T> = (t: T) => T;
type Igor = typeof igor;
type UserBreaker = Breaker<Igor>;
export declare const switchDates: UserBreaker;
export declare const prefixCustomerId: UserBreaker;
export declare const addTwoAtsToEmail: UserBreaker;
export declare const clearName: UserBreaker;
export declare const addFavouriteTiger: UserBreaker;
export declare const addFavouriteRed: UserBreaker;
export declare const setSubscriptionTypeBanana: UserBreaker;
export declare const setHalfVisits: UserBreaker;
export declare const setCreatedAtCyborgWar: UserBreaker;
export declare const setProfileArtist: UserBreaker;
export declare const addFileSystemUFOType: UserBreaker;
export declare const addFileSystemDupeFile: UserBreaker;
export declare const BREAKERS: {
    readonly switchDates: UserBreaker;
    readonly prefixCustomerId: UserBreaker;
    readonly addTwoAtsToEmail: UserBreaker;
    readonly clearName: UserBreaker;
    readonly addFavouriteTiger: UserBreaker;
    readonly addFavouriteRed: UserBreaker;
    readonly setSubscriptionTypeBanana: UserBreaker;
    readonly setHalfVisits: UserBreaker;
    readonly setCreatedAtCyborgWar: UserBreaker;
    readonly setProfileArtist: UserBreaker;
    readonly addFileSystemUFOType: UserBreaker;
    readonly addFileSystemDupeFile: UserBreaker;
};
export declare const BREAKER_DESCRIPTIONS: {
    [K in keyof typeof BREAKERS]: string;
};
export type TesterArgs = {
    decodeUser: (u: unknown) => Result<unknown, unknown>;
    encodeUser: (u: unknown) => Result<unknown, unknown>;
    meta: TrustedCompileTimeMeta;
};
export type TesterResult = {
    key: string;
    title: string;
    success: boolean;
}[];
export declare const runTesters: ({ decodeUser, encodeUser, meta, }: TesterArgs) => TesterResult;
export {};

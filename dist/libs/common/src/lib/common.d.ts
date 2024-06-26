export declare const SUBSCRIPTION_TYPE_FREE: "free";
export declare const SUBSCRIPTION_TYPE_PRO: "pro";
export declare const SUBSCRIPTION_TYPE_ENTERPRISE: "enterprise";
export declare const SUBSCRIPTION_TYPES: readonly ["free", "pro", "enterprise"];
export type SubscriptionType = typeof SUBSCRIPTION_TYPES[number];
export declare const COLOUR_RED: "red";
export declare const COLOUR_GREEN: "green";
export declare const COLOUR_BLUE: "blue";
export declare const COLOURS: readonly ["red", "green", "blue"];
export type Result<E, T> = {
    _tag: 'left';
    error: E;
} | {
    _tag: 'right';
    value: T;
};
export declare const unwrapResult: <E>(showError: (e: E) => string) => <T>(result: Result<E, T>) => T;

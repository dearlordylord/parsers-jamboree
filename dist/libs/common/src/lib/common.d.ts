export declare const SUBSCRIPTION_TYPE_FREE: "free";
export declare const SUBSCRIPTION_TYPE_PRO: "pro";
export declare const SUBSCRIPTION_TYPE_ENTERPRISE: "enterprise";
export declare const SUBSCRIPTION_TYPES: readonly ["free", "pro", "enterprise"];
export type SubscriptionType = (typeof SUBSCRIPTION_TYPES)[number];
export declare const COLOUR_RED: "red";
export declare const COLOUR_GREEN: "green";
export declare const COLOUR_BLUE: "blue";
export declare const COLOURS: readonly ["red", "green", "blue"];
export declare const PROFILE_TYPE_LISTENER: "listener";
export declare const PROFILE_TYPE_ARTIST: "artist";
export declare const PROFILE_TYPES: readonly ["listener", "artist"];
export type Result<E, T> = {
    _tag: 'left';
    error: E;
} | {
    _tag: 'right';
    value: T;
};
export declare const map: <E, T, U>(f: (t: T) => U) => (r: Result<E, T>) => Result<E, U>;
export declare const chain: <E, T, U>(f: (t: T) => Result<E, U>) => (r: Result<E, T>) => Result<E, U>;
export type ResultValue<R extends Result<unknown, unknown>> = R extends Result<unknown, infer T> ? T : never;
export declare const unwrapResult: <E>(showError: (e: E) => string) => <T>(result: Result<E, T>) => T;
export declare const ISO_DATE_REGEX_S = "^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$";
export declare const EMAIL_REGEX_S = "^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\u0001-\b\v\f\u000E-\u001F!#-[]-]|\\\\[\u0001-\t\v\f\u000E-])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\u0001-\b\v\f\u000E-\u001F!-ZS-]|\\\\[\u0001-\t\v\f\u000E-])+)\\])$";

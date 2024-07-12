import { Number, String, Literal, Array, Record, Union, Template, Static, RuntypeBrand, Intersect, Runtype } from 'runtypes';
import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
declare const NonEmptyString: import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>;
type NonEmptyString = Static<typeof NonEmptyString>;
type FileSystem = ({
    readonly type: 'directory';
    readonly children: readonly FileSystem[];
} | {
    readonly type: 'file';
}) & {
    readonly name: NonEmptyString;
};
declare const FileSystem: Union<[Runtype<{
    readonly type: 'directory';
    readonly children: readonly FileSystem[];
} & {
    readonly name: NonEmptyString;
} & {
    type: 'directory';
}>, Intersect<[Record<{
    name: import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>;
}, false>, Record<{
    type: Literal<"file">;
}, false>]>]>;
declare const UserJson: Intersect<[Record<{
    name: import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>;
    email: import("runtypes").Brand<"Email", import("runtypes").Constraint<import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>, string & RuntypeBrand<"NonEmptyString">, unknown>>;
    createdAt: import("runtypes").Brand<"IsoDateString", import("runtypes").Constraint<String, string, unknown>>;
    updatedAt: import("runtypes").Brand<"IsoDateString", import("runtypes").Constraint<String, string, unknown>>;
    subscription: Union<[Literal<"free">, Literal<"pro">, Literal<"enterprise">]>;
    stripeId: import("runtypes").Brand<"StripeCustomerId", Template<["cus_", ""], [import("runtypes").Constraint<String, string, unknown>]>>;
    visits: import("runtypes").Brand<"NonNegativeInteger", Intersect<[import("runtypes").Brand<"NonNegative", import("runtypes").Constraint<Number, number, unknown>>, import("runtypes").Brand<"Integer", import("runtypes").Constraint<Number, number, unknown>>]>>;
    favouriteColours: import("runtypes").Constraint<Array<Union<[import("runtypes").Brand<"HexColour", import("runtypes").Constraint<String, string, unknown>>, Union<[Literal<"red">, Literal<"green">, Literal<"blue">]>]>, false>, ("red" | "green" | "blue" | (string & RuntypeBrand<"HexColour">))[], unknown>;
    profile: Union<[Record<{
        type: Literal<"listener">;
        boughtTracks: import("runtypes").Brand<"NonNegativeInteger", Intersect<[import("runtypes").Brand<"NonNegative", import("runtypes").Constraint<Number, number, unknown>>, import("runtypes").Brand<"Integer", import("runtypes").Constraint<Number, number, unknown>>]>>;
    }, false>, Record<{
        type: Literal<"artist">;
        publishedTracks: import("runtypes").Brand<"NonNegativeInteger", Intersect<[import("runtypes").Brand<"NonNegative", import("runtypes").Constraint<Number, number, unknown>>, import("runtypes").Brand<"Integer", import("runtypes").Constraint<Number, number, unknown>>]>>;
    }, false>]>;
    fileSystem: Union<[Runtype<{
        readonly type: 'directory';
        readonly children: readonly FileSystem[];
    } & {
        readonly name: NonEmptyString;
    } & {
        type: 'directory';
    }>, Intersect<[Record<{
        name: import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>;
    }, false>, Record<{
        type: Literal<"file">;
    }, false>]>]>;
}, false>, import("runtypes").Constraint<Record<{
    createdAt: import("runtypes").Brand<"IsoDateString", import("runtypes").Constraint<String, string, unknown>>;
    updatedAt: import("runtypes").Brand<"IsoDateString", import("runtypes").Constraint<String, string, unknown>>;
}, false>, {
    createdAt: string & RuntypeBrand<"IsoDateString">;
    updatedAt: string & RuntypeBrand<"IsoDateString">;
}, unknown>]>;
type User = Static<typeof UserJson>;
export declare const decodeUser: (u: unknown) => Result<string, User>;
export declare const meta: TrustedCompileTimeMeta;
export declare const encodeUser: (_u: User) => Result<string, unknown>;
export {};

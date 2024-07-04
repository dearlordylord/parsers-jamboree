import { Schema } from '@effect/schema';
import { Result } from '@parsers-jamboree/common';
declare const NonEmptyStringBrand: unique symbol;
declare const NonEmptyString: Schema.brand<typeof Schema.NonEmpty, typeof NonEmptyStringBrand>;
type NonEmptyString = Schema.Schema.Type<typeof NonEmptyString>;
declare const EmailBrand: unique symbol;
declare const StripeIdBrand: unique symbol;
declare const ColourBrand: unique symbol;
declare const HexBrand: unique symbol;
declare const SubscriptionBrand: unique symbol;
declare const NonNegativeIntegerBrand: unique symbol;
type FileSystem = ({
    readonly type: 'directory';
    readonly children: readonly FileSystem[];
} | {
    readonly type: 'file';
}) & {
    readonly name: NonEmptyString;
};
declare const FileSystem: Schema.extend<Schema.Struct<{
    name: Schema.brand<typeof Schema.NonEmpty, typeof NonEmptyStringBrand>;
}>, Schema.Union<[Schema.Struct<{
    type: Schema.Literal<["file"]>;
}>, Schema.Struct<{
    type: Schema.Literal<["directory"]>;
    children: Schema.filter<Schema.Array$<Schema.suspend<FileSystem, FileSystem, never>>>;
}>]>>;
declare const User: Schema.transformOrFail<Schema.Struct<{
    name: Schema.brand<typeof Schema.NonEmpty, typeof NonEmptyStringBrand>;
    email: Schema.brand<Schema.filter<Schema.Schema<string & import("effect/Brand").Brand<typeof NonEmptyStringBrand>, string, never>>, typeof EmailBrand>;
    createdAt: typeof Schema.Date;
    updatedAt: typeof Schema.Date;
    subscription: Schema.brand<Schema.Literal<["free", "pro", "enterprise"]>, typeof SubscriptionBrand>;
    stripeId: Schema.brand<Schema.filter<Schema.Schema<`cus_${string}`, `cus_${string}`, never>>, typeof StripeIdBrand>;
    visits: Schema.brand<Schema.filter<Schema.Schema<number, number, never>>, typeof NonNegativeIntegerBrand>;
    favouriteColours: Schema.transformOrFail<Schema.Array$<Schema.Union<[Schema.brand<Schema.Literal<["red", "green", "blue"]>, typeof ColourBrand>, Schema.brand<Schema.filter<Schema.Schema<string, string, never>>, typeof HexBrand>]>>, Schema.SetFromSelf<Schema.SchemaClass<(("red" | "green" | "blue") & import("effect/Brand").Brand<typeof ColourBrand>) | (string & import("effect/Brand").Brand<typeof HexBrand>), (("red" | "green" | "blue") & import("effect/Brand").Brand<typeof ColourBrand>) | (string & import("effect/Brand").Brand<typeof HexBrand>), never>>, never>;
    profile: Schema.Union<[Schema.Struct<{
        type: Schema.Literal<["listener"]>;
        boughtTracks: Schema.brand<Schema.filter<Schema.Schema<number, number, never>>, typeof NonNegativeIntegerBrand>;
    }>, Schema.Struct<{
        type: Schema.Literal<["artist"]>;
        publishedTracks: Schema.brand<Schema.filter<Schema.Schema<number, number, never>>, typeof NonNegativeIntegerBrand>;
    }>]>;
    fileSystem: Schema.extend<Schema.Struct<{
        name: Schema.brand<typeof Schema.NonEmpty, typeof NonEmptyStringBrand>;
    }>, Schema.Union<[Schema.Struct<{
        type: Schema.Literal<["file"]>;
    }>, Schema.Struct<{
        type: Schema.Literal<["directory"]>;
        children: Schema.filter<Schema.Array$<Schema.suspend<FileSystem, FileSystem, never>>>;
    }>]>>;
}>, Schema.SchemaClass<{
    readonly name: string & import("effect/Brand").Brand<typeof NonEmptyStringBrand>;
    readonly email: string & import("effect/Brand").Brand<typeof NonEmptyStringBrand> & import("effect/Brand").Brand<typeof EmailBrand>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly subscription: ("free" | "pro" | "enterprise") & import("effect/Brand").Brand<typeof SubscriptionBrand>;
    readonly stripeId: `cus_${string}` & import("effect/Brand").Brand<typeof StripeIdBrand>;
    readonly visits: number & import("effect/Brand").Brand<typeof NonNegativeIntegerBrand>;
    readonly favouriteColours: Set<(("red" | "green" | "blue") & import("effect/Brand").Brand<typeof ColourBrand>) | (string & import("effect/Brand").Brand<typeof HexBrand>)>;
    readonly profile: {
        readonly type: "listener";
        readonly boughtTracks: number & import("effect/Brand").Brand<typeof NonNegativeIntegerBrand>;
    } | {
        readonly type: "artist";
        readonly publishedTracks: number & import("effect/Brand").Brand<typeof NonNegativeIntegerBrand>;
    };
    readonly fileSystem: {
        readonly name: string & import("effect/Brand").Brand<typeof NonEmptyStringBrand>;
    } & ({
        readonly type: "file";
    } | {
        readonly type: "directory";
        readonly children: readonly FileSystem[];
    });
}, {
    readonly name: string & import("effect/Brand").Brand<typeof NonEmptyStringBrand>;
    readonly email: string & import("effect/Brand").Brand<typeof NonEmptyStringBrand> & import("effect/Brand").Brand<typeof EmailBrand>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly subscription: ("free" | "pro" | "enterprise") & import("effect/Brand").Brand<typeof SubscriptionBrand>;
    readonly stripeId: `cus_${string}` & import("effect/Brand").Brand<typeof StripeIdBrand>;
    readonly visits: number & import("effect/Brand").Brand<typeof NonNegativeIntegerBrand>;
    readonly favouriteColours: Set<(("red" | "green" | "blue") & import("effect/Brand").Brand<typeof ColourBrand>) | (string & import("effect/Brand").Brand<typeof HexBrand>)>;
    readonly profile: {
        readonly type: "listener";
        readonly boughtTracks: number & import("effect/Brand").Brand<typeof NonNegativeIntegerBrand>;
    } | {
        readonly type: "artist";
        readonly publishedTracks: number & import("effect/Brand").Brand<typeof NonNegativeIntegerBrand>;
    };
    readonly fileSystem: {
        readonly name: string & import("effect/Brand").Brand<typeof NonEmptyStringBrand>;
    } & ({
        readonly type: "file";
    } | {
        readonly type: "directory";
        readonly children: readonly FileSystem[];
    });
}, never>, never>;
type User = Schema.Schema.Type<typeof User>;
export declare const decodeUser: (u: unknown) => Result<string, User>;
export declare const encodeUser: (u: User) => Result<string, unknown>;
export {};

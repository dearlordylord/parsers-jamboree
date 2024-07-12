import { InferOutput, BaseIssue, GenericSchema } from 'valibot';
import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
declare const NonEmptyStringSchema: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").MinLengthAction<string, 1, undefined>, import("valibot").BrandAction<string, "NonEmptyString">]>;
type NonEmptyString = InferOutput<typeof NonEmptyStringSchema>;
type FileSystem = ({
    readonly type: 'directory';
    readonly children: readonly FileSystem[];
} | {
    readonly type: 'file';
}) & {
    readonly name: NonEmptyString;
};
declare const UserSchema: import("valibot").IntersectSchema<[import("valibot").ObjectSchema<{
    readonly name: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").MinLengthAction<string, 1, undefined>, import("valibot").BrandAction<string, "NonEmptyString">]>, import("valibot").BrandAction<string & import("valibot").Brand<"NonEmptyString">, "UserName">]>;
    readonly email: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").MinLengthAction<string, 1, undefined>, import("valibot").BrandAction<string, "NonEmptyString">]>, import("valibot").EmailAction<string & import("valibot").Brand<"NonEmptyString">, undefined>, import("valibot").BrandAction<string & import("valibot").Brand<"NonEmptyString">, "Email">]>;
    readonly subscription: import("valibot").PicklistSchema<readonly ["free", "pro", "enterprise"], undefined>;
    readonly stripeId: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").RegexAction<string, undefined>, import("valibot").BrandAction<string, "StripeId">]>;
    readonly visits: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").IntegerAction<number, undefined>, import("valibot").MinValueAction<number, 0, undefined>, import("valibot").BrandAction<number, "NonNegativeInteger">]>, import("valibot").BrandAction<number & import("valibot").Brand<"NonNegativeInteger">, "Visits">]>;
    readonly favouriteColours: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").ArraySchema<import("valibot").UnionSchema<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").RegexAction<string, undefined>, import("valibot").BrandAction<string, "HexColour">]>, import("valibot").SchemaWithPipe<[import("valibot").PicklistSchema<readonly ["red", "green", "blue"], undefined>, import("valibot").BrandAction<"red" | "green" | "blue", "Colour">]>], undefined>, undefined>, import("valibot").CheckAction<((string & import("valibot").Brand<"HexColour">) | (("red" | "green" | "blue") & import("valibot").Brand<"Colour">))[], "Expected unique items">]>, import("valibot").TransformAction<((string & import("valibot").Brand<"HexColour">) | (("red" | "green" | "blue") & import("valibot").Brand<"Colour">))[], Set<(string & import("valibot").Brand<"HexColour">) | (("red" | "green" | "blue") & import("valibot").Brand<"Colour">)>>]>;
    readonly profile: import("valibot").VariantSchema<"type", [import("valibot").ObjectSchema<{
        readonly type: import("valibot").LiteralSchema<"listener", undefined>;
        readonly boughtTracks: import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").IntegerAction<number, undefined>, import("valibot").MinValueAction<number, 0, undefined>, import("valibot").BrandAction<number, "NonNegativeInteger">]>;
    }, undefined>, import("valibot").ObjectSchema<{
        readonly type: import("valibot").LiteralSchema<"artist", undefined>;
        readonly publishedTracks: import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").IntegerAction<number, undefined>, import("valibot").MinValueAction<number, 0, undefined>, import("valibot").BrandAction<number, "NonNegativeInteger">]>;
    }, undefined>], undefined>;
    readonly fileSystem: import("valibot").UnionSchema<[GenericSchema<Omit<FileSystem, "name"> & {
        type: 'directory';
        name: string;
    }, {
        readonly type: 'directory';
        readonly children: readonly FileSystem[];
    } & {
        readonly name: NonEmptyString;
    } & {
        type: 'directory';
    }, BaseIssue<unknown>>, import("valibot").IntersectSchema<[import("valibot").ObjectSchema<{
        readonly name: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").MinLengthAction<string, 1, undefined>, import("valibot").BrandAction<string, "NonEmptyString">]>;
    }, undefined>, import("valibot").ObjectSchema<{
        readonly type: import("valibot").LiteralSchema<"file", undefined>;
    }, undefined>], undefined>], undefined>;
}, undefined>, import("valibot").SchemaWithPipe<[import("valibot").ObjectSchema<{
    readonly createdAt: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").IsoTimestampAction<string, undefined>]>;
    readonly updatedAt: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").IsoTimestampAction<string, undefined>]>;
}, undefined>, import("valibot").BaseValidation<{
    createdAt: string;
    updatedAt: string;
}, {
    createdAt: string;
    updatedAt: string;
}, import("valibot").PartialCheckIssue<{
    createdAt: string;
    updatedAt: string;
}>>]>], undefined>;
type User = InferOutput<typeof UserSchema>;
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (_u: User) => Result<unknown, unknown>;
export declare const meta: TrustedCompileTimeMeta;
export {};

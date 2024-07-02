import { InferOutput } from 'valibot';
import { Result } from '@parsers-jamboree/common';
declare const UserSchema: import("valibot").ObjectSchema<{
    readonly name: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").MinLengthAction<string, 1, undefined>, import("valibot").BrandAction<string, "NonEmptyString">]>, import("valibot").BrandAction<string & import("valibot").Brand<"NonEmptyString">, "UserName">]>;
    readonly email: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").MinLengthAction<string, 1, undefined>, import("valibot").BrandAction<string, "NonEmptyString">]>, import("valibot").EmailAction<string & import("valibot").Brand<"NonEmptyString">, undefined>, import("valibot").BrandAction<string & import("valibot").Brand<"NonEmptyString">, "Email">]>;
    readonly createdAt: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").IsoTimestampAction<string, undefined>]>;
    readonly updatedAt: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").IsoTimestampAction<string, undefined>]>;
    readonly subscription: import("valibot").PicklistSchema<readonly ["free", "pro", "enterprise"], undefined>;
    readonly stripeId: import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").RegexAction<string, undefined>, import("valibot").BrandAction<string, "StripeId">]>;
    readonly visits: import("valibot").SchemaWithPipe<[import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").IntegerAction<number, undefined>, import("valibot").MinValueAction<number, 0, undefined>, import("valibot").BrandAction<number, "NonNegativeInteger">]>, import("valibot").BrandAction<number & import("valibot").Brand<"NonNegativeInteger">, "Visits">]>;
    readonly favouriteColours: import("valibot").SchemaWithPipe<[import("valibot").ArraySchema<import("valibot").UnionSchema<[import("valibot").SchemaWithPipe<[import("valibot").StringSchema<undefined>, import("valibot").RegexAction<string, undefined>, import("valibot").BrandAction<string, "HexColour">]>, import("valibot").SchemaWithPipe<[import("valibot").PicklistSchema<readonly ["red", "green", "blue"], undefined>, import("valibot").BrandAction<"red" | "green" | "blue", "Colour">]>], undefined>, undefined>, import("valibot").CheckAction<((string & import("valibot").Brand<"HexColour">) | (("red" | "green" | "blue") & import("valibot").Brand<"Colour">))[], "Expected unique items">, import("valibot").TransformAction<((string & import("valibot").Brand<"HexColour">) | (("red" | "green" | "blue") & import("valibot").Brand<"Colour">))[], Set<(string & import("valibot").Brand<"HexColour">) | (("red" | "green" | "blue") & import("valibot").Brand<"Colour">)>>]>;
    readonly profile: import("valibot").VariantSchema<"type", [import("valibot").ObjectSchema<{
        readonly type: import("valibot").LiteralSchema<"listener", undefined>;
        readonly boughtTracks: import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").IntegerAction<number, undefined>, import("valibot").MinValueAction<number, 0, undefined>, import("valibot").BrandAction<number, "NonNegativeInteger">]>;
    }, undefined>, import("valibot").ObjectSchema<{
        readonly type: import("valibot").LiteralSchema<"artist", undefined>;
        readonly publishedTracks: import("valibot").SchemaWithPipe<[import("valibot").NumberSchema<undefined>, import("valibot").IntegerAction<number, undefined>, import("valibot").MinValueAction<number, 0, undefined>, import("valibot").BrandAction<number, "NonNegativeInteger">]>;
    }, undefined>], undefined>;
}, undefined>;
type User = InferOutput<typeof UserSchema>;
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (u: User) => Result<unknown, unknown>;
export {};

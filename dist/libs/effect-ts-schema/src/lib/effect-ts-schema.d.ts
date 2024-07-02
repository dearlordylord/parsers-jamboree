import { Schema } from '@effect/schema';
import { Result } from '@parsers-jamboree/common';
declare const NonEmptyStringBrand: unique symbol;
declare const EmailBrand: unique symbol;
declare const StripeIdBrand: unique symbol;
declare const ColourBrand: unique symbol;
declare const HexBrand: unique symbol;
declare const SubscriptionBrand: unique symbol;
declare const NonNegativeIntegerBrand: unique symbol;
declare const User: Schema.Struct<{
    name: Schema.brand<Schema.filter<typeof Schema.String>, typeof NonEmptyStringBrand>;
    email: Schema.brand<Schema.filter<Schema.Schema<string & import("effect/Brand").Brand<typeof NonEmptyStringBrand>, string, never>>, typeof EmailBrand>;
    createdAt: typeof Schema.Date;
    updatedAt: typeof Schema.Date;
    subscription: Schema.brand<Schema.Literal<["free", "pro", "enterprise"]>, typeof SubscriptionBrand>;
    stripeId: Schema.brand<Schema.filter<Schema.Schema<string, string, never>>, typeof StripeIdBrand>;
    visits: Schema.brand<Schema.Union<[typeof Schema.NonNegative, typeof Schema.Int]>, typeof NonNegativeIntegerBrand>;
    favouriteColours: Schema.Set$<Schema.Union<[Schema.brand<Schema.Literal<["red", "green", "blue"]>, typeof ColourBrand>, Schema.brand<Schema.filter<Schema.Schema<string, string, never>>, typeof HexBrand>]>>;
    profile: Schema.Union<[Schema.Struct<{
        type: Schema.Literal<["listener"]>;
        boughtTracks: Schema.brand<Schema.Union<[typeof Schema.NonNegative, typeof Schema.Int]>, typeof NonNegativeIntegerBrand>;
    }>, Schema.Struct<{
        type: Schema.Literal<["artist"]>;
        publishedTracks: Schema.brand<Schema.Union<[typeof Schema.NonNegative, typeof Schema.Int]>, typeof NonNegativeIntegerBrand>;
    }>]>;
}>;
type User = Schema.Schema.Type<typeof User>;
export declare const decodeUser: (u: unknown) => Result<string, User>;
export declare const encodeUser: (u: User) => Result<string, unknown>;
export {};

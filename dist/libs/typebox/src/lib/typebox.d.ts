import { StaticDecode } from '@sinclair/typebox';
import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
import { ValueError } from '@sinclair/typebox/build/cjs/errors/errors';
type StripeIdBrand = {
    readonly StripeId: unique symbol;
};
type EmailBrand = {
    readonly Email: unique symbol;
};
declare const User: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TTransform<import("@sinclair/typebox").TString, string & EmailBrand>;
    createdAt: import("@sinclair/typebox").TTransform<import("@sinclair/typebox").TString, Date>;
    updatedAt: import("@sinclair/typebox").TTransform<import("@sinclair/typebox").TString, Date>;
    subscription: import("@sinclair/typebox").TUnion<import("@sinclair/typebox").TLiteral<"free" | "pro" | "enterprise">[]>;
    stripeId: import("@sinclair/typebox").TTransform<import("@sinclair/typebox").TString, string & StripeIdBrand>;
    visits: import("@sinclair/typebox").TInteger;
    favouriteColours: import("@sinclair/typebox").TTransform<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<import("@sinclair/typebox").TLiteral<"red" | "green" | "blue">[]>, import("@sinclair/typebox").TRegExp]>>, Set<string>>;
}>;
type User = StaticDecode<typeof User>;
export declare const meta: TrustedCompileTimeMeta;
export declare const decodeUser: (u: unknown) => Result<ValueError[], User>;
export declare const encodeUser: (u: User) => Result<ValueError[], unknown>;
export {};

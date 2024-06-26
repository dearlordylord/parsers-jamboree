import * as S from 'schemata-ts/schemata/index';
import * as Nt from 'schemata-ts/newtype';
import type { OutputOf, Schema } from 'schemata-ts/Schema';
import { TranscodeErrors } from 'schemata-ts/TranscodeError';
import { Result } from '@parsers-jamboree/common';
type StripeIdBrand = {
    readonly StripeId: unique symbol;
};
export type StripeId = Nt.Newtype<StripeIdBrand, string>;
declare const ColourSchema: Schema<"red" | "green" | "blue" | S.HexColor, "red" | "green" | "blue" | S.HexColor>;
export type Colour = OutputOf<typeof ColourSchema>;
export declare const UserSchema: S.StructSchema<{
    name: Schema<S.NonEmptyString, S.NonEmptyString>;
    email: Schema<S.EmailAddress, S.EmailAddress>;
    createdAt: Schema<import("schemata-ts/schemables/date/definition").SafeDateString, import("schemata-ts/schemables/date/definition").SafeDate>;
    updatedAt: Schema<import("schemata-ts/schemables/date/definition").SafeDateString, import("schemata-ts/schemables/date/definition").SafeDate>;
    subscription: Schema<"free" | "pro" | "enterprise", "free" | "pro" | "enterprise">;
    stripeId: Schema<string, StripeId>;
    visits: S.IntSchema<0, undefined>;
    favouriteColours: Schema<readonly ("red" | "green" | "blue" | S.HexColor)[], ReadonlySet<"red" | "green" | "blue" | S.HexColor>>;
}, undefined>;
export type User = OutputOf<typeof UserSchema>;
export declare const NamelessUserSchema: S.StructSchema<{
    email: Schema<S.EmailAddress, S.EmailAddress>;
    createdAt: Schema<import("schemata-ts/schemables/date/definition").SafeDateString, import("schemata-ts/schemables/date/definition").SafeDate>;
    updatedAt: Schema<import("schemata-ts/schemables/date/definition").SafeDateString, import("schemata-ts/schemables/date/definition").SafeDate>;
    subscription: Schema<"free" | "pro" | "enterprise", "free" | "pro" | "enterprise">;
    stripeId: Schema<string, StripeId>;
    visits: S.IntSchema<0, undefined>;
    favouriteColours: Schema<readonly ("red" | "green" | "blue" | S.HexColor)[], ReadonlySet<"red" | "green" | "blue" | S.HexColor>>;
}, undefined>;
export type NamelessUser = OutputOf<typeof NamelessUserSchema>;
type TreeNode = {
    name: string;
    children: readonly TreeNode[];
};
export declare const TreeNodeSchema: Schema<TreeNode, TreeNode>;
export declare const parseUser: (user: unknown) => Result<TranscodeErrors, User>;
export declare const encodeUser: (user: User) => unknown;
export declare const parseNamelessUser: (user: unknown) => Result<TranscodeErrors, NamelessUser>;
export declare const encodeNamelessUser: (user: NamelessUser) => unknown;
export declare const parseTree: (node: unknown) => Result<TranscodeErrors, TreeNode>;
export declare const encodeTree: (node: TreeNode) => unknown;
export {};

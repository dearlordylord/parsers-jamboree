import { Number, String, Literal, Array, Record, Union, Template, Static, RuntypeBrand } from 'runtypes';
import { Result } from '@parsers-jamboree/common';
declare const HexColourOrColour: Union<[import("runtypes").Brand<"HexColour", import("runtypes").Constraint<String, string, unknown>>, Union<[Literal<"red">, Literal<"green">, Literal<"blue">]>]>;
type HexColourOrColour = Static<typeof HexColourOrColour>;
declare const UserJson: Record<{
    name: import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>;
    email: import("runtypes").Brand<"Email", import("runtypes").Constraint<import("runtypes").Brand<"NonEmptyString", import("runtypes").Constraint<String, string, unknown>>, string & RuntypeBrand<"NonEmptyString">, unknown>>;
    createdAt: import("runtypes").Brand<"IsoDateString", import("runtypes").Constraint<String, string, unknown>>;
    updatedAt: import("runtypes").Brand<"IsoDateString", import("runtypes").Constraint<String, string, unknown>>;
    subscription: Union<[Literal<"free">, Literal<"pro">, Literal<"enterprise">]>;
    stripeId: import("runtypes").Brand<"StripeCustomerId", Template<["cus_", ""], [import("runtypes").Constraint<String, string, unknown>]>>;
    visits: import("runtypes").Brand<"NonNegativeInteger", Union<[import("runtypes").Brand<"NonNegative", import("runtypes").Constraint<Number, number, unknown>>, import("runtypes").Brand<"Integer", import("runtypes").Constraint<Number, number, unknown>>]>>;
    favouriteColours: Array<Union<[import("runtypes").Brand<"HexColour", import("runtypes").Constraint<String, string, unknown>>, Union<[Literal<"red">, Literal<"green">, Literal<"blue">]>]>, false>;
    profile: Union<[Record<{
        type: Literal<"listener">;
        boughtTracks: import("runtypes").Brand<"NonNegativeInteger", Union<[import("runtypes").Brand<"NonNegative", import("runtypes").Constraint<Number, number, unknown>>, import("runtypes").Brand<"Integer", import("runtypes").Constraint<Number, number, unknown>>]>>;
    }, false>, Record<{
        type: Literal<"artist">;
        publishedTracks: import("runtypes").Brand<"NonNegativeInteger", Union<[import("runtypes").Brand<"NonNegative", import("runtypes").Constraint<Number, number, unknown>>, import("runtypes").Brand<"Integer", import("runtypes").Constraint<Number, number, unknown>>]>>;
    }, false>]>;
}, false>;
type UserJson = Static<typeof UserJson>;
type User = Omit<Static<typeof UserJson>, 'favouriteColours' | 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
    favouriteColours: Set<HexColourOrColour>;
};
export declare const decodeUser: (u: unknown) => Result<string, User>;
export declare const encodeUser: (_u: User) => Result<string, unknown>;
export {};

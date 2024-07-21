import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
declare const userJson: import("arktype").Type<{
    name: import("@arktype/schema").string.is<import("@arktype/schema").MoreThanLength<0> & import("@arktype/schema").LessThanLength<255>>;
    email: import("@arktype/schema").string.matching<"?">;
    createdAt: string;
    updatedAt: string;
    subscription: "free" | "pro" | "enterprise";
    stripeId: import("@arktype/schema").string.matching<string>;
    visits: import("@arktype/schema").number.is<import("@arktype/schema").MoreThan<0> & import("@arktype/schema").DivisibleBy<1>>;
    favouriteColours: ("red" | "green" | "blue" | import("@arktype/schema").string.matching<"^#[a-fA-F0-9]{6}$">)[];
}, {}>;
type UserJson = typeof userJson.infer;
type User = UserJson;
export declare const decodeUser: (u: unknown) => Result<string, User>;
export declare const encodeUser: (_u: User) => Result<'the lib cannot do it', never>;
export declare const meta: TrustedCompileTimeMeta;
export {};

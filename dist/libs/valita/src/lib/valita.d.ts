import * as v from '@badrap/valita';
import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
type FileSystem = ({
    type: 'directory';
    children: FileSystem[];
} | {
    type: 'file';
}) & {
    name: string;
};
declare const user: v.Type<{
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    subscription: "free" | "pro" | "enterprise";
    stripeId: string;
    visits: number;
    favouriteColours: Set<string>;
    profile: {
        type: "listener";
        boughtTracks: number;
    } | {
        type: "artist";
        publishedTracks: number;
    };
    fileSystem: FileSystem;
}>;
type User = v.Infer<typeof user>;
export declare const decodeUser: (u: unknown) => Result<unknown, User>;
export declare const encodeUser: (_u: User) => Result<unknown, unknown>;
export declare const meta: TrustedCompileTimeMeta;
export {};

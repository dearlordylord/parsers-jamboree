export type TrustedCompileTimeMeta = {
    items: TrustedCompileTimeMetaItems;
    explanations?: TrustedCompileTimeMetaExplanations;
};
export type TrustedCompileTimeMetaItems = {
    branded: boolean;
    typedErrors: boolean;
    templateLiterals: boolean;
};
export type TrustedCompileTimeMetaExplanations = {
    [K in keyof TrustedCompileTimeMetaItems]?: string;
};

// something that we can only find out compile time
export type TrustedCompileTimeMeta = {
  items: TrustedCompileTimeMetaItems;
  explanations?: TrustedCompileTimeMetaExplanations;
};

export type TrustedCompileTimeMetaItems = {
  branded: boolean;
  typedErrors: boolean;
  templateLiterals: boolean;
  emailFormatAmbiguityIsAccountedFor: boolean;
};

export type TrustedCompileTimeMetaExplanations = {
  [K in keyof TrustedCompileTimeMetaItems]?: string;
}

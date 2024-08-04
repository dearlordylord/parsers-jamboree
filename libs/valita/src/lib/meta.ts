import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `Default method is not present, no mention in docs.`,
  },
};

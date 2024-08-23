import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
    canGenerateJsonSchema: false,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `Default method is not present, no mention in docs.`,
    canGenerateJsonSchema: 'https://github.com/badrap/valita/issues/14',
  },
};

import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: false,
    acceptsTypedInput: false,
    canGenerateJsonSchema: true,
  },
  explanations: {
    canGenerateJsonSchema: 'Core feature, moved to a separate package https://github.com/DZakh/rescript-json-schema'
  },
};

import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false
  },
  explanations: {
    typedErrors:
      'https://ajv.js.org/guide/typescript.html#type-safe-error-handling - requires `as` - not good enough',
    emailFormatAmbiguityIsAccountedFor: `I assume the lib mirrors the standard, so it's rather "Not applicable".`
  }
};

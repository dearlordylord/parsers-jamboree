import type { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
    canGenerateJsonSchema: true,
  },
  explanations: {
    typedErrors:
      'https://ajv.js.org/guide/typescript.html#type-safe-error-handling - requires `as` - not good enough',
    emailFormatAmbiguityIsAccountedFor: `I assume the lib mirrors the standard, so it's rather "Not applicable".`,
    canGenerateJsonSchema:
      "Core feature. JSON Schema is a parser definition language here. It's not exactly 'generates' JSON Schema, it *is* JSON Schema.",
  },
};

import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: true,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: true,
    canGenerateJsonSchema: true,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `A default method purposely is not provided, disclaimer is there https://github.com/effect-ts/effect/tree/main/packages/schema#email`,
    acceptsTypedInput: `And "unknown"s are parsed explicitly with decodeUnknown* APIs`,
    canGenerateJsonSchema: 'Core feature https://github.com/effect-ts/effect/tree/main/packages/schema#generating-json-schemas'
  },
};

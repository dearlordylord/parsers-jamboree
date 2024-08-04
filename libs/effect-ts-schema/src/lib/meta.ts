import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: true,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: true,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `A default method purposely is not provided, disclaimer is there https://github.com/effect-ts/effect/tree/main/packages/schema#email`,
    acceptsTypedInput: `And "unknown"s are parsed explicitly with decodeUnknown* APIs`,
  },
};

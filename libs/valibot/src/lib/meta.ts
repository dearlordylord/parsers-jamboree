import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
    canGenerateJsonSchema: true,
  },
  explanations: {
    templateLiterals:
      "Not natively supported + I didn't manage to hack them into working without casting, see code comments.",
    emailFormatAmbiguityIsAccountedFor: `A disclaimer is present in the docs https://valibot.dev/api/email/`,
    canGenerateJsonSchema:
      '3rd-party library, https://github.com/gcornut/valibot-json-schema',
  },
};

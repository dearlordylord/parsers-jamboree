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
      'Recognized but not supported yet https://github.com/colinhacks/zod/issues/566#issuecomment-890422215 https://github.com/colinhacks/zod/issues/419',
    emailFormatAmbiguityIsAccountedFor: `The author's stance on emails is in GitHub https://github.com/colinhacks/zod/pull/2157 but not explicit in docs. I left a PR, and marking this pass in good faith.`,
    canGenerateJsonSchema:
      '3rd-party library, but actively maintained / popular: https://github.com/StefanTerdell/zod-to-json-schema',
  },
};

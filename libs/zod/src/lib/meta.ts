import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: false,
    acceptsTypedInput: false,
  },
  explanations: {
    templateLiterals:
      'Recognized but not supported yet https://github.com/colinhacks/zod/issues/566#issuecomment-890422215 https://github.com/colinhacks/zod/issues/419',
    emailFormatAmbiguityIsAccountedFor: `The author's stance on emails is in GitHub https://github.com/colinhacks/zod/pull/2157 but not explicit in docs.`,
  },
};

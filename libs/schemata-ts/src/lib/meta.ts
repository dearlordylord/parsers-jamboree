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
    emailFormatAmbiguityIsAccountedFor: `Derives RFC 5321 email with https://github.com/skeate/kuvio string combinators. In good faith, I assume it works.`,
  },
};

import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor:
      'The user of the library is prompted to create their own custom email validator.',
  },
};

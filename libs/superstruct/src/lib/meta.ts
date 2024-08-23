import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
    canGenerateJsonSchema: false,
  },
  explanations: {
    typedErrors:
      '.validate() loses coercions e.g. IsoDate; I have to choose either or',
    emailFormatAmbiguityIsAccountedFor:
      'The user of the library is prompted to create their own custom email validator.',
    canGenerateJsonSchema:
      "https://github.com/ianstormtaylor/superstruct?tab=readme-ov-file#why principal author's position",
  },
};

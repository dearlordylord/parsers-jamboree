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
    emailFormatAmbiguityIsAccountedFor: `Derives RFC 5321 email with https://github.com/skeate/kuvio string combinators. In good faith, I assume it works.`,
    canGenerateJsonSchema:
      'Core feature https://github.com/jacob-alford/schemata-ts?tab=readme-ov-file#json-schema-draft-7-2019-09-and-2020-12',
  },
};

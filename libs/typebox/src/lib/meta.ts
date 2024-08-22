import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: true,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
    canGenerateJsonSchema: true,
  },
  explanations: {
    branded: 'Can be simulated with decode/encode but no native support',
    templateLiterals:
      'https://github.com/sinclairzx81/typebox?tab=readme-ov-file#template-literal-types',
    typedErrors:
      "Value.Check() + Value.Errors() can be used, but it loses transformations; features don't compose so I have to fail one of them arbitrarily.",
    emailFormatAmbiguityIsAccountedFor: `A default email format check method doesn't work so I assume it's not defined at all. See also Ajv email explanation for more context.`,
    canGenerateJsonSchema: 'Core feature'
  },
};

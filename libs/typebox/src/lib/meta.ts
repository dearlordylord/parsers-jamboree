import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
  },
  explanations: {
    branded: 'Can be simulated with decode/encode but no native support',
    templateLiterals:
      'Can be simulated with decode/encode but no native support',
    typedErrors:
      "Value.Check() + Value.Errors() can be used, but it loses transformations; features don't compose so I have to fail one of them arbitrarily.",
    emailFormatAmbiguityIsAccountedFor: `A default email format check method doesn't work so I assume it's not defined at all. See also Ajv email explanation for more context.`,
  },
};

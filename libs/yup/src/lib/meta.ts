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
    emailFormatAmbiguityIsAccountedFor: `Default method is present with a warning https://github.com/jquense/yup?tab=readme-ov-file#stringemailmessage-string--function-schema`,
  },
};

import { TrustedCompileTimeMeta } from '@parsers-jamboree/common';

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: false,
    acceptsTypedInput: false,
    canGenerateJsonSchema: false,
  },
  explanations: {
    templateLiterals: 'WIP https://github.com/arktypeio/arktype/issues/491',
    branded: 'WIP https://github.com/arktypeio/arktype/issues/741',
    emailFormatAmbiguityIsAccountedFor: `A default method is provided but there's no disclaimer in the docs. The valid email assumed to be /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$/ in source code. I think this is because the docs aren't fully there yet.`,
    canGenerateJsonSchema: 'In plans https://github.com/arktypeio/arktype/issues/776'
  },
};

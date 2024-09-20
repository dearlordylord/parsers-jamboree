import { LIBS } from './runtimes.ts';

type Rogues = {
  [K in (typeof LIBS)[number]]: {
    label: string;
    link: string;
  };
};
export const rogues: Rogues = {
  'schemata-ts': {
    label: 'schemata-ts',
    link: 'https://github.com/jamband/schemata-ts'
  },
  zod: {
    label: 'zod',
    link: 'https://github.com/colinhacks/zod'
  },
  arktype: {
    label: 'arktype',
    link: 'https://github.com/arktypeio/arktype'
  },
  'effect-schema': {
    label: 'effect-schema',
    link: 'https://github.com/effect-ts/effect/tree/main/packages/schema'
  },
  typebox: {
    label: 'typebox',
    link: 'https://github.com/sinclairzx81/typebox'
  },
  valibot: {
    label: 'valibot',
    link: 'https://github.com/fabian-hiller/valibot'
  },
  runtypes: {
    label: 'runtypes',
    link: 'https://github.com/runtypes/runtypes'
  },
  ajv: {
    label: 'ajv',
    link: 'https://github.com/ajv-validator/ajv'
  },
  yup: {
    label: 'yup',
    link: 'https://github.com/jquense/yup'
  },
  superstruct: {
    label: 'superstruct',
    link: 'https://github.com/ianstormtaylor/superstruct'
  },
  valita: {
    label: 'valita',
    link: 'https://github.com/badrap/valita'
  },
  'rescript-schema': {
    label: 'rescript-schema',
    link: 'https://github.com/DZakh/rescript-schema'
  },
  decoders: {
    label: 'decoders',
    link: 'https://github.com/nvie/decoders'
  }
};

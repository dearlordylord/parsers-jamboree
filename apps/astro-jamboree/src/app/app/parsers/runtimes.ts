import type { TesterArgs } from '@parsers-jamboree/checker/breaker';
import * as schemataTs from '@parsers-jamboree/schemata-ts/schemata-ts';
import { meta as schemataMeta } from '@parsers-jamboree/schemata-ts/meta';
import * as zod from '@parsers-jamboree/zod/zod';
import { meta as zodMeta } from '@parsers-jamboree/zod/meta';
import * as arktype from '@parsers-jamboree/arktype/arktype';
import { meta as arktypeMeta } from '@parsers-jamboree/arktype/meta';
import * as effectSchema from '@parsers-jamboree/effect-ts-schema/effect-ts-schema';
import { meta as effectSchemaMeta } from '@parsers-jamboree/effect-ts-schema/meta';
import * as typebox from '@parsers-jamboree/typebox/typebox';
import { meta as typeboxMeta } from '@parsers-jamboree/typebox/meta';
import * as valibot from '@parsers-jamboree/valibot/valibot';
import { meta as valibotMeta } from '@parsers-jamboree/valibot/meta';
import * as runtypes from '@parsers-jamboree/runtypes/runtypes';
import { meta as runtypesMeta } from '@parsers-jamboree/runtypes/meta';
import * as ajv from '@parsers-jamboree/ajv/ajv';
import { meta as ajvMeta } from '@parsers-jamboree/ajv/meta';
import * as yup from '@parsers-jamboree/yup/yup';
import { meta as yupMeta } from '@parsers-jamboree/yup/meta';
import * as superstruct from '@parsers-jamboree/superstruct/superstruct';
import { meta as superstructMeta } from '@parsers-jamboree/superstruct/meta';
import * as valita from '@parsers-jamboree/valita/valita';
import { meta as valitaMeta } from '@parsers-jamboree/valita/meta';
import * as rescriptSchema from '@parsers-jamboree/rescript-schema/rescript-schema';
import { meta as rescriptSchemaMeta } from '@parsers-jamboree/rescript-schema/meta';
import * as decoders from '@parsers-jamboree/decoders/decoders';
import { meta as decodersMeta } from '@parsers-jamboree/decoders/meta';
import * as RA from 'fp-ts/lib/ReadOnlyArray.js';
import { pipe } from 'fp-ts/lib/function.js';
import { Ord } from 'fp-ts/lib/string.js';

export const LIBS = pipe(
  [
    'schemata-ts',
    'zod',
    'arktype',
    'effect-schema',
    'typebox',
    'valibot',
    'runtypes',
    'ajv',
    'yup',
    'superstruct',
    'valita',
    'rescript-schema',
    'decoders',
  ] as const,
  RA.sort(Ord)
);

export type Lib = typeof LIBS[number];

export const libRuntimes: {
  [K in (typeof LIBS)[number]]: TesterArgs;
} = {
  'schemata-ts': {
    ...schemataTs,
    meta: schemataMeta,
  },
  zod: {
    ...zod,
    meta: zodMeta,
  },
  arktype: {
    ...arktype,
    meta: arktypeMeta,
  },
  'effect-schema': {
    ...effectSchema,
    meta: effectSchemaMeta,
  },
  typebox: {
    ...typebox,
    meta: typeboxMeta,
  },
  valibot: {
    ...valibot,
    meta: valibotMeta,
  },
  runtypes: {
    ...runtypes,
    meta: runtypesMeta,
  },
  ajv: {
    ...ajv,
    meta: ajvMeta,
  },
  yup: {
    ...yup,
    meta: yupMeta,
  },
  superstruct: {
    ...superstruct,
    meta: superstructMeta,
  },
  valita: {
    ...valita,
    meta: valitaMeta,
  },
  'rescript-schema': {
    ...rescriptSchema,
    meta: rescriptSchemaMeta,
  },
  decoders: {
    ...decoders,
    meta: decodersMeta,
  },
};

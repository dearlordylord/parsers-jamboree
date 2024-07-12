import { TesterArgs } from '@parsers-jamboree/checker/breaker';
import * as schemataTs from '@parsers-jamboree/schemata-ts/schemata-ts';
import * as zod from '@parsers-jamboree/zod/zod';
import * as arktype from '@parsers-jamboree/arktype/arktype';
import * as effectSchema from '@parsers-jamboree/effect-ts-schema/effect-ts-schema';
import * as typebox from '@parsers-jamboree/typebox/typebox';
import * as valibot from '@parsers-jamboree/valibot/valibot';
import * as runtypes from '@parsers-jamboree/runtypes/runtypes';
import * as ajv from '@parsers-jamboree/ajv/ajv';
import * as yup from '@parsers-jamboree/yup/yup';
import * as superstruct from '@parsers-jamboree/superstruct/superstruct';

export const LIBS = [
  'schemata-ts',
  'zod',
  'arktype',
  'effect-schema',
  'typebox',
  'valibot',
  'runtypes',
  'ajv',
  'yup',
  'superstruct'
] as const;

export const libRuntimes: {
  [K in (typeof LIBS)[number]]: TesterArgs;
} = {
  'schemata-ts': schemataTs,
  zod: zod,
  arktype: arktype,
  'effect-schema': effectSchema,
  typebox: typebox,
  valibot: valibot,
  runtypes: runtypes,
  ajv: ajv,
  yup: yup,
  superstruct: superstruct
};

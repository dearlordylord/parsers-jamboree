import { codeToHtml } from 'shiki';
import { transformerTwoslash } from '@shikijs/twoslash';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { LIBS } from './apps/jamboree/src/app/parsers/runtimes';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const ajvPath = './libs/ajv/src/lib/ajv.ts';
const arktypePath = './libs/arktype/src/lib/arktype.ts';
const effectSchemaPath = './libs/effect-ts-schema/src/lib/effect-ts-schema.ts';
const runtypesPath = './libs/runtypes/src/lib/runtypes.ts';
const schemataTsPath = './libs/schemata-ts/src/lib/schemata-ts.ts';
const superstructPath = './libs/superstruct/src/lib/superstruct.ts';
const typeboxPath = './libs/typebox/src/lib/typebox.ts';
const valibotPath = './libs/valibot/src/lib/valibot.ts';
const valitaPath = './libs/valita/src/lib/valita.ts';
const yupPath = './libs/yup/src/lib/yup.ts';
const zodPath = './libs/zod/src/lib/zod.ts';
const rescriptSchemaPath = './libs/rescript-schema/src/lib/rescript-schema.ts';
const decodersPath = './libs/decoders/src/lib/decoders.ts';

const sources: {
  [K in (typeof LIBS)[number]]: string;
} = {
  ajv: ajvPath,
  arktype: arktypePath,
  'effect-schema': effectSchemaPath,
  runtypes: runtypesPath,
  'schemata-ts': schemataTsPath,
  superstruct: superstructPath,
  typebox: typeboxPath,
  valibot: valibotPath,
  valita: valitaPath,
  yup: yupPath,
  zod: zodPath,
  'rescript-schema': rescriptSchemaPath,
  decoders: decodersPath,
};

const rewriteCommonLibPath = (code: string) =>
  code.replace('@parsers-jamboree/common', './libs/common/src/index');

Object.entries(sources).forEach(([lib, path]) => {
  const promise = readFile(path, 'utf8');
  promise
    .then((code) =>
      codeToHtml(rewriteCommonLibPath(code), {
        lang: 'ts',
        theme: 'vitesse-dark',
        transformers: [transformerTwoslash()],
      })
    )
    .then((html) => {
      return writeFile(`./apps/jamboree/src/generated/${lib}.html`, html);
    });
});

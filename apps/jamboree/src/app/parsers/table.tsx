import { SchemataPage } from './pages/schemata-ts';
import { ZodPage } from './pages/zod';
import { ArktypePage } from './pages/arktype';
import { EffectSchemaPage } from './pages/effect-schema';
import { TypeboxPage } from './pages/typebox';
import { ValibotPage } from './pages/valibot';
import { RuntypesPage } from './pages/runtypes';
import { AjvPage } from './pages/ajv';
import { YupPage } from './pages/yup';
import { SuperstructPage } from './pages/superstruct';
import React from 'react';
import { Link } from 'react-router-dom';
import { runTesters } from '@parsers-jamboree/checker/breaker';
import IconHeart from '~icons/mdi/heart';
import IconHeartBroken from '~icons/mdi/heart-broken';
import { libRuntimes, LIBS } from './runtimes';
import { headStrict } from '../utils';

export const parserTableColumn = (lib: typeof LIBS[number]) => [
  ...runTesters(libRuntimes[lib]).map(({key, title, success}) => ({
    name: key,
    c: success ? <IconHeart color="red"/> : <IconHeartBroken/>,
  })),
]

type Rogues = {
  [K in (typeof LIBS)[number]]: {
    label: string;
    link: string;
  };
};

export const pages: {
  [K in (typeof LIBS)[number]]: React.FC;
} = {
  'schemata-ts': SchemataPage,
  zod: ZodPage,
  arktype: ArktypePage,
  'effect-schema': EffectSchemaPage,
  typebox: TypeboxPage,
  valibot: ValibotPage,
  runtypes: RuntypesPage,
  ajv: AjvPage,
  yup: YupPage,
  superstruct: SuperstructPage,
};

export const rogues: Rogues = {
  'schemata-ts': {
    label: 'schemata-ts',
    link: 'https://github.com/jamband/schemata-ts',
  },
  zod: {
    label: 'zod',
    link: 'https://github.com/colinhacks/zod',
  },
  arktype: {
    label: 'arktype',
    link: 'https://github.com/arktypeio/arktype',
  },
  'effect-schema': {
    label: 'effect-schema',
    link: 'https://github.com/effect-ts/effect/tree/main/packages/schema',
  },
  typebox: {
    label: 'typebox',
    link: 'https://github.com/sinclairzx81/typebox',
  },
  valibot: {
    label: 'valibot',
    link: 'https://github.com/fabian-hiller/valibot',
  },
  runtypes: {
    label: 'runtypes',
    link: 'https://github.com/runtypes/runtypes',
  },
  ajv: {
    label: 'ajv',
    link: 'https://github.com/ajv-validator/ajv',
  },
  yup: {
    label: 'yup',
    link: 'https://github.com/jquense/yup',
  },
  superstruct: {
    label: 'superstruct',
    link: 'https://github.com/ianstormtaylor/superstruct',
  },
};




export const ParserTable = (): React.ReactElement => {
  const results = LIBS.map((lib) => parserTableColumn(lib));
  // assume format is stable
  const firstColumn = headStrict(results);
  return (
    <div>
      <table>
        <thead>
        <tr>
          <th></th>
          {LIBS.map((lib) => (
            <th key={lib}><Link to={`/${lib}`}>{rogues[lib].label}</Link></th>
          ))}
        </tr>
        </thead>
        <tbody>
        {firstColumn.map(({name}, i) => <tr>
          <td>{name}</td>
          {results.map((row) => <td key={i}>{row[i].c}</td>)}
        </tr>)}
        </tbody>

      </table>
    </div>
  );
};

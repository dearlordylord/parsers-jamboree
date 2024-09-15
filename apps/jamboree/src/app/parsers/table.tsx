import { SchemataPage } from './pages/schemata-ts';
import { ZodPage } from './pages/zod';
import { ArktypePage } from './pages/arktype';
import { EffectSchemaPage } from './pages/effect-schema';
import { TypeboxPage } from './pages/typebox';
import { ValibotPage } from './pages/valibot';
import { ValitaPage } from './pages/valita';
import { RuntypesPage } from './pages/runtypes';
import { AjvPage } from './pages/ajv';
import { YupPage } from './pages/yup';
import { SuperstructPage } from './pages/superstruct';
import { RescriptSchemaPage } from './pages/rescript-schema';
import { DecodersPage } from './pages/decoders';
import React from 'react';
import { Link } from 'react-router-dom';
import { runTesters } from '@parsers-jamboree/checker/breaker';
import IconHeart from '~icons/mdi/heart';
import IconHeartBroken from '~icons/mdi/heart-broken';
import { libRuntimes, LIBS } from './runtimes';
import { headStrict } from '../utils';
import { TestNameAndExplanation } from './testNameAndExplanation';
import { useIsIframe } from '../iframe';
import { ExternalLink } from 'lucide-react';

export const parserTableColumn = (lib: (typeof LIBS)[number]) => [
  ...runTesters(libRuntimes[lib]).map(({ key, title, success }) => ({
    name: key,
    title,
    c: success ? <IconHeart color="red" /> : <IconHeartBroken />,
  })),
];

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
  valita: ValitaPage,
  'rescript-schema': RescriptSchemaPage,
  decoders: DecodersPage,
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
  valita: {
    label: 'valita',
    link: 'https://github.com/badrap/valita',
  },
  'rescript-schema': {
    label: 'rescript-schema',
    link: 'https://github.com/DZakh/rescript-schema',
  },
  decoders: {
    label: 'decoders',
    link: 'https://github.com/nvie/decoders',
  },
};

export const ParserTable = (): React.ReactElement => {
  const results = LIBS.map((lib) => parserTableColumn(lib));
  // assume format is stable
  const firstColumn = headStrict(results);
  const isIframe = useIsIframe();
  /*
  <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow-lg rounded-lg">
        <thead>
        <tr className="bg-gray-100">
          <th className="p-3 text-left font-semibold text-gray-600"></th>
          {LIBS.map((lib) => (
            <th key={lib} className="p-3 text-left font-semibold text-gray-600">
              {isIframe ? (
                <a href={`${rogues[lib].link}`} target="_blank" rel="noopener noreferrer"
                   className="flex items-center text-blue-600 hover:text-blue-800">
                  {rogues[lib].label}
                  <ExternalLink className="ml-1 w-4 h-4"/>
                </a>
              ) : (
                <Link to={`/${lib}`} className="flex items-center text-blue-600 hover:text-blue-800">
                  {rogues[lib].label}
                  <ExternalLink className="ml-1 w-4 h-4"/>
                </Link>
              )}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {firstColumn.map(({name, title}, i) => (
          <tr key={`${name}-${i}`} className="hover:bg-amber-950 transition-colors duration-150">
            <td className="p-3 border-t">
              <TestNameAndExplanation name={name} explanation={title}/>
            </td>
            {results.map((row, j) => (
              <td key={`${i}-${j}`} className="p-3 border-t text-center">
                {isIframe ? (
                  <a href={`${rogues[LIBS[j]].link}`} target="_blank" rel="noopener noreferrer"
                     className="text-red-500 hover:text-red-700">
                    {row[i].c}
                  </a>
                ) : (
                  <Link to={`/${LIBS[j]}`} className="text-red-500 hover:text-red-700">
                    {row[i].c}
                  </Link>
                )}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
   */
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow-lg rounded-lg">
        <thead>
          <tr key="header">
            <th className="p-3 text-left font-semibold"></th>
            {LIBS.map((lib) => (
              <th key={lib} className="p-3 text-left font-semibold">
                {isIframe ? (
                  <Link target="_blank" to={`${rogues[lib].link}`}>
                    {rogues[lib].label}
                  </Link>
                ) : (
                  <Link to={`/${lib}`} className="flex items-center">{rogues[lib].label}<ExternalLink className="ml-1 w-4 h-4"/></Link>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {firstColumn.map(({ name, title }, i) => (
            <tr key={`${name}-${i}`} className={i % 2 === 0 ? 'bg-amber-950' : ''}>
              <td>
                <TestNameAndExplanation name={name} explanation={title} />
              </td>
              {results.map((row, j) => (
                <td key={i}><div className="flex justify-center"><Link to={`/${LIBS[j]}`} className="">{row[i].c}</Link></div></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

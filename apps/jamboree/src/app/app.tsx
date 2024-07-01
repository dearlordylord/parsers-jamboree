// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import { SchemataPage } from './parsers/pages/schemata-ts';
import { ZodPage } from './parsers/pages/zod';
import React from 'react';
import { ArktypePage } from './parsers/pages/arktype';
import { EffectSchemaPage } from './parsers/pages/effect-schema';
import { TypeboxPage } from './parsers/pages/typebox';
import { ValibotPage } from './parsers/pages/valibot';
import { VinejsPage } from './parsers/pages/vinejs';
import { RuntypesPage } from './parsers/pages/runtypes';
import { AjvPage } from './parsers/pages/ajv';

const LIBS = [
  'schemata-ts',
  'zod',
  'arktype',
  'effect-schema',
  'typebox',
  'valibot',
  'vinejs',
  'runtypes',
  'ajv',
] as const;

type Rogues = {
  [K in (typeof LIBS)[number]]: {
    label: string;
    link: string;
    page: React.FC;
  };
};

const rogues: Rogues = {
  'schemata-ts': {
    label: 'schemata-ts',
    link: 'https://github.com/jamband/schemata-ts',
    page: SchemataPage,
  },
  zod: {
    label: 'zod',
    link: 'https://github.com/colinhacks/zod',
    page: ZodPage,
  },
  arktype: {
    label: 'arktype',
    link: 'https://github.com/arktypeio/arktype',
    page: ArktypePage,
  },
  'effect-schema': {
    label: 'effect-schema',
    link: 'https://github.com/effect-ts/effect/tree/main/packages/schema',
    page: EffectSchemaPage,
  },
  typebox: {
    label: 'typebox',
    link: 'https://github.com/sinclairzx81/typebox',
    page: TypeboxPage,
  },
  valibot: {
    label: 'valibot',
    link: 'https://github.com/fabian-hiller/valibot',
    page: ValibotPage,
  },
  vinejs: {
    label: 'vinejs',
    link: 'https://github.com/vinejs/vine',
    page: VinejsPage,
  },
  runtypes: {
    label: 'runtypes',
    link: 'https://github.com/runtypes/runtypes',
    page: RuntypesPage,
  },
  ajv: {
    label: 'ajv',
    link: 'https://github.com/ajv-validator/ajv',
    page: AjvPage,
  }
};

export function App() {
  return (
    <div>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {Object.entries(rogues).map(([name, { label, link }]) => (
            <li key={name}>
              <Link to={`/${name}`}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<div>Main Page</div>} />
        {Object.entries(rogues).map(([name, { label, link, page: Page }]) => (
          <Route key={name} path={`/${name}`} element={<Page />} />
        ))}
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;

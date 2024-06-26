// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import { SchemataPage } from './parsers/schemata-ts/page';
import React from 'react';

const LIBS = ['schemata-ts'] as const;

type Rogues = {
  [K in typeof LIBS[number]]: {
    label: string;
    link: string;
    page: React.FC;
  };
}

const rogues: Rogues = {
  'schemata-ts': {
    label: 'schemata-ts',
    link: 'https://github.com/jamband/schemata-ts',
    page: SchemataPage,
  }
}

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
        <Route
          path="/"
          element={
            <div>
              Main Page
            </div>
          }
        />
        {Object.entries(rogues).map(([name, { label, link, page: Page }]) => (
          <Route
            key={name}
            path={`/${name}`}
            element={
              <Page />
            }
          />
        ))}

      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
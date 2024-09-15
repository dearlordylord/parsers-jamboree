// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import React from 'react';
import { pages, ParserTable, rogues } from './parsers/table';
import { LIBS } from './parsers/runtimes';
import { Index } from './index';
import { ABOUT_ROUTE, SUMMARY_ROUTE, TEST_CASE_ROUTE } from './constants';
import { TestCase } from './testCase';
import { About } from './about';
import { Navigation } from './navigation';
import { Layout } from './layout';

export function App() {
  return (
    <div>
      <Navigation />
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <Index />
            }
          />
          <Route
            path={`/${SUMMARY_ROUTE}`}
            element={
              <ParserTable />
            }
          />
          <Route
            path={`/${TEST_CASE_ROUTE}`}
            element={
              <TestCase />
            }
          />
          <Route
            path={`/${ABOUT_ROUTE}`}
            element={
              <About />
            }
          />
          {Object.entries(rogues).map(([name, { label, link }]) => (
            <Route
              key={name}
              path={`/${name}`}
              element={React.createElement(pages[name as (typeof LIBS)[number]])}
            />
          ))}
        </Routes>
      </Layout>
    </div>
  );
}

export default App;

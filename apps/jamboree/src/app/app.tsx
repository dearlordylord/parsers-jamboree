// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import React from 'react';
import { pages, ParserTable, rogues } from './parsers/table';
import { LIBS } from './parsers/runtimes';

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
              <span> </span>
              <span style={{ fontSize: '0.5em' }}>
                <a href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<div>
          <ParserTable />
        </div>} />
        {Object.entries(rogues).map(([name, { label, link }]) => (
          <Route key={name} path={`/${name}`} element={React.createElement(pages[name as typeof LIBS[number]])} />
        ))}
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;

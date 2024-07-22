// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import React from 'react';
import { pages, ParserTable, rogues } from './parsers/table';
import { LIBS } from './parsers/runtimes';


export function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <br/>
              <hr/>
              <br/>
              <div role="navigation">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/summary">Summary</Link>
                  </li>
                  {LIBS.map((name) => (
                    <li key={name}>
                      <Link to={`/${name}`}>{rogues[name].label}</Link>
                      <span> </span>
                      <span style={{fontSize: '0.5em'}}>
                <a href={rogues[name].link} target="_blank" rel="noreferrer">
                  {rogues[name].link}
                </a>
              </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          }
        />
        <Route
          path="/summary"
          element={
            <div>
              <ParserTable/>
            </div>
          }
        />
        {Object.entries(rogues).map(([name, {label, link}]) => (
          <Route
            key={name}
            path={`/${name}`}
            element={React.createElement(pages[name as (typeof LIBS)[number]])}
          />
        ))}
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;

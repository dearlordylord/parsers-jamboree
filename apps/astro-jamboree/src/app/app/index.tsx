import { ParserTable } from './parsers/table';
import React from 'react';
import { FeaturesAbstractList } from './features/abstract/list';
import { TEST_CASE_ROUTE } from './constants';

export const Index = ({isIframe}: {isIframe: boolean}) =>
  <div>
    <h1>TypeScript validator libraries feature tests</h1>
    <p>This app is a <b>feature test</b> for Typescript validator (or, as they also called, "parser" or "codec") libraries.</p>
    <p>The app is <b>not a performance benchmark</b>: for performance comparison, see <a href="https://moltar.github.io/typescript-runtime-type-benchmarks/">this awesome app</a>.</p>
    <p>The <a className="text-blue-600 hover:text-blue-800" href={`/${TEST_CASE_ROUTE}`}>test case</a> is a generic data structure in combination with a set of "ways to break its invariants".</p>
    <p>The test case checks such features as:</p>
    <FeaturesAbstractList />
    <p>The table below shows the results of each test against each library.</p>
    <p>For each library-specific code and details, <b>click on the library name</b>.</p>
    <div>
      <ParserTable isIframe={isIframe} />
    </div>
  </div>

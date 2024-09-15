import { ParserTable } from './parsers/table';
import React from 'react';
import { FeaturesAbstractList } from './features/abstract/list';
import { Link } from 'react-router-dom';
import { TEST_CASE_ROUTE } from './constants';

export const Index = () =>
  <div>
    <p>This app is a benchmark for Typescript validator (or, as they also called, "parser" or "codec") libraries.</p>
    <p>The <Link className="text-blue-600 hover:text-blue-800" to={`/${TEST_CASE_ROUTE}`}>test case</Link> is a generic data structure in combination with a set of "ways to break its invariants".</p>
    <p>The test case checks such features as:</p>
    <FeaturesAbstractList />
    <p>The table below shows the results of each test against each library.</p>
    <p>For each library-specific code and details, <b>click on the library name</b>.</p>
    <div>
      <ParserTable />
    </div>
  </div>

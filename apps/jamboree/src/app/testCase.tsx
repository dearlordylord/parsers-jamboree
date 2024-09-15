import { Highlighter } from './highlighter';
import code from '../generated/commonInterface.html?raw';
import { FeaturesAbstractList } from './features/abstract/list';
import React from 'react';
import { BREAKER_DESCRIPTIONS, BreakerKey, BREAKERS } from '@parsers-jamboree/checker/breaker';
import { JAMBOREE_URL } from '@parsers-jamboree/common';

export const TestCase = () => {
  return <div>
    <h1>Validator test case details</h1>
    <p>The test case data structure type looks like this:</p>
    <div dangerouslySetInnerHTML={{__html: code}}/>
    <h3>The "abstract" features checked are:</h3>
    <FeaturesAbstractList />
    <h3>Specifically, the tests are:</h3>
    <ul className="list-disc list-inside">
      {Object.entries(BREAKER_DESCRIPTIONS).map(([k, v]) =>
        <li key={k}>{k}: {v}</li>
      )}
    </ul>
    <p>Most of the tests are performed automatically, the others you have to take my word for it (or check the code). PRs are welcome.</p>
    <p>More detailed test case description and more context can be found in my <a target="_blank" rel="noreferrer" href={JAMBOREE_URL}>blog post</a>.
    </p>
  </div>;
}

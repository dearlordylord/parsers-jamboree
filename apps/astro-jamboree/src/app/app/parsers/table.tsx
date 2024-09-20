import React from 'react';
import { runTesters } from '@parsers-jamboree/checker/breaker';
import { libRuntimes, LIBS } from './runtimes';
import { headStrict } from '../utils';
import { TestNameAndExplanation } from './testNameAndExplanation';
import { HearthRed, HeathBorken, LinkIcon } from '../icons';
import { rogues } from './meta.ts';

export const parserTableColumn = (lib: (typeof LIBS)[number]) => [
  ...runTesters(libRuntimes[lib]).map(({ key, title, success }) => ({
    name: key,
    title,
    c: success ? <HearthRed /> : <HeathBorken />,
  })),
];

export const ParserTable = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  const results = LIBS.map((lib) => parserTableColumn(lib));
  // assume format is stable
  const firstColumn = headStrict(results);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow-lg rounded-lg">
        <thead>
          <tr key="header">
            <th className="p-3 text-left font-semibold"></th>
            {LIBS.map((lib) => (
              <th key={lib} className="p-3 text-left font-semibold">
                {isIframe ? (
                  <a target="_blank" href={`${rogues[lib].link}`}>
                    {rogues[lib].label}
                  </a>
                ) : (
                  <a href={`/${lib}`} className="flex items-center">{rogues[lib].label}
                    <LinkIcon />
                  </a>
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
              <td key={i}>
                <div className="flex justify-center"><a href={`/${LIBS[j]}`} className="">{row[i].c}</a></div>
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

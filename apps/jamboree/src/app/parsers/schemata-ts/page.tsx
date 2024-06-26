import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker';
import { encodeUser, parseUser } from '@parsers-jamboree/schemata-ts/schemata-ts';
import code from '../../../../../../libs/schemata-ts/src/lib/schemata-ts.ts?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import Editor from '@monaco-editor/react';
import { JSONTree } from 'react-json-tree';
import { Highlighter } from '../../highlighter';
import { showParseResult } from '../../utils';
import { Result } from '@parsers-jamboree/common';

const defaultInput = JSON.stringify(igor, null, 2);
// monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   common,
//   'schemata-ts/schemata/index');

// const code = code_.replace(/import .+ from '@parsers-jamboree\/common'/g, common);

export const SchemataPage = (): React.ReactElement => {
  const [input, setInput] = useState(defaultInput);
  const parsedInputJson = useMemo((): Result<unknown, unknown> => {
    try {
      return {
        _tag: 'right',
        value: JSON.parse(input),
      };
    } catch (e) {
      return {
        _tag: 'left',
        error: (e as any).message,
      };
    }
  }, [input]);
  // to pretty print output to match the editor input key order
  const printKeyOrder = parsedInputJson._tag === 'left' ? [] : Object.keys(parsedInputJson.value as Record<string, unknown>);
  const printKeyOrderF = (k1: unknown, k2: unknown) => printKeyOrder.indexOf(k1 as string) - printKeyOrder.indexOf(k2 as string);
  const [parserCode, setParserCode] = useState(code);
  const parsed = useMemo(() => parsedInputJson._tag === 'left' ? parsedInputJson : parseUser(parsedInputJson.value), [parsedInputJson]);
  const encoded = useMemo(() => parsed._tag === 'left' ? 'Parse step resulted in an error' : JSON.stringify(encodeUser(parsed.value), printKeyOrder, 2), [parsed]);
  const encodedMatchesInput = encoded === input;
  return (
    <div>
      <h1>Schemata Page</h1>
      <h2 id="input">Input</h2>
      <form onSubmit={() => setInput(defaultInput)}>
        {input !== defaultInput ? <button type="submit">Reset input</button> : null}
        <div>
          <Editor theme='vs-dark' height="300px" width="500px" language="json" value={input} onChange={e => {
            setInput(e || '');
          }}/>
        </div>

      </form>

      <h2>Parser code</h2>
      <div>
        <Highlighter content={parserCode} language="typescript"/>
      </div>
      <h2>Parsed result</h2>
      <div>
        {parsed._tag === 'left' ? <span>{JSON.stringify(parsed.error, null, 2)}</span> : <JSONTree data={parsed.value} sortObjectKeys={printKeyOrderF} hideRoot valueRenderer={(s, v) => {
          if (v instanceof Date) {
            return <span>{`JS Date('${s}')`}</span>;
          }
          return <span>{JSON.stringify(s)}</span>;
        }} />}
      </div>
      <h2>Encoded back to JSON</h2>
      <div>
        <Highlighter content={encoded} language="json" />
      </div>
      {encodedMatchesInput ? <span> ✅ Matches <a href="#input" onClick={(e) => {
        e.preventDefault();
        document.getElementById('input')?.scrollIntoView()
      }}>input</a></span> : null}
    </div>
  );
};

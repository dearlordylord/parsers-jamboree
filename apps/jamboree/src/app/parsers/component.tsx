import React, { useId, useMemo, useState } from 'react';
import { Result } from '@parsers-jamboree/common';
import Editor from '@monaco-editor/react';
import { Highlighter } from '../highlighter';
import { JSONTree, KeyPath } from 'react-json-tree';
import { igor } from '@parsers-jamboree/checker';
import { get } from '../utils';

type Props<T, E, EE> = {
  code: string;
  encodeUser: (u: T) => Result<EE, unknown>;
  decodeUser: (u: unknown) => Result<E, T>;
  defaultInput: unknown;
  validUser: typeof igor;
};

export const ParserComponent = <T, E, EE>({
  code,
  encodeUser,
  decodeUser,
  validUser,
}: Props<T, E, EE>): React.ReactElement => {
  const defaultInput = JSON.stringify(validUser, null, 2);
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
  const printKeyOrder =
    parsedInputJson._tag === 'left'
      ? []
      : Object.keys(parsedInputJson.value as Record<string, unknown>);
  const printKeyOrderF = (k1: unknown, k2: unknown) =>
    printKeyOrder.indexOf(k1 as string) - printKeyOrder.indexOf(k2 as string);
  const [parserCode, setParserCode] = useState(code);
  const parsed = useMemo(
    () =>
      parsedInputJson._tag === 'left'
        ? parsedInputJson
        : decodeUser(parsedInputJson.value),
    [parsedInputJson, decodeUser]
  );
  const encoded = useMemo(
    () =>
      parsed._tag === 'left'
        ? 'Parse step resulted in an error'
        : (() => {
            const result = encodeUser(parsed.value);
            if (result._tag === 'left') {
              return `Encode step resulted in an error ${JSON.stringify(
                result.error
              )}`;
            } else {
              return JSON.stringify(result.value, printKeyOrder, 2);
            }
          })(),
    [parsed, encodeUser]
  );
  const encodedMatchesInput = encoded === input;
  const inputId = useId();
  return (
    <div>
      <h2 id={inputId}>Input</h2>
      <form onSubmit={() => setInput(defaultInput)}>
        {input !== defaultInput ? (
          <button type="submit">Reset input</button>
        ) : null}
        <div>
          <Editor
            theme="vs-dark"
            height="300px"
            width="500px"
            language="json"
            value={input}
            onChange={(e) => {
              setInput(e || '');
            }}
          />
        </div>
      </form>

      <h2>Parser code</h2>
      <div>
        <Highlighter content={parserCode} language="typescript" />
      </div>
      <h2>Parsed result</h2>
      <div>
        {parsed._tag === 'left' ? (
          <span>{JSON.stringify(parsed.error, null, 2)}</span>
        ) : (
          <JSONTree
            data={parsed.value}
            sortObjectKeys={printKeyOrderF}
            hideRoot
            valueRenderer={(s, v) => {
              if (v instanceof Date) {
                return <span>{`JS Date('${s}')`}</span>;
              }
              return <span>{JSON.stringify(s)}</span>;
            }}
            labelRenderer={(
              keyPath: KeyPath,
              nodeType: string,
              expanded: boolean,
              expandable: boolean
            ) => {
              if (get(parsed.value, keyPath) instanceof Set) {
                return <span>(JS Set) {keyPath[0]}:</span>;
              }

              return <span>{keyPath[0]}:</span>;
            }}
          />
        )}
      </div>
      <h2>Encoded back to JSON</h2>
      <div>
        <Highlighter content={encoded} language="json" />
      </div>
      {encodedMatchesInput ? (
        <span>
          {' '}
          ✅ Matches{' '}
          <button
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(inputId)?.scrollIntoView();
            }}
          >
            input
          </button>
        </span>
      ) : null}
    </div>
  );
};

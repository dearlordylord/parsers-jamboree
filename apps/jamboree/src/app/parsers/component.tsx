import React, { useEffect, useId, useMemo, useState } from 'react';
import { Result, ResultValue } from '@parsers-jamboree/common';
import Editor from '@monaco-editor/react';
import { Highlighter } from '../highlighter';
import { JSONTree, KeyPath } from 'react-json-tree';
import { igor } from '@parsers-jamboree/checker';
import { get } from '../utils';

type Props<T, E, EE> = {
  code: string;
  encodeUser: (u: T) => Result<EE, unknown>;
  defaultInput: unknown;
  validUser: typeof igor;
} & ({
  type: 'normal'
  decodeUser: (u: unknown) => Result<E, T>;
} | {
  type: 'special'
  // for libs that only have async api; currently only vinejs
  decodeUserForcedAsync: (u: unknown) => Promise<Result<E, T>>;
});

export const ParserComponent = <T, E, EE>({
  code,
  encodeUser,
  validUser,
  ...rest
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
      : [
          ...Object.keys(parsedInputJson.value as Record<string, unknown>),
          /*special keys for profile, I don't want to bother with recursive parsing for now; TODO*/ ...Object.keys(
            igor.profile
          ),
        ];
  const printKeyOrderF = (k1: unknown, k2: unknown) =>
    printKeyOrder.indexOf(k1 as string) - printKeyOrder.indexOf(k2 as string);
  const [parserCode, setParserCode] = useState(code);
  const [parsed, setParsed] = useState<Result<unknown, T>>({ _tag: 'left', error: 'loading...'/*quick dirty fix for special async libs that have no sync interface for parsing*/ });
  useEffect(
    () => {
      if (parsedInputJson._tag === 'left') {
        return setParsed(parsedInputJson);
      }
      if (rest.type === 'normal') {
        return setParsed(rest.decodeUser(parsedInputJson.value));
      }
      if (rest.type === 'special') {
        return void rest.decodeUserForcedAsync(parsedInputJson.value).then(setParsed).catch(e => {

          console.error(e);
        });
      }
    },

    [parsedInputJson, rest.type === 'normal' ? rest.decodeUser : rest.decodeUserForcedAsync ]
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

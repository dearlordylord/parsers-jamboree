import React, { useEffect, useId, useMemo, useState, useRef } from 'react';
import type {
  Result,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';
import { Highlighter } from '../highlighter';
import type { KeyPath } from 'react-json-tree';
import { JSONTree } from 'react-json-tree';
import { igor } from '@parsers-jamboree/checker/checker';
import { get } from '../utils';
import { Breaker } from './breaker';
import { deepEqual } from '@parsers-jamboree/checker/utils';
import type { Lib } from './runtimes';
import { ExternalLink } from 'lucide-react';
import { rogues } from './meta.ts';
import Editor from '@monaco-editor/react';

type Props<T, E, EE> = {
  code: string;
  encodeUser: (u: T) => Result<EE, unknown>;
  validUser: typeof igor;
  decodeUser: (u: unknown) => Result<E, T>;
  meta: TrustedCompileTimeMeta;
  library: Lib;
  isIframe: boolean;
};

export const ParserComponent = <T, E, EE>({
  encodeUser,
  validUser,
  code,
  library,
  isIframe,
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
          ...new Set([
            ...Object.keys(parsedInputJson.value as Record<string, unknown>),
            /*special keys for profile, I don't want to bother with recursive parsing for now; TODO*/ ...Object.keys(
              igor.profile
            ),
            ...Object.keys(igor.fileSystem),
          ]),
        ].sort();
  const printKeyOrderF = (k1: unknown, k2: unknown) =>
    printKeyOrder.indexOf(k1 as string) - printKeyOrder.indexOf(k2 as string);
  const [parsed, setParsed] = useState<Result<unknown, T>>({
    _tag: 'left',
    error:
      'loading...' /*quick dirty fix for special async libs that have no sync interface for parsing*/,
  });
  // the useEffect() is a leftover from accomodating for vinejs speciality of forced async; change it to just sync call TODO
  useEffect(() => {
    if (parsedInputJson._tag === 'left') {
      return setParsed(parsedInputJson);
    }
    return setParsed(rest.decodeUser(parsedInputJson.value));
  }, [parsedInputJson, rest.decodeUser]);
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
  const encodedMatchesInput = useMemo(() => {
    try {
      return deepEqual(JSON.parse(input), JSON.parse(encoded));
    } catch (e) {
      return false;
    }
  }, [encoded, input]);
  const inputId = useId();
  return (
    <div>
      {isIframe ? null : <div className="flex flex-row justify-center">
        <div className="flex flex-col"><h1>{rogues[library].label}</h1><p><a className="flex items-center" target="_blank"
                                                   rel="noreferrer" href={rogues[library].link}>{rogues[library].link}
          <ExternalLink className="ml-1 w-4 h-4"/></a></p></div>
      </div>}
      <div style={{display: 'flex', flexWrap: 'wrap', paddingTop: '1rem'}}>
        <div style={{flex: '1 1 auto'}}>
          <h2>Feature test results</h2>
          <Breaker
            decodeUser={rest.decodeUser}
            encodeUser={encodeUser}
            meta={rest.meta}
          />
        </div>
        <div style={{ flex: '1 1 auto', flexWrap: 'wrap', display: 'flex' }}>
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ flex: '1 1 auto' }}>
              <h2 id={inputId}>Input</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInput(defaultInput);
                }}
              >
                {input !== defaultInput ? (
                  <button type="submit">Reset input</button>
                ) : null}
                <div>
                  {isIframe ? /*crashes the blog post by multiple editors in iframes*/<Highlighter content={input} language="json" /> :
                    <Editor
                    theme="vs-dark"
                    height="300px"
                    width="500px"
                    language="json"
                    value={input}
                    onChange={(e: any/*TODO typing*/) => {
                      setInput(e || '');
                    }}
                  />}
                </div>
              </form>
            </div>

            <div style={{ flex: '1 1 auto' }}>
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
            </div>
          </div>
          <div style={{ flex: '1 1 auto' }}>
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
        </div>
      </div>

      <h2>Parser code</h2>
      <div>
        {/*<Highlighter content={parserCode} language="typescript" />*/}
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    </div>
  );
};

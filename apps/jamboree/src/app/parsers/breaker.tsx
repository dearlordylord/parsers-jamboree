import { Result, TrustedCompileTimeMeta } from '@parsers-jamboree/common';
import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import IconHeart from '~icons/mdi/heart';
import IconHeartBroken from '~icons/mdi/heart-broken';
import { runTesters } from '@parsers-jamboree/checker/breaker';
import { FeatureNameAndExplanation } from './featureNameAndExplanation';

type Props = {
  decodeUser: (u: unknown) => Result<unknown, unknown>;
  encodeUser: (u: unknown) => Result<unknown, unknown>;
  meta: TrustedCompileTimeMeta;
};

export const Breaker = ({
  decodeUser,
  encodeUser,
  meta,
}: Props): React.ReactElement => {
  // sanity check that it parses a valid input at all
  const parsed = decodeUser(igor);
  if (parsed._tag === 'left') {
    return <div>Error: {JSON.stringify(parsed.error)}</div>;
  }
  const tests = runTesters({ decodeUser, encodeUser, meta });
  return (
    <div>
      <table>
        <tbody>
            {tests.map(({ key, title, customTitle, success }) => {
              return <tr key={key}>
                <td><FeatureNameAndExplanation name={key} explanation={title} customExplanation={customTitle}/></td>
                {(() => {
                  try {
                    return (
                      <td key={key}>
                        {success ? <IconHeart color="red" /> : <IconHeartBroken />}
                      </td>
                    );
                  } catch (e) {
                    console.error(e);
                    return <td key={key}>ERROR</td>;
                  }
                })()}
              </tr>

            })}
        </tbody>
      </table>
    </div>
  );
};

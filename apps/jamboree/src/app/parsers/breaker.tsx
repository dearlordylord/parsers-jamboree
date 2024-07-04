import { Result } from '@parsers-jamboree/common';
import React from 'react';
import {
  BREAKERS,
  BREAKER_DESCRIPTIONS,
} from '@parsers-jamboree/checker/breaker';
import { igor } from '@parsers-jamboree/checker/checker';
import IconHeart from '~icons/mdi/heart';
import IconHeartBroken from '~icons/mdi/heart-broken';

type Props = {
  decodeUser: (u: unknown) => Result<unknown, unknown>;
};

export const Breaker = ({ decodeUser }: Props): React.ReactElement => {
  // sanity check that it parses a valid input at all
  const parsed = decodeUser(igor);
  if (parsed._tag === 'left') {
    return <div>Error: {JSON.stringify(parsed.error)}</div>;
  }
  return (
    <div>
      <table>
        <tr>
          {Object.entries(BREAKERS).map(([k]) => {
            return (
              <th
                title={BREAKER_DESCRIPTIONS[k as keyof typeof BREAKERS]}
                key={k}
              >
                {k}
              </th>
            );
          })}
        </tr>
        <tr>
          {Object.entries(BREAKERS).map(([k, f]) => {
            const parsed = decodeUser(f(igor));
            return (
              <td key={k}>
                {parsed._tag === 'left' ? (
                  <IconHeart color="red" />
                ) : (
                  <IconHeartBroken />
                )}
              </td>
            );
          })}
        </tr>
      </table>
    </div>
  );
};

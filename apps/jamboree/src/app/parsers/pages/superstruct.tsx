import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import {
  encodeUser,
  decodeUser,
} from '@parsers-jamboree/superstruct/superstruct';
import code from '../../../../../../libs/superstruct/src/lib/superstruct?raw';
import { ParserComponent } from '../component';

export const SuperstructPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Superstruct Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
      />
    </div>
  );
};

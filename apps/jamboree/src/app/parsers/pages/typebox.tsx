import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/typebox/typebox';
import code from '../../../../../../libs/typebox/src/lib/typebox?raw';
import { ParserComponent } from '../component';

export const TypeboxPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Zod Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
      />
    </div>
  );
};

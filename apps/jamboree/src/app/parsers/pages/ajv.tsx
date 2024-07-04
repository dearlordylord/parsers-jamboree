import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/ajv/ajv';
import code from '../../../../../../libs/ajv/src/lib/ajv?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

export const AjvPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Ajv Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
      />
    </div>
  );
};

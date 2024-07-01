import React from 'react';
import { igor } from '@parsers-jamboree/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/runtypes/runtypes';
import code from '../../../../../../libs/runtypes/src/lib/runtypes?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

const defaultInput = JSON.stringify(igor, null, 2);

export const RuntypesPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Runtypes Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        type="normal"
        decodeUser={decodeUser}
        defaultInput={defaultInput}
        validUser={igor}
      />
    </div>
  );
};

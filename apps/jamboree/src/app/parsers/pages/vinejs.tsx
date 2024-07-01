import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker';
import { encodeUser, decodeUserForcedAsync } from '@parsers-jamboree/vinejs/vinejs';
import code from '../../../../../../libs/vinejs/src/lib/vinejs?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

const defaultInput = JSON.stringify(igor, null, 2);

export const VinejsPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Vinejs Page</h1>
      <ParserComponent
        code={code}
        type="special"
        encodeUser={encodeUser}
        decodeUserForcedAsync={decodeUserForcedAsync}
        defaultInput={defaultInput}
        validUser={igor}
      />
    </div>
  );
};

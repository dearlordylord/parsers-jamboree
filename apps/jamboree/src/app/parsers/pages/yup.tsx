import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/yup/yup';
import code from '../../../../../../libs/yup/src/lib/yup?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

const defaultInput = JSON.stringify(igor, null, 2);

export const YupPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Yup Page</h1>
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

import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/arktype/arktype';
import code from '../../../../../../libs/arktype/src/lib/arktype?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

export const ArktypePage = (): React.ReactElement => {
  return (
    <div>
      <h1>Arktype Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
      />
    </div>
  );
};

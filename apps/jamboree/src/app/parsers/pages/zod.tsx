import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/zod/zod';
import code from '../../../../../../libs/zod/src/lib/zod?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

export const ZodPage = (): React.ReactElement => {
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

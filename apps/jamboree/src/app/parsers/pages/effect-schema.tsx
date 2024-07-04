import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker';
import {
  encodeUser,
  decodeUser,
} from '@parsers-jamboree/effect-ts-schema/effect-ts-schema';
import code from '../../../../../../libs/effect-ts-schema/src/lib/effect-ts-schema?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';

const defaultInput = JSON.stringify(igor, null, 2);

export const EffectSchemaPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Effect-schema Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        defaultInput={defaultInput}
        validUser={igor}
      />
    </div>
  );
};

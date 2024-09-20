import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import {
  encodeUser,
  decodeUser,
} from '@parsers-jamboree/superstruct/superstruct';
import code from '../../../generated/superstruct.html?raw';
import { ParserComponent } from '../component';

import { meta } from '@parsers-jamboree/superstruct/meta';

export const SuperstructPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="superstruct"
      />
    </div>
  );
};

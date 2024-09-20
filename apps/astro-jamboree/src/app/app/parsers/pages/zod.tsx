import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/zod/zod';
import code from '../../../generated/zod.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/zod/meta';

export const ZodPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="zod"
      />
    </div>
  );
};

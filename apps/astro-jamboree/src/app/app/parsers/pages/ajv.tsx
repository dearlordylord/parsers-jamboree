import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/ajv/ajv';
import code from '../../../generated/ajv.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/ajv/meta';

export const AjvPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="ajv"
      />
    </div>
  );
};

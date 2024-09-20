import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/yup/yup';
import code from '../../../generated/yup.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/yup/meta';

export const YupPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="yup"
      />
    </div>
  );
};

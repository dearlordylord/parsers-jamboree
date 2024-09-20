import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/runtypes/runtypes';
import code from '../../../generated/runtypes.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/runtypes/meta';

export const RuntypesPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="runtypes"
      />
    </div>
  );
};

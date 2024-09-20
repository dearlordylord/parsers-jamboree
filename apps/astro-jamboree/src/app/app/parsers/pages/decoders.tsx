import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/decoders/decoders';
import code from '../../../generated/decoders.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/decoders/meta';

export const DecodersPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="decoders"
      />
    </div>
  );
};

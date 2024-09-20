import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/valita/valita';
import code from '../../../generated/valita.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/valita/meta';

export const ValitaPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="valita"
      />
    </div>
  );
};

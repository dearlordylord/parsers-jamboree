import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser, meta } from '@parsers-jamboree/valita/valita';
import code from '../../../generated/valita.html?raw';
import { ParserComponent } from '../component';

export const ValitaPage = (): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
      />
    </div>
  );
};

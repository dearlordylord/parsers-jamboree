import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser, meta } from '@parsers-jamboree/decoders/decoders';
import code from '../../../generated/decoders.html?raw';
import { ParserComponent } from '../component';

export const DecodersPage = (): React.ReactElement => {
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

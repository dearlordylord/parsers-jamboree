import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser, meta } from '@parsers-jamboree/valibot/valibot';
import code from '../../../../../../libs/valibot/src/lib/valibot?raw';
import { ParserComponent } from '../component';

export const ValibotPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Valibot Page</h1>
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

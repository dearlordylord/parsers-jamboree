import React from 'react';
import { igor } from '@parsers-jamboree/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/valibot/valibot';
import code from '../../../../../../libs/valibot/src/lib/valibot?raw';
import { ParserComponent } from '../component';

const defaultInput = JSON.stringify(igor, null, 2);

export const ValibotPage = (): React.ReactElement => {
  return (
    <div>
      <h1>Valibot Page</h1>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        type="normal"
        decodeUser={decodeUser}
        defaultInput={defaultInput}
        validUser={igor}
      />
    </div>
  );
};

import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/valibot/valibot';
import code from '../../../generated/valibot.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/valibot/meta';

export const ValibotPage = (): React.ReactElement => {
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

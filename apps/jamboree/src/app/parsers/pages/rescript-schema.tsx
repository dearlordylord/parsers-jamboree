import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser, meta } from '@parsers-jamboree/rescript-schema/rescript-schema';
import code from '../../../generated/rescript-schema.html?raw';
import { ParserComponent } from '../component';

export const RescriptSchemaPage = (): React.ReactElement => {
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

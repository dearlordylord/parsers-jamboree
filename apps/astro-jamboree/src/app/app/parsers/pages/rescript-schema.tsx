import React from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import {
  encodeUser,
  decodeUser,
} from '@parsers-jamboree/rescript-schema/rescript-schema';
import code from '../../../generated/rescript-schema.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/rescript-schema/meta';

export const RescriptSchemaPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="rescript-schema"
      />
    </div>
  );
};

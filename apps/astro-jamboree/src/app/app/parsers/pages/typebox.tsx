import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/typebox/typebox';
import code from '../../../generated/typebox.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/typebox/meta';

export const TypeboxPage = ({isIframe}: {isIframe: boolean}): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        isIframe={isIframe}
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="typebox"
      />
    </div>
  );
};

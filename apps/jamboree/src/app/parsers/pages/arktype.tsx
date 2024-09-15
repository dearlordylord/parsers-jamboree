import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/arktype/arktype';
import code from '../../../generated/arktype.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/arktype/meta';

export const ArktypePage = (): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="arktype"
      />
    </div>
  );
};

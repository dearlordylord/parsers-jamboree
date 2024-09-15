import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from '@parsers-jamboree/zod/zod';
import code from '../../../generated/zod.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/zod/meta';

export const ZodPage = (): React.ReactElement => {
  return (
    <div>
      <ParserComponent
        code={code}
        encodeUser={encodeUser}
        decodeUser={decodeUser}
        validUser={igor}
        meta={meta}
        library="zod"
      />
    </div>
  );
};

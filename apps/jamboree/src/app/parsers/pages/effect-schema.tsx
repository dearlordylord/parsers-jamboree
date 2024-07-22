import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import {
  encodeUser,
  decodeUser,
} from '@parsers-jamboree/effect-ts-schema/effect-ts-schema';
import code from '../../../generated/effect-schema.html?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/valibot/valibot';

export const EffectSchemaPage = (): React.ReactElement => {
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

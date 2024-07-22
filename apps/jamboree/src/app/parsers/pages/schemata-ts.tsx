import React, { useMemo, useState } from 'react';
import { igor } from '@parsers-jamboree/checker/checker';
import {
  encodeUser,
  decodeUser,
} from '@parsers-jamboree/schemata-ts/schemata-ts';
import code from '../../../../../../libs/schemata-ts/src/lib/schemata-ts.ts?raw';
// import common from '../../../../../../libs/common/src/lib/common.ts?raw';
import { ParserComponent } from '../component';
import { meta } from '@parsers-jamboree/valibot/valibot';

// monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   common,
//   'schemata-ts/schemata/index');

// const code = code_.replace(/import .+ from '@parsers-jamboree\/common'/g, common);

export const SchemataPage = (): React.ReactElement => {
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

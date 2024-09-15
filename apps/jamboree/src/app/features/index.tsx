import React from 'react';
import { FEATURES } from '@parsers-jamboree/common';

export const FEATURES_DESCRIPTIONS = {
  adt: {
    short: 'Products and sums (algebraic data types)',
    long: () => <span>ADT TODO: discriminated union example</span>
  },
  nominal: {
    short: 'Nominal types: telling apart two primitives (e.g. strings) of different meaning (e.g. UserId and PostId)',
    long: () => <span>TODO code example</span>
  },
  // composability: {
  //   short: 'Validators are composable in various ways, e.g. new validators can be inferred from old ones, or validators can be applied consequently',
  //   long: () => <span>TODO https://effect.website/docs/guides/schema/projections - derive before transformations, TODO pipe </span>
  // }
  codecs: {
    short: '"Codecs" semantics support: not only "validate an unknown value" but also "encode the validated value back [to JSON]"',
    long: () => <span>TODO RPC example and why toJSON() won't do</span>
  },
  transformations: {
    short: 'Transformation support: interpretation of network-serializable types as environment-specific types, e.g. string[] as Set<string>',
    long: () => <span>TODO code example</span>
  },
  recursion: {
    short: 'Representation of recursive types, e.g. tree',
    long: () => <span>TODO code example</span>
  }
} satisfies {
  [K in typeof FEATURES[number]]: {
    short: string;
    long: () => React.ReactElement;
  }
};

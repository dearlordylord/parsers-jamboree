export const FEATURES = [
  'adt',
  'nominal',
  // 'composability'
  'codecs',
  'transformations',
  'recursion'
] as const;

export type Feature = (typeof FEATURES)[number];

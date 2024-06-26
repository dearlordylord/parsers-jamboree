import { Result } from '@parsers-jamboree/common';

export const showParseResult = (result: Result<unknown, unknown>): string => {
  if (result._tag === 'left') {
    return JSON.stringify(result.error, null, 2);
  } else {
    return JSON.stringify(result.value, (k, v) => {
      if ((result.value as any)[k] instanceof Date) {
        return `JS Date('${(result.value as any)[k].toISOString()}')`;
      }
      if (v instanceof Set) {
        return `JS Set([${Array.from(v).map(x => JSON.stringify(x)).join(', ')}])`;
      }
      return v;
    }, 2);
  }
}

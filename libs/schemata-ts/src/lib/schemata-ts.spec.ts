import { igor } from '@parsers-jamboree/checker/checker';
import { encodeUser, decodeUser } from './schemata-ts';
import { unwrapResult } from '@parsers-jamboree/common';

describe('schemata-ts', () => {
  it('should parse a user', () => {
    expect(decodeUser(igor)).toMatchObject({
      _tag: 'right',
      value: {
        ...igor,
        createdAt: new Date('1990-01-01'),
        updatedAt: new Date('2000-01-01'),
        favouriteColours: new Set(['red', 'green', 'blue', '#ac0200']),
      },
    });
  });
  it('should encode a user', () => {
    const user = unwrapResult(JSON.stringify)(decodeUser(igor));
    expect(encodeUser(user)).toMatchObject(igor);
  });
});

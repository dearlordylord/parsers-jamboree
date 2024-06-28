import { igor } from '@parsers-jamboree/checker';
import { encodeUser, parseUser } from './schemata-ts';
import { unwrapResult } from '@parsers-jamboree/common';

describe('schemata-ts', () => {
  it('should parse a user', () => {
    expect(parseUser(igor)).toMatchObject({
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
    const user = unwrapResult(JSON.stringify)(parseUser(igor));
    expect(encodeUser(user)).toMatchObject(igor);
  });
});

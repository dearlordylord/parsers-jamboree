import { BREAKERS } from './breaker';
import { decodeUser } from '@parsers-jamboree/effect-ts-schema/effect-ts-schema';
import { igor } from '@parsers-jamboree/checker';

// TODO add transformations
describe('breakers', () => {
  it('should not break a good user', () => {
    expect(decodeUser(igor)).toMatchObject({
      _tag: 'right',
    });
  })
  Object.entries(BREAKERS).forEach(([n, b]) => {
    it(`should break the structure with ${n}`, () => {
      expect(decodeUser(b(igor))).toMatchObject({
        _tag: 'left',
      });
    });
  });

});

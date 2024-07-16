import {
  SUBSCRIPTION_TYPE_FREE,
  SUBSCRIPTION_TYPE_PRO,
} from '@parsers-jamboree/common';

export const igor = {
  name: 'igor',
  email: 'igor@loskutoff.com',
  createdAt: '1990-01-01T00:00:00.000Z',
  updatedAt: '2000-01-01T00:00:00.000Z',
  subscription: SUBSCRIPTION_TYPE_PRO,
  stripeId: 'cus_NffrFeUfNV2Hib',
  visits: 10,
  favouriteColours: ['red', 'green', 'blue', '#ac0200'].sort(),
  profile: {
    type: 'listener',
    boughtTracks: 10,
  },
  fileSystem: {
    type: 'directory',
    name: 'root',
    children: [
      {
        type: 'directory',
        name: 'empty',
        children: [],
      },
      {
        type: 'directory',
        name: 'sub',
        children: [
          {
            type: 'file',
            name: 'bonjournee.exe',
          },
        ],
      },
      {
        type: 'file',
        name: 'bonjour.exe',
      },
    ],
  },
};

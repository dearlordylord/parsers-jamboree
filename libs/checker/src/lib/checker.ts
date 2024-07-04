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
};

type TreeNode = {
  name: string;
  children: TreeNode[];
};

// to test recursive types
const tree_: TreeNode = {
  name: 'root',
  children: [
    {
      name: 'child1',
      children: [
        {
          name: 'child1.1',
          children: [
            {
              name: 'grandchild1.1.1',
              children: [],
            },
            {
              name: 'grandchild1.1.2',
              children: [],
            },
          ],
        },
        {
          name: 'child1.2',
          children: [
            {
              name: 'grandchild1.2.1',
              children: [],
            },
            {
              name: 'grandchild1.2.2',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'child2',
      children: [],
    },
    {
      name: 'child3',
      children: [
        {
          name: 'leaf1',
          children: [],
        },
      ],
    },
  ],
};

export const tree = JSON.parse(JSON.stringify(tree_));

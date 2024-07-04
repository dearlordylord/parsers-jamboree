"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tree = exports.igor = void 0;
const common_1 = require("@parsers-jamboree/common");
exports.igor = {
    name: 'igor',
    email: 'igor@loskutoff.com',
    createdAt: '1990-01-01T00:00:00.000Z',
    updatedAt: '2000-01-01T00:00:00.000Z',
    subscription: common_1.SUBSCRIPTION_TYPE_PRO,
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
// to test recursive types
const tree_ = {
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
exports.tree = JSON.parse(JSON.stringify(tree_));
//# sourceMappingURL=checker.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tree = exports.harry = exports.igor = void 0;
const common_1 = require("@parsers-jamboree/common");
exports.igor = JSON.parse(JSON.stringify({
    name: 'igor',
    email: 'igor@loskutoff.com',
    createdAt: '1990-01-01T00:00:00.000Z',
    updatedAt: '2000-01-01T00:00:00.000Z',
    subscription: common_1.SUBSCRIPTION_TYPE_PRO,
    stripeId: 'cus_NffrFeUfNV2Hib',
    visits: 10,
    favouriteColours: ['red', 'green', 'blue', '#ac0200'].sort(),
}));
// to test errored types
exports.harry = JSON.parse(JSON.stringify({
    name: '',
    email: null,
    createdAt: '1990-01-01T00:00:00.000Z',
    updatedAt: '1900-01-01T00:00:00.000Z',
    subscription: common_1.SUBSCRIPTION_TYPE_FREE,
    stripeId: 'big boss',
    visits: -1,
    favouriteColours: ['cars', null, []],
    extraField: 'extra',
}));
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
            children: [{
                    name: 'leaf1',
                    children: [],
                }],
        },
    ],
};
exports.tree = JSON.parse(JSON.stringify(tree_));
//# sourceMappingURL=checker.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.igor = void 0;
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
//# sourceMappingURL=checker.js.map
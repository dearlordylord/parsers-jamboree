"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTesters = exports.BREAKER_DESCRIPTIONS = exports.BREAKERS = exports.addFileSystemDupeFile = exports.addFileSystemUFOType = exports.setProfileArtist = exports.setCreatedAtCyborgWar = exports.setHalfVisits = exports.setSubscriptionTypeBanana = exports.addFavouriteRed = exports.addFavouriteTiger = exports.clearName = exports.addTwoAtsToEmail = exports.prefixCustomerId = exports.switchDates = void 0;
const tslib_1 = require("tslib");
const checker_1 = require("./checker");
const function_1 = require("fp-ts/function");
const A = tslib_1.__importStar(require("fp-ts/Array"));
const common_1 = require("@parsers-jamboree/common");
const utils_1 = require("./utils");
const Ord_1 = require("fp-ts/Ord");
const string_1 = require("fp-ts/string");
const switchFields = (f1, f2) => (x) => (Object.assign(Object.assign({}, x), { [f1]: x[f2], [f2]: x[f1] }));
// typing isn't great, can break runtime with wrong "m"...
const mutateField = (m) => (f) => (x) => (Object.assign(Object.assign({}, x), { [f]: m(x[f]) }));
exports.switchDates = switchFields('createdAt', 'updatedAt');
exports.prefixCustomerId = mutateField((s) => `A_${s}`)('stripeId');
exports.addTwoAtsToEmail = mutateField((s) => `a@b@${s}`)('email');
exports.clearName = mutateField((0, function_1.constant)(''))('name');
exports.addFavouriteTiger = mutateField((s) => [
    ...s,
    'tiger',
])('favouriteColours');
exports.addFavouriteRed = mutateField((s) => [
    ...s,
    'red',
])('favouriteColours');
exports.setSubscriptionTypeBanana = mutateField((0, function_1.constant)('banana'))('subscription');
exports.setHalfVisits = mutateField((n) => n % 1 === 0 ? n + 0.5 : n)('visits');
exports.setCreatedAtCyborgWar = mutateField((0, function_1.constant)('0'))('createdAt');
exports.setProfileArtist = mutateField((0, function_1.constant)({
    type: 'artist',
    boughtTracks: 10,
}))('profile');
exports.addFileSystemUFOType = mutateField((fs) => (Object.assign(Object.assign({}, fs), { children: [
        ...fs.children,
        {
            type: 'directory',
            name: 'ufos',
            children: [{ type: 'UFO', name: 'ufo.exe' }],
        },
    ] })))('fileSystem');
exports.addFileSystemDupeFile = mutateField((fs) => (Object.assign(Object.assign({}, fs), { children: [
        ...fs.children,
        { type: 'file', name: 'bonjour.exe' },
        { type: 'file', name: 'bonjour.exe' },
    ] })))('fileSystem');
exports.BREAKERS = {
    switchDates: exports.switchDates,
    prefixCustomerId: exports.prefixCustomerId,
    addTwoAtsToEmail: exports.addTwoAtsToEmail,
    clearName: exports.clearName,
    addFavouriteTiger: exports.addFavouriteTiger,
    addFavouriteRed: exports.addFavouriteRed,
    setSubscriptionTypeBanana: exports.setSubscriptionTypeBanana,
    setHalfVisits: exports.setHalfVisits,
    setCreatedAtCyborgWar: exports.setCreatedAtCyborgWar,
    setProfileArtist: exports.setProfileArtist,
    addFileSystemUFOType: exports.addFileSystemUFOType,
    addFileSystemDupeFile: exports.addFileSystemDupeFile,
};
exports.BREAKER_DESCRIPTIONS = {
    switchDates: 'switches the createdAt and updatedAt fields',
    prefixCustomerId: 'adds an invalid prefix to the stripeId field',
    addTwoAtsToEmail: 'renders the email invalid by adding two @s',
    clearName: 'clears the name field',
    addFavouriteTiger: 'Adds an invalid colour to the favouriteColours field. Enough said.',
    addFavouriteRed: `Adds a duplicated valid colour to the favouriteColours field. Although in some cases it's ok, other times I'd like to have no garbage in my database. Having duplicated values in a collection with "set" semantics means that one side of interaction doesn't really know what it's doing, and this is a potential timebomb better to fix the earliest.`,
    setSubscriptionTypeBanana: 'sets the subscription field to banana',
    setHalfVisits: 'renders the visits field to be a float instead of an integer',
    setCreatedAtCyborgWar: 'sets invalid createdAt date',
    setProfileArtist: 'sets the valid profile field to an invalid structure',
    addFileSystemUFOType: 'An enum test not unlike the TIger test, but in composition with recursive data structures.',
    addFileSystemDupeFile: 'Adds a duplicated value to the tree. My tree has the “unique list” semantics, so that shouldn’t be possible.',
};
const COMPILE_TIME_META_DESCRIPTIONS = {
    branded: 'branded types are supported',
    typedErrors: 'typed errors are supported',
    templateLiterals: 'template literals are supported',
};
const runTesters = ({ decodeUser, encodeUser, meta, }) => [
    ...(0, function_1.pipe)(Object.entries(exports.BREAKERS), A.sort((0, function_1.pipe)(string_1.Ord, (0, Ord_1.contramap)(([k]) => k))), A.map(([k, f]) => ({
        key: k,
        title: exports.BREAKER_DESCRIPTIONS[k],
        success: decodeUser(f(checker_1.igor))._tag === 'left',
    }))),
    {
        key: 'encodedEqualsInput',
        title: 'decode then encode doesnt break the input',
        success: (0, utils_1.deepEqual)({
            _tag: 'right',
            value: checker_1.igor,
        }, (0, function_1.pipe)(checker_1.igor, JSON.stringify, JSON.parse, decodeUser, (0, common_1.chain)(encodeUser))),
    },
    {
        key: 'transformationsPossible',
        title: 'transformations are possible',
        success: (0, function_1.pipe)(checker_1.igor, JSON.stringify, JSON.parse, decodeUser, (0, common_1.chain)((v) => (v /*don't bother with decoded type here; outputs are various*/ === null || v === void 0 ? void 0 : v['favouriteColours']) instanceof Set
            ? { _tag: 'right', value: v }
            : { _tag: 'left', error: 'transformations are not possible' }), (v) => v._tag === 'right'),
    },
    ...(0, function_1.pipe)(Object.entries(meta.items), A.map(([k, v]) => ({
        key: k,
        title: COMPILE_TIME_META_DESCRIPTIONS[k],
        success: v,
    }))),
];
exports.runTesters = runTesters;
//# sourceMappingURL=breaker.js.map
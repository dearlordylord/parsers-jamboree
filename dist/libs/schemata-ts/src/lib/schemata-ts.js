"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTree = exports.parseTree = exports.encodeNamelessUser = exports.parseNamelessUser = exports.encodeUser = exports.parseUser = exports.TreeNodeSchema = exports.NamelessUserSchema = exports.UserSchema = void 0;
const S = require("schemata-ts/schemata/index");
const Nt = require("schemata-ts/newtype");
const k = require("kuvio");
const function_1 = require("fp-ts/function");
const Either_1 = require("fp-ts/lib/Either");
const string_1 = require("fp-ts/lib/string");
const Transcoder_1 = require("schemata-ts/Transcoder");
const common_1 = require("@parsers-jamboree/common");
const isoStripeId = Nt.iso();
const StripeIdSchema = (0, function_1.pipe)(S.Pattern(k.sequence(k.exactString('cus_'), k.atLeast('NffrFeUfNV2Hib'.length)(k.alnum)), `Stripe Id of format cus_XXXXXXXXXXXXXX`), S.Newtype(isoStripeId, `Stripe Id`));
const ColourSchema = S.Union(S.Literal(...common_1.COLOURS), S.HexColor);
const colourOrd = string_1.Ord;
exports.UserSchema = S.Struct({
    name: S.NonEmptyString,
    email: S.EmailAddress,
    createdAt: S.DateFromIsoString(),
    updatedAt: S.DateFromIsoString(),
    subscription: S.Literal(...common_1.SUBSCRIPTION_TYPES),
    stripeId: StripeIdSchema,
    visits: S.Int({ min: 0 }), // somehow, there's also NonNegativeFloat but no NonNegativeInteger
    favouriteColours: S.SetFromArray(colourOrd)(ColourSchema),
}); // .strict() can be added to not allow unexpected fields
exports.NamelessUserSchema = exports.UserSchema.omit('name');
exports.TreeNodeSchema = S.Struct({
    name: S.String(),
    children: S.Array(S.Lazy('TreeNode', () => exports.TreeNodeSchema)),
});
const userTranscoder = (0, Transcoder_1.deriveTranscoder)(exports.UserSchema);
const parseUser = (user) => {
    const result = userTranscoder.decode(user);
    return mapResult(result);
};
exports.parseUser = parseUser;
const encodeUser = (user) => {
    const result = userTranscoder.encode(user);
    return mapResult(result);
};
exports.encodeUser = encodeUser;
const namelessUserTranscoder = (0, Transcoder_1.deriveTranscoder)(exports.NamelessUserSchema);
const parseNamelessUser = (user) => {
    const result = namelessUserTranscoder.decode(user);
    return mapResult(result);
};
exports.parseNamelessUser = parseNamelessUser;
const encodeNamelessUser = (user) => namelessUserTranscoder.encode(user);
exports.encodeNamelessUser = encodeNamelessUser;
const treeNodeTranscoder = (0, Transcoder_1.deriveTranscoder)(exports.TreeNodeSchema);
const parseTree = (node) => {
    const result = treeNodeTranscoder.decode(node);
    return mapResult(result);
};
exports.parseTree = parseTree;
const encodeTree = (node) => {
    const result = treeNodeTranscoder.encode(node);
    return mapResult(result);
};
exports.encodeTree = encodeTree;
// helpers, unrelated to the library
const mapResult = (e) => (0, Either_1.isRight)(e)
    ? { _tag: 'right', value: e.right }
    : { _tag: 'left', error: e.left };
const unwrapEither = (e) => {
    if ((0, Either_1.isRight)(e)) {
        return e.right;
    }
    else {
        throw new Error(JSON.stringify(e.left));
    }
};
//# sourceMappingURL=schemata-ts.js.map
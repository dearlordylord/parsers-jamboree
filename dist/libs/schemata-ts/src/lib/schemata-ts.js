"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.encodeUser = exports.decodeUser = exports.UserSchema = exports.UserTemporalOrderlessSchema = exports.FileSystemSchema = exports.NonNegativeIntegerSchema = void 0;
const tslib_1 = require("tslib");
const S = tslib_1.__importStar(require("schemata-ts/schemata/index"));
const Nt = tslib_1.__importStar(require("schemata-ts/newtype"));
const k = tslib_1.__importStar(require("kuvio"));
const function_1 = require("fp-ts/function");
const Either_1 = require("fp-ts/lib/Either");
const string_1 = require("fp-ts/lib/string");
const Transcoder_1 = require("schemata-ts/Transcoder");
const common_1 = require("@parsers-jamboree/common");
const isoStripeId = Nt.iso();
const StripeIdSchema = (0, function_1.pipe)(S.Pattern(k.sequence(k.exactString('cus_'), k.atLeast('NffrFeUfNV2Hib'.length)(k.alnum)), `Stripe Id of format cus_XXXXXXXXXXXXXX`), S.Newtype(isoStripeId, `Stripe Id`));
const ColourSchema = S.Union(S.Literal(...common_1.COLOURS), S.HexColor);
const colourOrd = string_1.Ord;
// making it unique seemed too much bother;
// - Refine would operate on the output and doesn't see the input;
// - redefining SetFromArray is too far from user-friendly
// - functionality "and" doesn't seem to exist in the API (e.g. S.Int() AND S.NonNegativeFloat())
const FavouriteColoursNonUniqueSchema = S.SetFromArray(colourOrd)(ColourSchema);
const TemporalConcernOrderlessSchema = S.Struct({
    createdAt: S.DateFromIsoString(),
    updatedAt: S.DateFromIsoString(),
});
// somehow, there's also NonNegativeFloat but no NonNegativeInteger
exports.NonNegativeIntegerSchema = (0, function_1.pipe)(S.Int({ min: 0 }), S.Brand());
const ProfileListenerSchema = S.Struct({
    type: S.Literal(common_1.PROFILE_TYPE_LISTENER),
    boughtTracks: exports.NonNegativeIntegerSchema,
});
const ProfileArtistSchema = S.Struct({
    type: S.Literal(common_1.PROFILE_TYPE_ARTIST),
    publishedTracks: exports.NonNegativeIntegerSchema,
});
const ProfileSchema = S.Union(ProfileListenerSchema, ProfileArtistSchema);
exports.FileSystemSchema = S.Intersect(S.Union(S.Struct({
    type: S.Literal('directory'),
    children: (0, function_1.pipe)(S.Array(S.Lazy('FileSystem', () => exports.FileSystemSchema)), S.Refine((c) => c.length === new Set(c.map((f) => f.name)).size, 'Uniq files/dirs')),
}), S.Struct({
    type: S.Literal('file'),
})), S.Struct({
    name: S.NonEmptyString,
}));
exports.UserTemporalOrderlessSchema = S.Struct({
    name: S.NonEmptyString,
    email: S.EmailAddress,
    subscription: S.Literal(...common_1.SUBSCRIPTION_TYPES),
    stripeId: StripeIdSchema,
    visits: exports.NonNegativeIntegerSchema,
    favouriteColours: FavouriteColoursNonUniqueSchema,
    profile: ProfileSchema,
    fileSystem: exports.FileSystemSchema,
}).intersect(TemporalConcernOrderlessSchema); // .strict() can be added to not allow unexpected fields
exports.UserSchema = (0, function_1.pipe)(exports.UserTemporalOrderlessSchema, S.Refine(
// refinements seem to be not very composable
(c) => c.createdAt <= c.updatedAt, 'User'));
// struct methods / functions are no more after refinement
// export const NamelessUserSchema = UserSchema.omit('name');
// export type NamelessUser = OutputOf<typeof NamelessUserSchema>;
const userTranscoder = (0, Transcoder_1.deriveTranscoder)(exports.UserSchema);
const decodeUser = (user) => {
    const result = userTranscoder.decode(user);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
const encodeUser = (user) => {
    const result = userTranscoder.encode(user);
    return mapResult(result);
};
exports.encodeUser = encodeUser;
exports.meta = {
    branded: true,
};
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUser = exports.decodeUser = void 0;
const runtypes_1 = require("runtypes");
const common_1 = require("@parsers-jamboree/common");
const NonNegative = runtypes_1.Number.withConstraint((n) => n >= 0).withBrand('NonNegative');
const Integer = runtypes_1.Number.withConstraint((n) => n % 1 === 0).withBrand('Integer');
const NonNegativeInteger = (0, runtypes_1.Union)(NonNegative, Integer).withBrand('NonNegativeInteger');
const NonEmptyString = runtypes_1.String.withConstraint((s) => s.length > 0).withBrand('NonEmptyString');
const Email = NonEmptyString.withConstraint((s) => !!s.match(common_1.EMAIL_REGEX_S)).withBrand('Email');
const StripeCustomerId = (0, runtypes_1.Template)('cus_', runtypes_1.String.withConstraint((s) => s.length >= 14)).withBrand('StripeCustomerId');
// @ts-expect-error sexy: it indeed interprets the type as `cus_${string}`
const stripeCustomerId = 'NOT CUS_NffrFeUfNV2Hib';
const SubscriptionType = (0, runtypes_1.Union)(...common_1.SUBSCRIPTION_TYPES.map((s) => (0, runtypes_1.Literal)(s)));
const IsoDateString = runtypes_1.String.withConstraint((s) => !!s.match(common_1.ISO_DATE_REGEX_S)).withBrand('IsoDateString');
const HexColour = runtypes_1.String.withConstraint((s) => !!s.match(/^#[a-fA-F0-9]{6}$/)).withBrand('HexColour');
const Colour = (0, runtypes_1.Union)(...common_1.COLOURS.map((c) => (0, runtypes_1.Literal)(c)));
const HexColourOrColour = (0, runtypes_1.Union)(HexColour, Colour);
const ProfileType = (0, runtypes_1.Union)(...common_1.PROFILE_TYPES.map((t) => (0, runtypes_1.Literal)(t)));
const ProfileListener = (0, runtypes_1.Record)({
    type: (0, runtypes_1.Literal)(common_1.PROFILE_TYPE_LISTENER),
    boughtTracks: NonNegativeInteger,
});
const ProfileArtist = (0, runtypes_1.Record)({
    type: (0, runtypes_1.Literal)(common_1.PROFILE_TYPE_ARTIST),
    publishedTracks: NonNegativeInteger,
});
const Profile = (0, runtypes_1.Union)(ProfileListener, ProfileArtist);
const UserJson = (0, runtypes_1.Record)({
    name: NonEmptyString,
    email: Email,
    // the lib supports no transformations
    createdAt: IsoDateString,
    updatedAt: IsoDateString,
    subscription: SubscriptionType,
    stripeId: StripeCustomerId,
    visits: NonNegativeInteger,
    favouriteColours: (0, runtypes_1.Array)(HexColourOrColour),
    profile: Profile,
});
const decodeUser = (u) => {
    const firstLayerResult = UserJson.validate(u);
    const firstLayerResultMapped = mapResult(firstLayerResult);
    // the lib cannot transform, not planned https://github.com/runtypes/runtypes/issues/56
    // this function also doesn't collect errors
    return (0, common_1.chain)((u) => {
        const favouriteColours = new Set(u.favouriteColours);
        if (favouriteColours.size !== u.favouriteColours.length) {
            return { _tag: 'left', error: 'favourite colours must be unique' };
        }
        const createdAt = new Date(u.createdAt);
        if (isNaN(createdAt.getTime())) {
            return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
        }
        const updatedAt = new Date(u.updatedAt);
        if (isNaN(updatedAt.getTime())) {
            return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
        }
        return {
            _tag: 'right',
            value: Object.assign(Object.assign({}, u), { favouriteColours,
                createdAt,
                updatedAt }),
        };
    })(firstLayerResultMapped);
};
exports.decodeUser = decodeUser;
// actually since there's no transformation, it's just the same object; so "no-feature feature"
// BUT also we can't check if a transformed object was passed or not; so I predict plenty of errors on this front;
// the presence of transformations (and they will be present in production code) dictates that this feature is functionally, not only nominally, non-existing
const encodeUser = (_u) => ({
    _tag: 'left',
    error: 'the lib cannot do it',
});
exports.encodeUser = encodeUser;
// utils
const mapResult = (r) => r.success
    ? { _tag: 'right', value: r.value }
    : { _tag: 'left', error: r.message /*todo code, details*/ };
//# sourceMappingURL=runtypes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.encodeUser = exports.decodeUser = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@effect/schema");
const Either = tslib_1.__importStar(require("effect/Either"));
const common_1 = require("@parsers-jamboree/common");
const NonEmptyStringBrand = Symbol.for('NonEmptyString');
const NonEmptyString = schema_1.Schema.NonEmpty.pipe(schema_1.Schema.brand(NonEmptyStringBrand));
const EmailBrand = Symbol.for('Email');
// no built-in email combinator by-design (lot of definitions out there)
const Email = NonEmptyString.pipe(schema_1.Schema.pattern(/^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i)).pipe(schema_1.Schema.brand(EmailBrand));
const StripeIdBrand = Symbol.for('StripeId');
const StripeId = schema_1.Schema.TemplateLiteral(schema_1.Schema.Literal('cus_' /*can be dryed*/), schema_1.Schema.String)
    .pipe(schema_1.Schema.pattern(/^cus_[a-zA-Z0-9]{14,}$/)) // extra check for the second part
    .pipe(schema_1.Schema.brand(StripeIdBrand));
const ColourBrand = Symbol.for('Colour');
const Colour = schema_1.Schema.Literal(...common_1.COLOURS).pipe(schema_1.Schema.brand(ColourBrand));
const HexBrand = Symbol.for('Hex');
const Hex = schema_1.Schema.String.pipe(schema_1.Schema.pattern(/^#[a-fA-F0-9]{6}$/)).pipe(schema_1.Schema.brand(HexBrand));
const ColourOrHex = schema_1.Schema.Union(Colour, Hex);
const SubscriptionBrand = Symbol.for('Subscription');
const Subscription = schema_1.Schema.Literal(...common_1.SUBSCRIPTION_TYPES).pipe(schema_1.Schema.brand(SubscriptionBrand));
const NonNegativeIntegerBrand = Symbol.for('NonNegativeInteger');
const NonNegativeInteger = schema_1.Schema.Int.pipe(schema_1.Schema.nonNegative(), schema_1.Schema.brand(NonNegativeIntegerBrand));
// this lib can figure out discriminator by itself
const Profile = schema_1.Schema.Union(schema_1.Schema.Struct({
    type: schema_1.Schema.Literal('listener'),
    boughtTracks: NonNegativeInteger,
}), schema_1.Schema.Struct({
    type: schema_1.Schema.Literal('artist'),
    publishedTracks: NonNegativeInteger,
}));
const FavouriteColours = schema_1.Schema.transformOrFail(schema_1.Schema.Array(ColourOrHex), schema_1.Schema.SetFromSelf(schema_1.Schema.typeSchema(ColourOrHex)), {
    strict: true,
    decode: (input, options, ast) => {
        const set = new Set(input);
        if (set.size !== input.length) {
            return schema_1.ParseResult.fail(new schema_1.ParseResult.Type(ast, input, 'Items must be unique'));
        }
        return schema_1.ParseResult.succeed(set);
    },
    encode: (input, options, ast) => {
        return schema_1.ParseResult.succeed(Array.from(input));
    },
});
const FileSystemDirectory = schema_1.Schema.Struct({
    type: schema_1.Schema.Literal('directory'),
    children: schema_1.Schema.Array(schema_1.Schema.suspend(() => schema_1.Schema.typeSchema(FileSystem))).pipe(schema_1.Schema.filter((children) => {
        const names = new Set(children.map((c) => c.name));
        return children.length === names.size
            ? undefined
            : `Expected unique names, got ${JSON.stringify(names)}`;
    })),
});
const FileSystemFile = schema_1.Schema.Struct({
    type: schema_1.Schema.Literal('file'),
});
const FileSystemFileOrDirectory = schema_1.Schema.Union(FileSystemFile, FileSystemDirectory);
const FileSystem = schema_1.Schema.extend(schema_1.Schema.Struct({
    name: NonEmptyString,
}), FileSystemFileOrDirectory);
const UserUnentangled = schema_1.Schema.Struct({
    name: NonEmptyString,
    email: Email,
    createdAt: schema_1.Schema.Date,
    updatedAt: schema_1.Schema.Date,
    subscription: Subscription,
    stripeId: StripeId,
    visits: NonNegativeInteger,
    favouriteColours: FavouriteColours,
    profile: Profile,
    fileSystem: FileSystem,
});
const UserEntangled = schema_1.Schema.transformOrFail(UserUnentangled, schema_1.Schema.typeSchema(UserUnentangled), {
    strict: true,
    decode: (u, options, ast) => {
        if (u.createdAt > u.updatedAt) {
            return schema_1.ParseResult.fail(new schema_1.ParseResult.Type(ast, u.createdAt, 'createdAt must be less or equal than updatedAt'));
        }
        return schema_1.ParseResult.succeed(u);
    },
    encode: schema_1.ParseResult.succeed,
});
const User = UserEntangled;
const decodeUser = (u) => {
    const result = schema_1.Schema.decodeUnknownEither(User)(u);
    return mapResult(result);
};
exports.decodeUser = decodeUser;
const encodeUser = (u) => {
    return mapResult(schema_1.Schema.encodeEither(User)(u));
};
exports.encodeUser = encodeUser;
exports.meta = {
    items: {
        branded: true,
        typedErrors: true,
        templateLiterals: true,
        emailFormatAmbiguityIsAccountedFor: true,
    },
    explanations: {
        emailFormatAmbiguityIsAccountedFor: `A default method purposely is not provided, disclaimer is there https://github.com/effect-ts/effect/tree/main/packages/schema#email`,
    }
};
// utils
const mapResult = (r) => Either.isLeft(r)
    ? { _tag: 'left', error: schema_1.TreeFormatter.formatErrorSync(r.left) }
    : { _tag: 'right', value: r.right };
//# sourceMappingURL=effect-ts-schema.js.map
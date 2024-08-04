import { StaticDecode, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import {
  COLOURS,
  EMAIL_REGEX_S,
  ISO_DATE_REGEX_S,
  Result,
  SUBSCRIPTION_TYPES,
} from '@parsers-jamboree/common';
import { ValueError } from '@sinclair/typebox/build/cjs/errors/errors';

const Colour = Type.Union(COLOURS.map((c) => Type.Literal(c)));

const ColourOrHex = Type.Union([Colour, Type.RegExp(/^#[a-fA-F0-9]{6}$/)]);

const SubscriptionType = Type.Union(
  SUBSCRIPTION_TYPES.map((c) => Type.Literal(c))
);

type StripeIdBrand = {
  readonly StripeId: unique symbol;
};

const StripeId = Type.Transform(
  Type.String({
    // why no regex native? I assume not schema serializable?
    pattern: '^cus_[a-zA-Z0-9]{14,}$',
  })
)
  .Decode((value) => value as typeof value & StripeIdBrand)
  .Encode((value) => value as Exclude<typeof value, StripeIdBrand>);

const IsoDate = Type.Transform(
  Type.String({
    pattern: ISO_DATE_REGEX_S,
  })
)
  .Decode((value) => new Date(value))
  .Encode((value) => value.toISOString());

type EmailBrand = {
  readonly Email: unique symbol;
};

const Email = Type.Transform(
  Type.String({
    pattern: EMAIL_REGEX_S,
  })
)
  .Decode((value) => value as typeof value & EmailBrand)
  .Encode((value) => value as Exclude<typeof value, EmailBrand>);

const FileSystem = Type.Recursive((Self) =>
  Type.Intersect([
    Type.Object({
      name: Type.String({
        minLength: 1,
      }),
    }),
    Type.Union([
      Type.Object({
        type: Type.Literal('file'),
      }),
      Type.Object({
        type: Type.Literal('directory'),
        // transform doesn't work if the type is recursive https://github.com/sinclairzx81/typebox/issues/895
        // children: Type.Transform(
        //   Type.Array(Self)
        // ).Decode((v: never[]/*can't check for uniqueness of name here; the values type is "never"*/) => v).Encode(v => v),
        children: Type.Array(Self),
      }),
    ]),
  ])
);

const DatesUnordered = Type.Object({
  createdAt: IsoDate,
  updatedAt: IsoDate,
});

// "Cannot intersect transform types" - gives an error, not hiding it - respectable
// const Dates = Type.Transform(DatesUnordered).Decode((v) => {
//   if (v.createdAt > v.updatedAt) {
//     throw new Error('createdAt must be less or equal than updatedAt');
//   }
//   return v;
// }).Encode(v => v);

const User = Type.Transform(
  Type.Intersect([
    Type.Object({
      name: Type.String({
        minLength: 1,
      }),
      email: Email,
      subscription: SubscriptionType,
      stripeId: StripeId,
      visits: Type.Integer({
        minimum: 0, // TODO how to define my own checks? transform?
      }),
      favouriteColours: Type.Transform(
        Type.Array(ColourOrHex, { uniqueItems: true })
      )
        .Decode((value) => {
          const r = new Set(value);
          // already done in { uniqueItems: true } but won't hurt to check again, especially that we converted already
          if (r.size !== value.length) {
            throw new Error('Expected unique items');
          }
          return r;
        })
        .Encode((value) => [...value]),
      profile: Type.Union([
        Type.Object({
          type: Type.Literal('listener'),
          boughtTracks: Type.Integer({
            minimum: 0,
          }),
        }),
        Type.Object({
          type: Type.Literal('artist'),
          publishedTracks: Type.Integer({
            minimum: 0,
          }),
        }),
      ]),
      fileSystem: FileSystem,
    }),
    DatesUnordered,
  ])
)
  .Decode((v) => {
    if (v.createdAt > v.updatedAt) {
      throw new Error('createdAt must be less or equal than updatedAt');
    }
    return v;
  })
  .Encode((v) => v);

type S = User['stripeId'];

// @ts-expect-error branded string works
const _sid: S = 'papi';

const FormatWhat = Type.String({
  // should be registered in FormatRegistry, but will fail runtime if not
  format: 'what?',
});

type User = StaticDecode<typeof User>;

export const decodeUser = (u: unknown): Result<ValueError[], User> => {
  try {
    const r = Value.Decode(User, u);
    return { _tag: 'right', value: r };
  } catch (e) {
    // type of their errors is unknown, you should additionally call error list methods?
    return { _tag: 'left', error: [...Value.Errors(User, u)] };
  }
};

export const encodeUser = (u: User): Result<ValueError[], unknown> => {
  // flow control with exceptions
  try {
    const r = Value.Encode(User, u);
    return { _tag: 'right', value: r };
  } catch (e) {
    // type of their errors is unknown, you should additionally call error list methods?
    return { _tag: 'left', error: [...Value.Errors(User, u)] };
  }
};

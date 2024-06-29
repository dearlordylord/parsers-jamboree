// const igor = JSON.parse(JSON.stringify({
//   name: 'igor',
//   email: 'igor@loskutoff.com',
//   createdAt: '1990-01-01T00:00:00.000Z',
//   updatedAt: '2000-01-01T00:00:00.000Z',
//   subscription: 0,
//   stripeId: 'cus_NffrFeUfNV2Hib',
//   visits: 10,
//   favouriteColours: ['red', 'green', 'blue', '#ac0200'].sort(),
// }));

import { Type, type Static, StaticDecode } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { ValueErrorIterator } from '@sinclair/typebox/errors';
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
    // iso8601 regex https://stackoverflow.com/a/14322189/2123547
    pattern:
      '^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$',
  })
)
  .Decode((value) => new Date(value))
  .Encode((value) => value.toISOString());

type EmailBrand = {
  readonly Email: unique symbol;
};

const Email = Type.Transform(
  Type.String({
    pattern:
      '^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$',
  })
)
  .Decode((value) => value as typeof value & EmailBrand)
  .Encode((value) => value as Exclude<typeof value, EmailBrand>);

const User = Type.Object({
  name: Type.String({
    minLength: 1, // TODO branded
  }),
  // email: Type.String({
  //   // unknown format "email" runtime error despite being in types
  //   format: 'email',
  // }),
  email: Email,
  // where's ISO8601? opinionated
  // createdAt: Type.Date(),
  createdAt: IsoDate,
  updatedAt: IsoDate,
  subscription: SubscriptionType,
  stripeId: StripeId,
  visits: Type.Integer({
    minimum: 0, // TODO how to define my own checks? transform?
  }),
  favouriteColours: Type.Transform(Type.Array(ColourOrHex))
    .Decode((value) => new Set(value))
    .Encode((value) => [...value]),
});

type S = User['stripeId'];

// @ts-expect-error branded string works
const _sid: S = 'papi';

const FormatWhat = Type.String({
  // should be registered in FormatRegistry, but will fail runtime if not
  format: 'what?',
});

type User = StaticDecode<typeof User>;

// TODO questionable "mutate"

export const decodeUser = (u: unknown): Result<ValueError[], User> => {
  // flow control with exceptions
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

import { Type, StaticDecode } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import {
  COLOURS,
  EMAIL_REGEX_S,
  ISO_DATE_REGEX_S,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
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

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
  },
  explanations: {
    branded: 'Can be simulated with decode/encode but no native support',
    templateLiterals: 'Can be simulated with decode/encode but no native support',
    typedErrors: 'No compile time support, we have to catch runtime',
    emailFormatAmbiguityIsAccountedFor: `A default email format check method doesn't work so I assume it's not defined at all. See also Ajv email explanation for more context.`,
  }
};

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

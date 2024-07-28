import { ArkErrors, type } from 'arktype';
import {
  chain,
  COLOURS, ISO_DATE_REGEX,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta
} from '@parsers-jamboree/common';
import { Objects, Pipe, Strings, Tuples } from 'hotscript';
import Mutable = Objects.Mutable;

// had to use hotscript to type the literal union imported from a const array
type TupleToLiteral<T extends readonly unknown[]> = Pipe<
  T,
  [
    Mutable,
    Tuples.Map<Strings.Prepend<"'">>,
    Tuples.Map<Strings.Append<"'">>,
    Tuples.Join<'|'>
  ]
>;

type SubscriptionTypeLiteral = TupleToLiteral<typeof SUBSCRIPTION_TYPES>;

const SUBSCRIPTION_TYPES_LITERAL = SUBSCRIPTION_TYPES.map(
  (t) => `'${t}'` as const
).join('|') as SubscriptionTypeLiteral;

type ColourTypeLiteral = TupleToLiteral<typeof COLOURS>;

const COLOURS_LITERAL = COLOURS.map((t) => `'${t}'` as const).join(
  '|'
) as ColourTypeLiteral;
const hexColorRegexString = `^#[a-fA-F0-9]{6}$`;
const COLOURS_WITH_CODES_LITERAL =
  `(${COLOURS_LITERAL})|/${hexColorRegexString}/` as const;

const isoDateString = type('string').narrow((s, ctx) => {
  console.log('testing ' , s)
  if (!ISO_DATE_REGEX.test(s))
    return ctx.mustBe('a valid ISO date string');
  return true;
});

const favouriteColours = type(`(${COLOURS_WITH_CODES_LITERAL})[]`).narrow((v, ctx) => {
  const set = new Set(v);
  if (set.size !== v.length) {
    return ctx.mustBe('favourite colours must be unique');
  }
  return true;
});

// TODO
const fileSystem = type('any');
// TODO
const profile = type('any');

const userJson = type({
  name: '0<string<255',
  email: 'email',
  // https://github.com/arktypeio/arktype/issues/909 morphs aren't really here yet
  createdAt: isoDateString,
  updatedAt: isoDateString,
  subscription: SUBSCRIPTION_TYPES_LITERAL,
  stripeId: /^cus_[a-zA-Z0-9]{14,}$/,
  visits: 'integer>0',
  // https://github.com/arktypeio/arktype/issues/909 morphs aren't really here yet
  favouriteColours,
  profile,
  fileSystem,
}).narrow((u, ctx) => {
  const createdAt = new Date(u.createdAt);
  const updatedAt = new Date(u.updatedAt);
  if (updatedAt < createdAt) {
    return ctx.mustBe('createdAt must be less or equal than updatedAt');
  }
  return true;
});

type UserJson = typeof userJson.infer;

type User = UserJson;

export const decodeUser = (u: unknown): Result<string, User> => {
  const result = userJson(u);

  return chain((u: UserJson): Result<string, User> => {
    return {
      _tag: 'right',
      value: u,
    };
  })(mapResult(result));
};

export const encodeUser = (_u: User): Result<'the lib cannot do it', never> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: true,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: false,
    acceptsTypedInput: false,
  },
  explanations: {
    templateLiterals: 'WIP https://github.com/arktypeio/arktype/issues/491',
    branded: 'WIP https://github.com/arktypeio/arktype/issues/741',
    emailFormatAmbiguityIsAccountedFor: `A default method is provided but there's no disclaimer in the docs. The valid email assumed to be /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$/ in source code.`,
  },
};

// utils

const mapResult = <E, T>(r: T | ArkErrors): Result<string, T> =>
  r instanceof ArkErrors
    ? { _tag: 'left', error: JSON.stringify(r) }
    : { _tag: 'right', value: r };

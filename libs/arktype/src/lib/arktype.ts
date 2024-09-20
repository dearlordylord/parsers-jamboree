import { ArkErrors, scope, type } from 'arktype';
import {
  COLOURS,
  ISO_DATE_REGEX,
  SUBSCRIPTION_TYPES,
} from '@parsers-jamboree/common';
import type { Result } from '@parsers-jamboree/common';
import hs from 'hotscript';

// had to use hotscript to type the literal union imported from a const array
type TupleToLiteral<T extends readonly unknown[]> = hs.Pipe<
  T,
  [
    hs.Objects.Mutable,
    hs.Tuples.Map<hs.Strings.Prepend<"'">>,
    hs.Tuples.Map<hs.Strings.Append<"'">>,
    hs.Tuples.Join<'|'>
  ]
>;

type SubscriptionTypeLiteral = TupleToLiteral<typeof SUBSCRIPTION_TYPES>;

const SUBSCRIPTION_TYPES_LITERAL = SUBSCRIPTION_TYPES.map(
  (t) => `'${t}'` as const
).join('|') as SubscriptionTypeLiteral;

type ColourTypeLiteral = TupleToLiteral<typeof COLOURS>;

const COLOURS_LITERAL = ['===', ...COLOURS] as const;

const isoDateString = type('string').narrow((s, ctx) => {
  if (!ISO_DATE_REGEX.test(s)) return ctx.mustBe('a valid ISO date string');
  return true;
});

const isoDate = isoDateString.pipe((s) => new Date(s));

const hexColorRegexString = `^#[a-fA-F0-9]{6}$`;
const COLOURS_WITH_CODES_LITERAL = [
  COLOURS_LITERAL,
  '|',
  `/${hexColorRegexString}/`,
] as const;

const favouriteColours = type([COLOURS_WITH_CODES_LITERAL, '[]']).narrow(
  (v, ctx) => {
    const set = new Set(v);
    if (set.size !== v.length) {
      return ctx.mustBe('favourite colours must be unique');
    }
    return true;
  }
);

const favouriteColoursSet = favouriteColours.pipe((a) => new Set(a));

const profile = type(
  {
    type: "'listener'",
    boughtTracks: 'integer>0',
  },
  '|',
  {
    type: "'artist'",
    publishedTracks: 'integer>0',
  }
);

const fileSystem = scope({
  filename: '0<string<255',
  file: {
    type: "'file'",
    name: 'filename',
  },
  directory: {
    type: "'directory'",
    name: 'filename',
    children: [
      'root[]',
      ':',
      (v, ctx) => {
        if (new Set(v.map((f) => f.name)).size !== v.length) {
          return ctx.mustBe('names must be unique in a directory');
        }
        return true;
      },
    ],
  },
  root: 'file|directory',
}).resolve('root');

const userJson = type({
  name: '0<string<255',
  email: 'email',
  createdAt: isoDate,
  updatedAt: isoDate,
  subscription: ['===', ...SUBSCRIPTION_TYPES] as const,
  stripeId: /^cus_[a-zA-Z0-9]{14,}$/,
  visits: 'integer>0',
  favouriteColours: favouriteColoursSet,
  profile,
  fileSystem,
}).narrow((u, ctx) => {
  if (u.updatedAt < u.createdAt) {
    return ctx.mustBe('createdAt must be less or equal than updatedAt');
  }
  return true;
});

type UserJson = typeof userJson.infer;

type User = UserJson;

export const decodeUser = (u: unknown): Result<string, User> =>
  // the lib mutates the input
  mapResult(userJson(JSON.parse(JSON.stringify(u))));

export const encodeUser = (_u: User): Result<'the lib cannot do it', never> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

// utils

const mapResult = <E, T>(r: T | ArkErrors): Result<string, T> =>
  r instanceof ArkErrors
    ? { _tag: 'left', error: JSON.stringify(r) }
    : { _tag: 'right', value: r };

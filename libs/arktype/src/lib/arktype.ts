import { ArkErrors, type } from 'arktype';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';
import { Objects, Pipe, Strings, Tuples } from 'hotscript';
import Mutable = Objects.Mutable;

/* TODO explore narrowing
const palindromicEmail = type("email").narrow((address, ctx) => {
	if (address === [...address].reverse().join("")) {
		// congratulations! your email is somehow a palindrome
		return true
	}
	// add a customizable error and return false
	return ctx.mustBe("a palindrome")
})

const palindromicContact = type({
	email: palindromicEmail,
	score: "integer < 100"
})
 */

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

const user = type({
  // TODO how to do compatibility? e.g. convert io-ts into name
  // TODO add user id to all the libs
  name: '0<string<255',
  email: 'email',
  createdAt: 'parse.date',
  updatedAt: 'parse.date',
  subscription: SUBSCRIPTION_TYPES_LITERAL,
  stripeId: /cus_[a-zA-Z0-9]{14,}/,
  visits: 'integer>0',
  // TODO represent a set?
  favouriteColours: `(${COLOURS_WITH_CODES_LITERAL})[]`,
});

type User = typeof user.infer;

export const decodeUser = (u: unknown): Result<ArkErrors, User> => {
  const result = user(u);
  return mapResult(result);
};

export const encodeUser = (_u: User): Result<'the lib cannot do it', never> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

// utils

const mapResult = <E, T>(r: T | ArkErrors): Result<ArkErrors, T> =>
  r instanceof ArkErrors
    ? { _tag: 'left', error: r }
    : { _tag: 'right', value: r };

import { ArkErrors, type } from 'arktype';
import {
  chain,
  COLOURS,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';
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

const userJson = type({
  name: '0<string<255',
  email: 'email',
  // https://github.com/arktypeio/arktype/issues/909 morphs aren't really here yet
  createdAt: 'string',
  updatedAt: 'string',
  subscription: SUBSCRIPTION_TYPES_LITERAL,
  stripeId: /^cus_[a-zA-Z0-9]{14,}$/,
  visits: 'integer>0',
  // https://github.com/arktypeio/arktype/issues/909 morphs aren't really here yet
  favouriteColours: `(${COLOURS_WITH_CODES_LITERAL})[]`,
});

type UserJson = typeof userJson.infer;

// type User = Omit<UserJson, 'favouriteColours' | 'createdAt' | 'updatedAt'> & {
//   createdAt: Date;
//   updatedAt: Date;
//   favouriteColours: Set<string>;
// };

type User = UserJson;

export const decodeUser = (u: unknown): Result<string, User> => {
  const result = userJson(u);

  return chain((u: UserJson): Result<string, User> => {
    // const favouriteColours = new Set(u.favouriteColours);
    // if (favouriteColours.size !== u.favouriteColours.length) {
    //   return { _tag: 'left', error: 'favourite colours must be unique' };
    // }
    // const createdAt = new Date(u.createdAt);
    // if (isNaN(createdAt.getTime())) {
    //   return { _tag: 'left', error: 'createdAt must be a valid ISO date' };
    // }
    // const updatedAt = new Date(u.updatedAt);
    // if (isNaN(updatedAt.getTime())) {
    //   return { _tag: 'left', error: 'updatedAt must be a valid ISO date' };
    // }
    return {
      _tag: 'right',
      // value: {
      //   ...u,
      //   favouriteColours,
      //   createdAt,
      //   updatedAt,
      // },
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

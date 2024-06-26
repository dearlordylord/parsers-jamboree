import * as S from 'schemata-ts/schemata/index';
import * as Nt from 'schemata-ts/newtype';
import type { OutputOf, Schema } from 'schemata-ts/Schema';
import * as k from 'kuvio';
import { pipe } from 'fp-ts/function';
import { Ord } from 'fp-ts/lib/Ord';
import { Either, isRight } from 'fp-ts/lib/Either';
import { Ord as SOrd } from 'fp-ts/lib/string';
import { deriveTranscoder } from 'schemata-ts/Transcoder';
import { TranscodeErrors } from 'schemata-ts/TranscodeError';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';

// by the pattern of schemata/UUID.ts
type StripeIdBrand = {
  readonly StripeId: unique symbol
}

export type StripeId = Nt.Newtype<StripeIdBrand, string>;

const isoStripeId = Nt.iso<StripeId>()

const StripeIdSchema: Schema<string, StripeId> = pipe(
    S.Pattern(k.sequence(k.exactString('cus_'), k.atLeast('NffrFeUfNV2Hib'.length)(k.alnum)), `Stripe Id of format cus_XXXXXXXXXXXXXX`),
    S.Newtype(isoStripeId, `Stripe Id`),
  )

const ColourSchema = S.Union(S.Literal(...COLOURS), S.HexColor);

export type Colour = OutputOf<typeof ColourSchema>;

const colourOrd: Ord<Colour> = SOrd;

export const UserSchema = S.Struct({
  name: S.NonEmptyString,
  email: S.EmailAddress,
  createdAt: S.DateFromIsoString(),
  updatedAt: S.DateFromIsoString(),
  subscription: S.Literal(...SUBSCRIPTION_TYPES),
  stripeId: StripeIdSchema,
  visits: S.Int({ min: 0 }), // somehow, there's also NonNegativeFloat but no NonNegativeInteger
  favouriteColours: S.SetFromArray(colourOrd)(ColourSchema),
}).strict();

export type User = OutputOf<typeof UserSchema>;

export const NamelessUserSchema = UserSchema.omit('name');

export type NamelessUser = OutputOf<typeof NamelessUserSchema>;

// explicit annotation expected! https://github.com/jacob-alford/schemata-ts/issues/296#issuecomment-1765425875
type TreeNode = {
  name: string;
  children: readonly TreeNode[];
}

export const TreeNodeSchema: Schema<TreeNode, TreeNode> = S.Struct({
  name: S.String(),
  children: S.Array(S.Lazy('TreeNode', () => TreeNodeSchema)),
}).strict();

const userTranscoder = deriveTranscoder(UserSchema);

export const parseUser = (user: unknown): Result<TranscodeErrors, User> => {
  const result = userTranscoder.decode(user);
  return mapResult(result);
}

export const encodeUser = (user: User): Result<TranscodeErrors, unknown> => {
  const result = userTranscoder.encode(user);
  return mapResult(result);
};

const namelessUserTranscoder = deriveTranscoder(NamelessUserSchema);

export const parseNamelessUser = (user: unknown): Result<TranscodeErrors, NamelessUser> => {
  const result = namelessUserTranscoder.decode(user);
  return mapResult(result);
}

export const encodeNamelessUser = (user: NamelessUser): unknown => namelessUserTranscoder.encode(user);

const treeNodeTranscoder = deriveTranscoder(TreeNodeSchema);

export const parseTree = (node: unknown): Result<TranscodeErrors, TreeNode> => {
  const result = treeNodeTranscoder.decode(node);
  return mapResult(result);
}

export const encodeTree = (node: TreeNode): Result<TranscodeErrors, TreeNode> => {
  const result = treeNodeTranscoder.encode(node);
  return mapResult(result);
};

// helpers, unrelated to the library
const mapResult = <E, T>(e: Either<E, T>): Result<E, T> => isRight(e) ? { _tag: 'right', value: e.right } : { _tag: 'left', error: e.left };
const unwrapEither = <E, T>(e: Either<E, T>): T => {
  if (isRight(e)) {
    return e.right;
  } else {
    throw new Error(JSON.stringify(e.left));
  }
}

import * as v from '@badrap/valita';
import {
  COLOURS,
  ISO_DATE_REGEX_S,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

const colour = v.union(...COLOURS.map(v.literal));
const hexColour = v
  .string()
  .assert(
    (s) => !!s.match(/^#[a-fA-F0-9]{6}$/),
    "doesn't look like a hex colour"
  );

type FileSystem = (
  | {
      type: 'directory';
      children: FileSystem[];
    }
  | {
      type: 'file';
    }
) & {
  name: string;
};

// bad composability
const fileSystemCommonDefinitionProperties = {
  name: v.string(),
};

const fileSystem: v.Type<FileSystem> = v.lazy(() =>
  v.union(
    v.object({
      type: v.literal('directory'),
      children: v
        .array(fileSystem)
        .assert(
          (a) => new Set(a.map((f) => f.name)).size === a.length,
          'expected unique names in the children'
        ),
      ...fileSystemCommonDefinitionProperties,
    }),
    v.object({
      type: v.literal('file'),
      ...fileSystemCommonDefinitionProperties,
    })
  )
);

const subscription = v.union(...SUBSCRIPTION_TYPES.map(v.literal));

const EMAIL_REGEX = /^[^@]+@[^@]+$/;

const ISO_DATE_REGEX = new RegExp(ISO_DATE_REGEX_S);

const isoDate = v
  .string()
  .assert(
    (s) => ISO_DATE_REGEX.test(s),
    `expected iso date of format ${ISO_DATE_REGEX_S}`
  )
  .map((s) => new Date(s));

const nonNegativeInteger = v
  .number()
  .assert((n) => n >= 0, 'must be a positive number')
  .assert((n) => n % 1 === 0, 'must be an integer');

const user = v
  .object({
    name: v.string().assert((s) => s.length > 0, 'name must be non-empty'),
    email: v
      .string()
      .assert((s) => EMAIL_REGEX.test(s), "doesn't look like an email"),
    createdAt: isoDate,
    updatedAt: isoDate,
    subscription,
    stripeId: v
      .string()
      .assert(
        (s) => !!s.match(/^cus_[a-zA-Z0-9]{14,}$/),
        "doesn't look like a stripe id"
      ),
    visits: nonNegativeInteger,
    favouriteColours: v
      .array(v.union(colour, hexColour))
      .assert(
        (a) => new Set(a).size === a.length,
        'favourite colours must be unique'
      )
      .map((a) => new Set(a)),
    profile: v.union(
      v.object({
        type: v.literal('listener'),
        boughtTracks: nonNegativeInteger,
      }),
      v.object({
        type: v.literal('artist'),
        publishedTracks: nonNegativeInteger,
      })
    ),
    fileSystem,
  })
  .assert(
    (u) => u.createdAt <= u.updatedAt,
    'createdAt must be less or equal than updatedAt'
  );

type User = v.Infer<typeof user>;

export const decodeUser = (u: unknown): Result<unknown, User> => {
  try {
    return { _tag: 'right', value: user.parse(u) };
  } catch (e) {
    return {
      _tag: 'left',
      error: (e as any).message,
    };
  }
};

export const encodeUser = (_u: User): Result<unknown, unknown> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
    acceptsTypedInput: false,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `Default method is not present, no mention in docs.`,
  },
};

import * as v from 'valibot';
import { COLOURS, Result, SUBSCRIPTION_TYPES } from '@parsers-jamboree/common';

const NonEmptyStringSchema = v.pipe(
  v.string(),
  v.minLength(1),
  v.brand('NonEmptyString')
);

type NonEmptyString = v.InferOutput<typeof NonEmptyStringSchema>;

// email format specifics: https://github.com/fabian-hiller/valibot/issues/204
const EmailSchema = v.pipe(NonEmptyStringSchema, v.email(), v.brand('Email'));

const UserNameSchema = v.pipe(NonEmptyStringSchema, v.brand('UserName'));

const DatetimeSchema = v.pipe(v.string(), v.isoTimestamp());

const SubscriptionSchema = v.picklist(SUBSCRIPTION_TYPES);

const StripeCustomerIdSchema = v.pipe(
  v.string(),
  v.regex(/^cus_[a-zA-Z0-9]{14,}$/),
  v.transform((i) => i as `cus_${string}`),
  v.brand('StripeId')
);
// we can do custom<`cus_${string}`>((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)) to narrow the literal type further to cus_${string}
// but custom() function API is lacking: I have to repeat regex + output type and do string check again manually
const StripeCustomerIdSchemaOption2 = v.pipe(
  v.custom<`cus_${string}`>(
    (v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)
  ),
  v.brand('StripeId')
);

const NonNegativeIntegerSchema = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(0),
  v.brand('NonNegativeInteger')
);

const VisitsSchema = v.pipe(NonNegativeIntegerSchema, v.brand('Visits'));

const HexColourSchema = v.pipe(
  v.string(),
  v.regex(/^#[a-fA-F0-9]{6}$/),
  v.brand('HexColour')
);

const ColourSchema = v.pipe(v.picklist(COLOURS), v.brand('Colour'));

const uniqArray = <S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: S
) =>
  v.pipe(
    v.array(schema),
    v.check((v) => new Set(v).size === v.length, 'Expected unique items')
  );

// default set doesn't work as I would expect https://github.com/fabian-hiller/valibot/issues/685
const set = <S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: S
) =>
  v.pipe(
    uniqArray(schema),
    v.transform((v) => new Set(v))
  );

const FavouriteColoursSchema = set(v.union([HexColourSchema, ColourSchema]));

// we have to pass a discriminator explicitly; the lib cannot figure it out
const ProfileSchema = v.variant('type', [
  v.object({
    type: v.literal('listener'),
    boughtTracks: NonNegativeIntegerSchema,
  }),
  v.object({
    type: v.literal('artist'),
    publishedTracks: NonNegativeIntegerSchema,
  }),
]);

const TemporalConcernUnsortedSchema = v.object({
  createdAt: DatetimeSchema,
  updatedAt: DatetimeSchema,
});

const TemporalConcernSchema = v.pipe(
  TemporalConcernUnsortedSchema,
  v.forward(
    v.partialCheck(
      [['createdAt'], ['updatedAt']],
      (input) => input.createdAt <= input.updatedAt,
      'createdAt must be less or equal than updatedAt'
    ),
    ['updatedAt']
  )
);

const FileSystemCommonSchema = v.object({
  name: NonEmptyStringSchema,
});

type FileSystem = (
  | {
      readonly type: 'directory';
      readonly children: readonly FileSystem[];
    }
  | {
      readonly type: 'file';
    }
) & {
  readonly name: NonEmptyString;
};

const FileSystemDirectorySchema: v.GenericSchema<
  // undocumented; manually put input type here (or unknown, which would cover most cases)
  Omit<FileSystem, 'name'> & { type: 'directory'; name: string },
  FileSystem & { type: 'directory' }
> = v.intersect([
  FileSystemCommonSchema,
  v.pipe(
    v.object({
      type: v.literal('directory'),
      children: v.array(v.lazy(() => FileSystemSchema)),
    }),
    v.check(
      (v) => new Set(v.children.map((c) => c.name)).size === v.children.length,
      'Expected unique names in the children'
    )
  ),
]);

const FileSystemFileSchema = v.intersect([
  FileSystemCommonSchema,
  v.object({
    type: v.literal('file'),
  }),
]);

const FileSystemSchema = v.union([
  FileSystemDirectorySchema,
  FileSystemFileSchema,
]);

const UserSchema = v.intersect([
  v.object({
    name: UserNameSchema,
    email: EmailSchema,
    subscription: SubscriptionSchema,
    stripeId: StripeCustomerIdSchema,
    visits: VisitsSchema,
    favouriteColours: FavouriteColoursSchema,
    profile: ProfileSchema,
    fileSystem: FileSystemSchema,
  }),
  TemporalConcernSchema,
]);

type User = v.InferOutput<typeof UserSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> =>
  mapResult(v.safeParse(UserSchema, u));

export const encodeUser = (_u: User): Result<unknown, unknown> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

// utils

const mapResult = (
  r: v.SafeParseResult<typeof UserSchema>
): Result<string, User> => {
  if (r.success) {
    return { _tag: 'right', value: r.output };
  } else {
    return { _tag: 'left', error: JSON.stringify(v.flatten(r.issues), null, 2) };
  }
};

import {
  email,
  string,
  pipe,
  object,
  minLength,
  brand,
  InferOutput,
  literal,
  picklist,
  regex,
  integer,
  minValue,
  number,
  union,
  variant,
  custom,
  safeParse,
  SafeParseResult,
  flatten,
  array,
  check,
  transform,
  BaseIssue,
  isoTimestamp,
  intersect,
  lazy,
  GenericSchema,
  BaseSchema,
  forward,
  partialCheck,
} from 'valibot';
import {
  COLOURS,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta, TrustedCompileTimeMetaExplanations
} from '@parsers-jamboree/common';

const NonEmptyStringSchema = pipe(
  string(),
  minLength(1),
  brand('NonEmptyString')
);

type NonEmptyString = InferOutput<typeof NonEmptyStringSchema>;

// email format specifics: https://github.com/fabian-hiller/valibot/issues/204
const EmailSchema = pipe(NonEmptyStringSchema, email(), brand('Email'));

const UserNameSchema = pipe(NonEmptyStringSchema, brand('UserName'));

const DatetimeSchema = pipe(string(), isoTimestamp());

const SubscriptionSchema = picklist(SUBSCRIPTION_TYPES);

const StripeCustomerIdSchema = pipe(
  string(),
  regex(/^cus_[a-zA-Z0-9]{14,}$/),
  brand('StripeId')
);
// we can do custom<`cus_${string}`>((v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)) to narrow the literal type further to cus_${string}
// but custom() function API is lacking: I have to repeat regex + output type and do string check again manually
const StripeCustomerIdSchemaOption2 = pipe(
  string(),
  custom<`cus_${string}`>(
    (v) => typeof v === 'string' && /cus_[a-zA-Z0-9]{14,}/.test(v)
  ),
  brand('StripeId')
);

// can't also find `special` referenced here https://github.com/fabian-hiller/valibot/issues/291
// type StripeCustomerLiteral = `cus_${string}`;
// const StripeCustomerIdSchemaOption3 = special<Key>((key:string) => {
//   const parts = key.split("-");
//   const num = parts.unshift();
//   if (Number.isNaN(Number(num))) return false;
//   const str = parts.join('-');
//   if (typeof str !== "string") return false;
//   return true;
// });

const NonNegativeIntegerSchema = pipe(
  number(),
  integer(),
  minValue(0),
  brand('NonNegativeInteger')
);

const VisitsSchema = pipe(NonNegativeIntegerSchema, brand('Visits'));

const HexColourSchema = pipe(
  string(),
  regex(/^#[a-fA-F0-9]{6}$/),
  brand('HexColour')
);

const ColourSchema = pipe(picklist(COLOURS), brand('Colour'));

const uniqArray = <S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: S
) =>
  pipe(
    array(schema),
    check((v) => new Set(v).size === v.length, 'Expected unique items')
  );

// default set doesn't work as I would expect https://github.com/fabian-hiller/valibot/issues/685
const set = <S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: S
) =>
  pipe(
    uniqArray(schema),
    transform((v) => new Set(v))
  );

const FavouriteColoursSchema = set(union([HexColourSchema, ColourSchema]));

// we have to pass a discriminator explicitly; the lib cannot figure it out
const ProfileSchema = variant('type', [
  object({
    type: literal('listener'),
    boughtTracks: NonNegativeIntegerSchema,
  }),
  object({
    type: literal('artist'),
    publishedTracks: NonNegativeIntegerSchema,
  }),
]);

const TemporalConcernUnsortedSchema = object({
  createdAt: DatetimeSchema,
  updatedAt: DatetimeSchema,
});

const TemporalConcernSchema = pipe(
  TemporalConcernUnsortedSchema,
  forward(
    partialCheck(
      [['createdAt'], ['updatedAt']],
      (input) => input.createdAt <= input.updatedAt,
      'createdAt must be less or equal than updatedAt'
    ),
    ['updatedAt']
  )
);

const FileSystemCommonSchema = object({
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

const FileSystemDirectorySchema: GenericSchema<
  // undocumented; manually put input type here (or unknown, which would cover most cases)
  Omit<FileSystem, 'name'> & { type: 'directory'; name: string },
  FileSystem & { type: 'directory' }
> = intersect([
  FileSystemCommonSchema,
  pipe(
    object({
      type: literal('directory'),
      children: array(lazy(() => FileSystemSchema)),
    }),
    check(
      (v) => new Set(v.children.map((c) => c.name)).size === v.children.length,
      'Expected unique names in the children'
    )
  ),
]);

const FileSystemFileSchema = intersect([
  FileSystemCommonSchema,
  object({
    type: literal('file'),
  }),
]);

const FileSystemSchema = union([
  FileSystemDirectorySchema,
  FileSystemFileSchema,
]);

const UserSchema = intersect([
  object({
    name: UserNameSchema,
    email: EmailSchema,
    subscription: SubscriptionSchema,
    stripeId: StripeCustomerIdSchema,
    visits: VisitsSchema,
    favouriteColours: FavouriteColoursSchema,
    profile: ProfileSchema,
    fileSystem: FileSystemSchema,
    // we can check dependent fields with custom() but I don't like the API in its current state
  }),
  TemporalConcernSchema,
]);

type User = InferOutput<typeof UserSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> => {
  const result = safeParse(UserSchema, u);
  return mapResult(result);
};

export const encodeUser = (_u: User): Result<unknown, unknown> => {
  return { _tag: 'left', error: 'the lib cannot do it' };
};

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: true,
    typedErrors: true,
    templateLiterals: false,
  },
  explanations: {
    templateLiterals: 'Not natively supported + I didn\'t manage to hack them into working without casting, see code comments',
  }
};

// utils

const mapResult = (
  r: SafeParseResult<typeof UserSchema>
): Result<string, User> => {
  if (r.success) {
    return { _tag: 'right', value: r.output };
  } else {
    return { _tag: 'left', error: JSON.stringify(flatten(r.issues), null, 2) };
  }
};

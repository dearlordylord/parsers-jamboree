

import vine, { BaseLiteralType } from '@vinejs/vine';
import {
  COLOURS, ISO_DATE_REGEX_S,
  PROFILE_TYPE_ARTIST,
  PROFILE_TYPE_LISTENER,
  PROFILE_TYPES,
  Result,
  SUBSCRIPTION_TYPES
} from '@parsers-jamboree/common';
import { FieldContext, FieldOptions, Infer, Validation } from '@vinejs/vine/build/src/types';
import { ValidationError } from '@vinejs/vine/build/src/errors/validation_error';
import type { OTYPE } from '@vinejs/vine/build/src/symbols';

// loses on "represent a union of literals or a string literal" check

// const coloursSchema = vine.enum(COLOURS);
// const hexColourSchema = vine.string().regex(/^#[a-fA-F0-9]{6}$/);
// doesn't work, throws in runtime (and it makes no sense to me)
// const colourOrHexSchema = vine.unionOfTypes([coloursSchema, hexColourSchema]);
// doesn't work for me either, typing makes no sense as well
// const colourOrHexSchema = vine.union([
//   vine.union.if(
//     v => v, // v given is record; coloursSchema represents a string ...
//     coloursSchema,
//   ),
//   // ...
// ])

// as per https://vinejs.dev/docs/types/union#selecting-a-fiscal-host
// it's "What" because it's not a schema yet; feeding it into vine will work compile time but will throw runtime "TypeError: refs.trackConditional is not a function"
const profileWhat = vine.group([
  vine.group.if((data) => data['type'] === PROFILE_TYPE_LISTENER, {
    type: vine.literal(PROFILE_TYPE_LISTENER),
    boughtTracks: vine.number().min(0),
  }),
  vine.group.if((data) => data['type'] === PROFILE_TYPE_ARTIST, {
    type: vine.literal(PROFILE_TYPE_ARTIST),
    publishedTracks: vine.number().min(0),
  }),
]);


const profileSchema = vine.object({
  // in total, we repeat the poor enum 3 times
  type: vine.enum(PROFILE_TYPES),
}).merge(profileWhat);

// https://vinejs.dev/docs/extend/custom_schema_types
const isIsoDate = vine.createRule((value: unknown, _, field: FieldContext) => {

  if (typeof value !== 'string') {
    field.report('The {{ field }} field value must be a string', 'isoDate', field);
    return;
  }

  if (!value.match(ISO_DATE_REGEX_S)) {
    field.report('The {{ field }} field value must be a valid ISO date', 'isoDate', field);
    return;
  }
  const date = new Date(value);

  // interesting api
  field.mutate(date, field)
});

export class IsoDate extends BaseLiteralType<string, Date, Date> {
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [isIsoDate()])
  }

  clone() {
    return new IsoDate(
      this.cloneOptions(),
      this.cloneValidations()
    ) as this
  }
}

const userSchema = vine.object({
  name: vine.string().minLength(1).maxLength(255),
  email: vine.string().email(),
  // this lib's date() has special proprietary format: 1990-01-01 00:00:00
  // createdAt: vine.date(),
  // updatedAt: vine.date(),
  createdAt: new IsoDate(),
  updatedAt: new IsoDate(),
  subscription: vine.enum(SUBSCRIPTION_TYPES),
  stripeId: vine.string().regex(/^cus_[a-zA-Z0-9]{14,}$/),
  visits: vine.number().min(0),
  favouriteColours: vine.array(vine.string()), // I gave up on this one for the reasons above
  profile: profileSchema,
});

type User = Infer<typeof userSchema>;

export const decodeUserForcedAsync = async (user: unknown): Promise<Result<string, User>> => {
  const r = await vine.tryValidate({
    schema: userSchema,
    data: user,
  });
  return mapResult(r);
};

export const encodeUser = (user: User): Result<string, unknown> => ({ _tag: 'left', error: 'the lib cannot do it' })

// utils

const mapResult = <S extends {
  [OTYPE]: any;
}>(r: [ValidationError, null] | [null, Infer<S>]): Result<string, Infer<S>> =>
  r[0] ? { _tag: 'left', error: JSON.stringify(r[0]) } : { _tag: 'right', value: r[1] };

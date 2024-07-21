import { object, string, number, date, InferType, array, mixed } from 'yup';
import {
  COLOURS,
  Result,
  SUBSCRIPTION_TYPES,
  TrustedCompileTimeMeta,
} from '@parsers-jamboree/common';

// let isoDate = date().required().transform((v) => {
//   // "v" is "any"
// });

// the developer's position is `let` all the time https://github.com/jquense/yup/pull/2227
let userSchema = object({
  name: string().required(/*implicitly filters empty strings too*/),
  email: string().email().required(),
  createdAt: date().required(), // no transform possible in ts
  updatedAt: date().required(), // no transform possible in ts
  subscription: string()
    .oneOf(SUBSCRIPTION_TYPES)
    .required(/*still "undefined" after oneOf*/),
  stripeId: string()
    .matches(/^cus_[a-zA-Z0-9]{14,}$/)
    .required(),
  visits: number().min(0).integer().required(),
  // favouriteColours: array().of(string().required()/*.matches(/^#[a-fA-F0-9]{6}$/) - no unions, again?*/).required().transform((v, input, ctx) => {
  //   // the fact of returning it 1) breaks the type (still array) 2) breaks the validation runtime completely ({} is returned)
  //   return new Set(v);
  // }),
  favouriteColours: mixed(
    (input: any): input is Set<(typeof COLOURS)[number] | `#${string}`> =>
      input instanceof
        Set /*parse/validate the contents yourself, propagate errors yourself?*/ &&
      [...input.values()].every(
        (v) =>
          typeof v === 'string' &&
          (COLOURS.indexOf(v as (typeof COLOURS)[number]) !== -1 ||
            !!v.match(/^#[a-fA-F0-9]{6}$/))
      )
  )
    .required()
    .transform((v, input, ctx) => {
      if (ctx.isType(v)) return v;
      if (!Array.isArray(v)) return ctx.typeError('Expected an array');
      const r = new Set(v);
      if (r.size !== v.length) {
        return ctx.typeError('Expected unique items');
      }
      if (
        !v.every(
          (v) =>
            typeof v === 'string' &&
            (COLOURS.indexOf(v as (typeof COLOURS)[number]) !== -1 ||
              !!v.match(/^#[a-fA-F0-9]{6}$/))
        )
      ) {
        return ctx.typeError('Expected a valid colour or hex colour');
      }
      return r;
    }),

  profile: object()
    .transform((v) => {
      // the lib doesn't seem to accept unions; we can write our own runtime check

      // if (v.type === PROFILE_TYPE_LISTENER) {
      //   return {
      //     type: PROFILE_TYPE_LISTENER,
      //     boughtTracks: v.boughtTracks /*now, this is not composable with other parsers because we're already in the world of runtime checks; we can start using parsers here too but I don't think it worth it*/,
      //   };
      // } else if (v.type === PROFILE_TYPE_ARTIST) {
      //   return {
      //     type: PROFILE_TYPE_ARTIST,
      //     publishedTracks: v.publishedTracks, /* same, unchecked */
      //   };
      // }

      // ^ as a result of the above, we still get the type `{}` from InferType method, so that's no more than a runtime check; I have to throw it away

      return v;
    })
    .required(),
});

type User = InferType<typeof userSchema>;

export const meta: TrustedCompileTimeMeta = {
  items: {
    branded: false,
    typedErrors: false,
    templateLiterals: false,
    emailFormatAmbiguityIsAccountedFor: true,
  },
  explanations: {
    emailFormatAmbiguityIsAccountedFor: `Default method is present with a warning https://github.com/jquense/yup?tab=readme-ov-file#stringemailmessage-string--function-schema`,
  },
};

export const decodeUser = (u: unknown): Result<unknown, User> => {
  try {
    return { _tag: 'right', value: userSchema.cast(u) };
  } catch (e) {
    return {
      _tag: 'left',
      error: (e as any).message /*we have no idea what's the error type is*/,
    };
  }
};

export const encodeUser = (u: User): Result<unknown, unknown> => ({
  _tag: 'left',
  error: 'the lib cannot do it',
});

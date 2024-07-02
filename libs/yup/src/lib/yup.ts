import { object, string, number, date, InferType, array } from 'yup';
import {
  Result,
  SUBSCRIPTION_TYPES
} from '@parsers-jamboree/common';

// the developer's position is `let` all the time https://github.com/jquense/yup/pull/2227
let userSchema = object({
  name: string().required(/*implicitly filters empty strings too*/),
  email: string().email().required(),
  createdAt: date().required(),
  updatedAt: date().required(),
  subscription: string().oneOf(SUBSCRIPTION_TYPES).required(/*still "undefined" after oneOf*/),
  stripeId: string().matches(/^cus_[a-zA-Z0-9]{14,}$/).required(),
  visits: number().min(0).integer().required(),
  favouriteColours: array().of(string()/*.matches(/^#[a-fA-F0-9]{6}$/).required() - no unions, again?*/).required(),
  profile: object().transform((v) => {
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


  }).required(),
});

type User = InferType<typeof userSchema>;

export const decodeUser = (u: unknown): Result<unknown, User> => {
  try {
    return { _tag: 'right', value: userSchema.validateSync(u) };
  } catch (e) {
    return { _tag: 'left', error: e/*we have no idea what's the error type is*/ };
  }
};

export const encodeUser = (u: User): Result<unknown, unknown> => ({ _tag: 'left', error: 'the lib cannot do it' });

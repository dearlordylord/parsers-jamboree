import { igor } from './checker';
import { constant, flow } from 'fp-ts/function';
import { Pipe, Objects, Strings } from 'hotscript';
import { Match } from 'hotscript/dist/internals/match/Match';

type Breaker<T> = (t: T) => T;
type Igor = typeof igor;
type UserBreaker = Breaker<Igor>;

const switchFields = <T extends Record<string, unknown>, F1 extends keyof T, F2 extends keyof T>(f1: F1, f2: F2) => (x: T): T => ({
  ...x,
  [f1]: x[f2],
  [f2]: x[f1],
});

// typing isn't great, can break runtime with wrong "m"...
const mutateField = <V>(m: (f: V) => V) => <T_ extends Record<string, unknown | V>, F extends keyof Pipe<T_, [Objects.PickBy<Match<V>>]>>(f: F) => <T extends T_ & { [K in F]: V }>(x: T): T => ({
  ...x,
  [f]: m(x[f]),
});


export const switchDates: UserBreaker = switchFields('createdAt', 'updatedAt');

export const prefixCustomerId: UserBreaker = mutateField((s) => `A_${s}`)('stripeId');

export const addTwoAtsToEmail: UserBreaker = mutateField((s) => `a@b@${s}`)('email');

export const clearName: UserBreaker = mutateField(constant(''))('name');

export const addFavouriteTiger: UserBreaker = mutateField((s: string[]) => [...s, 'tiger'])('favouriteColours');

export const addFavouriteRed: UserBreaker = mutateField((s: string[]) => [...s, 'red'])('favouriteColours');

export const setSubscriptionTypeBanana: UserBreaker = mutateField(constant('banana'))('subscription');

export const setHalfVisits: UserBreaker = mutateField((n: number) => n % 1 === 0 ? n + 0.5 : n)('visits');

// btw -1 is a valid JS date...
export const setCreatedAtCyborgWar: UserBreaker = mutateField(constant('-1000000'))('createdAt');

export const setProfileArtist: UserBreaker = mutateField(constant({
  type: 'artist',
  boughtTracks: 10,
}))('profile');

export const BREAKERS = {
  switchDates,
  prefixCustomerId,
  addTwoAtsToEmail,
  clearName,
  addFavouriteTiger,
  addFavouriteRed,
  setSubscriptionTypeBanana,
  setHalfVisits,
  setCreatedAtCyborgWar,
  setProfileArtist,
} as const;

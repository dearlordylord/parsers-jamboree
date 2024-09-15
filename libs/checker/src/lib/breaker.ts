import { igor } from './checker';
import { constant, pipe } from 'fp-ts/function';
import { Objects, Pipe } from 'hotscript';
import { Match } from 'hotscript/dist/internals/match/Match';
import * as A from 'fp-ts/Array';
import {
  chain, Feature,
  Result,
  TrustedCompileTimeMeta
} from '@parsers-jamboree/common';
import { deepEqual } from './utils';
import { contramap, Ord as GOrd } from 'fp-ts/Ord';
import { Ord } from 'fp-ts/string';
import { toEntries } from 'fp-ts/Record';

type Breaker<T> = (t: T) => T;
type Igor = typeof igor;
type UserBreaker = Breaker<Igor>;

const switchFields =
  <T extends Record<string, unknown>, F1 extends keyof T, F2 extends keyof T>(
    f1: F1,
    f2: F2
  ) =>
  (x: T): T => ({
    ...x,
    [f1]: x[f2],
    [f2]: x[f1],
  });

// typing isn't great, can break runtime with wrong "m"...
const mutateField =
  <V>(m: (f: V) => V) =>
  <
    T_ extends Record<string, unknown | V>,
    F extends keyof Pipe<T_, [Objects.PickBy<Match<V>>]>
  >(
    f: F
  ) =>
  <T extends T_ & { [K in F]: V }>(x: T): T => ({
    ...x,
    [f]: m(x[f]),
  });

export const switchDates: UserBreaker = switchFields('createdAt', 'updatedAt');

export const prefixCustomerId: UserBreaker = mutateField((s) => `A_${s}`)(
  'stripeId'
);

export const addTwoAtsToEmail: UserBreaker = mutateField((s) => `a@b@${s}`)(
  'email'
);

export const clearName: UserBreaker = mutateField(constant(''))('name');

export const addFavouriteTiger: UserBreaker = mutateField((s: string[]) => [
  ...s,
  'tiger',
])('favouriteColours');

export const addFavouriteRed: UserBreaker = mutateField((s: string[]) => [
  ...s,
  'red',
])('favouriteColours');

export const setSubscriptionTypeBanana: UserBreaker = mutateField(
  constant('banana')
)('subscription');

export const setHalfVisits: UserBreaker = mutateField((n: number) =>
  n % 1 === 0 ? n + 0.5 : n
)('visits');

export const setCreatedAtCyborgWar: UserBreaker = mutateField(constant('0'))(
  'createdAt'
);

export const setProfileArtist: UserBreaker = mutateField(
  constant({
    type: 'artist',
    boughtTracks: 10,
  })
)('profile');

export const addFileSystemUFOType: UserBreaker = mutateField(
  (fs: Igor['fileSystem']) => ({
    ...fs,
    children: [
      ...fs.children,
      {
        type: 'directory',
        name: 'ufos',
        children: [{ type: 'UFO', name: 'ufo.exe' }],
      },
    ],
  })
)('fileSystem');

export const addFileSystemDupeFile: UserBreaker = mutateField(
  (fs: Igor['fileSystem']) => ({
    ...fs,
    children: [
      ...fs.children,
      { type: 'file', name: 'bonjour.exe' },
      { type: 'file', name: 'bonjour.exe' },
    ],
  })
)('fileSystem');

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
  addFileSystemUFOType,
  addFileSystemDupeFile,
} as const;

// probably can do in purely types but "good enough" for now
const assertUnique = <T>(a: T[]): T[] => {
  const set = new Set(a);
  if (set.size !== a.length) {
    throw new Error('Expected unique items');
  }
  return a;
};

const makeSet = <T>(a: T[]): Set<T> => new Set(assertUnique(a));

export const BREAKERS_FEATURES = {
  switchDates: makeSet(['transformations']),
  prefixCustomerId: makeSet(['transformations', 'nominal']),
  addTwoAtsToEmail: makeSet(['transformations', 'nominal']),
  clearName: makeSet(['transformations', 'nominal']),
  addFavouriteTiger: makeSet(['transformations', 'nominal']),
  addFavouriteRed: makeSet(['transformations', 'nominal']),
  setSubscriptionTypeBanana: makeSet(['transformations', 'nominal']),
  setHalfVisits: makeSet(['transformations', 'nominal']),
  setCreatedAtCyborgWar: makeSet(['transformations']),
  setProfileArtist: makeSet(['adt', 'nominal']),
  addFileSystemUFOType: makeSet(['nominal', 'adt', 'recursion']),
  addFileSystemDupeFile: makeSet(['transformations', 'adt', 'recursion']),
} satisfies {
  [K in keyof typeof BREAKERS]: Set<Feature>;
};

export const RUNTIME_BREAKER_DESCRIPTIONS: {
  [K in keyof typeof BREAKERS]: string;
} = {
  switchDates: 'Switches the createdAt and updatedAt fields',
  prefixCustomerId: 'Adds an invalid prefix to the stripeId field',
  addTwoAtsToEmail: 'Renders the email invalid by adding two @s',
  clearName: 'Clears the name field',
  addFavouriteTiger: 'Adds an invalid colour to the favouriteColours field',
  // Although in some cases it's ok, other times I'd like to have no garbage in my database. Having duplicated values in a collection with "set" semantics means that one side of interaction doesn't really know what it's doing, and this is a potential timebomb better to fix the earliest.
  addFavouriteRed: `Adds a duplicated valid colour to the favouriteColours field`,
  setSubscriptionTypeBanana: 'Sets the subscription field to banana',
  setHalfVisits: 'Renders the visits field to be a float instead of an integer',
  setCreatedAtCyborgWar: 'Sets invalid createdAt date',
  setProfileArtist: 'Sets the valid profile field to an invalid structure',
  addFileSystemUFOType:
    'An enum test not unlike the Tiger test, but in composition with recursive data structures',
  addFileSystemDupeFile:
    'Adds a duplicated value to the tree. My tree has the “unique list” semantics, so that shouldn’t be possible',
};

const COMPILE_TIME_META_DESCRIPTIONS: {
  [K in keyof TrustedCompileTimeMeta['items']]: string;
} = {
  branded: 'Branded types are supported',
  typedErrors: 'Typed errors are supported',
  templateLiterals: 'Template literals are supported',
  emailFormatAmbiguityIsAccountedFor: `Email format ambiguity is accounted for either in API or in Docs. The library doesn't promise not being able to deliver`,
  acceptsTypedInput:
    'The library accepts not only unknown/any types as validation input, but more refined "intermediate" types as well',
  canGenerateJsonSchema:
    'Whether the schema itself can be serialized to cross-system communication. Became more relevant with OpenAI introducing structured outputs',
};

export type TesterArgs = {
  decodeUser: (u: unknown) => Result<unknown, unknown>;
  encodeUser: (u: unknown) => Result<unknown, unknown>;
  // that we just trust the passer to be correct
  meta: TrustedCompileTimeMeta;
};

const encodedEqualsInputSpecialBreakerKey = 'encodedEqualsInput' as const;
const transformationsPossibleSpecialBreakerKey =
  'transformationsPossible' as const;

const EXTRA_BREAKER_DESCRIPTIONS = {
  encodedEqualsInput:
    'Can encode the value into another value (mainly, back to a serializable format), vs. only decoding it',
  transformationsPossible:
    'Transformations are possible',
} as const;

export const BREAKER_DESCRIPTIONS = {
  ...RUNTIME_BREAKER_DESCRIPTIONS,
  ...COMPILE_TIME_META_DESCRIPTIONS,
  ...EXTRA_BREAKER_DESCRIPTIONS,
} as const;

export type BreakerKey =
  | keyof typeof BREAKERS
  | keyof TrustedCompileTimeMeta['items']
  | typeof encodedEqualsInputSpecialBreakerKey
  | typeof transformationsPossibleSpecialBreakerKey;

export type TesterResult = {
  key: BreakerKey;
  title: string;
  customTitle?: string;
  success: boolean;
}[];

export const SOrd = <T extends string = string>() => Ord as GOrd<T>;

export const runTesters = ({
  decodeUser,
  encodeUser,
  meta,
}: TesterArgs): TesterResult => [
  ...pipe(
    BREAKERS,
    toEntries,
    A.sort(
      pipe(
        SOrd<keyof typeof BREAKERS>(),
        contramap(([k]) => k)
      )
    ),
    A.map(([k, f]) => ({
      key: k,
      title: RUNTIME_BREAKER_DESCRIPTIONS[k as keyof typeof BREAKERS],
      customTitle: meta.explanations
        ? meta.explanations[k as keyof TrustedCompileTimeMeta['items']]
        : undefined,
      success: decodeUser(f(igor))._tag === 'left',
    }))
  ),
  {
    key: encodedEqualsInputSpecialBreakerKey,
    title: 'decode then encode doesnt break the input',
    success: deepEqual(
      {
        _tag: 'right',
        value: igor,
      },
      pipe(igor, JSON.stringify, JSON.parse, decodeUser, chain(encodeUser))
    ),
  },
  {
    key: transformationsPossibleSpecialBreakerKey,
    title: 'transformations are possible',
    success: pipe(
      igor,
      JSON.stringify,
      JSON.parse,
      decodeUser,
      chain((v) =>
        (
          v as any
        ) /*don't bother with decoded type here; outputs are various*/?.[
          'favouriteColours' satisfies keyof typeof igor
        ] instanceof Set
          ? { _tag: 'right', value: v }
          : { _tag: 'left', error: 'transformations are not possible' }
      ),
      (v) => v._tag === 'right'
    ),
  },
  ...pipe(
    meta.items,
    toEntries,
    A.map(([k, v]) => ({
      key: k,
      title:
        COMPILE_TIME_META_DESCRIPTIONS[
          k as keyof TrustedCompileTimeMeta['items']
        ],
      customTitle: meta.explanations
        ? meta.explanations[k as keyof TrustedCompileTimeMeta['items']]
        : undefined,
      success: v,
    }))
  ),
];

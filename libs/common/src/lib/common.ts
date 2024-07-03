export const SUBSCRIPTION_TYPE_FREE = 'free' as const;
export const SUBSCRIPTION_TYPE_PRO = 'pro' as const;
export const SUBSCRIPTION_TYPE_ENTERPRISE = 'enterprise' as const;

export const SUBSCRIPTION_TYPES = [
  SUBSCRIPTION_TYPE_FREE,
  SUBSCRIPTION_TYPE_PRO,
  SUBSCRIPTION_TYPE_ENTERPRISE,
] as const;

export type SubscriptionType = (typeof SUBSCRIPTION_TYPES)[number];

export const COLOUR_RED = 'red' as const;
export const COLOUR_GREEN = 'green' as const;
export const COLOUR_BLUE = 'blue' as const;

// assume it's a finite set of 3
export const COLOURS = [COLOUR_RED, COLOUR_GREEN, COLOUR_BLUE] as const;

export const PROFILE_TYPE_LISTENER = 'listener' as const;
export const PROFILE_TYPE_ARTIST = 'artist' as const;

export const PROFILE_TYPES = [
  PROFILE_TYPE_LISTENER,
  PROFILE_TYPE_ARTIST,
] as const;

// common interface for reviewed parsers' results
export type Result<E, T> =
  | {
      _tag: 'left';
      error: E;
    }
  | {
      _tag: 'right';
      value: T;
    };

export const map =
  <E, T, U>(f: (t: T) => U) =>
  (r: Result<E, T>): Result<E, U> =>
    r._tag === 'left' ? r : { _tag: 'right', value: f(r.value) };

export const chain =
  <E, T, U>(f: (t: T) => Result<E, U>) =>
  (r: Result<E, T>): Result<E, U> =>
    r._tag === 'left' ? r : f(r.value);

export type ResultValue<R extends Result<unknown, unknown>> = R extends Result<
  unknown,
  infer T
>
  ? T
  : never;

export const unwrapResult =
  <E>(showError: (e: E) => string) =>
  <T>(result: Result<E, T>): T => {
    if (result._tag === 'right') {
      return result.value;
    } else {
      throw new Error(showError(result.error));
    }
  };

// iso8601 regex https://stackoverflow.com/a/28022901/2123547
export const ISO_DATE_REGEX_S =
  '^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$';
export const EMAIL_REGEX_S =
  '^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$';

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

export const unwrapResult =
  <E>(showError: (e: E) => string) =>
  <T>(result: Result<E, T>): T => {
    if (result._tag === 'right') {
      return result.value;
    } else {
      throw new Error(showError(result.error));
    }
  };

import type { Lib } from './parsers/runtimes';

// @ts-expect-error
const assertRouteAssertion: never = 'assert' as Lib & 'ajv';

export const SUMMARY_ROUTE = 'summary';
const assertSummaryRoute: never = 'assert' as Lib & typeof SUMMARY_ROUTE;

export const TEST_CASE_ROUTE = 'test-case';
const assertTestCaseRoute: never = 'assert' as Lib & typeof TEST_CASE_ROUTE;

export const ABOUT_ROUTE = 'about';
const assertAboutRoute: never = 'assert' as Lib & typeof ABOUT_ROUTE;

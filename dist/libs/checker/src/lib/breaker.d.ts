import { igor } from './checker';
type Breaker<T> = (t: T) => T;
type Igor = typeof igor;
type UserBreaker = Breaker<Igor>;
export declare const switchDates: UserBreaker;
export declare const prefixCustomerId: UserBreaker;
export {};

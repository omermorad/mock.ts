import { Faker, OptionalClassValues } from '@mockinbird/common';

export type MutationsCallback<TClass> = (faker: Faker) => OptionalClassValues<TClass>;

export interface ParserConfig<TClass> {
  mutations?: OptionalClassValues<TClass> | MutationsCallback<TClass>;
  omit?: (keyof TClass)[];
  pick?: (keyof TClass)[];
}

export type ParsingStrategy = 'pick' | 'omit' | undefined;

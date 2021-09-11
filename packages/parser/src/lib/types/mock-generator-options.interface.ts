import { ParserConfig } from '@mockinbird/parser';
import { Faker } from '@mockinbird/common';

export interface MockGeneratorOptions<TClass = any> extends ParserConfig<TClass> {
  count?: number;
  locale?: Faker['locale'];
  plain?: boolean;
}

import { Faker, Class } from '@mockinbird/common';
import { ClassParser } from '@mockinbird/parser';
import { MockBuilder } from '../builder';
import { MockGenerator } from '../generator/mock-generator';

/**
 * MockFactory take the target class as a parameter and returns
 * a MockBuilder which enables to chain some methods and compose
 * a new mock or mocks.
 *
 * @param target {Class<TClass>} the class to create mock(s) from
 * @returns {MockBuilder<TClass>} new builder to compose a mock
 */
export function MockFactory<TClass>(target: Class<TClass>): MockBuilder<TClass> {
  const parser = new ClassParser(Faker);
  const generator = new MockGenerator(parser);

  return new MockBuilder<TClass>(target, generator);
}

import { decorateClass } from '@plumier/reflect';
import { Class } from '@mockinbird/common';

export const FIXTURE_DECORATOR_NAME = 'Fixture' as const;

export interface FixtureDecoratorOptions {
  class: Class;
}

export interface FixtureDecoratorValues {
  name: string;
  options: FixtureDecoratorOptions;
}

/**
 *
 * @param name {string}
 * @return ClassDecorator
 */
export function Fixture(name: string): ClassDecorator;

/**
 *
 * @param name {string}
 * @param origin { class: Class }
 */
export function Fixture(name: string, origin: { class: Class }): ClassDecorator;

export function Fixture(name: string, options?: FixtureDecoratorOptions): ClassDecorator {
  return decorateClass(
    {
      type: FIXTURE_DECORATOR_NAME,
      value: { name, options },
    },
    { inherit: false }
  );
}

import { decorateClass } from '@plumier/reflect';
import { Class } from '@mockinbird/common';

export const FIXTURE_DECORATOR_NAME = 'Fixture';

interface FixtureDecoratorOptions {
  class: Class;
}

/**
 *
 * @param name {string}
 */
export function Fixture(name: string): ClassDecorator;

/**
 *
 * @param name {string}
 * @param origin { class: Class }
 */
export function Fixture(name: string, origin: { class: Class }): ClassDecorator;

export function Fixture(name: string, options?: FixtureDecoratorOptions): ClassDecorator {
  return decorateClass({
    type: FIXTURE_DECORATOR_NAME,
    value: { name, options },
  });
}

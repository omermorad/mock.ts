import 'reflect-metadata';
import { Callback, EnumObject, ExactValue, MultiClass } from '@mockinbird/common';
import { Class, decorateProperty } from '@plumier/reflect';
import { MockOptions } from '../types';

export const MOCK_DECORATOR_NAME = 'Mock';

/**
 * Using undefined (or nothing actually) will infer the value from the property type.
 * The types can be either 'string', 'number' or a 'boolean'
 *
 * @constructor
 */
export function Mock(): PropertyDecorator;

/**
 * Will invoke the callback and generate a value from 'faker' instance
 *
 * @example
 * Mock(faker => faker.internet.email())
 *
 * @param callback
 * @constructor
 */
export function Mock(callback: Callback): PropertyDecorator;

/**
 * Generate an object of the given class (who's properties can be decorated with Mock() as well)
 *
 * @example
 * class Dog { ... }
 * Mock(Dog)
 *
 * @constructor
 * @param targetClass
 */
export function Mock(targetClass: Class): PropertyDecorator;

/**
 * Generate a random value from the given enum
 *
 * @example
 * enum Feeling { Happy, Sad, Numb }
 * Mock(Feeling)
 *
 * @param options: { enum: object }
 * @constructor
 */
export function Mock(options: EnumObject): PropertyDecorator;

/**
 * Generate multiple objects of the given class (who's properties can be decorated with Mock() as well)
 *
 * @param options: { type: ClassType; count: number }
 * @constructor
 */
export function Mock(options: MultiClass): PropertyDecorator;

/**
 * Generate a value from regex
 *
 * @param regex {RegExp}
 * @constructor
 */
export function Mock(regex: RegExp): PropertyDecorator;

/**
 * Generate the exact given decoratorValue
 *
 * @example
 * Mock(123)
 * Mock('Johnny')
 * Mock(true)
 *
 * @param value
 * @constructor
 */
export function Mock(value: ExactValue): PropertyDecorator;

/**
 * Mock property decorator. The options passed will determine the decorated property's generated value
 *
 * @param options
 * @default undefined
 * @constructor
 */
export function Mock(options?: MockOptions): PropertyDecorator {
  return decorateProperty({
    type: MOCK_DECORATOR_NAME,
    value: options,
  });
}

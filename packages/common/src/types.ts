import faker from 'faker';
import FakerStatic = Faker.FakerStatic;

export type Faker = FakerStatic;
export const Faker = faker;

export interface ObjectLiteral {
  [key: string]: any;
}
export type Class<T = any> = new (...args: any[]) => T;

export type ExactValue = string | number | boolean | ObjectLiteral | Date | RegExp;

export type MultiClass = { type: Class; count: number };

export type EnumObject = { enum: Record<string, unknown> };

export type Callback = (faker: Faker) => any;

export type ClassLiteral<TClass = any> = { [K in keyof TClass]: TClass[K] };

export type OptionalClassValues<TClass> = Partial<ClassLiteral<TClass>>;

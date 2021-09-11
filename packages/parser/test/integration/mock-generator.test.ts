import { mockGenerator } from '@mockinbird/parser';
import { TestClasses } from './common/test-classes';

import TestClassWithAbsoluteValues = TestClasses.TestClassWithAbsoluteValues;
import TestClassWithNoValues = TestClasses.TestClassWithNoValues;
import TestClassWithCallback = TestClasses.TestClassWithCallback;
import TestClassWithEnum = TestClasses.TestClassWithEnum;
import TestClassWithOtherClass = TestClasses.TestClassWithSingleClass;
import TestClassWithMultiClass = TestClasses.TestClassWithMultiClass;
import TestClassWithRegex = TestClasses.TestClassWithRegex;

describe('MockGenerator - Integration Test', () => {
  let result;

  describe('given a decorated class', () => {
    scenario('mock decorator with absolute values', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithAbsoluteValues);
      });

      test('then return the exact same values passed in the options of the mock decorator', () => {
        expect(result).toMatchSnapshot({
          date: expect.any(Date),
        });
      });

      describe('and adding mutation keys', () => {
        beforeAll(() => {
          result = mockGenerator.generate(TestClassWithAbsoluteValues, { mutations: { name: 'Override Name' } });
        });

        test('then return the same absolute value expect the constant name added from overrides', () => {
          expect(result.name).toBe('Override Name');
        });
      });

      describe('and adding omit keys', () => {
        beforeAll(() => {
          result = mockGenerator.generate(TestClassWithAbsoluteValues, { omit: ['name'] });
        });

        test('then return the same absolute value expect the constant name added from overrides', () => {
          expect(result.name).toBeUndefined();
        });
      });
    });

    scenario('mock decorator with a callback (faker)', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithCallback);
      });

      test('then return random values from faker', () => {
        expect(result).toMatchObject({
          email: expect.any(String),
          name: expect.any(String),
        });
      });
    });

    scenario('mock decorator with an enum decoratorValue', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithEnum);
      });

      test('then return one random decoratorValue (not key)', () => {
        expect(['foo', 111, 'Bazz1234']).toContain(result.someEnumVal);
      });
    });

    scenario('mock decorator with no/empty values', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithNoValues);
      });

      test('then infer the decoratorValue from the type itself', () => {
        expect(result).toMatchSnapshot({
          name: expect.any(String),
          num: expect.any(Number),
          binary: expect.any(Boolean),
          date: expect.any(Date),
        });
      });
    });

    scenario('mock decorator with a single class', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithOtherClass);
      });

      test('then return an object with the given class', () => {
        expect(Object.keys(result.dog)).toEqual(['name', 'points']);
      });
    });

    describe('mock decorator with a regex', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithRegex);
      });

      test('then return string generated to match the regex', () => {
        expect(result.prop1).toBe('1234');
        expect(result.prop2).toBe('regex');
        expect(result.prop2).toMatch(/^[a-z]{4,5}$/);
      });
    });

    scenario('mock decorator with a multi class', () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithMultiClass);
      });

      test("then return contain a property 'dogs' which is array of Dog with length of 'count'", () => {
        expect(result.dogs).toBeInstanceOf(Array);
        expect(result.dogs).toHaveLength(3);
      });

      test('then return array of objects with the given class keys', () => {
        expect(result.dogs).toEqual(
          expect.arrayContaining([expect.objectContaining({ name: expect.any(String), points: expect.any(Number) })])
        );
      });
    });

    scenario("mock decorator with 'count' option", () => {
      beforeAll(() => {
        result = mockGenerator.generate(TestClassWithAbsoluteValues, { count: 4, locale: 'ja' });
      });

      test("then return array with length of 'count'", () => {
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(4);
      });
    });
  });
});

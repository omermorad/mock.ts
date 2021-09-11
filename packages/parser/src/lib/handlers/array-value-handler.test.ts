import { Container } from 'typedi';
import { Property, PropertyDecoratorValue } from '@mockinbird/reflect';
import { Class, Faker, MultiClass } from '@mockinbird/common';
import { ArrayValueHandler } from './array-value-handler';

describe('ArrayValueHandler Unit Test', () => {
  const DTO_CLASS_VALUE = class TestClass {};
  const DEFAULT_COUNT_FOR_DTO = 3;

  let handler: ArrayValueHandler;

  function createProperty(mockValue: MultiClass): Property {
    return new Property('testPropertyName', 'TestClass', new PropertyDecoratorValue(mockValue));
  }

  const fakerMock = {
    random: {
      alpha: jest.fn().mockReturnValue('random-string'),
      alphaNumeric: jest.fn(),
    },
    datatype: {
      number: jest.fn(),
      boolean: jest.fn(),
    },
    date: {
      recent: jest.fn(),
    },
  } as unknown as Faker;

  beforeAll(() => {
    Container.set('Faker', fakerMock);
    handler = Container.get(ArrayValueHandler);
  });

  describe('given an ArrayValueHandler', () => {
    describe("when calling 'shouldHandle' with type 'object' and decoratorValue of multi class ({ type: ClassType })", () => {
      test('then return true', () => {
        expect(
          handler.shouldHandle(createProperty({ type: DTO_CLASS_VALUE, count: DEFAULT_COUNT_FOR_DTO }))
        ).toBeTruthy();
      });
    });

    describe("when calling 'produceValue' method", () => {
      describe('and the decoratorValue is null', () => {
        test('then return null', () => {
          const producedValue = handler.produceValue(createProperty(null));
          expect(producedValue).toBeNull();
        });
      });

      describe('and the decoratorValue.type (class type) is primitive, of type String', () => {
        let result: any[];

        beforeAll(() => {
          const property = createProperty({ type: String, count: DEFAULT_COUNT_FOR_DTO });
          result = handler.produceValue(property);
        });

        test('then call random alpha string from faker multiple times', () => {
          expect(fakerMock.random.alpha).toHaveBeenCalledTimes(DEFAULT_COUNT_FOR_DTO);
        });

        test("then return an array of 'count' String(s)", () => {
          expect(result).toBeInstanceOf(Array);
          expect(result).toHaveLength(DEFAULT_COUNT_FOR_DTO);
        });

        test('then return an array of String(s) only', () => {
          const constructorIsString = (item) => (item as Class<string>).constructor.name === 'String';
          expect(result.every(constructorIsString)).toBeTruthy();
        });
      });

      describe('and the primitive decoratorValue is Number', () => {
        let result;

        beforeAll(() => {
          result = handler.produceValue(createProperty({ type: Number, count: DEFAULT_COUNT_FOR_DTO }));
        });

        test('then call random alpha string from faker', () => {
          expect(fakerMock.datatype.number).toHaveBeenCalledTimes(DEFAULT_COUNT_FOR_DTO);
          expect(fakerMock.datatype.number).toHaveBeenCalledWith(1000);
        });

        test("then return an array of 'count' numbers", () => {
          expect(result).toBeInstanceOf(Array);
          expect(result).toHaveLength(DEFAULT_COUNT_FOR_DTO);
        });
      });

      describe('and the primitive decoratorValue is Boolean', () => {
        test('and the primitive decoratorValue is Boolean', () => {
          handler.produceValue(createProperty({ type: Boolean, count: DEFAULT_COUNT_FOR_DTO }));
          expect(fakerMock.datatype.boolean).toHaveBeenCalledTimes(DEFAULT_COUNT_FOR_DTO);
        });
      });

      describe('and the primitive decoratorValue is Date', () => {
        test('and the primitive decoratorValue is Date', () => {
          handler.produceValue(createProperty({ type: Date, count: DEFAULT_COUNT_FOR_DTO }));
          expect(fakerMock.date.recent).toHaveBeenCalledTimes(DEFAULT_COUNT_FOR_DTO);
        });
      });
    });

    describe('and decoratorValue type is an actual class (not a primitive)', () => {
      let value;

      beforeAll(() => {
        value = handler.produceValue(createProperty({ type: DTO_CLASS_VALUE, count: DEFAULT_COUNT_FOR_DTO }));
      });

      test('then return an array with length of 3', () => {
        expect(value).toBeInstanceOf(Array);
        expect(value).toHaveLength(3);
      });

      test.each(value, 'then return an array with 3 instances', (property) => {
        expect(property).toBeInstanceOf(DTO_CLASS_VALUE);
      });
    });
  });
});

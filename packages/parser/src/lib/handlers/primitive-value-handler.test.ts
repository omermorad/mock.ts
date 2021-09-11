import { Container } from 'typedi';
import { Faker } from '@mockinbird/common';
import { Property, PropertyDecoratorValue } from '@mockinbird/reflect';
import { PrimitiveValueHandler } from './primitive-value-handler';

describe('PrimitiveValueHandler Unit', () => {
  let handler: PrimitiveValueHandler;

  const fakerMock = {
    random: {
      alpha: jest.fn(),
      alphaNumeric: jest.fn(),
    },
    datatype: {
      number: jest.fn(),
      boolean: jest.fn(),
    },
    date: {
      recent: jest.fn(),
    },
    setLocale: () => jest.fn(),
  } as unknown as Faker;

  beforeAll(() => {
    Container.set<Faker>('Faker', fakerMock);
    handler = Container.get<PrimitiveValueHandler>(PrimitiveValueHandler);
  });

  describe('given a PrimitiveValueHandler', () => {
    describe("when calling 'shouldHandle' method", () => {
      describe('and the property type is not a function', () => {
        test('then return true when constructor name is a String', () => {
          const property = new Property('some-prop-name', 'String', new PropertyDecoratorValue(undefined));
          expect(handler.shouldHandle(property)).toBeTruthy();
        });

        test('then return true when constructor name is a Number', () => {
          const property = new Property('some-prop-name', 'Number', new PropertyDecoratorValue(undefined));
          expect(handler.shouldHandle(property)).toBeTruthy();
        });

        test('then return true when constructor name is a Boolean', () => {
          const property = new Property('some-prop-name', 'Boolean', new PropertyDecoratorValue(undefined));
          expect(handler.shouldHandle(property)).toBeTruthy();
        });

        test('then return true when constructor name is a Date', () => {
          const property = new Property('some-prop-name', 'Date', new PropertyDecoratorValue(undefined));
          expect(handler.shouldHandle(property)).toBeTruthy();
        });
      });
    });

    describe("when calling 'produceValue' method", () => {
      describe('and there is a decoratorValue', () => {
        test('then return the exact same decoratorValue', () => {
          let property = new Property('name', '', new PropertyDecoratorValue('TestStr'));
          expect(handler.produceValue(property)).toBe('TestStr');

          property = new Property('name', '', new PropertyDecoratorValue(12345));
          expect(handler.produceValue(property)).toBe(12345);

          property = new Property('name', '', new PropertyDecoratorValue(true));
          expect(handler.produceValue(property)).toBe(true);
        });
      });

      describe('and the decoratorValue is including { type } inside (multi class)', () => {
        test('then throw an error about type mismatch', () => {
          const property = new Property('name', '', new PropertyDecoratorValue({ type: String, count: 3 }));
          expect(() => handler.produceValue(property)).toThrowError(Error);
        });
      });

      describe('and there is no decoratorValue (empty decoratorValue)', () => {
        describe('and the constructor is a String', () => {
          test('then generate a random string from faker', () => {
            const property = new Property('name', 'String', new PropertyDecoratorValue(undefined));
            handler.produceValue(property);

            expect(fakerMock.random.alpha).toHaveBeenCalledTimes(1);
          });
        });

        describe('and the constructor is a Number', () => {
          test('then return a random number between 1 to 1000 from faker', () => {
            const property = new Property('name', 'Number', new PropertyDecoratorValue(undefined));
            handler.produceValue(property);

            expect(fakerMock.datatype.number).toHaveBeenCalledTimes(1);
            expect(fakerMock.datatype.number).toHaveBeenCalledWith(1000);
          });
        });

        describe('and the constructor is a Boolean', () => {
          test('then return random boolean decoratorValue', () => {
            const property = new Property('name', 'Boolean', new PropertyDecoratorValue(undefined));
            handler.produceValue(property);
            expect(fakerMock.datatype.boolean).toHaveBeenCalledTimes(1);
          });
        });

        describe('and the constructor is a Date', () => {
          test('then return a random date', () => {
            const property = new Property('name', 'Date', new PropertyDecoratorValue(undefined));
            handler.produceValue(property);
            expect(fakerMock.date.recent).toHaveBeenCalledTimes(1);
          });
        });

        describe('and constructor is not a primitive one', () => {
          test('then return alpha numeric string', () => {
            const property = new Property('name', 'not-a-primitive', new PropertyDecoratorValue(undefined));
            handler.produceValue(property);
            expect(fakerMock.random.alphaNumeric).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});

import { Container } from 'typedi';
import { Property, PropertyDecoratorValue } from '@mockinbird/reflect';
import { Faker } from '@mockinbird/common';
import { SingleClassValueHandler } from './single-class-value-handler';

describe('SingleClassValueHandler Unit', () => {
  let handler: SingleClassValueHandler;

  const DTO_CLASS_VALUE = class TestClass {};
  const property = new Property('testPropertyName', 'TestClass', new PropertyDecoratorValue(DTO_CLASS_VALUE));

  beforeAll(() => {
    Container.set('Faker', Faker);
    handler = Container.get<SingleClassValueHandler>(SingleClassValueHandler);
  });

  describe('given a SingleClassValueHandler', () => {
    describe("when calling 'shouldHandle' with a none-primitive, 'function' type", () => {
      test('then return true', () => {
        expect(handler.shouldHandle(property)).toBeTruthy();
      });
    });

    describe("when calling 'produceValue' method", () => {
      test("then call 'parse' with the given class", () => {
        expect(handler.produceValue(property)).toBeInstanceOf(DTO_CLASS_VALUE);
      });
    });
  });
});

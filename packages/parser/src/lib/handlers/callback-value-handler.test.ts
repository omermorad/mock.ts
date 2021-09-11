import { Container } from 'typedi';
import { Property, PropertyDecoratorValue } from '@mockinbird/reflect';
import { Faker } from '@mockinbird/common';
import { CallbackValueHandler } from './callback-value-handler';

describe('CallbackValueHandler Unit', () => {
  let handler: CallbackValueHandler;

  const fakerMock = { internet: { email: jest.fn() } } as unknown as Faker;

  beforeAll(() => {
    Container.set<Faker>('Faker', fakerMock);
    handler = Container.get<CallbackValueHandler>(CallbackValueHandler);
  });

  describe('given a CallbackValueHandler', () => {
    describe("when calling 'shouldHandle' method with type function name and empty constructor name", () => {
      test('then return true', () => {
        const property = new Property(
          'testPropertyName',
          '',
          new PropertyDecoratorValue(() => {
            return null;
          })
        );
        const result = handler.shouldHandle(property);

        expect(result).toBeTruthy();
      });
    });

    describe("when calling 'produceValue' ", () => {
      test('then call the callback function with same faker instance', () => {
        const property = new Property('testPropertyName', '', new PropertyDecoratorValue(jest.fn()));
        handler.produceValue(property);

        expect(property.decoratorValue.value).toHaveBeenCalledTimes(1);
        expect(property.decoratorValue.value).toHaveBeenCalledWith(fakerMock);
      });
    });
  });
});

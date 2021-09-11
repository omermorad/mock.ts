import { Container } from 'typedi';
import { Faker } from '@mockinbird/common';
import { Property, PropertyDecoratorValue } from '@mockinbird/reflect';
import { EnumValueHandler } from './enum-value-handler';

describe('EnumValueHandler Unit', () => {
  let handler: EnumValueHandler;

  enum TestEnum {
    StateOne = 'one',
    StateTwo = 'two',
    StateThree = 'three',
  }

  const fakerMock = {
    random: {
      arrayElement: jest.fn(),
    },
  } as unknown as Faker;

  beforeAll(() => {
    Container.set<Faker>('Faker', fakerMock);
    handler = Container.get<EnumValueHandler>(EnumValueHandler);
  });

  describe('given a EnumValueHandler', () => {
    describe("when calling 'shouldHandle' method with type object and { type: enum }", () => {
      test('then return true', () => {
        const property = new Property('testPropertyName', '', new PropertyDecoratorValue({ enum: TestEnum }));
        expect(handler.shouldHandle(property)).toBeTruthy();
      });
    });

    describe("when calling 'produceValue' method", () => {
      test('then call faker random array element', () => {
        const property = new Property('testPropertyName', '', new PropertyDecoratorValue({ enum: TestEnum }));
        handler.produceValue(property);

        expect(fakerMock.random.arrayElement).toHaveBeenCalledTimes(1);
        expect(fakerMock.random.arrayElement).toHaveBeenCalledWith(['one', 'two', 'three']);
      });
    });
  });
});

import { MockGenerator } from './mock-generator';
import { ClassParser } from '../parser/class-parser';

/**
 * The full test of MockGenerator can be found under the 'test' folder,
 * you can find there the full integration test
 */
describe('MockGenerator Unit Test', () => {
  let generator: MockGenerator;

  class TestClass {
    test: string;
  }

  const parserMock = {
    setLocale: jest.fn(),
    parse: jest.fn(),
  } as unknown as jest.Mocked<ClassParser>;

  beforeAll(() => {
    generator = new MockGenerator(parserMock);
    jest.clearAllMocks();
  });

  scenario('generate a SIMPLE mock from a class', () => {
    given('I want to generate a new mock from a class', () => {
      when('I call the create method with no configurations', () => {
        beforeAll(() => generator.generate(TestClass));

        test('then setup parser with the default locale', () => {
          expect(parserMock.setLocale).toHaveBeenCalledWith('en');
        });

        test('then call parse one time only', () => {
          expect(parserMock.parse).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  scenario('generate mock from a class with a different configurations', () => {
    given('I want to generate a mock with different locale', () => {
      when('creating a new mock from generator passing the proper params', () => {
        beforeAll(() => generator.generate(TestClass, { locale: 'arbitrary-locale' }));

        then('setup the parser with the locale from the options', () => {
          expect(parserMock.setLocale).toHaveBeenCalledWith('arbitrary-locale');
        });
      });
    });

    given('I want to generate a mock and mutate different values', () => {
      when('creating a new mock from generator passing the proper param', () => {
        beforeAll(() => generator.generate(TestClass, { mutations: { test: 'value' } }));

        then('call parse with the valid options', () => {
          expect(parserMock.parse).toHaveBeenCalledWith(TestClass, { mutations: { test: 'value' } });
        });
      });
    });

    given('I want to generate a mock and omit different values', () => {
      when('creating a new mock from generator passing the proper param', () => {
        beforeAll(() => generator.generate(TestClass, { omit: ['test'] }));

        then('call parse with the valid options', () => {
          expect(parserMock.parse).toHaveBeenCalledWith(TestClass, { omit: ['test'] });
        });
      });
    });

    given('I want to generate a mock and convert it to plain', () => {
      when('creating a new mock from generator passing the proper param', () => {
        let result;

        beforeAll(() => {
          parserMock.parse.mockReturnValueOnce(
            new (class Cat {
              toy = new (class Toy {
                bell = new (class Bell {})();
              })();
            })()
          );

          result = generator.generate(TestClass, { plain: true });
        });

        then('', () => {
          const isClass = (target) => target instanceof Object && target.constructor.name !== 'Object';

          expect(isClass(result)).toBeFalsy();
          expect(isClass(result.toy)).toBeFalsy();
          expect(isClass(result.toy.bell)).toBeFalsy();
        });
      });
    });
  });
});

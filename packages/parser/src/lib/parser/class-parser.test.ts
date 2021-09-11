import RandExp from 'randexp';
import { Container } from 'typedi';
import { Mock } from '@mockinbird/reflect';
import { Faker } from '@mockinbird/common';
import { ClassParser } from './class-parser';

describe('ClassParser Integration Test', () => {
  class Child {
    @Mock() str: string;
  }

  class Bird {
    @Mock() name = 'default-name';
    @Mock() isAwesome: boolean;
    @Mock() rating: number;
    @Mock(Child) child: Child;
  }

  const fakerMock: jest.Mocked<Partial<Faker>> = {
    setLocale: jest.fn(),
    datatype: { boolean: () => true, number: () => 12345 } as jest.Mocked<Faker['datatype']>,
    random: { alpha: jest.fn() } as unknown as jest.Mocked<Faker['random']>,
    name: { firstName: jest.fn().mockReturnValueOnce('FIRST_NAME') } as any,
  };

  let parser: ClassParser;

  beforeAll(() => {
    Container.set('Faker', fakerMock);
    Container.set('RandExp', RandExp);

    parser = Container.get(ClassParser);
  });

  describe('creating a new mock', () => {
    scenario('with no target class', () => {
      then('throw an error indicating that no target class has been passed', () => {
        expect(() => parser.parse(undefined)).toThrowError();
      });
    });

    describe('with target class and no config', () => {
      let returnValue;

      when('config includes mutations', () => {
        beforeAll(() => {
          returnValue = parser.parse(Bird, { mutations: { name: 'Houdini' } });
        });

        test("then return an instance where the 'name' property is 'Houdini'", () => {
          expect(returnValue.name).toBe('Houdini');
        });
      });

      when('config includes mutations with callback', () => {
        beforeAll(() => {
          returnValue = parser.parse(Bird, {
            mutations: (faker) => ({ name: faker.name.firstName() }),
          });
        });

        test('then call faker firstName method', () => {
          expect(fakerMock.name.firstName).toHaveBeenCalledTimes(1);
        });

        test("then set the value of prop 'name' to be faker firstName return value", () => {
          expect(returnValue.name).toBe('FIRST_NAME');
        });
      });

      when('config includes omit keys', () => {
        beforeAll(() => {
          returnValue = parser.parse(Bird, { omit: ['name'] });
        });

        then('return the default value of the instance', () => {
          expect(returnValue.name).toBe('default-name');
        });
      });

      describe('config includes pick keys', () => {
        beforeAll(() => {
          returnValue = parser.parse(Bird, { pick: ['rating'] });
        });

        then('return a mock with this keys only', () => {
          expect(returnValue).toHaveProperty('rating');
          expect(returnValue).not.toHaveProperty('isAwesome');
          expect(returnValue).not.toHaveProperty('child');
        });

        then('leave the properties with default value', () => {
          expect(returnValue).toHaveProperty('name');
          expect(returnValue.name).toBe('default-name');
        });
      });

      when('config includes both config and omit keys', () => {
        then('throw an error indicating that can not use both at the same time', () => {
          expect(() => parser.parse(Bird, { pick: ['name'], omit: ['name'] })).toThrowError();
        });
      });

      then('return an (actual) instance of the class', () => {
        returnValue = parser.parse(Bird);
        expect(returnValue).toBeInstanceOf(Bird);
      });
    });
  });

  scenario('set a faker locale', () => {
    beforeAll(() => parser.setLocale('jp'));

    test('then call faker locale function', () => {
      expect(fakerMock.setLocale).toHaveBeenCalledWith('jp');
    });
  });
});

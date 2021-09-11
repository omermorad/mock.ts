import { MockBuilder } from './mock-builder';
import { Mock } from '../../index';

class Bird {
  @Mock()
  name: string;

  @Mock((faker) => faker.datatype.number(20))
  points: number;

  @Mock((faker) => faker.random.arrayElement(['yes', 'no']))
  isAwesome: 'yes' | 'no';

  @Mock((faker) => faker.datatype.uuid())
  _unique_id_prop_: string;
}

const itemIsUndefinedInKey = (key) => (item) => typeof item[key] === 'undefined';
const itemIsDefinedInKey = (key) => (item) => typeof item[key] !== 'undefined';

/**
 * This test is written with strict BDD using jest-gherkin
 * the word prop stands for a 'property', as well as 'props' which stands for 'properties'
 */
describe('MockBuilder Integration Test', () => {
  let createNewBuilder: () => MockBuilder<Bird>;
  let builder: MockBuilder<Bird>;

  beforeAll(() => {
    createNewBuilder = (): MockBuilder<Bird> => new MockBuilder<Bird>(Bird);
  });

  scenario('mutating some values', () => {
    beforeAll(() => {
      builder = createNewBuilder();
    });

    given('a builder which is configured to mutate some values', () => {
      let mock;

      beforeAll(() => (mock = builder.mutate({ name: 'mutated-name' }).one()));

      when('I create a single/one mock of Dog with mutation', () => {
        then('return a mock where the mutated values are actually changed', () => {
          expect(mock.name).toBe('mutated-name');
        });

        describe('and when I repeat again', () => {
          beforeAll(() => (mock = builder.one()));

          then("do not apply the mutation I've set before", () => {
            expect(mock.name).not.toBe('mutated-name');
          });
        });
      });

      when('I create many mocks of Dog', () => {
        let mocks;

        beforeAll(() => (mocks = builder.mutate({ points: 10, isAwesome: 'yes' }).many(3)));

        then('return an array where each item has been mutated in the above keys (points, isAwesome)', () => {
          const itemHasSameValue = (key, value) => (item) => item[key] === value;

          expect(mocks.every(itemHasSameValue('points', 10))).toBeTruthy();
          expect(mocks.every(itemHasSameValue('isAwesome', 'yes'))).toBeTruthy();
        });
      });
    });
  });

  scenario('using ignore to omit values', () => {
    let builder;

    describe('given a builder', () => {
      beforeAll(() => {
        builder = createNewBuilder();
        builder.omit = jest.fn();
      });

      when('I call ignore method', () => {
        const OMIT_RETURN_VALUE = 'arbitrary-value';
        let ignoreReturnValue;

        beforeAll(() => {
          builder.omit.mockReturnValue(OMIT_RETURN_VALUE);
          ignoreReturnValue = builder.ignore();
        });

        then('call and return omit instead', () => {
          expect(builder.omit).toHaveBeenCalled();
          expect(ignoreReturnValue).toBe(OMIT_RETURN_VALUE);
        });
      });
    });
  });

  scenario('omit values', () => {
    beforeAll(() => {
      builder = createNewBuilder();
    });

    given("I've created a builder and ask to omit some values", () => {
      beforeAll(() => builder.omit('isAwesome', 'points'));

      when('I create a single mock of Dog', () => {
        let mock;

        beforeAll(() => (mock = builder.one()));

        then("mutate return a mock without no values on props I've asked to omit", () => {
          expect(mock.points).toBeUndefined();
          expect(mock.isAwesome).toBeUndefined();
        });
      });

      when('I create many mocks of Dog, repeating a few times', () => {
        let mocks;

        beforeAll(() => {
          builder = createNewBuilder();
          mocks = builder.omit('isAwesome', 'points').many(3);
        });

        then("mutate return an array where the prop I've asked to omit has no value", () => {
          expect(mocks.every(itemIsUndefinedInKey('points'))).toBeTruthy();
          expect(mocks.every(itemIsUndefinedInKey('isAwesome'))).toBeTruthy();
        });
      });

      when('I want to omit a prop only once (alongside the permanent props)', () => {
        let mock;

        when('I create a new single mock of Dog', () => {
          beforeAll(() => (mock = builder.omit('name').one()));

          then("omit the permanent keys as well as the key I've asked to omit once", () => {
            expect(mock.name).toBeUndefined();
          });

          describe('and when I ask to create a mock again', () => {
            then("do not omit the key I've asked to omit only once", () => {
              mock = builder.one();
              expect(mock.name).not.toBeUndefined();
            });
          });
        });

        when('I create many mocks of the same class, Dog', () => {
          let mocks;

          beforeAll(() => (mocks = builder.omit('name').many(3)));

          then("return an array where each item has no value in the prop 'name'", () => {
            expect(mocks.every(itemIsUndefinedInKey('name'))).toBeTruthy();
          });

          describe('and now I want to create some more mocks again', () => {
            beforeAll(() => (mocks = builder.many(3)));

            then("do not omit the key I've asked to omit only once", () => {
              expect(mocks.every(itemIsDefinedInKey('name'))).toBeTruthy();
            });
          });
        });
      });
    });
  });

  scenario('plain object', () => {
    beforeAll(() => (builder = createNewBuilder()));

    given('a new builder', () => {
      beforeAll(() => (builder = createNewBuilder()));

      when('I ask for a plain object', () => {
        and('I want to create one single mock', () => {
          let mock;

          then('return a plain object (and not an actual instance)', () => {
            mock = builder.plain().one();

            expect(mock).not.toBeInstanceOf(Bird);
            expect(mock).toBeInstanceOf(Object);
          });

          then('return an instance of Dog again', () => {
            mock = builder.one();

            expect(mock).toBeInstanceOf(Bird);
          });
        });

        and('I want to create many mocks', () => {
          let mocks;
          const itemIsInstanceOfDog = (item) => item.constructor.name === 'Bird';

          then('return array of plain objects (and not an actual instances)', () => {
            mocks = builder.plain().many(3);
            expect(mocks.every(itemIsInstanceOfDog)).toBeFalsy();
          });

          then('return array of instances of Dog again', () => {
            mocks = builder.many(3);
            expect(mocks.every(itemIsInstanceOfDog)).toBeTruthy();
          });
        });
      });
    });
  });
});

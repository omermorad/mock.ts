import RandExp from 'randexp';
import { Container } from 'typedi';
import { Property, PropertyDecoratorValue } from '@mockinbird/reflect';
import { RegexValueHandler } from './regex-value-handler';

describe('RegexHandler Unit', () => {
  let property: Property;
  let handler: RegexValueHandler;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function RandExpMock() {}
  RandExpMock.prototype.gen = jest.fn();

  beforeAll(() => {
    property = new Property('some-prop-name', 'RegExp', new PropertyDecoratorValue(/^123$/));
  });

  describe('given a RegexHandler', () => {
    beforeAll(() => {
      Container.set<RandExp>('RandExp', RandExpMock);
      handler = Container.get<RegexValueHandler>(RegexValueHandler);
    });

    describe("when calling 'shouldHandle'", () => {
      describe('and the property value is regex', () => {
        test('then return return true', () => {
          expect(handler.shouldHandle(property)).toBeTruthy();
        });
      });
    });

    describe("when calling 'produceValue'", () => {
      beforeAll(() => handler.produceValue(property));

      test("then call 'gen' with the given regex", () => {
        expect(RandExpMock.prototype.gen).toHaveBeenCalledTimes(1);
      });
    });
  });
});

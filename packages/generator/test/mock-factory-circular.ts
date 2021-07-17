import { Mock } from '@mockinbird/reflect';
import { MockGenerator } from '../src';

describe('Mock Factory - circular class-type', () => {
  describe('with single class circular mock', () => {
    class Man {
      @Mock(Man)
      readonly son: Man;
    }

    test('when calling MockGenerator.create it throws an exception', () => {
      expect(() => MockGenerator.create<Man>(Man)).toThrowError(
        'Circular class-type mock detected! Target: Man; PropertyInterface: son'
      );
    });
  });

  describe('with multiple class circular mock', () => {
    class AnotherMan {
      @Mock({ type: AnotherMan, count: 3 })
      readonly sons: AnotherMan[];
    }

    test('When calling MockGenerator.create it throws an exception', () => {
      expect(() => MockGenerator.create<AnotherMan>(AnotherMan)).toThrowError(
        'Circular class-type mock detected! Target: AnotherMan; PropertyInterface: sons'
      );
    });
  });
});

import { Mock } from 'mockingbird-ts';

enum TestEnum {
  Foo = 'foo',
  Bar = 111,
  Bazz = 'Bazz1234',
}

export namespace TestClasses {
  export class TestClassWithAbsoluteValues {
    @Mock('FooBar')
    name: string;

    @Mock(1234)
    num: number;

    @Mock(true)
    binary: boolean;

    @Mock(new Date())
    date: Date;

    @Mock({ thiss: 'is', an: 'object', literal: true })
    objectLiteral: Record<string, unknown>;
  }

  export class TestClassWithCallback {
    @Mock((faker) => faker.internet.email())
    email: string;

    @Mock((faker) => faker.name.firstName())
    name: string;
  }

  export interface TestClassWithNoValuesInterface {
    name: string;
    num: number;
    binary: boolean;
    date: Date;
  }

  export class TestClassWithNoValues implements TestClassWithNoValuesInterface {
    @Mock()
    name: string;

    @Mock()
    num: number;

    @Mock()
    binary: boolean;

    @Mock()
    date: Date;
  }

  export class TestClassWithEnum {
    @Mock({ enum: TestEnum })
    someEnumVal: string;
  }

  class Dog {
    @Mock()
    name: string;

    @Mock()
    points: number;
  }

  export class TestClassWithSingleClass {
    @Mock(Dog)
    dog: Dog;
  }

  export class TestClassWithMultiClass {
    @Mock({ type: Dog, count: 3 })
    dogs: Dog[];
  }

  export class TestClassWithRegex {
    @Mock(/1234/)
    prop1: string;

    @Mock(/^regex$/)
    prop2: string;

    @Mock(/^[a-z]{4,5}$/)
    prop3: string;
  }
}

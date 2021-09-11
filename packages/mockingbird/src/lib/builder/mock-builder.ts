import { ClassLiteral, Class } from '@mockinbird/common';
import { Keys, Mutations } from './types';
import { MockProducer } from './mock-producer';

export interface MockBuilder<TClass = any> {
  /**
   * Sets the faker locale inside the MockBuilder, thus, all the mocks that
   * will be generated from the builder will be affected from this setting
   * and will get applied by it
   *
   * @example
   * MockFactory(Bird).setLocale('es').one()
   *
   * @param locale {string}
   * @returns {this} the actual same builder
   */
  setLocale(locale: string): this;

  /**
   * Converts the generated mock into a plain object.
   * When creating multiple mocks (using .many()), then
   * all the items in the array will be converted
   * into plain objects.
   *
   * @example
   * MockFactory(Bird).plain().one()
   *
   * @returns {MockBuilder}
   */
  plain(): this;

  /**
   * Mutates the generated mock(s).
   * .mutate() method enables to set another value for a specific
   * property.
   *
   * @example
   * MockFactory(Bird).mutate({ name: 'some-permanent-name' }).one()
   *
   * @param mutations {Mutations<TClass>}
   */
  mutate(mutations: Mutations<TClass>): Omit<MockBuilder<TClass>, 'mutate'>;

  /**
   * @alias omit
   * @param keys
   * @returns {MockBuilder}
   * @deprecated use .omit() instead
   */
  ignore(...keys: Keys<TClass>): ReturnType<MockBuilder<TClass>['omit']>;

  /**
   * Omits properties from the generated mock(s); all the
   * rest of the properties will remain the same.
   * Notice that omitting a property that contains a default
   * value will only ignore the decorator generation.
   *
   * @example
   * MockFactory(Bird).ignore('name').one()
   *
   * @param keys
   * @returns {MockBuilder}
   */
  omit(...keys: Keys<TClass>): this;

  /**
   * Picks specific properties to generate a mock from.
   * Notice that properties that contain default values
   * in the class will remain there but the decorator won't
   * apply to those properties.
   *
   * @example
   * MockFactory(Bird).pick('name').one()
   *
   * @param keys
   * @returns {MockBuilder}
   */
  pick(...keys: Keys<TClass>): this;

  /**
   * Creates exactly one mock from the target class
   *
   * @returns {TClass | Object}
   */
  one(): TClass;

  /**
   * Creates many mocks from the target class.
   *
   * @param count {number} How many mocks to create
   * @returns {TClass[] | Object[]} An array of instances of plain objects
   */
  many(count: number): TClass[];
}

export class MockBuilder<TClass = any> extends MockProducer<TClass> {
  private isPlain = false;

  private mutations: Mutations<TClass> = {};
  private omitKeys: Keys<TClass> = [];
  private pickKeys: Keys<TClass> = [];

  public constructor(targetClass: Class<TClass>) {
    super(targetClass);
  }

  private clean(): void {
    this.isPlain = false;
    this.mutations = {};
    this.omitKeys = [];
    this.pickKeys = [];
  }

  public plain(): this {
    this.isPlain = true;
    return this;
  }

  public mutate(mutations: Mutations<TClass>): Omit<MockBuilder<TClass>, 'mutate'> {
    this.mutations = mutations;
    return this;
  }

  /**
   * @deprecated use .omit() instead
   */
  public ignore(...keys: Keys<TClass>): ReturnType<MockBuilder<TClass>['omit']> {
    return this.omit(...keys);
  }

  public omit(...keys: Keys<TClass>): this {
    this.omitKeys = keys;
    return this;
  }

  public pick(...keys: Keys<TClass>): this {
    this.pickKeys = keys;
    return this;
  }

  public one(): TClass | ClassLiteral<TClass> {
    const { mutations, omitKeys, pickKeys, isPlain } = this;

    const instance: TClass = super.createOne({ mutations, omit: omitKeys, plain: isPlain, pick: pickKeys });
    this.clean();

    return instance;
  }

  public many(count: number): TClass[] | ClassLiteral<TClass>[] {
    const { mutations, omitKeys, pickKeys, isPlain } = this;

    const instances = super.createMany(count, { mutations, omit: omitKeys, plain: isPlain, pick: pickKeys });
    this.clean();

    return instances;
  }
}

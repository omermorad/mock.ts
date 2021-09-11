import { Service } from 'typedi';
import { Class, ClassLiteral, isPrimitive } from '@mockinbird/common';
import { MockGeneratorOptions } from '../types/mock-generator-options.interface';
import { ClassParser } from '../parser/class-parser';

@Service()
export class MockGenerator {
  public constructor(private readonly classParser: ClassParser) {}

  private static classToPlain<TClass>(targetClass: TClass): ClassLiteral<TClass> {
    const toPlain = (target: ClassLiteral<TClass>): ClassLiteral<TClass> => {
      for (const key of Object.keys(target)) {
        const value = target[key];

        if (value instanceof Object) {
          if (isPrimitive(value.constructor.name)) {
            toPlain(value);
          } else {
            target[key] = toPlain({ ...value });
          }
        }
      }

      return target;
    };

    return toPlain({ ...targetClass });
  }

  /**
   * Return an object with all the properties decorated by the 'Mock' Decorator
   *
   * @example
   * class Person { @Mock() name: string }
   * MockGenerator.create(Person) will return an object { name: <random-string> }
   *
   * @param targetClass {Class<TClass>}
   * @returns {TClass}
   */
  public generate<TClass = any>(targetClass: Class<TClass>): TClass;

  /**
   * Return an array of objects with all the properties decorated by the
   * 'Mock' Decorator (if 'count' is greater than 1)
   *
   * @example
   * class Person { @Mock() name: string }
   * MockGenerator.create(Person, { count: 3, locale: 'es' }) will return an
   * array of objects [{ name: <random-string> }, { name: <random-string> },
   * { name: <random-string> }]
   *
   * Passing a 'locale' property will set a different locale for faker calls
   * The default locale is 'en' (english)
   *
   * @param targetClass
   * @param options
   */
  public generate<TClass = any>(
    targetClass: Class<TClass>,
    options: MockGeneratorOptions<TClass>
  ): TClass | ClassLiteral<TClass>;

  public generate<TClass = any>(
    targetClass: Class<TClass>,
    options: MockGeneratorOptions<TClass>
  ): TClass[] | ClassLiteral<TClass>[];

  /**
   * Return one or many objects (array) with all the properties decorated
   * by the Mock decorator
   *
   * @param targetClass
   * @param options
   */
  public generate<TClass = any>(
    targetClass: Class<TClass>,
    options: MockGeneratorOptions<TClass> = {}
  ): TClass | TClass[] | ClassLiteral<TClass> | ClassLiteral<TClass>[] {
    const { count = 1, plain = false, locale = 'en', ...config } = options || {};

    this.classParser.setLocale(locale);

    if (count === 1) {
      const parsedClass = this.classParser.parse(targetClass, config);
      return plain ? MockGenerator.classToPlain<TClass>(parsedClass) : parsedClass;
    }

    const classInstances: TClass[] = [];

    for (let i = 1; i <= count; i++) {
      const parsedClass = this.classParser.parse(targetClass, config);
      classInstances.push(plain ? MockGenerator.classToPlain<TClass>(parsedClass) : parsedClass);
    }

    return classInstances;
  }
}

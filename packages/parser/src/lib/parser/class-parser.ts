import { Container, Inject, Service } from 'typedi';
import { ClassReflector, Property } from '@mockingbird/reflect';
import { Class, Faker } from '@mockingbird/common';
import { MutationsCallback, ParserConfig, ParsingStrategy } from '../types/types';
import { ValueHandler } from '../types/value-handler.interface';
import { EnumValueHandler } from '../handlers/enum-value-handler';
import { ArrayOfClassesValueHandler } from '../handlers/array-of-classes-value-handler';
import { FakerCallbackValueHandler } from '../handlers/faker-callback-value-handler';
import { ObjectLiteralValueHandler } from '../handlers/object-literal-value-handler';
import { PrimitiveValueHandler } from '../handlers/primitive-value-handler';
import { RegexValueHandler } from '../handlers/regex-value-handler';
import { ClassCallbackHandler } from '../handlers/class-callback-handler';

@Service()
export class ClassParser<TClass = any> {
  private readonly valueHandlers: Class<ValueHandler>[] = [
    FakerCallbackValueHandler,
    ArrayOfClassesValueHandler,
    ClassCallbackHandler,
    EnumValueHandler,
    RegexValueHandler,
    ObjectLiteralValueHandler,
    PrimitiveValueHandler,
  ];

  public constructor(@Inject('Faker') private readonly faker: Faker) {}

  private handlePropertyValue(property: Property): TClass | TClass[] {
    for (const classHandler of this.valueHandlers) {
      const handler = Container.get<ValueHandler>(classHandler);

      if (handler.shouldHandle(property)) {
        return handler.produceValue<TClass>(property);
      }
    }
  }

  public parse(targetClass: Class<TClass>, config: ParserConfig<TClass> = {}): TClass {
    const classReflection = ClassReflector.getInstance().reflectClass(targetClass);

    const { omit = [], pick = [] } = config;
    let { mutations = {} } = config;
    let strategy: ParsingStrategy;

    if (omit.length) {
      strategy = 'omit';
    } else if (pick.length) {
      strategy = 'pick';
    }

    if (omit.length && pick.length) {
      throw new Error('Can not use pick and omit at the same time');
    }

    if (typeof mutations === 'function') {
      mutations = (mutations as MutationsCallback<TClass>)(this.faker);
    }

    const deriveFromProps = (acc, property) => {
      let value;

      if (mutations.hasOwnProperty(property.name)) {
        value = mutations[property.name];
      }

      if (strategy == 'pick') {
        if (pick.includes(property.name)) {
          return { ...acc, [property.name]: value || this.handlePropertyValue(property) };
        }

        return acc;
      }

      if (omit.includes(property.name) && strategy == 'omit') {
        return acc;
      }

      return { ...acc, [property.name]: value || this.handlePropertyValue(property) };
    };

    const derivedProps = classReflection.reduce(deriveFromProps, {});
    return Object.assign(new targetClass(), derivedProps);
  }

  public setLocale(locale: string): void {
    this.faker.setLocale(locale);
  }
}

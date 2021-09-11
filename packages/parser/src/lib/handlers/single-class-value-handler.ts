import { Container, Service } from 'typedi';
import { Property } from '@mockinbird/reflect';
import { Class, isPrimitive } from '@mockinbird/common';
import { ValueHandler } from '../types/value-handler.interface';
import { ClassParser } from '../parser/class-parser';

@Service()
export class SingleClassValueHandler implements ValueHandler {
  public shouldHandle(property: Property): boolean {
    return property.decoratorValue.isCallback() && !isPrimitive(property.constructorName);
  }

  public produceValue<TClass>(property: Property): TClass {
    const analyzer = Container.get<ClassParser>(ClassParser);
    return analyzer.parse(property.decoratorValue.value as Class<TClass>);
  }
}

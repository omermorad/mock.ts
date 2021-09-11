import { Property } from '@mockinbird/reflect';
import { ValueHandler } from '../types/value-handler.interface';
import { Service } from 'typedi';

@Service()
export class ObjectLiteralValueHandler implements ValueHandler {
  public shouldHandle(property: Property): boolean {
    const { decoratorValue } = property;
    return decoratorValue.isObject() && !decoratorValue.isMultiClass() && !decoratorValue.isEnum();
  }

  public produceValue(propertyDto: Property): any {
    return propertyDto.decoratorValue.value;
  }
}

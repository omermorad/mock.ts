import { Service } from 'typedi';
import { Property } from '@mockinbird/reflect';
import { PrimitiveHandler } from './primitive-handler';
import { ValueHandler } from '../types/value-handler.interface';

@Service()
export class PrimitiveValueHandler implements ValueHandler {
  public constructor(private readonly primitiveHandler: PrimitiveHandler) {}

  public shouldHandle(property: Property): boolean {
    return this.primitiveHandler.isPrimitive(property);
  }

  public produceValue(property: Property): any {
    const { decoratorValue } = property;

    if (typeof decoratorValue.value !== 'undefined') {
      if (decoratorValue.isMultiClass()) {
        throw new Error(
          'Type mismatch. Properties decorated with @Mock({ type: ClassType }) must be typed as array (e.g. prop: string[])'
        );
      }

      return decoratorValue.value;
    }

    return this.primitiveHandler.generateRandomValueFromPrimitive(property.constructorName);
  }
}

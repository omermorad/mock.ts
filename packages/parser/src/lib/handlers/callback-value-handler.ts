import { Inject, Service } from 'typedi';
import { Property } from '@mockinbird/reflect';
import { Callback, Faker } from '@mockinbird/common';
import { ValueHandler } from '../types/value-handler.interface';

@Service()
export class CallbackValueHandler implements ValueHandler {
  public constructor(@Inject('Faker') private readonly faker: Faker) {}

  public shouldHandle(property: Property): boolean {
    return property.decoratorValue.isCallback() && (property.decoratorValue.value as Callback).name === '';
  }

  public produceValue(property: Property): any {
    return (property.decoratorValue.value as Callback)(this.faker);
  }
}

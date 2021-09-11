import RandExp from 'randexp';
import { Inject, Service } from 'typedi';
import { Property } from '@mockinbird/reflect';
import { ValueHandler } from '../types/value-handler.interface';
import { Class } from '@mockinbird/common';

@Service()
export class RegexValueHandler implements ValueHandler {
  public constructor(@Inject('RandExp') private readonly randexp: Class<RandExp>) {}

  public shouldHandle(property: Property): boolean {
    return property.decoratorValue.isRegex();
  }

  public produceValue(property: Property): any {
    const { decoratorValue } = property;
    const { value: regex } = decoratorValue;

    const randexp = new this.randexp(regex as RegExp);
    return randexp.gen() as string;
  }
}

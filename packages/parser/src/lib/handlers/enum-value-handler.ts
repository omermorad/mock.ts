import { Property } from '@mockinbird/reflect';
import { ValueHandler } from '../types/value-handler.interface';
import { Inject, Service } from 'typedi';
import { Faker } from '@mockinbird/common';

@Service()
export class EnumValueHandler implements ValueHandler {
  public constructor(@Inject('Faker') private readonly faker: Faker) {}

  private static getEnumValues(enumObj: Record<string, unknown>): any[] {
    const keysList = Object.getOwnPropertyNames(enumObj).filter(
      (key) => enumObj.propertyIsEnumerable(key) && key !== String(parseFloat(key))
    );

    const length = keysList.length;
    const valuesList = new Array<any>(length);

    for (let index = 0; index < length; ++index) {
      const key = keysList[index];
      valuesList[index] = enumObj[key];
    }

    return valuesList;
  }

  public shouldHandle(propertyDto: Property): boolean {
    return propertyDto.decoratorValue.isEnum();
  }

  public produceValue(propertyDto: Property): any {
    const {
      decoratorValue: { value },
    } = propertyDto;
    const { enum: enumObj } = value as { enum: Record<string, unknown> };

    return this.faker.random.arrayElement(EnumValueHandler.getEnumValues(enumObj));
  }
}

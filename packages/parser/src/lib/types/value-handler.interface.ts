import { Property } from '@mockinbird/reflect';

export interface ValueHandler {
  shouldHandle(property: Property): boolean;
  produceValue<T>(property: Property): T | T[];
}

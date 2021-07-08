import { Property } from '../property';

export interface ValueHandler {
  shouldHandle(property: Property): boolean;
  produceValue<T>(property: Property): T | T[];
}

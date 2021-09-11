import { MultiClass } from '@mockinbird/common';
import { MockOptions } from '../types/mock-options.type';

export interface PropertyDecoratorValue {
  readonly value: MockOptions;
  sObject(): boolean;
  isMultiClass(): boolean;
  isCallback(): boolean;
  isEnum(): boolean;
  isRegex(): boolean;
}

export class PropertyDecoratorValue {
  private readonly type: string;

  public constructor(public readonly value: MockOptions) {
    this.type = typeof value;
  }

  public isObject(): boolean {
    return this.type === 'object';
  }

  public isMultiClass(): boolean {
    return this.isObject() && (this.value as MultiClass).hasOwnProperty('type');
  }

  public isCallback(): boolean {
    return this.type === 'function';
  }

  public isEnum(): boolean {
    return this.isObject() && this.value.hasOwnProperty('enum');
  }

  public isRegex(): boolean {
    return this.value instanceof RegExp;
  }
}

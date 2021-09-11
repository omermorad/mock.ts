import { Class } from '@mockinbird/common';
import { Keys, Mutations } from './types';
import { mockGenerator } from '@mockinbird/parser';

interface ExtraKeys<TClass> {
  omit?: Keys<TClass>;
  pick?: Keys<TClass>;
  mutations?: Mutations<TClass>;
  plain?: boolean;
}

export class MockProducer<TClass = any> {
  protected locale = 'en';

  protected constructor(protected readonly targetClass: Class<TClass>) {}

  public setLocale(locale: string): void {
    this.locale = locale;
  }

  protected createMany(count: number, config: ExtraKeys<TClass> = {}): TClass[] {
    const { locale } = this;
    const { mutations = {}, plain = false, pick = [], omit = [] } = config;

    return mockGenerator.generate(this.targetClass, {
      locale,
      mutations,
      pick,
      omit,
      plain,
      count,
    }) as unknown as TClass[];
  }

  protected createOne(config: ExtraKeys<TClass> = {}): TClass {
    const { locale } = this;
    const { mutations = {}, plain = false, pick = [], omit = [] } = config;

    return mockGenerator.generate(this.targetClass, {
      locale,
      mutations,
      pick,
      omit,
      plain,
    }) as unknown as TClass;
  }
}

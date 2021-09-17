import get from 'lodash.get';
import { Service } from 'typedi';
import { reflect } from '@plumier/reflect';
import { Class } from '@mockinbird/common';
import { Logger } from '@mockinbird/logger';
import { FixtureEngine } from '../fixture-engine';
import { Snapshot } from './snapshot';
import { FIXTURE_DECORATOR_NAME } from '../../decorators/fixture.decorator';

@Service()
export class SnapshotParser {
  public static isVariantExists(snapshot: Snapshot, variant: string): boolean {
    return snapshot.contents.variants.hasOwnProperty(variant);
  }

  public static async importOriginClass<TClass = unknown>(
    originFile: string,
    originClass: string
  ): Promise<Class<TClass>> {
    const importedClasses: { [key: string]: Class<TClass> } = await import(
      `${FixtureEngine.getFixturesDirectory()}/${originFile}`
    );

    if (!importedClasses.hasOwnProperty(originClass)) {
      throw new Error(
        `
        Mockingbird was trying to import the class '${originClass}' from file '${originFile}'
        but only the class(es) '${Object.keys(importedClasses).join("', ")}' were found.
        The origin file does not contain any class named '${originClass}'. \n
        It might be that you have changed the name of the origin class or moved it to another
        file.
        Possible solution: hit "mockingbird regen" in you cli
        `
      );
    }

    return importedClasses[originClass];
  }

  public static fetchDecoratorValues<TClass>(actualClass: Class<TClass>): {
    fixtureName: string;
    sourceClass: Class<TClass>;
  } {
    const { decorators = [] } = reflect(actualClass);
    const found = decorators.find((decorator) => decorator.type === FIXTURE_DECORATOR_NAME);

    return {
      fixtureName: get(found, 'value.name'),
      sourceClass: get(found, 'value.options.class') as Class<TClass>,
    };
  }

  public async parse<TClass = any>(snapshot: Snapshot<TClass>, variant?: string): Promise<TClass> {
    const { originFile, originClass, fixtureName, variants = {}, values = {} } = snapshot.contents;

    const actualClass = await SnapshotParser.importOriginClass<TClass>(originFile, originClass);
    const { fixtureName: decoratorFixtureName, sourceClass } = SnapshotParser.fetchDecoratorValues(actualClass);

    let instance: TClass | any;

    if (decoratorFixtureName !== fixtureName) {
      throw new Error(`Mockingbird is able to find the file '${fixtureName}', but it does not contain any snapshot named '${fixtureName}'.
        '${decoratorFixtureName}' has been found associated to the same class '${originClass}'
       `);
    }

    if (sourceClass) {
      instance = new sourceClass();
    } else {
      Logger.warn(
        `Fixture '${decoratorFixtureName}' does not contain any source class in the @Fixture decorator options,\nMockingbird will rely on the mock class '${originClass}' instead`
      );
      Logger.info(`If you want to instantiate it from a different class please add { src: <Class> } to your fixture`);

      instance = new actualClass();
    }

    const fixture = Object.assign(instance, values);

    if (variant) {
      if (!SnapshotParser.isVariantExists(snapshot, variant)) {
        throw new Error(`Mockingbird can not find variant of fixture '${decoratorFixtureName}' named '${variant}'.
        Did you create a variant for your base fixture '${decoratorFixtureName}' named '${variant}'?
        Note: check the file '${FixtureEngine.getFixturesDirectory()}/${originFile}'`);
      }

      return Object.assign(fixture, variants[variant].values);
    }

    return fixture;
  }
}

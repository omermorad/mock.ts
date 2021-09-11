import fs from 'fs';
import path from 'path';
import { Class } from '@mockinbird/common';
import { Logger } from '@mockinbird/logger';
import { ClassReflection, reflect } from '@plumier/reflect';

const AAAAA = '/Users/omermorad/projects/mockingbird/sample/entities-monorepo/mocks';

function isMockSnapshotFileExists(name: string) {
  return fs.existsSync(`${AAAAA}/snapshots/${name}.mock`);
}

export class FixtureScanner {
  public async scan() {
    const files = fs.readdirSync(AAAAA);
    const paths = [];

    const promises = files
      .filter((file) => path.extname(file) === '.ts')
      .map((file) => {
        const fullPath = `${AAAAA}/${file}`;
        paths.push(fullPath);

        return import(fullPath).catch((e) => {
          Logger.error(`Error importing file ${file}`, e);
        });
      });

    const reflections: { [key: string]: { file: string; reflection: ClassReflection } } = {};
    const functions = await Promise.all<Class[]>(promises);

    functions.forEach((constructors, index) => {
      for (const [key, value] of Object.entries(constructors)) {
        reflections[key] = { file: paths[index], reflection: reflect(value) };
      }
    });

    for (const [key, value] of Object.entries<{ file: string; reflection: ClassReflection }>(reflections)) {
      const fixtureDecorators = value.reflection.decorators.find((decorator) => decorator.type === 'Fixture');

      const b = 1;
    }
  }
}

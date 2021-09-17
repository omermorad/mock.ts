import 'reflect-metadata';
import ReadDir from 'readdir';
import { Inject, Service } from 'typedi';
import { Logger } from '@mockinbird/logger';
import { FixturesClassesGroup } from './fixtures-classes-group';
import { Class } from '@mockinbird/common';
import { ClassDescriptor } from './class-descriptor';

export type ImportedMembers<T = unknown> = Record<string, T>;

@Service()
export class FileSystemFixtureScanner {
  private readonly basePath = '/Users/omermorad/projects/mockingbird/sample/entities-monorepo/fixtures';

  public constructor(@Inject('ReadDir') private readonly reader: typeof ReadDir) {}

  private static isClass(value: unknown) {
    return typeof value === 'function';
  }

  private static leaveClassesOnly(imports: ImportedMembers): ImportedMembers<Class> {
    const exportedMembersNames = Object.keys(imports);

    return exportedMembersNames.reduce<ImportedMembers>((acc, memberName) => {
      const targetClass = imports[memberName];

      if (!FileSystemFixtureScanner.isClass(targetClass)) {
        return acc;
      }

      return { ...acc, [memberName]: targetClass as Class };
    }, {}) as ImportedMembers<Class>;
  }

  private static check(baseFixtureClasses: ClassDescriptor[], file: string): ClassDescriptor {
    const { length: countBaseFixtures } = baseFixtureClasses;

    if (countBaseFixtures > 1) {
      throw new Error(
        `Mockingbird found ${countBaseFixtures} base classes inside the file '${file}': ${baseFixtureClasses.join(
          ', '
        )}.
        Each fixture file can contain only one base class, you can split the classes into multiple files and try again.
        `
      );
    }

    const [baseFixtureClass] = baseFixtureClasses;

    if (!baseFixtureClass) {
      Logger.warn('No fixtures at all');
    } else if (!baseFixtureClass.isDecorated()) {
      Logger.info(`Mockingbird encouraged an error while scanning the file ${file}.
      The class ${baseFixtureClass.name} is not decorated with @Fixture, did you forget to decorate it?
      `);
    }

    return baseFixtureClass;
  }

  private async importFilesDynamically(files: string[]): Promise<Record<string, unknown>[]> {
    return Promise.all<Record<string, unknown>>(
      files.map((file) =>
        import(`${this.basePath}/${file}`).catch((e) => Logger.error(`Error importing file ${file}`, e))
      )
    );
  }

  public async scan() {
    const files = await this.reader.read(this.basePath, ['**.ts', '!snapshots']);
    const importedFiles = await this.importFilesDynamically(files);

    const filesToFixtures = importedFiles
      .map(FileSystemFixtureScanner.leaveClassesOnly)
      .map<FixturesClassesGroup>((classes) => new FixturesClassesGroup(classes))
      .map<ClassDescriptor[]>((group) => group.findBaseFixtureClasses())
      .map<ClassDescriptor>((item, index) => FileSystemFixtureScanner.check(item, files[index]));

    const b = 1;
  }
}

import { Class } from '@mockinbird/common';
import { ImportedMembers } from './fixture-scanner';
import { ClassDescriptor } from './class-descriptor';

export class FixturesClassesGroup {
  private referencesMap: { [key: string]: ClassDescriptor };

  public constructor(private readonly importedMembers: ImportedMembers<Class>) {}

  public findBaseFixtureClasses(): ClassDescriptor[] {
    const classes = Object.values<Class>(this.importedMembers) as Class[];
    const baseFixtureClasses: ClassDescriptor[] = [];

    this.referencesMap = classes.reduce((referencesMap, targetClass) => {
      const { name: className } = targetClass;
      const dto = new ClassDescriptor(targetClass);
      const parent = dto.getParentClass();

      if (!parent) {
        baseFixtureClasses.push(dto);
      } else if (parent.name) {
        referencesMap[parent.name].children.push(dto);
      }

      return { ...referencesMap, [className]: dto };
    }, {});

    return baseFixtureClasses;
  }
}

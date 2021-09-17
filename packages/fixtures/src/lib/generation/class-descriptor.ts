import { ClassReflection, reflect } from '@plumier/reflect';
import { Class } from '@mockinbird/common';
import { FIXTURE_DECORATOR_NAME, FixtureDecoratorValues } from '../../decorators/fixture.decorator';

export class ClassDescriptor {
  private readonly parent: Class;
  private readonly decoration;

  public readonly reflection: ClassReflection;
  public readonly children: ClassDescriptor[] = [];
  public readonly name: string;

  public constructor(public readonly targetClass: Class) {
    this.reflection = reflect(targetClass);
    this.decoration = this.reflection.decorators.find((decorator) => decorator.type === FIXTURE_DECORATOR_NAME);
    this.parent = ClassDescriptor.lookForParentClass(targetClass);
    this.name = targetClass.name;
  }

  private static lookForParentClass(target: Class): Class | null {
    const parentClassName = Object.getPrototypeOf(target).prototype?.constructor.name;

    if (parentClassName) {
      return Object.getPrototypeOf(target).prototype.constructor;
    }

    return null;
  }

  public isDecorated(): boolean {
    return !!this.decoration;
  }

  public getFixtureValues(): FixtureDecoratorValues {
    return this.decoration.value;
  }

  public getParentClass(): Class | null {
    return this.parent;
  }
}

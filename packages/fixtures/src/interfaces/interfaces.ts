import { ClassLiteral } from '@mockinbird/common';

export type MockSnapshot<TClass> = {
  fixtureName: string;
  originFile: string;
  originClass: string;
  baseClass: string | undefined;
  values: Partial<ClassLiteral<TClass>>;
  variants?: { [key: string]: Omit<MockSnapshot<unknown>, 'originFile'> };
};

export interface SnapshotFile {
  readonly name: string;
  readonly path: string;
}

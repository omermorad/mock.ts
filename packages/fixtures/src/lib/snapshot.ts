import * as fs from 'fs';
import { MockSnapshot, SnapshotFile } from '../interfaces/interfaces';

export class Snapshot<TClass = any> {
  private readonly snapshotContents: MockSnapshot<TClass>;

  public constructor(public readonly name: string, public readonly path: string) {
    this.snapshotContents = this.parse();
  }

  private parse(): MockSnapshot<TClass> {
    const { name, path } = this;

    try {
      if (!fs.existsSync(`${path}/${name}.fixture.json`)) {
        throw new Error(`${path}/${name}.fixture.json not found`);
      }

      const snapshotContents = fs.readFileSync(`${path}/${name}.fixture.json`, 'utf-8');
      return JSON.parse(snapshotContents) as MockSnapshot<TClass>;
    } catch (error) {
      throw new Error(
        `
        Mockingbird can not find fixture named '${name}'. \n
        Maybe you are trying to load a variant of another fixture?
        Possible solution: MockFactory(<base-fixture-name>).variant(<fixture-variant-name>)
        
        Looked for file '${name}.fixture.json' under ${path}
        `
      );
    }
  }

  public static create<TClass = any>(snapshot: SnapshotFile): Snapshot<TClass> {
    return new Snapshot<TClass>(snapshot.name, snapshot.path);
  }

  public get contents(): MockSnapshot<TClass> {
    return this.snapshotContents;
  }
}

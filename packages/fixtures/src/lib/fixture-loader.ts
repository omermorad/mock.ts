import * as fs from 'fs';
import { Container } from 'typedi';
import { FixtureEngine } from './fixture-engine';
import { SnapshotParser } from './snapshot-parser';
import { Snapshot } from './snapshot';

export interface FixtureLoader<TClass = any> {
  /**
   *
   * @param name {string} the name of the fixture variant
   */
  variant(name: string): Omit<FixtureLoader<TClass>, 'variant'>;

  /**
   *
   * @param fixtureName {string} the name of the fixture
   */
  load(fixtureName: string): Promise<TClass>;
}

export class FixtureLoader<TClass = any> {
  private fixtureVariantName: string;

  public constructor(private readonly fixtureName: string) {}

  public variant(name: string): Omit<this, 'variant'> {
    this.fixtureVariantName = name;
    return this;
  }

  public async load(): Promise<TClass> {
    const fixturesDir = FixtureEngine.getFixturesDirectory();
    const snapshotPath = `${fixturesDir}/snapshots`;

    if (!fs.existsSync(snapshotPath)) {
      throw new Error(`Can not find directory 'snapshots' under directory '${fixturesDir}'`);
    }

    const snapshotParser = Container.get<SnapshotParser>(SnapshotParser);
    const snapshot = Snapshot.create<TClass>({ name: this.fixtureName, path: snapshotPath });

    return snapshotParser.parse<TClass>(snapshot, this.fixtureVariantName);
  }
}

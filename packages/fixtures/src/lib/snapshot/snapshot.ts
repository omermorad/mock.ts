import * as fs from 'fs';
import * as util from 'util';
import { MockSnapshot, SnapshotFile } from './interfaces';
import { ERROR_MESSAGES } from '../messages/logger-messages';

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
      const message = util.format(ERROR_MESSAGES.UNABLE_TO_FIND_FIXTURE_NAME, name, path);
      throw new Error(message);
    }
  }

  public static fromFile<TClass = any>(snapshot: SnapshotFile): Snapshot<TClass> {
    return new Snapshot<TClass>(snapshot.name, snapshot.path);
  }

  public get contents(): MockSnapshot<TClass> {
    return this.snapshotContents;
  }
}

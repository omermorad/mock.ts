import { ObjectLiteral } from '@mockinbird/common';
import get from 'lodash.get';

export class FixtureEngine {
  public static getFixturesDirectory(): string {
    const cwd = process.cwd();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(`${cwd}/package.json`) as ObjectLiteral;
    const { fixturesDir = '/fixtures' } = get(pkg, 'mockingbird');

    return `${cwd}/${fixturesDir}`;
  }
}

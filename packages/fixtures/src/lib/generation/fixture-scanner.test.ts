import 'reflect-metadata';
import { Container } from 'typedi';
import * as ReadDir from 'readdir';
import { FileSystemFixtureScanner } from './fixture-scanner';

describe('Fixture Scanner Unit Test', () => {
  let scanner: FileSystemFixtureScanner;

  beforeAll(() => {
    Container.set('ReadDir', ReadDir);
    scanner = Container.get(FileSystemFixtureScanner);
  });

  describe('when I call it', () => {
    let a;

    beforeAll(async () => (a = await scanner.scan()));

    test('then do something', () => {
      expect(a).toBe(1);
    });
  });
});

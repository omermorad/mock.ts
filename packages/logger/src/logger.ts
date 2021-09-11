import chalk from 'chalk';
import util from 'util';

const prefix = '\u{1F426} ';

function format(args: Array<any>, customPrefix?: string) {
  const fullPrefix = prefix + (customPrefix === undefined ? '' : ' ' + customPrefix);
  return (
    fullPrefix +
    util
      .format('', ...args)
      .split('\n')
      .join('\n' + fullPrefix + ' ')
  );
}

export interface MockingbirdLogger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  log(message: string, ...args: any[]): void;
  success(message: string, ...args: any[]): void;
}

export const Logger: MockingbirdLogger = {
  info: (...args: any[]): void => {
    console.info(format(args, chalk.cyan('info')));
  },
  log: (...args: any[]): void => {
    console.log(format(args));
  },
  error: (...args: any[]): void => {
    console.error(format(args, chalk.red('error')));
  },
  success: (...args: any[]): void => {
    console.log(format(args, chalk.green('success')));
  },
  warn: (...args: any[]): void => {
    console.warn(format(args, chalk.yellow('warn')));
  },
};

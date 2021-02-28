import util from 'util';
import Constants from '../constants';

const { STAGE: stage } = process.env;

export const logError = (error) => {
  console.error('Error: ', error.message, '\n\nStack: ', error.stack);
}

export function logDebug() {
  if (Constants.debug && stage !== 'prod') {
    const debugArgs = ['Debug: '];
    [...arguments].forEach(arg => {
      if (typeof arg === 'string') {
        arg = arg
          .replace(/\r?\n|\r/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      debugArgs.push(util.inspect(arg, {depth: null}));
    })
    // console.log('debug: ', util.inspect(...arguments, {depth: null}));
    console.log.apply(console, debugArgs);
  }
}

const path = require('path');
const { NODE_ENV } = process.env;
const { join, relative } = path;

const isProd = (NODE_ENV === 'production');

const pino = require('pino')({ timestamp: !isProd, prettyPrint: !isProd });
pino.INFO = pino.info;
pino.DEBUG = pino.debug;
pino.ERROR = pino.error;

function toCategory(fileName) {
  const args = [process.cwd()];
  if (isProd) {
    args.push('dist');
  }
  args.push('src');

  return relative(join.apply(path, args), fileName);
}

const _loggerInstances = {};

class Logger {
  constructor(category) {
    this.category = category;
  }

  _log(level, msg, args1, args2, args3, args4, args5, args6, args7, args8) {
    msg = [level, this.category, msg];

    const logArgs = [{ args1, args2, args3, args4, args5, args6, args7, args8 }, msg.join(' - ')];
    pino[level].apply(pino, logArgs);
  }

  info(msg, args1, args2, args3, args4, args5, args6, args7, args8) {
    return this._log('INFO', msg, args1, args2, args3, args4, args5, args6, args7, args8);
  }

  debug(msg, args1, args2, args3, args4, args5, args6, args7, args8) {
    return this._log('DEBUG', msg, args1, args2, args3, args4, args5, args6, args7, args8);
  }

  error(msg) {
    return pino.error(msg);
  }
}

exports.getLogger = function getLogger(fileName) {
  const category = toCategory(fileName);
  let instance;
  if (!_loggerInstances[category]) {
    instance = Object.freeze(new Logger(category));
  }
  _loggerInstances[category] = instance;
  return instance;
};

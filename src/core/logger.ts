import chalk from 'chalk';

type LogType = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'API' | 'MESSAGE';

interface LoggerInterface {
  DateColor: chalk.Chalk;
  Colors: {
    [key in LogType]: chalk.Chalk;
  };
  debug: boolean;
  log(type: LogType, message: string): void;
}


const Logger: LoggerInterface = {
  DateColor: chalk.green.bold,
  Colors: {
    DEBUG: chalk.whiteBright.bold,
    INFO: chalk.cyan.bold,
    WARN: chalk.yellow.bold,
    ERROR: chalk.red.bold,
    API: chalk.whiteBright.bold,
    MESSAGE: chalk.cyan.bold,
  },
  debug: false,
  log(type: LogType, message: string) {
    if (type === 'DEBUG' && !this.debug) {
      return;
    }

    console.log(
      this.DateColor(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`),
      this.Colors[type](`[${type}]`),
      this.Colors.MESSAGE(message)
    );
  },
};


export { Logger };

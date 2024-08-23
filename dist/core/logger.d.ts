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
declare const Logger: LoggerInterface;
export { Logger };
//# sourceMappingURL=logger.d.ts.map
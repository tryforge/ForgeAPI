import chalk from "chalk";
export declare const Logger: {
    dateColor: chalk.Chalk;
    colors: {
        INFO: chalk.Chalk;
        WARN: chalk.Chalk;
        ERROR: chalk.Chalk;
        DEBUG: chalk.Chalk;
    };
    log(type: "INFO" | "WARN" | "ERROR" | "DEBUG", ...message: string[]): void;
};
//# sourceMappingURL=logger.d.ts.map
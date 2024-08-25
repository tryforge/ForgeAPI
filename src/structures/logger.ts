import chalk from "chalk";

export const Logger = {
  dateColor: chalk.greenBright.bold,
  colors: {
    INFO: chalk.cyan.bold,
    WARN: chalk.yellow.bold,
    ERROR: chalk.red.bold,
    DEBUG: chalk.whiteBright.bold
  },
  log(type: "INFO" | "WARN" | "ERROR" | "DEBUG", ...message: string[]) {
    console.log(
      this.dateColor(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`),
      this.colors[type](`[${type}]`),
      this.colors[type](message.join(" "))
    )
  }
}
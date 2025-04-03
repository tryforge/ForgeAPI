import { readFileSync } from "fs"

/**
 * Returns the current version of the project.
 * @returns {string}
 */
export function getVersion(): string {
    const content = readFileSync(process.cwd() + "/package.json", "utf-8")
    return JSON.parse(content).version
}
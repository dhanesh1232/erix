// /src/utils/logger.js

import fs from "fs";
import os from "os";
import path from "path";
import chalk from "chalk";

const LOG_DIR = path.join(os.homedir(), ".erix", "logs");
const LOG_FILE = path.join(LOG_DIR, "errors.log");

export function logError(context = "unknown", error = {}) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

    const cwd = process.cwd();
    const projectName = path.basename(cwd);
    const timestamp = new Date().toLocaleString();

    const message = [
      chalk.gray(`\n[${timestamp}]`),
      chalk.cyan(`📁 Project:`) + ` ${projectName}`,
      chalk.gray(`📍 Path:`) + ` ${cwd}`,
      chalk.blue(`🔧 Context:`) + ` ${context}`,
      chalk.red.bold(`❌ Error:`) + ` ${error.message || error}`,
      chalk.gray("─────────────────────────────\n"),
    ].join("\n");

    // Write raw text (without chalk colors) to file for persistent storage
    const plainMessage = message.replace(/\x1B\[[0-9;]*m/g, "");
    fs.appendFileSync(LOG_FILE, plainMessage);

    console.log(chalk.gray(`🪵 Error logged → ${LOG_FILE}`));
  } catch (err) {
    console.error(chalk.red("⚠ Failed to write log file:"), err.message);
  }
}

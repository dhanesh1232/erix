import fs from "fs";
import os from "os";
import path from "path";
import chalk from "chalk";

export default function showLogs() {
  const logPath = path.join(os.homedir(), ".erix", "logs", "errors.log");

  console.log(chalk.cyan.bold("\n📜 ERIX Error Log Viewer"));
  console.log(chalk.gray("─────────────────────────────\n"));

  if (!fs.existsSync(logPath)) {
    console.log(
      chalk.yellow("No logs found yet. Everything’s running smooth! 🚀\n")
    );
    return;
  }

  const content = fs.readFileSync(logPath, "utf-8");
  const entries = content.trim().split("─────────────────────────────");

  if (!entries.length) {
    console.log(chalk.yellow("No valid logs found.\n"));
    return;
  }

  entries.forEach((entry, index) => {
    if (!entry.trim()) return;

    const projectMatch = entry.match(/Project:\s(.+)/);
    const errorMatch = entry.match(/Error:\s(.+)/);

    console.log(chalk.gray(`\n${index + 1}.`));
    console.log(chalk.green(entry.trim()));

    if (projectMatch)
      console.log(
        chalk.bold.yellow(`→ Project:`),
        chalk.white(projectMatch[1])
      );
    if (errorMatch)
      console.log(chalk.red.bold(`→ Error:`), chalk.white(errorMatch[1]));

    console.log(chalk.gray("─────────────────────────────"));
  });
}

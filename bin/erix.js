#!/usr/bin/env node

import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0];

if (!command || ["help", "--help", "-h"].includes(command)) {
  import(path.join(__dirname, "../src/help.js"))
    .then((help) => {
      if (help.default) help.default();
      else if (help.showHelp) help.showHelp();
      else console.log(chalk.red("❌ Help command not found in module."));
    })
    .catch((err) => {
      console.error(chalk.red("❌ Failed to load help module:"), err.message);
    })
    .finally(() => {
      process.exit(0);
    });
  // ❌ Remove the early `process.exit(0)` here
} else {
  switch (command) {
    case "git":
      import(path.join(__dirname, "../src/git.js"))
        .then((m) => {
          if (m.default) m.default(args);
          else if (m.run) m.run(args);
          else console.log(chalk.red("❌ Git command not found in module."));
        })
        .catch((err) => {
          console.error(
            chalk.red("❌ Failed to load git module:"),
            err.message
          );
        });
      break;

    default:
      console.log(chalk.red(`❌ Unknown command: ${command}`));
      console.log(chalk.gray("Use: npx erix help\n"));
      break;
  }
}

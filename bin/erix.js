#!/usr/bin/env node

import fs from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const pkgPath = path.resolve(__dirname, "../package.json");
    const { version, name } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

    const args = process.argv.slice(2);
    const command = args[0];

    // ✅ Version flag
    if (["-v", "--version"].includes(command)) {
      console.log(`${chalk.cyan.bold(name)} ${chalk.red.bold(`v${version}`)}`);
      process.exit(0);
    }

    // ✅ Help command
    if (!command || ["help", "--help", "-h"].includes(command)) {
      try {
        const help = await import(path.join(__dirname, "../src/help.js"));
        if (help.default) help.default();
        else if (help.showHelp) help.showHelp();
        else console.log(chalk.red("❌ Help command not found in module."));
      } catch (err) {
        console.error(chalk.red("❌ Failed to load help module:"), err.message);
      }
      process.exit(0);
    }

    // ✅ Command routing
    switch (command) {
      case "git":
        try {
          const m = await import(path.join(__dirname, "../src/git.js"));
          if (m.default) await m.default(args);
          else if (m.run) await m.run(args);
          else console.log(chalk.red("❌ Git command not found in module."));
        } catch (err) {
          console.error(
            chalk.red("❌ Failed to load git module:"),
            err.message
          );
        }
        break;

      default:
        console.log(chalk.red(`❌ Unknown command: ${command}`));
        console.log(chalk.gray("Use: npx erix help\n"));
        break;
    }
  } catch (err) {
    console.error(chalk.red("💥 CLI crash:"), err.message);
  }
})();

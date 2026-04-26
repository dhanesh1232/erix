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
            err.message,
          );
        }
        break;

      case "search":
        try {
          const m = await import(path.join(__dirname, "../src/search.js"));
          if (m.run) await m.run(args);
        } catch (err) {
          console.error(chalk.red("❌ Search failed:"), err.message);
        }
        break;

      case "edit":
        try {
          const m = await import(path.join(__dirname, "../src/edit.js"));
          if (m.run) await m.run(args);
        } catch (err) {
          console.error(chalk.red("❌ Edit failed:"), err.message);
        }
        break;

      case "sc":
        try {
          const m = await import(path.join(__dirname, "../src/sc.js"));
          if (m.run) await m.run(args);
        } catch (err) {
          console.error(chalk.red("❌ Smart Commit failed:"), err.message);
        }
        break;

      case "doctor":
        try {
          const { doctor } = await import(
            path.join(__dirname, "../src/doctor.js")
          );
          await doctor();
        } catch (err) {
          console.error(chalk.red("❌ Doctor failed:"), err.message);
        }
        break;

      case "run":
        try {
          const { run } = await import(path.join(__dirname, "../src/bash.js"));
          await run(args);
        } catch (err) {
          console.error(chalk.red("❌ Run failed:"), err.message);
        }
        break;

      case "login":
      case "auth":
        try {
          const { login } = await import(
            path.join(__dirname, "../src/github/auth.js")
          );
          await login();
        } catch (err) {
          console.error(chalk.red("❌ Login failed:"), err.message);
        }
        break;

      case "pr":
        try {
          const { createPR } = await import(
            path.join(__dirname, "../src/github/pr.js")
          );
          await createPR();
        } catch (err) {
          console.error(chalk.red("❌ PR creation failed:"), err.message);
        }
        break;

      case "issues":
      case "issue":
        try {
          const { manageIssues } = await import(
            path.join(__dirname, "../src/github/issues.js")
          );
          await manageIssues();
        } catch (err) {
          console.error(chalk.red("❌ Issues manager failed:"), err.message);
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

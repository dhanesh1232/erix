import chalk from "chalk";

export function showHelp() {
  console.log(
    chalk.bold.cyanBright("\n🚀 ECODRIX CLI - Developer Assistant\n")
  );
  console.log(chalk.gray("Usage:"));
  console.log(
    `  ${chalk.green("erix")} ${chalk.yellow("<command>")} [options]\n`
  );

  console.log(chalk.gray("Available Commands:"));
  console.log(
    `  ${chalk.yellow("git")}         ${chalk.white(
      "Automate git init, commit & push"
    )}`
  );
  console.log(
    `  ${chalk.yellow("help")}        ${chalk.white("Show this help menu")}\n`
  );

  console.log(chalk.gray("Options for 'git' command:"));
  console.log(
    `  ${chalk.green("--r, --repo")}      ${chalk.white("GitHub repo URL")}`
  );
  console.log(
    `  ${chalk.green("--m, --message")}   ${chalk.white("Commit message")}`
  );
  console.log(
    `  ${chalk.green("--f, --force")}     ${chalk.white(
      "Force push even if conflicts"
    )}`
  );
  console.log(
    `  ${chalk.green("--reinit")}         ${chalk.white(
      "Reinitialize the repository"
    )}\n`
  );

  console.log(chalk.gray("Examples:"));
  console.log(
    `  ${chalk.cyan(
      'erix git --r https://github.com/user/project.git --m "Initial commit"'
    )}`
  );
  console.log(`  ${chalk.cyan('erix git --f --m "Hotfix: deployment"')}`);
  console.log(`  ${chalk.cyan("erix help")}\n`);

  console.log(chalk.gray("─────────────────────────────────────────────"));
  console.log(
    chalk.bold("💡 Tip:") +
      chalk.white(" You can use this CLI inside any project folder.")
  );
  console.log(chalk.gray("─────────────────────────────────────────────\n"));
}

import chalk from "chalk";

export function showHelp() {
  console.log(
    chalk.bold.cyanBright("\n🚀 ECODRIX CLI - AI Developer Assistant\n")
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
    `  ${chalk.yellow("search")}      ${chalk.white(
      "Contextual code grep (GrepTool)"
    )}`
  );
  console.log(
    `  ${chalk.yellow("edit")}        ${chalk.white(
      "Safe string-replacement-based edit (FileEditTool)"
    )}`
  );
  console.log(
    `  ${chalk.yellow("sc")}          ${chalk.white(
      "Smart Commit (AIGC context-driven)"
    )}`
  );
  console.log(
    `  ${chalk.yellow("doctor")}      ${chalk.white(
      "Environment health & diagnostics"
    )}`
  );
  console.log(
    `  ${chalk.yellow("run")}         ${chalk.white(
      "Safe, diagnostic bash execution (BashTool)"
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

  console.log(chalk.gray("Agentic Examples:"));
  console.log(
    `  ${chalk.cyan(
      'erix search "TODO"'
    )}`
  );
  console.log(
    `  ${chalk.cyan(
      'erix edit src/main.js "old content" "new content"'
    )}`
  );
  console.log(
    `  ${chalk.cyan(
      'erix sc'
    )}`
  );
  console.log(
    `  ${chalk.cyan(
      'erix run "df -h"'
    )}\n`
  );

  console.log(chalk.gray("─────────────────────────────────────────────"));
  console.log(
    chalk.bold("💡 Tip:") +
      chalk.white(" Integrated with Claude Code agentic logic for safety.")
  );
  console.log(chalk.gray("─────────────────────────────────────────────\n"));
}

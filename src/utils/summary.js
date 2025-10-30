import chalk from "chalk";
import ora from "ora";

export function showSummary(remoteUrl, branch, message = "") {
  console.log(chalk.greenBright("\n✔ Git Automator Summary"));
  console.log(chalk.gray("─────────────────────────────"));
  console.log(chalk.cyan(`📦 Repo:`), chalk.white(remoteUrl));
  console.log(chalk.cyan(`🌿 Branch:`), chalk.white(branch));
  console.log(
    chalk.cyan(`📝 Commit:`),
    chalk.white(message || "No commit message")
  );
  console.log(chalk.cyan(`⏰ Time:`), chalk.white(new Date().toLocaleString()));
  console.log(
    chalk.yellow.bold(
      "⚠️  Tip: Double-check your repository on GitHub to confirm your latest push is visible!\n"
    )
  );
  console.log(chalk.gray("─────────────────────────────\n"));
}

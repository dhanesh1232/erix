import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { getOctokit } from "./auth.js";

// Helper to get repo owner and name from remote origin URL
function getRepoDetails() {
  try {
    const remoteUrl = execSync("git remote get-url origin").toString().trim();
    // Parse https://github.com/owner/repo.git or git@github.com:owner/repo.git
    const match = remoteUrl.match(/github\.com[:/](.+)\/(.+?)(\.git)?$/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    return null;
  }
}

export async function createPR() {
  console.log(chalk.bold.cyan("\n🚀 ERIX Pull Request Creator"));
  console.log(chalk.gray("─────────────────────────────────────────────"));

  let octokit;
  try {
    octokit = getOctokit();
  } catch (err) {
    console.log(chalk.red("❌ " + err.message));
    return;
  }

  const repoDetails = getRepoDetails();
  if (!repoDetails) {
    console.log(
      chalk.red(
        "❌ Could not determine GitHub repository owner and name from remote origin.",
      ),
    );
    return;
  }

  const branch = getCurrentBranch();
  if (!branch || branch === "main" || branch === "master") {
    console.log(
      chalk.yellow(
        "⚠️ You are currently on the 'main' or 'master' branch. Please create a PR from a feature branch.",
      ),
    );
    return;
  }

  const { title, body, base } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: chalk.yellow("PR Title:"),
      default: `Merge ${branch} into main`,
      validate: (input) => input.trim().length > 0 || "Title cannot be empty.",
    },
    {
      type: "input",
      name: "body",
      message: chalk.yellow("PR Description (optional):"),
    },
    {
      type: "input",
      name: "base",
      message: chalk.yellow("Base branch to merge into:"),
      default: "main",
    },
  ]);

  const spinner = ora("Creating Pull Request...").start();

  try {
    const response = await octokit.rest.pulls.create({
      owner: repoDetails.owner,
      repo: repoDetails.repo,
      title: title.trim(),
      body: body.trim(),
      head: branch,
      base: base.trim(),
    });

    spinner.succeed(chalk.green(`Pull Request created successfully!`));
    console.log(chalk.cyan(`🔗 PR URL: ${response.data.html_url}`));
  } catch (err) {
    spinner.fail(chalk.red("Failed to create Pull Request."));
    if (err.status === 422) {
      console.log(
        chalk.yellow(
          "⚠️ A pull request might already exist for this branch, or there are no commits to merge.",
        ),
      );
    } else {
      console.error(chalk.redBright(err.message));
    }
  }
}

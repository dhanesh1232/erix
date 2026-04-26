import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { getOctokit } from "./auth.js";

// Helper to get repo owner and name from remote origin URL
function getRepoDetails() {
  try {
    const remoteUrl = execSync("git remote get-url origin").toString().trim();
    const match = remoteUrl.match(/github\.com[:/](.+)\/(.+?)(\.git)?$/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

export async function manageIssues() {
  console.log(chalk.bold.cyan("\n📋 ERIX GitHub Issues Manager"));
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

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "List open issues", value: "list" },
        { name: "Create a new issue", value: "create" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  if (action === "exit") return;

  if (action === "list") {
    const spinner = ora("Fetching open issues...").start();
    try {
      const response = await octokit.rest.issues.listForRepo({
        owner: repoDetails.owner,
        repo: repoDetails.repo,
        state: "open",
        per_page: 10,
      });

      spinner.stop();
      if (response.data.length === 0) {
        console.log(chalk.green("🎉 No open issues found!"));
      } else {
        console.log(
          chalk.yellow(
            `\nRecent Open Issues for ${repoDetails.owner}/${repoDetails.repo}:`,
          ),
        );
        response.data.forEach((issue) => {
          // GitHub returns PRs in the issues endpoint too, filter them out if needed, but let's keep it simple
          if (!issue.pull_request) {
            console.log(
              `${chalk.cyan(`#${issue.number}`)} ${chalk.white(issue.title)} ${chalk.gray(`(@${issue.user.login})`)}`,
            );
          }
        });
        console.log("");
      }
    } catch (err) {
      spinner.fail(chalk.red("Failed to fetch issues."));
      console.error(chalk.redBright(err.message));
    }
  }

  if (action === "create") {
    const { title, body } = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: chalk.yellow("Issue Title:"),
        validate: (input) =>
          input.trim().length > 0 || "Title cannot be empty.",
      },
      {
        type: "input",
        name: "body",
        message: chalk.yellow("Issue Description (optional):"),
      },
    ]);

    const spinner = ora("Creating Issue...").start();
    try {
      const response = await octokit.rest.issues.create({
        owner: repoDetails.owner,
        repo: repoDetails.repo,
        title: title.trim(),
        body: body.trim(),
      });

      spinner.succeed(chalk.green(`Issue created successfully!`));
      console.log(chalk.cyan(`🔗 Issue URL: ${response.data.html_url}`));
    } catch (err) {
      spinner.fail(chalk.red("Failed to create Issue."));
      console.error(chalk.redBright(err.message));
    }
  }
}

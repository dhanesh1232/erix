#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";

process.on("SIGINT", () => {
  console.log(chalk.redBright("\n\n💤 Operation cancelled by user."));
  console.log(chalk.gray("─────────────────────────────────────────────"));
  console.log(chalk.cyan("👋 ERIX CLI exited safely.\n"));
  process.exit(0);
});

export default async function run(args) {
  console.log(chalk.bold.cyan("\n🚀 ERIX GIT AUTOMATOR v2"));
  console.log(chalk.gray("─────────────────────────────────────────────\n"));

  args = Array.isArray(args) ? args : [];

  let repo = null;
  let message = "Auto commit from ERIX 🚀";
  const repoFlag = args.find((a) => a.startsWith("--r"));
  const messageFlag = args.find((a) => a.startsWith("--m"));
  let force = args.includes("--f");

  repo = repoFlag ? repoFlag.split(" ")[1] || repoFlag.split("=")[1] : null;
  message = messageFlag
    ? messageFlag.split(" ")[1] || messageFlag.split("=")[1]
    : "Auto commit from ERIX 🚀";

  // Ask for repo if missing
  if (!repo) {
    try {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "repo",
          message: chalk.yellow("🌐 Enter your repository URL:"),
          validate: (input) =>
            input.startsWith("https://github.com/") ||
            "Please enter a valid GitHub repository URL (https://github.com/...)",
        },
      ]);
      repo = answer.repo.trim();
    } catch (err) {
      console.log(chalk.redBright("\n💤 Operation cancelled by user."));
      console.log(chalk.gray("─────────────────────────────────────────────"));
      process.exit(0);
    }
  }

  const gitPath = path.join(process.cwd(), ".git");
  const spinner = ora("🔍 Checking git status...").start();

  try {
    // Detect or re-init
    if (!fs.existsSync(gitPath)) {
      spinner.text = "Initializing new repository...";
      execSync("git init", { stdio: "ignore" });
    }

    // Detect branch
    let branch = "main";
    try {
      branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
      if (branch === "HEAD") branch = "main";
    } catch {
      spinner.text = "No branch detected. Creating main...";
      execSync("git checkout -b main", { stdio: "ignore" });
    }

    // Add & commit
    spinner.text = "Adding files...";
    execSync("git add .", { stdio: "ignore" });

    try {
      spinner.text = "Committing changes...";
      execSync(`git commit -m "${message}"`, { stdio: "ignore" });
    } catch {
      spinner.text = "No new changes detected...";
    }

    // Remote
    let remoteUrl = "";
    try {
      remoteUrl = execSync("git remote get-url origin").toString().trim();

      if (remoteUrl !== repo) {
        spinner.text = "Updating remote origin...";
        execSync("git remote remove origin", { stdio: "ignore" });
        execSync(`git remote add origin ${repo}`, { stdio: "ignore" });
        remoteUrl = repo;
      }
    } catch {
      spinner.text = "Setting remote origin...";
      execSync(`git remote add origin ${repo}`, { stdio: "ignore" });
      remoteUrl = repo;
    }

    spinner.text = `Pushing to ${branch}...`;
    try {
      execSync(`git push origin ${branch}${force ? " --force" : ""}`, {
        stdio: "ignore",
      });
      spinner.succeed(chalk.green("✅ Code pushed successfully!"));
      showSummary(remoteUrl, branch, message);
    } catch (err) {
      spinner.fail(chalk.red("Push failed."));
      await tryRecovery(remoteUrl, branch, force, spinner);
    }
  } catch (err) {
    spinner.fail(chalk.red("💥 Unexpected error occurred."));
    console.error(chalk.redBright(err.message));
  }

  console.log(chalk.gray("\n─────────────────────────────────────────────"));
  console.log(
    chalk.bold.cyan("✨ ERIX — Because you deserve one-command perfection.\n")
  );
}

async function tryRecovery(remoteUrl, branch, force, spinner) {
  try {
    spinner.text = "Fetching and rebasing...";
    execSync("git fetch origin", { stdio: "ignore" });
    execSync(`git pull origin ${branch} --rebase`, { stdio: "ignore" });

    spinner.text = "Retrying push...";
    execSync(`git push origin ${branch}${force ? " --force" : ""}`, {
      stdio: "ignore",
    });

    spinner.succeed(chalk.green("✅ Rebase successful! Push complete."));
    showSummary(remoteUrl, branch);
    return;
  } catch (err) {
    spinner.warn(chalk.yellow("⚠ Could not auto-resolve conflicts."));
  }

  // --- Detect default remote branch dynamically
  let remoteDefaultBranch = "main";
  try {
    const remoteInfo = execSync("git remote show origin").toString();
    const match = remoteInfo.match(/HEAD branch:\s+(\S+)/);
    if (match && match[1]) remoteDefaultBranch = match[1];
  } catch {
    // fallback
  }

  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmForce",
      message: chalk.yellow(
        "Would you like to force push? (⚠️ This will overwrite remote history)"
      ),
      default: false,
    },
  ]);

  if (!answer.confirmForce) {
    console.log(chalk.yellow("\nManual steps:"));
    console.log(chalk.white(`git pull origin ${branch} --rebase`));
    console.log(chalk.white(`git push origin ${branch} --force`));
    return;
  }

  const forceSpinner = ora("🚀 Forcing push...").start();

  try {
    // Try regular force push
    execSync(`git push origin ${branch} --force`, { stdio: "ignore" });
    forceSpinner.succeed(chalk.green("✅ Forced push successful."));
    showSummary(remoteUrl, branch);
  } catch (err1) {
    // Try with -u
    forceSpinner.text = "Setting upstream and retrying...";
    try {
      execSync(`git push -u origin ${branch} --force`, { stdio: "ignore" });
      forceSpinner.succeed(
        chalk.green("✅ Forced push successful (upstream set).")
      );
      showSummary(remoteUrl, branch);
    } catch (err2) {
      // Try with HEAD mapping
      forceSpinner.text = "Retrying with HEAD mapping...";
      try {
        execSync(`git push origin HEAD:${remoteDefaultBranch} --force`, {
          stdio: "ignore",
        });
        forceSpinner.succeed(
          chalk.green(`✅ Forced push to ${remoteDefaultBranch} successful.`)
        );
        showSummary(remoteUrl, remoteDefaultBranch);
      } catch (err3) {
        forceSpinner.fail(chalk.red("❌ Force push failed again."));

        if (
          err3.message.includes("authentication") ||
          err3.message.includes("Permission denied")
        ) {
          console.log(
            chalk.redBright(
              "\n🔒 Authentication error — please login to GitHub first:\n"
            )
          );
          console.log(
            chalk.white("git config --global credential.helper store")
          );
          console.log(
            chalk.white(
              "git pull or git push manually once to save credentials.\n"
            )
          );
        }

        console.log(chalk.yellow("\nManual recovery:"));
        console.log(chalk.white(`git push -u origin ${branch} --force`));
        console.log(chalk.white(`or`));
        console.log(
          chalk.white(`git push origin HEAD:${remoteDefaultBranch} --force`)
        );
      }
    }
  }
}

function showSummary(remoteUrl, branch, message = "") {
  console.log(chalk.greenBright("\n💫 Summary"));
  console.log(chalk.gray("─────────────────────────────"));
  console.log(chalk.cyan(`📦 Repo:`), chalk.white(remoteUrl));
  console.log(chalk.cyan(`🌿 Branch:`), chalk.white(branch));
  console.log(
    chalk.cyan(`📝 Commit:`),
    chalk.white(message || "No commit message")
  );
  console.log(chalk.cyan(`⏰ Time:`), chalk.white(new Date().toLocaleString()));
  console.log(chalk.gray("─────────────────────────────\n"));
}

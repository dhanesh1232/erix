#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadModuleFunction({
  modulePath,
  functionName,
  fallback = async () => {},
  label = "module",
}) {
  try {
    const fullPath = path.join(__dirname, modulePath);
    const mod = await import(fullPath);
    return mod[functionName] || fallback;
  } catch (err) {
    console.error(`⚠ Failed to load ${label}:`, err.message);
    return fallback;
  }
}

let logError = async () => {};
let showSummary = async () => {};

async function fechFunctionModules() {
  logError = await loadModuleFunction({
    modulePath: "./utils/logger.js",
    functionName: "logError",
    label: "logger",
  });
  showSummary = await loadModuleFunction({
    modulePath: "./utils/summary.js",
    functionName: "showSummary",
    label: "summary",
  });
}

// graceful exit
process.on("SIGINT", () => {
  console.log(chalk.redBright("\n\n💤 Operation cancelled by user."));
  console.log(chalk.gray("─────────────────────────────────────────────"));
  console.log(chalk.cyan("👋 ERIX CLI exited safely.\n"));
  process.exit(0);
});

// delay helper
const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export default async function run(args) {
  await fechFunctionModules();
  console.log(chalk.bold.cyan("\n🚀 ERIX GIT AUTOMATOR v2"));
  console.log(chalk.gray("─────────────────────────────────────────────\n"));

  args = Array.isArray(args) ? args : [];

  let repo = null;
  let message = "Auto commit from ERIX 🚀";
  let force = args.includes("--f") || args.includes("-f");

  // --- Parse flags ---
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--r" || arg === "-r") {
      repo = args[i + 1] && !args[i + 1].startsWith("-") ? args[i + 1] : repo;
    } else if (arg.startsWith("--r=")) repo = arg.split("=")[1];

    if (arg === "--m" || arg === "-m") {
      message =
        args[i + 1] && !args[i + 1].startsWith("-") ? args[i + 1] : message;
    } else if (arg.startsWith("--m=")) message = arg.split("=")[1];
  }

  if (!repo) {
    try {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "repo",
          message: chalk.yellow("🌐 Enter your repository URL:"),
          validate: (input) =>
            /^https:\/\/(github|gitlab|bitbucket)\.com\/.+/.test(input) ||
            "Enter a valid repository URL (GitHub, GitLab, or Bitbucket)",
        },
      ]);
      repo = answer.repo.trim();
    } catch {
      console.log(chalk.redBright("\n💤 Operation cancelled by user."));
      console.log(chalk.gray("─────────────────────────────────────────────"));
      await logError("user input", "User cancelled prompt with Ctrl+C");
      process.exit(0);
    }
  }

  const gitPath = path.join(process.cwd(), ".git");
  const spinner = ora("🔍 Checking repository...").start();

  try {
    // check/init repo
    await wait();
    if (!fs.existsSync(gitPath)) {
      spinner.text = "Initializing new repository...";
      await wait();
      execSync("git init", { stdio: "ignore" });
      spinner.succeed(chalk.green("Repository initialized successfully."));
    } else {
      spinner.succeed(chalk.green("Repository already initialized."));
    }

    // branch detection
    spinner.start("Detecting branch...");
    await wait();
    let branch = "main";
    try {
      branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
      if (branch === "HEAD") branch = "main";
      spinner.succeed(chalk.green(`Branch '${branch}' detected successfully.`));
    } catch {
      spinner.text = "Creating main branch...";
      await wait();
      execSync("git checkout -b main", { stdio: "ignore" });
      spinner.succeed(chalk.green("Main branch created successfully."));
    }

    // add files
    spinner.start("Adding files...");
    await wait();
    execSync("git add .", { stdio: "ignore" });
    spinner.succeed(chalk.green("Files added successfully."));

    // commit
    spinner.start("Committing changes...");
    await wait();
    try {
      execSync(`git commit -m "${message}"`, { stdio: "ignore" });
      spinner.succeed(chalk.green("Changes committed successfully."));
    } catch {
      spinner.info(chalk.gray("No new changes detected; commit skipped."));
    }

    // remote handling
    spinner.start("Checking remote origin...");
    await wait();
    let remoteUrl = "";
    try {
      remoteUrl = execSync("git remote get-url origin").toString().trim();
      if (remoteUrl !== repo) {
        spinner.text = "Updating remote origin...";
        await wait();
        execSync("git remote remove origin", { stdio: "ignore" });
        execSync(`git remote add origin ${repo}`, { stdio: "ignore" });
        remoteUrl = repo;
        spinner.succeed(chalk.green("Remote origin updated successfully."));
      } else {
        spinner.succeed(chalk.green("Remote origin verified successfully."));
      }
    } catch {
      spinner.text = "Setting new remote origin...";
      await wait();
      execSync(`git remote add origin ${repo}`, { stdio: "ignore" });
      remoteUrl = repo;
      spinner.succeed(chalk.green("Remote origin set successfully."));
    }

    // push
    spinner.start(`Pushing to ${branch}...`);
    await wait(800);
    try {
      execSync(`git push origin ${branch}${force ? " --force" : ""}`, {
        stdio: "ignore",
      });
      spinner.succeed(chalk.green("Code pushed successfully!"));
      showSummary(remoteUrl, branch, message);
    } catch (err) {
      spinner.fail(chalk.red("Push failed."));
      await tryRecovery(remoteUrl, branch, force, spinner);
    }
  } catch (err) {
    spinner.fail(chalk.red("💥 Unexpected error occurred."));
    console.error(chalk.redBright(err.message));
    await logError("git command", err);
  }

  console.log(
    chalk.bold.cyan("✨ ERIX — Because you deserve one-command perfection.\n")
  );
}

// --- Recovery Logic ---
async function tryRecovery(remoteUrl, branch, force, spinner) {
  try {
    spinner.text = "Fetching and rebasing...";
    await wait(500);
    execSync("git fetch origin", { stdio: "ignore" });
    execSync(`git pull origin ${branch} --rebase`, { stdio: "ignore" });

    spinner.text = "Retrying push...";
    await wait(600);
    execSync(`git push origin ${branch}${force ? " --force" : ""}`, {
      stdio: "ignore",
    });

    spinner.succeed(chalk.green("Rebase successful! Push complete."));
    showSummary(remoteUrl, branch);
    return;
  } catch (err) {
    spinner.warn(chalk.yellow("⚠ Could not auto-resolve conflicts."));
    await logError("git rebase conflict", err);
  }

  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmForce",
      message: chalk.yellow(
        "Would you like to force push? (⚠️ Overwrites remote history)"
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
  await wait(500);
  try {
    execSync(`git push origin ${branch} --force`, { stdio: "ignore" });
    forceSpinner.succeed(chalk.green("Forced push successful."));
    showSummary(remoteUrl, branch);
  } catch (err3) {
    forceSpinner.fail(chalk.red("❌ Force push failed."));
    await logError("git force push", err3);
    console.log(chalk.yellow("\nManual recovery:"));
    console.log(chalk.white(`git push -u origin ${branch} --force`));
  }
}

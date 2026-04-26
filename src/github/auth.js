import fs from "fs";
import path from "path";
import os from "os";
import inquirer from "inquirer";
import chalk from "chalk";
import { Octokit } from "@octokit/rest";

const CONFIG_DIR = path.join(os.homedir(), ".erix");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadConfig() {
  ensureConfigDir();
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    } catch (err) {
      return {};
    }
  }
  return {};
}

function saveConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function login() {
  console.log(chalk.bold.cyan("\n🔐 ERIX GitHub Authentication"));
  console.log(chalk.gray("─────────────────────────────────────────────"));

  const config = loadConfig();
  if (config.githubToken) {
    console.log(
      chalk.yellow("You are already authenticated with a GitHub token."),
    );
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Do you want to overwrite your existing token?",
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log(chalk.green("Kept existing token."));
      return;
    }
  }

  console.log(
    chalk.white(
      "To authenticate, please create a Personal Access Token (classic)",
    ),
  );
  console.log(chalk.white("at https://github.com/settings/tokens/new"));
  console.log(chalk.white("Make sure to check the 'repo' scope.\n"));

  const { token } = await inquirer.prompt([
    {
      type: "password",
      name: "token",
      message: chalk.yellow("Paste your GitHub Personal Access Token:"),
      validate: (input) => input.trim().length > 0 || "Token cannot be empty.",
    },
  ]);

  config.githubToken = token.trim();
  saveConfig(config);

  console.log(chalk.green("✅ Successfully saved GitHub token."));
}

export function getOctokit() {
  const config = loadConfig();
  if (!config.githubToken) {
    throw new Error("Not authenticated. Please run 'erix login' first.");
  }
  return new Octokit({ auth: config.githubToken });
}

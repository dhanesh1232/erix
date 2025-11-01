# ⚡ ERIX — Git Automator CLI

[![npm version](https://img.shields.io/npm/v/erix.svg?color=blue&style=flat-square)](https://www.npmjs.com/package/erix)
[![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-blue?style=flat-square)](https://nodejs.org)
[![Made by ECOD](https://img.shields.io/badge/made%20by-ECOD%20🔥-orange?style=flat-square)](https://github.com/dhanesh1232)

> Because you deserve one-command perfection.  
> Simplify your git workflow — commit, push, and sync your code with a single command.

---

## 🚀 Overview

**ERIX** is a smart, elegant Git automation CLI built to remove friction from your daily workflow.  
No more typing `git add .`, `git commit`, and `git push` in sequence. ERIX does it all — from repo linking to smooth commits — _in one swing_.

It’s built for **speed, simplicity, and sanity**.

---

## 💡 Features

✅ Auto-detects Git repositories  
✅ Initializes one if missing  
✅ Auto-commits and pushes with style  
✅ Handles rebases & conflicts gracefully  
✅ Interactive prompts (via `inquirer`)  
✅ Optional force-push (`--f`)  
✅ Beautiful CLI with colors, emojis, and spinners  
✅ Works **globally** or **via NPX**

---

## 🧰 Installation

### 🔸 Option 1 — Global Install (recommended)

```bash
npm install -g erix
```


Then run from anywhere:

```bash
erix git
```

or pass arguments:

```bash
erix git --r https://github.com/yourname/project.git --m "Initial setup"
```

🧠 Example:

```bash
erix git --r https://github.com/ecodrix/erix-cli-demo.git --m "Deploy update"
```


### 🔹 Option 2 — Temporary Use (No Install)

```bash
npx erix git
```

Or inline:

```bash
npx erix git --r https://github.com/yourname/project.git --m "Quick push" --f
```

---

## 🧠 Available Flags

| Flag  | Description    | Example                                |
| ----- | -------------- | -------------------------------------- |
| `--r` | Repository URL | `--r https://github.com/user/repo.git` |
| `--m` | Commit message | `--m "Updated navbar and styles"`      |
| `--f` | Force push     | `--f`                                  |

If no repo URL is provided, ERIX will ask interactively.

---

## 💬 Example Workflow

```bash
# In any project folder
erix git
```

🧩 ERIX will:

1. Detect the current branch
2. Add and commit all changes
3. Set the remote if needed
4. Push automatically
5. Handle conflicts with grace

Output sample:

🚀 ERIX GIT AUTOMATOR v2
─────────────────────────────

✔ 🌐 Enter your repository URL:
https://github.com/yourname/project.git
✅ Code pushed successfully!

💫 Summary
─────────────────────────────
📦 Repo: https://github.com/yourname/project.git
🌿 Branch: main
📝 Commit: Auto commit from ERIX 🚀
⏰ Time: 10/30/2025, 5:02:05 AM
─────────────────────────────
✨ ERIX — Because you deserve one-command perfection.

````

---

## 🧱 Manual Recovery (if needed)

If you hit conflicts or permission issues, ERIX will guide you to run:

```bash
git pull origin main --rebase
git push origin main --force
```

Or follow its intelligent on-screen suggestions.

---

## 🧩 Tech Stack

- **Node.js**
- **Chalk** → Terminal colors
- **Inquirer** → Interactive prompts
- **Ora** → Elegant CLI spinners
- **Child Process API** → Executes Git commands under the hood

---

## 🛠 Development Setup (for contributors)

```bash
git clone https://github.com/yourname/erix-git-cli-automate.git
cd erix
npm install
npm link   # Register globally for dev testing
```

Then test with:

```bash
erix git
```

or:

```bash
npx ./bin/erix.js git
```

---

## 📦 Publish to npm

```bash
npm version patch
npm publish
```

Once published, anyone can run:

```bash
npx erix git
```

---

## 🪄 Author

**Dhanesh**
Building SaaS tools, automation systems, and developer-friendly workflows.
✨ _“Because one command should do it all.”_

[![GitHub](https://img.shields.io/badge/GitHub-@ecodrix-black?style=flat-square&logo=github)](https://github.com/ecodrix)
[![Website](https://img.shields.io/badge/Website-ecodrix.com-blue?style=flat-square)](https://ecodrix.com)

---

## 🧭 License

**MIT License © 2025 ECOD**
Use freely, automate boldly.

---

💭 **Next step:**
Want me to make a **`README_HEADER.svg` banner** (a visual header image with your logo, name, and tagline — like “ERIX ⚡ Git Automator CLI — One Command. Infinite Power.”)?
That’ll make your GitHub page look _premium_ and visually branded.

```

```

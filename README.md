# ⚡ ERIX — Git Automator CLI

> Because you deserve one-command perfection.  
> Simplify your git workflow — commit, push, and sync your code with a single command.

---

## 🚀 Overview

ERIX is a smart and elegant Git automation CLI that saves you from repeating the same commands.  
No more `git add .`, `git commit`, `git push`, or fixing remotes manually.  
ERIX handles all of it — from repository linking to auto-commit and branch handling.

It’s built for **speed, simplicity, and sanity**.

---

## 💡 Features

✅ Auto-detects git repositories  
✅ Initializes a repo if missing  
✅ Auto-commits and pushes with style  
✅ Handles rebases and conflicts gracefully  
✅ Interactive prompts (with `inquirer`)  
✅ Optional force-push  
✅ Beautiful CLI experience with colors and spinners  
✅ Works **globally** or **via NPX** — your choice

---

## 🧰 Installation

### 🔸 Option 1: Global Install (recommended for frequent use)

```bash
npm install -g erix
```

Once installed, run ERIX from anywhere:

```bash
erix git
```

or directly with flags:

```bash
erix git --r https://github.com/yourname/project.git --m "Initial setup"
```

🧠 Example:

```bash
erix git --r https://github.com/ecodrix/erix-cli-demo.git --m "Deploy update"
```

---

### 🔹 Option 2: Temporary Use (no install needed)

If you just want to use it once or test it, run ERIX directly with `npx`:

```bash
npx erix git
```

Or pass arguments inline:

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

If no repo URL is provided, ERIX will ask you interactively.

---

## 💬 Example Workflow

```bash
# In any project folder
erix git
```

🧩 ERIX will:

1. Detect your current branch
2. Add and commit changes
3. Set the remote (if not set)
4. Push the code automatically
5. Handle conflicts or prompt for force push if needed

You’ll see something like this:

```bash
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
```

## 🧱 Manual Recovery (if needed)

In rare cases of deep conflicts or permission issues, ERIX will guide you to run:

```bash
git pull origin main --rebase
git push origin main --force
```

Or just follow the suggestions printed in the terminal.

## 🧩 Tech Stack

- **Node.js**
- **Chalk** → For rich terminal colors
- **Inquirer** → For interactive prompts
- **Ora** → For elegant loading spinners
- **Child Process API** → Executes git commands under the hood

---

## 🛠 Development Setup (for contributors)

Clone the project and run locally:

```bash
git clone https://github.com/yourname/erix.git
cd erix
npm install
npm link   # Register globally for dev testing
```

Then you can run:

```bash
erix git
```

Or test locally via npx:

```bash
npx ./bin/erix.js git
```

---

## 📦 Publish to npm

When ready to release:

```bash
npm version patch
npm publish
```

Then others can instantly use it via:

```bash
npx erix git
```

---

## 🪄 Author

**Dhanesh**
Building SaaS tools, automation systems, and developer-friendly workflows.
✨ _“Because one command should do it all.”_

---

## 🧭 License

MIT License © 2025 ECOD
Use freely, automate boldly.

---

---

Would you like me to make a **badge-rich version** (with shields.io badges for npm version, downloads, license, and author branding) — perfect for your GitHub repo’s front page? It’ll make the README look like a polished open-source project.

# Git Day 1

## 🕐 Duration: 2 Hours | DevOps Batch

## 🎯 What You Will Learn Today

* What Git is and why it matters in DevOps
* Difference between a bare and non-bare repository
* The Git workflow — Working Directory → Staging Area → Local Repo
* Core commands: `init`, `status`, `add`, `commit`, `log`
* Tagging commits with `git tag`
* Navigating history with `git checkout`
* Working with branches using `git branch`

## 💡 Why Git?

Imagine two developers working on the same project.\
Developer A changes `login.py`. Developer B also changes `login.py` at the same time.\
**Without a version control system — one person's work gets overwritten.**

**Git solves this.** It tracks every change made by every person and can merge them intelligently.

Git is used by Google, Amazon, Netflix, and virtually every DevOps team in the world.

## 🗺️ Git Architecture — The Big Picture

Before writing any command, understand the four zones Git works with:

```
┌─────────────────┐     git add      ┌───────────────┐     git commit     ┌───────────────┐
│  Working         │ ──────────────→  │  Staging Area  │ ──────────────→   │  Local Repo   │
│  Directory       │                  │  (Index)       │                   │  (.git folder)│
└─────────────────┘                  └───────────────┘                   └───────────────┘
       ↑                                                                          │
       │                                                                   git push/pull
  (you edit files here)                                                           ↓
                                                                         ┌───────────────┐
                                                                         │  Remote Repo  │
                                                                         │  (GitHub etc) │
                                                                         └───────────────┘
```

| Zone                     | What it is                                    | Analogy                        |
| ------------------------ | --------------------------------------------- | ------------------------------ |
| **Working Directory**    | Where you create and edit files               | Your desk                      |
| **Staging Area (Index)** | Files marked as "ready to save"               | A tray before filing           |
| **Local Repo**           | The `.git` folder — stores all commit history | Filing cabinet on your machine |
| **Remote Repo**          | GitHub / GitLab / Bitbucket                   | Filing cabinet in the cloud    |

> 💡 `git add` → moves files from Working Directory to Staging Area\
> `git commit` → moves files from Staging Area to Local Repo\
> These are **two separate steps** — never confuse them.

## 🗂️ Part 1 – `git init` — Creating a Repository

### Two types of repositories

| Type         | Command           | When to use                                                                 |
| ------------ | ----------------- | --------------------------------------------------------------------------- |
| **Non-bare** | `git init`        | Used by developers — has a working directory where you edit files           |
| **Bare**     | `git init --bare` | Used as a central/remote server — no working directory, stores history only |

### `git init` — Non-Bare Repository

```bash
mkdir myproject
cd myproject
git init
```

**Output:**

```
Initialized empty Git repository in /home/ubuntu/myproject/.git/
```

**What happened:**

* A hidden `.git` folder was created inside your directory
* This folder **is** your repository — it stores everything Git tracks
* Never delete the `.git` folder

```bash
ls -a
# Output: .  ..  .git

ls .git
# Output: HEAD  branches  config  description  hooks  info  objects  refs
```

### `git init --bare` — Bare Repository

```bash
mkdir central-repo.git
cd central-repo.git
git init --bare
```

**Output:**

```
Initialized empty Git repository in /home/ubuntu/central-repo.git/
```

**What is different from non-bare:**

* No working directory — you cannot create or edit files here
* The Git database files exist directly in the folder (no inner `.git` subfolder)
* Used as a **central server** that developers push to and pull from
* GitHub is essentially a hosted bare repository

> 💡 Non-bare = developer's laptop (has files + history)\
> Bare = shared team server (only history, no personal workspace)

## 📊 Part 2 – `git status` — Check the State of Your Repo

```bash
git status
```

`git status` shows you what is happening across your three local zones.

**Three states it can report:**

| Output                          | Meaning                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `Untracked files`               | File exists in working dir but Git doesn't know about it yet  |
| `Changes to be committed`       | File is in staging area — ready for commit                    |
| `Changes not staged for commit` | File was previously tracked, now modified, but not staged yet |

**Example:**

```bash
mkdir demo && cd demo && git init
echo "Hello DevOps" > file1.txt
git status
```

**Output:**

```
On branch master

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file1.txt
```

## ➕ Part 3 – `git add` — Move Files to Staging Area

```bash
git add file1.txt       # Add one specific file
git add .               # Add ALL files in current directory
git add *.txt           # Add all .txt files
```

**After running `git add`:**

```bash
git status
```

**Output:**

```
On branch master

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   file1.txt
```

> 💡 The file is now in the **Staging Area** — it is ready to commit, but NOT committed yet.\
> You can add some files and leave others out — you control exactly what goes into each commit.

## 💾 Part 4 – `git commit` — Save to Local Repository

```bash
git commit -m "Added file1.txt with welcome message"
```

**The `-m` flag:**

* Stands for **message**
* Every commit must have a message describing what changed
* Without `-m`, Git opens vi/nano for you to type the message

**First-time setup (run once if Git asks for your identity):**

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Output after commit:**

```
[master (root-commit) a3f8c2d] Added file1.txt with welcome message
 1 file changed, 1 insertion(+)
 create mode 100644 file1.txt
```

**What is `a3f8c2d`?**

* This is the **commit ID** (also called SHA hash)
* Every commit gets a unique ID automatically
* You will use this ID later with `git checkout`

## 📜 Part 5 – `git log` — View Commit History

```bash
git log
```

**Output:**

```
commit a3f8c2d19e4b7c6a3d2e1f0987654321abcdef12
Author: John Dev <john@company.com>
Date:   Mon Jul 22 10:30:00 2024 +0530

    Added file1.txt with welcome message
```

**Useful variations:**

```bash
git log                    # Full log with author, date, message
git log --oneline          # One line per commit — compact view
git log --oneline --graph  # Visual branch graph
git log -n 5               # Show only last 5 commits
```

**Example with multiple commits:**

```bash
echo "Line 2" >> file1.txt
git add file1.txt
git commit -m "Added line 2 to file1"

echo "file2 content" > file2.txt
git add file2.txt
git commit -m "Created file2.txt"

git log --oneline
```

**Output:**

```
c7d3e1a Created file2.txt
b4f2a8c Added line 2 to file1
a3f8c2d Added file1.txt with welcome message
```

> 💡 The **most recent commit is always at the top** in `git log`.

## 🏷️ Part 6 – `git tag` — Mark Important Commits

Tags are **named labels** you attach to a specific commit.\
Used to mark release points — `v1.0`, `v2.0`, `production-release`.

**Why use tags?**\
Commit IDs like `a3f8c2d` are hard to remember.\
A tag like `v1.0` is readable, meaningful, and permanent.

### Create a Tag

```bash
git tag v1.0              # Tag the current (latest) commit
git tag v1.0 a3f8c2d     # Tag a specific older commit by its ID
```

### List All Tags

```bash
git tag
```

**Output:**

```
v1.0
v1.1
v2.0
```

### Inspect a Tag

```bash
git show v1.0
```

### Real-World Use Case

```
Developer finishes stable version → tags it as v1.0
CI/CD pipeline deploys the v1.0 tag to production
Development continues (v1.1-dev)
Production breaks → rollback to v1.0 using git checkout v1.0
```

> 💡 Tags are created after every release, every hotfix, every major milestone.

## 🌿 Part 7 – `git branch` — Working with Branches

A **branch** is an independent line of development.\
Changes on one branch do not affect other branches.

**Common branch names in real projects:**

| Branch            | Purpose                       |
| ----------------- | ----------------------------- |
| `master` / `main` | Production-ready, stable code |
| `dev`             | Active development            |
| `feature-login`   | One specific new feature      |
| `bugfix-payment`  | A bug being fixed             |
| `staging`         | Pre-production testing        |

### List All Branches

```bash
git branch
```

**Output:**

```
* master
  dev
  feature-login
```

* The `*` shows the branch you are **currently on**
* Default branch is `master` (older Git) or `main` (newer Git)

### Create a New Branch

```bash
git branch dev
git branch feature-login
```

> ⚠️ `git branch <name>` only **creates** the branch.\
> It does **not** switch you to it. Use `git checkout` to switch.

## 🔀 Part 8 – `git checkout` — Switching and Navigating

`git checkout` has three distinct uses. Learn all three.

### Use 1 — Switch to a Branch

```bash
git checkout dev
git checkout feature-login
```

**Output:**

```
Switched to branch 'dev'
```

```bash
git branch
# Output:
  master
* dev       ← asterisk is now here
```

**Shortcut — create AND switch in one command:**

```bash
git checkout -b feature-payment
```

### Use 2 — Switch to a Tag

```bash
git checkout v1.0
```

**Output:**

```
Note: switching to 'v1.0'.

You are in 'detached HEAD' state...
```

**What is detached HEAD state?**

* You are no longer on a branch
* You are viewing the exact snapshot of code as it was at `v1.0`
* You can look at files but any new commits here are temporary
* To return to normal: `git checkout master`

**When would you use this?**\
To check what production code looked like at the time of a specific release.

### Use 3 — Switch to a Specific Commit

```bash
git checkout a3f8c2d
```

Same as switching to a tag — puts you in **detached HEAD** state.\
First use `git log --oneline` to find the commit ID you want.

**When would you use this?**\
When a bug was introduced — go back commit by commit to find exactly where it started.

## 🔁 Full Hands-On Demo — Follow Along

{% stepper %}
{% step %}
## 1. Setup

```bash
mkdir gitdemo && cd gitdemo
git init
git config user.name "DevOps Student"
git config user.email "student@devops.com"
```
{% endstep %}

{% step %}
## 2. First commit

```bash
echo "Version 1 content" > app.txt
git add app.txt
git commit -m "Initial version of app"
```
{% endstep %}

{% step %}
## 3. Tag it

```bash
git tag v1.0
```
{% endstep %}

{% step %}
## 4. Second commit

```bash
echo "Version 2 feature added" >> app.txt
git add app.txt
git commit -m "Added v2 feature"
```
{% endstep %}

{% step %}
## 5. Tag it

```bash
git tag v2.0
```
{% endstep %}

{% step %}
## 6. Third commit

```bash
echo "Version 3 bugfix" >> app.txt
git add app.txt
git commit -m "Fixed bug in v3"
```
{% endstep %}

{% step %}
## 7. View history

```bash
git log --oneline
```
{% endstep %}

{% step %}
## 8. View tags

```bash
git tag
```
{% endstep %}

{% step %}
## 9. Create and list branches

```bash
git branch dev
git branch
```
{% endstep %}

{% step %}
## 10. Switch to dev branch

```bash
git checkout dev
```
{% endstep %}

{% step %}
## 11. Go back to v1.0 tag

```bash
git checkout v1.0
cat app.txt    # Only shows "Version 1 content"
```
{% endstep %}

{% step %}
## 12. Return to master

```bash
git checkout master
cat app.txt    # Shows all 3 lines
```
{% endstep %}
{% endstepper %}

## 💻 Practice Exercises

Try these on your own:

1. Create a new directory, initialize a repo, create 3 files, add and commit each separately with a meaningful message.
2. Run `git log --oneline` to see all commits. Checkout the very first commit using its ID. Verify the files. Return to `master`.
3. Create a tag `v1.0` on commit 1 and `v2.0` on commit 2. List all tags. Checkout `v1.0` and confirm which files are visible.
4. Create two branches: `dev` and `feature-test`. List all branches. Switch between them and run `git branch` each time to confirm.

## 📝 Assignments

Complete these before Day 2:

1. **Full Workflow**
   * Create a project with at least 5 commits
   * Tag commit 3 as `v1.0` and commit 5 as `v2.0`
   * List tags, checkout `v1.0`, confirm the file state
2. **Branch Practice**
   * On the same project, create branches: `main`, `dev`, `staging`
   * List all branches
   * Switch to each one and run `git status` to confirm
3. **Theory — Answer in Your Own Words**
   * What is the difference between `git add` and `git commit`?
   * What is detached HEAD state?
   * What is the difference between a bare and non-bare repository?
   * Why do we use tags instead of just using commit IDs?

## 🔁 Day 1 Quick Reference

| Command                          | What it does                                   |
| -------------------------------- | ---------------------------------------------- |
| `git init`                       | Create a non-bare (working) repository         |
| `git init --bare`                | Create a bare (server/central) repository      |
| `git status`                     | Show state of working dir and staging area     |
| `git add <file>`                 | Move a file to staging area                    |
| `git add .`                      | Move ALL files to staging area                 |
| `git commit -m "msg"`            | Save staged files to local repo with a message |
| `git log`                        | Show full commit history                       |
| `git log --oneline`              | Compact one-line commit history                |
| `git log -n 5`                   | Show last 5 commits                            |
| `git tag <name>`                 | Tag the current commit                         |
| `git tag`                        | List all tags                                  |
| `git show <tag>`                 | Show details of a tag                          |
| `git branch`                     | List all branches                              |
| `git branch <name>`              | Create a new branch                            |
| `git checkout <branch>`          | Switch to a branch                             |
| `git checkout -b <name>`         | Create and switch to a new branch              |
| `git checkout <tag>`             | View code at a specific tag                    |
| `git checkout <commit_id>`       | View code at a specific commit                 |
| `git config --global user.name`  | Set your Git username                          |
| `git config --global user.email` | Set your Git email                             |

## 🎤 Interview Questions

<details>

<summary>1. What is Git? How is it different from GitHub?</summary>

Git is the version control tool. GitHub is a website that hosts Git repositories online.

</details>

<details>

<summary>2. What is the difference between <code>git add</code> and <code>git commit</code>?</summary>

`git add` moves changes to the staging area. `git commit` permanently saves staged changes to the local repository.

</details>

<details>

<summary>3. What is a bare repository?</summary>

A repository with no working directory. Used as a shared central server that developers push to and pull from.

</details>

<details>

<summary>4. What is HEAD in Git?</summary>

HEAD is a pointer to the current commit you are viewing. Normally it points to the latest commit on your current branch.

</details>

<details>

<summary>5. What is detached HEAD state?</summary>

When HEAD points directly to a commit or tag instead of a branch name. Any commits made in this state are temporary.

</details>

<details>

<summary>6. Why do we use branches?</summary>

To isolate features, bug fixes, and experiments from the main codebase — so different developers don't overwrite each other's work.

</details>

<details>

<summary>7. What does <code>git status</code> tell you?</summary>

It shows which files are untracked, staged, or modified since the last commit.

</details>

## 📌 Coming Up – Day 2

Today you worked entirely on your **local machine**.\
Tomorrow we connect to the real world:

* `git clone` — download a remote repository
* `git remote` — link your local repo to GitHub
* `git push` — send your commits to GitHub
* `git pull` — get the latest changes from GitHub
* `git merge` — combine branches together
* `git diff` — see exactly what changed between commits
* **Resolving merge conflicts** — the most important real-world skill

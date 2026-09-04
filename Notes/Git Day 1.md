# 📘 Git – Day 1 Teaching Guide
## 🕐 Duration: 2 Hours | DevOps Batch
### 👨‍🏫 Trainer Reference — Not for Students

---

## 🎯 What Students Will Learn Today

- What Git is and why it is used in DevOps
- Difference between a bare and non-bare repository
- The Git workflow — Working Directory → Staging Area → Local Repo
- Core commands: `init`, `status`, `add`, `commit`, `log`
- Tagging commits with `git tag`
- Navigating history with `git checkout`
- Working with branches using `git branch`

---

## 👨‍🏫 Before Teaching — Open with a Story

Ask students:

> "Two developers are working on the same project. Developer A changes `login.py`. Developer B also changes `login.py` at the same time.
> What happens? Whose changes survive?"

Let students discuss. Then explain:

> "Without a version control system, someone's work gets overwritten.  
> **Git** solves this. It tracks every change made by every person, and can merge them together.  
> Git is the most widely used version control system in the world — used by Google, Amazon, Netflix, and virtually every DevOps team."

---

## 🗺️ Teach the Big Picture First — Git Architecture

**Draw this on the board before writing a single command:**

```
┌─────────────────┐     git add      ┌───────────────┐     git commit     ┌───────────────┐
│  Working         │ ──────────────→  │  Staging Area  │ ──────────────→   │  Local Repo   │
│  Directory       │                  │  (Index)       │                   │  (.git folder)│
└─────────────────┘                  └───────────────┘                   └───────────────┘
       ↑                                                                          │
       │                                                                   git push/pull
       │                                                                          ↓
  (you edit files here)                                                  ┌───────────────┐
                                                                         │  Remote Repo  │
                                                                         │  (GitHub etc) │
                                                                         └───────────────┘
```

Explain each zone clearly:

| Zone | What it is | Analogy |
|------|-----------|---------|
| **Working Directory** | Where you create and edit files | Your desk / workspace |
| **Staging Area (Index)** | Files you've marked as "ready to save" | A tray where you place files before filing |
| **Local Repo** | The `.git` folder — stores all commit history | A filing cabinet on your machine |
| **Remote Repo** | GitHub / GitLab / Bitbucket | A filing cabinet in the cloud |

> 💡 **Key teaching point:** `git add` moves files from Working Directory → Staging Area.  
> `git commit` moves from Staging Area → Local Repo.  
> Students confuse these two steps constantly — be very explicit.

---

## ⏱️ Class Timeline

| Time | Topic |
|------|-------|
| 0:00 – 0:15 | Introduction, Why Git, Architecture diagram |
| 0:15 – 0:30 | `git init`, bare vs non-bare |
| 0:30 – 0:55 | `git status`, `git add`, `git commit`, `git log` |
| 0:55 – 1:15 | `git tag` — tagging commits |
| 1:15 – 1:35 | `git branch` and `git checkout` |
| 1:35 – 1:50 | Live practice (students do it hands-on) |
| 1:50 – 2:00 | Recap, Q&A, Assignments |

---

## 🗂️ Part 1 – `git init` — Creating a Repository (15 min)

### Two types of repositories

| Type | Command | When to use |
|------|---------|-------------|
| **Non-bare** | `git init` | Used by developers — has working directory where you edit files |
| **Bare** | `git init --bare` | Used as a central/remote server — no working directory, only stores history |

---

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

**What happened?**
- A hidden `.git` folder was created
- This folder is the entire Git database for your project
- Never delete the `.git` folder — that is your repository

```bash
ls -a
# Output: .  ..  .git
```

**Ask students:** "What is inside `.git`?"

```bash
ls .git
# Output: HEAD  branches  config  description  hooks  info  objects  refs
```

---

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

**What is different?**
- No working directory — you cannot create or edit files here
- The `.git` folder contents exist directly in the folder
- Used as a **central server** that developers `push` to and `pull` from
- GitHub is essentially a hosted bare repository

> 💡 **Teaching tip:** Explain with analogy — a non-bare repo is like a developer's laptop (has files + history). A bare repo is like a shared server (only history, no personal workspace).

---

## 📊 Part 2 – `git status` — What's Happening in Your Repo (5 min)

```bash
git status
```

`git status` tells you the current state of your three zones.

**Three states it reports:**

| Status shown | What it means |
|-------------|--------------|
| `Untracked files` | File exists in working dir but Git doesn't know about it yet |
| `Changes to be committed` | File is in staging area — ready to commit |
| `Changes not staged for commit` | File was tracked before, now modified, but not yet staged |

**Demo:**

```bash
# Start fresh
mkdir demo && cd demo && git init

# Create a file
echo "Hello DevOps" > file1.txt

# Check status
git status
```

**Output:**
```
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file1.txt
```

---

## ➕ Part 3 – `git add` — Moving to Staging Area (10 min)

```bash
git add file1.txt       # Add one file
git add .               # Add ALL files in current directory
git add *.txt           # Add all .txt files
```

**After `git add`:**

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

> 💡 The file is now in the **Staging Area** — it is ready to be committed, but the commit has NOT happened yet.

**Ask students:** "Can I add some files but not others?"  
Answer: Yes! That's the whole point of staging — you control exactly what goes into each commit.

---

## 💾 Part 4 – `git commit` — Saving to Local Repo (10 min)

```bash
git commit -m "Added file1.txt with welcome message"
```

**The `-m` flag:**
- Stands for **message**
- Every commit must have a message describing what changed
- Without `-m`, Git opens a text editor (vi/nano) for the message

**First-time commit setup (if Git complains):**

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
- This is the **commit ID** (also called SHA hash)
- Uniquely identifies this commit
- Every commit gets a different ID automatically
- You will use this ID with `git checkout` later

---

## 📜 Part 5 – `git log` — View Commit History (10 min)

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

**Useful variations — teach all of these:**

```bash
git log                    # Full log with details
git log --oneline          # One line per commit — compact view
git log --oneline --graph  # Visual branch graph
git log -n 5               # Last 5 commits only
```

**Demo with multiple commits:**

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

> 💡 **Key teaching point:** The most recent commit is always at the TOP.  
> Ask: "How do you go back to a previous commit?" → Lead into `git checkout`.

---

## 🏷️ Part 6 – `git tag` — Marking Important Commits (15 min)

Tags are **named labels** attached to a specific commit.  
Used to mark **releases** — e.g., `v1.0`, `v2.0`, `production-release`.

### Why tags?

Commit IDs like `a3f8c2d` are hard to remember.  
A tag like `v1.0` is human-readable and memorable.

---

### Create a Tag

```bash
git tag v1.0              # Tags the current (latest) commit
git tag v1.0 a3f8c2d     # Tags a specific commit by its ID
```

---

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

---

### Check What Commit a Tag Points To

```bash
git show v1.0
```

---

### DevOps Use Case

```
Developer finishes a stable version → tags it as v1.0
CI/CD pipeline deploys the v1.0 tag to production
Next development starts (v1.1-dev)
If production breaks → rollback to v1.0 using git checkout v1.0
```

> 💡 **Ask students:** "In a company, when would you create a new tag?"  
> Answer: After every release, every hotfix, every milestone.

---

## 🌿 Part 7 – `git branch` — Listing Branches (10 min)

A **branch** is an independent line of development.

Think of it like this:
- `main` / `master` → production-ready code
- `dev` → development work in progress
- `feature-login` → one specific feature being built
- `bugfix-payment` → a bug being fixed

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

- The `*` marks the branch you are **currently on**
- Default branch is `master` (older) or `main` (newer Git versions)

### Create a New Branch

```bash
git branch dev             # Create branch named 'dev'
git branch feature-login   # Create branch named 'feature-login'
```

> 💡 `git branch <name>` only **creates** the branch. It does NOT switch to it.  
> To switch, you use `git checkout` — covered next.

---

## 🔀 Part 8 – `git checkout` — Switching & Navigating (15 min)

`git checkout` is one of the most powerful Git commands.  
It can switch branches, switch to a tag, or go back to a specific commit.

### Three uses — teach all three:

---

### Use 1 — Switch to a Branch

```bash
git checkout dev
git checkout feature-login
```

**Output:**
```
Switched to branch 'dev'
```

**After switching:**
```bash
git branch
# Output:
  master
* dev
```

> 💡 Combined create + switch (shortcut):
> ```bash
> git checkout -b feature-payment
> ```
> Creates and immediately switches to the new branch.

---

### Use 2 — Switch to a Tag

```bash
git checkout v1.0
```

**Output:**
```
Note: switching to 'v1.0'.

You are in 'detached HEAD' state...
```

**What is detached HEAD?**
- You are no longer on a branch
- You are looking at the exact snapshot of code at `v1.0`
- You can look around but any commits here are temporary
- To go back: `git checkout master`

> 💡 **DevOps use case:** Quickly look at what the production code looked like at release `v1.0`.

---

### Use 3 — Switch to a Specific Commit

```bash
git checkout a3f8c2d
```

Same as tag checkout — puts you in **detached HEAD** state at that exact commit.  
Use `git log --oneline` to find the commit ID first.

> 💡 **Ask students:** "When would you go back to a specific commit?"  
> Answer: When investigating a bug — go back to the point before the bug was introduced.

---

## 🔁 Full Workflow Demo — Do This with Students (15 min)

Run this entire sequence live and have students follow along:

```bash
# 1. Setup
mkdir gitdemo && cd gitdemo
git init
git config user.name "DevOps Student"
git config user.email "student@devops.com"

# 2. First commit
echo "Version 1 content" > app.txt
git add app.txt
git commit -m "Initial version of app"

# 3. Tag it
git tag v1.0

# 4. Second commit
echo "Version 2 feature added" >> app.txt
git add app.txt
git commit -m "Added v2 feature"

# 5. Tag it
git tag v2.0

# 6. Third commit
echo "Version 3 bugfix" >> app.txt
git add app.txt
git commit -m "Fixed bug in v3"

# 7. View full history
git log --oneline

# 8. View tags
git tag

# 9. Create a branch
git branch dev

# 10. List branches
git branch

# 11. Switch to the branch
git checkout dev

# 12. Go back to a tag
git checkout v1.0
cat app.txt    # Shows only Version 1 content!

# 13. Return to master
git checkout master
cat app.txt    # Shows all 3 lines
```

---

## 💻 Practice Exercises — Students Do Independently

1. Create a new directory, initialize a Git repo, create 3 files, add and commit each one separately with a meaningful message

2. Use `git log --oneline` to see all commits. Then checkout the very first commit using its commit ID. Look at the files. Come back to `master`.

3. Create a tag `v1.0` on the first commit and `v2.0` on the second. List all tags. Checkout `v1.0` and verify which files exist.

4. Create two branches: `dev` and `feature-test`. List all branches. Switch between them.

---

## 📝 Assignments

1. **Workflow Practice**
   - Create a project with at least 5 commits
   - Tag commit 3 as `v1.0` and commit 5 as `v2.0`
   - List all tags, checkout `v1.0`, confirm file state

2. **Branch Creation**
   - On the same project, create branches: `main`, `dev`, `staging`
   - List all branches
   - Switch to each and run `git status` to confirm

3. **Theory Question — Interview Prep**
   Answer in your own words:
   - What is the difference between `git add` and `git commit`?
   - What is detached HEAD state?
   - What is the difference between a bare and non-bare repository?
   - Why do we use tags in Git?

---

## 🔁 Day 1 Quick Reference

| Command | What it does |
|---------|-------------|
| `git init` | Create a non-bare (working) repository |
| `git init --bare` | Create a bare (server/central) repository |
| `git status` | Show state of working dir, staging area |
| `git add <file>` | Move file to staging area |
| `git add .` | Move ALL files to staging area |
| `git commit -m "msg"` | Save staged files to local repo with message |
| `git log` | Show full commit history |
| `git log --oneline` | Show compact one-line commit history |
| `git tag <name>` | Tag the current commit |
| `git tag` | List all tags |
| `git branch` | List all branches |
| `git branch <name>` | Create a new branch |
| `git checkout <branch>` | Switch to a branch |
| `git checkout <tag>` | View code at a specific tag |
| `git checkout <commit_id>` | View code at a specific commit |
| `git checkout -b <name>` | Create and switch to a new branch |
| `git config --global user.name` | Set your Git username |
| `git config --global user.email` | Set your Git email |

---

## 📌 Coming Up – Day 2 Preview

Tell students:

> "Today you worked entirely on your local machine. Tomorrow we connect to the real world."

- `git clone` — download a remote repository
- `git remote` — link your local repo to GitHub
- `git push` — send your commits to GitHub
- `git pull` — get latest changes from GitHub
- `git merge` — combine branches together
- `git diff` — see what changed between commits
- **Resolving merge conflicts** — the most important real-world skill

---

## 🎤 Common Interview Questions — Mention to Students

> Start planting these early so students are interview-ready:

1. **What is Git? How is it different from GitHub?**
   - Git is the version control tool. GitHub is a website that hosts Git repositories.

2. **What is the difference between `git add` and `git commit`?**
   - `git add` moves changes to staging. `git commit` saves staged changes to the repository permanently.

3. **What is a bare repository?**
   - A repository with no working directory — used as a shared central server.

4. **What is HEAD in Git?**
   - HEAD is a pointer to the current commit you are viewing. Normally it points to the latest commit on your current branch.

5. **What is detached HEAD state?**
   - When HEAD points directly to a commit or tag instead of a branch name.

6. **Why do we use branches?**
   - To isolate features, fixes, and experiments from the main codebase — avoiding conflicts.

7. **What does `git status` show?**
   - It shows which files are untracked, staged, or modified since the last commit.

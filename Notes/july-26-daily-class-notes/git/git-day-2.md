# Git Day 2

***

## 🎯 What You Will Learn Today

* Merging branches with `git merge`
* Understanding and resolving **merge conflicts**
* Undoing mistakes safely with `git revert`
* Hard-resetting history with `git reset --hard`
* Cloning remote repositories with `git clone`
* Pushing commits to remote with `git push`
* Pulling latest changes with `git pull`
* Fetching without merging using `git fetch`
* Rebasing branches with `git rebase`

***

## 🔄 Day 1 Recap — Quick Check

| Concept         | Command                   |
| --------------- | ------------------------- |
| Initialize repo | `git init`                |
| Stage a file    | `git add file`            |
| Commit          | `git commit -m "msg"`     |
| View history    | `git log --oneline`       |
| Create tag      | `git tag v1.0`            |
| Create branch   | `git branch dev`          |
| Switch branch   | `git checkout dev`        |
| Create + switch | `git checkout -b feature` |

***

***

## 🔀 Part 1 – `git merge` — Combining Branches

### Concept

When you finish work on a branch, you merge it back into `master` (or `main`).

```
master:   A --- B --- C
                       \
dev:                    D --- E
```

After merging `dev` into `master`:

```
master:   A --- B --- C ---------- F  (merge commit)
                       \          /
dev:                    D --- E
```

{% hint style="info" %}
You must be **on the branch you want to merge INTO**.

"I am on `master`. I want to bring `dev` changes into me."
{% endhint %}

### Syntax

```bash
git merge branch_name
```

### Live Demo

```bash
# Setup
mkdir mergedemo && cd mergedemo
git init
git config user.name "Your Name"
git config user.email "you@devops.com"

# First commit on master
echo "Master line 1" > master.txt
git add master.txt
git commit -m "Initial commit on master"

# Create dev branch and switch
git checkout -b dev

# Work on dev
echo "Feature from dev" > feature.txt
git add feature.txt
git commit -m "Added feature on dev"

# Switch back to master
git checkout master

# Merge dev into master
git merge dev
```

**Output:**

```
Updating a3f8c2d..b9d4e1c
Fast-forward
 feature.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 feature.txt
```

**Fast-forward merge:**

* Happens when `master` had no new commits since `dev` branched off.
* Git simply moves the master pointer forward — no extra merge commit is created.

***

## ⚠️ Part 2 – Merge Conflicts

### What is a Merge Conflict?

A conflict happens when **two branches edit the same line of the same file**.

Git cannot decide which version to keep — it stops and asks you to decide manually.

### Create a Conflict — Follow Along

```bash
# Fresh repo
mkdir conflictdemo && cd conflictdemo
git init
git config user.name "Your Name"
git config user.email "you@devops.com"

# Initial commit
echo "Line 1: Hello" > app.txt
git add app.txt
git commit -m "Initial app.txt"

# Create dev branch
git checkout -b dev

# Edit app.txt on dev
echo "Line 1: Hello from DEV branch" > app.txt
git add app.txt
git commit -m "Dev branch edit"

# Switch back to master
git checkout master

# Edit the SAME line on master
echo "Line 1: Hello from MASTER branch" > app.txt
git add app.txt
git commit -m "Master branch edit"

# Try to merge
git merge dev
```

**Output:**

```
Auto-merging app.txt
CONFLICT (content): Merge conflict in app.txt
Automatic merge failed; fix conflicts and then commit the result.
```

### How to Identify the Conflict

```bash
git status
```

**Output:**

```
On branch master
You have unmerged paths.

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   app.txt
```

```bash
cat app.txt
```

**Output:**

```
<<<<<<< HEAD
Line 1: Hello from MASTER branch
=======
Line 1: Hello from DEV branch
>>>>>>> dev
```

**Understanding the conflict markers:**

| Marker         | Meaning                                         |
| -------------- | ----------------------------------------------- |
| `<<<<<<< HEAD` | Start of YOUR version (current branch — master) |
| `=======`      | Divider between the two versions                |
| `>>>>>>> dev`  | Start of the INCOMING version (dev branch)      |

### Solution — How to Resolve

{% stepper %}
{% step %}
### Open the file and edit it manually

```bash
vi app.txt
```

Remove ALL conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).

Keep the content you want:

```
Line 1: Hello from both master and dev branches
```
{% endstep %}

{% step %}
### Stage the resolved file

```bash
git add app.txt
```
{% endstep %}

{% step %}
### Complete the merge

```bash
git commit -m "Resolved merge conflict between master and dev"
```
{% endstep %}

{% step %}
### Verify

```bash
git log --oneline
cat app.txt
```
{% endstep %}
{% endstepper %}

{% hint style="info" %}
In VS Code or IntelliJ, conflict markers are highlighted with color buttons (Accept Current / Accept Incoming / Accept Both). But understanding the raw text markers is essential for command-line work and interviews.
{% endhint %}

***

## ↩️ Part 3 – Undoing Commits

### Two ways to undo — important difference

| Command                      | What it does                                       | Safe for pushed branches? |
| ---------------------------- | -------------------------------------------------- | ------------------------- |
| `git revert commit_id`       | Creates a NEW commit that undoes the target commit | ✅ Yes — history preserved |
| `git reset --hard commit_id` | Permanently DELETES commits after the target       | ❌ No — rewrites history   |

### `git revert commit_id` — Safe Undo

```bash
git log --oneline
# c7d3e1a Bug introduced here
# b4f2a8c Good commit
# a3f8c2d Initial commit

git revert c7d3e1a
```

**Output:**

```
[master d9f1a3b] Revert "Bug introduced here"
 1 file changed, 1 deletion(-)
```

```bash
git log --oneline
# d9f1a3b Revert "Bug introduced here"   ← new undo commit on top
# c7d3e1a Bug introduced here            ← original still in history
# b4f2a8c Good commit
# a3f8c2d Initial commit
```

{% hint style="info" %}
`git revert` never deletes anything. It adds a new "undo" commit on top.

This is the safe way to undo on branches already pushed to GitHub.
{% endhint %}

### `git reset --hard commit_id` — Destructive Undo

```bash
git log --oneline
# c7d3e1a Bad commit
# b4f2a8c Good commit
# a3f8c2d Initial commit

git reset --hard b4f2a8c
```

```bash
git log --oneline
# b4f2a8c Good commit     ← c7d3e1a is permanently GONE
# a3f8c2d Initial commit
```

{% hint style="warning" %}
**Warning:** `git reset --hard` permanently destroys commits.

If the branch was already pushed to a shared remote, this will break everyone else's copy.

Use ONLY on local branches that have NOT been pushed yet.

**On shared branches — always use `git revert` instead.**
{% endhint %}

***

## ☁️ Part 4 – Working with Remote Repositories

### What is a Remote?

A remote repository is a copy of your project on a server (GitHub, GitLab, Bitbucket).

**Why use remotes:**

* Multiple developers can share and collaborate on the same codebase.
* Code is backed up even if your laptop is lost.
* CI/CD pipelines are triggered when code is pushed.

### `git clone` — Download a Remote Repository

```bash
git clone https://github.com/username/repo-name.git
```

**What it does:**

* Downloads the full repository — all commits, branches, and tags.
* Creates a local folder with the repo name.
* Automatically sets `origin` as the remote name.

```bash
git clone https://github.com/torvalds/linux.git
cd linux
git log --oneline -5
git branch -a     # List all local and remote branches
```

{% hint style="info" %}
After cloning, `origin` is already configured. You can immediately `push` and `pull`.
{% endhint %}

### `git push` — Send Your Commits to Remote

```bash
git push git_url
# or the standard way:
git push origin master
git push origin dev
```

**First-time push of a new branch:**

```bash
git push -u origin dev
```

`-u` sets the upstream — after this, just `git push` is enough for that branch.

**Typical workflow:**

```bash
echo "New feature" > feature.txt
git add feature.txt
git commit -m "Added feature"
git push origin master
```

{% hint style="warning" %}
If someone else pushed after your last pull, Git will reject your push.

Solution: Run `git pull` first, resolve conflicts, then push again.
{% endhint %}

### `git pull` — Get Latest Changes from Remote

```bash
git pull git_url
# or:
git pull origin master
```

**Internally, `git pull` does two things:**

1. `git fetch` — downloads remote commits
2. `git merge` — merges them into your current branch

**Common daily workflow:**

```bash
# Start of day — get everyone's latest work
git pull origin master

# Do your work
# ... edit files ...

git add .
git commit -m "My today's work"

# End of day — send your work
git push origin master
```

{% hint style="info" %}
**Best practice:** Always `git pull` before starting work. Always `git pull` before `git push`.
{% endhint %}

***

## 🔍 Part 5 – `git fetch` — Download Without Merging

```bash
git fetch
git fetch origin
```

### Difference between `git fetch` and `git pull`

|                            | `git fetch` | `git pull` |
| -------------------------- | ----------- | ---------- |
| Downloads remote commits   | ✅ Yes       | ✅ Yes      |
| Merges into your branch    | ❌ No        | ✅ Yes      |
| Affects your working files | ❌ No        | ✅ Yes      |
| Safe to run anytime        | ✅ Yes       | Depends    |

**After `git fetch`, remote changes are stored in `FETCH_HEAD`:**

```bash
git fetch origin

git log FETCH_HEAD --oneline       # See what was fetched
git diff HEAD FETCH_HEAD            # Compare your code vs fetched
git merge FETCH_HEAD                # Merge when you are ready
```

{% hint style="info" %}
Use `git fetch` when you want to **review** what changed on remote before merging.

It gives you more control than `git pull`.
{% endhint %}

***

## 🧵 Part 6 – `git rebase` — Clean Linear History

### Concept

`git rebase` moves your branch's commits to start from the latest point of another branch.

The result is a clean, straight-line history — no merge commits.

**Before rebase:**

```
master:   A --- B --- C
                \
dev:             D --- E
```

**After `git rebase master` (from dev):**

```
master:   A --- B --- C
                       \
dev:                    D' --- E'
```

D and E are **replayed** on top of C. Commits get new IDs (D → D', E → E').

### Syntax

```bash
git checkout dev
git rebase master
```

### `git merge` vs `git rebase`

|                         | `git merge`                            | `git rebase`                      |
| ----------------------- | -------------------------------------- | --------------------------------- |
| History                 | Keeps full history + adds merge commit | Creates clean linear history      |
| Safe on shared branches | ✅ Yes                                  | ❌ Never rebase a pushed branch    |
| Best for                | Team collaboration                     | Cleaning up before a pull request |

### Demo

```bash
git checkout -b feature
echo "Feature work" > feat.txt
git add feat.txt
git commit -m "Feature commit"

git checkout master
echo "Hotfix on master" > hotfix.txt
git add hotfix.txt
git commit -m "Hotfix on master"

git checkout feature
git rebase master

git log --oneline
```

{% hint style="warning" %}
**Golden rule:** Never rebase a branch that has already been pushed to a shared remote.

It rewrites commit IDs and breaks everyone else's copy of that branch.
{% endhint %}

***

## 💻 Practice Exercises

{% stepper %}
{% step %}
### Create and resolve a merge conflict

Create two branches. Modify the **same line** of the same file on both. Merge → resolve the conflict → commit.

Run `git log --oneline` to verify.
{% endstep %}

{% step %}
### Revert a commit

Make 3 commits. Use `git revert` on the second commit.

Check `git log --oneline` to confirm the undo-commit was added on top.
{% endstep %}

{% step %}
### Reset commit history

Make 3 commits. Use `git reset --hard` to go back to commit 1.

Confirm that commits 2 and 3 are gone from `git log`.
{% endstep %}

{% step %}
### Clone a public repository

Clone a public GitHub repo.

Run `git log --oneline -10`. Run `git branch -a` to see all branches.
{% endstep %}

{% step %}
### Push commits to GitHub

Create a repo on GitHub. Clone it. Make 3 commits. Push them.

Verify on GitHub.
{% endstep %}
{% endstepper %}

***

## 📝 Assignments

{% stepper %}
{% step %}
### Conflict Practice

Create a repo with two branches that conflict on the same file. Resolve the conflict manually.

Show the complete `git log --oneline` after resolution.
{% endstep %}

{% step %}
### Revert vs Reset

* Create 5 commits.
* Use `git revert` on commit 3 — observe `git log`.
* In a fresh repo, use `git reset --hard` to go back to commit 2 — observe `git log`.
* Write down the difference in behaviour you observed.
{% endstep %}

{% step %}
### Remote Workflow

* Create a GitHub repository.
* Clone it locally.
* Make 3 commits.
* Push to GitHub.
* Confirm commits appear on GitHub.
{% endstep %}

{% step %}
### Fetch vs Pull

In your own words, explain when you would use `git fetch` instead of `git pull` and why.
{% endstep %}
{% endstepper %}

***

## 🔁 Day 2 Quick Reference

| Command                        | What it does                                         |
| ------------------------------ | ---------------------------------------------------- |
| `git merge branch_name`        | Merge a branch into your current branch              |
| `git status`                   | After a conflict — shows which files need resolution |
| `git revert commit_id`         | Safely undo a commit by adding a new undo-commit     |
| `git reset --hard commit_id`   | Permanently delete commits after the given point     |
| `git clone https://url`        | Download a full remote repository locally            |
| `git push origin branch`       | Send local commits to the remote                     |
| `git push -u origin branch`    | Push and set upstream tracking                       |
| `git pull origin branch`       | Download + merge remote changes                      |
| `git fetch`                    | Download remote changes without merging              |
| `git log FETCH_HEAD --oneline` | View what was fetched                                |
| `git diff HEAD FETCH_HEAD`     | Compare local vs fetched code                        |
| `git merge FETCH_HEAD`         | Merge fetched code manually                          |
| `git rebase master`            | Replay current branch commits on top of master       |

***

## 🎤 Interview Questions

<details>

<summary><strong>What is a merge conflict and how do you resolve it?</strong></summary>

A conflict occurs when two branches modify the same line of the same file. Git marks the conflict with `<<<<<<<`, `=======`, `>>>>>>>` markers. You manually edit the file to keep the right content, remove the markers, `git add` the file, and `git commit` to complete the merge.

</details>

<details>

<summary><strong>What is the difference between <code>git revert</code> and <code>git reset</code>?</strong></summary>

`git revert` creates a new commit that undoes a previous one — history is preserved, safe for shared branches. `git reset --hard` permanently deletes commits — dangerous on shared branches.

</details>

<details>

<summary><strong>What is the difference between <code>git fetch</code> and <code>git pull</code>?</strong></summary>

`git fetch` downloads remote changes but does NOT merge them. `git pull` = `git fetch` + `git merge`. Use `git fetch` when you want to review changes before merging.

</details>

<details>

<summary><strong>What is <code>git rebase</code> and when should you use it?</strong></summary>

`git rebase` replays your branch commits on top of another branch for a clean linear history. Use it only on local, unshared branches — never rebase a branch that has been pushed.

</details>

<details>

<summary><strong>What does <code>git clone</code> do?</strong></summary>

Downloads the entire remote repository including all commits, branches, and tags to your local machine.

</details>

<details>

<summary><strong>What happens if two developers push to the same branch at the same time?</strong></summary>

The second push is rejected by Git. The second developer must `git pull` first, resolve any conflicts, then push again.

</details>

***

## 📌 Coming Up – Day 3

* `git stash` — save unfinished work temporarily
* `git cherry-pick` — pick a specific commit from another branch
* `.gitignore` — exclude files from tracking
* `git remote add origin` — link an existing local repo to GitHub
* GitHub Pull Requests — the real team workflow
* CI/CD integration — how a push triggers a pipeline

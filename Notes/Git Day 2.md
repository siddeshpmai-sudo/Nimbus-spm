# 📘 Git – Day 2 Teaching Guide
## 🕐 Duration: 2 Hours | DevOps Batch
### 👨‍🏫 Trainer Reference — Not for Students

---

## 🎯 What Students Will Learn Today

- Merging branches with `git merge`
- Understanding and resolving **merge conflicts**
- Undoing mistakes safely with `git revert`
- Hard-resetting history with `git reset --hard`
- Cloning remote repositories with `git clone`
- Pushing commits to remote with `git push`
- Pulling latest changes with `git pull`
- Rebasing branches with `git rebase`
- Fetching without merging using `git fetch`

---

## 👨‍🏫 Before Teaching — Day 1 Recap Check

Ask students:

> "What is the difference between `git add` and `git commit`?"  
> "What happens when you run `git checkout v1.0`?"  
> "What is detached HEAD state?"

Review the Day 1 assignment briefly. Pick 2–3 students.  
Then say:

> "Yesterday everything was local. Today we work with remote repositories — GitHub — and we tackle the most important real-world Git skill: **merge conflicts**."

---

## ⏱️ Class Timeline

| Time | Topic |
|------|-------|
| 0:00 – 0:10 | Day 1 recap + assignment review |
| 0:10 – 0:30 | `git merge` — merging branches |
| 0:30 – 1:00 | Merge conflicts — cause, identify, resolve |
| 1:00 – 1:10 | `git revert` vs `git reset --hard` |
| 1:10 – 1:30 | `git clone`, `git push`, `git pull` |
| 1:30 – 1:45 | `git fetch` and `git rebase` |
| 1:45 – 2:00 | Practice, assignments, recap |

---

## 🔀 Part 1 – `git merge` — Combining Branches (20 min)

### Concept First

Draw this on the board:

```
master:   A --- B --- C
                       \
dev:                    D --- E
```

After merging `dev` into `master`:

```
master:   A --- B --- C --------- F  (merge commit)
                       \         /
dev:                    D --- E
```

> 💡 **Key teaching point:** Always be ON the branch you want to merge INTO.  
> "I am on `master`. I want to bring `dev` into me."

---

### Syntax

```bash
git merge branch_name
```

---

### Live Demo

```bash
# Setup
mkdir mergedemo && cd mergedemo
git init
git config user.name "Trainer"
git config user.email "trainer@devops.com"

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

# Go back to master
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
- Happens when `master` has no new commits since `dev` branched off
- Git simply moves the master pointer forward — no merge commit created

**Ask students:** "When does Git create a merge commit vs do a fast-forward?"  
Answer: A merge commit is created when both branches have diverged (both have new commits).

---

## ⚠️ Part 2 – Merge Conflicts (30 min)

### What is a Merge Conflict?

A conflict happens when **two branches edit the same line of the same file**.  
Git cannot decide which version to keep — it asks YOU to decide.

> 💡 This is the **most important real-world Git skill**. Spend extra time here.

---

### Create a Conflict — Live Demo

```bash
# Setup fresh repo
mkdir conflictdemo && cd conflictdemo
git init
git config user.name "Trainer"
git config user.email "trainer@devops.com"

# Initial commit
echo "Line 1: Hello" > app.txt
git add app.txt
git commit -m "Initial app.txt"

# Create and switch to dev branch
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

# Now try to merge dev into master
git merge dev
```

**Output:**
```
Auto-merging app.txt
CONFLICT (content): Merge conflict in app.txt
Automatic merge failed; fix conflicts and then commit the result.
```

---

### How to Identify the Conflict

```bash
git status
```

**Output:**
```
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   app.txt
```

```bash
cat app.txt
```

**Output — conflict markers:**
```
<<<<<<< HEAD
Line 1: Hello from MASTER branch
=======
Line 1: Hello from DEV branch
>>>>>>> dev
```

**Explain the markers:**

| Marker | Meaning |
|--------|---------|
| `<<<<<<< HEAD` | Start of YOUR version (current branch — master) |
| `=======` | Dividing line between the two versions |
| `>>>>>>> dev` | Start of the INCOMING version (dev branch) |

---

### Solution — How to Resolve

**Step 1:** Open the file and edit it manually.  
Remove the conflict markers. Keep the content you want.

```bash
vi app.txt
```

Edit to:
```
Line 1: Hello from both master and dev branches
```

(Remove all `<<<<<<<`, `=======`, `>>>>>>>` lines completely)

**Step 2:** Stage the resolved file

```bash
git add app.txt
```

**Step 3:** Complete the merge with a commit

```bash
git commit -m "Resolved merge conflict between master and dev"
```

**Step 4:** Verify

```bash
git log --oneline
cat app.txt
```

> 💡 **Teaching tip:** Tell students — "In real projects, you use VS Code or IntelliJ which highlight conflicts in color. But you must understand the raw text markers to debug when tools fail."

---

## ↩️ Part 3 – `git revert` vs `git reset --hard` (10 min)

### When do you need to undo a commit?

- You committed wrong code
- You pushed a bug to production
- You need to go back to a clean state

Two tools — different consequences:

| Command | What it does | Safe for shared repos? |
|---------|-------------|----------------------|
| `git revert` | Creates a NEW commit that undoes a previous one | ✅ Yes — history is preserved |
| `git reset --hard` | Deletes commits permanently — moves HEAD back | ❌ No — rewrites history |

---

### `git revert commit_id` — Safe Undo

```bash
git log --oneline
# Output:
# c7d3e1a Bug introduced here ← we want to undo this
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
# Output:
# d9f1a3b Revert "Bug introduced here"   ← new commit that undoes c7d3e1a
# c7d3e1a Bug introduced here
# b4f2a8c Good commit
# a3f8c2d Initial commit
```

> 💡 `git revert` does not delete anything — it adds a new "undo" commit on top.  
> Safe to use even on branches that have been pushed to GitHub.

---

### `git reset --hard commit_id` — Destructive Undo

```bash
git log --oneline
# Output:
# c7d3e1a Bad commit
# b4f2a8c Good commit
# a3f8c2d Initial commit

git reset --hard b4f2a8c
```

```bash
git log --oneline
# Output:
# b4f2a8c Good commit     ← c7d3e1a is GONE from history
# a3f8c2d Initial commit
```

> ⚠️ **DANGER:** `git reset --hard` permanently deletes commits.  
> If the branch was already pushed, this causes problems for all other developers.  
> Use ONLY on local branches that haven't been shared.  
> **Always prefer `git revert` on shared branches.**

---

## ☁️ Part 4 – Working with Remote Repositories (20 min)

### What is a Remote?

A remote repository is a copy of your project stored on a server — GitHub, GitLab, Bitbucket.

**Why use remotes?**
- Team collaboration — multiple developers share one central repo
- Backup — your code is safe even if your laptop is lost
- CI/CD — pipelines trigger when code is pushed to remote

---

### `git clone` — Download a Remote Repository

```bash
git clone https://github.com/username/repo-name.git
```

**What it does:**
- Downloads the entire repository (all commits, branches, tags)
- Creates a local folder with the repo name
- Automatically sets up `origin` as the remote name pointing to that URL

**Example:**

```bash
git clone https://github.com/torvalds/linux.git
cd linux
git log --oneline -5
```

> 💡 After cloning, you already have `origin` set. No need to run `git remote add`.

---

### `git push` — Send Commits to Remote

```bash
git push git_url
# or more commonly:
git push origin master
git push origin dev
```

**First-time push of a new branch:**

```bash
git push -u origin dev
```

`-u` sets the upstream — after this, just `git push` is enough.

**Full flow:**

```bash
echo "New feature" > feature.txt
git add feature.txt
git commit -m "Added feature"
git push origin master
```

> ⚠️ If someone else pushed first and you haven't pulled, Git will reject your push.  
> Solution: `git pull` first, resolve any conflicts, then push.

---

### `git pull` — Get Latest Changes from Remote

```bash
git pull git_url
# or:
git pull origin master
```

**What it does internally:**  
`git pull` = `git fetch` + `git merge`

It downloads the latest commits from remote AND merges them into your current branch.

**Common scenario:**

```bash
# Developer A pushes new code
# Developer B runs:
git pull origin master
# Now Developer B has the latest code
```

> 💡 **Best practice:** Always `git pull` before you start working each day. Always `git pull` before you `git push`.

---

## 🔄 Part 5 – `git fetch` — Download Without Merging (10 min)

```bash
git fetch
git fetch origin
```

**What is the difference between `git fetch` and `git pull`?**

| | `git fetch` | `git pull` |
|-|------------|-----------|
| Downloads remote commits? | ✅ Yes | ✅ Yes |
| Merges into your branch? | ❌ No | ✅ Yes |
| Safe to run anytime? | ✅ Yes | Depends — can create conflicts |

**After `git fetch`, the remote changes are stored in `FETCH_HEAD`:**

```bash
git fetch origin
git log FETCH_HEAD --oneline     # See what was fetched
git diff HEAD FETCH_HEAD         # Compare your code with fetched code
git merge FETCH_HEAD             # Merge manually when ready
```

> 💡 **When to use `git fetch`:** When you want to SEE what changed on remote before deciding to merge.  
> Senior DevOps engineers prefer `git fetch` over `git pull` for more control.

---

## 🧵 Part 6 – `git rebase` — Clean History (15 min)

### Concept

`git rebase` moves your branch commits to start from the tip of another branch.  
It rewrites history to look like everything happened in a straight line.

**Before rebase:**

```
master:   A --- B --- C
                \
dev:             D --- E
```

**After `git rebase master` (run from dev branch):**

```
master:   A --- B --- C
                       \
dev:                    D' --- E'   (D and E are replayed on top of C)
```

---

### Syntax

```bash
# From the dev branch:
git checkout dev
git rebase master
```

**vs `git merge`:**

| | `git merge` | `git rebase` |
|-|------------|-------------|
| History | Preserves full history, adds merge commit | Creates a clean linear history |
| Safe for shared branches? | ✅ Yes | ❌ Never rebase a pushed branch |
| Use case | Team collaboration | Cleaning up local commits before PR |

**Live Demo:**

```bash
git checkout -b feature
echo "Feature work" > feat.txt
git add feat.txt
git commit -m "Feature commit"

git checkout master
echo "Master hotfix" > hotfix.txt
git add hotfix.txt
git commit -m "Hotfix on master"

git checkout feature
git rebase master

git log --oneline
```

> ⚠️ **Golden rule of rebase:** Never rebase a branch that has been pushed to a shared remote.  
> It rewrites commit IDs — everyone else's copies will conflict.

---

## 💻 Practice Exercises — Students Do Independently

1. Create two branches. Edit the **same line** of the same file on both. Merge → resolve the conflict → commit.

2. Make 3 commits. Revert the second one using `git revert`. Check `git log --oneline` to confirm the undo commit was added.

3. Make 3 commits. Use `git reset --hard` to go back to commit 1. Confirm commits 2 and 3 are gone.

4. Clone any public GitHub repo. Run `git log --oneline -10`. List branches with `git branch -a`.

5. Create a local repo. Push it to GitHub. Pull it on a second terminal/folder. Make a change, push, pull from first folder.

---

## 📝 Assignments

1. **Conflict Practice**
   Create a repo with two branches that conflict on the same file. Resolve the conflict. Show the full `git log --oneline` after resolution.

2. **Revert vs Reset**
   - Create 5 commits
   - Use `git revert` on commit 3
   - Use `git reset --hard` to go back to commit 2
   - Document the difference in `git log` output for both

3. **Remote Workflow**
   - Create a repo on GitHub
   - Clone it locally
   - Make 3 commits locally
   - Push to GitHub
   - Confirm on GitHub that commits are visible

4. **Fetch vs Pull**
   - In your own words, explain when you would choose `git fetch` over `git pull` and why

---

## 🔁 Day 2 Quick Reference

| Command | What it does |
|---------|-------------|
| `git merge branch_name` | Merge a branch into your current branch |
| `git status` | After conflict — shows which files need resolution |
| `git revert commit_id` | Safely undo a commit by adding a new undo-commit |
| `git reset --hard commit_id` | Permanently delete commits after the given ID |
| `git clone https://url` | Download a full remote repository locally |
| `git push origin branch` | Send local commits to the remote repository |
| `git push -u origin branch` | Push and set upstream tracking |
| `git pull origin branch` | Download + merge remote changes into current branch |
| `git fetch` | Download remote changes without merging |
| `git diff HEAD FETCH_HEAD` | Compare local and fetched remote code |
| `git merge FETCH_HEAD` | Merge fetched changes manually |
| `git rebase master` | Replay current branch commits on top of master |

---

## 📌 Coming Up – Day 3

- `git stash` — temporarily save unfinished work
- `git cherry-pick` — pick a specific commit from another branch
- `.gitignore` — exclude files from tracking
- `git remote add origin` — linking an existing repo to GitHub
- GitHub Pull Requests — the team workflow
- CI/CD integration with Git — how push triggers pipelines

---

## 🎤 Interview Questions — Plant These Today

1. **What is a merge conflict and how do you resolve it?**
   When two branches edit the same line — Git cannot auto-decide. Open the file, remove conflict markers, keep desired content, `git add`, `git commit`.

2. **What is the difference between `git revert` and `git reset`?**
   `git revert` adds a new undo-commit (safe, preserves history). `git reset --hard` deletes commits permanently (dangerous on shared branches).

3. **What is the difference between `git fetch` and `git pull`?**
   `git fetch` downloads remote changes but does not merge. `git pull` = fetch + merge.

4. **What is `git rebase` and when should you use it?**
   Replays branch commits on top of another branch for a clean linear history. Use only on local, unshared branches.

5. **What does `git clone` do?**
   Downloads the entire remote repository including all history, branches, and tags.

6. **What happens if two developers push to the same branch at the same time?**
   The second push is rejected. The second developer must `git pull` first, resolve any conflicts, then push again.

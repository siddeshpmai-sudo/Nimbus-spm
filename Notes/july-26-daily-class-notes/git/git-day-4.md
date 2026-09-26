# Git Day 4

## 🎯 What You Will Learn Today

* `git cherry-pick` — copy a specific commit to another branch
* `git squash` — combine multiple messy commits into one clean commit
* `git stash` / `git stash pop` — park unfinished work and come back to it
* **Branching Strategy** — how real teams structure their Git branches
* **Git Hooks** — automate quality checks on every commit

***

## 💡 Scenario

You are working on a feature — upgrading the nginx image version in your ReplicaSet. Halfway through, your manager calls:

> _"Production is down. Scale down the replicas IMMEDIATELY."_

Your feature code is half-done and not ready to commit. You can't just leave it there and switch branches.

**This is exactly what `git stash` solves.**

***

***

## 🔄 Day 3 Recap — Quick Check

| Command                  | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `git revert <id>`        | Safely undo a commit — adds undo-commit on top |
| `git reset --hard <id>`  | Permanently delete commits (local only)        |
| `git merge <branch>`     | Combine branches                               |
| `git push origin master` | Send commits to GitHub                         |
| `git pull origin master` | Get latest from GitHub                         |
| `git fetch`              | Download without merging                       |
| `git rebase master`      | Replay commits on top of master                |

***

## 🍒 Part 1 – `git cherry-pick`

### What is it?

`git cherry-pick` copies **one specific commit** from any branch and applies it to your current branch.

**Real scenario:**\
A security patch was committed on the `dev` branch. You need that fix on `master` immediately — but `dev` has many other changes that aren't ready for production.

**Solution:** Cherry-pick only the security patch commit.

```
dev:     A --- B --- C (security fix) --- D --- E
                     |
master:  X --- Y --- (copy of C only) --- Z
```

Only commit `C` is copied. `D` and `E` stay on `dev`.

### Syntax

```bash
git cherry-pick <commit_id>                  # Pick one commit
git cherry-pick <commit_id1> <commit_id2>    # Pick multiple commits
```

### Exercise — Cherry-Pick a Security Patch

{% stepper %}
{% step %}
## Setup

```bash
mkdir cherry-demo && cd cherry-demo
git init
git config user.name "Your Name"
git config user.email "you@devops.com"

cat > replicaset.yaml << 'EOF'
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: webapp-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nginx:1.19
        ports:
        - containerPort: 80
EOF
git add replicaset.yaml
git commit -m "Initial ReplicaSet"
```
{% endstep %}

{% step %}
## Create dev branch with 3 commits

```bash
git checkout -b dev

# Commit 1 — scale up
sed -i 's/replicas: 3/replicas: 5/' replicaset.yaml
git add replicaset.yaml
git commit -m "Dev: Scale to 5 replicas"

# Commit 2 — security patch (this is the one we want)
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
git add replicaset.yaml
git commit -m "Dev: Upgrade to nginx:1.21 - security patch"

# Commit 3 — experimental (do NOT want on master)
sed -i 's/replicas: 5/replicas: 20/' replicaset.yaml
git add replicaset.yaml
git commit -m "Dev: Scale to 20 - load test experiment"

git log --oneline
```

**Note the commit ID of the security patch** (second commit).
{% endstep %}

{% step %}
## Cherry-pick onto master

```bash
git checkout master
git cherry-pick <security_patch_commit_id>
```
{% endstep %}

{% step %}
## Verify

```bash
git log --oneline
# Only the security patch appears — NOT the scale-20 experiment

grep "image" replicaset.yaml
# image: nginx:1.21  ✓ (security patch applied)

grep "replicas" replicaset.yaml
# replicas: 3  ✓ (not 20 — experiment NOT brought over)
```

{% hint style="info" %}
Cherry-pick creates a **new commit with a new ID** on the target branch.

The original commit on `dev` is untouched.
{% endhint %}
{% endstep %}
{% endstepper %}

***

## 🗜️ Part 2 – `git squash` — Clean Up Commit History

### What is it?

Squashing **combines multiple commits into one clean commit**.

Before merging a feature branch to `master`, clean up your messy commit history:

```
Before squash:
f5e4d3c fix again oops
e4d3c2b image upgrade
d3c2b1a fix typo
c2b1a0f WIP scale up

After squash:
a9b8c7d Scale replicas to 5 and upgrade image to nginx:1.21
```

{% hint style="warning" %}
There is no standalone `git squash` command.

Squashing is done using **interactive rebase**: `git rebase -i`
{% endhint %}

### Syntax

```bash
git rebase -i HEAD~N    # Squash the last N commits interactively
```

### Exercise — Squash 4 Messy Commits into 1

{% stepper %}
{% step %}
## Create messy commit history

```bash
mkdir squash-demo && cd squash-demo
git init
git config user.name "Your Name"
git config user.email "you@devops.com"

echo "replicas: 3" > replicaset.yaml
git add . && git commit -m "Initial"

echo "replicas: 5" > replicaset.yaml
git add . && git commit -m "WIP scale up"

echo "replicas: 5 # fix" > replicaset.yaml
git add . && git commit -m "fix typo"

echo "image: nginx:1.21" >> replicaset.yaml
git add . && git commit -m "image upgrade"

echo "image: nginx:1.21 # tested" >> replicaset.yaml
git add . && git commit -m "fix again oops"

git log --oneline
```
{% endstep %}

{% step %}
## Start interactive rebase

```bash
git rebase -i HEAD~4
```

Git opens an editor showing:

```
pick c2b1a0f WIP scale up
pick d3c2b1a fix typo
pick e4d3c2b image upgrade
pick f5e4d3c fix again oops
```
{% endstep %}

{% step %}
## Change `pick` to `squash` on lines 2, 3, and 4

```
pick c2b1a0f WIP scale up
squash d3c2b1a fix typo
squash e4d3c2b image upgrade
squash f5e4d3c fix again oops
```

Save and close (`:wq` in vim).
{% endstep %}

{% step %}
## Write a clean commit message

Git opens another editor. Delete everything and write:

```
Scale replicas to 5 and upgrade image to nginx:1.21
```

Save and close.
{% endstep %}

{% step %}
## Verify

```bash
git log --oneline
```

```
a9b8c7d Scale replicas to 5 and upgrade image to nginx:1.21
b1a0f9e Initial
```

4 messy commits → 1 clean commit. ✅

{% hint style="warning" %}
Only squash commits that have **not yet been pushed** to a shared remote.

Squashing rewrites history — pushing squashed commits to a shared branch will break teammates' copies.
{% endhint %}
{% endstep %}
{% endstepper %}

***

## 📦 Part 3 – `git stash` + `git stash pop`

### What is it?

`git stash` temporarily saves your **uncommitted changes** to a hidden area and gives you a clean working directory.

`git stash pop` restores those changes when you are ready to continue.

### Key Commands

```bash
git stash                    # Save current uncommitted changes
git stash -m "description"   # Save with a descriptive label
git stash list               # List all stashes
git stash pop                # Restore latest stash and delete it from the list
git stash apply              # Restore latest stash but KEEP it in the list
git stash drop               # Delete a stash without restoring
git stash clear              # Delete ALL stashes
```

### Exercise — Stash Your Work and Fix a Bug

{% stepper %}
{% step %}
## Setup

```bash
mkdir stash-demo && cd stash-demo
git init
git config user.name "Your Name"
git config user.email "you@devops.com"

cat > replicaset.yaml << 'EOF'
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: webapp-rs
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: webapp
        image: nginx:1.19
EOF
git add replicaset.yaml
git commit -m "Initial ReplicaSet"
```
{% endstep %}

{% step %}
## Start your feature work

```bash
# You are upgrading the image — work in progress
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
echo "# WIP: adding resource limits next" >> replicaset.yaml

git status
# modified: replicaset.yaml  ← not ready to commit
```

**Urgent call from manager — scale down replicas now!**
{% endstep %}

{% step %}
## Stash your unfinished work

```bash
git stash -m "WIP: image upgrade and resource limits"

git status
# nothing to commit, working tree clean ✓
```
{% endstep %}

{% step %}
## Fix the production issue

```bash
git checkout -b hotfix
sed -i 's/replicas: 3/replicas: 1/' replicaset.yaml
git add replicaset.yaml
git commit -m "HOTFIX: Emergency scale down to 1 replica"
git checkout master
git merge hotfix
git log --oneline
```
{% endstep %}

{% step %}
## Return to your feature work

```bash
git stash list
# stash@{0}: WIP: image upgrade and resource limits

git stash pop

git status
# modified: replicaset.yaml  ← your half-done work is back ✓
```

Continue your feature work from where you left off.
{% endstep %}
{% endstepper %}

### `stash pop` vs `stash apply`

| Command           | Restores work? | Keeps stash in list?         |
| ----------------- | -------------- | ---------------------------- |
| `git stash pop`   | ✅ Yes          | ❌ No — removed after restore |
| `git stash apply` | ✅ Yes          | ✅ Yes — stays in list        |

Use `apply` when you want to restore the same stash on multiple branches.

***

## 🌿 Part 4 – Branching Strategy

### What is a Branching Strategy?

A **team agreement** on how Git branches are created, named, and merged.

Without one, different developers do things differently and the repo becomes chaotic.

### Strategy 1 — GitFlow

**Best for:** Large teams, scheduled releases, enterprise products

| Branch      | Purpose                                  |
| ----------- | ---------------------------------------- |
| `main`      | Production-ready code — always stable    |
| `develop`   | Active development — features merge here |
| `feature/*` | One branch per new feature               |
| `release/*` | Pre-release testing and minor fixes      |
| `hotfix/*`  | Emergency production fixes               |

**Flow:**

```
1. Branch from develop:    git checkout -b feature/upgrade-image develop
2. Work on feature
3. Merge back to develop:  git merge feature/upgrade-image
4. Create release branch:  git checkout -b release/v1.1 develop
5. Test + fix minor bugs on release
6. Merge to main:          git merge release/v1.1
7. Tag:                    git tag v1.1
8. Merge back to develop:  git merge release/v1.1
```

### Strategy 2 — GitHub Flow

**Best for:** Small teams, continuous deployment, SaaS products

**Simple rules:**

{% stepper %}
{% step %}
## `main` is always deployable
{% endstep %}

{% step %}
## Create a branch for any new work
{% endstep %}

{% step %}
## Open a Pull Request
{% endstep %}

{% step %}
## Review + tests pass
{% endstep %}

{% step %}
## Merge to `main`
{% endstep %}

{% step %}
## Deploy immediately
{% endstep %}
{% endstepper %}

```
main         ──────────────────────────────────▶
               ↑ feature/login    ↑ bugfix/api
feature/*    ──────────           ────────
```

{% hint style="info" %}
GitHub Flow is simpler than GitFlow and works well for most teams.
{% endhint %}

### Strategy 3 — Trunk-Based Development

**Best for:** High-frequency deployment teams (Netflix, Google style)

* All developers push to `main` directly
* Feature flags control what users see
* CI/CD pipeline runs on every commit
* No long-lived branches

### Comparison

|               | GitFlow                | GitHub Flow    | Trunk-Based        |
| ------------- | ---------------------- | -------------- | ------------------ |
| Branch count  | Many                   | Few            | Minimal            |
| Best for      | Enterprise / versioned | SaaS / startup | Elite / high-speed |
| Release style | Scheduled              | Continuous     | Continuous         |
| Complexity    | High                   | Low            | Medium             |

### GitFlow Exercise — Follow Along

```bash
mkdir gitflow-demo && cd gitflow-demo
git init
git config user.name "Your Name"
git config user.email "you@devops.com"

# v1.0 on main
cat > replicaset.yaml << 'EOF'
apiVersion: apps/v1
kind: ReplicaSet
spec:
  replicas: 3
  template:
    spec:
      containers:
      - image: nginx:1.19
EOF
git add replicaset.yaml && git commit -m "v1.0 - Initial production"
git tag v1.0

# Create develop
git checkout -b develop

# Create feature branch from develop
git checkout -b feature/upgrade-image
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
git add replicaset.yaml && git commit -m "Feature: Upgrade to nginx:1.21"

# Merge feature into develop
git checkout develop
git merge feature/upgrade-image --no-ff -m "Merge feature/upgrade-image"

# Create release branch
git checkout -b release/v1.1
echo "# Release v1.1 tested" >> replicaset.yaml
git add replicaset.yaml && git commit -m "Release prep v1.1"

# Merge release to main
git checkout main
git merge release/v1.1 --no-ff -m "Release v1.1 to production"
git tag v1.1

git log --oneline --graph --all
```

***

## 🪝 Part 5 – Git Hooks

### What are Git Hooks?

Git Hooks are **shell scripts that run automatically** at specific points in the Git workflow.

They live in: `.git/hooks/`

| Hook          | Runs when                    | Can abort?     |
| ------------- | ---------------------------- | -------------- |
| `pre-commit`  | Before a commit is created   | ✅ Yes (exit 1) |
| `post-commit` | After a commit is created    | ❌ No           |
| `pre-push`    | Before `git push`            | ✅ Yes          |
| `commit-msg`  | When commit message is typed | ✅ Yes          |

{% hint style="info" %}
Hooks are NOT tracked by Git — they live in `.git/hooks/` which is not committed.

To share hooks with your team, store them in a `scripts/hooks/` folder and document how to copy them.
{% endhint %}

### `pre-commit` Hook — Block Bad Commits

Runs BEFORE the commit is saved. If the script exits with a non-zero code → commit is aborted.

#### Exercise — Block dangerous YAML values

{% stepper %}
{% step %}
## Set up the repository

```bash
mkdir hooks-demo && cd hooks-demo
git init

cat > replicaset.yaml << 'EOF'
apiVersion: apps/v1
kind: ReplicaSet
spec:
  replicas: 3
  template:
    spec:
      containers:
      - image: nginx:1.19
EOF
git add replicaset.yaml
git commit -m "Initial ReplicaSet"
```
{% endstep %}

{% step %}
## Create the pre-commit hook

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Running pre-commit checks..."

# Rule 1: Reject if replicas is 0
if grep -q "replicas: 0" replicaset.yaml 2>/dev/null; then
    echo "❌ ERROR: replicas cannot be 0 - commit rejected!"
    exit 1
fi

# Rule 2: Reject broken image tags
if grep -q "image:.*BROKEN" replicaset.yaml 2>/dev/null; then
    echo "❌ ERROR: Image tag 'BROKEN' is not allowed - commit rejected!"
    exit 1
fi

# Rule 3: Reject 'latest' image tags (unpinned versions are dangerous)
if grep -q "image:.*:latest" replicaset.yaml 2>/dev/null; then
    echo "❌ ERROR: 'latest' tag is not allowed - always pin a version!"
    exit 1
fi

echo "✅ All checks passed!"
exit 0
EOF

chmod +x .git/hooks/pre-commit
```
{% endstep %}

{% step %}
## Test rejection with `replicas: 0`

```bash
sed -i 's/replicas: 3/replicas: 0/' replicaset.yaml
git add replicaset.yaml
git commit -m "Set replicas to 0"
```

```
🔍 Running pre-commit checks...
❌ ERROR: replicas cannot be 0 - commit rejected!
```
{% endstep %}

{% step %}
## Fix and commit successfully

```bash
sed -i 's/replicas: 0/replicas: 3/' replicaset.yaml
git add replicaset.yaml
git commit -m "Restored replicas to 3"
```

```
🔍 Running pre-commit checks...
✅ All checks passed!
[master a1b2c3d] Restored replicas to 3
```
{% endstep %}

{% step %}
## Test rejection with the `latest` tag

```bash
sed -i 's/image: nginx:1.19/image: nginx:latest/' replicaset.yaml
git add replicaset.yaml
git commit -m "Use latest tag"
```

```
🔍 Running pre-commit checks...
❌ ERROR: 'latest' tag is not allowed - always pin a version!
```
{% endstep %}
{% endstepper %}

### `post-commit` Hook — Log Every Commit

Runs AFTER the commit is created. Cannot abort the commit.

```bash
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
COMMIT_ID=$(git log -1 --format="%H")
COMMIT_MSG=$(git log -1 --format="%s")
AUTHOR=$(git log -1 --format="%an")
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "[$TIMESTAMP] COMMIT | Author: $AUTHOR | ID: ${COMMIT_ID:0:7} | Msg: $COMMIT_MSG" >> ~/git-commit-log.txt
echo "📝 Commit logged."
EOF

chmod +x .git/hooks/post-commit
```

**Test it:**

```bash
echo "# verified" >> replicaset.yaml
git add replicaset.yaml
git commit -m "Add verification comment"

cat ~/git-commit-log.txt
```

**Output:**

```
[2024-07-28 23:30:00] COMMIT | Author: Your Name | ID: a1b2c3d | Msg: Add verification comment
```

***

## 💻 Practice Exercises

1. **Cherry-pick:** Create `dev` branch with 3 commits. Cherry-pick only the middle commit to `master`. Verify with `git log --oneline` on both branches.
2. **Squash:** Make 5 commits with silly names ("oops", "WIP", "fix fix fix"). Squash them all into 1 clean commit.
3. **Stash:** Half-complete a change to `replicaset.yaml`. Stash it. Create a hotfix branch and make a commit. Pop the stash. Continue your work.
4. **Hooks:** Write a pre-commit hook that rejects any file containing the word `password` (prevents secret leaks).

***

## 📝 Assignments

1. **Cherry-pick challenge:** Create 3 branches with 3 commits each. Cherry-pick 1 commit from each branch into `master`. Show the final `git log --oneline` of `master`.
2. **Squash practice:** Clone your Day 3 repo. Create 6 messy commits. Squash them all into 1 well-named commit.
3. **Branching strategy design:** Design the branching strategy for a team of 5 developers building a web app. Write it as a markdown file with branch names, rules, and the merge process.
4. **Hook challenge:** Write a `pre-commit` hook that:
   * Rejects commits where `replicas` is less than 1
   * Rejects commits where image tag is `latest`
   * Logs every rejected commit to `rejected-commits.log`

***

## 🔁 Day 4 Quick Reference

| Command                          | What it does                              |
| -------------------------------- | ----------------------------------------- |
| `git cherry-pick <id>`           | Copy one commit to current branch         |
| `git rebase -i HEAD~N`           | Interactive squash of last N commits      |
| `git stash`                      | Save uncommitted changes temporarily      |
| `git stash -m "label"`           | Save with a descriptive label             |
| `git stash list`                 | List all stashes                          |
| `git stash pop`                  | Restore latest stash and remove from list |
| `git stash apply`                | Restore but keep in list                  |
| `git stash clear`                | Delete all stashes                        |
| `chmod +x .git/hooks/pre-commit` | Make the hook executable                  |

***

## 🎤 Interview Questions

<details>

<summary><strong>What is <code>git cherry-pick</code>?</strong></summary>

Copies a specific commit from one branch to another. Used when you need one fix from `dev` on `master` without a full merge.

</details>

<details>

<summary><strong>What is squashing commits?</strong></summary>

Combining multiple commits into one using `git rebase -i`. Keeps `git log` clean before merging to shared branches.

</details>

<details>

<summary><strong>What is <code>git stash</code> and when would you use it?</strong></summary>

Temporarily saves uncommitted changes so you can switch context. Used when an urgent task interrupts your in-progress work.

</details>

<details>

<summary><strong>Name two branching strategies and compare them.</strong></summary>

GitFlow — multiple long-lived branches, used for scheduled releases. GitHub Flow — simple, `main` + feature branches, continuous deployment.

</details>

<details>

<summary><strong>What is a Git hook? Give an example.</strong></summary>

A shell script in `.git/hooks/` that runs at Git lifecycle events. Example: a `pre-commit` hook that rejects YAML files with `replicas: 0` or secret keywords.

</details>

<details>

<summary><strong>How do you prevent developers from committing secrets to Git?</strong></summary>

Write a `pre-commit` hook that scans staged files for keywords like `password`, `secret`, `API_KEY`. If found, `exit 1` aborts the commit.

</details>

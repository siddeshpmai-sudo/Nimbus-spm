# 📘 Git – Day 4 Teaching Guide
## 🕐 Duration: 2 Hours | DevOps Batch
### 👨‍🏫 Trainer Reference — Not for Students

---

## 🎯 What Students Will Learn Today

- `git cherry-pick` — copy a specific commit to another branch
- `git squash` — combine multiple commits into one clean commit
- `git stash` / `git stash pop` — temporarily shelve unfinished work
- **Branching Strategy** — GitFlow, GitHub Flow, Trunk-based development
- **Git Hooks** — automate actions on `pre-commit` and `post-commit` events

---

## 👨‍🏫 Before Teaching — Open with a Real Scenario

Ask students:

> "You are working on a feature. Halfway through, your manager says —  
> 'Stop. There's a critical production bug. Fix it NOW.'  
> But your feature code is half-done and broken. What do you do?"

Let students think. Most say: "Create a new branch."  
Ask: "But what about the half-done files in your working directory?"

> **That's exactly what `git stash` is for.**  
> You park your unfinished work, fix the bug, then come back to it.

---

## ⏱️ Class Timeline

| Time | Topic |
|------|-------|
| 0:00 – 0:10 | Recap Day 3 + Opening scenario |
| 0:10 – 0:30 | `git cherry-pick` |
| 0:30 – 0:50 | `git squash` (interactive rebase) |
| 0:50 – 1:10 | `git stash` + `git stash pop` |
| 1:10 – 1:35 | Branching Strategy |
| 1:35 – 2:00 | Git Hooks (pre-commit + post-commit) |

---

## 🍒 Part 1 – `git cherry-pick` (20 min)

### Concept

`git cherry-pick` copies **one specific commit** from any branch and applies it to your current branch.

**When to use it:**
- A bug fix was committed on `dev` — you need that fix on `master` right now without merging all of `dev`
- A useful feature commit exists on one branch — you need just that one commit elsewhere
- Hotfix from one branch needs to go to multiple branches

### Architecture

```
dev:     A --- B --- C(bugfix) --- D --- E
                      |
master:  X --- Y ---  (cherry-pick C) --- Z
```

Only commit `C` is copied to master. `D` and `E` are NOT brought over.

---

### Syntax

```bash
git cherry-pick <commit_id>
git cherry-pick <commit_id1> <commit_id2>    # Pick multiple commits
git cherry-pick <id1>..<id2>                  # Pick a range
```

---

### Live Demo — Use ReplicaSet YAML

```bash
# Setup two branches
mkdir cherry-demo && cd cherry-demo
git init
git config user.name "Trainer"
git config user.email "trainer@devops.com"

# Base commit on master
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

# Create dev branch with multiple commits
git checkout -b dev

# Commit 1 on dev — scale up
sed -i 's/replicas: 3/replicas: 5/' replicaset.yaml
git add replicaset.yaml
git commit -m "Dev: Scale to 5 replicas"

# Commit 2 on dev — upgrade image (the one we want)
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
git add replicaset.yaml
git commit -m "Dev: Upgrade to nginx:1.21 - security patch"

# Commit 3 on dev — experimental change (we DON'T want on master)
sed -i 's/replicas: 5/replicas: 20/' replicaset.yaml
git add replicaset.yaml
git commit -m "Dev: Scale to 20 - load test experiment"

# View dev log
git log --oneline
```

**Output on dev:**
```
d3c2b1a Dev: Scale to 20 - load test experiment
c2b1a0f Dev: Upgrade to nginx:1.21 - security patch   ← we want THIS one
b1a0f9e Dev: Scale to 5 replicas
a0f9e8d Initial ReplicaSet
```

```bash
# Copy the commit ID of the security patch
# Switch to master
git checkout master

# Cherry-pick ONLY the security patch
git cherry-pick c2b1a0f
```

**Output:**
```
[master e4d3c2b] Dev: Upgrade to nginx:1.21 - security patch
 1 file changed, 1 insertion(+), 1 deletion(-)
```

```bash
# Verify master has the fix but NOT the experimental change
git log --oneline
grep "image" replicaset.yaml      # nginx:1.21 ✓
grep "replicas" replicaset.yaml   # replicas: 3 (original) ✓ — not 20
```

> 💡 **Key point:** Cherry-pick creates a **new commit** with a new ID — it doesn't move the original.  
> The original commit stays on `dev`. A copy exists on `master`.

> 💡 **Ask students:** "What happens to the new commit ID?"  
> Answer: It gets a new SHA. Same change, new identity.

---

## 🗜️ Part 2 – `git squash` — Clean Up Commit History (20 min)

### Concept

Squashing **combines multiple commits into one**.  
Used to clean up messy "WIP", "fix typo", "another fix" commits before merging to `master`.

> 💡 There is NO standalone `git squash` command.  
> Squashing is done through **interactive rebase**: `git rebase -i`

### When to use it:
- Before opening a Pull Request — clean up your 12 "WIP" commits into 1 meaningful commit
- To make `git log` readable for the team

---

### Syntax

```bash
git rebase -i HEAD~N    # Interactively squash last N commits
```

---

### Live Demo

```bash
mkdir squash-demo && cd squash-demo
git init
git config user.name "Trainer"
git config user.email "trainer@devops.com"

# Create messy commit history (realistic)
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

**Output (messy history):**
```
f5e4d3c fix again oops
e4d3c2b image upgrade
d3c2b1a fix typo
c2b1a0f WIP scale up
b1a0f9e Initial
```

```bash
# Squash the last 4 commits into 1
git rebase -i HEAD~4
```

Git opens an editor with:

```
pick c2b1a0f WIP scale up
pick d3c2b1a fix typo
pick e4d3c2b image upgrade
pick f5e4d3c fix again oops
```

**Teach students how to edit it:**
- Change `pick` to `squash` (or `s`) on lines 2, 3, 4
- Keep `pick` on line 1 (the first commit is the base)

```
pick c2b1a0f WIP scale up
squash d3c2b1a fix typo
squash e4d3c2b image upgrade
squash f5e4d3c fix again oops
```

Save and close. Git opens another editor for the combined commit message.  
Replace everything with one clean message:

```
Scale up replicas to 5 and upgrade image to nginx:1.21
```

Save and close.

```bash
git log --oneline
```

**Output (clean history):**
```
a9b8c7d Scale up replicas to 5 and upgrade image to nginx:1.21
b1a0f9e Initial
```

> 💡 **Ask:** "When should you squash and when should you not?"  
> Squash BEFORE merging to shared branches.  
> Never squash commits that have already been pushed to a shared remote.

---

## 📦 Part 3 – `git stash` + `git stash pop` (20 min)

### Concept

`git stash` **temporarily saves your uncommitted changes** and gives you a clean working directory.  
`git stash pop` **restores** those changes when you're ready to continue.

Think of it as: "Put work in a drawer. Do something else. Open the drawer and continue."

---

### Syntax

```bash
git stash                  # Save current changes
git stash list             # See all stashes
git stash pop              # Restore the latest stash and remove it
git stash apply            # Restore but KEEP the stash in the list
git stash drop             # Delete a stash without applying
git stash clear            # Delete ALL stashes
git stash -m "message"     # Save with a label
```

---

### Live Demo

```bash
mkdir stash-demo && cd stash-demo
git init
git config user.name "Trainer"
git config user.email "trainer@devops.com"

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

# Start working on a feature — half done
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
echo "# WIP: adding resource limits" >> replicaset.yaml
```

**Simulate the urgent call from manager:**

```bash
git status
# modified: replicaset.yaml  ← half-done changes
```

Can't commit — it's broken. Can't lose it — hours of work.

```bash
# Stash it
git stash -m "WIP: feature - image upgrade and resource limits"

git status
# Nothing to commit, working tree clean ✓
```

Now fix the production bug:

```bash
git checkout -b hotfix
sed -i 's/replicas: 3/replicas: 1/' replicaset.yaml  # emergency scale down
git add replicaset.yaml
git commit -m "HOTFIX: Emergency scale down for maintenance"
git checkout master
git merge hotfix
```

Bug fixed. Now come back to your work:

```bash
git stash list
# stash@{0}: WIP: feature - image upgrade and resource limits

git stash pop
git status
# modified: replicaset.yaml  ← your half-done work is back
```

### Multiple Stashes

```bash
git stash -m "feature A half done"
git stash -m "feature B half done"

git stash list
# stash@{0}: feature B half done
# stash@{1}: feature A half done

# Apply a specific stash
git stash apply stash@{1}
```

> 💡 **Common mistake:** Students forget about stashes and wonder why their work is "lost."  
> Remind: always run `git stash list` if you can't find your changes.

---

## 🌿 Part 4 – Branching Strategy (25 min)

### Why do we need a strategy?

Without a branching strategy, teams get confused:
- Where do I create my branch from?
- Can I push directly to `master`?
- How does a hotfix work?
- When does code go to production?

A **branching strategy** is a team agreement on how Git branches are used.

---

### Strategy 1 — GitFlow

**Best for:** Large teams, versioned releases, enterprise software

```
main         ─────────────────────────────────────────────────────▶
                 ↑ release                             ↑ hotfix
develop      ──────────────────────────────────────────────────────▶
                 ↑ feature/A     ↑ feature/B
feature/*    ──────────         ──────────
```

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code only |
| `develop` | Integration branch — all features merge here |
| `feature/*` | One branch per new feature |
| `release/*` | Preparation for a release (testing, minor fixes) |
| `hotfix/*` | Emergency fix directly off `main` |

**Rules:**
- Features branch from `develop`, merge back to `develop`
- Hotfixes branch from `main`, merge to BOTH `main` AND `develop`
- Only `release` branches merge to `main`

---

### Strategy 2 — GitHub Flow

**Best for:** Small teams, continuous deployment, startups, SaaS products

```
main         ─────────────────────────────────────────────────────▶
                 ↑ feature/login          ↑ feature/payment
feature/*    ──────────────────          ──────────────────
```

| Step | Action |
|------|--------|
| 1 | Branch from `main` |
| 2 | Work on feature |
| 3 | Open Pull Request |
| 4 | Review + CI passes |
| 5 | Merge to `main` |
| 6 | Deploy `main` immediately |

**Simpler than GitFlow.** Only two types of branches: `main` and `feature/*`.

---

### Strategy 3 — Trunk-Based Development

**Best for:** Senior teams, high-deployment frequency (multiple deploys per day), Google/Facebook style

- All developers commit directly to `main` (trunk)
- Feature flags control what users see
- CI/CD must be extremely fast and reliable
- No long-lived branches

---

### Comparison Table

| | GitFlow | GitHub Flow | Trunk-Based |
|-|---------|------------|-------------|
| Complexity | High | Low | Medium |
| Release style | Scheduled | Continuous | Continuous |
| Branch count | Many | Few | Minimal |
| Best for | Enterprise | Startups/SaaS | Elite teams |

> 💡 **Ask students:** "Which strategy does a company like Netflix use?"  
> Answer: Trunk-based development — they deploy hundreds of times a day.

---

### Live Demo — GitFlow Walkthrough

```bash
mkdir strategy-demo && cd strategy-demo
git init
git config user.name "Trainer"
git config user.email "trainer@devops.com"

# Production YAML as main branch
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
git add replicaset.yaml && git commit -m "v1.0 production"
git branch main
git branch develop

# Developer creates feature branch from develop
git checkout develop
git checkout -b feature/upgrade-image
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
git add replicaset.yaml && git commit -m "Feature: Upgrade nginx image"

# Merge feature into develop
git checkout develop
git merge feature/upgrade-image --no-ff -m "Merge feature/upgrade-image into develop"

# Create release branch
git checkout -b release/v1.1
echo "# Release v1.1" >> replicaset.yaml
git add replicaset.yaml && git commit -m "Release v1.1 prep"

# Merge release into main
git checkout main
git merge release/v1.1 --no-ff -m "Release v1.1 to production"
git tag v1.1

git log --oneline --graph --all
```

---

## 🪝 Part 5 – Git Hooks (25 min)

### What are Git Hooks?

Git Hooks are **scripts that run automatically** at specific points in the Git workflow.

They are stored in `.git/hooks/` directory inside every repo.

**Types:**

| Hook | When it runs |
|------|-------------|
| `pre-commit` | BEFORE a commit is created — can abort the commit |
| `post-commit` | AFTER a commit is created — for notifications/logging |
| `pre-push` | Before `git push` — can abort the push |
| `pre-merge` | Before `git merge` |
| `commit-msg` | Validates the commit message format |

> 💡 Hooks run locally on the developer's machine — they are NOT stored in Git history.  
> To share hooks with a team, store them in a folder like `scripts/hooks/` and document how to install them.

---

### `pre-commit` Hook

Runs before a commit is saved. If the script exits with a **non-zero status**, the commit is aborted.

**DevOps use cases:**
- Reject commits with `replicas: 0` (would break production)
- Block secrets/passwords from being committed
- Enforce file size limits
- Run linting or unit tests

---

### Live Demo — pre-commit Hook

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

**Create the pre-commit hook:**

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
    echo "❌ ERROR: Image tag 'BROKEN' found - commit rejected!"
    exit 1
fi

echo "✅ All checks passed. Proceeding with commit."
exit 0
EOF

chmod +x .git/hooks/pre-commit
```

**Test it — trigger a rejection:**

```bash
sed -i 's/replicas: 3/replicas: 0/' replicaset.yaml
git add replicaset.yaml
git commit -m "Set replicas to 0"
```

**Output:**
```
🔍 Running pre-commit checks...
❌ ERROR: replicas cannot be 0 - commit rejected!
```

The commit is blocked. Fix and retry:

```bash
sed -i 's/replicas: 0/replicas: 3/' replicaset.yaml
git add replicaset.yaml
git commit -m "Restored replicas to 3"
```

**Output:**
```
🔍 Running pre-commit checks...
✅ All checks passed. Proceeding with commit.
[master a1b2c3d] Restored replicas to 3
```

---

### `post-commit` Hook

Runs after a commit is saved. Cannot abort the commit — used for notifications and logging.

**DevOps use cases:**
- Log every commit to a file
- Send a Slack/Teams notification
- Trigger a CI pipeline (for local setups)

---

**Create a post-commit hook:**

```bash
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
COMMIT_ID=$(git log -1 --format="%H")
COMMIT_MSG=$(git log -1 --format="%s")
AUTHOR=$(git log -1 --format="%an")
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "[$TIMESTAMP] COMMIT by $AUTHOR | ID: $COMMIT_ID | MSG: $COMMIT_MSG" >> ~/git-commit-log.txt
echo "📝 Commit logged to ~/git-commit-log.txt"
EOF

chmod +x .git/hooks/post-commit
```

**Test it:**

```bash
echo "# updated" >> replicaset.yaml
git add replicaset.yaml
git commit -m "Minor update to replicaset"

cat ~/git-commit-log.txt
```

**Output:**
```
[2024-07-28 23:30:00] COMMIT by Trainer | ID: b2c3d4e... | MSG: Minor update to replicaset
```

> 💡 **Teaching tip:** Show students that hooks are just shell scripts — any language works (Python, Node, etc.).  
> Many teams use the `pre-commit` Python framework (`pip install pre-commit`) to manage hooks across the team.

---

## 💻 In-Class Exercises

1. **Cherry-pick:** Create two branches. Add 3 commits on `dev`. Cherry-pick only commit #2 to `master`. Verify using `git log --oneline` on both branches.

2. **Squash:** Create 5 messy commits ("fix", "WIP", "try again", etc.). Squash them into 1 clean commit message using `git rebase -i HEAD~5`.

3. **Stash:** Make uncommitted changes to `replicaset.yaml`. Stash them. Make a hotfix commit on a new branch. Come back and `git stash pop` to restore your work.

4. **Hooks:** Write a `pre-commit` hook that rejects any commit where the word `password` appears in any staged file.

---

## 📝 Assignments

1. **Cherry-pick challenge:** Create 3 branches with 3 commits each. Cherry-pick one commit from each branch into `master`. Show the final `git log --oneline` of `master`.

2. **Squash practice:** Clone any of your Day 3 repos. Create 6 messy commits. Squash them all into 1 well-named commit.

3. **Branching Strategy design:** On paper or in a markdown file, design the branching strategy for a team of 5 developers building a web app. Specify branch names, rules, and merge process.

4. **Hook challenge:** Write a `pre-commit` hook that:
   - Rejects commits where `replicas` is less than 1
   - Rejects commits where the image tag contains the word `latest` (not version-pinned)
   - Logs every rejected attempt to a file called `rejected-commits.log`

---

## 🔁 Day 4 Quick Reference

| Command | What it does |
|---------|-------------|
| `git cherry-pick <id>` | Copy a specific commit to current branch |
| `git cherry-pick <id1> <id2>` | Copy multiple specific commits |
| `git rebase -i HEAD~N` | Interactive rebase to squash last N commits |
| `git stash` | Save uncommitted changes to a temporary area |
| `git stash -m "label"` | Save with a descriptive label |
| `git stash list` | List all stashes |
| `git stash pop` | Restore latest stash and remove it from list |
| `git stash apply` | Restore latest stash but keep it in list |
| `git stash drop` | Delete a specific stash |
| `git stash clear` | Delete all stashes |
| `.git/hooks/pre-commit` | Script that runs before every commit |
| `.git/hooks/post-commit` | Script that runs after every commit |
| `chmod +x .git/hooks/pre-commit` | Make the hook executable |

---

## 🎤 Interview Questions — Plant Today

1. **What is `git cherry-pick` and when do you use it?**  
   Copies a specific commit from one branch to another. Used when you need one fix from `dev` on `master` without merging the entire branch.

2. **What is squashing and why is it used?**  
   Combines multiple commits into one. Keeps `git log` clean and meaningful before merging feature branches.

3. **What is `git stash`?**  
   Temporarily saves uncommitted changes so you can switch context (e.g., fix an urgent bug) and come back to your work later.

4. **What is a branching strategy? Name one.**  
   A team agreement on how branches are created, named, and merged. Examples: GitFlow (main/develop/feature/hotfix), GitHub Flow (main + feature), Trunk-based.

5. **What is a Git hook?**  
   A script in `.git/hooks/` that runs automatically at Git lifecycle events (pre-commit, post-commit, pre-push). Used to enforce code quality, reject bad configs, or trigger notifications.

6. **How do you prevent secrets from being committed?**  
   Write a `pre-commit` hook that scans staged files for keywords like `password`, `secret`, `API_KEY`. If found, exit 1 to abort the commit.

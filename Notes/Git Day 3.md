# 📘 Git – Day 3 Exercise Guide (Trainer)
## 🕐 Duration: 2 Hours | DevOps Batch
### 👨‍🏫 Trainer Reference — Not for Students

---

## 🎯 Day 3 Objective

This is a **pure hands-on practice day**.  
No new theory — students apply every Git command from Day 1 and Day 2  
on a real DevOps file: a **Kubernetes ReplicaSet YAML**.

This mimics exactly how teams use Git in production:
- Track changes to Kubernetes config files
- Rollback bad deployments using `git revert` / `git reset`
- Collaborate using branches and merges
- Sync with remote using push/pull

---

## 👨‍🏫 Before Starting

Tell students:

> "In real DevOps teams, Git is used to version infrastructure files —  
> Kubernetes YAMLs, Terraform configs, Dockerfiles, CI/CD pipelines.  
> Today you are going to manage a Kubernetes ReplicaSet file using everything you have learned."

**Make sure every student has:**
- Git installed and configured (`git config --global user.name` done)
- A GitHub account (for push/pull/clone exercises)
- A terminal open

---

## 📄 The Project File — ReplicaSet YAML

This is the file students will track throughout the entire session.  
Explain what it does briefly:

> "A ReplicaSet tells Kubernetes how many identical pod copies to run.  
> We're not deploying this today — we're using it as our project file to practice Git."

```yaml
# replicaset.yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: webapp-rs
  labels:
    app: webapp
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
```

---

## ⏱️ Session Plan

| Time | Exercise |
|------|----------|
| 0:00 – 0:10 | Setup — repo, config file, first commit |
| 0:10 – 0:30 | Exercise 1 — Multi-commit history (replica changes) |
| 0:30 – 0:50 | Exercise 2 — `git revert` (rollback a bad change) |
| 0:50 – 1:10 | Exercise 3 — `git reset --hard` (discard commits) |
| 1:10 – 1:30 | Exercise 4 — Branches + Merge Conflict |
| 1:30 – 1:45 | Exercise 5 — `git clone`, `push`, `pull` with GitHub |
| 1:45 – 2:00 | Exercise 6 — `git fetch` + `git rebase` |

---

## ⚙️ Setup (All Students — 10 min)

Walk every student through this before starting exercises:

```bash
mkdir k8s-project && cd k8s-project
git init
git config user.name "Your Name"
git config user.email "you@devops.com"
```

Create the ReplicaSet file:

```bash
cat > replicaset.yaml << 'EOF'
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: webapp-rs
  labels:
    app: webapp
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
```

First commit:

```bash
git add replicaset.yaml
git commit -m "Initial ReplicaSet - 3 replicas, nginx:1.19"
git log --oneline
```

> 💡 Confirm every student sees the first commit before moving forward.

---

## 🔴 Exercise 1 – Build a Multi-Commit History (20 min)

Students make 4 meaningful changes simulating real version history.

### Commit 2 — Scale Up to 5 Replicas

> "Your app traffic increased. Scale from 3 to 5 replicas."

Change `replicas: 3` → `replicas: 5`

```bash
# Edit replicaset.yaml: replicas: 3 → replicas: 5
sed -i 's/replicas: 3/replicas: 5/' replicaset.yaml
git add replicaset.yaml
git commit -m "Scale up: replicas 3 → 5 (traffic increase)"
```

### Commit 3 — Upgrade Image

> "New nginx version released. Upgrade the container image."

```bash
sed -i 's/image: nginx:1.19/image: nginx:1.21/' replicaset.yaml
git add replicaset.yaml
git commit -m "Upgrade image: nginx:1.19 → nginx:1.21"
```

### Commit 4 — Add Resource Limits (good change)

> "DevOps best practice: always set resource limits on containers."

Edit `replicaset.yaml` manually to add below the `ports` section:

```yaml
        resources:
          limits:
            cpu: "500m"
            memory: "128Mi"
          requests:
            cpu: "250m"
            memory: "64Mi"
```

```bash
git add replicaset.yaml
git commit -m "Add resource limits and requests to container"
```

### Commit 5 — Wrong Image Version (intentional mistake)

> "Someone pushed a wrong image tag. This simulates a bad deployment."

```bash
sed -i 's/image: nginx:1.21/image: nginx:BROKEN/' replicaset.yaml
git add replicaset.yaml
git commit -m "Update image - nginx:BROKEN (bad commit)"
```

### Check History

```bash
git log --oneline
```

**Expected output:**
```
e5f8a2c Update image - nginx:BROKEN (bad commit)
d4c7b1a Add resource limits and requests to container
c3b6a0d Upgrade image: nginx:1.19 → nginx:1.21
b2a5f9e Scale up: replicas 3 → 5 (traffic increase)
a1d4e8c Initial ReplicaSet - 3 replicas, nginx:1.19
```

> 💡 Ask students: "Which commit introduced the bug?" → The last one (`nginx:BROKEN`).  
> "How do we fix it without losing history?"  → `git revert` — next exercise.

---

## 🔴 Exercise 2 – `git revert` — Safe Rollback (20 min)

> "Production is down because of the bad image. Revert the bad commit safely."

```bash
# Get the commit ID of the bad commit
git log --oneline

# Revert it (replace the ID with your actual bad commit ID)
git revert e5f8a2c
```

Git opens a commit message editor. Save and exit (`:wq` in vim).

```bash
git log --oneline
```

**Output — new revert commit on top:**
```
f6a9b3d Revert "Update image - nginx:BROKEN (bad commit)"
e5f8a2c Update image - nginx:BROKEN (bad commit)
d4c7b1a Add resource limits and requests to container
...
```

Verify the fix:

```bash
cat replicaset.yaml | grep image
# Should show: image: nginx:1.21
```

> 💡 Key point: The bad commit `e5f8a2c` is still in history — `git revert` only adds an undo commit on top.  
> This is safe for shared branches. Show students `git log --oneline` to prove the history is intact.

---

## 🔴 Exercise 3 – `git reset --hard` — Destructive Rollback (20 min)

> "This time, you want to completely go back to the state BEFORE the bad commit was ever made.  
> You haven't pushed to remote yet, so it's safe."

First, show students the current log:

```bash
git log --oneline
```

Copy the commit ID of `"Add resource limits..."` — we want to reset to that point.

```bash
git reset --hard d4c7b1a
```

Check:

```bash
git log --oneline
```

**Output — commits after `d4c7b1a` are GONE:**
```
d4c7b1a Add resource limits and requests to container
c3b6a0d Upgrade image: nginx:1.19 → nginx:1.21
b2a5f9e Scale up: replicas 3 → 5 (traffic increase)
a1d4e8c Initial ReplicaSet - 3 replicas, nginx:1.19
```

Verify the file:

```bash
cat replicaset.yaml | grep image
# image: nginx:1.21  ← correct

cat replicaset.yaml | grep replicas
# replicas: 5
```

### Revert vs Reset — Comparison Table (Show on Board)

| | `git revert` | `git reset --hard` |
|-|-------------|-------------------|
| History | Preserved (adds undo commit) | Destroyed |
| Safe for pushed branches | ✅ Yes | ❌ No |
| Use case | Undo a commit others have seen | Discard local commits never pushed |

> ⚠️ Warn again: `git reset --hard` on a pushed branch = chaos for teammates.

---

## 🔴 Exercise 4 – Branch + Merge Conflict (20 min)

Simulate two developers editing the replica count at the same time.

```bash
# Current state: on master

# Developer A creates a feature branch
git checkout -b dev-teamA

# Dev A changes replicas to 10
sed -i 's/replicas: 5/replicas: 10/' replicaset.yaml
git add replicaset.yaml
git commit -m "TeamA: Scale to 10 replicas for load test"

# Switch back to master
git checkout master

# Developer B (simulated) changes replicas to 2 on master
sed -i 's/replicas: 5/replicas: 2/' replicaset.yaml
git add replicaset.yaml
git commit -m "Master: Scale down to 2 replicas (cost saving)"

# Now merge dev-teamA into master
git merge dev-teamA
```

**Output:**
```
CONFLICT (content): Merge conflict in replicaset.yaml
Automatic merge failed; fix conflicts and then commit the result.
```

Inspect the conflict:

```bash
cat replicaset.yaml | grep -A2 "<<<<<"
```

```
<<<<<<< HEAD
  replicas: 2
=======
  replicas: 10
>>>>>>> dev-teamA
```

Resolve — decide on `replicas: 5` as a team decision:

```bash
vi replicaset.yaml
# Remove conflict markers, set replicas: 5

git add replicaset.yaml
git commit -m "Merge dev-teamA: agreed on replicas: 5 after discussion"

git log --oneline --graph
```

---

## 🔴 Exercise 5 – `git clone`, `push`, `pull` with GitHub (15 min)

> Students need their GitHub account for this.

### Push local repo to GitHub

```bash
# Create a new repo on GitHub named 'k8s-project' (empty, no README)
# Then:
git remote add origin https://github.com/<your-username>/k8s-project.git
git push -u origin master
```

Verify on GitHub — students should see `replicaset.yaml` with full commit history.

### Simulate pull from another developer

Open a new terminal or different directory:

```bash
# Simulate another developer cloning
cd /tmp
git clone https://github.com/<your-username>/k8s-project.git k8s-clone
cd k8s-clone

# Make a change
sed -i 's/replicas: 5/replicas: 7/' replicaset.yaml
git add replicaset.yaml
git commit -m "Clone: scale to 7 replicas"
git push origin master
```

Back in original directory — pull the change:

```bash
cd ~/k8s-project
git pull origin master
cat replicaset.yaml | grep replicas
# replicas: 7
```

---

## 🔴 Exercise 6 – `git fetch` + `git rebase` (15 min)

### `git fetch`

Make a change on GitHub UI directly (edit `replicas` in browser).  
Then from terminal:

```bash
git fetch origin
git log FETCH_HEAD --oneline      # See what changed remotely
git diff HEAD FETCH_HEAD           # See the exact diff
git merge FETCH_HEAD               # Merge when ready
```

### `git rebase`

```bash
git checkout -b feature-probe

# Add a liveness probe to replicaset.yaml (add under ports section)
# livenessProbe:
#   httpGet:
#     path: /
#     port: 80

git add replicaset.yaml
git commit -m "Add liveness probe to container"

# Master got a new commit meanwhile
git checkout master
echo "# Managed by DevOps team" >> replicaset.yaml
git add replicaset.yaml
git commit -m "Add management comment"

# Rebase feature branch on top of master
git checkout feature-probe
git rebase master

git log --oneline
```

---

## 📝 Day 3 Assignment

1. Create a fresh repo with `deployment.yaml` (use any Kubernetes YAML)
2. Make 5 commits with meaningful changes (image version, replicas, labels)
3. Use `git revert` to undo commit #3
4. Create a `hotfix` branch, make a change, merge it back to `master`
5. Push the entire repo to GitHub
6. Clone it in a different folder, make a change, push, pull back to original

---

## 🎤 Interview Questions to Plant

> Start asking these at end of class:

1. **"How do you rollback a bad deployment in Git?"**  
   → `git revert` for shared branches. `git reset --hard` only for local, unpushed commits.

2. **"Your team uses Git to manage Kubernetes YAMLs. Developer A changes replicas, Developer B changes the image — what happens when they merge?"**  
   → If they edited the same lines → merge conflict. Resolve manually, then commit.

3. **"What is GitOps?"**  
   → A practice where all infrastructure config (Kubernetes YAMLs, Terraform, etc.) is stored in Git. Git becomes the single source of truth. Changes to infra are made via Git commits and pull requests — not manual `kubectl apply`.

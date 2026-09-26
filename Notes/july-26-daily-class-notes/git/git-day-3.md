# Git Day 3

## 🕐 Hands-On Practice&#x20;

## 🎯 What You Will Do Today

Today is a **full practice session**.

You will use a Kubernetes **ReplicaSet YAML** as your project file and apply every Git command learned in Day 1 and Day 2 on it.

This is exactly how Git is used in real DevOps teams — versioning Kubernetes configs, rolling back bad deployments, collaborating on branches.

## 📄 Your Project File — ReplicaSet YAML

A **ReplicaSet** tells Kubernetes how many identical copies (pods) of an application to run.

You will version this file as your "project" throughout today's exercises.

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

**Key fields to understand:**

| Field               | What it means                       |
| ------------------- | ----------------------------------- |
| `replicas: 3`       | Run 3 identical pods at all times   |
| `image: nginx:1.19` | The container image and version     |
| `containerPort: 80` | The port the application listens on |

## ⚙️ Setup — Create Your Repo

```bash
mkdir k8s-project && cd k8s-project
git init
git config user.name "Your Name"
git config user.email "you@devops.com"
```

Create the file:

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

## 🔴 Exercise 1 – Build a Commit History

Make 4 changes to the file — each one simulates a real DevOps scenario.

{% stepper %}
{% step %}
### Commit 2 — Scale Up to 5 Replicas

**Scenario:** App traffic increased. Need more replicas.

Open `replicaset.yaml` and change `replicas: 3` to `replicas: 5`.

Then commit:

```bash
git add replicaset.yaml
git commit -m "Scale up: replicas 3 → 5 (traffic increase)"
```
{% endstep %}

{% step %}
### Commit 3 — Upgrade Container Image

**Scenario:** New nginx version released. Upgrade.

Change `image: nginx:1.19` to `image: nginx:1.21`

```bash
git add replicaset.yaml
git commit -m "Upgrade image: nginx:1.19 → nginx:1.21"
```
{% endstep %}

{% step %}
### Commit 4 — Add Resource Limits

**Scenario:** Best practice — always set resource limits in Kubernetes.

Add this block under the `ports` section in your YAML:

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
{% endstep %}

{% step %}
### Commit 5 — Bad Deployment (Intentional Mistake)

**Scenario:** Someone accidentally pushed a wrong image tag.

Change `image: nginx:1.21` to `image: nginx:BROKEN`

```bash
git add replicaset.yaml
git commit -m "Update image - nginx:BROKEN (bad commit)"
```
{% endstep %}
{% endstepper %}

### Check Your History

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

<details>

<summary>❓ Which commit introduced the bug?</summary>

✅ The last one — `nginx:BROKEN`

</details>

## 🔴 Exercise 2 – `git revert` — Safe Rollback

**Scenario:** Production is down. Undo the bad commit without destroying history.

```bash
# Get the commit ID of the bad commit from git log --oneline
git log --oneline

# Revert it (replace ID with YOUR actual bad commit ID)
git revert e5f8a2c
```

Git opens a text editor for the commit message. Save and close:

* In vim: press `Esc`, type `:wq`, press `Enter`

```bash
git log --oneline
```

**Output — new revert commit added on top:**

```
f6a9b3d Revert "Update image - nginx:BROKEN (bad commit)"
e5f8a2c Update image - nginx:BROKEN (bad commit)
d4c7b1a Add resource limits and requests to container
...
```

Verify the fix:

```bash
grep "image" replicaset.yaml
```

Should show `image: nginx:1.21` — the bad commit is undone.

{% hint style="info" %}
The bad commit `e5f8a2c` is still in history.

`git revert` only **adds a new undo commit on top** — it never deletes.

This is the safe way to undo on branches that have been pushed to GitHub.
{% endhint %}

## 🔴 Exercise 3 – `git reset --hard` — Discard Commits

**Scenario:** You want to completely go back to the state BEFORE the bad commit.

You have NOT pushed to GitHub yet, so it is safe.

First, view your log and copy the ID of `"Add resource limits..."`:

```bash
git log --oneline
```

Reset to that commit:

```bash
git reset --hard d4c7b1a    # replace with your actual commit ID
```

Check:

```bash
git log --oneline
```

The commits after `d4c7b1a` are **permanently gone**.

Verify the file is back to the correct state:

```bash
grep "image" replicaset.yaml     # Should show nginx:1.21
grep "replicas" replicaset.yaml  # Should show replicas: 5
```

### `git revert` vs `git reset --hard` — Key Difference

|                            | `git revert`              | `git reset --hard`           |
| -------------------------- | ------------------------- | ---------------------------- |
| What it does               | Adds a new undo-commit    | Permanently deletes commits  |
| History                    | Preserved                 | Destroyed                    |
| Safe after push to GitHub? | ✅ Yes                     | ❌ No                         |
| When to use                | Always on shared branches | Only on local, unpushed work |

{% hint style="warning" %}
Never use `git reset --hard` on a branch that teammates have already cloned or pulled from.
{% endhint %}

## 🔴 Exercise 4 – Branch + Merge Conflict

**Scenario:** Two developers both changed `replicas` on different branches.

```bash
# You are on master
# Create a branch for Team A
git checkout -b dev-teamA

# Team A scales up to 10 replicas
# Edit replicaset.yaml: replicas: 5 → replicas: 10
git add replicaset.yaml
git commit -m "TeamA: Scale to 10 replicas for load test"

# Switch back to master
git checkout master

# Meanwhile, master gets scaled down to 2 (cost saving)
# Edit replicaset.yaml: replicas: 5 → replicas: 2
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

View the conflict:

```bash
cat replicaset.yaml
```

You will see:

```
<<<<<<< HEAD
  replicas: 2
=======
  replicas: 10
>>>>>>> dev-teamA
```

**Resolve it:**

Open `replicaset.yaml` in vi, remove the conflict markers, and set an agreed value:

```yaml
  replicas: 5
```

Then complete the merge:

```bash
git add replicaset.yaml
git commit -m "Merge dev-teamA: agreed on replicas: 5 after discussion"
```

View the final history:

```bash
git log --oneline --graph
```

## 🔴 Exercise 5 – `git clone`, `push`, `pull`

{% hint style="info" %}
You need a **GitHub account** for this exercise.
{% endhint %}

{% stepper %}
{% step %}
### Create a repo on GitHub

* Go to github.com → New Repository
* Name it `k8s-project`
* Leave it **empty** (no README, no .gitignore)
* Copy the HTTPS URL
{% endstep %}

{% step %}
### Push your local repo to GitHub

```bash
git remote add origin https://github.com/<your-username>/k8s-project.git
git push -u origin master
```

Verify on GitHub — you should see `replicaset.yaml` and all your commits.
{% endstep %}

{% step %}
### Simulate another developer

Open a **new terminal window** and clone to a different location:

```bash
cd /tmp
git clone https://github.com/<your-username>/k8s-project.git k8s-clone
cd k8s-clone

# Make a change
# Edit replicaset.yaml: change replicas to 7
git add replicaset.yaml
git commit -m "Clone: scale to 7 replicas"
git push origin master
```
{% endstep %}

{% step %}
### Pull the change back

In your original terminal:

```bash
cd ~/k8s-project
git pull origin master
grep "replicas" replicaset.yaml
# replicas: 7
```
{% endstep %}
{% endstepper %}

{% hint style="info" %}
This is the daily workflow of every DevOps team:

**pull → edit → commit → push**
{% endhint %}

## 🔴 Exercise 6 – `git fetch` + `git rebase`

### `git fetch`

Make a change directly on GitHub (edit `replicaset.yaml` in the browser → change replicas).

Then in your terminal:

```bash
git fetch origin

git log FETCH_HEAD --oneline         # What changed on remote?
git diff HEAD FETCH_HEAD              # Exact diff — your version vs remote
git merge FETCH_HEAD                  # Merge when you are ready
```

{% hint style="info" %}
`git fetch` lets you **look before you merge** — unlike `git pull` which does both automatically.
{% endhint %}

### `git rebase`

Create a feature branch and add a liveness probe to the YAML:

```bash
git checkout -b feature-probe
```

Add this under the `ports` section in `replicaset.yaml`:

```yaml
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
```

```bash
git add replicaset.yaml
git commit -m "Add liveness probe to container"
```

Meanwhile, add a comment to master:

```bash
git checkout master
echo "# Managed by DevOps Team - do not edit manually" >> replicaset.yaml
git add replicaset.yaml
git commit -m "Add management comment to YAML"
```

Rebase feature branch on top of master:

```bash
git checkout feature-probe
git rebase master

git log --oneline
```

**Result:** Your feature commit is now replayed on top of master's latest commit — clean linear history, no merge commit.

{% hint style="warning" %}
Rule: Only rebase branches that have **not been pushed** to GitHub.
{% endhint %}

## 📝 Assignments

Complete before next class:

1. Create a fresh repo with any Kubernetes YAML (Deployment, Service, or ConfigMap)
2. Make 5 commits with meaningful changes
3. Use `git revert` to undo commit #3 — show `git log --oneline` after
4. Create a `hotfix` branch, change the image version, merge back to `master`
5. Push the entire repo to GitHub — share the link

## 🔁 Day 3 Quick Reference

| Command                       | What it does                                     |
| ----------------------------- | ------------------------------------------------ |
| `git log --oneline`           | View compact commit history                      |
| `git revert <id>`             | Safely undo a commit — adds undo-commit on top   |
| `git reset --hard <id>`       | Permanently delete commits after the given point |
| `git checkout -b <name>`      | Create and switch to a new branch                |
| `git merge <branch>`          | Merge a branch into current branch               |
| `git remote add origin <url>` | Link local repo to GitHub                        |
| `git push -u origin master`   | Push + set upstream tracking                     |
| `git pull origin master`      | Download + merge remote changes                  |
| `git clone <url>`             | Download a full remote repo                      |
| `git fetch`                   | Download remote changes — do NOT merge yet       |
| `git diff HEAD FETCH_HEAD`    | Compare local vs fetched                         |
| `git merge FETCH_HEAD`        | Merge fetched changes when ready                 |
| `git rebase master`           | Replay branch commits on top of master           |

## 🎤 Interview Questions — Practice These

<details>

<summary><strong>Q1: "Production is broken due to a bad Kubernetes config committed to Git. What do you do?"</strong></summary>

Run `git log --oneline` to find the bad commit.

Use `git revert <commit-id>` to create an undo commit.

Push the revert to remote — the pipeline redeploys the corrected config.

</details>

<details>

<summary><strong>Q2: "Two developers both edited the <code>replicas</code> field in the same YAML. What happens when they merge?"</strong></summary>

A merge conflict occurs. Git cannot auto-decide which value is correct.

Open the file, remove `<<<<<<<`, `=======`, `>>>>>>>` markers.

Keep the agreed value, `git add`, then `git commit` to complete the merge.

</details>

<details>

<summary><strong>Q3: "What is the difference between <code>git fetch</code> and <code>git pull</code>?"</strong></summary>

`git fetch` downloads remote commits but does NOT merge them.

`git pull` = `git fetch` + `git merge`.

Use `git fetch` when you want to review what changed before deciding to merge.

</details>

<details>

<summary><strong>Q4: "What is GitOps?"</strong></summary>

GitOps is a DevOps practice where all infrastructure configuration — Kubernetes YAMLs, Terraform files, Helm charts — is stored in Git.

Git is the single source of truth.

Changes to infrastructure are made via Git commits and pull requests, not manual commands.

Tools like ArgoCD and Flux automatically sync the cluster with what's in Git.

</details>

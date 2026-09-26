# git rebase

## ✅ What is `git rebase`?

`git rebase` is a command used to **move or replay your commits on top of another branch**. It helps you:

* **Clean up Git history**
* **Integrate feature branches** in a linear way
* Avoid unnecessary merge commits

## ✅ Real-Time Scenario: Feature Integration with a Clean History

Let’s say you’re working on a DevOps team using GitFlow.

You created a new branch:

```bash
git checkout -b feature/k8s-autoscaler
```

You worked on it for 2 days and made several commits. Meanwhile, your teammate pushed some updates to the `develop` branch.

### ❌ Problem

If you do a normal `merge`, you’ll get a **merge commit**, like this:

```
*   Merge branch 'develop' into feature/k8s-autoscaler
|\  
| * Update terraform module
| * Bug fix in helm chart
* | Added HPA config
* | Added cluster autoscaler
```

This makes your Git history **messy**, especially with multiple feature branches.

## ✅ Goal

Replay your feature work **on top of latest `develop`** to keep history clean.

## ✅ Solution: Use `git rebase`

### 🧪 Step-by-Step Workflow

{% stepper %}
{% step %}
## Switch to your feature branch

```bash
git checkout feature/k8s-autoscaler
```
{% endstep %}

{% step %}
## Rebase it onto latest `develop`

```bash
git fetch origin
git rebase origin/develop
```

> This re-applies your commits **after** the current `develop`.
{% endstep %}

{% step %}
## Resolve conflicts if any

```bash
git# Edit conflict files
git add <filename>
git rebase --continue
```

Repeat until all conflicts are resolved.
{% endstep %}

{% step %}
## Push changes back

Since rebase **rewrites history**, use `--force`:

```bash
git push origin feature/k8s-autoscaler --force
```
{% endstep %}
{% endstepper %}

## 📈 Git History: Before vs After Rebase

### ❌ Before Rebase (with merge)

```
develop:  A---B---C---D
                 \
feature:           E---F
```

After merge:

```
A---B---C---D---M
                \
                 E---F
```

### ✅ After Rebase (clean linear history)

```
develop:  A---B---C---D
                         \
feature:                  E'---F'
```

(E', F' are replayed versions of E, F)

## ✅ When to Use `git rebase`

| Use Case                 | When to Rebase                               |
| ------------------------ | -------------------------------------------- |
| Feature branch got stale | Rebase onto latest `develop` or `main`       |
| Keep history linear      | Instead of merging `develop`, rebase onto it |
| Clean PR before merge    | Rebase and squash for single clean commit    |
| Avoid messy merges       | Ideal for solo/feature branches              |

## ✅ Commands Summary

| Command                  | Purpose                               |
| ------------------------ | ------------------------------------- |
| `git rebase branch_name` | Replay commits on top of given branch |
| `git rebase -i HEAD~n`   | Interactive rebase (used for squash)  |
| `git rebase --continue`  | Continue after conflict resolution    |
| `git rebase --abort`     | Cancel the rebase if needed           |
| `git push --force`       | Push after rebasing                   |

## ✅ Analogy

🧠 **Rebase is like rewriting your homework so it looks like you did it after reading the updated instructions — even if you had already started before the instructions changed.**

{% hint style="warning" %}
## ✅ Caution

* **Never rebase shared branches** (e.g., `main`, `develop`)
* Only rebase your **own local feature branches**
* Be cautious when using `--force` with `push`
{% endhint %}

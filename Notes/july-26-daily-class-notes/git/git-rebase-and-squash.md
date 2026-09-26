# git rebase and squash

## Git Rebase and Squash

### ✅ What is `git rebase`?

`git rebase` is a Git command used to **move or combine a sequence of commits** to a new base commit. It helps maintain a **linear and clean commit history**, especially useful in **collaborative projects** or **CI/CD environments**.

### 🧪 Real-Time Scenario: Feature Development in a Team Project

#### 👨‍💻 Project Setup

You are working in a **DevOps team** managing infrastructure as code (IaC) for a project. The `main` branch is used for production-ready infrastructure.

Imagine this scenario:

*   You (DevOps Engineer) created a new feature branch to add **EKS cluster deployment**:

    ```bash
    git checkout -b eks-cluster-setup
    ```
* While you're working on your feature, someone else merged changes to the `main` branch related to **S3 bucket policies**.

Now your branch is **behind** the main branch. Before you create a pull request, you want to make sure your branch is **up-to-date** and has a **clean commit history**.

### 🎯 Goal

* Integrate the latest `main` branch changes into your `eks-cluster-setup` branch.
* Maintain a clean commit history instead of a messy merge commit.

### 🔄 Rebase Flow Step-by-Step

{% stepper %}
{% step %}
#### Start on your feature branch

```bash
git checkout eks-cluster-setup
```
{% endstep %}

{% step %}
#### Fetch the latest changes

```bash
git fetch origin
```
{% endstep %}

{% step %}
#### Rebase your feature branch onto the updated main

```bash
git rebase origin/main
```

Behind the scenes, Git does:

* Takes the commits from your branch (`eks-cluster-setup`)
* Temporarily saves them
* Moves your branch pointer to `main`
* Re-applies your commits on top of `main`

This gives a **linear history** like:

```
main
  |
  o---o---o---S3 changes (main)
               \
                o---o---EKS changes (your branch rebased)
```
{% endstep %}
{% endstepper %}

> Imagine you and your teammate are working on different parts of the infrastructure. Your teammate merges an important security fix to the `main` branch. Before you push your EKS setup code, you want to pull in the latest changes and ensure your history is clean. Instead of a merge, which creates a noisy commit graph, you `rebase` — making it appear as if your work happened **after** the security fix, keeping the commit history **linear and logical**.

### 🧨 What If There's a Conflict?

If the same file was edited in both branches, such as `main.tf`, you might see:

```bash
CONFLICT (content): Merge conflict in main.tf
```

{% stepper %}
{% step %}
#### Manually fix the file
{% endstep %}

{% step %}
#### Mark it as resolved

```bash
git add main.tf
```
{% endstep %}

{% step %}
#### Continue the rebase

```bash
git rebase --continue
```
{% endstep %}
{% endstepper %}

If you want to abort and go back:

```bash
git rebase --abort
```

### ✅ Final Step After Rebase

You need to force push since the history changed:

```bash
git push origin eks-cluster-setup --force
```

### 📊 When to Use Rebase

| Use Rebase When              | Avoid Rebase When                        |
| ---------------------------- | ---------------------------------------- |
| You want clean history       | On shared branches like `main`           |
| You’re preparing for PR      | If you're unsure about conflicts         |
| You work alone on the branch | If others are working on the same branch |

### 📝 Teaching Tip

> Think of `git merge` as taping two roads together. It works, but you can see the joint. `git rebase` is like re-paving your road from start to end — clean and continuous.

## Git Stash

To **see what is inside a Git stash**, there are multiple ways depending on how deep you want to go — just the stash summary, or full file diffs.

### ✅ View List of All Stashes

```bash
git stash list
```

Example output:

```
stash@{0}: WIP on main: 34a8be2 added EKS config
stash@{1}: WIP on feature/login: b12f998 updated login logic
```

This shows all stash entries. Each stash is labeled as `stash@{n}`.

### ✅ View Summary of a Stash

```bash
git stash show stash@{0}
```

Example output:

```
 main.tf | 5 +++--
 outputs.tf | 2 +-
```

This shows the **files changed and how many lines** were added or removed.

### ✅ View Full Diff of a Stash

{% tabs %}
{% tab title="Short option" %}
```bash
git stash show -p stash@{0}
```
{% endtab %}

{% tab title="Long option" %}
```bash
git stash show --patch stash@{0}
```
{% endtab %}
{% endtabs %}

You’ll get a **diff-style output** similar to `git diff`:

```diff
diff --git a/main.tf b/main.tf
index a12b5d3..6f6e8d4 100644
--- a/main.tf
+++ b/main.tf
@@ -1,4 +1,5 @@
 resource "aws_instance" "web" {
+  ami           = "ami-123456"
   instance_type = "t2.micro"
 }
```

### ✅ View Changes in All Stashes

Loop over and show everything:

```bash
git stash list | while read -r stash; do
  echo "===== $stash ====="
  git stash show -p "${stash%%:*}"
done
```

### ✅ Apply Without Dropping

If students want to **see it live in their working directory**, run:

```bash
git stash apply stash@{0}
```

It will apply the stash but **keep it in the stash list**.

To remove it after applying:

```bash
git stash drop stash@{0}
```

> Think of Git stash as a temporary locker for your half-written code. You can check the list (`git stash list`), peek inside (`git stash show`), or even open the locker and inspect all details (`git stash show -p`).

## Git Squash

### ✅ What is Git Squash?

**Git squash** is the act of **combining multiple commits into a single commit** to keep the Git history clean and meaningful.

{% hint style="info" %}
It is done using **interactive rebase**:

```bash
git rebase -i HEAD~N
```
{% endhint %}

### 🎯 Real-Time Scenario: Infrastructure Automation with Terraform

You’re working on a branch called `terraform-s3-setup`.

You made **5 small commits**:

1. `created main.tf`
2. `added provider block`
3. `added S3 bucket resource`
4. `fixed typo in S3 bucket name`
5. `added versioning to S3`

Now you want to **combine them into one commit**:

> `Added S3 Terraform script with versioning`

**Why?**

* It’s cleaner.
* Reviewers don’t need to read trivial changes.
* Maintains professionalism in production-grade DevOps code.

### 🔁 Git Squash: Step-by-Step

{% stepper %}
{% step %}
#### Check your commit history

```bash
git log --oneline
```

Example output:

```
abcde12 (HEAD -> terraform-s3-setup) added versioning to S3
bdcf120 fixed typo in S3 bucket name
cba123d added S3 bucket resource
aaa456e added provider block
1234abc created main.tf
```
{% endstep %}

{% step %}
#### Start interactive rebase to squash the last 5 commits

```bash
git rebase -i HEAD~5
```
{% endstep %}

{% step %}
#### Review the interactive rebase screen

```
pick 1234abc created main.tf
pick aaa456e added provider block
pick cba123d added S3 bucket resource
pick bdcf120 fixed typo in S3 bucket name
pick abcde12 added versioning to S3
```
{% endstep %}

{% step %}
#### Change all lines except the first from `pick` to `squash` or `s`

```
pick 1234abc created main.tf
squash aaa456e added provider block
squash cba123d added S3 bucket resource
squash bdcf120 fixed typo in S3 bucket name
squash abcde12 added versioning to S3
```

> This tells Git: keep the first commit and squash the rest into it.
{% endstep %}

{% step %}
#### Edit the commit message

Git will prompt you to edit the commit message:

```
# This is a combination of 5 commits.

# The first commit's message is:
created main.tf

# The commit messages of the other commits:
added provider block
added S3 bucket resource
fixed typo in S3 bucket name
added versioning to S3
```

Edit this message to:

```
Added Terraform script for S3 with versioning
```

Save and exit.
{% endstep %}

{% step %}
#### Force push if the branch was pushed before

```bash
git push origin terraform-s3-setup --force
```
{% endstep %}
{% endstepper %}

### 🔍 Before vs. After Squash

| Before Squash             | After Squash                        |
| ------------------------- | ----------------------------------- |
| 5 small commits           | 1 clean, descriptive commit         |
| Noisy commit history      | Clean and easy-to-review history    |
| Possible confusion for PR | Simple PR with a focused change set |

> Squashing commits is like preparing for a presentation. You clean up your rough notes (individual commits) and present a single clean slide (one commit) that conveys your entire idea.

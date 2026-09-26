# git stash

### ✅ What is `git stash`?

`git stash` temporarily **saves your uncommitted changes** (both staged and unstaged) so that you can work on something else without losing your work.

It's like **putting your current work in a locker** so you can pick it up later.

***

### ✅ Real-Time Scenario: Hotfix Interrupts Feature Work

Imagine you're working on a **feature branch**:

```bash
git checkout -b feature/terraform-automation
```

You're halfway through modifying some files:

* `main.tf`
* `variables.tf`

You have **not committed** anything yet, and suddenly your **team lead asks you to fix a production bug** on the `main` branch immediately.

But Git won’t let you switch branches because of uncommitted changes.

#### ❌ Problem

```bash
$ git checkout main
error: Your local changes to the following files would be overwritten by checkout:
    main.tf
    variables.tf
```

You don’t want to:

* Commit half-done code
* Discard your work
* Copy-paste to a text file (unprofessional)

***

### ✅ Solution: Use `git stash`

#### 🧪 Step-by-Step Workflow

{% stepper %}
{% step %}
## Check your changes

```bash
git status
```
{% endstep %}

{% step %}
## Stash the changes

```bash
git stash
```

This will **stash** all staged and unstaged changes. Now your working directory is clean.

Optionally, you can give it a name:

```bash
git stash save "WIP: Terraform automation half done"
```
{% endstep %}

{% step %}
## Switch to `main`

```bash
git checkout main
```
{% endstep %}

{% step %}
## Fix the bug, commit, and push

```bash
# Fix the bug
git commit -am "Fixed prod env bug in S3 bucket creation"
git push origin main
```
{% endstep %}

{% step %}
## Switch back to the feature branch

```bash
git checkout feature/terraform-automation
```
{% endstep %}

{% step %}
## Apply the stash

```bash
git stash pop
```

Now your changes are back in place as if nothing ever happened.
{% endstep %}
{% endstepper %}

***

### ✅ Other `git stash` Commands

| Command                     | What it does                            |
| --------------------------- | --------------------------------------- |
| `git stash list`            | See all stashes saved                   |
| `git stash show`            | Show summary of most recent stash       |
| `git stash apply stash@{1}` | Apply a specific stash without deleting |
| `git stash drop stash@{0}`  | Delete a specific stash                 |
| `git stash clear`           | Delete all stashes                      |

***

### ✅ Real-Time Analogy

> **"Imagine writing a WhatsApp message to your friend and someone calls you urgently. You can’t lose what you typed. You minimize the chat (stash it), take the call (fix bug), and then return to finish your message (pop the stash)."**

# git reset

Git reset is a command in the Git version control system used to reset the current state of the repository to a specified point. It’s a powerful tool that allows you to undo changes, unstage files, and move the HEAD pointer to a different commit or branch.

The `git reset` command is used to undo the changes in your working directory and get back to a specific commit while discarding all the commits made after that one.

Before using `git reset`, it is important to consider the type of changes you plan to make; otherwise, you will create more chaos than good.

You can use multiple options along with `git reset`, but these are the main ones. Each one is used depending on a specific situation: `git reset --soft`, `git reset --mixed`, and `git reset --hard`

## Soft Reset

This mode preserves the changes you’ve made in your working directory and staging area but moves the HEAD pointer to a different commit. It effectively “undoes” commits without deleting any changes.

The `--soft` aims to change the HEAD (where the last commit is in your local machine) reference to a specific commit. For instance, if we realize that we forgot to add a file to the commit, we can move back using the `--soft` with respect to the following format:

* `git reset --soft <commit ID>` moves back to the head with the `<commit ID>`
* `git reset --soft HEAD~n` to move back to the commit with a specific reference (n).
* `git reset --soft HEAD~1` gets back to the last commit.

Let’s look at some examples.

```bash
git add test.py data.py
git add test
git commit -m "added test file and data file"
```

This is the result of the previous command.

```
[master (root-commit) faf864e] added test file and data file
2 files changed, 0 insertions(+), 0 deletions(-)
create mode 100644 test.py
create mode 100644 data.py
```

We can check the status of the commit as follows:

```
git status
On branch master
Untracked files:
(use "git add <file>..." to include in what will be committed)
demofile.py
nothing added to commit but untracked files present (use "git add" to track)
```

But, we forgot to add the demofile.py script to the commit.

Since the last commit is located at the HEAD, we can fix this issue by running the following three statements.

{% stepper %}
{% step %}
## Get back to the pre-commit phase

Use `git reset --soft HEAD` allowing git reset file.

```bash
git reset --soft HEAD
```
{% endstep %}

{% step %}
## Add the forgotten file

```bash
git add demofile.py
```
{% endstep %}

{% step %}
## Make the changes with a final commit

```bash
git commit -m "added all the python scripts"
```
{% endstep %}
{% endstepper %}

```
[master (root-commit) faf864e] added all the python scripts
3 files changed, 0 insertions(+), 0 deletions(-)
create mode 100644 test.py
create mode 100644 data.py
create mode 100644 demofile.py
```

## Mixed Reset

This is the default mode of `git reset`. It resets the HEAD pointer to a different commit, and it also resets the staging area to match the specified commit. However, it leaves your working directory unchanged, so you'll still have the changes from the commit in your files, but they won't be staged for commit.

This is the default argument for git reset. Running this command has two impacts: (1) uncommit all the changes and (2) unstage them.

Imagine that we accidentally added the test.py file, and we want to remove it because the test is not finished yet.

Here is how to proceed:

* Unstage the files that were in the commit with git reset HEAD
* Only add the files we need for the commit

```
git reset HEAD
git status
On branch master
Untracked files:
(use "git add <file>..." to include in what will be committed)
test.py
data.py
demofile.py
nothing added to commit but untracked files present (use "git add" to track)
```

Now we can add only the last two files to be committed and make the commit.

```bash
git add data.py demofile.py
git commit -m "Removed the test.py from the commit"
```

## Hard Reset

This mode resets the HEAD pointer to a different commit and completely discards all changes in both the staging area and the working directory. It effectively reverts your repository to the state of the specified commit.

{% hint style="danger" %}
This option has the potential of being dangerous. So, be cautious when using it!
{% endhint %}

Basically, when using the hard reset on a specific commit, it forces the HEAD to get back to that commit and deletes everything else after that.

### `1. git reset --hard`

Here’s an example of how you can use `git reset --hard` with a practical scenario:

Let’s say you have a Git repository with the following commit history:

```
* 7856f73 (HEAD -> main) Commit D
* a6b2c9e Commit C
* e75a4d2 Commit B
* d93cfe1 Commit A
```

And your current state looks like this:

* You have some changes in your working directory and staging area.
* You realize that you want to discard these changes and reset your repository back to the state it was in after Commit B (`e75a4d2`).

Here’s how you can achieve this using `git reset --hard`:

{% stepper %}
{% step %}
## Ensure you are on the branch where you want to perform the reset

In this case, it’s the `main` branch.

```bash
git checkout main
```
{% endstep %}

{% step %}
## Perform the hard reset to the commit you want to reset to

```bash
git reset --hard e75a4d2
```
{% endstep %}
{% endstepper %}

After executing the above commands, Git will reset your repository’s state to that of Commit B (`e75a4d2`). Any changes made after Commit B will be discarded, both in the working directory and the staging area.

Remember, using `git reset --hard` will permanently discard any uncommitted changes, so make sure you really want to discard those changes before running this command.

### `2. git checkout <commit> -- <file`

The `git checkout <commit> -- <file>` command is used to restore a specific file to its state as it existed in a particular commit. This is helpful when you want to revert changes made to a file back to a previous state without affecting other files in your working directory.

Here’s how to use it with an example:

Suppose you have the following commit history:

```
* c1a2b3d (HEAD -> main) Commit D
* a3b4c5e Commit C
* d5e6f7g Commit B
* f8g9h0i Commit A
```

And you have a file named `example.txt` that has been modified in the latest commit (`Commit D`), but you want to revert it back to its state as it existed in `Commit B`.

Here’s the command to achieve that:

```bash
git checkout d5e6f7g -- example.txt
```

In this command:

* `d5e6f7g` is the commit hash of `Commit B`.
* `example.txt` is the name of the file you want to restore.

After running this command, `example.txt` will be reverted to its state as it existed in `Commit B`, and the changes made to it in subsequent commits will be discarded.

Remember, using `git checkout <commit> -- <file>` affects only the specified file and does not modify the commit history.

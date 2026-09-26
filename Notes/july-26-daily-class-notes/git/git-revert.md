# git revert

In Git, `git revert` is a command used to create a new commit that undoes the changes made by a specific commit or commits, effectively reverting the repository's state back to how it was before those changes were introduced. Unlike `git reset`, which alters commit history, `git revert` works by creating a new commit that inversely applies the changes introduced by the specified commit(s).

`git revert` is similar to `git reset`, but the approach is slightly different. Instead of removing commits, the revert ONLY undoes a single commit by taking you back to the staged files before the commit.

Here’s a basic overview of how `git revert` works:

* Identify the Commit to Revert: Determine the commit(s) that introduced changes you want to revert.
* Use Git Revert Command: Execute the `git revert` command followed by the commit hash or range of commits you want to revert.
* Resolve Conflicts (if any): Git may prompt you to resolve conflicts if the revert conflicts with subsequent changes in the repository. Resolve conflicts as needed and continue the revert process.
* Commit the Revert: Once conflicts are resolved (if any), Git will open a text editor for you to provide a commit message for the new revert commit. Save and exit the editor to complete the revert process.

{% hint style="info" %}
git revert is useful when you want to undo commits that have already been pushed to a remote repository. It is a safe option because it does not destroy any commits and leaves a clear record of the changes made in the repository.

Note: git revert can only directly undo commits that have not been merged into other branches. If you need to undo commits that are part of a merged branch, consider using `git reset` or another method appropriate for your workflow.
{% endhint %}

The basic syntax for `git revert` is:

```bash
git revert <commit>
```

You can also revert multiple commits by specifying their hashes:

```bash
git revert <commit1> <commit2> ...
```

`<commit>` can be a single commit hash, a branch name, or a range of commits (specified using `..`).

It’s important to note that `git revert` does not erase history but rather adds new commits to undo the changes introduced by previous commits. This makes it a safer option for reverting changes, especially in shared repositories where altering history using commands like `git reset` can cause conflicts for other collaborators.

## Example: revert a commit

{% stepper %}
{% step %}
### Create files

Create two new files:

```bash
touch test.py data.py
```
{% endstep %}

{% step %}
### Stage files

Add them to the staging area:

```bash
git add test.py data.py
```
{% endstep %}

{% step %}
### Check status

View the status:

```bash
git status
Changes to be committed:
(use "git rm --cached <file>..." to unstage)
new file:   test.py
new file:   data.py
```
{% endstep %}

{% step %}
### Commit

Commit the changes:

```bash
git commit -m "Added the data script files"
[master (root-commit) eae84e7] Added the monitoring script files
2 files changed, 0 insertions(+), 0 deletions(-)
create mode 100644 test.py
create mode 100644 data.py
```
{% endstep %}

{% step %}
### Revert the commit

If the previous commit was not intentional, revert it:

```bash
git revert eae84e7
[master c61ef6b] Revert "Added the data script files"
2 files changed, 0 insertions(+), 0 deletions(-)
delete mode 100644 test.py
delete mode 100644 data.py
```

This creates a new commit that undoes the changes introduced by the commit with hash `eae84e7`.
{% endstep %}

{% step %}
### Inspect the log

View the commit log:

```bash
git log
commit c61ef6b4e86f41f47c8c77de3b5fca3945a7c075 (HEAD -> master)
Author: Megha <megha@gmail.com>
Revert "Added the monitoring script files"
This reverts commit eae84e7669af733ee6c1b854f2fcd9acfea9d4a3.

commit eae84e7669af733ee6c1b854f2fcd9acfea9d4a3
Author: Megha <megha@gmail.com>
Added the monitoring script files
```

From the log, you can see a new commit (ID c61ef6b4e86f41f47c8c77de3b5fca3945a7c075) reverses the original commit (ID eae84e7669af733ee6c1b854f2fcd9acfea9d4a3).
{% endstep %}
{% endstepper %}

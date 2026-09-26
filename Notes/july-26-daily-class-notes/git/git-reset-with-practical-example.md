# git reset with practical example

Through our workflow with git as developers, we occasionally need to undo changes that we did to our code, and that is when we want to use `git reset`.

But, if I’m being honest, sometimes that can be confusing, and even scary, to use `git reset`. I used to find this command a “black box” that I don’t know exactly what it does, but I do know that I’m scared that I might delete somehow parts of my code that I want to keep, or even somehow destroy the entire project.

In this post we’ll look at git in general, and specifically `git reset`, to understand it. This assumes you have at least a basic familiarity with git and know basic commands.

## How git works

We can think about git as a content manager that manages three trees:

1. The Head: points to our last commit.
2. The index: points to our next commit. After we use `git add`, the files we performed that command on are going to the staging area.
3. The Working Directory (Working Tree): The place we work on our actual files in the project, before adding them to our staging area.

{% hint style="info" %}
The Head and the Index store their data inside the `.git` directory.
{% endhint %}

## Basic lifecycle

Usually, after adding a new file to our repository, we will have the following cycle:

* Make changes to our file.
* Stage our file.
* Commit our file.
* Push our file to our remote repository.

Step 1 happens in the working tree (we made changes but did not stage those yet).\
Step 2 happens in the index (we staged the changes, but did not commit yet).\
Step 3 happens in the head (we committed; from there we push those changes to our remote repository).

## Using git reset

Now that we understand git better, we can continue to the `git reset` command. There are two parts to `git reset`:

* The commit we go back to.
* In which trees we want to keep our changes.

To control the second part, `git reset` provides three “flags”:

* soft: remove the changes from the Head tree, and keep them in the index and the working directory trees.
* mixed: remove the changes from the Head and the Index trees, and keep them in the working directory tree.
* hard: remove the changes from all three trees.

Below is a practical example that demonstrates how these behave.

{% stepper %}
{% step %}
## Create file1.txt and commit it

Initialize a repo and create `file1.txt`. After creating it, `git status` shows it as untracked.

Example commands and outputs:

```bash
git status

# On branch master

# No commits yet

# Untracked files:

#   (use "git add <file>..." to include in what will be committed)

#         file1.txt

# nothing added to commit but untracked files present (use "git add" to track)
```

Right now `file1.txt` exists only in the working directory, not in the index (it's untracked). Add it to the index and re-run `git status`:

```bash
git add file1.txt

git status

# On branch master

# No commits yet

# Changes to be committed:

#   (use "git rm --cached <file>..." to unstage)

#         new file:   file1.txt
```

Now commit it and check status again:

```bash
git commit -m "our first file"

# [master (root-commit) 7ed5dc0] our first file

# 1 file changed, 0 insertions(+), 0 deletions(-)

# create mode 100644 file1.txt

git status

# On branch master

# nothing to commit, working tree clean
```

At this stage, all three trees (HEAD, index, working directory) are synced.
{% endstep %}

{% step %}
## Add file2.txt, commit it, then use mixed reset

Add `file2.txt` and perform the cycle again:

```bash
git status

# On branch master

# Untracked files:

#   (use "git add <file>..." to include in what will be committed)

#         file2.txt

# nothing added to commit but untracked files present (use "git add" to track)

git add file2.txt

git status

# On branch master

# Changes to be committed:

#   (use "git restore --staged <file>..." to unstage)

#         new file:   file2.txt

git commit -m "added file 2"

# [master 742c271] added file 2

# 1 file changed, 0 insertions(+), 0 deletions(-)

# create mode 100644 file2.txt

git status

# On branch master

# nothing to commit, working tree clean
```

View the two commits:

```bash
git log

# commit 742c2713887c8b0056bea68d32f542807dca2324 (HEAD -> master)

# Author: Yair <yair543210@gmail.com>

# Date: ...

#
#     added file 2

#
# commit 7ed5dc012974aa577184f71077d02ccc63653225

# Author: Yair <yair543210@gmail.com>

# Date: ...

#
#     our first file
```

Now use `git reset` to go back to the first commit (without flags):

```bash
git reset 7ed5dc012974aa577184f71077d02ccc63653225
```

Then check status:

```bash
git status

# On branch master

# Untracked files:

#   (use "git add <file>..." to include in what will be committed)

#         file2.txt
```

When `git reset` was used without any flag, git used the mixed flag by default. That means changes from the second commit were removed from HEAD and the index, but stayed in the working directory. Stage and commit the file again:

```bash
git add file2.txt
git commit -m "added file 2 again"

# [master c211158] added file 2 again

# 1 file changed, 0 insertions(+), 0 deletions(-)

# create mode 100644 file2.txt
```

Now `git log` shows the first commit and this new commit:

```bash
git log

# commit c211158cee7a04c1cba4c7e10a2474c64b298d1c (HEAD -> master)

# Author: Yair <yair543210@gmail.com>

# Date: ...

#
#     added file 2 again

#
# commit 7ed5dc012974aa577184f71077d02ccc63653225

# Author: Yair <yair543210@gmail.com>

# Date: ...

#
#     our first file
```
{% endstep %}

{% step %}
## Hard reset to the first commit

Now use `git reset` with the `--hard` flag to go back to the first commit:

```bash
git reset --hard 7ed5dc012974aa577184f71077d02ccc63653225

# HEAD is now at 7ed5dc0 our first file

git status

# On branch master

# nothing to commit, working tree clean
```

When using the `--hard` flag we deleted everything that was done after the commit we went back to. Because another file (`file2.txt`) was created after that commit, that file is gone:

```bash
ls

# file1.txt

# (file2.txt is no longer present)
```
{% endstep %}
{% endstepper %}

## Conclusion

Using `git reset` can be beneficial when you understand what it does. Try these commands in a safe environment (a throwaway repo) to gain confidence — small examples and experimentation are the best way to learn.

Notes and references in the original article were authored by Yair Mishnayot.

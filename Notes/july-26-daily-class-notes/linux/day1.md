# day1

1. `pwd`
2. `cd /home/path`
3. `cd ..`
4. `ls`
5. `ls -l`
6. `ls -lt`
7. `ls -ltr`
8. `mkdir directory_name`
9. `mkdir dir1 dir2 dir3`
10. `rm -r d1 d2`
11. `touch file_name`
12. `touch f1 f2 f3`
13. `vi filename i --> insert :wq --> write and quit :q --> quit :set nu or :set number`
14. `cat filename`

Here is the explanation of the commands you listed. These are the "daily driver" commands for any Linux user or DevOps engineer.

## 1. Navigation Commands (Moving around)

* `pwd`
  * Meaning: Print Working Directory.
  * What it does: Shows you exactly where you are in the system right now.
  * _Example Output:_ `/home/user/projects`
* `cd /home/path`
  * Meaning: Change Directory.
  * What it does: Teleports you straight to the specific folder you typed.
* `cd ..`
  * Meaning: Go Up one level.
  * What it does: Moves you out of the current folder into the one before it (the parent folder).
  * _Example:_ If you are in `/home/user/downloads`, typing `cd ..` takes you to `/home/user`.

## 2. Listing Commands (Seeing what you have)

* `ls`
  * Meaning: List.
  * What it does: Shows the names of files and folders in your current directory.
* `ls -l`
  * Meaning: List Long.
  * What it does: Shows details: File permissions, Owner, Size, and Date Modified.
* `ls -lt`
  * Meaning: List Long + Time.
  * What it does: Sorts the list by time, with the newest files at the top.
* `ls -ltr`
  * Meaning: List Long + Time + Reverse.
  * What it does: Sorts by time but reverses the order (Oldest at top, Newest at bottom).
  * _Why use this?_ This is the "Log Reader's Best Friend." When you run it, the most recently changed file appears right above your cursor so you don't have to scroll up to find it.

## 3. Creation & Deletion (Making and removing)

* `mkdir directory_name`
  * Meaning: Make Directory.
  * What it does: Creates a new folder.
* `mkdir dir1 dir2 dir3`
  * What it does: Creates multiple folders at the same time.
* `rm -r d1 d2`
  * Meaning: Remove Recursive.
  * What it does: Deletes the folders `d1` and `d2` and everything inside them.

{% hint style="warning" %}
Be careful! There is no "Recycle Bin" in the Linux command line. Once you `rm`, it is gone forever.
{% endhint %}

* `touch file_name`
  * What it does: Creates an empty file.

{% hint style="info" %}
If the file already exists, it updates the timestamp (makes it look like it was just modified) but doesn't change the content.
{% endhint %}

* `touch f1 f2 f3`
  * What it does: Creates multiple empty files at once.

## 4. Editing & Viewing Files

* `cat filename`
  * Meaning: Catch (Concatenate).
  * What it does: Dumps the content of a file onto the screen. Great for reading short files quickly.
* `vi filename`
  * What it does: Opens the Vi Editor. This is the standard text editor in Linux.

**How to use it (The Workflow):**

{% stepper %}
{% step %}
## Open file

`vi filename` (You start in Command Mode—you cannot type text yet).
{% endstep %}

{% step %}
## Enter Insert Mode

`i`: Press `i` to enter Insert Mode. (Now you can type like a normal notepad).
{% endstep %}

{% step %}
## Exit Insert Mode

`Esc`: Press the `Esc` key to exit Insert Mode and go back to Command Mode.
{% endstep %}

{% step %}
## Turn on line numbers

`:set nu`: Turns on line numbers (helps you find errors).
{% endstep %}

{% step %}
## Save and quit

`:wq`: Write (Save) and Quit.
{% endstep %}

{% step %}
## Quit without saving

`:q`: Quit (Use this if you haven't made any changes).
{% endstep %}
{% endstepper %}

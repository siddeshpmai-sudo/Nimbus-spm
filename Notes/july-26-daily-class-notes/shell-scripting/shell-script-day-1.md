# Shell Script Day 1

## 🎯 What You Will Learn Today

* What a shell script is and why it matters in DevOps
* How to write, save, and run your first shell script
* Positional arguments and variables
* `if-else` conditions with comparison operators
* Special global variables (`$?`, `$$`, `$#`, `$*`, `$@`)

***

## 💡 Why Shell Scripting?

Imagine you are a DevOps Engineer managing **100 servers**.\
Every Monday you need to check disk space, restart failed services, and clean up old logs — on all 100 servers.

You cannot do this manually. That is exactly **why we write Shell Scripts.**

A shell script is a file containing a sequence of Linux commands that runs automatically.

**In DevOps, shell scripting is used for:**

* ✅ Server health monitoring
* ✅ Automating deployments
* ✅ Log management and cleanup
* ✅ Scheduled tasks (Cron Jobs)

***

## 🐚 Part 1 – Shell Basics

### Check your default shell

```bash
echo $SHELL
```

This tells you which shell is currently active.\
Most Linux systems use `/bin/bash`.

***

### The Shebang Line `#!/bin/bash`

Every shell script **must start** with this line:

```bash
#!/bin/bash
```

* `#!` is called the **shebang**
* It tells the OS: _"Use the bash shell to run this file"_
* Without it, the OS may not know how to execute the script

***

### 🔴 exp1.sh – Your First Script

```bash
#!/bin/bash
echo "Hi"
echo "This is DevOps class"
echo "Started on July"
```

{% stepper %}
{% step %}
## Step 1 — Create the file

```bash
vi exp1.sh
```
{% endstep %}

{% step %}
## Step 2 — Give execute permission

```bash
chmod +x exp1.sh
```
{% endstep %}

{% step %}
## Step 3 — Run it (three methods)

```bash
./exp1.sh        # Method 1 – Direct execution
bash exp1.sh     # Method 2 – Using bash explicitly
sh exp1.sh       # Method 3 – Using sh
```

> 💡 All three methods work. `./exp1.sh` requires execute permission (`chmod +x`).\
> `bash exp1.sh` and `sh exp1.sh` do not need execute permission.
{% endstep %}
{% endstepper %}

***

## 📥 Part 2 – Positional Arguments

Instead of hardcoding values in your script, you can **pass values at runtime** as arguments.

### Positional Variables

| Variable         | Meaning                                       |
| ---------------- | --------------------------------------------- |
| `$0`             | The script name itself                        |
| `$1`             | First argument                                |
| `$2`             | Second argument                               |
| `$3` – `$9`      | 3rd to 9th argument                           |
| `${10}`, `${11}` | 10th argument onwards — must use curly braces |

***

### 🔴 exp2.sh – Using Arguments

```bash
#!/bin/bash
echo "This is $1 class"
echo "Started on $2"
```

**Run it:**

```bash
./exp2.sh DevOps July
```

**Output:**

```bash
This is DevOps class
Started on July
```

> 💡 Try running it without arguments. The variables will be empty.

***

## 📦 Part 3 – Variables in Shell Scripts

Variables let you store and reuse values inside the script.

### Syntax

```bash
variable_name="value"
echo $variable_name
```

> ⚠️ **Important:** No spaces around the `=` sign.\
> ✅ Correct: `name="Test"`\
> ❌ Wrong: `name = "Test"` → This will cause an error

***

### 🔴 exp3.sh – Using Variables

```bash
#!/bin/bash
name="Test"
month="July"
num="2024"
echo "This is $name platform and month is $month"
echo "The number will be $num"
```

**Run it:**

```bash
./exp3.sh
```

***

## 🔀 Part 4 – `if-else` Conditions

### Syntax

```bash
if [ condition ]
then
    commands
else
    commands
fi
```

> 💡 `fi` is `if` reversed — it **closes** the if block. Every `if` needs a `fi`.

***

### Comparison Operators

These are used inside `[ ]` to compare numbers:

| Operator | Meaning                  |
| -------- | ------------------------ |
| `-eq`    | equal to                 |
| `-ne`    | not equal to             |
| `-lt`    | less than                |
| `-le`    | less than or equal to    |
| `-gt`    | greater than             |
| `-ge`    | greater than or equal to |

***

### 🔴 exp4.sh – Check if a Number Equals 5

```bash
#!/bin/bash
if [ $1 -eq 5 ]
then
    echo "$1 is Five"
else
    echo "$1 is not Five"
fi
```

```bash
./exp4.sh 5     # Output: 5 is Five
./exp4.sh 10    # Output: 10 is not Five
```

***

### 🔴 exp5.sh – Biggest of Two Numbers

```bash
#!/bin/bash
if [ $1 -gt $2 ]
then
    echo "$1 is Big"
else
    echo "$2 is Big"
fi
```

```bash
./exp5.sh 10 25    # Output: 25 is Big
```

***

### 🔴 exp6.sh – Validate Arguments Before Running

Good scripts check for correct input before doing any work.

```bash
#!/bin/bash
if [ $# -ne 2 ]
then
    echo "Enter only two arguments"
    exit
fi
if [ $1 -gt $2 ]
then
    echo "$1 is Big"
else
    echo "$2 is Big"
fi
```

```bash
./exp6.sh 10          # Output: Enter only two arguments
./exp6.sh 10 25       # Output: 25 is Big
```

> 💡 `$#` holds the total number of arguments passed.\
> `exit` immediately stops the script.

***

## 🌐 Part 5 – Special Global Variables

Bash automatically provides these built-in variables in every script:

| Variable   | Meaning                                                         | Example                    |
| ---------- | --------------------------------------------------------------- | -------------------------- |
| `$0`       | Name of the script                                              | `./exp1.sh`                |
| `$1`, `$2` | Positional arguments                                            | `./script.sh hello world`  |
| `$#`       | Total number of arguments                                       | `3` if 3 args passed       |
| `$*`       | All arguments as one string                                     | `"a b c"`                  |
| `$@`       | All arguments as an array                                       | `["a", "b", "c"]`          |
| `$?`       | Exit status of last command — `0` = success, non-zero = failure | `echo $?` after `ls` → `0` |
| `$$`       | PID of the current running script                               | `echo $$` → `1234`         |
| `$!`       | PID of the last background process                              | After `sleep 10 &`         |

### 🔴 Demo Script

```bash
#!/bin/bash
echo "Script Name    : $0"
echo "Total Arguments: $#"
echo "All Arguments  : $*"
echo "Last Exit Code : $?"
```

```bash
./demo.sh hello world 123
```

**Output:**

```bash
Script Name    : ./demo.sh
Total Arguments: 3
All Arguments  : hello world 123
Last Exit Code : 0
```

***

## 💻 Practice Exercises

Try these on your own:

### Exercise 1

Write a script that takes your name as argument and prints:\
`"Hello <name>, Welcome to DevOps!"`

### Exercise 2

Write a script that takes two numbers as arguments and prints which one is bigger.

### Exercise 3

Write a script that accepts 3 arguments and prints:

* The total number of arguments using `$#`
* All arguments together using `$*`

### Exercise 4

Write a script that:

1. Stores your name, city, and batch in variables
2. Prints: `"My name is <name>, from <city>, Batch <batch>"`

***

## 📝 Assignments

Complete these before Day 2:

1. **Biggest of 3 Numbers**\
   Write a script to find the biggest of 3 numbers passed as arguments.
2. **File or Directory Check**\
   Write a script that checks whether a given name is a file, directory, link, or does not exist.
   * If file → display content and count lines
   * If directory → list its contents
3. **Calculator Script**\
   Write a script to add, subtract, multiply, and divide two numbers.\
   Use `read` to take input from the user.
4. **Argument Validation**\
   Modify `exp6.sh` so that if only 1 argument is given, it prints a specific error message like:\
   `"Please provide exactly 2 numbers"`

***

## 🔁 Day 1 Quick Reference

| Concept              | Syntax                                   |
| -------------------- | ---------------------------------------- |
| Check shell          | `echo $SHELL`                            |
| Shebang              | `#!/bin/bash`                            |
| Create file          | `vi script.sh`                           |
| Execute permission   | `chmod +x script.sh`                     |
| Run script           | `./script.sh` or `bash script.sh`        |
| Positional argument  | `$1`, `$2`, `${10}`                      |
| Define variable      | `name="value"`                           |
| Use variable         | `echo $name`                             |
| If-else              | `if [ condition ]; then ... else ... fi` |
| Comparison operators | `-eq` `-ne` `-lt` `-gt` `-le` `-ge`      |
| Total argument count | `$#`                                     |
| All arguments        | `$*` or `$@`                             |
| Exit status          | `$?`                                     |
| Stop script early    | `exit`                                   |

***

## 📌 Coming Up – Day 2

* `for` loop
* `while` loop
* `read` command for user input
* `expr` for arithmetic
* File type checking (`-f`, `-d`, `-L`)
* Factorial script
* Real-world: Disk space monitor + Service checker + File cleanup
* Introduction to **Cron Jobs**

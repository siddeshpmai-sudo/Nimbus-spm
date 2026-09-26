# Shell Script Day 2

## Duration: 2 Hours | DevOps Batch

## What You Will Learn Today

* How to use `for` and `while` loops
* How to take user input using `read`
* How to do arithmetic using `expr`
* How to check file types using `-f`, `-d`, `-L`
* How to write real-world production scripts
* How to schedule scripts using **Cron Jobs**

## Day 1 Recap — Quick Check

Before we start, make sure you are confident with:

| Concept             | Syntax                                   |
| ------------------- | ---------------------------------------- |
| Shebang             | `#!/bin/bash`                            |
| Run script          | `./script.sh`                            |
| Positional argument | `$1`, `$2`                               |
| Define variable     | `name="value"`                           |
| If-else             | `if [ condition ]; then ... else ... fi` |
| Comparison          | `-eq` `-ne` `-lt` `-gt` `-le` `-ge`      |
| Argument count      | `$#`                                     |
| Exit status         | `$?`                                     |

## Today's Schedule

| Time        | Topic                             |
| ----------- | --------------------------------- |
| 0:00 – 0:10 | Day 1 assignment review           |
| 0:10 – 0:30 | `for` loop                        |
| 0:30 – 0:55 | `while` loop + `expr` arithmetic  |
| 0:55 – 1:15 | `read` command + file type checks |
| 1:15 – 1:35 | Real-world scripts                |
| 1:35 – 1:50 | Cron Jobs                         |
| 1:50 – 2:00 | Assignments & Recap               |

## Part 1 – `for` Loop

### Syntax

```bash
for i in List
do
    commands
done
```

* Runs the block **once for each item** in the list
* `i` stores the current item on each iteration

### Example 1 – Loop Over Names

```bash
#!/bin/bash
for i in Alice Bob Charlie
do
    echo "Hello $i"
done
```

**Output:**

```bash
Hello Alice
Hello Bob
Hello Charlie
```

### Example 2 – Loop Over Numbers

```bash
#!/bin/bash
for i in 1 2 3 4 5
do
    echo "Number: $i"
done
```

### Example 3 – Sum All Arguments Using `$*`

```bash
#!/bin/bash
sum=0
for i in $*
do
    sum=`expr $sum + $i`
done
echo "Sum = $sum"
```

**Run it:**

```bash
./sum.sh 10 20 30 40
```

**Output:**

```bash
Sum = 100
```

{% hint style="info" %}
`$*` gives all arguments. The `for` loop picks them one by one.\
`expr` performs integer arithmetic using backtick evaluation.
{% endhint %}

### Example 4 – Loop Over Services

```bash
#!/bin/bash
for service in nginx apache2 mysql
do
    echo "Checking: $service"
done
```

{% hint style="info" %}
This pattern is used in real service monitoring scripts — you will write one later today.
{% endhint %}

## Part 2 – `while` Loop + `expr` Arithmetic

### Syntax

```bash
while [ condition ]
do
    commands
done
```

* Keeps running **as long as the condition is true**
* Best used when the number of iterations is not known in advance

### `expr` – Arithmetic in Bash

```bash
result=`expr $a + $b`    # Addition
result=`expr $a - $b`    # Subtraction
result=`expr $a \* $b`   # Multiplication  ← escape the *
result=`expr $a / $b`     # Division
```

{% hint style="warning" %}
Always wrap `expr` in backticks `` ` ``.\
For multiplication, write `\*` not `*` — the `*` must be escaped in shell.
{% endhint %}

### Factorial Script Using `while`

```bash
#!/bin/bash
num=$1
fact=1
while [ $num -gt 0 ]
do
    fact=`expr $fact \* $num`
    num=`expr $num - 1`
done
echo "The factorial of $1 is $fact"
```

**Run it:**

```bash
./factorial.sh 5
```

**Output:**

```bash
The factorial of 5 is 120
```

**Step-by-step trace:**

| Iteration | `num` | `fact` calculation | `fact` result |
| --------- | ----- | ------------------ | ------------- |
| 1         | 5     | 1 × 5              | 5             |
| 2         | 4     | 5 × 4              | 20            |
| 3         | 3     | 20 × 3             | 60            |
| 4         | 2     | 60 × 2             | 120           |
| 5         | 1     | 120 × 1            | 120           |
| Exit      | 0     | condition is false | —             |

### Calculator Script (using `read` + `expr`)

```bash
#!/bin/bash
echo "Enter Num1:"
read num1
echo "Enter Num2:"
read num2

add=`expr $num1 + $num2`
mul=`expr $num1 \* $num2`

if [ $num1 -gt $num2 ]
then
    sub=`expr $num1 - $num2`
    div=`expr $num1 / $num2`
else
    sub=`expr $num2 - $num1`
    div=`expr $num2 / $num1`
fi

echo "Addition       = $add"
echo "Subtraction    = $sub"
echo "Multiplication = $mul"
echo "Division       = $div"
```

{% hint style="info" %}
`read` pauses the script and waits for you to type a value, then stores it in the variable.
{% endhint %}

## Part 3 – `read` Command + File Type Checks

### `read` Command

```bash
read variable_name
```

Pauses the script and stores whatever the user types into `variable_name`.

### File Test Flags

Use these inside `if` conditions to check what type of path something is:

| Flag | Checks                 |
| ---- | ---------------------- |
| `-f` | Is it a regular file?  |
| `-d` | Is it a directory?     |
| `-L` | Is it a symbolic link? |

### File, Directory, or Link Check

```bash
#!/bin/bash
echo "Enter the name to check:"
read name

if [ -f $name ]
then
    echo "The contents of $name are:"
    cat $name
    echo "Number of lines = `wc -l $name`"
elif [ -d $name ]
then
    echo "List of files and directories in $name:"
    ls $name
elif [ -L $name ]
then
    echo "$name is a symbolic link"
else
    echo "$name does not exist"
fi
```

**Run it:**

```bash
./checktype.sh
```

Try entering: `/etc/passwd` (file), `/etc` (directory), or any name that doesn't exist.

### Biggest of 3 Numbers

```bash
#!/bin/bash
if [ $1 -gt $2 ] && [ $1 -gt $3 ]
then
    echo "$1 is big"
elif [ $2 -gt $3 ]
then
    echo "$2 is big"
else
    echo "$3 is big"
fi
```

{% hint style="info" %}
`&&` means **AND** — both conditions on either side must be true.
{% endhint %}

```bash
./biggest3.sh 10 45 30
# Output: 45 is big
```

## Part 4 – Real-World Scripts

### Script 1 – Disk Space Monitor

This type of script is run automatically every hour in production environments.\
If disk usage crosses 90%, it sends an alert email.

```bash
#!/bin/bash
space=`df -h . | tail -1 | awk -F " " '{print $5}' | sed 's/%//g'`
if [ $space -ge 90 ]
then
    echo "Disk is full, Please take appropriate action." | mail -s "Disk memory full" admin@company.com
fi
```

**How the pipeline works — step by step:**

| Step | Command                   | What it does                            |
| ---- | ------------------------- | --------------------------------------- |
| 1    | `df -h .`                 | Show disk usage of current directory    |
| 2    | `tail -1`                 | Keep only the last data line            |
| 3    | `awk -F " " '{print $5}'` | Extract column 5 — the `Use%` value     |
| 4    | `sed 's/%//g'`            | Remove the `%` so we get a plain number |

Run each step on its own to see the output build up:

```bash
df -h .
df -h . | tail -1
df -h . | tail -1 | awk -F " " '{print $5}'
df -h . | tail -1 | awk -F " " '{print $5}' | sed 's/%//g'
```

{% hint style="info" %}
This is a core DevOps pattern — piping commands to extract exactly what you need.\
This is also a very common **interview question**.
{% endhint %}

### Script 2 – Service Status Checker

Checks if each service is running. If stopped, prints an alert.

```bash
#!/bin/bash
services="tomcat apache2 java"
for i in $services
do
    temp=`sudo service $i status`
    if [ $? -ne 0 ]
    then
        echo "$i service is stopped – please take action"
    fi
done
```

{% hint style="info" %}
`$?` is the exit status of the last command.\
`0` = success (service is running)\
non-zero = failure (service is stopped) → we print the alert
{% endhint %}

### Script 3 – Keep Only 20 Recent Files

Useful for log directories that fill up over time.\
Keeps the 20 most recent files and deletes everything older.

```bash
#!/bin/bash
allfiles=`ls | wc -l`
echo "Total files and directories: $allfiles"
extrafiles=`expr $allfiles - 20`
echo "Extra files to delete: $extrafiles"
if [ $extrafiles -gt 0 ]
then
    ls -rt | head -$extrafiles | xargs rm -rf
fi
```

**How it works:**

| Command               | What it does                   |
| --------------------- | ------------------------------ |
| `ls \| wc -l`         | Count total files in directory |
| `expr $allfiles - 20` | Calculate how many are extra   |
| `ls -rt`              | List files oldest first        |
| `head -$extrafiles`   | Pick the oldest N files        |
| `xargs rm -rf`        | Delete them                    |

## Part 5 – Cron Jobs

Cron Jobs let you **schedule scripts to run automatically** at a specific time — daily, hourly, or weekly.

### Cron Field Format

```
* * * * * /path/to/script.sh
│ │ │ │ │
│ │ │ │ └── Day of week  (0 = Sunday, 6 = Saturday)
│ │ │ └──── Month        (1 – 12)
│ │ └────── Day of month (1 – 31)
│ └──────── Hour         (0 – 23)
└────────── Minute       (0 – 59)
```

### Cron Commands

```bash
crontab -l    # List all your scheduled cron jobs
crontab -e    # Open editor to add/edit cron jobs
```

### Common Examples

| Expression     | Meaning                              |
| -------------- | ------------------------------------ |
| `* * * * *`    | Every single minute                  |
| `0 * * * *`    | Every hour (at :00)                  |
| `0 9 * * *`    | Every day at 9:00 AM                 |
| `0 0 * * 0`    | Every Sunday at midnight             |
| `30 1 28 12 3` | Dec 28 at 1:30 AM, only on Wednesday |

### Schedule the disk space script to run every hour

```bash
crontab -e
```

Add this line:

```
0 * * * * /home/ubuntu/diskcheck.sh
```

Save and exit. The script will now run automatically every hour.

## Practice Exercises

Try these on your own:

1. Write a `for` loop to print numbers 1 to 10
2. Write a `while` loop that counts down from 5 to 1
3. Write a script that reads your name and city, then prints both
4. Run the disk monitor pipeline step by step and note each output

## Assignments

Complete these before Day 3:

{% stepper %}
{% step %}
## Employee Age Filter

Given a file with employee name, ID, and age — print the names of employees older than 40.

Sample file (`employee.txt`):

```
Name     Emp-ID   Age
ABC      202201   35
EFG      202202   40
HIJ      202203   38
LMN      202204   45
XYZ      202205   43
GHY      202206   42
```

Script:

```bash
#!/bin/bash
sed '1d' employee.txt > age1
while read line
do
    age=`echo "$line" | awk -F " " '{print $3}'`
    if [ $age -gt 40 ]
    then
        echo "$line" | awk -F " " '{print $1}'
    fi
done < age1
```
{% endstep %}

{% step %}
## Auto-Restart Services

Extend the service monitor script to also **restart** any service that is found to be stopped.
{% endstep %}

{% step %}
## File Cleanup with Argument

Modify the file cleanup script to accept a **directory path as an argument** instead of always running in the current directory.
{% endstep %}

{% step %}
## Factorial with `for` Loop

Rewrite the factorial script using a `for` loop instead of `while`.
{% endstep %}
{% endstepper %}

## Day 2 Quick Reference

| Concept             | Syntax                             |
| ------------------- | ---------------------------------- |
| `for` loop          | `for i in list; do ... done`       |
| `while` loop        | `while [ condition ]; do ... done` |
| User input          | `read variable`                    |
| Addition            | `` result=`expr $a + $b` ``        |
| Subtraction         | `` result=`expr $a - $b` ``        |
| Multiplication      | `` result=`expr $a \* $b` ``       |
| Division            | `` result=`expr $a / $b` ``        |
| Is a file?          | `[ -f $name ]`                     |
| Is a directory?     | `[ -d $name ]`                     |
| Is a link?          | `[ -L $name ]`                     |
| AND condition       | `[ cond1 ] && [ cond2 ]`           |
| Last command status | `$?`                               |
| List cron jobs      | `crontab -l`                       |
| Edit cron jobs      | `crontab -e`                       |

## Coming Up – Day 3

* `awk` — column-based text processing
* `sed` — find and replace in files
* `grep` — search patterns inside files
* Combining `awk`, `sed`, `grep` in pipelines
* Advanced real-world automation scripts
* Script debugging with `set -x`

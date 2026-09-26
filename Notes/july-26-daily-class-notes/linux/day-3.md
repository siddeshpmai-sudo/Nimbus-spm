# Day 3

{% hint style="info" %}
**How to use this document:**\
Each section covers one command or concept with syntax, examples, DevOps use cases, common questions, and interview tips. Try every example in your Linux terminal.
{% endhint %}

***

## 1. File Ownership – chown

### What is it?

`chown` = **ch**ange **own**er. Every file in Linux has an owner (user) and a group. `chown` lets you change either or both.

**Why it matters in DevOps:** Files created by `root` often need to be handed over to application users like `jenkins`, `ubuntu`, or `deploy`.

***

### `chown user file` — Change owner only

```bash
chown username filename
```

**Examples:**

```bash
# Hand over a file to the ubuntu user
chown ubuntu report.txt

# Hand over a config file to the jenkins user
chown jenkins config.xml

# Verify the change
ls -l report.txt
# -rw-r--r-- 1 ubuntu ubuntu 1024 Jul 16 10:00 report.txt
```

***

### `chown user:group file` — Change owner and group

```bash
chown user:group filename
```

**Examples:**

```bash
# Change owner to ubuntu, group to devops
chown ubuntu:devops report.txt

# Change both for a Jenkins config file
chown jenkins:jenkins /var/lib/jenkins/config.xml

# Change recursively for an entire directory
chown -R ubuntu:ubuntu /opt/myapp
```

**DevOps Use Cases:**

```bash
# After deploying files as root, fix ownership for jenkins
chown jenkins:jenkins /var/lib/jenkins/workspace/deploy.sh

# Fix ownership in a shared team directory
chown -R deploy:devteam /opt/releases/
```

**Practice Exercises:**

1. Create a file: `touch myfile.txt`. Check ownership: `ls -l myfile.txt`. Run `sudo chown root myfile.txt`. Check again. Then change it back: `sudo chown $(whoami) myfile.txt`.
2. Create `sudo touch /tmp/rootfile.txt`. Then: `sudo chown ubuntu:ubuntu /tmp/rootfile.txt`. Verify with `ls -l /tmp/rootfile.txt`.

<details>

<summary>Do I need sudo for chown?</summary>

Usually yes — only root can change file ownership.

</details>

<details>

<summary>Can I chown a directory?</summary>

Yes. Use \`-R\` to apply recursively to all files inside.

</details>

<details>

<summary>What if I chown to the wrong user?</summary>

Run chown again to fix it.

</details>

<details>

<summary>Does chown change permissions?</summary>

No — only ownership. Use \`chmod\` for permissions.

</details>

**Interview Answer:**

> "When a file is created by root but needs to be accessed by jenkins, I use `chown jenkins:jenkins filename` to transfer both the owner and group. I use `chown -R` for directories to fix ownership recursively."

***

## 2. Stream Editor – sed

### What is it?

`sed` = **S**tream **Ed**itor. It reads a file line by line and can **replace text**, **delete lines**, **print specific lines**, and more — without opening an editor.

**Why it matters in DevOps:** Automating config file changes, updating environment variables in `.env` files, or modifying scripts before deployment.

***

### sed Syntax Overview

```bash
sed 'address command' filename
```

| Part             | Example                 | Meaning                  |
| ---------------- | ----------------------- | ------------------------ |
| No address       | `sed 's/old/new/g'`     | Apply to all lines       |
| Line number      | `sed '2s/old/new/'`     | Apply to line 2 only     |
| Range            | `sed '10,30s/old/new/'` | Apply to lines 10–30     |
| From line to end | `sed '5,$s/old/new/'`   | Apply from line 5 to end |

***

### Replace Text — `sed 's/pattern/replacement/g'`

```bash
# Replace all occurrences of "error" with "ok" (output to terminal)
sed 's/error/ok/g' logs.txt

# Replace all "samsung" with "sony"
sed 's/samsung/sony/g' newfile

# Replace http with https in a URL file
sed 's/http/https/g' urls.txt
```

**Flags:**

| Flag | Meaning                                           |
| ---- | ------------------------------------------------- |
| `g`  | Replace ALL occurrences per line (not just first) |
| `i`  | Case-insensitive match                            |
| `gi` | Both: all occurrences, case-insensitive           |

***

### Edit File In-Place — `sed -i`

Without `-i`, `sed` prints to the terminal and the file is unchanged.\
With `-i`, `sed` modifies the file directly.

```bash
# Update the file (no terminal output)
sed -i 's/Testing/development/g' file2

# Case-insensitive in-place replace
sed -i 's/testing/development/gi' file2
```

> **Warning:** Always verify the output first without `-i` before using it to change the actual file.

***

### Replace on Specific Lines

```bash
# Replace only on line 2
sed '2s/unix/linux/g' filename

# Replace only on line 2, case-insensitive
sed '2s/testing/development/gi' file2

# Replace from line 10 to line 30
sed '10,30s/testing/development/gi' file2

# Replace from line 30 to end of file ($)
sed '30,$s/testing/development/gi' file2

# Replace the 2nd occurrence on line 2 only
sed '2s/development/devops/2' file2
```

***

### Print Specific Lines — `sed -n 'Np'`

`-n` suppresses the default output. `p` prints the matched line.

```bash
# Print only line 4
sed -n '4p' file2

# Print only line 98 (useful for large log files)
sed -n '98p' file

# Print only line 2
sed -n '2p' file2

# Print lines 10 to 20
sed -n '10,20p' file

# Print lines 10 and 25 (non-contiguous)
sed -n -e '10p' -e '25p' filename
```

**DevOps Use Case:** Someone says "the error is on line 144 of the log file." Jump straight to it:

```bash
sed -n '144p' application.log
```

***

### Delete Lines — `sed 'Nd'`

By default, this prints to terminal. Add `-i` to modify the file.

```bash
# Delete line 3 (output to terminal)
sed '3d' file2

# Delete line 30 (output to terminal)
sed '30d' file2

# Delete line 100 (output to terminal)
sed '100d' file

# Delete line 2 and save in-place
sed -i '2d' file
```

***

**DevOps Use Cases:**

```bash
# Update staging URLs to production before deployment
sed -i 's/staging.company.com/prod.company.com/g' config/.env

# Patch a config file on multiple servers (in a script)
sed -i 's/port=8080/port=9090/g' /etc/myapp/settings.conf
```

**Practice Exercises:**

1. Create a file with `echo -e "apple\nbanana\napple\ncherry" > fruits.txt`. Run `sed 's/apple/mango/g' fruits.txt`. Notice the original file is unchanged. Now run `sed -i 's/apple/mango/g' fruits.txt`. Check with `cat fruits.txt`.
2. Create `echo -e "line1\nline2\nline3\nline4\nline5" > lines.txt`. Print only line 3: `sed -n '3p' lines.txt`. Delete line 2: `sed '2d' lines.txt`.

<details>

<summary>Does sed modify the original file?</summary>

No — unless you use \`-i\`.

</details>

<details>

<summary>What does `$` mean in `30,$`?</summary>

Last line of the file.

</details>

<details>

<summary>What if I forget `g`?</summary>

Only the first match per line is replaced.

</details>

<details>

<summary>Can I use regex in sed?</summary>

Yes — sed supports basic and extended regex.

</details>

<details>

<summary>How is sed different from grep?</summary>

\`grep\` finds lines; \`sed\` also transforms them.

</details>

**Quick Quiz:**

| Question                            | Answer                            |
| ----------------------------------- | --------------------------------- |
| Which flag edits the file in-place? | `-i`                              |
| What does `g` do in `s/old/new/g`?  | Replaces all occurrences per line |
| How do you print only line 5?       | `sed -n '5p' filename`            |

***

## 3. File Copy – cp

### What is it?

`cp` = **c**o**p**y. Copies files or directories.

```bash
cp source destination
```

**Examples:**

```bash
# Copy file to another file (basic backup)
cp file file2

# Copy file to a nested directory
cp file dir1/dir2/file

# Copy with prompt before overwriting (safe mode)
cp -i file file2
cp -i file2 f4
cp -i test dir1/test

# Copy file to deeply nested path with prompt
cp -i dir1/file dir2/dir3/dir4/

# Copy an entire directory recursively
cp -r dir2 dir3
cp -r dir1 dir2/dir3/dir4

# Real-world: backup Nginx config before changes
cp -r /etc/nginx /tmp/backup_nginx
```

**DevOps Use Cases:**

```bash
# Backup config before editing
cp /etc/nginx/nginx.conf /tmp/nginx.conf.bak

# Copy a deployment artifact to the server directory
cp -r build/ /var/www/html/
```

<details>

<summary>What does <code>-i</code> do?</summary>

Asks for confirmation before overwriting an existing file.

</details>

<details>

<summary>What does <code>-r</code> do?</summary>

Copies directories recursively (all contents included).

</details>

<details>

<summary>Does cp preserve permissions?</summary>

By default, partially. Use \`cp -p\` to preserve all attributes.

</details>

<details>

<summary>What if destination directory doesn't exist?</summary>

Without \`-r\`, it fails. You may need to \`mkdir\` first.

</details>

***

## 4. Field Extraction – cut

### What is it?

`cut` extracts specific columns (fields) from each line of a file or output. It's ideal for structured text like logs, CSVs, or space-separated data.

```bash
cut -d "delimiter" -f field_number filename
```

| Part     | Meaning                                |
| -------- | -------------------------------------- |
| `-d " "` | Use space as the delimiter (separator) |
| `-f 1`   | Extract field 1 (first column)         |
| `-f 2,4` | Extract fields 2 and 4                 |

**Sample file `checklist`:**

```
2024-07-16 SUCCESS ubuntu deploy.sh
2024-07-16 FAILED jenkins build.sh
2024-07-15 SUCCESS deploy app.py
```

**Examples:**

```bash
# Extract the 1st column (dates)
cut -d " " -f1 checklist
# 2024-07-16
# 2024-07-16
# 2024-07-15

# Extract the 4th column (command names)
cut -d " " -f4 checklist
# deploy.sh
# build.sh
# app.py

# Extract 2nd and 4th columns (status and command)
cut -d " " -f2,4 checklist
# SUCCESS deploy.sh
# FAILED build.sh
# SUCCESS app.py
```

**DevOps Use Cases:**

```bash
# Extract usernames from an access log
cut -d ' ' -f3 access.log

# Get status codes from a CI/CD checklist
cut -d ' ' -f2 checklist | sort | uniq
```

<details>

<summary>What if fields are tab-separated?</summary>

Use \`-d $'\t'\` or just \`-d "\t"\`.

</details>

<details>

<summary>Can I cut by character position?</summary>

Yes — use \`-c 1-5\` for characters 1 through 5.

</details>

<details>

<summary>How is cut different from awk?</summary>

\`cut\` is simpler; \`awk\` can do conditionals, math, and more.

</details>

***

## 5. Text Processing – awk

### What is it?

`awk` is a powerful text processing tool. It processes files line by line, splitting each line into fields. It can print columns, filter rows, and even do arithmetic.

```bash
awk -F "delimiter" '{print $field_number}' filename
```

**Examples using the same `checklist` file:**

```bash
# Print 2nd column (status)
awk -F " " '{print $2}' checklist
# SUCCESS
# FAILED
# SUCCESS

# Print 4th column (command)
awk -F " " '{print $4}' checklist
# deploy.sh
# build.sh
# app.py

# Print 2nd and 4th columns together
awk -F " " '{print $2,$4}' checklist
# SUCCESS deploy.sh
# FAILED build.sh
# SUCCESS app.py
```

**DevOps Use Cases:**

```bash
# Extract username and command for audit
awk -F ' ' '{print $3,$4}' checklist

# From a log file, print lines where status is FAILED
awk -F ' ' '$2 == "FAILED" {print $0}' checklist
```

**`cut` vs `awk`:**

|                          | `cut` | `awk` |
| ------------------------ | ----- | ----- |
| Simple column extraction | Yes   | Yes   |
| Multiple delimiters      | No    | Yes   |
| Conditional logic        | No    | Yes   |
| Arithmetic               | No    | Yes   |

***

## 6. Process Management – ps & kill

### `ps -ef` — List All Processes

```bash
ps -ef
```

**Output columns:**

| Column | Meaning                   |
| ------ | ------------------------- |
| UID    | User who owns the process |
| PID    | Process ID (unique)       |
| PPID   | Parent Process ID         |
| CMD    | Command being run         |

**Searching for specific processes:**

```bash
# Search for a process by name (case-insensitive)
ps -ef | grep -i "tomcat"
ps -ef | grep -i "jenkins"

# Search for multiple services at once
ps -ef | grep -ie "jenkins" -e "tomcat"

# List all processes for a specific user
ps -u jenkins
ps -u ubuntu
ps -u $(whoami)
```

***

### `kill` and `kill -9` — Stop Processes

Linux signals:

| Signal  | Number | Meaning                                    |
| ------- | ------ | ------------------------------------------ |
| SIGTERM | 15     | Politely ask the process to stop (default) |
| SIGKILL | 9      | Forcefully kill immediately                |

**Workflow:**

```bash
# Step 1: Find the PID
ps -ef | grep "deploy.sh"
# ubuntu  6421  6100  0 10:15 pts/0  ./deploy.sh

# Step 2: Try graceful stop first
kill 6421

# Step 3: If still running, force kill
kill -9 6421

# Step 4: Verify it's gone
ps -ef | grep "deploy.sh"
```

**DevOps Use Cases:**

```bash
# Check if Jenkins and Tomcat are running
ps -ef | grep -ie "jenkins" -e "tomcat"

# Kill a hung deployment process
ps -ef | grep deploy.sh
kill -9 <PID>
```

<details>

<summary>Why not always use <code>kill -9</code>?</summary>

It gives the process no time to clean up (close files, connections, write logs). Always try \`kill\` first.

</details>

<details>

<summary>Can kill delete files?</summary>

No — it only terminates the running process.

</details>

<details>

<summary>What if I kill the wrong PID?</summary>

You could crash an important service. Always verify the PID before killing.

</details>

<details>

<summary>How do I find a PID quickly?</summary>

\`ps -ef | grep process\_name\` or \`pgrep process\_name\`.

</details>

**Interview Answer:**

> "I always try `kill PID` (SIGTERM) first to allow the process to shut down gracefully. I only use `kill -9` if the process doesn't respond, because SIGKILL doesn't allow cleanup of open files or database connections."

***

## 7. File Search – find & xargs

### `xargs` — Pass Results as Arguments

`find` lists files. `xargs` takes that list and passes it to another command like `rm`, `chmod`, or `cp`.

```
find --> list of files --> xargs --> rm / chmod / etc.
```

***

### `find` — Search for Files and Directories

```bash
find location -options
```

**Search by age:**

```bash
# Files modified more than 2 days ago
find . -type f -mtime +2

# Files modified more than 365 days ago (one year)
find . -type f -mtime +365

# Delete old files (always list first!)
find . -type f -mtime +2 | xargs rm
find /var/log/myapp -type f -mtime +7 | xargs rm
find . -type f -mtime +365 | xargs rm
```

| Option      | Meaning                       |
| ----------- | ----------------------------- |
| `-mtime +N` | Modified more than N days ago |
| `-mtime -N` | Modified within last N days   |
| `-mtime N`  | Modified exactly N days ago   |

> **Rule:** Always run `find` first to see the list. Add `| xargs rm` only after confirming.

**Search by name:**

```bash
# Case-insensitive file named "test" in current dir only
find . -type f -iname "test" -maxdepth 1

# Case-insensitive directory named "test" up to 2 levels deep
find . -type d -iname "test" -maxdepth 2

# Files OR directories named "test" in current dir
find . -iname "test" -maxdepth 1

# Find all shell scripts
find . -iname "*.sh"

# Find all YAML files
find . -iname "*.yaml"

# Find Dockerfile
find . -type f -iname "dockerfile"
```

| Option        | Meaning                            |
| ------------- | ---------------------------------- |
| `-type f`     | Files only                         |
| `-type d`     | Directories only                   |
| `-iname`      | Case-insensitive name match        |
| `-name`       | Case-sensitive name match          |
| `-maxdepth N` | Limit search to N directory levels |

**DevOps Use Cases:**

```bash
# Clean old Jenkins workspace files (>30 days)
find /var/lib/jenkins/workspace -type f -mtime +30 | xargs rm

# Find all deployment scripts in a project
find /opt/app -iname "deploy*.sh"

# Find and delete log files older than 1 year
find /var/log -type f -mtime +365 | xargs rm
```

<details>

<summary>Is <code>-iname</code> case-insensitive?</summary>

Yes — matches \`test\`, \`Test\`, \`TEST\`.

</details>

<details>

<summary>What does <code>-maxdepth 1</code> do?</summary>

Searches only the current directory, not subdirectories.

</details>

<details>

<summary>Can I use wildcards with <code>-iname</code>?</summary>

Yes: \`find . -iname "\*.log"\`.

</details>

<details>

<summary>What's the difference between find and grep?</summary>

\`find\` searches for file names/attributes; \`grep\` searches inside file contents.

</details>

***

## 8. Links – Soft & Hard

### What is an Inode?

Every file in Linux has a **filename** (label) and an **inode** (unique internal ID that holds the actual data location).

```bash
ls -li      # Shows inode numbers
# 12345 test1
# 67890 softlink   (different inode)
# 12345 hardlink   (same inode as test1)
```

***

### Soft Link (Symbolic Link) — `ln -s`

A soft link is like a Windows shortcut. It stores the _path_ to the original file.

```bash
ln -s original_file link_name
```

```bash
# Create a soft link
ln -s test1 softlink

# Create with absolute path (works across filesystems)
ln -s /home/test/test1 softlink

# Verify (look for -> arrow)
ls -l
# lrwxrwxrwx softlink -> test1
```

**What happens if the original is deleted?**

The soft link still exists but becomes **broken (dangling)** — it points to nothing.

***

### Hard Link — `ln`

A hard link creates another name for the **same inode** (same data on disk). Both names are equal — neither is the "original."

```bash
ln /home/test/test1 hardlink
```

```bash
# Both files share the same inode
ls -li
# 45678 test1
# 45678 hardlink

# Delete test1 — data still accessible via hardlink!
rm test1
cat hardlink   # Still works
```

**Hard link limitations:**

* Cannot cross filesystems (both files must be on same partition)
* Cannot link to directories

***

### Soft vs Hard Link Summary

| Feature                    | Soft Link (`ln -s`) | Hard Link (`ln`) |
| -------------------------- | ------------------- | ---------------- |
| Same inode as original     | No                  | Yes              |
| Works across filesystems   | Yes                 | No               |
| Can link directories       | Yes                 | No               |
| Breaks if original deleted | Yes                 | No               |
| Common in DevOps           | Very common         | Rare             |

**DevOps Use Cases:**

```bash
# Nginx: enable a site config via symlink
ln -s /etc/nginx/sites-available/myapp.conf \
      /etc/nginx/sites-enabled/myapp.conf

# Point 'current' to the latest deployment release
ln -s /opt/app/releases/v2 /opt/app/current

# Quick access to a deeply nested log
ln -s /var/log/myapp/application.log ~/app.log
```

**Interview Answer:**

> "A soft link stores the path to the original file and breaks if the original is deleted. It can cross filesystems and can link directories. A hard link shares the same inode as the original — deleting the original doesn't affect the hard link. Soft links are far more common in DevOps, especially for deployment version management and Nginx config enabling."

***

## 9. System Information

**First thing to do after SSH-ing into any server:**

```bash
cat /etc/os-release   # Which Linux distro?
uname -a              # Which kernel version?
hostname              # Which server am I on?
whoami                # Which user am I?
who | wc -l           # How many users are logged in?
```

***

### `uname -a` — Kernel & System Info

```bash
uname -a
# Linux ip-172-31-20-45 6.8.0-1029-aws #31-Ubuntu SMP x86_64 GNU/Linux
```

| Option     | Output                                |
| ---------- | ------------------------------------- |
| `uname`    | Just "Linux"                          |
| `uname -r` | Kernel version only: `6.8.0-1029-aws` |
| `uname -m` | Architecture: `x86_64`                |
| `uname -a` | Everything                            |

***

### `cat /etc/os-release` — Linux Distribution Info

```bash
cat /etc/os-release
# NAME="Ubuntu"
# VERSION="24.04.2 LTS"

# Get just the name
grep "^NAME=" /etc/os-release
grep "^VERSION=" /etc/os-release
```

**Why it matters:** Ubuntu uses `apt`; Amazon Linux / CentOS use `yum`/`dnf`. You need to know the distro before installing packages.

***

### `hostname` — Server Name

```bash
hostname        # ip-172-31-20-45
hostname -I     # IP address
hostname -f     # Fully qualified domain name
```

***

### `who | wc -l` — Count Logged-in Users

```bash
who         # List all sessions
who | wc -l # Count them
```

> One user connected from two terminals = two sessions.

***

### `whoami` — Current User

```bash
whoami          # ubuntu
sudo whoami     # root
echo "Running as: $(whoami)"
ps -u $(whoami) # See your own processes
```

***

## 10. Background Jobs & Monitoring

### The Problem

If you run a 2-hour deployment script over SSH and your connection drops, the script dies. Solution: `nohup`.

***

### `nohup ./script.sh &` — Run in Background, Persist After Logout

* **`nohup`** = "No Hang Up" — survives SSH disconnection
* **`&`** = runs in background (terminal stays free)

```bash
nohup ./script.sh &
# [1] 2536
# nohup: ignoring input and appending output to 'nohup.out'

# Check output
cat nohup.out

# Custom log file
nohup ./script.sh > deploy.log 2>&1 &

# Common uses
nohup ./deploy.sh &
nohup python3 app.py &
nohup java -jar app.jar &

# Find and stop it later
ps -ef | grep script.sh
kill PID
```

**Comparison:**

| Command               | Runs in Background | Survives Logout |
| --------------------- | ------------------ | --------------- |
| `./script.sh`         | No                 | No              |
| `./script.sh &`       | Yes                | No              |
| `nohup ./script.sh &` | Yes                | Yes             |

***

### `top` — Real-Time Process Monitor

```bash
top
```

Like Windows Task Manager — shows live CPU, memory, and process list.

**Key fields:**

| Field     | Meaning                     |
| --------- | --------------------------- |
| `%Cpu(s)` | CPU usage                   |
| `MiB Mem` | Total / used / free RAM     |
| `PID`     | Process ID                  |
| `%CPU`    | CPU used by that process    |
| `%MEM`    | Memory used by that process |

**Keys inside top:**

| Key | Action                     |
| --- | -------------------------- |
| `q` | Quit                       |
| `k` | Kill a process (enter PID) |
| `M` | Sort by memory             |
| `P` | Sort by CPU                |

**DevOps Use Case:** "Server is slow" → run `top` → find the process using 95% CPU → kill it.

***

## 11. SSH & File Transfer

### `ssh username@server` — Connect to Remote Server

```bash
ssh ubuntu@192.168.1.10
ssh ubuntu@dev.company.com
ssh -p 2222 ubuntu@192.168.1.10   # Custom port
```

### `ssh -i demo.pem ubuntu@IP` — Key-Based Auth (AWS EC2)

AWS EC2 uses `.pem` key files instead of passwords.

```bash
ssh -i demo.pem ubuntu@54.26.118.12
ssh -i demo.pem ec2-user@18.212.10.20   # Amazon Linux
```

> **Always set correct permissions on `.pem` files:**
>
> ```bash
> chmod 400 demo.pem
> ```
>
> SSH will refuse to use the key if it's too open (e.g., 644).

***

### `scp` — Secure Copy (One-Time File Transfer)

```bash
# Upload file to /tmp on remote server
scp file_name ubuntu@server:/tmp

# Upload to home directory
scp file_name ubuntu@server:/home/ubuntu

# Upload with key file
scp -i demo.pem report.txt ubuntu@54.26.118.12:/tmp

# Copy directory recursively
scp -r directory ubuntu@server:/path

# Download from server to local
scp ubuntu@server:/tmp/file.txt .
```

***

### `rsync` — Efficient Sync (Only Transfers Changes)

```bash
# Sync a file
rsync file ubuntu@server:/home/temp

# Sync a directory (archive mode + verbose)
rsync -av project/ ubuntu@server:/opt/project

# With SSH key
rsync -av -e "ssh -i demo.pem" project/ ubuntu@IP:/opt/project

# Sync back from remote to local
rsync -av ubuntu@server:/var/log/ ./logs
```

**`scp` vs `rsync`:**

|                | `scp`             | `rsync`              |
| -------------- | ----------------- | -------------------- |
| Transfers      | Everything always | Only changed parts   |
| Speed (repeat) | Same              | Much faster          |
| Best for       | One-time copy     | Deployments, backups |

<details>

<summary>Default SSH port?</summary>

22\.

</details>

<details>

<summary>Why <code>chmod 400</code> on <code>.pem</code>?</summary>

SSH rejects keys that are readable by others.

</details>

<details>

<summary><code>Permission denied (publickey)</code>?</summary>

Wrong user, wrong key, wrong IP, or wrong permissions.

</details>

<details>

<summary>Can Windows use SSH?</summary>

Yes — via PowerShell, Windows Terminal, or PuTTY.

</details>

***

## 12. Networking Commands

### The DevOps Troubleshooting Flow

```
Can I reach the server?            --> ping host
Can I reach the application port?  --> telnet host port
Is the application listening?      --> netstat -na | grep PORT
Check application logs
```

***

### `ping` — Test Network Reachability (ICMP)

```bash
ping google.com
ping 192.168.1.10
ping 127.0.0.1            # Loopback (your own machine)
ping -c 4 google.com      # Send exactly 4 packets
```

**Output:**

```
64 bytes from 142.250.182.14: icmp_seq=1 ttl=118 time=22 ms
```

| Field      | Meaning                                |
| ---------- | -------------------------------------- |
| `icmp_seq` | Packet number                          |
| `ttl`      | Time To Live                           |
| `time`     | Round-trip time (ms) — lower is better |

> **Note:** Linux `ping` runs forever. Use `-c 4` to stop automatically.\
> **Note:** Ping can fail even when a server is running — many servers block ICMP for security.

***

### `telnet ip port` — Test TCP Port Connectivity

```bash
telnet localhost 8080      # Check Tomcat / Jenkins
telnet 192.168.1.20 22    # Check SSH
telnet db.company.com 3306 # Check MySQL
telnet db.company.com 5432 # Check PostgreSQL
telnet redis.company.com 6379 # Check Redis
```

**Results:**

| Result                 | Meaning                               |
| ---------------------- | ------------------------------------- |
| `Connected`            | Application is listening on that port |
| `Connection refused`   | Application is NOT listening          |
| `Connection timed out` | Firewall or network issue             |

> **Modern alternative:** `nc -zv host port`

**`ping` vs `telnet`:**

|          | `ping`               | `telnet`         |
| -------- | -------------------- | ---------------- |
| Protocol | ICMP                 | TCP              |
| Tests    | Network reachability | Application port |

***

### `netstat -na | grep PORT` — Check What's Listening Locally

```bash
netstat -na | grep 8080   # Is Tomcat/Jenkins listening?
netstat -na | grep 22     # Is SSH listening?
netstat -na | grep 3306   # Is MySQL listening?
netstat -na | grep 443    # Is HTTPS listening?
sudo netstat -tulpn       # Show PID and program name too
```

`LISTEN` in output = application is up and accepting connections.

> **Modern alternative:** `ss -tuln`

***

**Complete Troubleshooting Scenario:**

```bash
# Step 1: Is the server reachable?
ping app-server

# Step 2: Is the application accepting connections?
telnet app-server 8080

# Step 3: SSH into the server
ssh ubuntu@app-server

# Step 4: Is the application actually listening?
netstat -na | grep 8080

# Step 5: Nothing listening? Restart the app
sudo systemctl restart myapp
```

**Interview Answer:**

> "If an application isn't accessible on port 8080, I use `ping` to check network connectivity, then `telnet app-server 8080` to test the port. If that fails, I SSH in and run `netstat -na | grep 8080` to verify whether the app is actually listening. Based on the result, I check logs or restart the service."

***

## 13. Disk & Memory

### `df -h` — Disk Space Usage

`df` = Disk Filesystem. `-h` = Human-readable (GB instead of raw bytes).

```bash
df -h        # All filesystems
df -h .      # Current directory's filesystem
df -h /var   # Specific path
df -h /tmp
```

**Sample output:**

```
Filesystem    Size  Used  Avail  Use%  Mounted on
/dev/xvda1    20G   12G    8G    60%   /
```

| Column  | Meaning         |
| ------- | --------------- |
| `Size`  | Total disk      |
| `Used`  | Space used      |
| `Avail` | Free space      |
| `Use%`  | Percentage used |

**`df` vs `du`:**

| Command          | What it shows                              |
| ---------------- | ------------------------------------------ |
| `df -h`          | Disk usage of whole filesystems/partitions |
| `du -sh /folder` | Size of a specific directory               |

```bash
df -h            # /dev/xvda1 20G 18G 2G 90%
du -sh /var/log  # 1.8G  /var/log
```

***

### `free -m` and `free -g` — Memory Usage

```bash
free -m    # In Megabytes
free -g    # In Gigabytes
watch free -m  # Live view (refreshes every 2s)
```

**Sample output:**

```
              total   used   free  shared  buff/cache  available
Mem:           4096   1200   1500    200        1396       2500
Swap:          2048      0   2048
```

| Column      | Meaning                               |
| ----------- | ------------------------------------- |
| `total`     | Total RAM                             |
| `used`      | RAM in use                            |
| `available` | RAM that can be given to applications |
| `Swap`      | Disk used as backup when RAM is full  |

> **Why `free` ≠ `total - used`:** Linux uses spare RAM for disk caching. The `available` column shows what applications can actually use.\
> **Swap is much slower than RAM** — high swap usage means the server is under memory pressure.

**DevOps Scenario:**

```bash
# Jenkins fails: "No space left on device"
df -h              # Find full partition
du -sh /var/log    # Find what's consuming space
free -m            # Also check memory
```

**Interview Answer:**

> "When a server reports 'No space left on device', I run `df -h` to find which filesystem is full, then `du -sh` on directories like `/var/log` and `/tmp` to find what's consuming space. I also check `free -m` for memory pressure."

***

## 14. Sorting & Deduplication

### Sample file `employees.txt`

```bash
cat > employees.txt << EOF
Rahul
Anita
Vijay
Rahul
Kiran
Anita
Dev
EOF
```

***

### `sort file` — Sort Alphabetically

```bash
sort employees.txt
# Anita
# Anita
# Dev
# Kiran
# Rahul
# Rahul
# Vijay

sort -r employees.txt   # Reverse alphabetical
sort -n numbers.txt     # Numeric sort
```

***

### `uniq file` — Remove Adjacent Duplicate Lines

> **Critical:** `uniq` only removes duplicates that are **next to each other**. Use `sort` first.

```bash
uniq employees.txt
# No change — duplicates are not adjacent!
```

***

### `sort file | uniq` — The Correct Way to Remove All Duplicates

```bash
sort employees.txt | uniq
# Anita
# Dev
# Kiran
# Rahul
# Vijay
```

***

### `sort -r file | uniq` — Reverse Sorted Unique List

```bash
sort -r employees.txt | uniq
# Vijay
# Rahul
# Kiran
# Dev
# Anita
```

**DevOps Use Cases:**

```bash
# Unique list of users who accessed the system
cut -d' ' -f3 access.log | sort | uniq

# Reverse-sorted unique service names for audit
cut -d' ' -f2 app.log | sort -r | uniq
```

***

## 15. File Permissions – chmod & umask

### Understanding Permission Strings

```bash
ls -l
# -rwxr-xr--  1 ubuntu ubuntu 4096 Jul 16 deploy.sh
```

| Position   | Example | Meaning                |
| ---------- | ------- | ---------------------- |
| 1st char   | `-`     | File (`d` = directory) |
| Chars 2–4  | `rwx`   | Owner permissions      |
| Chars 5–7  | `r-x`   | Group permissions      |
| Chars 8–10 | `r--`   | Others permissions     |

**r, w, x values:**

| Symbol | Permission | Numeric |
| ------ | ---------- | ------- |
| `r`    | Read       | 4       |
| `w`    | Write      | 2       |
| `x`    | Execute    | 1       |
| `-`    | None       | 0       |

***

### Numeric Permissions Table

| Number | Permission | Common Use           |
| ------ | ---------- | -------------------- |
| 7      | `rwx`      | Owner of script/dir  |
| 6      | `rw-`      | Owner of config file |
| 5      | `r-x`      | Group execute access |
| 4      | `r--`      | Read-only            |
| 0      | `---`      | No access            |

**Decoding `754`:**

| Position | Number | Calculation | Permission |
| -------- | ------ | ----------- | ---------- |
| Owner    | 7      | 4+2+1       | `rwx`      |
| Group    | 5      | 4+1         | `r-x`      |
| Others   | 4      | 4           | `r--`      |

Result: `rwxr-xr--`

**Common permission values:**

| Number | Permission  | Use Case             |
| ------ | ----------- | -------------------- |
| `777`  | `rwxrwxrwx` | Never in production  |
| `755`  | `rwxr-xr-x` | Scripts, directories |
| `744`  | `rwxr--r--` | Personal scripts     |
| `700`  | `rwx------` | Private keys         |
| `644`  | `rw-r--r--` | Config files         |
| `600`  | `rw-------` | Passwords, secrets   |
| `400`  | `r--------` | AWS `.pem` keys      |

***

### `chmod` — Change Permissions

```bash
chmod permission file

# Add execute permission (symbolic mode)
chmod +x deploy.sh

# Set exact permissions (numeric mode)
chmod 755 deploy.sh
chmod 600 secrets.txt
chmod 400 demo.pem
chmod 444 notes.txt      # Read-only for everyone
chmod 777 test.sh        # Never do this in production

# Remove execute permission
chmod -x file

# Apply recursively to a directory
chmod -R 755 /opt/myapp
```

**`+x` vs `755`:**

|                | `chmod +x`        | `chmod 755`                  |
| -------------- | ----------------- | ---------------------------- |
| What it does   | Adds execute only | Sets all permissions exactly |
| Existing perms | Preserved         | Replaced                     |

**Directory permissions:**

| Permission | On a directory             |
| ---------- | -------------------------- |
| `r`        | List files inside          |
| `w`        | Create/delete files inside |
| `x`        | Enter with `cd`            |

> Without `x` on a directory, you cannot `cd` into it, even as root viewing it.

**DevOps Use Cases:**

```bash
# Fix "Permission denied" when Jenkins runs a script
chmod +x deploy.sh

# Fix AWS SSH key too-open error
chmod 400 demo.pem
ssh -i demo.pem ubuntu@server
```

***

### `umask` — Default Permission for New Files

`umask` subtracts permissions from the default, controlling what new files get.

**Formula:**

```
New file permission = Default - umask
New dir permission  = Default - umask
```

**Defaults before umask:**

| Object    | Default |
| --------- | ------- |
| File      | `666`   |
| Directory | `777`   |

> Files don't default to executable — that's a security feature.

**With default `umask 0022`:**

```bash
umask
# 0022

# New file:      666 - 022 = 644  (rw-r--r--)
# New directory: 777 - 022 = 755  (rwxr-xr-x)
```

**Other umask values:**

```bash
umask 027    # File: 640, Dir: 750  (group can read, others nothing)
umask 077    # File: 600, Dir: 700  (owner only — maximum privacy)
```

**`chmod` vs `umask`:**

|          | `chmod`             | `umask`                     |
| -------- | ------------------- | --------------------------- |
| Affects  | Existing files/dirs | Newly created files/dirs    |
| Use case | Fix specific file   | Set default security policy |

**Common Mistakes:**

| Mistake                               | Why Wrong                         | Fix                            |
| ------------------------------------- | --------------------------------- | ------------------------------ |
| Using `chmod 777` everywhere          | Security risk — anyone can modify | Grant only needed permissions  |
| Forgetting `+x` on scripts            | Script won't run                  | `chmod +x script.sh`           |
| Expecting umask to fix existing files | umask only affects new files      | Use `chmod` for existing files |

**Interview Answer:**

> "`chmod` changes permissions on an existing file. `umask` sets the default permissions for newly created files. I use `chmod +x` to make deployment scripts executable, `chmod 400` for AWS keys, and `umask 077` in pipelines that generate secret files."

***

## 16. File Movement – mv

```bash
# Rename a file
mv old_name new_name
mv report.txt report_backup.txt

# Move file to another directory
mv file dir1/file
mv app.log /var/logs/app.log

# Move file from another directory to current dir
mv dir2/f1 .

# Rename a directory
mv old_dir new_dir
```

> **Note:** `mv` replaces the destination if it already exists. Use `cp` + verify before overwriting important files.

***

## 17. ls Wildcards

```bash
# List files/dirs starting with "Devops"
ls Devops*

# List files/dirs starting with "test"
ls test*

# List all files and directories
ls *

# List all .log files
ls *.log

# List all .sh files
ls *.sh
```

> Wildcards work in most commands: `rm *.log`, `cp *.conf /backup/`, `chmod +x *.sh`

***

## 18. grep with Regex Anchors

### Anchors in grep

| Anchor | Meaning       | Example                                         |
| ------ | ------------- | ----------------------------------------------- |
| `^`    | Start of line | `^Devops` matches lines beginning with "Devops" |
| `$`    | End of line   | `dev$` matches lines ending with "dev"          |

**Examples:**

```bash
# Lines starting with "Devops" (case-insensitive)
grep -i "^Devops" file_name

# Lines starting with "t" or "T"
grep -i "^t" file_name

# Lines ending with "dev" (case-insensitive)
grep -i "dev$" file_name

# Lines starting with a digit
grep "^[0-9]" file_name

# Lines that are exactly "ERROR"
grep "^ERROR$" file_name
```

**DevOps Use Cases:**

```bash
# Find all lines in nginx.conf that start with "server"
grep "^server" /etc/nginx/nginx.conf

# Find all ERROR lines in a log
grep "^ERROR" application.log

# Find config lines that end with a semicolon
grep ";$" config.txt
```

<details>

<summary>What does <code>^</code> mean?</summary>

Matches the beginning of a line.

</details>

<details>

<summary>What does <code>$</code> mean?</summary>

Matches the end of a line.

</details>

<details>

<summary>How do I use both?</summary>

\`grep "^pattern$"\` — exact full-line match.

</details>

<details>

<summary>Can I combine with <code>-i</code>?</summary>

Yes: \`grep -i "^error"\` is case-insensitive.

</details>

***

## Quick Reference Table

| Command                            | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `chown user file`                  | Change file owner                       |
| `chown user:group file`            | Change owner and group                  |
| `sed 's/old/new/g' file`           | Replace text (print to terminal)        |
| `sed -i 's/old/new/g' file`        | Replace text in-place                   |
| `sed -n '5p' file`                 | Print only line 5                       |
| `sed '5d' file`                    | Delete line 5 (output to terminal)      |
| `sed '10,20p' file`                | Print lines 10 to 20                    |
| `cp file file2`                    | Copy file                               |
| `cp -i file file2`                 | Copy with overwrite prompt              |
| `cp -r dir1 dir2`                  | Copy directory recursively              |
| `cut -d ' ' -f2 file`              | Extract column 2 (space-delimited)      |
| `awk -F ' ' '{print $2}' file`     | Print column 2 (more powerful)          |
| \`ps -ef                           | grep name\`                             |
| `ps -u username`                   | List user's processes                   |
| `kill PID`                         | Graceful stop (SIGTERM)                 |
| `kill -9 PID`                      | Force kill (SIGKILL)                    |
| `find . -type f -mtime +7`         | Files older than 7 days                 |
| `find . -iname "*.sh"`             | Find files by name                      |
| \`find . -type f -mtime +7         | xargs rm\`                              |
| `ln -s original link`              | Create soft/symbolic link               |
| `ln original hardlink`             | Create hard link                        |
| `uname -a`                         | OS and kernel info                      |
| `cat /etc/os-release`              | Linux distro details                    |
| `hostname`                         | Server hostname                         |
| `whoami`                           | Current username                        |
| \`who                              | wc -l\`                                 |
| `nohup ./script.sh &`              | Run in background, persist after logout |
| `top`                              | Real-time process/CPU/memory monitor    |
| `ssh user@server`                  | Connect to remote server                |
| `ssh -i key.pem user@ip`           | Connect with AWS key                    |
| `scp file user@server:/path`       | Copy file to remote                     |
| `rsync -av src/ user@server:/path` | Sync (changes only)                     |
| `ping host`                        | Test network reachability               |
| `telnet host port`                 | Test TCP port                           |
| \`netstat -na                      | grep PORT\`                             |
| `df -h`                            | Disk space usage                        |
| `free -m`                          | Memory usage (MB)                       |
| `free -g`                          | Memory usage (GB)                       |
| `sort file`                        | Sort alphabetically                     |
| `sort -r file`                     | Sort in reverse                         |
| `uniq file`                        | Remove adjacent duplicates              |
| \`sort file                        | uniq\`                                  |
| `chmod +x file`                    | Add execute permission                  |
| `chmod 755 file`                   | Set exact permissions                   |
| `umask`                            | Show/set default permissions            |
| `mv old new`                       | Rename or move file                     |
| `ls test*`                         | List files starting with "test"         |
| `grep -i "^t" file`                | Lines starting with "t"                 |
| `grep -i "dev$" file`              | Lines ending with "dev"                 |

***

## Day 3 – End-of-Day Practice Lab

{% stepper %}
{% step %}
## Create `deploy.sh` and make it executable

Create a file `deploy.sh` with `echo "#!/bin/bash" > deploy.sh` and make it executable: `chmod +x deploy.sh`.
{% endstep %}

{% step %}
## Create a symbolic link

Create a symbolic link: `ln -s deploy.sh deploy_link`.
{% endstep %}

{% step %}
## Find all `.sh` files

Find all `.sh` files: `find . -iname "*.sh"`.
{% endstep %}

{% step %}
## Check disk space and memory

Check disk space: `df -h`. Check memory: `free -m`.
{% endstep %}

{% step %}
## Run in background

Run in background: `nohup ./deploy.sh > deploy.log 2>&1 &`.
{% endstep %}

{% step %}
## Find the PID

Find the PID: `ps -ef | grep deploy.sh`.
{% endstep %}

{% step %}
## Stop it

Stop it: `kill PID`. Verify: `ps -ef | grep deploy.sh`.
{% endstep %}

{% step %}
## Check if SSH is running

Check if SSH is running: `netstat -na | grep 22`.
{% endstep %}

{% step %}
## Use sed to replace text in a file

Use sed to replace text in a file: `echo "hello world" > test.txt && sed -i 's/world/devops/g' test.txt && cat test.txt`.
{% endstep %}

{% step %}
## Sort and deduplicate

Sort and deduplicate: create `employees.txt`, then run `sort employees.txt | uniq`.
{% endstep %}
{% endstepper %}

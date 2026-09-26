# Day 4

{% hint style="info" %}
Each section covers one command or concept. Read the explanation, study the examples, try the exercises on your Linux machine, and make sure you can answer the interview questions before moving on.
{% endhint %}

## Module 3 – Process Management

### Key Concept: What is a Signal?

When you close a program in Linux, the OS doesn't just cut it off — it first _asks_ the program to stop by sending **Signal 15 (SIGTERM)**. If the program doesn't respond, Linux can forcefully stop it with **Signal 9 (SIGKILL)**.

Always try graceful termination first. Use `kill -9` only as a last resort.

### Command 90: `ps -u username`

**What it does:** Lists all processes owned by a specific user.

```bash
ps -u username
```

**Understanding the output:**

| Column | Description                         |
| ------ | ----------------------------------- |
| PID    | Process ID (unique identifier)      |
| TTY    | Terminal the process is attached to |
| TIME   | CPU time consumed                   |
| CMD    | The command/program name            |

**Examples:**

```bash
# Show all Jenkins processes
ps -u jenkins

# Show your own processes
ps -u $(whoami)

# Show root processes
ps -u root

# Filter further with grep
ps -u jenkins | grep java
```

> **How `$(whoami)` works:** Linux first runs `whoami` (which outputs your username, e.g., `ubuntu`), then substitutes the result. So `ps -u $(whoami)` becomes `ps -u ubuntu`.

**DevOps Use Cases:**

* A developer reports Jenkins is consuming too much CPU → run `ps -u jenkins` to see exactly what it's running.
* Verify a deployment user is running the expected scripts → `ps -u deployuser`.

**Practice Exercises:**

1. Find your username with `whoami`, then run `ps -u $(whoami)`.
2. Open a second terminal, run `sleep 300`, then switch back and run `ps -u $(whoami)`. Confirm `sleep` appears.

**Quick Quiz:**

| Question                                    | Answer                            |
| ------------------------------------------- | --------------------------------- |
| Which command shows only Jenkins processes? | `ps -u jenkins`                   |
| Does `ps -u` terminate processes?           | No — it only displays information |
| How do you display your own processes?      | `ps -u $(whoami)`                 |

### Command 91: `kill` and `kill -9`

**What it does:** Sends a signal to a process, most commonly to stop it.

| Signal | Name    | Behaviour                                                |
| ------ | ------- | -------------------------------------------------------- |
| 15     | SIGTERM | Politely asks the process to stop (process can clean up) |
| 9      | SIGKILL | Forcefully and immediately terminates the process        |

**Syntax:**

```bash
# Graceful stop (preferred)
kill PID

# Force stop (last resort)
kill -9 PID
```

**Step-by-step workflow:**

```bash
# Step 1 – Find the PID
ps -ef | grep sleep

# Output example:
# ubuntu 4215 4102 0 09:10 pts/0 sleep 300

# Step 2 – Try graceful stop
kill 4215

# Step 3 – Verify it stopped
ps -ef | grep sleep

# Step 4 – If still running, force kill
kill -9 4215
```

**Why NOT to always use `kill -9`:**

`kill -9` gives the process no chance to clean up. It may leave behind:

* Temporary files
* Open database connections
* Unclosed network sockets
* Incomplete log entries

Always try `kill PID` first.

**DevOps Use Cases:**

* A Jenkins build has been stuck for 40 minutes → find the PID with `ps -ef | grep java`, then kill it.
* A deployment script (`deploy.sh`) never finishes → kill the process and re-run.

**Practice Exercises:**

1. Run `sleep 500` in a terminal. Find its PID. Run `kill PID`. Verify with `ps -ef | grep sleep`.
2. Run another `sleep 500`. Kill it with `kill -9 PID`. Verify it's gone.

**Common Mistakes:**

| Mistake                       | Why It's Wrong                 | Correct Approach                    |
| ----------------------------- | ------------------------------ | ----------------------------------- |
| Always using `kill -9`        | Prevents graceful cleanup      | Try `kill PID` first                |
| Killing the wrong PID         | May stop the wrong application | Verify with `ps -ef` before killing |
| Assuming `kill` deletes files | It only stops the process      | Files remain unchanged              |
| Not verifying after kill      | Unsure if process stopped      | Re-run `ps -ef` to confirm          |

**Interview Answer:**

> "The `kill` command without a signal sends SIGTERM (15), which allows the process to terminate gracefully — closing files and releasing resources. If the process doesn't respond, I use `kill -9`, which sends SIGKILL and immediately terminates it. In production, I always try `kill` first and reserve `kill -9` for unresponsive processes."

## Module 4 – find & xargs

### Why `find`?

If your Linux server has 2 million files, you cannot use `ls` or browse folders manually. The `find` command is Linux's built-in search engine — it searches recursively through directories in seconds.

### Understanding `xargs`

`find` only _lists_ files. To _do something_ with those files (e.g., delete them), you pipe the list through `xargs`, which passes the results as arguments to another command.

```
find --> list of files --> xargs --> rm
```

### Command 92: `find . -type f -mtime +2 | xargs rm`

**What it does:** Finds all files modified more than 2 days ago and deletes them.

```bash
find . -type f -mtime +2 | xargs rm
```

**Breaking it down:**

| Part        | Meaning                            |
| ----------- | ---------------------------------- |
| `find`      | Search command                     |
| `.`         | Start from current directory       |
| `-type f`   | Match files only (not directories) |
| `-mtime +2` | Modified more than 2 days ago      |
| \`          | \`                                 |
| `xargs`     | Pass list of files as arguments    |
| `rm`        | Remove/delete                      |

**Understanding `-mtime`:**

| Option      | Meaning                                 |
| ----------- | --------------------------------------- |
| `-mtime 2`  | Modified exactly 2 days ago             |
| `-mtime +2` | Modified more than 2 days ago (older)   |
| `-mtime -2` | Modified within the last 2 days (newer) |

**Examples:**

```bash
# Search first (ALWAYS do this before deleting!)
find . -type f -mtime +2

# Then delete
find . -type f -mtime +2 | xargs rm

# Clean up /tmp files older than 2 days
find /tmp -type f -mtime +2

# Delete log files older than 7 days
find logs -type f -mtime +7 | xargs rm

# Delete backup files older than 30 days
find backup -type f -mtime +30 | xargs rm
```

> **Best Practice:** Always run the `find` command first to see what _will_ be deleted. Only add `| xargs rm` after confirming the list looks correct.\
> **Rule: Search first. Delete later.**

**DevOps Use Cases:**

* Disk usage at 95% → `find /var/log/myapp -type f -mtime +7 | xargs rm`
* Jenkins old build artifacts → `find /var/lib/jenkins/workspace -type f -mtime +30 | xargs rm`

**Safer Alternatives:**

```bash
# Using -delete (built-in, safer with spaces in filenames)
find . -type f -mtime +2 -delete

# Using -exec
find . -type f -mtime +2 -exec rm {} \;
```

### Command 93: `find . -type f -mtime +365 | xargs rm`

**What it does:** Finds and deletes files modified more than one year ago.

```bash
# Search first
find . -type f -mtime +365

# Then delete
find . -type f -mtime +365 | xargs rm
```

**DevOps Use Cases:**

* Archive cleanup: `find /backup -type f -mtime +365 | xargs rm`
* Jenkins artifact cleanup: `find /var/lib/jenkins/jobs -type f -mtime +365 | xargs rm`

### Command 94: `find . -type f -iname "test" -maxdepth 1`

**What it does:** Searches for files named `test` (case-insensitive) only in the current directory.

```bash
find . -type f -iname "test" -maxdepth 1
```

| Option        | Meaning                                                |
| ------------- | ------------------------------------------------------ |
| `-type f`     | Files only                                             |
| `-iname`      | Case-insensitive filename match                        |
| `"test"`      | Filename to match                                      |
| `-maxdepth 1` | Search only the current directory (not subdirectories) |

**`-name` vs `-iname`:**

* `-name "test"` → case-sensitive (matches `test` only)
* `-iname "test"` → case-insensitive (matches `test`, `Test`, `TEST`)

**Examples:**

```bash
# Find README regardless of case
find . -type f -iname "readme"

# Find Dockerfile regardless of case
find . -type f -iname "dockerfile"

# Find any PDF file
find . -iname "*.pdf"

# Find any shell script
find . -iname "*.sh"
```

### Command 95: `find . -type d -iname "test" -maxdepth 2`

**What it does:** Searches for _directories_ named `test` (case-insensitive) up to 2 levels deep.

```bash
find . -type d -iname "test" -maxdepth 2

# Other examples
find . -type d -iname "logs"
find . -type d -iname "config"
find . -type d -iname "k8s"    # Locate Kubernetes manifest directory
```

### Command 96: `find . -iname "test" -maxdepth 1`

**What it does:** Searches for both files _and_ directories named `test` — no `-type` filter.

```bash
find . -iname "test" -maxdepth 1

# Wildcard searches
find . -iname "*.yaml"   # All YAML files (Kubernetes manifests)
find . -iname "*.sh"     # All shell scripts
find . -iname "*.log"    # All log files
find . -iname "*.txt"    # All text files
```

**Quick Reference – `find` Options:**

| What you want         | Command            |
| --------------------- | ------------------ |
| Files only            | `-type f`          |
| Directories only      | `-type d`          |
| Both files & dirs     | _(omit `-type`)_   |
| Case-insensitive name | `-iname "pattern"` |
| Case-sensitive name   | `-name "pattern"`  |
| Limit depth           | `-maxdepth N`      |
| Older than N days     | `-mtime +N`        |
| Newer than N days     | `-mtime -N`        |

**Interview Answer:**

> "`-name` performs a case-sensitive search — `test` and `Test` are different. `-iname` performs a case-insensitive search and matches `test`, `Test`, `TEST`, and any other case variation. In DevOps, I prefer `-iname` because filenames can vary in case across environments."

## Module 5 – Soft Links & Hard Links

### What is a Link?

A link is a way to reference a file from a different location without copying it. Linux has two types:

| Type                          | Like...                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| **Soft Link (Symbolic Link)** | A Windows shortcut — points to the path of the original file |
| **Hard Link**                 | Another name for the exact same file data (same inode)       |

### What is an Inode?

Every file in Linux has:

* A **filename** (just a human-readable label)
* An **inode number** (the actual unique ID Linux uses to track the file)

```bash
ls -li          # View inode numbers
# Output: 125689 app.log
#         125700 server.log
```

Think of the inode as the file's internal ID. The filename is just a label attached to that ID.

### Soft Link vs Hard Link Comparison

| Feature                    | Soft Link              | Hard Link                    |
| -------------------------- | ---------------------- | ---------------------------- |
| Command                    | `ln -s`                | `ln`                         |
| Like a Windows shortcut    | Yes                    | No                           |
| Has its own inode          | Yes                    | No (shares original's inode) |
| Works across filesystems   | Yes                    | No                           |
| Can link directories       | Yes                    | Normally no                  |
| Breaks if original deleted | Yes (becomes dangling) | No (data survives)           |
| Common in DevOps           | Very common            | Rare                         |

### Command 97: `ln -s test1 softlink` (Soft/Symbolic Link)

**What it does:** Creates a symbolic link — a shortcut pointing to the original file.

```bash
ln -s original_file link_name
```

**Step-by-step example:**

```bash
# Create a file
echo "Welcome to Linux" > test1

# Create a soft link
ln -s test1 softlink

# Verify (notice the -> arrow)
ls -l
# -rw-r--r-- test1
# lrwxrwxrwx softlink -> test1

# Read through the link (reads original file)
cat softlink
# Welcome to Linux

# Edit through the link (changes the original!)
echo "DevOps" >> softlink
cat test1
# Welcome to Linux
# DevOps

# Delete the original — link becomes broken (dangling)
rm test1
cat softlink
# cat: softlink: No such file or directory

# Check inodes — they will be DIFFERENT
ls -li
```

**DevOps Use Cases:**

```bash
# Nginx: Enable a site by creating a symlink
ln -s /etc/nginx/sites-available/myapp.conf \
      /etc/nginx/sites-enabled/myapp.conf

# Deployment: Point 'current' to the latest release
ln -s /opt/app/releases/v2 /opt/app/current
# When v3 comes out, just update the symlink

# Shortcut to frequently accessed logs
ln -s /var/log/myapp/application.log app.log
tail -f app.log
```

### Command 98: `ln -s /home/test/test1 softlink` (Absolute Path Symlink)

**What it does:** Creates a symbolic link using the full/absolute path of the original file.

```bash
ln -s /absolute/path/to/file link_name

# Examples
ln -s /home/ubuntu/report.txt report_link
ln -s /var/log/syslog syslog_link
ln -s /etc/nginx/nginx.conf nginx_link
```

**When to use absolute vs relative path:**

* **Absolute path** → more reliable; works regardless of where you run the command.
* **Relative path** → useful when the link and the target always move together.

### Command 99: `ln /home/test/test1 hardlink` (Hard Link)

**What it does:** Creates a hard link — another name for the same inode (same file data).

```bash
ln original_file hardlink_name
```

**Step-by-step example:**

```bash
# Create a file
echo "Linux" > test1

# Create a hard link
ln test1 hardlink

# Both have the SAME inode number
ls -li
# 45678 test1
# 45678 hardlink

# Delete the original — data still accessible through hard link!
rm test1
cat hardlink
# Linux
```

**Interview Answer:**

> "A soft link is a symbolic reference to another file and has its own inode. It can cross filesystems and link to directories, but becomes a broken link if the original is deleted. A hard link points directly to the same inode as the original file — both names share the same data. It cannot cross filesystems and normally cannot link directories, but it continues to work even if the original filename is deleted."

## Module 6 – System Information & User Commands

**When you first SSH into a server, always verify your environment:**

```
Which OS is this?  -->  cat /etc/os-release
Which kernel?      -->  uname -a
Which server?      -->  hostname
Who am I?          -->  whoami
Who else is here?  -->  who
```

### Command 100: `uname -a`

**What it does:** Displays all information about the OS and kernel.

```bash
uname -a
# Linux ip-172-31-20-45 6.8.0-1029-aws #31-Ubuntu SMP x86_64 GNU/Linux
```

| Field             | Meaning                   |
| ----------------- | ------------------------- |
| `Linux`           | Kernel type               |
| `ip-172-31-20-45` | Hostname                  |
| `6.8.0-1029-aws`  | Kernel version            |
| `x86_64`          | CPU architecture (64-bit) |
| `GNU/Linux`       | OS family                 |

**Useful variations:**

```bash
uname        # Just the OS name (Linux)
uname -r     # Kernel version only
uname -m     # Architecture (x86_64)
uname -o     # Operating system (GNU/Linux)
```

### Command 101: `cat /etc/os-release`

**What it does:** Shows which Linux _distribution_ is installed (Ubuntu, CentOS, Amazon Linux, etc.)

```bash
cat /etc/os-release
# NAME="Ubuntu"
# VERSION="24.04.2 LTS"

# Filter specific fields:
grep "^NAME=" /etc/os-release
grep "^VERSION=" /etc/os-release
```

**Why this matters:** Package managers differ by distro. Ubuntu uses `apt`; CentOS/RHEL uses `yum`/`dnf`. Deployment scripts often check this file before installing software.

### Command 102: `hostname`

**What it does:** Displays the server's hostname.

```bash
hostname            # Server name
hostname -I         # IP address(es)
hostname -f         # Fully Qualified Domain Name (FQDN)
hostname -s         # Short hostname
```

### Command 103: `who | wc -l`

**What it does:** Counts the number of active login sessions.

```bash
who         # List all logged-in users/sessions
who | wc -l # Count total login sessions
```

> **Note:** One user connected via two terminals counts as **two** sessions.

### Command 104: `whoami`

**What it does:** Shows the username of the currently logged-in user.

```bash
whoami
# ubuntu

echo "Current user: $(whoami)"
ps -u $(whoami)
```

**Key Difference: `who` vs `whoami`**

| Command  | Shows                  |
| -------- | ---------------------- |
| `who`    | All logged-in sessions |
| `whoami` | Only your current user |

**Interview Answer:**

> "When I SSH into a production server, I first run `hostname` to confirm I'm on the correct server, `whoami` to verify my account, `cat /etc/os-release` to identify the Linux distribution, and `uname -r` to check the kernel version."

## Module 7 – Background Jobs & Process Monitoring

### The Problem

If you start a 2-hour deployment script over SSH and your laptop battery dies, Linux terminates the script along with your SSH session. Solution: `nohup`.

### Command 105: `nohup ./script.sh &`

**What it does:** Runs a script in the background and keeps it running even after you log out.

* **`nohup`** = "No Hang Up" — ignore the SIGHUP signal when a session closes.
* **`&`** = run in the background (terminal stays free immediately).

```bash
nohup command &
```

**Comparison:**

| Command               | Runs in Background   | Continues After Logout       |
| --------------------- | -------------------- | ---------------------------- |
| `./script.sh`         | No — terminal locked | No                           |
| `./script.sh &`       | Yes                  | No — usually stops on logout |
| `nohup ./script.sh &` | Yes                  | Yes                          |

**Usage:**

```bash
nohup ./deploy.sh &           # Long deployment script
nohup ./db_backup.sh &        # 3-hour database backup
nohup python3 app.py &        # Python application
nohup java -jar app.jar &     # Java application

# Output goes to nohup.out by default
cat nohup.out

# Custom output file:
nohup ./script.sh > output.log 2>&1 &

# To stop it later:
ps -ef | grep script.sh
kill PID
```

### Command 106: `top`

**What it does:** Real-time process monitoring (Linux's Task Manager).

```bash
top
```

**Key fields in the output:**

| Field     | Meaning                 |
| --------- | ----------------------- |
| `%Cpu(s)` | CPU utilization         |
| `MiB Mem` | Total / used / free RAM |
| `PID`     | Process ID              |
| `USER`    | Owner                   |
| `COMMAND` | Application name        |
| `%CPU`    | CPU usage               |
| `%MEM`    | Memory usage            |

**Interactive keys:**

| Key | Action                     |
| --- | -------------------------- |
| `q` | Quit                       |
| `k` | Kill a process (enter PID) |
| `M` | Sort by memory             |
| `P` | Sort by CPU                |

**`top` vs `ps`:**

| `top`                 | `ps`              |
| --------------------- | ----------------- |
| Live, auto-refreshing | One-time snapshot |
| Interactive           | Non-interactive   |
| Real-time monitoring  | Scripting         |

## Module 8 – SSH & Secure File Transfer

### What is SSH?

**SSH (Secure Shell)** provides an encrypted command-line connection to remote Linux servers. It is the standard way DevOps engineers manage cloud servers.

### Command 107: `ssh username@server`

```bash
ssh ubuntu@192.168.1.10
ssh ubuntu@dev.company.com
ssh -p 2222 ubuntu@192.168.1.10    # Custom port
```

### Command 108: `ssh -i demo.pem ubuntu@54.26.118.12`

AWS EC2 uses **key-based authentication** instead of passwords.

```bash
ssh -i demo.pem ubuntu@54.26.118.12       # Ubuntu
ssh -i demo.pem ec2-user@18.212.10.20     # Amazon Linux
```

**Important:** SSH refuses to use a `.pem` key if permissions are too open.

```bash
chmod 400 demo.pem    # Always do this before using a .pem key
```

| Error                           | Cause                                                     |
| ------------------------------- | --------------------------------------------------------- |
| `Permission denied (publickey)` | Wrong username / wrong key / wrong IP / wrong permissions |
| `UNPROTECTED PRIVATE KEY FILE!` | Run `chmod 400 demo.pem`                                  |

### Command 109: `scp file_name user@server:/tmp`

**Secure Copy** — copies files between machines over SSH.

```bash
# Upload to server
scp report.txt ubuntu@192.168.1.10:/tmp

# Upload with key file
scp -i demo.pem report.txt ubuntu@54.26.118.12:/tmp

# Download from server
scp ubuntu@192.168.1.10:/tmp/report.txt .

# Copy directory
scp -r project ubuntu@server:/tmp
```

### Command 110: `rsync file user@server:/home/temp`

**rsync** synchronizes files, transferring only _changed_ parts.

```bash
# Sync a directory
rsync -av project/ ubuntu@server:/opt/project

# With SSH key
rsync -av -e "ssh -i demo.pem" project/ ubuntu@54.26.118.12:/opt/project

# Download from server
rsync -av ubuntu@server:/var/log/ ./logs
```

**`scp` vs `rsync`:**

|                       | `scp`                     | `rsync`                              |
| --------------------- | ------------------------- | ------------------------------------ |
| What it transfers     | Everything, every time    | Only changed parts                   |
| Speed (repeated runs) | Same                      | Much faster                          |
| Best for              | Simple one-time transfers | Deployments, backups, repeated syncs |

**Interview Answer:**

> "I use `scp` for simple one-time file transfers. I prefer `rsync` for deployments and backups because it only transfers changed portions and is much more efficient when syncing repeatedly."

## Module 9 – Networking Commands

### The DevOps Troubleshooting Flow

```
Can I reach the server?           -->  ping host
Can I reach the application port? -->  telnet host port
Is the application listening?     -->  netstat -na | grep PORT
Check application logs
```

### Command 111: `ping`

**What it does:** Tests network reachability using ICMP.

```bash
ping google.com
ping 13.233.120.10
ping 127.0.0.1          # Loopback (your own machine)
ping -c 4 google.com    # Send only 4 packets
```

**Output fields:**

| Field      | Meaning                  |
| ---------- | ------------------------ |
| `icmp_seq` | Packet number            |
| `ttl`      | Time To Live             |
| `time`     | Round-trip response time |

> **Note:** `ping` tests network connectivity only — not application health. A firewall may block ICMP while the app still runs.

### Command 112: `telnet ip port`

**What it does:** Tests if a TCP port is reachable (application connectivity).

```bash
telnet localhost 8080       # Check Tomcat/Jenkins
telnet 192.168.1.20 22     # Check SSH
telnet db.company.com 3306 # Check MySQL
```

**Results:**

| Result                 | Meaning                        |
| ---------------------- | ------------------------------ |
| `Connected`            | Port is open; app is listening |
| `Connection refused`   | App is NOT listening           |
| `Connection timed out` | Firewall or network issue      |

**`ping` vs `telnet`:**

|          | `ping`               | `telnet`         |
| -------- | -------------------- | ---------------- |
| Protocol | ICMP                 | TCP              |
| Tests    | Network reachability | Application port |

### Command 113: `netstat -na | grep 8080`

**What it does:** Checks if an application on the _local machine_ is listening on a port.

```bash
netstat -na | grep 8080   # Check Tomcat/Jenkins port
netstat -na | grep 22     # Check SSH
netstat -na | grep 3306   # Check MySQL
sudo netstat -tulpn       # Shows PID and program name too
```

`LISTEN` in the output = application is waiting for connections.

**Modern alternative:** `ss -tuln`

**`netstat` vs `telnet`:**

|               | `netstat`       | `telnet`                          |
| ------------- | --------------- | --------------------------------- |
| Where it runs | Local machine   | Tests from your machine to remote |
| What it shows | Local listeners | Remote port connectivity          |

**Interview Answer:**

> "If an application isn't accessible on port 8080, I'd first use `ping` to verify network connectivity. If reachable, I'd use `telnet` to test the port. Then I'd SSH into the server and run `netstat -na | grep 8080` to confirm whether the application is listening. Based on findings, I'd check logs and restart the service."

## Module 10 – Disk, Memory & File Utilities

When Jenkins fails with `No space left on device`, don't restart — check disk and memory first.

### Command 114: `df -h`

**What it does:** Shows disk space usage of all filesystems (human-readable).

```bash
df -h        # All filesystems
df -h .      # Filesystem of current directory
df -h /var   # Specific path
```

**Output columns:**

| Column  | Meaning              |
| ------- | -------------------- |
| `Size`  | Total disk capacity  |
| `Used`  | Space used           |
| `Avail` | Free space remaining |
| `Use%`  | Percentage used      |

**`df` vs `du`:**

| Command         | Purpose                            |
| --------------- | ---------------------------------- |
| `df -h`         | Overall partition/filesystem usage |
| `du -sh folder` | Size of a specific directory       |

### Commands 115 & 116: `free -m` and `free -g`

**What it does:** Displays RAM and swap usage.

```bash
free -m    # In Megabytes
free -g    # In Gigabytes
watch free -m  # Live view, refreshes every 2 seconds
```

**Output columns:**

| Column      | Meaning                                                        |
| ----------- | -------------------------------------------------------------- |
| `total`     | Total installed RAM                                            |
| `used`      | RAM in use                                                     |
| `free`      | Completely unused RAM                                          |
| `available` | RAM applications can actually use (includes reclaimable cache) |
| `Swap`      | Disk overflow when RAM is full (much slower than RAM)          |

### Sample File for `sort` and `uniq`

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

### Command 117: `uniq file`

Removes _adjacent_ duplicate lines only.

```bash
uniq employees.txt
# No change! Duplicates are not adjacent
```

> `uniq` must be combined with `sort` to remove all duplicates.

### Command 118: `sort file`

Sorts lines alphabetically.

```bash
sort employees.txt
# Anita, Anita, Dev, Kiran, Rahul, Rahul, Vijay

sort -n numbers.txt   # Numeric sort
sort -r file.txt      # Reverse order
```

### Command 119: `sort file | uniq`

**The correct way to remove all duplicates.**

```bash
sort employees.txt | uniq
# Anita, Dev, Kiran, Rahul, Vijay

# DevOps use case: unique user list from logs
cut -d' ' -f2 app.log | sort | uniq
```

### Command 120: `sort -r file | uniq`

Sorts in reverse order, then removes duplicates.

```bash
sort -r employees.txt | uniq
# Vijay, Rahul, Kiran, Dev, Anita
```

### Disk Full – Troubleshooting Steps

```bash
# Step 1: Find which filesystem is full
df -h

# Step 2: Find the largest directories
du -sh /var/log /tmp /opt /home

# Step 3: Check memory
free -m

# Step 4: Extract unique users from logs
cut -d' ' -f2 app.log | sort | uniq
```

**Interview Answer:**

> "When a server reports 'No space left on device', I run `df -h` to find which filesystem is full. Then I use `du -sh` on large directories like `/var/log` or `/tmp` to locate what's consuming space. I clean up old logs or unnecessary files. I also check memory with `free -m` to rule out RAM issues."

## Final Module – Linux File Permissions

### The Permission System

Every Linux file has permissions that answer:

* Who can **read** it?
* Who can **modify (write)** it?
* Who can **execute** it?

And three levels of users:

```
Owner   -->  You (the file creator)
Group   -->  Your team/group
Others  -->  Everyone else
```

### Reading Permission Strings

```bash
ls -l
# -rwxr-xr--  1 ubuntu ubuntu 4096 Jul 16 10:00 deploy.sh
```

Breaking down `-rwxr-xr--`:

| Part  | Meaning                                 |
| ----- | --------------------------------------- |
| `-`   | File type (`-` = file, `d` = directory) |
| `rwx` | Owner: read + write + execute           |
| `r-x` | Group: read + execute                   |
| `r--` | Others: read only                       |

**r, w, x values:**

| Symbol | Permission    | Numeric Value |
| ------ | ------------- | ------------- |
| `r`    | Read          | 4             |
| `w`    | Write         | 2             |
| `x`    | Execute       | 1             |
| `-`    | No permission | 0             |

### Numeric Permissions

| Number | Permission | Meaning         |
| ------ | ---------- | --------------- |
| 0      | `---`      | No permissions  |
| 1      | `--x`      | Execute only    |
| 2      | `-w-`      | Write only      |
| 3      | `-wx`      | Write + Execute |
| 4      | `r--`      | Read only       |
| 5      | `r-x`      | Read + Execute  |
| 6      | `rw-`      | Read + Write    |
| 7      | `rwx`      | Full access     |

**Decoding `754`:**

| Position | Number | Calculation | Permission |
| -------- | ------ | ----------- | ---------- |
| Owner    | 7      | 4+2+1       | `rwx`      |
| Group    | 5      | 4+1         | `r-x`      |
| Others   | 4      | 4           | `r--`      |

Result: `rwxr-xr--`

**Common permission values:**

| Number | Permission  | Common Use              |
| ------ | ----------- | ----------------------- |
| `777`  | `rwxrwxrwx` | Never use in production |
| `755`  | `rwxr-xr-x` | Scripts, directories    |
| `644`  | `rw-r--r--` | Configuration files     |
| `600`  | `rw-------` | Passwords, secrets      |
| `400`  | `r--------` | AWS `.pem` keys         |

### `chmod` – Change Mode

```bash
# Add execute permission
chmod +x deploy.sh

# Set exact permissions (numeric)
chmod 755 deploy.sh    # Script accessible by all
chmod 600 secrets.txt  # Private — owner only
chmod 400 demo.pem     # AWS key — read-only
chmod 444 notes.txt    # Read-only for everyone

# Remove execute permission
chmod -x deploy.sh
```

**`+x` vs `755`:**

|                      | `chmod +x`            | `chmod 755`                  |
| -------------------- | --------------------- | ---------------------------- |
| What it does         | Adds execute bit only | Sets all permissions exactly |
| Existing permissions | Preserved             | Replaced                     |

**Directory permissions:**

| Permission | On a directory             |
| ---------- | -------------------------- |
| `r`        | List files inside          |
| `w`        | Create/delete files inside |
| `x`        | Enter the directory (`cd`) |

> Without `x` on a directory, you cannot enter it even if you can see its name.

**DevOps Use Cases:**

```bash
# Fix "Permission denied" on a deployment script
chmod +x deploy.sh

# Fix AWS SSH key permissions error
chmod 400 demo.pem
```

### `umask` – Default Permission Mask

Controls the _default_ permissions assigned to newly created files and directories.

**Formula:**

```
Final Permission = Default Permission - umask
```

**Defaults (before umask):**

| Object    | Default |
| --------- | ------- |
| File      | `666`   |
| Directory | `777`   |

> Files don't default to executable — that would be a security risk.

**With default `umask 0022`:**

```bash
umask
# 0022

# New file:      666 - 022 = 644  (rw-r--r--)
# New directory: 777 - 022 = 755  (rwxr-xr-x)
```

**Other values:**

```bash
umask 027    # File: 640, Directory: 750
umask 077    # File: 600, Directory: 700  (maximum privacy)
```

**`chmod` vs `umask`:**

|          | `chmod`             | `umask`                       |
| -------- | ------------------- | ----------------------------- |
| Affects  | Existing files      | Newly created files           |
| Use case | Fix a specific file | Set a default security policy |

**Interview Answer:**

> "`chmod` changes permissions of an existing file or directory. `umask` defines the default permissions for newly created files and directories. In DevOps, I use `chmod` to fix permission issues on existing scripts and `umask` to ensure newly created files have secure defaults — for example, `umask 077` in pipelines that generate secrets."

## End-of-Day Practice Lab

Try these tasks on your Linux VM — they combine everything from today:

1. Create `deploy.sh` and make it executable with `chmod +x`.
2. Create a symbolic link to it using `ln -s`.
3. Find all `.sh` files in the current directory with `find`.
4. Check disk space with `df -h` and memory with `free -m`.
5. Run `nohup ./deploy.sh &` in the background.
6. Find its PID using `ps -ef | grep deploy.sh`.
7. Stop it gracefully with `kill PID`. Verify it's gone.
8. SSH into another VM (or localhost): `ssh ubuntu@localhost`.
9. Copy a file with `scp file ubuntu@localhost:/tmp`.
10. Verify permissions with `ls -l` and modify with `chmod`.

## Quick Command Reference

| Command                               | Purpose                                        |
| ------------------------------------- | ---------------------------------------------- |
| `ps -u username`                      | List processes for a specific user             |
| `kill PID`                            | Gracefully stop a process (SIGTERM)            |
| `kill -9 PID`                         | Force-kill a process (SIGKILL)                 |
| `find . -type f -mtime +2`            | Find files older than 2 days                   |
| `find . -iname "*.sh"`                | Find files by name (case-insensitive)          |
| \`find . -type f -mtime +2            | xargs rm\`                                     |
| `ln -s original link`                 | Create a soft/symbolic link                    |
| `ln original hardlink`                | Create a hard link                             |
| `ls -li`                              | View inode numbers                             |
| `uname -a`                            | Show OS and kernel info                        |
| `cat /etc/os-release`                 | Show Linux distribution details                |
| `hostname`                            | Show server hostname                           |
| `whoami`                              | Show current username                          |
| \`who                                 | wc -l\`                                        |
| `nohup ./script.sh &`                 | Run script in background, persist after logout |
| `top`                                 | Real-time process/CPU/memory monitoring        |
| `ssh user@server`                     | Connect to remote server                       |
| `ssh -i key.pem user@ip`              | Connect with AWS key file                      |
| `scp file user@server:/path`          | Securely copy a file                           |
| `rsync -av source/ user@server:/path` | Synchronize files (changes only)               |
| `ping host`                           | Test network reachability                      |
| `telnet host port`                    | Test if a TCP port is open                     |
| \`netstat -na                         | grep PORT\`                                    |
| `df -h`                               | Show disk space usage                          |
| `free -m`                             | Show memory usage in MB                        |
| `sort file`                           | Sort file alphabetically                       |
| `uniq file`                           | Remove adjacent duplicates                     |
| \`sort file                           | uniq\`                                         |
| `chmod 755 file`                      | Set file permissions                           |
| `chmod +x file`                       | Add execute permission                         |
| `umask`                               | Show/set default permission mask               |

# Day 5

## `xargs`

**What it does:** Reads output from a pipe and converts it into arguments for another command.

Many commands (like `rm`) cannot receive input from a pipe directly — they expect arguments. `xargs` bridges this gap.

```
find / ls  -->  list of filenames  -->  xargs  -->  rm / wc -l / gzip
```

```bash
# Syntax
command1 | xargs command2

# Example 1: Delete files listed by ls
ls | xargs rm
# Equivalent to: rm f1 f2 f3

# Example 2: Delete all .log files found by find
find . -name "*.log" | xargs rm

# Example 3: Count lines in all .txt files
find . -name "*.txt" | xargs wc -l
```

**DevOps Use Cases:**

```bash
# Clean up old application logs
find /var/log/myapp -name "*.log" | xargs rm

# Compress multiple log files at once
find . -name "*.log" | xargs gzip
```

> **Why not just use `rm` directly with `find`?** `find` outputs filenames to stdout. `rm` expects them as arguments. `xargs` performs that conversion.

**Interview Answer:**

> "`xargs` reads output from a previous command (via pipe) and passes it as arguments to another command. I commonly use it with `find` to act on files — for example, `find . -type f -mtime +7 | xargs rm` to delete old files."

***

## Command 154: `find . -type f -mtime +2 | xargs rm`

**What it does:** Finds all files modified **more than 2 days ago** and deletes them.

**Breaking it down:**

| Part          | Meaning                            |
| ------------- | ---------------------------------- |
| `find`        | Search command                     |
| `.`           | Start from current directory       |
| `-type f`     | Match files only (not directories) |
| `-mtime +2`   | Modified more than 2 days ago      |
| `\| xargs rm` | Delete each file found             |

**Understanding `-mtime`:**

| Option      | Meaning                                     |
| ----------- | ------------------------------------------- |
| `-mtime 2`  | Modified exactly 2 days ago                 |
| `-mtime +2` | Modified **more than** 2 days ago (older)   |
| `-mtime -2` | Modified **within** the last 2 days (newer) |

```bash
# ALWAYS search first before deleting
find . -type f -mtime +2

# Then delete
find . -type f -mtime +2 | xargs rm

# Clean /tmp files older than 2 days
find /tmp -type f -mtime +2 | xargs rm

# Delete log files older than 7 days
find /var/log/myapp -type f -mtime +7 | xargs rm

# Delete backup files older than 30 days
find /backup -type f -mtime +30 | xargs rm
```

> **Best Practice: Search first. Delete later.** Run the `find` command first and review what will be deleted. Only add `| xargs rm` after confirming the list is correct.

**Safer Alternatives:**

```bash
# Built-in -delete flag (safer with spaces in filenames)
find . -type f -mtime +2 -delete

# Using -exec
find . -type f -mtime +2 -exec rm {} \;
```

**DevOps Use Cases:**

* Disk usage at 95%: `find /var/log -type f -mtime +7 | xargs rm`
* Jenkins workspace cleanup: `find /var/lib/jenkins/workspace -type f -mtime +30 | xargs rm`

***

## Command 155: `find . -type f -mtime +365 | xargs rm`

**What it does:** Finds and deletes files modified **more than one year ago**.

```bash
# Search first
find . -type f -mtime +365

# Then delete
find . -type f -mtime +365 | xargs rm
```

**DevOps Use Cases:**

```bash
# Annual archive cleanup
find /backup -type f -mtime +365 | xargs rm

# Jenkins old job artifacts
find /var/lib/jenkins/jobs -type f -mtime +365 | xargs rm
```

***

## Command 156: `find . -type f -iname "test" -maxdepth 1`

**What it does:** Searches for **files** named `test` (case-insensitive) **only in the current directory**.

```bash
find . -type f -iname "test" -maxdepth 1
```

| Option        | Meaning                                               |
| ------------- | ----------------------------------------------------- |
| `-type f`     | Files only                                            |
| `-iname`      | Case-insensitive name match                           |
| `"test"`      | Name pattern to match                                 |
| `-maxdepth 1` | Search only the current directory, not subdirectories |

**`-name` vs `-iname`:**

| `-name "test"`      | `-iname "test"`                        |
| ------------------- | -------------------------------------- |
| Case-sensitive      | Case-insensitive                       |
| Matches `test` only | Matches `test`, `Test`, `TEST`, `tEsT` |

> **Memory Tip:** The `i` in `-iname` stands for **Insensitive**.

```bash
# Find README regardless of case
find . -type f -iname "readme"

# Find any PDF file
find . -iname "*.pdf"

# Find Jenkinsfile (matches Jenkinsfile, jenkinsfile, JENKINSFILE)
find . -iname "jenkinsfile"

# Find Kubernetes manifests
find . -iname "*.yaml"
```

**Interview Answer:**

> "`-name` is case-sensitive — `test` and `Test` are different. `-iname` is case-insensitive and matches all case variants. In DevOps, I prefer `-iname` because filenames can vary in case across environments."

***

## Command 157: `find . -type d -iname "test" -maxdepth 2`

**What it does:** Searches for **directories** named `test` (case-insensitive) up to **2 levels deep**.

```bash
find . -type d -iname "test" -maxdepth 2

# Example structure:
# ./test/           -- depth 1: FOUND
# ./abc/test/       -- depth 2: FOUND
# ./abc/xyz/test/   -- depth 3: IGNORED (exceeds maxdepth 2)

# Other useful examples
find . -type d -iname "logs"
find . -type d -iname "config"
find . -type d -iname "k8s"     # Locate Kubernetes manifest directory
```

***

## Command 158: `find . -iname "test" -maxdepth 1`

**What it does:** Searches for **both files and directories** named `test` — no `-type` filter applied.

```bash
find . -iname "test" -maxdepth 1
# Matches: ./test (file), ./test/ (directory), ./TEST, ./Test

# Wildcard patterns
find . -iname "*.yaml"   # All YAML files
find . -iname "*.sh"     # All shell scripts
find . -iname "*.log"    # All log files
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

***

## Command 159: Links – Soft Link & Hard Link

### What is a Link?

A link is a way to reference a file from a different location without copying it. Linux has two types:

| Type                                    | Like...                                                        |
| --------------------------------------- | -------------------------------------------------------------- |
| **Soft Link (Symbolic Link / Symlink)** | A Windows shortcut — points to the _path_ of the original file |
| **Hard Link**                           | Another name for the exact same file data (same inode)         |

### What is an Inode?

Every file in Linux has:

* A **filename** (a human-readable label stored in the directory)
* An **inode number** (the actual unique ID Linux uses to locate file data and metadata)

```bash
ls -li          # View inode numbers alongside file details
```

> Think of the inode as the file's internal ID. The filename is just a label attached to that ID.

***

### Soft Link vs Hard Link Comparison

| Feature                    | Soft Link              | Hard Link                    |
| -------------------------- | ---------------------- | ---------------------------- |
| Command                    | `ln -s`                | `ln`                         |
| Like a Windows shortcut    | Yes                    | No                           |
| Has its own inode          | Yes                    | No (shares original's inode) |
| Works across filesystems   | Yes                    | No                           |
| Can link directories       | Yes                    | Normally no                  |
| Breaks if original deleted | Yes (becomes dangling) | No (data survives)           |
| Common in DevOps           | Very common            | Less common                  |

***

### Soft Link: `ln -s test1 softlink`

**What it does:** Creates a symbolic link — a shortcut pointing to the original file.

```bash
# Syntax
ln -s original_file link_name

# Relative path
ln -s test1 softlink

# Absolute path (more reliable)
ln -s /home/ubuntu/test1 softlink
```

**Step-by-step example:**

```bash
# Create a file
echo "Welcome to Linux" > test1

# Create a soft link
ln -s test1 softlink

# Verify -- notice the -> arrow
ls -l
# lrwxrwxrwx softlink -> test1
# -rw-r--r-- test1

# Reading through the link reads the original
cat softlink
# Welcome to Linux

# Editing through the link changes the original
echo "DevOps" >> softlink
cat test1
# Welcome to Linux
# DevOps

# Delete the original -- link becomes broken (dangling)
rm test1
cat softlink
# cat: softlink: No such file or directory

# Check inodes -- they will be DIFFERENT
ls -li
```

**DevOps Use Cases:**

```bash
# Nginx: enable a site by creating a symlink
ln -s /etc/nginx/sites-available/myapp.conf /etc/nginx/sites-enabled/myapp.conf

# Deployment: point 'current' to the latest release
ln -s /opt/app/releases/v2 /opt/app/current
# When v3 arrives, just update the symlink -- no code change needed

# Shortcut to frequently accessed logs
ln -s /var/log/myapp/application.log app.log
tail -f app.log
```

***

### Hard Link: `ln test1 hardlink`

**What it does:** Creates a hard link — another directory entry pointing to the **same inode** (same file data).

```bash
# Syntax (note: NO -s flag)
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

# Delete the original -- data still accessible through the hard link!
rm test1
cat hardlink
# Linux   <-- still works!
```

**Hard Link Restrictions:**

* Cannot link to a **directory** (prevents directory loops)
* Cannot cross **file systems** (inodes are unique only within one filesystem)

**Interview Answer:**

> "A soft link is a symbolic reference to another file — it has its own inode, can cross filesystems and link directories, but becomes broken if the original is deleted. A hard link points directly to the same inode as the original — both names share the same data. It cannot cross filesystems and cannot link directories, but it continues to work even if the original filename is deleted."

***

## Command 160: `uname -a`

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

***

## Command 161: `cat /etc/os-release`

**What it does:** Shows which Linux _distribution_ is installed (Ubuntu, CentOS, Amazon Linux, etc.).

```bash
cat /etc/os-release
# NAME="Ubuntu"
# VERSION="24.04.2 LTS"

# Filter specific fields
grep "^NAME=" /etc/os-release
grep "^VERSION=" /etc/os-release
```

> **Why this matters:** Package managers differ by distro. Ubuntu uses `apt`; CentOS/RHEL uses `yum`/`dnf`. Deployment scripts often check this file before installing software.

***

## Command 162: `hostname`

**What it does:** Displays the server's hostname.

```bash
hostname        # Server name (e.g., server01)
hostname -I     # IP address(es)
hostname -f     # Fully Qualified Domain Name (FQDN)
hostname -s     # Short hostname
```

> Always run `hostname` first when you SSH into a server to confirm you are on the correct machine.

***

## Command 163: `who | wc -l`

**What it does:** Counts the number of active login sessions on the server.

```bash
who         # List all logged-in users/sessions
who | wc -l # Count total login sessions
```

> **Note:** One user connected via two terminals counts as **two** sessions.

***

## Command 164: `whoami`

**What it does:** Shows the username of the currently logged-in user.

```bash
whoami
# ubuntu

echo "Current user: $(whoami)"
ps -u $(whoami)
```

**`who` vs `whoami`:**

| Command  | Shows                              |
| -------- | ---------------------------------- |
| `who`    | All logged-in sessions (all users) |
| `whoami` | Only your current username         |

**When you first SSH into a server — always verify:**

```
Which OS?       -->  cat /etc/os-release
Which kernel?   -->  uname -a
Which server?   -->  hostname
Who am I?       -->  whoami
Who else here?  -->  who
```

**Interview Answer:**

> "When I SSH into a production server, I first run `hostname` to confirm I'm on the correct server, `whoami` to verify my account, `cat /etc/os-release` to identify the Linux distribution, and `uname -r` to check the kernel version."

***

## Command 165: `nohup ./script.sh &`

**What it does:** Runs a script in the background and keeps it running even after you **log out**.

* **`nohup`** = "No Hang Up" — ignores the SIGHUP signal sent when a session closes.
* **`&`** = runs in the background immediately, freeing your terminal.

### The Problem Without `nohup`

If you start a 2-hour deployment script over SSH and your laptop loses internet, Linux terminates the script along with your SSH session.

**Comparison:**

| Command               | Runs in Background   | Continues After Logout |
| --------------------- | -------------------- | ---------------------- |
| `./script.sh`         | No — terminal locked | No                     |
| `./script.sh &`       | Yes                  | No — stops on logout   |
| `nohup ./script.sh &` | Yes                  | **Yes**                |

```bash
nohup ./deploy.sh &           # Long deployment script
nohup ./db_backup.sh &        # 3-hour database backup
nohup python3 app.py &        # Python application
nohup java -jar app.jar &     # Java application

# Output goes to nohup.out by default
cat nohup.out

# Custom output file
nohup ./script.sh > output.log 2>&1 &

# To stop a nohup process later
ps -ef | grep script.sh
kill PID
```

**DevOps Use Cases:**

* Running long CI/CD deployment scripts over SSH
* Database exports and backups
* Log collection agents
* Starting applications that must persist after SSH logout

***

## Command 166: `top`

**What it does:** Provides a **real-time**, auto-refreshing view of system resource usage — Linux's built-in Task Manager.

```bash
top
```

**Key fields in the output:**

| Field     | Meaning                      |
| --------- | ---------------------------- |
| `%Cpu(s)` | Overall CPU utilization      |
| `MiB Mem` | Total / used / free RAM      |
| `PID`     | Process ID                   |
| `USER`    | Process owner                |
| `COMMAND` | Application name             |
| `%CPU`    | CPU usage by that process    |
| `%MEM`    | Memory usage by that process |

**Interactive keys while `top` is running:**

| Key | Action                                   |
| --- | ---------------------------------------- |
| `q` | Quit                                     |
| `k` | Kill a process (enter PID when prompted) |
| `M` | Sort by memory usage                     |
| `P` | Sort by CPU usage                        |

**`top` vs `ps`:**

| `top`                 | `ps`                         |
| --------------------- | ---------------------------- |
| Live, auto-refreshing | One-time snapshot            |
| Interactive           | Non-interactive (scriptable) |
| Real-time monitoring  | Scripting and automation     |

**DevOps Use Cases:**

* Identify which process is consuming high CPU
* Detect memory leaks in a Java or Python application
* Monitor resource usage during a deployment
* Troubleshoot slow application performance

***

## Command 167: `ssh`

**What it does:** Securely connects to a remote Linux server over an encrypted channel.

* **Default port:** 22
* **Protocol:** SSH (Secure Shell) — encrypts all data including passwords

### Password Authentication

```bash
ssh username@server

# Examples
ssh ubuntu@192.168.1.10
ssh ubuntu@dev.company.com
ssh -p 2222 ubuntu@192.168.1.10    # Custom port
```

### Key-Based Authentication (AWS EC2)

AWS EC2 instances use `.pem` key files instead of passwords.

```bash
ssh -i demo.pem ubuntu@54.26.118.12       # Ubuntu AMI
ssh -i demo.pem ec2-user@18.212.10.20     # Amazon Linux AMI
```

> **Always fix key permissions before use — SSH refuses overly open keys.**

```bash
chmod 400 demo.pem    # Owner can read only
```

**Common SSH Errors:**

| Error                           | Cause                                   | Fix                    |
| ------------------------------- | --------------------------------------- | ---------------------- |
| `Permission denied (publickey)` | Wrong key / username / IP / permissions | Verify all four        |
| `UNPROTECTED PRIVATE KEY FILE!` | Key permissions too open                | `chmod 400 demo.pem`   |
| `Connection refused`            | SSH not running or port 22 blocked      | Check service/firewall |

**Why SSH over Telnet?** SSH encrypts all communication. Telnet sends passwords and data in **plain text** — a serious security risk on any network.

***

## Commands 168–170: `scp`

**What it does:** Securely copies files between machines **over SSH**.

### Command 168: Upload a file to `/tmp`

```bash
scp file_name user@server:/tmp

# Examples
scp report.txt ubuntu@192.168.1.10:/tmp
scp -i demo.pem app.jar ubuntu@54.26.118.12:/tmp    # With key file
```

### Command 169: Upload a file to the home directory

```bash
scp file_name user@server:/home/ubuntu

# Example
scp config.yaml ubuntu@54.26.118.12:/home/ubuntu
```

### Command 170: Copy an entire directory

```bash
scp -r directory user@server:/path

# Example
scp -r project ubuntu@54.26.118.12:/home/ubuntu
```

**Other useful `scp` patterns:**

```bash
# Download a file from a remote server
scp ubuntu@192.168.1.10:/tmp/report.txt .

# Upload with key file
scp -i demo.pem report.txt ubuntu@54.26.118.12:/tmp
```

***

## Command 171: `rsync`

**What it does:** Synchronizes files between locations, transferring **only the changed portions** — much faster than `scp` for repeated transfers.

```bash
# Basic file sync
rsync file user@server:/home/temp

# Archive mode with progress (most common usage)
rsync -avh --progress project/ ubuntu@54.26.118.12:/home/project/
```

**Option breakdown:**

| Option       | Meaning                                                     |
| ------------ | ----------------------------------------------------------- |
| `-a`         | Archive (preserves permissions, timestamps, symlinks, etc.) |
| `-v`         | Verbose output                                              |
| `-h`         | Human-readable file sizes                                   |
| `-z`         | Compress during transfer                                    |
| `--progress` | Show transfer progress                                      |
| `--delete`   | Remove destination files not present in source              |

```bash
# Sync a directory using SSH key
rsync -avz -e "ssh -i demo.pem" project/ ubuntu@54.26.118.12:/opt/project

# Download logs from server
rsync -av ubuntu@server:/var/log/ ./logs
```

**`scp` vs `rsync`:**

|                      | `scp`                     | `rsync`                              |
| -------------------- | ------------------------- | ------------------------------------ |
| What it transfers    | Everything, every time    | Only changed parts                   |
| Speed on repeat runs | Same                      | Much faster                          |
| Preserves metadata   | Basic                     | Full (with `-a`)                     |
| Best for             | Simple one-time transfers | Deployments, backups, repeated syncs |

**Interview Answer:**

> "I use `scp` for simple one-time file transfers. I prefer `rsync` for deployments and backups because it only transfers changed portions and is much more efficient when syncing repeatedly. `rsync` also preserves full metadata with the `-a` flag."

***

## Command 172: `ping`

**What it does:** Tests **network reachability** between your machine and another host using ICMP Echo Requests.

```bash
ping ip_address
ping hostname
ping google.com

# Examples
ping 8.8.8.8
ping google.com
ping 127.0.0.1          # Loopback -- tests your own machine
ping 192.168.1.1        # Gateway
ping -c 4 google.com    # Send only 4 packets (important on Linux -- otherwise runs forever until Ctrl+C)
```

**Output fields:**

| Field      | Meaning                               |
| ---------- | ------------------------------------- |
| `icmp_seq` | Packet sequence number                |
| `ttl`      | Time To Live — limits packet lifetime |
| `time`     | Round-trip response time (ms)         |

> **Important:** `ping` tests **network connectivity only** — not application health. Many servers block ICMP for security. A failed `ping` does not always mean the server is down.

**DevOps Use Cases:**

* Check if a Kubernetes worker node is reachable: `ping worker-node`
* Verify database server is on the network: `ping db.company.com`
* Test DNS resolution: `ping google.com`

**Common `ping` Results:**

| Result            | Meaning                                     |
| ----------------- | ------------------------------------------- |
| Replies received  | Server is reachable                         |
| `Request timeout` | Server down, ICMP blocked, or network issue |
| `Unknown host`    | DNS resolution failed                       |

***

## Command 173: `telnet`

**What it does:** Tests whether a **TCP port is reachable** — verifies application-level connectivity, not just network.

* **Default Telnet service port:** 23
* **Used in DevOps:** Almost always for **port testing**, not as a remote login tool

```bash
telnet ip_address port

# Examples
telnet localhost 8080        # Check Tomcat/Jenkins
telnet 192.168.1.20 22      # Check SSH
telnet db.company.com 3306  # Check MySQL
telnet db.company.com 5432  # Check PostgreSQL
telnet redis.company.com 6379 # Check Redis
```

**Understanding Results:**

| Result                 | Meaning                                   |
| ---------------------- | ----------------------------------------- |
| `Connected`            | Port is open — application is listening   |
| `Connection refused`   | Application is NOT listening on that port |
| `Connection timed out` | Firewall or network problem               |

**`ping` vs `telnet`:**

|                                          | `ping`                               | `telnet`                      |
| ---------------------------------------- | ------------------------------------ | ----------------------------- |
| Protocol                                 | ICMP                                 | TCP                           |
| Tests                                    | Network reachability                 | Application port connectivity |
| Can `ping` succeed while `telnet` fails? | Yes — network OK but app not running | —                             |
| Can `telnet` succeed while `ping` fails? | —                                    | Yes — if ICMP is blocked      |

**If `telnet` is not installed:**

```bash
# Install on Amazon Linux 2
sudo yum install -y telnet

# Install on Amazon Linux 2023
sudo dnf install -y telnet

# Alternative: nc (netcat) -- preferred by most DevOps engineers
nc -zv 192.168.1.10 8080

# Alternative: Bash TCP (no installation needed)
timeout 5 bash -c '</dev/tcp/192.168.1.10/8080' && echo "Port Open" || echo "Port Closed"

# Alternative: curl (for HTTP services)
curl -I http://192.168.1.10:8080
```

***

## Command 174: `netstat -na | grep 8080`

**What it does:** Checks whether an application on the **local machine** is listening on port 8080.

This is one of the most commonly used troubleshooting commands in DevOps.

```bash
netstat -na | grep 8080
```

**Breaking it down:**

| Part           | Meaning                                    |
| -------------- | ------------------------------------------ |
| `netstat`      | Network statistics tool                    |
| `-n`           | Show numeric IPs and ports (not hostnames) |
| `-a`           | Show all sockets (listening + established) |
| `\| grep 8080` | Filter for port 8080 only                  |

**Example output:**

```
tcp    0    0 0.0.0.0:8080    0.0.0.0:*    LISTEN
```

`LISTEN` = application is waiting for incoming connections

```bash
netstat -na | grep 8080   # Check Tomcat/Jenkins
netstat -na | grep 22     # Check SSH
netstat -na | grep 3306   # Check MySQL
netstat -na | grep 80     # Check Nginx/Apache

# Shows PID and program name (requires sudo)
sudo netstat -tulpn
```

**Modern alternative:** `ss -tuln` (faster, preferred on modern Linux distributions)

**`netstat` vs `telnet`:**

|               | `netstat`                | `telnet`                              |
| ------------- | ------------------------ | ------------------------------------- |
| Where it runs | On the **local** machine | Tests from your machine to **remote** |
| What it shows | Local listeners          | Remote port connectivity              |

**If nothing appears in the output:** The application is not listening on that port. Possible causes:

* Application never started
* Application started on a different port
* A startup error occurred

**If it shows LISTEN but users still cannot connect:**

* Check firewall rules
* Verify cloud security group (AWS, Azure, GCP)
* Confirm load balancer is forwarding to port 8080

***

## The DevOps Network Troubleshooting Flow

When users report "the application isn't accessible":

```
Step 1: Test basic network connectivity
        ping app-server
        If successful -->

Step 2: Test the application port from remote
        telnet app-server 8080
        If connection fails -->

Step 3: Log into the server
        ssh ubuntu@app-server

Step 4: Verify if the application is listening locally
        netstat -na | grep 8080

Step 5: If nothing is listening --> restart the application
```

**Interview Answer:**

> "If an application isn't accessible on port 8080, I'd first use `ping` to verify network connectivity to the server. If reachable, I'd test port 8080 using `telnet` (or `nc`) to see if the application is accepting connections. Then I'd SSH into the server and run `netstat -na | grep 8080` or `ss -tuln` to confirm whether the application is listening. Based on findings, I'd inspect application logs and restart the service if necessary."

***

## Bonus: Inode In Depth

### What is an Inode?

An **inode** (Index Node) is a data structure in the Linux filesystem that stores **metadata about a file or directory** — but **not** the filename or the actual file content.

Think of an inode as the **identity card** of a file.

```
Filename  -------->  Inode  -------->  Actual Data Blocks
report.txt            123456           File Content
```

**Real-life analogy:**

A library maintains a card catalog:

* **Book Name** → Filename (stored in the directory)
* **Card Catalog Record** → Inode (stores metadata)
* **Shelf Location** → Disk blocks (stores actual content)

***

### What Does an Inode Store?

| Information          | Stored in Inode? |
| -------------------- | ---------------- |
| File size            | Yes              |
| Owner (UID)          | Yes              |
| Group (GID)          | Yes              |
| Permissions          | Yes              |
| Last modified time   | Yes              |
| Last accessed time   | Yes              |
| Number of hard links | Yes              |
| Disk block locations | Yes              |
| File type            | Yes              |
| **Filename**         | **No**           |
| **Actual file data** | **No**           |

> The filename is stored in the **directory entry**, which maps the name to an inode number.

***

### How Linux Finds a File

When you run `cat notes.txt`:

```
Step 1: Search directory for "notes.txt" --> find inode 14582
Step 2: Open inode 14582 --> read permissions, owner, disk block locations
Step 3: Go to disk blocks --> read the actual content
Step 4: Display content on screen
```

***

### Viewing Inode Numbers

```bash
# Create files
touch f1 f2 f3

# Show inode numbers
ls -i
# 1001 f1
# 1002 f2
# 1003 f3

# Detailed listing with inode
ls -li
# 1001 -rw-r--r-- 1 ubuntu ubuntu 0 Jul 20 f1

# Show full inode metadata
stat f1
# File: f1
# Inode: 1001
# Access: (0644/-rw-r--r--)
# Owner: ubuntu
```

***

### Inode and Links

**Hard link -- same inode:**

```bash
echo "Hello Linux" > file1
ln file1 file2          # Create hard link

ls -li
# 15876 file1
# 15876 file2            <-- SAME inode!
```

**Soft link -- different inode:**

```bash
ln -s file1 file3       # Create soft link

ls -li
# 15876 file1
# 15876 file2            <-- same inode (hard link)
# 16010 file3            <-- different inode (soft link)
```

***

### Inode Exhaustion -- A Critical DevOps Scenario

```bash
# Check inode usage
df -i

# Example output:
# Filesystem     Inodes  IUsed   IFree IUse%
# /dev/xvda1     655360  655360      0  100% /
```

Even if `df -h` shows only 50% disk used, you **cannot create new files** if inodes are 100% used.

**This commonly happens with:**

* Millions of tiny log files (e.g., 1 KB each x 5 million = inodes exhausted)
* Container log files under `/var/log/containers`
* Jenkins build artifacts creating thousands of small files

**Solution:** Delete old log files or configure log rotation.

***

### Find Files by Inode

```bash
# Find all files with a specific inode number
find . -inum 14582

# Very useful when removing one of multiple hard links
```

***

### Inode Summary Table

| Command                | Purpose                              |
| ---------------------- | ------------------------------------ |
| `ls -i`                | Show inode numbers                   |
| `ls -li`               | Inode numbers with full file details |
| `stat file`            | Show detailed inode metadata         |
| `find . -inum <inode>` | Find files by inode number           |
| `df -i`                | Check inode usage per filesystem     |
| `ln file hardlink`     | Create hard link (same inode)        |
| `ln -s file softlink`  | Create symbolic link (new inode)     |

**Memory Trick:**

```
Hard Link  =  Same House, Two Nameplates
              Nameplate 1 --> House
              Nameplate 2 --> Same House
              Removing one nameplate does not remove the house.

Soft Link  =  A sticky note saying "Go to House #25"
              If House #25 is demolished, the sticky note still exists
              but points to nowhere -- a broken symlink.
```

***

### Interview Questions on Inodes

| Question                                                 | Answer                                                               |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| What is an inode?                                        | A data structure storing file metadata (not the filename or content) |
| Does an inode store the filename?                        | No — the filename is stored in the directory entry                   |
| How do you display inode numbers?                        | `ls -i` or `ls -li`                                                  |
| Which command shows complete inode info?                 | `stat filename`                                                      |
| Can two filenames share one inode?                       | Yes — through hard links                                             |
| Why can Linux say "No space" when disk shows free space? | Inodes may be exhausted — check with `df -i`                         |

***

## End-of-Day Practice Lab

Try these tasks on your Linux VM — they combine everything from today:

1. Create three files with different modification times. Use `find -mtime` to identify which ones would be deleted by `xargs rm`.
2. Create both a soft link and a hard link. Compare their inode numbers with `ls -li`. Delete the original and observe the behavior difference.
3. Run `nohup sleep 600 &`. Log out (or close the terminal). Reconnect and verify it is still running with `ps -ef | grep sleep`.
4. Use `ssh` to connect to another Linux machine. Transfer a file using both `scp` and `rsync`. Compare the experience.
5. Start a simple web server: `python3 -m http.server 8080`. Verify it using `netstat -na | grep 8080`, then test from another terminal with `telnet localhost 8080`.
6. Use `find . -iname "*.sh"` to locate all shell scripts in your home directory.
7. Check inode usage on your system with `df -i`. Note the percentage used on each filesystem.
8. Create a hard link and a soft link to the same file. Delete the original. Observe which link still works and which breaks.

***

## Quick Command Reference

| Command                                              | Purpose                                        |
| ---------------------------------------------------- | ---------------------------------------------- |
| `command \| xargs rm`                                | Pass piped output as arguments to rm           |
| `find . -type f -mtime +2 \| xargs rm`               | Delete files older than 2 days                 |
| `find . -type f -mtime +365 \| xargs rm`             | Delete files older than 1 year                 |
| `find . -type f -iname "*.sh"`                       | Find files by name (case-insensitive)          |
| `find . -type d -iname "logs" -maxdepth 2`           | Find directories, max 2 levels deep            |
| `ln -s original link`                                | Create a soft/symbolic link                    |
| `ln original hardlink`                               | Create a hard link (same inode)                |
| `ls -li`                                             | View inode numbers with file details           |
| `stat file`                                          | Show full inode metadata                       |
| `find . -inum <inode>`                               | Find all files sharing an inode                |
| `df -i`                                              | Check inode usage per filesystem               |
| `uname -a`                                           | Show OS and kernel info                        |
| `cat /etc/os-release`                                | Show Linux distribution details                |
| `hostname`                                           | Show server hostname                           |
| `whoami`                                             | Show current username                          |
| `who \| wc -l`                                       | Count active login sessions                    |
| `nohup ./script.sh &`                                | Run script in background, persist after logout |
| `top`                                                | Real-time process/CPU/memory monitoring        |
| `ssh user@server`                                    | Connect to remote server                       |
| `ssh -i key.pem user@ip`                             | Connect with AWS .pem key file                 |
| `scp file user@server:/path`                         | Securely copy a file to remote server          |
| `scp -r dir user@server:/path`                       | Copy an entire directory to remote server      |
| `rsync -avz -e "ssh -i key.pem" src/ user@ip:/dest/` | Sync files using SSH key                       |
| `ping -c 4 host`                                     | Test network reachability (4 packets)          |
| `telnet host port`                                   | Test if a TCP port is open                     |
| `nc -zv host port`                                   | Test TCP port (modern alternative to telnet)   |
| `netstat -na \| grep PORT`                           | Check if an app is listening locally           |
| `ss -tuln`                                           | Modern replacement for netstat                 |

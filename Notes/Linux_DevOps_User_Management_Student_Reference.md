# Linux for DevOps – User Management Reference Notes

> **How to use this document:**
> Each section covers one user management command or concept with syntax, real-world DevOps examples, practice exercises, common questions, and interview tips. Try every command on a test Linux environment.

---

## Table of Contents

| Module | Topics |
|--------|--------|
| [Module 1: User Management Concepts](#module-1-user-management-concepts) | UIDs, GIDs, System files (`/etc/passwd`, `/etc/shadow`, `/etc/group`) |
| [Module 2: Managing Users](#module-2-managing-users) | `useradd` vs `adduser`, `userdel`, home directories |
| [Module 3: Modifying Users & Passwords](#module-3-modifying-users--passwords) | `usermod`, `passwd`, locking/unlocking, password aging (`chage`) |
| [Module 4: Managing Groups](#module-4-managing-groups) | `groupadd`, `groupdel`, primary vs secondary groups |
| [Module 5: Privilege Escalation & Sudo](#module-5-privilege-escalation--sudo) | `su` vs `su -`, `sudo`, `visudo`, `/etc/sudoers` |
| [Module 6: Identity & Session Audit](#module-6-identity--session-audit) | `id`, `whoami`, `who`, `w`, `last` |
| [Quick Reference Table](#quick-reference-table) | Summary of all user management commands |

---

## Module 1: User Management Concepts

### What is it?
Linux is a multi-user operating system. To manage permissions and keep files secure, Linux assigns every person, service, and process a unique identity: a **User ID (UID)** and a **Group ID (GID)**.

### The Three Types of Users
1. **Root User (UID 0):** The superuser/system administrator. Root has unrestricted access to all files and commands.
2. **System Users (UID 1–999 / 1–499):** Created automatically by the OS or service installers (e.g., `nginx`, `mysql`, `jenkins`). They run background services and do not have interactive login shells.
3. **Regular Users (UID 1000+):** Human users who log in to use the system.

### Critical System Files
Linux stores user information in plain-text configuration files.

#### 1. `/etc/passwd` — User Account Information
Stores basic user details. Anyone can read this file.
Each line represents one user:
`jenkins:x:1001:1001:Jenkins CI/CD,,,:/var/lib/jenkins:/bin/bash`
- `jenkins`: Username
- `x`: Password placeholder (actual encrypted password is stored in `/etc/shadow`)
- `1001`: User ID (UID)
- `1001`: Primary Group ID (GID)
- `Jenkins CI/CD,,,`: GECOS field (Full name, room number, phone numbers)
- `/var/lib/jenkins`: User's Home Directory
- `/bin/bash`: User's default login shell (e.g., `/bin/bash` or `/bin/sh`)

#### 2. `/etc/shadow` — Encrypted Passwords & Password Aging
Stores secure, encrypted passwords and account expiration details. Only root can read this file.
`jenkins:$6$xyz...:19500:0:99999:7:::`
- `jenkins`: Username
- `$6$xyz...`: Encrypted password hash (using SHA-512)
- `19500`: Days since Jan 1, 1970, when the password was last changed
- `0`: Minimum days required between password changes
- `99999`: Maximum days before the password must be changed
- `7`: Warning days before password expires
- Remaining fields: Account inactive days, expiration date, reserved fields

#### 3. `/etc/group` — Group Information
Stores group lists and memberships.
`devops:x:2002:ubuntu,jenkins`
- `devops`: Group name
- `x`: Group password placeholder
- `2002`: Group ID (GID)
- `ubuntu,jenkins`: Users belonging to this group as a secondary/supplementary group

---

### DevOps Use Cases
- **Inspecting user shell configurations:** Confirming application accounts cannot log in interactively by checking if their shell is set to `/sbin/nologin` or `/usr/sbin/nologin` in `/etc/passwd`.
- **Debugging UID mismatches:** Ensuring a Docker container user UID matches the host directory UID to avoid permission errors.

**Practice Exercises:**
1. View the first 5 lines of `/etc/passwd`: `head -n 5 /etc/passwd`. Identify the root user and its shell.
2. Search for your current user in `/etc/passwd`: `grep $(whoami) /etc/passwd`.
3. Try to view the password hash file: `cat /etc/shadow`. Observe the "Permission denied" error. Now run `sudo cat /etc/shadow | grep $(whoami)` to see the hashed entry.

---

### Common Questions

| Question | Answer |
|----------|--------|
| Why is `/etc/passwd` readable by everyone? | Programs like `ls` need to read it to map UIDs to human-readable usernames. |
| What does `/usr/sbin/nologin` or `/bin/false` mean? | It prevents the user from logging into an interactive terminal session (common for service accounts like Docker, Nginx, or Prometheus). |
| What happens if a UID is 0? | That user gets full root permissions, regardless of the username. (Avoid this for security!) |

**Interview Answer:**
> "User accounts are defined in `/etc/passwd` containing details like UID, home directory, and default shell. Hashed passwords and aging rules are stored securely in `/etc/shadow`, accessible only by root. Groups are defined in `/etc/group`. In DevOps, I verify `/etc/passwd` to ensure system service accounts are configured with a non-interactive shell like `/usr/sbin/nologin`."

---

## Module 2: Managing Users

### What is it?
Commands used to add and remove users from the system. 

---

### `useradd` vs `adduser`
- **`useradd`**: A low-level binary utility. It is standard across all Linux distributions. By default, it does **not** create a home directory or ask for a password unless you pass specific command-line flags.
- **`adduser`**: A high-level Perl script (common on Debian/Ubuntu). It is interactive, automatically creates a home directory, sets up default skeleton files, and prompts you to set a password immediately.

```bash
# Low-level user creation (standard for scripting)
useradd [options] username

# High-level interactive user creation (Debian/Ubuntu only)
adduser username
```

---

### `useradd` Command Options

| Option | Meaning |
|--------|---------|
| `-m` | Create the user's home directory (e.g., `/home/username`) |
| `-s shell` | Specify the login shell (e.g., `/bin/bash` or `/usr/sbin/nologin`) |
| `-u uid` | Manually specify a custom User ID |
| `-g group` | Assign user to their primary group (must exist) |
| `-G group1,group2` | Assign user to secondary/supplementary groups |
| `-c "Comment"` | Add full name or comment (stored in GECOS field) |
| `-r` | Create a system account (UID below 1000, no home directory by default) |

---

### Examples

```bash
# Create a standard user with a home directory and bash shell
sudo useradd -m -s /bin/bash deployuser

# Create a system service account for a Prometheus exporter
sudo useradd -r -s /usr/sbin/nologin prometheus

# Create a user with a specific UID and primary group
sudo useradd -m -u 1500 -g developers coder

# Delete a user, keeping their files intact
sudo userdel deployuser

# Delete a user AND remove their home directory and mail spool (recursively)
sudo userdel -r coder
```

---

### DevOps Use Cases
- **Automating Node/Agent Setup:** In CI/CD pipelines, you run `useradd -m -s /bin/bash jenkins-agent` to provision build agents.
- **Microservices Security:** Packaging a Java app in a container and creating a dedicated non-root runner user with `useradd -r -s /usr/sbin/nologin appuser` to limit attack surface.

**Practice Exercises:**
1. Create a user named `testuser` without a home directory: `sudo useradd testuser`. Check if they have a directory under `/home/`.
2. Delete the user: `sudo userdel testuser`.
3. Now create a user with a home directory and bash shell: `sudo useradd -m -s /bin/bash devuser`. Verify `/home/devuser` exists.
4. Clean up using `sudo userdel -r devuser`. Confirm the directory `/home/devuser` is gone.

---

### Common Questions

| Question | Answer |
|----------|--------|
| Why did `useradd` create a user without a password? | `useradd` creates locked accounts by default. You must run `passwd username` to assign a password. |
| What does `userdel -r` delete? | It deletes the user, their home directory, and their mail spool. It does not delete files they owned elsewhere on the system. |
| How do I find files left behind by a deleted user? | Run `find / -nouser` to find files owned by a UID that no longer exists in `/etc/passwd`. |

**Interview Answer:**
> "I use `useradd` for automated shell scripts since it's present on all distros and accepts flags directly. For manual creation on Ubuntu, `adduser` is easier because it prompts for passwords and configures the environment interactively. When removing users, I always use `userdel -r` to clean up their home directory and prevent orphaned files."

---

## Module 3: Modifying Users & Passwords

### What is it?
After creating users, you frequently need to update their accounts, change passwords, change group memberships, or set security policies.

---

### `usermod` — Modify User Accounts
Used to change any setting defined in `/etc/passwd`.

```bash
# Add a user to secondary groups (ALWAYS use -a with -G to append, otherwise it overwrites existing groups!)
sudo usermod -aG groupname username

# Change a user's primary group
sudo usermod -g primarygroup username

# Change home directory path and move old files to the new location
sudo usermod -m -d /new/home/dir username

# Change user's login shell
sudo usermod -s /bin/zsh username

# Lock a user account (prevents password login)
sudo usermod -L username

# Unlock a user account
sudo usermod -U username
```

---

### `passwd` — Password Management

```bash
# Change your own password
passwd

# Change another user's password (root only)
sudo passwd username

# Force a user to change their password on next login
sudo passwd -e username

# Lock password login for user (similar to usermod -L)
sudo passwd -l username

# Unlock password login
sudo passwd -u username
```

---

### `chage` — Password Aging Policy
In enterprise and production environments, security policies require regular password rotations.

```bash
# View user's current password aging policies
sudo chage -l username

# Force password change every 90 days, warn 7 days in advance
sudo chage -M 90 -W 7 username

# Set account expiration date (YYYY-MM-DD)
sudo chage -E "2026-12-31" username
```

---

### DevOps Use Cases
- **Granting Docker permissions:** Running `sudo usermod -aG docker jenkins` to allow the Jenkins runner to execute docker commands without needing root privileges.
- **Contractor access limits:** Setting an account expiry date with `chage -E` for short-term consultants.

**Practice Exercises:**
1. Create a dummy user: `sudo useradd -m -s /bin/bash tester`.
2. Check their password status: `sudo passwd -S tester`. (Usually shows 'L' for locked or 'NP' for no password).
3. Set their password: `sudo passwd tester`. Check status again.
4. Force them to change their password on next login: `sudo passwd -e tester`. 
5. View their password age attributes: `sudo chage -l tester`.
6. Clean up: `sudo userdel -r tester`.

---

### Common Questions

| Question | Answer |
|----------|--------|
| What happens if I forget the `-a` in `usermod -G`? | It will remove the user from all secondary groups not listed in the command. This can break their access (e.g., removing them from `sudo` or `docker`). |
| How do I change a user's login name? | Run `sudo usermod -l newname oldname`. |
| Can a locked user still log in via SSH keys? | Yes! Locking a password (via `passwd -l` or `usermod -L`) only blocks password authentication. You must disable their SSH keys or change their shell to `/usr/sbin/nologin` to block SSH key login. |

**Interview Answer:**
> "To modify users, I use `usermod`. For example, to grant docker access to a user, I use `usermod -aG docker username`. I emphasize using the `-a` (append) flag to avoid accidentally removing them from other secondary groups. For password rotation compliance, I use `chage` to configure minimum/maximum password age and account expiration dates."

---

## Module 4: Managing Groups

### What is it?
Groups are collections of users. Instead of assigning permissions to users individually, you assign permissions to a group, and members of that group inherit those permissions.

- **Primary Group:** Assigned when a user is created. Every user must have exactly one primary group (usually a group with the same name as the username). It is defined by the GID in `/etc/passwd`.
- **Secondary (Supplementary) Groups:** Additional groups a user is added to. They are used to grant access to folders, devices, or utilities (like `sudo` or `docker`). They are defined in `/etc/group`.

---

### Group Commands

```bash
# Create a new group
sudo groupadd groupname

# Create a group with a specific Group ID (GID)
sudo groupadd -g 2500 groupname

# Delete a group
sudo groupdel groupname

# Add/Remove users to/from a group using gpasswd
sudo gpasswd -a username groupname    # Add user
sudo gpasswd -d username groupname    # Remove user
```

---

### Managing Group File Permissions (chgrp)
To share files among members of a group, you change the group ownership of a folder or file.

```bash
# Change group ownership of a file
chgrp groupname filename

# Change group ownership recursively for a directory
sudo chgrp -R groupname /opt/shared_folder
```

---

### DevOps Use Cases
- **Team Access Management:** Creating a `devops` group: `sudo groupadd devops` and adding developers to it, then granting the `devops` group write permissions to deployment directories under `/var/www/` or `/opt/apps/`.
- **Microservices Collaboration:** Adding the application runner user `wildfly` and the web server user `nginx` to a shared group `web-content` to let them read/write static assets.

**Practice Exercises:**
1. Create a group: `sudo groupadd devops`.
2. Check if it was created: `grep devops /etc/group`.
3. Add your current user to it: `sudo usermod -aG devops $(whoami)`.
4. Refresh your group memberships in your current session: `newgrp devops`. Run `groups` to confirm you are in the group.
5. Remove yourself from the group: `sudo gpasswd -d $(whoami) devops`.
6. Delete the group: `sudo groupdel devops`.

---

### Common Questions

| Question | Answer |
|----------|--------|
| Can I delete a group that is a user's primary group? | No. Linux prevents this. You must change the user's primary group or delete the user first. |
| What is the `newgrp` command used for? | When you add a user to a group, the change doesn't take effect in open terminal sessions. `newgrp groupname` logs you into the group immediately without needing to log out and back in. |
| How do I find all users in a group? | Check `/etc/group` using grep: `grep "^groupname:" /etc/group`. |

**Interview Answer:**
> "Groups are critical for managing access controls at scale. I use `groupadd` to establish groups like `developers` or `sysadmin`. I add users using `usermod -aG` or `gpasswd -a`. When folders require shared write access, I change the group ownership using `chgrp -R` and ensure permissions allow group-write access (`g+w`)."

---

## Module 5: Privilege Escalation & Sudo

### What is it?
DevOps engineers often need to install software, modify configurations, or restart services—tasks that require administrative permissions. However, logging in directly as `root` is a security risk. Instead, Linux users use privilege escalation.

---

### `su` vs `su -`
`su` stands for **s**ubstitute **u**ser or **s**uper **u**ser. It switches your session to another user.

```bash
# Switch to another user, keeping your current environment variables (non-login shell)
su username

# Switch to another user AND load their full profile, home directory, and environment (login shell)
su - username

# Switch to root (requires knowing root's password)
su -
```

---

### `sudo` — Superuser Do
`sudo` runs a single command with root privileges (or as another user) without switching sessions.
- Requires your **own** password, not root's password.
- Logs every command to `/var/log/auth.log` or `/var/log/secure` for security audits.

```bash
# Run a command as root
sudo apt update

# Run a command as a different user (e.g., run as postgres user)
sudo -u postgres psql

# Open a shell as root (equivalent to su - but using your own sudo password)
sudo -i
```

---

### The `/etc/sudoers` File & `visudo`
The `/etc/sudoers` file defines who can run what commands.
> [!CAUTION]
> NEVER edit `/etc/sudoers` with a normal text editor like `nano` or `vi`. If you make a syntax error, you can lock yourself out of sudo permanently. ALWAYS use `sudo visudo`. It performs syntax validation before saving.

#### Format of `/etc/sudoers`
`ubuntu ALL=(ALL:ALL) ALL`
- `ubuntu`: The user affected.
- `ALL`: Applies to all hostnames.
- `(ALL:ALL)`: Can run commands as any user and any group.
- `ALL`: Can run all commands.

#### Group Sudo Rules (e.g., admin or sudo groups)
`%sudo   ALL=(ALL:ALL) ALL`
- `%` means group. Members of the `sudo` group can run any command.

#### Passwordless Sudo (Common in DevOps automation)
`jenkins ALL=(ALL) NOPASSWD: ALL`
- Allows the `jenkins` user to run any command as root without prompting for a password. Useful for automated deployments.

---

### DevOps Use Cases
- **CI/CD Automation:** Configuring Jenkins agents to restart systemd services:
  `jenkins ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart myapp`
- **Granular Permissions:** Restricting developers to read-only log access:
  `%devs ALL=(root) NOPASSWD: /usr/bin/tail -f /var/log/*`

**Practice Exercises:**
1. Run a command that requires root permissions: `apt update` (or `yum check-update`). Notice the error.
2. Run it with `sudo`: `sudo apt update` (or `sudo yum check-update`).
3. Check your user's sudo capabilities: `sudo -l`.
4. Open the sudoers configuration safely: `sudo visudo`. Look for the `%sudo` or `%wheel` group rules, then exit without saving (`Ctrl+X`).

---

### Common Questions

| Question | Answer |
|----------|--------|
| What is the difference between `wheel` and `sudo` groups? | They do the same thing, but CentOS/RHEL/Fedora uses `wheel`, while Debian/Ubuntu uses `sudo` for administrative privileges. |
| How do I run a command as another user without switching? | Use `sudo -u username command`. For example: `sudo -u nginx tail /var/log/nginx/error.log`. |
| What should I do if I break `/etc/sudoers`? | If you lose sudo access, you must boot into recovery mode or use a cloud console to mount the drive and fix `/etc/sudoers`. This is why you must use `visudo`. |

**Interview Answer:**
> "I prefer `sudo` over `su` because it follows the principle of least privilege, logs actions for auditing, and uses the user's personal password instead of sharing the root password. For automated processes like Jenkins, I use `visudo` to add targeted `NOPASSWD` rules, restricting permissions to only the specific commands needed for deployment."

---

## Module 6: Identity & Session Audit

### What is it?
Commands used to check user identities, verify active sessions, or audit login history on a server.

---

### Identity Commands

#### `id` — Print User and Group IDs
Shows the UID, primary group GID, and all secondary groups the user belongs to.

```bash
# Print your own identity
id

# Print specific user's identity
id jenkins
```

#### `whoami` — Check Current Username
Prints the name of the user associated with the current shell.

```bash
whoami
# Output: ubuntu
```

---

### Active Sessions & Audit Commands

#### `who` — List Logged-in Users
Displays who is currently logged in, what terminal they are using, and their login time.

```bash
who
# Output: ubuntu   pts/0        2026-07-16 10:15 (203.0.113.1)
```

#### `w` — Show Who is Logged in and What They Are Doing
A more detailed version of `who`. Shows system load, uptime, and the current command running in each session.

```bash
w
# Output: 
# 10:20:01 up 2 days,  1:10,  1 user,  load average: 0.05, 0.02, 0.00
# USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
# ubuntu   pts/0    203.0.113.1      10:15    1.00s  0.11s  0.02s w
```

#### `last` — Show Last Logged-in Users
Reads `/var/log/wtmp` to show history of successful user logins and system reboots.

```bash
# Show last 10 logins
last -n 10

# Show logins for a specific user
last ubuntu

# Find when the system last rebooted
last reboot
```

---

### DevOps Use Cases
- **Post-Incident Forensic Audit:** If a production server setting was changed, checking the history of sessions using `last` and checking active sessions with `w` to see who was active.
- **Script User Verification:** Adding checks inside scripts to prevent running as root:
  `if [ "$(whoami)" = "root" ]; then echo "Do not run as root!"; exit 1; fi`

**Practice Exercises:**
1. Run `id` and inspect your UID and GID. Note down if you are in any admin groups (like `sudo`, `wheel`, or `docker`).
2. Run `who` to see if anyone else is connected to your environment.
3. Run `w` and analyze the CPU usage columns and the `WHAT` column.
4. Run `last -n 5` to view recent login activity.

---

### Common Questions

| Question | Answer |
|----------|--------|
| What is the difference between `whoami` and `id -un`? | They return the same string (current username), but `whoami` is a standalone command while `id -un` uses the `id` binary flags. |
| Where does the `last` command get its history? | It parses the `/var/log/wtmp` binary file. You cannot edit `/var/log/wtmp` easily, making it a reliable audit trail. |
| What does `pts/0` mean under the TTY column? | `pts` stands for pseudo-terminal slave, which indicates a remote terminal session (like SSH). A value of `tty1` indicates a physical, local console session. |

**Interview Answer:**
> "To verify a user's permissions, I run the `id` command. During system troubleshooting or post-incident reviews, I use `w` to check active connections and resource consumption in real-time, and `last` to check the history of user logins to correlate events with specific SSH sessions."

---

## Quick Reference Table

| Command | Action | Key Flags / Examples |
|---------|--------|----------------------|
| **`id`** | Print user UIDs, GIDs, and groups | `id jenkins` |
| **`whoami`** | Print current effective username | `whoami` |
| **`useradd`** | Create a new user (low-level) | `sudo useradd -m -s /bin/bash deploy` |
| **`adduser`** | Create a new user (interactive) | `sudo adduser developer` |
| **`userdel`** | Delete a user | `sudo userdel -r username` (removes home) |
| **`usermod`** | Modify a user account | `sudo usermod -aG docker jenkins` (append secondary) |
| **`passwd`** | Change password or lock account | `sudo passwd -l username` (lock password login) |
| **`chage`** | Manage password aging policies | `sudo chage -l username` (list policies) |
| **`groupadd`** | Create a new group | `sudo groupadd devops` |
| **`groupdel`** | Delete a group | `sudo groupdel devops` |
| **`gpasswd`** | Add/remove users in groups | `sudo gpasswd -a user group` (add), `-d` (remove) |
| **`chgrp`** | Change group ownership of files | `sudo chgrp -R devops /opt/shared` |
| **`su`** | Switch user | `su - username` (login shell) |
| **`sudo`** | Run command with root privileges | `sudo -u postgres psql` (run as postgres user) |
| **`visudo`** | Edit `/etc/sudoers` safely | `sudo visudo` |
| **`who`** | Show currently logged-in users | `who` |
| **`w`** | Show logged-in users and activities | `w` |
| **`last`** | List recent logins and reboots | `last -n 10` |

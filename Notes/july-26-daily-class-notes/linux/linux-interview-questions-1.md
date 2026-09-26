# linux interview questions 1

## Basic

<details>

<summary>What is Linux?</summary>

Linus Torvalds developed Linux, a Unix-like, free, open-source kernel-based operating system. It is designed for systems, servers, embedded devices, mobile devices, and mainframes and is supported on major platforms such as ARM, x86, and SPARC.

</details>

<details>

<summary>Explain the basic features of the Linux OS</summary>

Some basic features of Linux are:

* Linux is free and easily available.
* It is more secure than other operating systems because it uses security auditing and password authentication features.
* Linux has its personal software repositories.
* It includes support for multiple languages and different language keyboards.
* It offers both CLI and GUI to run commands and applications (e.g., Firefox, VLC).

</details>

<details>

<summary>Name some Linux distros</summary>

Commonly used distributions:

* Ubuntu
* Debian
* CentOS
* Fedora
* RedHat

</details>

<details>

<summary>Major differences between Linux and Windows</summary>

| Comparison Factor |                  Linux |                        Windows |
| ----------------- | ---------------------: | -----------------------------: |
| Free/Paid         |  Free and open-source. |  Not open-source (commercial). |
| Security          |         Highly secure. | Less secure compared to Linux. |
| Path separator    | Uses forward slash (/) |           Uses backslash (`\`) |
| Efficiency        |         More efficient |                 Less efficient |
| Kernel type       |      Monolithic kernel |                    Microkernel |
| File system       |         Case-sensitive |               Case-insensitive |

</details>

<details>

<summary>Define the basic components of Linux</summary>

Major components:

* Kernel: Core part bridging hardware and software.
* Shell: Interface between kernel and user.
* GUI: Graphical user interface.
* Application programs: Software that performs tasks.
* System utilities: Tools to manage the system.

</details>

<details>

<summary>File permissions in Linux</summary>

Three basic file permissions:

* Read: Open and read files.
* Write: Modify files.
* Execute: Run the file.

</details>

<details>

<summary>What is the Linux Kernel? Is it legal to edit it?</summary>

The kernel is low-level system software that manages resources and provides system interfaces. Linux is released under the GPL (General Public License), so it is legal to edit the kernel in accordance with the license.

</details>

<details>

<summary>Explain LILO</summary>

LILO (Linux Loader) is a boot loader that loads the Linux OS into memory and starts execution. It is one of several boot loaders available for Linux.

</details>

<details>

<summary>What is Shell in Linux?</summary>

Common shells:

* csh (C Shell) — C-like syntax, job control.
* ksh (Korn Shell) — advanced scripting features.
* zsh (Z Shell) — advanced features like globbing, startup files.
* bash (Bourne Again Shell) — default shell on many systems.
* fish (Friendly Interactive Shell) — autosuggestions, web-based config.

</details>

<details>

<summary>What is a root account?</summary>

The root account is the system administrator account with complete system control. Ordinary users do not have root privileges.

</details>

<details>

<summary>Describe CLI and GUI in Linux</summary>

* CLI (Command Line Interface): Accepts commands as text input.
* GUI (Graphical User Interface): Uses icons, menus, and windows manipulated with a mouse.

</details>

<details>

<summary>What is Swap Space?</summary>

Swap space is disk space used to extend RAM. The system moves inactive pages from RAM to swap to free physical memory.

</details>

<details>

<summary>Difference between hard links and soft links</summary>

| Hard Links                                                | Soft Links                                                                 |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| Include the original content (direct reference to inode). | Include the original file location (path reference).                       |
| Faster.                                                   | Slower.                                                                    |
| Share the same inode number.                              | Have different inode numbers.                                              |
| No relative path concept (they reference the same inode). | Use relative or absolute paths.                                            |
| Cannot link directories (typically).                      | Can link directories.                                                      |
| Changes reflect across hard links.                        | Changes reflect between soft link and target; breaking target breaks link. |
| Use less disk metadata.                                   | Use more metadata.                                                         |

</details>

<details>

<summary>How do users create a symbolic link in Linux?</summary>

Use the ln command with `-s` for symbolic links:

```bash
ln -s <target> <link_name>
```

</details>

<details>

<summary>What are the standard streams?</summary>

Standard streams are:

* stdin (standard input)
* stdout (standard output)
* stderr (standard error)

They channel I/O between programs and their environment.

</details>

## Intermediate-Level Linux Interview Questions

<details>

<summary>How do you mount and unmount filesystems in Linux?</summary>

Use `mount` and `umount`.

Mounting steps:

* Identify partition: `fdisk -l` or `lsblk`
* Create mount point: `mkdir /mnt/mountpnt`
* Mount: `sudo mount <partition> <mount_point_directory>`

Unmount:

```bash
sudo umount <mount_point_directory>
```

</details>

<details>

<summary>How do you troubleshoot network connectivity issues in Linux?</summary>

Steps include:

* Check physical connectivity (cables, interface up).
* Verify network configuration: `ip addr` or `ifconfig`, `ip route`, check `/etc/resolv.conf`.
* Check firewall rules (`ufw`, `iptables`).
* Restart network interfaces (`ifdown`/`ifup`) and reboot if needed.
* Use tools like `ping`, `traceroute`, `nslookup`/`dig` to further diagnose.

</details>

<details>

<summary>How do you list all the processes running in Linux?</summary>

* `ps` (e.g., `ps -ef`, `ps auxf`) for snapshots.
* `top` and `htop` for real-time interactive views (`htop` has color, sorting, filtering).

</details>

<details>

<summary>What is the chmod command and how do you use it?</summary>

`chmod` changes file permissions.

Example (add write and execute for user):

```bash
chmod u+wx ABC.sh
```

Supports symbolic modes and numeric modes.

</details>

<details>

<summary>How do you check disk space usage?</summary>

* `df` (e.g., `df -h`) to show filesystem disk space.
* `du` (e.g., `du -sh ~/directory`) to estimate directory usage.
* `ncdu` for interactive disk usage browsing.

</details>

<details>

<summary>How do you find the PID of a running process?</summary>

* `pgrep <process_name>`
* `ps -e | grep -i <process_name>`

</details>

<details>

<summary>What is rsync and how do you use it?</summary>

`rsync` synchronizes files between directories or systems.

Basic syntax:

```bash
rsync <options> <source> <destination>
```

Example:

```bash
rsync -av ~/Documents ~/Downloads
rsync -avz --delete ~/Documents/ ~/Downloads/
```

Options:

* `-a` preserve attributes
* `-v` verbose
* `-z` compress
* `--delete` remove destination files not in source

</details>

<details>

<summary>How do you create a user account?</summary>

Use `useradd` or `adduser`.

Example with `useradd` (set password separately):

```bash
sudo useradd -m ron
sudo passwd ron
```

Example with `adduser` (interactive):

```bash
sudo adduser shawn
```

</details>

<details>

<summary>How do you format a disk in Linux?</summary>

* List partitions: `lsblk`
* Unmount if mounted: `umount <partition>`
* Identify desired filesystem type (ext4, xfs, ntfs) and run one of:

```bash
mkfs.ext4 <partition>
mkfs.xfs <partition>
mkfs.ntfs <partition>
```

Then mount the partition again. Always backup data before formatting.

</details>

<details>

<summary>How do you change the password for a user account?</summary>

```bash
passwd <username>
# e.g.
passwd Ron
```

You'll be prompted to enter and confirm the new password.

</details>

<details>

<summary>Difference between a process and a thread</summary>

| Factor           | Process                       | Thread                   |
| ---------------- | ----------------------------- | ------------------------ |
| Creation time    | Higher                        | Lower                    |
| Dependency       | Independent (separate memory) | Dependent (share memory) |
| Resource usage   | Higher                        | Lower                    |
| Termination time | Higher                        | Lower                    |

</details>

<details>

<summary>What is the ulimit command and how do you use it?</summary>

`ulimit` controls resource limits for user processes.

Example: set max number of processes to 50

```bash
ulimit -u 50
```

</details>

<details>

<summary>What is the find command and how do you use it?</summary>

Searches for files based on criteria.

Example:

```bash
find ~/Downloads -name Linux.txt
```

</details>

<details>

<summary>What is RAID in Linux?</summary>

RAID (Redundant Array of Independent Disks) combines physical disks into logical units for performance and redundancy.

Common levels:

* RAID 0 — striping (no redundancy)
* RAID 1 — mirroring (full copy)
* RAID 5 — distributed parity
* RAID 6 — dual parity (higher redundancy)
* RAID 10 — combination of RAID 1 and RAID 0

</details>

<details>

<summary>What are the challenges of using Linux?</summary>

Common challenges:

* Hardware compatibility issues for some devices.
* Steeper learning curve for configuration and commands.
* Limited game compatibility compared to Windows.
* Occasional driver/firmware issues.

</details>

## Advanced-Level Linux Interview Questions

<details>

<summary>What is the /proc filesystem?</summary>

`/proc` is a virtual filesystem exposing kernel and process information. It can be used to inspect system state and tune kernel parameters at runtime.

</details>

<details>

<summary>How do you secure a Linux server?</summary>

Common practices:

* Use strong passwords.
* Keep system updated and patched.
* Use SSH with key-based authentication.
* Deploy intrusion detection systems (IDS).
* Configure firewalls and restrict services.
* Disable unused services.
* Regular backups and log audits.
* Encrypt network traffic and enable monitoring.

</details>

<details>

<summary>What is strace?</summary>

`strace` traces system calls made by a process. Example:

```bash
strace ls
```

It helps debug how a program interacts with the kernel.

</details>

<details>

<summary>How do you optimize Linux system performance?</summary>

Strategies:

* Keep system updated.
* Optimize disk usage and enable caching.
* Manage memory and CPU usage.
* Disable unnecessary services; use lightweight alternatives.
* Monitor resources regularly.
* Tune kernel parameters where appropriate.
* Use monitoring tools (e.g., Performance Co-Pilot).

</details>

<details>

<summary>How to administer Linux servers?</summary>

Key tasks:

* Manage users and permissions.
* Configure system/network for performance and security.
* Implement backups and recovery plans.
* Set up monitoring for resource usage and system health.
* Configure firewall and intrusion detection.
* Document configurations and test recovery procedures.

</details>

<details>

<summary>What is the Linux virtual memory system?</summary>

Virtual memory allows the system to use disk space as an extension of RAM, swapping pages between RAM and disk to handle workloads that exceed physical memory.

</details>

<details>

<summary>What is process scheduling in Linux?</summary>

Process scheduling determines the order and CPU time allocation for processes. Linux uses priority-based, preemptive scheduling with scheduling policies that can change process ordering based on behavior and resources.

</details>

<details>

<summary>Most important Linux commands</summary>

Commonly used commands:

* ls, mkdir, pwd
* top, htop
* grep, cat
* tar, wget
* free, df
* man

</details>

<details>

<summary>What is iptables and how is it used for filtering?</summary>

`iptables` manages Netfilter firewall rules for packet filtering and NAT.

* Show rules: `iptables -L`
* Add rule example:

```bash
iptables -A <chain> <options> -j <target>
```

* Make rules persistent:

```bash
iptables-save > /etc/iptables/rules.v4
```

</details>

<details>

<summary>How do you troubleshoot a Linux OS that fails to boot?</summary>

Steps:

* Check boot messages and logs.
* Inspect GRUB boot options; try older kernel.
* Check hardware (cables, RAM).
* Identify recent changes that might have caused the issue.
* Boot into recovery or live environment to repair.

</details>

<details>

<summary>What is the init process?</summary>

`init` (PID 1) is the first process started at boot, responsible for initializing the system. Modern systems commonly use `systemd` instead of SysV init.

</details>

<details>

<summary>What is SMTP?</summary>

SMTP (Simple Mail Transfer Protocol) is used to transmit email between servers. Models:

* End-to-end (connects different organizations)
* Store-and-forward (used within organizations)

</details>

<details>

<summary>What is LVM?</summary>

LVM (Logical Volume Manager) provides flexible disk management: create, resize, snapshot, and mirror logical volumes for dynamic storage allocation.

</details>

<details>

<summary>Difference between UDP and TCP</summary>

* UDP: connectionless, low overhead, no reliability (used for real-time apps like streaming, DNS).
* TCP: connection-oriented, reliable (retransmission, ordering) used for file transfers, web, email.

</details>

<details>

<summary>What is /etc/resolv.conf?</summary>

Config file for DNS resolver settings (nameserver entries, search domains, resolver options).

</details>

<details>

<summary>Absolute vs relative paths</summary>

* Absolute path: starts at root `/`, e.g., `/home/user/geeksforgeeks.txt`
* Relative path: relative to current working directory, e.g., `documents/file.txt`

</details>

<details>

<summary>What is grep used for?</summary>

`grep` searches for patterns in files or streams.

Example:

```bash
grep "test" file.txt
```

</details>

<details>

<summary>How to check status of a service/daemon?</summary>

With systemd:

```bash
systemctl status apache2
```

</details>

<details>

<summary>Difference between /etc/passwd and /etc/shadow</summary>

* `/etc/passwd`: user account info (usernames, UIDs, home dirs, shells) — world-readable.
* `/etc/shadow`: encrypted passwords and security info — readable only by root.

</details>

<details>

<summary>How to compress and decompress files?</summary>

Create gzipped tarball:

```bash
tar -czvf jayesh.tar.gz files
```

Extract:

```bash
tar -xzvf jayesh.tar.gz
```

</details>

<details>

<summary>Difference between a process and a daemon</summary>

* Process: executing program instance (foreground or background).
* Daemon: background service typically started at boot; runs without interactive user session.

</details>

<details>

<summary>How to schedule recurring tasks?</summary>

Use `crontab -e` and add an entry.

Example — run script daily at 03:30:

```bash
30 3 * * * /path/to/geeks.sh
```

</details>

<details>

<summary>What is sed used for?</summary>

`sed` performs stream editing, e.g., find-and-replace:

```bash
sed 's/foo/bar/g' file.txt
```

</details>

<details>

<summary>What are runlevels?</summary>

Runlevels define system states (single-user, multi-user, with/without GUI). Commonly: runlevel 3 (multi-user without GUI), runlevel 5 (with GUI). Modern systems use `systemd` targets.

</details>

## Bonus Linux Interview Questions

<details>

<summary>What is sudo?</summary>

`sudo` (superuser do) runs commands with elevated privileges. It typically requires the user's password for authorization.

</details>

<details>

<summary>What is umask?</summary>

`umask` sets default permission restrictions for newly created files and directories.

</details>

<details>

<summary>How to find and kill a process?</summary>

Find PID:

```bash
ps aux | grep <process>
```

Kill by PID:

```bash
kill <PID>
```

Kill by name:

```bash
pkill <process>
```

`pkill` sends SIGTERM by default.

</details>

<details>

<summary>What is network bonding?</summary>

Bonding combines multiple network interfaces into a single logical interface for redundancy and increased throughput.

</details>

<details>

<summary>What is SELinux?</summary>

Security-Enhanced Linux (SELinux) is a mandatory access control framework that provides an additional layer of access control and security policies.

</details>

<details>

<summary>Purpose of SSH and how to connect securely</summary>

SSH (Secure Shell) provides encrypted remote access. Example:

```bash
ssh username@remote_ip
```

Use key-based authentication for stronger security.

</details>

<details>

<summary>How to check file contents without opening an editor?</summary>

Use `cat`, `less`, or `more`.

Example:

```bash
cat geeks.txt
```

</details>

<details>

<summary>Purpose of the crontab file</summary>

Crontab schedules recurring tasks (cron jobs). Edit with `crontab -e` and add timing and command lines.

Example — run `jayesh.sh` daily at 05:00:

```bash
0 5 * * * /path/to/jayesh.sh
```

</details>

<details>

<summary>Find and replace text with sed</summary>

Example — replace "true" with "False" in a file:

```bash
sed 's/true/False/g' file_name
```

</details>

<details>

<summary>Purpose of the sudoers file and configuring sudo</summary>

The `sudoers` file controls which users can run commands as root. Edit safely with:

```bash
sudo visudo
```

To grant full sudo access to a user:

```bash
user_name ALL=(ALL) ALL
```

</details>

<details>

<summary>Change ownership with chown</summary>

```bash
chown new_owner:new_group filename
# e.g.
chown jayesh:users file_name
```

</details>

<details>

<summary>Purpose of ping and testing connectivity</summary>

`ping` sends ICMP echo requests to test reachability:

```bash
ping <remote_host_ip>
```

</details>

<details>

<summary>Recursively copy files and directories with cp</summary>

```bash
cp -R source_directory destination_directory
```

</details>

<details>

<summary>Purpose of netstat and viewing connections</summary>

`netstat` shows active connections and listening ports.

Example — list listening TCP/UDP ports:

```bash
netstat -tuln
```

</details>

<details>

<summary>Set up a static IP via CLI</summary>

Location of config varies by distro (e.g., `/etc/network/interfaces`).

Example stanza (for Debian-style `/etc/network/interfaces`):

```
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4
```

Save and restart networking service or reboot.

</details>

<details>

<summary>Copy a file to multiple directories</summary>

Methods include using `xargs`, `find`, `tee`, or a shell loop. Example using a loop:

```bash
for d in dir1 dir2 dir3; do
  cp file.txt "$d"/
done
```

</details>

## Linux Admin Interview Questions

<details>

<summary>How are files organized in Linux?</summary>

Hierarchical filesystem rooted at `/`. Files and directories are organized under `/`.

</details>

<details>

<summary>How can you find the IP address of a Linux system?</summary>

Use `ifconfig` or `ip addr show`.

</details>

<details>

<summary>Distinction between hard link and symbolic link</summary>

* Hard link: direct reference to file inode.
* Symbolic link: path reference. Deleting the target breaks a symlink.

</details>

<details>

<summary>How to check disk space usage?</summary>

Use `df` (e.g., `df -h`) to show total/used/available space.

</details>

<details>

<summary>How to start and stop a service?</summary>

With systemd:

```bash
systemctl start <service>
systemctl stop <service>
```

</details>

<details>

<summary>Common causes of file permission issues</summary>

* Incorrect ownership
* Improper permission bits
* Conflicting user/group permissions

</details>

<details>

<summary>Troubleshoot system can't connect to a remote server</summary>

Check connectivity (`ping`), firewall rules, DNS, and relevant logs.

</details>

## Linux Troubleshooting Interview Questions

<details>

<summary>Steps to fix a network connectivity issue</summary>

* Verify physical connections.
* Verify IP configuration and routes.
* Check firewall and DNS.
* Use `ping`, `traceroute`, `tcpdump` for deeper inspection.

</details>

<details>

<summary>How to check system logs</summary>

View logs in `/var/log` with `tail`, `less`, or `journalctl` (systemd):

```bash
tail -f /var/log/syslog
# or
journalctl -xe
```

</details>

<details>

<summary>Possible reasons for running out of memory</summary>

* Memory leaks in applications
* Excessive memory usage by processes
* Insufficient physical memory
* Large dataset processing

</details>

<details>

<summary>Troubleshoot a slow-performing server</summary>

* Inspect `top`/`htop` for CPU/memory usage
* Monitor disk I/O
* Analyze network traffic
* Check application logs for bottlenecks

</details>

<details>

<summary>Common causes of running out of disk space</summary>

* Large or growing log files
* Accumulation of temporary files
* Uncleaned old backups
* Runaway processes generating output

</details>

<details>

<summary>Identify and terminate high-CPU process</summary>

Use `top`/`htop` to find high CPU processes, then `kill <PID>` to terminate.

</details>

<details>

<summary>Troubleshoot a system that cannot boot</summary>

* Check hardware and BIOS/UEFI settings
* Boot into recovery or live environment
* Inspect boot logs and filesystem integrity

</details>

## Linux Networking Interview Questions

<details>

<summary>What does ifconfig do?</summary>

Configures or displays network interfaces (addresses, netmasks). (`ip` is modern replacement.)

</details>

<details>

<summary>How do you set up a fixed IP address?</summary>

Edit network configuration files depending on distribution (e.g., `/etc/network/interfaces` or `/etc/sysconfig/network-scripts/ifcfg-<interface>`), set static address, netmask, gateway, DNS, then restart networking.

</details>

<details>

<summary>How to configure a DNS server?</summary>

Configure BIND or similar — edit `named.conf` and zone files, set forwarders/root hints as required.

</details>

<details>

<summary>What is a firewall and how do you set it up?</summary>

Firewall filters and controls network traffic. Use `iptables`, `nftables`, or higher-level tools (`ufw`, `firewalld`) to define rules and zones.

</details>

<details>

<summary>How to check network connectivity between two systems?</summary>

Use `ping` and `traceroute` to test reachability and path.

</details>

<details>

<summary>Purpose of the route command</summary>

View or modify the IP routing table.

</details>

<details>

<summary>How to configure a Linux system as a router?</summary>

Enable IP forwarding:

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
# or set in /etc/sysctl.conf: net.ipv4.ip_forward=1
```

Then configure interfaces and routing tables appropriately.

</details>

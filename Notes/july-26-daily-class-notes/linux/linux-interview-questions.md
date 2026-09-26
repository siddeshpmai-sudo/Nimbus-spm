# linux interview questions

{% stepper %}
{% step %}
### When you login you get “$” prompt, what is the prompt for root?

Answer: `#`
{% endstep %}

{% step %}
### Explain the difference between grep and egrep?

Answer: Search online
{% endstep %}

{% step %}
### What is the port # for DNS, NTP and NFS?

Answer: `53`, `123`, and `111/2049`
{% endstep %}

{% step %}
### What is the configuration file name of DNS and where is it located?

Answer: `/etc/named.conf`
{% endstep %}

{% step %}
### How many new directories will be created after running the following command: mkdir {a..c}{1..3}

Answer: `9`
{% endstep %}

{% step %}
### Your PC is configured with a DNS server address but not the default gateway. Can the PC access internet?

Answer: No
{% endstep %}

{% step %}
### What is the difference between IP and Gateway?

Answer: Search online
{% endstep %}

{% step %}
### Can you assign one static IP to 2 computers, if not then why?

Answer: No, because it will create an IP conflict
{% endstep %}

{% step %}
### How to change IPs address to static?

Answer: `ifconfig x.x.x.x`
{% endstep %}

{% step %}
### You are trying to ping a server by hostname and you get an error message, “ping: unknown host …”. What could be the reason and how to solve the problem so you can ping it by hostname?

Answer: Check `/etc/hosts` or DNS to see if it has hostname-to-IP entry
{% endstep %}

{% step %}
### Explain the difference between relative and absolute path?

Answer: Absolute path starts from `/` while relative path is from your current directory
{% endstep %}

{% step %}
### List 3 different methods of adding user?

Answer: Search online
{% endstep %}

{% step %}
### What is the command to change file/directory ownership and group?

Answer: `chown` and `chgrp`
{% endstep %}

{% step %}
### List any 3 type of filesystem?

Answer: `ext4`, `NTFS`, and `FAT`
{% endstep %}

{% step %}
### When you login you get a message on the screen. What is the name of that file and where is it located?

Answer: `/etc/motd`
{% endstep %}

{% step %}
### What is /bin directory used for?

Answer: Search online
{% endstep %}

{% step %}
### What are the different types of DNS Server?

Answer: Master and secondary
{% endstep %}

{% step %}
### How to change a user password?

Answer: `passwd username`
{% endstep %}

{% step %}
### What is the version of Redhat Linux you have experience with?

Answer: `7.4`
{% endstep %}

{% step %}
### List any 4 linux distributions?

Answer: Redhat, CentOS, Ubuntu and SUSE
{% endstep %}

{% step %}
### How to logoff from the system?

Answer: `exit`
{% endstep %}

{% step %}
### Give any 3 examples of operating systems?

Answer: Windows, Linux and macOS
{% endstep %}

{% step %}
### How to create a directory?

Answer: `mkdir`
{% endstep %}

{% step %}
### Where are the zone files located for DNS service?

Answer: `/var/named/zonefiles`
{% endstep %}

{% step %}
### How to check kernel version?

Answer: `uname -a`
{% endstep %}

{% step %}
### Which directory has all the configuration files?

Answer: `/etc`
{% endstep %}

{% step %}
### How to become root user from a regular user?

Answer: `su -`
{% endstep %}

{% step %}
### How many mega bytes in 1 giga bytes?

Answer: Search online
{% endstep %}

{% step %}
### What is the purpose of having different network ports?

Answer: So the communication of each application goes through a dedicated port
{% endstep %}

{% step %}
### How to display first column of a file?

Answer: `cat filename | awk '{print $1}'`
{% endstep %}

{% step %}
### What is the name of DNS rpm package?

Answer: `bind`
{% endstep %}

{% step %}
### What is the difference between nslookup and dig commands?

Answer: Search online
{% endstep %}

{% step %}
### How to check your user id and group id?

Answer: `id`
{% endstep %}

{% step %}
### How to check a file’s permission?

Answer: `ls -l`
{% endstep %}

{% step %}
### What is the difference between “kill” and “kill -9” command?

Answer: Search online
{% endstep %}

{% step %}
### What is subnet?

Answer: Search online
{% endstep %}

{% step %}
### You are troubleshooting an issue with Redhat support and they have asked you to send the contents of /etc directory. How and which method you will use to transfer the contents?

Answer: Tar (compress) the entire `/etc` directory and FTP
{% endstep %}

{% step %}
### What is root home directory?

Answer: `/root`
{% endstep %}

{% step %}
### What is rsyslogd daemon and its purpose?

Answer: Search online
{% endstep %}

{% step %}
### Your company has terminated a server administrator. What is first thing as an administrator you should do to enhance the security?

Answer: Change root password
{% endstep %}

{% step %}
### How to check the computer name or host name in Linux?

Answer: `hostname`
{% endstep %}

{% step %}
### Which permission allows a user to run an executable with the permissions of the owner of that file?

Answer: Setuid/setgid (owner execute bit with special permission). Note in original: "First 3 bits should have x"
{% endstep %}

{% step %}
### What is the command to untar a tarred file?

Answer: `untar` (commonly `tar -xvf filename.tar`)
{% endstep %}

{% step %}
### What is /proc directory used for?

Answer: Search online
{% endstep %}

{% step %}
### What is the purpose of nsswitch.conf file?

Answer: It tells the system where to go to resolve hostnames
{% endstep %}

{% step %}
### List 3 basic commands to navigate the filesystem?

Answer: `cd`, `pwd`, and `ls`
{% endstep %}

{% step %}
### Which service/daemon should be running on the server that allows you to connect remotely?

Answer: `sshd`
{% endstep %}

{% step %}
### What is the purpose of firewall?

Answer: Search online
{% endstep %}

{% step %}
### List any 3 IT components?

Answer: Hardware, OS and Applications
{% endstep %}

{% step %}
### Which directory has all the commands we use, e.g. ls, cd etc.?

Answer: `/usr/bin` or `/bin`
{% endstep %}

{% step %}
### What is the difference between memory, virtual memory and cache?

Answer: Search online
{% endstep %}

{% step %}
### Which of the following is correct?

a. Hardware -> Operating System -> Users\
b. Operating System -> Users -> Hardware\
c. Database -> Hardware -> Users

Answer: (No explicit answer provided)
{% endstep %}

{% step %}
### Which of the following is a communication command?

Options: grep, mail, touch, cd

Answer: mail
{% endstep %}

{% step %}
### How to rename a file or directory?

Answer: `mv`
{% endstep %}

{% step %}
### How to change a hostname in Linux?

Answer: Search online
{% endstep %}

{% step %}
### How to check network interfaces in Linux?

Answer: `ifconfig`
{% endstep %}

{% step %}
### Why is “tail –f logfilename” command used most often and what does it do?

Answer: It outputs incoming logs in real time
{% endstep %}

{% step %}
### What type of hardware have you worked on?

Answer: Get familiar with Dell, HP and UCS hardware (suggested to check vendor websites)
{% endstep %}

{% step %}
### How to sort a file in reverse order?

Answer: `cat filename | sort -r`
{% endstep %}

{% step %}
### What is the name of operating system that runs Unix?

Answer: Solaris, HP-UX etc.
{% endstep %}

{% step %}
### List all byte sizes from smallest to largest?

Answer: Search online
{% endstep %}

{% step %}
### How to check the total number of partition in Linux?

Answer: `fdisk -l`
{% endstep %}

{% step %}
### How to access a linux system from a linux system?

Answer: `ssh`
{% endstep %}

{% step %}
### Explain the procedure of bonding 2 NICs or interfaces together?

Answer: Search online
{% endstep %}

{% step %}
### What is the exact command syntax to list the 5th column of a file and cut the first 3 letters?

Answer: `cat filename | awk '{print $5}' | cut -c1-3`
{% endstep %}

{% step %}
### What is /etc/hosts file used for?

Answer: To resolve hostnames with IP address
{% endstep %}

{% step %}
### List any 3 options of ‘df’ command and what they are used for?

Answer: Search online
{% endstep %}

{% step %}
### What is the command to change file/directory permissions?

Answer: `chmod`
{% endstep %}

{% step %}
### What is the purpose of pipe (|)?

Answer: To combine multiple commands
{% endstep %}

{% step %}
### What is /etc directory used for?

Answer: For configuration files
{% endstep %}

{% step %}
### Which command is used to list files in a directory?

Answer: `ls -l`
{% endstep %}

{% step %}
### There is a command which gives you information about other commands, please explain that command and what is it used for?

Answer: `man`
{% endstep %}

{% step %}
### How to delete a file and a directory?

Answer: `rm filename` and `rmdir dirname`
{% endstep %}

{% step %}
### What is the difference between “tail” and “tail -10”?

Answer: None (by default `tail` shows last 10 lines; `tail -10` explicitly requests 10 lines)
{% endstep %}

{% step %}
### List 4 commands to display or read a file contents?

Answer: `cat`, `more`, `less`, `vi`
{% endstep %}

{% step %}
### Which command is used to read the top 5 lines of a file?

Answer: `head -5 filename`
{% endstep %}

{% step %}
### What are the different commands or methods to write to a file?

Answer: `echo > filename` and `vi filename`
{% endstep %}

{% step %}
### What is swap space and how to check swap space?

Answer: Search online
{% endstep %}

{% step %}
### What is inode and how to find an inode of a file?

Answer: Search online
{% endstep %}

{% step %}
### Which file to edit for kernel tuning?

Answer: Search online
{% endstep %}

{% step %}
### What is the latest version of Redhat?

Answer: Search online
{% endstep %}

{% step %}
### Name the command to find specific word from a file?

Answer: `grep word filename`
{% endstep %}

{% step %}
### You have scheduled a job using crontab but it does not run at the time you specified, what could be the reason and how would you troubleshoot?

Answer:

* Check your system time
* Check your crontab entry
* Check `/var/log/messages`
{% endstep %}

{% step %}
### How to check system hardware information?

Answer: `dmidecode`
{% endstep %}

{% step %}
### How to check network interface MAC address?

Answer: `ifconfig`
{% endstep %}

{% step %}
### If I don’t want others to read my file1, how to do that?

Answer: Remove `r` from the last 3 bits of file permission (remove read permission for group/others)
{% endstep %}

{% step %}
### What is the purpose of “uniq” and “sed” command?

Answer: Search online
{% endstep %}

{% step %}
### Which command is used to list the contents of a directory in the most recent time and in reverse order, meaning the most updated file should be listed on the bottom?

Answer: `ls -ltr`
{% endstep %}

{% step %}
### What is the difference between tar, gzip and gunzip?

Answer: Search online
{% endstep %}

{% step %}
### What are the different ways to install an OS?

Answer: DVD, DVD ISO and network boot
{% endstep %}

{% step %}
### How to view difference between two files?

Answer: `diff file1 file2`
{% endstep %}

{% step %}
### You noticed that one of the Linux servers has no disk space left, how would you troubleshoot that issue?

Answer:

* If running LVM then add more disk and extend LVM
* If not running LVM then add more disk, create a new partition and link the new partition to an existing filesystem
{% endstep %}

{% step %}
### How to check Redhat version release?

Answer: `uname -a` or `/etc/redhat-release`
{% endstep %}

{% step %}
### What is the difference between TCP and UDP?

Answer: Search online
{% endstep %}

{% step %}
### What is a zombie process?

Answer: Search online
{% endstep %}

{% step %}
### How do you search for a pattern/word in a file and then replace it in an entire file?

Answer: `sed` command
{% endstep %}

{% step %}
### Explain the purpose of “touch” command?

Answer: To create an empty file (or update a file's timestamp)
{% endstep %}

{% step %}
### If a command hangs, how to stop it and get the prompt back?

Answer: Ctrl+C
{% endstep %}

{% step %}
### Which command is used to count words or lines?

Answer: `wc`
{% endstep %}

{% step %}
### How to check the number of users logged in?

Answer: `who`
{% endstep %}

{% step %}
### What is the command to view the calendar of 2011?

Answer: `cal 2011`
{% endstep %}

{% step %}
### Which command is used to view disk space?

Answer: `df -h`
{% endstep %}

{% step %}
### How to create a new group in Linux?

Answer: `groupadd`
{% endstep %}

{% step %}
### What is the command to send a message to everyone who is logged into the system?

Answer: `wall`
{% endstep %}

{% step %}
### Which command is used to check total number of disks?

Answer: `fdisk -l`
{% endstep %}

{% step %}
### What is a mail server record in DNS?

Answer: `MX`
{% endstep %}

{% step %}
### What does the following command line do? ps -ef | awk '{print $1}' | sort | uniq

Answer: Lists the first column (user) of all running processes, sorts them and removes duplicates
{% endstep %}

{% step %}
### You get a call that when a user goes to www.yourwebsite.com it fails and gets an error, how do you troubleshoot?

Answer:

* Check user's internet connectivity
* Check if user's computer has DNS for hostname lookup
* Check if the server hosting the website is up
* Check if the web service on the server is running
* Check DNS availability resolving that website
{% endstep %}

{% step %}
### List 4 different directories in /?

Answer: `/etc`, `/bin`, `/tmp`, `/home`
{% endstep %}

{% step %}
### What is the output of the following command: tail -10 filename | head -1

Answer: It shows the first line from the last 10 lines of a file
{% endstep %}

{% step %}
### What are the different fields in /etc/passwd file?

Answer: Search online
{% endstep %}

{% step %}
### Which command is used to list the processes?

Answer: `ps -ef`
{% endstep %}

{% step %}
### What is the difference between “hostname” and “uname” commands?

Answer: `hostname` gives the system name and `uname` gives OS information
{% endstep %}

{% step %}
### How to check system load?

Answer: `top` and `uptime`
{% endstep %}

{% step %}
### How to schedule jobs?

Answer: `crontab` and `at`
{% endstep %}

{% step %}
### What is the 3rd field when setting up crontab?

Answer: Day of the month
{% endstep %}

{% step %}
### What is the command to create a new user?

Answer: `useradd`
{% endstep %}

{% step %}
### What is the “init #” for system reboot?

Answer: `6`
{% endstep %}

{% step %}
### How to restart a service?

Answer: `systemctl restart servicename`
{% endstep %}

{% step %}
### How to shutdown a system?

Answer: `shutdown` or `init 0`
{% endstep %}

{% step %}
### What is “ftp” command used for?

Answer: To transfer files from one computer to another
{% endstep %}

{% step %}
### Explain cron job syntax? First is minute, second is..?

Answer: Minute, hour, day of the month, month, day of the week and command
{% endstep %}

{% step %}
### How to delete a package in Linux?

Answer: `rpm -e packagename`
{% endstep %}

{% step %}
### What is the file name where user password information is saved?

Answer: `/etc/shadow`
{% endstep %}

{% step %}
### Which command you would use to find the location of chmod command?

Answer: `which chmod`
{% endstep %}

{% step %}
### Which command is used to check if the other computer is online?

Answer: `ping othercomputer`
{% endstep %}

{% step %}
### Please explain about LAN, MAN and WAN?

Answer: Search online
{% endstep %}

{% step %}
### How to list hidden files in a directory?

Answer: `ls -la`
{% endstep %}

{% step %}
### What is the difference between telnet and ssh?

Answer: `ssh` is secure whereas `telnet` is not
{% endstep %}

{% step %}
### How to run a calculator on Linux and exit out of it?

Answer: `bc` and `quit`
{% endstep %}

{% step %}
### List any 4 commands to monitor system?

Answer: `top`, `df -h`, `iostat`, `dmesg`
{% endstep %}

{% step %}
### You are notified that your server is down, list the steps you will take to troubleshoot?

Answer:

* Check the system physically
* Login through system console
* Ping the system
* Reboot or boot if possible
{% endstep %}

{% step %}
### What is difference between static and DHCP IP?

Answer: Search online
{% endstep %}

{% step %}
### How to write in vi editor mode?

Answer: `i = insert`, `a = insert in next space`, `o = insert in new line`
{% endstep %}

{% step %}
### What is the difference between “crontab” and “at” jobs?

Answer: `crontab` is for repetitive jobs while `at` is for one-time jobs
{% endstep %}

{% step %}
### What is vCenter server in VMWare?

Answer: Search online
{% endstep %}

{% step %}
### What is “dmidecode” command used for?

Answer: To get system information
{% endstep %}

{% step %}
### What is the difference between SAN and NAS?

Answer: Search online
{% endstep %}

{% step %}
### What is the location of system logs? E.g. messages

Answer: `/var/log` directory
{% endstep %}

{% step %}
### How to setup an alias and what is it used for?

Answer: `alias aliasname="command"` — used to create shortcuts for long commands
{% endstep %}

{% step %}
### What is the purpose of “netstat” command?

Answer: Search online
{% endstep %}

{% step %}
### What are terminal control keys, list any 3?

Answer: Ctrl+C, Ctrl+D and Ctrl+Z
{% endstep %}

{% step %}
### Which command(s) you would run if you need to find out how many processes are running on your system?

Answer: `ps -ef | wc -l`
{% endstep %}

{% step %}
### What are the different types of shells?

Answer: `sh`, `bash`, `ksh`, `csh`, etc.
{% endstep %}

{% step %}
### How to delete a line when in vi editor mode?

Answer: `dd`
{% endstep %}

{% step %}
### Which is the core of the operating system?

Options: a) Shell b) Kernel c) Commands d) Script

Answer: Kernel
{% endstep %}

{% step %}
### Which among the following interacts directly with system hardware?

Options: a) Shell b) Commands c) Kernel d) Applications

Answer: Kernel
{% endstep %}

{% step %}
### How to save and quit from vi editor?

Answer: Shift+ZZ or `:wq!`
{% endstep %}

{% step %}
### What is the difference between a process and daemon?

Answer: Search online
{% endstep %}

{% step %}
### What is the process or daemon name for NTP?

Answer: `ntpd`
{% endstep %}

{% step %}
### What are a few commands you would run if your system is running slow?

Answer: `top`, `iostat`, `df -h`, `netstat`, etc.
{% endstep %}

{% step %}
### How to install a package in Redhat Linux?

Answer: `yum install packagename`
{% endstep %}

{% step %}
### What is the difference between “ifconfig” and “ipconfig” commands?

Answer: `ifconfig` for Linux and `ipconfig` for Windows
{% endstep %}

{% step %}
### What is the first line written in a shell script?

Answer: Define shell, e.g. `#!/bin/bash`
{% endstep %}

{% step %}
### Where is the network (Ethernet) file located, please provide exact directory location and file name?

Answer: `/etc/sysconfig/network-scripts/ifcfg-nic`
{% endstep %}

{% step %}
### Why do we use “last” command?

Answer: To see who has logged into the system whether active or logged off
{% endstep %}

{% step %}
### What does RHEL Linux stand for?

Answer: Search online
{% endstep %}

{% step %}
### To view your command history, which command is used and how to run a specific command?

Answer: `history` and `!#` (use history number to run a specific command)
{% endstep %}

{% step %}
### What is NTP and briefly explain how does it work and where is the config files and related commands of NTP?

Answer: Search online
{% endstep %}

{% step %}
### How to disable firewall in Linux?

Answer: Search online
{% endstep %}

{% step %}
### How to configure mail server relay for sendmail service?

Answer: Edit `/etc/mail/sendmail.mc` and add `SMART_HOST` entry
{% endstep %}

{% step %}
### Where is samba log file located?

Answer: `/var/log/samba`
{% endstep %}

{% step %}
### What is mkfs command used for?

Answer: To create a new filesystem
{% endstep %}

{% step %}
### If you create a new group, which file does it get created in?

Answer: `/etc/group`
{% endstep %}

{% step %}
### Which file has DNS server information (e.g. DNS resolution)?

Answer: `/etc/resolv.conf`
{% endstep %}

{% step %}
### What are the commands you would run if you need to find out the version and build date of a package (e.g. http)?

Answer: `rpm -qi http`
{% endstep %}

{% step %}
### On the file permissions? What are the first 3 bits for and who is it for?

Answer: Read, write and execute for the owner of the file
{% endstep %}

{% step %}
### How to create a soft link?

Answer: `ln -s`
{% endstep %}

{% step %}
### How to write a script to delete messages in a log file older than 30 days automatically?

Answer: Search online
{% endstep %}

{% step %}
### How to quit out of “man” command?

Answer: `q`
{% endstep %}

{% step %}
### Which command is used to partition disk in Linux?

Answer: `fdisk`
{% endstep %}

{% step %}
### What is the difference between “shutdown” and “halt” command?

Answer: Search online
{% endstep %}

{% step %}
### What is the exact syntax of mounting NFS share on a client and also how to un-mount?

Answer: Search online
{% endstep %}

{% step %}
### What experience do you have with scripting, explain?

Answer: if-then, do-while, case, for loop scripts
{% endstep %}

{% step %}
### How to get information on all the packages installed on the system?

Answer: `rpm -qa`
{% endstep %}

{% step %}
### Explain VMWare?

Answer: Search online
{% endstep %}

{% step %}
### You are tasked to examine a log file in order to find out why a particular application keep crashing. Log file is very lengthy, which command can you use to simplify the log search using a search string?

Answer: Use `grep` for error, warning, failure etc. in `/var/log/messages` file
{% endstep %}

{% step %}
### What is /etc/fstab file and explain each column of this file?

Answer: Search online
{% endstep %}

{% step %}
### What the latest version of Windows server?

Answer: Search online
{% endstep %}

{% step %}
### What is the exact command to list only the first 2 lines of history output?

Answer: `history | head -2`
{% endstep %}

{% step %}
### How to upgrade Linux from 7.3 to 7.4?

Answer: `yum install update`
{% endstep %}

{% step %}
### How to tell which shell you are in or running?

Answer: `$0`
{% endstep %}

{% step %}
### You have tried to “cd” into a directory but you have been denied. You are not the owner of that directory, what permissions do you need and where?

Answer: Execute (x) permission on directory (and read if listing) — original mentions "r – x" for last bits
{% endstep %}

{% step %}
### What is CNAME record in DNS?

Answer: Entry for hostname to hostname
{% endstep %}

{% step %}
### What is the name of VMWare operating system?

Answer: ESXi
{% endstep %}

{% step %}
### What is the client name used to connect to ESXi or vCenter server?

Answer: vSphere client
{% endstep %}

{% step %}
### You get a call from a user saying that I cannot write to a file because it says, permission denied. The file is owned by that user, how do you troubleshoot?

Answer: Give write permission on the owner bits (first 3 bits)
{% endstep %}

{% step %}
### What is the latest version of VMWare?

Answer: Search online
{% endstep %}

{% step %}
### What is the name of firewall daemon in Linux?

Answer: `firewalld`
{% endstep %}

{% step %}
### Which command syntax you can use to list only the 20th line of a file?

Answer: Search online
{% endstep %}

{% step %}
### What is the difference between run level 3 and 5?

Answer: 3 = Boot system with networking, 5 = Boot system with networking and GUI
{% endstep %}

{% step %}
### List a few commands that are used in troubleshooting network related issue?

Answer: `netstat`, `tcpdump`, etc.
{% endstep %}

{% step %}
### What is the difference between domain and nameserver?

Answer: Search online
{% endstep %}

{% step %}
### You open up a file and it has 3000 lines and it scrolled up really fast, which command you will use to view it one page at a time?

Answer: `more` or `less`
{% endstep %}

{% step %}
### How to start a new shell. E.g. start a new ksh shell?

Answer: Type `ksh` or `bash`
{% endstep %}

{% step %}
### How to kill a process?

Answer: `kill processID`
{% endstep %}

{% step %}
### How to check scheduled jobs?

Answer: `crontab -l`
{% endstep %}

{% step %}
### How to check system memory and CPU usage?

Answer: `free` and `top`
{% endstep %}

{% step %}
### Which utility could you use to repair the corrupted file system?

Answer: `fsck`
{% endstep %}

{% step %}
### What is the command to make a service start at boot?

Answer: `systemctl enable servicename`
{% endstep %}

{% step %}
### How to combine 2 files into 1? E.g. you have 3 lines in file “A” and 5 lines in file “B”, which command syntax to use that will combine into one file of 3+5 = 8 lines

Answer: `cat fileA >> fileB`
{% endstep %}

{% step %}
### What is echo command used for?

Answer: To output to the screen
{% endstep %}

{% step %}
### What does the following command do? echo This year the summer will be great > file1

Answer: It creates a new file `file1` with the content "This year the summer will be great"
{% endstep %}

{% step %}
### Which file to modify to allow users to run root commands?

Answer: `/etc/sudoers`
{% endstep %}

{% step %}
### You need to modify httpd.conf file but you cannot find it, Which command line tool you can use to find file?

Answer: `find / -name "httpd.conf"`
{% endstep %}

{% step %}
### Your system crashed and being restarted, but a message appears, indicating that the operating system cannot be found. What is the most likely cause of the problem?

Answer: The `/boot` file is most likely corrupted
{% endstep %}
{% endstepper %}

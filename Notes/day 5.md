



📘 Linux Day 3 – Module 9
🌐 Networking Commands (ping, telnet, netstat)
🎯 Learning Objectives

By the end of this session, students will be able to:

Test network connectivity between servers.

Verify whether a remote server is reachable.

Check whether a TCP port is open.

Verify if an application is listening on a port.

Troubleshoot common network issues in DevOps environments.

👨‍🏫 Before Teaching
Ask Students
Question:

Your application cannot connect to the database.

How do you identify whether the problem is:

Network?

Firewall?

Application?

Database?

Most beginners don't know where to start.

Explain:

A DevOps Engineer checks connectivity in this order:

Can I reach the server?
        │
        ▼
Can I reach the application port?
        │
        ▼
Is the application listening?
        │
        ▼
Then check the application logs.
These three commands help answer those questions.

🌐 111. ping ip_address / ping hostname
📖 Explanation
ping checks whether another machine is reachable over the network.

It sends ICMP Echo Request packets and waits for ICMP Echo Reply packets.

Think of it as asking:

"Hello Server... Are you alive?"

Syntax
ping ip_address
or

ping hostname
Basic Examples
Example 1
Ping Google

ping google.com
Output

PING google.com (142.250.182.14): 56 data bytes

64 bytes from 142.250.182.14:
icmp_seq=1 ttl=118 time=22 ms

64 bytes from 142.250.182.14:
icmp_seq=2 ttl=118 time=21 ms
Explain

Field	Meaning
icmp_seq	Packet number
ttl	Time To Live
time	Response time
Example 2
Ping AWS Server

ping 13.233.120.10
Example 3
Ping Local Machine

ping 127.0.0.1
Loopback address.

Tests your own system.

Example 4
Ping Gateway

ping 192.168.1.1
Example 5
Send only four packets

ping -c 4 google.com
Output

4 packets transmitted
4 received
🚀 DevOps Use Case 1
Kubernetes Node Not Reachable
Worker node not joining cluster.

Check

ping worker-node
If unreachable

Investigate

Network

Firewall

Routing

🚀 DevOps Use Case 2
Database Server
Application cannot connect.

Check

ping db.company.com
If unreachable

Issue is

Network

Not application.

Student Exercises
Exercise 1
Ping

ping -c 4 google.com
Observe

Time

TTL

Exercise 2
Ping localhost

ping 127.0.0.1
Observe

Almost zero milliseconds.

Student Cross Questions
Q1
Does ping use TCP?

No.

Uses

ICMP.

Q2
Can ping fail even when the server is working?

Yes.

Many servers block ICMP for security reasons.

Q3
What is TTL?

Time To Live.

Limits packet lifetime.

Q4
What if

Request timeout
appears?

Could mean:

Server is down

Firewall blocks ICMP

Network issue

Host unreachable

Q5
Why use

ping -c 4
Instead of

ping
Because Linux ping runs continuously until you stop it with Ctrl + C.

Q6
Can ping check applications?

No.

Only network connectivity.

Q7
Is ping used in interviews?

Very often.

Quick Quiz
Q1
Which protocol does ping use?

A TCP

B UDP

C ICMP

✅ Answer

ICMP

Q2
Which command sends only four packets?

ping -c 4 google.com
Q3
Can ping verify if Tomcat is running?

Answer

No.

🌐 112. telnet ip port
📖 Explanation
telnet checks whether a TCP port is reachable.

Unlike ping

It checks

Application connectivity.

Think of it as asking

"Can I reach your application?"

Syntax
telnet ip_address port
Example

telnet 192.168.1.20 8080
Basic Examples
Example 1
Check Tomcat

telnet localhost 8080
Output

Trying 127.0.0.1...

Connected to localhost.
Example 2
Check SSH

telnet 192.168.1.20 22
Example 3
Check MySQL

telnet db.company.com 3306
Example 4
Check PostgreSQL

telnet db.company.com 5432
Example 5
Check Redis

telnet redis.company.com 6379
Understanding Results
Success

Connected
Failure

Connection refused
Means

Application not listening.

Failure

Connection timed out
Means

Firewall

or

Network problem.

🚀 DevOps Use Case 1
Application cannot connect to Database.

Check

telnet db-server 3306
If connected

Database reachable.

🚀 DevOps Use Case 2
Tomcat Health Check

telnet localhost 8080
If connection fails

Tomcat probably isn't listening.

Student Exercises
Check

SSH

telnet localhost 22
Check

Tomcat

telnet localhost 8080
(if installed)

Student Cross Questions
Q1
Difference between ping and telnet?

ping	telnet
Tests network	Tests application port
Uses ICMP	Uses TCP
Q2
Can ping work while telnet fails?

Yes.

Network is OK.

Application isn't.

Q3
Can telnet work while ping fails?

Yes.

If ICMP is blocked but the TCP port is open.

Q4
Is telnet secure?

No.

It is mainly used for testing connectivity.

Q5
What if

Connection refused?

Application isn't listening.

Q6
What if

Connection timed out?

Firewall

or

Network issue.

Q7
Modern alternative?

Many Linux systems use:

nc -zv host port
or

curl
for HTTP services.

Quick Quiz
Which command checks

TCP port?

Answer

telnet host port
Which port does SSH use?

Answer

22

Can telnet test database?

Yes.

🌐 113. netstat -na | grep 8080
📖 Explanation
This command checks whether any application is listening on port 8080.

This is one of the most commonly used troubleshooting commands in DevOps.

Syntax
netstat -na | grep 8080
Understanding Every Part
Part	Meaning
netstat	Network statistics
-n	Show numeric IPs and ports
-a	Show all sockets
grep	Search
8080	Port number
Basic Examples
Example 1
netstat -na | grep 8080
Output

tcp 0 0 0.0.0.0:8080 LISTEN
Meaning

Tomcat is listening.

Example 2
Port 22

netstat -na | grep 22
Example 3
Port 3306

netstat -na | grep 3306
Example 4
Port 443

netstat -na | grep 443
Example 5
Port 80

netstat -na | grep 80
Understanding LISTEN
LISTEN
means

Application is waiting for connections.

🚀 DevOps Use Case 1
Tomcat not opening.

Check

netstat -na | grep 8080
No output

Tomcat isn't listening.

🚀 DevOps Use Case 2
Verify Jenkins

netstat -na | grep 8080
Jenkins default port.

Student Exercises
Check

SSH

netstat -na | grep 22
Check

HTTP

netstat -na | grep 80
Student Cross Questions
Q1
What does LISTEN mean?

Application waiting for incoming connections.

Q2
What if nothing appears?

Nothing is listening on that port.

Q3
Difference between

netstat

and

telnet?

netstat	telnet
Local machine	Remote/local connectivity
Shows listeners	Tests connection
Q4
Modern alternative?

ss -tuln
is faster and preferred on many modern Linux distributions.

Q5
Can multiple applications use port 8080?

No.

Only one process can listen on a TCP port at a time.

Q6
Can netstat identify the process?

Yes.

With

sudo netstat -tulpn
Output includes the PID and program name.

Q7
Why use

grep
To filter only the port you are interested in.

Quick Quiz
Q1
Which command shows listening ports?

netstat -na
Q2
What does LISTEN indicate?

Answer

Application waiting for connections.

Q3
Modern replacement for netstat?

Answer

ss -tuln
🎯 Real-Time DevOps Scenario
Problem
Users report:

"The application isn't opening."

Step 1: Check basic network connectivity.

ping app-server
If successful

↓

Step 2: Check the application port.

telnet app-server 8080
If connection fails

↓

Step 3: Log into the server.

ssh ubuntu@app-server
↓

Step 4: Verify if the application is listening.

netstat -na | grep 8080
↓

Step 5: If nothing is listening

Restart the application.

💡 Teaching Tip
Help students remember these commands with this simple troubleshooting flow:

Server not reachable?
        │
        ▼
ping
        │
        ▼
Server reachable
        │
        ▼
Application reachable?
        │
        ▼
telnet host port
        │
        ▼
Logged into server
        │
        ▼
Is application listening?
        │
        ▼
netstat -na | grep PORT
This sequence mirrors how many DevOps engineers approach real production incidents.

🎤 Interview Question
Interviewer: Your application isn't accessible on port 8080. How would you troubleshoot it?

Expected Answer:

"First, I'd use ping to verify network connectivity to the server. If the server is reachable, I'd test port 8080 using telnet (or nc) to see if the application is accepting connections. Then I'd SSH into the server and run netstat -na | grep 8080 or ss -tuln to confirm whether the application is listening on that port. Based on the results, I'd inspect the application logs and restart the service if necessary."

✅ Module 9 Complete
Students now understand:

✔️ Network connectivity testing with ping

✔️ TCP port testing with telnet

✔️ Checking listening ports with netstat

✔️ A structured troubleshooting workflow for application connectivity

✔️ Real-world DevOps networking scenarios and interview questions

📌 Next Module
We'll cover Disk, Memory & File Utilities:

df -h

free -m

free -g

sort

uniq

sort | uniq

sort -r | uniq

These commands are essential for server health checks, storage monitoring, memory troubleshooting, and log/report processing.


..

📘 Linux Day 3 – Module 10
💾 Disk, Memory & File Utilities
Commands Covered
114. df -h .

115. free -m

116. free -g

117. uniq file

118. sort file

119. sort file | uniq

120. sort -r file | uniq

👨‍🏫 Before Teaching
Ask Students
Scenario

Your Jenkins deployment suddenly fails.

Error:

No space left on device
What will you check first?

Most students answer:

Restart Jenkins

Restart server

Explain

A DevOps Engineer always checks:

Disk Space

Memory

CPU

Today's commands help us check Disk and Memory.

💽 114. df -h .
📖 Explanation
df stands for

Disk Filesystem

It displays available and used disk space.

The

-h
means

Human Readable

Instead of

20971520
you see

20G
The

.
means

Current Directory.

Linux shows the filesystem where the current directory exists.

Syntax
df -h .
Understanding Every Part
Part	Meaning
df	Disk filesystem usage
-h	Human-readable (KB, MB, GB)
.	Current directory
Example Output
Filesystem      Size Used Avail Use% Mounted on

/dev/xvda1      20G 12G 8G 60% /
Understanding Output
Column	Meaning
Size	Total Disk
Used	Used Space
Avail	Free Space
Use%	Percentage Used
Mounted on	Mount Point
Basic Examples
Example 1
df -h .
Example 2
Entire system

df -h
Example 3
Check

df -h /var
Example 4
Check

df -h /home
Example 5
Check

df -h /tmp
🚀 DevOps Use Case 1
Jenkins Build Failure
Error

No space left on device
Check

df -h
Filesystem

98%
Disk full.

🚀 DevOps Use Case 2
Kubernetes Node
Pods failing.

Check

df -h
Node disk

100%

Kubernetes stops scheduling pods.

Student Exercises
Exercise 1
Run

df -h
Find

Largest partition.

Exercise 2
Run

df -h .
Observe

Current filesystem.

Student Cross Questions
Q1
Difference

df
vs

du
df	du
Filesystem usage	Folder/File size
Q2
What does

100%
mean?

Disk Full.

Q3
Can Linux work when disk is full?

Sometimes

But applications may fail.

Q4
Why use

-h
Human-readable.

Q5
Is this used daily?

Very frequently.

Q6
Can Docker fail?

Yes.

Images cannot be created if the disk is full.

Q7
Can Jenkins fail?

Yes.

Builds may fail due to insufficient disk space.

Quick Quiz
Q1
What does

df
mean?

Answer

Disk Filesystem.

Q2
What does

-h
mean?

Human-readable.

Q3
Which column shows free space?

Avail.

🧠 115. free -m
📖 Explanation
Displays memory usage in Megabytes (MB).

Syntax
free -m
Example Output
              total used free shared buff/cache available

Mem:           4096 1200 1500 200 1396 2500

Swap:          2048 0 2048
Understanding Output
Column	Meaning
Total	Total RAM
Used	Used RAM
Free	Free RAM
Available	RAM available for applications
Basic Examples
Example 1
free -m
Example 2
Display every 2 seconds

watch free -m
Example 3
Combine with uptime

free -m && uptime
Example 4
Run after starting an application

free -m
Observe memory usage increase.

Example 5
Check swap

free -m
Observe the Swap row.

🚀 DevOps Use Case 1
Java application crashes.

Check

free -m
Memory almost exhausted.

🚀 DevOps Use Case 2
EC2 Server Slow

Run

free -m
Find

Very little free memory.

Student Exercises
Run

free -m
Find

Total Memory

Used Memory

Free Memory

Student Cross Questions
Q1
Difference

free

vs

top?

free

Memory only.

top

CPU + Memory + Processes.

Q2
What is Swap?

Disk used as temporary memory when RAM is full.

Q3
Why isn't Free memory equal to Total - Used?

Linux uses available RAM for buffers and cache to improve performance. This memory can be reclaimed when applications need it.

Q4
Can memory be 100%?

Yes.

Applications may slow down or use swap.

Q5
Is Swap faster than RAM?

No.

Much slower.

Quick Quiz
Q1
Which command shows memory?

free -m
Q2
What unit?

MB

Q3
Which row shows swap?

Swap

🧠 116. free -g
📖 Explanation
Same command.

Displays memory in

Gigabytes.

Syntax
free -g
Example
Mem: 16 5 11
Instead of

16384
Much easier to read.

DevOps Use Case
Large AWS EC2

64GB RAM

free -g
Much easier than MB.

Student Exercise
Run

free -g
Compare

With

free -m
Student Cross Questions
Q1
Which is better?

Depends.

Servers

Usually

GB.

Q2
Can decimals appear?

Yes, depending on the system and rounding.

Quick Quiz
Which option shows GB?

Answer

-g
📄 Sample File for sort and uniq
Create a file:

cat > employees.txt << EOF
Rahul
Anita
Vijay
Rahul
Kiran
Anita
Dev
EOF
File contents:

Rahul
Anita
Vijay
Rahul
Kiran
Anita
Dev
📄 117. uniq file
📖 Explanation
uniq removes adjacent duplicate lines.

⚠️ Important:

It only removes duplicates that are next to each other.

Example
uniq employees.txt
Output

Rahul
Anita
Vijay
Rahul
Kiran
Anita
Dev
Nothing changes because the duplicate lines are not adjacent.

Example with Adjacent Duplicates
File:

Rahul
Rahul
Anita
Anita
Dev
Run:

uniq employees.txt
Output:

Rahul
Anita
Dev
🚀 DevOps Use Case
Remove duplicate log entries after sorting.

Student Cross Questions
Q1
Why didn't uniq remove all duplicates?

Because duplicates must be adjacent.

Quick Quiz
Does uniq sort?

Answer

No.

📄 118. sort file
📖 Explanation
Sorts the file alphabetically.

Example
sort employees.txt
Output

Anita
Anita
Dev
Kiran
Rahul
Rahul
Vijay
DevOps Use Case
Sort usernames extracted from logs before generating reports.

Student Exercise
Run

sort employees.txt
Student Cross Questions
Q1
Can sort sort numbers?

Yes.

Use:

sort -n numbers.txt
Quick Quiz
What does sort do?

Alphabetically sorts lines.

📄 119. sort file | uniq
📖 Explanation
This is the correct way to remove duplicates from an unsorted file.

First:

sort
groups duplicate lines together.

Then:

uniq
removes adjacent duplicates.

Example
sort employees.txt | uniq
Output

Anita
Dev
Kiran
Rahul
Vijay
🚀 DevOps Use Case
Generate a unique list of usernames from an application log.

cut -d' ' -f2 app.log | sort | uniq
Student Exercise
Use:

sort employees.txt | uniq
Count how many unique names remain.

Student Cross Questions
Q1
Why not use uniq directly?

Because the input may not be sorted.

Quick Quiz
Which command removes duplicates correctly?

sort file | uniq
📄 120. sort -r file | uniq
📖 Explanation
Sorts the file in reverse alphabetical order, then removes adjacent duplicates.

Example
sort -r employees.txt | uniq
Output

Vijay
Rahul
Kiran
Dev
Anita
🚀 DevOps Use Case
Generate a reverse-sorted unique report of service names for auditing.

Student Exercise
Run:

sort -r employees.txt
Then:

sort -r employees.txt | uniq
Compare the outputs.

Student Cross Questions
Q1
What does -r mean?

Reverse order.

Q2
Does uniq still need sorted input?

Yes. Reverse sorting still groups duplicates together.

Quick Quiz
Which option reverses the sort order?

Answer: -r

🎯 Real-Time DevOps Scenario
Problem
A Jenkins server is failing due to disk space issues, and you need to analyze log data.

Step 1: Check disk usage.

df -h
Step 2: Check available memory.

free -m
Step 3: Extract and sort usernames from logs.

cut -d' ' -f2 app.log | sort | uniq
Step 4: Generate a reverse-sorted report if required.

cut -d' ' -f2 app.log | sort -r | uniq
💡 Teaching Tips
Explain df vs du
Students confuse these frequently.

Command	Shows
df -h	Disk usage of the filesystem (overall partition)
du -sh folder	Size of a specific directory or file
Example:

df -h
Shows:

Filesystem      Size Used Avail Use%
/dev/xvda1       20G  18G   2G   90%
Whereas:

du -sh /var/log
Shows:

1.8G    /var/log
🎤 Interview Question
Interviewer: A production server reports "No space left on device." How would you troubleshoot it?

Expected Answer:

"First, I'd run df -h to identify which filesystem is full. Then I'd use du -sh on large directories like /var/log, /tmp, or application data directories to find what's consuming space. If needed, I'd clean up old logs, remove unnecessary files, or extend the filesystem. I'd also check memory with free -m to rule out RAM-related issues."

✅ Module 10 Complete
Students now understand:

✔️ Checking disk usage with df -h

✔️ Monitoring memory with free -m and free -g

✔️ Removing duplicate lines using uniq

✔️ Sorting data with sort

✔️ Combining sort and uniq for reporting

✔️ Real-world DevOps troubleshooting for storage and memory issues

📌 Next Module (Final Part of Day 3)
We'll cover:

chmod (File Permissions)

Permission bits (rwx, numeric permissions like 754)

umask

Real-world permission troubleshooting

Common DevOps permission issues in Jenkins, Docker, and deployment pipelines

This is one of the highest-priority Linux topics for DevOps engineers and frequently appears in interviews.


..

📘 Linux Day 3 – Final Module
🔐 Linux File Permissions (chmod) & umask
🎯 Learning Objectives

By the end of this session, students will be able to:

Understand Linux file permissions.

Read and interpret rwx permission strings.

Change file permissions using chmod.

Understand numeric permissions (e.g., 754, 777, 644).

Understand umask and default permissions.

Troubleshoot common DevOps permission issues.

👨‍🏫 Before Teaching
Ask Students
Scenario

You create a deployment script:

deploy.sh
You run:

./deploy.sh
Linux says:

Permission denied
Why?

Most beginners answer:

File is corrupted.

Linux bug.

Explain:

Linux is protecting the system.

Every file has permissions that determine:

Who can read it?

Who can modify it?

Who can execute it?

Think Like a House
Imagine your house.

There are three types of people:

You

Your Family

Everyone Else

Linux permissions work exactly the same way.

Owner
Group
Others
Each gets different permissions.

Understanding Permission String
Run

ls -l
Output

-rwxr-xr--
Break it down

- rwx r-x r--
Part	Meaning
-	File
d	Directory
rwx	Owner
r-x	Group
r--	Others
What do r w x mean?
Symbol	Meaning	Numeric Value
r	Read	4
w	Write	2
x	Execute	1
Easy Memory Trick
Imagine a movie.

Read

→ Watch

Write

→ Edit

Execute

→ Play

Numeric Permissions
Permission	Value
---	0
--x	1
-w-	2
-wx	3
r--	4
r-x	5
rw-	6
rwx	7
Students should memorize this table.

Example
754
Breakdown

7 5 4
Owner

7

4+2+1

rwx
Group

5

4+1

r-x
Others

4

r--
Final

rwxr-xr--
Most Common Permission Values
Number	Permission	Real-Time Use
777	rwxrwxrwx	Never recommended in production
755	rwxr-xr-x	Scripts, directories
744	rwxr--r--	Personal scripts
700	rwx------	Private keys
644	rw-r--r--	Configuration files
600	rw-------	Passwords, secrets
🔧 chmod
What is chmod?
Stands for

Change Mode

Used to change permissions.

Syntax
chmod permission file
Example 1
Create

touch deploy.sh
Check

ls -l deploy.sh
Output

-rw-r--r--
Cannot execute.

Add execute

chmod +x deploy.sh
Check

ls -l
Output

-rwxr-xr-x
Now

./deploy.sh
works.

Example 2
Using numbers

chmod 755 deploy.sh
Example 3
Private file

chmod 600 secrets.txt
Only owner

Can read/write.

Example 4
Read-only file

chmod 444 notes.txt
Nobody can modify.

Example 5
Full access

chmod 777 test.sh
Explain

⚠️ Never use

777

In production.

🚀 DevOps Use Case 1
Jenkins Deployment Script
Error

Permission denied
Fix

chmod +x deploy.sh
Now Jenkins can execute.

🚀 DevOps Use Case 2
SSH Key
AWS says

Permissions 0644 for demo.pem are too open.
Fix

chmod 400 demo.pem
Now

ssh -i demo.pem ubuntu@server
works.

Student Exercises
Exercise 1
Create

touch app.sh
Give execute permission.

Run

ls -l
Observe

Execute bit.

Exercise 2
Create

touch password.txt
Make private

chmod 600 password.txt
Verify.

Student Cross Questions
Q1
Difference

chmod +x
vs

chmod 755
+x

Only adds execute permission.

755

Sets all permissions exactly.

Q2
Can chmod remove permission?

Yes.

chmod -x file
Q3
What happens with

777?

Everyone

Can

Read

Write

Execute

Dangerous.

Q4
Why does Linux block execution?

For security.

Q5
Can directories have execute permission?

Yes.

For directories:

Read (r) → List files.

Write (w) → Create/delete files.

Execute (x) → Enter (cd) the directory.

Without execute permission, you cannot access the directory even if you can list its name.

Q6
Most common permissions?

Files

644
Scripts

755
SSH Keys

400
Q7
Why not always use 777?

Security risk.

Anyone can modify or execute the file.

Quick Quiz
Q1
Which permission means

Read + Write?

Answer

6
Q2
Which permission gives

Read + Execute?

Answer

5
Q3
Which permission means

Full Access?

Answer

7
🧩 umask
What is umask?
Every new file gets default permissions.

umask removes permissions from those defaults.

Formula:

Final Permission = Default Permission - umask
Default Permissions
Object	Default
File	666
Directory	777
Why?

New files normally shouldn't be executable by default.

Example 1
Current umask

umask
Output

0022
Calculation
File

666

minus

022

=
644
Directory

777

minus

022

=
755
Example 2
Change umask

umask 027
Now create

touch demo.txt
mkdir demo
Permissions

File

640
Directory

750
🚀 DevOps Use Case 1
Shared Server

Need

Team

Can access.

Others

Cannot.

Set

umask 027
🚀 DevOps Use Case 2
Secrets

Pipeline creates password file.

Set

umask 077
Only owner

Can access.

Student Exercises
Run

umask
Create

touch sample.txt
Check

ls -l
Observe

Permissions.

Student Cross Questions
Q1
Does umask change existing files?

No.

Only newly created files and directories.

Q2
Why default file isn't executable?

Security.

Q3
Can I make every new file private?

Yes.

umask 077
Q4
Where is umask stored?

Often in:

~/.bashrc

~/.profile

/etc/profile

depending on the Linux distribution and shell configuration.

Q5
Difference

chmod

vs

umask?

chmod	umask
Changes existing permissions	Affects default permissions for new files/directories
Q6
Why use umask?

Security

Automation

Consistency.

Q7
Is umask used in DevOps?

Very frequently.

Especially

Jenkins

Shell scripts

Deployment pipelines

Automation.

Quick Quiz
Q1
Default permission

File?

Answer

666
Q2
Default permission

Directory?

Answer

777
Q3
If umask is

022
New file permission?

Answer

644
🎯 Real-Time DevOps Scenario
Problem
A Jenkins pipeline fails with:

./deploy.sh: Permission denied
Step 1
Check permissions.

ls -l deploy.sh
Output:

-rw-r--r--
Notice there's no x (execute) permission.

Step 2
Grant execute permission.

chmod +x deploy.sh
Step 3
Verify.

ls -l deploy.sh
Output:

-rwxr-xr-x
Step 4
Run the script again.

./deploy.sh
The deployment proceeds successfully.

💡 Common Mistakes Students Make
Mistake	Why It's Wrong	Correct Approach
Using chmod 777 for everything	Major security risk	Grant only the permissions required
Forgetting +x on scripts	Script cannot be executed	Use chmod +x script.sh
Confusing 644 and 755	Files don't usually need execute permission	Use 644 for files, 755 for executable scripts/directories
Expecting umask to modify existing files	umask affects only new files	Use chmod to change existing permissions
🎤 Interview Question
Interviewer: What is the difference between chmod and umask?

Expected Answer:

"chmod changes the permissions of an existing file or directory. umask defines the default permissions that new files and directories receive when they are created. In DevOps, I use chmod to fix permission issues on existing deployment scripts and umask to ensure newly created files have secure default permissions."

📝 Day 3 Summary
Today, students learned:

✔️ chown – File ownership

✔️ sed – Stream editing

✔️ cp – Copy files

✔️ cut & awk – Text processing

✔️ ps & kill – Process management

✔️ find & xargs – File searching and cleanup

✔️ ln & ln -s – Hard and soft links

✔️ System information commands (uname, hostname, who, whoami)

✔️ nohup & top – Background jobs and monitoring

✔️ ssh, scp, rsync – Remote access and file transfer

✔️ ping, telnet, netstat – Network troubleshooting

✔️ df, free, sort, uniq – Disk, memory, and file utilities

✔️ chmod & umask – Permissions and default security

🎯 End-of-Day Practice Lab (30 Minutes)
Give students these real-world tasks:

Create a deployment script and make it executable.

Create a symbolic link to the script.

Find all .sh files in the current directory.

Check disk space and memory usage.

Start a background script using nohup.

Find its PID using ps.

Stop it gracefully with kill.

SSH into another VM (or localhost if configured).

Copy a file using scp.

Verify permissions with ls -l and modify them using chmod.

This lab ties together the commands they've learned and reinforces how they're used in real DevOps workflows.




What is an Inode in Linux?

An inode (Index Node) is a data structure used by the Linux filesystem to store metadata (information) about a file or directory, but not the file name or the actual file content.

Simple Definition (For Students)

Think of an inode as the identity card (Aadhaar card) of a file.

The inode contains information about the file, while the filename is just a label pointing to that inode.

Real-Life Analogy

Imagine a library.

Book Name → Filename
Book ID → Inode Number
Book Details
Number of pages
Author
Publication date
Shelf location
Permissions

These details are stored in the library database, not on the label.

Linux works similarly.

Filename  ------------->  Inode  -------------> Actual Data Blocks
report.txt                 123456                 File Content
What Information Does an Inode Store?

An inode stores almost everything except the filename.

It stores:

File type
File size
Owner (UID)
Group (GID)
File permissions
Creation time (depending on filesystem)
Modification time
Access time
Number of hard links
Location of data blocks on disk

Example:

Inode Number : 1572865

Owner        : ec2-user
Group        : ec2-user
Permissions  : rw-r--r--
Size         : 2048 Bytes
Modified     : Jul 20 10:00
Links        : 1
What is NOT Stored in an Inode?

An inode does not store:

File name
Directory name
Actual file data

The filename is stored inside the directory entry.

Directory

notes.txt  -------------> inode 14562

inode 14562 -------------> Actual file data
How Linux Finds a File

Suppose you execute:

cat notes.txt

Linux performs these steps:

Step 1
Look inside current directory

notes.txt
      |
      V
inode 14562

Step 2

Read inode 14562

Owner
Permissions
Location of blocks

Step 3

Go to disk blocks

Read data

Display on screen
View Inode Number

Create a file

touch file1

Display inode

ls -i

Output

14562 file1

Here

14562

is the inode number.

Display Detailed Information
ls -li file1

Output

14562 -rw-r--r-- 1 ec2-user ec2-user 0 Jul 20 10:00 file1

Here

14562

is the inode.

Another Example

Create files

touch f1 f2 f3

Check inode

ls -i

Output

1001 f1
1002 f2
1003 f3

Every file has its own inode.

Hard Link Example

Create a file

echo "Hello Linux" > file1

Check inode

ls -li file1

Output

15876 file1

Create a hard link

ln file1 file2

Check again

ls -li

Output

15876 file1
15876 file2

Notice:

Both filenames have the same inode number.

That means both names point to the same file.

file1
        \
         \
          inode 15876 -----> Data

file2

Editing either file updates the same data.

Soft Link Example

Create a symbolic link

ln -s file1 file3

Check inode

ls -li

Example output

15876 file1
15876 file2
16010 file3

Here:

file1 → inode 15876
file2 → inode 15876 (hard link)
file3 → different inode (symbolic link)

A symbolic link stores the path to another file rather than sharing its inode.

Find Inode Using stat
stat file1

Output

File: file1
Size: 12
Inode: 15876
Links: 2
Access: (0644/-rw-r--r--)
Owner: ec2-user
DevOps Use Cases
1. Find Duplicate Files (Hard Links)

Check if two files share the same inode.

ls -li *

If inode numbers are the same, they are hard links.

2. Recover Deleted Log Space

Sometimes a process still holds an open file after it's deleted.

Application
      |
      V
Deleted file
      |
Still using inode
      |
Disk space not released

Find open deleted files:

lsof | grep deleted

Restart the application or stop the process to release the inode.

3. Check Inode Usage

A filesystem can run out of inodes even if disk space is available.

df -i

Example output:

Filesystem     Inodes  IUsed   IFree IUse% Mounted on
/dev/xvda1     655360 655360      0  100% /

In this case:

Disk space may still be free.
No new files can be created because there are no free inodes.
Interview Questions
Q1. What is an inode?

Answer: An inode is a filesystem data structure that stores metadata about a file or directory, such as permissions, owner, size, timestamps, and the locations of its data blocks. It does not store the filename.

Q2. Does an inode store the filename?

Answer: No. The filename is stored in the directory, which maps the name to an inode.

Q3. How do you display inode numbers?
ls -i

or

ls -li
Q4. Which command shows complete inode information?
stat filename
Q5. Why are inode numbers important?

They allow the filesystem to locate a file's metadata and data efficiently, enable hard links, and help administrators troubleshoot issues such as inode exhaustion or open deleted files.

Classroom Summary
Concept	Explanation
Inode	Stores metadata about a file
Filename	Stored in the directory, points to an inode
File data	Stored separately in data blocks
ls -i	Displays inode numbers
ls -li	Displays inode numbers with file details
stat file	Shows detailed inode metadata
Hard link	Multiple filenames share the same inode
Soft link	Separate inode pointing to the target's path
df -i	Shows inode usage on each filesystem
Memory Trick

Think of a file as having three parts:

Filename (Directory Entry)
          │
          ▼
      Inode (Metadata)
          │
          ▼
    Data Blocks (Actual Content)

Easy way to remember:

Filename = What humans use.
Inode = What Linux uses to identify the file.
Data Blocks = Where the actual file contents are stored.





Today 7:11 AM
I want o teach tthe below commands to my students today ,explain below commands in details with an examaple and use cases , 




153. xargs:
154. find . -type f -mtime +2|xargs rm
155. find . -type f -mtime +365|xargs rm
156. find . -type f -iname "test" -maxdepth 1
157. find . -type d -iname "test" -maxdepth 2
158. find . -iname "test" -maxdepth 1
159. links: 
		softlink or symbolic link or sym link:
		ln -s test1 softlink
		ln -s /home/test/test1 softlink
		
		hardlink:
			'i-node'
		ln /home/test/test1 hardlink
160. uname -a
161. cat /etc/os-release
162. hostname
163. who|wc -l
164. whoami
165. nohup: [no hang up]
	nohup ./script.sh &
166. top
167. ssh [secure shell]
	port 22
	
	ssh username@server
	password:
	
	ssh -i demo.pem user@server
	ssh -i demo.pem ubuntu@54.26.118.12 
168. scp file_name user@server:/tmp
169. scp file_name user@server:/home/ubuntu
170. scp -r directory user@server:/path
171. rsync file user@server:/home/temp
172. ping ip_address or ping hostname or ping google.com
173. telnet ip or telnet dns_name [port 23]
174. netstat -na|grep 8080












These are excellent commands for a Linux + DevOps Day 5 session. They cover file management, links, system information, process management, remote access, networking, and troubleshooting, which are essential for every Linux administrator and DevOps engineer.

Linux Day 5 - Complete Teaching Notes
153. xargs
What is xargs?
xargs reads input from another command and converts it into command-line arguments.

Without xargs, many commands cannot accept input from a pipe.

Think of it like:

Command A
     |
     V
  xargs
     |
     V
Command B
Syntax
command1 | xargs command2
Example 1
Create files

touch f1 f2 f3
List files

ls
Output

f1
f2
f3
Delete using xargs

ls | xargs rm
Equivalent to

rm f1 f2 f3
Example 2
Search files

find . -name "*.log" | xargs rm
Deletes every log file.

Example 3
Count lines in all txt files

find . -name "*.txt" | xargs wc -l
DevOps Use Cases
Cleaning old logs
find /var/log -name "*.log" | xargs rm
Compress multiple files
find . -name "*.log" | xargs gzip
Student Question
Q: Why not use rm directly?

Because find outputs file names, while rm expects arguments.

xargs converts the output into arguments.

154. find . -type f -mtime +2 | xargs rm
Meaning
find
Search files

.
Current directory

-type f
Only files

-mtime +2
Modified more than 2 days ago

xargs rm
Delete them

Example

project/

app.log
old.log
today.log
If old.log is older than two days,

find . -type f -mtime +2 | xargs rm
Deletes

old.log
DevOps Use Case
Delete old build artifacts.

Delete temporary backups.

155. find . -type f -mtime +365 | xargs rm
Deletes files older than one year.

Example

backup1.tar
backup2.tar
backup2024.tar
Command

find . -type f -mtime +365 | xargs rm
Useful for

Backup cleanup

Archive cleanup

Jenkins workspace cleanup

156. find . -type f -iname "test" -maxdepth 1
Meaning
-type f
Only files

-iname
Case insensitive

Matches

test
TEST
Test
tEsT
-maxdepth 1
Only current directory.

Example

.

test
TEST
abc/test
Output

./test
./TEST
Use Case
Find configuration files.

157. find . -type d -iname "test" -maxdepth 2
Search only directories.

Example

test/
abc/test/
abc/xyz/test/
Output

./test
./abc/test
Third directory is ignored because depth is greater than 2.

158. find . -iname "test" -maxdepth 1
Search both

Files

Directories

Example

test
test/
Both appear.

Student Question
Difference between

-type f
and

-type d
Answer

f → file

d → directory
159. Links
Linux supports two links.

Soft Link
Also called

Symbolic Link

Symlink

Create
ln -s test1 softlink
Now

softlink
points to

test1
Absolute path

ln -s /home/user/test1 softlink
Example
original.txt

↓

soft.txt
Delete original

rm original.txt
Now

soft.txt
becomes broken.

Hard Link
Create

ln test1 hardlink
A hard link points to the same inode.

Original

↓

inode

↑

Hard Link
Delete original

rm test1
Hard link still works.

Check inode
ls -li
Output

24567 test1

24567 hardlink
Same inode.

Soft Link inode
56789 softlink
Different inode.

Soft Link vs Hard Link
Feature	Soft Link	Hard Link
Different inode	Yes	No
Can cross filesystem	Yes	No
Broken if original deleted	Yes	No
Links to directory	Yes	Usually No
Uses inode	No	Yes
DevOps Use Case
Current release

release1/

release2/

current -> release2
Applications always access

current
Changing release only changes the symlink.

160. uname -a
Displays kernel information.

uname -a
Example

Linux ip-172-31-10-25

5.15.0

x86_64

GNU/Linux
Useful before software installation.

161. cat /etc/os-release
Shows operating system details.

Example

NAME="Ubuntu"

VERSION="24.04"

ID=ubuntu
Useful for

Checking package manager

Ubuntu → apt

RHEL → yum

162. hostname
Shows system hostname.

server01
Useful for identifying servers.

163. who | wc -l
Shows number of logged-in users.

Example

3
Useful on multi-user Linux systems.

164. whoami
Displays current logged-in user.

ubuntu
Useful in scripts.

165. nohup
No Hang Up

Keeps process running after logout.

Without nohup

Logout

↓

Process stops
With nohup

Logout

↓

Process continues
Example

nohup ./script.sh &
Output

nohup: ignoring input
Creates

nohup.out
View output

cat nohup.out
DevOps Use Cases

Run

Backup scripts

Long deployments

Log collectors

Database exports

Student Question

Difference between

&
and

nohup &
& runs in the background only while the terminal session exists.

nohup & runs in the background and continues even after you log out.

166. top
Displays live system usage.

Shows

CPU

Memory

Swap

Running processes

Load average

PID

User

CPU%

Memory%

Useful keys

P
Sort by CPU

M
Sort by Memory

k
Kill process

q
Quit

DevOps Use Cases
Identify high CPU processes.

Detect memory leaks.

Monitor long-running deployments.

Troubleshoot application performance.

167. ssh (Secure Shell)
Port

22
Used to remotely log in to Linux servers securely.

Password authentication
ssh username@server
Example

ssh ubuntu@54.26.118.12
Key-based authentication
ssh -i demo.pem ubuntu@54.26.118.12
-i specifies the private key file.

This is the standard way to access cloud VMs (such as AWS EC2) without using passwords.

DevOps Use Cases
Manage EC2 instances.

Connect to on-premises Linux servers.

Run remote administration commands.

Copy deployment files.

Student Questions
Q: Why is SSH preferred over Telnet?

SSH encrypts all communication. Telnet sends data, including passwords, in plain text.

Q: What happens if port 22 is blocked?

SSH connections will fail unless the SSH service is configured to listen on another port.

168. scp file_name user@server:/tmp
scp (Secure Copy) transfers files over SSH.

Example

scp app.jar ubuntu@54.26.118.12:/tmp
Copies app.jar to the remote server's /tmp directory.

169. scp file_name user@server:/home/ubuntu
Example

scp config.yaml ubuntu@54.26.118.12:/home/ubuntu
Copies the file into the user's home directory.

170. scp -r directory user@server:/path
-r copies directories recursively.

Example

scp -r project ubuntu@54.26.118.12:/home/ubuntu
Copies the entire project directory and all its contents.

DevOps Use Cases
Upload application code.

Transfer configuration files.

Copy log files for troubleshooting.

171. rsync file user@server:/home/temp
rsync synchronizes files efficiently by transferring only changed data.

Example

rsync backup.tar ubuntu@54.26.118.12:/home/temp
A commonly used option is archive mode with progress:

rsync -avh --progress project/ ubuntu@54.26.118.12:/home/project/
Options:

-a → archive (preserves permissions, timestamps, symbolic links, etc.)

-v → verbose

-h → human-readable sizes

--progress → show transfer progress

Why rsync instead of scp?
Faster for repeated transfers.

Copies only changed portions of files.

Preserves metadata.

Ideal for backups and deployments.

172. ping ip_address | ping hostname | ping google.com
Checks network connectivity by sending ICMP Echo Requests.

Examples

ping 8.8.8.8
ping google.com
On most Linux systems, stop with Ctrl + C.

DevOps Use Cases
Verify server reachability.

Check DNS resolution (ping google.com).

Test basic network connectivity.

Note: Some servers block ICMP, so a failed ping does not always mean the server is down.

173. telnet ip_address [port]
Default Telnet service port:

23
For troubleshooting, Telnet is often used to test whether a TCP port is reachable.

Example

telnet 192.168.1.10 8080
or

telnet example.com 443
If the connection succeeds, the port is open and reachable.

DevOps Use Cases
Verify application ports.

Test database connectivity (if permitted).

Check firewall or security group rules.

Many modern Linux systems no longer install Telnet by default. nc (netcat) is often preferred for port testing.

174. netstat -na | grep 8080
netstat displays network connections and listening ports.

Command

netstat -na | grep 8080
Meaning:

-n → show numeric IP addresses and port numbers.

-a → show all listening and established connections.

grep 8080 → filter for port 8080.

Example output

tcp        0      0 0.0.0.0:8080      0.0.0.0:*      LISTEN
This indicates that an application (for example, Tomcat or Spring Boot) is listening on port 8080.

DevOps Troubleshooting
Imagine a web application isn't accessible.

Check whether the application is running:

netstat -na | grep 8080
If nothing appears:

The application may not have started.

It may be listening on a different port.

A startup error may have occurred.

If it is listening but users still can't connect:

Check firewall rules.

Verify cloud security groups (AWS, Azure, GCP).

Confirm the load balancer forwards traffic to port 8080.

Classroom Hands-on Exercises
Create three files with different modification times and use find with -mtime to identify which files would be deleted.

Create both a soft link and a hard link, compare their inode numbers using ls -li, then delete the original file and observe the behavior.

Start a script using nohup, log out (or simulate by closing the terminal), reconnect, and verify the script is still running.

Use ssh to connect to another Linux machine and transfer a file using both scp and rsync.

Start a simple HTTP server on port 8080 (for example, python3 -m http.server 8080) and verify it using netstat, telnet, and ping where appropriate.

Interview Questions
What is the difference between xargs and using command substitution ($(...))?

Explain the difference between a soft link and a hard link with inode examples.

When would you choose rsync over scp?

What is the purpose of nohup, and how is it different from simply appending &?

How do you verify whether a Linux application is listening on port 8080?

Why is SSH more secure than Telnet?

How does find -mtime calculate file age?

What information do uname -a and /etc/os-release provide, and when would you use each?

If ping fails but SSH works, what could be the reason?

Your application is unreachable. Which Linux networking commands would you use first, and in what order?



-iname

what is iname ?

-iname is an option of the find command used for case-insensitive name matching.

Syntax
find <path> -iname "filename"
i → Insensitive (ignores uppercase/lowercase)

name → Search by file or directory name

Difference between -name and -iname
Suppose you have these files:

test
TEST
Test
tESt
Using -name
find . -name "test"
Output:

./test
It matches only the exact case.

Using -iname
find . -iname "test"
Output:

./test
./TEST
./Test
./tESt
It ignores uppercase and lowercase differences.

Example 1 – Find a file
Create files:

touch test TEST Test
Search:

find . -iname "test"
Output:

./test
./TEST
./Test
Example 2 – Search for .log files
find . -iname "*.log"
Matches:

app.log
APP.LOG
Error.Log
error.LOG
Example 3 – Search only in the current directory
find . -maxdepth 1 -iname "test"
Searches only the current directory and ignores subdirectories.

Example 4 – Find directories named "backup"
find . -type d -iname "backup"
Output:

./backup
./project/BACKUP
Example 5 – Find files named "config"
find . -type f -iname "config"
Searches only files.

Real-Time DevOps Use Cases
1. Find all log files
find /var/log -iname "*.log"
Useful when log filenames have inconsistent capitalization.

2. Search configuration files
find /etc -iname "*.conf"
Locate configuration files across the system.

3. Find Jenkins files
find . -iname "jenkinsfile"
Matches:

Jenkinsfile
jenkinsfile
JENKINSFILE
4. Search Kubernetes YAML files
find . -iname "*.yaml"
or

find . -iname "*.yml"
Student Interview Question
Q: What is the difference between -name and -iname?

Answer:

-name	-iname
Case-sensitive	Case-insensitive
test ≠ TEST	test, TEST, Test all match
Easy Trick to Remember
-name → Normal name search (case matters)

-iname → Insensitive name search (case does not matter)

Memory tip: The i in -iname stands for Insensitive.





Today 7:38 AM
how to check current umask value 

You can check the current umask value in Linux using the following commands.

1. Display the Current Umask (Recommended)
umask
Example:

$ umask
0022
This means the current umask is 022.

2. Display the Umask in Symbolic Format
umask -S
Example:

$ umask -S
u=rwx,g=rx,o=rx
This tells you the default permissions after applying the umask:

User (u): rwx

Group (g): rx

Others (o): rx

3. Understand the Output
Suppose:

umask
0022
Default permissions before umask
Object	Default Permission
File	666 (rw-rw-rw-)
Directory	777 (rwxrwxrwx)
Apply umask 022
For files:

666
-022
----
644
Result:

-rw-r--r--
For directories:

777
-022
----
755
Result:

drwxr-xr-x
4. Check Where the Umask Is Set
Sometimes the umask is configured in startup files.

grep umask /etc/profile
grep umask ~/.bashrc
grep umask ~/.bash_profile
grep umask ~/.profile
5. Check Another User's Umask
Switch to that user:

su - username
Then run:

umask
6. Temporarily Change Umask
umask 027
Verify:

umask
Output:

0027
This change affects only the current shell session.

Real-Time DevOps Example
Suppose a Jenkins server creates deployment scripts.

Current umask:

$ umask
0022
Create a file:

touch deploy.sh
ls -l deploy.sh
Output:

-rw-r--r-- 1 ec2-user ec2-user 0 Jul 20 07:45 deploy.sh
Change the umask:

umask 0077
touch secrets.txt
ls -l secrets.txt
Output:

-rw------- 1 ec2-user ec2-user 0 Jul 20 07:46 secrets.txt
Only the owner can read and write the file, which is ideal for sensitive files such as private keys or passwords.

Student Cross Questions
Q1. What does umask stand for?
Answer: User File Creation Mode Mask. It masks (removes) permission bits from the default permissions assigned to new files and directories.

Q2. Does umask add permissions?
Answer: No. It only removes permissions from the defaults.

Q3. Why do new files get 666 and not 777 by default?
Answer: Regular files are not created as executable by default for security reasons, so they start with 666 (read/write only).

Q4. Does umask affect existing files?
Answer: No. It only affects newly created files and directories.

Q5. How can I make a umask change permanent?
Answer: Add the desired umask command (for example, umask 027) to your shell startup file such as ~/.bashrc, ~/.profile, or configure it system-wide in /etc/profile, depending on your environment.


You're using macOS (zsh), and what you're observed is expected.

Your output
sid@Siddeshs-Mac-mini july26 % umask
022
This shows your current umask is 022.

Why did umask -s fail?
You ran:

umask -s
Output:

umask: bad option: -s
This is because -s (lowercase) is not a valid option for the umask built-in command.

The correct option is uppercase -S.

Correct command
umask -S
Output:

u=rwx,g=rx,o=rx
This is the symbolic representation of the permissions that will be assigned after applying the umask.

It means:

User	Group	Others
rwx	r-x	r-x
Verify with an example
Current umask:

umask
022
Create a file:

touch file1
ls -l file1
Output:

-rw-r--r--  1 sid  staff  0 Jul 20 07:50 file1
Create a directory:

mkdir dir1
ls -ld dir1
Output:

drwxr-xr-x  2 sid  staff  64 Jul 20 07:50 dir1
This matches:

Files: 644 (rw-r--r--)

Directories: 755 (rwxr-xr-x)

Difference between Linux and macOS
Command	Linux	macOS
umask	✅ Supported	✅ Supported
umask -S	✅ Supported	✅ Supported
umask -s	❌ Invalid	❌ Invalid
The option is -S (uppercase S) on both Linux and macOS. There is no -s option.

Teaching Tip for Students
Ask your students:

"If my umask is 027, what permissions will a newly created file and directory have?"

Answer:

File: 666 - 027 = 640 → rw-r-----

Directory: 777 - 027 = 750 → rwxr-x---

This exercise helps students understand how umask affects default permissions.


why its getting created with 
-rw-r--r--  1 sid  staff  0 Jul 20 07:50 file1

it should be 
| User | Group | Others |
| ---- | ----- | ------ |
| rwx  | r-x   | r-x    |

??

This is one of the most common questions students ask, and it's an excellent teaching moment.

The confusion comes from mixing up file permissions and directory permissions.

Rule 1: Files and Directories have different default permissions
When Linux/macOS creates something, it does not start with the same permissions.

Object	Initial Default Permissions
Regular File	666 (rw-rw-rw-)
Directory	777 (rwxrwxrwx)
Notice that files do not start with execute (x) permissions.

Why not 777 for files?
Imagine you create a text file:

touch notes.txt
If it were created as:

-rwxrwxrwx
then every new text file would immediately be executable, which is a security risk.

Most files (text files, logs, configs, CSVs, etc.) are data, not programs. That's why the system starts files at 666 (read/write only) and leaves execution off.

Rule 2: Apply the umask
Your umask is:

022
For a file
Start with:

666
Subtract the umask:

666
-022
----
644
Result:

-rw-r--r--
Exactly what you saw:

-rw-r--r-- 1 sid staff 0 Jul 20 07:50 file1
For a directory
Directories start with:

777
Subtract the umask:

777
-022
----
755
Result:

drwxr-xr-x
Then what does umask -S mean?
You ran:

umask -S
Output:

u=rwx,g=rx,o=rx
Many people interpret this as "new files get rwxr-xr-x," but that's not what it means.

It is showing the permissions that remain after applying the umask to a full 777 permission set. That's why it looks like directory permissions.

For regular files, since execute bits were never present to begin with, the effective permissions become:

rw-r--r--
Visual Summary
               Default        Umask        Final

Regular File     666      -     022   =    644
               rw-rw-rw-        ----      rw-r--r--

Directory        777      -     022   =    755
               rwxrwxrwx        ----      rwxr-xr-x
Live Demo
umask
022
Create a file:

touch test.txt
ls -l test.txt
Output:

-rw-r--r--
Create a directory:

mkdir testdir
ls -ld testdir
Output:

drwxr-xr-x
Student Cross Question
Student: If umask -S shows u=rwx,g=rx,o=rx, why doesn't touch file1 create a file with execute permissions?

Answer: Because umask only removes permissions—it never adds them. Regular files start with a maximum of 666, not 777, so there are no execute (x) bits for umask to preserve. Directories start with 777, which is why they end up as 755 with a 022 umask.

This distinction—files start at 666, directories start at 777—is the key concept that clears up the confusion.


explain i node in detail 

Inode in Linux – Complete Explanation (Beginner to Advanced)
The inode (Index Node) is one of the most important concepts in Linux file systems. Every Linux administrator and DevOps engineer should understand it because many commands (ls -i, find, df, du, ln, etc.) rely on inodes.

What is an Inode?
An inode is a data structure that stores metadata (information about a file or directory), but not the file name or the file's actual content.

Think of it as an identity card for every file.

For example:

resume.pdf
The name resume.pdf is not stored in the inode.

Instead, the inode stores information like:

Owner

Group

Permissions

File size

Creation/Modification time

Location of file blocks on disk

Number of hard links

Real Life Analogy
Imagine a library.

Every book has

Book Name

Shelf Number

Author

Pages

Publisher

The librarian maintains a record.

Book Name -------> Record Number
                     |
                     |
             Shelf Location
             Number of Pages
             Author
             Publisher
Linux works similarly.

Filename  --------->  Inode Number
                          |
                          |
                  Permissions
                  Owner
                  Size
                  Timestamp
                  Disk Block Address
What Does an Inode Contain?
An inode stores metadata.

Information	Stored in Inode?
File size	✅ Yes
Owner	✅ Yes
Group	✅ Yes
Permissions	✅ Yes
Last modified time	✅ Yes
Last accessed time	✅ Yes
Creation/Change time	✅ Yes
Number of hard links	✅ Yes
Disk block locations	✅ Yes
File type	✅ Yes
Filename	❌ No
Actual data/content	❌ No
Where is the Filename Stored?
Many beginners think the inode contains the filename.

It does not.

The filename is stored inside the directory.

Example:

Documents/

    notes.txt
Internally,

Directory Entry

notes.txt -------> inode 14582
The inode then points to the file data.

notes.txt

      |
      v

 inode 14582

      |
      v

 Disk Blocks

Hello Linux Students...
How Linux Finds a File
Suppose you type

cat notes.txt
Linux performs these steps.

Step 1
Search the current directory.

notes.txt
Find its inode number.

Example

notes.txt -----> inode 12345
Step 2
Open inode 12345.

Read metadata.

Owner
Permissions
Size
Disk Blocks
Step 3
Read disk blocks.

Block 25
Block 40
Block 56
Step 4
Read content.

Hello Students
Welcome to Linux
View Inode Number
Use

ls -i
Example

touch file1
touch file2

ls -i
Output

12345 file1
12346 file2
Each file has a different inode.

Detailed Listing
ls -li
Output

12345 -rw-r--r-- 1 sid staff 0 Jul 20 file1
12346 -rw-r--r-- 1 sid staff 0 Jul 20 file2
First column = inode number.

Check Inode Using stat
stat file1
Example

File: file1
Size: 0
Inode: 12345
Access: rw-r--r--
Owner: sid
One File = One Inode
touch report.txt

report.txt

inode 5543
report.txt

    |
    |

inode 5543

    |

Disk Blocks
Directories Also Have Inodes
Create a directory.

mkdir project
Check inode.

ls -id project
Example

54321 project
Directories are also files internally.

Hard Link and Inode
Create a file.

echo "Hello" > notes.txt
Check inode.

ls -li notes.txt
Output

14582 notes.txt
Create hard link.

ln notes.txt copy.txt
Check.

ls -li
Output

14582 notes.txt
14582 copy.txt
Notice

Both names have the same inode.

That means

notes.txt

      \
       \
        ---> inode 14582

       /

copy.txt
One inode.

Two filenames.

Same data.

Soft Link
ln -s notes.txt shortcut.txt
Check

ls -li
Output

14582 notes.txt

17893 shortcut.txt
Soft link gets its own inode.

It simply points to the filename.

shortcut.txt

      |

inode 17893

      |

notes.txt

      |

inode 14582
Can Two Different Files Have Same Inode?
Normally

No.

Unless they are hard links.

Example

14582 notes.txt

14582 copy.txt
Can Two Files Have Same Name?
Yes.

As long as they are in different directories.

project1/app.py

project2/app.py
Different directories.

Different inodes.

Find Inode Number
find . -inum 14582
Finds all files using inode 14582.

Very useful while removing hard links.

Delete a File
Suppose

notes.txt

inode 12345
Delete

rm notes.txt
Linux removes

Filename
from directory.

If no hard links remain,

inode becomes free.

Disk blocks become reusable.

What Happens with Hard Links?
Suppose

notes.txt

copy.txt

Both

inode 12345
Delete

rm notes.txt
Still exists

copy.txt

inode 12345
Because link count becomes 1.

Delete

rm copy.txt
Now inode is released.

Check Number of Hard Links
ls -l
Example

-rw-r--r-- 2 sid staff 20 Jul 20 notes.txt
The 2 means

Two hard links.

Find Filesystem Inode Usage
Very important in production.

df -i
Example

Filesystem     Inodes  IUsed  IFree IUse%

/dev/sda1

655360

120000

535360

19%
Why Do We Need df -i?
Sometimes

df -h
shows

50% disk used
But

No space left on device
Why?

Because

All inodes are consumed.

This happens when millions of tiny log files exist.

Example

1 KB log

1 KB log

1 KB log

5 million files
Disk space remains.

No inode remains.

Linux cannot create new files.

DevOps Real-Time Scenario 1
A Jenkins server suddenly fails.

touch test

No space left on device
But

df -h

Filesystem

50% Used
Check

df -i
Output

100% inode used
Reason

Millions of build logs.

Solution

Delete old logs.

DevOps Real-Time Scenario 2
A Kubernetes node reports

No space left on device
Disk usage

30%
Check

df -i
Find millions of container log files under

/var/log/containers
Delete old logs or configure log rotation.

Common Commands
Command	Purpose
ls -i	Show inode numbers
ls -li	Detailed listing with inode
stat file	Show inode and metadata
find . -inum <inode>	Find files by inode
df -i	Check inode usage
ln file hardlink	Create hard link (same inode)
ln -s file softlink	Create symbolic link (new inode)
Student Cross Questions
Q1. Does every file have an inode?
Yes. Every file and every directory has its own inode.

Q2. Is the filename stored in the inode?
No. The filename is stored in the directory entry, which maps the name to an inode number.

Q3. Why does a hard link have the same inode?
Because a hard link is simply another directory entry pointing to the same inode and therefore the same file data.

Q4. Why does a soft link have a different inode?
A symbolic link is a separate file whose content is the path to another file, so it has its own inode.

Q5. Why can Linux say "No space left on device" even when df -h shows free disk space?
Because the filesystem may have run out of inodes. No free inode means no new file can be created, even if there is free storage space.

Quick Interview Questions
What is an inode, and what information does it store?

Is the filename stored in the inode? If not, where is it stored?

What is the difference between a hard link and a symbolic link in terms of inode usage?

Which commands can you use to view a file's inode number?

Why would you use df -i in addition to df -h?

Can two different filenames point to the same inode? Under what circumstances?

What happens to an inode when you delete a file with multiple hard links?

These concepts are fundamental for understanding Linux file systems, troubleshooting storage issues, and explaining how links and file metadata work in real-world DevOps environments.






Hard Link in Linux – Complete Explanation
A hard link is another name (directory entry) for the same file.

Unlike a soft link, a hard link does not point to the filename. Instead, both names point to the same inode.

Key idea: One inode can have multiple filenames (hard links).

Real-life Analogy
Imagine a person with two nicknames:

Rahul

Rocky

Both names refer to the same person.

Similarly:

report.txt
backup.txt
Both can refer to the same inode.

If you update one, the other reflects the change because there is only one copy of the data.

What is an inode?
An inode stores metadata about a file:

Owner

Permissions

Size

Timestamps

Disk block locations

The filename is NOT stored in the inode.

Instead:

Filename  ------->  Inode  ------->  Data Blocks
With a hard link:

report.txt ----\
                \
                 ---> Inode 12345 ---> Data
                /
backup.txt ----/
Both filenames point to the same inode.

Create a Hard Link
Step 1: Create a file
touch report.txt
echo "Linux Hard Link Demo" > report.txt
Step 2: Create a hard link
ln report.txt backup.txt
Syntax:

ln source_file hardlink_name
Notice there is no -s option.

Verify
ls -li
Example output:

123456 -rw-r--r-- 2 sid staff 21 Jul 20 report.txt
123456 -rw-r--r-- 2 sid staff 21 Jul 20 backup.txt
Notice:

Same inode number → 123456

Link count → 2

Both files are actually the same file.

Modify One File
echo "DevOps" >> report.txt
Read the hard link:

cat backup.txt
Output:

Linux Hard Link Demo
DevOps
Why?

Because both names refer to the same inode.

Delete the Original File
rm report.txt
Check:

ls -li
Output:

123456 -rw-r--r-- 1 sid staff 28 Jul 20 backup.txt
The file is still available.

Read it:

cat backup.txt
Output:

Linux Hard Link Demo
DevOps
Why didn't the file disappear?
Because the inode still has one filename pointing to it.

Only the directory entry report.txt was removed.

When is the file actually deleted?
Only when:

All hard links are removed, and

No process has the file open.

Example:

rm backup.txt
Now the inode has no references.

Linux frees the disk space.

Hard Link Diagram
Before deletion:

report.txt --------\
                    \
                     --> Inode 1001 --> Data
                    /
backup.txt --------/
After deleting report.txt:

backup.txt -------> Inode 1001 --> Data
After deleting backup.txt:

(No filenames)

Inode deleted
Data blocks freed
Link Count
Run:

ls -l
Example:

-rw-r--r-- 2 sid staff 100 report.txt
The 2 means there are two hard links pointing to the same inode.

You can also use:

stat report.txt
Example:

Links: 2
Hard Link Restrictions
1. Cannot link directories
ln mydir dirlink
Output:

ln: mydir: hard link not allowed for directory
Linux prevents this to avoid directory loops.

2. Cannot cross file systems
Suppose:

/home
and

/mnt
are different file systems.

This won't work:

ln /home/report.txt /mnt/report.txt
Reason:

An inode exists only within one file system.

Hard Link vs Soft Link
Feature	Hard Link	Soft Link
Points to	Same inode	File path
Inode number	Same	Different
Survives original deletion	✅ Yes	❌ No (becomes broken)
Cross filesystem	❌ No	✅ Yes
Link directories	❌ No	✅ Yes (with care)
Uses ln -s	❌ No	✅ Yes
Practical Demo
Create file:

echo "Hello" > file1
Create hard link:

ln file1 file2
Check inode:

ls -li
Output:

111111 file1
111111 file2
Append data:

echo "World" >> file2
Read original:

cat file1
Output:

Hello
World
Delete original:

rm file1
Read hard link:

cat file2
Output:

Hello
World
The data is still there.

Real-Time DevOps Use Cases
1. Log Rotation
Applications keep writing to the same inode even if one filename is removed. Understanding hard links helps explain why disk space isn't always freed until all references are gone.

2. Efficient Backups
Some backup tools create hard links for unchanged files between snapshots. This saves disk space because identical files share the same inode.

Example:

snapshot1/file.txt
snapshot2/file.txt
Both can point to the same inode if the file hasn't changed.

3. Package Management
Linux package managers may use hard links to avoid storing duplicate copies of identical files, reducing disk usage.

Interview Questions
Q1. What is a hard link?
A hard link is another filename that points to the same inode as an existing file.

Q2. Does deleting the original file delete the hard link?
No. The data remains accessible through any remaining hard links.

Q3. Can a hard link span different file systems?
No. Hard links work only within the same file system because inode numbers are unique only within a file system.

Q4. Can you create a hard link to a directory?
Generally no. Linux disallows this to prevent cycles in the directory structure.

Q5. How do you identify a hard link?
Use:

ls -li
If two filenames have the same inode number, they are hard links to the same file.

Memory Trick
Think of it this way:

Hard Link = Same House, Two Nameplates

Nameplate 1 ---> House
Nameplate 2 ---> Same House
Removing one nameplate doesn't remove the house.

Soft Link = Address Note

Sticky Note ---> "Go to House #25"
If House #25 is demolished, the sticky note still exists—but it points to nowhere (a broken symlink).

This analogy helps remember the biggest difference between hard and soft links.


sid@Siddeshs-Mac-mini july26 % rsync -avzP -i july26.pem july26 ec2-user@13.233.27.14:/home/ec2-user 
ec2-user@13.233.27.14: Permission denied (publickey,gssapi-keyex,gssapi-with-mic).
rsync(14703): error: unexpected end of file
rsync(14703): error: io_read_nonblocking
rsync(14703): error: io_read_buf
rsync(14703): error: io_read_int
rsync(14703): warning: child 14704 exited with status 255

The error is because rsync is trying to use password authentication instead of your PEM key.

You used:

rsync -avzP -i july26.pem july26 ec2-user@13.233.27.14:/home/ec2-user
The -i option does not belong to rsync. It belongs to SSH.

You need to tell rsync to use SSH with the PEM file.

Correct Command
rsync -avzP -e "ssh -i july26.pem" july26 ec2-user@13.233.27.14:/home/ec2-user/
Here:

-a → Archive mode

-v → Verbose

-z → Compress during transfer

-P → Show progress and allow resume

-e "ssh -i july26.pem" → Use SSH with the specified private key

Verify the PEM file permissions
AWS requires the private key to be readable only by you.

Run:

ls -l july26.pem
Expected:

-r-------- 1 sid staff ...
or

-rw------- 1 sid staff ...
If it's too open, fix it:

chmod 400 july26.pem
Test SSH First
Before using rsync, verify that SSH works:

ssh -i july26.pem ec2-user@13.233.27.14
If this fails with the same error:

Permission denied (publickey)
then the issue is not rsync. Check:

Are you using the correct PEM file?

Is ec2-user the correct username? (Amazon Linux uses ec2-user; Ubuntu uses ubuntu.)

Is the instance IP address correct?

Does the instance still have the matching public key installed?

Is port 22 open in the instance's security group and reachable?

Enable Debugging
To see exactly what's happening:

ssh -vvv -i july26.pem ec2-user@13.233.27.14
This will show whether the key is being offered and why authentication is failing.

Most likely issue
Your command should be:

rsync -avzP -e "ssh -i july26.pem" july26 ec2-user@13.233.27.14:/home/ec2-user/
If that still fails, please share the output of:

ssh -vvv -i july26.pem ec2-user@13.233.27.14
and also:

ls -l july26.pem
Those two outputs will pinpoint the cause.


sid@Siddeshs-Mac-mini july26 % rsync -avz --delete -e "ssh -i july26.pem" july26 ec2-user@13.233.27.14:/home/ec2-user 
Warning: Identity file july26.pem not accessible: No such file or directory.
ec2-user@13.233.27.14: Permission denied (publickey,gssapi-keyex,gssapi-with-mic).
rsync(14805): error: unexpected end of file
rsync(14805): error: io_read_nonblocking
rsync(14805): error: io_read_buf
rsync(14805): error: io_read_int
rsync(14805): warning: child 14806 exited with status 255
sid@Siddeshs-Mac-mini july26 % 

The key part of the error is:

Warning: Identity file july26.pem not accessible: No such file or directory.
This means SSH cannot find your july26.pem file. Because the key isn't found, SSH falls back to other authentication methods, which results in:

Permission denied (publickey)
Step 1: Check where the PEM file is
Run:

pwd
Then:

ls -l
Do you see july26.pem in the current directory?

Step 2: Find the PEM file
If not, locate it:

find ~ -name "july26.pem"
Example output:

/Users/sid/Downloads/july26.pem
Step 3: Use the full path
Instead of:

-e "ssh -i july26.pem"
use:

rsync -avz --delete \
-e "ssh -i /Users/sid/Downloads/july26.pem" \
july26 ec2-user@13.233.27.14:/home/ec2-user/
Replace the path with the one returned by find.

Step 4: Fix permissions
chmod 400 /Users/sid/Downloads/july26.pem
Step 5: Test SSH first
Before trying rsync, verify that SSH works:

ssh -i /Users/sid/Downloads/july26.pem ec2-user@13.233.27.14
If SSH succeeds, rsync will also work.

One more thing
Your current prompt is:

sid@Siddeshs-Mac-mini july26 %
This means you're inside a directory named july26.

If your key is outside this directory (for example, in ~/Downloads), then ssh -i july26.pem won't find it.

Please run these three commands and paste the output:
pwd
ls -l
find ~ -name "july26.pem"
With that output, I can tell you the exact rsync command to use.


[ec2-user@ip-172-31-37-179 ~]$ telnet 13.233.27.14 8080
-bash: telnet: command not foun

The error:

-bash: telnet: command not found
means the telnet package is not installed on your EC2 instance.

Option 1: Install telnet
Amazon Linux 2
sudo yum install -y telnet
Amazon Linux 2023
sudo dnf install -y telnet
RHEL/CentOS
sudo yum install -y telnet
Ubuntu
sudo apt update
sudo apt install -y telnet
Option 2: Use nc (Netcat) - Recommended
Most Linux administrators and DevOps engineers prefer nc over telnet.

Check if it's installed:

nc -zv 13.233.27.14 8080
Example output:

Connection to 13.233.27.14 8080 port [tcp/http-alt] succeeded!
or

Connection refused
or

Connection timed out
Option 3: Use Bash TCP (No installation required)
timeout 5 bash -c '</dev/tcp/13.233.27.14/8080' && echo "Port Open" || echo "Port Closed"
Option 4: Use curl (For HTTP/HTTPS)
If port 8080 is serving a web application:

curl http://13.233.27.14:8080
or

curl -I http://13.233.27.14:8080
DevOps Interview Tip
To test whether a port is reachable:

Command	Purpose
telnet <host> <port>	Check TCP connectivity (older method)
nc -zv <host> <port>	Recommended for TCP connectivity
curl http://host:port	Test HTTP/HTTPS services
ssh user@host	Test SSH connectivity (port 22 by default)
Please run:
cat /etc/os-release
This will tell us whether you're using Amazon Linux 2 or Amazon Linux 2023, so I can give you the exact installation command if telnet is still needed.



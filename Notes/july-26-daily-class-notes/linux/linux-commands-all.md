# linux commands all

## Linux Command Table with Real-Time Scenarios

| No. | Command                         | Description                                    | Real-Time Use Case                                                                          |
| --- | ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | `pwd`                           | Print current working directory                | Useful when you log into a remote machine and want to know your location in the file system |
| 2   | `ls`                            | List contents of a directory                   | To view files and folders in the current location                                           |
| 3   | `ls -l`                         | List contents with detailed info               | Check file permissions, size, and last modification time                                    |
| 4   | `ls -lt`                        | Sort files by modification time (newest first) | See the most recently modified files                                                        |
| 5   | `ls -lrt`                       | Sort files by modification time (oldest first) | See the oldest modified files at the top                                                    |
| 6   | `cd ..`                         | Move up one directory                          | Navigate up in the folder structure                                                         |
| 7   | `cd ../..`                      | Move up two directories                        | Quickly return to a higher-level directory                                                  |
| 8   | `cd /home/user/path`            | Change to a specific absolute path             | Navigate directly to a known location                                                       |
| 9   | `mkdir <directory_name>`        | Create a new directory                         | Create a folder to organize files                                                           |
| 10  | `mkdir dir1 dir2 dir3`          | Create multiple directories                    | Efficient for setting up initial folder structure                                           |
| 11  | `mkdir -p d3/dir1/dir2`         | Create nested directories                      | Avoid errors when creating directories deep in hierarchy                                    |
| 12  | `touch <file_name>`             | Create a new empty file                        | Used to quickly create a placeholder file                                                   |
| 13  | `touch f1 f2 f3`                | Create multiple empty files                    | Batch file creation for testing or setup                                                    |
| 14  | `touch directory_name/filename` | Create file in specific directory              | Prepare config or input files in target location                                            |
| 15  | `vi file_name`                  | Open a file in vi editor                       | Edit server-side files without GUI                                                          |
| 16  | `cat filename`                  | Display file content                           | Quick preview of log or config files                                                        |
| 17  | `more filename`                 | View file content page by page                 | Read long files in chunks without editing                                                   |
| 18  | `less filename`                 | View file with navigation support              | Read and search within files efficiently                                                    |
| 19  | `du -sh filename`               | Show file size in human-readable format        | Monitor space used by individual files                                                      |
| 20  | `du -sh <directory>`            | Show directory size                            | Identify heavy directories consuming disk space                                             |
| 21  | `du -sh *`                      | Show size of all items in directory            | Overview of space used by each item                                                         |
| 22  | `df -h`                         | Show disk usage in human-readable format       | Check available space on mounted partitions                                                 |
| 23  | `head filename`                 | Display first 10 lines of a file               | Preview top of logs or config files                                                         |
| 24  | `head -5 filename`              | Display first 5 lines of file                  | Focused inspection of small file segments                                                   |
| 25  | `tail filename`                 | Display last 10 lines of file                  | Check recent log entries                                                                    |
| 26  | `tail -3 filename`              | Show last 3 lines                              | Quickly view latest changes                                                                 |
| 28  | `head -6 filename \| tail -1`   | Show specific line in file                     | Show specific line in file                                                                  |
| 29  | `ls -ltr \| wc -l`              | Count number of files                          | Count number of files                                                                       |
| 30  | `grep -i "devops" file`         | Case-insensitive search                        | Find all mentions of 'DevOps' in a file                                                     |

#### ✅ Linux Commands Table (Entries 31–60)

| No. | Command                              | Description                                              | Real-Time Use Case                                       |
| --- | ------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------- |
| 31  | `grep -in "devops" file`             | Case-insensitive search with line numbers                | Quickly locate where “DevOps” appears in a config file   |
| 32  | `grep -ic "devops" file`             | Count case-insensitive matches                           | Know how many times “DevOps” appears                     |
| 33  | `grep -iw "devops" file`             | Match whole word (case-insensitive)                      | Avoid matching substrings like “devopsing”               |
| 34  | `grep -il "devops" *`                | List files that contain “DevOps”                         | Search across multiple files for relevant content        |
| 35  | `grep -ilR "devops" *`               | Recursively list files with “DevOps”                     | Find where a setting exists in nested config directories |
| 36  | `grep -ie "pattern1" -ie "pattern2"` | Search for multiple patterns                             | Search for multiple keywords in logs                     |
| 37  | `ls -a`                              | Show all files including hidden                          | View `.git`, `.bashrc`, etc.                             |
| 38  | `df -h .`                            | Disk space of current directory in human-readable format | Check available space before backups                     |
| 39  | `free -g` or `free -m`               | Check memory usage in GB or MB                           | Monitor memory usage on a server                         |
| 40  | `uniq file`                          | Remove duplicate lines                                   | Clean a sorted log or config file                        |

#### ✅ Linux Commands Table (Entries 61–90)

| No. | Command                     | Description                              | Real-Time Use Case                         |
| --- | --------------------------- | ---------------------------------------- | ------------------------------------------ |
| 61  | `sort file \| uniq`         | Sort and remove duplicates               | Sort and remove duplicates                 |
| 62  | `sort -r file \| uniq`      | Reverse sort and remove duplicates       | Reverse sort and remove duplicates         |
| 63  | `chmod 777 filename`        | Give all permissions to everyone         | For testing access (not secure in prod)    |
| 64  | `chmod 777 directory`       | Same as above for a directory            | Grant temp access to all users             |
| 65  | `chmod 644 file1`           | Owner can write, others read             | Default permission for config files        |
| 66  | `chmod 755 file1`           | Owner all, others read/execute           | For scripts or binaries                    |
| 67  | `chmod -R 777 folder1`      | Recursive permission change              | Fix access issues in nested folders        |
| 68  | `chmod a+w file`            | Give write permission to all             | Allow multi-user write access              |
| 69  | `chmod a+rwx folder`        | Full access to everyone                  | Temporary full access for troubleshooting  |
| 70  | `chmod u+rw file`           | Add read/write to user                   | Allow owner to edit                        |
| 71  | `chmod g+w directory`       | Group write permission                   | Shared team folder access                  |
| 72  | `chmod o+r file`            | Others read access                       | Share logs with read-only access           |
| 73  | `umask 641`                 | Default file permissions mask            | Control default permissions for security   |
| 74  | `umask 777`                 | No permissions by default                | Testing how apps behave on no access       |
| 75  | `umask 000`                 | Full permissions by default              | Used in insecure/dev environments          |
| 76  | `rm filename`               | Remove file                              | Delete temporary or unused files           |
| 77  | `rm -rf directory`          | Force delete directory recursively       | Clean up unneeded directory trees          |
| 78  | `rm f1 f2 f3`               | Delete multiple files                    | Bulk deletion of test files                |
| 79  | `rm -rf folder1 folder2`    | Delete multiple directories              | Clean multiple old backups                 |
| 80  | `rm dir/dir1/file`          | Delete specific file in path             | Remove wrong files placed in nested paths  |
| 81  | `rm -rf /dir1/dir2/dir3`    | Deep folder deletion                     | Remove obsolete build or cache directories |
| 82  | `mv old_name new_name`      | Rename a file or directory               | Rename configs or scripts                  |
| 83  | `mv file dir1/file`         | Move file to directory                   | Organize files into folders                |
| 84  | `mv dir2/f1 .`              | Move file to current directory           | Pull a file out from nested folder         |
| 85  | `cp file file2`             | Copy file to new file                    | Create a backup or duplicate               |
| 86  | `cp file dir1/dir2/file`    | Copy to nested path                      | Deploy config to target folder             |
| 87  | `cp -i file file2`          | Interactive copy (asks before overwrite) | Avoid accidental overwrites                |
| 88  | `cp -i test dir1/test`      | Interactive copy to directory            | Safe file deployment                       |
| 89  | `cp -r dir2 dir3`           | Copy folder recursively                  | Backup or duplicate folder                 |
| 90  | `cp -r dir1 dir2/dir3/dir4` | Deep folder copy                         | Create structured backup copies            |

#### ✅ Linux Commands Table (Entries 91–120)

| No. | Command                             | Description                                | Real-Time Use Case                        |
| --- | ----------------------------------- | ------------------------------------------ | ----------------------------------------- |
| 91  | `cp -i dir1/file dir2/dir3/dir4/`   | Interactive file copy to deep path         | Controlled deployment of config or script |
| 92  | `ls Devops*`                        | List files starting with “Devops”          | View all DevOps-related files             |
| 93  | `ls test*`                          | List files starting with “test”            | List test files before deletion           |
| 94  | `ls *`                              | List all files in current directory        | Check full directory contents             |
| 95  | `grep -i "^Devops" file`            | Find lines starting with “Devops”          | Identify log or config entries            |
| 96  | `grep -i "^t" file`                 | Find lines starting with “t”               | Useful in parsing data                    |
| 97  | `grep -i "dev$" file`               | Find lines ending with “dev”               | Validate naming conventions               |
| 98  | `chown new_name file`               | Change file ownership                      | Assign correct owner to logs/scripts      |
| 99  | `chown new_name:new_grp file`       | Change owner and group                     | Fix ownership issues in shared dirs       |
| 100 | `sed`                               | Stream editor for filtering/modifying text | Used in log parsing or automation         |
| 101 | `sed 's/old/new/g' file`            | Replace all old with new in file           | Update variables in config files          |
| 102 | `sed 's/samsung/sony/g' file`       | Replace brand names                        | Product migration in data                 |
| 103 | `sed -i 's/old/new/g' file`         | In-place replacement                       | Auto-update multiple config files         |
| 104 | `sed 's/text/replacement/gi'`       | Case-insensitive global replace            | Change all variants of a keyword          |
| 105 | `sed '2s/text/new/gi'`              | Replace on specific line                   | Fix specific line in script or config     |
| 106 | `sed '10,30s/a/b/g'`                | Replace in line range                      | Modify a specific block in a file         |
| 107 | `sed '30,$s/a/b/g'`                 | Replace from line 30 to end                | Useful in appending or tail-end configs   |
| 108 | `sed -n '98p' file`                 | Print only line 98                         | Extract specific config or log line       |
| 109 | `sed -n '2p' file`                  | Print only second line                     | Verify headers in CSV/TSV                 |
| 110 | `sed -n '10,20p' file`              | Print line range                           | Extract partial config                    |
| 111 | `sed '2d' file`                     | Delete second line                         | Remove unwanted config header             |
| 112 | `sed '100d' file`                   | Delete line 100                            | Remove old cronjob/script                 |
| 113 | `cut -d " " -f1 file`               | Cut first column by space                  | Extract usernames or IDs                  |
| 114 | `cut -d " " -f3 file`               | Extract third column                       | Pull email/port/date etc. from logs       |
| 115 | `cut -d " " -f1,2 file`             | Extract multiple fields                    | Combine name + ID, etc.                   |
| 116 | `awk -F " " '{print $2}' file`      | Print second field                         | Filter by column like CPU usage           |
| 117 | `awk -F " " '{print $3}' file`      | Print third field                          | Extract IP, status, values                |
| 118 | `awk -F " " '{print $NF}' file`     | Print last field                           | Get final status in logs                  |
| 119 | `awk -F " " '{print $(NF-1)}' file` | Print second-last field                    | Pull second-last value from log           |
| 120 | `awk -F " " '{print $1,$3}' file`   | Print selected fields                      | Custom field combination for analysis     |

#### ✅ Linux Commands Table (Entries 121–150)

| No. | Command                                  | Description                                | Real-Time Use Case                            |
| --- | ---------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| 121 | `ps -ef`                                 | Show all running processes                 | Monitor system activity                       |
| 122 | `ps -ef \| grep -i "service"`            | Find specific process                      | Find specific process                         |
| 123 | `ps -ef \| grep -ie "p1" -ie "p2"`       | Search for multiple processes              | Search for multiple processes                 |
| 124 | `kill -9 <pid>`                          | Forcefully kill a process                  | Stop a hung or runaway process                |
| 125 | `service <name> stop`                    | Stop a service                             | Stop Apache, MySQL, etc.                      |
| 126 | `service <name> start`                   | Start a service                            | Start server processes                        |
| 127 | `service <name> restart`                 | Restart a service                          | Apply config changes with restart             |
| 128 | `ps -u username`                         | Show processes by user                     | Monitor specific user activity                |
| 129 | `ps -u ubuntu`                           | Same as above for ubuntu user              | Check default user usage                      |
| 130 | `adduser username`                       | Add a new user                             | Create new system accounts                    |
| 131 | `find . -iname "test"`                   | Case-insensitive search for file/dir       | Locate files regardless of case               |
| 132 | `find . -iname "dir"`                    | Search for directories by name             | Locate folders in dev environments            |
| 133 | `find /path -iname "dir2"`               | Search absolute path                       | Find folder in entire workspace               |
| 134 | `find . -type f -iname "test"`           | Search only files by name                  | Filter only files, not directories            |
| 135 | `find . -type d -iname "test"`           | Search only directories                    | Used in organizing/migrating projects         |
| 136 | `find . -type f -mtime -10`              | Files modified in last 10 days             | Check for recent updates                      |
| 137 | `find . -type d -mtime -10`              | Directories modified recently              | Detect recent deployments                     |
| 138 | `find . -type d -mtime +5`               | Directories older than 5 days              | Archive old logs or backups                   |
| 139 | `find . -type f -mtime +20`              | Files older than 20 days                   | Identify cleanup candidates                   |
| 140 | `find . -type f -mmin -5`                | Files modified in last 5 mins              | Spot real-time log or file updates            |
| 141 | `find . -type d -mmin -15`               | Recent directory changes                   | Track deployments                             |
| 142 | `find . -type f -mmin -15`               | Recent file changes                        | Audit fresh activity in logs                  |
| 143 | `find . -type f -perm 777`               | World-writable files                       | Find insecure files                           |
| 144 | `find . -type d -perm 644`               | Directories with wrong perms               | Detect permission issues                      |
| 145 | `find . -perm 755`                       | Standard permission check                  | Audit executable paths                        |
| 146 | `find . -type f -empty`                  | Empty files                                | Identify unused config/test files             |
| 147 | `find . -type f -not -empty`             | Non-empty files                            | Locate real/active files                      |
| 148 | `xargs`                                  | Build and execute command lines from input | Used with `find` to delete/search efficiently |
| 149 | `find . -type f -mtime +2 \| xargs rm`   | Delete files older than 2 days             | Delete files older than 2 days                |
| 150 | `find . -type f -mtime +365 \| xargs rm` | Delete files older than 1 year             | Delete files older than 1 year                |

#### ✅ Linux Commands (151–174)

| No. | Command                                    | Description                                   | Real-Time Use Case                                |
| --- | ------------------------------------------ | --------------------------------------------- | ------------------------------------------------- |
| 151 | `find . -type f -iname "test" -maxdepth 1` | Find matching files in current directory only | Avoid deep search and improve speed               |
| 152 | `find . -type d -iname "test" -maxdepth 2` | Find matching directories with limited depth  | Used in controlled structure searches             |
| 153 | `find . -iname "test" -maxdepth 1`         | Find files or dirs by name in current level   | Quick validation of naming convention             |
| 154 | `ln -s test1 softlink`                     | Create symbolic (soft) link                   | Shortcut to config/log/scripts                    |
| 155 | `ln -s /home/test/test1 softlink`          | Softlink to absolute path                     | Share file across directories                     |
| 156 | `ln /home/test/test1 hardlink`             | Create hard link                              | Duplicate a file with shared inode                |
| 157 | `uname -a`                                 | Show kernel and OS info                       | Check system version and architecture             |
| 158 | `cat /etc/os-release`                      | Show OS release info                          | Confirm Linux distribution (Ubuntu, CentOS, etc.) |
| 159 | `hostname`                                 | Display system hostname                       | Check system identity                             |
| 160 | `who \| wc -l`                             | Count logged-in users                         | Count logged-in users                             |
| 161 | `whoami`                                   | Show current user                             | Identify running user context                     |
| 162 | `nohup ./script.sh &`                      | Run script in background with no hangup       | Keep processes running after logout               |
| 163 | `top`                                      | Display running processes dynamically         | Real-time monitoring of CPU/memory usage          |
| 164 | `ssh username@server`                      | Connect to remote server via SSH              | Administer or deploy on remote Linux server       |
| 165 | `ssh -i demo.pem user@server`              | Connect to EC2 using key pair                 | Login securely to AWS instance                    |
| 166 | `ssh -i demo.pem ubuntu@<ip>`              | SSH login with Ubuntu user                    | Standard AWS EC2 login for Ubuntu                 |
| 167 | `scp file user@server:/tmp`                | Copy file to remote server                    | Transfer logs/configs                             |
| 168 | `scp file user@server:/home/ubuntu`        | Copy file to user's home directory            | Deploy scripts                                    |
| 169 | `scp -r dir user@server:/path`             | Recursively copy directory                    | Full folder backup or deployment                  |
| 170 | `rsync file user@server:/path`             | Efficient file synchronization                | Backup with delta transfer                        |
| 171 | `ping google.com`                          | Check connectivity                            | Test internet or DNS resolution                   |
| 172 | `ping IP_ADDRESS`                          | Ping by IP                                    | Check server or service status                    |
| 173 | `telnet IP` or `telnet hostname`           | Test TCP connection to a host                 | Validate port access/firewall                     |
| 174 | `netstat -na \| grep 8080`                 | Check if port 8080 is listening               | Check if port 8080 is listening                   |

window.interviewData = window.interviewData || {};

window.interviewData["Shell Scripting"] = {
  "Basic": [
    { 
      q: "What is the shebang line and why is it used?", 
      a: "<strong>Detailed Solution:</strong> The shebang (<code>#!/bin/bash</code>) is the very first line of a script.<br><ul><li><strong>Function:</strong> It tells the operating system which interpreter should be used to parse and execute the rest of the file.</li><li><strong>Importance:</strong> Without it, the system might default to `sh` instead of `bash`, which could cause syntax errors if you are using bash-specific features (like arrays).</li></ul>" 
    },
    { 
      q: "How do you pass arguments to a script?", 
      a: "<strong>Detailed Solution:</strong> Arguments are accessed using positional parameters.<br><ul><li><strong>$1, $2, $3:</strong> Represent the first, second, and third arguments respectively.</li><li><strong>$0:</strong> Represents the name of the script itself.</li><li><strong>$@:</strong> Represents all arguments passed as separate strings.</li><li><strong>Example:</strong> If you run <code>./script.sh hello world</code>, <code>$1</code> is 'hello' and <code>$2</code> is 'world'.</li></ul>" 
    },
    { 
      q: "What is the difference between single and double quotes?", 
      a: "<strong>Detailed Solution:</strong> Quotes define how the shell interprets special characters.<br><ul><li><strong>Single Quotes (''):</strong> Treat every character literally. Variables like `$USER` will not be evaluated; they will print exactly as '$USER'.</li><li><strong>Double Quotes (\"\"):</strong> Allow substitution of variables and command execution (using backticks or `$()`). For example, <code>echo \"$USER\"</code> will print 'root' or 'sid'.</li></ul>" 
    },
    { 
      q: "How do you check the exit status of a command?", 
      a: "<strong>Detailed Solution:</strong> You check the special variable <code>$?</code>.<br><ul><li><strong>0 (Zero):</strong> Means the command was successful.</li><li><strong>Non-Zero (1-255):</strong> Indicates an error occurred. Different numbers often correspond to different specific errors depending on the command.</li><li><strong>Usage:</strong> Often used in if statements: <code>if [ $? -ne 0 ]; then echo 'Failed'; fi</code>.</li></ul>" 
    },
    { 
      q: "How do you redirect standard output and standard error to a file?", 
      a: "<strong>Detailed Solution:</strong> File descriptors are used for redirection: 1 is stdout, 2 is stderr.<br><ul><li><strong>Redirect both:</strong> Use <code>> file.txt 2>&1</code>. This redirects stdout to file.txt, and then redirects stderr (2) to wherever stdout (1) is going.</li><li><strong>Shorthand (Bash):</strong> You can simply use <code>&> file.txt</code> to achieve the same result cleanly.</li></ul>" 
    },
    { 
      q: "What does the 'chmod +x' command do?", 
      a: "<strong>Detailed Solution:</strong> It alters file permissions.<br><ul><li><strong>Meaning:</strong> 'chmod' stands for change mode. '+x' adds the eXecutable permission for all users (owner, group, others).</li><li><strong>Why it's needed:</strong> By default, a newly created text file containing a script cannot be run as a program. You must make it executable first.</li></ul>" 
    },
    { 
      q: "How do you debug a shell script?", 
      a: "<strong>Detailed Solution:</strong> Shells provide built-in debugging traces.<br><ul><li><strong>Command Line:</strong> Run the script with <code>bash -x script.sh</code>.</li><li><strong>Inside the Script:</strong> Add <code>set -x</code> at the point where you want debugging to start, and <code>set +x</code> where you want it to stop. This prints every command and its expanded arguments to the terminal before it runs.</li></ul>" 
    },
    { 
      q: "Explain the difference between $# and $*.", 
      a: "<strong>Detailed Solution:</strong> Both deal with script arguments but serve different purposes.<br><ul><li><strong>$#:</strong> Returns the total <em>number</em> (count) of arguments passed. Useful for validating input (e.g., ensuring exactly 2 arguments were provided).</li><li><strong>$*:</strong> Returns a single concatenated string of all arguments, separated by the first character of the IFS variable (usually a space).</li></ul>" 
    },
    { 
      q: "How do you read user input in a script?", 
      a: "<strong>Detailed Solution:</strong> The <code>read</code> command pauses execution and waits for keyboard input.<br><ul><li><strong>Syntax:</strong> <code>read -p 'Enter your name: ' name</code>.</li><li><strong>Breakdown:</strong> The <code>-p</code> flag allows you to provide a prompt directly without needing a separate <code>echo</code> command. The input is then stored in the variable <code>name</code>.</li></ul>" 
    },
    { 
      q: "What is a cron job?", 
      a: "<strong>Detailed Solution:</strong> Cron is a time-based job scheduler in Unix-like operating systems.<br><ul><li><strong>Function:</strong> It allows users to schedule scripts or commands to run automatically at specific times, dates, or intervals.</li><li><strong>Configuration:</strong> Managed via the <code>crontab -e</code> command. The syntax contains 5 time fields (minute, hour, day of month, month, day of week) followed by the command to execute.</li></ul>" 
    }
  ],
  "Scenario Based": [
    { 
      q: "Scenario: You need a script to delete all log files older than 30 days. How do you do it?", 
      a: "<strong>Detailed Solution:</strong> Use the <code>find</code> command, as it is the most robust tool for file searching and execution.<br><ul><li><strong>Command:</strong> <code>find /var/log -name '*.log' -type f -mtime +30 -exec rm -f {} \\;</code></li><li><strong>Breakdown:</strong> <code>-name '*.log'</code> filters by extension. <code>-type f</code> ensures we only match files (not directories). <code>-mtime +30</code> looks for files modified more than 30 days ago. <code>-exec rm -f {} \\;</code> takes each matching file (represented by <code>{}</code>) and forcefully deletes it.</li></ul>" 
    },
    { 
      q: "Scenario: A process is consuming too much CPU. Write a command to find the top 3 CPU consuming PIDs.", 
      a: "<strong>Detailed Solution:</strong> You can combine <code>ps</code> with sorting capabilities.<br><ul><li><strong>Command:</strong> <code>ps -eo pid,pcpu,cmd --sort=-pcpu | head -n 4</code></li><li><strong>Breakdown:</strong> <code>-e</code> selects all processes. <code>-o pid,pcpu,cmd</code> specifies exact columns to output. <code>--sort=-pcpu</code> sorts descending by CPU usage. <code>head -n 4</code> grabs the top 3 results plus the header row.</li></ul>" 
    },
    { 
      q: "Scenario: You need to check if a specific website is returning a 200 OK status. How do you script this?", 
      a: "<strong>Detailed Solution:</strong> Use the <code>curl</code> command designed to extract the HTTP status code.<br><ul><li><strong>Command:</strong> <code>status=$(curl -s -o /dev/null -w '%{http_code}' http://example.com); if [ $status -eq 200 ]; then echo 'OK'; fi</code></li><li><strong>Breakdown:</strong> <code>-s</code> runs silent. <code>-o /dev/null</code> discards the HTML body. <code>-w '%{http_code}'</code> outputs only the numeric status code. We capture this into <code>$status</code> and compare it.</li></ul>" 
    },
    { 
      q: "Scenario: Your script fails silently on errors. How do you ensure it stops immediately if any command fails?", 
      a: "<strong>Detailed Solution:</strong> Change the default bash behavior using the <code>set</code> command.<br><ul><li><strong>Solution:</strong> Add <code>set -e</code> at the top of your script.</li><li><strong>Explanation:</strong> This causes the shell to exit immediately if any simple command returns a non-zero exit code. For robust scripts, use <code>set -euo pipefail</code> to also catch unbound variables and pipeline failures.</li></ul>" 
    },
    { 
      q: "Scenario: A server is running out of disk space. Write a command to find the top 5 largest directories in /var.", 
      a: "<strong>Detailed Solution:</strong> Combine disk usage (<code>du</code>) with sorting.<br><ul><li><strong>Command:</strong> <code>du -sh /var/* 2>/dev/null | sort -hr | head -n 5</code></li><li><strong>Breakdown:</strong> <code>du -sh</code> calculates summary size (<code>-s</code>) in human-readable format (<code>-h</code>). <code>2>/dev/null</code> hides permission errors. <code>sort -hr</code> sorts human-readable numbers in reverse. <code>head</code> grabs the top 5.</li></ul>" 
    },
    { 
      q: "Scenario: You need to extract the 3rd column from a CSV file. What tool do you use?", 
      a: "<strong>Detailed Solution:</strong> Use <code>awk</code> or <code>cut</code>.<br><ul><li><strong>Command (Awk):</strong> <code>awk -F',' '{print $3}' file.csv</code>. The <code>-F','</code> sets the field separator to a comma.</li><li><strong>Command (Cut):</strong> <code>cut -d',' -f3 file.csv</code>. <code>-d</code> sets the delimiter, <code>-f</code> specifies the field number. Awk is generally more robust for complex parsing.</li></ul>" 
    },
    { 
      q: "Scenario: You want to ensure your script only runs as the root user. How do you enforce this?", 
      a: "<strong>Detailed Solution:</strong> Check the User ID (UID) of the person executing the script.<br><ul><li><strong>Code:</strong> <code>if [ \"$(id -u)\" -ne 0 ]; then echo 'Must run as root'; exit 1; fi</code></li><li><strong>Explanation:</strong> The <code>id -u</code> command outputs 0 for the root user. If it does not equal (<code>-ne</code>) 0, the script prints an error and safely exits.</li></ul>" 
    },
    { 
      q: "Scenario: Your script needs to loop through all .txt files and rename them to .bak.", 
      a: "<strong>Detailed Solution:</strong> Use a bash <code>for</code> loop with parameter expansion.<br><ul><li><strong>Command:</strong> <code>for f in *.txt; do mv \"$f\" \"${f%.txt}.bak\"; done</code></li><li><strong>Explanation:</strong> The loop iterates over all `.txt` files. The syntax <code>${f%.txt}</code> strips the '.txt' extension from the end of the variable before appending '.bak', allowing safe renaming even with spaces in filenames.</li></ul>" 
    },
    { 
      q: "Scenario: Find a specific string 'ERROR' in thousands of logs and count occurrences per file.", 
      a: "<strong>Detailed Solution:</strong> Use <code>grep</code> with the count flag.<br><ul><li><strong>Command:</strong> <code>grep -c 'ERROR' /path/to/logs/*.log</code></li><li><strong>Explanation:</strong> The <code>-c</code> flag tells grep not to print the matching lines, but instead just print the filename followed by the number of times the word 'ERROR' appeared in that file.</li></ul>" 
    },
    { 
      q: "Scenario: You need to parse a JSON file in a bash script to get a specific value.", 
      a: "<strong>Detailed Solution:</strong> Do not use grep or sed for JSON; use <code>jq</code>, a command-line JSON processor.<br><ul><li><strong>Command:</strong> <code>cat config.json | jq -r '.database.password'</code></li><li><strong>Explanation:</strong> `jq` safely parses the JSON tree. The <code>-r</code> flag outputs raw text instead of a JSON string with quotes, which is perfect for assigning to bash variables.</li></ul>" 
    },
    { 
      q: "Scenario: Archive a directory and compress it.", 
      a: "<strong>Detailed Solution:</strong> Use the <code>tar</code> command.<br><ul><li><strong>Command:</strong> <code>tar -czvf backup.tar.gz /path/to/folder</code></li><li><strong>Breakdown:</strong> <code>c</code> creates a new archive. <code>z</code> compresses it with gzip. <code>v</code> makes it verbose (lists files being processed). <code>f</code> specifies the output filename.</li></ul>" 
    },
    { 
      q: "Scenario: Find files modified in the exact last 24 hours.", 
      a: "<strong>Detailed Solution:</strong> Use <code>find</code> with the modification time flag.<br><ul><li><strong>Command:</strong> <code>find . -type f -mtime 0</code></li><li><strong>Explanation:</strong> The <code>-mtime</code> flag operates in 24-hour periods. A value of <code>0</code> means \"less than 1 * 24 hours ago\". A value of <code>1</code> would mean between 24 and 48 hours ago.</li></ul>" 
    },
    { 
      q: "Scenario: Kill a process knowing only its name, not its PID.", 
      a: "<strong>Detailed Solution:</strong> Use <code>pkill</code> or <code>killall</code>.<br><ul><li><strong>Command:</strong> <code>pkill -f 'java -jar myapp.jar'</code></li><li><strong>Explanation:</strong> The <code>-f</code> flag tells pkill to match against the full command line arguments, not just the process name. This is crucial for killing specific Java or Python scripts.</li></ul>" 
    },
    { 
      q: "Scenario: Check if a directory exists, and if not, create it.", 
      a: "<strong>Detailed Solution:</strong> Use a conditional if statement.<br><ul><li><strong>Code:</strong> <code>if [ ! -d \"/my/dir\" ]; then mkdir -p \"/my/dir\"; fi</code></li><li><strong>Explanation:</strong> <code>-d</code> checks if it is a directory. <code>!</code> negates it. <code>mkdir -p</code> creates it along with any missing parent directories without throwing errors.</li></ul>" 
    },
    { 
      q: "Scenario: Read a file line by line safely.", 
      a: "<strong>Detailed Solution:</strong> Use a while loop with the read command.<br><ul><li><strong>Code:</strong> <code>while IFS= read -r line; do echo \"$line\"; done < file.txt</code></li><li><strong>Explanation:</strong> <code>IFS=</code> prevents leading/trailing whitespace from being trimmed. <code>-r</code> prevents backslashes from being interpreted as escape characters. <code>< file.txt</code> feeds the file into the loop.</li></ul>" 
    },
    { 
      q: "Scenario: Replace a string inside a file permanently.", 
      a: "<strong>Detailed Solution:</strong> Use <code>sed</code> (stream editor).<br><ul><li><strong>Command:</strong> <code>sed -i 's/old_text/new_text/g' config.txt</code></li><li><strong>Explanation:</strong> <code>-i</code> modifies the file in-place. <code>s</code> stands for substitute. <code>g</code> applies the replacement globally across every line, not just the first match per line.</li></ul>" 
    },
    { 
      q: "Scenario: Check disk space and send an alert if above 90%.", 
      a: "<strong>Detailed Solution:</strong> Extract the usage percentage using `df` and `awk`.<br><ul><li><strong>Command:</strong> <code>usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//'); if [ $usage -gt 90 ]; then echo 'Alert!'; fi</code></li><li><strong>Explanation:</strong> <code>NR==2</code> grabs the second line of df output. We print the 5th column (usage %), strip the '%' sign using sed, and do a numeric comparison (<code>-gt</code>).</li></ul>" 
    },
    { 
      q: "Scenario: Find all completely empty files in a directory and delete them.", 
      a: "<strong>Detailed Solution:</strong> Use <code>find</code>.<br><ul><li><strong>Command:</strong> <code>find /path -type f -empty -delete</code></li><li><strong>Explanation:</strong> <code>-empty</code> perfectly identifies files with 0 bytes. <code>-delete</code> is a built-in highly efficient action that removes them without spawning external <code>rm</code> processes.</li></ul>" 
    },
    { 
      q: "Scenario: Generate a random 16-character password in bash.", 
      a: "<strong>Detailed Solution:</strong> Read from /dev/urandom or use openssl.<br><ul><li><strong>Command (OpenSSL):</strong> <code>openssl rand -base64 12</code> (Generates 16 chars).</li><li><strong>Command (urandom):</strong> <code>cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$' | fold -w 16 | head -n 1</code>. This filters raw random bytes into alphanumeric characters and cuts it at 16.</li></ul>" 
    },
    { 
      q: "Scenario: Monitor a log file that is actively being written to in real-time.", 
      a: "<strong>Detailed Solution:</strong> Use <code>tail</code>.<br><ul><li><strong>Command:</strong> <code>tail -f /var/log/syslog</code></li><li><strong>Explanation:</strong> The <code>-f</code> (follow) flag outputs the last 10 lines, but keeps the file descriptor open, printing any new lines to the console the instant they are written to the file by other processes.</li></ul>" 
    }
  ],
  "Advance Scenario": [
    { 
      q: "Scenario: You need to parallelize a bash loop to speed up processing of 1000 files.", 
      a: "<strong>Detailed Solution:</strong> Standard loops process sequentially. Use <code>xargs</code> or <code>parallel</code>.<br><ul><li><strong>Command:</strong> <code>find . -name '*.txt' | xargs -n 1 -P 4 ./process_file.sh</code></li><li><strong>Explanation:</strong> This feeds files to <code>process_file.sh</code>. The <code>-P 4</code> flag ensures that exactly 4 instances of the script run concurrently. If you just background tasks using <code>&</code>, you might spawn 1000 processes and crash the machine.</li></ul>" 
    },
    { 
      q: "Scenario: Your script creates temporary files that must be cleaned up even if the script crashes or is killed (Ctrl+C).", 
      a: "<strong>Detailed Solution:</strong> Intercept system signals using <code>trap</code>.<br><ul><li><strong>Code:</strong> <code>cleanup() { rm -rf /tmp/tempdir; }; trap cleanup EXIT INT TERM</code></li><li><strong>Explanation:</strong> <code>EXIT</code> fires on normal exit. <code>INT</code> fires on Ctrl+C. <code>TERM</code> fires on kill signals. No matter how the script dies, the OS will pause, execute the <code>cleanup</code> function, and then exit.</li></ul>" 
    },
    { 
      q: "Scenario: Implement a lock mechanism to prevent two instances of your script from running concurrently.", 
      a: "<strong>Detailed Solution:</strong> Use file descriptors and <code>flock</code>.<br><ul><li><strong>Code:</strong> <code>exec 200>/var/lock/myscript.lock; flock -n 200 || exit 1</code></li><li><strong>Explanation:</strong> This opens a file descriptor (200) pointing to a lock file. <code>flock -n</code> attempts to acquire an exclusive non-blocking lock. If another instance already holds it, the command fails and exits immediately.</li></ul>" 
    },
    { 
      q: "Scenario: You need to safely parse complex arguments with both short and long options (e.g., -h, --help).", 
      a: "<strong>Detailed Solution:</strong> Use the <code>getopt</code> utility (not the shell builtin getopts, which lacks long options).<br><ul><li><strong>Process:</strong> Pass <code>$@</code> into <code>getopt</code>, defining expected short and long flags. Then use the <code>eval set --</code> command to safely inject the parsed arguments back into positional parameters, allowing you to use a clean <code>case</code> statement in a <code>while</code> loop.</li></ul>" 
    },
    { 
      q: "Scenario: You are writing a daemon script that must run entirely detached from the terminal.", 
      a: "<strong>Detailed Solution:</strong> You must decouple the process from the TTY session.<br><ul><li><strong>Command:</strong> <code>nohup ./daemon.sh > output.log 2>&1 &</code></li><li><strong>Explanation:</strong> <code>nohup</code> instructs the program to ignore SIGHUP (hangup) signals sent when the terminal is closed. <code>&</code> puts it in the background. Redirecting both stdout and stderr ensures the process doesn't block waiting for console I/O.</li></ul>" 
    },
    { 
      q: "Scenario: Sync files between two servers securely, only copying changed files.", 
      a: "<strong>Detailed Solution:</strong> Use <code>rsync</code> over SSH.<br><ul><li><strong>Command:</strong> <code>rsync -avz -e ssh /local/dir/ user@remote:/remote/dir/</code></li><li><strong>Explanation:</strong> <code>-a</code> (archive) preserves permissions and timestamps. <code>-v</code> is verbose. <code>-z</code> compresses data during transport. <code>-e ssh</code> ensures it travels securely over port 22. It automatically skips files that haven't changed.</li></ul>" 
    },
    { 
      q: "Scenario: Capture standard output to a variable, but still print it live to the screen.", 
      a: "<strong>Detailed Solution:</strong> Use the <code>tee</code> command alongside process substitution.<br><ul><li><strong>Code:</strong> <code>output=$(ls -l | tee /dev/tty)</code></li><li><strong>Explanation:</strong> Normally <code>output=$(ls)</code> hides the output. By piping through <code>tee /dev/tty</code>, it splits the stream: one stream goes into the variable, the other goes directly to the active terminal screen.</li></ul>" 
    },
    { 
      q: "Scenario: Calculate the sum of a column of numbers from a text file.", 
      a: "<strong>Detailed Solution:</strong> Use <code>awk</code> for mathematical processing.<br><ul><li><strong>Command:</strong> <code>awk '{sum += $1} END {print sum}' numbers.txt</code></li><li><strong>Explanation:</strong> Awk processes line by line. <code>sum += $1</code> adds the value of the first column to the variable 'sum'. The <code>END</code> block executes after all lines are read, printing the final total.</li></ul>" 
    },
    { 
      q: "Scenario: Automate an interactive CLI tool that asks for 'yes' or 'no' prompts.", 
      a: "<strong>Detailed Solution:</strong> You can use `yes` or `expect`.<br><ul><li><strong>Simple:</strong> <code>yes | apt-get install package</code> continuously sends 'y'.</li><li><strong>Complex:</strong> Write an <code>expect</code> script. It uses <code>spawn</code> to start the CLI tool, <code>expect</code> to wait for a specific text string (like 'Password:'), and <code>send</code> to automatically supply the required input.</li></ul>" 
    },
    { 
      q: "Scenario: Ensure a variable is defined and exit with an error if it is missing.", 
      a: "<strong>Detailed Solution:</strong> Use Bash parameter expansion for default values/errors.<br><ul><li><strong>Code:</strong> <code>: ${API_KEY:?\"Error: API_KEY must be set.\"}</code></li><li><strong>Explanation:</strong> The <code>:?</code> operator checks if the variable is set and not null. If it is missing, it automatically prints the provided error message and exits the script with status 1.</li></ul>" 
    }
  ]
};

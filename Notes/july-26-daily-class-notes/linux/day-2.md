# day 2

## Vi/Vim Editor Commands

### 16. `:/pattern`

**Purpose**: Search for a pattern in the current file within Vim editor.\
**Usage**: `/pattern` searches forward from the current cursor position for the first occurrence of "pattern".\
**Example**: `:/devops` will find the first occurrence of "devops" in the file.

**Navigation**:

* Press `n` to go to the next occurrence
* Press `N` to go to the previous occurrence

### 17. `:%s/Testing/development/g`

**Purpose**: Replace all occurrences of "Testing" with "development" across the entire file.\
**Breakdown**:

* `%` = Apply to all lines in the file
* `s` = Substitute command
* `/Testing/` = Find pattern
* `/development/` = Replace pattern
* `g` = Global flag (replace all occurrences on each line)

**Example**: If file has `Testing is important. Testing is critical.` it becomes `development is important. development is critical.`

### 18. `:1 s/Testing/dev/g`

**Purpose**: Replace all occurrences of "Testing" with "dev" on line 1 only.\
**Breakdown**:

* `:1` = Target line 1
* `s/Testing/dev/` = Substitute command
* `g` = Replace all occurrences on that line

**Example**: On line 1, `Testing Testing code` becomes `dev dev code`

### 19. `:5,$ s/Testing/dev/g`

**Purpose**: Replace all occurrences of "Testing" with "dev" from line 5 to the end of the file.\
**Breakdown**:

* `:5,$` = Line 5 to end of file (`$` represents last line)
* `s/Testing/dev/` = Substitute command
* `g` = Replace all occurrences on each line in the range

**Example**: All lines from 5 onwards have "Testing" replaced with "dev"

### 20. `1,5 s/Testing/dev/g`

**Purpose**: Replace all occurrences of "Testing" with "dev" from line 1 to line 5.\
**Breakdown**:

* `1,5` = Lines 1 through 5
* `s/Testing/dev/` = Substitute command
* `g` = Replace all occurrences on each line

**Example**: Only the first 5 lines are affected by the replacement

## Directory and File Creation

### 21. `mkdir -p dir1/dir2/dir3/Users/apple/Documents/Devops/Ref class Notes/linux Devops-class-13-May-2022.txt`

**Purpose**: Create a nested directory structure, creating parent directories as needed.\
**Note**: The `.txt` file is actually part of the directory path (not a file).\
**Breakdown**:

* `mkdir` = Make directory command
* `-p` = Parent flag (creates all intermediate directories if they don't exist)
* Path creates: `dir1/dir2/dir3/Users/apple/Documents/Devops/Ref class Notes/linux Devops-class-13-May-2022.txt` as a directory

**Important**: Without `-p`, this command would fail if parent directories don't exist. With `-p`, all missing parent directories are automatically created.

**Example**: Creates the entire hierarchy in one command instead of creating each level separately.

## Word Count Command (`wc`)

### 22. `wc filename`

**Purpose**: Display the number of lines, words, and bytes in a file.\
**Output Format**: `[lines] [words] [bytes] filename`\
**Example Output**: `10 50 250 filename`

### 23. `wc -l f1`

**Purpose**: Count and display only the number of lines in file `f1`.\
**Breakdown**: `-l` = Lines only flag\
**Example Output**: `42 f1` (means the file has 42 lines)

### 24. `wc -w f1`

**Purpose**: Count and display only the number of words in file `f1`.\
**Breakdown**: `-w` = Words only flag\
**Example Output**: `156 f1` (means the file has 156 words)

### 25. `wc -c f1`

**Purpose**: Count and display only the number of bytes in file `f1`.\
**Breakdown**: `-c` = Bytes only flag\
**Example Output**: `1024 f1` (means the file is 1024 bytes)

### 26. `wc -m f1`

**Purpose**: Count and display only the number of characters in file `f1`.\
**Breakdown**: `-m` = Characters only flag\
**Note**: Unlike `-c` (bytes), `-m` counts actual characters (important for multi-byte UTF-8 characters)

**Example Output**: `950 f1` (means the file has 950 characters)

## Echo Command

### 27. `echo "statement"`

**Purpose**: Print the text "statement" to standard output (terminal).\
**Output**: `statement`

**Usage**: Commonly used to display messages, variables, or create file content in scripts.

### 28. `echo -e "Hi \nThis is devops class \nThird line"`

**Purpose**: Print text with escape sequences interpreted (newlines will be actual line breaks).\
**Breakdown**:

* `-e` = Enable interpretation of backslash escapes
* `\n` = Newline character

**Output**:

```
Hi
This is devops class
Third line
```

**Without `-e`**: Would print literally as `Hi \nThis is devops class \nThird line`

## Input/Output Redirection

### 29. `>` Redirect

**Purpose**: Redirect standard output to a file, overwriting the file if it exists.\
**Example**: `echo "Hello" > output.txt` creates `output.txt` with content `"Hello"`\
**Important**: Overwrites existing file content without warning.

**Usage**: `command > filename`

### 30. `>>` Append

**Purpose**: Redirect standard output to a file, appending to existing content (does not overwrite).\
**Example**: `echo "New line" >> output.txt` adds `"New line"` to the end of `output.txt`\
**Important**: Preserves existing file content and adds new content at the end.

**Usage**: `command >> filename`

## Disk Usage Command (`du`)

### 31. `du filename`

**Purpose**: Display disk usage of a specific file in disk blocks (usually 512 bytes per block).\
**Output Example**: `8 filename` (means 8 blocks, approximately 4KB)

**Note**: For files, `du` shows allocated disk space, not logical file size.

### 32. `du -sh filename`

**Purpose**: Display human-readable disk usage of a file in a simplified format.\
**Breakdown**:

* `-s` = Summary (total size only, not details)
* `-h` = Human-readable (shows K, M, G, T for kilobytes, megabytes, gigabytes, terabytes)

**Output Example**: `2.5M filename`

### 33. `du -sh directory_name`

**Purpose**: Display total human-readable disk usage of a directory and all its contents.\
**Breakdown**:

* `-s` = Summary of the entire directory
* `-h` = Human-readable format

**Output Example**: `1.2G directory_name`

### 34. `du -sh *`

**Purpose**: Display human-readable disk usage of all files and directories in the current directory.\
**Breakdown**:

* `-s` = Summary for each item
* `-h` = Human-readable format
* `*` = All items in current directory

**Output Example**:

```
4.2K file1.txt
2.1M directory1
512K file2.txt
```

## Head Command

### 35. `head filename`

**Purpose**: Display the first 10 lines of a file (default behavior).\
**Example**: Shows the beginning of a file for quick preview.

### 36. `head -3 f1`

**Purpose**: Display the first 3 lines of file `f1`.\
**Breakdown**: `-3` specifies the number of lines to display

**Example Output**: First 3 lines of the file appear

### 37. `head -20 f1`

**Purpose**: Display the first 20 lines of file `f1`.\
**Breakdown**: `-20` specifies display of first 20 lines

**Example Output**: First 20 lines of the file appear

## Tail Command

### 38. `tail f1`

**Purpose**: Display the last 10 lines of file `f1` (default behavior).\
**Example**: Shows the end of a file for quick preview.

### 39. `tail -2 f1`

**Purpose**: Display the last 2 lines of file `f1`.\
**Breakdown**: `-2` specifies the number of lines to display from the end

**Example Output**: Last 2 lines of the file appear

### 40. `tail -20 f1`

**Purpose**: Display the last 20 lines of file `f1`.\
**Breakdown**: `-20` specifies display of last 20 lines

**Example Output**: Last 20 lines of the file appear

## Pipe Operator

### 41. `|` Pipe

**Purpose**: Connect the output of one command as input to another command.\
**Usage**: `command1 | command2`\
**Benefit**: Allows chaining multiple commands together for complex operations.

**Example**: `cat file | wc -l` (shows content of file and counts lines)

### 42. `ls -l|wc -l`

**Purpose**: List files in detailed format and count the number of lines in the output.\
**Breakdown**:

* `ls -l` = Long format listing of files
* `|` = Pipe the output to the next command
* `wc -l` = Count lines in the piped output

**Result**: Shows total number of files/directories (including header line) in current directory\
**Output Example**: `15` (means 14 items plus 1 header line)

### 43. `head -10 file|tail -1`

**Purpose**: Display only the 10th line of a file.\
**Breakdown**:

* `head -10 file` = First 10 lines of the file
* `|` = Pipe to the next command
* `tail -1` = Last line of the piped output (which is the 10th line)

**Result**: Shows exactly the 10th line of the file\
**Use Case**: Extracting a specific line from the middle of a file

## Grep Command

### 44. `grep`

**Purpose**: Search for lines containing a specific pattern in a file or input.\
**Basic Usage**: `grep "pattern" filename`\
**Output**: All lines that contain the pattern

**Example**: `grep "error" logfile.txt` shows all lines containing "error"

### 45. `grep -i "devops" f1`

**Purpose**: Search for "devops" in file `f1`, case-insensitive.\
**Breakdown**: `-i` = Ignore case (matches "devops", "DEVOPS", "DevOps", etc.)

**Output**: All lines containing "devops" regardless of case\
**Example**: Finds `"DEVOPS Engineer"` and `"devops class"` with same command

### 46. `grep -in "pattern" filename`

**Purpose**: Search for "pattern" in `filename`, case-insensitive, and show line numbers.\
**Breakdown**:

* `-i` = Ignore case
* `-n` = Print line numbers

**Output Format**: `[line_number]:[matching_line]`\
**Example Output**: `5:This is a pattern line` (pattern found on line 5)

### 47. `grep -ic "pattern" filename`

**Purpose**: Count how many lines contain the pattern (case-insensitive).\
**Breakdown**:

* `-i` = Ignore case
* `-c` = Count matching lines

**Output**: Just the count number\
**Example Output**: `7` (7 lines contain the pattern)

### 48. `grep -iw "devops" f1`

**Purpose**: Search for "devops" as a whole word only, case-insensitive.\
**Breakdown**: `-w` = Word boundaries (won't match `"devopsclass"` or `"mydevops"`)

**Output**: Lines containing "devops" as a complete word\
**Difference**: Without `-w`, `"devops"` in `"devopsclass"` would match; with `-w`, it won't

### 49. `grep -li "devops" *`

**Purpose**: List filenames containing "devops" (case-insensitive) from all files in current directory.\
**Breakdown**:

* `-l` = List filenames only (not the matching lines)
* `-i` = Ignore case
* `*` = All files in current directory

**Output**: Filenames that contain the pattern

**Example Output**:

```
file1.txt
file3.txt
notes.md
```

### 50. `grep -ilr "devops" *`

**Purpose**: Recursively search all files in current directory and subdirectories for "devops", listing matching filenames.\
**Breakdown**:

* `-i` = Ignore case
* `-l` = List filenames only
* `-r` = Recursive (search subdirectories)
* `*` = Start from current directory

**Output**: Filenames from all directories containing the pattern

**Use Case**: Finding files across entire project/directory tree

### 51. `grep -ie "devops" -e "teams" f1`

**Purpose**: Search for lines containing either "devops" OR "teams" in file `f1`.\
**Breakdown**:

* `-i` = Ignore case
* `-e "devops"` = First pattern to match
* `-e "teams"` = Second pattern to match

**Output**: All lines matching either pattern

**Example**: A line with `"devops class"` OR `"teams collaboration"` would both match

**Use Case**: Searching for multiple alternative patterns

## Complex Pipeline Commands

### 52. `head -8 f1|tail -1|wc -w`

**Purpose**: Count the number of words on the 8th line of file `f1`.\
**Breakdown**:

* `head -8 f1` = Get first 8 lines
* `|tail -1` = Get the last line of those (which is line 8)
* `|wc -w` = Count words in that line

**Result**: Shows word count of exactly the 8th line\
**Output Example**: `5` (the 8th line has 5 words)

**Use Case**: Extracting and analyzing specific lines

## System Information Commands

### 53. `df -h`

**Purpose**: Display disk space usage of all mounted filesystems in human-readable format.\
**Breakdown**:

* `df` = Disk free (shows filesystem usage)
* `-h` = Human-readable (shows K, M, G, T)

**Output Columns**: Filesystem, Size, Used, Available, Use%, Mount point

**Example Output**:

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       50G   30G   20G  60%  /
/dev/sda2      100G   50G   50G  50%  /home
tmpfs           8.0G    0  8.0G   0%  /dev/shm
```

**Use Case**: Checking available disk space before large operations

### 54. `free -g`

**Purpose**: Display memory (RAM) usage in gigabytes.\
**Breakdown**:

* `free` = Show free and used memory
* `-g` = Display in gigabytes (alternative: `-m` for megabytes, `-h` for human-readable)

**Output Columns**: Total, Used, Free, Shared, Buffer/Cache, Available

**Example Output**:

```
              total   used   free  shared  buffers  available
Mem:             16      8      8       1        2          6
Swap:             4      0      4       0        0          4
```

**Use Case**: Monitoring system memory availability and usage

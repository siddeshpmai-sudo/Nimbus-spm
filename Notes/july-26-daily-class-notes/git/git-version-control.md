# git version control

{% hint style="info" %}
Version Control System (VCS) is a software system that records changes to a file or set of files over time, enabling software developers to work together collaboratively and maintain a complete history of their work.
{% endhint %}

## Git Version Control

Version Control System (VCS) provides features that enable collaborative development and maintain a history of work. Key features include:

* Collaboration — simultaneous work by multiple developers and seamless integration of modifications.
* Version Control — tracks all changes, enabling rollbacks and maintaining development history.
* Conflict Resolution — detects and helps resolve conflicts from simultaneous editing.
* Backup and Security — audit trails, access control, and safe backups.
* Transparency — shows what changed, who changed it, and when.
* Efficiency — speeds project completion and improves communication.

#### Types of Version Control Systems (VCS)

{% stepper %}
{% step %}
### Manual Version Control (Copying Files)

Common technique — files are frequently copied to new directories, sometimes with timestamps for organization.

**Disadvantages**

* Easily forget the current directory and copy or overwrite the incorrect file, making it error-prone.
* Difficult to follow history or revert to earlier iterations when there is no central record of changes.
{% endstep %}

{% step %}
### Local Version Control Systems

Local VCS were designed to overcome drawbacks of manual techniques.

**Advantages**

* Database — maintains a history of file modifications.
*   Revision control — tracks specific file versions and allows rollbacks when necessary.

    One such tool is the widely used Revision Control System (RCS), which records changes as patch sets (differences between files).
* Patch sets — saved on disk; by applying patches sequentially, any previous version of a file can be reconstructed.

**Disadvantage**

* Not ideal for collaboration — local systems make it difficult for several developers on separate machines to collaborate on a single project.
{% endstep %}

{% step %}
### Centralized Version Control Systems

![Centralized Version Control Systems](https://www.tutorialspoint.com/git/images/cvcs.png)

Centralized VCS address collaboration issues by storing all project files on a central server. Developer workstations (clients) connect to the server to retrieve files for editing.

**Advantages**

* Improved collaboration — users access the most recent versions and can observe each other's work.
* Simple administration — easier to manage and restrict permissions compared to many local configurations.

**Disadvantages**

* Single point of failure — if the main server fails, no one can work together or save changes.
* Risk of data loss — without proper backups, the entire project history may be lost if the primary database becomes corrupted.
* Comparable risk to local VCS — storing all history in one location risks total loss.
{% endstep %}

{% step %}
### Distributed Version Control Systems

![Distributed Version Control Systems](https://www.tutorialspoint.com/git/images/dvcs.png)

DVCSs distribute the project's history instead of relying on a single server. Each developer has a complete copy (clone) of all files and the entire change history on their local machine.

**Advantages**

* Decentralized backup — every clone acts as a full backup; recovery from server failure is possible by copying any clone back to the server.
* Offline work — developers can work without an internet connection using the local copy.
* Efficient operations — history viewing and many operations are faster due to local copies.
* Multiple remote repositories — supports collaborating with several remotes.
{% endstep %}
{% endstepper %}

***

## Git Version Control

Git is a Distributed Version Control System (DVCS) that tracks modifications to files across versions. It enables multiple developers to work on a project concurrently and facilitates reliable and efficient contribution, management, and integration.

### Features of Git Version Control

* Branching and Merging\
  Create separate branches for features or bug fixes and merge them back into the main project.
* Distributed Architecture\
  Every developer has a complete local copy of the repository and its history.
* Staging Area\
  Git provides a staging area to review changes before committing to the repository.
* Data Integrity\
  Git ensures integrity using SHA-1 hashing; directories, files, and commits are checksummed.
* Fast Performance\
  Commits, diffs, and merges are performed locally, making operations fast.

### Advantages of Git Version Control

* Enhanced Collaboration\
  Branching enables multiple developers to work concurrently without conflicts; code reviews and pull requests foster teamwork.
* Flexibility\
  Supports various workflows (feature branching, Gitflow, trunk-based development) to fit project needs.
* Offline Work\
  Local repository copies allow work without internet access.
* Decentralized Backup\
  Each clone is a complete backup; restoring any clone to the server allows recovery.
* Extensive Tools and Environment\
  Many integrations for project management, continuous integration, and deployment.
* Community and Support\
  A large community provides documentation, tools, and assistance.

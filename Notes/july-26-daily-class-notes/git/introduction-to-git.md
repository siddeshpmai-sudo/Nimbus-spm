# introduction to git

Git is a distributed version control system that tracks changes in computer files, primarily used to coordinate development work among programmers during software development. It permits many developers to work on the same project simultaneously without interfering with each other's work.

Following are some key concepts and features of Git:

* **Version Control** − Helps manage and track changes made to files over time. Git maintains history of all changes and allows reverting to previous versions if needed.
* **Distributed** − Each developer has a complete copy of all files and their entire change history on their local machine, enabling flexible collaboration.
* **Branching** − Branches are lightweight and easy to create, merge, and delete. They isolate work for new features or bug fixes so developers can work simultaneously without impacting the main codebase.
* **Merging** − Changes from one branch can be merged into another branch (for example, into the main branch) using Git's merge tools.
* **Remote Repositories** − Git allows pushing local changes to remote repositories (e.g., GitHub, BitBucket) to enable collaboration.
* **Committing** − Changes are saved as commits, which are snapshots of the project at a given time. Commits have unique alphanumeric IDs and record who made the change and when.
* **External Vendors** − Platforms such as GitHub, GitLab, and BitBucket host Git repositories and provide additional features like issue tracking, code review, and project management.

### Git Workflow

{% stepper %}
{% step %}
### Clone

Clone a remote repository to your local machine. This creates a local copy of the project's files and history on your computer.
{% endstep %}

{% step %}
### Branch

Create a new branch to work on a specific task or feature. Branching isolates your local changes from the main codebase until they are ready to merge.
{% endstep %}

{% step %}
### Work

Make changes to the files in your branch (add features, fix bugs, or make other alterations).
{% endstep %}

{% step %}
### Commit

Periodically commit your changes to your local repository. Each commit is a snapshot of the project at a particular time.
{% endstep %}

{% step %}
### Pull

Incorporate changes made by other developers by pulling the latest changes from the remote repository.
{% endstep %}

{% step %}
### Merge

Once your work is completed and tested, merge your changes into the main branch to integrate them with the rest of the project.
{% endstep %}

{% step %}
### Push

Push your local commits to the remote repository so your work is shared with other team members.
{% endstep %}
{% endstepper %}

![Git Workflow](https://www.tutorialspoint.com/git/images/git-workflow.png)

This basic workflow forms the foundation of Git collaboration. Depending on the project and team preferences, additional steps or variations may be added, such as code reviews, issue tracking, continuous integration, and deployment processes.

### Git As A Choice

Reasons Git is widely chosen for version control and collaboration:

* **Distributed Version Control** − Developers can work offline, commit locally, and synchronize with remote repositories later.
* **Collaboration** − Rich features and workflows facilitate efficient and transparent team collaboration.
* **Security** − Git includes features to protect project data from unauthorized access and tampering.
* **Efficiency** − Design principles, distributed nature, and storage optimizations contribute to Git's efficiency.
* **Transparency** − Provides visibility into project history, development process, and collaboration efforts.
* **Speed and Performance** − Designed to be fast and efficient, even with large repositories and extensive history.
* **Security and Integrity** − Ensures data integrity via cryptographic hashing and checksums.
* **Wide Adoption and Community Support** − Large ecosystem of tools, libraries, and resources support Git usage.
* **Open Source and Free** − Git is open-source under the GNU GPL; it is free to use and modify.
* **Flexibility and Customization** − Highly customizable to suit specific workflows and preferences.

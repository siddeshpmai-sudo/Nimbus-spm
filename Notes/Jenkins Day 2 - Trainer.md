# Jenkins Day 2: Advanced Configurations & Service Management
**Trainer Version: Teaching Guide & Talking Points**

---

## 🎯 Module Objectives
By the end of this session, students should be able to:
1. Understand the core configuration files of Jenkins.
2. Successfully change the default Jenkins port and understand why it's necessary.
3. Manage the Jenkins service (start, stop, restart) using Linux `systemctl`.
4. Navigate and understand the "Manage Jenkins -> System" configurations.

## 1. Jenkins Configurations & Default Files

**🗣️ Talking Points:**
- Explain to students that Jenkins on Linux isn't just a UI; it's a deeply integrated system service.
- When Jenkins is installed via package managers (`apt` or `yum`), it creates specific directories and configuration files.

**Key Files to Highlight:**
- `/var/lib/jenkins/`: The `JENKINS_HOME` directory. This is the heart of Jenkins. It stores all jobs, plugins, node configurations, and build history. *(Tip: Tell students this is the directory they must backup!)*
- `/etc/default/jenkins` (Debian/Ubuntu) or `/etc/sysconfig/jenkins` (RHEL/CentOS): The environment variables and startup parameters script for older init systems.
- `/lib/systemd/system/jenkins.service`: The modern systemd unit file that controls how the Jenkins process starts and stops.

## 2. Default Port & Port Changing

**🗣️ Talking Points:**
- Ask the class: *"What is the default port for Jenkins?"* (Answer: 8080).
- Ask: *"Why might we need to change it?"* (Answers: Conflicts with Tomcat, Node.js apps, or other web services running on 8080; organizational security policies).

### The Modern Way to Change the Port (systemd)
*Note: In newer Jenkins versions (>= 2.332.1), Jenkins strictly uses `systemd`, making `/etc/default/jenkins` obsolete for port changes on modern OSs like Ubuntu 22.04 or RHEL 8/9.*

**Demonstration Steps:**
1. Do **NOT** edit the base service file directly. Instead, use systemd's override mechanism.
2. Run: `sudo systemctl edit jenkins`
3. Add the following lines to the override file:
   ```ini
   [Service]
   Environment="JENKINS_PORT=9090"
   ```
4. Save and exit (Ctrl+X, Y, Enter).
5. Reload systemd: `sudo systemctl daemon-reload`
6. Restart Jenkins: `sudo systemctl restart jenkins`

> [!WARNING] 
> **Common Student Pitfall:** Students will often try to edit `/etc/default/jenkins` on Ubuntu 20.04/22.04 and complain that the port didn't change. Explain that `systemd` completely ignores `/etc/default/jenkins` for port settings in modern Jenkins packages.

### The Legacy Way (`nano /etc/default/jenkins`)
*If teaching on older systems (Ubuntu 18.04 or older Jenkins versions).*
1. `sudo nano /etc/default/jenkins`
2. Find `HTTP_PORT=8080` and change to `HTTP_PORT=9090`.
3. Restart Jenkins.

## 3. Ways to Restart Jenkins

**🗣️ Talking Points:**
- Explain that there are two primary ways to restart Jenkins: from the OS level, and from the Application (UI) level.

**1. OS Level (Command Line):**
- `sudo systemctl restart jenkins`
- *(Use this when changing system ports, java arguments, or if the UI is completely unresponsive).*

**2. Application Level (Browser URL):**
- `http://<ip-address>:8080/restart` (Forces an immediate restart).
- `http://<ip-address>:8080/safeRestart` (Waits for all currently running jobs to finish before restarting).
- *(Use this when installing plugins or making UI-level configuration changes).*

## 4. The Systemd Service File (`/lib/systemd/system/jenkins.service`)

**🗣️ Talking Points:**
- Walk through the contents of this file briefly.
- Show them the `User=jenkins` and `Group=jenkins` lines. Explain that Jenkins runs as this user, which is why Jenkins often gets "Permission Denied" errors when trying to read/write files in `/root` or `/home/ubuntu`.
- Show the `Environment="JAVA_OPTS=..."` section where memory limits (JVM heap size) can be configured for large instances.

## 5. Manage Jenkins Items - System Configuration

**🗣️ Talking Points:**
- Navigate to **Dashboard -> Manage Jenkins -> System**.
- This is the global configuration area.

**Key areas to demonstrate:**
- **Jenkins URL:** Explain why this is critical (it's used in email notifications and GitHub webhooks to generate absolute links).
- **System Admin e-mail address:** Where emails from Jenkins appear to come from.
- **Global Properties:** Show how to set Environment Variables that all jobs can use (e.g., setting `MAVEN_HOME`).
- **Extended E-mail Notification:** Show where SMTP server details go to enable email alerts.

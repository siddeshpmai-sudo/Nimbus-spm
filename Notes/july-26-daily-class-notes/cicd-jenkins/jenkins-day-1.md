# Jenkins Day 1

## 🎯 What You Will Learn Today

* What Jenkins is and where it fits in DevOps
* Install Java (OpenJDK 17) on an Ubuntu EC2 instance
* Install Jenkins on Ubuntu EC2
* Unlock Jenkins and complete the initial setup
* Navigate the Jenkins dashboard
* Create and run your first **Freestyle Job**

## 💡 Why Jenkins?

Every time a developer pushes code to GitHub — someone has to:

* Compile the code
* Run tests
* Package it
* Deploy it to the server

**Without automation:** A human does this manually after every push. Slow, error-prone, and doesn't scale.

**With Jenkins:** Jenkins detects the push automatically, runs every step in sequence, and notifies the team of the result. No human intervention needed.

```
Developer → git push → GitHub → Jenkins
                                    ↓
                          Build  →  Test  →  Deploy
                                    ↓
                              Notify Team
```

This is **CI/CD — Continuous Integration / Continuous Delivery**.

## 🖥️ Part 1 – EC2 Setup

### What you need on AWS

| Setting       | Value                               |
| ------------- | ----------------------------------- |
| OS            | Ubuntu 22.04 LTS                    |
| Instance Type | t2.medium (minimum)                 |
| Storage       | 20 GB                               |
| Inbound Ports | **22** (SSH), **8080** (Jenkins UI) |

{% hint style="warning" %}
Port 8080 MUST be open in your EC2 Security Group.

If it is blocked, you will not be able to access the Jenkins web UI.
{% endhint %}

### Connect to your EC2

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Update the system first

```bash
sudo apt update
sudo apt upgrade -y
```

## ☕ Part 2 – Install Java (OpenJDK 17)

Jenkins is a Java application — it cannot run without Java.

{% stepper %}
{% step %}
### Check if Java is installed

```bash
java -version
```

If you see `command not found`, Java is not installed. Continue below.
{% endstep %}

{% step %}
### JRE vs JDK — Understand the Difference

|                        | JRE (Java Runtime Environment) | JDK (Java Development Kit)     |
| ---------------------- | ------------------------------ | ------------------------------ |
| **What it is**         | Runs Java programs             | Develops + runs Java programs  |
| **Includes**           | JVM + runtime libraries        | JRE + compiler + dev tools     |
| **For Jenkins server** | ✅ Enough to run Jenkins        | ✅ Needed if building Java code |
| **Package name**       | `openjdk-17-jre`               | `openjdk-17-jdk`               |

{% hint style="info" %}
**Rule of thumb:**

* Install **JRE** if Jenkins is only running pipelines (shell scripts, Python, etc.)
* Install **JDK** if Jenkins is building Java/Maven/Gradle projects
{% endhint %}
{% endstep %}

{% step %}
### Install JRE (Java Runtime Environment)

JRE is the **minimum requirement** to run Jenkins:

```bash
sudo apt update
sudo apt install openjdk-17-jre -y
```

Verify JRE:

```bash
java -version
```

**Expected output:**

```
openjdk version "17.0.x" ...
OpenJDK Runtime Environment (build 17.0.x...)
```
{% endstep %}

{% step %}
### Install JDK (Java Development Kit)

JDK is required to **build Java projects** with Jenkins (Maven, Gradle, etc.). Installing JDK also includes JRE — so you get everything in one package:

```bash
sudo apt install openjdk-17-jdk -y
```

Verify JDK:

```bash
javac -version
```

**Expected output:**

```
javac 17.0.x
```

{% hint style="info" %}
In this course we install **both** — JRE to run Jenkins and JDK to build Java projects.
{% endhint %}
{% endstep %}

{% step %}
### Verify

```bash
java -version
```

**Expected output:**

```
openjdk version "17.0.x" ...
OpenJDK Runtime Environment (build 17.0.x...)
OpenJDK 64-Bit Server VM (build 17.0.x..., mixed mode, sharing)
```
{% endstep %}

{% step %}
### Find Java path

```bash
update-alternatives --list java
```

**Output:**

```
/usr/lib/jvm/java-17-openjdk-amd64/bin/java
```

Java is now installed. ✅
{% endstep %}
{% endstepper %}

## 🔧 Part 3 – Install Jenkins

Ubuntu's default repositories do not include Jenkins. You need to add the official Jenkins repository.

{% stepper %}
{% step %}
### Add Jenkins GPG Key

This key proves the Jenkins packages are genuine:

```bash
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
```
{% endstep %}

{% step %}
### Add Jenkins Repository

```bash
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```
{% endstep %}

{% step %}
### Update and Install

```bash
sudo apt update
sudo apt install jenkins -y
```
{% endstep %}

{% step %}
### Start Jenkins

```bash
sudo systemctl start jenkins
```
{% endstep %}

{% step %}
### Enable on Boot

```bash
sudo systemctl enable jenkins
```
{% endstep %}

{% step %}
### Check Status

```bash
sudo systemctl status jenkins
```

**Expected output:**

```
● jenkins.service - Jenkins Continuous Integration Server
     Active: active (running) since ...
```

Green `active (running)` = Jenkins is running. ✅
{% endstep %}
{% endstepper %}

## 🌐 Part 4 – Open Jenkins in Browser

Open your browser and go to:

```
http://<EC2_PUBLIC_IP>:8080
```

You will see the **Unlock Jenkins** screen.

{% stepper %}
{% step %}
### Get the Unlock Password

Back in your terminal:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copy the password and paste it into the browser. Click **Continue**.
{% endstep %}

{% step %}
### Install Plugins

On the next screen, click:

> ✅ **Install suggested plugins**

Wait for all plugins to finish installing (\~3–5 minutes).
{% endstep %}

{% step %}
### Create Admin Account

Fill in:

* **Username** — your admin username
* **Password** — a strong password
* **Full name**
* **Email**

Click **Save and Continue**.
{% endstep %}

{% step %}
### Instance URL

Jenkins shows your URL:

```
http://<EC2_PUBLIC_IP>:8080/
```

Click **Save and Finish** → **Start using Jenkins**.

You are now on the **Jenkins Dashboard**. ✅
{% endstep %}
{% endstepper %}

## 🏠 Part 5 – Jenkins Dashboard Tour

```
┌─────────────────────────────────────────────┐
│  Jenkins              [Search]  [Username]  │
├─────────────────────────────────────────────│
│  New Item                                   │
│  People                                     │
│  Build History                              │
│  Manage Jenkins                             │
├─────────────────────────────────────────────│
│              Welcome to Jenkins!            │
│         [Create a Job]  [Set up an agent]   │
└─────────────────────────────────────────────┘
```

| Menu Item                 | What it does                                      |
| ------------------------- | ------------------------------------------------- |
| **New Item**              | Create a new Jenkins job                          |
| **People**                | Manage users                                      |
| **Build History**         | See all past builds across all jobs               |
| **Manage Jenkins**        | Server configuration, plugins, credentials, nodes |
| **Build Queue**           | Jobs waiting to run                               |
| **Build Executor Status** | Agents/threads currently running builds           |

## 🆕 Part 6 – Create Your First Freestyle Job

{% stepper %}
{% step %}
### Create the Job

1. Click **New Item**
2. Enter job name: `my-first-job`
3. Select **Freestyle project**
4. Click **OK**

You are now on the **Freestyle Job configuration page**.
{% endstep %}

{% step %}
### Configure the Job

#### 📌 Section 1: General

| Field                             | What it does                                                        |
| --------------------------------- | ------------------------------------------------------------------- |
| **Description**                   | Write what this job does — for future reference                     |
| **Discard old builds**            | Automatically delete old build logs to save disk space              |
| **GitHub project**                | Link to the GitHub repo this job works with                         |
| **This project is parameterized** | Allow the job to accept input values (e.g., branch name) at runtime |
| **Throttle builds**               | Limit how many times this job can run simultaneously                |
| **Execute concurrent builds**     | Allow multiple instances of this job to run at the same time        |

**What to configure now:**

* ✅ Add a description: `My first Jenkins job - system information`
* ✅ Enable **Discard old builds** → Max # of builds to keep: `5`

#### 🔗 Section 2: Source Code Management

Tells Jenkins where to get the source code.

| Option   | When to use                                    |
| -------- | ---------------------------------------------- |
| **None** | No code needed — shell scripts only            |
| **Git**  | Jenkins should clone a Git repo before running |

**What to configure now:** Leave as **None** for today. We will add Git integration in Day 2.

When you add Git:

* **Repository URL:** `https://github.com/your-username/your-repo.git`
* **Branch:** `*/main`
* **Credentials:** Add if the repo is private

#### ⏰ Section 3: Triggers

Defines WHEN the job runs automatically.

| Trigger                                  | What it does                                        |
| ---------------------------------------- | --------------------------------------------------- |
| **Trigger builds remotely**              | Start the job by calling a URL (used with webhooks) |
| **Build after other projects are built** | Run this job after another job completes            |
| **Build periodically**                   | Schedule using cron syntax — like a Linux cron job  |
| **GitHub hook trigger**                  | GitHub tells Jenkins when code is pushed            |
| **Poll SCM**                             | Jenkins checks the repo for changes on a schedule   |

**Cron syntax quick reference:**

```
H/5 * * * *   → every 5 minutes
H 8 * * 1-5   → every weekday at 8 AM
@hourly        → every hour
@midnight      → every day at midnight
```

**What to configure now:**

✅ Enable **Build periodically** → Schedule: `H/5 * * * *`

This makes the job run automatically every 5 minutes.

#### 🌱 Section 4: Environment

Configures the environment before the build runs.

| Option                                   | What it does                                                   |
| ---------------------------------------- | -------------------------------------------------------------- |
| **Delete workspace before build starts** | Cleans old files from previous builds — fresh start every time |
| **Use secret text(s) or file(s)**        | Inject passwords/API keys as environment variables securely    |
| **Add timestamps to Console Output**     | Shows time `[HH:MM:SS]` next to each log line                  |
| **Terminate a build if it's stuck**      | Kills the build automatically if it runs too long              |

**What to configure now:**

✅ Enable **Add timestamps to Console Output** — always useful for debugging

#### 🔨 Section 5: Build Steps

**This is what Jenkins actually runs.**

Click **Add build step** → Select **Execute shell**

A text box appears. Type your shell commands here:

```bash
echo "=============================="
echo "Hello from Jenkins!"
echo "=============================="
echo "Build Number  : $BUILD_NUMBER"
echo "Job Name      : $JOB_NAME"
echo "Workspace     : $WORKSPACE"
echo ""
echo "--- System Information ---"
date
uname -a
uptime
df -h
free -m
whoami
```

**Jenkins built-in environment variables — memorize these:**

| Variable        | What it contains                             |
| --------------- | -------------------------------------------- |
| `$BUILD_NUMBER` | Auto-incremented build number (1, 2, 3...)   |
| `$JOB_NAME`     | The name of this Jenkins job                 |
| `$WORKSPACE`    | Absolute path to the job's workspace on disk |
| `$BUILD_URL`    | Full URL to this specific build              |
| `$GIT_BRANCH`   | Git branch being built (when using SCM)      |

#### 📦 Section 6: Post-build Actions

Defines what happens AFTER the build completes.

| Action                         | What it does                                       |
| ------------------------------ | -------------------------------------------------- |
| **Archive the artifacts**      | Save output files (logs, JARs, reports) in Jenkins |
| **Publish JUnit test results** | Display test pass/fail results in Jenkins UI       |
| **Email notification**         | Send an email when a build fails                   |
| **Build other projects**       | Trigger another Jenkins job after this one         |

**What to configure now:** Leave empty for today.
{% endstep %}

{% step %}
### Save

Click **Save** at the bottom of the page.
{% endstep %}

{% step %}
### Run the Job

1. Click **Build Now** (in the left sidebar)
2. Watch the **Build History** section — a new build appears
3. Click the build number (e.g., `#1`)
4. Click **Console Output**

**You should see:**

```
Started by user Admin
[my-first-job] $ /bin/sh -xe /tmp/jenkins...
+ echo ==============================
==============================
+ echo Hello from Jenkins!
Hello from Jenkins!
+ echo ==============================
==============================
+ echo Build Number  : 1
Build Number  : 1
+ echo Job Name      : my-first-job
Job Name      : my-first-job
+ date
Wed Jul 30 23:15:00 UTC 2026
+ uname -a
Linux ip-172-31-xx-xx 5.15.0-... Ubuntu ...
+ uptime
 23:15:00 up 1:30,  1 user,  load average: 0.00, 0.00, 0.00
+ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1       20G  5.2G   15G  26% /
+ free -m
              total        used        free
Mem:           3844         512        3100
+ whoami
jenkins
Finished: SUCCESS
```

**`Finished: SUCCESS`** → Your first Jenkins job ran successfully! 🎉

{% hint style="info" %}
Notice `whoami` printed `jenkins` — Jenkins runs as its own system user called `jenkins`.
{% endhint %}
{% endstep %}
{% endstepper %}

## 🔴 Troubleshooting

| Problem                              | Fix                                                       |
| ------------------------------------ | --------------------------------------------------------- |
| Can't access `http://IP:8080`        | Check EC2 Security Group — port 8080 must be open inbound |
| `jenkins.service failed`             | Wrong Java version — install OpenJDK 17                   |
| `The repository is not signed` error | Use the 2023 GPG key: `jenkins.io-2023.key`               |
| Build shows `FAILURE`                | Click Console Output to see the exact error               |

## 📝 Assignments

{% stepper %}
{% step %}
### Installation

Launch an EC2 instance. Install Java 17 and Jenkins. Take a screenshot of `sudo systemctl status jenkins` showing `active (running)` and the Jenkins dashboard in your browser.
{% endstep %}

{% step %}
### Job 1 — System Info

Create a Freestyle job called `system-info` that runs:

```bash
uname -a
df -h
free -m
whoami
echo "Build: $BUILD_NUMBER"
```

Run it 3 times. Screenshot the Console Output of build #3.
{% endstep %}

{% step %}
### Scheduled job

Create a job with **Build periodically** trigger set to `H/5 * * * *`. Let it run 3 times. Screenshot the Build History showing 3 entries.
{% endstep %}

{% step %}
### Theory — Answer in your own words

* What is the difference between **Build Periodically** and **Poll SCM**?
* Why does Jenkins need Java?
* What does `$BUILD_NUMBER` do?
* Why must port 8080 be open in the Security Group?
{% endstep %}
{% endstepper %}

## 🔁 Quick Reference

| Command                                                  | What it does            |
| -------------------------------------------------------- | ----------------------- |
| `sudo apt install openjdk-17-jdk -y`                     | Install Java 17         |
| `java -version`                                          | Check Java version      |
| `sudo systemctl start jenkins`                           | Start Jenkins           |
| `sudo systemctl enable jenkins`                          | Auto-start on reboot    |
| `sudo systemctl status jenkins`                          | Check Jenkins status    |
| `sudo systemctl restart jenkins`                         | Restart Jenkins         |
| `sudo cat /var/lib/jenkins/secrets/initialAdminPassword` | Get unlock password     |
| `journalctl -xeu jenkins.service`                        | Read Jenkins error logs |

## 🎤 Interview Questions

<details>

<summary><strong>What is Jenkins?</strong></summary>

Jenkins is an open-source automation server used for CI/CD. It automatically builds, tests, and deploys code when changes are pushed to a repository.

</details>

<details>

<summary><strong>What is CI/CD?</strong></summary>

CI = Continuous Integration — build and test code automatically on every push.

CD = Continuous Delivery — automatically deliver tested code to production or staging.

</details>

<details>

<summary><strong>What port does Jenkins run on?</strong></summary>

Port 8080 (default).

</details>

<details>

<summary><strong>Why does Jenkins need Java?</strong></summary>

Jenkins is written in Java and runs on the JVM (Java Virtual Machine).

</details>

<details>

<summary><strong>What is a Freestyle job?</strong></summary>

The simplest Jenkins job type. You configure a series of steps (shell commands, build tools) in the UI and Jenkins runs them sequentially.

</details>

<details>

<summary><strong>What does <code>$BUILD_NUMBER</code> mean in Jenkins?</strong></summary>

It is an environment variable Jenkins provides automatically. It contains the sequential number of the current build (1, 2, 3...). It increments with every build run.

</details>

<details>

<summary><strong>What user does Jenkins run as on Linux?</strong></summary>

Jenkins creates and runs as a dedicated system user called `jenkins`.

</details>

## 📌 Coming Up – Day 2

* Jenkins Pipelines — writing a `Jenkinsfile`
* Declarative pipeline syntax with stages
* Connecting Jenkins to GitHub with webhooks
* Parameterized builds
* Jenkins Agents (nodes)

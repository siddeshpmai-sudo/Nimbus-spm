# 📘 Jenkins – Day 1 Teaching Guide
## 🕐 Duration: 2 Hours | DevOps Batch
### 👨‍🏫 Trainer Reference — Not for Students

---

## 🎯 What Students Will Learn Today

- What Jenkins is and why it exists in a DevOps pipeline
- Install Java (OpenJDK 17) on Ubuntu EC2
- Install and configure Jenkins on Ubuntu EC2
- Unlock Jenkins and complete initial setup
- Navigate the Jenkins dashboard
- Create and run a **Freestyle Job** — every section explained

---

## 👨‍🏫 Before Teaching — Open with a Story

Ask students:

> "You've written code. You push it to GitHub. Then what?  
> Who compiles it? Who runs the tests? Who deploys it to the server?  
> Does a human sit and do all of this every single time someone pushes code?"

Let students respond. Then:

> "No. That's what Jenkins does.  
> Jenkins watches your Git repo. When code is pushed, Jenkins wakes up,  
> runs all the steps you've defined — tests, build, deploy — automatically.  
> That's **Continuous Integration / Continuous Delivery (CI/CD)**."

---

## 🗺️ Jenkins in the DevOps Pipeline

```
Developer → git push → GitHub → Jenkins (detects change)
                                    ↓
                               Build / Test
                                    ↓
                               Deploy to Server
                                    ↓
                          Notify (email / Slack)
```

Jenkins sits at the **automation layer** — it is the engine that runs your pipeline.

---

## ⏱️ Class Timeline

| Time | Topic |
|------|-------|
| 0:00 – 0:15 | What is Jenkins? CI/CD concept |
| 0:15 – 0:45 | EC2 setup + Java installation |
| 0:45 – 1:15 | Jenkins installation + initial setup |
| 1:15 – 1:45 | Jenkins dashboard tour + Freestyle Job walkthrough |
| 1:45 – 2:00 | Run first job + recap + assignments |

---

## 🖥️ Part 1 – EC2 Prerequisites (15 min)

### EC2 Instance Requirements

| Parameter | Recommended |
|-----------|-------------|
| OS | Ubuntu 22.04 LTS |
| Instance Type | t2.medium (2 vCPU, 4 GB RAM minimum) |
| Storage | 20 GB |
| Security Group — Inbound | Port 22 (SSH), Port 8080 (Jenkins UI), Port 443 (HTTPS optional) |

> 💡 **Teaching tip:** Show students the security group settings on AWS console.  
> Jenkins runs on **port 8080** by default — students often forget to open this.

### Connect to EC2

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

Once connected, update the system first:

```bash
sudo apt update
sudo apt upgrade -y
```

---

## ☕ Part 2 – Install Java (OpenJDK 17) (30 min)

Jenkins requires Java. Jenkins 2.361+ recommends **Java 17** (LTS).

### Why Java?

> Jenkins is a Java application — it runs on the JVM.  
> Without Java, Jenkins cannot start.

### Step 1 — Check if Java is already installed

```bash
java -version
```

If you see `command not found` → Java is not installed. Proceed below.

### Step 2 — JRE vs JDK — Know the Difference

| | JRE (Java Runtime Environment) | JDK (Java Development Kit) |
|-|-------------------------------|---------------------------|
| **What it is** | Only runs Java programs | Develops + runs Java programs |
| **Includes** | JVM + runtime libraries | JRE + compiler (`javac`) + dev tools |
| **For Jenkins** | ✅ Enough to run Jenkins | ✅ Required if building Java/Maven/Gradle projects |
| **Package** | `openjdk-17-jre` | `openjdk-17-jdk` |

> 💡 **Teaching tip:** Ask students: "If Jenkins is only running shell scripts and Python — do we need JRE or JDK?"  
> Answer: JRE is sufficient. But in real DevOps environments, JDK is always installed because Jenkins often builds Java apps.

---

### Step 3 — Install JRE (Java Runtime Environment)

JRE = minimum to **run** Jenkins:

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

---

### Step 4 — Install JDK (Java Development Kit)

JDK = required to **build Java/Maven/Gradle projects** in Jenkins.  
Installing JDK automatically includes JRE:

```bash
sudo apt install openjdk-17-jdk -y
```

Verify JDK compiler is present:

```bash
javac -version
```

**Expected output:**
```
javac 17.0.x
```

> 💡 In this class we install **both** — JRE first so students see the difference, then JDK for full build capability.

### Step 5 — Verify Installation

```bash
java -version
```

**Expected Output:**
```
openjdk version "17.0.x" 2024-xx-xx
OpenJDK Runtime Environment (build 17.0.x+x-Ubuntu-...)
OpenJDK 64-Bit Server VM (build 17.0.x+x-Ubuntu-..., mixed mode, sharing)
```

### Step 6 — Verify JAVA_HOME

```bash
update-alternatives --list java
```

**Output example:**
```
/usr/lib/jvm/java-17-openjdk-amd64/bin/java
```

### What if multiple Java versions are installed?

```bash
sudo update-alternatives --config java
```

This lets you select which version is the default.

> 💡 **Ask students:** "Why does Jenkins need a specific Java version?"  
> Answer: Because Jenkins itself is written in Java. The Jenkins `.war` file runs inside the JVM.  
> Each Jenkins major release requires a minimum Java version.

---

## 🔧 Part 3 – Install Jenkins (30 min)

Jenkins is not in Ubuntu's default apt repositories. We add the **official Jenkins repository**.

> ⚠️ **Warn students before they start:**  
> Some older tutorials use `apt-key add` with `jenkins.io.key` — this is **deprecated and broken** on Ubuntu 22.04+.  
> It causes: `NO_PUBKEY 7198F4B714ABFC68` and `E: Package 'jenkins' has no installation candidate`  
> **Use the 2026 signed-by method below — confirmed working.**

### Step 1 — Create the keyrings directory

```bash
sudo mkdir -p /etc/apt/keyrings
```

### Step 2 — Download the Jenkins 2026 GPG Key

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
```

Verify:

```bash
ls -la /etc/apt/keyrings/jenkins-keyring.asc
```

> 💡 Explain GPG keys: "This is like a digital signature — it proves the Jenkins package hasn't been tampered with.  
> The key is stored in `/etc/apt/keyrings/` — the modern, per-repo location that replaced the global `apt-key` system."

### Step 3 — Add Jenkins Repository to apt Sources

```bash
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

This tells apt: "Look in the Jenkins repo for packages, and verify packages using the key at `/etc/apt/keyrings/jenkins-keyring.asc`."

### Step 4 — Update Package List

```bash
sudo apt update
```

### Step 5 — Install Jenkins

```bash
sudo apt install jenkins -y
```

This installs Jenkins as a **systemd service** — it will auto-start on reboot.

---

### 🔧 If Students Hit the GPG Error — Recovery Steps

Error symptoms:
- `NO_PUBKEY 7198F4B714ABFC68`
- `The repository is not signed`
- `E: Package 'jenkins' has no installation candidate`

Run this to clean up and redo correctly:

```bash
# Remove the broken sources list
sudo rm -f /etc/apt/sources.list.d/jenkins.list

# Remove old deprecated key (if added)
sudo apt-key del 7198F4B714ABFC68 2>/dev/null

# Redo with correct working method
sudo mkdir -p /etc/apt/keyrings
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
```

> 💡 **Teaching point:** The `apt-key` command is deprecated since Ubuntu 22.04. Modern Ubuntu uses per-repo keyrings in `/etc/apt/keyrings/`. The `[signed-by=...]` flag in the sources entry links the repo to its specific key.

---

### Step 5 — Start Jenkins

```bash
sudo systemctl start jenkins
```

### Step 6 — Enable Jenkins on Boot

```bash
sudo systemctl enable jenkins
```

### Step 7 — Check Jenkins Status

```bash
sudo systemctl status jenkins
```

**Expected Output:**
```
● jenkins.service - Jenkins Continuous Integration Server
     Loaded: loaded (/lib/systemd/system/jenkins.service; enabled; ...)
     Active: active (running) since ...
```

Green `active (running)` = Jenkins is up. ✅

### Common Error — Jenkins won't start

If Jenkins fails to start, check the Java version:

```bash
java -version
sudo systemctl status jenkins
journalctl -xeu jenkins.service
```

> ⚠️ Jenkins 2.361+ requires Java 11 or 17. If OpenJDK 8 is installed, upgrade to 17.

---

## 🌐 Part 4 – Access Jenkins in Browser + Initial Setup (15 min)

### Access Jenkins

Open a browser and go to:

```
http://<EC2_PUBLIC_IP>:8080
```

You will see the **Unlock Jenkins** screen.

### Get the Initial Admin Password

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copy the password and paste it into the browser.

**Explain to students:**

> "Jenkins stores a one-time password here for security.  
> After you enter it, you'll set your own admin credentials."

### Plugin Installation

Jenkins will ask you to install plugins. Choose:

> **Install suggested plugins** — this installs the most commonly used plugins automatically.

Wait for all plugins to install (~3-5 minutes).

### Create First Admin User

Fill in:
- Username
- Password
- Full Name
- Email

Click **Save and Continue**.

### Instance Configuration

Jenkins URL will auto-fill with your EC2 IP:

```
http://<EC2_PUBLIC_IP>:8080/
```

Click **Save and Finish** → **Start using Jenkins**.

---

## 🏠 Part 5 – Jenkins Dashboard Tour (10 min)

Walk students through each section of the dashboard:

```
┌─────────────────────────────────────────────┐
│  Jenkins Logo   [Search]          [username] │
├─────────────────────────────────────────────│
│  New Item                                   │
│  People                                     │
│  Build History                              │
│  Manage Jenkins                             │
│  My Views                                   │
├─────────────────────────────────────────────│
│         Build Queue (empty)                 │
│         Build Executor Status               │
│           #1 Idle                           │
│           #2 Idle                           │
└─────────────────────────────────────────────┘
```

| Element | What it does |
|---------|-------------|
| **New Item** | Create a new job (pipeline, freestyle, etc.) |
| **People** | User management |
| **Build History** | Timeline of all past builds |
| **Manage Jenkins** | Server configuration, plugin management, credentials |
| **Build Queue** | Jobs waiting to run |
| **Build Executor Status** | Agents currently running or idle |

> 💡 Explain: "Jenkins 2.568 — that's the version number shown at the bottom of the page."

---

## 🆕 Part 6 – Create a Freestyle Job — Complete Walkthrough (30 min)

### What is a Freestyle Job?

> "A Freestyle Job is the simplest type of Jenkins job.  
> You define a series of steps — shell commands, scripts, test runs —  
> and Jenkins runs them in order. No pipeline code needed."

### Step 1 — Create the Job

Click **New Item** → Enter name: `my-first-job` → Select **Freestyle project** → Click **OK**

---

### The Freestyle Job Configuration Page — Section by Section

#### 📌 Section 1: General

| Field | What it does | When to use |
|-------|-------------|-------------|
| **Description** | Plain text note about this job | Always — describe what the job does |
| **Discard old builds** | Keeps only last N builds to save disk space | ✅ Enable — set to keep last 5 builds |
| **GitHub project** | Link to the GitHub repo this job belongs to | When job is tied to a GitHub repo |
| **This project is parameterized** | Adds input parameters — e.g., branch name, environment | For dynamic jobs that run differently each time |
| **Throttle builds** | Limit how many parallel builds can run | For resource-heavy jobs |
| **Execute concurrent builds** | Allow same job to run multiple times simultaneously | For parallel test runs |

> 💡 **Teaching tip:** Enable "Discard old builds" in every job. Jenkins stores logs, artifacts, and workspace data for every build. Without limits, disk fills up fast.

---

#### 🔗 Section 2: Source Code Management (SCM)

| Option | What it does |
|--------|-------------|
| **None** | No source code — job runs standalone scripts |
| **Git** | Jenkins clones a Git repo before running build steps |

**For Git:**

```
Repository URL: https://github.com/your-username/your-repo.git
Branch: */main  (or */master)
Credentials: Add if private repo
```

> 💡 Jenkins will `git clone` the repo into the **workspace** directory before executing build steps.  
> Path: `/var/lib/jenkins/workspace/<job-name>/`

---

#### ⏰ Section 3: Triggers

Defines WHEN the job runs automatically.

| Trigger | What it does | Example |
|---------|-------------|---------|
| **Trigger builds remotely** | Run via URL/API call from external scripts | Webhook from GitHub |
| **Build after other projects are built** | Chain jobs — run this after job A finishes | Test job runs after build job |
| **Build periodically** | Cron-style schedule | `H 2 * * *` = every day at 2 AM |
| **GitHub hook trigger** | GitHub notifies Jenkins on every push | Most common for CI |
| **Poll SCM** | Jenkins checks the repo on a schedule | `H/5 * * * *` = every 5 minutes |

**Most common for beginners:**  
✅ **Build periodically** — run every 5 minutes → `H/5 * * * *`

**Cron syntax quick reference:**

```
* * * * *
│ │ │ │ └── Day of week (0=Sun, 6=Sat)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)

H/5 * * * *  = every 5 minutes
H 8 * * 1-5  = 8 AM every weekday
@hourly      = every hour
```

---

#### 🌱 Section 4: Environment

| Option | What it does |
|--------|-------------|
| **Delete workspace before build** | Clean workspace before each build — avoids stale files |
| **Use secret text(s) or file(s)** | Inject credentials/secrets as environment variables |
| **Add timestamps to Console Output** | Shows `[HH:MM:SS]` before each log line — makes debugging easier |
| **Terminate a build if it's stuck** | Kills the build if it runs longer than N minutes |

> 💡 Always enable **"Add timestamps to Console Output"** — makes reading logs much easier.

---

#### 🔨 Section 5: Build Steps

This is the **heart of the job** — what Jenkins actually does.

Click **Add build step** → Show available options:

| Build Step | What it does |
|-----------|-------------|
| **Execute shell** | Run any bash command or script |
| **Execute Windows batch** | Windows batch commands |
| **Invoke Ant** | Run Apache Ant build tasks |
| **Invoke Gradle** | Run Gradle build tasks |
| **Run Maven** | Run Maven (Java build tool) goals |

**For this class — use Execute shell.**

Click **Execute shell** → Enter in the command box:

```bash
echo "Hello from Jenkins!"
echo "Build number: $BUILD_NUMBER"
echo "Job name: $JOB_NAME"
date
uptime
```

> 💡 **Explain Jenkins built-in environment variables:**

| Variable | Value |
|----------|-------|
| `$BUILD_NUMBER` | Auto-increments for each build (1, 2, 3...) |
| `$JOB_NAME` | The name of the job |
| `$WORKSPACE` | Path to the job's workspace on disk |
| `$BUILD_URL` | Full URL to this build's page |
| `$GIT_BRANCH` | Branch that was built (if using SCM) |

---

#### 📦 Section 6: Post-build Actions

Runs after the build — pass or fail.

| Action | What it does |
|--------|-------------|
| **Archive the artifacts** | Save files (JAR, WAR, reports) from the build |
| **Publish JUnit test results** | Display test results in Jenkins UI |
| **Email notification** | Send email on build failure |
| **Build other projects** | Trigger downstream jobs |
| **Slack notification** | Notify a Slack channel |

> 💡 For now, add **Archive the artifacts** and save any output files.

---

### Step 2 — Save and Build

1. Click **Save**
2. Click **Build Now** (left sidebar)
3. A new build appears in **Build History** — click it
4. Click **Console Output** to see real-time logs

**Expected Console Output:**

```
Started by user Admin
Running as SYSTEM
Building in workspace /var/lib/jenkins/workspace/my-first-job
[my-first-job] $ /bin/sh -xe /tmp/jenkins...
+ echo Hello from Jenkins!
Hello from Jenkins!
+ echo Build number: 1
Build number: 1
+ echo Job name: my-first-job
Job name: my-first-job
+ date
Wed Jul 30 23:10:00 UTC 2026
+ uptime
 23:10:00 up 2:30,  1 user,  load average: 0.01, 0.01, 0.00
Finished: SUCCESS
```

Green `SUCCESS` = job ran successfully. ✅

---

## 🔴 Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Port 8080 not accessible | EC2 security group missing inbound rule | Add port 8080 inbound rule in AWS Security Group |
| `active (failed)` on `systemctl status jenkins` | Wrong Java version | Install OpenJDK 17: `sudo apt install openjdk-17-jdk` |
| `E: The repository is not signed` | Old GPG key | Use the new key: `jenkins.io-2023.key` |
| Build stuck at "pending" | No executors available | Manage Jenkins → Nodes → Add executor |

---

## 📝 Assignments

1. Launch an EC2 instance, install Java 17 and Jenkins. Share a screenshot of the Jenkins dashboard running on your EC2 IP.

2. Create a Freestyle job called `system-info` that runs:
   - `uname -a` (OS info)
   - `df -h` (disk usage)
   - `free -m` (memory)
   - `whoami` (which user Jenkins runs as)
   
   Run it 3 times. Show the Console Output of build #3.

3. **Schedule a job:** Create a job that runs every 5 minutes using Build Periodically trigger (`H/5 * * * *`). Run it and show 3 build entries in Build History.

4. **Theory:** In your own words, explain:
   - What is the difference between **Build Periodically** and **Poll SCM**?
   - What does the `$BUILD_NUMBER` variable do?
   - Why must we open port 8080 on the EC2 security group?

---

## 🔁 Day 1 Quick Reference

| Command | What it does |
|---------|-------------|
| `sudo apt install openjdk-17-jdk -y` | Install Java 17 |
| `java -version` | Verify Java version |
| `sudo systemctl start jenkins` | Start Jenkins service |
| `sudo systemctl enable jenkins` | Auto-start Jenkins on reboot |
| `sudo systemctl status jenkins` | Check if Jenkins is running |
| `sudo systemctl restart jenkins` | Restart Jenkins |
| `sudo cat /var/lib/jenkins/secrets/initialAdminPassword` | Get the unlock password |
| `journalctl -xeu jenkins.service` | View detailed Jenkins error logs |

---

## 🎤 Interview Questions — Plant Today

1. **What is Jenkins?**  
   Jenkins is an open-source automation server used for CI/CD. It watches code repositories, automatically builds, tests, and deploys applications when code changes are pushed.

2. **What is CI/CD?**  
   CI = Continuous Integration — automatically build and test code on every push.  
   CD = Continuous Delivery/Deployment — automatically deploy tested code to servers.

3. **What port does Jenkins run on by default?**  
   Port 8080.

4. **Why do we need Java to run Jenkins?**  
   Jenkins is a Java application. It runs as a `.war` file inside a Java Virtual Machine (JVM).

5. **What is a Freestyle job in Jenkins?**  
   The simplest job type — you define a sequence of shell commands or build steps, and Jenkins runs them in order. No code/pipeline script required.

6. **What is a Jenkins executor?**  
   A thread on the Jenkins server (or an agent) that actually runs a build. By default Jenkins has 2 executors — it can run 2 builds simultaneously.

---

## 📌 Coming Up – Day 2

- Jenkins Pipelines — `Jenkinsfile` with stages
- Pipeline as Code — declarative syntax
- Connecting Jenkins to GitHub with webhooks
- Jenkins Agents — distributed builds
- Parameterized builds

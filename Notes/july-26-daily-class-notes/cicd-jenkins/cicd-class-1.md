# CICD Class 1

**Course:** DevOps Fundamentals | **Topic:** CI/CD with Jenkins\
**Level:** Beginner | **Duration:** 4–5 Hours

***

## 📋 What You'll Learn Today

* ✅ What CI/CD is and why it matters
* ✅ The stages of a CI/CD pipeline
* ✅ Key tools: Jenkins, SonarQube, Maven, Docker, Ansible, Kubernetes
* ✅ How to read and write a basic Jenkinsfile
* ✅ How Jenkins is installed and set up

## 1. What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Delivery (or Deployment).**

It is a practice where every code change automatically goes through a series of steps — from **building** to **testing** to **deploying** — without manual intervention.

| Term                            | What it means                                                  |
| ------------------------------- | -------------------------------------------------------------- |
| **Continuous Integration (CI)** | Every code change is automatically built and tested            |
| **Continuous Delivery (CD)**    | Tested builds are automatically prepared for deployment        |
| **Continuous Deployment (CD)**  | Every validated change is automatically released to production |

### 💡 The Old Way vs. The CI/CD Way

**Before CI/CD:**

* Developers write code for weeks in separate branches
* Merge everything at the end → lots of conflicts
* Manual testing → takes days
* Manual deployment → human errors → production crashes 🔥

**With CI/CD:**

* Code is integrated continuously (small, frequent commits)
* Automated tests run on every change
* Deployment is automated and consistent
* Bugs are caught early → faster, safer releases ✅

## 2. The CI/CD Pipeline — Overview

A **pipeline** is a series of automated steps that your code goes through from commit to production.

### 🖼️ Our Pipeline Architecture

{% hint style="info" %}
_(Refer to the diagram shared in class)_
{% endhint %}

```
[Developer]
     ↓  (pushes code)
[GitHub]  ← webhook notifies Jenkins
     ↓
[Jenkins Pipeline]
     ↓
 ┌───────────────────────────────────────────────────┐
 │  Stage 1: Checkout Code                           │
 │  Stage 2: SonarQube Scan (Code Quality)           │
 │  Stage 3: Maven Build (.war / .jar file)          │
 │  Stage 4: Upload to JFrog Artifactory             │
 │  Stage 5: Docker Image Build & Push               │
 └───────────────────────────────────────────────────┘
     ↓  (CI complete → triggers CD)
 ┌─────────────────────┐     ┌──────────────────────┐
 │  Deploy to Tomcat   │     │  Deploy to Kubernetes │
 │  (via Ansible)      │     │  (via kubectl / EKS)  │
 └─────────────────────┘     └──────────────────────┘
```

## 3. Pipeline Stages Explained

### Stage 1: 📥 Code Checkout

* Jenkins **clones** the repository from GitHub into its **workspace**
* A **webhook** in GitHub automatically tells Jenkins when new code is pushed
* No manual triggering needed!

{% hint style="info" %}
**Workspace** = The folder on Jenkins server where your code is downloaded
{% endhint %}

### Stage 2: 🔍 SonarQube Scan (Code Quality)

SonarQube scans your code and checks for:

| Check               | What it means                       |
| ------------------- | ----------------------------------- |
| **Bugs**            | Logic errors in the code            |
| **Vulnerabilities** | Security weaknesses                 |
| **Code Smells**     | Messy code that is hard to maintain |
| **Code Coverage**   | How much of your code is tested     |
| **Duplications**    | Repeated/copy-pasted code blocks    |

**Quality Gate:**

* If the scan **passes** → pipeline continues ✅
* If the scan **fails** → pipeline is **aborted** ❌

{% hint style="info" %}
Think of SonarQube as a **code health check** — bad code cannot proceed!
{% endhint %}

### Stage 3: 🔨 Maven Build

**Maven** is a build tool for Java projects. It:

* Reads the `pom.xml` file to understand your project
* Compiles your code
* Runs unit tests
* Packages everything into a `.war` (Web Archive) or `.jar` file

**Common Maven command used in pipeline:**

```bash
mvn clean package
```

| Maven Goal | What it does                     |
| ---------- | -------------------------------- |
| `clean`    | Deletes old build files          |
| `compile`  | Compiles Java source code        |
| `test`     | Runs unit tests                  |
| `package`  | Creates the `.war` / `.jar` file |

### Stage 4: 📦 Upload to JFrog Artifactory

* The `.war` file created by Maven is uploaded to **JFrog Artifactory**
* Artifactory is like a **storage warehouse** for your build artifacts
* Every artifact is **versioned** — you can always go back to an older build
* Other teams and tools can download artifacts from here

{% hint style="info" %}
**Artifact** = The output of a build (e.g., `.war`, `.jar`, `.exe`)
{% endhint %}

### Stage 5: 🐳 Docker Image Build & Push

**Docker** packages your application + its runtime environment into a **container image**.

```dockerfile
# Example Dockerfile
FROM tomcat:9.0
COPY target/myapp.war /usr/local/tomcat/webapps/
EXPOSE 8080
```

* Jenkins builds the Docker image using the `Dockerfile` in your repo
* The image is pushed to **Docker Hub** or **AWS ECR** (container registry)
* This image can be deployed anywhere — consistent every time!

{% hint style="info" %}
**Docker image** = A portable package with your app + everything it needs to run
{% endhint %}

### Stage 6: 🚀 Deployment (CD)

After CI is complete, the **CD job** is triggered automatically.

{% tabs %}
{% tab title="Option A: Deploy to Tomcat (via Ansible)" %}
**Ansible** is a configuration management tool that automates deployment steps:

1. Download the `.war` from Artifactory to the Tomcat server
2. Stop the running Tomcat service
3. Take a backup of existing files
4. Copy new files to the correct location
5. Start Tomcat and verify the app is running
6. If something fails → **rollback** to the previous version
{% endtab %}

{% tab title="Option B: Deploy to Kubernetes (EKS)" %}
For containerized applications:

1. CD job checks out Kubernetes **manifest YAML files** from Git
2. Updates the manifest with the new Docker image tag
3. Runs `kubectl apply` to deploy to the EKS cluster
4. Jenkins verifies that pods are running
5. If deployment fails → inspect logs → rollback using `kubectl rollout undo`
{% endtab %}
{% endtabs %}

## 4. Tools Cheat Sheet

| Tool                  | What it does                                  |
| --------------------- | --------------------------------------------- |
| **GitHub**            | Stores source code; sends webhooks to Jenkins |
| **Jenkins**           | Runs the CI/CD pipeline automatically         |
| **SonarQube**         | Checks code quality and security              |
| **Maven**             | Builds Java projects into `.war`/`.jar` files |
| **JFrog Artifactory** | Stores build artifacts (versioned)            |
| **Docker**            | Packages apps into portable containers        |
| **Docker Hub / ECR**  | Stores Docker images                          |
| **Ansible**           | Automates deployment to traditional servers   |
| **Kubernetes (EKS)**  | Runs and manages containers at scale          |
| **Helm**              | Kubernetes package manager (like apt for K8s) |
| **Argo CD / Flux CD** | GitOps-based CD for Kubernetes                |

## 5. What is Jenkins?

**Jenkins** is an open-source automation server written in Java. It:

* Listens for triggers (code pushes, schedules, manual clicks)
* Runs pipeline stages one by one
* Reports build results (success ✅ / failure ❌)
* Integrates with 1800+ plugins (GitHub, Docker, Maven, Slack, etc.)

### Jenkins Server Stack

| Server           | Software                | AWS Instance | Port |
| ---------------- | ----------------------- | ------------ | ---- |
| Jenkins Server   | Java + Jenkins + Docker | T2.Medium    | 8080 |
| SonarQube Server | Docker + SonarQube      | T2.Medium    | 9000 |
| Tomcat Server    | Java + Tomcat           | T2.Micro     | 8080 |

## 6. Jenkins UI — Key Sections

| Section            | What you'll find                             |
| ------------------ | -------------------------------------------- |
| **Dashboard**      | List of all jobs with status indicators      |
| **New Item**       | Create a new job (pipeline, freestyle, etc.) |
| **Manage Jenkins** | Settings, plugins, nodes, security           |
| **Build History**  | Past builds with timestamps                  |
| **Console Output** | Real-time logs — use this to debug failures  |
| **Workspace**      | Files on the Jenkins server for a job        |
| **Credentials**    | Securely stored API keys and passwords       |

**Build Status Colors:**

* 🔵 **Blue** = Last build succeeded
* 🔴 **Red** = Last build failed
* ⚪ **Grey** = Job never run
* 🟡 **Yellow** = Unstable (tests partially failed)

## 7. Jenkins Pipeline Types

### Type 1: Declarative Pipeline ✅ (We'll use this)

Structured, readable. Great for beginners.

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'mvn clean package'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'mvn test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
            }
        }
    }
    post {
        success { echo '✅ Success!' }
        failure { echo '❌ Build failed. Check the logs.' }
    }
}
```

**Key blocks explained:**

| Block           | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `pipeline {}`   | Wraps the entire pipeline                         |
| `agent any`     | Use any available Jenkins node/server             |
| `stages {}`     | Contains all stages                               |
| `stage('name')` | A named step in the pipeline                      |
| `steps {}`      | Commands to run in that stage                     |
| `post {}`       | Runs after pipeline ends (success/failure/always) |

### Type 2: Scripted Pipeline

More flexible, Groovy-based. Used for complex workflows.

```groovy
node {
    stage('Build') {
        sh 'mvn clean package'
    }
    stage('Test') {
        sh 'mvn test'
    }
}
```

### Type 3: Multibranch Pipeline

* Jenkins automatically discovers **all branches** in a repo
* Runs a pipeline for each branch using that branch's `Jenkinsfile`
* Great for teams using **feature branches**

## 8. Jenkins Job Types

| Job Type                 | When to use                                        |
| ------------------------ | -------------------------------------------------- |
| **Freestyle Project**    | Simple tasks — run a script, build a project       |
| **Pipeline**             | Code-based pipelines using Jenkinsfile             |
| **Multibranch Pipeline** | One pipeline per Git branch, auto-discovered       |
| **Folder**               | Organize many jobs (like folders in a file system) |
| **GitHub Organization**  | Manage all repos in a GitHub org                   |

## 9. Jenkinsfile — Where Pipeline Lives

A **Jenkinsfile** is a text file that contains the pipeline definition. It lives in the **root of your repository**.

```
my-project/
├── src/
├── pom.xml
├── Dockerfile
└── Jenkinsfile   ← pipeline lives here
```

**Benefits of Jenkinsfile:**

* Pipeline is version-controlled alongside your code
* You can review and audit pipeline changes
* Different branches can have different pipelines

## 10. Sample CI Pipeline (Full)

```groovy
pipeline {
    tools {
        maven 'Maven3'
    }
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-org/your-app.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Maven Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Docker Build & Push') {
            steps {
                sh 'docker build -t myapp:latest .'
                sh 'docker push myrepo/myapp:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s-deployment.yaml'
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment successful!'
        }
        failure {
            echo '❌ Something went wrong. Check Console Output.'
        }
    }
}
```

## 11. Day 1 Lab — Jenkins Installation

### What we'll set up

{% stepper %}
{% step %}
## EC2 instance (T2.Medium) for Jenkins
{% endstep %}

{% step %}
## Install Java + Jenkins
{% endstep %}

{% step %}
## Install Docker on Jenkins server
{% endstep %}

{% step %}
## Access Jenkins UI at `http://<EC2-IP>:8080`
{% endstep %}
{% endstepper %}

### Quick Commands Reference

```bash
# Update system
sudo apt update -y

# Install Java 17
sudo apt install openjdk-17-jre -y

# Verify Java
java -version

# Install Jenkins (Ubuntu/Debian)
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | \
  sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update
sudo apt-get install jenkins -y

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### First Login Steps

{% stepper %}
{% step %}
## Open Jenkins

Open browser → `http://<your-ec2-ip>:8080`
{% endstep %}

{% step %}
## Enter the admin password

Paste the admin password from the command above.
{% endstep %}

{% step %}
## Install plugins

Select **"Install suggested plugins"**.
{% endstep %}

{% step %}
## Create an admin user

Create your admin user.
{% endstep %}

{% step %}
## Jenkins is ready! 🎉
{% endstep %}
{% endstepper %}

## 12. Key Concepts — Quick Reference

### What is a Webhook?

A **webhook** is a signal sent from GitHub to Jenkins whenever code is pushed.\
Jenkins doesn't constantly check GitHub — GitHub _tells_ Jenkins when something changes.

### What is an Artifact?

An **artifact** is the output of a build. For Java projects, this is usually a `.war` or `.jar` file. Artifacts are stored in JFrog Artifactory.

### What is a Quality Gate?

A **quality gate** in SonarQube is a set of rules your code must pass.\
Example: _"Code coverage must be above 80%"_\
If the gate fails → the pipeline stops.

### What is GitOps?

**GitOps** means your infrastructure and deployment configurations are stored in Git.\
Changes to deployments go through a Git commit/PR — giving full audit trails.

### What is a Container vs. a VM?

|             | Virtual Machine (VM) | Container (Docker) |
| ----------- | -------------------- | ------------------ |
| Size        | GBs                  | MBs                |
| Startup     | Minutes              | Seconds            |
| Isolation   | Full OS              | Process-level      |
| Portability | Limited              | High               |

## 13. Common Errors & How to Fix Them

| Error                       | Likely Cause                        | Fix                                        |
| --------------------------- | ----------------------------------- | ------------------------------------------ |
| Build failed at Maven stage | Missing dependency or pom.xml error | Check `Console Output` for the exact error |
| SonarQube scan timeout      | SonarQube server not running        | Verify server is up on port 9000           |
| Docker push fails           | Not logged in to registry           | Run `docker login` first                   |
| kubectl fails               | Wrong cluster config                | Run `aws eks update-kubeconfig`            |
| Jenkins can't access GitHub | Missing credentials                 | Add GitHub token in Jenkins Credentials    |

## 📝 Practice Exercises

### Exercise 1 — Read a Pipeline

Look at the sample Jenkinsfile above. Answer:

* How many stages does it have?
* What happens if the Quality Gate fails?
* What command builds the Maven project?

### Exercise 2 — Write a Simple Pipeline

Create a Jenkinsfile with 3 stages:

1. `Checkout` — print "Checking out code"
2. `Build` — run `echo "Building..."`
3. `Deploy` — print "Deploying..."

### Exercise 3 — Spot the Difference

Which of these is CI and which is CD?

* Compiling code after a commit → **CI**
* Running unit tests → **CI**
* Deploying the app to a test server → **CD**
* Pushing Docker image to a registry → **CI** (part of build)

## 📚 Further Reading

| Topic                  | Resource                                                |
| ---------------------- | ------------------------------------------------------- |
| Jenkins Documentation  | https://www.jenkins.io/doc/                             |
| SonarQube Docs         | https://docs.sonarsource.com/                           |
| Maven Guide            | https://maven.apache.org/guides/                        |
| Docker Getting Started | https://docs.docker.com/get-started/                    |
| Kubernetes Basics      | https://kubernetes.io/docs/tutorials/kubernetes-basics/ |
| GitOps Introduction    | https://www.gitops.tech/                                |

## ✅ Checklist — What You Should Know After This Class

* [ ] I can explain what CI and CD mean in simple terms
* [ ] I know the stages in a CI/CD pipeline
* [ ] I can name at least 5 tools used in a DevOps pipeline
* [ ] I can read a basic Jenkinsfile
* [ ] I understand what a webhook, quality gate, and artifact are
* [ ] I know the difference between Declarative and Scripted pipelines
* [ ] I can access Jenkins UI and locate key sections

_Student Handout | CI/CD Introduction — July 2026_

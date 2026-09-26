# Jenkins Tomcat Deployment Guide

> **Class:** Nimbus DevOps Training | **Topic:** Jenkins + Tomcat CI/CD\
> **Demo Repo:** `https://github.com/nimbuswiztech/maven_webapp.git`

## 📋 Prerequisites

Before you start, make sure you have the following ready:

| Requirement    | Details                                                                |
| -------------- | ---------------------------------------------------------------------- |
| Jenkins Server | Running (accessible at `http://<jenkins-ip>:8080`)                     |
| Tomcat Server  | Running (accessible at `http://<tomcat-ip>:8080`)                      |
| Maven          | Installed on the Jenkins server (or Jenkins Maven Tool configured)     |
| Java (JDK 8+)  | Installed on both Jenkins and Tomcat servers                           |
| SSH Key        | Jenkins server's public key added to Tomcat server's `authorized_keys` |

## 🏗️ Architecture Overview

```
Developer → GitHub → Jenkins → (SSH) → Tomcat Server
                         |
                   ┌─────▼─────┐
                   │  Pipeline  │
                   │ 1. Checkout│
                   │ 2. Test   │
                   │ 3. Build  │
                   │ 4. Approve│
                   │ 5. Deploy │
                   └───────────┘
```

## Part 1: Set Up the Tomcat Server

{% stepper %}
{% step %}
## Install Java on Ubuntu

Connect to your Tomcat server and install Java:

```bash
sudo apt update
sudo apt install -y openjdk-11-jdk
java -version
```
{% endstep %}

{% step %}
## Download and Install Tomcat

```bash
cd /opt
sudo wget https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.97/bin/apache-tomcat-9.0.97.tar.gz
sudo tar -xvzf apache-tomcat-9.0.97.tar.gz
sudo mv apache-tomcat-9.0.97 tomcat
sudo chmod +x /opt/tomcat/bin/*.sh
```
{% endstep %}

{% step %}
## Create a Tomcat systemd Service

Create a file to run Tomcat as a service so it auto-starts:

```bash
sudo nano /etc/systemd/system/tomcat.service
```

Paste the following content:

```ini
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking
Environment=JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
Environment=CATALINA_PID=/opt/tomcat/temp/tomcat.pid
Environment=CATALINA_HOME=/opt/tomcat
Environment=CATALINA_BASE=/opt/tomcat
ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh
User=ubuntu
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).
{% endstep %}

{% step %}
## Start Tomcat and Enable on Boot

```bash
sudo systemctl daemon-reload
sudo systemctl start tomcat
sudo systemctl enable tomcat
sudo systemctl status tomcat
```

{% hint style="success" %}
You should see **active (running)** in the output.
{% endhint %}
{% endstep %}

{% step %}
## Verify Tomcat in Browser

Open a browser and navigate to:

```
http://<YOUR_TOMCAT_SERVER_IP>:8080
```

You should see the default Apache Tomcat welcome page.
{% endstep %}
{% endstepper %}

## Part 2: Configure Jenkins

{% stepper %}
{% step %}
## Install Required Jenkins Plugins

1. Go to **Manage Jenkins → Plugins → Available Plugins**.
2. Search for and install the following:
   * **SSH Agent** (to deploy via SSH using stored credentials)
   * **Pipeline** (if not already installed)
3. Click **Install** and restart Jenkins when prompted.
{% endstep %}

{% step %}
## Add SSH Credentials to Jenkins

Jenkins needs the SSH private key to authenticate to the Tomcat server.

1. Go to **Manage Jenkins → Credentials → System → Global credentials**.
2. Click **+ Add Credentials**.
3. Fill in the details:
   * **Kind:** SSH Username with private key
   * **ID:** `tomcat` _(This ID must match the one in the Jenkinsfile)_
   * **Description:** Tomcat Server SSH Key
   * **Username:** `ubuntu`
   * **Private Key:** Select _Enter directly_, then paste your private key (`~/.ssh/id_rsa` content from your Jenkins server).
4. Click **Create**.

{% hint style="warning" %}
**Important:** The `ID` field value (`tomcat`) must exactly match what is written inside `sshagent(['tomcat'])` in the Jenkinsfile.
{% endhint %}
{% endstep %}

{% step %}
## Configure Maven in Jenkins

1. Go to **Manage Jenkins → Tools**.
2. Scroll to **Maven installations** and click **Add Maven**.
3. Give it a name (e.g., `Maven3`), check **Install automatically**, and select version `3.9.x`.
4. Click **Save**.
{% endstep %}
{% endstepper %}

## Part 3: Set Up SSH Key Authentication Between Jenkins and Tomcat

{% stepper %}
{% step %}
## Generate SSH Key on Jenkins Server

SSH into your Jenkins server and run:

```bash
ssh-keygen -t rsa -b 4096 -C "jenkins-deploy-key"
# Press Enter for all prompts (no passphrase)
cat ~/.ssh/id_rsa.pub
# Copy the output
```
{% endstep %}

{% step %}
## Add the Public Key to the Tomcat Server

SSH into your Tomcat server and add the key:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key here, save and exit
chmod 600 ~/.ssh/authorized_keys
```
{% endstep %}

{% step %}
## Test the Connection

Back on the Jenkins server, test the connection:

```bash
ssh -o StrictHostKeyChecking=no ubuntu@<TOMCAT_IP> "echo Connection successful"
```

{% hint style="success" %}
You should see `Connection successful` printed.
{% endhint %}
{% endstep %}
{% endstepper %}

## Part 4: Create the Jenkins Pipeline Job

{% stepper %}
{% step %}
## Create a New Pipeline Job

1. From the Jenkins Dashboard, click **+ New Item**.
2. Enter a name: `nimbus-tomcat-deploy`.
3. Select **Pipeline** and click **OK**.
{% endstep %}

{% step %}
## Configure the Pipeline

Scroll down to the **Pipeline** section and choose one of two options:

{% tabs %}
{% tab title="Option A: Paste Directly (for demo)" %}
* Set **Definition** to _Pipeline script_.
* Paste the Jenkinsfile content directly.
{% endtab %}

{% tab title="Option B: From SCM (Production best practice)" %}
* Set **Definition** to _Pipeline script from SCM_.
* **SCM:** Git
* **Repository URL:** `https://github.com/nimbuswiztech/maven_webapp.git`
* **Branch:** `*/main`
* **Script Path:** `Jenkinsfile`
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
## The Complete Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        TOMCAT_IP       = '18.60.154.214'       // <<< Replace with your Tomcat server IP
        TOMCAT_USER     = 'ubuntu'
        TOMCAT_WEBAPPS  = '/opt/tomcat/webapps'
        WAR_NAME        = 'nimbus-webapp.war'
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Cloning the repository...'
                git branch: 'main', url: 'https://github.com/nimbuswiztech/maven_webapp.git'
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running unit tests...'
                sh 'mvn test'
            }
        }

        stage('Build WAR') {
            steps {
                echo 'Building the WAR file...'
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Approval') {
            steps {
                script {
                    input message: 'Deploy to Tomcat? Click Approve to continue.', ok: 'Approve & Deploy'
                }
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                echo "Deploying ${WAR_NAME} to Tomcat at ${TOMCAT_IP}..."
                sshagent(['tomcat']) {
                    sh "scp -o StrictHostKeyChecking=no target/${WAR_NAME} ${TOMCAT_USER}@${TOMCAT_IP}:/tmp/"
                    sh "ssh -o StrictHostKeyChecking=no ${TOMCAT_USER}@${TOMCAT_IP} 'sudo mv /tmp/${WAR_NAME} ${TOMCAT_WEBAPPS}/'"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployed! Access at http://${TOMCAT_IP}:8080/nimbus-webapp"
        }
        failure {
            echo "❌ Pipeline failed. Check the logs."
        }
        always {
            cleanWs()
        }
    }
}
```
{% endstep %}
{% endstepper %}

## Part 5: Run the Pipeline

{% stepper %}
{% step %}
## Trigger the Build

1. Go to your `nimbus-tomcat-deploy` job.
2. Click **▶ Build Now** on the left sidebar.
3. Click on the build number (e.g., `#1`) and then **Console Output** to watch it in real time.
{% endstep %}

{% step %}
## Approve the Deployment

The pipeline will **pause** at the `Approval` stage and show an **input prompt**:

1. You will see a message: _"Deploy to Tomcat? Click Approve to continue."_
2. Click **Approve & Deploy** to proceed.
3. The `Deploy to Tomcat` stage will then execute.
{% endstep %}

{% step %}
## Verify the Deployment on Tomcat

Open a browser and navigate to:

```
http://<YOUR_TOMCAT_SERVER_IP>:8080/nimbus-webapp
```

{% hint style="success" %}
You should see the **Nimbus Demo App** page loaded successfully.
{% endhint %}
{% endstep %}
{% endstepper %}

## Part 6: Understanding the Pipeline Flow

```
[Stage 1] Checkout Code
     │ git clone from GitHub
     ▼
[Stage 2] Unit Test
     │ mvn test
     ▼
[Stage 3] Build WAR
     │ mvn clean package → target/nimbus-webapp.war
     ▼
[Stage 4] Approval (Manual Gate)
     │ Human clicks "Approve & Deploy"
     ▼
[Stage 5] Deploy to Tomcat
     │ scp target/nimbus-webapp.war → ubuntu@<IP>:/tmp/
     │ ssh → sudo mv /tmp/nimbus-webapp.war /opt/tomcat/webapps/
     │ Tomcat auto-detects & deploys the WAR
     ▼
[Post] Cleanup workspace (cleanWs)
```

## 🔧 Troubleshooting Common Errors

| Error                                  | Cause                                     | Fix                                                                             |
| -------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| `Permission denied (publickey)`        | SSH key not added to Tomcat server        | Re-do Part 3 and verify `authorized_keys`                                       |
| `No version specified for library`     | Missing branch in `@Library` annotation   | Use `@Library('name@main') _`                                                   |
| `mvn: command not found`               | Maven not installed/configured in Jenkins | Configure Maven in **Manage Jenkins → Tools**                                   |
| `ERROR: No such DSL method 'sshagent'` | SSH Agent plugin not installed            | Install the **SSH Agent** plugin in Jenkins                                     |
| WAR deployed but page shows 404        | WAR name mismatch                         | Ensure `<finalName>` in `pom.xml` matches `WAR_NAME` in Jenkinsfile             |
| `sudo: permission denied`              | Ubuntu user lacks sudo for Tomcat path    | Run `sudo visudo` on Tomcat server and add `ubuntu ALL=(ALL) NOPASSWD: /bin/mv` |

## ✅ Summary

In this guide, you learned how to:

1. **Install and configure** Apache Tomcat on an Ubuntu server.
2. **Set up Jenkins** with the SSH Agent plugin and SSH credentials.
3. **Establish SSH key-based authentication** between Jenkins and Tomcat (passwordless).
4. **Write a Jenkins Declarative Pipeline** with 5 stages: Checkout → Test → Build → Approve → Deploy.
5. **Deploy a Maven WAR file** to Tomcat using `scp` over SSH.
6. **Verify** the deployed application in the browser.

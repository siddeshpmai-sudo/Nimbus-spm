# 🚀 Mini Project – Build and Deploy a Java Web App to Tomcat using Jenkins

> **Batch:** Nimbus DevOps Training  
> **Topics:** Jenkins CI/CD + Tomcat Deployment

---

## 📌 Objective

Set up a complete CI/CD pipeline that checks out a Java Maven project from GitHub, builds a WAR file, and deploys it to a Tomcat server automatically using Jenkins.

```
Developer → GitHub → Jenkins → (SSH) → Tomcat Server
                        |
                  ┌─────▼─────┐
                  │  Pipeline  │
                  │ 1. Checkout│
                  │ 2. Test    │
                  │ 3. Build   │
                  │ 4. Approve │
                  │ 5. Deploy  │
                  └────────────┘
```

**Source Code Repo:** `https://github.com/nimbuswiztech/maven_webapp.git`

---

## Step 1 – Set Up Tomcat Server

On an Ubuntu server:

1. Install Java (OpenJDK 11 or 17)
2. Download and install **Apache Tomcat 9** in `/opt/tomcat`
3. Start Tomcat and verify it works at `http://<TOMCAT_IP>:8080`

📸 **Screenshot:** Tomcat default page running in the browser

---

## Step 2 – Set Up Jenkins Server

On an Ubuntu server (can be the same or different machine):

1. Install Java and Jenkins
2. Complete Jenkins initial setup (unlock, install plugins, create admin user)
3. Install the following plugins:
   - **Maven Integration**
   - **SSH Agent**
   - **Git**
4. Configure Maven in **Manage Jenkins → Tools** (name it `Maven3`)

📸 **Screenshot:** Jenkins dashboard after setup

---

## Step 3 – Configure SSH Between Jenkins and Tomcat

1. Generate an SSH key pair on the Jenkins server
2. Copy the public key to the Tomcat server's `~/.ssh/authorized_keys`
3. Add the private key as a **Jenkins Credential** (type: SSH Username with private key, ID: `tomcat-ssh`)
4. Verify: SSH from Jenkins server to Tomcat server without a password

📸 **Screenshot:** Successful passwordless SSH connection

---

## Step 4 – Write the Jenkins Pipeline

Create a **Jenkinsfile** with the following stages:

| Stage | What It Does |
|---|---|
| **Checkout** | Clone the Maven webapp repo from GitHub (branch: `main`) |
| **Test** | Run `mvn test` |
| **Build** | Run `mvn clean package -DskipTests` to create the WAR file |
| **Approval** | Manual approval gate using `input` step |
| **Deploy** | Use `sshagent` to SCP the WAR file to Tomcat's `/opt/tomcat/webapps/` |

**Requirements:**
- Use an `environment` block for Tomcat IP, username, and webapps path
- Use a `post` block with `success`, `failure`, and `always` (clean workspace)

📸 **Screenshot:** Successful pipeline run – all stages green ✅

---

## Step 5 – Verify Deployment

1. After successful pipeline run, open the browser
2. Navigate to `http://<TOMCAT_IP>:8080/nimbus-webapp`
3. The application should be live and running on Tomcat

📸 **Screenshots:**
- Jenkins pipeline – all stages passed ✅
- Application running in the browser on Tomcat

---

## 📂 Submission

Push everything to a **GitHub repository** named `jenkins-assignment`:

```
jenkins-assignment/
│
├── README.md               ← Your name, batch, date
├── Jenkinsfile             ← Your deployment pipeline
└── screenshots/
    ├── 01-tomcat-running.png
    ├── 02-jenkins-dashboard.png
    ├── 03-ssh-connection.png
    ├── 04-pipeline-success.png
    └── 05-app-in-browser.png
```

---

## ⚠️ Important Notes

- If you face issues, document them in `README.md` along with how you resolved them.
- **Bonus Challenge:** Add a **6th stage** that sends an email notification on pipeline failure using the `emailext` plugin.

---

> **Take it step by step – setup servers first, then SSH, then the pipeline. Good luck!** 🚀

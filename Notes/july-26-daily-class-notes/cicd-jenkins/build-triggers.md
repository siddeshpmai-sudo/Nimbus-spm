# build triggers

## Different Types of Build Triggers in Jenkins with Real-Time Examples

### 🔹 Poll SCM

**Use Case:** Automatically build when code changes are pushed to Git (without a webhook).

**Scenario:** You want Jenkins to check the Git repository every 5 minutes. If changes are detected, it should trigger a build.

{% stepper %}
{% step %}
### Steps to demo

Go to your Jenkins job → **Configure**, scroll to **Build Triggers**, check ✅ **Poll SCM**.
{% endstep %}

{% step %}
In the **Schedule** box, enter:

```
H/5 * * * *
```

(This means: check every 5 minutes)
{% endstep %}

{% step %}
Save the job. Make a commit in your Git repo → push to the remote. Jenkins will poll every 5 minutes and run a build if it detects changes.
{% endstep %}
{% endstepper %}

### 🔹 Build Periodically

**Use Case:** Run builds at scheduled times (like cron jobs).

**Scenario:** You want to run a job every night at 1 AM to back up logs or run a report.

{% stepper %}
{% step %}
Jenkins job → **Configure**, under **Build Triggers**, check ✅ **Build periodically**.
{% endstep %}

{% step %}
Add schedule:

```
CopyEdit0 1 * * *
```

(This means: run at 1:00 AM every day)
{% endstep %}

{% step %}
Save → Wait for the scheduled time → Jenkins runs the job automatically.
{% endstep %}
{% endstepper %}

### 🔹 GitHub Hook Trigger for GITScm Polling

**Use Case:** Trigger builds instantly when changes are pushed to GitHub.

**Scenario:** As soon as a developer pushes code to GitHub, Jenkins should run the job (faster than polling).

{% stepper %}
{% step %}
Jenkins job → **Configure**, under **Build Triggers**, check ✅ **GitHub hook trigger for GITScm polling**. Save the job.
{% endstep %}

{% step %}
Go to GitHub repo → **Settings → Webhooks**. Add a new webhook:

* Payload URL: `http://<your-jenkins-url>/github-webhook/`
* Content type: `application/json`
* Choose: **Just the push event**
{% endstep %}

{% step %}
Push a commit to GitHub → Jenkins job triggers instantly.
{% endstep %}
{% endstepper %}

### 🔹 Trigger Builds Remotely (with Authentication Token)

**Use Case:** Trigger Jenkins jobs from external systems (like scripts, other tools, or pipeline integrations).

**Scenario:** You want to run a job from a custom Python script using a Jenkins API call.

{% stepper %}
{% step %}
Jenkins job → **Configure**, check ✅ **Trigger builds remotely**, enter a token (e.g., `mytoken123`). Save.
{% endstep %}

{% step %}
URL format:

```
http://<jenkins-url>/job/<job-name>/build?token=mytoken123
```
{% endstep %}

{% step %}
Run from browser or CURL:

```bash
curl http://<jenkins-url>/job/<job-name>/build?token=mytoken123
```
{% endstep %}
{% endstepper %}

#### Add a Token to a Jenkins Job

{% stepper %}
{% step %}
Login to Jenkins → Go to your Freestyle job or create a new one. Click **Configure** for that job.
{% endstep %}

{% step %}
Scroll down to **Build Triggers** section. Check ✅ **Trigger builds remotely (e.g., from scripts)**.
{% endstep %}

{% step %}
In the **Authentication Token** field, enter a token like:

```
nginxCopyEditmysecrettoken123
```

Click **Save**.
{% endstep %}
{% endstepper %}

#### Trigger the Build Using the Token

Now you can trigger this job remotely using a browser or script.

**URL Format:**

```
http://<jenkins-host>:<port>/job/<job-name>/build?token=<your-token>
```

Example: If your Jenkins is running on `http://localhost:8080`, job name is `my-job`, and token is `mysecrettoken123`, then:

```
http://localhost:8080/job/my-job/build?token=mysecrettoken123
```

Example CURL command from the original content:

```bash
curl -u "admin:1a2b3c4d5e6f7g" "http://44.223.61.165:8080/job/test-job/build?token=mytoken123"
```

### 🔹 Build After Other Projects Are Built

**Use Case:** Chain jobs (Job A triggers Job B after success).

**Scenario:** You want to run a testing job only after the deployment job finishes.

{% stepper %}
{% step %}
Create two jobs: **Job-A** and **Job-B**.
{% endstep %}

{% step %}
Go to **Job-B** → **Configure**, under **Build Triggers**, check ✅ **Build after other projects are built**, enter: `Job-A`. Save.
{% endstep %}

{% step %}
Run **Job-A** → After completion, **Job-B** starts automatically.
{% endstep %}
{% endstepper %}

### 🔹 Parameterized Trigger (Advanced Using Plugins)

**Use Case:** Trigger another job and pass parameters.

**Scenario:** Job A deploys an app, and then Job B runs a test suite with environment as a parameter.

{% stepper %}
{% step %}
Install **Parameterized Trigger Plugin**.
{% endstep %}

{% step %}
Go to **Job-A** → Configure. Under **Post-build Actions**, choose **Trigger parameterized build on other projects**.
{% endstep %}

{% step %}
Enter job name: `Job-B`. Pass parameter: `ENV=dev`. Save and run → Job-B is triggered with `ENV=dev`.
{% endstep %}
{% endstepper %}

### 🔹 Scripted Trigger via Pipeline (Using `triggers {}` Block in Jenkinsfile)

**Scenario:** You want to define triggers as code inside the Jenkinsfile.

Sample Jenkinsfile (from original content):

```groovy
groovyCopyEditpipeline {
    triggers {
        pollSCM('H/5 * * * *')   // Equivalent to Poll SCM
    }
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}
```

{% hint style="info" %}
### Teaching Tip

* Start with a Freestyle project.
* Show a simple job first (like printing date or echo "Build triggered").
* Gradually show one trigger at a time.
* Use GitHub + webhook + Poll SCM for real-world impact.
* Allow students to test triggering via CURL or Git push.
{% endhint %}

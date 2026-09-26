# elastic beanstalk

Master AWS Platform as a Service (PaaS). Understand application and environment hierarchies, zero-downtime rolling deployment strategies, and execute a 100% AWS Console lab deploying and updating a live production web service.

## What is AWS Elastic Beanstalk?

**AWS Elastic Beanstalk** is a managed Platform as a Service (PaaS) that allows developers to deploy, manage, and scale web applications without dealing with the low-level complexity of configuring EC2 instances, Auto Scaling groups, Application Load Balancers, or OS patches.

{% hint style="info" %}
**Zero Service Fee:** Elastic Beanstalk itself is completely free ($0.00). You only pay for the underlying AWS resources (e.g. EC2 instances, ALBs, S3 version storage) that Beanstalk provisions in your account.
{% endhint %}

### The Cloud Computing Spectrum

| Paradigm       | AWS Example               | Your Responsibility                                                | AWS Responsibility                                                         |
| -------------- | ------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **IaaS**       | Amazon EC2                | OS patching, scaling scripts, web server configuration, networking | Physical hardware & hypervisor                                             |
| **PaaS**       | **AWS Elastic Beanstalk** | **Application code & environment variables**                       | **Capacity provisioning, load balancing, auto scaling, health monitoring** |
| **CaaS**       | Amazon ECS / EKS          | Container definitions, Dockerfiles, pod networking                 | Container control plane                                                    |
| **Serverless** | AWS Lambda                | Function handler code only                                         | Event triggering, cold starts, automatic execution scaling                 |

## Core Architecture & Key Components

### 📦 Application

The logical container. Think of it as a folder in your workspace containing your project’s environments, application versions, and saved configurations.

### 📄 Application Version

A specific, labeled iteration of your deployable code (e.g. a `.zip` file or Docker container image) stored permanently in Amazon S3. You can deploy or roll back to any version instantly.

### 🌐 Environment

A live, running collection of AWS resources executing a specific Application Version (e.g. `devops-app-dev` vs `devops-app-prod`).

### Environment Tiers: Web Server vs Worker

{% columns %}
{% column %}
#### Web Server Tier

* Handles standard HTTP/HTTPS user web traffic.
* Provisions Route 53 CNAME, Application Load Balancer (ALB), and Auto Scaling EC2 instances running Nginx reverse proxy pointing to your code runtime.
{% endcolumn %}

{% column %}
#### Worker Tier

* Processes background tasks (PDF generation, database exports, heavy calculations).
* Automatically provisions an Amazon SQS queue and an EC2 background daemon (`sqsd`) that pulls messages and forwards them as HTTP POSTs to your app on `http://localhost/`.
{% endcolumn %}
{% endcolumns %}

## Why Use Elastic Beanstalk in Enterprise DevOps?

### ⚡ Fastest Time to Market

Launch a production-grade, auto-scaling web application in 5 minutes. No need to write 500 lines of Terraform or configure load balancer listeners by hand.

### 🔓 Zero Vendor Lock-In

Unlike restrictive proprietary PaaS providers, Elastic Beanstalk deploys standard AWS resources (EC2, VPC, ALB, CloudWatch). You maintain 100% control and can SSH into any instance anytime.

### 🔄 Managed Platform Updates

AWS automatically patches the underlying Linux OS and runtime (e.g. Node.js minor updates) during scheduled weekly maintenance windows without application downtime.

### 🛠️ Advanced Customization (.ebextensions)

Drop YAML config files into your `.ebextensions/` folder to install yum packages, set environment cron jobs, or mount EFS storage automatically during deployment.

## 5 Real-World DevOps Production Use Cases

{% stepper %}
{% step %}
### Blue/Green Zero-Downtime Deployments

Deploy Version 2 into a Green environment. Test with live integration suites. Click **"Swap Environment URLs"** in the AWS Console. CNAME DNS records swap in seconds. If an issue occurs, swap back immediately.
{% endstep %}

{% step %}
### Asynchronous SQS Queue Offloading

Decouple user-facing web requests from heavy computation. Web tier pushes job payloads to SQS; Worker tier scales automatically based on queue depth to process tasks.
{% endstep %}

{% step %}
### Ephemeral Pull Request (PR) Environments

CI/CD automation triggers Elastic Beanstalk to clone existing environments for feature branch testing. Developers test their isolated changes on a live URL, and the environment is terminated upon merge.
{% endstep %}

{% step %}
### Golden Server Configuration via .ebextensions

Standardize server configuration across development and production environments using YAML files checked directly into Git source control.
{% endstep %}

{% step %}
### Multi-Container Docker Workloads

Deploy containerized applications (using Docker Compose) without the operational overhead of setting up and maintaining a full Kubernetes (EKS) cluster.
{% endstep %}
{% endstepper %}

## Hands-on Lab: 100% AWS Console Walkthrough

Complete each of the 7 steps below in your AWS Management Console.

{% stepper %}
{% step %}
### Verify EC2 Instance Profile in IAM Console

**Estimated: 5 mins**

In modern AWS accounts, Elastic Beanstalk requires an IAM EC2 instance profile to communicate with the service. Let's make sure it exists!

1. Open AWS Console ➔ Search and open IAM.
2. Click Roles in the left navigation sidebar.
3. Search for `aws-elasticbeanstalk-ec2-role`.
   * **If it exists:** Great! Move to Step 2.
   * **If not:** Click Create role ➔ Choose _AWS service_ ➔ _EC2_ ➔ Attach policies: `AWSElasticBeanstalkWebTier`, `AWSElasticBeanstalkWorkerTier`, `AWSElasticBeanstalkMulticontainerDocker` ➔ Name it `aws-elasticbeanstalk-ec2-role` ➔ Click _Create role_.
{% endstep %}

{% step %}
### Create Elastic Beanstalk Application & Environment

**Estimated: 6 mins**

1. Search and open Elastic Beanstalk in the AWS Console (Ensure region is e.g. `us-east-1`).
2. Click the orange button: Create application.
3. **Application name:** `devops-express-app`\
   **Environment tier:** Web server environment\
   **Environment name:** `devops-express-prod`\
   **Domain:** Click Check availability to ensure your subdomain is unique.
4. **Platform:** Choose Node.js.\
   **Platform branch:** Choose Node.js 20 running on 64-bit Amazon Linux 2023.\
   **Application code:** Select Sample application.
5. **Presets:** Choose Single instance (free-tier eligible). Click Next.
{% endstep %}

{% step %}
### Attach Service Role & EC2 Instance Profile

**Estimated: 4 mins**

1. **Service role:** Select Use an existing service role ➔ `aws-elasticbeanstalk-service-role` (or create new).
2. **EC2 instance profile:** Select aws-elasticbeanstalk-ec2-role (the role verified in Step 1).
3. Click Next ➔ Click Next on Networking to keep default VPC.
{% endstep %}

{% step %}
### Configure Environment Properties & Submit Launch

**Estimated: 6 mins**

1. Click Next past Instance traffic & scaling.
2. On Step 5 (Configure updates, monitoring, and logging): Scroll down to Environment properties and click Add property:
   * `NODE_ENV` = `production`
   * `APP_MESSAGE` = `"Hello from Elastic Beanstalk Masterclass!"`
3. Click Next ➔ Review summary ➔ Click Submit!
4. Wait \~3-4 minutes. Watch the console event log transition from _createEnvironment is starting_ to _Environment health has transitioned to OK_.
{% endstep %}

{% step %}
### Test Live URL & Deploy Version 2

**Estimated: 5 mins**

1. In your Elastic Beanstalk environment dashboard, click the public CNAME URL at the top. Notice the default sample app is running with a green **Health: OK** badge!
2. Create a local file `app.js` with the code below, and compress it into a zip file named `v2.zip`:

**app.js (for Version 2)**

```javascript
const http = require('http'); const port = process.env.PORT || 8080; const message = process.env.APP_MESSAGE || 'Version 2.0 Running!'; const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(\` <!DOCTYPE html> <html> <body style="background:#090d16;color:#38bdf8;font-family:sans-serif;text-align:center;padding:50px;"> <h1>🚀 AWS Elastic Beanstalk v2.0 Live!</h1> <p style="color:#94a3b8;font-size:1.2rem;">${message}</p> <div style="background:#171f33;padding:15px;border-radius:10px;display:inline-block;margin-top:20px;border:1px solid #10b981;"> <span style="color:#10b981;font-weight:bold;">● Health Status: OK (200)</span> </div> </body> </html> \`); }); server.listen(port, () => { console.log(\`Server running on port ${port}\`); });
```

3. In the Beanstalk console, click Upload and deploy ➔ Choose your `v2.zip` ➔ Version label: `v2.0-enhanced` ➔ Click Deploy.
4. Refresh the public URL to verify your updated application is live!
{% endstep %}

{% step %}
### Retrieve Application Logs from the Console

**Estimated: 4 mins**

1. In the left navigation menu of your environment, click Logs.
2. Click the Request logs dropdown ➔ select Last 100 lines.
3. Click Download once ready. Open the text file and inspect `/var/log/web.stdout.log`. Notice how your console logs are captured without requiring SSH access!
{% endstep %}

{% step %}
### Clean-up & Safe Environment Termination

**Estimated: 3 mins**

1. In your environment dashboard, click Environment actions ➔ Terminate environment.
2. Type the environment name to confirm and click Terminate.
3. Navigate to Applications ➔ Select `devops-express-app` ➔ Actions ➔ Delete application to avoid any recurring storage fees.
{% endstep %}
{% endstepper %}

## Elastic Beanstalk Quick Reference Cheatsheet

| Deployment Policy                 | Downtime? | Speed                  | When to Use?                                                                       |
| --------------------------------- | --------- | ---------------------- | ---------------------------------------------------------------------------------- |
| **All at Once**                   | ⚠️ Yes    | ⚡ Fastest              | Dev/test environments where downtime is acceptable.                                |
| **Rolling**                       | ❌ No      | ⏱️ Moderate            | Production when capacity drop during update is acceptable.                         |
| **Rolling with Additional Batch** | ❌ No      | ⏱️ Moderate            | Production where 100% capacity must be maintained throughout.                      |
| **Immutable**                     | ❌ No      | 🐢 Slowest             | Mission-critical production where failed updates must not touch running instances. |
| **Blue/Green (URL Swap)**         | ❌ No      | ⚡ Instant CNAME switch | Major version upgrades, database migrations, instant rollback needs.               |

### Procfile & .ebextensions Configuration

#### Procfile Example

Place in the root of your application zip to specify your start command:

```
web: node app.js
```

#### .ebextensions/01\_packages.config

Install custom Linux packages during EC2 boot:

```yaml
packages: yum: htop: [] git: []
```

## Troubleshooting Common Elastic Beanstalk Errors

<details>

<summary>❌ "The environment must have an instance profile"</summary>

**Cause:** You did not select an IAM EC2 Instance Profile during the launch wizard.

**Fix:** Create role `aws-elasticbeanstalk-ec2-role` with policy `AWSElasticBeanstalkWebTier` and select it in the Service Access step.

</details>

<details>

<summary>⚠️ 502 Bad Gateway (Nginx)</summary>

**Cause:** Nginx reverse proxy is running, but your Node.js app crashed on startup or is not listening on `process.env.PORT` (default: 8080).

**Fix:** Check `/var/log/web.stdout.log` via Request Logs in the console. Ensure your code listens on `process.env.PORT || 8080`.

</details>

<details>

<summary>🔍 Health: Degraded / Severe</summary>

**Cause:** The load balancer health check received non-200 HTTP responses (e.g. 404 or 500) from your application path `/`.

**Fix:** Ensure your root path `GET /` returns HTTP 200 OK.

</details>

## Knowledge Check: Test Your Elastic Beanstalk Skills

1.  How much does AWS charge for the Elastic Beanstalk service itself?

    A) $0.00 (Free service; you only pay for underlying EC2/ALB/S3 resources)

    B) $15.00 per environment per month

    C) $0.10 per deployed application version

    D) 10% surcharge on EC2 instance costs
2.  Which deployment policy launches a temporary duplicate Auto Scaling group to test the new version before terminating old instances?

    A) All at once

    B) Rolling

    C) Immutable

    D) In-place patch
3.  In a Worker Tier environment, what component polls messages from Amazon SQS and sends them to your web app?

    A) AWS Lambda trigger

    B) The local `sqsd` (SQS Daemon) running on the EC2 instance

    C) Application Load Balancer path routing

    D) CloudWatch Events Bridge

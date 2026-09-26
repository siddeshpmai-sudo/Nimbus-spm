# ECS ECR

Master containerized orchestration on AWS. Understand Docker image registries (ECR), task definitions, serverless execution on AWS Fargate, and deploy a live containerized web application using the AWS Console.

## What is Amazon ECS and Amazon ECR?

### 📦 Amazon ECR (Elastic Container Registry)

A secure, highly available Docker and OCI container registry. Features:

* **Private & Public Repositories:** Store proprietary microservices privately or publish open-source images publicly.
* **Automated CVE Scanning:** Automatically scans images on push using the CVE database to catch security vulnerabilities before deployment.
* **Lifecycle Policies:** Automatically expires untagged or old images to prevent ballooning storage costs.

### ⚙️ Amazon ECS (Elastic Container Service)

A fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications. Features:

* **AWS Fargate Serverless:** Run containers on-demand without provisioning or patching EC2 virtual machines.
* **Task Roles:** Grant IAM permissions directly to individual containers rather than the host server.
* **Native ALB Integration:** Distributes traffic dynamically across running container tasks with automated health checking.

{% hint style="info" %}
**IAM Roles Demystified:**

* **Task Execution Role:** Gives the ECS Agent permission to pull images from ECR and push stdout logs to CloudWatch.
* **Task Role:** Gives your containerized application code permission to access AWS services (e.g. S3, DynamoDB, SQS).
{% endhint %}

## ECS Architecture & Core Concepts

{% stepper %}
{% step %}
### Cluster

A logical grouping of tasks or services. When using AWS Fargate, the cluster requires zero EC2 instances and creates in seconds.
{% endstep %}

{% step %}
### Task Definition

The blueprint for your application. A JSON file specifying the container image, CPU, memory, port mappings, environment variables, and logging.
{% endstep %}

{% step %}
### Task

A single running instantiation of a Task Definition. An ephemeral container instance with its own private ENI and IP address.
{% endstep %}

{% step %}
### Service

Maintains your desired task count (e.g. 2 copies). If a container crashes, the Service automatically launches a healthy replacement.
{% endstep %}
{% endstepper %}

## Why Use AWS ECS Over Kubernetes?

| Factor                       | Amazon ECS (with Fargate)                      | Kubernetes (Amazon EKS)                                     |
| ---------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| **Control Plane Management** | ✅ Fully managed & invisible (Zero maintenance) | ⚠️ Requires Kubernetes cluster upgrades, etcd maintenance   |
| **Configuration Complexity** | ⚡ Simple JSON Task Definitions                 | 📜 Complex YAML manifests, Ingress controllers, Helm charts |
| **IAM Integration**          | 🔒 Native IAM Task Roles built-in              | 🔧 Requires OIDC provider and IRSA setup                    |
| **Learning Curve**           | 🚀 \~1 day for DevOps engineers                | 📚 Weeks/months to master Kubernetes fundamentals           |

## 5 Real-World DevOps Production Use Cases

### 1. Microservices with ALB Path Routing

Host dozens of microservices behind a single Application Load Balancer. Route `/auth/*` to Authentication ECS Service and `/billing/*` to Billing ECS Service.

### 2. Automated CI/CD Container Pipelines

GitHub Actions or AWS CodePipeline builds a Docker container, tags it with the Git commit hash, pushes it to ECR, and executes a zero-downtime rolling update on ECS.

### 3. Scheduled Ephemeral Batch Jobs

Run nightly database backups or analytics ETL jobs using Amazon EventBridge cron rules triggering an ECS Fargate task that runs for 5 minutes and terminates.

### 4. Cost Optimization with Fargate Spot

Run stateless queue-processing worker containers on spare AWS serverless capacity for up to a 70% discount compared to on-demand Fargate pricing.

### 5. DevSecOps Vulnerability Gating

ECR automated scanning inspects container layers for known security vulnerabilities. Amazon EventBridge triggers automated security alerts if critical CVEs are detected.

## Hands-on Lab: 100% AWS Console Walkthrough

Complete each of the 7 steps below in your AWS Management Console.

{% stepper %}
{% step %}
### Create an Amazon ECR Private Repository

_Estimated: 5 mins_

* Open AWS Console ➔ Search and open Elastic Container Registry (ECR). (Ensure region is e.g. `us-east-1`).
* In the left navigation menu under _Repositories_, click Private repositories.
* Click the orange button: Create repository.
* **Repository name:** `devops-web-repo`. **Tag immutability:** Toggle to Enabled (prevents image tag tampering). **Scan on push:** Toggle to Enabled (triggers automated CVE scanning).
* Click Create repository.
* Select your repository and click View push commands to view the generated Docker login, build, and push commands.
{% endstep %}

{% step %}
### Create a Serverless AWS ECS Cluster (Fargate)

_Estimated: 4 mins_

* Search and open Elastic Container Service (ECS).
* In the left navigation menu, click Clusters ➔ click Create cluster.
* **Cluster name:** `devops-fargate-cluster`. **Infrastructure:** Keep AWS Fargate (serverless) checked.
* Click Create. The cluster creates in \~10 seconds!
{% endstep %}

{% step %}
### Define Task Definition (Container Blueprint)

_Estimated: 6 mins_

* In the left ECS menu, click Task definitions ➔ click Create new task definition.
* **Task definition family:** `devops-web-task`. **Launch type:** AWS Fargate. **CPU:** `0.5 vCPU` (512) | **Memory:** `1 GB` (1024).
* **Task execution role:** Select `ecsTaskExecutionRole` (or click create new).
* **Container - 1:**
  * Name: `web-container`
  * Image URI: `public.ecr.aws/nginx/nginx:latest`
  * Port mappings: Port `80`, Protocol `TCP`, App protocol `HTTP`
* **Environment variables:** Add `APP_ENV` = `production`.
* **Logging:** Leave _Use log collection_ checked (streams to CloudWatch). Click Create.
{% endstep %}

{% step %}
### Deploy ECS Service & Configure Networking

_Estimated: 6 mins_

* Go to Clusters ➔ click `devops-fargate-cluster` ➔ under _Services_ tab, click Create.
* **Compute options:** Launch type ➔ FARGATE.
* **Deployment configuration:**
  * Application type: Service.
  * Task definition Family: `devops-web-task`.
  * Service name: `devops-web-service`.
  * Desired tasks: `1`.
* **Networking:**
  * VPC: Default VPC.
  * Security group: Create new ➔ Rule: Type = **HTTP**, Port = **80**, Source = **Anywhere (0.0.0.0/0)**.
  * **Public IP:** Ensure TURNED ON!
* Click Create.
{% endstep %}

{% step %}
### Verify Live Container Web Output & Log Stream

_Estimated: 5 mins_

* Inside `devops-fargate-cluster`, click the Tasks tab.
* Wait until the Last status shows **RUNNING**. Click the Task ID.
* Under **Configuration / Network**, copy the Public IP address.
* Open a browser tab to `http://<PUBLIC-IP>`. Confirm you see the **"Welcome to nginx!"** page!
* Back in the ECS console on the Task page, click the Logs tab. Refresh the web page and watch access logs appear live!
{% endstep %}

{% step %}
### Execute Zero-Downtime Rolling Update (Revision 2)

_Estimated: 4 mins_

* In left menu, click Task definitions ➔ `devops-web-task` ➔ click Create new revision.
* Update Environment variable `APP_ENV` = `production-v2` ➔ Click Create (creates Revision 2).
* Go to Clusters ➔ `devops-fargate-cluster` ➔ select `devops-web-service` ➔ click Update.
* Select Revision 2 (latest) and click Update.
* Under the _Deployments_ tab, observe ECS launch the new task, wait for it to become healthy, and terminate the old task with zero downtime!
{% endstep %}

{% step %}
### Clean-Up & Safe Deletion

_Estimated: 3 mins_

* In `devops-fargate-cluster`, select `devops-web-service` ➔ click Delete ➔ confirm.
* Delete the cluster `devops-fargate-cluster`.
* In ECR, delete repository `devops-web-repo`.
{% endstep %}
{% endstepper %}

## ECS & ECR Reference Cheatsheet

| Network Mode | Description                                                             | When to Use?                                                                |
| ------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **awsvpc**   | Every task gets its own Elastic Network Interface (ENI) and private IP. | **Mandatory for AWS Fargate** and recommended for EC2.                      |
| **bridge**   | Uses Docker’s virtual network bridge on the EC2 host.                   | EC2 launch type with dynamic host port mapping.                             |
| **host**     | Bypasses container network isolation and binds directly to host ports.  | Maximum network throughput on EC2 (cannot run multiple tasks on same port). |

## Troubleshooting Common ECS Errors

### ❌ CannotPullContainerError

**Cause:** Fargate task cannot reach the ECR endpoint. Either it's in a public subnet without a Public IP or in a private subnet without a NAT gateway or VPC endpoint.

### ⚠️ Task Stopped: Exit Code 137

**Cause:** Out of Memory (OOM Killer). Your container exceeded the RAM specified in the Task Definition. Increase memory allocation (e.g. from 512 MB to 1024 MB).

### 🔍 Task Stopped: Exit Code 1

**Cause:** The application process crashed on startup. Go to the Task's _Logs_ tab in CloudWatch to inspect the application stack trace.

## Knowledge Check: Test Your ECS & ECR Skills

<details>

<summary>1. Which IAM role allows the ECS agent to pull container images from ECR and push logs to CloudWatch?</summary>

A) Task Role

B) Task Execution Role (ecsTaskExecutionRole)

C) EC2 Instance Profile

D) AWS Organization Admin Role

</details>

<details>

<summary>2. When deploying tasks on AWS Fargate in a public subnet without a NAT gateway, what setting is required?</summary>

A) Auto-assign Public IP must be ENABLED

B) Docker daemon bridge mode must be disabled

C) ECR image must be unencrypted

D) CPU must be set to at least 4 vCPU

</details>

<details>

<summary>3. What is the key advantage of using AWS Fargate Spot for ECS tasks?</summary>

A) Up to 70% cost savings for fault-tolerant and batch workloads

B) Guarantees 100% uptime SLA with zero interruptions

C) Doubles the container memory allocation for free

D) Eliminates the need for an ECR repository

</details>

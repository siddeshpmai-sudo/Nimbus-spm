# Cloud\_Computing

## What is Cloud Computing?

Cloud computing means using IT resources **over the internet** instead of purchasing and maintaining everything in your own data center.

These resources can include:

* Servers
* Storage
* Databases
* Networking
* Applications
* Containers
* Security services
* Monitoring
* AI/ML services

### Simple Example

Suppose a company needs a server to host its application.

**Traditional approach** – The company has to:

1. Purchase a physical server
2. Purchase storage
3. Configure networking
4. Install an operating system
5. Maintain the hardware
6. Handle failures
7. Pay for electricity and data-center space

**Cloud approach** – The company can create an **EC2 instance** in AWS within minutes, install the application, and start using it.

{% hint style="info" %}
**Cloud = On-demand IT resources + Internet access + Pay for what you use**
{% endhint %}

## Why Do Companies Use Cloud?

| Benefit           | Explanation                                | Example          |
| ----------------- | ------------------------------------------ | ---------------- |
| On-demand         | Create resources whenever required         | Launch EC2       |
| Scalability       | Increase / decrease resources              | Auto Scaling     |
| Elasticity        | Automatically scale based on demand        | EC2 Auto Scaling |
| Cost-effective    | Pay for consumed resources                 | AWS EC2          |
| High Availability | Run applications across multiple locations | Multiple AZs     |
| Global Reach      | Deploy applications worldwide              | AWS Regions      |
| Automation        | Infrastructure can be created through code | Terraform        |
| Managed Services  | Cloud provider manages infrastructure      | RDS              |
| Backup & DR       | Easily maintain backups                    | S3               |
| Security          | IAM, encryption, security groups etc.      | AWS IAM          |

## Types of Cloud Computing

There are two common ways to classify cloud computing:

{% columns %}
{% column %}
### Based on Deployment Model

* Public Cloud
* Private Cloud
* Hybrid Cloud
* Multi-Cloud
{% endcolumn %}

{% column %}
### Based on Service Model

* IaaS (Infrastructure as a Service)
* PaaS (Platform as a Service)
* SaaS (Software as a Service)
* Serverless / FaaS (Function as a Service)
{% endcolumn %}
{% endcolumns %}

## Public Cloud

A **public cloud** is cloud infrastructure provided by a cloud provider and **shared among multiple customers**.

**Popular providers:**

* AWS
* Microsoft Azure
* Google Cloud Platform (GCP)

### Example

A company wants to deploy an application. Instead of purchasing physical servers, they use:

```
AWS
 |
 +-- EC2       (Compute)
 +-- S3        (Storage)
 +-- RDS       (Database)
 +-- VPC       (Networking)
 +-- ELB       (Load Balancing)
```

### Real-World Use Case – E-Commerce Scaling

* During normal days → **10 EC2 instances**
* During a festival sale → **100 EC2 instances**
* The company can **scale resources according to demand**

### Advantages

* Low initial investment
* Easy scalability
* Global infrastructure
* Pay-as-you-go
* Fast provisioning

## Private Cloud

A **private cloud** is cloud infrastructure **dedicated to a single organization**.

The infrastructure can be hosted:

* Inside the company's own data center
* Or by a third-party provider

**Common technologies:** VMware, OpenStack, Private Kubernetes platforms

### Example

```
Company Data Center
       |
   Private Cloud
       |
 +-----+------+
 |            |
VMs       Kubernetes
```

### Use Cases

* Banking
* Government
* Defense
* Healthcare
* Highly regulated applications

### Main Advantage

The organization gets greater control over infrastructure, network, security, and data.

## Hybrid Cloud

**Hybrid Cloud = Public Cloud + Private Cloud**

This is extremely important in real-world enterprise environments.

### Example

A bank has:

* **On-premises** → Customer Database (sensitive data)
* **AWS** → Web application (EC2 / EKS)

```
             Internet
                |
              AWS
                |
          Application
                |
        Secure Connection
                |
          On-Premises
                |
             Database
```

### Why Use Hybrid Cloud?

* Sensitive data → On-premises
* Web application → AWS
* Backup → S3

### Use Cases

* Banks & financial institutions
* Large enterprises
* Legacy applications
* Government organizations

## Multi-Cloud

**Multi-cloud** means using services from **multiple cloud providers**.

### Example

```
AWS              Azure             GCP
 |                |                 |
Application    Active Directory   Data Analytics
```

A company might use:

* **AWS** for infrastructure
* **Azure** for Microsoft workloads
* **GCP** for analytics / AI

### Why Use Multi-Cloud?

| Reason               | Explanation                                    |
| -------------------- | ---------------------------------------------- |
| Avoid vendor lock-in | Don't depend entirely on one provider          |
| Best service         | Choose the best service from each provider     |
| Disaster recovery    | Use another cloud provider as a DR environment |

### Challenges

* More complex architecture
* Different tools and APIs
* Security management
* Cost management
* Need for skilled engineers

## IaaS – Infrastructure as a Service

IaaS provides **infrastructure resources** such as servers, storage, and networking.

**Examples:** AWS EC2, Azure Virtual Machines, Google Compute Engine

### What You Manage vs What the Cloud Manages

| Component                 | IaaS     |
| ------------------------- | -------- |
| Physical Hardware         | ☁️ Cloud |
| Networking Infrastructure | ☁️ Cloud |
| OS                        | 👤 You   |
| Runtime                   | 👤 You   |
| Application               | 👤 You   |
| Data                      | 👤 You   |

### Example

```
EC2
 └── Ubuntu
      └── Docker
           └── Jenkins
```

You are responsible for managing the OS and software.

### DevOps Use Cases

* Jenkins server
* Docker host
* Kubernetes nodes
* Web servers
* Application servers

## PaaS – Platform as a Service

PaaS provides a **platform** where developers can deploy applications **without managing the underlying infrastructure**.

**Examples:** AWS Elastic Beanstalk, Azure App Service, Google App Engine

### Example

```
Developer gives:    Application Code
                         ↓
Platform handles:   Servers, OS, Runtime, Scaling, Deployment
```

**Simple scenario:**

> "I have a Java application. I just want to deploy it."
>
> PaaS handles the infrastructure required to run it.

### Use Cases

* Web applications
* APIs
* Rapid application development
* Development / testing environments

## SaaS – Software as a Service

SaaS means using a **complete software application over the internet**.

You don't manage servers, OS, runtime, or application infrastructure. You simply **use the application**.

### Examples

* Gmail
* Microsoft 365
* Salesforce
* Slack
* Zoom

### Diagram

```
Your Laptop
     |
   Internet
     |
   Gmail
     |
Google manages everything
```

### Use Cases

* Email
* CRM
* Collaboration
* Video conferencing
* Project management

## Serverless / FaaS (Function as a Service)

Serverless means you run application code **without directly managing servers**.

**Example:** AWS Lambda

### How It Works

```
User
 |
S3 (Upload Image)
 |
Lambda (Resize Image)
 |
Store Result
```

You provide Python / Java / Node.js code. AWS manages servers, OS, infrastructure, and scaling.

### Use Cases

* Image processing
* File processing
* APIs
* Automation
* Event-driven applications
* Scheduled jobs

## IaaS vs PaaS vs SaaS – The Pizza Analogy 🍕

| Model    | Pizza Analogy                                                  | You Manage |
| -------- | -------------------------------------------------------------- | ---------- |
| **IaaS** | You receive basic ingredients and prepare most of it yourself  | MORE       |
| **PaaS** | You receive a partially prepared pizza and customize / cook it | MEDIUM     |
| **SaaS** | You order a ready-to-eat pizza and simply eat it               | LESS       |

```
                 YOU MANAGE
IaaS  ------------------------> MORE
PaaS  ------------------------> MEDIUM
SaaS  ------------------------> LESS
```

## Shared Responsibility Model

This is an important **DevOps interview concept**.

| Component         | On-Prem | IaaS      | PaaS  | SaaS  |
| ----------------- | ------- | --------- | ----- | ----- |
| Physical Hardware | You     | Cloud     | Cloud | Cloud |
| Networking        | You     | Cloud/You | Cloud | Cloud |
| OS                | You     | You       | Cloud | Cloud |
| Runtime           | You     | You       | Cloud | Cloud |
| Application       | You     | You       | You   | Cloud |
| Data              | You     | You       | You   | You   |

{% hint style="info" %}
**The more managed the service, the less infrastructure you need to manage.**
{% endhint %}

## Cloud Use Cases – Real-World Examples

{% stepper %}
{% step %}
### Use Case 1 – E-Commerce

```
Users
  |
Route 53 (DNS)
  |
Load Balancer (ELB)
  |
EC2 / EKS (Application)
  |
RDS (Database)
```

**Supporting services:**

| Service    | Purpose                |
| ---------- | ---------------------- |
| S3         | Product images         |
| CloudFront | Content delivery (CDN) |
| CloudWatch | Monitoring             |
| SNS        | Notifications          |
| Lambda     | Automation             |

**Scaling problem:**

* Normal hours → 1,000 users
* Sale event → 1,00,000 users

**Cloud solution:** Load Balancer + Auto Scaling + Multi-AZ + CDN + Managed DB
{% endstep %}

{% step %}
### Use Case 2 – DevOps CI/CD Pipeline

```
Developer
    |
   Git
    |
 Jenkins
    |
 Maven / Gradle
    |
 SonarQube
    |
 Docker
    |
   ECR (Container Registry)
    |
   EKS (Kubernetes)
```

Cloud provides infrastructure for Jenkins, Kubernetes, container registry, monitoring, and storage.
{% endstep %}

{% step %}
### Use Case 3 – Backup & Storage

```
Application → S3 → Backup
```

S3 provides **highly durable** object storage for:

* Database backups
* Log storage
* Documents, images, videos
* Archives
{% endstep %}

{% step %}
### Use Case 4 – Disaster Recovery

```
Primary             Backup / DR
AWS Region A  ←→  AWS Region B
```

Common services: S3, Route 53, RDS, EC2, EBS, AMIs
{% endstep %}

{% step %}
### Use Case 5 – Big Data & Analytics

```
Applications → Data Storage → Data Processing → Analytics → Reports
```

Cloud makes it easier to provision large amounts of compute and storage on demand.
{% endstep %}

{% step %}
### Use Case 6 – Application Modernization

```
Legacy App (Physical Server, Old DB)
         ↓
  Containers → Docker → Kubernetes / EKS → RDS
```
{% endstep %}

{% step %}
### Use Case 7 – Development & Testing Environments

```
Terraform
   |
   +---- DEV
   +---- TEST
   +---- UAT
   +---- PROD
```

Infrastructure can be **created and destroyed automatically** — this is where **Terraform + AWS + DevOps** becomes very useful.
{% endstep %}
{% endstepper %}

## A Simple Cloud Architecture

```
                    USERS
                      |
                      v
                 Route 53       (DNS)
                      |
                      v
              Load Balancer     (ELB)
                      |
             +--------+--------+
             |                 |
           EC2               EC2    (Application Servers)
             |                 |
             +--------+--------+
                      |
                      v
                    RDS         (Database)
                      |
                +-----+-----+
                |           |
               S3       CloudWatch
           (Storage)   (Monitoring)
```

## Cloud Computing Classification – Summary Diagram

```
                 CLOUD COMPUTING
                       |
          +------------+------------+
          |                         |
    Deployment Model          Service Model
          |                         |
    +-----+------+          +-------+-------+-------+
    |     |      |          |       |       |       |
 Public Private Hybrid    IaaS    PaaS    SaaS  Serverless
    |
 Multi-Cloud
```

### One-Liner Summary

| Type              | Description                                        |
| ----------------- | -------------------------------------------------- |
| **Public Cloud**  | Shared cloud infrastructure provided by a provider |
| **Private Cloud** | Dedicated cloud environment for one organization   |
| **Hybrid Cloud**  | Combination of private and public cloud            |
| **Multi-Cloud**   | Using multiple cloud providers                     |
| **IaaS**          | Rent infrastructure                                |
| **PaaS**          | Rent a development / application platform          |
| **SaaS**          | Use ready-made software                            |
| **Serverless**    | Run code without managing servers                  |

## Classroom Quiz Questions ❓

<details>

<summary><strong>Q1:</strong> "If I create an EC2 instance, is that IaaS, PaaS, or SaaS?"</summary>

**Answer:** IaaS – AWS provides infrastructure; we manage the OS, software, and application.

</details>

<details>

<summary><strong>Q2:</strong> "If I use Gmail?"</summary>

**Answer:** SaaS – Google manages everything; you simply use the application.

</details>

<details>

<summary><strong>Q3:</strong> "If I deploy my application to AWS Elastic Beanstalk?"</summary>

**Answer:** PaaS – The platform manages servers, OS, and runtime.

</details>

<details>

<summary><strong>Q4:</strong> "If I execute Python code using AWS Lambda?"</summary>

**Answer:** Serverless / FaaS – You only provide code; AWS manages everything else.

</details>

## DevOps Perspective

```
             CLOUD
               |
      +--------+--------+
      |                 |
 Infrastructure      Managed Services
      |                 |
     EC2               RDS
      |                 |
     EKS               S3
      |
    Docker
      |
   Jenkins
      |
   CI/CD
      |
 Terraform
      |
Infrastructure as Code
```

### Key Message

{% hint style="info" %}
**Cloud provides the infrastructure; DevOps provides the practices and automation to build, deploy, manage, and monitor applications efficiently.**
{% endhint %}

### Final Classroom Statement

> _"Cloud tells us WHERE and HOW we get infrastructure and services; DevOps tells us HOW we automate and operate applications on that infrastructure."_

# AWS\_Overview

## What is AWS?

**Amazon Web Services (AWS)** is a comprehensive cloud computing platform provided by **Amazon**. It offers **200+ managed services** on secure, globally distributed, highly available infrastructure.

### Key Facts

* Launched in **2006**
* Currently the **#1 cloud provider** globally (market share \~31%)
* Used by Netflix, LinkedIn, NASA, and thousands of startups
* Available in **30+ Regions** worldwide
* Offers a **Free Tier** for hands-on learning

### AWS = Collection of Cloud Services

```
AWS
 ├── Compute        → EC2, Lambda, ECS, EKS
 ├── Storage        → S3, EBS, EFS, Glacier
 ├── Database       → RDS, DynamoDB, Aurora, Redshift
 ├── Networking     → VPC, Route 53, CloudFront, ELB
 ├── Security       → IAM, KMS, WAF, Shield
 ├── Monitoring     → CloudWatch, CloudTrail
 ├── DevOps         → CodeCommit, CodeBuild, CodeDeploy, CodePipeline
 ├── Containers     → ECR, ECS, EKS, Fargate
 ├── Serverless     → Lambda, API Gateway, Step Functions
 ├── AI/ML          → SageMaker, Rekognition, Comprehend
 └── Management     → CloudFormation, Systems Manager, Config
```

## Why AWS?

| Feature                   | Description                          |
| ------------------------- | ------------------------------------ |
| **Pay-as-you-go**         | Only pay for what you use            |
| **Global Infrastructure** | 30+ Regions, 100+ Availability Zones |
| **Scalability**           | Scale up or down in minutes          |
| **Security**              | SOC, PCI, HIPAA, ISO compliant       |
| **Reliability**           | 99.99% SLA for many services         |
| **Managed Services**      | Less operational overhead            |
| **Free Tier**             | Experiment and learn for free        |

## Getting Started with AWS

{% stepper %}
{% step %}
### Create an AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com/)
2. Click **"Create an AWS Account"**
3. Provide email, password, and account name
4. Add payment information (credit/debit card)
5. Select the **Free Tier** plan
6. Complete identity verification
{% endstep %}

{% step %}
### Access the AWS Management Console

* URL: [console.aws.amazon.com](https://console.aws.amazon.com/)
* The **AWS Management Console** is a web-based interface to manage all AWS services
* You can search for services, manage resources, and monitor usage
{% endstep %}

{% step %}
### Set Up IAM

{% hint style="warning" %}
**Never use the Root Account for daily tasks.** Create an IAM user with appropriate permissions.
{% endhint %}

```
Root Account (Owner)
     |
     +-- IAM User 1 (Admin)
     +-- IAM User 2 (Developer)
     +-- IAM User 3 (Read-Only)
```
{% endstep %}
{% endstepper %}

## Core AWS Services – Overview

### Compute Services

| Service               | Description                                   | Use Case                                |
| --------------------- | --------------------------------------------- | --------------------------------------- |
| **EC2**               | Virtual servers in the cloud                  | Web servers, app servers                |
| **Lambda**            | Serverless compute (run code without servers) | Event-driven automation                 |
| **ECS**               | Container orchestration (Docker)              | Microservices                           |
| **EKS**               | Managed Kubernetes                            | Container orchestration                 |
| **Fargate**           | Serverless containers                         | Run containers without managing servers |
| **Elastic Beanstalk** | PaaS – Deploy apps easily                     | Quick application deployment            |
| **Lightsail**         | Simple VPS                                    | Small websites, blogs                   |

#### EC2 – Elastic Compute Cloud (Most Important)

EC2 is the **backbone** of AWS compute.

```
EC2 Instance
 ├── Instance Type     → t2.micro, m5.large, c5.xlarge
 ├── AMI               → Amazon Machine Image (OS template)
 ├── Key Pair          → SSH access
 ├── Security Group    → Firewall rules
 ├── EBS Volume        → Storage (Hard Disk)
 ├── Elastic IP        → Static public IP
 └── User Data         → Startup script
```

**EC2 Instance Types:**

| Family  | Purpose                     | Example              |
| ------- | --------------------------- | -------------------- |
| **t**   | General purpose (burstable) | t2.micro, t3.medium  |
| **m**   | General purpose (balanced)  | m5.large, m6i.xlarge |
| **c**   | Compute optimized           | c5.xlarge            |
| **r**   | Memory optimized            | r5.large             |
| **g/p** | GPU instances               | p3.2xlarge           |
| **i/d** | Storage optimized           | i3.large             |

**EC2 Pricing Models:**

| Model               | Description                                 |
| ------------------- | ------------------------------------------- |
| **On-Demand**       | Pay per hour / second, no commitment        |
| **Reserved**        | 1 or 3 year commitment, up to 72% discount  |
| **Spot**            | Bid for unused capacity, up to 90% discount |
| **Savings Plans**   | Flexible pricing with commitment            |
| **Dedicated Hosts** | Physical server dedicated to you            |

### Storage Services

| Service             | Type               | Use Case                                |
| ------------------- | ------------------ | --------------------------------------- |
| **S3**              | Object storage     | Files, images, backups, static websites |
| **EBS**             | Block storage      | EC2 instance hard disks                 |
| **EFS**             | File storage (NFS) | Shared file systems                     |
| **S3 Glacier**      | Archive storage    | Long-term backups, compliance           |
| **Storage Gateway** | Hybrid storage     | On-prem to cloud bridge                 |

#### S3 – Simple Storage Service (Most Important)

```
S3
 ├── Bucket        → Container for objects (globally unique name)
 ├── Object        → File stored in a bucket (up to 5TB)
 ├── Key           → Unique identifier for an object
 ├── Versioning    → Keep multiple versions of an object
 ├── Lifecycle     → Automatically move/delete objects
 └── Encryption    → Server-side or client-side
```

**S3 Storage Classes:**

| Class                   | Use Case                     | Cost       |
| ----------------------- | ---------------------------- | ---------- |
| S3 Standard             | Frequently accessed data     | Highest    |
| S3 Standard-IA          | Infrequently accessed        | Lower      |
| S3 One Zone-IA          | Single AZ, infrequent access | Even lower |
| S3 Glacier Instant      | Archive with instant access  | Low        |
| S3 Glacier Flexible     | Archive (minutes to hours)   | Very low   |
| S3 Glacier Deep Archive | Long-term archive (12 hours) | Lowest     |

### Database Services

| Service         | Type                    | Use Case                              |
| --------------- | ----------------------- | ------------------------------------- |
| **RDS**         | Relational DB (managed) | MySQL, PostgreSQL, Oracle, SQL Server |
| **Aurora**      | AWS-built relational DB | High-performance MySQL/PostgreSQL     |
| **DynamoDB**    | NoSQL (key-value)       | High-speed, low-latency apps          |
| **ElastiCache** | In-memory cache         | Redis / Memcached                     |
| **Redshift**    | Data warehouse          | Analytics, reporting                  |
| **DocumentDB**  | Document DB             | MongoDB-compatible                    |

#### RDS – Relational Database Service

```
RDS
 ├── Engine          → MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora
 ├── Multi-AZ        → High availability (standby in another AZ)
 ├── Read Replicas   → Scale read operations
 ├── Automated Backups → Point-in-time recovery
 ├── Snapshots       → Manual backups
 └── Encryption      → At rest and in transit
```

### Networking Services

| Service                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **VPC**                  | Virtual Private Cloud – Your own private network in AWS |
| **Subnets**              | Divide your VPC into public and private sections        |
| **Internet Gateway**     | Connect VPC to the internet                             |
| **NAT Gateway**          | Allow private subnets to access the internet            |
| **Route Tables**         | Control traffic routing                                 |
| **Security Groups**      | Instance-level firewall (stateful)                      |
| **NACLs**                | Subnet-level firewall (stateless)                       |
| **Route 53**             | DNS service                                             |
| **CloudFront**           | CDN (Content Delivery Network)                          |
| **ELB**                  | Elastic Load Balancer                                   |
| **VPC Peering**          | Connect two VPCs                                        |
| **VPN / Direct Connect** | Connect on-prem to AWS                                  |

#### VPC – Virtual Private Cloud

```
VPC (10.0.0.0/16)
 |
 ├── Public Subnet (10.0.1.0/24)
 |    ├── Internet Gateway
 |    ├── EC2 (Web Server)
 |    └── NAT Gateway
 |
 └── Private Subnet (10.0.2.0/24)
      ├── EC2 (App Server)
      └── RDS (Database)
```

### Security & Identity Services

| Service             | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| **IAM**             | Identity and Access Management – Users, Groups, Roles, Policies |
| **KMS**             | Key Management Service – Encryption keys                        |
| **Secrets Manager** | Store secrets (passwords, API keys)                             |
| **WAF**             | Web Application Firewall                                        |
| **Shield**          | DDoS protection                                                 |
| **GuardDuty**       | Threat detection                                                |
| **Inspector**       | Security assessment                                             |
| **CloudTrail**      | API activity logging (audit trail)                              |

#### IAM – Identity and Access Management

```
IAM
 ├── Users          → Individual people
 ├── Groups         → Collection of users
 ├── Roles          → Temporary permissions (for services)
 ├── Policies       → JSON documents defining permissions
 └── MFA            → Multi-Factor Authentication
```

**IAM Policy Example:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### Monitoring & Management

| Service             | Description                                        |
| ------------------- | -------------------------------------------------- |
| **CloudWatch**      | Monitoring – Metrics, Alarms, Logs, Dashboards     |
| **CloudTrail**      | Audit – Track API calls and user activity          |
| **CloudFormation**  | Infrastructure as Code (IaC) – YAML/JSON templates |
| **Systems Manager** | Manage EC2 instances at scale                      |
| **Config**          | Track resource configuration changes               |
| **Trusted Advisor** | Best practice recommendations                      |

### Container & DevOps Services

| Service          | Description                                       |
| ---------------- | ------------------------------------------------- |
| **ECR**          | Elastic Container Registry – Store Docker images  |
| **ECS**          | Elastic Container Service – Run Docker containers |
| **EKS**          | Elastic Kubernetes Service – Managed Kubernetes   |
| **Fargate**      | Serverless container engine                       |
| **CodeCommit**   | Git repository (like GitHub)                      |
| **CodeBuild**    | Build service (compile, test)                     |
| **CodeDeploy**   | Deployment automation                             |
| **CodePipeline** | CI/CD pipeline orchestration                      |

## AWS Free Tier

AWS offers a **Free Tier** to help beginners learn:

| Service    | Free Tier Limit                            |
| ---------- | ------------------------------------------ |
| EC2        | 750 hours/month of t2.micro (12 months)    |
| S3         | 5 GB storage (12 months)                   |
| RDS        | 750 hours/month of db.t2.micro (12 months) |
| Lambda     | 1 million requests/month (always free)     |
| DynamoDB   | 25 GB storage (always free)                |
| CloudWatch | 10 custom metrics, 10 alarms (always free) |
| SNS        | 1 million publishes (12 months)            |
| SQS        | 1 million requests (always free)           |

{% hint style="warning" %}
**Always monitor your billing!** Set up a **Billing Alarm** in CloudWatch.
{% endhint %}

## AWS CLI (Command Line Interface)

### Install AWS CLI

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify
aws --version
```

### Configure AWS CLI

```bash
aws configure
# Enter:
#   AWS Access Key ID
#   AWS Secret Access Key
#   Default region (e.g., ap-south-1)
#   Default output format (json)
```

### Common AWS CLI Commands

```bash
# EC2
aws ec2 describe-instances
aws ec2 run-instances --image-id ami-xxxxx --instance-type t2.micro --key-name mykey
aws ec2 start-instances --instance-ids i-xxxxx
aws ec2 stop-instances --instance-ids i-xxxxx
aws ec2 terminate-instances --instance-ids i-xxxxx

# S3
aws s3 ls
aws s3 mb s3://my-bucket
aws s3 cp file.txt s3://my-bucket/
aws s3 sync ./folder s3://my-bucket/folder
aws s3 rm s3://my-bucket/file.txt

# IAM
aws iam list-users
aws iam create-user --user-name devuser
aws iam create-group --group-name devgroup
```

## AWS Architecture – Typical Web Application

```
                         USERS
                           |
                           v
                      Route 53 (DNS)
                           |
                           v
                    CloudFront (CDN)
                           |
                           v
                   ALB (Load Balancer)
                           |
              +------------+------------+
              |                         |
         EC2 (AZ-a)               EC2 (AZ-b)
              |                         |
              +------------+------------+
                           |
                           v
                    RDS (Multi-AZ)
                           |
                    +------+------+
                    |             |
                 Primary       Standby
                 (AZ-a)        (AZ-b)
                    |
              +-----+-----+
              |           |
             S3       CloudWatch
          (Storage)  (Monitoring)
```

## AWS vs Azure vs GCP

| Feature                | AWS            | Azure            | GCP                     |
| ---------------------- | -------------- | ---------------- | ----------------------- |
| **Compute**            | EC2            | Virtual Machines | Compute Engine          |
| **Serverless**         | Lambda         | Azure Functions  | Cloud Functions         |
| **Object Storage**     | S3             | Blob Storage     | Cloud Storage           |
| **Database**           | RDS / Aurora   | Azure SQL        | Cloud SQL               |
| **Kubernetes**         | EKS            | AKS              | GKE                     |
| **DNS**                | Route 53       | Azure DNS        | Cloud DNS               |
| **CDN**                | CloudFront     | Azure CDN        | Cloud CDN               |
| **IaC**                | CloudFormation | ARM Templates    | Deployment Manager      |
| **Container Registry** | ECR            | ACR              | GCR / Artifact Registry |
| **Monitoring**         | CloudWatch     | Azure Monitor    | Cloud Monitoring        |

## AWS for DevOps – Key Services

```
DevOps on AWS
     |
     ├── Source Code      → CodeCommit / GitHub
     ├── Build            → CodeBuild
     ├── Test             → CodeBuild + Third-party
     ├── Deploy           → CodeDeploy
     ├── Pipeline          → CodePipeline
     ├── Infrastructure   → CloudFormation / Terraform
     ├── Containers       → ECR + ECS / EKS
     ├── Monitoring       → CloudWatch + CloudTrail
     ├── Security         → IAM + KMS + Secrets Manager
     └── Automation       → Lambda + Systems Manager
```

### Typical DevOps CI/CD on AWS

```
Developer
    |
   Git Push → CodeCommit / GitHub
    |
   CodePipeline (Orchestrator)
    |
   CodeBuild (Build + Test)
    |
   Docker Image → ECR
    |
   CodeDeploy / EKS
    |
   Application Running
    |
   CloudWatch (Monitor)
```

## Important AWS Concepts for Interviews

| Concept                        | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| **Region**                     | Geographic area with multiple data centers            |
| **Availability Zone (AZ)**     | Isolated data center within a region                  |
| **Edge Location**              | CDN endpoint for CloudFront                           |
| **ARN**                        | Amazon Resource Name – unique resource identifier     |
| **SLA**                        | Service Level Agreement – uptime guarantee            |
| **Shared Responsibility**      | AWS secures the cloud; you secure what's in the cloud |
| **Well-Architected Framework** | AWS best practices (5 pillars)                        |
| **Auto Scaling**               | Automatically adjust number of instances              |
| **Elastic**                    | Resources can grow and shrink with demand             |
| **High Availability**          | System remains operational even during failures       |
| **Fault Tolerance**            | System continues operating despite component failures |

## AWS Well-Architected Framework – 5 Pillars

| Pillar                     | Focus                                     |
| -------------------------- | ----------------------------------------- |
| **Operational Excellence** | Automate operations, monitor, and improve |
| **Security**               | Protect data, systems, and assets         |
| **Reliability**            | Recover from failures, meet demand        |
| **Performance Efficiency** | Use resources efficiently                 |
| **Cost Optimization**      | Avoid unnecessary costs                   |

## Next Steps

{% stepper %}
{% step %}
### Create an AWS Free Tier account
{% endstep %}

{% step %}
### Set up IAM users (never use root)
{% endstep %}

{% step %}
### Launch your first EC2 instance
{% endstep %}

{% step %}
### Create an S3 bucket
{% endstep %}

{% step %}
### Set up a VPC with public and private subnets
{% endstep %}

{% step %}
### Deploy an application using Elastic Beanstalk
{% endstep %}

{% step %}
### Set up CloudWatch alarms and billing alerts
{% endstep %}

{% step %}
### Practice AWS CLI commands
{% endstep %}

{% step %}
### Study for AWS Certified Cloud Practitioner
{% endstep %}
{% endstepper %}

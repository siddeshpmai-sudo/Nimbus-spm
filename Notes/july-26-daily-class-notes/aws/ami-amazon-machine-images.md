# AMI Amazon Machine Images

## What is an AMI?

An **Amazon Machine Image (AMI)** is a **template** that contains the software configuration (operating system, application server, applications) required to launch an EC2 instance.

### Simple Analogy for Students

```
AMI  →  Like a "Ghost Image" or "ISO file" for a virtual machine
         or
AMI  →  Like a "Docker Image" but for entire virtual machines
         or
AMI  →  Like a "Snapshot/Blueprint" of a complete server
```

{% hint style="info" %}
**AMI = OS + Software + Configuration + Data → Ready to launch as an EC2 instance**
{% endhint %}

### What an AMI Contains

```
AMI
 │
 ├── Root Volume Template
 │    └── OS (Linux/Windows) + Installed Software
 │
 ├── Launch Permissions
 │    └── Who can use this AMI (Public, Private, Shared)
 │
 └── Block Device Mapping
      └── Which EBS volumes to attach when launched
```

## Types of AMIs

### Based on Ownership

| Type                 | Description                            | Example                                  |
| -------------------- | -------------------------------------- | ---------------------------------------- |
| **AWS-Provided**     | Maintained by Amazon                   | Amazon Linux 2023, Amazon Linux 2        |
| **Marketplace**      | Third-party vendor AMIs (free or paid) | WordPress, Jenkins, Nginx pre-configured |
| **Community**        | Created and shared by AWS users        | Various community-contributed AMIs       |
| **Custom (My AMIs)** | Created by you from your instances     | Your application pre-installed           |

### Based on Root Volume (Storage Type)

| Type                          | Root Volume                | Description                          |
| ----------------------------- | -------------------------- | ------------------------------------ |
| **EBS-Backed AMI**            | EBS Volume                 | Standard, recommended, data persists |
| **Instance Store-Backed AMI** | Instance Store (Ephemeral) | Legacy, data lost on stop/terminate  |

## EBS-Backed AMI vs Instance Store-Backed AMI

This is a very important concept for interviews and exams.

### EBS-Backed AMI (Recommended)

```
AMI Creation:
  EC2 Instance
       │
       ▼
  EBS Snapshot (stored in S3 – AWS managed)
       │
       ▼
  AMI registered (points to the snapshot)

Instance Launch:
  AMI
   │
   ▼
  New EBS Volume (created from snapshot)
   │
   ▼
  EC2 Instance boots from EBS volume
```

### Instance Store-Backed AMI (Legacy)

```
AMI Creation:
  EC2 Instance
       │
       ▼
  Bundle Volume (compress + encrypt files)
       │
       ▼
  Upload to YOUR S3 Bucket
       │
       ▼
  Register AMI (points to S3 manifest)

Instance Launch:
  AMI
   │
   ▼
  Files downloaded from S3 to Instance Store
   │
   ▼
  EC2 Instance boots from Instance Store
```

### Comparison Table

| Feature                  | EBS-Backed AMI                 | Instance Store-Backed AMI                  |
| ------------------------ | ------------------------------ | ------------------------------------------ |
| **Root Volume**          | EBS Volume                     | Instance Store (Ephemeral)                 |
| **Data Persistence**     | ✅ Survives stop/start          | ❌ Lost on stop/terminate                   |
| **Boot Time**            | Fast (< 1 minute)              | Slower (\~5 minutes)                       |
| **Max Root Volume Size** | 64 TB                          | 10 GB                                      |
| **Stop/Start**           | ✅ Supported                    | ❌ NOT supported (only reboot or terminate) |
| **Instance Type Change** | ✅ Stop → change type → start   | ❌ Not possible                             |
| **Creation Method**      | Snapshot-based (automated)     | Manual bundling + S3 upload                |
| **AMI Storage**          | AWS-managed S3 (EBS Snapshots) | Your S3 bucket                             |
| **Cost**                 | Pay for EBS snapshots          | Pay for S3 storage                         |
| **Upgrade**              | Easy (stop, modify, start)     | Must create new instance                   |
| **Recommended?**         | ✅ YES – Modern standard        | ❌ Legacy / specialized only                |

{% hint style="info" %}
💡 **Always use EBS-backed AMIs** unless you have a very specific reason for instance store.
{% endhint %}

## How AMI Creation Works – Behind the Scenes

### EBS-Backed AMI Creation Process

{% stepper %}
{% step %}
## Trigger "Create Image"

You trigger "Create Image" on a running EC2 instance.
{% endstep %}

{% step %}
## AWS briefly reboots the instance

AWS briefly reboots the instance for filesystem integrity.

Optional: The "No Reboot" flag skips this but risks data inconsistency.
{% endstep %}

{% step %}
## AWS takes EBS snapshots

AWS takes EBS snapshots of **ALL** attached EBS volumes.
{% endstep %}

{% step %}
## Snapshots are stored

Snapshots are stored in AWS-managed S3, not your S3 bucket.
{% endstep %}

{% step %}
## Snapshots are incremental

Snapshots are incremental: only changed blocks since the last snapshot are stored.
{% endstep %}

{% step %}
## AMI is registered

The AMI is registered as metadata that points to these snapshots.
{% endstep %}

{% step %}
## Block Device Mapping is recorded

AWS records the Block Device Mapping.

Which snapshot → which device: `/dev/xvda`, `/dev/xvdb`, etc.
{% endstep %}

{% step %}
## AMI becomes available

The AMI becomes "Available" and is ready to use.
{% endstep %}
{% endstepper %}

### What the AMI Record Contains

```json
{
  "ImageId": "ami-0abcdef1234567890",
  "Name": "my-web-server-v1",
  "Description": "Web server with Apache + PHP",
  "State": "available",
  "Architecture": "x86_64",
  "RootDeviceType": "ebs",
  "RootDeviceName": "/dev/xvda",
  "BlockDeviceMappings": [
    {
      "DeviceName": "/dev/xvda",
      "Ebs": {
        "SnapshotId": "snap-0123456789abcdef0",
        "VolumeSize": 8,
        "VolumeType": "gp3",
        "DeleteOnTermination": true
      }
    },
    {
      "DeviceName": "/dev/xvdb",
      "Ebs": {
        "SnapshotId": "snap-0fedcba9876543210",
        "VolumeSize": 50,
        "VolumeType": "gp3"
      }
    }
  ],
  "OwnerId": "123456789012",
  "Public": false
}
```

## AMI Lifecycle

```
┌────────────────┐
│  EC2 Instance  │ ← Configure your server (install software, settings)
└───────┬────────┘
        │
        ▼ Create Image
┌────────────────┐
│   AMI (with    │ ← Blueprint stored
│   EBS Snapshots│
│   registered)  │
└───────┬────────┘
        │
        ├── Launch new instances from this AMI
        ├── Copy AMI to another Region
        ├── Share AMI with other AWS accounts
        └── Deregister AMI (delete)
```

## Creating a Custom AMI – Step by Step

{% stepper %}
{% step %}
## Launch and Configure a Base Instance

```bash
# Launch an EC2 instance with Amazon Linux 2023
# Connect via SSH
ssh -i "my-key.pem" ec2-user@<PUBLIC-IP>

# Install required software
sudo yum update -y
sudo yum install -y httpd php git docker
sudo systemctl enable httpd docker

# Configure application
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php

# Clean up sensitive data
history -c
```
{% endstep %}

{% step %}
## Create AMI from Console

```
EC2 Dashboard
  → Select Instance
  → Actions
  → Image and templates
  → Create image
  
Name:        my-webserver-ami-v1
Description: Apache + PHP + Docker pre-installed
No Reboot:   ☐ Unchecked (recommended – ensures consistency)
```
{% endstep %}

{% step %}
## Create AMI from CLI

```bash
# Create AMI
aws ec2 create-image \
  --instance-id i-0123456789abcdef0 \
  --name "my-webserver-ami-v1" \
  --description "Apache + PHP + Docker pre-installed" \
  --no-reboot  # Optional: skip reboot (use with caution)

# Check AMI status
aws ec2 describe-images --image-ids ami-xxxxx

# Wait until State = "available"
```
{% endstep %}

{% step %}
## Launch Instance from Custom AMI

```bash
aws ec2 run-instances \
  --image-id ami-xxxxx \
  --instance-type t2.micro \
  --key-name my-key \
  --security-group-ids sg-xxxxx \
  --count 1
```
{% endstep %}
{% endstepper %}

## AMI Operations

### Copy AMI to Another Region

This is critical for **Disaster Recovery (DR)**.

```
Region: ap-south-1 (Mumbai)            Region: us-east-1 (Virginia)
     │                                       │
  AMI: ami-aaa111                          AMI: ami-bbb222
  Snapshot: snap-xxx                       Snapshot: snap-yyy (copy)
     │                                       │
     └──── Copy AMI across Region ────→      └── Launch DR instances
```

```bash
# Copy AMI to another region
aws ec2 copy-image \
  --source-region ap-south-1 \
  --source-image-id ami-aaa111 \
  --name "my-ami-dr-copy" \
  --region us-east-1
```

### Share AMI with Another AWS Account

```bash
# Share with specific account
aws ec2 modify-image-attribute \
  --image-id ami-xxxxx \
  --launch-permission "Add=[{UserId=123456789012}]"

# Make AMI public (anyone can use)
aws ec2 modify-image-attribute \
  --image-id ami-xxxxx \
  --launch-permission "Add=[{Group=all}]"

# Check current permissions
aws ec2 describe-image-attribute \
  --image-id ami-xxxxx \
  --attribute launchPermission
```

### Deregister (Delete) an AMI

```bash
# Step 1: Deregister the AMI
aws ec2 deregister-image --image-id ami-xxxxx

# Step 2: Delete associated snapshots (not automatic!)
aws ec2 delete-snapshot --snapshot-id snap-xxxxx
```

{% hint style="warning" %}
⚠️ **Deregistering an AMI does NOT delete the underlying EBS snapshots!** You must delete them separately.
{% endhint %}

## AMI Best Practices

### Naming Convention

Use a consistent naming convention:

```
Format: <team>-<application>-<os>-<version>-<date>

Examples:
  devops-jenkins-amazonlinux2023-v1-20260818
  webapp-frontend-ubuntu2204-v3-20260818
  database-mysql-amazonlinux2023-v2-20260818
```

### General Best Practices

| Practice                      | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| ✅ **Golden AMI**              | Create a pre-configured base AMI with common tools          |
| ✅ **Version your AMIs**       | Use clear naming with version numbers                       |
| ✅ **Regular updates**         | Rebuild AMIs regularly with security patches                |
| ✅ **Remove secrets**          | Clean up SSH keys, passwords, history before creating AMI   |
| ✅ **Test AMIs**               | Always launch and test a new AMI before using in production |
| ✅ **Document AMIs**           | Maintain a record of what each AMI contains                 |
| ✅ **Copy to DR region**       | Keep a copy in your DR Region                               |
| ✅ **Delete old AMIs**         | Clean up unused AMIs and their snapshots                    |
| ❌ **Don't hardcode IPs**      | Use configuration management instead                        |
| ❌ **Don't store credentials** | Use IAM Roles and Secrets Manager                           |

### Golden AMI Pattern

```
Base AMI (Amazon Linux 2023)
     │
     ▼
Golden AMI (Base + Common Tools)
 ├── OS patches applied
 ├── Monitoring agent (CloudWatch)
 ├── Security agent
 ├── Docker installed
 ├── AWS CLI configured
 └── Common packages installed
     │
     ├── Web Server AMI (Golden + Apache/Nginx)
     ├── App Server AMI (Golden + Java/Tomcat)
     └── CI/CD AMI (Golden + Jenkins/Git)
```

## AMI and Auto Scaling – Real-World Use

```
Custom AMI (with application pre-installed)
     │
     ▼
Launch Template (uses this AMI)
     │
     ▼
Auto Scaling Group
     │
     ├── Scale Out → New instances from AMI
     ├── Scale In → Terminate instances
     └── Replace unhealthy → New instance from AMI
```

This is why **AMIs are critical** in production:

* Auto Scaling launches new instances from your AMI.
* Every new instance is **identical** to your configured server.
* No need to install software on every new instance.

## Classroom Quiz Questions ❓

<details>

<summary><strong>Q1: "What is an AMI?"</strong></summary>

An AMI is a template/blueprint that contains the OS, software, and configuration needed to launch an EC2 instance.

</details>

<details>

<summary><strong>Q2: "What is the difference between an EBS-backed AMI and an Instance Store-backed AMI?"</strong></summary>

**EBS-backed:** Root volume is EBS, data persists, can stop/start, fast boot.

**Instance Store-backed:** Root volume is ephemeral, data lost on stop, cannot stop (only terminate), slower boot.

</details>

<details>

<summary><strong>Q3: "When you create an AMI, where is the data stored?"</strong></summary>

For EBS-backed AMIs, AWS takes EBS snapshots and stores them in an AWS-managed S3 bucket. The AMI metadata points to these snapshots.

</details>

<details>

<summary><strong>Q4: "Does deregistering an AMI delete the snapshots?"</strong></summary>

**No!** You must manually delete the associated EBS snapshots separately.

</details>

<details>

<summary><strong>Q5: "Can you copy an AMI to another Region?"</strong></summary>

**Yes!** This is commonly used for disaster recovery. AWS copies the underlying snapshots to the target Region.

</details>

<details>

<summary><strong>Q6: "What is a Golden AMI?"</strong></summary>

A pre-configured base AMI with all common tools, security patches, and agents installed. Other specialized AMIs are built on top of it.

</details>

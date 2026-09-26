# EC2 Elastic Compute Cloud

## What is EC2?

**Amazon EC2 (Elastic Compute Cloud)** is a web service that provides **resizable compute capacity** in the cloud. In simple terms, EC2 lets you create **virtual servers (instances)** on AWS infrastructure.

### Why "Elastic"?

* You can **increase or decrease** capacity within minutes.
* You can launch **1 or 1,000 instances** simultaneously.
* You **pay only for what you use** (per second/hour billing).

### Simple Analogy for Students

```
Traditional Server                    EC2 Instance
─────────────────                    ─────────────
Buy hardware         →               Launch in 2 minutes
Wait weeks           →               Available immediately
Fixed capacity       →               Scale up/down anytime
Pay upfront          →               Pay per second
Maintain hardware    →               AWS maintains hardware
Replace on failure   →               Launch new instance instantly
```

{% hint style="info" %}
**EC2 = Virtual server in the cloud that you can launch, use, and terminate on demand.**
{% endhint %}

## Key Components of EC2

```
EC2 Instance
 │
 ├── AMI             → Operating System template (what OS to install)
 ├── Instance Type   → Hardware configuration (CPU, RAM, Network)
 ├── Key Pair        → SSH login credentials
 ├── Security Group  → Firewall rules (which ports to open)
 ├── VPC / Subnet    → Network configuration (where to place the instance)
 ├── EBS Volume      → Storage / Hard Disk
 ├── Elastic IP      → Static public IP address
 ├── User Data       → Startup script (runs on first boot)
 ├── IAM Role        → Permissions for the instance
 └── Tags            → Labels for organization (Name, Environment, etc.)
```

## EC2 Instance Lifecycle

```
                    ┌──────────┐
                    │ PENDING  │ ← Instance is being created
                    └────┬─────┘
                         │
                         ▼
                    ┌──────────┐
             ┌──────│ RUNNING  │──────┐
             │      └────┬─────┘      │
             │           │            │
             ▼           ▼            ▼
        ┌─────────┐ ┌─────────┐ ┌────────────┐
        │ STOPPING│ │REBOOTING│ │SHUTTING-DOWN│
        └────┬────┘ └────┬────┘ └─────┬──────┘
             │           │            │
             ▼           ▼            ▼
        ┌─────────┐ ┌─────────┐ ┌────────────┐
        │ STOPPED │ │ RUNNING │ │ TERMINATED │
        └─────────┘ └─────────┘ └────────────┘
             │
             ▼
        ┌─────────┐
        │ RUNNING │  (Start again)
        └─────────┘
```

### State Descriptions

| State             | Description                              | Billing                           |
| ----------------- | ---------------------------------------- | --------------------------------- |
| **Pending**       | Instance is being launched               | ❌ No charge                       |
| **Running**       | Instance is active and usable            | ✅ Charged                         |
| **Stopping**      | Instance is being stopped                | ✅ Charged (briefly)               |
| **Stopped**       | Instance is stopped (EBS data preserved) | ❌ No compute charge (EBS charged) |
| **Rebooting**     | Instance is restarting                   | ✅ Charged                         |
| **Shutting-down** | Instance is being terminated             | ❌ No charge                       |
| **Terminated**    | Instance is deleted permanently          | ❌ No charge                       |

### Important Differences

| Action        | Public IP       | Private IP | EBS Data               | Instance Store |
| ------------- | --------------- | ---------- | ---------------------- | -------------- |
| **Stop**      | Released        | Retained   | ✅ Preserved            | ❌ Lost         |
| **Start**     | New IP assigned | Same IP    | ✅ Available            | ❌ Gone         |
| **Reboot**    | Same IP         | Same IP    | ✅ Preserved            | ✅ Preserved    |
| **Terminate** | Released        | Released   | ❌ Deleted (by default) | ❌ Lost         |

## Launching an EC2 Instance

### Prerequisites

* AWS Account (Free Tier eligible)
* Understanding of AMI, Security Groups, Key Pairs

{% stepper %}
{% step %}
## Open EC2 Dashboard

```
AWS Console → Services → EC2 → Launch Instance
```
{% endstep %}

{% step %}
## Name Your Instance

```
Name: MyFirstWebServer
```
{% endstep %}

{% step %}
## Choose an AMI (Operating System)

| AMI                      | Description            | Free Tier       |
| ------------------------ | ---------------------- | --------------- |
| Amazon Linux 2023        | AWS's own Linux distro | ✅ Yes           |
| Ubuntu 22.04 LTS         | Popular Linux distro   | ✅ Yes           |
| Red Hat Enterprise Linux | Enterprise Linux       | ❌ No            |
| Windows Server 2022      | Microsoft Windows      | ✅ Yes (limited) |
| SUSE Linux               | Enterprise Linux       | ❌ No            |

{% hint style="info" %}
For learning, use **Amazon Linux 2023** or **Ubuntu 22.04 LTS**.
{% endhint %}
{% endstep %}

{% step %}
## Choose Instance Type

```
t2.micro → 1 vCPU, 1 GB RAM → Free Tier eligible ✅
```
{% endstep %}

{% step %}
## Create or Select a Key Pair

```
Key Pair Name: my-aws-key
Key Pair Type: RSA
Format: .pem (Linux/Mac) or .ppk (Windows/PuTTY)
```

{% hint style="warning" %}
**Download and save the key pair immediately!** You cannot download it again.
{% endhint %}
{% endstep %}

{% step %}
## Configure Security Group (Firewall)

| Rule   | Protocol | Port | Source    | Purpose            |
| ------ | -------- | ---- | --------- | ------------------ |
| SSH    | TCP      | 22   | My IP     | Remote access      |
| HTTP   | TCP      | 80   | 0.0.0.0/0 | Web traffic        |
| HTTPS  | TCP      | 443  | 0.0.0.0/0 | Secure web traffic |
| Custom | TCP      | 8080 | 0.0.0.0/0 | Tomcat/Jenkins     |
{% endstep %}

{% step %}
## Configure Storage (EBS)

```
Root Volume: 8 GB (gp3) → Free Tier eligible
Delete on Termination: Yes (default)
```
{% endstep %}

{% step %}
## Configure Advanced Details (Optional)

**User Data** – Script that runs on first boot:

```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello from EC2!</h1>" > /var/www/html/index.html
```
{% endstep %}

{% step %}
## Launch Instance

```
Click "Launch Instance" → Instance starts in PENDING → RUNNING
```
{% endstep %}
{% endstepper %}

## Connecting to EC2

### Method 1 – SSH from Terminal (Linux/Mac)

```bash
# Set key permissions
chmod 400 my-aws-key.pem

# Connect via SSH
ssh -i "my-aws-key.pem" ec2-user@<PUBLIC-IP>

# For Ubuntu AMI
ssh -i "my-aws-key.pem" ubuntu@<PUBLIC-IP>
```

### Method 2 – EC2 Instance Connect (Browser-based)

```
EC2 Dashboard → Select Instance → Connect → EC2 Instance Connect → Connect
```

No key pair needed – works directly from the browser.

### Method 3 – PuTTY (Windows)

{% stepper %}
{% step %}
## Convert the Key

Convert `.pem` to `.ppk` using PuTTYgen.
{% endstep %}

{% step %}
## Open PuTTY

```
Host Name: ec2-user@<PUBLIC-IP>
```
{% endstep %}

{% step %}
## Select the Authentication Key

```
SSH → Auth → Browse → Select .ppk file
```
{% endstep %}

{% step %}
## Connect

```
Open
```
{% endstep %}
{% endstepper %}

### Method 4 – Session Manager (SSM)

```
No SSH key needed
No inbound ports needed
Requires IAM Role with SSM permissions
```

## Security Groups – Virtual Firewall

A **Security Group** acts as a **virtual firewall** for your EC2 instance.

### Key Concepts

| Feature      | Description                                                         |
| ------------ | ------------------------------------------------------------------- |
| **Level**    | Instance level                                                      |
| **State**    | **Stateful** – if you allow inbound, outbound response is automatic |
| **Default**  | All inbound DENIED, all outbound ALLOWED                            |
| **Rules**    | Only **ALLOW** rules (no deny rules)                                |
| **Multiple** | An instance can have multiple security groups                       |

### Common Security Group Rules

```
┌──────────────────────────────────────────────────┐
│              SECURITY GROUP                       │
│                                                   │
│  INBOUND RULES:                                   │
│  ┌─────────┬──────┬───────┬────────────────────┐ │
│  │  Type   │ Port │ Proto │ Source              │ │
│  ├─────────┼──────┼───────┼────────────────────┤ │
│  │  SSH    │  22  │  TCP  │ My IP (x.x.x.x/32)│ │
│  │  HTTP   │  80  │  TCP  │ 0.0.0.0/0          │ │
│  │  HTTPS  │ 443  │  TCP  │ 0.0.0.0/0          │ │
│  │  Custom │ 8080 │  TCP  │ 0.0.0.0/0          │ │
│  │  MySQL  │ 3306 │  TCP  │ sg-app-server      │ │
│  │  └──────┴──────┴───────┴────────────────────┘ │
│                                                   │
│  OUTBOUND RULES:                                  │
│  ┌─────────┬──────┬───────┬────────────────────┐ │
│  │  All    │ All  │  All  │ 0.0.0.0/0          │ │
│  └─────────┴──────┴───────┴────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Security Group Best Practices

* ✅ Follow **principle of least privilege** – open only required ports.
* ✅ Use **My IP** for SSH instead of `0.0.0.0/0`.
* ✅ Reference other **security groups** instead of IPs where possible.
* ✅ Create **separate security groups** for different tiers (web, app, db).
* ❌ Never open port 22 to `0.0.0.0/0` in production.

## Key Pairs – SSH Authentication

### How Key Pairs Work

```
┌─────────────────┐                    ┌─────────────────┐
│   YOUR LAPTOP   │                    │   EC2 INSTANCE  │
│                 │                    │                 │
│  Private Key    │ ──── SSH ────────→ │  Public Key     │
│  (my-key.pem)   │                    │  (~/.ssh/       │
│                 │                    │   authorized_   │
│  YOU keep this  │                    │   keys)         │
│  SAFELY         │                    │                 │
│                 │                    │  AWS stores     │
│                 │                    │  this for you   │
└─────────────────┘                    └─────────────────┘
```

### Important Rules

* **Private key** → You download this (`.pem` or `.ppk`).
* **Public key** → AWS stores this on the instance.
* If you **lose the private key**, you **cannot connect** via SSH.
* Each key pair is **Region-specific**.
* You can use the **same key pair** for multiple instances.

### Key Pair Commands

```bash
# Create key pair via CLI
aws ec2 create-key-pair --key-name my-key --query 'KeyMaterial' --output text > my-key.pem

# Set permissions
chmod 400 my-key.pem

# Delete key pair
aws ec2 delete-key-pair --key-name my-key
```

## EBS – Elastic Block Store (Instance Storage)

### What is EBS?

**EBS** is a **block-level storage** service for EC2. Think of it as a **virtual hard disk** attached to your EC2 instance.

### Key Features

| Feature         | Description                             |
| --------------- | --------------------------------------- |
| **Persistent**  | Data survives instance stop/start       |
| **Attachable**  | Can be attached/detached from instances |
| **Snapshots**   | Point-in-time backups (stored in S3)    |
| **Encryption**  | Supports encryption at rest             |
| **Resizable**   | Can increase size without downtime      |
| **AZ-Specific** | An EBS volume exists in ONE AZ only     |

### EBS Volume Types

| Type    | Name                     | Use Case                   | IOPS          | Throughput |
| ------- | ------------------------ | -------------------------- | ------------- | ---------- |
| **gp3** | General Purpose SSD      | Boot volumes, dev/test     | Up to 16,000  | 1,000 MB/s |
| **gp2** | General Purpose SSD      | General workloads          | Up to 16,000  | 250 MB/s   |
| **io2** | Provisioned IOPS SSD     | High-performance databases | Up to 256,000 | 4,000 MB/s |
| **io1** | Provisioned IOPS SSD     | Critical business apps     | Up to 64,000  | 1,000 MB/s |
| **st1** | Throughput Optimized HDD | Big data, data warehousing | Up to 500     | 500 MB/s   |
| **sc1** | Cold HDD                 | Infrequently accessed data | Up to 250     | 250 MB/s   |

{% hint style="info" %}
**gp3** is the default and recommended for most workloads.
{% endhint %}

### EBS Architecture

```
EC2 Instance (AZ: ap-south-1a)
     │
     ├── /dev/xvda  →  EBS Root Volume (8 GB, gp3) ← OS installed here
     ├── /dev/xvdb  →  EBS Data Volume (50 GB, gp3) ← Application data
     └── /dev/xvdc  →  EBS Volume (100 GB, st1) ← Logs
```

### EBS Snapshots

```
EBS Volume
     │
     ▼
  Snapshot (stored in S3)
     │
     ├── Create new EBS volume from snapshot
     ├── Copy snapshot to another Region (DR)
     └── Create AMI from snapshot
```

```bash
# Create a snapshot
aws ec2 create-snapshot --volume-id vol-xxxx --description "My backup"

# Create volume from snapshot
aws ec2 create-volume --snapshot-id snap-xxxx --availability-zone ap-south-1a --volume-type gp3

# Copy snapshot to another region
aws ec2 copy-snapshot --source-region ap-south-1 --source-snapshot-id snap-xxxx --destination-region us-east-1
```

## EBS vs Instance Store

| Feature         | EBS                                         | Instance Store                    |
| --------------- | ------------------------------------------- | --------------------------------- |
| **Persistence** | ✅ Data survives stop/start                  | ❌ Data lost on stop/terminate     |
| **Detachable**  | ✅ Can detach and attach to another instance | ❌ Cannot detach                   |
| **Snapshots**   | ✅ Supported                                 | ❌ Not supported                   |
| **Encryption**  | ✅ Supported                                 | ❌ Not natively                    |
| **Performance** | Good (gp3/io2)                              | Very high (physically attached)   |
| **Use Case**    | Boot volumes, databases, persistent data    | Temporary storage, cache, buffers |
| **Resizable**   | ✅ Yes                                       | ❌ No                              |

## Elastic IP – Static Public IP

### Problem

When you **stop** and **start** an EC2 instance, it gets a **new public IP**.

### Solution

An **Elastic IP** is a **static, public IPv4 address** that you can associate with your instance.

```
Before Elastic IP:
  Start → Public IP: 3.1.2.3
  Stop → IP released
  Start → Public IP: 13.4.5.6  ← Different IP!

After Elastic IP:
  Allocate Elastic IP: 52.66.100.50
  Associate with instance
  Stop/Start → IP stays 52.66.100.50 ✅
```

### Important Rules

* You get **5 Elastic IPs per Region** (default limit).
* Elastic IP is **FREE** when associated with a running instance.
* Elastic IP is **CHARGED** when NOT associated or instance is stopped.
* You can remap an Elastic IP from one instance to another.

### CLI Commands

```bash
# Allocate Elastic IP
aws ec2 allocate-address

# Associate with instance
aws ec2 associate-address --instance-id i-xxxxx --allocation-id eipalloc-xxxxx

# Release Elastic IP
aws ec2 release-address --allocation-id eipalloc-xxxxx
```

## User Data – Bootstrap Scripts

**User Data** is a script that runs **automatically on the first boot** of an EC2 instance.

### Example – Install Apache Web Server

```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Welcome to My EC2 Instance!</h1>" > /var/www/html/index.html
```

### Example – Install Docker + Jenkins

```bash
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Jenkins
docker run -d -p 8080:8080 -p 50000:50000 \
  --name jenkins \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

### Example – Install Tomcat

```bash
#!/bin/bash
yum update -y
yum install -y java-17-amazon-corretto
cd /opt
wget https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.93/bin/apache-tomcat-9.0.93.tar.gz
tar -xvf apache-tomcat-9.0.93.tar.gz
chmod +x /opt/apache-tomcat-9.0.93/bin/*.sh
/opt/apache-tomcat-9.0.93/bin/startup.sh
```

### Key Points

| Feature                     | Description                      |
| --------------------------- | -------------------------------- |
| Runs only on **first boot** | Not on every start               |
| Runs as **root**            | No need for sudo                 |
| Max size                    | 16 KB                            |
| View logs                   | `/var/log/cloud-init-output.log` |
| Base64 encoded              | When passed via CLI/API          |

## EC2 Pricing Models

| Model                   | Description                        | Discount  | Best For                                |
| ----------------------- | ---------------------------------- | --------- | --------------------------------------- |
| **On-Demand**           | Pay per hour/second, no commitment | 0%        | Testing, short-term, unpredictable      |
| **Reserved**            | 1 or 3 year commitment             | Up to 72% | Steady-state workloads                  |
| **Spot**                | Bid for unused capacity            | Up to 90% | Batch processing, CI/CD, fault-tolerant |
| **Savings Plans**       | Commit to usage ($/hour)           | Up to 72% | Flexible workloads                      |
| **Dedicated Hosts**     | Physical server for you            | Varies    | Compliance, licensing                   |
| **Dedicated Instances** | Instance on dedicated hardware     | Varies    | Compliance                              |

### Spot Instances – Important Concept

```
On-Demand Price: $0.10/hour
Your Bid:        $0.04/hour
Current Spot:    $0.03/hour → ✅ Instance runs

If Spot price → $0.05/hour → ❌ Instance terminated (2-min warning)
```

**Spot Use Cases:**

* CI/CD build agents
* Data analysis
* Batch processing
* Testing environments
* Machine learning training

{% hint style="warning" %}
**Never run production databases on Spot Instances!**
{% endhint %}

## EC2 Placement Groups

Placement groups control **how instances are placed** on underlying hardware.

| Type          | Description                            | Use Case                            |
| ------------- | -------------------------------------- | ----------------------------------- |
| **Cluster**   | All instances in same rack/AZ          | HPC, low-latency networking         |
| **Spread**    | Instances on different hardware        | Critical applications, max 7 per AZ |
| **Partition** | Groups of instances on different racks | Hadoop, Kafka, Cassandra            |

```
Cluster:              Spread:              Partition:
┌──────────┐        ┌──────────┐         ┌──────────┐
│ Rack 1   │        │ Rack 1   │         │ Rack 1   │
│ i1 i2 i3 │        │ i1       │         │ i1 i2    │ Partition 1
│ i4 i5 i6 │        │          │         │ i3       │
└──────────┘        ├──────────┤         ├──────────┤
                    │ Rack 2   │         │ Rack 2   │
                    │ i2       │         │ i4 i5    │ Partition 2
                    │          │         │ i6       │
                    ├──────────┤         └──────────┘
                    │ Rack 3   │
                    │ i3       │
                    └──────────┘
```

## EC2 Auto Scaling

**Auto Scaling** automatically adjusts the number of EC2 instances based on demand.

### Components

```
Auto Scaling Group (ASG)
     │
     ├── Launch Template    → What to launch (AMI, Instance Type, SG, Key)
     ├── Min Capacity       → Minimum instances (e.g., 2)
     ├── Max Capacity       → Maximum instances (e.g., 10)
     ├── Desired Capacity   → Current target (e.g., 4)
     └── Scaling Policies   → When to scale
```

### Scaling Policies

| Policy              | Description                      | Example                        |
| ------------------- | -------------------------------- | ------------------------------ |
| **Target Tracking** | Maintain a target metric value   | Keep CPU at 50%                |
| **Step Scaling**    | Scale based on metric thresholds | CPU > 80% → add 2 instances    |
| **Scheduled**       | Scale at specific times          | Scale up at 9 AM, down at 6 PM |
| **Predictive**      | ML-based prediction              | Anticipate traffic patterns    |

### Architecture with Auto Scaling

```
              Users
                │
                ▼
           Load Balancer (ALB)
                │
     ┌──────────┼──────────┐
     │          │          │
   EC2-1      EC2-2      EC2-3      ← Auto Scaling Group
   (AZ-a)     (AZ-b)     (AZ-a)
                │
                ▼
        Auto Scaling Policy
        CPU > 70% → Scale Out (add instances)
        CPU < 30% → Scale In (remove instances)
```

## EC2 + Load Balancer

### Types of Load Balancers

| Type                     | Layer                | Use Case                        |
| ------------------------ | -------------------- | ------------------------------- |
| **ALB** (Application LB) | Layer 7 (HTTP/HTTPS) | Web applications, microservices |
| **NLB** (Network LB)     | Layer 4 (TCP/UDP)    | Ultra-high performance, gaming  |
| **GLB** (Gateway LB)     | Layer 3 (Network)    | Third-party appliances          |
| **CLB** (Classic LB)     | Layer 4/7            | Legacy (not recommended)        |

### ALB Architecture

```
              Users
                │
                ▼
        ALB (Application Load Balancer)
                │
        ┌───────┼───────┐
        │               │
   Target Group 1   Target Group 2
   (path: /api/*)   (path: /web/*)
        │               │
     ┌──┼──┐         ┌──┼──┐
    EC2 EC2 EC2     EC2 EC2 EC2
```

## Common EC2 CLI Commands

```bash
# ── Instance Management ──────────────────────────────
# List all instances
aws ec2 describe-instances

# Launch an instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t2.micro \
  --key-name my-key \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx \
  --count 1 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyServer}]'

# Start / Stop / Terminate
aws ec2 start-instances --instance-ids i-xxxxx
aws ec2 stop-instances --instance-ids i-xxxxx
aws ec2 terminate-instances --instance-ids i-xxxxx

# Reboot
aws ec2 reboot-instances --instance-ids i-xxxxx

# ── Security Groups ──────────────────────────────────
# Create security group
aws ec2 create-security-group \
  --group-name my-sg \
  --description "My security group" \
  --vpc-id vpc-xxxxx

# Add inbound rule
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# ── Key Pairs ────────────────────────────────────────
# Create key pair
aws ec2 create-key-pair --key-name my-key --query 'KeyMaterial' --output text > my-key.pem

# List key pairs
aws ec2 describe-key-pairs

# ── EBS ──────────────────────────────────────────────
# List volumes
aws ec2 describe-volumes

# Attach volume
aws ec2 attach-volume --volume-id vol-xxxxx --instance-id i-xxxxx --device /dev/xvdb

# Detach volume
aws ec2 detach-volume --volume-id vol-xxxxx
```

## EC2 Best Practices

### Security

* ✅ Never use root account for EC2 management.
* ✅ Use IAM Roles instead of access keys on EC2.
* ✅ Keep SSH (port 22) restricted to your IP only.
* ✅ Enable encryption on EBS volumes.
* ✅ Use Security Groups + NACLs together.
* ✅ Regularly patch and update your instances.

### Cost Optimization

* ✅ Use Reserved Instances for steady workloads.
* ✅ Use Spot Instances for fault-tolerant workloads.
* ✅ Right-size your instances (don't over-provision).
* ✅ Stop unused instances.
* ✅ Delete unattached EBS volumes.
* ✅ Set up billing alarms.

### High Availability

* ✅ Deploy across multiple AZs.
* ✅ Use Auto Scaling Groups.
* ✅ Use Elastic Load Balancers.
* ✅ Take regular EBS snapshots.
* ✅ Use Multi-AZ RDS for databases.

## Classroom Demo Steps

{% stepper %}
{% step %}
## Demo 1 – Launch EC2 and Install Apache

```bash
# 1. Launch EC2 instance (t2.micro, Amazon Linux 2023)
# 2. Connect via SSH
ssh -i "my-key.pem" ec2-user@<PUBLIC-IP>

# 3. Install Apache
sudo yum update -y
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd

# 4. Create a web page
echo "<h1>Hello from $(hostname)</h1>" | sudo tee /var/www/html/index.html

# 5. Open browser → http://<PUBLIC-IP>
```
{% endstep %}

{% step %}
## Demo 2 – Attach EBS Volume

```bash
# 1. Create a new EBS volume in the same AZ
# 2. Attach to instance
# 3. From instance:
lsblk                              # List block devices
sudo mkfs -t xfs /dev/xvdb         # Format the volume
sudo mkdir /data                   # Create mount point
sudo mount /dev/xvdb /data         # Mount the volume
df -h                              # Verify mount

# 4. Auto-mount on reboot
echo "/dev/xvdb /data xfs defaults,nofail 0 2" | sudo tee -a /etc/fstab
```
{% endstep %}

{% step %}
## Demo 3 – Create Custom AMI

```bash
# 1. Configure your instance (install software, configure settings)
# 2. From EC2 Console:
#    Select Instance → Actions → Image and templates → Create image
# 3. Name: my-custom-ami
# 4. Wait for AMI to become Available
# 5. Launch a new instance from your custom AMI
```
{% endstep %}
{% endstepper %}

## EC2 Interview Questions ❓

<details>

<summary><strong>Q1: What is the difference between stopping and terminating an EC2 instance?</strong></summary>

**Stop:** Instance is paused, EBS data preserved, no compute charge. Can restart later.

**Terminate:** Instance is deleted permanently, EBS root volume deleted by default.

</details>

<details>

<summary><strong>Q2: Can you change the instance type of a running instance?</strong></summary>

**No.** You must stop the instance first, then change the instance type, then start it.

</details>

<details>

<summary><strong>Q3: What happens to the public IP when you stop an instance?</strong></summary>

**It is released.** When you start again, you get a new public IP. Use an **Elastic IP** for a static IP.

</details>

<details>

<summary><strong>Q4: What is the difference between a Security Group and a NACL?</strong></summary>

**Security Group:** Instance-level, stateful, only allow rules.

**NACL:** Subnet-level, stateless, allow + deny rules.

</details>

<details>

<summary><strong>Q5: How do you make an EC2 instance highly available?</strong></summary>

Deploy across **multiple AZs** with an **Auto Scaling Group** and an **Elastic Load Balancer**.

</details>

<details>

<summary><strong>Q6: What is User Data?</strong></summary>

A **bootstrap script** that runs automatically on the first boot of an EC2 instance. Used to install software, configure settings, etc.

</details>

# VPC Virtual Private Cloud

***

## 1. What is a VPC?

A **Virtual Private Cloud (VPC)** is a **logically isolated section of the AWS Cloud** where you can launch AWS resources in a virtual network that you define.

### Simple Analogy for Students

```
VPC = Your own private data center inside AWS

Think of it like this:

AWS Cloud         =  A huge apartment complex
Your VPC          =  Your private apartment
Subnets           =  Rooms inside your apartment
Internet Gateway  =  Main door to the outside world
Security Groups   =  Locks on each room door
Route Tables      =  Signs showing which corridor leads where
```

{% hint style="info" %}
**VPC = Your own isolated, private network in AWS where you control everything.**
{% endhint %}

***

## 2. VPC Key Components

```
VPC (10.0.0.0/16)
 │
 ├── Subnets
 │    ├── Public Subnet (10.0.1.0/24)
 │    └── Private Subnet (10.0.2.0/24)
 │
 ├── Internet Gateway (IGW)
 │
 ├── NAT Gateway
 │
 ├── Route Tables
 │    ├── Public Route Table
 │    └── Private Route Table
 │
 ├── Security Groups (instance-level firewall)
 │
 ├── Network ACLs (subnet-level firewall)
 │
 ├── Elastic IPs
 │
 ├── VPC Endpoints
 │
 ├── VPC Peering
 │
 └── VPN / Direct Connect
```

***

## 3. CIDR Blocks – IP Address Ranges

### What is CIDR?

**CIDR (Classless Inter-Domain Routing)** defines a range of IP addresses for your VPC.

### CIDR Notation

```
10.0.0.0/16

10.0.0.0  =  Base IP address
/16       =  Subnet mask (how many IPs are available)
```

### CIDR Quick Reference

| CIDR  | # of IPs | Range Example           | Use Case       |
| ----- | -------: | ----------------------- | -------------- |
| `/16` |   65,536 | 10.0.0.0 – 10.0.255.255 | Large VPC      |
| `/20` |    4,096 | 10.0.0.0 – 10.0.15.255  | Medium VPC     |
| `/24` |      256 | 10.0.1.0 – 10.0.1.255   | Typical subnet |
| `/28` |       16 | 10.0.1.0 – 10.0.1.15    | Small subnet   |

### VPC CIDR Rules

* VPC CIDR can be `/16` (largest) to `/28` (smallest).
* Private IP ranges recommended:
  * `10.0.0.0/8` (10.0.0.0 – 10.255.255.255)
  * `172.16.0.0/12` (172.16.0.0 – 172.31.255.255)
  * `192.168.0.0/16` (192.168.0.0 – 192.168.255.255)
* You can add **secondary CIDR blocks** to expand your VPC.

### AWS Reserved IPs in Each Subnet

AWS reserves **5 IP addresses** in every subnet:

```
Subnet: 10.0.1.0/24 (256 IPs total, 251 usable)

10.0.1.0     → Network address
10.0.1.1     → VPC Router
10.0.1.2     → DNS server
10.0.1.3     → Reserved for future use
10.0.1.255   → Broadcast address (not supported in VPC)
```

{% hint style="info" %}
A `/24` subnet gives you **251 usable IPs** (256 - 5 reserved).
{% endhint %}

***

## 4. Subnets

A **subnet** is a range of IP addresses within your VPC. Each subnet exists in **one Availability Zone** only.

### Public vs Private Subnets

| Feature             | Public Subnet                 | Private Subnet         |
| ------------------- | ----------------------------- | ---------------------- |
| **Internet Access** | ✅ Direct (via IGW)            | ❌ No direct access     |
| **Route Table**     | Routes to Internet Gateway    | Routes to NAT Gateway  |
| **Public IP**       | Instances can have public IPs | No public IPs          |
| **Use Case**        | Web servers, Load Balancers   | Databases, App servers |
| **Security**        | Exposed to internet           | Hidden from internet   |

### What Makes a Subnet "Public"?

A subnet is public when its **route table** has a route to an **Internet Gateway**:

```
Public Subnet Route Table:
┌───────────────────┬─────────────────┐
│  Destination      │  Target         │
├───────────────────┼─────────────────┤
│  10.0.0.0/16      │  local          │  ← VPC internal traffic
│  0.0.0.0/0        │  igw-xxxxx      │  ← All other traffic → Internet
└───────────────────┴─────────────────┘

Private Subnet Route Table:
┌───────────────────┬─────────────────┐
│  Destination      │  Target         │
├───────────────────┼─────────────────┤
│  10.0.0.0/16      │  local          │  ← VPC internal traffic
│  0.0.0.0/0        │  nat-xxxxx      │  ← All other traffic → NAT Gateway
└───────────────────┴─────────────────┘
```

### Subnet Design Example

```
VPC: 10.0.0.0/16
 │
 ├── AZ: ap-south-1a
 │    ├── Public Subnet:  10.0.1.0/24  (Web Servers)
 │    └── Private Subnet: 10.0.3.0/24  (App Servers, DB)
 │
 ├── AZ: ap-south-1b
 │    ├── Public Subnet:  10.0.2.0/24  (Web Servers)
 │    └── Private Subnet: 10.0.4.0/24  (App Servers, DB)
 │
 └── AZ: ap-south-1c
      ├── Public Subnet:  10.0.5.0/24  (Reserved)
      └── Private Subnet: 10.0.6.0/24  (Reserved)
```

***

## 5. Internet Gateway (IGW)

An **Internet Gateway** allows communication between your VPC and the internet.

### Key Points

* **One IGW per VPC** (1:1 relationship)
* Horizontally scaled, redundant, and highly available
* Provides a target in your route table for internet-bound traffic
* Performs **Network Address Translation (NAT)** for instances with public IPs

### How It Works

```
Internet
   │
   ▼
Internet Gateway (igw-xxxxx)
   │
   ▼
VPC (10.0.0.0/16)
   │
   ├── Public Subnet (10.0.1.0/24)
   │    └── EC2 with Public IP (10.0.1.10 + 3.1.2.3)
   │
   └── Private Subnet (10.0.2.0/24)
        └── EC2 without Public IP (10.0.2.10)
```

### Steps to Enable Internet Access

{% stepper %}
{% step %}
## Create an Internet Gateway
{% endstep %}

{% step %}
## Attach it to your VPC
{% endstep %}

{% step %}
## Create a route in the Public Subnet Route Table

```
Destination: 0.0.0.0/0 → Target: igw-xxxxx
```
{% endstep %}

{% step %}
## Assign a Public IP or Elastic IP to the EC2 instance
{% endstep %}

{% step %}
## Configure Security Group to allow required traffic
{% endstep %}
{% endstepper %}

***

## 6. NAT Gateway

A **NAT Gateway** allows instances in a **private subnet** to connect to the internet (outbound only) while preventing the internet from initiating connections to them.

### Why Use NAT Gateway?

```
Problem:
  Private subnet EC2 needs to download packages (yum update)
  But it should NOT be directly accessible from the internet

Solution:
  Use a NAT Gateway in the public subnet
```

### How NAT Gateway Works

```
Internet
   │
   ▼
Internet Gateway
   │
   ▼
┌──────────────────────────────────┐
│ Public Subnet (10.0.1.0/24)      │
│                                  │
│  NAT Gateway (nat-xxxxx)         │
│  (Has Elastic IP: 52.66.100.50)  │
│                                  │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Private Subnet (10.0.2.0/24)     │
│                                  │
│  EC2 (10.0.2.10) ─── yum update │
│  → Routes to NAT Gateway        │
│  → NAT Gateway forwards to IGW  │
│  → Internet                     │
│                                  │
│  ❌ Internet cannot reach EC2    │
│     directly                     │
└──────────────────────────────────┘
```

### NAT Gateway vs NAT Instance

| Feature             | NAT Gateway               | NAT Instance             |
| ------------------- | ------------------------- | ------------------------ |
| **Managed by**      | AWS (fully managed)       | You (EC2 instance)       |
| **Availability**    | Highly available in AZ    | Single point of failure  |
| **Bandwidth**       | Up to 100 Gbps            | Depends on instance type |
| **Maintenance**     | None                      | You patch and maintain   |
| **Cost**            | Per hour + data processed | EC2 instance cost        |
| **Security Groups** | ❌ Not applicable          | ✅ Configurable           |
| **Recommendation**  | ✅ Use this                | ❌ Legacy                 |

### NAT Gateway – Key Points

* Must be created in a **public subnet**
* Requires an **Elastic IP**
* Create **one NAT Gateway per AZ** for high availability
* Charges: hourly + per GB of data processed

### High Availability NAT Setup

```
VPC
 │
 ├── AZ-a
 │    ├── Public Subnet → NAT Gateway-a
 │    └── Private Subnet → Route to NAT Gateway-a
 │
 └── AZ-b
      ├── Public Subnet → NAT Gateway-b
      └── Private Subnet → Route to NAT Gateway-b
```

***

## 7. Route Tables

A **Route Table** contains a set of rules (**routes**) that determine where network traffic is directed.

### Key Points

* Every subnet **must** be associated with a route table.
* A VPC comes with a **Main Route Table** (default).
* You can create **Custom Route Tables**.
* If no explicit association, the subnet uses the Main Route Table.

### Route Table Example

```
Public Route Table:
┌───────────────────┬──────────────────┬─────────────┐
│  Destination      │  Target          │  Status     │
├───────────────────┼──────────────────┼─────────────┤
│  10.0.0.0/16      │  local           │  Active     │
│  0.0.0.0/0        │  igw-xxxxx       │  Active     │
└───────────────────┴──────────────────┴─────────────┘

Private Route Table:
┌───────────────────┬──────────────────┬─────────────┐
│  Destination      │  Target          │  Status     │
├───────────────────┼──────────────────┼─────────────┤
│  10.0.0.0/16      │  local           │  Active     │
│  0.0.0.0/0        │  nat-xxxxx       │  Active     │
└───────────────────┴──────────────────┴─────────────┘
```

### Route Priority

Routes are evaluated **most specific first** (longest prefix match):

```
Example: Traffic going to 10.0.1.50

Route 1: 10.0.0.0/16  → local          ← /16 (less specific)
Route 2: 10.0.1.0/24  → peering-xxxxx  ← /24 (MORE specific) ← WINS!
Route 3: 0.0.0.0/0    → igw-xxxxx      ← /0  (least specific)
```

***

## 8. Security Groups vs NACLs

These are the **two layers of security** in a VPC.

### Comparison Table

| Feature              | Security Group               | Network ACL (NACL)                |
| -------------------- | ---------------------------- | --------------------------------- |
| **Level**            | Instance level               | Subnet level                      |
| **State**            | **Stateful**                 | **Stateless**                     |
| **Rules**            | Only ALLOW rules             | ALLOW and DENY rules              |
| **Evaluation**       | All rules evaluated together | Rules evaluated in ORDER (number) |
| **Default Inbound**  | All DENIED                   | All ALLOWED (default NACL)        |
| **Default Outbound** | All ALLOWED                  | All ALLOWED (default NACL)        |
| **Association**      | Attached to ENI (instance)   | Attached to Subnet                |
| **Return Traffic**   | Automatically allowed        | Must explicitly allow             |

### What Does "Stateful" vs "Stateless" Mean?

```
STATEFUL (Security Group):
  Inbound Rule: Allow port 80 from anywhere
  → Response traffic on port 80 is AUTOMATICALLY allowed outbound
  → No need for a separate outbound rule for the response

STATELESS (NACL):
  Inbound Rule: Allow port 80 from anywhere
  → Response traffic is NOT automatically allowed
  → You MUST add an outbound rule for ephemeral ports (1024-65535)
```

### Security Group Example

```
Security Group: web-sg
  Inbound:
    HTTP   (80)   from 0.0.0.0/0
    HTTPS  (443)  from 0.0.0.0/0
    SSH    (22)   from My IP

  Outbound:
    All traffic to 0.0.0.0/0    (default)
```

### NACL Example

```
Network ACL: web-nacl
  Inbound Rules:
  ┌──────┬──────────┬──────────┬──────┬────────────┬────────┐
  │ Rule │ Type     │ Protocol │ Port │ Source     │ Action │
  ├──────┼──────────┼──────────┼──────┼────────────┼────────┤
  │ 100  │ HTTP     │ TCP      │ 80   │ 0.0.0.0/0 │ ALLOW  │
  │ 110  │ HTTPS    │ TCP      │ 443  │ 0.0.0.0/0 │ ALLOW  │
  │ 120  │ SSH      │ TCP      │ 22   │ x.x.x.x/32│ ALLOW  │
  │ *    │ All      │ All      │ All  │ 0.0.0.0/0 │ DENY   │
  └──────┴──────────┴──────────┴──────┴────────────┴────────┘

  Outbound Rules:
  ┌──────┬──────────┬──────────┬───────────────┬────────────┬────────┐
  │ Rule │ Type     │ Protocol │ Port          │ Dest       │ Action │
  ├──────┼──────────┼──────────┼───────────────┼────────────┼────────┤
  │ 100  │ Custom   │ TCP      │ 1024-65535    │ 0.0.0.0/0 │ ALLOW  │
  │ *    │ All      │ All      │ All           │ 0.0.0.0/0 │ DENY   │
  └──────┴──────────┴──────────┴───────────────┴────────────┴────────┘
```

{% hint style="warning" %}
NACL rules are evaluated **in order by rule number**. First match wins!
{% endhint %}

### Two-Layer Security Architecture

```
Internet
   │
   ▼
┌──────────────────────────────────┐
│ Network ACL (Subnet-level)        │  ← First line of defense
│ Rule 100: Allow HTTP inbound      │
│ Rule 110: Allow HTTPS inbound     │
│ Rule *:   Deny all                │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Security Group (Instance-level)   │  ← Second line of defense
│ Allow: HTTP (80) from 0.0.0.0/0  │
│ Allow: HTTPS (443) from 0.0.0.0/0│
│ Allow: SSH (22) from My IP        │
└──────────────┬───────────────────┘
               │
               ▼
          EC2 Instance
```

***

## 9. VPC Endpoints

A **VPC Endpoint** allows you to privately connect your VPC to supported AWS services **without using the internet**.

### Why Use Endpoints?

```
Without Endpoint:
  EC2 (Private Subnet) → NAT Gateway → IGW → Internet → S3
  (Traffic goes over the internet)

With Endpoint:
  EC2 (Private Subnet) → VPC Endpoint → S3
  (Traffic stays within AWS network – faster, more secure, no data transfer charges)
```

### Types of VPC Endpoints

| Type                   | Description                        | Example Services                |
| ---------------------- | ---------------------------------- | ------------------------------- |
| **Gateway Endpoint**   | Free, uses route table entry       | S3, DynamoDB                    |
| **Interface Endpoint** | Costs money, uses ENI (private IP) | CloudWatch, SNS, SQS, ECR, etc. |

### Gateway Endpoint – S3 Example

```
Route Table Entry:
┌──────────────────────┬───────────────────────┐
│  Destination         │  Target               │
├──────────────────────┼───────────────────────┤
│  10.0.0.0/16         │  local                │
│  pl-xxxxx (S3 prefix)│  vpce-xxxxx           │  ← S3 via endpoint
│  0.0.0.0/0           │  nat-xxxxx            │
└──────────────────────┴───────────────────────┘
```

***

## 10. VPC Peering

**VPC Peering** is a networking connection between two VPCs that allows traffic routing using **private IP addresses**.

### Key Points

* Can peer VPCs in the **same or different Regions**
* Can peer VPCs in the **same or different AWS accounts**
* Traffic stays on the **AWS private network** (does not traverse the internet)
* **NOT transitive** – if A↔B and B↔C, A cannot reach C through B

### VPC Peering Example

```
VPC-A (10.0.0.0/16)              VPC-B (172.16.0.0/16)
     │                                 │
     │          VPC Peering            │
     │     ←────────────────→          │
     │      pcx-xxxxx                  │
     │                                 │
 EC2 (10.0.1.10) ←──────→ EC2 (172.16.1.10)
```

### Route Table Entries for Peering

```
VPC-A Route Table:
  10.0.0.0/16    → local
  172.16.0.0/16  → pcx-xxxxx     ← Traffic to VPC-B via peering

VPC-B Route Table:
  172.16.0.0/16  → local
  10.0.0.0/16    → pcx-xxxxx     ← Traffic to VPC-A via peering
```

### Non-Transitive Peering

```
VPC-A ←→ VPC-B ←→ VPC-C

VPC-A can talk to VPC-B  ✅
VPC-B can talk to VPC-C  ✅
VPC-A can talk to VPC-C  ❌  (must create separate peering A↔C)
```

***

## 11. VPN and Direct Connect

### VPN (Virtual Private Network)

Connects your **on-premises network** to your VPC over an **encrypted tunnel** through the internet.

```
On-Premises Data Center
     │
  Customer Gateway (CGW)
     │
  ──── IPsec VPN Tunnel (Encrypted) ──── Internet ────
     │
  Virtual Private Gateway (VGW)
     │
  VPC
```

### Direct Connect

A **dedicated, private connection** from your data center to AWS (no internet).

```
On-Premises Data Center
     │
  ──── Direct Connect (Physical Fiber) ────
     │
  AWS Direct Connect Location
     │
  VPC
```

### Comparison

| Feature        | VPN                           | Direct Connect                     |
| -------------- | ----------------------------- | ---------------------------------- |
| **Connection** | Over the internet (encrypted) | Dedicated private link             |
| **Bandwidth**  | Up to 1.25 Gbps               | Up to 100 Gbps                     |
| **Latency**    | Variable (internet)           | Consistent, low                    |
| **Setup Time** | Minutes                       | Weeks to months                    |
| **Cost**       | Low                           | Higher                             |
| **Encryption** | ✅ Built-in (IPsec)            | ❌ Not by default (add VPN on top)  |
| **Use Case**   | Quick, cost-effective         | High bandwidth, consistent latency |

***

## 12. Default VPC vs Custom VPC

| Feature              | Default VPC              | Custom VPC                 |
| -------------------- | ------------------------ | -------------------------- |
| **Created by**       | AWS (automatically)      | You                        |
| **CIDR**             | 172.31.0.0/16            | You define                 |
| **Subnets**          | One public subnet per AZ | You create as needed       |
| **Internet Gateway** | ✅ Attached               | You attach                 |
| **Public IPs**       | Auto-assigned            | You configure              |
| **Use Case**         | Quick start, learning    | Production, controlled env |

{% hint style="info" %}
**Always create a Custom VPC for production.** The Default VPC is convenient for learning.
{% endhint %}

***

## 13. Complete VPC Architecture – Production Example

```
┌─────────────────────────────────────────────────────────────┐
│                    VPC (10.0.0.0/16)                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 AZ: ap-south-1a                      │    │
│  │                                                     │    │
│  │  ┌────────────────────────┐  ┌────────────────────┐ │    │
│  │  │ Public Subnet          │  │ Private Subnet      │ │    │
│  │  │ 10.0.1.0/24            │  │ 10.0.3.0/24         │ │    │
│  │  │                        │  │                     │ │    │
│  │  │  ALB                   │  │  EC2 (App Server)   │ │    │
│  │  │  NAT Gateway           │  │  RDS (Primary)      │ │    │
│  │  │  Bastion Host          │  │                     │ │    │
│  │  └────────────────────────┘  └────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 AZ: ap-south-1b                      │    │
│  │                                                     │    │
│  │  ┌────────────────────────┐  ┌────────────────────┐ │    │
│  │  │ Public Subnet          │  │ Private Subnet      │ │    │
│  │  │ 10.0.2.0/24            │  │ 10.0.4.0/24         │ │    │
│  │  │                        │  │                     │ │    │
│  │  │  ALB                   │  │  EC2 (App Server)   │ │    │
│  │  │  NAT Gateway           │  │  RDS (Standby)      │ │    │
│  │  └────────────────────────┘  └────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Internet Gateway (igw-xxxxx)                               │
└─────────────────────────────────────────────────────────────┘
         │
    Internet / Users
```

***

## 14. Creating a VPC – Step by Step

### From AWS Console

```
VPC Dashboard → Your VPCs → Create VPC

VPC Settings:
  Name: my-production-vpc
  CIDR: 10.0.0.0/16
  Tenancy: Default
```

### From AWS CLI

{% stepper %}
{% step %}
## Create VPC

```bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-vpc}]'
```
{% endstep %}

{% step %}
## Create Internet Gateway

```bash
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=my-igw}]'
```
{% endstep %}

{% step %}
## Attach IGW to VPC

```bash
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxx --internet-gateway-id igw-xxxxx
```
{% endstep %}

{% step %}
## Create Public Subnet

```bash
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 --availability-zone ap-south-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-subnet-1a}]'
```
{% endstep %}

{% step %}
## Create Private Subnet

```bash
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 --availability-zone ap-south-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-subnet-1a}]'
```
{% endstep %}

{% step %}
## Create Public Route Table

```bash
aws ec2 create-route-table --vpc-id vpc-xxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=public-rt}]'
```
{% endstep %}

{% step %}
## Add Internet Route

```bash
aws ec2 create-route --route-table-id rtb-xxxxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxxxx
```
{% endstep %}

{% step %}
## Associate Route Table with Public Subnet

```bash
aws ec2 associate-route-table --route-table-id rtb-xxxxx --subnet-id subnet-xxxxx
```
{% endstep %}

{% step %}
## Enable Auto-Assign Public IP for Public Subnet

```bash
aws ec2 modify-subnet-attribute --subnet-id subnet-xxxxx --map-public-ip-on-launch
```
{% endstep %}

{% step %}
## Allocate Elastic IP for NAT Gateway

```bash
aws ec2 allocate-address --domain vpc
```
{% endstep %}

{% step %}
## Create NAT Gateway in Public Subnet

```bash
aws ec2 create-nat-gateway --subnet-id subnet-public-xxxxx --allocation-id eipalloc-xxxxx
```
{% endstep %}

{% step %}
## Create Private Route Table

```bash
aws ec2 create-route-table --vpc-id vpc-xxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=private-rt}]'
```
{% endstep %}

{% step %}
## Add NAT Gateway Route to Private Route Table

```bash
aws ec2 create-route --route-table-id rtb-private-xxxxx --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-xxxxx
```
{% endstep %}

{% step %}
## Associate Private Route Table with Private Subnet

```bash
aws ec2 associate-route-table --route-table-id rtb-private-xxxxx --subnet-id subnet-private-xxxxx
```
{% endstep %}
{% endstepper %}

***

## 15. VPC Flow Logs

**VPC Flow Logs** capture information about the IP traffic going to and from network interfaces in your VPC.

### What It Captures

```
<version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>
```

### Example Log Entry

```
2 123456789012 eni-xxxxx 10.0.1.10 52.66.100.50 443 54321 6 10 5000 1620000000 1620000060 ACCEPT OK
2 123456789012 eni-xxxxx 203.0.113.5 10.0.1.10 0 0 1 1 40 1620000000 1620000060 REJECT OK
```

### Where to Send Flow Logs

* CloudWatch Logs
* S3 Bucket
* Kinesis Data Firehose

### Use Cases

* Troubleshooting connectivity issues
* Security analysis
* Compliance and auditing
* Monitoring traffic patterns

***

## 16. VPC Best Practices

### Design

* ✅ Plan your CIDR blocks carefully (avoid overlaps for peering)
* ✅ Use at least **2 AZs** for high availability
* ✅ Separate **public and private subnets**
* ✅ Use **separate VPCs** for different environments (dev, staging, prod)
* ✅ Use a CIDR that doesn't conflict with on-premises networks

### Security

* ✅ Use **Security Groups** as the primary defense
* ✅ Use **NACLs** for additional subnet-level control
* ✅ Enable **VPC Flow Logs** for monitoring
* ✅ Use **VPC Endpoints** for AWS services (no internet required)
* ✅ Use **Bastion Hosts** or **Session Manager** for SSH access
* ✅ Never put databases in public subnets

### Connectivity

* ✅ Use **NAT Gateway** (not NAT Instance) for private subnet internet access
* ✅ Create **one NAT Gateway per AZ** for HA
* ✅ Use **VPC Peering** for cross-VPC communication
* ✅ Use **Transit Gateway** for connecting many VPCs

***

## 17. Traffic Flow – Complete Path

### User Accessing a Web Application

```
User (Internet)
     │
     ▼
Internet Gateway (igw-xxxxx)
     │
     ▼
NACL (Subnet-level check)
     │  ✅ Rule 100: Allow HTTP
     ▼
Security Group (Instance-level check)
     │  ✅ Allow port 80 from 0.0.0.0/0
     ▼
EC2 Instance (Web Server)
     │
     ▼ (Needs to query database)
     │
Security Group (DB SG)
     │  ✅ Allow port 3306 from web-sg
     ▼
RDS Instance (Private Subnet)
     │
     ▼ (Response goes back)
     │
     ▼ (Security Groups are STATEFUL – response automatically allowed)
     │
User receives the web page
```

### Private Instance Downloading Updates

```
EC2 (Private Subnet 10.0.2.10)
     │
     ▼  yum update -y
     │
Private Route Table: 0.0.0.0/0 → nat-xxxxx
     │
     ▼
NAT Gateway (Public Subnet)
     │  Translates: 10.0.2.10 → 52.66.100.50 (Elastic IP)
     │
     ▼
Internet Gateway
     │
     ▼
Internet (yum repository)
     │
     ▼ (Response comes back through the same path)
```

***

## 18. Classroom Quiz Questions ❓

<details>

<summary><strong>Q1: What is a VPC?</strong></summary>

A logically isolated virtual network in AWS where you launch resources. You control the IP ranges, subnets, route tables, and gateways.

</details>

<details>

<summary><strong>Q2: What is the difference between a public subnet and a private subnet?</strong></summary>

**Public subnet** has a route to an Internet Gateway → instances can access the internet directly.

**Private subnet** has no route to IGW → instances cannot be accessed from the internet.

</details>

<details>

<summary><strong>Q3: How can a private subnet instance access the internet?</strong></summary>

Through a **NAT Gateway** placed in a public subnet.

</details>

<details>

<summary><strong>Q4: What is the difference between a Security Group and a NACL?</strong></summary>

**Security Group:** Instance-level, stateful, only allow rules.

**NACL:** Subnet-level, stateless, allow + deny rules, evaluated in order.

</details>

<details>

<summary><strong>Q5: What does "stateful" mean in Security Groups?</strong></summary>

If you allow inbound traffic on port 80, the **response traffic is automatically allowed** outbound. You don't need a separate outbound rule.

</details>

<details>

<summary><strong>Q6: Can two VPCs communicate with each other?</strong></summary>

**Yes**, through **VPC Peering**. But peering is NOT transitive.

</details>

<details>

<summary><strong>Q7: How many IPs does AWS reserve in each subnet?</strong></summary>

**5 IPs** – network address, VPC router, DNS, future use, and broadcast.

</details>

<details>

<summary><strong>Q8: What is a VPC Endpoint?</strong></summary>

A private connection from your VPC to AWS services (like S3) that stays within the AWS network, without going through the internet.

</details>

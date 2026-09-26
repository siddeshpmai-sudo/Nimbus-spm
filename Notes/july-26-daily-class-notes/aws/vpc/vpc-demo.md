# VPC demo

## Overview

This demonstration teaches a production-grade 2-tier VPC architecture across multiple Availability Zones. Students will understand network isolation, traffic routing, internet connectivity, and high-availability patterns through hands-on lab work.

**Architecture Goal:** Deploy a VPC with public subnets for web servers and private subnets for databases, enabling secure inter-subnet communication and controlled internet access.

**Estimated Duration:** 90–120 minutes with hands-on exercises

## Phase 1: Conceptual Foundation (15 minutes)

### 1.1 Explain VPC Architecture with Diagram

Start with a visual representation showing:

```
┌─────────────────────────────────── VPC (10.0.0.0/16) ──────────────────────────────┐
│                                                                                      │
│  ┌─────────────────────────────────┐      ┌──────────────────────────────────┐    │
│  │  Availability Zone A (us-east-1a)│      │ Availability Zone B (us-east-1b) │    │
│  │                                  │      │                                  │    │
│  │  ┌──────────────────────────────┐│      │ ┌──────────────────────────────┐ │    │
│  │  │ Public Subnet A               ││      │ │ Public Subnet B              │ │    │
│  │  │ (10.0.1.0/24)                 ││      │ │ (10.0.3.0/24)               │ │    │
│  │  │ • EC2 Web Server 1            ││      │ │ • EC2 Web Server 2          │ │    │
│  │  │ • Route: 0.0.0.0/0 → IGW     ││      │ │ • Route: 0.0.0.0/0 → IGW   │ │    │
│  │  └──────────────────────────────┘│      │ └──────────────────────────────┘ │    │
│  │                                  │      │                                  │    │
│  │  ┌──────────────────────────────┐│      │ ┌──────────────────────────────┐ │    │
│  │  │ Private Subnet A              ││      │ │ Private Subnet B             │ │    │
│  │  │ (10.0.2.0/24)                 ││      │ │ (10.0.4.0/24)               │ │    │
│  │  │ • EC2 App Server              ││      │ │ • EC2 App Server            │ │    │
│  │  │ • RDS Database                ││      │ │ • RDS Database              │ │    │
│  │  │ • Route: 0.0.0.0/0 → NAT-GW │ │      │ │ • Route: 0.0.0.0/0 → NAT-GW│ │    │
│  │  └──────────────────────────────┘│      │ └──────────────────────────────┘ │    │
│  │                                  │      │                                  │    │
│  │  NAT Gateway A                   │      │  NAT Gateway B                   │    │
│  │  + Elastic IP: 54.123.45.67     │      │  + Elastic IP: 54.234.56.78     │    │
│  └──────────────────────────────────┘      │                                  │    │
│                                            └──────────────────────────────────┘    │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────┐    │
│  │ Internet Gateway (IGW)                                                     │    │
│  │ • Enables communication between VPC and Internet                          │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
         │
         │ Internet (0.0.0.0/0)
         │
    ┌────▼────┐
    │ Internet │
    └──────────┘
```

**Key Concepts to Explain:**

* **VPC:** Isolated network environment within AWS Region
* **CIDR Block:** IP address range (`10.0.0.0/16` provides 65,536 addresses)
* **Availability Zones:** Independent data centers for high availability
* **Subnets:** Smaller CIDR blocks within VPC for resource grouping
* **Public vs. Private:** Connectivity to internet vs. internal-only

### 1.2 Component Overview Table

| Component                  | Purpose                                    | Example Configuration           |
| -------------------------- | ------------------------------------------ | ------------------------------- |
| **VPC**                    | Container for all resources                | 10.0.0.0/16 (65,536 IPs)        |
| **Public Subnet**          | Internet-facing resources                  | 10.0.1.0/24 in AZ-A             |
| **Private Subnet**         | Internal resources (no direct internet)    | 10.0.2.0/24 in AZ-A             |
| **Internet Gateway (IGW)** | Enables VPC ↔ Internet communication       | Attached to VPC, routes traffic |
| **NAT Gateway**            | Allows private → internet (not vice versa) | 1 per AZ for HA                 |
| **Elastic IP (EIP)**       | Static public IPv4 address                 | Assigned to NAT Gateway         |
| **Route Table**            | Traffic routing rules                      | Public RTB routes via IGW       |
| **Network ACL**            | Subnet-level firewall                      | Stateless, numbered rules       |
| **Security Group**         | Instance-level firewall                    | Stateful, allow rules only      |

### 1.3 Traffic Flow Walkthrough

#### Scenario A: Web Server → Internet (Public Subnet)

1. EC2 instance sends packet to internet (e.g., AWS API).
2. IGW translates instance's private IP to public IP.
3. Packet exits to internet.
4. Response packet returns, IGW translates back.
5. Instance receives response.

#### Scenario B: Database Server → Internet (Private Subnet)

1. RDS database initiates software update request.
2. Packet reaches NAT Gateway in same AZ.
3. NAT Gateway translates source IP to Elastic IP.
4. Packet exits VPC via IGW using Elastic IP.
5. Response returns to NAT Gateway, then to RDS.

## Phase 2: Step-by-Step Implementation (75 minutes)

{% stepper %}
{% step %}
## Create the VPC (5 minutes)

**Console Steps:**

* Navigate to VPC Dashboard → VPCs → Create VPC.
* Configure:
  * Name: `Production-VPC`
  * CIDR Block: `10.0.0.0/16`
  * IPv6 CIDR Block: Leave empty (unless teaching IPv6)
  * Tenancy: Default
* Click Create VPC.

**CLI Alternative:**

{% code title="Create VPC (CLI)" %}
```bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=Production-VPC}]'
```
{% endcode %}

**Teaching Point:**

* Explain CIDR notation: `10.0.0.0/16` = 65,536 usable IPs.
* Avoid overlapping with on-premises networks (common mistake).
* Note the Main Route Table auto-created.
{% endstep %}

{% step %}
## Create Internet Gateway (5 minutes)

**Console Steps:**

* VPC Dashboard → Internet Gateways → Create Internet Gateway.
* Configure:
  * Name: `Production-IGW`
* Click Create.
* Select created IGW → Attach to VPC → Select `Production-VPC`.

**CLI Alternative:**

{% code title="Create and Attach IGW (CLI)" %}
```bash
# Create IGW
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=Production-IGW}]'

# Attach to VPC
aws ec2 attach-internet-gateway --internet-gateway-id igw-xxxxx --vpc-id vpc-xxxxx
```
{% endcode %}

**Teaching Point:**

* One IGW per VPC (1:1 relationship).
* Must be explicitly attached to VPC.
* Without IGW, public subnets can't reach internet.
{% endstep %}

{% step %}
## Create Subnets Across Availability Zones (10 minutes)

### Create Public Subnet A

* VPC Dashboard → Subnets → Create Subnet.
* Configure:
  * VPC: `Production-VPC`
  * Subnet Name: `Public-Subnet-A`
  * Availability Zone: `us-east-1a` (or your region's first AZ)
  * IPv4 CIDR Block: `10.0.1.0/24` (256 IPs, usable range: 10.0.1.1 - 10.0.1.254)
* Click Create Subnet.

### Create Public Subnet B

Repeat above with:

* Name: `Public-Subnet-B`
* AZ: `us-east-1b`
* CIDR: `10.0.3.0/24`

### Create Private Subnet A

* Name: `Private-Subnet-A`
* AZ: `us-east-1a`
* CIDR: `10.0.2.0/24`

### Create Private Subnet B

* Name: `Private-Subnet-B`
* AZ: `us-east-1b`
* CIDR: `10.0.4.0/24`

**CLI Alternative (example for two subnets):**

{% code title="Create Subnets (CLI)" %}
```bash
# Public Subnet A
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-A}]'

# Private Subnet A
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-A}]'
```
{% endcode %}

**Teaching Points:**

* `/24` = 256 IPs per subnet (253 usable: .1-.254, exclude .0 and .255).
* Always create subnets in at least 2 AZs for HA.
* Subnet CIDR blocks must not overlap.
* Document the IP allocation plan (subnet map).
{% endstep %}

{% step %}
## Allocate Elastic IPs for NAT Gateways (5 minutes)

**Console Steps:**

* EC2 Dashboard → Elastic IPs → Allocate Elastic IP Address.
* Configure:
  * Network Border Group: Leave as default.
  * Public IPv4 Address Pool: Amazon's pool of IPv4 addresses.
* Click Allocate.
* Note the Allocation ID (format: `eipalloc-xxxxx`).
* Repeat to allocate a second Elastic IP for NAT Gateway B.

**CLI Alternative:**

{% code title="Allocate Elastic IPs (CLI)" %}
```bash
# Allocate first Elastic IP
aws ec2 allocate-address --domain vpc --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-GW-A-EIP}]'

# Allocate second Elastic IP
aws ec2 allocate-address --domain vpc --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-GW-B-EIP}]'
```
{% endcode %}

**Teaching Points:**

* EIPs are static (don't change when instance restarts).
* EIPs are regional (can't move between regions).
* AWS charges for unassociated EIPs (\~$3.65/month).
* Essential for NAT Gateway to function.
* Show students the Allocation ID (used to reference EIP).
{% endstep %}

{% step %}
## Create NAT Gateways (10 minutes)

### Create NAT Gateway A (in Public Subnet A)

* VPC Dashboard → NAT Gateways → Create NAT Gateway.
* Configure:
  * Subnet: `Public-Subnet-A`
  * Elastic IP Allocation ID: Select the first EIP you allocated.
* Click Create NAT Gateway.
* Wait for status to become "Available" (\~1–2 minutes).

### Create NAT Gateway B (in Public Subnet B)

Repeat above with:

* Subnet: `Public-Subnet-B`
* Elastic IP Allocation ID: Second EIP

**CLI Alternative:**

{% code title="Create NAT Gateways (CLI)" %}
```bash
# Create NAT Gateway A
aws ec2 create-nat-gateway --subnet-id subnet-xxxxx --allocation-id eipalloc-xxxxx \
  --tag-specifications 'ResourceType=nat-gateway,Tags=[{Key=Name,Value=NAT-GW-A}]'

# Create NAT Gateway B
aws ec2 create-nat-gateway --subnet-id subnet-xxxxx --allocation-id eipalloc-xxxxx \
  --tag-specifications 'ResourceType=nat-gateway,Tags=[{Key=Name,Value=NAT-GW-B}]'
```
{% endcode %}

**Teaching Points:**

* NAT Gateway must be in a **public** subnet (to reach IGW).
* One NAT Gateway per AZ is AWS best practice (HA).
* NAT only allows outbound connections (instances can't receive from internet).
* Use NAT Instances if you need inbound access or packet filtering.
* Show the NAT Gateway state transitions: Pending → Available.
{% endstep %}

{% step %}
## Create and Configure Route Tables (15 minutes)

### Create Public Route Table

* VPC Dashboard → Route Tables → Create Route Table.
* Configure:
  * VPC: `Production-VPC`
  * Name: `Public-RTB`
* Click Create Route Table.
* Select created route table → Routes tab → Edit Routes.
* Add Route:
  * Destination: `0.0.0.0/0` (all internet traffic)
  * Target: Select Internet Gateway → `Production-IGW`
* Click Save Routes.

### Create Private Route Table A

* Create Route Table:
  * VPC: `Production-VPC`
  * Name: `Private-RTB-A`
* Add Route:
  * Destination: `0.0.0.0/0`
  * Target: NAT Gateway → `NAT-GW-A` (in AZ-A)
* Save Routes.

### Create Private Route Table B

* Create Route Table:
  * VPC: `Production-VPC`
  * Name: `Private-RTB-B`
* Add Route:
  * Destination: `0.0.0.0/0`
  * Target: NAT Gateway → `NAT-GW-B` (in AZ-B)
* Save Routes.

**CLI Alternative (examples):**

{% code title="Create Route Tables and Routes (CLI)" %}
```bash
# Create Public Route Table
aws ec2 create-route-table --vpc-id vpc-xxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Public-RTB}]'

# Add IGW route
aws ec2 create-route --route-table-id rtb-xxxxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxxxx

# Create Private Route Table A
aws ec2 create-route-table --vpc-id vpc-xxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Private-RTB-A}]'

# Add NAT Gateway route
aws ec2 create-route --route-table-id rtb-xxxxx --destination-cidr-block 0.0.0.0/0 --nat-gateway-id natgw-xxxxx
```
{% endcode %}

**Teaching Points:**

* Route tables contain rules that determine traffic direction.
* Default local route (`10.0.0.0/16` → local) is auto-created.
* Most specific route wins (longest prefix match).
* Example: If both `0.0.0.0/0` and `10.0.0.0/16` match, `10.0.0.0/16` wins.
* **Critical HA Pattern:** Private subnets in different AZs use different NAT Gateways (avoids single AZ failure).
{% endstep %}

{% step %}
## Associate Subnets with Route Tables (5 minutes)

### Associate Public Subnets

* Select `Public-RTB` → Subnet Associations tab.
* Edit Subnet Associations.
* Select both `Public-Subnet-A` and `Public-Subnet-B`.
* Save Associations.

### Associate Private Subnets with Respective Route Tables

* Select `Private-RTB-A` → Subnet Associations tab.
* Edit Subnet Associations → Select `Private-Subnet-A` → Save.
* Select `Private-RTB-B` → Subnet Associations tab.
* Edit Subnet Associations → Select `Private-Subnet-B` → Save.

**CLI Alternative:**

{% code title="Associate Route Tables (CLI)" %}
```bash
# Associate Public Subnet A with Public RTB
aws ec2 associate-route-table --subnet-id subnet-xxxxx --route-table-id rtb-public

# Associate Private Subnet A with Private RTB-A
aws ec2 associate-route-table --subnet-id subnet-private-a --route-table-id rtb-private-a
```
{% endcode %}

**Teaching Points:**

* One subnet → One route table (but one route table → Many subnets).
* Unassociated subnets automatically use main route table.
* Association diagram: Show how traffic flows based on route table rules.
{% endstep %}

{% step %}
## Enable Public IP Assignment (5 minutes)

**Console Steps:**

* VPC Dashboard → Subnets.
* Select `Public-Subnet-A` → Actions → Edit Subnet Settings.
* Check "Enable auto-assign public IPv4 address".
* Click Save.
* Repeat for `Public-Subnet-B`.

**CLI Alternative:**

{% code title="Enable Auto-Assign Public IP (CLI)" %}
```bash
aws ec2 modify-subnet-attribute --subnet-id subnet-public-a --map-public-ip-on-launch
```
{% endcode %}

**Teaching Points:**

* Ensures EC2 instances in public subnets get public IPs automatically.
* Otherwise, instances have only private IPs.
* Can be overridden per instance during launch.
{% endstep %}
{% endstepper %}

## Phase 3: Testing and Validation (20 minutes)

### Test 1: Launch EC2 Instances and Verify Connectivity

#### Launch Public Instance (Web Server)

* EC2 Dashboard → Instances → Launch Instances.
* Configure:
  * AMI: Amazon Linux 2
  * Instance Type: t2.micro (free tier eligible)
  * Network: `Production-VPC`
  * Subnet: `Public-Subnet-A`
  * Auto-assign Public IP: Enable
  * Security Group: Create new, allow SSH (port 22) and HTTP (port 80)
  * Add user data script:

{% code title="Web server user-data" %}
```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
echo "<h1>Web Server in Public Subnet A</h1>" > /var/www/html/index.html
```
{% endcode %}

#### Launch Private Instance (Database Server)

Repeat above with:

* Subnet: `Private-Subnet-A`
* Auto-assign Public IP: Disable (don't check)
* User data:

{% code title="Private instance user-data" %}
```bash
#!/bin/bash
yum update -y
# Install monitoring tools
yum install -y net-tools wget curl
```
{% endcode %}

### Test 2: Verify Public Instance Internet Access

{% stepper %}
{% step %}
## Get the public instance's public IP
{% endstep %}

{% step %}
## SSH into the instance

{% code title="SSH into public instance" %}
```bash
ssh -i your-key.pem ec2-user@<public-ip>
```
{% endcode %}
{% endstep %}

{% step %}
## Test outbound internet access

{% code title="Test outbound from public instance" %}
```bash
curl https://aws.amazon.com
ping google.com
```
{% endcode %}

**Expected:** Successful responses (proves IGW is working).
{% endstep %}
{% endstepper %}

### Test 3: Verify Private Instance Outbound Access

{% stepper %}
{% step %}
## Create a temporary bastion host in the public subnet or use Systems Manager Session Manager
{% endstep %}

{% step %}
## SSH into the private instance via bastion or Session Manager

{% code title="SSH to private via bastion" %}
```bash
# If using bastion
ssh -i key.pem -J ec2-user@<bastion-ip> ec2-user@<private-ip>

# If using Session Manager (easier)
# Select instance → Connect → Session Manager → Connect
```
{% endcode %}
{% endstep %}

{% step %}
## Test outbound internet access from the private instance

{% code title="Test outbound from private instance" %}
```bash
curl https://aws.amazon.com
```
{% endcode %}

**Expected:** Successful (proves NAT Gateway is working).
{% endstep %}
{% endstepper %}

### Test 4: Verify Private Instance Has No Inbound Internet Access

{% stepper %}
{% step %}
## Try to SSH directly to the private instance from your laptop

{% code title="Attempt SSH to private instance" %}
```bash
ssh -i key.pem ec2-user@<private-ip>
```
{% endcode %}
{% endstep %}

{% step %}
## Confirm the expected result

**Expected:** Connection timeout (proves NAT Gateway blocks inbound).
{% endstep %}
{% endstepper %}

### Test 5: Verify Subnets in Same AZ Use Same NAT Gateway

{% stepper %}
{% step %}
## Launch two instances in `Private-Subnet-A`
{% endstep %}

{% step %}
## Check outbound traffic NAT translation

{% code title="Check NAT IP" %}
```bash
# Inside private instance
curl https://ifconfig.me
# Should return NAT-GW-A's Elastic IP
```
{% endcode %}
{% endstep %}

{% step %}
## Verify a cross-AZ private instance uses a different NAT Gateway

{% code title="Check NAT IP in other AZ" %}
```bash
# Inside private instance in Private-Subnet-B
curl https://ifconfig.me
# Should return NAT-GW-B's different Elastic IP
```
{% endcode %}
{% endstep %}
{% endstepper %}

## Phase 4: Advanced Concepts (Optional, 10 minutes)

### 4.1 Discuss Regional NAT Gateway (AWS New Feature)

**What it is:**

* Automatically spans multiple AZs.
* No need for public subnets.
* Simplifies architecture for simple use cases.

**Trade-offs:**

* Newer feature (not available in all regions yet).
* Less control than per-AZ NAT Gateways.
* Recommended for: New applications starting fresh.

**When to use traditional per-AZ:**

* Existing architectures.
* Compliance requirements for subnet isolation.
* Multi-tier architectures with complex routing.

### 4.2 Security Best Practices

#### Network ACLs (Subnet-level)

```
Public Subnet NACL Rules:
Rule 100: Inbound  0.0.0.0/0 80 (HTTP)
Rule 110: Inbound  0.0.0.0/0 443 (HTTPS)
Rule 120: Inbound  0.0.0.0/0 22 (SSH, admin only)
Rule 130: Inbound  0.0.0.0/0 1024-65535 (ephemeral ports for return traffic)

Private Subnet NACL Rules:
Rule 100: Inbound  10.0.0.0/16 (all internal traffic)
Rule 110: Inbound  0.0.0.0/0 1024-65535 (return traffic from internet)
```

#### Security Groups (Instance-level)

* Web Server SG: Allow 22, 80, 443 from specific IPs.
* App Server SG: Allow 3306 (MySQL) from Web Server SG only.
* Database SG: Allow 3306 from App Server SG only.

### 4.3 Cost Optimization

| Component                 | Cost                      | Monthly Estimate   |
| ------------------------- | ------------------------- | ------------------ |
| VPC                       | Free                      | $0                 |
| IGW                       | Free                      | $0                 |
| NAT Gateway               | $32/month + data transfer | $32 (per GW)       |
| Elastic IP (unassociated) | $3.65/month               | $3.65              |
| Data Transfer (NAT)       | $0.045/GB                 | $0.045/GB (egress) |

**Cost Optimization Strategies:**

* Delete unused Elastic IPs.
* Consider NAT Instance for low-traffic environments.
* Use VPC Endpoints for AWS services (avoids NAT costs).
* Monitor NAT Gateway data transfer via CloudWatch.

## Phase 5: Troubleshooting Guide

<details>

<summary>Symptom: Public instance can't reach internet</summary>

**Checklist:**

1. ✓ Instance has public IP (check EC2 console).
2. ✓ Security Group allows outbound (usually default allows all).
3. ✓ Route table has route to IGW (`0.0.0.0/0` → `igw-xxx`).
4. ✓ IGW is attached to VPC.
5. ✓ Subnet's route table is properly associated.

**Debugging commands:**

{% code title="Debugging commands (public instance)" %}
```bash
# From instance, test connectivity
ping 8.8.8.8  # Google DNS
curl https://aws.amazon.com

# Check route table
aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-xxxxx

# Check IGW attachment
aws ec2 describe-internet-gateways --internet-gateway-ids igw-xxxxx
```
{% endcode %}

</details>

<details>

<summary>Symptom: Private instance can't reach internet</summary>

**Checklist:**

1. ✓ Route table has route to NAT Gateway (`0.0.0.0/0` → `natgw-xxx`).
2. ✓ NAT Gateway is in AVAILABLE state.
3. ✓ NAT Gateway has Elastic IP associated.
4. ✓ NAT Gateway's public subnet has route to IGW.
5. ✓ NACL and Security Group allow outbound traffic.
6. ✓ NAT Gateway is in SAME AZ as private subnet (for HA).

**Debugging commands:**

{% code title="Debugging commands (private instance)" %}
```bash
# From private instance (via bastion/Session Manager)
traceroute 8.8.8.8
curl https://aws.amazon.com

# Check NAT Gateway status
aws ec2 describe-nat-gateways --nat-gateway-ids natgw-xxxxx

# Verify subnet's route table
aws ec2 describe-route-tables --subnet-ids subnet-xxxxx
```
{% endcode %}

</details>

<details>

<summary>Symptom: Cross-subnet communication not working</summary>

**Checklist:**

1. ✓ Security Groups allow traffic between instance IPs.
2. ✓ NACLs allow bidirectional traffic.
3. ✓ Both subnets in same VPC.
4. ✓ Route tables have local route (`10.0.0.0/16`).

**Test connectivity between instances:**

{% code title="Test connectivity between instances" %}
```bash
# From instance A to instance B (private IP)
ping 10.0.2.5
ssh ec2-user@10.0.2.5
```
{% endcode %}

</details>

## Lab Exercises for Students

### Exercise 1: Network Segmentation

* **Task:** Create a third tier for database in private subnet with restricted access.
  * Modify app tier's security group to allow only MySQL (3306) from app servers.
  * Create database security group allowing 3306 only from app SG.
  * Verify web server cannot directly access database.

### Exercise 2: Multi-Region Connectivity

* **Task:** Explore VPC Peering or Transit Gateway (advanced).
  * Create second VPC in different region.
  * Establish connectivity between VPCs.
  * Test cross-VPC communication.

### Exercise 3: Cost Analysis

* **Task:** Calculate monthly costs for the architecture.
  * 2 NAT Gateways × $32 = $64.
  * Estimated data transfer.
  * Document cost optimization opportunities.

### Exercise 4: Disaster Recovery

* **Task:** Simulate AZ failure.
  * Disable NAT Gateway A.
  * Verify private instances in AZ-B still have internet (via NAT-GW-B).
  * Document RTO/RPO for this architecture.

## Key Takeaways for Students

1. **VPC Fundamentals**
   * VPC isolates your network from other AWS customers.
   * Design subnets carefully using CIDR planning.
   * Document your IP allocation strategy.
2. **High Availability Pattern**
   * Always use multiple AZs.
   * One NAT Gateway per AZ prevents single AZ failure.
   * Private subnets in different AZs use different NAT Gateways.
3. **Security Layering**
   * IGW controls VPC ↔ Internet.
   * NAT Gateway controls private subnet → Internet (one-way).
   * NACLs and Security Groups add defense in depth.
4. **Routing Logic**
   * Route tables are the "traffic directors".
   * Most specific route wins (longest prefix match).
   * Always verify route table associations.
5. **Cost Management**
   * NAT Gateways are major VPC cost ($32-64/month per environment).
   * Monitor data transfer charges.
   * Use VPC Endpoints for AWS services to avoid NAT costs.

## Resources for Students

* AWS VPC Documentation: https://docs.aws.amazon.com/vpc/
* VPC Pricing: https://aws.amazon.com/vpc/pricing/
* VPC Flow Logs: For troubleshooting connectivity issues
* IP Calculator: https://www.subnet-calculator.com/ (for CIDR planning)
* AWS Well-Architected Framework: Network foundation guidance

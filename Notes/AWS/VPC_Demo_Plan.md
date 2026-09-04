# AWS VPC Demo – Step-by-Step Resource Creation Guide

> **Batch:** Nimbus DevOps Training  
> **Duration:** 90–120 minutes  
> **Goal:** Build a production-grade 2-tier VPC with public & private subnets across 2 AZs

---

## Architecture We Are Building

```
┌─────────────────────────────────── VPC (10.0.0.0/16) ──────────────────────────────┐
│                                                                                     │
│  ┌────────────────────────────────┐     ┌────────────────────────────────┐          │
│  │  AZ-A (ap-south-1a)            │     │  AZ-B (ap-south-1b)            │          │
│  │                                │     │                                │          │
│  │  ┌──────────────────────────┐  │     │  ┌──────────────────────────┐  │          │
│  │  │ Public Subnet A          │  │     │  │ Public Subnet B          │  │          │
│  │  │ 10.0.1.0/24              │  │     │  │ 10.0.3.0/24              │  │          │
│  │  │ • EC2 Web Server         │  │     │  │ • EC2 Web Server         │  │          │
│  │  │ • NAT Gateway A          │  │     │  │ • NAT Gateway B          │  │          │
│  │  │ • Route → IGW            │  │     │  │ • Route → IGW            │  │          │
│  │  └──────────────────────────┘  │     │  └──────────────────────────┘  │          │
│  │                                │     │                                │          │
│  │  ┌──────────────────────────┐  │     │  ┌──────────────────────────┐  │          │
│  │  │ Private Subnet A         │  │     │  │ Private Subnet B         │  │          │
│  │  │ 10.0.2.0/24              │  │     │  │ 10.0.4.0/24              │  │          │
│  │  │ • EC2 App/DB Server      │  │     │  │ • EC2 App/DB Server      │  │          │
│  │  │ • Route → NAT-GW-A      │  │     │  │ • Route → NAT-GW-B      │  │          │
│  │  └──────────────────────────┘  │     │  └──────────────────────────┘  │          │
│  └────────────────────────────────┘     └────────────────────────────────┘          │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │ Internet Gateway (IGW)                                                      │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
        │
   Internet
```

---

## IP Allocation Plan

```
VPC: 10.0.0.0/16 (65,536 IPs)

AZ-A (ap-south-1a):
├── Public-Subnet-A:   10.0.1.0/24   (251 usable IPs)
└── Private-Subnet-A:  10.0.2.0/24   (251 usable IPs)

AZ-B (ap-south-1b):
├── Public-Subnet-B:   10.0.3.0/24   (251 usable IPs)
└── Private-Subnet-B:  10.0.4.0/24   (251 usable IPs)
```

---

## Resource Creation Order

| # | Resource | Name | Key Config |
|---|---|---|---|
| 1 | VPC | `Production-VPC` | CIDR: `10.0.0.0/16` |
| 2 | Internet Gateway | `Production-IGW` | Attach to VPC |
| 3 | Subnet | `Public-Subnet-A` | `10.0.1.0/24`, AZ-A |
| 4 | Subnet | `Public-Subnet-B` | `10.0.3.0/24`, AZ-B |
| 5 | Subnet | `Private-Subnet-A` | `10.0.2.0/24`, AZ-A |
| 6 | Subnet | `Private-Subnet-B` | `10.0.4.0/24`, AZ-B |
| 7 | Elastic IP | `NAT-GW-A-EIP` | For NAT Gateway A |
| 8 | Elastic IP | `NAT-GW-B-EIP` | For NAT Gateway B |
| 9 | NAT Gateway | `NAT-GW-A` | In Public-Subnet-A + EIP-A |
| 10 | NAT Gateway | `NAT-GW-B` | In Public-Subnet-B + EIP-B |
| 11 | Route Table | `Public-RTB` | Route `0.0.0.0/0` → IGW |
| 12 | Route Table | `Private-RTB-A` | Route `0.0.0.0/0` → NAT-GW-A |
| 13 | Route Table | `Private-RTB-B` | Route `0.0.0.0/0` → NAT-GW-B |
| 14 | — | Subnet Associations | Link subnets to route tables |
| 15 | — | Enable Auto-Assign Public IP | On both public subnets |
| 16 | Security Group | `Web-SG` | SSH + HTTP from internet |
| 17 | Security Group | `Private-SG` | SSH from Web-SG only |
| 18 | EC2 Instance | Public Web Server | In Public-Subnet-A |
| 19 | EC2 Instance | Private App Server | In Private-Subnet-A |

---

## Step 1 – Create the VPC

**Console:** VPC Dashboard → Your VPCs → **Create VPC**

| Setting | Value |
|---|---|
| Name tag | `Production-VPC` |
| IPv4 CIDR block | `10.0.0.0/16` |
| IPv6 CIDR block | No IPv6 |
| Tenancy | Default |

Click **Create VPC**.

**CLI:**
```bash
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=Production-VPC}]'
```

> 💡 **Explain:** `/16` gives us 65,536 IPs. A Main Route Table is auto-created with this VPC.

---

## Step 2 – Create and Attach Internet Gateway

**Console:** VPC Dashboard → Internet Gateways → **Create Internet Gateway**

| Setting | Value |
|---|---|
| Name tag | `Production-IGW` |

Click **Create** → Then select it → **Actions → Attach to VPC** → Select `Production-VPC`.

**CLI:**
```bash
# Create IGW
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=Production-IGW}]'

# Attach to VPC (use your vpc-id)
aws ec2 attach-internet-gateway \
  --internet-gateway-id igw-xxxxx \
  --vpc-id vpc-xxxxx
```

> 💡 **Explain:** One IGW per VPC. Without this, nothing in the VPC can reach the internet.

---

## Step 3 – Create 4 Subnets (2 Public + 2 Private)

**Console:** VPC Dashboard → Subnets → **Create Subnet**

Select VPC: `Production-VPC`, then add all 4 subnets:

### Subnet 1 – Public Subnet A

| Setting | Value |
|---|---|
| Subnet name | `Public-Subnet-A` |
| Availability Zone | `ap-south-1a` |
| IPv4 CIDR block | `10.0.1.0/24` |

### Subnet 2 – Private Subnet A

| Setting | Value |
|---|---|
| Subnet name | `Private-Subnet-A` |
| Availability Zone | `ap-south-1a` |
| IPv4 CIDR block | `10.0.2.0/24` |

### Subnet 3 – Public Subnet B

| Setting | Value |
|---|---|
| Subnet name | `Public-Subnet-B` |
| Availability Zone | `ap-south-1b` |
| IPv4 CIDR block | `10.0.3.0/24` |

### Subnet 4 – Private Subnet B

| Setting | Value |
|---|---|
| Subnet name | `Private-Subnet-B` |
| Availability Zone | `ap-south-1b` |
| IPv4 CIDR block | `10.0.4.0/24` |

Click **Create Subnet** (creates all 4 at once).

**CLI:**
```bash
# Public Subnet A
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 \
  --availability-zone ap-south-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-A}]'

# Private Subnet A
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 \
  --availability-zone ap-south-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-A}]'

# Public Subnet B
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.3.0/24 \
  --availability-zone ap-south-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-B}]'

# Private Subnet B
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.4.0/24 \
  --availability-zone ap-south-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-B}]'
```

> 💡 **Explain:** `/24` = 256 IPs, but AWS reserves 5, so 251 usable. Always spread across 2+ AZs for HA.

---

## Step 4 – Allocate Elastic IPs for NAT Gateways

**Console:** EC2 Dashboard → Elastic IPs → **Allocate Elastic IP address**

Do this **twice** to get 2 Elastic IPs. Name them:
- `NAT-GW-A-EIP`
- `NAT-GW-B-EIP`

**CLI:**
```bash
# Elastic IP for NAT-GW-A
aws ec2 allocate-address --domain vpc \
  --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-GW-A-EIP}]'

# Elastic IP for NAT-GW-B
aws ec2 allocate-address --domain vpc \
  --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-GW-B-EIP}]'
```

> 💡 **Explain:** NAT Gateway needs a static public IP. Unused EIPs cost ~$3.65/month.

---

## Step 5 – Create NAT Gateways (One per AZ)

**Console:** VPC Dashboard → NAT Gateways → **Create NAT Gateway**

### NAT Gateway A

| Setting | Value |
|---|---|
| Name | `NAT-GW-A` |
| Subnet | `Public-Subnet-A` ⚠️ (must be PUBLIC) |
| Elastic IP allocation ID | Select `NAT-GW-A-EIP` |

### NAT Gateway B

| Setting | Value |
|---|---|
| Name | `NAT-GW-B` |
| Subnet | `Public-Subnet-B` |
| Elastic IP allocation ID | Select `NAT-GW-B-EIP` |

Wait for status: **Pending → Available** (~1–2 minutes).

**CLI:**
```bash
# NAT Gateway A (in Public Subnet A)
aws ec2 create-nat-gateway \
  --subnet-id subnet-public-a-xxxxx \
  --allocation-id eipalloc-xxxxx \
  --tag-specifications 'ResourceType=nat-gateway,Tags=[{Key=Name,Value=NAT-GW-A}]'

# NAT Gateway B (in Public Subnet B)
aws ec2 create-nat-gateway \
  --subnet-id subnet-public-b-xxxxx \
  --allocation-id eipalloc-xxxxx \
  --tag-specifications 'ResourceType=nat-gateway,Tags=[{Key=Name,Value=NAT-GW-B}]'
```

> ⚠️ **Critical:** NAT Gateway MUST be in a **public subnet**. One NAT per AZ = High Availability.

---

## Step 6 – Create Route Tables

**Console:** VPC Dashboard → Route Tables → **Create Route Table**

### 6.1 – Public Route Table

| Setting | Value |
|---|---|
| Name | `Public-RTB` |
| VPC | `Production-VPC` |

After creating → **Routes tab → Edit routes → Add route:**

| Destination | Target |
|---|---|
| `10.0.0.0/16` | local (auto-created) |
| `0.0.0.0/0` | `Production-IGW` |

### 6.2 – Private Route Table A

| Setting | Value |
|---|---|
| Name | `Private-RTB-A` |
| VPC | `Production-VPC` |

Add route:

| Destination | Target |
|---|---|
| `10.0.0.0/16` | local |
| `0.0.0.0/0` | `NAT-GW-A` |

### 6.3 – Private Route Table B

| Setting | Value |
|---|---|
| Name | `Private-RTB-B` |
| VPC | `Production-VPC` |

Add route:

| Destination | Target |
|---|---|
| `10.0.0.0/16` | local |
| `0.0.0.0/0` | `NAT-GW-B` |

**CLI:**
```bash
# Public Route Table
aws ec2 create-route-table --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Public-RTB}]'
aws ec2 create-route --route-table-id rtb-public-xxxxx \
  --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxxxx

# Private Route Table A
aws ec2 create-route-table --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Private-RTB-A}]'
aws ec2 create-route --route-table-id rtb-private-a-xxxxx \
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-a-xxxxx

# Private Route Table B
aws ec2 create-route-table --vpc-id vpc-xxxxx \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Private-RTB-B}]'
aws ec2 create-route --route-table-id rtb-private-b-xxxxx \
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-b-xxxxx
```

> 💡 **Explain:** `0.0.0.0/0` = "all traffic not matching any other route". Public subnets route to IGW, private subnets route to NAT.

---

## Step 7 – Associate Subnets with Route Tables

**Console:** Select each Route Table → **Subnet Associations tab → Edit subnet associations**

| Route Table | Associate With |
|---|---|
| `Public-RTB` | `Public-Subnet-A` + `Public-Subnet-B` |
| `Private-RTB-A` | `Private-Subnet-A` |
| `Private-RTB-B` | `Private-Subnet-B` |

**CLI:**
```bash
# Public subnets → Public RTB
aws ec2 associate-route-table --subnet-id subnet-pub-a --route-table-id rtb-public
aws ec2 associate-route-table --subnet-id subnet-pub-b --route-table-id rtb-public

# Private Subnet A → Private RTB A
aws ec2 associate-route-table --subnet-id subnet-priv-a --route-table-id rtb-private-a

# Private Subnet B → Private RTB B
aws ec2 associate-route-table --subnet-id subnet-priv-b --route-table-id rtb-private-b
```

> 💡 **Explain:** A subnet without explicit association uses the Main Route Table (which has no IGW route = private by default).

---

## Step 8 – Enable Auto-Assign Public IP on Public Subnets

**Console:** VPC → Subnets → Select `Public-Subnet-A` → **Actions → Edit subnet settings**

✅ Check **"Enable auto-assign public IPv4 address"** → Save

Repeat for `Public-Subnet-B`.

**CLI:**
```bash
aws ec2 modify-subnet-attribute --subnet-id subnet-pub-a --map-public-ip-on-launch
aws ec2 modify-subnet-attribute --subnet-id subnet-pub-b --map-public-ip-on-launch
```

> 💡 **Explain:** Without this, EC2 instances in public subnets won't get a public IP and can't be reached from the internet.

---

## Step 9 – Create Security Groups

**Console:** VPC Dashboard → Security Groups → **Create security group**

### 9.1 – Web Server Security Group

| Setting | Value |
|---|---|
| Name | `Web-SG` |
| Description | Allow SSH and HTTP from internet |
| VPC | `Production-VPC` |

**Inbound Rules:**

| Type | Port | Source | Purpose |
|---|---|---|---|
| SSH | 22 | My IP | Admin access |
| HTTP | 80 | `0.0.0.0/0` | Web traffic |
| HTTPS | 443 | `0.0.0.0/0` | Secure web traffic |

**Outbound:** All traffic → `0.0.0.0/0` (default)

### 9.2 – Private Server Security Group

| Setting | Value |
|---|---|
| Name | `Private-SG` |
| Description | Allow SSH only from Web-SG |
| VPC | `Production-VPC` |

**Inbound Rules:**

| Type | Port | Source | Purpose |
|---|---|---|---|
| SSH | 22 | `Web-SG` (select SG) | Access from public instances only |
| All ICMP | — | `10.0.0.0/16` | Ping from within VPC |

**Outbound:** All traffic → `0.0.0.0/0`

**CLI:**
```bash
# Web SG
WEB_SG=$(aws ec2 create-security-group --group-name Web-SG \
  --description "Allow SSH and HTTP" --vpc-id vpc-xxxxx --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $WEB_SG --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $WEB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $WEB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0

# Private SG
PRIV_SG=$(aws ec2 create-security-group --group-name Private-SG \
  --description "Allow SSH from Web-SG only" --vpc-id vpc-xxxxx --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $PRIV_SG \
  --protocol tcp --port 22 --source-group $WEB_SG
```

---

## Step 10 – Launch EC2 Instances & Test

### 10.1 – Launch Public Instance (Web Server)

**Console:** EC2 → Launch Instances

| Setting | Value |
|---|---|
| Name | `Web-Server-Public` |
| AMI | Amazon Linux 2023 |
| Instance Type | `t2.micro` (Free Tier) |
| Key Pair | Select or create one |
| Network | `Production-VPC` |
| Subnet | `Public-Subnet-A` |
| Auto-assign Public IP | Enable |
| Security Group | `Web-SG` |

**User Data (Advanced Details):**
```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
INSTANCE_AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "<h1>Web Server in Public Subnet</h1><p>AZ: $INSTANCE_AZ</p>" > /var/www/html/index.html
```

### 10.2 – Launch Private Instance

| Setting | Value |
|---|---|
| Name | `App-Server-Private` |
| AMI | Amazon Linux 2023 |
| Instance Type | `t2.micro` |
| Key Pair | Same key pair |
| Network | `Production-VPC` |
| Subnet | `Private-Subnet-A` |
| Auto-assign Public IP | **Disable** |
| Security Group | `Private-SG` |

**User Data:**
```bash
#!/bin/bash
yum update -y
yum install -y net-tools wget curl
```

---

## Step 11 – Verify & Test Everything

### ✅ Test 1 – Web Server is Reachable from Internet

```bash
# Open browser → http://<PUBLIC_IP>
# Should see: "Web Server in Public Subnet"
```

### ✅ Test 2 – SSH into Public Instance

```bash
chmod 400 my-key.pem
ssh -i "my-key.pem" ec2-user@<PUBLIC_IP>
```

### ✅ Test 3 – Public Instance Has Internet Access

```bash
# Inside public instance:
ping google.com -c 3
curl https://aws.amazon.com -s -o /dev/null -w "%{http_code}"
# Expected: 200 (proves IGW works)
```

### ✅ Test 4 – SSH into Private Instance via Public (Bastion/Jump)

```bash
# From your laptop – using SSH Jump:
ssh -i "my-key.pem" -J ec2-user@<PUBLIC_IP> ec2-user@<PRIVATE_IP>

# Or copy key to public instance first:
scp -i "my-key.pem" my-key.pem ec2-user@<PUBLIC_IP>:/tmp/
ssh -i "my-key.pem" ec2-user@<PUBLIC_IP>
# Then from public instance:
ssh -i /tmp/my-key.pem ec2-user@<PRIVATE_IP>
```

### ✅ Test 5 – Private Instance Has Outbound Internet (via NAT)

```bash
# Inside private instance:
curl https://aws.amazon.com -s -o /dev/null -w "%{http_code}"
# Expected: 200 (proves NAT Gateway works)

curl https://ifconfig.me
# Expected: Shows NAT Gateway's Elastic IP (NOT instance's private IP)
```

### ❌ Test 6 – Private Instance is NOT Directly Reachable

```bash
# From your laptop – try to SSH directly to private IP:
ssh -i "my-key.pem" ec2-user@<PRIVATE_IP>
# Expected: Connection TIMEOUT (proves private subnet is isolated)
```

---

## Troubleshooting Checklist

### Public Instance Can't Reach Internet?

- [ ] Instance has a public IP?
- [ ] Security Group allows outbound traffic?
- [ ] Subnet's Route Table has `0.0.0.0/0 → IGW` route?
- [ ] IGW is attached to the VPC?
- [ ] Subnet is associated with the correct Route Table?

### Private Instance Can't Reach Internet?

- [ ] Route Table has `0.0.0.0/0 → NAT Gateway` route?
- [ ] NAT Gateway status is **Available**?
- [ ] NAT Gateway has an Elastic IP?
- [ ] NAT Gateway is in a **public** subnet?
- [ ] NAT Gateway's public subnet has a route to IGW?
- [ ] Security Group allows outbound traffic?

### Can't SSH from Public to Private Instance?

- [ ] Private SG allows SSH (port 22) from `Web-SG`?
- [ ] Both instances are in the same VPC?
- [ ] Using the correct private IP (10.0.x.x)?
- [ ] Key pair is available on the public instance?

---

## Cost Summary

| Resource | Cost |
|---|---|
| VPC | Free |
| IGW | Free |
| Subnets | Free |
| Route Tables | Free |
| Security Groups | Free |
| NAT Gateway | **~$32/month each** + $0.045/GB data |
| Elastic IP (associated) | Free |
| Elastic IP (unassociated) | ~$3.65/month |
| EC2 t2.micro | Free Tier (750 hrs/month) |

> ⚠️ **After demo:** Delete NAT Gateways and release Elastic IPs to avoid charges!

---

## Cleanup Order (After Demo)

```
1. Terminate EC2 instances
2. Delete NAT Gateways (wait for status: Deleted)
3. Release Elastic IPs
4. Delete Subnets
5. Delete Route Tables (custom ones only)
6. Detach and Delete Internet Gateway
7. Delete VPC
```

```bash
# Quick cleanup CLI
aws ec2 terminate-instances --instance-ids i-xxxxx i-yyyyy
aws ec2 delete-nat-gateway --nat-gateway-id nat-xxxxx
aws ec2 delete-nat-gateway --nat-gateway-id nat-yyyyy
# Wait ~2 minutes for NAT Gateways to delete
aws ec2 release-address --allocation-id eipalloc-xxxxx
aws ec2 release-address --allocation-id eipalloc-yyyyy
aws ec2 delete-subnet --subnet-id subnet-xxxxx   # repeat for all 4
aws ec2 delete-route-table --route-table-id rtb-xxxxx  # repeat for custom RTBs
aws ec2 detach-internet-gateway --internet-gateway-id igw-xxxxx --vpc-id vpc-xxxxx
aws ec2 delete-internet-gateway --internet-gateway-id igw-xxxxx
aws ec2 delete-vpc --vpc-id vpc-xxxxx
```

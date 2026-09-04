# vpc\_quick\_ref

## Cheat Sheet for Instructors

***

## CIDR Notation Quick Reference

| CIDR | # of Addresses | # Usable | Use Case               |
| ---- | -------------: | -------: | ---------------------- |
| /16  |         65,536 |   65,531 | Large VPC (Production) |
| /17  |         32,768 |   32,763 | Medium VPC             |
| /18  |         16,384 |   16,379 |                        |
| /19  |          8,192 |    8,187 |                        |
| /20  |          4,096 |    4,091 |                        |
| /21  |          2,048 |    2,043 |                        |
| /22  |          1,024 |    1,019 |                        |
| /23  |            512 |      507 |                        |
| /24  |            256 |      251 | Public/Private Subnet  |
| /25  |            128 |      123 | Small Subnet           |

***

## IP Allocation Plan Template (For Your Demo)

```
VPC: 10.0.0.0/16

AZ-A (us-east-1a):
├─ Public Subnet-A:   10.0.1.0/24   (251 usable IPs)
│  ├─ Web Server 1:   10.0.1.10
│  ├─ Web Server 2:   10.0.1.11
│  └─ NAT Gateway-A:  10.0.1.250
│     └─ Elastic IP:  54.123.45.67
│
└─ Private Subnet-A:  10.0.2.0/24   (251 usable IPs)
   ├─ App Server 1:   10.0.2.10
   ├─ App Server 2:   10.0.2.11
   └─ RDS Database:   10.0.2.50

AZ-B (us-east-1b):
├─ Public Subnet-B:   10.0.3.0/24   (251 usable IPs)
│  ├─ Web Server 3:   10.0.3.10
│  ├─ Web Server 4:   10.0.3.11
│  └─ NAT Gateway-B:  10.0.3.250
│     └─ Elastic IP:  54.234.56.78
│
└─ Private Subnet-B:  10.0.4.0/24   (251 usable IPs)
   ├─ App Server 3:   10.0.4.10
   ├─ App Server 4:   10.0.4.11
   └─ RDS Database:   10.0.4.50
```

***

## VPC Components Creation Order

{% stepper %}
{% step %}
### VPC (10.0.0.0/16)

* Console: VPC Dashboard → VPCs → Create VPC
* Output: vpc-xxxxx
{% endstep %}

{% step %}
### Internet Gateway (IGW)

* Console: VPC Dashboard → Internet Gateways → Create IGW
* Attach to VPC
* Output: igw-xxxxx
{% endstep %}

{% step %}
### Subnets (4 total: 2 public, 2 private)

* Console: VPC Dashboard → Subnets → Create Subnet
* Repeat 4 times with different CIDR blocks and AZs
* Outputs: subnet-xxxxx (x4)
{% endstep %}

{% step %}
### Elastic IPs (2 for NAT Gateways)

* Console: EC2 Dashboard → Elastic IPs → Allocate
* Don't assign to instances yet
* Outputs: eipalloc-xxxxx (x2)
{% endstep %}

{% step %}
### NAT Gateways (2: one per AZ)

* Console: VPC Dashboard → NAT Gateways → Create
* Place in PUBLIC subnets
* Assign Elastic IPs
* Wait for Available status
* Outputs: natgw-xxxxx (x2)
{% endstep %}

{% step %}
### Route Tables (3: 1 public, 2 private)

* Console: VPC Dashboard → Route Tables → Create
* Create Public RTB with route: 0.0.0.0/0 → IGW
* Create Private RTB-A with route: 0.0.0.0/0 → NAT-GW-A
* Create Private RTB-B with route: 0.0.0.0/0 → NAT-GW-B
* Outputs: rtb-xxxxx (x3)
{% endstep %}

{% step %}
### Subnet Associations

* Associate Public Subnets with Public RTB
* Associate Private Subnet-A with Private RTB-A
* Associate Private Subnet-B with Private RTB-B
{% endstep %}

{% step %}
### Enable Public IP Auto-assign (Public subnets only)

* Console: VPC Dashboard → Subnets → Edit Subnet Settings
* Check "Enable auto-assign public IPv4 address"
{% endstep %}
{% endstepper %}

***

## AWS CLI Commands Reference

### Create VPC

{% code title="create-vpc.sh" %}
```bash
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=Production-VPC}]' \
  --query 'Vpc.VpcId' --output text)
echo "VPC ID: $VPC_ID"
```
{% endcode %}

### Create Internet Gateway

{% code title="create-igw.sh" %}
```bash
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=Production-IGW}]' \
  --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID
echo "IGW ID: $IGW_ID"
```
{% endcode %}

### Create Subnets

{% code title="create-subnets.sh" %}
```bash
# Public Subnet A
PUBLIC_SUBNET_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Public-Subnet-A}]' \
  --query 'Subnet.SubnetId' --output text)

# Private Subnet A
PRIVATE_SUBNET_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Private-Subnet-A}]' \
  --query 'Subnet.SubnetId' --output text)

echo "Public Subnet A: $PUBLIC_SUBNET_A"
echo "Private Subnet A: $PRIVATE_SUBNET_A"
```
{% endcode %}

### Allocate Elastic IPs

{% code title="allocate-eip.sh" %}
```bash
EIP_A=$(aws ec2 allocate-address --domain vpc \
  --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=NAT-GW-A-EIP}]' \
  --query 'AllocationId' --output text)
echo "Elastic IP A (AllocationId): $EIP_A"
```
{% endcode %}

### Create NAT Gateway

{% code title="create-nat-gw.sh" %}
```bash
NAT_GW_A=$(aws ec2 create-nat-gateway --subnet-id $PUBLIC_SUBNET_A --allocation-id $EIP_A \
  --tag-specifications 'ResourceType=nat-gateway,Tags=[{Key=Name,Value=NAT-GW-A}]' \
  --query 'NatGateway.NatGatewayId' --output text)
echo "NAT Gateway A: $NAT_GW_A"

# Wait for NAT Gateway to be available
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW_A
```
{% endcode %}

### Create Route Tables

{% code title="create-route-tables.sh" %}
```bash
# Public Route Table
PUBLIC_RTB=$(aws ec2 create-route-table --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Public-RTB}]' \
  --query 'RouteTable.RouteTableId' --output text)

# Add route to IGW
aws ec2 create-route --route-table-id $PUBLIC_RTB \
  --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

# Private Route Table A
PRIVATE_RTB_A=$(aws ec2 create-route-table --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=Private-RTB-A}]' \
  --query 'RouteTable.RouteTableId' --output text)

# Add route to NAT Gateway
aws ec2 create-route --route-table-id $PRIVATE_RTB_A \
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_GW_A
```
{% endcode %}

### Associate Subnets with Route Tables

{% code title="associate-rtb.sh" %}
```bash
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_A --route-table-id $PUBLIC_RTB
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_A --route-table-id $PRIVATE_RTB_A
```
{% endcode %}

### Enable Public IP Auto-assign

{% code title="enable-auto-assign.sh" %}
```bash
aws ec2 modify-subnet-attribute --subnet-id $PUBLIC_SUBNET_A --map-public-ip-on-launch
```
{% endcode %}

***

## Troubleshooting Commands

### Check VPC Details

```bash
aws ec2 describe-vpcs --vpc-ids vpc-xxxxx
```

### Check Subnets

```bash
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-xxxxx"
```

### Check Route Tables

```bash
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-xxxxx"

# Check specific subnet's route table
aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=subnet-xxxxx"
```

### Check NAT Gateway Status

```bash
aws ec2 describe-nat-gateways --nat-gateway-ids natgw-xxxxx
```

### Check Elastic IP

```bash
aws ec2 describe-addresses --allocation-ids eipalloc-xxxxx
```

### Verify Internet Gateway Attachment

```bash
aws ec2 describe-internet-gateways --internet-gateway-ids igw-xxxxx
```

### Test Connectivity from Private Instance

```bash
# SSH into private instance (via bastion or Session Manager)

# Then run:
curl https://ifconfig.me         # Should return NAT Gateway's Elastic IP
curl https://aws.amazon.com     # Should succeed
traceroute google.com           # Should show NAT Gateway in path
```

***

## Common Student Mistakes to Watch For

{% stepper %}
{% step %}
### Forgetting to attach IGW to VPC

* Symptom: Public instances can't reach internet
* Solution: Remember the 2-step process: Create → Attach
{% endstep %}

{% step %}
### Creating NAT Gateway in Private Subnet

* Symptom: "NAT Gateway creation fails" or doesn't connect
* Solution: NAT Gateways MUST be in PUBLIC subnets (to reach IGW)
{% endstep %}

{% step %}
### Not allocating Elastic IP before NAT Gateway

* Symptom: Can't select EIP when creating NAT Gateway
* Solution: Allocate EIPs first, then use them for NAT Gateways
{% endstep %}

{% step %}
### Using wrong CIDR ranges (overlapping subnets)

* Symptom: "Invalid CIDR block" or unexpected routing behavior
* Solution: Plan CIDR blocks before creating subnets
* Example: 10.0.1.0/24 and 10.0.1.128/25 overlap (wrong!)
{% endstep %}

{% step %}
### Forgetting to enable public IP auto-assign

* Symptom: Instances launched in public subnet don't get public IPs
* Solution: Enable after subnet creation or at instance launch
{% endstep %}

{% step %}
### Creating only one NAT Gateway (single AZ failure point)

* Symptom: One AZ outage causes all private instances to lose internet
* Solution: Always create one NAT Gateway per AZ for HA
{% endstep %}

{% step %}
### Associating private subnets with public route table

* Symptom: Private instances get direct internet access (security issue)
* Solution: Use different route tables; use separate RTB for private subnets
{% endstep %}

{% step %}
### Not tagging resources

* Symptom: Can't find resources later; cost tracking impossible
* Solution: Always tag during creation (Name, Environment, Team, Cost Center)
{% endstep %}
{% endstepper %}

***

## Demonstration Timeline

| Phase                 | Duration | Activity                                                |
| --------------------- | -------: | ------------------------------------------------------- |
| Conceptual Foundation |   15 min | Explain architecture, show diagrams, discuss components |
| VPC Creation          |    5 min | Create VPC with 10.0.0.0/16 CIDR                        |
| IGW Setup             |    5 min | Create and attach Internet Gateway                      |
| Subnet Creation       |   10 min | Create 4 subnets (2 public, 2 private, 2 AZs)           |
| EIP Allocation        |    5 min | Allocate 2 Elastic IPs for NAT Gateways                 |
| NAT Gateway Creation  |   10 min | Create 2 NAT Gateways (wait for available status)       |
| Route Tables          |   15 min | Create 3 RTBs with appropriate routes                   |
| Testing & Validation  |   20 min | Launch EC2 instances, test connectivity                 |
| Q\&A & Wrap-up        |   15 min | Review, answer questions, discuss lessons               |

Total: 100 minutes

***

## Key Points to Emphasize

### Architecture Decisions

* ✅ Use multiple AZs for high availability (not single AZ)
* ✅ Separate public and private subnets for security
* ✅ One NAT Gateway per AZ for redundancy
* ✅ Use IGW for public resources, NAT for private outbound
* ✅ Document your IP allocation (draw it out!)

### Security Principles

* ✅ Private subnets = no direct internet inbound
* ✅ NAT Gateway = one-way outbound only
* ✅ Security Groups = instance-level firewall
* ✅ NACLs = subnet-level stateless firewall
* ✅ Least privilege = allow only required traffic

### Cost Management

* ✅ NAT Gateway: $32/month per AZ
* ✅ Data transfer: $0.045/GB through NAT
* ✅ Unused EIP: $3.65/month
* ✅ Optimize by using VPC Endpoints for AWS services

### Operational Excellence

* ✅ Always use CLI/IaC for reproducibility
* ✅ Tag everything (Name, Environment, Owner, Cost Center)
* ✅ Monitor with CloudWatch (NAT Gateway metrics)
* ✅ Use VPC Flow Logs for troubleshooting

***

## Resources for Continuous Learning

* AWS VPC User Guide: https://docs.aws.amazon.com/vpc/
* AWS CLI VPC Reference: https://docs.aws.amazon.com/cli/latest/reference/ec2/
* AWS Well-Architected Framework: https://docs.aws.amazon.com/wellarchitected/
* AWS Pricing: https://aws.amazon.com/vpc/pricing/
* IPv4 CIDR Calculator: https://www.subnet-calculator.com/

***

Last Updated: January 2026\
Suitable for: Entry-level to mid-level DevOps students\
Hands-on Lab: Approximately 2-3 hours for students to complete independently

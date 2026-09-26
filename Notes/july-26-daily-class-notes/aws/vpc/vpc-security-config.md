# vpc security config

## Security Groups & NACLs for Multi-Tier Architecture

## Security Group Strategy for 3-Tier Architecture

### Tier 1: Web Server Security Group

**Purpose:** Expose only HTTP/HTTPS and SSH to admin access

```yaml
Inbound Rules:
  Rule 1: SSH (22) from 0.0.0.0/0 or your office IP (more secure)
    Protocol: TCP
    Port Range: 22
    Source: 0.0.0.0/0 (or specific IP: 203.0.113.0/32)
    
  Rule 2: HTTP (80) from 0.0.0.0/0
    Protocol: TCP
    Port Range: 80
    Source: 0.0.0.0/0
    
  Rule 3: HTTPS (443) from 0.0.0.0/0
    Protocol: TCP
    Port Range: 443
    Source: 0.0.0.0/0
    
  Rule 4: Return traffic (ephemeral ports)
    Protocol: TCP
    Port Range: 1024-65535
    Source: 0.0.0.0/0
    
Outbound Rules:
  Rule 1: All traffic (default)
    Protocol: All
    Port Range: All
    Destination: 0.0.0.0/0
```

**CLI Creation:**

{% code title="create-web-sg.sh" %}
```bash
# Create Web SG
WEB_SG=$(aws ec2 create-security-group --group-name web-sg \
  --description "Security group for web tier" \
  --vpc-id $VPC_ID \
  --query 'GroupId' --output text)

# Allow SSH
aws ec2 authorize-security-group-ingress --group-id $WEB_SG \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

# Allow HTTP
aws ec2 authorize-security-group-ingress --group-id $WEB_SG \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# Allow HTTPS
aws ec2 authorize-security-group-ingress --group-id $WEB_SG \
  --protocol tcp --port 443 --cidr 0.0.0.0/0
```
{% endcode %}

### Tier 2: Application Server Security Group

**Purpose:** Allow traffic only from web servers, deny direct internet access

```yaml
Inbound Rules:
  Rule 1: SSH (22) from Bastion Host (optional, for troubleshooting)
    Protocol: TCP
    Port Range: 22
    Source: sg-bastion-id (reference by security group)
    
  Rule 2: Application traffic from Web SG
    Protocol: TCP
    Port Range: 8080 (or your app port)
    Source: sg-web-id (source is the Web Security Group)
    
  Rule 3: Return traffic
    Protocol: TCP
    Port Range: 1024-65535
    Source: 0.0.0.0/0
    
Outbound Rules:
  Rule 1: All traffic to internet (for updates, external APIs)
    Protocol: All
    Port Range: All
    Destination: 0.0.0.0/0
    
  Rule 2: Database traffic
    Protocol: TCP
    Port Range: 3306 (MySQL) or 5432 (PostgreSQL)
    Destination: sg-database-id
```

**CLI Creation:**

{% code title="create-app-sg.sh" %}
```bash
# Create App SG
APP_SG=$(aws ec2 create-security-group --group-name app-sg \
  --description "Security group for app tier" \
  --vpc-id $VPC_ID \
  --query 'GroupId' --output text)

# Allow traffic from Web SG on port 8080
aws ec2 authorize-security-group-ingress --group-id $APP_SG \
  --protocol tcp --port 8080 \
  --source-group $WEB_SG

# Allow outbound database traffic
aws ec2 authorize-security-group-egress --group-id $APP_SG \
  --protocol tcp --port 3306 \
  --destination-group $DATABASE_SG
```
{% endcode %}

### Tier 3: Database Security Group

**Purpose:** Accept connections ONLY from app servers, no internet access

```yaml
Inbound Rules:
  Rule 1: MySQL (3306) from App SG only
    Protocol: TCP
    Port Range: 3306
    Source: sg-app-id (reference by security group, not CIDR)
    
Outbound Rules:
  Default: Allow all outbound (or restrict to none for extra security)
    Protocol: All
    Port Range: All
    Destination: 0.0.0.0/0
```

**CLI Creation:**

{% code title="create-db-sg.sh" %}
```bash
# Create Database SG
DB_SG=$(aws ec2 create-security-group --group-name database-sg \
  --description "Security group for database tier" \
  --vpc-id $VPC_ID \
  --query 'GroupId' --output text)

# Allow MySQL only from App SG
aws ec2 authorize-security-group-ingress --group-id $DB_SG \
  --protocol tcp --port 3306 \
  --source-group $APP_SG

# Restrict outbound (optional, for defense-in-depth)
aws ec2 revoke-security-group-egress --group-id $DB_SG \
  --protocol all --port all --cidr 0.0.0.0/0
```
{% endcode %}

## Network ACL (NACL) Configuration

### Public Subnet NACL

**Purpose:** Stateless firewall for public-facing subnet

| Rule # | Type     | Protocol | Port       | Source/Dest | Action | Note           |
| ------ | -------- | -------- | ---------- | ----------- | ------ | -------------- |
| 100    | Inbound  | TCP      | 22         | 0.0.0.0/0   | Allow  | SSH            |
| 110    | Inbound  | TCP      | 80         | 0.0.0.0/0   | Allow  | HTTP           |
| 120    | Inbound  | TCP      | 443        | 0.0.0.0/0   | Allow  | HTTPS          |
| 130    | Inbound  | TCP      | 1024-65535 | 0.0.0.0/0   | Allow  | Return traffic |
| 140    | Inbound  | UDP      | 1024-65535 | 0.0.0.0/0   | Allow  | Return traffic |
| 32767  | Inbound  | All      | All        | 0.0.0.0/0   | Deny   | Default deny   |
| 100    | Outbound | TCP      | All        | 0.0.0.0/0   | Allow  | Outbound       |
| 32767  | Outbound | All      | All        | 0.0.0.0/0   | Deny   | Default deny   |

**NACL Creation CLI:**

{% code title="create-public-nacl.sh" %}
```bash
# Create Public NACL
PUBLIC_NACL=$(aws ec2 create-network-acl --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=network-acl,Tags=[{Key=Name,Value=Public-NACL}]' \
  --query 'NetworkAcl.NetworkAclId' --output text)

# Allow SSH inbound
aws ec2 create-network-acl-entry --network-acl-id $PUBLIC_NACL \
  --rule-number 100 --protocol tcp --port-range From=22,To=22 \
  --cidr-block 0.0.0.0/0 --ingress

# Allow HTTP inbound
aws ec2 create-network-acl-entry --network-acl-id $PUBLIC_NACL \
  --rule-number 110 --protocol tcp --port-range From=80,To=80 \
  --cidr-block 0.0.0.0/0 --ingress

# Allow HTTPS inbound
aws ec2 create-network-acl-entry --network-acl-id $PUBLIC_NACL \
  --rule-number 120 --protocol tcp --port-range From=443,To=443 \
  --cidr-block 0.0.0.0/0 --ingress

# Allow ephemeral inbound (return traffic)
aws ec2 create-network-acl-entry --network-acl-id $PUBLIC_NACL \
  --rule-number 130 --protocol tcp --port-range From=1024,To=65535 \
  --cidr-block 0.0.0.0/0 --ingress

# Allow outbound
aws ec2 create-network-acl-entry --network-acl-id $PUBLIC_NACL \
  --rule-number 100 --protocol -1 --port-range From=-1,To=-1 \
  --cidr-block 0.0.0.0/0 --egress
```
{% endcode %}

### Private Subnet NACL

**Purpose:** Allow internal VPC traffic + outbound internet via NAT

| Rule # | Type     | Protocol | Port       | Source/Dest | Action | Note                    |
| ------ | -------- | -------- | ---------- | ----------- | ------ | ----------------------- |
| 100    | Inbound  | TCP/UDP  | All        | 10.0.0.0/16 | Allow  | All VPC traffic         |
| 110    | Inbound  | TCP      | 1024-65535 | 0.0.0.0/0   | Allow  | Return traffic from NAT |
| 120    | Inbound  | UDP      | 1024-65535 | 0.0.0.0/0   | Allow  | DNS responses           |
| 32767  | Inbound  | All      | All        | 0.0.0.0/0   | Deny   | Default deny            |
| 100    | Outbound | TCP/UDP  | All        | 10.0.0.0/16 | Allow  | VPC traffic             |
| 110    | Outbound | TCP      | 80,443     | 0.0.0.0/0   | Allow  | HTTP/HTTPS              |
| 120    | Outbound | UDP      | 53         | 0.0.0.0/0   | Allow  | DNS                     |
| 32767  | Outbound | All      | All        | 0.0.0.0/0   | Deny   | Default deny            |

## Security Group vs NACL Comparison

| Feature      | Security Group                 | NACL                                           |
| ------------ | ------------------------------ | ---------------------------------------------- |
| Level        | Instance                       | Subnet                                         |
| Statefulness | Stateful (bidirectional)       | Stateless (separate inbound/outbound rules)    |
| Rules        | Allow only (implicit deny all) | Allow and Deny                                 |
| Ordering     | All rules evaluated            | Rules evaluated in order (lowest rule # first) |
| Processing   | All rules checked              | Processing stops at first match                |
| Default      | Deny all inbound               | Allow all (default NACL)                       |
| Use Case     | Instance-level firewall        | Subnet-level firewall, advanced filtering      |

### Decision Tree

```
Traffic blocked?
├─ Check Security Group first
│  └─ If denied → Check app security assumptions
├─ Then check NACL
│  └─ If denied → Check ephemeral ports, rule order
└─ Route Table routing issue?
   └─ Check VPC Flow Logs
```

## Common Security Scenarios

### Scenario 1: Restrict Admin SSH to Office IP Only

{% code title="restrict-ssh.sh" %}
```bash
# Instead of 0.0.0.0/0, use:
--cidr 203.0.113.0/32  # Your office IP

# or
--cidr 203.0.113.0/24  # Your office subnet (/24)
```
{% endcode %}

### Scenario 2: Allow Database Backup to External Service

{% code title="db-backup-egress.sh" %}
```bash
# Database SG Outbound Rule:
aws ec2 authorize-security-group-egress --group-id $DB_SG \
  --protocol tcp --port 443 \
  --cidr 54.200.0.0/16  # Backup service IP range
```
{% endcode %}

### Scenario 3: Allow Health Checks from Load Balancer

{% code title="allow-alb-healthcheck.sh" %}
```bash
# App SG Inbound Rule:
aws ec2 authorize-security-group-ingress --group-id $APP_SG \
  --protocol tcp --port 8080 \
  --source-group $ALB_SG  # Application Load Balancer SG
```
{% endcode %}

### Scenario 4: Block Specific IPs (Use NACL Deny Rule)

{% code title="block-ip-nacl.sh" %}
```bash
# Add DENY rule with lower number than ALLOW rule
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID \
  --rule-number 50 --protocol tcp --port-range From=22,To=22 \
  --cidr-block 192.0.2.100/32 --ingress --no-egress-action
```
{% endcode %}

## Troubleshooting Security Issues

{% stepper %}
{% step %}
### Issue: "Connection Timed Out"

* Check Security Group for inbound rule
* Verify NACL allows inbound on that port
* Verify source IP/CIDR is correct
* Check return traffic ephemeral ports (1024-65535)
{% endstep %}

{% step %}
### Issue: "Connection Refused"

* Application not running on target port
* Security Group allows port, but app doesn't listen
* Check if port is correct (80 vs 8080, 443 vs 8443)
{% endstep %}

{% step %}
### Issue: "Outbound connection fails"

* Check Security Group outbound rule (should be Allow All by default)
* Check NACL outbound rule
* Check route table (do you have route to target?)
* NAT Gateway limitation: Max 55K concurrent connections per IP
{% endstep %}

{% step %}
### Debug with VPC Flow Logs

{% code title="enable-flow-logs.sh" %}
```bash
# Enable Flow Logs for ENI
aws ec2 create-flow-logs --resource-type NetworkInterface \
  --resource-ids eni-xxxxx \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name vpc-flow-logs
```
{% endcode %}
{% endstep %}
{% endstepper %}

## Best Practices Summary

{% hint style="success" %}
✅ DO:

* Use separate Security Groups per tier
* Reference Security Groups instead of CIDR for intra-VPC traffic
* Keep NACL rules simple (usually default is fine)
* Document all Security Group rules
* Use VPC Flow Logs for debugging
* Restrict SSH to specific IPs/bastion hosts
* Implement least privilege (allow only necessary traffic)
* Monitor Security Group changes via CloudTrail
{% endhint %}

{% hint style="danger" %}
❌ DON'T:

* Use overly permissive rules (0.0.0.0/0 for internal traffic)
* Expose database ports to internet (0.0.0.0/0 on 3306, 5432)
* Confuse Security Groups with NACLs
* Leave unused Security Group rules (cleanup after testing)
* Ignore return traffic (ephemeral ports)
* Use inline rules (use reusable Security Groups)
{% endhint %}

## Teaching Tip: Live Demonstration Scenario

{% stepper %}
{% step %}
### Start

Launch 2 instances (web + app) with permissive SGs
{% endstep %}

{% step %}
### Demonstrate

Show traffic flowing (curl app from web)
{% endstep %}

{% step %}
### Restrict

Progressively tighten Security Groups
{% endstep %}

{% step %}
### Troubleshoot

Intentionally break connectivity, fix it
{% endstep %}

{% step %}
### Best Practices

Show proper 3-tier SG configuration
{% endstep %}
{% endstepper %}

**Last Updated:** January 2026

# Real time use case and examples of vpc

## VPC Endpoints

**What They Are:** VPC Endpoints are virtual devices that enable your EC2 instances and other AWS resources in a VPC to connect privately to AWS services without requiring internet access, NAT gateways, or VPN connections.

### Real-World Use Case: E-Commerce Platform with Sensitive Data Storage

A mid-sized e-commerce company stores customer payment data and transaction logs in Amazon S3. They need to ensure that all data transfer between their private EC2 instances and S3 remains within AWS's internal network for compliance with PCI-DSS standards.

By implementing an S3 VPC Gateway Endpoint, the company eliminates the need for a NAT gateway, reducing costs and latency. Additionally, they create interface endpoints for Secrets Manager and AWS Systems Manager to allow their applications to retrieve encrypted API keys and manage infrastructure without exposing these services to the public internet.

#### Key Benefits

* Eliminates internet gateway requirement
* Reduces latency and improves performance
* Significantly lower costs compared to NAT gateway approach
* Enhanced security through private connectivity
* Reduced attack surface[^1]

#### Types and Examples

| Endpoint Type                     | Use Case                         | Services                                                             |
| --------------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| Gateway Endpoints[^1]             | Direct, high-bandwidth access    | S3, DynamoDB                                                         |
| Interface Endpoints (PrivateLink) | Service consumption and exposure | SNS, SQS, Secrets Manager, KMS, Lambda, CloudWatch Logs, API Gateway |

### Microservices Architecture Example

A company with multiple development teams creates a Shared Services VPC containing centralized services such as logging, monitoring, and authentication. Each team's application VPC creates interface endpoints to these shared services.

This allows applications to securely access shared infrastructure without exposing all resources, improving security posture and reducing operational complexity.

## Transit Gateway

**What It Is:** AWS Transit Gateway acts as a central hub that simplifies connections between multiple VPCs, on-premises networks, and remote offices, eliminating the need for complex point-to-point VPC peering connections.

### Real-World Use Case: Multi-Branch Enterprise Network

{% stepper %}
{% step %}
#### Connect Multiple VPCs Centrally

Production, Staging, Development, and Shared Services VPCs all attach to a single Transit Gateway.
{% endstep %}

{% step %}
#### Hybrid Connectivity

On-premises offices connect via Site-to-Site VPN through the Transit Gateway.
{% endstep %}

{% step %}
#### Multi-Region Expansion

Transit Gateways in each region peer with each other for global connectivity.
{% endstep %}

{% step %}
#### Centralized Security Policies

All inter-VPC traffic can be inspected through a centralized inspection stack running Palo Alto or similar.
{% endstep %}
{% endstepper %}

#### Key Advantages

* **Scalability:** Supports thousands of VPCs and simplifies management as infrastructure grows[^2]
* **Transitive Routing:** VPC A can route to VPC C through VPC B, unlike VPC peering.
* **Centralized Management:** A single route table hub reduces operational overhead.
* **Multi-Region Support:** Inter-region peering enables global architectures.
* **High Availability:** Automatic redundancy across Availability Zones.
* **Better Monitoring:** CloudWatch metrics, Flow Logs, and AWS Network Manager provide visibility.

### Real-World Scenario: Hub-and-Spoke Architecture

A company with 15 VPCs implements distributed microservices:

* **Hub:** Central Transit Gateway in us-east-1
* **Spokes:** All application VPCs attach to TGW
* **On-Premises:** Corporate office connects via VPN
* **Remote Offices:** Branch offices connect via VPN

**Result:** Eliminates the need for 105 peering connections in a full mesh, reducing the design to just 17 attachments.

## Customer Gateway

**What It Is:** A Customer Gateway is a logical representation of your on-premises network device, such as a Cisco ASA, Palo Alto Networks, or FortiGate firewall, in AWS. It enables Site-to-Site VPN connections between your on-premises network and AWS.

### Real-World Use Case: Secure Hybrid Cloud Migration

An enterprise is migrating applications from its on-premises data center to AWS. It needs continuous connectivity during migration, redundancy and failover, and dynamic routing capability.

#### Customer Gateway Configuration Example

```
Customer Gateway Configuration:
- Device: Palo Alto Networks
- Public IP: 203.0.113.1
- BGP ASN: 65001
- Site-to-Site VPN Connection: 2 Tunnels (Tunnel 1 & Tunnel 2)
- Tunnel 1: IPSec connection to 198.51.100.1 (AWS VPN Endpoint)
- Tunnel 2: IPSec connection to 198.51.100.2 (Backup AWS VPN Endpoint)
- Pre-Shared Key: Shared secret for tunnel authentication
- Route Propagation: BGP dynamic or Static prefix-based routing
```

#### Configuration Steps

{% stepper %}
{% step %}
#### Create Customer Gateway in AWS Console

Provide your on-premises device public IP.
{% endstep %}

{% step %}
#### Create Site-to-Site VPN Connection

Link the Customer Gateway to a Virtual Private Gateway or Transit Gateway.
{% endstep %}

{% step %}
#### Download VPN Configuration File

Use AWS-provided config to apply settings to your on-prem device.
{% endstep %}

{% step %}
#### Apply Configuration to On-Premises Firewall

Set up IPSec tunnels on your hardware appliance.
{% endstep %}

{% step %}
#### Verify Both Tunnels Are "UP" in AWS Console

Ensure connectivity and failover are functioning.
{% endstep %}

{% step %}
#### Configure Route Propagation

Use BGP dynamic routing or static routing as required.
{% endstep %}
{% endstepper %}

### Multi-ISP Redundancy Example

A bank requires high availability with two different ISPs for failover. They create two separate Customer Gateways connecting to the same Virtual Private Gateway, ensuring failover if one ISP becomes unavailable.

#### IPSec Configuration Example

```bash
# IPSec tunnel configuration (on-premises firewall)
conn Tunnel1
    authby=secret
    auto=start
    left=%defaultroute
    leftid=203.0.113.1 (Your On-Prem Public IP)
    right=198.51.100.1  (AWS VPN Endpoint)
    ike=aes128-sha1-modp1024
    esp=aes128-sha1-modp1024
    keyexchange=ike

# Tunnel authentication (PSK - Pre-Shared Key)
203.0.113.1 198.51.100.1 : PSK "YourPreSharedKey123"
```

#### Advantages

* **Two Tunnels Per Connection:** Automatic failover if one tunnel fails.
* **BGP Support:** Dynamic routing updates when network topology changes.
* **Static Routing Option:** For devices that do not support BGP.
* **Multiple CGWs:** Support multiple on-premises locations or ISPs.

## Direct Connect

**What It Is:** AWS Direct Connect is a dedicated network connection from your on-premises infrastructure to AWS, providing consistent network performance with speeds from 50Mbps to 100Gbps. Unlike VPN connections over the internet, Direct Connect uses private fiber optic connections.

### Real-World Use Case: Financial Data Processing — Multi-Region Global Architecture

A large financial services firm processes terabytes of real-time market data across global locations.

#### Architecture

* **On-Premises:** Singapore data center with market data feeds
* **Direct Connect Location:** Singapore AWS Direct Connect facility
* **Primary Connection:** 100Gbps dedicated connection to AWS
* **Virtual Interfaces:** Multiple private virtual interfaces for different workloads
* **Multi-Region:** Uses Direct Connect Gateway to connect to VPCs in US-East, US-West, and EU-West regions
* **Disaster Recovery:** Backup VPN connection for failover

#### Benefits for This Use Case

| Requirement       | Solution                     | Benefit                                           |
| ----------------- | ---------------------------- | ------------------------------------------------- |
| Low Latency       | Dedicated private connection | Consistent <10ms latency vs 50-150ms internet VPN |
| High Throughput   | 100Gbps connection           | Process real-time feeds without bottlenecks       |
| Cost Optimization | Reduced data transfer costs  | Direct Connect data cheaper than NAT gateway/VPN  |
| Global Reach      | Direct Connect Gateway       | Single connection serves multiple regions         |
| Compliance        | Private fiber network        | Meets financial industry security requirements    |

#### Multi-Region Architecture Using Direct Connect Gateway

```
On-Premises Data Center
        ↓
AWS Direct Connect Location (Singapore)
        ↓
Direct Connect Gateway (Global, owned by Account Z)
        ↓
        ├─→ Transit Gateway (US-East-1)
        │   └─→ VPC-A (Production)
        │   └─→ VPC-B (Analytics)
        │   └─→ VPC-C (Disaster Recovery)
        │
        ├─→ Transit Gateway (US-West-2)
        │   └─→ VPC-D (Staging)
        │   └─→ VPC-E (Development)
        │
        └─→ Transit Gateway (EU-West-1)
            └─→ VPC-F (Compliance)
            └─→ VPC-G (Backup)
```

### Cross-Account Setup Example

Account Z creates and owns the Direct Connect Gateway. Account A and Account B propose associations to share connectivity to their VPCs.

Account Z controls:

* Which CIDR blocks are allowed
* Route propagation policies
* BGP configurations

#### BGP Configuration for Direct Connect

```
On-Premises BGP Configuration:
    AS Number: 65001
    Neighbor: 169.254.10.1 (Amazon side)
    Amazon AS: 64512

BGP Advertisement:
    On-premises networks: 10.0.0.0/8
    Receive AWS prefixes: 172.31.0.0/16 (VPC A)
                          172.32.0.0/16 (VPC B)
                          172.33.0.0/16 (VPC C)

Failover Timing:
    Primary: Direct Connect (Active)
    Backup: Site-to-Site VPN (Standby)
    BGP convergence time: ~5-10 seconds
```

### Redundancy and High Availability Pattern

```
Primary Path:
  On-Prem → DX Location A → DX Connection 1 (100Gbps) →
  Direct Connect Gateway → Transit Gateway → Production VPC

Backup Path:
  On-Prem → Internet → VPN Gateway →
  VPN Connection (10Gbps) → Transit Gateway → Production VPC
```

#### Advantages

* Automatic failover via BGP
* Different connectivity technologies: DX and VPN
* DX for normal traffic and VPN for surge capacity
* RTO: < 10 seconds

## Real-World Integrated Architecture

![Hybrid Cloud Network Architecture: On-Premises to AWS Integration Using Transit Gateway, Direct Connect, and VPC Endpoints](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/9e28f8f159f1c77e1682e86f270eb949/6a2996b9-a969-448b-ba35-16ec6a915a84/4fc85b22.png)

### Use Case: Enterprise Mergers & Acquisitions Integration

* Three acquired companies on-premises connect via Site-to-Site VPN to Transit Gateway.
* Parent company uses Direct Connect for primary HQ connectivity.
* Transit Gateway is the central hub managing routing to multiple VPCs, including Shared Services, Production, and Finance.
* Shared Services, including Active Directory, logging, and monitoring, are accessed through VPC Endpoints by internal VPCs.

#### Connectivity Pattern

* HQ → Direct Connect Gateway → Transit Gateway → All VPCs
* Acquired Co. A/B/C → VPN → Transit Gateway → All VPCs

## VPC Endpoints: Real-World Microservices Use Case

![VPC Endpoints Real-World Use Case: Secure Microservices Architecture with Centralized Shared Services](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/9e28f8f159f1c77e1682e86f270eb949/cd34f351-faac-4913-9d9b-eb5e1a66b5ce/3d7f20ab.png)

### Scenario: SaaS Provider Exposing Microservices Securely

* Provider Account with a Shared Services VPC exposes services behind Network Load Balancers.
* Consumer Accounts create interface endpoints to consume the provider's services privately.

#### Benefits

* No direct VPC access to shared services
* No peering
* Scales to thousands of customer accounts
* Granular security policies per endpoint
* On-prem customers can access via Direct Connect

#### Cost Comparison

{% tabs %}
{% tab title="NAT Gateway Approach" %}
```
- NAT Gateway: $32/month (us-east-1)
- Data processing: $0.045/GB ($450 for 10TB)
- Monthly cost: $482
```
{% endtab %}

{% tab title="VPC Endpoint Approach" %}
```
- Interface Endpoint: $7.20/month
- Data processing: $0.01/GB ($100 for 10TB)
- Monthly cost: $107.20
```
{% endtab %}
{% endtabs %}

**Savings:** $374.80/month, a 78% reduction.

## Transit Gateway with Customer Gateway Integration

![Transit Gateway Hub-and-Spoke with Customer Gateway: Multi-Site Enterprise Network Architecture](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/9e28f8f159f1c77e1682e86f270eb949/8c97b21f-8656-47c8-ba9a-10b32643285a/d954e1a1.png)

### Multi-Site Enterprise Use Case: Global Retail Company

#### On-Premises Locations

| Location     | City       | Device    | BGP ASN | Primary Use                |
| ------------ | ---------- | --------- | ------- | -------------------------- |
| HQ           | New York   | Cisco ASA | 65001   | Backup DX, failover VPN    |
| RDC-East     | New Jersey | Palo Alto | 65002   | Real-time inventory sync   |
| RDC-Central  | Chicago    | FortiGate | 65003   | Dynamic routing, scale-out |
| Regional Hub | Dallas     | Juniper   | 65004   | Branch office aggregation  |
| Regional Hub | LA         | Fortinet  | 65005   | West coast distribution    |

Each location connects to Transit Gateway via Site-to-Site VPN with dual tunnels.

#### AWS VPCs Attached to Transit Gateway

* **Production VPC (us-east-1):** Real-time inventory database and point-of-sale APIs
* **Analytics VPC (us-east-1):** Sales data processing and reporting
* **Backup VPC (us-west-2):** DR replica of production
* **Shared Services VPC (us-east-1):** Active Directory, DNS, and monitoring
* **Development VPC (us-east-1):** New feature testing
* **Store Operations VPC (eu-west-1):** European store management

#### Traffic Flow

Store → On-Premises VPN Gateway → Transit Gateway Route Table → Production, Analytics, and Shared Services VPCs

#### Connection Complexity Reduction

* **Without TGW:** 5×6 = 30 VPC peering connections plus VPN complexity
* **With TGW:** 5 VPN attachments and 6 VPC attachments to a single TGW
* **Result:** 91% reduction in connection complexity

## Direct Connect Gateway: Multi-Region Global Architecture

![AWS Direct Connect Gateway: Multi-Region Global Network Architecture](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/9e28f8f159f1c77e1682e86f270eb949/e6889971-fc7c-4496-8495-f12407532907/07ae1e2e.png)

### Financial Services Firm: Global Operations

#### Connection Architecture

```
On-Premises (Singapore)
    ↓ 100Gbps Direct Connect
AWS Direct Connect Location (Singapore)
    ↓ Private Virtual Interface (VIF)
Direct Connect Gateway (Global)
    ↓
    ├─→ Transit Gateway (us-east-1): NYC operations
    │   ├─→ Production VPC: Trading engine
    │   ├─→ Risk Management VPC: Compliance
    │   └─→ Backup VPC: Disaster recovery
    ├─→ Transit Gateway (eu-west-1): London operations
    │   ├─→ Production VPC: European trading
    │   ├─→ Compliance VPC: GDPR requirements
    │   └─→ Development VPC: Feature testing
    └─→ Transit Gateway (ap-southeast-1): Singapore ops
        ├─→ Primary VPC: Main application
        ├─→ Database VPC: Data persistence
        └─→ Monitoring VPC: Observability
```

#### Performance Metrics

| Metric      | Direct Connect | VPN Fallback | Improvement   |
| ----------- | -------------- | ------------ | ------------- |
| Latency     | 8-12ms         | 50-150ms     | 12-18x lower  |
| Throughput  | 100Gbps        | 1.5Gbps      | 66x higher    |
| Consistency | Fixed          | Variable     | 99.99% uptime |
| Cost/GB     | $0.02          | $0.09        | 4.5x cheaper  |

#### Redundancy Configuration

* **Primary:** DX Connection #1, 100Gbps
* **Secondary:** DX Connection #2, 10Gbps, to a different DX location
* **Failover:** Site-to-Site VPN, 10Gbps, via internet as last resort
* **BGP convergence:** <10 seconds
* **RPO:** 0, with continuous replication
* **RTO:** <10 seconds

## Comparison Matrix: When to Use Each Component

| Component        | Best For                                          | Primary Advantage                                     | Cost Model                               |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| VPC Endpoints    | AWS service access from private subnets           | No internet exposure, reduces NAT gateway costs       | $0.01-$7.20/endpoint + data processing   |
| Transit Gateway  | Multi-VPC, multi-region, hybrid connectivity      | Centralized hub eliminates peering complexity         | $0.05/attachment + $0.02/GB processed    |
| Customer Gateway | On-premises VPN device representation             | Enables Site-to-Site VPN over internet                | Only data transfer costs, no gateway fee |
| Direct Connect   | High-throughput, low-latency on-prem connectivity | Dedicated private connection, cost-effective at scale | $0.30/port-hour + $0.02/GB data transfer |

## Security Best Practices Across All Components

{% stepper %}
{% step %}
#### VPC Endpoints

Use endpoint policies to restrict service access and enable VPC Flow Logs.
{% endstep %}

{% step %}
#### Transit Gateway

Implement route tables for traffic segmentation and use TGW Network Manager for monitoring.
{% endstep %}

{% step %}
#### Customer Gateway

Use BGP communities for route filtering and enable MFA for VPN authentication.
{% endstep %}

{% step %}
#### Direct Connect

Implement BGP authentication, use private virtual interfaces only, and enable CloudTrail logging.
{% endstep %}
{% endstepper %}

This integrated approach creates enterprise-grade, secure, scalable AWS networking infrastructure suitable for mission-critical workloads spanning on-premises and multi-region cloud environments.

### References

[^1]: https://aws.plainenglish.io/unlocking-the-power-of-vpc-endpoints-scenarios-use-cases-and-security-implications-6a65def9693f

[^2]: https://www.acte.in/aws-transit-gateway-structure-working-and-benefits

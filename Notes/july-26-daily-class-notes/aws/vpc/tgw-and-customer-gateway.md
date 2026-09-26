# tgw and customer gateway

## Hybrid Connectivity with AWS Transit Gateway and Customer Gateway

AWS cloud deployments often need to integrate seamlessly with on-premises data centers while still supporting rapid growth across many Virtual Private Clouds (VPCs). A powerful pattern for achieving this is the combination of an AWS Transit Gateway (TGW) on the AWS side and a Customer Gateway (CGW) on the on-premises side. This report dissects the technologies, shows a realistic end-to-end scenario, and presents an annotated architecture flow diagram. Every section is packed with implementation guidance, performance tuning tips, security safeguards, and operational best practices.

### Overview

AWS Transit Gateway is a fully managed, highly scalable regional “cloud router” that interconnects VPCs, AWS accounts, Direct Connect links, and VPNs through a hub-and-spoke model, eliminating the complexity of a mesh of individual peering links. A Customer Gateway is the logical AWS resource that represents your physical or virtual edge device (router, firewall, SD-WAN box) and its public IP; it anchors the on-premises side of any Site-to-Site VPN or TGW Connect (GRE) tunnel. By combining TGW and CGW you can extend on-premises networks to hundreds of VPCs through a single, resilient, IPsec-encrypted attachment and let Border Gateway Protocol (BGP) dynamically propagate routes between environments.

### Architecture Diagram

<figure><img src="../../../.gitbook/assets/cee1ff5e f4c9 4f93 8e75 2e458caa28d6.png" alt=""><figcaption></figcaption></figure>

Figure 1: Hybrid connectivity architecture using a Customer Gateway and AWS Transit Gateway to link an on-premises network with multiple AWS VPCs

The diagram illustrates a hybrid hub-and-spoke topology:

* **Left:** An on-premises data center router (the physical implementation of the CGW) advertises its internal CIDR 172.16.0.0/16.
* **Center:** A regional AWS TGW terminates two redundant IPsec tunnels from the CGW, forms a BGP session, and shares routes.
* **Right:** Two VPCs (Prod 10.10.0.0/16 and Dev 10.20.0.0/16) attach to the TGW. EC2 instances in each VPC automatically learn on-prem routes via TGW route propagation, while the on-prem router learns both VPC CIDRs via BGP.

### TGW and CGW Fundamentals

### What Is AWS Transit Gateway?

AWS Transit Gateway is a managed layer-3 router that:

* Connects up to 5,000 VPCs per Region through simple “attachments,” replacing complex VPC peering meshes.
* Supports VPC, VPN, Direct Connect, Transit Gateway Peering, and Connect (GRE) attachment types.
* Offers up to 50Gbps aggregate throughput per attachment with Equal-Cost Multi-Path (ECMP) across up to eight tunnels, and up to 1.25Gbps per individual VPN tunnel.
* Provides route tables to control traffic segmentation, enabling VRF-like isolation within a single TGW.
* Delivers native high availability and automatic scaling without customer-managed appliances.

### What Is a Customer Gateway?

A Customer Gateway is an AWS resource that stores metadata about your on-premises VPN endpoint:

* **ASN:** The BGP Autonomous System Number used by the on-prem router for dynamic routing.
* **Public IP:** A routable, static IPv4 or IPv6 address that terminates the VPN or GRE tunnels.
* **Device name & tags:** Optional identifiers for maintenance and automation.
* **Connection type:** Currently `ipsec.1` for IPsec VPN or `gre` when deployed through TGW Connect.

### Why Combine TGW and CGW?

| Reason              | Benefit                                                           | TGW Role                     | CGW Role                         |
| ------------------- | ----------------------------------------------------------------- | ---------------------------- | -------------------------------- |
| Centralized routing | One gateway manages thousands of VPCs, cutting route table sprawl | Hub attaches VPCs & VPNs     | Edge advertises on-prem prefixes |
| Dynamic scalability | Add/remove VPCs without touching on-prem configuration            | Creates new VPC attachments  | Unchanged                        |
| Security            | IPsec tunnels provide encryption in transit by default            | Terminates encrypted tunnels | Terminates encrypted tunnels     |
| Resilience          | Dual tunnels + AZ-agnostic TGW ensure failover under 30s          | Maintains active-active HA   | Runs redundant routers           |
| Cost efficiency     | Single VPN for all VPCs avoids per-VPC VPN fees                   | Shares connectivity          | Shares bandwidth across spokes   |

### End-to-End Use-Case Scenario

### Business Context

A global retail enterprise runs legacy ERP and inventory services in an on-prem data center but hosts new microservices on AWS. Each application team owns its own VPC in a shared AWS Network account. The company must:

* Provide bidirectional, low-latency, encrypted access between on-prem systems and cloud workloads.
* Allow new VPCs to be onboarded weekly without changes to the on-prem firewall team.
* Segment production and development traffic while still sharing the same TGW.

### High-Level Design

{% stepper %}
{% step %}
### Transit Gateway creation (us-east-1)

ASN 64512, DNS support enabled.
{% endstep %}

{% step %}
### Route tables

* `tgw-rt-vpn` (for CGW attachment)
* `tgw-rt-prod` (for Prod VPC)
* `tgw-rt-dev` (for Dev VPC)
{% endstep %}

{% step %}
### Attachments

* `vpn-attach` (Site-to-Site VPN)
* `prod-attach` (VPC ID vpc-prod)
* `dev-attach` (VPC ID vpc-dev)
{% endstep %}

{% step %}
### Associations & propagations

* `vpn-attach` associated with `tgw-rt-vpn`, propagates prod/dev CIDRs.
* `prod-attach` associated with `tgw-rt-prod`, propagates VPN CIDR.
* `dev-attach` associated with `tgw-rt-dev`, propagates VPN CIDR.
{% endstep %}

{% step %}
### Customer Gateway

ASN 65000, public IP 198.51.100.10.
{% endstep %}

{% step %}
### IPsec tunnels

Two tunnels, DPD & BGP timers 10/30s, AES-256-GCM, SHA-2 integrity.
{% endstep %}

{% step %}
### BGP route exchange

* CGW advertises 172.16.0.0/16.
* TGW advertises 10.10.0.0/16 and 10.20.0.0/16.
{% endstep %}

{% step %}
### VPC route tables

Each VPC adds a default route 0.0.0.0/0 → TGW attachment to leverage shared NAT VPC (optional).
{% endstep %}

{% step %}
### Security groups & NACLs

Allow UDP 500/4500 and ESP protocol 50 on the VPN endpoint.
{% endstep %}
{% endstepper %}

### Packet Flow Walkthrough

| Step | Direction                                      | Action                                                                                              | Device       |
| ---- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------ |
| 1    | On-prem host 172.16.5.10 → Prod EC2 10.10.2.15 | Packet routed to border router because 10.10.0.0/16 learned via eBGP                                | CGW          |
| 2    | CGW → TGW                                      | Packet enters IPsec tunnel 1, encrypted with AES-256-GCM                                            | CGW → Tunnel |
| 3    | TGW decapsulates, consults `tgw-rt-vpn`        | Sees 10.10.0.0/16 propagated by `prod-attach`                                                       | TGW          |
| 4    | TGW re-encapsulates ENI header                 | Forwards to VPC ENI of `prod-attach`                                                                | TGW          |
| 5    | Prod VPC route table                           | Local route delivers packet to EC2 in subnet                                                        | VPC          |
| 6    | Return traffic                                 | EC2 → TGW via local subnet route; TGW consults `tgw-rt-prod`, finds 172.16.0.0/16 propagated by VPN | EC2 → TGW    |
| 7    | TGW encrypts into tunnel 2 (ECMP)              | Traffic exits AWS, arrives in on-prem network                                                       | TGW → CGW    |

### Throughput & Latency Expectations

| Path                       | Max Tunnel Throughput                      | Typical Latency                               |
| -------------------------- | ------------------------------------------ | --------------------------------------------- |
| IPsec tunnel (single)      | 1.25Gbps                                   | ≈50-100ms trans-continental (public Internet) |
| ECMP with 4 tunnels        | 5Gbps aggregate                            | Same as above, per-flow hashed                |
| Direct Connect integration | 50Gbps per VIF when using DX Gateway + TGW | 2-20ms over private fiber                     |

### Cost Model

| Component           | Unit Price                          | Quantity (example) | Monthly Cost |
| ------------------- | ----------------------------------- | ------------------ | ------------ |
| TGW data processing | $0.04/GB in us-east-1               | 1,000GB            | $40.00       |
| TGW VPN attachment  | $0.05/hr                            | 1                  | $36.00       |
| VPC attachment      | $0.05/hr                            | 2                  | $72.00       |
| IPsec data transfer | $0.09/GB (outbound) + $0.00 inbound | 1,000GB            | $90.00       |
| Total               | –                                   | –                  | $238.00      |

Using Direct Connect (private VIF) can reduce per-GB egress to $0.02 and eliminate VPN attachment cost.

### Best Practices Checklist

* **Dual tunnels, dual routers:** Ensure each CGW device terminates separate tunnels for HA.
* **BGP keepalives:** 10s/30s keepalive/hold timers strike balance between failover speed and stability.
* **ECMP:** Enable ECMP on TGW and on-prem router to use both tunnels concurrently for load sharing.
* **VRF isolation:** Use multiple TGW route tables to simulate VRFs and segregate prod, dev, and shared services.
* **CIDR management:** Avoid overlapping CIDRs; TGW drops overlapping route propagations.
* **Automation:** Leverage Infrastructure-as-Code and AWS Resource Access Manager (RAM) to share TGW across accounts.

### Alternatives & When to Use Them

| Requirement                    | Recommended Service           | Why                                                  |
| ------------------------------ | ----------------------------- | ---------------------------------------------------- |
| <10 VPCs, simple hub-and-spoke | Virtual Private Gateway (VGW) | Cheaper, simpler but no inter-VPC routing            |
| Third-party NGFW inspection    | Transit VPC with appliance    | Layer-7 firewall, but higher cost & management       |
| Global multi-Region SD-WAN     | TGW Peering + Direct Connect  | Private WAN over AWS backbone                        |
| Full mesh services only        | AWS PrivateLink               | No transitive routing; fine-grained service exposure |

### Conclusion

Pairing an AWS Transit Gateway with a Customer Gateway delivers a robust, scalable, and secure hybrid network foundation. The architecture grants enterprises a single ingress point to AWS, simplifies route management, and allows rapid onboarding of new VPCs—all without reconfiguring on-premises equipment. By following the implementation playbook and best practices outlined here, organizations can achieve high-performance, highly available connectivity that unlocks seamless workload portability between cloud and on-premises environments.

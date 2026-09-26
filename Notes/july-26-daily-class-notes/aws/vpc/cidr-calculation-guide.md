# CIDR calculation guide

## Binary Math, Subnetting, and Real-World Examples

## Part 1: CIDR Fundamentals

### What is CIDR?

**CIDR** (Classless Inter-Domain Routing) is a method of representing IP address ranges using notation like `10.0.0.0/16`.

Breaking down the notation:

```
10.0.0.0/16
│       │
│       └─ Prefix length (number of network bits)
└───────── IP address in decimal
```

### IPv4 Address Structure

Every IPv4 address consists of **32 bits** divided into 4 octets (groups of 8 bits):

```
Decimal:   10       .       0       .       0       .       0
           │                │                │                │
Binary:    00001010 . 00000000 . 00000000 . 00000000
           │        │ │        │ │        │ │        │
           Octet 1  │ Octet 2  │ Octet 3  │ Octet 4  │
                    8 bits     │ 8 bits     │ 8 bits    │
                             16 bits total

Total: 8 + 8 + 8 + 8 = 32 bits
```

### Understanding the CIDR Prefix

The CIDR prefix (e.g., `/16`) tells you how many bits are used for the **network portion**:

```
10.0.0.0/16
├─ First 16 bits  = Network portion (fixed, defines the network)
└─ Remaining 16 bits = Host portion (variable, identifies devices)

Bits:    1-8    9-16   17-24   25-32
        ┌────────────┬────────────┐
        │  Network   │    Hosts   │
        │  (16 bits) │ (16 bits)  │
        └────────────┴────────────┘

        /16 prefix = First 16 bits are network
```

### Key Relationship

IP Addresses in CIDR block = 2^(32 - prefix)

Examples:

* `/16` = 2^(32-16) = 2^16 = **65,536 addresses**
* `/24` = 2^(32-24) = 2^8 = **256 addresses**
* `/25` = 2^(32-25) = 2^7 = **128 addresses**
* `/30` = 2^(32-30) = 2^2 = **4 addresses**

## Part 2: Binary-to-Decimal Conversion

### Decimal to Binary Conversion

Method: Powers of 2 in each octet

Each bit position represents a power of 2:

```
Bit Position:  7      6     5     4     3     2     1     0
               │      │     │     │     │     │     │     │
Power of 2:   128 +  64 +  32 +  16 +  8 +  4 +  2 +  1
```

Example: Convert 192 to binary

```
192 ÷ 2 = 96 remainder 0  → bit 0 = 0
96  ÷ 2 = 48 remainder 0  → bit 1 = 0
48  ÷ 2 = 24 remainder 0  → bit 2 = 0
24  ÷ 2 = 12 remainder 0  → bit 3 = 0
12  ÷ 2 = 6  remainder 0  → bit 4 = 0
6   ÷ 2 = 3  remainder 0  → bit 5 = 0
3   ÷ 2 = 1  remainder 1  → bit 6 = 1
1   ÷ 2 = 0  remainder 1  → bit 7 = 1

Binary: 11000000
Check: 128 + 64 = 192 ✓
```

Example: Convert 168 to binary

```
Using the power of 2 chart:
168 = 128 + 40
40  = 32 + 8

So: 128 + 32 + 8 = 168

Binary positions: 128(1) + 64(0) + 32(1) + 16(0) + 8(1) + 4(0) + 2(0) + 1(0)
Binary: 10101000 ✓
```

### Binary to Decimal Conversion

Example: Convert 10101000 to decimal

```
1  0  1  0  1  0  0  0
│  │  │  │  │  │  │  │
128 + 0 + 32 + 0 + 8 + 0 + 0 + 0 = 168
```

Example: Convert 11110000 to decimal

```
1  1  1  1  0  0  0  0
│  │  │  │  │  │  │  │
128 + 64 + 32 + 16 + 0 + 0 + 0 + 0 = 240
```

## Part 3: CIDR Calculation Methods

{% stepper %}
{% step %}
## Method 1: Calculate Total IP Addresses

Formula: Total IPs = 2^(32 - prefix\_length)

Example 1: How many IPs in 10.0.0.0/22?

* Prefix = 22
* Host bits = 32 - 22 = 10
* Total IPs = 2^10 = 1,024 addresses

Example 2: How many IPs in 172.16.0.0/20?

* Prefix = 20
* Host bits = 32 - 20 = 12
* Total IPs = 2^12 = 4,096 addresses
{% endstep %}

{% step %}
## Method 2: Find Usable IP Addresses (AWS VPC Context)

In AWS VPC, the first 4 and last 1 IP addresses are reserved:

Formula: Usable IPs = 2^(32 - prefix) - 5

Example: 10.0.0.0/24 subnet

* Total IPs = 2^(32-24) = 2^8 = 256
* Reserved addresses:
  * 10.0.0.0 (Network address)
  * 10.0.0.1 (VPC Router)
  * 10.0.0.2 (DNS Server)
  * 10.0.0.3 (Reserved for future use)
  * 10.0.0.255 (Broadcast address)
* Usable IPs = 256 - 5 = 251 addresses

Example: 192.168.1.0/25 subnet

* Total IPs = 2^(32-25) = 2^7 = 128
* Usable IPs = 128 - 5 = 123 addresses
* First address: 192.168.1.0
* Last address: 192.168.1.127
{% endstep %}

{% step %}
## Method 3: Find Subnet Boundaries

To find the range of a subnet, identify which bits are variable.

Example: Find range for 10.0.1.0/24

* /24 means first 24 bits are network (3 octets fixed)
* Last 8 bits are hosts (variable)
* First address: 10.0.1.0
* Last address: 10.0.1.255

Example: Find range for 10.0.1.0/25

* /25 means first 25 bits are network (3 octets + 1 bit)
* Last 7 bits are hosts
* 4th octet: bit 7 fixed at 0, bits 6-0 variable
* First /25: 10.0.1.0 - 10.0.1.127
* Next /25: 10.0.1.128 - 10.0.1.255
{% endstep %}
{% endstepper %}

## Part 4: Subnet Planning & Design

### Planning a VPC with Multiple Subnets

{% stepper %}
{% step %}
## Choose VPC CIDR block

VPC CIDR: 10.0.0.0/16

* Provides 65,536 total IPs
* Leaves room for secondary CIDR blocks if needed
{% endstep %}

{% step %}
## Divide into subnets

Common approach: Use /24 for subnets (256 IPs each)

VPC: 10.0.0.0/16

* AZ-1 (us-east-1a)
  * Public Subnet-1: 10.0.1.0/24 (256 IPs, 251 usable)
  * Private Subnet-1: 10.0.2.0/24 (256 IPs, 251 usable)
* AZ-2 (us-east-1b)
  * Public Subnet-2: 10.0.3.0/24 (256 IPs, 251 usable)
  * Private Subnet-2: 10.0.4.0/24 (256 IPs, 251 usable)
{% endstep %}

{% step %}
## Verify no overlap & remaining space

Ranges:

* 10.0.1.0/24 = 10.0.1.0 - 10.0.1.255 ✓ No overlap
* 10.0.2.0/24 = 10.0.2.0 - 10.0.2.255 ✓ No overlap
* 10.0.3.0/24 = 10.0.3.0 - 10.0.3.255 ✓ No overlap
* 10.0.4.0/24 = 10.0.4.0 - 10.0.4.255 ✓ No overlap

Used: 4 × 256 = 1,024 addresses\
Total: 65,536 addresses\
Remaining: 64,512 addresses (for future growth)
{% endstep %}
{% endstepper %}

### CIDR Planning Table

| Subnet Name | CIDR Block  | Range                 | AZ         | Type    | Usable IPs |
| ----------- | ----------- | --------------------- | ---------- | ------- | ---------- |
| Public-1    | 10.0.1.0/24 | 10.0.1.0 - 10.0.1.255 | us-east-1a | Public  | 251        |
| Private-1   | 10.0.2.0/24 | 10.0.2.0 - 10.0.2.255 | us-east-1a | Private | 251        |
| Public-2    | 10.0.3.0/24 | 10.0.3.0 - 10.0.3.255 | us-east-1b | Public  | 251        |
| Private-2   | 10.0.4.0/24 | 10.0.4.0 - 10.0.4.255 | us-east-1b | Private | 251        |

## Part 5: AWS VPC CIDR Constraints

### VPC CIDR Block Rules

Allowed VPC CIDR sizes:

* Minimum: `/28` (16 IP addresses)
* Maximum: `/16` (65,536 IP addresses)

```
/16 = 65,536 IPs  ← Recommended for production
/17 = 32,768 IPs
/18 = 16,384 IPs
/19 = 8,192 IPs
/20 = 4,096 IPs
...
/28 = 16 IPs       ← Minimum (not recommended)
```

### Subnet CIDR Block Rules

Allowed Subnet CIDR sizes:

* Minimum: `/28` (16 IP addresses, only 11 usable)
* Maximum: `/16` (65,536 IP addresses, only 65,531 usable)

AWS Reserved Addresses in Each Subnet:

In a subnet with CIDR `10.0.0.0/24`:

```
10.0.0.0     - Network address (reserved)
10.0.0.1     - VPC Router (reserved)
10.0.0.2     - DNS Server (reserved)
10.0.0.3     - Reserved for future use
10.0.0.4     - First usable IP for EC2 instances
10.0.0.5-254 - Usable IPs
10.0.0.255   - Broadcast address (reserved)
```

{% hint style="warning" %}
Always reserve 5 addresses when planning subnets!
{% endhint %}

### RFC 1918 Private Address Ranges

AWS recommends using these ranges for VPCs:

```
10.0.0.0/8          (10.0.0.0 - 10.255.255.255)
├─ Largest range
├─ Allows /16 subnets from 10.0.0.0/16 to 10.255.0.0/16
└─ Most flexible for growth

172.16.0.0/12       (172.16.0.0 - 172.31.255.255)
├─ Medium range
├─ Allows multiple /16 subnets
└─ Good for mid-sized deployments

192.168.0.0/16      (192.168.0.0 - 192.168.255.255)
├─ Small range
├─ Limited flexibility
└─ Common for small labs
```

### Reserved CIDR Ranges (Cannot be used)

```
0.0.0.0/8              - This network
127.0.0.0/8            - Loopback addresses
169.254.0.0/16         - Link-local addresses
224.0.0.0/4            - Multicast addresses
172.17.0.0/16          - Reserved by AWS (Cloud9, SageMaker)
```

### VPC CIDR Overlap Restrictions

| Existing CIDR  | Restricted CIDR               | Permitted CIDR                 |
| -------------- | ----------------------------- | ------------------------------ |
| 10.0.0.0/8     | 172.16.0.0/12, 192.168.0.0/16 | Any other 10.0.0.0/8 range     |
| 172.16.0.0/12  | 10.0.0.0/8, 192.168.0.0/16    | Any other 172.16.0.0/12 range  |
| 192.168.0.0/16 | 10.0.0.0/8, 172.16.0.0/12     | Any other 192.168.0.0/16 range |

Example: If you have a VPC with `10.0.0.0/16`, you CANNOT add secondary CIDR from `172.16.0.0/12`.

## Part 6: Real-World Examples

### Example 1: Simple 2-Subnet Setup

Requirement: Create a web + database tier in one AZ

Solution:

```
VPC CIDR: 10.0.0.0/16 (65,536 total IPs)

Public Subnet (Web Tier):
  CIDR: 10.0.1.0/24
  Usable: 251 IPs
  Range: 10.0.1.0 - 10.0.1.255
  Instances: 10.0.1.10, 10.0.1.11, ...

Private Subnet (Database Tier):
  CIDR: 10.0.2.0/24
  Usable: 251 IPs
  Range: 10.0.2.0 - 10.0.2.255
  Instances: 10.0.2.10 (RDS primary), 10.0.2.11 (RDS replica)
```

Calculation:

```
Total IPs used = 2 subnets × 256 = 512
Remaining space = 65,536 - 512 = 65,024 (for future growth)
```

### Example 2: Multi-AZ with Room for Scaling

Requirement: 3 AZs × 2 subnets per AZ = 6 subnets

Solution:

```
VPC CIDR: 10.0.0.0/16

AZ-1 (us-east-1a):
  Public:  10.0.1.0/24
  Private: 10.0.2.0/24

AZ-2 (us-east-1b):
  Public:  10.0.3.0/24
  Private: 10.0.4.0/24

AZ-3 (us-east-1c):
  Public:  10.0.5.0/24
  Private: 10.0.6.0/24
```

Verification:

```
IPs per subnet: 256
Total for 6 subnets: 6 × 256 = 1,536
VPC total: 65,536
Remaining: 65,536 - 1,536 = 64,000 (plenty of room)
```

### Example 3: Detailed Subnet Allocation

Requirement: Unequal subnet sizes based on expected load

```
VPC: 10.0.0.0/16

Web Tier (high traffic):
  Subnet-1: 10.0.0.0/23  → 512 IPs, 507 usable
  Subnet-2: 10.0.2.0/23  → 512 IPs, 507 usable

App Tier (medium traffic):
  Subnet-1: 10.0.4.0/24  → 256 IPs, 251 usable
  Subnet-2: 10.0.5.0/24  → 256 IPs, 251 usable

Database Tier (low traffic):
  Subnet-1: 10.0.6.0/25  → 128 IPs, 123 usable
  Subnet-2: 10.0.6.128/25 → 128 IPs, 123 usable
```

Calculation:

```
Web:      512 + 512 = 1,024
App:      256 + 256 = 512
Database: 128 + 128 = 256
Total:    1,792 IPs
Remaining: 65,536 - 1,792 = 63,744 IPs
```

## Part 7: Practice Problems with Solutions

<details>

<summary>Problem 1: Calculate Usable IPs</summary>

Question: How many usable IP addresses are in subnet `192.168.10.0/26`?

Solution:

```
Total = 2^(32-26) = 2^6 = 64
Usable = 64 - 5 = 59 addresses

Answer: 59 usable IP addresses
```

</details>

<details>

<summary>Problem 2: Find Subnet Range</summary>

Question: What is the IP range for subnet `172.16.5.0/25`?

Solution:

```
/25 = first 25 bits fixed, last 7 bits variable
Minimum (00000000): 172.16.5.0
Maximum (01111111): 172.16.5.127

Answer: 172.16.5.0 - 172.16.5.127 (128 total IPs)
```

</details>

<details>

<summary>Problem 3: Design Subnets</summary>

Question: Divide VPC `10.1.0.0/24` into 4 equal subnets. What are the CIDR blocks?

Solution:

```
Original subnet = /24 = 256 IPs
Need 4 equal subnets = 256 / 4 = 64 IPs each
64 = 2^6 → host bits = 6 → Prefix = 32 - 6 = /26

Subnets:
- 10.1.0.0/26    (10.1.0.0 - 10.1.0.63)
- 10.1.0.64/26   (10.1.0.64 - 10.1.0.127)
- 10.1.0.128/26  (10.1.0.128 - 10.1.0.191)
- 10.1.0.192/26  (10.1.0.192 - 10.1.0.255)
```

</details>

<details>

<summary>Problem 4: Multi-VPC Planning</summary>

Question: Create 3 VPCs with non-overlapping CIDR blocks for a multi-region deployment

Solution:

```
Production VPC (us-east-1):   10.0.0.0/16
Staging VPC (us-west-2):      10.1.0.0/16
Development VPC (eu-west-1):  10.2.0.0/16

Verification:
- No overlaps among 10.0.0.0/16, 10.1.0.0/16, 10.2.0.0/16
- All within 10.0.0.0/8 range
- Room for additional /16 VPCs if needed
```

</details>

<details>

<summary>Problem 5: Subnet Sizing Decision</summary>

Question: You need subnets with minimum 100 usable IPs. What's the smallest prefix you should use?

Solution:

```
Need 100 usable + 5 reserved = 105 total IPs
Smallest power of 2 ≥ 105 is 2^7 = 128
Host bits = 7 → Prefix = 32 - 7 = /25
/25 = 128 total IPs → Usable = 128 - 5 = 123 usable ✓

Answer: Use /25 or larger
```

</details>

## Part 8: CIDR Calculator Quick Reference

### Powers of 2 Cheat Sheet

| Power |  Value | CIDR Bits Used | Prefix |
| ----- | -----: | -------------: | -----: |
| 2^0   |      1 |              0 |    /32 |
| 2^1   |      2 |              1 |    /31 |
| 2^2   |      4 |              2 |    /30 |
| 2^3   |      8 |              3 |    /29 |
| 2^4   |     16 |              4 |    /28 |
| 2^5   |     32 |              5 |    /27 |
| 2^6   |     64 |              6 |    /26 |
| 2^7   |    128 |              7 |    /25 |
| 2^8   |    256 |              8 |    /24 |
| 2^9   |    512 |              9 |    /23 |
| 2^10  |  1,024 |             10 |    /22 |
| 2^11  |  2,048 |             11 |    /21 |
| 2^12  |  4,096 |             12 |    /20 |
| 2^13  |  8,192 |             13 |    /19 |
| 2^14  | 16,384 |             14 |    /18 |
| 2^15  | 32,768 |             15 |    /17 |
| 2^16  | 65,536 |             16 |    /16 |

### CIDR Common Sizes

| CIDR | Total IPs | Usable IPs | Use Case          |
| ---- | --------: | ---------: | ----------------- |
| /16  |    65,536 |     65,531 | VPC size          |
| /20  |     4,096 |      4,091 | Large subnet      |
| /22  |     1,024 |      1,019 | Medium subnet     |
| /24  |       256 |        251 | Standard subnet   |
| /25  |       128 |        123 | Small subnet      |
| /26  |        64 |         59 | Very small subnet |
| /28  |        16 |         11 | Minimal subnet    |

## Part 9: Common CIDR Mistakes in AWS

### Mistake 1: Overlapping Subnets

❌ Wrong:

```
VPC: 10.0.0.0/16
Subnet-1: 10.0.1.0/24  (10.0.1.0 - 10.0.1.255)
Subnet-2: 10.0.1.128/25 (10.0.1.128 - 10.0.1.255)  ← Overlaps!
```

✅ Correct:

```
VPC: 10.0.0.0/16
Subnet-1: 10.0.1.0/24  (10.0.1.0 - 10.0.1.255)
Subnet-2: 10.0.2.0/24  (10.0.2.0 - 10.0.2.255)    ← No overlap
```

### Mistake 2: Not Accounting for Reserved IPs

❌ Wrong:

```
Using /28 subnet (16 total IPs) for VPC router, DNS, and 14 EC2 instances
Actually: 16 - 5 reserved = 11 usable IPs
Can only launch 11 instances, not 14
```

✅ Correct:

```
Calculate: Need 14 instances + 5 reserved = 19 total
Use /25 (128 IPs): 128 - 5 = 123 usable
Plenty of room
```

### Mistake 3: Too Small Subnet from the Start

❌ Wrong:

```
VPC: 192.168.0.0/24 (256 total IPs)
Public Subnet: 192.168.0.0/24 (using all 256)
Can't create any other subnets!
```

✅ Correct:

```
VPC: 10.0.0.0/16 (65,536 IPs)
Allows flexible subnetting:
- Public: 10.0.1.0/24
- Private: 10.0.2.0/24
- Future growth: 65,000+ remaining
```

### Mistake 4: Forgetting CIDR Reservation Conflicts

❌ Wrong:

```
Using 172.17.0.0/16 for VPC (conflicts with Cloud9/SageMaker)
```

✅ Correct:

```
Using 10.0.0.0/16 or 172.16.0.0/16 (from RFC 1918)
Avoid 172.17.0.0/16
```

## Summary: CIDR Quick Decision Tree

```
┌─ How many IPs do I need?
│  ├─ Less than 256 → /24
│  ├─ 256-1,024 → /22
│  ├─ 1,024-4,096 → /20
│  └─ 4,096+ → /16 or split into multiple VPCs
│
├─ How many subnets do I need?
│  ├─ 2-4 subnets → Use /24 within /16 VPC
│  ├─ 5-10 subnets → Use /24 within /16 VPC (plenty of room)
│  └─ 10+ subnets → Use /23 or /22
│
├─ Do I have future growth plans?
│  ├─ Yes → /16 VPC with /24 subnets
│  └─ No → /20 VPC with /24 subnets (if small)
│
└─ Have I checked for CIDR conflicts?
   ├─ Using RFC 1918 ranges (10.x, 172.16.x, 192.168.x)? ✓
   ├─ Avoiding 172.17.0.0/16? ✓
   ├─ No overlap with on-premises networks? ✓
   └─ No overlap with other AWS accounts? ✓
```

## Resources for Practice

* Interactive CIDR Calculator: https://www.ipaddressguide.com/cidr
* Visual Subnet Calculator: http://davidc.net/sites/default/subnets/subnets.html
* AWS Documentation: https://docs.aws.amazon.com/vpc/
* Binary Converter: https://www.rapidtables.com/convert/number/binary-converter.html

Practice until you can calculate CIDR blocks without a calculator!

This skill is essential for VPC design and will be tested in AWS Solutions Architect and DevOps certifications.

Last Updated: January 2026\
Version: 1.0\
Suitable for: DevOps engineers, AWS Solutions Architects, Network engineers

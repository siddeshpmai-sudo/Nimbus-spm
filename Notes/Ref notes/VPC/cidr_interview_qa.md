# cidr\_interview\_qa

## For AWS Solutions Architect & DevOps Interviews

***

## Visual CIDR Examples (For Teaching)

### Example: 10.0.0.0/16 Breakdown

```
Address:  10        .    0        .    0        .    0
Decimal:  00001010  .  00000000   .  00000000   .  00000000
          │         │   │         │   │         │   │
          Octet 1   │   Octet 2   │   Octet 3   │   Octet 4
          8 bits    │   8 bits    │   8 bits    │   8 bits
                   16 bits (network)          16 bits (hosts)
                    
/16 Prefix = First 16 bits are FIXED (network)
            Last 16 bits are VARIABLE (host addresses)

Range:    10.0.0.0 - 10.0.255.255
Total:    2^16 = 65,536 addresses
```

### Example: 10.0.1.0/24 Breakdown

```
Address:  10        .    0        .    1        .    0
Decimal:  00001010  .  00000000   .  00000001   .  00000000
          │         │   │         │   │         │   │
          ├─────────┴───┴─────────┴───┘         │
          │            24 bits (network)        │
          │                                   8 bits (hosts)

/24 Prefix = First 24 bits are FIXED
            Last 8 bits are VARIABLE

Range:    10.0.1.0 - 10.0.1.255
Total:    2^8 = 256 addresses
```

### Example: 10.0.1.0/25 Breakdown

```
Address:  10.0.1.00000000
          │  │  │   │
          └──┴──┴───┤ Octet 4 (binary: 00000000)
                    │
/25 means: Fixed bits = 25
           Variable bits = 7

Breaking down the 4th octet:
Bit:  7      6     5     4     3     2     1     0
      │      │     │     │     │     │     │     │
      FIXED  │     │     │     │     │     │     │
      ↓      └─────┴─────┴─────┴─────┴─────┴─────┘
            Variable (7 bits)

Subnet-1: 10.0.1.00000000 - 10.0.1.01111111
          10.0.1.0 - 10.0.1.127

Subnet-2: 10.0.1.10000000 - 10.0.1.11111111
          10.0.1.128 - 10.0.1.255
```

***

## Common Interview Questions & Answers

<details>

<summary><strong>Q1: How many IP addresses are in a /24 subnet?</strong></summary>

```
Formula: 2^(32 - prefix)
2^(32 - 24) = 2^8 = 256 total addresses

In AWS VPC context:
256 - 5 reserved = 251 usable addresses

Reserved addresses:
- Network address (.0)
- VPC router (.1)
- DNS server (.2)
- Future use (.3)
- Broadcast (.255)
```

</details>

<details>

<summary><strong>Q2: You have VPC 10.0.0.0/16. Can you create a subnet 10.0.0.0/24?</strong></summary>

```
Yes! Subnet is smaller than VPC, so it's valid.

Verification:
VPC:     10.0.0.0/16 covers 10.0.0.0 - 10.0.255.255
Subnet:  10.0.0.0/24 covers 10.0.0.0 - 10.0.0.255

Subnet range is completely within VPC range ✓

You can create many /24 subnets:
- 10.0.0.0/24
- 10.0.1.0/24
- 10.0.2.0/24
- ...up to 10.0.255.0/24 (256 total /24 subnets)
```

</details>

<details>

<summary><strong>Q3: You need 3 subnets in one VPC. What CIDR should you use?</strong></summary>

```
Typical approach:

VPC:        10.0.0.0/16 (gives you flexibility)
Subnet-1:   10.0.1.0/24 (256 IPs)
Subnet-2:   10.0.2.0/24 (256 IPs)
Subnet-3:   10.0.3.0/24 (256 IPs)

Used: 3 × 256 = 768 addresses
Available in VPC: 65,536 - 768 = 64,768 remaining

This leaves plenty of room for future growth!

Alternative (for larger subnets):
Subnet-1:   10.0.0.0/23 (512 IPs)
Subnet-2:   10.0.2.0/23 (512 IPs)
Subnet-3:   10.0.4.0/23 (512 IPs)
```

</details>

<details>

<summary><strong>Q4: Can you have subnets 10.0.0.0/24 and 10.0.0.128/25 in the same VPC?</strong></summary>

```
NO! These overlap.

/24 subnet:   10.0.0.0 - 10.0.0.255
/25 subnet:   10.0.0.128 - 10.0.0.255

The /25 overlaps with the /24 ❌

The last 128 addresses (10.0.0.128-255) are in BOTH.

Correct approach:
Subnet-1:     10.0.0.0/25 (10.0.0.0 - 10.0.0.127)
Subnet-2:     10.0.0.128/25 (10.0.0.128 - 10.0.0.255)

These two don't overlap ✓
```

</details>

<details>

<summary><strong>Q5: What's the difference between /24 and /26?</strong></summary>

```
/24:
- Formula: 2^(32-24) = 2^8 = 256 total addresses
- Network bits: 24
- Host bits: 8
- Example: 10.0.1.0/24 = 10.0.1.0 - 10.0.1.255
- Usable (in AWS): 256 - 5 = 251

/26:
- Formula: 2^(32-26) = 2^6 = 64 total addresses
- Network bits: 26
- Host bits: 6
- Example: 10.0.1.0/26 = 10.0.1.0 - 10.0.1.63
- Usable (in AWS): 64 - 5 = 59

/26 is smaller (4× fewer addresses)

For same octets:
10.0.1.0/24 can be divided into:
- 10.0.1.0/26 (0-63)
- 10.0.1.64/26 (64-127)
- 10.0.1.128/26 (128-191)
- 10.0.1.192/26 (192-255)
```

</details>

<details>

<summary><strong>Q6: Which CIDR ranges should I use for AWS VPCs?</strong></summary>

```
RFC 1918 Private Ranges (recommended):

10.0.0.0/8
├─ Range: 10.0.0.0 - 10.255.255.255
├─ Total: 16,777,216 addresses
├─ Good for: Large environments needing growth
└─ Common: /16 subnets within this range

172.16.0.0/12
├─ Range: 172.16.0.0 - 172.31.255.255
├─ Total: 1,048,576 addresses
├─ Good for: Medium environments
└─ Common: /16 subnets within this range

192.168.0.0/16
├─ Range: 192.168.0.0 - 192.168.255.255
├─ Total: 65,536 addresses
├─ Good for: Small lab environments
├─ Caution: Limited growth potential
└─ Example: /20 or /22 subnets only

AVOID:
172.17.0.0/16 - Reserved by AWS (Cloud9, SageMaker)
0.0.0.0/8 - "This network"
127.0.0.0/8 - Loopback
169.254.0.0/16 - Link-local
224.0.0.0/4 - Multicast
```

</details>

<details>

<summary><strong>Q7: I have 10 availability zones and need 2 subnets per AZ. What VPC CIDR?</strong></summary>

```
Requirements:
- 10 AZs × 2 subnets = 20 subnets
- Each subnet: ~250 usable IPs (use /24)

Calculation:
20 subnets × 256 IPs = 5,120 addresses needed

Recommended VPC CIDR:
10.0.0.0/16 (65,536 addresses)
└─ More than enough with room for growth

Subnet allocation:
AZ-1: 10.0.1.0/24, 10.0.2.0/24
AZ-2: 10.0.3.0/24, 10.0.4.0/24
AZ-3: 10.0.5.0/24, 10.0.6.0/24
...
AZ-10: 10.0.19.0/24, 10.0.20.0/24

Used: 20 × 256 = 5,120
Remaining: 65,536 - 5,120 = 60,416 (for growth!)
```

</details>

<details>

<summary><strong>Q8: What if I run out of IP addresses in my VPC?</strong></summary>

Create new CIDR block (non-overlapping)If primary is 10.0.0.0/16, add a secondary like 10.1.0.0/16.Create new subnets from secondary CIDRExample subnets: 10.1.1.0/24, 10.1.2.0/24, etc.Update route tablesRoutes are automatically added for the secondary CIDR (e.g., 10.1.0.0/16).Constraints:Primary CIDR cannot be changed (only added to)Secondary CIDR blocks cannot overlap with primaryMaximum CIDR blocks per VPC: 5 primary + secondarySize: /28 minimum, /16 maximum

</details>

<details>

<summary><strong>Q9: How do I avoid CIDR conflicts with on-premises networks?</strong></summary>

```
Step 1: Document your on-premises network CIDR
        Example: 192.168.0.0/16

Step 2: Choose AWS VPC CIDR that doesn't overlap
        ❌ DON'T use: 192.168.x.x (overlaps with on-premises)
        ✓ Use: 10.0.0.0/16 (completely different)

Step 3: For hybrid connectivity (VPN/Direct Connect)
        Ensure both sides have non-overlapping CIDRs

Example:
On-premises:  192.168.0.0/16
AWS VPC-1:    10.0.0.0/16
AWS VPC-2:    10.1.0.0/16
AWS VPC-3:    10.2.0.0/16

Route table will route:
192.168.x.x → VPN to on-premises
10.0.x.x → Local
10.1.x.x → Local
10.2.x.x → Local
```

</details>

<details>

<summary><strong>Q10: What's the minimum and maximum subnet size in AWS?</strong></summary>

```
Minimum (/28):
- Total IPs: 16
- Usable IPs: 11
- Example: 10.0.0.0/28 = 10.0.0.0 - 10.0.0.15
- Use case: Point-to-point links, not recommended for typical use

Maximum (/16):
- Total IPs: 65,536
- Usable IPs: 65,531
- Example: 10.0.0.0/16 = 10.0.0.0 - 10.0.255.255
- Use case: Entire VPC (usually)

Practical Range:
/20 to /26 most common
- /20: 4,096 IPs (large subnet)
- /22: 1,024 IPs (medium subnet)
- /24: 256 IPs (standard subnet) ← Most common
- /26: 64 IPs (small subnet)
```

</details>

***

## Decision Matrix for CIDR Selection

### Choosing VPC CIDR

| Requirement                | VPC CIDR       | Reason                   |
| -------------------------- | -------------- | ------------------------ |
| Single AZ, small app       | 10.0.0.0/24    | 256 IPs, simple          |
| Single AZ, medium app      | 10.0.0.0/22    | 1,024 IPs, scalable      |
| Multi-AZ (2-3), medium app | 10.0.0.0/16    | 65K IPs, plenty of room  |
| Multi-AZ (5+), large app   | 10.0.0.0/16    | Required for 20+ subnets |
| Legacy, very small app     | 192.168.0.0/20 | 4K IPs, last resort      |

### Choosing Subnet CIDR

| Requirement        | Subnet CIDR | Total IPs | Usable IPs |
| ------------------ | ----------: | --------: | ---------: |
| Development lab    |         /28 |        16 |         11 |
| Small private tier |         /26 |        64 |         59 |
| Standard subnet    |         /24 |       256 |        251 |
| Large public tier  |         /23 |       512 |        507 |
| Very large tier    |         /22 |     1,024 |      1,019 |

***

## Quick Reference: CIDR to IP Count

| CIDR | Total IPs | Usable (AWS) | Visual Size          |
| ---- | --------: | -----------: | -------------------- |
| /16  |    65,536 |       65,531 | ████████████████████ |
| /17  |    32,768 |       32,763 | ██████████           |
| /18  |    16,384 |       16,379 | █████                |
| /19  |     8,192 |        8,187 | ██                   |
| /20  |     4,096 |        4,091 | █                    |
| /21  |     2,048 |        2,043 | ▌                    |
| /22  |     1,024 |        1,019 | ▌                    |
| /23  |       512 |          507 | ▌                    |
| /24  |       256 |          251 | ▌                    |
| /25  |       128 |          123 | ▌                    |
| /26  |        64 |           59 | ▌                    |
| /27  |        32 |           27 | ▌                    |
| /28  |        16 |           11 | ▌                    |

***

## Practice Worksheet

**Problem 1:** Calculate usable IPs in 172.16.10.0/27

```
Answer: 2^5 = 32 total, 32 - 5 = 27 usable IPs
```

**Problem 2:** What's the range for 10.50.100.0/22?

```
Hint: /22 means 10 host bits
2^10 = 1,024 addresses
```

**Problem 3:** Can you create 10.0.0.0/24 and 10.0.0.0/25 in same VPC?

```
Answer: No, they overlap! /25 is contained within /24.
```

**Problem 4:** How many /24 subnets fit in 10.0.0.0/16?

```
/16 has 256 /24 subnets (10.0.0.0 through 10.0.255.0)
```

**Problem 5:** What secondary CIDR can you add to 10.0.0.0/16 VPC?

```
Answer: Any non-overlapping /16 to /28 CIDR
Example: 10.1.0.0/16, 10.2.0.0/16, 172.16.0.0/16, etc.
```

***

## Teaching Tip: Binary Flash Cards

Use these to practice binary ↔ decimal conversion:

```
11111111 = ?           (Answer: 255)
00001010 = ?           (Answer: 10)
10101100 = ?           (Answer: 172)
11000000 = ?           (Answer: 192)

Reverse:
10 = ?                 (Answer: 00001010)
168 = ?                (Answer: 10101000)
192 = ?                (Answer: 11000000)
172 = ?                (Answer: 10101100)
```

***

## Resources for Self-Study

1. **IP Calculator:** https://www.ipaddressguide.com/cidr
2. **Visual Subnet Calculator:** http://davidc.net/sites/default/subnets/subnets.html
3. **Binary Converter:** https://www.rapidtables.com/convert/number/binary-converter.html
4. **AWS VPC Documentation:** https://docs.aws.amazon.com/vpc/latest/userguide/
5. **Subnetting Exercises:** Khan Academy - Computer Networking (free)

***

Master CIDR calculations and you'll master VPC design!

_These are core concepts tested in AWS Solutions Architect Associate, Professional, and DevOps Engineer certifications._

Last Updated: January 2026\
Version: 1.0

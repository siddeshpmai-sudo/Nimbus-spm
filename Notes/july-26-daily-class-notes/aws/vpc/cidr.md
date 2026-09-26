# CIDR

### The CIDR Formula

Total IP Addresses = 2^(32 - CIDR prefix)

Examples:

```
10.0.0.0/16 = 2^(32-16) = 2^16 = 65,536 addresses
10.0.1.0/24 = 2^(32-24) = 2^8  = 256 addresses
10.0.1.0/25 = 2^(32-25) = 2^7  = 128 addresses
```

### The 5 Reserved Addresses in Each AWS Subnet

In an AWS VPC subnet, five addresses are reserved and cannot be assigned to instances.

Example: `10.0.1.0/24` (256 total addresses)

* `10.0.1.0` ← Network address (reserved)
* `10.0.1.1` ← VPC router (reserved)
* `10.0.1.2` ← AWS DNS server (reserved)
* `10.0.1.3` ← Reserved for future use (reserved)
* `10.0.1.4-10.0.1.254` ← Usable for EC2, RDS, etc. (251 addresses)
* `10.0.1.255` ← Broadcast (reserved)

Usable = 256 - 5 = 251 addresses

### Binary Understanding

Each octet = 8 bits = decimal 0–255

Bit positions and powers:

```
Bit Position:  7  6  5  4  3  2  1  0
Power of 2:  128 64 32 16 8  4  2  1
```

Example: Convert 192 to binary\
192 = 128 + 64 = 11000000 (binary)

## Subnet Planning Approach

{% stepper %}
{% step %}
### Choose VPC CIDR

* Most common: /16 (65,536 addresses)
* Provides flexibility for growth
* Example: 10.0.0.0/16
{% endstep %}

{% step %}
### Plan Subnets

* Most common subnet size: /24 (256 addresses)
* A /16 VPC can contain up to 256 /24 subnets
* Example subnets:
  * Public-1: 10.0.1.0/24
  * Private-1: 10.0.2.0/24
  * Public-2: 10.0.3.0/24
  * Private-2: 10.0.4.0/24
{% endstep %}

{% step %}
### Verify No Overlap

* Each subnet must have a unique CIDR block.
* Subnets in a VPC cannot overlap.
* Use a calculator or binary boundary checks to confirm ranges.
{% endstep %}
{% endstepper %}

## Quick Reference Chart

| CIDR | Total IPs | Usable (AWS) | Use Case                      |
| ---- | --------: | -----------: | ----------------------------- |
| /16  |    65,536 |       65,531 | Entire VPC                    |
| /20  |     4,096 |        4,091 | Large subnet                  |
| /22  |     1,024 |        1,019 | Medium subnet                 |
| /24  |       256 |          251 | Standard subnet (most common) |
| /25  |       128 |          123 | Small subnet                  |
| /26  |        64 |           59 | Tiny subnet                   |
| /28  |        16 |           11 | Minimal subnet                |

## Key Points to Emphasize

1. **CIDR Prefix = Network Bits**
   * `/24` means the first 24 bits are network bits and the last 8 bits are host bits.
   * A higher prefix number means a smaller network.
2. **Powers of 2 Are Critical**
   * Common mappings:
     * `/16` = 65,536
     * `/20` = 4,096
     * `/24` = 256
     * `/25` = 128
     * `/26` = 64
3. **AWS Reserves 5 IPs**
   * Always subtract 5 when planning usable IPs.
4. **No Overlapping Subnets**
   * Overlap example: `10.0.1.0/24` overlaps with `10.0.1.128/25`.
5. **Plan for Growth**
   * Prefer `/16` VPCs for flexibility rather than small VPC CIDRs.

## Assessment Methods

### Quick Checks

```
Q: How many usable IPs in 10.0.1.0/26?
A: 64 - 5 = 59

Q: What's the range of 172.16.0.0/22?
A: 172.16.0.0 - 172.16.3.255

Q: Can you have 10.0.0.0/24 and 10.0.0.128/25 in the same VPC?
A: No — they overlap
```

### Interview Simulation Prompts

* Design a VPC for 5 AZs with 3 subnets each.
* Calculate usable IPs for given subnets.
* Determine which CIDR can be added to a VPC without overlap.

## Interview Q\&A

<details>

<summary>Q1: How many IPs in a /24?</summary>

Answer: 256 total addresses, 251 usable in AWS (accounting for 5 reserved IPs).

</details>

<details>

<summary>Q2: How to design a VPC?</summary>

Answer: Use a /16 VPC (10.0.0.0/16) and carve /24 subnets for each AZ/service—ensures room for growth and multiple non-overlapping subnets.

</details>

<details>

<summary>Q3: Can these two subnets coexist?</summary>

Answer: Check overlap. If ranges overlap (e.g., 10.0.1.0/24 and 10.0.1.128/25), they cannot coexist.

</details>

<details>

<summary>Q4: What if we run out of IPs?</summary>

Answer: Add a secondary CIDR block to the VPC (AWS supports multiple CIDR blocks per VPC).

</details>

<details>

<summary>Q5: What CIDR ranges should we use?</summary>

Answer: Use RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 depending on design needs.

</details>

## Real-World Examples & Practice

* The main guide includes multiple worked examples and practice problems. See `cidr_calculation_guide.md`: Parts 6 and 7.
* Include practice problems where students compute usable IPs, check for overlap, and design subnets for given requirements.

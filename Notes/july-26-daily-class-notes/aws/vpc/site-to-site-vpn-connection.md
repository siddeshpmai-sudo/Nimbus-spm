# site to site vpn connection

## Site-to-Site VPN Explained

A site-to-site VPN securely links two private networks—typically a headquarters (HQ) LAN and a remote-branch LAN—so every device at either site can communicate as if they share one extended network. Instead of leasing dedicated circuits, the two sites use the public Internet but protect all traffic with an encrypted IPsec tunnel negotiated between their edge gateways.

<figure><img src="../../../.gitbook/assets/548fe53e a31d 4f2d a542 38d26e4df572.png" alt=""><figcaption><p>Site-to-Site VPN architecture: HQ and Branch connected with IPSec tunnel</p></figcaption></figure>

## Core Components

| Component                             | Role in the tunnel                                        | Typical device examples                                           |
| ------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| VPN Gateway                           | Performs encryption/decryption, builds the IPsec tunnel   | Firewall, router, virtual appliance                               |
| Public WAN link                       | Carries the encrypted packets between gateways            | Any ISP connection                                                |
| Encryption & Authentication protocols | Provide confidentiality, integrity, entity authentication | IKEv2 for key exchange, AES-256/SHA-256 in IPsec phase 2          |
| Internal routing                      | Moves decrypted packets inside each LAN                   | Static routes or dynamic (OSPF/BGP) advertised through the tunnel |

## How the Tunnel Forms (IKE/IPsec)

{% stepper %}
{% step %}
### IKE Phase 1

Gateways authenticate using a pre-shared key or certificates and build a secure control channel.
{% endstep %}

{% step %}
### IKE Phase 2

They negotiate IPsec Security Associations (SAs) specifying ciphers, lifetimes, and subnets.
{% endstep %}

{% step %}
### Data flow

Packets matching the crypto ACL are encrypted, encapsulated, sent through the public Internet, then decrypted and forwarded to the destination LAN.
{% endstep %}
{% endstepper %}

## Real-Time Use Case: HQ ↔ Warehouse Inventory System

**Scenario:** A retailer’s HQ runs an ERP database (`10.0.0.0/24`). A new warehouse 500 km away needs real-time stock updates from barcode scanners on its LAN (`10.1.0.0/24`).

{% stepper %}
{% step %}
### Assign public IP addresses

Each site’s firewall is assigned a public static IP from its ISP.
{% endstep %}

{% step %}
### Define internal networks and authentication

The network engineer defines non-overlapping internal subnets and a shared pre-shared key.
{% endstep %}

{% step %}
### Configure matching security policies

Matching IKE/IPsec policies—AES-256, SHA-256, and DH Group 14—are configured on both gateways.
{% endstep %}

{% step %}
### Limit permitted traffic

Crypto ACLs permit traffic between `10.0.0.0/24` and `10.1.0.0/24` only, limiting exposure.
{% endstep %}

{% step %}
### Route traffic through the tunnel

Static routes, or OSPF, direct ERP traffic into the tunnel. Scanners update the HQ ERP in milliseconds, while all traffic remains encrypted end-to-end.
{% endstep %}
{% endstepper %}

## Benefits for Students to Note

* **Security:** Data is unreadable in transit; only vetted subnets pass through.
* **Cost efficiency:** Uses inexpensive broadband instead of MPLS.
* **Transparency:** End-devices need no VPN client; the network itself is extended.
* **Scalability:** Additional branches can join via hub-and-spoke or full-mesh topologies using the same principles.

## Key Design Tips

{% hint style="warning" %}
Avoid overlapping IP ranges across sites.
{% endhint %}

{% hint style="info" %}
Plan redundancy—dual tunnels or secondary gateways—to survive device or ISP failure.
{% endhint %}

{% hint style="info" %}
Monitor SA lifetimes and tunnel health; enable alerts on re-key failures.
{% endhint %}

With this architecture and example, students can visualize how two distant LANs operate as one secure network without touching individual endpoints, a foundational concept for modern distributed enterprises.

# AWS Load Balancers Explained

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*8QhAIq6cg9FwdJi93wDEVQ.png" alt="" height="350" width="700"><figcaption></figcaption></figure>

Most engineers know the one-line version: ALB is for HTTP, NLB is for TCP, and GWLB is for network appliances. That’s enough to pass an interview. It’s not enough to make the right architectural decision when your production traffic behaves unexpectedly or your health checks are failing in ways the AWS documentation doesn’t quite explain.

The real distinctions between these load balancers show up in the edge cases: when latency matters at the microsecond level, when you need to preserve client IPs without header manipulation, when connection draining isn’t working the way you expected, or when you’re running a third-party firewall in AWS and traffic inspection needs to be transparent.

This article covers the operational behavior that the basic explanations skip.

### ALB: more than just HTTP routing <a href="#id-22b9" id="id-22b9"></a>

Press enter or click to view image in full size

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*lMKhmgNXkcv0gS4G5-gBPw.png" alt="" height="603" width="700"><figcaption></figcaption></figure>

The Application Load Balancer operates at Layer 7. It terminates the connection, reads the HTTP request, makes a routing decision based on content, and opens a new connection to the target. This full proxy behavior is what makes ALB powerful and also what makes it slower than NLB.

The routing capabilities go well beyond hostname and path matching:

```
{
  "Conditions": [
    {
      "Field": "http-header",
      "HttpHeaderConfig": {
        "HttpHeaderName": "X-Feature-Flag",
        "Values": ["canary"]
      }
    }
  ],
  "Actions": [
    {
      "Type": "forward",
      "TargetGroupArn": "arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/canary-tg/abc123"
    }
  ]
}
```

Header-based routing lets you route canary users to a different target group based on a custom header. Combined with query string conditions, source IP conditions, and method conditions, this creates a routing layer that would otherwise require application code.

**Weighted target groups** are how you implement traffic splitting without Argo Rollouts or a service mesh:

```
{
  "Type": "forward",
  "ForwardConfig": {
    "TargetGroups": [
      {
        "TargetGroupArn": "arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/stable/abc123",
        "Weight": 90
      },
      {
        "TargetGroupArn": "arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/canary/def456",
        "Weight": 10
      }
    ]
  }
}
```

10% of traffic goes to canary, 90% to stable, controlled entirely at the load balancer layer.

The sharp edge with ALB: because it terminates and re-initiates connections, the target sees the ALB’s IP as the source, not the client’s IP. To get the real client IP, you read the `X-Forwarded-For` header. This matters for rate limiting, geoblocking, audit logging, and any application that makes decisions based on source IP. If your security groups on the target allow traffic from the ALB's security group and you're filtering IPs in application code, you're filtering the wrong IP.

**ALB and gRPC:** ALB natively supports gRPC routing and health checks as of 2020. You can route based on gRPC service name and method, and health checks use the gRPC health checking protocol rather than HTTP. This makes ALB the right choice for gRPC microservices without needing a separate service mesh or proxy layer.

### NLB: when Layer 7 overhead is the problem <a href="#aa2b" id="aa2b"></a>

Press enter or click to view image in full size

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*Q-Z2cqTnjJJ2aE3005NH7Q.png" alt="" height="633" width="700"><figcaption></figcaption></figure>

NLB operates at Layer 4. It doesn’t read the packet content. It sees a TCP/UDP connection, looks up the target group, and forwards the packet. No connection termination, no added headers, no buffering.

This has two significant consequences:

**Latency.** NLB adds single-digit millisecond overhead. ALB typically adds 20–30ms because of the connection termination and re-establishment. For most web applications this difference is irrelevant. For financial services, gaming, or any real-time system where latency compounds across dozens of service calls, NLB wins.

**Client IP preservation.** Because NLB doesn’t terminate the connection, the client’s IP address is preserved at the target. No `X-Forwarded-For` required. Your target sees the actual client IP in the socket connection. This matters for any protocol that doesn't have an equivalent of `X-Forwarded-For`, for UDP workloads, and for applications where reading a header is not an option.

```
# Verify client IP preservation with NLB
# On the target instance, check connection source IPs
ss -tnp | grep :8080
# You'll see the client IP directly, not the NLB IP
```

The operational behavior most teams don’t expect: NLB uses flow hash-based routing. A given client IP and source port combination consistently routes to the same target as long as that target is healthy. This is stickiness without a cookie, built into the nature of Layer 4 routing. The implication: if you need true random distribution, NLB’s flow-based routing means clients with the same source IP/port tuple will stick to one target.

**NLB and TLS termination:** NLB can terminate TLS (called TLS passthrough is also supported). When terminating TLS, NLB adds `X-Forwarded-For` behavior through Proxy Protocol v2, which the target must support. Most modern applications do. If your target doesn't support Proxy Protocol, either disable it or use ALB for TLS termination.

**Static IPs:** NLB gets a fixed IP per Availability Zone. This matters for clients that need to whitelist IPs in their firewall. ALB can’t provide this because its IPs change. NLB’s static IPs or Elastic IP attachments make it the right choice for B2B integrations where the client controls the ingress firewall.

### GWLB: transparent traffic inspection <a href="#id-2340" id="id-2340"></a>

Press enter or click to view image in full size

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*5x4X6LUNkc82WcL27HSy3w.png" alt="" height="586" width="700"><figcaption></figcaption></figure>

Gateway Load Balancer is the least understood of the three and also the one with the most specific use case. It was designed for network virtual appliances: third-party firewalls, intrusion detection systems, deep packet inspection tools that need to sit in the traffic path without requiring changes to application routing.

GWLB operates at Layer 3 using the GENEVE encapsulation protocol (port 6081). It receives packets from your VPC route table, forwards them to your appliance fleet, and then returns the packets to their original destination after inspection. The traffic path is transparent to both the source and destination.



The architecture:

```
VPC Route Table
  0.0.0.0/0 → GWLB Endpoint

GWLB Endpoint (in inspection VPC)
  ↓ GENEVE encapsulation
Appliance fleet (Palo Alto, Fortinet, CheckPoint, etc.)
  ↓ inspected and returned
GWLB Endpoint
  ↓
Original destination (back to VPC routing)
```

```
# Check GWLB endpoint association
aws ec2 describe-vpc-endpoint-service-configurations \
  --query 'ServiceConfigurations[?ServiceType[?ServiceType==`GatewayLoadBalancer`]]'

# Verify route table entry pointing to GWLB endpoint
aws ec2 describe-route-tables \
  --route-table-ids rtb-0abc123def456789 \
  --query 'RouteTables[*].Routes[?GatewayId!=null]'
```

The key operational property: GWLB uses 5-tuple flow hash stickiness (source IP, destination IP, source port, destination port, protocol). All packets belonging to the same flow go to the same appliance instance. This is essential for stateful inspection. A firewall that sees the SYN but not the SYN-ACK can’t make the right decision.

GWLB is not a general-purpose load balancer. If you’re not running network appliances that need to inspect traffic transparently, you don’t need GWLB.

### Target groups: the configuration that matters most <a href="#df68" id="df68"></a>

Target groups are where load balancer behavior gets specific. The right target type, health check configuration, and deregistration behavior make the difference between reliable deployments and traffic drops during scale events.

**Target types:**

* **Instance:** routes to EC2 instance IDs. The instance must have the port accessible.
* **IP:** routes to specific IP addresses. Required for targets outside the VPC (on-premises), Lambda functions as targets, or ECS Fargate tasks (which don’t have instance IDs).
* **Lambda:** routes HTTP requests directly to a Lambda function. ALB serializes the request into a JSON event.

**Deregistration delay:** when a target is deregistered (scale-in event, deployment replacement), ALB and NLB stop sending new connections to it but keep existing connections open until they complete or the deregistration delay expires. The default is 300 seconds.

300 seconds is too long for most APIs. If your requests complete within 30 seconds, set the delay to 30 seconds plus a safety margin:

```
aws elbv2 modify-target-group-attributes \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/api/abc123 \
  --attributes Key=deregistration_delay.timeout_seconds,Value=30
```

A 300-second delay means a rolling deployment with 10 instances takes 50 minutes for old instances to fully drain. A 30-second delay makes the same deployment complete in 5 minutes.

**Slow start duration:** when a new target registers and passes its first health check, it immediately receives its full share of traffic. For targets with long initialization times (JVM warm-up, cache population), this causes elevated error rates at startup. Slow start ramps traffic from 0 to full share over a configurable duration:

```
aws elbv2 modify-target-group-attributes \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/api/abc123 \
  --attributes Key=slow_start.duration_seconds,Value=30
```

### Health checks: where load balancer reliability actually lives <a href="#id-1987" id="id-1987"></a>

Health checks are the mechanism that makes load balancers useful. A misconfigured health check is worse than no health check. It either marks healthy targets as unhealthy (unnecessary traffic reduction) or keeps unhealthy targets in rotation (user-facing errors).

**The right health check path:** your health check endpoint should reflect the actual health of the target, not just that the process is running. A web server that responds 200 to `/health` while its database connection pool is exhausted is lying to the load balancer. Your health check should verify that the application can actually serve requests.

```
# A meaningful health check
@app.route('/health')
def health():
    checks = {
        'database': check_db_connection(),
        'cache': check_cache_connection(),
        'downstream_api': check_downstream()
    }
    if all(checks.values()):
        return jsonify({'status': 'healthy', 'checks': checks}), 200
    return jsonify({'status': 'unhealthy', 'checks': checks}), 503
```

**Threshold tuning:** the defaults (10 seconds interval, 3 consecutive failures before unhealthy) mean a target isn’t removed from rotation for 30 seconds after it starts failing. For latency-sensitive applications, reduce this:

```
aws elbv2 modify-target-group \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/api/abc123 \
  --health-check-interval-seconds 10 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 2 \
  --health-check-timeout-seconds 5
```

Two consecutive failures (20 seconds) before marking unhealthy. Two consecutive successes (20 seconds) before marking healthy again. A target that flaps doesn’t get cycled in and out repeatedly with these settings. Two clean passes are required.

**NLB health checks behave differently from ALB.** NLB health checks are TCP-level by default. A TCP health check succeeds if the port accepts a connection, even if the application is deadlocked and not processing requests. Use HTTP health checks on NLB when possible:

```
aws elbv2 modify-target-group \
  --target-group-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:targetgroup/tcp-api/abc123 \
  --health-check-protocol HTTP \
  --health-check-path /health
```

### Choosing the right load balancer <a href="#id-3ca6" id="id-3ca6"></a>

Dimension ALB NLB GWLB Layer 7 (HTTP/HTTPS/gRPC) 4 (TCP/UDP/TLS) 3 (all IP traffic) Latency 20–30ms overhead Single-digit ms Depends on appliance Client IP X-Forwarded-For header Preserved natively Preserved Static IPs No Yes (per AZ) Yes (per AZ) Routing logic Headers, paths, query, method Flow hash GENEVE encapsulation TLS termination Yes Yes (+ passthrough) No Use case HTTP APIs, microservices Low-latency TCP, IP whitelisting Network appliances, inspection

The decision is mostly made by the protocol and latency requirements. HTTP workloads without strict latency requirements go to ALB. TCP workloads, UDP workloads, and anything requiring IP whitelisting go to NLB. Traffic inspection and firewall appliances go to GWLB.

Where teams get it wrong: choosing NLB for an HTTP API because “it’s faster” without considering that they lose header-based routing, request-level visibility in access logs, and native gRPC support. The latency difference rarely justifies the feature loss for typical web APIs. NLB earns its place for protocols that ALB doesn’t speak and for scenarios where static IPs are required

<br>

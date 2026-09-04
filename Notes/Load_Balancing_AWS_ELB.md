# Load Balancing Basics & AWS Elastic Load Balancing (ELB)

## What is a Load Balancer?
A Load Balancer acts as the "traffic cop" sitting in front of your servers. It routes client requests across all servers capable of fulfilling those requests in a manner that maximizes speed and capacity utilization.

### Why Use a Load Balancer?
- **High Availability**: If a server goes down (fails health checks), the load balancer stops sending traffic to it and redirects traffic to healthy servers.
- **Scalability**: You can easily add or remove backend servers as traffic fluctuates without disrupting the user experience.
- **Performance**: It distributes load evenly to prevent any single server from becoming a bottleneck.
- **Security**: It can act as a single point of entry, terminating SSL/TLS certificates and hiding internal server IP addresses.

---

## Common Load Balancing Algorithms

Load balancers use algorithms to determine which backend server should receive a specific request.

1. **Round Robin**: 
   - Requests are distributed across the group of servers sequentially (Server 1, then Server 2, then Server 3, then back to Server 1).
   - Best for: Servers with identical specifications and similar task loads.
2. **Least Connections**: 
   - Sends the new request to the server with the fewest current active connections.
   - Best for: Traffic that involves long sessions or uneven request processing times.
3. **Least Response Time**: 
   - Routes traffic to the server with the fewest active connections AND the lowest average response time.
   - Best for: Ensuring the absolute fastest experience for the end user.
4. **IP Hash (Source IP Routing)**: 
   - The client's IP address is used to calculate a cryptographic hash to determine which server receives the request. 
   - Best for: Session Stickiness (ensuring a specific user always connects to the same backend server).

---

## AWS Elastic Load Balancing (ELB)

AWS ELB automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses, and Lambda functions.

### Types of AWS Load Balancers

#### 1. Application Load Balancer (ALB)
- **Layer**: Operates at Layer 7 (Application layer - HTTP/HTTPS).
- **Use Case**: Best for modern web applications and microservices architectures.
- **Key Features**: 
  - **Path-based routing**: (e.g., `example.com/images` goes to a specific server group, `example.com/video` goes to another).
  - **Host-based routing**: (e.g., `api.example.com` vs `web.example.com`).
  - Supports WebSockets and HTTP/2.

#### 2. Network Load Balancer (NLB)
- **Layer**: Operates at Layer 4 (Transport layer - TCP/UDP/TLS).
- **Use Case**: Built for extreme performance and ultra-low latency.
- **Key Features**: 
  - Capable of handling millions of requests per second while maintaining ultra-low latencies.
  - Provides static IP addresses for the load balancer (one per subnet), which ALB does not do.

#### 3. Classic Load Balancer (CLB) - *Legacy*
- **Layer**: Operates at both Layer 4 and Layer 7.
- **Use Case**: Older generation load balancer. Mostly used for legacy applications built on the EC2-Classic network. AWS recommends migrating to ALB or NLB.

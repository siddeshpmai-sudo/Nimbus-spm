# Load Balancing Algorithms

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*rBMVfzWjo4Id4Q1v2srEXQ.png" alt="" height="771" width="700"><figcaption></figcaption></figure>

### Introduction: Why Load Balancing Matters <a href="#c8ab" id="c8ab"></a>

Imagine a busy airport where thousands of passengers arrive simultaneously. If everyone rushed to a single security checkpoint, chaos would ensue. Instead, airports distribute passengers across multiple checkpoints. This is exactly what load balancing does for web traffic.

**Load balancing** distributes incoming network requests across multiple servers so no single server becomes overwhelmed. It’s the backbone of every scalable system you use daily, from Netflix to your favorite e-commerce platform.

Without load balancing, a traffic spike could crash your application, users would experience slow response times and your system would have a single point of failure.

Whether you’re building your first web application or preparing for system design interviews, understanding load balancing algorithms is essential. This guide covers every major algorithm with clear explanations, real-world analogies and practical examples.

### What is a Load Balancer? <a href="#afe8" id="afe8"></a>

A **load balancer** sits between clients and your backend servers, acting as a traffic cop that decides which server handles each request.

### Layer 4 vs Layer 7 Load Balancing <a href="#id-3d1c" id="id-3d1c"></a>

**Layer 4 (Transport Layer)** load balancers route based on IP addresses and TCP/UDP ports — fast but can’t inspect request content.

**Layer 7 (Application Layer)** load balancers examine HTTP headers, cookies and URL paths — more flexible but require more processing power.

This guide focuses on algorithms applicable to either layer.

### Load Balancing Algorithms: The Complete Breakdown <a href="#id-79a0" id="id-79a0"></a>

Let’s explore each load balancing algorithm in detail.

### 1. Round Robin Load Balancing <a href="#a8d3" id="a8d3"></a>

#### What is Round Robin? <a href="#efb9" id="efb9"></a>

Round Robin is the simplest and most intuitive load balancing algorithm. It distributes requests sequentially across all available servers in a circular order, like dealing cards to players.

#### How It Works (Step-by-Step) <a href="#id-5d90" id="id-5d90"></a>

1. The load balancer maintains a list of available servers
2. When a request arrives, it goes to the first server in the list
3. The next request goes to the second server
4. This continues until all servers have received one request
5. The cycle repeats from the first server

#### Real-World Analogy <a href="#f92a" id="f92a"></a>

Think of a merry-go-round at an amusement park. Each horse (server) gets a rider (request) in sequence. Horse 1 gets a rider, then Horse 2, then Horse 3 and back to Horse 1.

#### Technical Example <a href="#dd99" id="dd99"></a>

Servers: A, B, C

Request Assigned Server 1 A 2 B 3 C 4 A 5 B 6 C

#### System Design Diagram <a href="#id-04c4" id="id-04c4"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*fTWu0CyBubjCSx4_lBT-ww.png" alt="" height="727" width="700"><figcaption><p>Round Robin Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#id-2998" id="id-2998"></a>

Pros Cons Extremely simple to implement Ignores server capacity differences No server state required Ignores current server load Very low overhead Not suitable for long-running connections

#### When to Use Round Robin <a href="#id-8592" id="id-8592"></a>

* Stateless applications where any server can handle any request
* Homogeneous server environments (all servers have equal capacity)
* Simple applications with predictable, short-lived requests
* Development and testing environments

#### When NOT to Use It <a href="#id-6f01" id="id-6f01"></a>

* Servers with different processing capabilities
* Applications requiring session persistence
* Systems with highly variable request complexity

### 2. Sticky Round Robin (Session Persistence) <a href="#id-6bff" id="id-6bff"></a>

#### What is Sticky Round Robin? <a href="#id-0ada" id="id-0ada"></a>

Sticky Round Robin extends basic Round Robin by “sticking” a user to a specific server for the duration of their session. Once a user is assigned to a server, all subsequent requests from that user go to the same server.

#### How It Works (Step-by-Step) <a href="#bb16" id="bb16"></a>

1. A new user’s first request is distributed using Round Robin
2. The load balancer creates a session identifier (usually via cookie)
3. All future requests with that session ID go to the same server
4. When the session expires, the user can be reassigned

#### Real-World Analogy <a href="#c5f1" id="c5f1"></a>

Imagine a bank where you’re assigned a personal banker. Your first visit, you’re assigned based on availability. For all future visits, you always see the same banker who knows your account history.

#### Technical Example <a href="#id-6656" id="id-6656"></a>

Servers: A, B, C

Request User Assigned Server Reason 1 Alice A Round Robin 2 Bob B Round Robin 3 Alice A Sticky (Session) 4 Carol C Round Robin 5 Bob B Sticky (Session) 6 Alice A Sticky (Session)

#### System Design Diagram <a href="#dc88" id="dc88"></a>



<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*tXZkncd_hpYqNToB_aQKSw.png" alt="" height="775" width="700"><figcaption><p>Sticky Round Robin Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#id-3dd6" id="id-3dd6"></a>

Pros Cons Supports stateful applications Can create uneven load distribution Server-side sessions work Server failure loses all sessions Reduces session replication Limits horizontal scaling benefits

#### When to Use Sticky Round Robin <a href="#d141" id="d141"></a>

* Legacy applications with server-side sessions
* Shopping cart implementations storing data locally
* Applications where session migration is expensive
* Systems where consistency is more important than perfect distribution

#### When NOT to Use It <a href="#id-67a9" id="id-67a9"></a>

* Stateless microservices architectures
* Applications using distributed session storage (Redis, Memcached)
* High-availability requirements

### 3. Weighted Round Robin <a href="#e711" id="e711"></a>

#### What is Weighted Round Robin? <a href="#id-20d0" id="id-20d0"></a>

Weighted Round Robin assigns a weight to each server based on its capacity. Servers with higher weights receive proportionally more requests. This is ideal when your servers have different processing capabilities.

#### How It Works (Step-by-Step) <a href="#b040" id="b040"></a>

1. Each server is assigned a weight (e.g., Server A: 3, Server B: 2, Server C: 1)
2. Requests are distributed proportionally to weights
3. In one cycle: A gets 3 requests, B gets 2, C gets 1
4. The cycle repeats

#### Real-World Analogy <a href="#id-9d4a" id="id-9d4a"></a>

Consider a restaurant with different-sized tables. A large table (weight 4) can seat more guests than a small table (weight 1). The host assigns guests based on table capacity, not equally.

#### Technical Example <a href="#id-5fb5" id="id-5fb5"></a>

Servers: A (weight: 3), B (weight: 2), C (weight: 1)

Request Assigned Server Running Total 1 A A:1, B:0, C:0 2 A A:2, B:0, C:0 3 A A:3, B:0, C:0 4 B A:3, B:1, C:0 5 B A:3, B:2, C:0 6 C A:3, B:2, C:1

After 6 requests: A handled 50%, B handled 33%, C handled 17%.

#### System Design Diagram <a href="#dedb" id="dedb"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*1l_0n_8HkSogZ4o633Tg_A.png" alt="" height="820" width="700"><figcaption><p>Weighted Round Robin Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#id-8e40" id="id-8e40"></a>

Pros Cons Accounts for server heterogeneity Requires manual weight configuration Better resource utilization Weights may become stale Simple to implement Still ignores real-time load

#### When to Use Weighted Round Robin <a href="#id-8418" id="id-8418"></a>

* Mixed hardware environments (old and new servers)
* Cloud deployments with different instance types
* Gradual rollouts (new version gets lower weight initially)
* When server capacity is known and relatively static

#### When NOT to Use It <a href="#id-08f0" id="id-08f0"></a>

* Homogeneous server environments (use simple Round Robin)
* Dynamic cloud environments with auto-scaling
* Systems requiring real-time load adaptation

### 4. IP/URL Hash Load Balancing <a href="#id-643c" id="id-643c"></a>

#### What is IP/URL Hash? <a href="#b28c" id="b28c"></a>

IP Hash uses a hash function on the client’s IP address to determine which server handles the request. This ensures the same client always reaches the same server without requiring session cookies.

#### How It Works (Step-by-Step) <a href="#f2f7" id="f2f7"></a>

1. Extract the client’s IP address from the request
2. Apply a hash function to the IP address
3. Use modulo operation to map hash to a server index
4. Route the request to that server

Formula: `server_index = hash(client_ip) % number_of_servers`

#### Real-World Analogy <a href="#id-0728" id="id-0728"></a>

Think of an apartment building where your apartment number determines which elevator bank you use. If you live in apartment 301–400, you always use elevator bank B. Your “address” (IP) determines your route.

#### Technical Example <a href="#daf7" id="daf7"></a>

Servers: A (index 0), B (index 1), C (index 2)

Client IP Hash Value Server Index Server 192.168.1.10 12847 12847 % 3 = 1 B 192.168.1.25 33291 33291 % 3 = 0 A 192.168.1.10 12847 12847 % 3 = 1 B 10.0.0.5 55123 55123 % 3 = 2 C

Notice that 192.168.1.10 always goes to Server B.

#### System Design Diagram <a href="#id-3340" id="id-3340"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*CjLEg1j02vnDeVwqAc6afA.png" alt="" height="772" width="700"><figcaption><p>IP/URL Hash Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#id-0713" id="id-0713"></a>

Pros Cons No session storage needed Poor distribution if IPs cluster Consistent routing per client Server changes redistribute many clients Works with any protocol NAT causes uneven distribution

#### When to Use IP/URL Hash <a href="#id-66da" id="id-66da"></a>

* Caching layers where cache locality matters
* Applications needing client consistency without cookies
* Gaming servers where reconnection to same server is important
* When clients shouldn’t use cookies

#### When NOT to Use It <a href="#id-2e74" id="id-2e74"></a>

* Mobile users (IP changes frequently)
* Corporate networks with NAT (many users share one IP)
* When server count changes frequently

### 5. Least Connections Load Balancing <a href="#aa79" id="aa79"></a>

#### What is Least Connections? <a href="#id-4d7b" id="id-4d7b"></a>

Least Connections routes each new request to the server with the fewest active connections. This algorithm considers the current load on each server, making it more dynamic than Round Robin.

#### How It Works (Step-by-Step) <a href="#debd" id="debd"></a>

1. The load balancer tracks active connections per server
2. When a new request arrives, check connection counts
3. Route to the server with the lowest count
4. Increment that server’s connection count
5. Decrement when connection closes

#### Real-World Analogy <a href="#id-0aec" id="id-0aec"></a>

Picture a grocery store with multiple checkout lanes. Smart shoppers look for the lane with the shortest line (fewest customers). The Least Connections algorithm does exactly this for servers.

#### Technical Example <a href="#id-547f" id="id-547f"></a>

Initial state: A (2 conn), B (3 conn), C (1 conn)



Request Connections Before Assigned Connections After 1 A:2, B:3, C:1 C A:2, B:3, C:2 2 A:2, B:3, C:2 A A:3, B:3, C:2 3 A:3, B:3, C:2 C A:3, B:3, C:3 4 A:3, B:3, C:3 A (tie) A:4, B:3, C:3

#### System Design Diagram <a href="#f52d" id="f52d"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*3VdaxSzKZIf7z_DJOl3BoQ.png" alt="" height="1002" width="700"><figcaption><p>Least Connections Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#id-8f1c" id="id-8f1c"></a>

Pros Cons Adapts to real-time server load Requires connection state tracking Better for long-lived connections More complex than Round Robin Handles varying request durations Connection count ≠ actual load

#### When to Use Least Connections <a href="#f754" id="f754"></a>

* WebSocket applications with long-lived connections
* Database connection pooling
* APIs with varying response times
* Video streaming servers

#### When NOT to Use It <a href="#id-7b97" id="id-7b97"></a>

* Short-lived HTTP requests (overhead not worth it)
* Homogeneous traffic patterns
* Simple stateless applications

### 6. Least Response Time Load Balancing <a href="#id-3706" id="id-3706"></a>

#### What is Least Response Time? <a href="#id-3929" id="id-3929"></a>

Least Response Time extends Least Connections by also considering server response time. It routes requests to the server with both the fewest connections AND the fastest response time, optimizing for user experience.

#### How It Works (Step-by-Step) <a href="#id-44b0" id="id-44b0"></a>

1. Track both active connections and average response time per server
2. Calculate a score: `score = connections × response_time`
3. Route to the server with the lowest score
4. Continuously update response time metrics

#### Real-World Analogy <a href="#id-55a1" id="id-55a1"></a>

When choosing a checkout lane, you don’t just count people, you also estimate how fast each cashier works. A lane with 3 people and a fast cashier might be quicker than a lane with 2 people and a slow cashier.

#### Technical Example <a href="#id-2d30" id="id-2d30"></a>

Server metrics:

* A: 3 connections, 50ms avg response
* B: 2 connections, 100ms avg response
* C: 4 connections, 30ms avg response

Scores:

* A: 3 × 50 = 150
* B: 2 × 100 = 200
* C: 4 × 30 = 120 ← Lowest score, gets the request

#### System Design Diagram <a href="#bf88" id="bf88"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*PQeUASI9UOou-odxbzQe4Q.png" alt="" height="1074" width="700"><figcaption><p>Least Response Time Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#id-4592" id="id-4592"></a>

Pros Cons Optimizes for actual user latency Most complex to implement Considers server performance Requires health check infrastructure Best for user experience May oscillate between servers

#### When to Use Least Response Time <a href="#id-8165" id="id-8165"></a>

* User-facing applications where latency matters
* Geographically distributed systems
* Mixed performance server pools
* Real-time applications (gaming, trading)

#### When NOT to Use It <a href="#a137" id="a137"></a>

* Internal services where latency isn’t critical
* Simple applications with consistent response times
* Systems with very short-lived connections

### 7. Consistent Hashing <a href="#id-803b" id="id-803b"></a>

#### What is Consistent Hashing? <a href="#id-5256" id="id-5256"></a>

Consistent Hashing is a distributed systems technique that minimizes redistribution when servers are added or removed. Instead of using modulo (like IP Hash), it places servers on a virtual ring and routes requests to the nearest server.

#### How It Works (Step-by-Step) <a href="#id-4834" id="id-4834"></a>

1. Create a virtual ring (hash space from 0 to ²³² — 1)
2. Hash each server name and place it on the ring
3. When a request arrives, hash the request key
4. Walk clockwise on the ring to find the nearest server
5. That server handles the request

#### Real-World Analogy <a href="#id-50aa" id="id-50aa"></a>

Think of a circular track with parking spots (servers) at various positions. When you arrive, you park at the first available spot clockwise from your position. If a spot is removed, only cars using that spot need to relocate — everyone else stays put.

#### Technical Example <a href="#fd59" id="fd59"></a>

Ring positions (0–100 for simplicity):

* Server A at position 20
* Server B at position 50
* Server C at position 80

Request Key Hash Position Nearest Server (Clockwise) “user123” 15 A (at 20) “order456” 25 B (at 50) “item789” 55 C (at 80) “cart101” 85 A (at 20, wraps around)

If Server B is removed, only requests in range 21–50 move to C. Others stay unchanged.

#### System Design Diagram <a href="#id-75ad" id="id-75ad"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*F9P_Q0WesZzMaJrjOzb-pA.png" alt="" height="646" width="700"><figcaption><p>Consistent Hashing Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#ec4e" id="ec4e"></a>

Pros Cons Minimal redistribution on changes More complex to implement Excellent for caching systems Requires virtual nodes for balance Scales well horizontally Harder to debug

#### When to Use Consistent Hashing <a href="#f708" id="f708"></a>

* Distributed caching systems (Memcached, Redis cluster)
* Content Delivery Networks (CDNs)
* Databases with sharding
* Any system where server count changes frequently

#### When NOT to Use It <a href="#id-5a00" id="id-5a00"></a>

* Small, static server pools
* Simple load balancing without key affinity needs
* Systems where full redistribution is acceptable

### 8. Adaptive Load Balancing <a href="#id-1893" id="id-1893"></a>

#### What is Adaptive Load Balancing? <a href="#id-763f" id="id-763f"></a>

Adaptive Load Balancing dynamically adjusts its strategy based on real-time metrics like CPU usage, memory, network bandwidth and error rates. It’s the most sophisticated approach, often combining multiple algorithms.

#### How It Works (Step-by-Step) <a href="#id-56a9" id="id-56a9"></a>

1. Continuously collect health metrics from all servers
2. Calculate a composite health score for each server
3. Adjust traffic weights based on scores
4. Route requests to healthiest servers
5. Adapt weights as conditions change

Health scores typically include CPU utilization, memory usage, error rate and response time.

#### Real-World Analogy <a href="#df5d" id="df5d"></a>

Think of a smart GPS navigation system. It doesn’t just know the distance — it considers current traffic, road conditions and construction, continuously rerouting based on real-time data.

#### Technical Example <a href="#a8dc" id="a8dc"></a>

Server health scores (0–100, higher is healthier):

Server CPU Memory Errors Resp Time Score A 40% 50% 0.1% 100ms 85 B 80% 70% 2% 300ms 45 C 30% 40% 0.5% 80ms 90

Traffic distribution: C gets 45%, A gets 42.5%, B gets 12.5%

#### System Design Diagram <a href="#id-6ac0" id="id-6ac0"></a>

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*pWDXF07isIvVrcchNMnYlA.png" alt="" height="700" width="700"><figcaption><p>Adaptive Load Balancing</p></figcaption></figure>

#### Pros and Cons <a href="#dc29" id="dc29"></a>

Pros Cons Best overall performance Most complex to implement Self-healing and adaptive Requires monitoring infrastructure Handles heterogeneous workloads Higher operational overhead

#### When to Use Adaptive Load Balancing <a href="#id-6325" id="id-6325"></a>

* Production systems requiring high availability
* Cloud-native applications with auto-scaling
* Systems with unpredictable traffic patterns
* Mission-critical applications

#### When NOT to Use It <a href="#d58d" id="d58d"></a>

* Simple applications with predictable loads
* Development/staging environments
* Small-scale deployments

### Comparison Table: All Load Balancing Algorithms <a href="#id-5478" id="id-5478"></a>

Algorithm Complexity Performance Scalability Session Support Best For Round Robin Low Good High No Stateless apps Sticky Round Robin Low Good Medium Yes Legacy apps Weighted Round Robin Low Good High No Mixed hardware IP/URL Hash Medium Good Medium Implicit Caching Least Connections Medium Better High No Long connections Least Response Time High Best High No User-facing apps Consistent Hashing High Good Excellent Implicit Distributed cache Adaptive Very High Best Excellent Configurable Production systems

### Which Load Balancing Algorithm Should You Choose? <a href="#id-855f" id="id-855f"></a>

### Decision Guide by Use Case <a href="#id-8994" id="id-8994"></a>

**Web Applications**: Start with Round Robin or Weighted Round Robin. Add sticky sessions for server-side sessions. Upgrade to Least Connections for varying response times.

**REST APIs**: Round Robin for simple cases. Least Response Time for latency-sensitive endpoints. Adaptive for production microservices.

**Microservices**: Round Robin or Least Connections as baseline. Consistent Hashing for service-to-service caching. Adaptive with circuit breakers for production.

**Caching Systems (Redis, Memcached)**: Consistent Hashing is the best choice — it minimizes cache invalidation when scaling.

**Global Systems**: Geo-based routing between regions, combined with Least Response Time within regions and Adaptive with latency-based routing for advanced setups.

### Load Balancing in Real-World Systems <a href="#a592" id="a592"></a>

Production systems rarely use a single algorithm. Here’s how companies combine strategies:

**Netflix**: Uses zone-aware load balancing, Weighted Round Robin for canary deployments and adaptive algorithms with circuit breakers.

**Amazon**: Implements Consistent Hashing for DynamoDB, Least Outstanding Requests and health-check-based adaptive routing.

**Google**: Employs Maglev (consistent hashing variant), weighted least request and location-aware routing.

### Hybrid Strategy Example <a href="#id-695b" id="id-695b"></a>

```
Global Traffic → DNS Geo-LB → Regional Adaptive LB → Least Connections LB → Servers
```

This layered approach provides geo-routing, health-awareness and connection-awareness at each level.

### Common Interview Questions <a href="#id-0a46" id="id-0a46"></a>

### 1. Why does Round Robin fail in real systems? <a href="#f540" id="f540"></a>

Round Robin assumes all servers and requests are equal. In reality, servers have different capacities, some requests take 10ms while others take 10 seconds and server health varies. A server could be overwhelmed with slow requests while Round Robin keeps sending more.

### 2. What’s the difference between Least Connections and Least Response Time? <a href="#id-722c" id="id-722c"></a>

**Least Connections** only counts active connections. **Least Response Time** considers both connection count and actual performance, routing to servers that will respond fastest.

### 3. Why is Consistent Hashing important? <a href="#id-193a" id="id-193a"></a>

With traditional hashing, adding a server (3→4 servers) redistributes \~75% of keys. With Consistent Hashing, only \~25% redistribute (1/n). This is critical for caching where redistribution means cache misses.

### 4. How do you handle a failing server? <a href="#id-52df" id="id-52df"></a>

Use health checks to detect failures, circuit breakers to stop traffic after X failures, graceful degradation to remove servers without dropping requests and adaptive algorithms to automatically reduce traffic to struggling servers.

### Conclusion: Key Takeaways <a href="#id-763a" id="id-763a"></a>

Load balancing is fundamental to building scalable, reliable systems. Remember:

1. **Start simple**: Round Robin works for many use cases. Don’t over-engineer.
2. **Match algorithm to requirements**: Stateless apps need different strategies than stateful ones.
3. **Consider the trade-offs**: More sophisticated algorithms mean more complexity.
4. **Combine strategies**: Real-world systems layer multiple algorithms.
5. **Monitor and adapt**: The best algorithm depends on your actual traffic patterns.

**Next Steps**: Experiment with NGINX, HAProxy, or cloud load balancers. Practice drawing system design diagrams. Build a simple load balancer to understand the mechanics firsthand.

_Have questions about load balancing or system design? Drop them in the comments below!_

[Load Balancing](https://medium.com/tag/load-balancing?source=post_page---footer_tags--6ef050c7add6---------------------------------------)[Distributed Systems](https://medium.com/tag/distributed-systems?source=post_page---footer_tags--6ef050c7add6---------------------------------------)[Algorithms](https://medium.com/tag/algorithms?source=post_page---footer_tags--6ef050c7add6---------------------------------------)[Software Engineering](https://medium.com/tag/software-engineering?source=post_page---footer_tags--6ef050c7add6---------------------------------------)[Api Gateway](https://medium.com/tag/api-gateway?source=post_page---footer_tags--6ef050c7add6---------------------------------------)[Written by TechEon](https://atul4u.medium.com/?source=post_page---post_author_info--6ef050c7add6---------------------------------------)[152 followers](https://atul4u.medium.com/followers?source=post_page---post_author_info--6ef050c7add6---------------------------------------)·[4 following](https://atul4u.medium.com/following?source=post_page---post_author_info--6ef050c7add6---------------------------------------)

With a strong passion for mentoring and continuous learning, I enjoy exploring emerging technologies and sharing insights in the era of technology evolution.

Follow[Help](https://help.medium.com/hc/en-us?source=post_page-----6ef050c7add6---------------------------------------)[Status](https://status.medium.com/?source=post_page-----6ef050c7add6---------------------------------------)[About](https://medium.com/about?autoplay=1\&source=post_page-----6ef050c7add6---------------------------------------)[Careers](https://medium.com/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----6ef050c7add6---------------------------------------)[Press](mailto:pressinquiries@medium.com)[Blog](https://blog.medium.com/?source=post_page-----6ef050c7add6---------------------------------------)[Store](https://medium.com/store)[Privacy](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----6ef050c7add6---------------------------------------)[Rules](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----6ef050c7add6---------------------------------------)[Terms](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----6ef050c7add6---------------------------------------)[Text to speech](https://speechify.com/medium?source=post_page-----6ef050c7add6---------------------------------------)

Repost to your network. A new and easy way to share your recommended stories with your followers.

Okay, got it

<br>

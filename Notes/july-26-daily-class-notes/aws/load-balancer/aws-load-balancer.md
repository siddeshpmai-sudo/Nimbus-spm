# AWS Load balancer

### Definition <a href="#fb20" id="fb20"></a>

**Load Balancing** is the process of **distributing incoming traffic evenly** across multiple servers (e.g., EC2 instances) to ensure:

* High availability
* Fault tolerance
* Better performance
* Scalability

In AWS, this is done using the **Elastic Load Balancer (ELB)** service.

### 🧠 Analogy <a href="#id-8d29" id="id-8d29"></a>

Imagine a call center with **three agents (EC2 instances)** and one **receptionist (Load Balancer)**.\
The receptionist sends each incoming call to the **least busy agent** — so no single agent gets overwhelmed.

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*dO12_2C6CMh5uugSB5NTXQ.png" alt="" height="337" width="700"><figcaption><p><strong>Fig1 : Analogy</strong></p></figcaption></figure>

### 🧩 How It Works <a href="#id-9d4d" id="id-9d4d"></a>

1. Users send requests (e.g., website hits, API calls).
2. The **Elastic Load Balancer** receives the requests.
3. It **distributes traffic** to multiple healthy **EC2 instances** behind it.
4. If one instance becomes unhealthy, ELB automatically **stops routing traffic** to it.

<figure><img src="https://miro.medium.com/v2/resize:fit:684/1*zj9IRSyrhEy9ET_R3uJLuA.png" alt="" height="576" width="684"><figcaption><p><strong>Fig2 :Load Balancer Workflow</strong></p></figcaption></figure>

### ⚖️ Why Use a Load Balancer (ELB)? <a href="#id-37f3" id="id-37f3"></a>

A **Load Balancer** improves **availability**, **security**, and **scalability** by intelligently routing traffic across multiple EC2 instances or targets.

#### 1️⃣ Distribute Workload Evenly <a href="#id-00ad" id="id-00ad"></a>

* **Spread load across multiple downstream instances**\
  → Prevents overloading one server and ensures better response time.\
  ✅ Example: 4 EC2 instances behind one ALB handle 4× more requests efficiently.

#### 2️⃣ Single Point of Access (DNS Entry) <a href="#id-3cfc" id="id-3cfc"></a>

* The ELB provides a **single DNS name** (e.g., `myapp-123.elb.amazonaws.com`)\
  → Users always connect through this endpoint, regardless of backend instance changes.\
  ✅ Simplifies management and failover.

#### 3️⃣ High Availability <a href="#ba13" id="ba13"></a>

* **Multi-AZ Load Balancers** ensure **uptime even if one AZ fails**.\
  → Traffic automatically shifts to healthy targets in another AZ.

#### 4️⃣ Fault Tolerance via Health Checks <a href="#id-4803" id="id-4803"></a>

* Performs **regular health checks** on downstream EC2 instances.\
  → Automatically removes unhealthy targets until they recover.

#### 5️⃣ Security & HTTPS Offloading <a href="#id-1584" id="id-1584"></a>

* **SSL/TLS termination** at the Load Balancer level (HTTPS support).\
  → Frees backend servers from the CPU-intensive SSL decryption workload.\
  ✅ Easier certificate management (ACM integration).

#### 6️⃣ Session Stickiness <a href="#bcbc" id="bcbc"></a>

* Can **enforce stickiness with cookies** — routes a user’s requests to the same backend instance.\
  → Useful for **stateful applications** (e.g., shopping carts, user sessions).

#### 7️⃣ Traffic Segregation <a href="#d595" id="d595"></a>

* Can **separate public vs private traffic**\
  → Example: Public ALB for web users, internal NLB for backend microservice calls.

<figure><img src="https://miro.medium.com/v2/resize:fit:608/1*Ohi6NoBglQFASG64KcsAvQ.png" alt="" height="1073" width="608"><figcaption><p><strong>Fig3: Benefits of using Load Balancer</strong></p></figcaption></figure>

### **AWS Load Balancer Types** <a href="#eb56" id="eb56"></a>

#### **1. Application Load Balancer (ALB)** <a href="#b4a6" id="b4a6"></a>

* **Layer:** Operates at Layer 7 of the OSI model, the application layer.
* **Use Case:** Ideal for routing HTTP and HTTPS traffic to web applications and microservices. It supports advanced routing rules based on content, hostnames, and paths.
* **Details:** ALBs are designed for modern application architectures, providing features like content-based routing, support for containerized applications, and integration with AWS services like AWS Certificate Manager (ACM) for SSL/TLS termination. They are highly scalable and can handle complex routing scenarios.

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*nLJJbtcyc02bSAapg4qhHQ.png" alt="" height="540" width="700"><figcaption><p><strong>Fig4: Application Load Balancer</strong></p></figcaption></figure>

#### **2. Network Load Balancer (NLB)** <a href="#id-340e" id="id-340e"></a>

* **Layer:** Operates at Layer 4 of the OSI model, the transport layer.
* **Use Case:** Best suited for high-performance applications that require low latency and can handle TCP and UDP traffic.
* **Details:** NLBs are designed to handle millions of requests per second while maintaining ultra-low latencies. They are ideal for applications like gaming, VoIP, and IoT where performance is critical. NLBs support static IP addresses per Availability Zone and can handle sudden traffic spikes.

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*8IInGWRrVolEsUyypFCkkw.png" alt="" height="648" width="700"><figcaption><p><strong>Fig5: Network Load Balancer</strong></p></figcaption></figure>

#### **3. Gateway Load Balancer (GWLB)** <a href="#id-3e51" id="id-3e51"></a>

* **Layer:** Operates at Layer 3 of the OSI model, the network layer.
* **Use Case:** Designed for deploying and managing network appliances such as firewalls, intrusion detection and prevention systems (IDS/IPS), and deep packet inspection (DPI) systems.
* **Details:** GWLBs simplify the deployment of third-party network appliances by providing a single entry point for traffic. They support GENEVE encapsulation and can handle high volumes of traffic while maintaining security and compliance. GWLBs are particularly useful in environments where network security is paramount.

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*LQ_S5joWLIBWJXP0EwdaBA.png" alt="" height="530" width="700"><figcaption><p><strong>Fig5:Gateway Load Balancer</strong></p></figcaption></figure>

#### **4. Classic Load Balancer (CLB)** <a href="#a9c4" id="a9c4"></a>

* **Layer:** Considered a legacy load balancer type.
* **Use Case:** Primarily used in older EC2 environments. It is recommended to migrate to ALBs or NLBs for new designs.
* **Details:** CLBs support both Layer 4 and Layer 7 traffic but lack the advanced features and performance of ALBs and NLBs. They are less flexible and scalable compared to the newer load balancer types. AWS recommends migrating from CLBs to ALBs or NLBs to take advantage of the latest features and improvements.

<figure><img src="https://miro.medium.com/v2/resize:fit:602/1*-0btXojU67RrEpnsTGNf7A.png" alt="" height="530" width="602"><figcaption><p><strong>Fig6 : Migrate to new Load Balancer for Enhanced Performance</strong></p></figcaption></figure>

**Conclusion:**



Choosing the right AWS Load Balancer type is crucial for optimizing application performance, scalability, and security. ALBs are ideal for web applications and microservices, NLBs for high-performance TCP/UDP applications, GWLBs for network appliances, and CLBs are best avoided for new deployments. By understanding the OSI layer and use case of each load balancer, architects and developers can make informed decisions that align with their specific requirements.

Thanks for reading!\
If you found this article helpful, consider leaving a 👏 clap, 💬 comment, or 🔔 follow — it really helps others discover it too!

🚀 Follow me for more hands-on content on AWS, Cloud Architecture, and Java backend development.

🔜 Coming in Part 2: Real-Time AWS Architecture Scenarios\
👉 We’ll dive into Auto Scaling, Cross-AZ load balancing, and how ELBs integrate with EC2, ECS, and Route 53 in production setups.

📬 Hit “Follow” to get notified the moment it’s live — packed with practical visuals and architecture insights you can apply right away.

✍️ Written by \*\*Sreenivasulu Urimindi\*\*\
📌 Java | AWS | Cloud & Backend Engineer | OCAJP Certified

1

[Written by Usreenivasulu](https://medium.com/@usreenivasulu47?source=post_page---post_author_info--30016f3e9347---------------------------------------)[30 followers](https://medium.com/@usreenivasulu47/followers?source=post_page---post_author_info--30016f3e9347---------------------------------------)·[501 following](https://medium.com/@usreenivasulu47/following?source=post_page---post_author_info--30016f3e9347---------------------------------------)

Full‑Stack Java Developer specializing in Spring Boot, Microservices & Cloud‑Native Architecture • Oracle OCAJP & AWS SAA‑C03 Certified

Follow

### No responses yet



<img src="https://miro.medium.com/v2/resize:fill:32:32/0*GlYOg9oFMcnml2BU" alt="Nimbuswiztech" height="32" width="32">

Nimbuswiztech

﻿<br>

CancelRespond[Help](https://help.medium.com/hc/en-us?source=post_page-----30016f3e9347---------------------------------------)[Status](https://status.medium.com/?source=post_page-----30016f3e9347---------------------------------------)[About](https://medium.com/about?autoplay=1\&source=post_page-----30016f3e9347---------------------------------------)[Careers](https://medium.com/jobs-at-medium/work-at-medium-959d1a85284e?source=post_page-----30016f3e9347---------------------------------------)[Press](mailto:pressinquiries@medium.com)[Blog](https://blog.medium.com/?source=post_page-----30016f3e9347---------------------------------------)[Store](https://medium.com/store)[Privacy](https://policy.medium.com/medium-privacy-policy-f03bf92035c9?source=post_page-----30016f3e9347---------------------------------------)[Rules](https://policy.medium.com/medium-rules-30e5502c4eb4?source=post_page-----30016f3e9347---------------------------------------)[Terms](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f?source=post_page-----30016f3e9347---------------------------------------)[Text to speech](https://speechify.com/medium?source=post_page-----30016f3e9347---------------------------------------)

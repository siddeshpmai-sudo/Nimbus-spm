# aws clb vs alb routing

## 1. Classic Load Balancer (CLB)

With a Classic Load Balancer, you do **not** configure path-based or host-based routing rules.

The basic flow is:

```
Client
   |
   v
Classic Load Balancer
   |
   |---> EC2-1
   |---> EC2-2
   |---> EC2-3
```

You configure the backend instances under the **Instances** section of the Classic Load Balancer.

### CLB Configuration

You typically configure:

* Listener → `HTTP :80 → HTTP :80`
* Health checks
* Registered EC2 instances
* Connection settings

### What CLB Does Not Support

CLB does not provide modern Layer 7 routing such as:

```
/app  → Java application servers
/api  → API servers
```

or:

```
example.com     → Application A
api.example.com → Application B
```

***

## 2. Application Load Balancer (ALB)

With an Application Load Balancer, routing is configured through **Listener Rules**.

The architecture is:

```
Client
   |
   v
ALB
   |
Listener :80
   |
   +----------------------+
   | Listener Rules       |
   |                      |
   | /app/*  → App-TG     |
   | /api/*  → API-TG     |
   +----------------------+
          |          |
          v          v
       App-TG      API-TG
       / | \        / | \
      EC1 EC2 EC3  EC4 EC5 EC6
```

## Where do we configure ALB routing?

In the AWS Console:

```
EC2
 └── Load Balancers
      └── Your ALB
           └── Listeners
                └── HTTP :80
                     └── Listener rules
```

The **Listener Rules** determine where the incoming request should go.

***

## 3. Path-Based Routing

Example:

```
IF Path is /app/*
THEN Forward to App-TG
```

And:

```
IF Path is /api/*
THEN Forward to API-TG
```

Architecture:

```
                  ALB
                   |
              Listener :80
                   |
          +--------+--------+
          |                 |
       /app/*            /api/*
          |                 |
          v                 v
       App-TG             API-TG
       / | \              / | \
      EC1 EC2 EC3        EC4 EC5 EC6
```

### Example Requests

```
http://example.com/app
```

goes to:

```
App-TG
```

While:

```
http://example.com/api
```

goes to:

```
API-TG
```

***

## 4. Host-Based Routing

ALB can also route traffic based on the hostname.

Example:

```
IF Host header is www.example.com
THEN Forward to Web-TG
```

And:

```
IF Host header is api.example.com
THEN Forward to API-TG
```

Architecture:

```
                       ALB
                        |
                  Listener :80
                        |
              +---------+---------+
              |                   |
      www.example.com       api.example.com
              |                   |
              v                   v
           Web-TG              API-TG
          /  |  \             /  |  \
        EC1 EC2 EC3          EC4 EC5 EC6
```

***

## 5. Target Groups and Routing

A Target Group is a logical collection of backend targets.

For example:

```
App-TG
 ├── EC2-1
 ├── EC2-2
 └── EC2-3
```

and:

```
API-TG
 ├── EC2-4
 ├── EC2-5
 └── EC2-6
```

The ALB listener rule decides **which Target Group** receives the request.

The Target Group then distributes the request among its healthy targets.

***

## 6. Complete ALB Request Flow

The most important flow to remember is:

```
Client
   |
   v
ALB
   |
   v
Listener
   |
   v
Listener Rule
   |
   v
Target Group
   |
   v
Healthy Target
   |
   v
Application
```

Or simply:

```
ALB
 ↓
Listener
 ↓
Rule
 ↓
Target Group
 ↓
EC2 / IP / Lambda
```

***

## 7. CLB vs ALB

| Feature                     | CLB                          | ALB           |
| --------------------------- | ---------------------------- | ------------- |
| Listener                    | Yes                          | Yes           |
| Health checks               | Yes                          | Yes           |
| Backend configuration       | Registered EC2 instances     | Target Groups |
| Path-based routing          | ❌ No                         | ✅ Yes         |
| Host-based routing          | ❌ No                         | ✅ Yes         |
| Listener rules              | Basic listener configuration | ✅ Yes         |
| Multiple target groups      | ❌                            | ✅             |
| Layer 7 routing             | Limited/legacy               | ✅             |
| Modern microservice routing | ❌                            | ✅             |

***

## 8. Interview Answer

If an interviewer asks:

**"Where do you configure routing in CLB and ALB?"**

> In Classic Load Balancer, we mainly configure listeners, health checks, and registered EC2 instances. It does not support modern path-based or host-based routing rules.
>
> In Application Load Balancer, routing is configured under the **Listener Rules**. We define conditions such as path or host headers and then forward the request to the appropriate **Target Group**.
>
> For example, `/app/*` can go to the App Target Group and `/api/*` can go to the API Target Group.

***

## 9. Easy Way to Remember

{% columns %}
{% column %}
### CLB

```
CLB
 ↓
Registered EC2 Instances
```
{% endcolumn %}

{% column %}
### ALB

```
ALB
 ↓
Listener
 ↓
Listener Rule
 ↓
Target Group
 ↓
Targets
```
{% endcolumn %}
{% endcolumns %}

{% hint style="info" %}
**Key point:** **In ALB, the routing mechanism is configured in the Listener Rules.**
{% endhint %}

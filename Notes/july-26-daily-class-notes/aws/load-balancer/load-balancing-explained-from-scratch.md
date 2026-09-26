# Load Balancing Explained From Scratch

<figure><img src="https://miro.medium.com/v2/resize:fit:700/1*eM_ob0DBrK9-fBFUZKuudQ.png" alt="" height="1050" width="700"><figcaption></figcaption></figure>

### The problem, before the jargon <a href="#a5c7" id="a5c7"></a>

Imagine you open a small sandwich shop. On day one, you have one person behind the counter. Ten customers walk in over the whole day. Easy. Your one worker handles everyone with time to spare.

Now imagine your shop goes viral. A famous food blogger raves about your sandwiches. Suddenly **five hundred** people show up at lunchtime.

Your one worker panics. The line stretches out the door. People wait forty minutes. Some give up and leave. A few angry customers post bad reviews. Your worker, overwhelmed, makes mistakes and burns out.

What went wrong? You had way more demand than a single worker could handle.

The fix is obvious in the real world: **hire more workers and put someone at the door to send each customer to whichever worker is free.**

That “someone at the door” — the person who looks at the line, sees which workers are busy, and directs each customer to the best available one — is doing exactly what a **load balancer** does on the internet.

That’s the whole idea. Everything else in this guide is just details. And I promise: they’re all learnable. Let’s build up from the ground.

### First, the ground rules: servers, clients, requests, and responses <a href="#b07d" id="b07d"></a>

Before we can talk about balancing anything, we need to agree on a few basic words. I’ll define each one plainly, and I’ll reuse these definitions throughout, so don’t worry about memorizing them.

**A server** is just a computer whose job is to _serve_ things to other computers. When you open a website, some computer somewhere is sending you the page. That computer is a server. It’s not magic — it’s a regular (usually powerful) computer sitting in a building, plugged into the internet, running all day.

> _Think of a server as a worker behind a counter. Its whole job is to take orders and fill them._

**A client** is the device _asking_ for something. Your laptop, your phone, your smart TV — when they ask a server for a web page, they are acting as clients.

> _The client is the customer walking up to the counter._

**A request** is the message a client sends to ask for something. “Please send me the homepage.” “Please log me in.” “Please show me my shopping cart.” Each of these is a request.

> _A request is the customer’s order: “One turkey sandwich, please.”_

**A response** is what the server sends back. The web page, the login confirmation, the shopping cart contents — those are responses.

> _A response is the finished sandwich handed back over the counter._

So the basic rhythm of the internet is this simple loop:

```
CLIENT  ---- request ---->  SERVER
CLIENT  <--- response ----  SERVER
```

You (client) ask for something (request). A computer (server) sends it back (response). That’s it. Billions of times a second, all over the world, this same tiny handshake plays out.

Now, one more word you’ll hear constantly:

**Traffic** simply means the flow of all these requests. When lots of clients send lots of requests, we say there’s “a lot of traffic.” It’s the same way we talk about cars on a highway. More cars = more traffic. More requests = more traffic.

Keep that picture in your head — a highway full of requests flowing toward your servers — because managing that flow is what this whole guide is about.

### So what is a load balancer, really? <a href="#id-943e" id="id-943e"></a>

Here’s the plain-English definition:

> _**A load balancer is a traffic director that sits in front of a group of servers and spreads incoming requests across them, so no single server gets overwhelmed.**_

Go back to the sandwich shop. You hired more workers. But if customers just wandered up to random workers, you’d still have chaos — one worker might get mobbed while another stands idle. So you put a host at the door. The host watches everyone, and for each new customer says: _“You, go to counter 3. You, counter 1. You, counter 2.”_

The load balancer is that host. The workers are your servers. The customers are the requests.

Let’s draw it:

```
┌──────────► Server 1
                        │
CLIENTS ──requests──► LOAD ─────────► Server 2
                     BALANCER
                        │
                        └──────────► Server 3
```

Every request comes in through one front door (the load balancer). The load balancer decides which server should handle it. Then it forwards the request there.

Notice something important: **the client has no idea any of this is happening.** From your phone’s point of view, it just asked one address for a web page and got one back. It never sees the three servers hiding behind the load balancer. That invisibility is a feature, not an accident. We’ll come back to it.

### Why load balancing actually matters <a href="#id-824d" id="id-824d"></a>

You might be thinking, “Okay, spreading out work is nice. But is it really that big a deal?” Yes — and here’s why, in four concrete benefits. I’ll define each fancy word as it shows up.

### 1. High availability <a href="#id-4bef" id="id-4bef"></a>

**Availability** means “the service is up and working when people try to use it.” **High availability** just means it stays up almost all the time, even when things go wrong.

Say you have only one server and it crashes at 2 a.m. Your entire website goes dark. Every visitor sees an error. You lose customers and money while you scramble to fix it.

Now say you have three servers behind a load balancer. One crashes. The load balancer notices, stops sending requests to the dead one, and quietly routes everyone to the two healthy servers. Most visitors never even notice. That’s high availability — the system survives failures.

> _One worker calls in sick. The host just stops sending customers to that empty counter. The shop keeps running._

### 2. Scalability <a href="#id-3aef" id="id-3aef"></a>

**Scalability** is the ability to handle _more_ work by adding _more_ resources.

When your traffic doubles, you don’t need a single, impossibly powerful super-server. You just add more ordinary servers behind the load balancer, and it starts sending traffic to them too. Need to handle a holiday rush? Add ten servers. Rush over? Remove them.

> _Lunch rush hits. You add three more workers. The host starts sending customers to them. Rush ends. You send those workers home._

This kind of growth — adding more machines side by side — is called **horizontal scaling**. (“Horizontal” because you’re widening your row of servers, not making one server taller and stronger.) Load balancers are what make horizontal scaling practical.

### 3. Performance <a href="#id-5fd1" id="id-5fd1"></a>

**Performance** here means speed — how fast users get their responses.

When work is spread evenly, no single server is drowning. Each request gets handled quickly instead of waiting in a giant backlog. Faster responses mean happier users.

> _Five workers sharing the line move it far faster than one worker doing everything._

### 4. Fault tolerance <a href="#bbf2" id="bbf2"></a>

**Fault tolerance** means the system keeps working _even when parts of it fail._ This is closely related to high availability, but the emphasis is on isolation: one broken piece doesn’t break the whole.

Because your servers are independent, a problem on server 2 doesn’t infect servers 1 and 3. The failure is contained.

> _If one counter’s cash register jams, the other counters keep serving. The jam is isolated._

Put these together and you get the reason load balancing sits at the heart of nearly every serious website, app, and online service on Earth. It’s the invisible hero behind every fast, reliable app you use.

### How your request even finds a server: meet DNS <a href="#id-1842" id="id-1842"></a>

We’ve been drawing arrows from clients to load balancers as if the client just _knows_ where to send its request. But how does your phone actually find the right computer out of the billions online?

To answer that, we need two more terms, then a phone book.

### IP addresses: the internet’s street numbers <a href="#a533" id="a533"></a>

**An IP address** is a unique number that identifies a computer on the internet. (“IP” stands for Internet Protocol, but you can ignore that.) It looks like this:

```
142.250.190.78
```

Every server on the internet has one. It’s like a street address for a house. If you know the exact address, you can send mail (requests) straight there.

> _An IP address is the precise street address of a building: 142 Elm Street._

The problem? Numbers like `142.250.190.78` are impossible for humans to remember. Nobody types a string of digits to visit their favorite website.

### Domain names: the human-friendly labels <a href="#b252" id="b252"></a>

**A domain name** is the easy-to-read name we actually type, like `google.com` or `netflix.com`. It's a friendly label that stands in for an ugly IP address.

> _A domain name is the_ name _of a place — “Joe’s Pizza” — instead of its raw street coordinates._

But computers don’t route traffic using friendly names. They need the actual number. So something has to translate `google.com` into `142.250.190.78`. That something is DNS.

### DNS: the internet’s phone book <a href="#id-4833" id="id-4833"></a>

**DNS** stands for **Domain Name System.** In plain terms:

> _**DNS is a giant, distributed phone book for the internet. You give it a domain name, and it gives you back the matching IP address.**_

Old phone books mapped a person’s _name_ to their _phone number._ DNS maps a website’s _name_ to its _IP address._ Same idea.

The act of looking up that number is called **DNS resolution** — we say the name “resolves to” an address. “Resolve” here just means “figure out the final answer.” When you hear “the domain resolves to this IP,” it means “when you look up this name, here’s the number you get back.”

### DNS resolution, step by step <a href="#e97b" id="e97b"></a>

Let’s walk through exactly what happens the instant you type `www.example.com` and hit Enter. I'll keep it concrete. There are a few players, so I'll introduce each with a plain description.

Here are the characters in our little play:

* **Your device (the client):** wants the IP address for [`www.example.com`](http://www.example.com/)[.](http://www.example.com/)
* **The resolver:** a helper service (usually run by your internet provider or a company like Google or Cloudflare) whose job is to do the lookup legwork for you. Think of it as a receptionist who makes phone calls on your behalf.
* **The root servers:** the top-level directory that knows where to find the directories for `.com`, `.org`, `.net`, and so on. Think of the master index at the front of a library.
* **The TLD servers:** “TLD” means **Top-Level Domain** — the last chunk of a name, like `.com`. These servers know where to find info for every `.com` domain. Think of the `.com` shelf in the library.
* **The authoritative server:** the specific server that holds the real, final answer for `example.com`. It's the actual owner of the record. Think of the exact book on the shelf with the number written inside.

Now the flow:

```
1. You type www.example.com
```

```
2. Your device asks the RESOLVER:
   "What's the IP for www.example.com?"3. Resolver asks a ROOT server:
   "Where do I find .com names?"
   Root replies: "Ask the .com TLD servers, here's where."4. Resolver asks the .COM TLD server:
   "Where do I find example.com?"
   TLD replies: "Ask example.com's authoritative server, here's where."5. Resolver asks the AUTHORITATIVE server:
   "What's the IP for www.example.com?"
   It replies: "142.250.190.78"6. Resolver hands that IP back to your device.7. Your device now sends its actual request to 142.250.190.78.
```

That looks like a lot of steps, but it happens in a fraction of a second. And here’s a kindness built into the system: **caching.**

**Caching** means temporarily saving an answer so you don’t have to look it up again. After the resolver finds the IP once, it remembers it for a while. So the next thousand people who visit `example.com` get the answer instantly, no library trip required.

> _The receptionist writes the number on a sticky note. Next time someone asks, she just reads the sticky note instead of making all those calls again._

**Here’s the punchline that connects DNS back to load balancing:** the IP address that DNS hands back is very often _not_ a single server. It’s the address of your **load balancer.** So the moment your request arrives, the load balancer is already there at the front door, ready to direct traffic.

### The full journey of a single request <a href="#f8d6" id="f8d6"></a>

Let’s zoom out and trace one complete trip, start to finish, using everything we’ve defined. This is the mental model to lock in.

```
┌─────────┐
   │  YOU    │  (the client — your phone or laptop)
   └────┬────┘
        │  1. "I want www.example.com"
        ▼
   ┌─────────┐
   │   DNS   │  2. Looks up the name, returns an IP address
   └────┬────┘     (which points to the load balancer)
        │
        │  3. Your request travels to that IP
        ▼
   ┌──────────────┐
   │ LOAD BALANCER│  4. Picks a healthy server to handle you
   └──────┬───────┘
          │
   ┌──────┴───────┬──────────────┐
   ▼              ▼              ▼
┌────────┐   ┌────────┐   ┌────────┐
│Server 1│   │Server 2│   │Server 3│   5. Chosen server does the work
└────┬───┘   └────────┘   └────────┘
     │
     │  6. Response travels back the same way
     ▼
   ┌─────────┐
   │  YOU    │   7. You see the web page. Done.
   └─────────┘
```

Let’s narrate it in words:

1. You ask for [`www.example.com`](http://www.example.com/)[.](http://www.example.com/)
2. DNS resolves that name to an IP address — the load balancer’s address.
3. Your request travels to the load balancer.
4. The load balancer picks a healthy server (we’ll see _how_ it picks in a moment).
5. That server does the work and creates a response.
6. The response travels back through the load balancer to you.
7. You see the page. The entire dance took a blink.

Every popular website you use runs some version of this. Now let’s open the black box and see how the load balancer decides _which_ server gets your request.

### Load balancing algorithms: the rules for choosing a server <a href="#id-2da9" id="id-2da9"></a>

An **algorithm** is just a fancy word for **a set of rules for making a decision.** A recipe is an algorithm. Long division is an algorithm. Here, a load balancing algorithm is simply the rule the load balancer follows when it picks which server handles the next request.

Different situations call for different rules. Let’s go through the common ones, each with its own analogy. There’s no math to fear here — just plain logic.

### Round robin <a href="#id-05f4" id="id-05f4"></a>

**Round robin** means: hand out requests to servers _in order, one after another, then loop back to the start._

Server 1, then Server 2, then Server 3, then back to Server 1, then Server 2, and so on. Round and round it goes — hence “round robin.”

```
Request 1 ──► Server 1
Request 2 ──► Server 2
Request 3 ──► Server 3
Request 4 ──► Server 1   (loops back around)
Request 5 ──► Server 2
```

> _It’s like dealing cards. One to each player, around the table, over and over. Perfectly fair and even._

Round robin is simple and works great when all your servers are roughly equal in power and all requests are roughly equal in size.

### Weighted round robin <a href="#id-0414" id="id-0414"></a>

**Weighted round robin** is round robin with a twist: you give each server a **weight** — a number that says how much traffic it should get relative to the others. Stronger servers get bigger weights and therefore more requests.

Say Server A is a beefy machine and Server B is a small one. You might give A a weight of 3 and B a weight of 1. Now for every four requests, A handles three and B handles one.

```
Weights:  Server A = 3,  Server B = 1
```

```
A, A, A, B,  A, A, A, B,  A, A, A, B ...
```

> _Imagine dealing cards, but your strongest player gets three cards each round while the rookie gets one. You’re matching the load to each player’s ability._

Use this when your servers aren’t all the same size.

### Least connections <a href="#id-1158" id="id-1158"></a>

**A connection** is an open line between a client and a server for the duration of their conversation. Some requests are quick (a tiny image). Others hang around a long time (a big file download, a live video stream). So counting requests alone can be misleading — one server might have finished its requests while another is still juggling several long ones.



**Least connections** fixes this by sending each new request to whichever server currently has the _fewest_ open connections — in other words, the server that’s least busy _right now._

```
Server 1: 8 open connections
Server 2: 3 open connections   ◄── new request goes here (fewest)
Server 3: 5 open connections
```

> _The host at the door glances at each counter and sends the next customer to whichever worker has the shortest line, not just “whoever’s turn it is.”_

This is smarter than plain round robin when requests vary a lot in how long they take.

### Least response time <a href="#id-9fc2" id="id-9fc2"></a>

**Response time** is how long a server takes to answer. **Least response time** sends the next request to the server that is both lightly loaded _and_ answering fastest right now.

> _You don’t just pick the counter with the shortest line — you pick the one that’s_ also _moving quickest. A short line with a slow worker isn’t actually faster._

This squeezes out extra speed when some servers are temporarily sluggish.

### IP hash (and “sticky” sessions) <a href="#id-7042" id="id-7042"></a>

Sometimes you _want_ the same user to keep landing on the same server. Why? Because that server might be holding onto information about them — what’s in their shopping cart, whether they’re logged in, and so on. If they bounce to a different server mid-visit, that memory might be lost.

**IP hash** solves this. Remember, every client has an IP address. This algorithm runs that IP address through a **hash** — a math function that turns any input into a fixed number — and uses the result to _always_ pick the same server for that same IP.

```
Client with IP 203.0.113.5  ──► (hash) ──► always Server 2
Client with IP 198.51.100.9 ──► (hash) ──► always Server 1
```

Because the same IP always produces the same number, the same user always “sticks” to the same server. That’s why this behavior is nicknamed **sticky sessions.** A **session** just means one continuous visit — from when you arrive until you leave.

> _It’s like being assigned a personal waiter for your whole meal. Every time you need something, the same waiter who already knows your order comes back. No re-explaining._

### Consistent hashing (a quick mention) <a href="#f752" id="f752"></a>

You may bump into **consistent hashing** in bigger systems. It’s a cleverer cousin of IP hash designed so that when you add or remove a server, only a _small_ number of users get reassigned instead of reshuffling everyone. You don’t need the details today — just know it exists and it’s about minimizing disruption when your fleet of servers changes size.

### Which algorithm should you use? <a href="#cace" id="cace"></a>

A quick cheat sheet:

* **Round robin** — simple, even, great when servers and requests are similar.
* **Weighted round robin** — when some servers are more powerful than others.
* **Least connections** — when requests vary a lot in length.
* **Least response time** — when you want maximum speed and servers vary in how fast they respond.
* **IP hash / sticky sessions** — when a user must stay on the same server across their visit.

Most of the time, you’ll start with round robin or least connections and only reach for the others when you have a specific reason. Don’t overthink it.

### Layer 4 vs Layer 7: two “levels” a load balancer can work at <a href="#id-948f" id="id-948f"></a>

Here’s a distinction you’ll see everywhere, and it sounds scarier than it is. Load balancers come in two flavors based on _how much of your request they look at_ before deciding where to send it.

To make sense of this, picture your request as a letter in an envelope:

* The **envelope** has the delivery address on the outside — basically “which computer, which port.” (A **port** is like an apartment number at a building’s address; it says _which program_ on the server should get the message. Web traffic usually uses port 80 or 443.)
* The **letter inside** has the actual content — “I want the `/products` page," "I'm sending this login form," and so on.

### Layer 4 load balancing (the transport layer) <a href="#id-9d40" id="id-9d40"></a>

**Layer 4** load balancing looks only at the _envelope_ — the IP addresses and ports. It doesn’t open the letter. It just sees “traffic headed to this address and port” and forwards it to a server. Fast and simple, because it doesn’t stop to read anything.

> _Think of a postal sorter who routes mail purely by the address on the outside, without ever reading a single word inside. Blazing fast, but it can’t make decisions based on_ content.

Use Layer 4 when you want raw speed and don’t need to route based on what’s _in_ the request. It handles enormous volumes of connections with very little overhead.

### Layer 7 load balancing (the application layer) <a href="#d674" id="d674"></a>

**Layer 7** load balancing _opens the letter and reads it._ It can see the exact page being requested, the type of content, cookies, headers (extra bits of info attached to a request), and more. That lets it make smart decisions.

For example, it can send every request that starts with `/videos` to your video servers, and every request starting with `/images` to your image servers — all based on reading the content.

> _Think of a smart receptionist who reads each letter and routes it to exactly the right department: complaints here, orders there, questions over there._

Layer 7 is a little slower than Layer 4 because reading takes a beat, but it’s far more flexible. It can also handle security and encryption tasks (coming up next). Most modern web apps use Layer 7 load balancing because that flexibility is worth it.

**Quick rule of thumb:**

* **Layer 4** = routes by _address and port_ only. Fast, simple, content-blind.
* **Layer 7** = routes by _actual content_. Smart, flexible, slightly slower.

There are also two other labels you’ll see, and they’re simpler than they sound:

* **External (or public) load balancer** — faces the open internet and handles requests from the general public.
* **Internal (or private) load balancer** — sits inside your own private network and balances traffic _between_ your own services, hidden from the outside world.

### Health checks: how the load balancer knows a server is alive <a href="#id-8a6f" id="id-8a6f"></a>

I keep saying the load balancer sends traffic to _healthy_ servers. But how does it know which ones are healthy?

Through **health checks.**

**A health check** is a small, repeated test the load balancer runs against each server to confirm it’s still working. Every few seconds, the load balancer basically knocks on each server’s door and asks, “You okay in there?”

```
LOAD BALANCER ──"you okay?"──► Server 1  ✅ "Yes!"      (keep sending traffic)
LOAD BALANCER ──"you okay?"──► Server 2  ❌ (no answer) (stop sending traffic)
LOAD BALANCER ──"you okay?"──► Server 3  ✅ "Yes!"      (keep sending traffic)
```

If a server answers correctly, great — it stays in rotation. If it fails to answer (it crashed, froze, or got overwhelmed), the load balancer **removes it from rotation** and stops sending it traffic. Users get routed only to the healthy servers, and most never notice anything went wrong.

When the sick server recovers and starts passing health checks again, the load balancer quietly puts it back into rotation. No human needs to intervene.

> _The host at the door keeps an eye on each counter. If a worker suddenly vanishes, the host stops sending customers there. When the worker returns, the host resumes sending people over. Smooth and automatic._

Health checks are the single most important reason load balancing gives you high availability. Without them, the load balancer would blindly keep shoving traffic at dead servers.

### One related idea: connection draining <a href="#id-38e0" id="id-38e0"></a>

When you _deliberately_ take a server offline — say, to update its software — you don’t want to yank it away mid-conversation and drop everyone’s requests. **Connection draining** (sometimes called “connection termination”) handles this gracefully: the load balancer stops sending _new_ requests to that server but lets its _existing_ conversations finish first. Once the server is idle, it’s safely removed.

> _When a worker’s shift ends, the host stops sending them new customers but lets them finish helping the person already at their counter. Nobody gets abandoned mid-order._

### Bonus powers: the extra jobs load balancers take on <a href="#id-9ce2" id="id-9ce2"></a>

Modern load balancers do more than just spread traffic. Here are the common extras, each defined plainly.

### SSL / TLS termination <a href="#d3bb" id="d3bb"></a>

When you visit a secure site, your connection is **encrypted** — scrambled so nobody snooping on the network can read it. (That’s what the little padlock in your browser means.) The technology that does this scrambling is called **SSL**, or its newer version, **TLS.** You don’t need the difference; just know they mean “the encryption that protects your data in transit.”

Encrypting and decrypting takes computing effort. **SSL/TLS termination** means the _load balancer_ handles that decryption at the front door, then passes the now-readable request to the servers. This frees your servers from the heavy encryption work so they can focus on the actual application.

> _Think of a mailroom that opens and verifies all the sealed security envelopes at the building entrance, so individual offices don’t each need their own decoder._

### Sticky sessions <a href="#id-5e09" id="id-5e09"></a>

We met these under IP hash. To restate: **sticky sessions** keep a given user glued to the same server throughout their visit, so any information that server is holding about them (login state, cart contents) isn’t lost. Useful, though modern apps often store that info in a shared place instead so they don’t _need_ stickiness.

### High availability of the load balancer itself <a href="#id-6c22" id="id-6c22"></a>

Wait — if everything flows through one load balancer, isn’t the load balancer itself a single point of failure? Great instinct. The answer: in real systems, you run _multiple_ load balancers, usually spread across different physical locations (called **availability zones** — separate data-center buildings, so one flood or power outage can’t take them all down at once). If one load balancer dies, another takes over. The front door itself is made redundant.

### Working with auto scaling <a href="#id-574a" id="id-574a"></a>

**Auto scaling** means automatically adding servers when traffic rises and removing them when it falls — no human needed. Pair it with a load balancer, and your system breathes with demand: servers spin up during a rush, the load balancer starts using them, and when the rush fades, the extras disappear and you stop paying for them.

> _The shop automatically calls in extra workers when the line gets long and sends them home when it’s quiet — and the host instantly knows to include or exclude them._

### Common load balancing tools and services <a href="#id-970e" id="id-970e"></a>

Now that you understand _what_ load balancers do, here’s _what people actually use_ to get them. You don’t need to learn all of these — just recognize the names when you see them.

### Software you run yourself <a href="#id-02f9" id="id-02f9"></a>

* **NGINX** (pronounced “engine-x”) — a hugely popular free web server that also works as a load balancer. Many companies put NGINX in front of their servers to distribute traffic.
* **HAProxy** — another well-loved free, high-performance load balancer, famous for handling massive traffic reliably. The name literally means “High Availability Proxy.” (A **proxy** is a middleman that sits between clients and servers and passes messages along — which is exactly what a load balancer is.)
* **Traefik** and **Envoy** — modern load balancers popular in setups that use lots of small services.

### Managed cloud services (someone else runs it for you) <a href="#d66c" id="d66c"></a>

If you don’t want to manage the software yourself, cloud providers offer load balancing as a service. You click a few buttons and they handle the machinery.

**Amazon Web Services (AWS)** offers:

* **Application Load Balancer (ALB)** — a _Layer 7_ balancer for HTTP/HTTPS traffic (the web). Great for websites, apps, and microservices because it can route by content.
* **Network Load Balancer (NLB)** — a _Layer 4_ balancer built for extreme speed and volume (millions of requests per second). Great for gaming, streaming, and other high-performance needs.
* **Gateway Load Balancer (GWLB)** — a specialized balancer for routing traffic through security appliances like firewalls.
* **Classic Load Balancer (CLB)** — the old original, now being retired in favor of ALB and NLB.

**Google Cloud Platform (GCP)** offers a similar lineup:

* **Global HTTP(S) Load Balancer** — a _Layer 7_ balancer that can spread web traffic across the entire globe.
* **TCP/SSL Proxy Load Balancer** — a _Layer 4_ balancer for non-web protocols.
* **Internal load balancers** — for balancing traffic _inside_ your private network rather than from the public internet.

**Microsoft Azure** and others have their own equivalents (Azure Load Balancer, Application Gateway, and so on). The names differ; the concepts you just learned are identical everywhere.

Here’s a small comparison to anchor the two big clouds side by side:

What you want AWS GCP Web traffic, smart routing (Layer 7) Application Load Balancer Global HTTP(S) LB Raw speed, high volume (Layer 4) Network Load Balancer TCP/SSL Proxy LB Internal-only traffic Internal NLB Internal TCP/UDP or HTTP(S) LB

The takeaway: **the concepts are universal.** Learn load balancing once, and you can work with any of these tools. They’re all different brand-name versions of the same host-at-the-door idea.

### Real-world examples of load balancing in action <a href="#id-3f74" id="id-3f74"></a>

Let’s ground all this theory in things you actually use.

**A streaming service (think Netflix-style video).** Millions of people press play at 8 p.m. That’s a tidal wave of traffic. Load balancers spread those requests across huge fleets of servers so your show starts instantly instead of buffering forever. When one server hiccups, health checks pull it out and you never see a glitch.

**An online store on Black Friday.** Traffic explodes for one day, then returns to normal. Auto scaling adds hundreds of servers for the rush; the load balancer immediately starts routing shoppers to them. Sticky sessions (or shared storage) keep everyone’s cart intact even as traffic bounces around. After the sale, the extra servers vanish and the store stops paying for them.

**A ride-hailing or food-delivery app.** Your phone constantly pings the app’s servers for driver locations and order updates. Least-connections load balancing keeps each server from getting swamped, so the map stays smooth and live.

**A bank’s website.** Reliability and security are everything. Multiple load balancers across multiple data centers mean the site stays up even if an entire building loses power. SSL/TLS termination keeps your data encrypted end to end.

**AI and machine-learning apps** (a fast-growing example). When thousands of people query an AI model at once, load balancers spread those requests across many powerful servers, often keeping long-running conversations flowing smoothly and pulling in extra capacity as demand spikes. The exact same principles you learned above — spreading load, health checks, autoscaling, sticky sessions for ongoing chats — apply directly.

In every one of these cases, you, the user, see one simple thing: a fast app that just works. The load balancer, doing its quiet job behind the scenes, is the reason.

### Putting it all together <a href="#b323" id="b323"></a>

Let’s tie the whole story into one clean thread, using everything we defined:

1. **Clients** (your devices) send **requests** to get things from **servers** (computers that serve stuff). The flow of all these requests is **traffic**.
2. To find a server, your device asks **DNS** — the internet’s phone book — to **resolve** a friendly **domain name** into a numeric **IP address**.
3. That IP address usually points to a **load balancer** — the traffic director standing at the front door.
4. The load balancer uses an **algorithm** (a decision rule) — like **round robin**, **least connections**, or **IP hash** — to pick which server handles your request.
5. It only picks **healthy** servers, which it monitors with constant **health checks**, quietly removing broken ones and re-adding recovered ones.
6. Depending on whether it’s a **Layer 4** (address-only, fast) or **Layer 7** (content-aware, smart) load balancer, it may also handle jobs like **SSL/TLS termination** and content-based routing.
7. Paired with **auto scaling**, the whole system grows and shrinks with demand automatically.

The result of all this is the four benefits we started with: **high availability, scalability, performance, and fault tolerance.** A system that stays up, grows gracefully, runs fast, and shrugs off failures.

And it all traces back to that one humble idea from the sandwich shop: _when demand grows, add more workers and put someone smart at the door to direct the crowd._

### Where to go next <a href="#id-2845" id="id-2845"></a>

You now understand load balancing better than most people who’ve been building websites for years. Seriously — this is a concept many engineers only half-grasp. Give yourself credit.

If you want to keep going, here are natural next steps, roughly in order of difficulty:

* **Get hands-on with NGINX.** Install it on your own computer, put it in front of two tiny test servers, and watch it round-robin between them. Nothing cements the idea like seeing it work with your own eyes.
* **Spin up a free-tier cloud load balancer.** AWS, GCP, and Azure all have free tiers. Create an Application Load Balancer, attach a couple of small servers, and watch traffic flow.
* **Learn about DNS more deeply.** You met the basics here. Topics like DNS records (A records, CNAME records) and time-to-live (how long an answer is cached) are logical follow-ups.
* **Explore health checks and auto scaling in practice.** Configure a health check, then deliberately crash a server and watch the load balancer route around it. It’s genuinely satisfying.
* **Read about “reverse proxies” and API gateways.** These are close relatives of load balancers, and understanding one makes the others click.

Take it one small experiment at a time. Every expert you admire started exactly where you are right now — reading a guide, meeting these words for the first time, and thinking, _“Okay, I think I actually get this.”_

You do. Now go build something that scales.

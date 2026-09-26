# docker\_evolution\_visual

How application deployment evolved, and why containers changed DevOps.

{% hint style="info" %}
Interactive classroom visual
{% endhint %}

## The deployment problem

Deploying only application code often fails because the application also depends on its environment.

{% columns %}
{% column %}
### Developer environment

```bash
$ npm start
✓ App running
✓ Node 22
✓ Library versions match
```

“It works on my machine!”
{% endcolumn %}

{% column %}
### Production environment

```bash
$ npm start
✕ Missing library
✕ Node 20
✕ Different config
```

Application failure
{% endcolumn %}
{% endcolumns %}

Different OS\
Runtime versions\
Libraries\
Configuration\
Environment variables\
Database version

**Application + dependencies + runtime + configuration + operating system = application environment**

{% stepper %}
{% step %}
## Physical server

### One machine runs applications directly

Application

Libraries / Runtime

Operating system

CPU / RAM / Storage

Physical hardware

One physical machine runs applications directly on its operating system.

Server 1: App A\
Server 2: App B\
Server 3: App C

**3 applications → 3 physical servers**

* Expensive hardware
* Low utilization
* App conflicts
* Slow provisioning
* Manual setup
* Maintenance overhead
{% endstep %}

{% step %}
## Virtual machines

### Virtualization improves hardware utilization

A hypervisor lets one physical server host multiple independent virtual machines.

### Physical server

Dedicated machine per workload

App A

Operating system

Hardware

Low density. Hardware can sit idle.

### Virtual machines

App 1\
Libraries\
Guest OS

App 2\
Libraries\
Guest OS

App 3\
Libraries\
Guest OS

Hypervisor

### What VMs solved

* Better hardware utilization
* Isolation
* Multiple OS choices
* Easier provisioning

But every VM carries a guest OS.

Better than physical servers, but still heavy: three VMs mean three guest operating systems consuming memory, storage and startup time.
{% endstep %}

{% step %}
## Containers

### Lightweight application isolation

A container packages an application and its dependencies while sharing the host operating-system kernel.

**Container 1**

Application\
Dependencies

**Container 2**

Application\
Dependencies

**Container 3**

Application\
Dependencies

Container runtime

Host OS kernel

Physical server

Containers remove much of the overhead of running a complete guest operating system for every application.
{% endstep %}
{% endstepper %}

## Can we isolate applications without carrying a complete OS for each one?

{% columns %}
{% column %}
### Physical server

✕ Expensive

✕ Poor utilization

✕ Difficult scaling
{% endcolumn %}

{% column %}
### Virtual machines

✓ Better utilization

✓ Isolation

✕ Guest OS overhead

✕ More memory and slower startup
{% endcolumn %}
{% endcolumns %}

## So where does Docker come in?

Docker is a platform and tooling ecosystem that makes it easier to build, package, distribute and run containers.

{% tabs %}
{% tab title="Physical server architecture" %}
Application

Operating system

Hardware
{% endtab %}

{% tab title="VM architecture" %}
**VM 1**

App\
Libraries\
Guest OS

**VM 2**

App\
Libraries\
Guest OS

**VM 3**

App\
Libraries\
Guest OS

Hypervisor → Hardware
{% endtab %}

{% tab title="Container architecture" %}
**Container 1**

App\
Dependencies

**Container 2**

App\
Dependencies

**Container 3**

App\
Dependencies

Docker Engine / container runtime → Host OS kernel → Hardware
{% endtab %}
{% endtabs %}

Developer → Dockerfile → `docker build` → Docker image → Registry → `docker run` → Container

Docker did not invent containers. It made container-based workflows accessible and popular, with tooling for images, networking, storage and registries.

## Problems become portable, repeatable workflows

| Problem                             | Docker solution                  |
| ----------------------------------- | -------------------------------- |
| Different environments              | Containerized application        |
| Dependency conflicts                | Reproducible environment         |
| Manual installation                 | Portable image                   |
| Environment drift                   | Automated builds and testing     |
| Slow testing and difficult rollback | Versioned artifacts for rollback |

**Problem → Docker → consistency + portability + repeatability**

## What Docker solves

Hover or discuss each pairing. The goal is not memorizing commands; it is understanding the workflow.

| Problem                       | Docker approach                                   |
| ----------------------------- | ------------------------------------------------- |
| **“Works on my machine”**     | Docker packages dependencies into an image.       |
| **Dependency conflicts**      | Apps run in isolated containers.                  |
| **Manual environment setup**  | A Dockerfile defines the environment as code.     |
| **Inconsistent testing**      | CI can run the same containerized environment.    |
| **Deployment differences**    | Build a versioned image and deploy that artifact. |
| **Slow application setup**    | Pull image → run container.                       |
| **Difficult rollback**        | Deploy a previous image version.                  |
| **Microservice dependencies** | Package services independently.                   |

## Environment setup becomes code

{% tabs %}
{% tab title="Before Docker" %}
* Install Java
* Install Node
* Install Python
* Install Nginx
* Configure versions and database
* Fix conflicts

“It works on my machine”
{% endtab %}

{% tab title="With Docker" %}
Git clone

Docker build

Docker image

Docker run

Application
{% endtab %}
{% endtabs %}

## One image flows through delivery

Docker fits between source code and the environments that run the approved artifact.

Developer → Git push → CI pipeline → Docker build → Automated tests → Security scan → Registry → Staging → Production

### Web applications

Frontend, backend and API can share a repeatable stack.

### Microservices

Independent services package and release separately.

### CI/CD

Build, test and package in one consistent environment.

### Cloud deployment

The same image travels across compatible environments.

### Developer environments

New teammates start predictable dependencies.

### Automated testing

Disposable environments make tests safer to repeat.

### Data processing

Isolated workers run focused jobs.

### Scaling

Run multiple copies of the same service.

## Physical server vs VM vs container

| Feature        | Physical server       | VM                 | Container           |
| -------------- | --------------------- | ------------------ | ------------------- |
| Hardware       | Dedicated             | Shared             | Shared              |
| OS             | One per server        | One per VM         | Shared host kernel  |
| Startup        | Minutes               | Minutes            | Seconds             |
| Resource usage | High                  | Higher             | Lower               |
| Portability    | Low                   | Medium             | High                |
| Density        | Low                   | Medium             | High                |
| Best for       | Traditional workloads | OS-level isolation | Modern applications |

## House, apartment building, shipping container

### Physical server = individual house

One house for one family. Dedicated resources.

### VM = apartment building

Many independent apartments in one building, each with its own facilities.

### Container = shipping container

A standard package that moves predictably between ships, trains and trucks.

## Do containers include an operating system?

Containers normally include user-space files and libraries, but not a complete guest operating-system kernel like a VM. They share the host kernel.

{% tabs %}
{% tab title="Virtual machine" %}
App

Libraries

Guest OS

Hypervisor

Host hardware
{% endtab %}

{% tab title="Container" %}
App

Libraries

Docker runtime

Host OS kernel

Host hardware
{% endtab %}
{% endtabs %}

## Six benefits to remember

### 1. Repeatability

Same image, same environment.

### 2. Automation

Environment defined as code.

### 3. Portability

Laptop → CI → cloud.

### 4. Speed

Fast container startup.

### 5. Scalability

Run multiple instances.

### 6. Collaboration

Developers and operations use the same artifact.

## Ask the class

<details>

<summary>Why can’t we just install everything directly on the server?</summary>

You can, but repeated manual setup causes configuration drift, version conflicts and hard-to-reproduce environments.

</details>

<details>

<summary>What does a VM need that a container normally does not?</summary>

A VM includes its own guest operating system and kernel.

</details>

<details>

<summary>What does Docker package?</summary>

An image packages the application plus its dependencies and configuration defaults.

</details>

<details>

<summary>Why is docker build important?</summary>

It turns the Dockerfile and build context into a reusable, versionable image.

</details>

## The big picture

**Developer**\
↓\
**Dockerfile**\
↓\
**Docker build**\
↓\
**Docker image**\
↓\
**Container registry**\
↓

Dev / test\
Staging\
Production

↓\
**Docker containers**

## Final takeaway

## Physical servers gave us hardware. VMs gave us virtualization. Containers gave us lightweight application isolation.

Docker made container workflows practical for modern development and DevOps.

**Build once. Test once. Deploy the same artifact.**

# EC2 Instance Types

## 1. What Are EC2 Instance Types?

An **EC2 Instance Type** defines the **hardware configuration** of the virtual server. It determines:

* **vCPUs** – Number of virtual CPUs
* **Memory (RAM)** – Amount of RAM
* **Storage** – Type and amount of storage
* **Network Performance** – Bandwidth available
* **Processor** – Intel, AMD, or AWS Graviton (ARM)

### Simple Analogy for Students

```
Instance Type = Choosing the right computer for the job

Need to write documents?      → Small laptop (t2.micro)
Need to edit videos?          → Powerful workstation (c5.4xlarge)
Need to run databases?        → High-memory server (r5.2xlarge)
Need GPU for ML training?     → GPU machine (p3.2xlarge)
```

## 2. Instance Type Naming Convention

Every instance type follows this naming pattern:

```
    m  5  a  .  2xlarge
    │  │  │     │
    │  │  │     └── Size (nano, micro, small, medium, large, xlarge, 2xlarge, ...)
    │  │  │
    │  │  └── Additional Attribute (a=AMD, g=Graviton, n=Network, d=local storage)
    │  │
    │  └── Generation (higher = newer, better)
    │
    └── Family (m=General, c=Compute, r=Memory, etc.)
```

### Breakdown Examples

| Instance Type | Family        | Generation | Attribute     | Size    |
| ------------- | ------------- | ---------- | ------------- | ------- |
| `t2.micro`    | t (Burstable) | 2nd gen    | —             | micro   |
| `t3.medium`   | t (Burstable) | 3rd gen    | —             | medium  |
| `m5.large`    | m (General)   | 5th gen    | —             | large   |
| `m5a.xlarge`  | m (General)   | 5th gen    | AMD           | xlarge  |
| `m7g.2xlarge` | m (General)   | 7th gen    | Graviton      | 2xlarge |
| `c5.4xlarge`  | c (Compute)   | 5th gen    | —             | 4xlarge |
| `c5n.xlarge`  | c (Compute)   | 5th gen    | Network       | xlarge  |
| `r5.8xlarge`  | r (Memory)    | 5th gen    | —             | 8xlarge |
| `r6gd.xlarge` | r (Memory)    | 6th gen    | Graviton+disk | xlarge  |
| `p3.2xlarge`  | p (GPU)       | 3rd gen    | —             | 2xlarge |
| `i3.large`    | i (Storage)   | 3rd gen    | —             | large   |

### Additional Attributes

| Suffix   | Meaning                                            |
| -------- | -------------------------------------------------- |
| **a**    | AMD processors (often cheaper than Intel)          |
| **g**    | AWS Graviton (ARM-based, best price-performance)   |
| **n**    | Enhanced networking / higher bandwidth             |
| **d**    | Local NVMe instance store (temporary fast storage) |
| **e**    | Extra storage or memory                            |
| **z**    | High frequency (high single-core performance)      |
| **flex** | Flexible instance (combines different sizes)       |

### Size Progression

```
nano → micro → small → medium → large → xlarge → 2xlarge → ... → metal

Each step roughly DOUBLES the resources:

t3.micro:    2 vCPU,   1 GB RAM
t3.small:    2 vCPU,   2 GB RAM
t3.medium:   2 vCPU,   4 GB RAM
t3.large:    2 vCPU,   8 GB RAM
t3.xlarge:   4 vCPU,  16 GB RAM
t3.2xlarge:  8 vCPU,  32 GB RAM
```

## 3. Instance Families – Complete Overview

| Family  | Category                         | Best For                      | Key Feature                 |
| ------- | -------------------------------- | ----------------------------- | --------------------------- |
| **T**   | General Purpose (Burstable)      | Dev/test, small apps          | CPU credits / burst         |
| **M**   | General Purpose (Balanced)       | Enterprise apps, mid-size DBs | Balanced compute/memory     |
| **C**   | Compute Optimized                | HPC, batch, gaming            | Highest CPU performance     |
| **R**   | Memory Optimized                 | Large DBs, in-memory cache    | High memory-to-CPU ratio    |
| **X**   | Memory Optimized (Extreme)       | SAP HANA, very large DBs      | Massive memory (up to 4 TB) |
| **I**   | Storage Optimized                | NoSQL DBs, data warehousing   | High sequential I/O         |
| **D**   | Storage Optimized (Dense)        | MapReduce, HDFS, data lakes   | Very high disk throughput   |
| **H**   | Storage Optimized (HDD)          | Hadoop, log processing        | High throughput HDD         |
| **P**   | Accelerated Computing (GPU)      | ML training, deep learning    | NVIDIA GPUs                 |
| **G**   | Accelerated Computing (Graphics) | Video rendering, gaming       | Graphics GPUs               |
| **Inf** | Machine Learning Inference       | ML inference at scale         | AWS Inferentia chips        |
| **Trn** | Machine Learning Training        | Large-scale ML training       | AWS Trainium chips          |
| **F**   | FPGA                             | Hardware acceleration         | FPGAs                       |
| **Mac** | macOS                            | iOS/macOS app builds          | Apple Mac mini hardware     |

## 4. General Purpose Instances (T, M)

### T Family – Burstable Performance

The **T family** uses a **CPU credit system** that allows instances to burst above baseline performance.

#### How CPU Credits Work

```
Baseline Performance (e.g., t2.micro = 10% CPU)
     │
     │  ──── CPU is IDLE ──── Credits ACCUMULATE
     │
     │  ──── CPU is BUSY ──── Credits are SPENT
     │
     │  ──── Credits = 0 ──── Performance drops to BASELINE
     │
     └── Unless "Unlimited" mode is enabled (charged for extra usage)
```

#### T2 vs T3

| Feature            | T2                         | T3                               |
| ------------------ | -------------------------- | -------------------------------- |
| **Credit Mode**    | Standard (credits deplete) | Unlimited (default)              |
| **Processor**      | Intel Xeon                 | Intel Xeon (newer)               |
| **Network**        | Moderate                   | Better                           |
| **Free Tier**      | ✅ t2.micro                 | ❌ (but t3.micro in some regions) |
| **Recommendation** | Learning/testing           | Production burstable workloads   |

#### Common T Instance Sizes

| Instance    | vCPU | Memory | Baseline CPU | Use Case              |
| ----------- | ---- | ------ | ------------ | --------------------- |
| `t2.nano`   | 1    | 0.5 GB | 5%           | Tiny test instances   |
| `t2.micro`  | 1    | 1 GB   | 10%          | Free Tier, learning ✅ |
| `t2.small`  | 1    | 2 GB   | 20%          | Small web apps        |
| `t2.medium` | 2    | 4 GB   | 40%          | Dev/test environments |
| `t2.large`  | 2    | 8 GB   | 60%          | Small production apps |
| `t3.micro`  | 2    | 1 GB   | 10%          | Better than t2.micro  |
| `t3.medium` | 2    | 4 GB   | 20%          | Jenkins, small apps   |
| `t3.large`  | 2    | 8 GB   | 30%          | Medium workloads      |
| `t3.xlarge` | 4    | 16 GB  | 40%          | Larger applications   |

{% hint style="info" %}
**t2.micro** is the go-to for Free Tier learning. **t3.medium** is great for small production workloads.
{% endhint %}

### M Family – Balanced / General Purpose

The **M family** provides a **fixed, consistent** balance of compute, memory, and networking.

| Instance     | vCPU | Memory | Network         | Use Case                       |
| ------------ | ---- | ------ | --------------- | ------------------------------ |
| `m5.large`   | 2    | 8 GB   | Up to 10 Gbps   | Small app servers              |
| `m5.xlarge`  | 4    | 16 GB  | Up to 10 Gbps   | Medium workloads               |
| `m5.2xlarge` | 8    | 32 GB  | Up to 10 Gbps   | Enterprise applications        |
| `m5.4xlarge` | 16   | 64 GB  | Up to 10 Gbps   | Large databases                |
| `m6i.large`  | 2    | 8 GB   | Up to 12.5 Gbps | 6th gen Intel                  |
| `m7g.large`  | 2    | 8 GB   | Up to 12.5 Gbps | 7th gen Graviton (best value!) |

**Use Cases:**

* Enterprise applications
* Mid-size databases
* Caching servers
* Backend servers
* Development environments

{% hint style="info" %}
**m7g (Graviton)** instances offer the **best price-performance** in the general purpose category.
{% endhint %}

## 5. Compute Optimized Instances (C)

The **C family** is designed for **CPU-intensive workloads** that need high-performance processors.

| Instance     | vCPU | Memory  | Network         | Use Case                  |
| ------------ | ---- | ------- | --------------- | ------------------------- |
| `c5.large`   | 2    | 4 GB    | Up to 10 Gbps   | Batch processing          |
| `c5.xlarge`  | 4    | 8 GB    | Up to 10 Gbps   | HPC                       |
| `c5.2xlarge` | 8    | 16 GB   | Up to 10 Gbps   | Scientific modeling       |
| `c5.4xlarge` | 16   | 32 GB   | Up to 10 Gbps   | Video encoding            |
| `c5n.xlarge` | 4    | 10.5 GB | Up to 25 Gbps   | Network-intensive compute |
| `c7g.large`  | 2    | 4 GB    | Up to 12.5 Gbps | Graviton compute          |

**Key Characteristic:** **High CPU-to-memory ratio** (2:1 CPU:RAM compared to M's 1:4)

**Use Cases:**

* Batch processing
* Scientific computing
* Machine learning inference
* Gaming servers
* Video encoding/transcoding
* High-performance web servers
* Ad serving

## 6. Memory Optimized Instances (R, X)

### R Family – Memory Optimized

Designed for workloads that need to **process large data sets in memory**.

| Instance     | vCPU | Memory | Network       | Use Case             |
| ------------ | ---- | ------ | ------------- | -------------------- |
| `r5.large`   | 2    | 16 GB  | Up to 10 Gbps | In-memory DBs        |
| `r5.xlarge`  | 4    | 32 GB  | Up to 10 Gbps | Redis/Memcached      |
| `r5.2xlarge` | 8    | 64 GB  | Up to 10 Gbps | Large relational DBs |
| `r5.4xlarge` | 16   | 128 GB | Up to 10 Gbps | Real-time analytics  |
| `r6g.large`  | 2    | 16 GB  | Up to 10 Gbps | Graviton memory      |

**Key Characteristic:** **High memory-to-CPU ratio** (1:8 CPU:RAM)

**Use Cases:**

* High-performance relational databases (MySQL, PostgreSQL)
* In-memory databases (Redis, Memcached, ElastiCache)
* Real-time big data analytics
* Apache Spark
* SAP applications

### X Family – Extreme Memory

| Instance         | vCPU | Memory            | Use Case                 |
| ---------------- | ---- | ----------------- | ------------------------ |
| `x1.16xlarge`    | 64   | 976 GB (\~1 TB)   | SAP HANA                 |
| `x1.32xlarge`    | 128  | 1,952 GB (\~2 TB) | Large SAP HANA           |
| `x2idn.32xlarge` | 128  | 2,048 GB (2 TB)   | Very large in-memory DBs |

{% hint style="info" %}
These are for **extremely memory-intensive** workloads like SAP HANA.
{% endhint %}

## 7. Storage Optimized Instances (I, D, H)

### I Family – High I/O (NVMe SSD)

| Instance     | vCPU | Memory   | Storage           | Use Case           |
| ------------ | ---- | -------- | ----------------- | ------------------ |
| `i3.large`   | 2    | 15.25 GB | 1 x 475 GB NVMe   | NoSQL databases    |
| `i3.xlarge`  | 4    | 30.5 GB  | 1 x 950 GB NVMe   | MongoDB, Cassandra |
| `i3.2xlarge` | 8    | 61 GB    | 1 x 1,900 GB NVMe | Elasticsearch      |

**Use Cases:**

* NoSQL databases (MongoDB, Cassandra, DynamoDB local)
* Elasticsearch / OpenSearch
* Data warehousing (Redshift)
* High-frequency OLTP systems

### D Family – Dense Storage (HDD)

| Instance     | vCPU | Memory  | Storage       | Use Case    |
| ------------ | ---- | ------- | ------------- | ----------- |
| `d2.xlarge`  | 4    | 30.5 GB | 3 x 2 TB HDD  | MapReduce   |
| `d2.2xlarge` | 8    | 61 GB   | 6 x 2 TB HDD  | Hadoop HDFS |
| `d2.8xlarge` | 36   | 244 GB  | 24 x 2 TB HDD | Data lakes  |

**Use Cases:**

* MapReduce / Hadoop
* Distributed file systems (HDFS)
* Data lake storage
* Log processing

## 8. Accelerated Computing (GPU) Instances (P, G, Inf, Trn)

### P Family – GPU Compute (ML Training)

| Instance       | vCPU | Memory   | GPU            | Use Case          |
| -------------- | ---- | -------- | -------------- | ----------------- |
| `p3.2xlarge`   | 8    | 61 GB    | 1x NVIDIA V100 | ML training       |
| `p3.8xlarge`   | 32   | 244 GB   | 4x NVIDIA V100 | Large-scale ML    |
| `p4d.24xlarge` | 96   | 1,152 GB | 8x NVIDIA A100 | Deep learning     |
| `p5.48xlarge`  | 192  | 2,048 GB | 8x NVIDIA H100 | Largest ML models |

### G Family – Graphics / Video

| Instance      | vCPU | Memory | GPU            | Use Case            |
| ------------- | ---- | ------ | -------------- | ------------------- |
| `g4dn.xlarge` | 4    | 16 GB  | 1x NVIDIA T4   | ML inference, video |
| `g5.xlarge`   | 4    | 16 GB  | 1x NVIDIA A10G | Graphics rendering  |

### Inf / Trn Family – AWS Custom Chips

| Instance       | Chip            | Use Case              |
| -------------- | --------------- | --------------------- |
| `inf1.xlarge`  | AWS Inferentia  | ML inference          |
| `inf2.xlarge`  | AWS Inferentia2 | Large model inference |
| `trn1.2xlarge` | AWS Trainium    | ML model training     |

## 9. Choosing the Right Instance Type – Decision Guide

```
What is your workload?
     │
     ├── General web application?
     │    ├── Low/intermittent traffic → t3.micro / t3.small (Burstable)
     │    └── Steady traffic → m5.large / m7g.large (General Purpose)
     │
     ├── CPU-intensive processing?
     │    └── c5.xlarge / c7g.xlarge (Compute Optimized)
     │
     ├── Large database?
     │    ├── Moderate → m5.xlarge (General Purpose)
     │    └── Memory-heavy → r5.xlarge / r6g.xlarge (Memory Optimized)
     │
     ├── In-memory cache (Redis/Memcached)?
     │    └── r5.large / r6g.large (Memory Optimized)
     │
     ├── Machine Learning training?
     │    └── p3.2xlarge / p4d.24xlarge (GPU)
     │
     ├── High I/O database (MongoDB, Cassandra)?
     │    └── i3.xlarge (Storage Optimized)
     │
     ├── Big Data / Hadoop?
     │    └── d2.xlarge / h1.2xlarge (Dense Storage)
     │
     └── Learning / Free Tier?
          └── t2.micro ✅
```

## 10. Instance Types for DevOps Use Cases

| DevOps Use Case             | Recommended Instance        | Reason                  |
| --------------------------- | --------------------------- | ----------------------- |
| **Jenkins Server**          | `t3.medium` (2 vCPU, 4 GB)  | Bursty build workloads  |
| **Jenkins Build Agent**     | `c5.large` (2 vCPU, 4 GB)   | CPU-intensive builds    |
| **Docker Host**             | `m5.large` (2 vCPU, 8 GB)   | Balanced for containers |
| **Kubernetes Node**         | `m5.xlarge` (4 vCPU, 16 GB) | Run multiple pods       |
| **SonarQube**               | `t3.large` (2 vCPU, 8 GB)   | Memory for analysis     |
| **Nexus/Artifactory**       | `m5.large` (2 vCPU, 8 GB)   | Storage-heavy           |
| **Monitoring (Prometheus)** | `r5.large` (2 vCPU, 16 GB)  | Memory for time-series  |
| **ELK Stack**               | `r5.xlarge` (4 vCPU, 32 GB) | Memory + I/O            |
| **Tomcat Application**      | `t3.medium` (2 vCPU, 4 GB)  | Java web apps           |
| **MySQL/PostgreSQL**        | `r5.large` (2 vCPU, 16 GB)  | Memory for DB cache     |
| **Learning/Testing**        | `t2.micro` (1 vCPU, 1 GB)   | Free Tier ✅             |

## 11. AWS Graviton – Best Price-Performance

**AWS Graviton** processors are ARM-based chips designed by AWS. They offer:

* **Up to 40% better price-performance** vs Intel/AMD
* Lower power consumption
* Available in most instance families (suffix `g`)

| Intel/AMD   | Graviton Equivalent | Savings          |
| ----------- | ------------------- | ---------------- |
| `m5.large`  | `m7g.large`         | \~20-40% cheaper |
| `c5.xlarge` | `c7g.xlarge`        | \~20-40% cheaper |
| `r5.large`  | `r7g.large`         | \~20-40% cheaper |
| `t3.medium` | `t4g.medium`        | \~20% cheaper    |

{% hint style="info" %}
**Always consider Graviton instances** if your application supports ARM/Linux.
{% endhint %}

## 12. How to Check Instance Type Info

### From AWS CLI

```bash
# List all instance types
aws ec2 describe-instance-types --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]' --output table

# Get specific instance type details
aws ec2 describe-instance-types --instance-types t2.micro --output json

# Filter by family
aws ec2 describe-instance-types --filters "Name=instance-type,Values=t3.*" --query 'InstanceTypes[*].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]' --output table
```

### From AWS Console

```
EC2 → Instance Types (left sidebar) → Filter and compare
```

## 13. Quick Reference – Most Used Instance Types

| Instance    | vCPU | RAM   | Category  | Free Tier | Monthly Cost (approx.) |
| ----------- | ---- | ----- | --------- | --------- | ---------------------- |
| `t2.micro`  | 1    | 1 GB  | Burstable | ✅ Yes     | \~$8.50                |
| `t2.small`  | 1    | 2 GB  | Burstable | ❌         | \~$17                  |
| `t3.medium` | 2    | 4 GB  | Burstable | ❌         | \~$30                  |
| `t3.large`  | 2    | 8 GB  | Burstable | ❌         | \~$60                  |
| `m5.large`  | 2    | 8 GB  | General   | ❌         | \~$70                  |
| `m5.xlarge` | 4    | 16 GB | General   | ❌         | \~$140                 |
| `c5.large`  | 2    | 4 GB  | Compute   | ❌         | \~$62                  |
| `c5.xlarge` | 4    | 8 GB  | Compute   | ❌         | \~$124                 |
| `r5.large`  | 2    | 16 GB | Memory    | ❌         | \~$91                  |
| `r5.xlarge` | 4    | 32 GB | Memory    | ❌         | \~$182                 |

{% hint style="info" %}
Prices are approximate for `ap-south-1` (Mumbai) On-Demand. Actual prices vary by Region.
{% endhint %}

## 14. Classroom Quiz Questions ❓

<details>

<summary><strong>Q1:</strong> "What instance type should you use for the Free Tier?"</summary>

**Answer:** `t2.micro` – 1 vCPU, 1 GB RAM, Free Tier eligible.

</details>

<details>

<summary><strong>Q2:</strong> "What does the letter 'c' in <code>c5.xlarge</code> stand for?"</summary>

**Answer:** Compute optimized – designed for CPU-intensive workloads.

</details>

<details>

<summary><strong>Q3:</strong> "What is the difference between T and M instance types?"</summary>

**Answer:** T instances are **burstable** (use CPU credits), while M instances provide **fixed, consistent** performance.

</details>

<details>

<summary><strong>Q4:</strong> "Which instance type would you choose for a Jenkins server?"</summary>

**Answer:** `t3.medium` (2 vCPU, 4 GB RAM) – builds are bursty, doesn't need constant high CPU.

</details>

<details>

<summary><strong>Q5:</strong> "What does the 'g' suffix mean in <code>m7g.large</code>?"</summary>

**Answer:** AWS **Graviton** (ARM-based) processor – offers better price-performance.

</details>

<details>

<summary><strong>Q6:</strong> "What happens when a T2 instance runs out of CPU credits?"</summary>

**Answer:** Performance drops to the **baseline level** (e.g., 10% for t2.micro). In T3 with Unlimited mode, it continues at full speed but charges extra.

</details>

<details>

<summary><strong>Q7:</strong> "Which instance family would you use for an in-memory Redis database?"</summary>

**Answer:** **R family** (Memory Optimized) – `r5.large` or `r6g.large`.

</details>

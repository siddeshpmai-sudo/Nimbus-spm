# rds pgsql

Your complete student lab handbook for mastering PostgreSQL on AWS RDS. Follow the step-by-step lab instructions, copy production SQL scripts, test queries in the interactive simulator, and track your progress.

## What is a Database & Database Fundamentals

A **database** is an organized, persistent repository of structured information stored electronically. A **Database Management System (DBMS)** is the engine software that processes queries, enforces constraints, guarantees data integrity, and handles concurrent access.

{% columns %}
{% column %}
### 📂 Flat Files (CSV/JSON)

Good for configuration files. Terrible for concurrency — multiple writers corrupt files; full table scans required for every search.
{% endcolumn %}

{% column %}
### 🐘 Relational (PostgreSQL)

Strict tabular schema, mathematical relational algebra, Primary/Foreign keys, declarative SQL, and strict ACID transaction guarantees.
{% endcolumn %}
{% endcolumns %}

### ⚡ NoSQL (DynamoDB/Redis)

Key-Value, Document, or In-memory caching. Designed for ultra-high throughput and horizontal scaling with eventual consistency.

### Relational Building Blocks: Quick Reference

| Relational Term          | Definition                                                                        | Example in E-Commerce                        |
| ------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------- |
| **Table (Relation)**     | A collection of related data entries structured into rows and columns.            | `customers` table                            |
| **Row (Tuple / Record)** | A single, discrete data item within a table.                                      | Customer "Sarah Connor", ID: 101             |
| **Column (Attribute)**   | A typed field containing a specific attribute.                                    | `email VARCHAR(100) NOT NULL`                |
| **Primary Key (PK)**     | Unique identifier for each row. Automatically creates an indexed B-tree.          | `customer_id SERIAL PRIMARY KEY`             |
| **Foreign Key (FK)**     | A column pointing to the PK of another table to maintain _referential integrity_. | `orders.customer_id REFERENCES customers`    |
| **Index**                | Auxiliary B-tree or Hash structure accelerating lookups from O(N) to O(log N).    | `CREATE INDEX idx_email ON customers(email)` |

### The ACID Transaction Guarantee

Why do banking systems, e-commerce stores, and flight booking platforms depend on PostgreSQL? Because of the **ACID** promise:

#### 🅰️ Atomicity

**All or Nothing.** If a money transfer deducts $100 from Account A, but fails while adding to Account B, the entire transaction is rolled back. No partial executions!

#### 🇨 Consistency

**Valid state only.** Data must satisfy all defined constraints (CHECK, FOREIGN KEY, NOT NULL). An account balance cannot become -$50 if `CHECK (balance >= 0)` exists.

#### 🇮 Isolation

**No crosstalk.** Concurrent transactions do not see uncommitted intermediate states of other transactions, preventing dirty reads and lost updates.

#### 🇩 Durability

**Never lost after commit.** Once a transaction is acknowledged, changes are committed to the non-volatile Write-Ahead Log (WAL) and will survive server crashes or power failures.

## What is Amazon RDS & Architectural Breakdown

**Amazon Relational Database Service (Amazon RDS)** is a managed database service that makes it easy to set up, operate, and scale a relational database in the AWS cloud. It provides cost-efficient and resizable capacity while automating time-consuming administrative tasks.

**Key Mental Model:** Amazon RDS is **100% native PostgreSQL**. All PostgreSQL tools (pgAdmin, psql, DBeaver, Prisma, Django ORM) connect seamlessly using standard PostgreSQL connection strings on port 5432.

### AWS RDS Multi-AZ & Network Security Architecture

A complete architectural view of VPC isolation, private subnets across dual Availability Zones, synchronous standby replication, and secure client access through port 5432:

#### 🛡️ Multi-AZ Deployments (High Availability)

AWS automatically provisions and maintains a synchronous standby replica in a different Availability Zone within the same VPC. If the master host fails, failover happens automatically in 60-120 seconds with **zero data loss** and no endpoint string change.

#### 📖 Read Replicas (Scalability)

Provision up to 15 asynchronous read-only copies to handle read-heavy analytical dashboards and reporting workloads. Can be promoted to independent standalone databases in disaster recovery scenarios.

#### 💾 Automated Backups & PITR

AWS continuously archives transaction logs (WAL) to Amazon S3 every 5 minutes along with daily snapshots. Enables **Point-in-Time Recovery (PITR)** down to any exact second during your 1-35 day retention window.

#### 📈 Storage Auto-Scaling

Never get paged at 3:00 AM for out-of-disk crashes. When available free space falls below 10%, RDS dynamically expands your General Purpose SSD (gp3) volume up to your configured maximum threshold (up to 64 TiB).

## Why RDS is Used? (Self-Hosted EC2 vs Managed RDS)

A classic DevOps interview question: _"Why choose Amazon RDS over installing PostgreSQL on an Amazon EC2 virtual machine?"_

| Feature / Task                    | PostgreSQL on EC2 (Self-Managed)                        | Amazon RDS for PostgreSQL (Managed)                      |
| --------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| **Setup Time**                    | Hours to days (OS setup, Postgres install, tune config) | 5 to 8 minutes via AWS Console or CLI                    |
| **Operating System Patching**     | You must patch security CVEs and manage reboots         | Automated during defined maintenance windows             |
| **High Availability Setup**       | Complex setup with Patroni, etcd, Pacemaker, Corosync   | 1-click checkbox: Multi-AZ synchronous replication       |
| **Automated Backups**             | Custom cron scripts with WAL-G / pgBackRest to S3       | Native continuous backup with Point-in-Time Recovery     |
| **Storage Auto-Scale**            | Manual volume expansion, LVM resize, xfs\_growfs        | Fully automated elastic expansion up to 64 TiB           |
| **Root Operating System Access**  | Full SSH root access (`sudo su`)                        | No root access (Prevents security tampering)             |
| **Total Cost of Ownership (TCO)** | Lower infrastructure cost; massive DBA salary overhead  | Slightly higher AWS compute cost; near-zero DBA overhead |

## DevOps Real-Time Production Use Cases

### 🚀 CI/CD Database Schema Migration Pipeline

Never manually apply SQL alters in production. Pipelines run **Flyway** or **Liquibase** container steps during GitHub Actions/GitLab CI deployments to automatically apply versioned migration scripts (`V1__init.sql`, `V2__add_index.sql`).

### 🧱 Infrastructure as Code (Terraform / CloudFormation)

Declarative provisioning of Subnet Groups, Security Groups, Parameter Groups, and RDS Instances across staging and production environments ensuring immutable infrastructure without configuration drift.

### 🔑 Secrets Rotation & Passwordless IAM Auth

Eliminate hardcoded database passwords. AWS Secrets Manager rotates credentials automatically every 30 days via Lambda, while application pods authenticate using short-lived 15-minute IAM STS tokens.

### 📡 Performance Insights & Automated Alerting

CloudWatch monitors FreeableMemory, DiskQueueDepth, and CPU. RDS Performance Insights breaks down database load by Average Active Sessions (AAS) against the Max vCPU line to identify slow queries in real-time.

## Hands-On Lab Walkthrough

{% stepper %}
{% step %}
## Provisioning the RDS PostgreSQL Instance

Follow these parameters to launch an RDS PostgreSQL instance in your AWS Management Console (or run the AWS CLI command).

* Navigate to **AWS Management Console ➔ RDS ➔ Databases ➔ Create database**
* **Choose a database creation method:** Standard create
* **Engine type:** PostgreSQL ➔ **Engine Version:** PostgreSQL 16.x
* **Templates:** Free tier
* **DB instance identifier:** `demo-pgsql-shopflow`
* **Master username:** `postgres`
* **Master password:** `DevOpsAdmin2026!#`
* **DB instance class:** `db.t4g.micro` (or `db.t3.micro`)
* **Storage:** General Purpose SSD (gp3), 20 GiB allocated
* **Public access:** Select **Yes** (for classroom laptop access)
* **VPC Security Group:** Choose or create a security group with **Inbound Rule: TCP Port 5432** from your IP
* **Additional configuration:** Initial database name: `shopflow_db`
* Click **Create database**. (Takes \~5-8 minutes).

### AWS CLI Command

```bash
aws rds create-db-instance \
  --db-instance-identifier demo-pgsql-shopflow \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16.3 \
  --master-username postgres \
  --master-user-password "DevOpsAdmin2026!#" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --db-name shopflow_db \
  --publicly-accessible \
  --backup-retention-period 7 \
  --no-multi-az
```

**Check your Endpoint:** Once the DB status changes from _Creating_ to _Available_, copy the **Endpoint** from the "Connectivity & security" tab. Example: `demo-pgsql-shopflow.c123456789.us-east-1.rds.amazonaws.com`.
{% endstep %}

{% step %}
## Connecting & Login via Terminal (psql CLI)

Test network connectivity and verify server access using the native command line client.

```bash
# Replace with your actual RDS Endpoint string:
psql -h YOUR-RDS-ENDPOINT.rds.amazonaws.com \
  -p 5432 \
  -U postgres \
  -d shopflow_db

# Password prompt: Enter DevOpsAdmin2026!#

# In the psql prompt, test:
shopflow_db=> SELECT version();
shopflow_db=> \conninfo
```
{% endstep %}

{% step %}
## Installing pgAdmin 4

Install pgAdmin 4 for your operating system or run it in Docker.

{% tabs %}
{% tab title="macOS" %}
```bash
brew install --cask pgadmin4
```
{% endtab %}

{% tab title="Windows" %}
Download the official Windows installer from: [https://www.pgadmin.org/download/pgadmin-4-windows/](https://www.pgadmin.org/download/pgadmin-4-windows/) and run the setup.
{% endtab %}

{% tab title="Linux (Ubuntu)" %}
```bash
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/pgadmin.gpg
sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'
sudo apt update && sudo apt install -y pgadmin4-desktop
```
{% endtab %}

{% tab title="Docker" %}
```bash
docker run -p 5050:80 \
  -e "PGADMIN_DEFAULT_EMAIL=student@devops.local" \
  -e "PGADMIN_DEFAULT_PASSWORD=StudentPassword2026!" \
  -d dpage/pgadmin4

# Open browser at: http://localhost:5050
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
## Registering Your RDS Connection in pgAdmin 4

Open pgAdmin 4, create a master application password, and register your database server.

* In the left Object Explorer panel, right-click on **Servers ➔ Register ➔ Server...**
* **General Tab:** Name: `AWS-RDS-ShopFlow`
* **Connection Tab:**
  * **Host name/address:** Paste your RDS Endpoint
  * **Port:** `5432`
  * **Maintenance database:** `shopflow_db`
  * **Username:** `postgres`
  * **Password:** `DevOpsAdmin2026!#` (Check "Save password")
* **Parameters Tab:** SSL Mode: `Require`
* Click **Save**. You should see a green checkmark and your database hierarchy!
{% endstep %}

{% step %}
## Creating the ShopFlow Relational Schema (DDL)

In pgAdmin, click **Tools ➔ Query Tool** (or press Alt+Shift+Q). Paste and run the DDL script below:

```sql
CREATE SCHEMA IF NOT EXISTS ecommerce;
SET search_path TO ecommerce, public;

-- 1. Customers Table
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  account_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'CLOSED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  sku VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Header Table
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
  order_status VARCHAR(30) DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED')),
  order_total NUMERIC(10, 2) DEFAULT 0.00,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE order_items (
  item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0)
);

-- 5. Indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_products_category ON products(category);
```
{% endstep %}

{% step %}
## Seed Data Ingestion, Queries & Interactive Simulator

Insert test data, run JOINs, and execute an ACID transaction in pgAdmin.

### Seed Data

```sql
INSERT INTO customers (first_name, last_name, email, phone)
VALUES
  ('Sarah', 'Connor', 'sarah.connor@sky.net', '+1-555-0101'),
  ('John', 'Doe', 'john.doe@example.com', '+1-555-0102'),
  ('Elena', 'Rostova', 'elena.rostova@cloud.io', '+1-555-0103'),
  ('Marcus', 'Vance', 'marcus.v@devops.org', '+1-555-0104');

INSERT INTO products (sku, name, category, price, stock_quantity)
VALUES
  ('DEV-K8S-BOOK', 'Kubernetes Production Guide', 'Books', 49.99, 120),
  ('DEV-TERRA-CR', 'Terraform Cloud Automation', 'Courses', 199.99, 500),
  ('HW-YUBIKEY-5', 'YubiKey 5C NFC Security Key', 'Hardware', 55.00, 45),
  ('HW-MONITOR-4K', 'Dell UltraSharp 32 4K Monitor', 'Hardware', 749.99, 15);

INSERT INTO orders (customer_id, order_status, order_total)
VALUES
  (1, 'PAID', 104.99),
  (2, 'PAID', 749.99),
  (3, 'PENDING', 199.99);

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
  (1, 1, 1, 49.99),
  (1, 3, 1, 55.00),
  (2, 4, 1, 749.99),
  (3, 2, 1, 199.99);
```

### Multi-Table JOIN

```sql
SELECT
  c.first_name || ' ' || c.last_name AS customer_name,
  o.order_id,
  o.order_status,
  p.name AS product_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;
```

Query Result (4 rows returned in 2.14 ms):

| customer\_name | order\_id | order\_status | product\_name                 | qty | unit\_price | line\_total |
| -------------- | --------- | ------------- | ----------------------------- | --- | ----------- | ----------- |
| Sarah Connor   | 1         | PAID          | Kubernetes Production Guide   | 1   | 49.99       | $49.99      |
| Sarah Connor   | 1         | PAID          | YubiKey 5C NFC Security Key   | 1   | 55.00       | $55.00      |
| John Doe       | 2         | PAID          | Dell UltraSharp 32 4K Monitor | 1   | 749.99      | $749.99     |
| Elena Rostova  | 3         | PENDING       | Terraform Cloud Automation    | 1   | 199.99      | $199.99     |
{% endstep %}

{% step %}
## Lab Teardown & Cost Guard

To avoid unexpected charges against your AWS credit or credit card, clean up your resources once you finish the demonstration!

```bash
aws rds delete-db-instance \
  --db-instance-identifier demo-pgsql-shopflow \
  --skip-final-snapshot \
  --delete-automated-backups
```
{% endstep %}
{% endstepper %}

## Can't Connect to RDS? 60-Second Quick Triage

If you get connection timeout or authentication refused errors in pgAdmin or psql, verify these checkpoints in order:

### Security Group Inbound Rule

Go to RDS ➔ Connectivity ➔ Click Security Group ➔ Inbound Rules. Must have Type: `PostgreSQL`, Port: `5432`, Source: `My IP` (or `0.0.0.0/0` for training labs).

### Public Accessibility Flag

Under Connectivity & Security ➔ **Publicly Accessible** must say **Yes**. If it says _No_, your laptop cannot reach it without a VPN or Bastion host.

### Strip Port from Host Endpoint

In pgAdmin "Host" field, paste ONLY `xxxx.rds.amazonaws.com`. Do NOT include `:5432` or `https://` in the hostname!

### SSL Mode Setting

In pgAdmin Connection Parameters, set **SSL mode** to `Require` or `Prefer`. AWS RDS requires encrypted TLS handshakes.

## Knowledge Check: Interactive Quiz

<details>

<summary>In an Amazon RDS Multi-AZ deployment, what is the role of the standby replica?</summary>

A) Handles read-only analytics queries to reduce load on the primary

B) Stays warm for synchronous automatic failover with zero data loss in case the primary fails

C) Compresses daily backups and uploads them to Amazon S3 Glacier

D) Acts as an SSH bastion host for database administrators

</details>

<details>

<summary>Which ACID property guarantees that all operations inside a transaction complete or none of them do?</summary>

A) Atomicity

B) Consistency

C) Isolation

D) Durability

</details>

<details>

<summary>What is the primary operational advantage of Amazon RDS Storage Auto-Scaling?</summary>

A) It automatically deletes old table records when disk reaches 90%

B) It dynamically increases EBS volume storage when free space falls below 10%, preventing database crashes

C) It converts row-oriented data into columnar Parquet format

D) It shrinks disk space during idle hours to save costs

</details>

## PostgreSQL Terminal (psql) Quick Command Cheat Sheet

| psql Meta-Command | Description / Purpose                                   | SQL Equivalent                                         |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| `\l` or `\l+`     | List all databases in the cluster                       | `SELECT datname FROM pg_database;`                     |
| `\c dbname`       | Connect / switch to a specific database                 | N/A (Session switch)                                   |
| `\dt` or `\dt+`   | List all tables in the current schema                   | `SELECT tablename FROM pg_tables;`                     |
| `\d table_name`   | Describe table columns, constraints, and indexes        | `SELECT * FROM information_schema.columns...`          |
| `\dn`             | List all schemas                                        | `SELECT schema_name FROM information_schema.schemata;` |
| `\conninfo`       | Display current connection info (Host, Port, User, SSL) | N/A                                                    |
| `\x`              | Toggle expanded table view (Useful for wide tables)     | N/A                                                    |
| `\q`              | Quit / exit the psql shell                              | N/A                                                    |

# Secrets Manager

Your complete reference guide for managing sensitive credentials, automating database password rotation without application downtime, securing Kubernetes & ECS microservices, and mastering the AWS CLI.

## What is AWS Secrets Manager?

**AWS Secrets Manager** is an AWS service designed to protect database credentials, API keys, certificates, and arbitrary strings throughout their lifecycle. Instead of hardcoding credentials in configuration files or container environment variables, your applications retrieve credentials programmatically at runtime using standard AWS SDKs and IAM role authentication.

### 🔐 KMS Envelope Encryption

Secrets are encrypted at rest using AWS Key Management Service (KMS). You can use the AWS-managed key (`aws/secretsmanager`) or a Customer Managed Key (CMK) for cross-account sharing.

### 🔄 Automated Rotation Engine

Built-in integration with AWS Lambda automatically rotates database credentials (RDS PostgreSQL, MySQL, Aurora, Oracle, SQL Server, Redshift, DocumentDB) on a schedule (e.g. every 30 days) with zero downtime.

### 🏷️ Version Staging Labels

Every change creates an immutable version. Staging labels tag versions: `AWSCURRENT` (active version), `AWSPREVIOUS` (last working version for rollback), and `AWSPENDING` (in-rotation).

### 🌐 Cross-Region Replication

Replicate secrets across multiple AWS regions for disaster recovery (DR) and global microservice latency reduction with automated KMS key re-encryption.

### Comparison Matrix: Secrets Manager vs. SSM Parameter Store vs. HashiCorp Vault

| Feature                       | AWS Secrets Manager               | SSM Parameter Store (Standard) | HashiCorp Vault                    |
| ----------------------------- | --------------------------------- | ------------------------------ | ---------------------------------- |
| **Primary Use Case**          | Sensitive DB & API Credentials    | App Configuration & URLs       | Multi-cloud enterprise secrets     |
| **Automated Rotation**        | Built-in Lambda Engine            | Manual EventBridge/Lambda      | Dynamic Secret Engine              |
| **Max Payload Size**          | 64 KB                             | 4 KB (8 KB in Advanced)        | Configurable (MBs)                 |
| **Cost**                      | $0.40/secret/mo + $0.05/10k calls | Free (Standard tier)           | Infrastructure cost or HCP license |
| **Resource Policy on Secret** | Yes (Cross-account simple)        | No (IAM Identity only)         | Yes (Namespaces/ACLs)              |

{% hint style="info" %}
**Architecture Rule of Thumb:** Store non-secret application configs (endpoints, ports, log levels, feature flags) in **SSM Parameter Store**. Store sensitive credentials that require compliance rotation, cross-region disaster recovery, or cross-account access in **AWS Secrets Manager**.
{% endhint %}

## Why Use Secrets Manager? Security & DevOps Benefits

Hardcoding credentials is the #1 cause of cloud data breaches. Understanding the mechanics of Secrets Manager helps you build resilient, zero-trust DevOps pipelines.

### 🚫 Eliminate Git Secret Leaks

No more accidental `git push` of database passwords or private API tokens into GitHub or GitLab repositories. Source code only contains secret names or ARNs.

### ⚡ Zero-Downtime Credential Rotation

Using the Dual-User rotation architecture, database passwords rotate without disconnecting active user sessions or requiring container restarts.

### 📜 Complete Compliance & Audit Trail

Every retrieval call (`GetSecretValue`) is recorded in **AWS CloudTrail** with caller IAM identity, source IP, and timestamp for SOC-2 and PCI-DSS compliance.

### 🔑 IAM Role Authentication

Applications authenticate to Secrets Manager using IAM Instance Profiles (EC2), Task Roles (ECS), or IAM Roles for Service Accounts (EKS). No static API access keys required!

### The 4-Step Lambda Secret Rotation Protocol

When rotation triggers, Secrets Manager invokes a rotation Lambda function through 4 sequential steps:

{% stepper %}
{% step %}
#### createSecret

Generates a new strong random password and creates a new version with the staging label `AWSPENDING`.
{% endstep %}

{% step %}
#### setSecret

Connects to the database using the active credentials and creates or alters the user with the new pending password.
{% endstep %}

{% step %}
#### testSecret

Attempts an actual connection to the database using the new `AWSPENDING` credentials to verify successful authentication.
{% endstep %}

{% step %}
#### finishSecret

Promotes the new version by moving `AWSCURRENT` to it. The previous version automatically becomes `AWSPREVIOUS`.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
**Client-Side Caching:** Calling `get_secret_value()` on every single HTTP request adds 30-50ms of network latency and incurs AWS API fees ($0.05 per 10k calls). In production, always cache secrets in memory with a Time-To-Live (TTL) of 1 hour using AWS's official caching libraries.
{% endhint %}

## Real-Time DevOps Production Use Cases

### 🗄️ RDS / Aurora Database Credentials

Database master and application credentials managed with automated 30-day Lambda rotation inside private VPC subnets using VPC Endpoints.

### ☸️ Kubernetes (EKS) Secrets Store CSI

Mounts secrets from AWS Secrets Manager directly as files into Pod volumes in memory (tmpfs) using IAM Roles for Service Accounts (IRSA).

### 🚢 ECS Container Environment Injection

ECS Task Execution Role reads secrets at container launch and injects them as environment variables without storing them in Docker images.

### 🚀 GitHub Actions & CI/CD Pipelines

CI/CD workflows use OIDC tokens to assume temporary AWS IAM roles and fetch deployment keys dynamically without static long-lived credentials.

### 🏗️ Terraform Dynamic Credential Injection

Terraform creates RDS instances, generates dynamic random passwords via `random_password`, and stores them in Secrets Manager without plaintext exposure.

### 💳 Third-Party SaaS API Keys

API keys for Stripe, SendGrid, Twilio, and Datadog stored centrally with automated rotation via webhooks and custom Lambda functions.

## Step-by-Step Hands-On Demonstration Lab

Follow these 9 steps to master creating, managing, programmatically retrieving, rotating, and auditing secrets.

{% stepper %}
{% step %}
### Create IAM Least-Privilege Policy for Application

Applications must only have permission to read the specific secret ARN required for their workload.

{% code title="app-secrets-policy.json" %}
```json
{ "Version": "2012-10-17", "Statement": [ { "Sid": "AllowAppReadSpecificSecret", "Effect": "Allow", "Action": [ "secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret" ], "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:dev/app/db-credentials-*" } ] }
```
{% endcode %}
{% endstep %}

{% step %}
### Create the Secret via AWS Management Console

Follow the console click-path:

1. Open the AWS Secrets Manager console in `us-east-1`.
2. Click Store a new secret.
3. Under **Secret type**, choose Credentials for Amazon RDS database (or _Other type of secret_).
4. Fill in the Key/Value pairs:
   * `username` : `db_admin_dev`
   * `password` : `P@ssw0rdSecure2026!#`
   * `engine` : `postgres`
   * `host` : `db-cluster.cb8192a.us-east-1.rds.amazonaws.com`
   * `port` : `5432`
   * `dbname` : `orders_db`
5. Under **Encryption key**, leave default aws/secretsmanager.
6. Secret name: dev/app/db-credentials. Add tag `Environment=Development`.
7. Leave rotation disabled for now. Click Store!
{% endstep %}

{% step %}
### Inspect Secret Metadata via AWS CLI

Verify that the secret exists and inspect its metadata without retrieving the sensitive payload.

{% code title="Terminal — Describe Secret" %}
```bash
aws secretsmanager describe-secret \ --secret-id "dev/app/db-credentials" \ --region us-east-1
```
{% endcode %}
{% endstep %}

{% step %}
### Retrieve & Parse Secret Value via AWS CLI

Fetch the secret string and extract individual keys using `jq`.

{% code title="Terminal — Get Secret Value & Parse JSON" %}
```bash
# 1. Fetch the raw SecretString JSON payload aws secretsmanager get-secret-value \ --secret-id "dev/app/db-credentials" \ --query "SecretString" \ --output text # 2. Extract database password directly into a script variable DB_PASS=$(aws secretsmanager get-secret-value \ --secret-id "dev/app/db-credentials" \ --query "SecretString" \ --output text | jq -r '.password') echo "Successfully extracted secret with password length: ${#DB_PASS} chars"
```
{% endcode %}
{% endstep %}

{% step %}
### Application Integration (Python Boto3 & Node.js)

Run this ready-to-use Python script to test retrieving credentials in memory.

{% code title="test_secrets.py (Python Boto3)" %}
```python
import json import boto3 from botocore.exceptions import ClientError def get_secret(secret_name="dev/app/db-credentials", region_name="us-east-1"): client = boto3.client("secretsmanager", region_name=region_name) try: response = client.get_secret_value(SecretId=secret_name) except ClientError as e: print(f"Error fetching secret: {e}") raise e if "SecretString" in response: return json.loads(response["SecretString"]) return None if __name__ == "__main__": credentials = get_secret() print("✅ Successfully retrieved credentials from Secrets Manager:") print(f" Host: {credentials.get('host')}") print(f" Port: {credentials.get('port')}") print(f" User: {credentials.get('username')}") print(f" Database: {credentials.get('dbname')}") print(f" Password length: {len(credentials.get('password'))} characters")
```
{% endcode %}
{% endstep %}

{% step %}
### Simulate Secret Rotation & Version Staging

Update the secret value with a new password to trigger version creation and inspect the version list.

{% code title="Terminal — Store New Version" %}
```bash
# Put updated credentials aws secretsmanager put-secret-value \ --secret-id "dev/app/db-credentials" \ --secret-string '{"username":"db_admin_dev","password":"RotatedPassword2026!#","engine":"postgres","host":"db-cluster.cb8192a.us-east-1.rds.amazonaws.com","port":5432,"dbname":"orders_db"}' # List secret version IDs to see AWSCURRENT and AWSPREVIOUS aws secretsmanager list-secret-version-ids \ --secret-id "dev/app/db-credentials"
```
{% endcode %}
{% endstep %}

{% step %}
### Test Instant Rollback Using Staging Labels

Retrieve the prior version directly by requesting the `AWSPREVIOUS` staging label.

{% code title="Terminal — Fetch Previous Version" %}
```bash
aws secretsmanager get-secret-value \ --secret-id "dev/app/db-credentials" \ --version-stage "AWSPREVIOUS" \ --query "SecretString" \ --output text | jq .
```
{% endcode %}
{% endstep %}

{% step %}
### Audit Secret Access via AWS CloudTrail

Inspect the CloudTrail event log to verify who accessed the secret.

{% code title="Terminal — Query CloudTrail Event History" %}
```bash
aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=EventName,AttributeValue=GetSecretValue \ --max-results 3 \ --query "Events[*].{Time:EventTime,User:Username,Service:EventSource,Secret:Resources[0].ResourceName}" \ --output table
```
{% endcode %}
{% endstep %}

{% step %}
### Safe Clean-Up & Recovery Window

Clean up your AWS account. By default, Secrets Manager enforces a 7 to 30 day recovery window. Use `--force-delete-without-recovery` to delete immediately in lab environments.

{% code title="Terminal — Clean Up" %}
```bash
# Immediate deletion for lab environments: aws secretsmanager delete-secret \ --secret-id "dev/app/db-credentials" \ --force-delete-without-recovery
```
{% endcode %}
{% endstep %}
{% endstepper %}

## DevOps CLI Cheatsheet & Self-Assessment Quiz

### AWS CLI Secrets Manager Quick Reference

| CLI Command               | Description                                       | Common Options                                   |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| `create-secret`           | Creates a new secret                              | `--name`, `--secret-string`, `--tags`            |
| `get-secret-value`        | Retrieves plaintext secret string                 | `--secret-id`, `--version-stage`, `--version-id` |
| `put-secret-value`        | Stores new version of secret string               | `--secret-id`, `--secret-string`                 |
| `describe-secret`         | Retrieves metadata without secret payload         | `--secret-id`                                    |
| `list-secret-version-ids` | Lists all versions and attached staging labels    | `--secret-id`                                    |
| `rotate-secret`           | Manually triggers rotation Lambda function        | `--secret-id`                                    |
| `delete-secret`           | Schedules secret deletion (7-30 days)             | `--force-delete-without-recovery`                |
| `restore-secret`          | Cancels scheduled deletion during recovery window | `--secret-id`                                    |

### Interactive Knowledge Check

<details>

<summary>What is the staging label attached to the active, live version of a secret?</summary>

A) AWSPENDING

B) AWSCURRENT

C) AWSACTIVE

D) AWSPREVIOUS

</details>

<details>

<summary>When deploying containers on Amazon ECS, which role should be granted <code>secretsmanager:GetSecretValue</code> to inject secrets as container environment variables at launch?</summary>

A) ECS Task Role

B) ECS Task Execution Role

C) EC2 Instance Profile

D) AWS Organization Root Role

</details>

<details>

<summary>What is the maximum payload size supported for a single secret in AWS Secrets Manager?</summary>

A) 4 KB

B) 8 KB

C) 64 KB

D) 1 MB

</details>

<details>

<summary>Why does the Dual-User rotation strategy prevent database connection downtime?</summary>

A) It disables database authentication during rotation

B) It rotates the inactive user first, tests it, and then swaps pointers while existing connections run uninterrupted

C) It caches all SQL queries on an EC2 proxy server

D) It restarts the database in read-only replica mode

</details>

### Common Troubleshooting & Error Resolution

| Error Code                   | Root Cause                                                             | Fix                                                                             |
| ---------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `AccessDeniedException`      | IAM role missing `GetSecretValue` or missing `kms:Decrypt` on KMS key. | Update IAM policy and KMS key policy to include both permissions.               |
| `ResourceNotFoundException`  | Secret does not exist in target region, or typo in secret name.        | Check region in CLI/SDK and verify exact secret name or ARN.                    |
| `InvalidRequestException`    | Secret is scheduled for deletion, or rotation is already in progress.  | Restore secret using `restore-secret` or use `--force-delete-without-recovery`. |
| `Connection Timeout (hangs)` | App is running in private VPC without Internet or NAT Gateway.         | Create a **PrivateLink VPC Endpoint** for Secrets Manager (port 443).           |

## 🎉 Lab Completed

You are now prepared to build production-grade secret management architectures on AWS with automated zero-downtime rotation.

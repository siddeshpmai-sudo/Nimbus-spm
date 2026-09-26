# KMS

Master the industry standard for cloud encryption at rest. Understand cryptographic key hierarchies, envelope encryption mechanics, dual-layer policy evaluation, and execute a 100% AWS Console lab isolating sensitive DevOps artifacts.

## What is AWS KMS? Core Concepts

**AWS Key Management Service (KMS)** is a managed service that makes it easy to create and control cryptographic keys used to encrypt your data. It integrates seamlessly with over 100 AWS services and provides centralized audit logging via AWS CloudTrail.

{% hint style="info" %}
**Fundamental Rule:** The plaintext key material of a KMS Customer Master Key (CMK) **never leaves AWS KMS Hardware Security Modules (HSMs)**, is never sent over the network, and cannot be viewed or downloaded by anyone—not even AWS staff.
{% endhint %}

### The 3 Key Tiers in AWS KMS

| Key Type                                         | Who Creates It?                                | Can You Edit Policy?                 | Cross-Account Use?            | Cost                                |
| ------------------------------------------------ | ---------------------------------------------- | ------------------------------------ | ----------------------------- | ----------------------------------- |
| **AWS Owned Key**                                | Internal AWS teams (e.g. S3 system encryption) | ❌ No                                 | ❌ No                          | Free                                |
| **AWS Managed Key** (Alias: `aws/s3`, `aws/ebs`) | Created automatically on first service use     | ❌ No (View-only)                     | ❌ No                          | Free to store, pay for API requests |
| **Customer Managed Key (CMK)**                   | Created and managed by you                     | ✅ Full Control (Custom Key Policies) | ✅ Yes (Via Key Policy Grants) | $1.00 / month / key + API requests  |

### Key Specifications

#### 🔑 Symmetric Keys (AES-256 GCM)

The **standard for 99% of cloud workloads**. A single 256-bit secret key is used for both encryption and decryption. Native integration with S3, EBS, RDS, DynamoDB, Secrets Manager, and Lambda.

#### 🔓 Asymmetric Keys (RSA & ECC)

Generates a public/private keypair. The public key can be downloaded and distributed outside AWS to encrypt data or verify digital signatures; the private key never leaves the KMS HSM.

#### 🌐 Multi-Region Keys

Primary and replica keys shared across multiple AWS regions with identical key material and key IDs. Enables seamless client-side decryption in active-active disaster recovery architectures.

## Envelope Encryption Explained

AWS KMS direct `Encrypt` and `Decrypt` API calls have a **hard limit of 4 KB** of data. To encrypt large datasets (gigabytes or terabytes of S3 objects, EBS volumes, or database dumps), AWS uses a technique called **Envelope Encryption**.

### 📐 The 4-Step Envelope Encryption Mechanism

**Analogy:** The CMK is a master key that locks the small safety deposit box (DEK). The deposit box holds the actual data.

{% stepper %}
{% step %}
## Request DEK

Your app or AWS service calls `GenerateDataKey`. KMS uses the CMK to generate a unique Data Encryption Key (DEK).
{% endstep %}

{% step %}
## Fast Local Encrypt

The plaintext DEK encrypts your massive file locally in milliseconds using AES-256 GCM without streaming data over the network.
{% endstep %}

{% step %}
## Zeroize Memory

The plaintext DEK is immediately overwritten and removed from memory. It is never stored on disk in plaintext!
{% endstep %}

{% step %}
## Save Ciphertext DEK

The encrypted DEK is stored right next to the encrypted file. To decrypt later, send the encrypted DEK back to KMS `Decrypt`!
{% endstep %}
{% endstepper %}

## Why AWS KMS is Essential for Enterprise Cloud

### 🛡️ Separation of Duties

Infra/DevOps engineers manage servers and buckets; Security Officers manage the keys. Even if an attacker steals an EC2 root login or an S3 bucket permission, without KMS key permissions the data is unreadable garbage.

### 👑 Key Policies are King

Unlike standard AWS resources where an IAM admin can access everything, KMS requires explicit authorization in the **Key Policy**. An IAM policy with `"Action": "*", "Resource": "*"` cannot touch a key unless the Key Policy delegates power to the account!

### 🔄 Automated Key Rotation

One checkbox enables annual automatic rotation. AWS creates new key material for future encryptions while keeping the old cryptographic material to decrypt old data seamlessly. No re-encryption jobs required.

### 📜 Tamper-Proof Audit Trail

Every call to `Encrypt`, `Decrypt`, or `GenerateDataKey` generates an event in AWS CloudTrail with caller IAM identity, source IP, time, and Encryption Context.

## 5 Real-World DevOps Production Use Cases

{% stepper %}
{% step %}
## CI/CD Pipeline & App Secrets

**Services:** SSM Parameter Store (`SecureString`) & Secrets Manager

Database passwords and API tokens are stored encrypted with a custom CMK. During deployment, the CI/CD runner IAM role calls SSM, KMS decrypts the secret, and injects it into container runtime env vars.
{% endstep %}

{% step %}
## S3 Build Artifact & Data Lake Isolation

**Services:** Amazon S3 + SSE-KMS + S3 Bucket Keys

Production S3 buckets are encrypted with a Prod CMK. Developers with general S3 read permissions get instant `AccessDenied` if they try to download prod logs or customer exports because they lack `kms:Decrypt` rights.
{% endstep %}

{% step %}
## EKS Kubernetes Secrets Encryption

**Services:** Amazon EKS + etcd + KMS CMK

Standard Kubernetes secrets are only base64-encoded strings in etcd. By enabling KMS Envelope Encryption on the EKS cluster, Kubernetes secrets are encrypted at rest with a CMK inside etcd, meeting SOC 2 and HIPAA requirements.
{% endstep %}

{% step %}
## Golden AMIs & EBS Volume Pipelines

**Services:** HashiCorp Packer + EC2 Image Builder + EBS

Golden AMI creation pipelines encrypt root snapshot volumes with a shared CMK. Target accounts are granted cross-account key permissions, allowing EC2 instances to launch securely from encrypted snapshots.
{% endstep %}

{% step %}
## Cross-Account Artifact Deployment

**Services:** Multi-Account AWS Organizations + KMS Grants

A Central Tools Account produces Docker images or Lambda zip files and stores them encrypted with a CMK. Target Dev, Staging, and Prod accounts decrypt the packages via cross-account Key Policy delegations.
{% endstep %}
{% endstepper %}

## Hands-on Lab: 100% AWS Console Walkthrough

Complete each of the 7 steps below in your AWS Management Console.

{% stepper %}
{% step %}
## Create a Customer Managed Key (CMK)

Estimated: 5 mins

1. Open AWS Console ➔ Search and open Key Management Service (KMS). (Ensure your region is set, e.g. `us-east-1`).
2. In the left navigation sidebar, click Customer managed keys.
3. Click the orange button: Create key.
4. **Key type:** Choose Symmetric. **Key usage:** Choose Encrypt and decrypt. Click Next.
5. **Alias:** `devops-prod-cmk-demo` **Description:** `CMK for securing production configs and S3 data` **Tag:** Key = `Environment`, Value = `Production`. Click Next.
6. **Define Key Administrative Permissions:** Select your current IAM User / Role. Click Next.
7. **Define Key Usage Permissions:** Select your current IAM User / Role (to allow encrypt/decrypt). Click Next.
8. Review the Key Policy JSON and click Finish.
{% endstep %}

{% step %}
## Inspect the Key Policy & Key Rotation

Estimated: 4 mins

1. In the KMS keys list, click on your new key: `devops-prod-cmk-demo`.
2. Under the Key policy tab, locate the root delegation block:

```json
{ "Sid": "Enable IAM User Permissions", "Effect": "Allow", "Principal": { "AWS": "arn:aws:iam::YOUR-ACCOUNT-ID:root" }, "Action": "kms:*", "Resource": "*" }
```

3. Click the Key rotation tab next to Key policy. Notice the checkbox to _"Automatically rotate this KMS key every year"_.
{% endstep %}

{% step %}
## Create an S3 Bucket with SSE-KMS & Bucket Key

Estimated: 6 mins

1. Open a new browser tab and navigate to Amazon S3 Console.
2. Click Create bucket.
3. **Bucket name:** `devops-secure-artifacts-kms-[your-initials]` (must be globally unique). **Region:** Select the same region as your KMS key.
4. Under Default encryption:
   * Choose Server-side encryption with AWS Key Management Service keys (SSE-KMS).
   * Choose Choose from your AWS KMS keys ➔ Select `devops-prod-cmk-demo`.
   * **Bucket Key:** Select Enable (reduces KMS API call cost by \~99%).
5. Click Create bucket.
{% endstep %}

{% step %}
## Upload Sensitive Config & Verify Encryption

Estimated: 5 mins

Create a local test file `app-db-config.json` with the following content:

```json
{ "environment": "production", "database": { "host": "aurora-pg-cluster.internal.devops.corp", "port": 5432, "username": "superadmin_devops", "password": "SuperSecretVaultKey#2026!DoNotExpose" } }
```

1. Inside your bucket `devops-secure-artifacts-kms-[initials]`, click Upload ➔ select `app-db-config.json` ➔ click Upload.
2. Click on `app-db-config.json` to view its object properties.
3. Scroll down to Server-side encryption settings. Confirm the Encryption type is `AWS KMS (SSE-KMS)` and the Key ARN points to your CMK.
4. Click Open or Download. The file opens and shows plaintext JSON because your IAM identity has `kms:Decrypt` permission.
{% endstep %}

{% step %}
## The "Aha!" Security Test — Live Access Denial

Estimated: 5 mins

Test what happens when S3 permissions are intact but cryptographic permissions are blocked!

1. Go back to the AWS KMS Console tab.
2. Select your key `devops-prod-cmk-demo`.
3. Click Key actions ➔ Disable ➔ Confirm disable. Key state becomes **Disabled**.
4. Return to the Amazon S3 Console tab for `app-db-config.json`.
5. Click Open or Download. **Access Denied!** S3 returns `KMS.DisabledException: arn:aws:kms:... is disabled.` **Key Insight:** Storage access does not grant data access. Cryptography is the true enforcer!
6. In KMS, click Key actions ➔ Enable. Refresh S3 and verify the file opens again.
{% endstep %}

{% step %}
## Audit Cryptographic Events in AWS CloudTrail

Estimated: 4 mins

1. Navigate to AWS CloudTrail Console.
2. In the left navigation menu, click Event history.
3. Filter by Event source: enter `kms.amazonaws.com` and press Enter.
4. Observe the events recorded by AWS:
   * `GenerateDataKey` (called by S3 during your upload)
   * `Decrypt` (called by S3 during file download)
   * `DisableKey` and `EnableKey`
{% endstep %}

{% step %}
## Clean-Up & Schedule Key Deletion (Zero Cost)

Estimated: 3 mins

1. In Amazon S3, select your bucket ➔ click Empty ➔ type `permanently delete`.
2. Click Delete bucket and confirm.
3. In AWS KMS, select `devops-prod-cmk-demo` ➔ Key actions ➔ Schedule key deletion.
4. Leave the default waiting period of **7 days** (KMS safety window preventing instant accidental loss). Confirm deletion.
{% endstep %}
{% endstepper %}

## KMS Quick Reference Cheatsheet

| Attribute / Metric               | Specification / Limit                      | DevOps Architectural Context                                             |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| **Direct Encrypt/Decrypt Limit** | **4 KB** max payload                       | Anything larger requires Envelope Encryption (GenerateDataKey).          |
| **Cryptographic Backing**        | FIPS 140-2 / 140-3 Level 3 HSMs            | Tamper-resistant physical cryptographic hardware.                        |
| **Key Deletion Safety Window**   | **7 to 30 days**                           | Keys cannot be deleted immediately to prevent disaster.                  |
| **Pricing**                      | $1.00 / month / CMK + $0.03 / 10k requests | Always enable **S3 Bucket Keys** to cut KMS API costs by up to 99%.      |
| **Key Rotation Cadence**         | Once every **1 year** (365 days)           | Automatic rotation retains historical backing keys to decrypt past data. |

## Troubleshooting Common KMS Errors

<details>

<summary>❌ AccessDeniedException</summary>

**Cause:** Either the IAM policy lacks `kms:Decrypt` or the KMS Key Policy does not delegate authority to the caller or account.

**Fix:** Check Key Policy tab in KMS console to verify your IAM user/role ARN is explicitly listed under Key Users.

</details>

<details>

<summary>⚠️ KMS.DisabledException</summary>

**Cause:** The key state is set to "Disabled" or "Pending deletion".

**Fix:** In KMS console, select key ➔ Key actions ➔ Enable key.

</details>

<details>

<summary>🔍 InvalidCiphertextException</summary>

**Cause:** The ciphertext data was corrupted, or the wrong KMS key was specified for decryption, or the **Encryption Context (AAD)** provided during Decrypt does not match what was provided during Encrypt.

</details>

## Knowledge Check: Test Your KMS Skills

1.  What is the maximum data payload that can be encrypted directly using the KMS Encrypt API?

    A) 5 Terabytes

    B) 10 Megabytes

    C) 4 Kilobytes

    D) Unlimited
2.  An IAM Administrator with full "AdministratorAccess" cannot decrypt data using a KMS key. Why?

    A) KMS requires multi-factor authentication for all reads.

    B) The Key Policy does not grant root delegation or user access.

    C) AdministratorAccess only applies to EC2 and S3.

    D) Only the AWS Root Account holder can call Decrypt.
3.  Why should you enable "S3 Bucket Keys" when configuring SSE-KMS on an Amazon S3 bucket?

    A) It caches data keys in S3, reducing KMS API request costs by up to 99%.

    B) It makes S3 objects completely public for easy download.

    C) It disables encryption for small files.

    D) It eliminates the need for IAM permissions.

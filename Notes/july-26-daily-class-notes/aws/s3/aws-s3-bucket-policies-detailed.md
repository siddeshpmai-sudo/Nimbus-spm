# AWS s3 bucket policies detailed

## 1. What is an S3 Bucket Policy?

An S3 bucket policy is a JSON document that defines:

* **Who** can access the bucket → `Principal`
* **What** they can do → `Action`
* **Which S3 resources** they can access → `Resource`
* **Whether access is allowed or denied** → `Effect`
* **Under what conditions** → `Condition`

Basic structure:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

This says:

> Allow everyone to download objects from `my-bucket`.

{% hint style="warning" %}
This makes the objects publicly readable, so you would only use this intentionally—for example, for a public website.
{% endhint %}

## 2. Bucket Policy vs IAM Policy

This is one of the most important interview questions.

### IAM policy

An IAM policy is generally attached to:

* IAM user
* IAM group
* IAM role

```
IAM Role
   |
   └── IAM Policy
          |
          └── Allow s3:GetObject
```

### S3 bucket policy

A bucket policy is attached directly to:

```
S3 Bucket
   |
   └── Bucket Policy
```

It is a **resource-based policy**.

### Simple comparison

| IAM Policy                         | S3 Bucket Policy                                  |
| ---------------------------------- | ------------------------------------------------- |
| Identity-based                     | Resource-based                                    |
| Attached to user/role/group        | Attached to S3 bucket                             |
| Defines what identity can do       | Defines who can access bucket/resource            |
| Common for application permissions | Common for cross-account/public/restricted access |
| Principal usually isn't specified  | `Principal` is commonly specified                 |

## 3. Understand the Important Elements

Let's take this example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppReadAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/MyApplicationRole"
      },
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-company-bucket/*"
    }
  ]
}
```

Let's break it down.

### `Version`

```json
"Version": "2012-10-17"
```

This is the policy language version.

You will normally see:

```
2012-10-17
```

Don't confuse this with the date the policy was created.

### `Statement`

```json
"Statement": []
```

A policy can contain one or multiple statements.

For example:

```json
"Statement": [
  {
    ...
  },
  {
    ...
  }
]
```

You could have:

```
Statement 1 → Application can READ
Statement 2 → Backup role can WRITE
Statement 3 → Everyone is DENIED
```

### `Sid`

Example:

```json
"Sid": "AllowApplicationRead"
```

`Sid` means **Statement ID**.

It is basically a name/identifier for the statement.

For example:

```
AllowApplicationRead
DenyPublicAccess
AllowBackup
AllowCloudFront
```

It makes policies easier to understand and manage.

### `Effect`

There are two possible values:

```json
"Effect": "Allow"
```

or:

```json
"Effect": "Deny"
```

#### Allow

```
Allow → Give permission
```

#### Deny

```
Deny → Explicitly block permission
```

{% hint style="warning" %}
**Explicit Deny overrides Allow.**
{% endhint %}

For example:

```
IAM Policy:
Allow s3:GetObject

Bucket Policy:
Deny s3:GetObject
```

Result:

```
ACCESS DENIED
```

Even though the IAM policy says Allow.

### `Principal`

This answers:

> **Who is allowed or denied?**

Example:

```json
"Principal": "*"
```

Means:

```
Everyone
```

You can specify an AWS account:

```json
"Principal": {
  "AWS": "arn:aws:iam::123456789012:root"
}
```

You can specify an IAM role:

```json
"Principal": {
  "AWS": "arn:aws:iam::123456789012:role/MyAppRole"
}
```

You can specify multiple principals:

```json
"Principal": {
  "AWS": [
    "arn:aws:iam::111111111111:role/AppRole",
    "arn:aws:iam::222222222222:role/BackupRole"
  ]
}
```

### `Action`

This defines:

> **What operation can the principal perform?**

Common S3 actions:

```
s3:ListBucket
s3:GetObject
s3:PutObject
s3:DeleteObject
s3:GetBucketLocation
```

For example:

```json
"Action": "s3:GetObject"
```

means:

> Download/read an object.

#### Common S3 permissions

| Permission               | Meaning                        |
| ------------------------ | ------------------------------ |
| `s3:ListBucket`          | List objects in bucket         |
| `s3:GetObject`           | Read/download object           |
| `s3:PutObject`           | Upload object                  |
| `s3:DeleteObject`        | Delete object                  |
| `s3:GetObjectVersion`    | Read specific object version   |
| `s3:DeleteObjectVersion` | Delete specific object version |

## 4. Very Important: Bucket ARN vs Object ARN

This causes many real-world mistakes.

Suppose bucket name is:

```
my-company-bucket
```

Bucket ARN:

```
arn:aws:s3:::my-company-bucket
```

Object ARN:

```
arn:aws:s3:::my-company-bucket/*
```

Notice:

```
Bucket:
arn:aws:s3:::my-company-bucket

Objects:
arn:aws:s3:::my-company-bucket/*
```

### Why does this matter?

`ListBucket` operates on the bucket:

```json
"Action": "s3:ListBucket",
"Resource": "arn:aws:s3:::my-company-bucket"
```

But `GetObject` operates on objects:

```json
"Action": "s3:GetObject",
"Resource": "arn:aws:s3:::my-company-bucket/*"
```

{% hint style="warning" %}
This distinction is **very important in interviews**.
{% endhint %}

## 5. Example 1 — Allow an Application to Read Objects

Imagine:

```
EC2
 |
 └── IAM Role
       |
       └── MyApplicationRole
              |
              └── GetObject
                    |
                    ↓
                 S3 Bucket
```

Bucket:

```
company-prod-data
```

Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowApplicationRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/MyApplicationRole"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::company-prod-data/*"
    }
  ]
}
```

Now:

```
EC2
 ↓
IAM Role
 ↓
S3 Bucket
 ↓
GetObject
```

The application can download objects.

But it cannot necessarily:

```
Upload
Delete
List
```

because we only granted:

```
s3:GetObject
```

## 6. Example 2 — Allow Application to Upload

Suppose your application needs to upload files.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowApplicationUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/MyApplicationRole"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::company-prod-data/uploads/*"
    }
  ]
}
```

Notice something important:

```
uploads/*
```

The application can upload only inside:

```
uploads/
```

It doesn't automatically get access to every object in the bucket.

This is an example of **least privilege**.

## 7. Example 3 — Read + Write

Suppose the application needs both:

```
GET
PUT
```

Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowApplicationReadWrite",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/MyApplicationRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::company-prod-data/*"
    }
  ]
}
```

The application can:

```
Upload → YES
Download → YES
Delete → NO
```

because we haven't granted:

```
s3:DeleteObject
```

## 8. Example 4 — Public Read Bucket

Suppose you have a static website:

```
S3
 |
 ├── index.html
 ├── css/
 ├── js/
 └── images/
```

You want anyone on the internet to download objects.

Policy could look like:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-public-website/*"
    }
  ]
}
```

Now:

```
Internet User
      |
      ↓
     S3
      |
      ↓
 GetObject
```

Anyone can read objects.

### But there's a catch

Amazon S3 **Block Public Access** settings can prevent public bucket policies from actually making data public.

So in an interview, don't simply say:

> "Put Principal \* and it becomes public."

A better answer is:

> "I can use a bucket policy with `Principal: "*"`, but S3 Block Public Access must also permit that public access. In production, I normally avoid exposing the bucket directly and prefer CloudFront with Origin Access Control."

## 9. Example 5 — Cross-Account Access

This is one of the most common real-world use cases.

Imagine two AWS accounts:

```
Account A
Production
123456789012

Account B
Analytics
987654321098
```

S3 bucket belongs to:

```
Account A
```

Analytics application runs in:

```
Account B
```

Requirement:

> Account B needs to read objects from Account A's S3 bucket.

Architecture:

```
Account B
Analytics EC2/EKS
       |
       ↓
IAM Role
       |
       ↓
Account A
S3 Bucket
```

Bucket policy in Account A:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAnalyticsAccountRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::987654321098:role/AnalyticsRole"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::prod-company-data/*"
    }
  ]
}
```

Now Account B's role is trusted by the bucket.

{% hint style="info" %}
**Cross-account access generally requires permission on both sides.**
{% endhint %}

The role in Account B needs an identity-based policy allowing the S3 operation, and the bucket in Account A needs a resource-based policy allowing that principal.

```
Account B IAM Policy
        +
Account A Bucket Policy
        =
Cross-account access
```

## 10. Example 6 — Deny Access from Outside Your VPC Endpoint

This is a very useful production scenario.

Suppose:

```
S3 bucket
company-private-data
```

You want applications to access it only through an **S3 VPC endpoint**.

For example:

```
Private EC2
    |
    ↓
   VPC
    |
    ↓
S3 VPC Endpoint
    |
    ↓
   S3
```

You can use a bucket policy with a condition based on:

```
aws:SourceVpce
```

Example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideVPCEndpoint",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::company-private-data",
        "arn:aws:s3:::company-private-data/*"
      ],
      "Condition": {
        "StringNotEquals": {
          "aws:SourceVpce": "vpce-0123456789abcdef0"
        }
      }
    }
  ]
}
```

Meaning:

> Deny S3 access if the request doesn't come through the specified VPC endpoint.

This is a powerful security pattern.

## 11. Example 7 — Deny Non-HTTPS Access

This is another excellent production example.

You want:

```
HTTPS → ALLOW
HTTP → DENY
```

Bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::company-private-data",
        "arn:aws:s3:::company-private-data/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

This is saying:

```
If HTTPS = false
       ↓
     Deny
```

This is commonly used as a security control.

## 12. Example 8 — Allow Only Specific Prefix

Suppose your bucket looks like:

```
company-data/
│
├── finance/
├── hr/
├── devops/
└── application/
```

You want the DevOps role to access only:

```
devops/
```

You can restrict the object resources:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowDevOpsPrefix",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/DevOpsRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::company-data/devops/*"
    }
  ]
}
```

So:

```
devops/file1.txt
       ↓
     ALLOW

finance/file1.txt
       ↓
    NO ACCESS
```

## 13. Bucket Policy for `ListBucket`

This is where many candidates make mistakes.

Suppose:

```
s3:ListBucket
```

You need the **bucket ARN**:

```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:role/MyRole"
  },
  "Action": "s3:ListBucket",
  "Resource": "arn:aws:s3:::company-data"
}
```

Not:

```
arn:aws:s3:::company-data/*
```

Because `ListBucket` is a bucket-level operation.

## 14. Read + List Example

Suppose an application needs:

```
List files
+
Download files
```

You need two different resource types:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowListBucket",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/AppRole"
      },
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::company-data"
    },
    {
      "Sid": "AllowReadObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/AppRole"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::company-data/*"
    }
  ]
}
```

This distinction is worth remembering:

```
ListBucket
   ↓
Bucket ARN

GetObject
   ↓
Object ARN
```

## 15. `Condition`

`Condition` allows you to make the permission more specific.

For example:

```
Only HTTPS
Only specific VPC endpoint
Only specific IP address
Only specific encryption
Only certain prefixes
```

Example:

```json
"Condition": {
  "IpAddress": {
    "aws:SourceIp": "203.0.113.10/32"
  }
}
```

This means access is allowed only from that source IP, assuming the rest of the policy grants the action.

## 16. Example — Restrict Access by IP

Suppose your company office public IP is:

```
203.0.113.10
```

You can allow access only from that IP:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowOfficeAccess",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::company-private-data/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.10/32"
        }
      }
    }
  ]
}
```

{% hint style="warning" %}
Be careful with network architectures such as NAT gateways, proxies, and VPC endpoints because the source context seen by AWS may differ from what you expect.
{% endhint %}

## 17. S3 Bucket Policy Evaluation — Very Important

When a request comes to S3, AWS evaluates the applicable policies.

A simplified mental model:

```
                Request
                   |
                   ↓
        ┌─────────────────────┐
        │ AWS Authorization   │
        │     Evaluation      │
        └─────────────────────┘
                   |
        ┌──────────┴──────────┐
        ↓                     ↓
 Identity policies      Resource policies
        |                     |
        └──────────┬──────────┘
                   ↓
             Explicit Deny?
              /          \
            YES           NO
             |             |
          DENIED       Is there
                       applicable
                       Allow?
                         |
                    YES → ALLOW
                    NO  → DENY
```

{% hint style="warning" %}
**Explicit Deny wins.**
{% endhint %}

## 18. Real-Time Production Scenario

Let's say you're working on an e-commerce application.

Architecture:

```
                  Internet
                     |
                     ↓
               Load Balancer
                     |
                     ↓
              EKS Application
                     |
                     ↓
               IAM Role
                     |
                     ↓
              S3 Product Bucket
```

Bucket:

```
ecommerce-prod-assets
```

Application needs to:

```
READ product images
UPLOAD user documents
```

But it should not:

```
DELETE objects
```

A policy could grant:

```
GetObject
PutObject
```

but not:

```
DeleteObject
```

For example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ApplicationReadWrite",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/EcommerceAppRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::ecommerce-prod-assets/products/*",
        "arn:aws:s3:::ecommerce-prod-assets/uploads/*"
      ]
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::ecommerce-prod-assets",
        "arn:aws:s3:::ecommerce-prod-assets/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

Now we have:

```
Application
   |
   +---- products/* ----> READ
   |
   +---- uploads/* -----> READ + WRITE
   |
   └---- DELETE ---------> NO
```

## 19. S3 Bucket Policy vs Access Control List

Historically S3 had:

```
ACL
```

and:

```
Bucket Policy
```

Today, for most modern S3 designs, AWS recommends using **S3 Object Ownership with ACLs disabled** and managing access primarily through IAM and bucket policies.

So in a modern project, I would generally prefer:

```
IAM
+
Bucket Policy
+
Block Public Access
+
S3 Object Ownership
```

rather than relying on ACLs.

## 20. S3 Bucket Policy + Block Public Access

This is an important security concept.

Imagine:

```
Bucket Policy
     |
     ↓
Principal: *
     |
     ↓
Allow GetObject
```

But:

```
S3 Block Public Access
     |
     ↓
BLOCK
```

Public access can still be prevented.

That's why when troubleshooting public S3 access, I check both:

```
1. Bucket policy
2. Block Public Access settings
```

And potentially account-level or organization-level controls as well.

## 21. Common Interview Question

<details>

<summary>Interviewer: "I have given <code>s3:GetObject</code> permission but I'm getting AccessDenied. What will you check?"</summary>

A strong real-world answer:

> "First I'd verify which principal is making the request and whether the correct IAM role is actually being assumed. Then I'd check the IAM policy and the S3 bucket policy, making sure the action and resource ARN are correct. For example, `GetObject` needs the object ARN with `/*`, whereas `ListBucket` uses the bucket ARN. I'd also check for an explicit Deny from the bucket policy, SCP, permissions boundary, session policy, VPC endpoint policy, or other applicable controls. If the bucket uses SSE-KMS, I'd also verify the role has the required KMS permissions. Finally, I'd check S3 Block Public Access if public access is involved."

That's much stronger than simply saying:

> "Check the IAM policy."

</details>

## 22. Another Interview Scenario

<details>

<summary>Interviewer: "How would you secure an S3 bucket in production?"</summary>

You could answer:

> "I normally start with Block Public Access enabled unless public access is explicitly required. I use IAM roles rather than long-lived access keys, apply least privilege, and use bucket policies for resource-level controls such as cross-account access or restricting access through a VPC endpoint. I also enforce HTTPS using `aws:SecureTransport`, enable encryption, preferably SSE-KMS when centralized key control is required, enable versioning where appropriate, and configure logging or CloudTrail monitoring. For applications running on EC2 or EKS, I use IAM roles rather than storing AWS credentials inside the application."

</details>

## 23. A Complete Production Example

Imagine:

```
                 Users
                   |
                   ↓
              CloudFront
                   |
                   ↓
            S3 Static Assets
                   |
                   ↓
             Private Bucket
```

Application:

```
EKS
 |
 └── Application Pod
          |
          └── IAM Role
                 |
                 ↓
               S3
```

Security requirements:

```
1. Bucket should not be publicly accessible
2. EKS application can read/write
3. Application cannot delete
4. HTTPS required
5. Access restricted through VPC endpoint
6. Encryption enabled
```

Conceptually:

```
                 S3
                  |
        ┌─────────┼─────────┐
        ↓         ↓         ↓
     IAM Role   Bucket    Conditions
                Policy
        |         |         |
        ↓         ↓         ↓
      Allow     Allow      HTTPS
      Read      App        VPCE
      Write     Access
        |
        ↓
    No Delete
```

This is much closer to how you would discuss S3 security in a Senior DevOps interview.

## 24. The 6 Things to Remember

When you see an S3 bucket policy, mentally ask:

```
1. WHO?
   ↓
   Principal

2. WHAT?
   ↓
   Action

3. WHICH RESOURCE?
   ↓
   Resource

4. ALLOW OR DENY?
   ↓
   Effect

5. UNDER WHAT CONDITION?
   ↓
   Condition

6. IS THERE AN EXPLICIT DENY?
   ↓
   Deny wins
```

And memorize this ARN distinction:

```
Bucket-level operation
        ↓
arn:aws:s3:::bucket-name

Object-level operation
        ↓
arn:aws:s3:::bucket-name/*
```

Especially:

```
s3:ListBucket
       ↓
Bucket ARN

s3:GetObject
       ↓
Object ARN

s3:PutObject
       ↓
Object ARN

s3:DeleteObject
       ↓
Object ARN
```

That one distinction will save you from a lot of S3 permission errors in real projects and interviews.

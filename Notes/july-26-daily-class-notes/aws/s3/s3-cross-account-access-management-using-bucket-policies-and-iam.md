# s3 cross account access management using bucket policies and iam

Managing access to Amazon S3 buckets across AWS accounts is a common requirement in multi-account architectures. AWS provides several tools and mechanisms to grant access, including bucket policies, IAM roles, and access control lists (ACLs).

## Concepts

**Bucket Policies**:

* JSON-based access control statements are applied directly to an S3 bucket.
* This allows us to specify who can access the bucket and under what conditions.

**IAM Roles**:

* Enable temporary access to AWS resources for entities (users, applications, or AWS accounts).
* Roles can be assumed by an external AWS account, granting permissions defined in the role’s policy.

**Typical Use Cases**:

* Account A needs to read/write objects in Account B’s S3 bucket.
* Cross-account collaboration is where data is shared between departments or teams.

## Setup Process

### Grant Access Using Bucket Policies

A bucket policy allows us to define permissions for external accounts directly on the S3 bucket.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "s3:Get*",
      "Resource": "arn:aws:s3:::example-bucket/*"
    }
  ]
}
```

**Explanation:**

* **Effect**: Defines whether to allow or deny the request.
* **Principal**: Specifies the AWS account (e.g., `123456789012`) that will be granted access.
* **Action**: Defines the permitted operations (e.g., `s3:Get*`).
* **Resource**: Identifies the bucket and objects to which the policy applies.

{% stepper %}
{% step %}
## Open the S3 console

Open the **S3 console** in Account B.
{% endstep %}

{% step %}
## Select the bucket

Select the bucket for cross-account access.
{% endstep %}

{% step %}
## Edit the bucket policy

Edit the **Bucket Policy**.
{% endstep %}

{% step %}
## Save the policy

Paste the bucket policy JSON and save changes.
{% endstep %}
{% endstepper %}

### Use IAM Roles for Cross-Account Access

IAM roles provide more flexibility and security for cross-account access compared to bucket policies alone.

{% stepper %}
{% step %}
## Create a role in Account B

* Go to the IAM console in Account B.
* Create a new role and select **Another AWS Account** as the trusted entity.
* Enter the Account A ID (e.g., `123456789012`) as the trusted account.
* Attach an appropriate policy granting access to the S3 bucket (e.g., `s3:ListBucket`, `s3:GetObject`).

**IAM Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::example-bucket/*"
      ]
    }
  ]
}
```
{% endstep %}

{% step %}
## Assume the role in Account A

In Account A, set up permissions for a user or application to assume the role in Account B.

**IAM Policy in Account A:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::987654321098:role/RoleName"
    }
  ]
}
```
{% endstep %}

{% step %}
## Access S3 resources in Account B

Use AWS SDK, CLI, or other tools to assume the role and interact with the S3 bucket.

**Assume Role Using AWS CLI:**

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::987654321098:role/RoleName \
  --role-session-name CrossAccountSession
```

Use the temporary credentials returned by the command to access S3 resources.
{% endstep %}
{% endstepper %}

## Best Practices

* **Use Least Privilege**: Grant only the permissions required for the intended operation.
* **Monitor and Audit**: Enable logging using Amazon S3 server access logs.
* **Encrypt Data**: Use server-side encryption (SSE) or client-side encryption.
* **Rotate IAM Roles**: Regularly rotate access credentials and review roles.

## Troubleshooting Tips

<details>

<summary>Access Denied Errors</summary>

* Verify that both bucket policies and IAM policies grant the necessary permissions.
* Check the resource ARNs in policies for typos.

</details>

<details>

<summary>Role Assumption Issues</summary>

* Ensure the trusted account is correctly specified in the role trust policy.
* Validate the role session credentials and permissions.

</details>

<details>

<summary>Testing Permissions</summary>

Use AWS Policy Simulator to validate access configurations.

</details>

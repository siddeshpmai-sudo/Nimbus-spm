# IAM



<figure><img src="https://miro.medium.com/v2/resize:fit:700/0*Y6EtSetQVHFGYFbC" alt="" height="368" width="700"><figcaption></figcaption></figure>

### Introduction <a href="#id-5de6" id="id-5de6"></a>

In the vast cloud universe of Amazon Web Services (AWS), navigating the cosmos of identity and access management is a crucial journey. AWS IAM serves as the spacecraft, allowing users to soar through the clouds securely and efficiently. In this article, we’ll embark on an exploration of key IAM components, including IAM Users, IAM Roles, and the cosmic phenomenon known as Temporary Credentials. 🛰️✨

### Key Features of AWS IAM 🚀🔒 <a href="#id-92dd" id="id-92dd"></a>

1. User Management: IAM enables the creation and management of users, representing individuals or entities requiring access to AWS resources. Users are equipped with unique security credentials, ensuring a personalized and secure access experience. 👦🔐
2. Group Organization: To streamline access management, IAM allows the grouping of users into logical units known as groups. Policies can be assigned to groups, simplifying the process of assigning and revoking permissions for multiple users simultaneously. 🏢👥
3. Role-Based Access Control: IAM introduces the concept of roles, which are similar to users but are assumed by entities like AWS services, applications, or temporary users. Roles define specific permissions, promoting the principle of least privilege by granting only necessary access. 👦🔐
4. Granular Permissions with Policies: IAM policies, written in JSON, define the permissions for users, groups, and roles. These policies allow for fine-grained control over actions and resources, ensuring that users have the precise level of access required for their tasks. 🖥️🔑
5. Multi-Factor Authentication (MFA): Enhancing security, IAM supports multi-factor authentication. This additional layer of verification strengthens access controls, requiring users to provide a secondary authentication method beyond passwords. 🔐🔄📱
6. Identity Federation: IAM facilitates identity federation, allowing organizations to integrate their existing identity systems with AWS. This streamlines user management, providing a seamless experience for users who can use their corporate credentials to access AWS resources. 🌐🤝

### **|&#x20;**_**Components of AWS IAM**_ <a href="#id-5480" id="id-5480"></a>

1. Users: IAM users are the entities representing individuals, applications, or services that interact with AWS. Each user has a unique set of security credentials, including an access key and secret key. 👦
2. Groups: Groups are collections of IAM users. By organizing users into groups, administrators can apply policies at the group level, simplifying the management of permissions for users with similar roles or responsibilities. 👥
3. Roles: IAM roles are entities with permissions that define what actions entities can or cannot perform. Roles are assumed by users, groups, or AWS services, allowing for flexible access control across various scenarios. 🦸‍♂️🔑

_IAM users and IAM roles are both entities in AWS Identity and Access Management (IAM) that are used to manage and control access to AWS resources, but they serve different purposes._

### | IAM User <a href="#id-595f" id="id-595f"></a>

**A. Definition:**

* IAM user represents a person or an application that interacts with AWS services. It is a permanent identity associated with specific security credentials (username and password or access keys).

**B. Purpose:**

* IAM users are typically used for long-term access. They are suitable for individuals, employees, or services that require ongoing, persistent access to AWS resources.

**C. Access Credentials:**

* IAM users have their own access credentials (username/password or access keys) that are used for authentication when interacting with AWS services programmatically or through the AWS Management Console.

**D. Authentication:**

* IAM users can authenticate using their assigned credentials (username/password or access keys). They can also enable multi-factor authentication (MFA) for an additional layer of security.

**Example Use Case:**

* An IAM user might be created for a developer who needs continuous access to AWS resources for coding and testing purposes.

### | IAM Role <a href="#id-16bf" id="id-16bf"></a>

**A. Definition:**

* IAM role is an AWS identity with permissions policies attached. Unlike IAM users, roles do not have permanent credentials. Instead, they are assumed by trusted entities to obtain temporary security credentials.

**B. Purpose:**

* IAM roles are designed for temporary access needs. They are often used for cross-account access, allowing entities from one AWS account to assume a role in another account to access resources.

**C. Access Credentials:**

* IAM roles do not have long-term access credentials like usernames or passwords. Instead, they provide temporary security credentials that are obtained by assuming the role.

**D. Authentication:**

* To assume a role, an entity (user, application, or AWS service) must request temporary security credentials. The entity must be authenticated before assuming the role.

**E. Example Use Case:**

* A role might be created with specific permissions to access an Amazon S3 bucket. An EC2 instance, an AWS Lambda function, or an IAM user in a different account can assume this role to access the S3 bucket temporarily.

### Key Differences in IAM User & Role <a href="#bc25" id="bc25"></a>

**A. Authentication and Credentials:**

* IAM users have permanent access credentials (password or access keys) for ongoing access. IAM roles, on the other hand, provide temporary security credentials obtained by assuming the role.

**Use Cases:**

* IAM users are suitable for individuals or applications that require continuous, long-term access. IAM roles are designed for temporary access needs, especially for cross-account access scenarios.

**B. Access Management:**

* Access to IAM users is managed through the user’s own credentials. Access to IAM roles is managed by assuming the role, and permissions are defined in policies attached to the role.

**C. Credentials Rotation:**

* IAM users may need their credentials rotated periodically for security reasons. IAM roles, with temporary credentials, inherently have a form of automatic rotation since the credentials are short-lived.

In summary, IAM users are permanent identities with long-term access credentials, while IAM roles are temporary identities with temporary credentials designed for specific use cases, such as cross-account access or temporary access needs.

### | IAM Group <a href="#id-416b" id="id-416b"></a>

**A. Definition:**

* IAM groups in Amazon Web Services (AWS) Identity and Access Management (IAM) are entities that enable you to manage and control access for a collection of IAM users. Instead of attaching policies directly to individual users, you can organize users into groups and attach policies to those groups, which simplifies the process of granting permissions to multiple users with similar roles or responsibilities.

**B. Purpose:**

* IAM groups provide a logical means of organizing IAM users. Instead of attaching policies directly to individual users, policies are associated with groups, simplifying the management of permissions for users with similar responsibilities.

**C. Access Credentials:**

* IAM groups, like roles, do not have their own access credentials. Users within a group retain their individual credentials. Group membership is utilized for permission management.

**D. Dynamic Membership:**

* Group membership is dynamic, allowing users to be added or removed at any time. This flexibility ensures that permissions can be easily adjusted based on changes in roles or responsibilities.

**E. Ease of Administration:**

* Managing access becomes more straightforward with IAM groups. Policies are applied at the group level, streamlining the process of granting or revoking permissions for multiple users simultaneously.

**Example Use Case:**

* Consider an organization with various teams, each responsible for different aspects of AWS resources. IAM groups, such as “Development,” “Operations,” or “Finance,” can be created, and policies defining team-specific permissions are attached to these groups. Users are then added to the relevant group, inheriting the associated permissions.

### | Understanding IAM Policies 📜🚀🔐 <a href="#baf3" id="baf3"></a>

In AWS Identity and Access Management (IAM), policies are JSON documents that define permissions and can be attached to IAM users, groups, or roles. There are several types of policies in IAM, each serving a specific purpose. Here are the main types of policies:

**A. Managed Policies:**

* Explanation: Managed policies are standalone policies that you create and manage independently of any user, group, or role. These policies can be attached to multiple users, groups, or roles. AWS provides a set of predefined managed policies that cover common use cases, such as read-only access or full administrative access.

**Example:**

```
  jsonCopy code{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::example-bucket/*"
      }
    ]
  }
```

**B. Inline Policies:**

* Explanation: Inline policies are policies that you create and manage directly within a user, group, or role. Unlike managed policies, inline policies are embedded directly in the IAM entity to which they apply.

**Example:**

```
  jsonCopy code{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "ec2:StartInstances",
        "Resource": "arn:aws:ec2:region:account-id:instance/instance-id"
      },
      {
        "Effect": "Allow",
        "Action": "ec2:StopInstances",
        "Resource": "arn:aws:ec2:region:account-id:instance/instance-id"
      }
    ]
  }
```

**C. AWS Managed Policies:**

* Explanation: AWS Managed Policies are predefined policies created and managed by AWS. These policies cover common use cases and are maintained by AWS. You can attach these policies directly to IAM users, groups, or roles.
* Example: AWS managed policies include policies like `AmazonS3ReadOnlyAccess` or `AmazonEC2FullAccess`, which provide specific permissions for read-only access to S3 or full administrative access to EC2, respectively.

**D. Boundary Policies:**

* Explanation: Boundary policies are used to set the maximum permissions that a user, group, or role can have. These policies are set at the entity level and define the boundary of allowed permissions. They are useful for limiting the scope of permissions within an AWS environment.
* Example: A boundary policy might restrict users from creating or modifying IAM roles, effectively limiting their ability to grant certain types of permissions.

**E. Resource-based Policies:**

* Explanation: Resource-based policies are attached to AWS resources, defining who has access to the resource and what actions they can perform. While not specifically IAM policies, resource-based policies play a role in access control within AWS.
* Example: An Amazon S3 bucket policy is a resource-based policy that specifies which AWS accounts or users are allowed to access objects in the S3 bucket.

_These policy types provide flexibility in defining and managing permissions within AWS IAM. When creating and attaching policies, it’s important to follow the principle of least privilege to ensure that entities have only the permissions they need to perform their intended tasks._

### | IAM Role Delegation <a href="#id-9d57" id="id-9d57"></a>

In the context of AWS Identity and Access Management (IAM), delegation refers to the process of assigning permissions to entities (such as IAM users or AWS services) by creating IAM roles. IAM role delegation is a fundamental concept in AWS that allows you to grant temporary permissions to entities or services for specific tasks or actions. This is achieved by assuming an IAM role, which provides temporary security credentials with a defined set of permissions.

Here are key points related to IAM role delegation:

**A. Temporary Permissions:**

* IAM roles provide temporary security credentials that entities use to access AWS resources. These credentials have a limited lifespan and are automatically rotated by AWS.

**B. Least Privilege Principle:**

* IAM role delegation follows the principle of least privilege. Instead of assigning permanent, broad permissions to entities, you can create IAM roles with the minimum set of permissions needed to perform a specific task.

**C. Role Assumption:**

* Entities, such as IAM users or AWS services, can assume IAM roles to obtain temporary credentials. This involves making a request to assume the role and receiving temporary security credentials in return.

**D. Cross-Account Access:**

* IAM role delegation is commonly used for cross-account access. It allows entities in one AWS account to assume a role in another AWS account, providing a secure way to access resources across accounts.

**E. Federated Access:**

* IAM roles support federated access, enabling you to integrate with external identity providers (IdPs) such as Active Directory. Users authenticated by the IdP can assume an IAM role to gain access to AWS resources.

**F. Service Roles:**

* IAM roles are often used by AWS services to interact with other AWS services on your behalf. For example, an Amazon EC2 instance can assume an IAM role to access Amazon S3 buckets without requiring long-term access keys.

**G. Delegated Roles for Applications:**

* IAM roles can be created specifically for applications running on EC2 instances, Lambda functions, or other AWS services. Applications assume these roles to perform tasks or access resources securely.

**H. Policy-Based Permissions:**

* Permissions for IAM roles are defined through policies. These policies specify the actions allowed or denied and the resources on which those actions can be performed.

Here’s a simplified example of creating an IAM role through the AWS Management Console:



**a. Navigate to IAM Console:**

* Open the IAM console in the AWS Management Console.

**b. Create a Role:**

* In the navigation pane, choose “Roles,” and then choose “Create Role.”
* Choose the type of trusted entity (e.g., AWS service, another AWS account, or SSO identity provider).
* Follow the steps to configure the role, including attaching policies that define the permissions.

**c. Role Assumption:**

* Once the role is created, entities can assume the role by making an AssumeRole API call and receiving temporary security credentials that grant the specified permissions.

_IAM role delegation enhances security by providing a flexible and scalable way to grant access across AWS accounts and services without compromising long-term security credentials or granting unnecessary permissions._

### | Cross-Account Permissions ↔️🔐 <a href="#id-2fd7" id="id-2fd7"></a>

Cross-account permissions in AWS Identity and Access Management (IAM) refer to the ability to grant access to AWS resources in one AWS account to entities (such as IAM users, groups, or roles) from a different AWS account. This is a common scenario in multi-account architectures where different AWS accounts are used for various purposes, such as development, testing, and production.

Key points related to cross-account permissions in IAM:

**A. Trust Relationship:**

* To enable cross-account access, a trust relationship must be established between the trusting account (the account that owns the resource) and the trusted account (the account that needs access to the resource).

**B. IAM Role:**

* Access is typically granted by creating an IAM role in the trusting account and specifying the trusted account as the principal in the role’s trust policy. The trust policy defines which entities from the trusted account are allowed to assume the role.

**C. Assumption of Role:**

* Entities (IAM users, roles, or AWS services) in the trusted account assume the IAM role in the trusting account to obtain temporary security credentials. These temporary credentials allow the entities to access resources in the trusting account based on the permissions defined in the role’s policies.

**D. Least Privilege Principle:**

* The permissions granted through cross-account roles should follow the principle of least privilege. Only the minimum necessary permissions required for the task or access should be granted to entities assuming the role.

**Example Use Cases:**

Cross-account permissions are often used in scenarios such as:

* Allowing a central security account to audit or monitor resources in other accounts.
* Enabling a shared services account to provide services (e.g., database hosting) to other accounts.
* Allowing a development account to deploy resources in a production account.

**E. Policy Example:**

* Below is a simplified example of a trust policy for an IAM role in the trusting account:

```
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": "arn:aws:iam::trusted-account-id:root"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
```

This policy allows the root user of the trusted account to assume the role.

**F. Cross-Account Resource Sharing:**

* Cross-account permissions are not limited to IAM roles; they can also apply to cross-account resource sharing, where resources like Amazon S3 buckets or Amazon RDS databases are shared between accounts.

_Enabling cross-account permissions is a powerful capability in AWS IAM that supports a secure and controlled way to share resources and services across different AWS accounts. It allows organizations to implement a separation of concerns and maintain a strong security posture while collaborating across multiple accounts._

### | IAM users and SSO <a href="#id-6485" id="id-6485"></a>

IAM users and Single Sign-On (SSO) are both concepts related to identity and access management in Amazon Web Services (AWS), but they serve different purposes.

### IAM Users: <a href="#c9be" id="c9be"></a>

**A. Definition:**

* IAM users are entities within AWS Identity and Access Management (IAM) that represent individual users, applications, or services needing access to AWS resources. Each IAM user has a unique identity with associated credentials (username and password or access keys).

**B. Access Control:**

* IAM users are used for controlling access to AWS services and resources. You can define permissions for IAM users by attaching policies, specifying what actions they are allowed or denied on which resources.

**C. Long-Term Access:**

* IAM users are designed for long-term access and are suitable for individuals, developers, or services that require persistent access to AWS resources.

**D. Authentication:**

* IAM users can authenticate using their assigned credentials (username/password or access keys). Multi-Factor Authentication (MFA) can be enabled for additional security.

**Example Use Case:**

* An IAM user might be created for a developer who needs continuous access to AWS services for development and testing purposes.

### Single Sign-On (SSO): <a href="#id-3e6c" id="id-3e6c"></a>

**A. Definition:**

* Single Sign-On (SSO) is an authentication process that allows a user to log in once and gain access to multiple applications or services without having to log in separately to each one.

**B. Access Control:**

* SSO is not specific to AWS IAM; it is a broader concept that applies to various systems and applications. In the context of AWS, AWS Single Sign-On is a service that allows users to sign in once to a central identity provider and then access multiple AWS accounts and applications.

**C. Centralized Authentication:**

* SSO provides centralized authentication, allowing users to authenticate once using their corporate credentials or a central identity provider. Once authenticated, users can access various integrated applications without additional logins.

**D. Federated Access:**

* SSO often involves federated access, where trust is established between the identity provider and the service providers (e.g., AWS). In the case of AWS, federated access is achieved using standards like Security Assertion Markup Language (SAML).

**E. Temporary Credentials:**

* SSO can also be used in conjunction with IAM roles to provide temporary credentials for users. This allows users to assume roles with specific permissions in AWS accounts.

**Example Use Case:**

* An organization might implement AWS Single Sign-On to allow employees to use their corporate credentials to access various AWS accounts and services without having separate AWS IAM user accounts.

### Key Differences: <a href="#id-7625" id="id-7625"></a>

**Scope:**

* IAM users are specific to AWS and are used for managing access within the AWS ecosystem. SSO is a broader concept that can apply to various systems and services, including AWS.

**Access Duration:**

* IAM users are designed for long-term access, while SSO often involves obtaining temporary credentials or tokens for shorter durations, especially when used with IAM roles.

**Authentication Method:**

* IAM users typically authenticate using AWS-specific credentials. SSO involves centralized authentication, often using corporate credentials or a central identity provider.

**Centralized Management:**

* SSO provides a centralized way to manage authentication and access across multiple services. IAM users are managed within the AWS IAM service.

_Both IAM users and SSO are important components in identity and access management, and organizations often use them in combination to provide secure and efficient access to AWS resources._

### | Temporary Credentials — IAM <a href="#id-8e74" id="id-8e74"></a>

Temporary credentials, the shooting stars of IAM, illuminate the sky with secure, short-lived permissions. ⭐ Dynamically generated when entities assume IAM roles or federated users authenticate, these credentials are designed for specific tasks or sessions.

Here are key points related to IAM temporary credentials:

**Purpose:**

* Temporary credentials are generated to grant access to AWS resources for a limited time. They provide a way to delegate permissions to entities without requiring the use of long-term security credentials, such as access keys or passwords.

**IAM Role Assumption:**

* IAM roles can be assumed by IAM users, AWS services, or federated users (authenticated by an external identity provider). When a role is assumed, temporary security credentials are issued to the entity making the assumption.

**Federated Access:**

* For federated access, temporary credentials are often obtained through the process of federated authentication. This involves users authenticating against an identity provider using standards like Security Assertion Markup Language (SAML), OpenID Connect, or others.

**Limited Duration:**

* Temporary credentials have an associated expiration time. Once the credentials expire, they are no longer valid for making AWS API requests. The expiration time is a security feature that helps mitigate the risk of credentials being misused.

**Automatic Rotation:**

* AWS automatically rotates temporary credentials, meaning that when they near expiration, the entity can request new credentials without requiring additional user intervention. This helps maintain security by regularly refreshing the credentials.

**Security Token Service (STS):**

* The AWS Security Token Service (STS) is the service responsible for issuing temporary credentials. Entities use the AssumeRole API or similar operations to request temporary credentials from STS.

**IAM Policies and Permissions:**

* Temporary credentials are associated with IAM policies that define the permissions granted to the entity during the duration of the session. These policies follow the same JSON-based syntax as policies attached to IAM users or roles.

**Example Use Cases:**

Temporary credentials are commonly used in scenarios such as:

* IAM users assuming roles to perform specific tasks or access resources.
* Federated users accessing AWS resources after authenticating through an identity provider.
* AWS services assuming roles to access resources securely.

Here’s a simplified example of how an IAM user can assume a role to obtain temporary credentials using the AWS CLI:

```
aws sts assume-role --role-arn arn:aws:iam::account-id:role/RoleName --role-session-name ExampleSession
```

In this example, the `sts assume-role` command is used to request temporary credentials by assuming a specific IAM role.

_IAM temporary credentials provide a secure and flexible way to grant access to AWS resources without exposing long-term credentials. They are a key component of identity and access management in AWS._

# cloudformation

Master the architecture, template anatomy, intrinsic functions, and practical deployment of AWS native Infrastructure as Code. Follow the step-by-step lab to provision a complete web application stack, test safe updates with Change Sets, and detect manual configuration drift.

| Prerequisites                            | Languages   | Cost                    |
| ---------------------------------------- | ----------- | ----------------------- |
| AWS Free Tier Account & Basic Networking | YAML / JSON | 100% Free-Tier Eligible |

{% hint style="warning" %}
**Student Reminder:** Delete your CloudFormation stack at the conclusion of the lab to prevent unexpected AWS cloud charges.
{% endhint %}

## What is AWS CloudFormation & Template Anatomy

**AWS CloudFormation** is a managed service that allows you to model, provision, and configure AWS and third-party resources declaratively using text templates (YAML or JSON). It provides a single source of truth for your cloud environment, automating provisioning and life-cycle management without manual console operations.

{% hint style="info" %}
**Key Distinction:** Unlike Terraform, CloudFormation requires **zero local state files** (`.tfstate`). AWS manages the state engine, concurrency locks, and execution graphs natively within the AWS platform for free.
{% endhint %}

### Core Terminology

**📜 Template**

A declarative JSON or YAML file that describes the desired state of all AWS resources you want to create and configure.

**📦 Stack**

A collection of AWS resources managed as a single unit. When a stack is created, updated, or deleted, all underlying resources are handled together.

**🛡️ Change Set**

A point-in-time preview of changes that CloudFormation will make to your stack, allowing you to audit whether updates will replace running servers before applying them.

**🌐 StackSet**

Extends stack management across multiple AWS accounts and multiple AWS regions with a single operation, natively integrated with AWS Organizations.

### The 8 Sections of a CloudFormation Template

Remember: **Only the `Resources` section is required.** The other 7 sections make your code flexible, reusable, and parameter-driven.

| Section                      | Required? | Description & Purpose                                                      |
| ---------------------------- | --------- | -------------------------------------------------------------------------- |
| **AWSTemplateFormatVersion** | No        | Defines template capability version (must be `"2010-09-09"`)               |
| **Description**              | No        | Text comment explaining the purpose of the template                        |
| **Parameters**               | No        | Custom runtime values passed into the template during stack creation       |
| **Mappings**                 | No        | Static multi-dimensional lookup tables (e.g. region-to-AMI mapping)        |
| **Conditions**               | No        | Boolean statements that control whether specific resources are provisioned |
| **Resources**                | **YES**   | Declares physical AWS infrastructure components (e.g. VPC, EC2, S3)        |
| **Outputs**                  | No        | Returns output values or exports them for downstream cross-stack import    |
| **Metadata**                 | No        | Supplemental JSON/YAML details (e.g. Designer canvas coordinates)          |

## Why CloudFormation is Used: The Business & Engineering Value

### 🔄 Automatic Rollback on Failure

If any resource encounters an error during creation or update (e.g. parameter error, quota limit), CloudFormation automatically rolls back all previously created resources to the last stable state.

### 🛡️ Native Console Drift Detection

Identify unapproved manual "ClickOps" changes directly in the AWS Console. CloudFormation provides a visual property-by-property diff showing exactly what was tampered with.

### ☁️ Zero Client-Side State Files

No risk of losing state files, no need to configure S3 remote backends with DynamoDB locking, and zero risk of concurrent state write collisions.

### 💸 Free Infrastructure Automation

CloudFormation has zero service fees. You are only billed for the actual AWS resources (EC2, VPC, Load Balancers) provisioned by your template.

## CloudFormation Real-Time DevOps Production Use Cases

{% stepper %}
{% step %}
### Layered Stacks via Cross-Stack References

Decoupling networking from application deployment.

**Pattern:** The VPC and subnets are defined in a `NetworkStack` that exports outputs. Application stacks import those values using `!ImportValue`. Network infrastructure remains untouched and protected while applications are continuously redeployed.
{% endstep %}

{% step %}
### Automated CI/CD with Change Sets

Safe, automated continuous delivery pipelines.

**Pattern:** AWS CodePipeline or GitHub Actions generates a CloudFormation Change Set on pull request. Engineers inspect the diff in the pipeline to verify no unexpected resource replacement before approving the deployment.
{% endstep %}

{% step %}
### Multi-Account Landing Zones (StackSets)

Enforcing organizational security baselines across 100+ AWS accounts.

**Pattern:** Integrated with AWS Organizations. Centrally provisions IAM audit roles, AWS Config conformance packs, and VPC flow logs across every child account automatically upon account creation.
{% endstep %}

{% step %}
### Custom Automation via Lambda Custom Resources

Extending CloudFormation to execute arbitrary code.

**Pattern:** Using `AWS::CloudFormation::CustomResource` to trigger a Python Lambda function that empties an S3 bucket before stack deletion, requests SSL certificates, or configures third-party SaaS services.
{% endstep %}
{% endstepper %}

## Hands-On Practice Lab: Web Stack Runbook

Follow the 8 sequential steps below. Check off each step as you complete it to track your progress!

{% stepper %}
{% step %}
### Save the CloudFormation Template (YAML)

Create a file named `cloudformation-web-stack.yaml` on your laptop and paste the complete template below:

{% code title="cloudformation-web-stack.yaml" %}
```yaml
AWSTemplateFormatVersion: "2010-09-09" Description: "AWS CloudFormation Masterclass Demo — Production Web Stack with Dynamic UserData and Outputs" # 1. PARAMETERS (Runtime user inputs) Parameters: EnvironmentName: Type: String Default: "Demo" AllowedValues: ["Demo", "Dev", "Staging", "Prod"] Description: "Deployment environment stage" InstanceType: Type: String Default: "t2.micro" AllowedValues: ["t2.micro", "t3.micro", "t3.small"] Description: "EC2 Instance type (Free-Tier eligible)" VpcCIDR: Type: String Default: "10.0.0.0/16" Description: "CIDR block for the custom VPC" PublicSubnetCIDR: Type: String Default: "10.0.1.0/24" Description: "CIDR block for the public subnet" # 2. MAPPINGS (Region-to-AMI dynamic lookup) Mappings: RegionMap: us-east-1: AMI: "ami-0c101f26f147fa7fd" us-east-2: AMI: "ami-0c55b159cbfafe1f0" us-west-2: AMI: "ami-0735c191cf9147f72" # 3. RESOURCES (Physical AWS components) Resources: # VPC CustomVPC: Type: AWS::EC2::VPC Properties: CidrBlock: !Ref VpcCIDR EnableDnsHostnames: true EnableDnsSupport: true Tags: - Key: Name Value: !Sub "${AWS::StackName}-VPC" - Key: Environment Value: !Ref EnvironmentName # Internet Gateway InternetGateway: Type: AWS::EC2::InternetGateway Properties: Tags: - Key: Name Value: !Sub "${AWS::StackName}-IGW" # Attach Gateway to VPC AttachGateway: Type: AWS::EC2::VPCGatewayAttachment Properties: VpcId: !Ref CustomVPC InternetGatewayId: !Ref InternetGateway # Public Subnet PublicSubnet: Type: AWS::EC2::Subnet Properties: VpcId: !Ref CustomVPC CidrBlock: !Ref PublicSubnetCIDR AvailabilityZone: !Select [0, !GetAZs ""] MapPublicIpOnLaunch: true Tags: - Key: Name Value: !Sub "${AWS::StackName}-PublicSubnet" # Route Table PublicRouteTable: Type: AWS::EC2::RouteTable Properties: VpcId: !Ref CustomVPC Tags: - Key: Name Value: !Sub "${AWS::StackName}-PublicRouteTable" # Default Outbound Route via IGW PublicRoute: Type: AWS::EC2::Route DependsOn: AttachGateway Properties: RouteTableId: !Ref PublicRouteTable DestinationCidrBlock: "0.0.0.0/0" GatewayId: !Ref InternetGateway # Associate Subnet with Route Table SubnetRouteTableAssociation: Type: AWS::EC2::SubnetRouteTableAssociation Properties: SubnetId: !Ref PublicSubnet RouteTableId: !Ref PublicRouteTable # Security Group WebServerSecurityGroup: Type: AWS::EC2::SecurityGroup Properties: GroupDescription: "Allow HTTP port 80 and outbound traffic" VpcId: !Ref CustomVPC SecurityGroupIngress: - IpProtocol: tcp FromPort: 80 ToPort: 80 CidrIp: "0.0.0.0/0" SecurityGroupEgress: - IpProtocol: "-1" CidrIp: "0.0.0.0/0" Tags: - Key: Name Value: !Sub "${AWS::StackName}-WebSG" # EC2 Web Server Instance WebServerInstance: Type: AWS::EC2::Instance Properties: InstanceType: !Ref InstanceType ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", AMI] SubnetId: !Ref PublicSubnet SecurityGroupIds: - !Ref WebServerSecurityGroup UserData: Fn::Base64: !Sub | #!/bin/bash dnf update -y dnf install -y httpd systemctl start httpd systemctl enable httpd TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600") INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id) AZ=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone) PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4) cat  /var/www/html/index.html    AWS CloudFormation Live Demo     PROVISIONED VIA AWS CLOUDFORMATION # 🔥 CloudFormation Stack Live! This entire infrastructure was provisioned 100% natively via CloudFormation Template.  **Stack Name:** ${AWS::StackName} **AWS Region:** ${AWS::Region} **Instance ID:** $INSTANCE_ID **Availability Zone:** $AZ **Public IP:** $PUBLIC_IP     HTML Tags: - Key: Name Value: !Sub "${AWS::StackName}-WebServer" # 4. OUTPUTS (Cross-stack exports & URLs) Outputs: WebsiteURL: Description: "Public URL of the provisioned web server" Value: !Sub "http://${WebServerInstance.PublicIp}" PublicIP: Description: "Public IP of the EC2 Instance" Value: !GetAtt WebServerInstance.PublicIp VpcId: Description: "VPC ID of the created infrastructure" Value: !Ref CustomVPC Export: Name: !Sub "${AWS::StackName}-VPCID"
```
{% endcode %}
{% endstep %}

{% step %}
### Inspect Template in CloudFormation Designer

1. Log in to the AWS Management Console and open **CloudFormation**.
2. Click **Create stack** ➔ **Create template in Designer** ➔ click **View in Designer**.
3. Paste the template YAML into the editor and click the **Refresh Canvas** icon to inspect the resource topology map.
{% endstep %}

{% step %}
### Deploy the Stack in AWS Console

1. In the CloudFormation Console, click **Create stack** ➔ **With new resources (standard)**.
2. Select **Upload a template file** and select `cloudformation-web-stack.yaml`. Click **Next**.
3. Enter Stack Name: `cfn-student-demo`.
4. Parameters: Leave the defaults (`EnvironmentName: Demo`, `InstanceType: t2.micro`).
5. Click **Next** ➔ **Next** ➔ **Submit**.

#### CLI Alternative

```bash
aws cloudformation create-stack \ --stack-name cfn-student-demo \ --template-body file://cloudformation-web-stack.yaml \ --parameters ParameterKey=EnvironmentName,ParameterValue=Demo \ --region us-east-1
```
{% endstep %}

{% step %}
### Monitor the Event Timeline

Navigate to the **Events** tab in the console. Watch CloudFormation resolve dependencies: provisioning the VPC and IGW first, attaching the gateway, building the subnet and route table, and finally launching the EC2 web server until status reaches `CREATE_COMPLETE`.
{% endstep %}

{% step %}
### Verify Live Web Application & Outputs

Click the **Outputs** tab in the CloudFormation Console.

Click the link next to `WebsiteURL`. Your browser loads the live server showing the dynamic stack name and metadata!
{% endstep %}

{% step %}
### Execute a Safe Update via Change Sets

1. Edit `cloudformation-web-stack.yaml` and update the `WebServerInstance` Tag to `cfn-student-demo-Audited`.
2. Select your stack ➔ click **Stack actions** ➔ **Create change set for current stack**.
3. Upload your modified YAML file and name the Change Set `audit-update`. Click through to **Submit**.
4. Inspect the Change Set table: verify that **Action: Modify** and **Replacement: False** (meaning zero server downtime!).
5. Click **Execute change set** to apply the update safely.
{% endstep %}

{% step %}
### Test Native Drift Detection

1. In a new tab, navigate to _EC2 ➔ Security Groups_ and locate `cfn-student-demo-WebSG`.
2. Add a rogue inbound rule: `Custom TCP Port 8080 from 0.0.0.0/0` and save.
3. Return to CloudFormation ➔ select your stack ➔ click **Stack actions** ➔ **Detect drift**.
4. Refresh after 10 seconds: the status transitions to **DRIFTED**!
5. Click **View drift results** to view the exact property delta highlighted in red.
{% endstep %}

{% step %}
### Mandatory Stack Deletion

{% hint style="danger" %}
**CRITICAL STEP:** Always delete your stack at the end of the lab to terminate all EC2 and VPC resources and prevent unwanted charges.
{% endhint %}

Click **Delete** in the top right of the stack page in the CloudFormation Console, or run:

```bash
aws cloudformation delete-stack --stack-name cfn-student-demo --region us-east-1
```
{% endstep %}
{% endstepper %}

## CloudFormation Intrinsic Functions Cheatsheet

| Function            | YAML Short Form                 | Description & Return Value                          | Example                                           |
| ------------------- | ------------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| **Ref**             | `!Ref LogicalID`                | Returns parameter value or resource physical ID     | `VpcId: !Ref CustomVPC`                           |
| **Fn::GetAtt**      | `!GetAtt LogicalID.Attribute`   | Retrieves specific attribute (DNS, ARN, IP)         | `PublicIp: !GetAtt MyEC2.PublicIp`                |
| **Fn::Sub**         | `!Sub "String-${Var}"`          | Substitutes variables dynamically in a string       | `Name: !Sub "${AWS::StackName}-subnet"`           |
| **Fn::Join**        | `!Join [Delimiter, [List]]`     | Concatenates a list of values with a delimiter      | `!Join [":", ["arn", "aws", "s3"]]`               |
| **Fn::FindInMap**   | `!FindInMap [Map, Key, SubKey]` | Looks up static value from `Mappings` block         | `!FindInMap [RegionMap, !Ref "AWS::Region", AMI]` |
| **Fn::Select**      | `!Select [Index, List]`         | Selects single item from list by 0-indexed position | `!Select [0, !GetAZs ""]`                         |
| **Fn::ImportValue** | `!ImportValue SharedOutput`     | Imports value exported by another independent stack | `VpcId: !ImportValue CoreVpcId`                   |

## Interactive Self-Assessment Quiz

<details>

<summary>Which of the 8 sections of a CloudFormation template is strictly mandatory?</summary>

A) Parameters

B) Resources

C) Outputs

**Correct!** `Resources` is the only mandatory section. All other sections (Parameters, Outputs, Mappings, etc.) are optional additions to enhance template reusability.

</details>

<details>

<summary>What is the purpose of creating a CloudFormation "Change Set" before updating a production stack?</summary>

A) To preview whether proposed changes will update resources in-place or trigger destructive server replacement.

B) To compile the template into a Go binary.

C) To automatically purchase EC2 Reserved Instances.

**Correct!** A Change Set acts as a safety preview showing exactly which resources will be added, modified, or destroyed before you commit the update to live production.

</details>

<details>

<summary>How does CloudFormation handle state management differently from Terraform?</summary>

A) CloudFormation requires you to create an encrypted local SQLite database.

B) CloudFormation manages state internally inside AWS; users do not need to configure or manage state files.

C) CloudFormation has no state tracking at all.

**Correct!** CloudFormation handles state management completely under the hood as a native AWS service, eliminating the need to set up S3 state backends or DynamoDB state locking.

</details>

## Troubleshooting FAQ & Error Resolution

<details>

<summary>Error: ROLLBACK_IN_PROGRESS / ROLLBACK_COMPLETE</summary>

A resource failed to provision (e.g. invalid CIDR or parameter).

**Fix:** Check the **Events** tab. Filter for `CREATE_FAILED`. The status reason will explain the exact failure (e.g. _"Subnet CIDR overlaps with another subnet"_). Fix the error in your YAML and re-create.

</details>

<details>

<summary>Error: Export [ExportName] cannot be deleted</summary>

Another stack is actively importing an output via `Fn::ImportValue`.

**Fix:** Delete the importing child stack first before attempting to delete or modify the parent exporting stack.

</details>

<details>

<summary>Error: Template format error: Unresolved resource</summary>

Typo in a `!Ref` or `!GetAtt` target.

**Fix:** Verify spelling and letter capitalization of logical IDs. Logical IDs are case-sensitive in CloudFormation.

</details>

### Resources for Practice

{% file src="../../.gitbook/assets/Cloudformation code.zip" %}


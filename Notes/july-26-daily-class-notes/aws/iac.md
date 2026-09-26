# IAC

Master the foundational concepts, architectural pillars, market tool comparison, and practical implementation of modern Infrastructure as Code. Follow the step-by-step Terraform lab to provision, mutate, drift-detect, and tear down AWS infrastructure.

{% hint style="warning" %}
**Student Reminder:** Always run `terraform destroy` at the conclusion of the lab to prevent unexpected AWS cloud charges.
{% endhint %}

* **Prerequisites:** Basic AWS & Terminal Concepts
* **Tools:** Terraform v1.5+ & AWS CLI
* **Lab Tier:** 100% Free-Tier Eligible

## What is Infrastructure as Code (IaC)?

**Infrastructure as Code (IaC)** is the practice of managing, provisioning, and configuring computer data centers, networks, virtual machines, load balancers, and connection topologies using machine-readable definition files rather than physical hardware configuration or interactive configuration tools (the "ClickOps" antipattern).

**Key Philosophy:** Treat your infrastructure with the exact same rigor as your application source code. It is stored in Git, reviewed by peers in Pull Requests, linted and tested automatically in CI/CD pipelines, and deployed through automated execution plans.

### The 4 Essential Pillars of Modern IaC

#### 🎯 Declarative Paradigm

You specify **WHAT** the target end-state should look like (e.g., _"I need a VPC with CIDR 10.0.0.0/16 and 1 public subnet"_), rather than writing imperative code detailing **HOW** to make it step-by-step.

The engine automatically calculates the resource dependency graph, discovers which API calls to execute in parallel, and executes them in the correct sequence.

#### 🔁 Idempotency

Executing the same IaC code multiple times produces the exact same infrastructure without unwanted side-effects or duplicate resources.

If your desired state matches reality, running `terraform apply` performs zero actions: _"No changes. Your infrastructure matches the configuration."_

#### 🧊 Immutability

In traditional _mutable_ systems, engineers SSH into servers to apply patches and tweak configs, causing unrepeatable "snowflake servers".

In _immutable_ systems, servers are never modified live. Any change triggers the provisioning of brand new, fresh instances, switching traffic seamlessly, and terminating the obsolete machines (Blue/Green).

#### 🗺️ State Management

Cloud providers deal in physical IDs (e.g. `vpc-04a1b2c3d4e5f6`), while your code defines human-friendly names (e.g. `aws_vpc.main`).

The **State File** acts as the mapping bridge. It tracks metadata, records actual cloud state, and enables the planner to predict the exact delta between your code and physical reality.

### Architecture Diagram: Declarative Reconciliation Loop

{% stepper %}
{% step %}
#### Code (Desired)

`main.tf` / Git

VPC + EC2 Specs
{% endstep %}

{% step %}
#### Engine + State

Calculates Precise Delta

State: `.tfstate` file
{% endstep %}

{% step %}
#### Real Cloud (Actual)

AWS REST APIs

Provisioned Resources
{% endstep %}
{% endstepper %}

## Why IaC is Used: Business & Engineering Benefits

| Operational Dimension   | Manual "ClickOps" Console                   | Ad-hoc Bash / Python Scripts            | Modern Declarative IaC                                    |
| ----------------------- | ------------------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| **Deployment Speed**    | Slow (Hours to days of manual clicking)     | Moderate (Fast until errors occur)      | **Blazing Fast (Minutes for complete multi-tier stacks)** |
| **Consistency & Drift** | Catastrophic drift; high human error        | High drift; unhandled partial failures  | **Zero drift; continuous self-healing detection**         |
| **Documentation**       | Tribal knowledge in engineer's head         | Obscure command line arguments          | **Self-documenting, clean version-controlled files**      |
| **Disaster Recovery**   | Nightmarish; frantic manual rebuild         | Fragile; scripts fail on clean accounts | **Instant; change region variable and apply**             |
| **Cost Optimization**   | Idle test servers left running indefinitely | Manual tracking in spreadsheets         | **Ephemeral preview envs destroyed on PR merge**          |
| **Audit & Compliance**  | Scattered CloudTrail logs                   | No approval trail                       | **Complete Git commit & PR review history**               |

## DevOps Real-Time Production Use Cases

{% stepper %}
{% step %}
### Multi-Environment Parity

Maintain identical infrastructure topologies across Dev, QA, Staging, and Production.

**How it works:** The code definitions for networking, compute, and security are 100% shared. Only environment-specific parameters (instance sizes, cluster node counts, domains) are swapped via `dev.tfvars` or `prod.tfvars`.
{% endstep %}

{% step %}
### Automated GitOps CI/CD Pipelines

Infrastructure changes are pushed as Git Pull Requests.

**How it works:** GitHub Actions triggers `terraform plan`, commenting the exact resource diff onto the PR. When seniors approve and merge to `main`, CI automatically provisions the updates with zero manual access keys on developer laptops.
{% endstep %}

{% step %}
### Ephemeral Pull Request Previews

Dynamic on-demand testing environments for product QA.

**How it works:** When a PR is opened, an isolated sandbox stack is stamped out. Once automated tests complete or the PR is closed, a webhook triggers `terraform destroy`, saving thousands in idle cloud bills.
{% endstep %}

{% step %}
### Policy as Code & Security Guardrails

Security compliance enforced BEFORE provisioning happens.

**How it works:** Tools like Checkov, tfsec, or Open Policy Agent (OPA) scan code in CI. If an engineer forgets to enable encryption on an S3 bucket or opens SSH to `0.0.0.0/0`, the pipeline breaks and blocks the pull request immediately.
{% endstep %}

{% step %}
### Disaster Recovery & Multi-Region Failover

Rapid regional resurrection in the event of an AWS outage.

**How it works:** If `us-east-1` experiences an outage, executing the blueprint with `-var="aws_region=us-west-2"` replicates identical VPCs, subnets, route tables, and servers in minutes.
{% endstep %}

{% step %}
### Internal Developer Platforms (IDP)

Platform engineering teams empowering self-service development.

**How it works:** Software engineers instantiate pre-approved, hardened Terraform modules without needing deep cloud networking or IAM security permissions.
{% endstep %}
{% endstepper %}

## Market IaC Tools Deep-Dive & Comparison

| Tool                     | Language                     | Cloud Coverage                 | State Mechanism            | Key Strengths                                                                  | Best Fit Scenario                                                   |
| ------------------------ | ---------------------------- | ------------------------------ | -------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **Terraform / OpenTofu** | HCL (Declarative)            | Multi-Cloud (3,500+ Providers) | Remote S3/DynamoDB Lock    | Vast provider ecosystem, massive community, mature modules                     | Industry default for general infrastructure provisioning            |
| **AWS CloudFormation**   | YAML / JSON                  | AWS Native Only                | Fully Managed by AWS       | Zero client state file management, immediate day-zero AWS support              | Pure AWS environments & AWS Service Catalog stacks                  |
| **AWS CDK**              | TypeScript, Python, Java, Go | AWS (Synthesizes to CFn)       | CloudFormation Engine      | High-level abstractions (L3 Constructs), IDE autocomplete, loops & classes     | Developers who prefer general programming languages over HCL/YAML   |
| **Pulumi**               | TypeScript, Python, Go, C#   | Multi-Cloud                    | Pulumi Service or S3       | Native unit testing (Jest/PyTest), real code power across multi-cloud          | Engineering teams wanting programming language power outside of AWS |
| **Ansible**              | YAML Playbooks               | OS & Multi-Vendor              | State-Free (SSH/WinRM)     | Agentless, superior OS package management & config templating                  | Configuring software _inside_ VMs after Terraform provisions them   |
| **Crossplane**           | Kubernetes YAML (CRDs)       | Multi-Cloud                    | K8s etcd + Continuous Loop | Continuous reconciliation loop, turns K8s into a universal cloud control plane | Platform teams building Internal Developer Platforms (IDPs)         |

{% hint style="info" %}
**The Mental Model: Provisioning vs Configuration Management**

* **Terraform / CloudFormation / Pulumi:** Builds the infrastructure foundation (VPCs, Subnets, Disks, Load Balancers, VMs).
* **Ansible / Chef / Puppet:** Configures what runs _inside_ the operating system (installing Apache, creating system users, updating config files).
{% endhint %}

## Hands-On Practice Lab: AWS Terraform Runbook

{% stepper %}
{% step %}
### Verify Prerequisites & Create Project Folder

Ensure you have Terraform (v1.5+) and AWS CLI installed with active AWS credentials.

```bash
# 1. Verify installed versions
terraform -version
aws sts get-caller-identity

# 2. Create project directory
mkdir -p ~/iac-demo && cd ~/iac-demo
```
{% endstep %}

{% step %}
### Create Infrastructure Code Files

Create the four standard modular files in your `~/iac-demo` folder.

#### File 1: `providers.tf`

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "IaC-Masterclass-Demo"
      ManagedBy   = "Terraform"
      Environment = "Demo"
    }
  }
}
```

#### File 2: `variables.tf`

```hcl
variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target AWS deployment region"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR block for the custom VPC"
}

variable "subnet_cidr" {
  type        = string
  default     = "10.0.1.0/24"
  description = "CIDR block for the public subnet"
}

variable "instance_type" {
  type        = string
  default     = "t2.micro"
  description = "EC2 Instance type (Free-Tier eligible)"
}
```

#### File 3: `main.tf` (VPC, Subnet, IGW, Route Table, Security Group, EC2)

```hcl
# 1. Custom Virtual Private Cloud (VPC)
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "iac-masterclass-vpc"
  }
}

# 2. Internet Gateway (IGW)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "iac-masterclass-igw"
  }
}

# 3. Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "iac-masterclass-public-subnet"
  }
}

# 4. Custom Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "iac-masterclass-public-rt"
  }
}

# 5. Route Table Association
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# 6. Least-Privilege Security Group
resource "aws_security_group" "web_sg" {
  name        = "iac-web-sg"
  description = "Allow inbound HTTP port 80 and outbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "iac-masterclass-web-sg"
  }
}

# 7. Query Latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# 8. EC2 Web Server Instance with Automated User Data Bootstrap
resource "aws_instance" "web_server" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  user_data = <<-EOF
    /var/www/html/index.html
    IaC Masterclass — Live Demo
    PROVISIONED VIA INFRASTRUCTURE AS CODE
    # 🚀 Terraform Live Demo Active!
    This entire AWS infrastructure was created 100% declaratively.

    **Instance ID:** $INSTANCE_ID
    **Availability Zone:** $AZ
    **Public IPv4:** $PUBLIC_IP
    **Provisioned By:** Terraform HashiCorp Engine

    HTML
  EOF

  tags = {
    Name = "iac-masterclass-web-server"
  }
}
```

#### File 4: `outputs.tf`

```hcl
output "website_url" {
  description = "Public URL of the provisioned web server"
  value       = "http://${aws_instance.web_server.public_ip}"
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web_server.public_ip
}

output "vpc_id" {
  description = "VPC ID of the created infrastructure"
  value       = aws_vpc.main.id
}
```
{% endstep %}

{% step %}
### Initialize the Directory (`terraform init`)

Downloads the AWS provider plugin and generates the dependency lock file `.terraform.lock.hcl`.

```bash
terraform init
```
{% endstep %}

{% step %}
### Format & Validate Configuration

```bash
terraform fmt
terraform validate
```
{% endstep %}

{% step %}
### Generate Execution Plan (`terraform plan`)

Performs dry-run reconciliation and saves the plan output to `tfplan`.

```bash
terraform plan -out=tfplan
```
{% endstep %}

{% step %}
### Execute Provisioning (`terraform apply`)

```bash
terraform apply "tfplan"
```
{% endstep %}

{% step %}
### Test In-Place Mutation & Drift Detection

#### Open the Live Web Page

Copy the `website_url` from your terminal output and paste it into your browser. You should see the live dashboard!

#### Live Mutation (Updating Without Destroying)

Edit `main.tf` to add a new tag `CostCenter = "Student-Lab"` to the EC2 resource. Run:

```bash
terraform plan
terraform apply -auto-approve
```

Notice that Terraform updates the server in-place without restarting or terminating it!

#### Drift Detection

Log in to the AWS Console, edit the Security Group to add a temporary port 8080 rule, then run `terraform plan` in your terminal. Watch how Terraform flags the unauthorized drift and offers to delete it!
{% endstep %}

{% step %}
### Mandatory Cleanup (`terraform destroy`)

{% hint style="danger" %}
**CRITICAL REMINDER:** Run this command to destroy all VPC, Subnet, and EC2 resources to prevent AWS charges.
{% endhint %}

```bash
terraform destroy -auto-approve
```
{% endstep %}
{% endstepper %}

## Production Best Practices & CLI Cheatsheet

### 🔐 Remote State & State Locking

Never store `terraform.tfstate` on your local laptop in team environments.

Store state in an encrypted Amazon S3 bucket with versioning enabled, and configure an Amazon DynamoDB table for distributed state locking to prevent two engineers from running `apply` at the exact same moment.

### 🛡️ Secrets Management

Never hardcode database passwords, IAM secret keys, or API tokens into `.tf` files.

Add `*.tfvars` and `*.tfstate` to `.gitignore`. Fetch secrets dynamically from AWS Secrets Manager or HashiCorp Vault.

### 📦 Pin Provider Versions

Always commit `.terraform.lock.hcl` to your Git repository.

Pin provider versions using the optimistic pessimistic operator (e.g. `version = "~> 5.0"`) to prevent accidental breaking changes from automatic minor upgrades.

### Essential Terraform CLI Cheatsheet

| Command                      | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| `terraform init`             | Initializes directory, configures backend, and downloads provider plugins |
| `terraform fmt -recursive`   | Rewrites all configuration files to canonical format and style            |
| `terraform validate`         | Verifies configuration syntax and internal variable consistency           |
| `terraform plan -out=tfplan` | Generates execution dry-run and saves speculative changes to file         |
| `terraform apply "tfplan"`   | Executes the planned changes against the real cloud provider APIs         |
| `terraform output`           | Displays the values of all defined output variables                       |
| `terraform state list`       | Lists all physical resources tracked in the current state file            |
| `terraform destroy`          | Destroys all managed infrastructure in reverse dependency order           |

## Interactive Self-Assessment Quiz

<details>

<summary>What does it mean for an IaC operation to be "Idempotent"?</summary>

A) It executes concurrently across multiple cloud providers at the exact same millisecond.

B) Applying the code 1 time or 100 times results in the exact same infrastructure without unwanted side effects.

C) It automatically restarts servers when CPU utilization exceeds 90%.

**Correct!** Idempotency guarantees that if no code changes are made, running `terraform apply` will make zero changes to your existing cloud environment.

</details>

<details>

<summary>What is the primary role of the Terraform State File (`terraform.tfstate`)?</summary>

A) It compiles Go binaries for the AWS CLI.

B) It maps declared code resources to physical cloud resource IDs and tracks actual cloud attributes.

C) It stores encrypted Git commit messages for SOC2 audits.

**Correct!** The state file acts as the single source of truth mapping your code definitions (e.g. `aws_instance.web_server`) to actual cloud resource IDs (e.g. `i-0123456789abcdef0`).

</details>

<details>

<summary>What is the fundamental difference between Terraform and Ansible?</summary>

A) Terraform is an infrastructure provisioning tool; Ansible is primarily an OS configuration management and software automation tool.

B) Terraform only works on AWS, while Ansible only works on Azure.

C) Ansible uses HCL, while Terraform uses Python.

**Correct!** Terraform provisions the underlying cloud infrastructure (VPCs, EC2 VMs, subnets), while Ansible configures the OS, installs packages, and manages users inside those VMs.

</details>

## Troubleshooting FAQ & Final Verification

<details>

<summary>Symptom: RequestExpired / InvalidClientTokenId</summary>

Your AWS CLI session token has expired.

**Solution:** Refresh your terminal session by running `aws configure` or refreshing your AWS SSO credentials.

</details>

<details>

<summary>Symptom: VpcLimitExceeded</summary>

AWS accounts default to a maximum of 5 VPCs per region.

**Solution:** Either delete old unused VPCs from previous labs or switch regions in your command: `terraform apply -var="aws_region=us-west-2"`.

</details>

<details>

<summary>Symptom: Web server not loading in browser</summary>

Browser displays "Site can't be reached" after apply.

**Solution:** Ensure you are using `http://` and NOT `https://` (we opened port 80, not 443). Also allow 60-90 seconds for the EC2 `user_data` script to finish executing dnf package installs.

</details>

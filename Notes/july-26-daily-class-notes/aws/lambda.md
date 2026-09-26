# lambda

Your complete lab manual for mastering event-driven serverless computing on AWS. Follow the step-by-step instructions to build an automated FinOps EC2 auto-shutdown engine triggered by Amazon EventBridge.

## What is Serverless Architecture & Why It Matters

**Serverless computing** is a cloud-native development model that allows developers to build and run applications without having to manage servers. Servers still exist, but AWS abstracts them away completely.

* 🛠️ **No Server Management**\
  Zero OS patching, kernel upgrades, or AMI baking. Developers write business logic code only.
* ⚡ **Elastic Auto-Scale**\
  Automatically scales from 0 to thousands of concurrent requests instantly in response to incoming events.
* 💵 **Pay-for-Value Billing**\
  Billed per millisecond of compute. You pay **$0.00** when your function is not executing.
* 🌐 **Built-in High Availability**\
  Fault tolerance across multiple Availability Zones without configuring load balancers or auto-scaling groups.

### The AWS Serverless Landscape Architecture

A high-level view of how event sources, serverless compute, workflow orchestration, and serverless databases interconnect:

## What is AWS Lambda & Internal Execution Model

**AWS Lambda** is an event-driven, serverless computing service provided by Amazon Web Services. It executes your code in response to events from over 200 AWS services and SaaS applications.

### Synchronous Invocation

The caller waits for the function to execute and return a response.

Examples: API Gateway, ALB

### Asynchronous Invocation

Caller receives immediate 202 Accepted. Lambda queues the event and retries twice on failure.

Examples: Amazon EventBridge, S3, SNS

### Event Source Mapping

Lambda polls the stream or queue on your behalf and batches items to invoke your function.

Examples: SQS, Kinesis, DynamoDB Streams

### Cold Starts vs Warm Starts: Quick Reference

| Lifecycle Phase            | Cold Start (First Request / Scale Out)                       | Warm Start (Subsequent Requests)                           |
| -------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| **MicroVM Initialization** | Downloads code & spins up Firecracker MicroVM (\~100-300 ms) | Reuses running execution container (0 ms)                  |
| **Static Initialization**  | Executes global imports, SDK clients, DB connection pools    | Already initialized in memory; reuses existing connections |
| **Handler Execution**      | Runs `lambda_handler(event, context)`                        | Runs `lambda_handler(event, context)`                      |

{% hint style="info" %}
**Best Practice Tip:** Always initialize your AWS SDK clients (e.g. `ec2 = boto3.client('ec2')`) **outside** the `lambda_handler` function. This ensures the connection is established only once during container initialization and reused across hundreds of warm requests!
{% endhint %}

## Compute Decision Matrix: EC2 vs Containers vs Lambda

| Feature            | Amazon EC2                  | Amazon ECS / EKS (Containers)       | AWS Lambda (Serverless)                         |
| ------------------ | --------------------------- | ----------------------------------- | ----------------------------------------------- |
| **Cost When Idle** | 100% full hourly rate       | Cluster base cost                   | **$0.00 (Zero idle cost)**                      |
| **Scale-Up Speed** | Minutes (Boot OS & AMI)     | Seconds (Pull docker image)         | **Milliseconds**                                |
| **Max Duration**   | Unlimited (Continuous)      | Unlimited (Continuous)              | **15 Minutes (900s)**                           |
| **OS Maintenance** | You patch OS kernel         | You patch container base image      | **AWS patches 100%**                            |
| **Best Used For**  | Legacy monoliths, custom OS | Microservices, long background jobs | **Event-driven tasks, APIs, DevOps automation** |

## Real-Time DevOps Production Use Cases

### Cloud FinOps: Nightly EC2 & RDS Shutdown

Automatically stops non-production development environments at 8 PM on weekdays. Saves companies 65% on cloud compute budgets.

### Security Compliance Auto-Remediation

When GuardDuty or AWS Config detects a public S3 bucket or open port 22 security group, an EventBridge rule triggers Lambda to immediately revoke the permissions.

### Unattached EBS Volume & Snapshot Pruner

Runs every Sunday at midnight. Identifies orphaned EBS volumes in `available` status and purges snapshots older than 30 days.

### ChatOps & CI/CD Deployment Notifications

Processes deployment status events from AWS CodePipeline or GitHub webhooks and posts rich interactive notification cards to Slack or Microsoft Teams.

## Hands-On Lab Walkthrough

{% stepper %}
{% step %}
## Create IAM Execution Role (Least-Privilege)

Create an IAM Role allowing your Lambda function to write logs to CloudWatch and describe/stop EC2 instances.

1. Go to **IAM Console ➔ Roles ➔ Create role**.
2. Trusted entity: **AWS service** ➔ Use case: **Lambda** ➔ Click **Next**.
3. Attach AWS managed policy: `AWSLambdaBasicExecutionRole`.
4. Click **Next** ➔ Role name: `lambda-finops-ec2-stopper-role` ➔ Click **Create role**.
5. Open the newly created role ➔ Under **Permissions**, click **Add permissions ➔ Create inline policy**.
6. Switch to the **JSON** tab, paste the policy below, name it `EC2DescribeAndStopPolicy`, and click **Create policy**:

```json
{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Action": [ "ec2:DescribeInstances", "ec2:DescribeTags", "ec2:StopInstances" ], "Resource": "*" } ] }
```
{% endstep %}

{% step %}
## Create the Lambda Function

Create the function in the AWS Lambda Console.

* Navigate to **Lambda ➔ Functions ➔ Create function**.
* Select **Author from scratch**.
* **Function name:** `FinOps-Nightly-EC2-Stopper`
* **Runtime:** `Python 3.12`
* **Architecture:** `arm64` (AWS Graviton)
* **Execution role:** Select _Use an existing role_ ➔ Select `lambda-finops-ec2-stopper-role`.
* Click **Create function**.
* Under **Configuration ➔ General configuration ➔ Edit**: Set **Timeout** to `1 min 0 sec`.
{% endstep %}

{% step %}
## Deploy the Production Boto3 Code

In the **Code** tab, replace the contents of `lambda_function.py` with the script below and click **Deploy**:

{% code title="lambda_function.py" %}
```python
import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialized outside handler for warm reuse
ec2 = boto3.client('ec2')

TARGET_TAG_KEY = os.environ.get('TARGET_TAG_KEY', 'Environment')
TARGET_TAG_VALUE = os.environ.get('TARGET_TAG_VALUE', 'Development')
DRY_RUN_MODE = os.environ.get('DRY_RUN_MODE', 'false').lower() == 'true'

def lambda_handler(event, context):
    logger.info("=== FinOps EC2 Auto-Shutdown Invocation Started ===")
    logger.info(f"Targeting instances with Tag: {TARGET_TAG_KEY} = {TARGET_TAG_VALUE}")
    logger.info(f"Dry Run Mode: {DRY_RUN_MODE}")

    try:
        filters = [
            {'Name': 'instance-state-name', 'Values': ['running']},
            {'Name': f'tag:{TARGET_TAG_KEY}', 'Values': [TARGET_TAG_VALUE]}
        ]

        response = ec2.describe_instances(Filters=filters)
        instances_to_stop = []
        instance_details = []

        for reservation in response.get('Reservations', []):
            for instance in reservation.get('Instances', []):
                instance_id = instance['InstanceId']
                instance_type = instance.get('InstanceType', 'unknown')
                name_tag = next(
                    (tag['Value'] for tag in instance.get('Tags', []) if tag['Key'] == 'Name'),
                    'Unnamed'
                )

                instances_to_stop.append(instance_id)
                instance_details.append({
                    "InstanceId": instance_id,
                    "Name": name_tag,
                    "Type": instance_type
                })

        if not instances_to_stop:
            logger.info("✅ No running development instances found to stop. Zero cost action required.")
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "No instances to stop", "stopped_count": 0})
            }

        logger.info(f"Identified {len(instances_to_stop)} running instance(s) to shut down: {instances_to_stop}")

        if DRY_RUN_MODE:
            logger.info(f"[DRY RUN] Would have stopped instances: {instances_to_stop}")
            action_status = "Simulated (Dry Run)"
        else:
            ec2.stop_instances(InstanceIds=instances_to_stop)
            logger.info(f"Successfully initiated stop for {len(instances_to_stop)} instances.")
            action_status = "Stopped"

        return {
            "statusCode": 200,
            "body": json.dumps({
                "action": action_status,
                "stopped_count": len(instances_to_stop),
                "instances": instance_details
            })
        }

    except ClientError as e:
        logger.error(f"AWS Boto3 ClientError: {str(e)}")
        raise e

    except Exception as e:
        logger.error(f"Unexpected error during execution: {str(e)}")
        raise e
```
{% endcode %}
{% endstep %}

{% step %}
## Test in Lambda Console with Mock Event Payload

Click the **Test** tab, create an event named `EventBridgeScheduledMock`, paste the JSON below, and click **Test**:

{% code title="Test Event Payload" %}
```json
{ "version": "0", "id": "53dc4d37-c244-4324-a5f4-80bb75da359f", "detail-type": "Scheduled Event", "source": "aws.events", "account": "123456789012", "time": "2026-09-08T20:00:00Z", "region": "us-east-1", "resources": [ "arn:aws:events:us-east-1:123456789012:rule/Nightly-Shutdown-Rule" ], "detail": {} }
```
{% endcode %}

### Execution Result

Execution Result: Succeeded (HTTP 200)

Response:

```json
{ "action": "Stopped", "stopped_count": 1, "instances": [ { "InstanceId": "i-09f482d9a1c24e78b", "Name": "Dev-Backend-API", "Type": "t3.micro" } ] }
```

Log Output:

```
START RequestId: 8a42b109-78c2-411a-85d1-6e84d4361ab0 Version: $LATEST
[INFO] === FinOps EC2 Auto-Shutdown Invocation Started ===
[INFO] Targeting instances with Tag: Environment = Development
[INFO] Identified 1 running instance(s) to shut down: ['i-09f482d9a1c24e78b']
[INFO] Successfully initiated stop for 1 instances.
END RequestId: 8a42b109-78c2-411a-85d1-6e84d4361ab0
REPORT RequestId: 8a42b109-78c2-411a-85d1-6e84d4361ab0 Duration: 342.15 ms Billed Duration: 343 ms Memory: 128 MB Max Memory Used: 78 MB Init Duration: 184.20 ms
```
{% endstep %}

{% step %}
## Connect Amazon EventBridge Scheduled Trigger

Add the scheduled trigger to execute automatically.

1. In the function overview diagram, click **+ Add trigger**.
2. Source: **EventBridge (CloudWatch Events)**.
3. Rule: **Create a new rule** ➔ Rule name: `NightlyShutdownSchedule`.
4. Rule type: **Schedule expression**.
5. Expression: `cron(0 20 ? * MON-FRI *)` (or `rate(2 minutes)` for classroom testing).
6. Click **Add**.
{% endstep %}

{% step %}
## Live Verification with EC2 Instance & CloudWatch Logs

Launch a test `t2.micro` or `t3.micro` EC2 instance with the tag `Environment: Development`. Observe the instance transition from _running_ to _stopping_, and view the live logs in CloudWatch Logs under `/aws/lambda/FinOps-Nightly-EC2-Stopper`.
{% endstep %}

{% step %}
## Lab Clean-Up & Teardown

Disable the EventBridge schedule rule, delete the test Lambda function, and terminate your test EC2 instances.

```bash
aws events disable-rule --name NightlyShutdownSchedule
aws lambda delete-function --function-name FinOps-Nightly-EC2-Stopper
```
{% endstep %}
{% endstepper %}

## Can't Run Lambda? 60-Second Troubleshooting Triage

<details>

<summary>ClientError: UnauthorizedOperation</summary>

**Root Cause:** Missing IAM permissions. Check your Execution Role. Does it have `ec2:DescribeInstances` and `ec2:StopInstances`?

</details>

<details>

<summary>Task timed out after 3.00 seconds</summary>

**Root Cause:** Default 3-second timeout was not increased. Go to Configuration ➔ General configuration ➔ Set timeout to 1 minute.

</details>

<details>

<summary>EventBridge Not Firing</summary>

**Root Cause:** Check if the rule is in **ENABLED** state. Verify that UTC timezone was used for the cron expression.

</details>

<details>

<summary>Zero Instances Stopped</summary>

**Root Cause:** Case-sensitive tags! Ensure tag key is exactly `Environment` and value is `Development`.

</details>

## Knowledge Check: Interactive Quiz

<details>

<summary>What happens to your AWS bill when your Lambda function is idle and receives zero requests?</summary>

A) You are billed an hourly standby fee per microVM

B) You pay exactly $0.00 (Zero idle cost)

C) You are billed for EBS volume reservation

D) AWS charges a flat $5 monthly maintenance charge per function

</details>

<details>

<summary>What is the maximum execution timeout duration supported by a single AWS Lambda invocation?</summary>

A) 5 minutes

B) 15 minutes (900 seconds)

C) 1 hour

D) Unlimited

</details>

<details>

<summary>Where should database connection pools and AWS SDK clients be initialized in your Lambda code for optimal performance?</summary>

A) Inside the lambda\_handler function body

B) Outside the lambda\_handler function (global/static scope)

C) In an S3 bucket

D) In an external crontab script

</details>

## AWS Lambda & Boto3 Quick Command Cheat Sheet

| Task / Command             | Code / Snippet                                      | Description                                     |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| **Read Environment Var**   | `os.environ.get('KEY', 'default')`                  | Safely extracts config with fallback.           |
| **Remaining Time**         | `context.get_remaining_time_in_millis()`            | Returns ms left before 15-minute timeout abort. |
| **Describe EC2 Instances** | `ec2.describe_instances(Filters=[...])`             | Filter instances by state or tag.               |
| **Stop EC2 Instances**     | `ec2.stop_instances(InstanceIds=['i-xxx'])`         | Gracefully initiates EC2 shutdown.              |
| **Invoke CLI**             | `aws lambda invoke --function-name MyFunc out.json` | Directly invokes function from terminal.        |

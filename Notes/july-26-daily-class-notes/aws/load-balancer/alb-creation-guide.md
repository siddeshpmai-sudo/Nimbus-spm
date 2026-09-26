# ALB Creation Guide

This guide demonstrates how to set up an Application Load Balancer (ALB) to route traffic to different target groups based on the requested URL path, such as `/billing.html` and `/payment.html`.

You will deploy five EC2 instances:

* 2 for billing
* 2 for payment
* 1 default target

## Phase 1: Launching EC2 Web Servers

{% stepper %}
{% step %}
### Launch 5 EC2 Instances

Launch five identical Amazon Linux instances, such as `t2.micro`, to serve as web servers.

Use an existing key pair and a security group that allows:

* HTTP: Port 80
* SSH: Port 22

Name the instances clearly:

* `ALB-Server-Default`
* `ALB-Server-Billing1`
* `ALB-Server-Billing2`
* `ALB-Server-Payment1`
* `ALB-Server-Payment2`

Use the following user data script for all instances to install and start Apache automatically on boot:

```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Default Homepage</h1>" > /var/www/html/index.html
```
{% endstep %}

{% step %}
### Configure Custom Pages via SSH

Create specific HTML files so load balancer health checks can pass and routing can be verified.

#### Default Server

Leave the default server as is. It already has `index.html`.

#### Billing Servers

SSH into both billing servers and rename the index file to `billing.html`. Add billing-specific text:

```bash
sudo su
cd /var/www/html
mv index.html billing.html
echo "<h1>Welcome to the Billing Page!</h1>" > billing.html
```

#### Payment Servers

SSH into both payment servers and rename the index file to `payment.html`. Add payment-specific text:

```bash
sudo su
cd /var/www/html
mv index.html payment.html
echo "<h1>Welcome to the Payment Page!</h1>" > payment.html
```
{% endstep %}
{% endstepper %}

## Phase 2: Creating Target Groups

{% stepper %}
{% step %}
### Create Three Target Groups

Navigate to **EC2 Dashboard > Target Groups** and create the following three target groups.

For each target group, use:

* Type: Instances
* Protocol: HTTP
* Port: 80

#### Default Target Group

* Name: `Default-TG`
* Health Check Path: `/index.html` or `/`
* Register target: Select the one Default server.

#### Billing Target Group

* Name: `Billing-TG`
* Health Check Path: `/billing.html`
* Register targets: Select the two Billing servers.

#### Payment Target Group

* Name: `Payment-TG`
* Health Check Path: `/payment.html`
* Register targets: Select the two Payment servers.

{% hint style="info" %}
Under Advanced Health Check settings, you can adjust the interval to 10 seconds to speed up the health check process. Wait until targets show as **Healthy** before proceeding.
{% endhint %}
{% endstep %}
{% endstepper %}

## Phase 3: Creating the Application Load Balancer

{% stepper %}
{% step %}
### Configure the ALB

1. Navigate to **EC2 Dashboard > Load Balancers** and click **Create load balancer**.
2. Select **Application Load Balancer**.
3. Enter a name, such as `Nimbus-ALB`.
4. Set the scheme to **Internet-facing**.
5. Under **Network mapping**, select at least two Availability Zones where the instances are deployed, such as `us-east-1a` and `us-east-1b`.
6. Under **Security groups**, select the web security group that allows Port 80.
7. Under **Listeners and routing**, configure:
   * Protocol: HTTP
   * Port: 80
   * Default action: **Forward to `Default-TG`**
8. Click **Create load balancer** and wait for the state to become **Active**.
{% endstep %}

{% step %}
### Configure Path-Based Routing Rules

Configure the ALB to route traffic based on the URL path.

1. Select the ALB and open the **Listeners and rules** tab.
2. Click the **HTTP:80** listener to view its rules.
3. Click **Manage rules** or **Add rule**.

#### Add Rule 1: Billing

* Condition: **Path** is `/billing.html`
* Action: **Forward to** `Billing-TG`
* Weight: 100%
* Priority: 1

#### Add Rule 2: Payment

* Condition: **Path** is `/payment.html`
* Action: **Forward to** `Payment-TG`
* Weight: 100%
* Priority: 2
{% endstep %}
{% endstepper %}

## Phase 4: Testing the Setup

{% stepper %}
{% step %}
### Verify Traffic Distribution

Copy the **DNS name** of the Application Load Balancer.
{% endstep %}

{% step %}
### Test the Default Target

Paste the DNS name into a browser.

It should reach the Default target and display:

```
Default Homepage
```
{% endstep %}

{% step %}
### Test Billing Routing

Append `/billing.html` to the DNS name.

Example:

```
nimbus-alb-123.us-east-1.elb.amazonaws.com/billing.html
```

You should see the Billing Page.

Refresh multiple times to verify that traffic balances between the two billing instances.
{% endstep %}

{% step %}
### Test Payment Routing

Append `/payment.html` to the DNS name.

You should see the Payment Page.

Refresh multiple times to verify load balancing across the two payment instances.
{% endstep %}
{% endstepper %}

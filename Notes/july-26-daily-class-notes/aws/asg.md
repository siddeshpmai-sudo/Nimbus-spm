# asg

## Brief Introduction to AWS ASG

An **Auto Scaling Group (ASG)** in AWS automatically manages the number of EC2 instances according to demand, enabling applications to scale in and out based on set policies.

### Components

* **Launch Template/Configuration:** Blueprint for EC2 instances, including AMI, instance type, security groups, and more.
* **Scaling Policies:** Rules for adding or removing instances, such as target tracking, step scaling, and schedule-based scaling.
* **Health Checks:** Mechanism to replace unhealthy instances.
* **Load Balancer (optional):** Evenly distributes traffic among instances.
* **Desired, Minimum, Maximum Capacity:** Controls the flexibility of scaling.

## Real-Time Practical Scenario

**Scenario:** You’re running a web application that experiences increased traffic during business hours and reduced load during nights and weekends.

## Hands-on Lab Steps

{% stepper %}
{% step %}
### Set up a Launch Template

* Choose an Amazon Machine Image (AMI), such as Amazon Linux.
* Define the instance type, such as `t2.micro` for a demo.
* Attach a key pair for SSH access.
{% endstep %}

{% step %}
### Create a Target Group and an Application Load Balancer (ALB)

* The target group will receive instances launched by the ASG.
* The ALB will route incoming HTTP/HTTPS traffic to those instances.
{% endstep %}

{% step %}
### Create an Auto Scaling Group

* Associate the group with the launch template and target group.
* Set:
  * Minimum: 1
  * Maximum: 4
  * Desired capacity: 2
{% endstep %}

{% step %}
### Configure Scaling Policies

* **Target Tracking:** Maintain average CPU at 50%.
* **Step Scaling:** Add 1 instance if CPU is above 70% for 5 minutes, and remove 1 instance if CPU is below 30%.
{% endstep %}

{% step %}
### Simulate Traffic and Scaling

* Use a tool such as Apache Benchmark or scripts to generate load.
* Observe scale-out when CPU spikes and scale-in when load drops.
{% endstep %}

{% step %}
### Demonstrate Fault Tolerance

Manually stop an EC2 instance from the ASG and show that the ASG replaces it to maintain the desired capacity.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
**Bonus:** Set up scheduled scaling to increase capacity during specific hours, such as scaling to 4 from 9 AM–6 PM and down to 1 otherwise.
{% endhint %}

## Real-World Examples

* **E-Commerce Sites:** Scale up for seasonal sales and scale down after the sale to save cost.
* **News Portals:** Quickly handle surges during breaking news.
* **SaaS Applications:** Match user demand across global time zones.

## Best Practices to Share

* Always configure health checks, including EC2 and ELB health checks, for accurate recovery.
* Use launch templates for consistency and versioning.
* Test scaling policies periodically.
* Enable notifications using SNS for scaling events.

## Capacity

* **Desired Capacity:** The ideal number of EC2 instances you want running in your ASG at any given time. The ASG tries to maintain this number under normal conditions. When scaling activities are triggered, such as a scheduled change or CloudWatch alarm, the desired capacity is adjusted up or down.
* **Minimum Capacity:** The lowest number of EC2 instances that your ASG will maintain. Even if there is no demand, the ASG will not terminate instances below this number. It ensures you always have a minimum set of resources running, such as to guarantee application availability.
* **Maximum Capacity:** The highest number of EC2 instances that your ASG can launch. No scaling policies or manual actions will increase the group beyond this limit, preventing unexpected surges that could cause high costs or stress downstream systems.

### Example

If you set:

* Minimum: 2
* Desired: 3
* Maximum: 5

Your ASG launches 3 instances by default, never allowing the count to fall below 2 or increase above 5, regardless of scaling events.

This configuration helps you control availability, performance, and cost by automatically adjusting compute resources within safe boundaries.

## Scaling

You can resize your Auto Scaling group manually or automatically to meet changes in demand.

### Scaling Limits

* **Minimum desired capacity:** Equal to or less than desired capacity.
* **Maximum desired capacity:** Equal to or greater than desired capacity.

### Automatic Scaling

Choose whether to use a target tracking policy. You can configure other metric-based scaling policies and scheduled scaling after creating your Auto Scaling group.

* **No scaling policies:** Your Auto Scaling group remains at its initial size and does not dynamically resize to meet demand.
* **Target tracking scaling policy:** Choose a CloudWatch metric and target value, and let the scaling policy adjust the desired capacity in proportion to the metric’s value.

## Understanding Scaling in AWS Auto Scaling Groups (ASG)

When configuring an **Auto Scaling Group (ASG)** in AWS, you control how compute resources automatically adjust to dynamic workloads using scaling parameters and policies.

### Manual vs. Automatic Scaling

* **Manual scaling:** You adjust the number of instances yourself by changing desired capacity up or down. The ASG does not change automatically based on workload demand.
* **Automatic scaling:** The ASG adjusts the number of instances in response to monitored metrics or schedules, keeping your application responsive and cost-efficient.

### Scaling Limits: Minimum, Desired, and Maximum Capacities

* **Minimum Desired Capacity:** The lowest number of instances your ASG maintains. If demand drops, the group never scales below this value.
* **Maximum Desired Capacity:** The highest number of instances your ASG can launch. Even if demand spikes sharply, it cannot exceed this upper limit.
* **Desired Capacity:** The current, actively maintained number of instances that the ASG tries to match unless scaling events trigger a change.

{% hint style="info" %}
**Rule:**

* The minimum desired capacity must be equal to or less than the current desired capacity.
* The maximum desired capacity must be equal to or greater than the current desired capacity.
* Desired capacity stays within the minimum and maximum range.
{% endhint %}

### Key Concepts

* **Desired Capacity:** Number of instances the ASG tries to maintain.
* **Min/Max Size:** Limits for instance count.
* **Warmup/Cooldown:** Settings that manage how quickly scaling actions repeat.
* **Health Checks:** The ASG replaces unreachable or unhealthy instances automatically.

### Example

Suppose you want to keep CPU utilization close to 50%, but during promotions you expect large traffic spikes:

* Use _target tracking_ to maintain 50% CPU normally.
* Add a _step scaling_ policy to aggressively add instances if CPU exceeds 80% for quicker scaling during traffic spikes.

### Automatic Scaling Policies

* **No scaling policies:** The ASG remains static at its initial size, regardless of load.
*   **Target Tracking Scaling Policy:** Select a **CloudWatch metric**, such as average CPU utilization, and set a target value, such as 50%.

    The ASG automatically adds or removes instances to keep the metric close to the target.

    * If the target is 50% CPU and CPU usage rises, the ASG increases capacity to reduce load.
    * If CPU usage drops, the ASG scales in to save cost.
* **Other scaling options** configured after creation:
  * **Step scaling:** Responds to metric thresholds with defined actions.
  * **Scheduled scaling:** Changes desired capacity at set times, such as scaling up at 9 AM and down at 9 PM.

## Scenario-Based Questions for Students

<details>

<summary>You have a web app that peaks between 6–10 PM daily. How would you configure an ASG to save costs outside peak hours?</summary>



</details>

<details>

<summary>An ASG is scaling out, but traffic is not evenly distributed. What could be wrong?</summary>



</details>

<details>

<summary>If the health check type is set to EC2, but the underlying web service fails, will ASG replace the instance? Why or why not?</summary>



</details>

<details>

<summary>Your ASG doesn’t scale in after load decreases. What checks would you perform?</summary>



</details>

<details>

<summary>How would you integrate a custom alarm, such as queue backlog, as a scaling trigger for an ASG?</summary>



</details>

<details>

<summary>Describe how you’d recover quickly if AWS announces scheduled maintenance on your availability zone.</summary>



</details>

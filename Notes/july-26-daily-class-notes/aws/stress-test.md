# stress test

{% stepper %}
{% step %}
### Installing the Tools

On most Linux distributions (like Ubuntu on EC2):

```bash
sudo apt update
sudo apt install stress stress-ng
```
{% endstep %}

{% step %}
### Using `stress`

* Purpose: Simple, lightweight load generator.
* Usage Example: To stress 4 CPU cores for 60 seconds:

```bash
stress --cpu 4 --timeout 60
```

* `--cpu 4`: Uses 4 worker threads spinning on sqrt() calculations.
* `--timeout 60`: Runs for 60 seconds.
{% endstep %}

{% step %}
### Using `stress-ng`

* Purpose: Advanced stress tool with hundreds of stressors and more control.
* Example: To stress all available CPU cores for 2 minutes:

```bash
stress-ng --cpu 0 --timeout 120s
```

* `--cpu 0`: Stresses all CPUs.
* `--timeout 120s`: Runs for 120 seconds.
* Other Features: Can stress memory (`--vm`), I/O (`--hdd`), or combinations.

Example:

```bash
stress-ng --cpu 2 --vm 2 --vm-bytes 512M --timeout 60s
```

This creates 2 CPU stressors, 2 memory stressors, each using 512MB memory, for 1 minute.
{% endstep %}

{% step %}
### Why Use These Tools?

* Performance Testing: Check how your instance handles sustained or burst CPU load.
* Autoscaling: Simulate spikes to trigger AWS Auto Scaling policies.
* Stability: Discover resource thresholds or weaknesses.
{% endstep %}

{% step %}
### Monitoring

While running either command, observe CPU load:

* Use `top`, `htop`, or AWS CloudWatch to monitor CPU usage in real-time.
* After test, review resource graphs in AWS console.

These tools are safe to use for testing as long as you don’t run them indefinitely on production systems, and you monitor system health during tests. They’re foundational for evaluating how your EC2 instance (and services built around it) respond to heavy CPU utilization.
{% endstep %}
{% endstepper %}

## Stressing the CPU Above 80% on t2.micro

You can use `stress` or `stress-ng` to push CPU usage above 80% as previously described:

```bash
stress-ng --cpu 1 --cpu-load 85 --timeout 60s
```

* `--cpu 1`: Stresses the single available vCPU.
* `--cpu-load 85`: Aims for 85% utilization.
* `--timeout 60s`: Runs for 1 minute (adjust as needed).

{% hint style="warning" %}
With only 1 vCPU and 1 GiB RAM, the t2.micro is best for light workloads or bursty tasks. If you stress the CPU for longer than your credit balance allows (especially without T2 Unlimited), performance will throttle down dramatically once credits are exhausted. Always monitor your **CPUCreditBalance** in CloudWatch during tests.
{% endhint %}

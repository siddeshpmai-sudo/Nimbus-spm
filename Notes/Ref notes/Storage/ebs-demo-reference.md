# ebs demo reference

## Exercise Summary Overview

| Exercise | Scenario                  | Duration | Key Commands                                   | Outcome                        |
| -------- | ------------------------- | -------- | ---------------------------------------------- | ------------------------------ |
| 1        | Create & Attach Volume    | 10 min   | create-volume, attach-volume, mkfs, mount      | Volume available for use       |
| 2        | Resize Without Downtime   | 15 min   | modify-volume, growpart, resize2fs/xfs\_growfs | Increased storage live         |
| 3        | New Volume + New Instance | 12 min   | run-instances, create-volume, attach-volume    | Ready-to-use new setup         |
| 4        | Add to fstab              | 8 min    | blkid, echo >> fstab, mount -a                 | Auto-mount on reboot           |
| 5        | Detach & Re-attach        | 10 min   | umount, detach-volume, attach-volume           | Data recovered on new instance |
| 6        | Partition & FS Expansion  | 12 min   | growpart, resize2fs/xfs\_growfs                | Full disk utilization          |

**Total Lab Time: \~60-70 minutes**

***

## Dependency Flow

```
Exercise 1: Create & Attach
    ↓
Exercise 2: Resize (using volume from Ex 1)
    ↓
Exercise 3: New Instance + New Volume
    ↓
Exercise 4: Add to fstab (using volume from Ex 3)
    ↓
Exercise 5: Detach from Ex 1, Reattach to new instance
    ↓
Exercise 6: Full partition/filesystem expansion demo
```

***

## Pre-Demo Checklist

* [ ] 3 EC2 instances running (t2.micro or t2.small)
* [ ] AWS CLI configured with proper credentials
* [ ] SSH keys accessible
* [ ] Security groups allow inbound on port 22 (SSH)
* [ ] Test instances are in same AZ
* [ ] Student accounts have EC2 permissions
* [ ] Terminal/Console ready for live commands
* [ ] AWS Console open in browser for parallel view

***

## Single-Command Execution Sequences

### Quick Setup (if starting fresh)

```bash
# Create 3 test instances in us-east-1a
for i in {1..3}; do
  aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t2.micro \
    --availability-zone us-east-1a \
    --key-name your-key \
    --security-groups default \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=demo-instance-$i}]"
done

# Wait for instances to run (30-60 seconds)
sleep 60

# Get instance IDs and IPs
aws ec2 describe-instances \
  --filters 'Name=tag:Name,Values=demo-instance-*' \
  'Name=instance-state-name,Values=running' \
  --query 'Reservations[].Instances[].[InstanceId,PublicIpAddress,Tags[0].Value]' \
  --output table
```

### Exercise 1: Complete Flow

```bash
# Variables
INSTANCE_ID="i-0123456789abcdef0"
AZ=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].Placement.AvailabilityZone' --output text)

# Create volume
VOL_ID=$(aws ec2 create-volume --size 10 --volume-type gp3 \
  --availability-zone $AZ \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=ex1-volume}]' \
  --query 'VolumeId' --output text)

echo "Volume created: $VOL_ID"

# Wait for available
while [ "$(aws ec2 describe-volumes --volume-ids $VOL_ID \
  --query 'Volumes[0].State' --output text)" != "available" ]; do
  echo "Waiting for volume..."
  sleep 5
done

# Attach
aws ec2 attach-volume --volume-id $VOL_ID --instance-id $INSTANCE_ID --device /dev/sdf
echo "Volume attached. Getting instance IP..."

# Get IP
INSTANCE_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "SSH into instance: ssh -i your-key.pem ec2-user@$INSTANCE_IP"
echo "Then run:"
echo "  sudo mkdir -p /mnt/data-volume"
echo "  sudo mkfs.ext4 /dev/xvdf"
echo "  sudo mount /dev/xvdf /mnt/data-volume"
echo "  df -h | grep data-volume"
```

### Exercise 2: Quick Resize

```bash
VOLUME_ID="vol-0abcdef1234567890"
INSTANCE_IP="1.2.3.4"

# Take snapshot
SNAPSHOT=$(aws ec2 create-snapshot --volume-id $VOLUME_ID \
  --description "Backup before resize" --query 'SnapshotId' --output text)

echo "Snapshot created: $SNAPSHOT"

# Modify volume (10GB → 20GB)
aws ec2 modify-volume --volume-id $VOLUME_ID --size 20

# Monitor
echo "Monitoring volume modification..."
while [ "$(aws ec2 describe-volumes-modifications --volume-ids $VOLUME_ID \
  --query 'VolumesModifications[0].ModificationState' --output text)" != "completed" ]; do
  echo "State: $(aws ec2 describe-volumes-modifications --volume-ids $VOLUME_ID \
  --query 'VolumesModifications[0].ModificationState' --output text)"
  sleep 10
done

echo "Volume modification complete!"

# SSH commands for instance
echo ""
echo "SSH into instance: ssh -i your-key.pem ec2-user@$INSTANCE_IP"
echo "Then run:"
echo "  sudo growpart /dev/xvdf 1"
echo "  sudo resize2fs /dev/xvdf1"
echo "  df -h"
```

***

## Live Demo Flow Script

### Opening Statement (2 minutes)

"Today we're going to explore AWS EBS volumes - the persistent storage behind EC2 instances. We'll start with the basics of creating and attaching volumes, then move to real-world scenarios like resizing without downtime and recovering data from crashed instances. By the end, you'll understand the complete lifecycle of EBS volume management."

{% stepper %}
{% step %}
### Exercise 1 (10 min)

"Imagine you just launched an EC2 instance for a new application. The instance has 8GB of root storage, but your app needs 10GB more for data. Let me show you how to create that volume, attach it, and make it available to the application."
{% endstep %}

{% step %}
### Exercise 2 (15 min)

"Your application is growing! You initially created a 10GB volume, but now you're at 90% capacity at 3 AM on a Sunday. Fortunately, AWS lets you resize volumes without stopping the instance. Watch how we do this without any downtime."
{% endstep %}

{% step %}
### Exercise 3 (12 min)

"Now you're deploying a new microservice. Instead of manually creating volumes, you can script it. Let me show you how to launch a new instance and attach a volume in one workflow - this is how you do infrastructure as code."
{% endstep %}

{% step %}
### Exercise 4 (8 min)

"Here's a critical point - if you don't add the volume to fstab, it won't automatically mount after a reboot. Let me show you how to configure that. This has saved me from many 3 AM incidents!"
{% endstep %}

{% step %}
### Exercise 5 (10 min)

"Worst case scenario: an instance crashes. But your data is on the EBS volume. Let me show you how to detach that volume and attach it to a recovery instance to access your data. This is a critical skill for troubleshooting."
{% endstep %}

{% step %}
### Exercise 6 (12 min)

"Finally, let's talk about the details of partition and filesystem expansion. This is where most people get confused with growpart, resize2fs, and xfs\_growfs. I'll show you when to use each command."
{% endstep %}
{% endstepper %}

***

## Common Student Questions & Answers

<details>

<summary>Q: Why do I need different commands for ext4 (resize2fs) and XFS (xfs_growfs)?</summary>

A: They're different filesystems with different structures. ext4 uses extent trees, XFS uses B+ trees. Each needs its own tool to expand safely.

</details>

<details>

<summary>Q: If I reboot before adding to fstab, what happens?</summary>

A: The volume stays attached but unmounts. Your app might crash looking for that data. That's why fstab is critical.

</details>

<details>

<summary>Q: Can I resize a volume while the instance is running?</summary>

A: Yes! Volume resizing is online. But you can't extend the partition/filesystem while mounted on older kernels. Modern kernels support this too.

</details>

<details>

<summary>Q: What's the difference between backing up and snapshots?</summary>

A: A snapshot is AWS's backup mechanism - point-in-time copies of your volume. You should always take one before major operations.

</details>

<details>

<summary>Q: If I attach the same volume to two instances, can both access the data?</summary>

A: No! EBS volumes can only be attached to ONE instance at a time (unless using Multi-Attach, which is rare). This is a common gotcha.

</details>

<details>

<summary>Q: Why must the volume and instance be in the same AZ?</summary>

A: AWS Availability Zones have different physical infrastructure. You can't connect to an AZ you're not in without going through snapshots.

</details>

***

## Troubleshooting

Student Problem: "My growpart didn't work"

* Check: `lsblk` - does the partition size match disk size?
* Check: `aws ec2 describe-volumes-modifications` - is volume still modifying?
* Solution: Wait 2-3 more minutes for AWS optimization

Student Problem: "fstab broke my instance"

* This is a teaching moment! Show recovery:
  * Stop instance
  * Detach root volume
  * Attach to another instance
  * Mount and fix fstab
  * Reattach
  * Show they're not alone in this mistake!

Student Problem: "Volume showed 20GB before, now 10GB"

* Likely: `lsblk` shows disk, but they're looking at partition
* Show: `lsblk` output interpretation
* Highlight: Device naming (xvda vs xvda1)

***

## Post-Demo Activities

### Homework Assignments

{% stepper %}
{% step %}
Create a volume, attach to instance, add to fstab, verify reboot
{% endstep %}

{% step %}
I'll give you a broken instance, fix the fstab
{% endstep %}

{% step %}
"Your root partition is 95% full - resize it"
{% endstep %}

{% step %}
Explain the three-step expansion process (vol → partition → fs)
{% endstep %}
{% endstepper %}

### Real-World Exercises

{% stepper %}
{% step %}
Create a backup volume, take snapshots
{% endstep %}

{% step %}
Set up an automated backup system
{% endstep %}

{% step %}
Test disaster recovery (detach and reattach)
{% endstep %}

{% step %}
Monitor volume performance (IOPS/throughput)
{% endstep %}
{% endstepper %}

***

## Key Metrics for Success

By end of demo, students should:

* [ ] Understand EBS volume lifecycle (create → attach → mount → use)
* [ ] Know the three-layer expansion: AWS volume → Partition → Filesystem
* [ ] Distinguish between ext4 (resize2fs) and XFS (xfs\_growfs)
* [ ] Explain why fstab is critical for production systems
* [ ] Demonstrate disaster recovery scenario
* [ ] Understand AZ constraints and cross-AZ limitations
* [ ] Know how to safely test fstab changes (mount -a)
* [ ] Recognize common mistakes and how to recover

***

## Resource References

### AWS Documentation

* https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html
* https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-describe-volumes.html

### Linux Tools

* `growpart` - Partition expansion (cloud-utils-growpart)
* `resize2fs` - ext4 filesystem expansion
* `xfs_growfs` - XFS filesystem expansion
* `/etc/fstab` - Filesystem mount table

### Monitoring

* `lsblk` - List block devices
* `df -h` - Disk usage (human-readable)
* `df -T` - Disk usage with filesystem type
* `mount` - Show mounted filesystems

***

## Demo Environment Checklist

Before starting:

```bash
# Verify all instances running
aws ec2 describe-instances \
  --filters 'Name=instance-state-name,Values=running' \
  --query 'Reservations[].Instances[].[InstanceId,PublicIpAddress]'

# Verify AWS CLI is configured
aws sts get-caller-identity

# Check internet connectivity
curl -I https://aws.amazon.com

# Test SSH access (before demo)
ssh -i your-key.pem ec2-user@instance-ip "uname -a"
```

***

## Estimated Time Breakdown

| Phase        | Duration      | Activity                              |
| ------------ | ------------- | ------------------------------------- |
| Setup        | 5 min         | Launch instances, verify connectivity |
| Exercise 1-3 | 30 min        | Create, attach, and manage volumes    |
| Exercise 4-5 | 18 min        | fstab configuration and recovery      |
| Exercise 6   | 12 min        | Deep dive into partition/fs expansion |
| Q\&A         | 5-10 min      | Student questions                     |
| **Total**    | **70-75 min** | Complete hands-on session             |

***

## Pro Tips for Delivery

1. Use Variables: Store IDs in bash variables so students see the automation
2. Show Errors: Don't skip mistakes - they're learning opportunities
3. Narrate Everything: Explain the "why" not just the "how"
4. Use AWS Console + CLI: Show parallel views for context
5. Pause for Questions: Don't rush through - learning is not linear
6. Save Terminal Output: Students can refer back to it
7. Encourage Lab Notes: Ask students to document their own commands
8. Real Scenario Names: Name volumes "prod-db-volume" not "vol-123" - makes it memorable

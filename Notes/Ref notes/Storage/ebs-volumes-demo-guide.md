# ebs volumes demo guide

## Prerequisites

* AWS Account with appropriate IAM permissions
* 2-3 EC2 instances running (Linux/Ubuntu or Amazon Linux)
* SSH access to EC2 instances
* AWS CLI configured or AWS Console access
* Basic Linux command knowledge

***

## Exercise 1: Create a New Volume and Attach to EC2 Instance

Real-Time Scenario: "Your application needs additional storage. You need to create a 10GB EBS volume and attach it to a running EC2 instance."

{% stepper %}
{% step %}
### Create an EBS Volume using AWS CLI

```bash
# First, find your instance's availability zone
aws ec2 describe-instances --instance-ids i-0123456789abcdef0 \
  --query 'Reservations[0].Instances[0].Placement.AvailabilityZone' \
  --output text

# Example output: us-east-1a

# Create a new EBS volume (gp3)
aws ec2 create-volume \
  --size 10 \
  --volume-type gp3 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=demo-volume-1}]'
```

Capture the VolumeId from the output for next steps.
{% endstep %}

{% step %}
### Verify Volume Status

```bash
aws ec2 describe-volumes --volume-ids vol-0abcdef1234567890 \
  --query 'Volumes[0].[VolumeId,State,Size,AvailabilityZone]' \
  --output table
```

Keep checking until State shows "available".
{% endstep %}

{% step %}
### Attach Volume to EC2 Instance

```bash
aws ec2 attach-volume \
  --volume-id vol-0abcdef1234567890 \
  --instance-id i-0123456789abcdef0 \
  --device /dev/sdf
```

Note device naming conventions: /dev/sdf (or /dev/xvdf on the instance).
{% endstep %}

{% step %}
### Connect to EC2 Instance and Mount the Volume

```bash
# SSH into the instance
ssh -i your-key.pem ec2-user@your-instance-ip

# List attached disks
lsblk

# Check device
sudo fdisk -l /dev/xvdf

# Create mount point
sudo mkdir -p /mnt/data-volume

# Create ext4 filesystem (or xfs)
sudo mkfs.ext4 /dev/xvdf

# Mount
sudo mount /dev/xvdf /mnt/data-volume

# Verify
df -h | grep data-volume

# Test file
sudo touch /mnt/data-volume/test-file.txt
ls -la /mnt/data-volume/
```

Key teaching points: device naming, same AZ requirement, filesystem creation, mount point creation.
{% endstep %}
{% endstepper %}

***

## Exercise 2: Increase Volume Size Without Downtime

Real-Time Scenario: "Increase volume from 10GB to 20GB while the application remains running."

{% stepper %}
{% step %}
### Take a Snapshot (Best Practice)

```bash
aws ec2 create-snapshot \
  --volume-id vol-0abcdef1234567890 \
  --description "Backup before resize - $(date +%Y-%m-%d)"
```

Capture the SnapshotId for records.
{% endstep %}

{% step %}
### Modify the Volume Size in AWS (Console or CLI)

```bash
# Check current state
aws ec2 describe-volumes --volume-ids vol-0abcdef1234567890 \
  --query 'Volumes[0].[VolumeId,Size,State]'

# Modify size
aws ec2 modify-volume --volume-id vol-0abcdef1234567890 --size 20
```

Monitor the asynchronous modification.
{% endstep %}

{% step %}
### Monitor the Modification Progress

```bash
aws ec2 describe-volumes-modifications \
  --volume-ids vol-0abcdef1234567890 \
  --query 'VolumesModifications[0].[VolumeId,ModificationState,Progress]'
```

Wait until ModificationState is "completed" (or optimizing/100).
{% endstep %}

{% step %}
### On the Instance: Extend Partition (if partition exists) using growpart

```bash
# Install tool if needed
sudo apt-get update && sudo apt-get install -y cloud-guest-utils
# or for RHEL/CentOS:
# sudo yum install -y cloud-utils-growpart

# Identify partition layout
sudo lsblk -o NAME,SIZE,TYPE

# Grow partition (format: growpart <device> <partition-number>)
sudo growpart /dev/xvdf 1

# Verify
sudo lsblk
```

If device has no partition (raw device), skip growpart and go directly to filesystem resize.
{% endstep %}

{% step %}
### Extend the Filesystem

For ext4:

```bash
# Check filesystem type
df -T | grep data-volume

# Resize (online)
sudo resize2fs /dev/xvdf1
```

For XFS:

```bash
# Resize (must be mounted; use mount point)
sudo xfs_growfs /mnt/data-volume
# or
sudo xfs_growfs -d /mnt/data-volume
```

Verify with: df -h | grep data-volume
{% endstep %}
{% endstepper %}

Key teaching points: asynchronous volume modification, no downtime, partition expansion with growpart, filesystem expansion commands.

***

## Exercise 3: Create a New Volume and Attach to New Instance

Real-Time Scenario: "You've deployed a new microservice on a new EC2 instance. It needs persistent storage."

{% stepper %}
{% step %}
### Launch a New EC2 Instance

```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-groups default \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=new-instance}]'
```

Capture the InstanceId and wait until running.
{% endstep %}

{% step %}
### Create a New Volume in Same AZ

```bash
aws ec2 describe-instances --instance-ids i-0987654321abcdef0 \
  --query 'Reservations[0].Instances[0].Placement.AvailabilityZone'

aws ec2 create-volume \
  --size 15 \
  --volume-type gp3 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=demo-volume-new-instance}]'
```

Capture the VolumeId.
{% endstep %}

{% step %}
### Attach Volume to New Instance

```bash
aws ec2 attach-volume \
  --volume-id vol-abcd1234efgh5678 \
  --instance-id i-0987654321abcdef0 \
  --device /dev/sdf

# Verify
aws ec2 describe-volumes --volume-ids vol-abcd1234efgh5678 \
  --query 'Volumes[0].[VolumeId,Attachments[0].InstanceId,State]'
```
{% endstep %}

{% step %}
### Mount the Volume on New Instance

```bash
ssh -i your-key.pem ec2-user@new-instance-ip

# List disks
lsblk

# Create filesystem and mount
sudo mkfs.ext4 /dev/xvdf
sudo mkdir -p /mnt/application-data
sudo mount /dev/xvdf /mnt/application-data

# Verify and test
df -h | grep application-data
sudo bash -c 'echo "App data on new instance" > /mnt/application-data/app-info.txt'
cat /mnt/application-data/app-info.txt
```
{% endstep %}
{% endstepper %}

Key teaching points: same AZ requirement, device naming, preparing fresh instances.

***

## Exercise 4: Add Volume to fstab for Permanent Mount

Real-Time Scenario: "Ensure the attached volume auto-mounts after reboot."

{% stepper %}
{% step %}
### Get Volume UUID

```bash
sudo blkid /dev/xvdf
# Example output:
# /dev/xvdf1: UUID="a1b2c3d4-e5f6-7890-abcd-ef1234567890" TYPE="ext4" PARTUUID="12345678"
```

Capture the UUID.
{% endstep %}

{% step %}
### Backup fstab (Critical)

```bash
sudo cp /etc/fstab /etc/fstab.backup
cat /etc/fstab.backup
```
{% endstep %}

{% step %}
### Add Entry to fstab

Format: UUID=

```bash
echo "UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890 /mnt/data-volume ext4 defaults,nofail 0 0" | sudo tee -a /etc/fstab
# Or edit with sudo nano /etc/fstab
```

For XFS, replace ext4 with xfs.
{% endstep %}

{% step %}
### Test fstab Configuration

```bash
sudo mount -a
# If no errors, fstab is valid
df -h | grep data-volume
mount | grep data-volume
```

Then reboot to verify persistence:

```bash
sudo reboot
# After reboot: ssh back and verify
df -h
mount | grep data-volume
```
{% endstep %}
{% endstepper %}

Key teaching points: UUID vs device name, nofail option, always test mount -a before reboot, backup fstab.

***

## Exercise 5: Unmount a Volume and Attach to Another Instance

Real-Time Scenario: "Recover data by detaching an EBS volume from a crashed instance and attaching to a rescue instance."

{% stepper %}
{% step %}
### Unmount the Volume from Current Instance

```bash
sudo umount /mnt/data-volume
# Verify
df -h
sudo lsblk
```
{% endstep %}

{% step %}
### Detach Volume via AWS CLI

```bash
# Optionally find instance IP
aws ec2 describe-instances --instance-ids i-0123456789abcdef0 \
  --query 'Reservations[0].Instances[0].PublicIpAddress'

# Detach
aws ec2 detach-volume --volume-id vol-0abcdef1234567890

# Monitor
aws ec2 describe-volumes --volume-ids vol-0abcdef1234567890 \
  --query 'Volumes[0].[VolumeId,State,Attachments]'
```

Status will transition: in-use → detaching → available.
{% endstep %}

{% step %}
### Attach Volume to Another Instance

```bash
# Find target instance in same AZ
aws ec2 describe-instances \
  --filters 'Name=instance-state-name,Values=running' \
  --query 'Reservations[].Instances[].[InstanceId,PublicIpAddress,Placement.AvailabilityZone]'

# Attach
aws ec2 attach-volume \
  --volume-id vol-0abcdef1234567890 \
  --instance-id i-0987654321abcdef0 \
  --device /dev/sdf
```
{% endstep %}

{% step %}
### Mount Volume on Rescue Instance and Access Data

```bash
ssh -i your-key.pem ec2-user@rescue-instance-ip
lsblk

# Optional filesystem check (read-only)
sudo fsck.ext4 -n /dev/xvdf1

sudo mkdir -p /mnt/recovered-data
sudo mount /dev/xvdf /mnt/recovered-data

ls -la /mnt/recovered-data/
cat /mnt/recovered-data/test-file.txt
```
{% endstep %}

{% step %}
### (Optional) Reattach to Original Instance

```bash
# Unmount from rescue
sudo umount /mnt/recovered-data

# Detach
aws ec2 detach-volume --volume-id vol-0abcdef1234567890

# Reattach
aws ec2 attach-volume \
  --volume-id vol-0abcdef1234567890 \
  --instance-id i-0123456789abcdef0 \
  --device /dev/sdf

# Mount
ssh -i your-key.pem ec2-user@original-instance-ip
sudo mount /dev/xvdf /mnt/data-volume
```
{% endstep %}
{% endstepper %}

Key teaching points: always unmount before detaching, same AZ requirement, check filesystem before remount.

***

## Exercise 6: growpart, growfs, and resize2fs Deep Dive

Real-Time Scenario: "Root volume nearly full. Volume increased in AWS. Expand partition and filesystem without data loss."

{% stepper %}
{% step %}
### Check Current Partition and Filesystem State

```bash
lsblk
df -h
df -T /
```

Identify whether disk shows larger size than partition (e.g., disk 20G, partition 8G).
{% endstep %}

{% step %}
### Install cloud-utils (growpart)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y cloud-guest-utils

# CentOS/RHEL
sudo yum install -y cloud-utils-growpart

which growpart
growpart --version
```
{% endstep %}

{% step %}
### Use growpart to Expand Partition

```bash
sudo growpart /dev/xvda 1
lsblk
```

If growpart fails on GPT, use parted:

```bash
sudo parted /dev/xvda resizepart 1 20G
lsblk
```
{% endstep %}

{% step %}
### Resize ext4 Filesystem with resize2fs

```bash
# Confirm ext4
df -T / | grep ext4

# Online resize
sudo resize2fs /dev/xvda1

# Optional: specify size
# sudo resize2fs /dev/xvda1 15G
```

Verify: df -h /
{% endstep %}

{% step %}
### Expand XFS Filesystem with xfs\_growfs

```bash
# Confirm xfs
df -T / | grep xfs

# Expand to maximum (mounted)
sudo xfs_growfs /

# Or expand a specific mount:
sudo xfs_growfs /mnt/data-volume
```

Verify: df -h /
{% endstep %}

{% step %}
### Complete Workflow Example

```bash
# Volume increased in AWS

ssh -i key.pem ec2-user@instance-ip

lsblk
df -h /
df -T /

sudo apt-get update && sudo apt-get install -y cloud-guest-utils

sudo growpart /dev/xvda 1
lsblk

# For ext4:
sudo resize2fs /dev/xvda1

# OR for XFS:
sudo xfs_growfs /

df -h /
lsblk
```
{% endstep %}
{% endstepper %}

Comparison summary:

| Tool        | Purpose                | Filesystem | Online | Target              |
| ----------- | ---------------------- | ---------- | ------ | ------------------- |
| growpart    | Expand partition       | Any        | Yes    | Device (/dev/xvda1) |
| resize2fs   | Expand ext4 filesystem | ext4       | Yes    | Device              |
| xfs\_growfs | Expand xfs filesystem  | xfs        | Yes    | Mount point         |

Key teaching points: three-layer expansion (AWS volume → partition → filesystem), order matters, online operations possible.

***

## Quick Reference Commands Summary

```bash
# CREATE & ATTACH
aws ec2 create-volume --size 10 --volume-type gp3 --availability-zone us-east-1a
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx --device /dev/sdf
aws ec2 describe-volumes --volume-ids vol-xxx

# FILESYSTEM SETUP
lsblk
sudo mkfs.ext4 /dev/xvdf        # ext4
sudo mkfs.xfs /dev/xvdf         # xfs
sudo mount /dev/xvdf /mnt/volume
df -h

# FSTAB
sudo blkid /dev/xvdf
sudo cp /etc/fstab /etc/fstab.backup
echo "UUID=xxx /mnt/volume ext4 defaults,nofail 0 0" | sudo tee -a /etc/fstab
sudo mount -a

# VOLUME RESIZING
aws ec2 modify-volume --volume-id vol-xxx --size 20
aws ec2 describe-volumes-modifications --volume-ids vol-xxx
ssh -i key.pem ec2-user@instance-ip
sudo growpart /dev/xvda 1
sudo resize2fs /dev/xvda1        # ext4
sudo xfs_growfs /                # xfs
df -h
lsblk

# DETACH & REATTACH
sudo umount /mnt/volume
aws ec2 detach-volume --volume-id vol-xxx
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-yyy --device /dev/sdf
sudo mount /dev/xvdf /mnt/recovered
```

***

## Common Troubleshooting Scenarios

<details>

<summary>Issue 1: growpart: NOCHANGE</summary>

Problem: sudo growpart /dev/xvda 1 Output: NOCHANGE: partition 1 is size 20971520. it cannot be grown

Solution:

* Volume modification may still be in progress.
* Check: aws ec2 describe-volumes-modifications --volume-ids vol-xxx
* Wait until modification state is "completed".

</details>

<details>

<summary>Issue 2: resize2fs: Device or resource busy</summary>

Problem: sudo resize2fs /dev/xvda1 Output: Device or resource busy while trying to open /dev/xvda1

Solution:

* Volume might be detaching or busy. Check lsblk for device status.
* Wait a few seconds and retry.

</details>

<details>

<summary>Issue 3: fstab Entry Causes Boot Failure</summary>

Problem: Instance fails to boot after fstab modification.

Solution:

* Recovery steps:
  1. Stop the instance.
  2. Detach root volume.
  3. Attach to another instance.
  4. Mount and fix /etc/fstab.
  5. Reattach and restart.

</details>

<details>

<summary>Issue 4: Partition Not Showing Full Size</summary>

Problem: lsblk shows disk 20G but partition xvdf1 is 8G.

Solution:

* Run growpart: sudo growpart /dev/xvdf 1
* Verify with lsblk.

</details>

<details>

<summary>Issue 5: XFS Filesystem Shows Old Size</summary>

Problem: df -h shows 8G even after resize.

Solution:

* Ensure XFS is mounted and run: sudo xfs\_growfs / (or sudo xfs\_growfs /mnt/data-volume)
* Verify with df -h /

</details>

***

## Best Practices for Students

1. Always backup: snapshot before resizing; backup /etc/fstab before editing.
2. Same Availability Zone: volume and instance must be in the same AZ.
3. Test fstab before rebooting: sudo mount -a.
4. Know your filesystem type: df -T; use resize2fs for ext4, xfs\_growfs for xfs.
5. Document volumes using tags and notes.
6. Monitor asynchronous processes: check volume modification status.
7. Verify after each step: lsblk after attachment, df -h after mount/resize.

***

## Lab Cleanup

```bash
# Unmount
sudo umount /mnt/data-volume

# Detach volume
aws ec2 detach-volume --volume-id vol-xxx

# Delete volume
aws ec2 delete-volume --volume-id vol-xxx

# Terminate instance
aws ec2 terminate-instances --instance-ids i-xxx

# Delete snapshots
aws ec2 delete-snapshot --snapshot-id snap-xxx
```

***

## Teaching Tips for Live Demo

* Start simple (Exercise 1), then progress to complex scenarios.
* Demonstrate errors intentionally to teach troubleshooting.
* Use realistic names for volumes and instances.
* Monitor AWS Console and CLI side-by-side.
* Explain each step and ask probing questions.
* Save snapshots/screenshots of successful steps for reference.

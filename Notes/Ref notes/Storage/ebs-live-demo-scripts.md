# ebs live demo scripts

Each script includes:

* Setup: Prerequisites and variables to set
* Demo: Step-by-step commands with expected output
* Explain: Teaching points for each step
* Verify: How students can confirm success

***

## EXERCISE 1: Create Volume & Attach to EC2

### Setup

```bash
# Set variables for your environment
INSTANCE_ID="i-0123456789abcdef0"
INSTANCE_IP="54.123.45.67"
SSH_KEY="~/Downloads/my-key.pem"
REGION="us-east-1"
AZ="us-east-1a"

# Test SSH access first
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP "echo 'SSH access OK'"
```

{% stepper %}
{% step %}
### Verify Instance AZ & Create Volume

```bash
echo "=== STEP 1: Verify Instance AZ ==="
aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --region $REGION \
  --query 'Reservations[0].Instances[0].[InstanceId,Placement.AvailabilityZone,State.Name]' \
  --output table

echo "=== STEP 2: Create 10GB gp3 Volume ==="
RESPONSE=$(aws ec2 create-volume \
  --size 10 \
  --volume-type gp3 \
  --availability-zone $AZ \
  --region $REGION \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=demo-ex1-volume}]')

VOL_ID=$(echo $RESPONSE | jq -r '.VolumeId')
echo "Volume created: $VOL_ID"
echo "Full response:"
echo $RESPONSE | jq '.'
```

Explain:

* Volume must be created in the same AZ as the instance.
* Using gp3 (general purpose) for typical workloads.
* Tagging for easy identification.
{% endstep %}

{% step %}
### Monitor Creation & Attach Volume

```bash
echo "=== STEP 3: Wait for Volume to be Available ==="
while true; do
  STATE=$(aws ec2 describe-volumes --volume-ids $VOL_ID \
    --region $REGION \
    --query 'Volumes[0].State' --output text)
  echo "Current state: $STATE"
  if [ "$STATE" == "available" ]; then
    echo "✓ Volume is available!"
    break
  fi
  sleep 3
done

aws ec2 describe-volumes --volume-ids $VOL_ID \
  --region $REGION \
  --query 'Volumes[0].[VolumeId,Size,VolumeType,AvailabilityZone,State,Iops,Throughput]' \
  --output table

echo "=== STEP 4: Attach Volume to Instance ==="
ATTACH_RESPONSE=$(aws ec2 attach-volume \
  --volume-id $VOL_ID \
  --instance-id $INSTANCE_ID \
  --device /dev/sdf \
  --region $REGION)

echo "Attachment initiated. Response:"
echo $ATTACH_RESPONSE | jq '.'
```

Explain:

* Polling until available is common in automation.
* Device names: /dev/sdf is used here; next would be /dev/sdg.
* Instances can remain running while attaching volumes.
{% endstep %}

{% step %}
### Mount Volume in Instance

```bash
echo "=== STEP 5: Connect to Instance ==="
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP << 'ENDSSH'

echo "=== Listing Block Devices ==="
lsblk

echo ""
echo "=== Creating Mount Point ==="
sudo mkdir -p /mnt/data-volume

echo ""
echo "=== Creating ext4 Filesystem ==="
sudo mkfs.ext4 /dev/xvdf

echo ""
echo "=== Mounting Volume ==="
sudo mount /dev/xvdf /mnt/data-volume

echo ""
echo "=== Verifying Mount ==="
df -h | grep data-volume

echo ""
echo "=== Creating Test File ==="
sudo bash -c 'echo "Test data on EBS volume" > /mnt/data-volume/test.txt'
cat /mnt/data-volume/test.txt

ENDSSH
```

Explain:

* Heredoc (<<'ENDSSH') runs multiple commands over one SSH session.
* mkfs.ext4 formats the volume (destructive), creating a filesystem.
* mount makes it accessible at /mnt/data-volume.
{% endstep %}
{% endstepper %}

### Verification for Students

```bash
# 1. See the volume in AWS console / via CLI
aws ec2 describe-volumes --volume-ids $VOL_ID --region $REGION

# 2. See it attached to the instance
aws ec2 describe-volumes --filters "Name=attachment.instance-id,Values=$INSTANCE_ID" --region $REGION

# 3. Access data from inside instance
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP "df -h /mnt/data-volume && ls -la /mnt/data-volume"
```

***

## EXERCISE 2: Resize Volume Without Downtime

### Setup

```bash
# Use the volume from Exercise 1
INSTANCE_ID="i-0123456789abcdef0"
INSTANCE_IP="54.123.45.67"
VOL_ID="vol-0abcdef1234567890"
SSH_KEY="~/Downloads/my-key.pem"
REGION="us-east-1"
```

{% stepper %}
{% step %}
### Snapshot Backup & Inspect Current Volume

```bash
echo "=== EXERCISE 2: Resize Volume Without Downtime ==="

echo "=== STEP 1: Create Snapshot (Backup) ==="
SNAPSHOT=$(aws ec2 create-snapshot \
  --volume-id $VOL_ID \
  --description "Backup before resize exercise - $(date +%Y-%m-%d_%H:%M:%S)" \
  --region $REGION \
  --query 'SnapshotId' --output text)

echo "Snapshot created: $SNAPSHOT"

echo ""
echo "=== STEP 2: Current Volume State ==="
aws ec2 describe-volumes --volume-ids $VOL_ID \
  --region $REGION \
  --query 'Volumes[0].[VolumeId,Size,State,Iops,Throughput]' \
  --output table
```

Explain:

* Always snapshot before modification as a safety net.
* This example expands from 10GB → 20GB.
{% endstep %}

{% step %}
### Modify Volume & Monitor Progress

```bash
echo "=== STEP 3: Modify Volume Size (10GB → 20GB) ==="
MODIFICATION=$(aws ec2 modify-volume \
  --volume-id $VOL_ID \
  --size 20 \
  --region $REGION)

echo "Modification initiated. Response:"
echo $MODIFICATION | jq '.VolumeModification'

echo "=== STEP 4: Monitor Modification Progress ==="
PROGRESS=0
while [ "$PROGRESS" != "100" ] || [ "$MOD_STATE" != "completed" ]; do
  MOD_STATE=$(aws ec2 describe-volumes-modifications --volume-ids $VOL_ID \
    --region $REGION \
    --query 'VolumesModifications[0].ModificationState' --output text)
  PROGRESS=$(aws ec2 describe-volumes-modifications --volume-ids $VOL_ID \
    --region $REGION \
    --query 'VolumesModifications[0].Progress' --output text)
  echo "State: $MOD_STATE | Progress: $PROGRESS%"
  if [ "$MOD_STATE" == "completed" ]; then
    echo "✓ Modification complete!"
    break
  fi
  sleep 5
done

echo ""
echo "=== STEP 5: Volume After Modification ==="
aws ec2 describe-volumes --volume-ids $VOL_ID \
  --region $REGION \
  --query 'Volumes[0].[VolumeId,Size,State]' \
  --output table
```

Explain:

* Modify-volume is asynchronous; ModificationState may be 'modifying'.
* The instance remains running during modification (zero downtime).
* OS partition still needs changes to use new space.
{% endstep %}

{% step %}
### Grow Partition on Instance

```bash
echo "=== STEP 6: SSH into Instance & Expand Partition ==="
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP << 'ENDSSH'

echo "=== Before: Disk & Partition Sizes ==="
lsblk

echo ""
echo "=== Installing growpart tool ==="
sudo apt-get update -qq && sudo apt-get install -y cloud-guest-utils > /dev/null 2>&1
echo "✓ cloud-guest-utils installed"

echo ""
echo "=== Growing Partition with growpart ==="
sudo growpart /dev/xvdf 1

echo ""
echo "=== After: Partition is expanded ==="
lsblk

ENDSSH
```

Explain:

* growpart extends the partition to fill the resized disk.
* If the volume had no partition (raw disk), skip growpart.
{% endstep %}

{% step %}
### Expand Filesystem Online

```bash
echo "=== STEP 7: Expand Filesystem ==="
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP << 'ENDSSH'

echo "=== Checking Filesystem Type ==="
df -T /mnt/data-volume

echo ""
echo "=== Current Filesystem Size ==="
df -h /mnt/data-volume

echo ""
echo "=== Expanding ext4 Filesystem ==="
sudo resize2fs /dev/xvdf1

echo ""
echo "=== New Filesystem Size ==="
df -h /mnt/data-volume

echo ""
echo "=== Verification: All disk space available ==="
lsblk

ENDSSH
```

Explain:

* resize2fs can expand ext4 while mounted (online resizing).
* XFS requires xfs\_growfs.
* No reboot: maintain application availability.
{% endstep %}
{% endstepper %}

### Verification for Students

```bash
# Before and After comparison
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP << 'ENDSSH'
echo "Volume status:"
df -h /mnt/data-volume
echo ""
echo "Application can still access data:"
cat /mnt/data-volume/test.txt
echo ""
echo "Full disk layout:"
lsblk
ENDSSH
```

***

## EXERCISE 3: New Volume + New Instance

### One-Step Setup & Demo

```bash
echo "=== EXERCISE 3: Create New Instance + Attach Volume ==="

REGION="us-east-1"
AZ="us-east-1a"
KEY_PAIR="my-key-pair"

echo "=== STEP 1: Launch New EC2 Instance ==="
INSTANCE=$(aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --availability-zone $AZ \
  --key-name $KEY_PAIR \
  --region $REGION \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=demo-ex3-instance}]')

INSTANCE_ID=$(echo $INSTANCE | jq -r '.Instances[0].InstanceId')
echo "Instance launched: $INSTANCE_ID"

echo "=== STEP 2: Wait for Instance to be Running ==="
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION
INSTANCE_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --region $REGION \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "Instance IP: $INSTANCE_IP"

echo "=== STEP 3: Create New 15GB Volume ==="
VOL=$(aws ec2 create-volume \
  --size 15 \
  --volume-type gp3 \
  --availability-zone $AZ \
  --region $REGION \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=demo-ex3-volume}]')

VOL_ID=$(echo $VOL | jq -r '.VolumeId')
echo "Volume: $VOL_ID"

echo "=== STEP 4: Wait for Volume to be Available ==="
aws ec2 wait volume-available --volume-ids $VOL_ID --region $REGION

echo "=== STEP 5: Attach Volume to Instance ==="
aws ec2 attach-volume \
  --volume-id $VOL_ID \
  --instance-id $INSTANCE_ID \
  --device /dev/sdf \
  --region $REGION

echo "=== STEP 6: Mount Volume in Instance ==="
sleep 10

ssh -i $KEY_PAIR ec2-user@$INSTANCE_IP << 'ENDSSH'
sudo mkfs.ext4 /dev/xvdf
sudo mkdir -p /mnt/app-data
sudo mount /dev/xvdf /mnt/app-data
df -h /mnt/app-data
ENDSSH

echo "=== EXERCISE 3 COMPLETE ==="
echo "Instance: $INSTANCE_ID at $INSTANCE_IP"
echo "Volume: $VOL_ID mounted at /mnt/app-data"
```

***

## EXERCISE 4: Add to fstab for Permanent Mount

### Complete fstab Configuration

```bash
echo "=== EXERCISE 4: Add Volume to fstab ==="

INSTANCE_IP="instance-from-ex3"
SSH_KEY="my-key.pem"

ssh -i $SSH_KEY ec2-user@$INSTANCE_IP << 'ENDSSH'

echo "=== STEP 1: Get Volume UUID ==="
UUID=$(sudo blkid /dev/xvdf1 | grep -oP 'UUID="\K[^"]+')
echo "UUID: $UUID"

echo ""
echo "=== STEP 2: Backup fstab ==="
sudo cp /etc/fstab /etc/fstab.backup
echo "✓ Backup created: /etc/fstab.backup"

echo ""
echo "=== STEP 3: View Current fstab ==="
cat /etc/fstab

echo ""
echo "=== STEP 4: Add Mount Entry ==="
FSTAB_ENTRY="UUID=$UUID /mnt/app-data ext4 defaults,nofail 0 0"
echo "Adding: $FSTAB_ENTRY"
echo "$FSTAB_ENTRY" | sudo tee -a /etc/fstab > /dev/null

echo ""
echo "=== STEP 5: Verify fstab Entry ==="
tail -5 /etc/fstab

echo ""
echo "=== STEP 6: Test fstab Configuration ==="
sudo mount -a
echo "✓ No errors - fstab is valid!"

echo ""
echo "=== STEP 7: Verify Mount ==="
df -h | grep app-data

ENDSSH
```

Explain:

* nofail prevents boot failure if the volume isn't present.
* Always test with sudo mount -a before reboot.
* Use UUID in fstab to avoid device name changes.

### Verify After Reboot

```bash
echo "Rebooting instance..."
aws ec2 reboot-instances --instance-ids $INSTANCE_ID

echo "Waiting for instance to come back online..."
sleep 60

ssh -i $SSH_KEY ec2-user@$INSTANCE_IP "df -h | grep app-data"
```

***

## EXERCISE 5: Detach & Reattach to Different Instance

### Disaster Recovery Scenario

```bash
echo "=== EXERCISE 5: Detach Volume & Attach to Different Instance ==="

VOLUME_TO_RECOVER="vol-from-ex3"
SOURCE_INSTANCE="ex3-instance"
TARGET_INSTANCE="ex1-instance"
REGION="us-east-1"

echo "Scenario: Instance $SOURCE_INSTANCE crashed, recover data via $TARGET_INSTANCE"
```

{% stepper %}
{% step %}
### Unmount from Source Instance

```bash
echo "=== STEP: Unmount Volume from Source Instance ==="
ssh -i $SSH_KEY ec2-user@$SOURCE_IP << 'ENDSSH'
sudo umount /mnt/app-data
df -h
echo "✓ Unmounted"
ENDSSH
```
{% endstep %}

{% step %}
### Detach Volume & Wait

```bash
echo "=== STEP: Detach Volume from Source Instance ==="
aws ec2 detach-volume --volume-id $VOLUME_TO_RECOVER --region $REGION

echo "Waiting for detachment..."
while true; do
  STATE=$(aws ec2 describe-volumes --volume-ids $VOLUME_TO_RECOVER \
    --region $REGION --query 'Volumes[0].State' --output text)
  if [ "$STATE" == "available" ]; then
    echo "✓ Volume detached and available"
    break
  fi
  echo "State: $STATE..."
  sleep 3
done
```
{% endstep %}

{% step %}
### Attach to Recovery Instance & Mount

```bash
echo "=== STEP: Attach Volume to Recovery Instance ==="
aws ec2 attach-volume \
  --volume-id $VOLUME_TO_RECOVER \
  --instance-id $TARGET_INSTANCE_ID \
  --device /dev/sdg \
  --region $REGION

sleep 10

ssh -i $SSH_KEY ec2-user@$TARGET_INSTANCE_IP << 'ENDSSH'
lsblk
sudo fsck.ext4 -n /dev/xvdg1
sudo mkdir -p /mnt/recovered-volume
sudo mount /dev/xvdg1 /mnt/recovered-volume
ls -la /mnt/recovered-volume/
cat /mnt/recovered-volume/test.txt
ENDSSH
```

Explain:

* fsck with -n does a non-destructive check.
* Mount and inspect recovered data.
{% endstep %}
{% endstepper %}

***

## EXERCISE 6: Complete Expansion Workflow

### End-to-End Three-Layer Expansion

```bash
echo "=== EXERCISE 6: Three-Layer Volume Expansion ==="

INSTANCE_IP="instance-for-expansion"
SSH_KEY="my-key.pem"

echo "=== SETUP: Increase EBS Volume from 8GB to 16GB (done in AWS CLI or Console) ==="
echo "Assume volume is already modified in AWS to 16GB"
```

```bash
ssh -i $SSH_KEY ec2-user@$INSTANCE_IP << 'ENDSSH'

echo "=== STEP 2: Check Current State ==="
lsblk
df -h /
df -T /

echo "=== STEP 3: Layer 1 Expansion - Growing Partition ==="
sudo apt-get install -y cloud-guest-utils > /dev/null 2>&1
sudo growpart /dev/xvda 1
lsblk

echo "=== STEP 4: Layer 2 Expansion - Growing Filesystem ==="
FS_TYPE=$(df -T / | tail -1 | awk '{print $2}')
if [ "$FS_TYPE" == "ext4" ]; then
  sudo resize2fs /dev/xvda1
elif [ "$FS_TYPE" == "xfs" ]; then
  sudo xfs_growfs /
fi

echo "=== STEP 5: Verify Expansion ==="
df -h /
lsblk

ENDSSH
```

Explain:

* Three layers: AWS volume, Linux partition, filesystem.
* growpart adjusts the partition; resize2fs/xfs\_growfs expands the filesystem.

***

## Quick Copy-Paste Command Sets

### For ext4 Root Volume Expansion

```bash
# On the instance:
sudo apt-get update && sudo apt-get install -y cloud-guest-utils
sudo growpart /dev/xvda 1
sudo resize2fs /dev/xvda1
df -h /
```

### For XFS Root Volume Expansion

```bash
# On the instance:
sudo yum install -y cloud-utils-growpart
sudo growpart /dev/xvda 1
sudo xfs_growfs /
df -h /
```

### For Secondary Volume with fstab

```bash
# Get UUID
sudo blkid /dev/xvdf1

# Backup fstab
sudo cp /etc/fstab /etc/fstab.backup

# Add entry (replace UUID)
echo "UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx /mnt/data ext4 defaults,nofail 0 0" | sudo tee -a /etc/fstab

# Test
sudo mount -a

# Verify
df -h /mnt/data
```

### For Volume Detach/Reattach

```bash
# On source instance
sudo umount /mnt/data

# From local machine
aws ec2 detach-volume --volume-id vol-xxx --instance-id i-source

# Wait for available, then
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-target --device /dev/sdf

# On target instance
sudo mount /dev/xvdf /mnt/recovered
```

***

## Display Diagram Notes for Live Demo

Show these diagrams during demo:

* Volume Lifecycle Diagram: Create → Available → Attach → In-Use → Detach → Reattach
* Filesystem Mount Diagram: Block Device → Create FS → Create Mount Point → Mount → Data Access
* Three-Layer Expansion: AWS Volume | Linux Partition | Filesystem
* fstab Field Explanation: Device | Mount Point | Type | Options | Dump | Pass

***

## Post-Demo Assessment Questions

<details>

<summary>1. Why do we need to wait for the volume to be 'available' before attaching?</summary>

You must wait because a volume must be in the "available" state before it can be attached; attaching while it's still being created or modified may fail or produce undefined behavior.

</details>

<details>

<summary>2. What's the difference between /dev/xvdf (device) and /dev/xvdf1 (partition)?</summary>

The device (/dev/xvdf) refers to the whole block device; /dev/xvdf1 refers to a partition on that device. Filesystems are often on partitions (e.g., xvdf1).

</details>

<details>

<summary>3. Why can't we attach the same volume to two instances simultaneously?</summary>

Most EBS volume types are single-writer: they can be attached in read-write mode to only one instance at a time to prevent filesystem corruption. (Some multi-attach capable volumes exist with constraints, but are not covered here.)

</details>

<details>

<summary>4. What happens if you reboot before adding to fstab?</summary>

If the volume isn't configured in fstab, it won't be automatically mounted after reboot and any applications expecting it may fail.

</details>

<details>

<summary>5. Why is testing fstab with 'mount -a' critical?</summary>

mount -a tests the fstab entries without rebooting; it verifies syntax and mountability so you avoid boot-time failures.

</details>

<details>

<summary>6. When would you use ext4 vs XFS?</summary>

ext4 is a general-purpose filesystem with wide compatibility; XFS is preferred for very large filesystems and high-performance workloads. Choice depends on workload and platform support.

</details>

<details>

<summary>7. Explain the three layers of expansion in one sentence each.</summary>

AWS Volume: increase the EBS size in the cloud; Linux Partition: extend the partition to use the new disk space (growpart); Filesystem: resize the filesystem (resize2fs/xfs\_growfs) so the OS can use the added space.

</details>

<details>

<summary>8. How would you recover data from a crashed instance?</summary>

Detach the EBS volume (after unmounting if possible) and attach it to a recovery instance, then mount the filesystem and copy data; or use snapshots to restore to a new volume.

</details>

***

Students should be able to answer all 8 assessment questions after completing the demo.

# I want to demonstarte the excercises on EBS volume

Below are clear, executable steps and commands for each demo scenario you requested. Assume:

* You have AWS CLI configured with required IAM permissions.
* You have an EC2 instance running Linux (replace instance IDs, device names, region, availability zone, volume IDs, and sizes with your real values).
* Commands run as root or with sudo where needed.

Use the stepper format for each exercise.

{% stepper %}
{% step %}
### Exercise: Create a new volume and attach it to an EC2 instance

1. Create a new EBS volume (example: 10 GiB, gp3, same AZ as instance)

```bash
aws ec2 create-volume \
  --availability-zone us-east-1a \
  --size 10 \
  --volume-type gp3 \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=demo-volume-1}]'
```

Note the VolumeId from the output (e.g., vol-0123456789abcdef0).

2. Attach the volume to an EC2 instance (example device /dev/sdf)

```bash
aws ec2 attach-volume \
  --volume-id vol-0123456789abcdef0 \
  --instance-id i-0abcdef1234567890 \
  --device /dev/sdf
```

3. On the instance: identify the device (NVMe instances show /dev/nvm&#x65;_&#x6E;_)

```bash
# List block devices
lsblk

# On NVMe-based instance map AWS device name to NVMe:
sudo nvme list
# or check symlinks:
ls -l /dev/disk/by-id | grep vol-0123456789abcdef0
```

4. Create filesystem and mount

```bash
# Create ext4 filesystem
sudo mkfs.ext4 /dev/xvdf             # or /dev/nvme1n1 depending on lsblk

# Create mount point and mount
sudo mkdir -p /mnt/ebs-demo1
sudo mount /dev/xvdf /mnt/ebs-demo1

# Verify
df -h /mnt/ebs-demo1
lsblk -f
```
{% endstep %}

{% step %}
### Exercise: Increase the attached volume size without downtime (volume remains available)

Overview: Use AWS ModifyVolume to increase EBS volume size. Then, inside the instance, expand the partition (if present) and the filesystem using growpart + resize2fs (ext4) or xfs\_growfs (XFS).

1. Modify EBS volume (example: increase from 10 GiB to 30 GiB)

```bash
aws ec2 modify-volume \
  --volume-id vol-0123456789abcdef0 \
  --size 30
```

2. Wait for modification to complete (or use describe to check)

```bash
aws ec2 describe-volumes-modifications --volume-ids vol-0123456789abcdef0
```

3. On the instance: rescan the block device (Linux kernel should detect size change automatically; on some systems echoing to/sys is needed)

```bash
# For non-NVMe devices:
sudo echo 1 > /sys/block/xvd*/device/rescan    # use appropriate device name

# For NVMe devices: trigger rescan with nvme-cli (if nvme)
sudo apt-get update && sudo apt-get install -y nvme-cli   # if not installed
sudo nvme rescan
```

4. If the device has a partition (e.g., /dev/xvdf1), use growpart to expand the partition, then grow the filesystem.

Install cloud-guest-utils (for growpart) or cloud-utils-growpart if needed:

```bash
# Debian/Ubuntu
sudo apt-get install -y cloud-guest-utils

# RHEL/CentOS
sudo yum install -y cloud-utils-growpart
```

Use growpart:

```bash
# Example: expand partition 1 on /dev/xvdf
sudo growpart /dev/xvdf 1
```

5. Grow the filesystem:

* For ext4

```bash
sudo resize2fs /dev/xvdf1
# Or if filesystem is on the whole disk:
sudo resize2fs /dev/xvdf
```

* For XFS

```bash
# Ensure mount is mounted; xfs_growfs grows a mounted filesystem by mountpoint
sudo xfs_growfs /mnt/ebs-demo1
```

6. Verify increased size

```bash
df -h /mnt/ebs-demo1
lsblk
```

Notes:

* If volume was used as an LVM PV, follow lvextend then resize filesystem (lvextend + resize2fs/xfs\_growfs).
* No instance reboot is required for most modern kernels and NVMe devices when resizing a non-root or root filesystem online (but test beforehand).
{% endstep %}

{% step %}
### Exercise: Create a new volume and attach it to a new instance

1. Create volume (example 20 GiB)

```bash
aws ec2 create-volume \
  --availability-zone us-east-1a \
  --size 20 \
  --volume-type gp3 \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=demo-volume-2}]'
```

2. Attach to a different EC2 instance

```bash
aws ec2 attach-volume \
  --volume-id vol-0abcdef1234567890 \
  --instance-id i-0fedcba9876543210 \
  --device /dev/sdg
```

3. On the new instance: identify device, create filesystem and mount

```bash
sudo lsblk
sudo mkfs.ext4 /dev/xvdg
sudo mkdir -p /mnt/ebs-demo2
sudo mount /dev/xvdg /mnt/ebs-demo2
df -h /mnt/ebs-demo2
```
{% endstep %}

{% step %}
### Exercise: Add the volume to /etc/fstab for automatic mount

Best practice: use filesystem UUID. Steps below assume ext4 and device /dev/xvdf1.

1. Get UUID

```bash
sudo blkid /dev/xvdf1
# Example output: /dev/xvdf1: UUID="abcd-1234" TYPE="ext4"
```

2. Backup fstab

```bash
sudo cp /etc/fstab /etc/fstab.bak
```

3. Add entry to /etc/fstab using UUID (replace with real UUID and mount point)

```
UUID=abcd-1234  /mnt/ebs-demo1  ext4  defaults,nofail  0  2
```

* nofail ensures boot continues if the volume is missing.
* For XFS use type xfs and appropriate options.

4. Test the fstab entry without reboot

```bash
sudo umount /mnt/ebs-demo1
sudo mount -a
# Verify
mount | grep /mnt/ebs-demo1
df -h /mnt/ebs-demo1
```

If mount -a fails, restore /etc/fstab.bak:

```bash
sudo cp /etc/fstab.bak /etc/fstab
```
{% endstep %}

{% step %}
### Exercise: Unmount a volume and attach it to another instance (DR / data recovery scenario)

1. On instance A: unmount cleanly and detach volume

```bash
# Unmount
sudo umount /mnt/ebs-demo1

# Optional: ensure data flushed
sudo sync

# Detach via AWS CLI
aws ec2 detach-volume --volume-id vol-0123456789abcdef0
```

Wait until state is "available":

```bash
aws ec2 describe-volumes --volume-ids vol-0123456789abcdef0 --query "Volumes[0].State"
```

2. Attach to instance B

```bash
aws ec2 attach-volume \
  --volume-id vol-0123456789abcdef0 \
  --instance-id i-0fedcba9876543210 \
  --device /dev/sdf
```

3. On instance B: discover device, mount using UUID or device path

```bash
# Find device and filesystem
sudo lsblk
sudo blkid

# Mount (example using UUID from blkid)
sudo mkdir -p /mnt/ebs-recovery
sudo mount /dev/xvdf1 /mnt/ebs-recovery
ls -l /mnt/ebs-recovery
```

Notes:

* Ensure file system is clean before mounting; run fsck if needed (unmounted only).

```bash
sudo fsck -fy /dev/xvdf1
```

* If the source used LVM, take extra steps to deactivate/activate volume groups on the target.
{% endstep %}

{% step %}
### Exercise: growpart, growfs, resize2fs — three-layer expansion (volume → partition → filesystem)

This summarizes the commands used to expand the three layers after you increase the EBS size via ModifyVolume.

1. Confirm kernel sees larger block device

```bash
lsblk
# Check size shows increased; if not, rescan
sudo growpart --version || sudo apt-get install -y cloud-guest-utils
```

2. Expand partition with growpart (example partition 1 on /dev/xvdf)

```bash
sudo growpart /dev/xvdf 1
# Output indicates partition resized
lsblk
```

3. Expand filesystem

* For ext4:

```bash
sudo resize2fs /dev/xvdf1
# Or if filesystem is on the whole device:
sudo resize2fs /dev/xvdf
```

* For XFS (must be mounted; specify mountpoint)

```bash
sudo xfs_growfs /mnt/ebs-demo1
```

4. Verify final size

```bash
df -h /mnt/ebs-demo1
lsblk -f
```

Example full sequence after ModifyVolume:

```bash
# 1. Check device
lsblk

# 2. Expand partition
sudo growpart /dev/xvdf 1

# 3. Resize filesystem (ext4)
sudo resize2fs /dev/xvdf1

# 4. Verify
df -h /mnt/ebs-demo1
```

Caveats:

* If using LVM: pvresize -> lvextend -> resize2fs/xfs\_growfs.
* XFS cannot be shrunk; ext4 can be shrunk offline.
* Root volumes may need extra caution; test in lab before production.
{% endstep %}
{% endstepper %}

Expandable: Troubleshooting & Common checks

<details>

<summary>Quick troubleshooting checks</summary>

* If lsblk or df does not show new size: rescan device (nvme rescan or echo to /sys/block/\*/device/rescan).
* If growpart fails: ensure partition table supports expansion (GPT/MBR) and that partition is the last on disk.
* If mount -a fails after adding to /etc/fstab: check for typos, correct UUID, and use nofail for non-critical mounts.
* If filesystem check required: run fsck on unmounted ext4 volumes: sudo fsck -fy /dev/XXX
* If attaching volume to another instance and it won’t mount: confirm device name mapping (NVMe instances map differently) and that the filesystem is intact.

</details>

Final notes:

* Replace placeholder IDs, device names, AZs, and mountpaths with your environment values.
* Encourage students to perform these steps in a sandbox account and to snapshot volumes before risky operations.

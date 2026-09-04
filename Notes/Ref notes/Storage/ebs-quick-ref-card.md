# ebs quick ref card

## Installation Prerequisites

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y cloud-guest-utils awscli jq

# CentOS/RHEL  
sudo yum install -y cloud-utils-growpart awscli jq

# Verify AWS CLI
aws --version
which growpart
```

***

## Complete Workflow at a Glance

{% stepper %}
{% step %}
### CREATE (AWS)

aws ec2 create-volume
{% endstep %}

{% step %}
### ATTACH (AWS)

aws ec2 attach-volume
{% endstep %}

{% step %}
### FORMAT (Linux)

sudo mkfs.ext4 /dev/xvdf
{% endstep %}

{% step %}
### MOUNT (Linux)

sudo mount /dev/xvdf /mnt/data
{% endstep %}

{% step %}
### AUTOBOOT (fstab)

echo UUID=... >> /etc/fstab
{% endstep %}

{% step %}
### RESIZE (all 3)

modify-volume → growpart → resize2fs
{% endstep %}

{% step %}
### RECOVER (detach)

detach → attach to new instance
{% endstep %}
{% endstepper %}

***

## AWS CLI Commands Cheatsheet

| Task               | Command                                                                            |
| ------------------ | ---------------------------------------------------------------------------------- |
| Create 10GB volume | `aws ec2 create-volume --size 10 --volume-type gp3 --availability-zone us-east-1a` |
| List volumes       | `aws ec2 describe-volumes --output table`                                          |
| Attach volume      | `aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx --device /dev/sdf`  |
| Modify size        | `aws ec2 modify-volume --volume-id vol-xxx --size 20`                              |
| Check modification | `aws ec2 describe-volumes-modifications --volume-ids vol-xxx`                      |
| Detach volume      | `aws ec2 detach-volume --volume-id vol-xxx`                                        |
| Take snapshot      | `aws ec2 create-snapshot --volume-id vol-xxx --description "backup"`               |

***

## Linux Commands Cheatsheet

| Task           | ext4                             | xfs                              |
| -------------- | -------------------------------- | -------------------------------- |
| Check type     | `df -T`                          | `df -T`                          |
| List devices   | `lsblk`                          | `lsblk`                          |
| Create FS      | `sudo mkfs.ext4 /dev/xvdf`       | `sudo mkfs.xfs /dev/xvdf`        |
| Mount          | `sudo mount /dev/xvdf /mnt/data` | `sudo mount /dev/xvdf /mnt/data` |
| Get UUID       | `sudo blkid /dev/xvdf`           | `sudo blkid /dev/xvdf`           |
| Unmount        | `sudo umount /mnt/data`          | `sudo umount /mnt/data`          |
| Grow partition | `sudo growpart /dev/xvdf 1`      | `sudo growpart /dev/xvdf 1`      |
| Expand FS      | `sudo resize2fs /dev/xvdf1`      | `sudo xfs_growfs /mnt/data`      |
| Check space    | `df -h`                          | `df -h`                          |

***

## fstab Configuration Template

```bash
# Pattern: UUID=<uuid> <mount-point> <type> <options> <dump> <pass>

# Example for ext4
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890 /mnt/data ext4 defaults,nofail 0 0

# Example for XFS  
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890 /mnt/data xfs defaults,nofail 0 0

# Options explained:

# defaults    = standard mount options
# nofail      = don't fail boot if volume missing
# 0           = dump flag (0 = disabled)
# 0           = fsck pass (0 = skip)
```

***

## The Three-Layer Expansion (Critical!)

{% stepper %}
{% step %}
### Layer 1: AWS Console/CLI

aws ec2 modify-volume --size 20

Status: creating → modifying → optimizing → completed
{% endstep %}

{% step %}
### Layer 2: Linux Partition

sudo growpart /dev/xvda 1

Expands partition table to fill disk
{% endstep %}

{% step %}
### Layer 3: Linux Filesystem

ext4: sudo resize2fs /dev/xvda1\
xfs: sudo xfs\_growfs /

Expands filesystem to fill partition
{% endstep %}

{% step %}
### Verify

df -h | lsblk
{% endstep %}
{% endstepper %}

***

## Common Commands During Demo

### Exercise 1: Create & Attach

```bash
# Get AZ
aws ec2 describe-instances --instance-ids i-xxx \
  --query 'Reservations[0].Instances[0].Placement.AvailabilityZone'

# Create volume
aws ec2 create-volume --size 10 --volume-type gp3 \
  --availability-zone us-east-1a

# Attach volume  
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx \
  --device /dev/sdf

# In instance:
lsblk
sudo mkfs.ext4 /dev/xvdf
sudo mount /dev/xvdf /mnt/data
df -h
```

### Exercise 2: Resize (No Downtime!)

```bash
# Snapshot first!
aws ec2 create-snapshot --volume-id vol-xxx \
  --description "backup"

# Modify size (instance stays running!)
aws ec2 modify-volume --volume-id vol-xxx --size 20

# Wait for completion
aws ec2 describe-volumes-modifications --volume-ids vol-xxx

# In instance:
lsblk
sudo growpart /dev/xvdf 1
sudo resize2fs /dev/xvdf1  # or xfs_growfs /mnt/data
df -h
```

### Exercise 4: fstab Setup

```bash
# Get UUID
sudo blkid /dev/xvdf

# Backup fstab (CRITICAL!)
sudo cp /etc/fstab /etc/fstab.backup

# Add to fstab
echo "UUID=xxx /mnt/data ext4 defaults,nofail 0 0" | \
  sudo tee -a /etc/fstab

# Test (BEFORE REBOOT!)
sudo mount -a

# Verify
df -h
sudo reboot
df -h  # after reboot
```

### Exercise 5: Disaster Recovery

```bash
# On source instance:
sudo umount /mnt/data

# Detach
aws ec2 detach-volume --volume-id vol-xxx

# Wait for available
aws ec2 describe-volumes --volume-ids vol-xxx

# Attach to new instance
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-new \
  --device /dev/sdf

# On new instance:
sudo mkdir -p /mnt/recovered
sudo mount /dev/xvdf /mnt/recovered
ls /mnt/recovered  # Your data is here!
```

***

## Decision Tree: Which Tool to Use?

Do you need to expand something?

* "AWS Console" → Volume Size\
  Command: aws ec2 modify-volume
* "Partition" → Device space showing less than disk\
  Command: sudo growpart /dev/xvda 1
* "Filesystem" → Mounted space showing old size
  * ext4? → sudo resize2fs /dev/xvda1
  * xfs? → sudo xfs\_growfs /

***

## Troubleshooting Quick Fixes

| Problem             | Check            | Fix                                  |
| ------------------- | ---------------- | ------------------------------------ |
| Volume won't attach | Same AZ?         | Use snapshot to create in correct AZ |
| growpart: NOCHANGE  | Modify complete? | Wait for AWS modification            |
| resize2fs: busy     | Mounted?         | Run on mounted fs - that's OK        |
| fstab boot fail     | Syntax OK?       | Boot from recovery instance, fix     |
| Volume shows small  | Check type       | Device (xvdf) vs Partition (xvdf1)   |

***

## Success Checklist After Each Exercise

### Exercise 1: ✓ Volume Created & Mounted

* [ ] `aws ec2 describe-volumes` shows volume in-use
* [ ] `lsblk` shows device in instance
* [ ] `df -h` shows mount point
* [ ] Can read/write files to mount

### Exercise 2: ✓ Resized Without Downtime

* [ ] Instance stayed running (ping never failed)
* [ ] `lsblk` shows new partition size
* [ ] `df -h` shows new filesystem size
* [ ] Data is still accessible

### Exercise 3: ✓ New Instance Ready

* [ ] New instance running
* [ ] New volume attached
* [ ] Volume mounted and formatted
* [ ] Can access empty volume

### Exercise 4: ✓ Auto-Mount Configured

* [ ] fstab backup exists
* [ ] fstab entry is correct
* [ ] `sudo mount -a` succeeds
* [ ] Volume mounts after reboot

### Exercise 5: ✓ Data Recovered

* [ ] Volume detached from source
* [ ] Volume attached to target
* [ ] Data is accessible on target
* [ ] No data loss during transfer

### Exercise 6: ✓ Full Expansion Mastered

* [ ] All 3 layers understood
* [ ] Knows when to use each command
* [ ] Can troubleshoot each layer
* [ ] Can explain to someone else

***

## Post-Demo Student Assessment

Ask each student:

1. "Create a volume and attach to an instance in the same AZ."
   * Expected: Uses aws ec2 create-volume + attach-volume
2. "Your filesystem is at 95% capacity. Walk me through expansion."
   * Expected: modify-volume → growpart → resize2fs/xfs\_growfs
3. "Add a volume to fstab for permanent mount. What's critical?"
   * Expected: Mentions blkid, backup, mount -a test, nofail option
4. "Instance crashed. How do you recover data?"
   * Expected: umount → detach → attach to rescue → mount
5. "Difference between ext4 (resize2fs) and XFS (xfs\_growfs)?"
   * Expected: Different filesystems, different expansion tools

All 5 correct = Passed! Student is ready for production work.

***

## Real-World Scenarios They'll Face

| Scenario                        | Solution                          |
| ------------------------------- | --------------------------------- |
| App running out of space        | Exercise 2 workflow (resize live) |
| New microservice needs storage  | Exercise 3 workflow               |
| Instance crashed, data lost?    | Exercise 5 workflow               |
| Volume won't mount after reboot | Exercise 4 fix (fstab)            |
| DB needs high performance       | Use io1/io2 volumes               |
| Multi-AZ setup                  | Snapshot + restore                |
| Disaster recovery plan          | All exercises combined            |

***

## Links & Resources

* [AWS EBS User Guide](https://docs.aws.amazon.com/ebs/)
* [Linux mkfs Documentation](https://linux.die.net/man/8/mkfs)
* [fstab Man Page](https://linux.die.net/man/5/fstab)
* [growpart Tool](https://linux.die.net/man/8/growpart)

***

Print this card and keep it on your desk during demos!

Created for: Live DevOps Training | Time to master: 70 minutes | Exercises: 6

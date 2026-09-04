# EBS Volumes Demo   \_\_AWS CONSOLE ONLY + EC2 Instan

## Prerequisites (Console Setup - 5 minutes)

* Open AWS Console → EC2 Dashboard
* Launch 3 EC2 instances (same AZ, t2.micro, Amazon Linux 2)
* Name them: `demo-instance-1`, `demo-instance-2`, `demo-instance-3`
* Note their AZ (e.g., `us-east-1a`) — ALL volumes must be in the same AZ
* SSH access ready to all 3 instances

***

## EXERCISE 1: Create Volume & Attach (Console)

Real Scenario: "Web app needs 10GB extra storage"

{% stepper %}
{% step %}
#### Console: Create volume

* EC2 Dashboard → "Volumes" (left sidebar)
* Click "Create Volume"
* Size: 10 GiB | Type: gp3 | AZ: us-east-1a (same as instance)
* Name: "webapp-data-vol"
* Click "Create volume"
* Wait for Status: "Available"
{% endstep %}

{% step %}
#### Console: Attach to demo-instance-1

* Select the volume → Actions → Attach volume
* Instance: `demo-instance-1` | Device: `/dev/sdf`
* Click "Attach volume"
* Status changes: Available → in-use
{% endstep %}
{% endstepper %}

Instance Commands (SSH to demo-instance-1):

{% code title="Instance commands" %}
```bash
# Check attached volume
lsblk

# Shows: xvdf    202:80   0   10G  0 disk  ← NEW VOLUME

# Create mount point
sudo mkdir /mnt/webapp-data

# Create filesystem (formats the volume)
sudo mkfs.ext4 /mnt/webapp-data

# Mount it
sudo mount /dev/xvdf /mnt/webapp-data

# Verify
df -h | grep webapp-data

# Shows: /dev/xvdf      9.8G   24K  9.3G   1% /mnt/webapp-data

# Test it
echo "Web app data" | sudo tee /mnt/webapp-data/test.txt
cat /mnt/webapp-data/test.txt
```
{% endcode %}

✅ Success: Volume mounted and writable

***

## EXERCISE 2: Resize Volume (NO DOWNTIME)

Real Scenario: "Web app storage 90% full at 2 AM"

{% stepper %}
{% step %}
#### Console: Modify volume

* EC2 → Volumes → Select "webapp-data-vol"
* Actions → Modify Volume
* New size: 20 GiB
* Click "Modify"
* Status: optimizing (wait 2-5 mins)
* Refresh until "100% Complete"
{% endstep %}

{% step %}
#### Instance (while instance stays running)

* SSH to `demo-instance-1` and run the commands below to expand partition and filesystem online
{% endstep %}
{% endstepper %}

Instance Commands (SSH to demo-instance-1):

{% code title="Instance commands" %}
```bash
# Install tools (one-time)
sudo yum install -y cloud-utils-growpart

# Check current state
lsblk

# Shows: xvdf 20G (disk), xvdf1 10G (partition still old)

df -h /mnt/webapp-data

# Shows: 9.8G (filesystem still old)

# Step 1: Expand PARTITION
sudo growpart /dev/xvdf 1

# Verify partition expanded
lsblk

# Now: xvdf1 20G ✓

# Step 2: Expand FILESYSTEM (online - no unmount!)
sudo resize2fs /dev/xvdf1

# Verify final size
df -h /mnt/webapp-data

# Now: 19.6G ✓

# Data still there!
cat /mnt/webapp-data/test.txt
```
{% endcode %}

✅ Success: 10GB → 20GB without stopping the instance

***

## EXERCISE 3: New Volume + New Instance (Console)

Real Scenario: "Deploying new microservice needs storage"

{% stepper %}
{% step %}
#### Console: Create new volume

* Size: 15 GiB | AZ: us-east-1a
* Name: "microservice-data-vol"
{% endstep %}

{% step %}
#### Console: Attach to demo-instance-2

* Actions → Attach volume
* Instance: `demo-instance-2`
* Device: `/dev/sdf`
{% endstep %}
{% endstepper %}

Instance Commands (SSH to demo-instance-2):

{% code title="Instance commands" %}
```bash
# Check new volume
lsblk

# Shows: xvdf 15G

# Setup exactly like Exercise 1
sudo mkdir /mnt/microservice-data
sudo mkfs.ext4 /dev/xvdf
sudo mount /dev/xvdf /mnt/microservice-data
df -h | grep microservice-data

# Test
echo "Microservice logs" | sudo tee /mnt/microservice-data/logs.txt
cat /mnt/microservice-data/logs.txt
```
{% endcode %}

✅ Success: New instance has new storage ready

***

## EXERCISE 4: Make Volume Permanent (fstab)

Real Scenario: "Instance rebooted, volume disappeared!"

Instance Commands (SSH to demo-instance-2):

{% code title="Instance commands" %}
```bash
# 1. Get volume UUID (CRITICAL!)
sudo blkid /dev/xvdf

# Copy: UUID="1234abcd-5678-efgh-ijkl-9012mnopqrst"

# 2. BACKUP fstab (CRITICAL!)
sudo cp /etc/fstab /etc/fstab.backup

# 3. Add to fstab
sudo nano /etc/fstab

# Add this line at bottom:
# UUID=1234abcd-5678-efgh-ijkl-9012mnopqrst /mnt/microservice-data ext4 defaults,nofail 0 0

# 4. TEST before reboot (CRITICAL!)
sudo mount -a

# No errors = good!

# 5. Verify
mount | grep microservice-data

# 6. Test reboot
sudo reboot
```
{% endcode %}

After reboot (SSH back in):

```bash
df -h | grep microservice-data

# Volume auto-mounted! ✓
```

***

## EXERCISE 5: Move Volume to Different Instance (Recovery)

Real Scenario: "demo-instance-2 crashed! Recover data"

Instance Commands (SSH to demo-instance-2 - BEFORE detach):

{% code title="Before detach (on demo-instance-2)" %}
```bash
# Unmount first (CRITICAL!)
sudo umount /mnt/microservice-data
df -h  # Should NOT show it mounted
```
{% endcode %}

AWS Console Steps:

{% stepper %}
{% step %}
* EC2 → Volumes → "microservice-data-vol"
* Actions → Detach volume
* Wait: in-use → available (1-2 mins)
{% endstep %}

{% step %}
* Attach to `demo-instance-1`:
  * Actions → Attach volume
  * Instance: `demo-instance-1`
  * Device: `/dev/sdg` (different device name)
{% endstep %}
{% endstepper %}

Instance Commands (SSH to demo-instance-1):

{% code title="On demo-instance-1" %}
```bash
# Check new device
lsblk

# Shows: xvdg 15G (new device name)

# Mount recovered volume
sudo mkdir /mnt/recovered-data
sudo mount /dev/xvdg /mnt/recovered-data

# Data is here!
ls -la /mnt/recovered-data/
cat /mnt/recovered-data/logs.txt

# "Microservice logs" ✓
```
{% endcode %}

✅ Success: Data recovered on different instance!

***

## EXERCISE 6: Root Volume Expansion (growpart + resize2fs Deep Dive)

Real Scenario: "Root filesystem 95% full!"

{% stepper %}
{% step %}
#### Console: Modify root volume

* EC2 → Volumes → Find root volume of `demo-instance-3`
* Actions → Modify Volume → 20 GiB
* Wait for 100% complete
{% endstep %}

{% step %}
#### Instance: expand partition and filesystem on root

* SSH to `demo-instance-3` and follow the commands below
{% endstep %}
{% endstepper %}

Instance Commands (SSH to demo-instance-3):

{% code title="Instance commands" %}
```bash
# Install tools
sudo yum install -y cloud-utils-growpart

# BEFORE state
echo "=== BEFORE ==="
lsblk

# xvda 20G (disk), xvda1 8G (partition)

df -h /

# 7.8G (filesystem)

# Step 1: Expand PARTITION
sudo growpart /dev/xvda 1
lsblk

# xvda1 now 20G ✓

# Step 2: Check filesystem type
df -T /

# ext4 ✓

# Step 3: Expand FILESYSTEM (root = /)
sudo resize2fs /dev/xvda1

# AFTER state
echo "=== AFTER ==="
df -h /

# 19.6G ✓

lsblk
```
{% endcode %}

✅ Success: Root volume fully expanded!

***

## ONE-PAGE CHEAT SHEET (Print This!)

{% code title="Cheat Sheet" %}
```
EBS VOLUME WORKFLOW (Console + Instance)

1️⃣ CREATE → Console: Volumes → Create Volume → Attach
2️⃣ FORMAT → sudo mkfs.ext4 /dev/xvdf
3️⃣ MOUNT → sudo mount /dev/xvdf /mnt/data
4️⃣ FSTAB → sudo blkid → nano /etc/fstab → sudo mount -a
5️⃣ RESIZE→ Console: Modify Volume → growpart → resize2fs
6️⃣ RECOVER→ Console: Detach → Attach new → mount /dev/xvdX

EXT4 COMMANDS:
├─ Partition: sudo growpart /dev/xvdf 1
├─ Filesystem: sudo resize2fs /dev/xvdf1  
└─ Check: df -h

XFS COMMANDS:
├─ Partition: sudo growpart /dev/xvdf 1
└─ Filesystem: sudo xfs_growfs /mnt/data

CRITICAL CHECKS:
├─ lsblk (see devices)
├─ df -h (see mounted space)  
├─ df -T (see filesystem type)
└─ sudo mount -a (test fstab)
```
{% endcode %}

***

## TEACHING FLOW (70 minutes total)

| Time  | Exercise         | Console         | Instance Commands |
| ----- | ---------------- | --------------- | ----------------- |
| 0-10  | 1: Create+Attach | ✅ 3 clicks      | 6 commands        |
| 10-25 | 2: Resize Live   | ✅ Modify        | 8 commands        |
| 25-37 | 3: New Volume    | ✅ 3 clicks      | 6 commands        |
| 37-45 | 4: fstab         | -               | 8 commands        |
| 45-55 | 5: Recovery      | ✅ Detach/Attach | 5 commands        |
| 55-67 | 6: Root Expand   | ✅ Modify        | 8 commands        |
| 67-70 | Q\&A             | -               | -                 |

***

## STUDENT ASSESSMENT QUESTIONS (End of Demo)

<details>

<summary>Console: How do you resize a volume?</summary>

Answer: Modify Volume

</details>

<details>

<summary>What's /dev/xvdf vs /dev/xvdf1?</summary>

Answer: Device vs Partition

</details>

<details>

<summary>Why run sudo mount -a before reboot?</summary>

Answer: Test fstab

</details>

<details>

<summary>Instance crashed - 4 steps to recover data?</summary>

Answer: Unmount → Detach → Attach → Mount

</details>

<details>

<summary>ext4 vs XFS command?</summary>

Answer: ext4 uses resize2fs; XFS uses xfs\_growfs

</details>

All 5 correct = Production Ready! 🎓

***

Everything in this guide is AWS Console + simple EC2 instance commands. No AWS CLI needed. Print the One-Page Cheat Sheet for students. Ready for your live demo! 🚀

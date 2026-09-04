window.interviewData = window.interviewData || {};

window.interviewData["AWS"] = {
  "Basic": [
    { 
      q: "What is an EC2 instance?", 
      a: "<strong>Detailed Solution:</strong> Elastic Compute Cloud (EC2) is a core AWS web service.<br><ul><li><strong>Function:</strong> It provides resizable compute capacity in the cloud. You are essentially renting virtual computers on which to run your own computer applications.</li><li><strong>Customization:</strong> You have complete control over the instance, including root access, OS selection (Windows/Linux), RAM, CPU, and storage configurations.</li></ul>" 
    },
    { 
      q: "What is a VPC?", 
      a: "<strong>Detailed Solution:</strong> Virtual Private Cloud (VPC) is the networking foundation of AWS.<br><ul><li><strong>Function:</strong> It allows you to provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.</li><li><strong>Control:</strong> You have complete control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways.</li></ul>" 
    },
    { 
      q: "What is an EBS volume?", 
      a: "<strong>Detailed Solution:</strong> Elastic Block Store (EBS) provides persistent block storage volumes for use with EC2 instances.<br><ul><li><strong>Analogy:</strong> Think of it as a physical hard drive (USB drive or internal disk) that you plug into a computer (EC2 instance).</li><li><strong>Features:</strong> They persist independently from the life of an instance, meaning if you stop or terminate an instance, the data on an attached EBS volume can be preserved.</li></ul>" 
    },
    { 
      q: "What is a Security Group?", 
      a: "<strong>Detailed Solution:</strong> A virtual stateful firewall that controls traffic at the instance level.<br><ul><li><strong>Rules:</strong> You can only specify ALLOW rules (not deny rules). By default, all inbound traffic is denied, and all outbound traffic is allowed.</li><li><strong>Stateful:</strong> This means if you allow an incoming request (e.g., HTTP on port 80), the response to that request is automatically allowed to flow back out, regardless of outbound rules.</li></ul>" 
    },
    { 
      q: "What is the difference between a Public and Private subnet?", 
      a: "<strong>Detailed Solution:</strong> The distinction is purely based on routing.<br><ul><li><strong>Public Subnet:</strong> The subnet's Route Table has a specific route (Destination: 0.0.0.0/0) pointing to an Internet Gateway (IGW). Instances here can have public IP addresses and reach the internet.</li><li><strong>Private Subnet:</strong> The subnet has no direct route to an IGW. Instances cannot be reached directly from the internet. To download updates, they must route traffic through a NAT Gateway located in a public subnet.</li></ul>" 
    },
    { 
      q: "What is an AMI?", 
      a: "<strong>Detailed Solution:</strong> Amazon Machine Image (AMI) is a blueprint for an EC2 instance.<br><ul><li><strong>Contents:</strong> It contains the operating system, an application server, and applications required to launch an instance.</li><li><strong>Customization:</strong> You can launch instances from AMIs provided by AWS (like Amazon Linux 2), the AWS Marketplace, or create your own custom AMIs from an existing configured instance for rapid scaling.</li></ul>" 
    },
    { 
      q: "What is an Elastic IP (EIP)?", 
      a: "<strong>Detailed Solution:</strong> A static IPv4 address designed for dynamic cloud computing.<br><ul><li><strong>Problem:</strong> When you stop and start an EC2 instance, its default public IP address changes randomly.</li><li><strong>Solution:</strong> An EIP is allocated to your account and remains fixed. You associate it with an instance, and it masks instance failures by allowing you to rapidly remap the address to another instance in your account.</li></ul>" 
    },
    { 
      q: "What happens to EBS data when an instance is terminated?", 
      a: "<strong>Detailed Solution:</strong> It depends on the volume type and configuration.<br><ul><li><strong>Root Volume:</strong> By default, the `DeleteOnTermination` attribute is set to `true` for the root volume (the drive holding the OS). If the instance is terminated, this volume is deleted.</li><li><strong>Attached Data Volumes:</strong> Secondary volumes added after launch have `DeleteOnTermination` set to `false` by default. They will survive termination and become 'available' for attachment to other instances.</li></ul>" 
    },
    { 
      q: "What is a NAT Gateway?", 
      a: "<strong>Detailed Solution:</strong> Network Address Translation (NAT) allows private resources to access the internet securely.<br><ul><li><strong>Function:</strong> Placed in a public subnet, it acts as a proxy. A database in a private subnet routes its outbound internet requests to the NAT Gateway. The NAT masks the database's private IP with its own public IP, fetches the data, and returns it to the database.</li><li><strong>Security:</strong> The internet cannot initiate a connection back through the NAT Gateway to the private instance.</li></ul>" 
    },
    { 
      q: "What is an EBS Snapshot?", 
      a: "<strong>Detailed Solution:</strong> A point-in-time backup of an EBS volume.<br><ul><li><strong>Storage:</strong> While EBS volumes are stored in specific Availability Zones, Snapshots are backed up directly to Amazon S3 (redundant across the whole region).</li><li><strong>Incremental:</strong> If you take a snapshot today, and another tomorrow, the second snapshot only stores the data blocks that have changed since yesterday, saving significant storage costs.</li></ul>" 
    }
  ],
  "Scenario Based": [
    { 
      q: "Scenario: You lost the SSH key for your EC2 instance. How do you regain access?", 
      a: "<strong>Detailed Solution:</strong> There are two primary recovery methods.<br><ul><li><strong>Method 1 (Modern): AWS Systems Manager (SSM).</strong> If the instance is running an SSM agent and has the appropriate IAM role, use 'Session Manager' in the AWS Console to open a web-based shell, completely bypassing SSH and keys.</li><li><strong>Method 2 (Legacy Volume Swapping):</strong> Stop the instance. Detach its root EBS volume. Spin up a temporary recovery EC2 instance and attach the volume as a secondary drive. Mount it, edit the <code>~/.ssh/authorized_keys</code> file to insert a new public key, unmount, reattach it as the root volume to the original instance, and start it.</li></ul>" 
    },
    { 
      q: "Scenario: Your EC2 instance is in a private subnet but needs to download updates from the internet. How?", 
      a: "<strong>Detailed Solution:</strong> Private instances lack public IPs and IGW routes.<br><ul><li><strong>Step 1:</strong> Provision a <strong>NAT Gateway</strong> inside the Public Subnet of your VPC. Assign it an Elastic IP.</li><li><strong>Step 2:</strong> Go to the Route Table associated with your Private Subnet. Add a route where Destination is <code>0.0.0.0/0</code> and the Target is the NAT Gateway ID.</li><li><strong>Result:</strong> Traffic flows from the private instance to the NAT Gateway, out the IGW, and back.</li></ul>" 
    },
    { 
      q: "Scenario: A web server in a public subnet cannot be reached via HTTP (port 80). How do you troubleshoot?", 
      a: "<strong>Detailed Solution:</strong> Check the networking stack from the outside in.<br><ul><li><strong>1. Security Group:</strong> Check the SG attached to the instance. Does it have an Inbound Rule allowing TCP Port 80 from 0.0.0.0/0?</li><li><strong>2. Network ACL:</strong> Check the Subnet's NACL. Does it allow Inbound 80? Crucially, does it allow Outbound Ephemeral Ports (1024-65535) so the response can return?</li><li><strong>3. Route Table:</strong> Does the subnet route table route 0.0.0.0/0 to an Internet Gateway (IGW)?</li><li><strong>4. OS Level:</strong> SSH in. Is Apache/Nginx running? Is the local OS firewall (iptables) blocking the port?</li></ul>" 
    },
    { 
      q: "Scenario: You need to resize a 10GB gp2 volume to 50GB gp3 with no downtime.", 
      a: "<strong>Detailed Solution:</strong> EBS allows elastic, on-the-fly modifications.<br><ul><li><strong>Step 1 (AWS API):</strong> Select the volume in the console, click 'Modify', change to gp3 and 50GB. The physical disk resizes seamlessly while running.</li><li><strong>Step 2 (OS Partition):</strong> SSH into Linux. Run <code>lsblk</code>. Run <code>sudo growpart /dev/xvda 1</code> to expand the partition table to recognize the new 50GB space.</li><li><strong>Step 3 (OS Filesystem):</strong> Run <code>sudo resize2fs /dev/xvda1</code> (for ext4) or <code>sudo xfs_growfs /</code> (for XFS) to expand the filesystem format. All done with zero downtime.</li></ul>" 
    },
    { 
      q: "Scenario: Your application has unpredictable spikes in traffic. How do you architect EC2?", 
      a: "<strong>Detailed Solution:</strong> Decouple ingestion from processing using horizontal scaling.<br><ul><li><strong>Component 1: Application Load Balancer (ALB).</strong> Place an ALB in the public subnets to act as the single entry point. It distributes traffic evenly.</li><li><strong>Component 2: Auto Scaling Group (ASG).</strong> Place EC2 instances in an ASG spanning multiple AZs. Register the ASG with the ALB target group.</li><li><strong>Component 3: Scaling Policies.</strong> Configure dynamic tracking: 'If average CPU > 70% for 3 mins, launch 2 instances. If CPU < 30%, terminate instances.' This ensures high availability without paying for idle capacity.</li></ul>" 
    },
    { 
      q: "Scenario: You are migrating a DB requiring 20,000 IOPS. Which EBS volume type do you choose?", 
      a: "<strong>Detailed Solution:</strong> You must select a high-performance volume tier.<br><ul><li><strong>Choice: Provisioned IOPS SSD (io1 or io2).</strong></li><li><strong>Explanation:</strong> General purpose SSDs (gp2/gp3) have hard limits. gp3 maxes out at 16,000 IOPS. To guarantee 20,000 IOPS consistently for a critical database, you must provision an `io1` or `io2` volume, which allows you to explicitly dial in the exact IOPS required (up to 256,000 IOPS on Nitro instances).</li></ul>" 
    },
    { 
      q: "Scenario: Two EC2 instances in the same VPC cannot ping each other. Why?", 
      a: "<strong>Detailed Solution:</strong> AWS is highly secure by default; internal traffic is not implicitly trusted.<br><ul><li><strong>Explanation:</strong> Security Groups deny all inbound traffic by default, even from instances in the exact same subnet or VPC.</li><li><strong>Fix:</strong> You must edit the Security Group attached to the destination instance and explicitly add an Inbound Rule allowing ICMP (ping) traffic. The Source should be set to the Private IP of the sender, or better yet, the Security Group ID of the sender.</li></ul>" 
    },
    { 
      q: "Scenario: You need to ensure an EC2 instance always has the exact same private IP address.", 
      a: "<strong>Detailed Solution:</strong> IP management must be decoupled from the instance lifecycle.<br><ul><li><strong>Solution:</strong> Create an Elastic Network Interface (ENI) independent of the instance.</li><li><strong>Process:</strong> Provision an ENI in the target subnet. AWS allows you to assign a specific static primary private IP to it. Then, launch your EC2 instance and attach this ENI to it. If the instance dies, the ENI and its static IP survive and can be attached to a replacement instance instantly.</li></ul>" 
    },
    { 
      q: "Scenario: You want to securely connect your corporate on-premise datacenter to your VPC.", 
      a: "<strong>Detailed Solution:</strong> You need a hybrid cloud networking solution.<br><ul><li><strong>Option 1 (AWS Site-to-Site VPN):</strong> Creates an encrypted IPsec tunnel over the public internet. It is quick to set up and cost-effective, but bandwidth is limited and internet latency can fluctuate.</li><li><strong>Option 2 (AWS Direct Connect):</strong> A dedicated, physical fiber-optic connection established between your datacenter and an AWS facility. It bypasses the public internet entirely, offering massive bandwidth (up to 100 Gbps) and ultra-low, consistent latency.</li></ul>" 
    },
    { 
      q: "Scenario: You accidentally deleted an EC2 instance. Can you recover it?", 
      a: "<strong>Detailed Solution:</strong> EC2 termination is a permanent, destructive action.<br><ul><li><strong>Answer: No.</strong> Once terminated, the virtual machine is gone forever and cannot be undeleted.</li><li><strong>Recovery:</strong> You can only recover if you had backups. You must launch a brand new instance. If you previously created an AMI, launch from that. If you had EBS Snapshots of the data volumes, you can create new volumes from the snapshots and attach them to the new instance.</li></ul>" 
    },
    { 
      q: "Scenario: Automate backups of all EBS volumes in a region without writing custom lambda scripts.", 
      a: "<strong>Detailed Solution:</strong> Use the native AWS backup management service.<br><ul><li><strong>Solution:</strong> AWS Data Lifecycle Manager (DLM) or AWS Backup.</li><li><strong>Process (DLM):</strong> Create a DLM policy. Define a target tag (e.g., `Backup = Daily`). Set a schedule (run at 2 AM). Set a retention rule (keep 7 days). DLM will automatically scan for volumes with that tag, take snapshots nightly, and automatically delete snapshots older than 7 days, fully automating EBS retention.</li></ul>" 
    },
    { 
      q: "Scenario: An instance CPU is pegged at 100%. You need to inspect the application logs, but SSH times out because the OS is unresponsive.", 
      a: "<strong>Detailed Solution:</strong> You need out-of-band access to the filesystem.<br><ul><li><strong>Method 1 (Volume Swapping):</strong> Stop the unresponsive instance. Detach its root EBS volume. Attach it as a secondary data volume (e.g., /dev/sdf) to a healthy 'bastion' instance. SSH into the healthy instance, mount the drive, and read the logs directly from the filesystem.</li><li><strong>Method 2 (Serial Console):</strong> If enabled prior to the crash, use the EC2 Serial Console via the AWS CLI/Console to access the OS bootloader/kernel logs directly, bypassing the networking stack entirely.</li></ul>" 
    },
    { 
      q: "Scenario: Prevent accidental termination of a highly critical database EC2 instance.", 
      a: "<strong>Detailed Solution:</strong> Enable safeguards against human error and API mistakes.<br><ul><li><strong>Solution 1:</strong> Enable <strong>Termination Protection</strong> on the instance. If a user clicks 'Terminate', the API call will fail. They must explicitly disable the protection flag first before the termination call will succeed.</li><li><strong>Solution 2:</strong> Deny the `ec2:TerminateInstances` permission in IAM policies for all users (except specific admins) targeting resources tagged `Environment = Prod`.</li></ul>" 
    },
    { 
      q: "Scenario: Host a static website (HTML/CSS/JS) securely with the lowest possible cost and zero maintenance.", 
      a: "<strong>Detailed Solution:</strong> Do not use EC2 for static assets; it is overkill and expensive.<br><ul><li><strong>Architecture:</strong> Create an Amazon S3 bucket and upload the files. Enable Static Website Hosting.</li><li><strong>Security/Performance:</strong> Place Amazon CloudFront (CDN) in front of the S3 bucket. Use AWS Certificate Manager (ACM) to attach a free SSL certificate to CloudFront. </li><li><strong>Lockdown:</strong> Configure Origin Access Control (OAC) on CloudFront and update the S3 bucket policy to DENY all public access, ONLY allowing reads from the CloudFront distribution.</li></ul>" 
    },
    { 
      q: "Scenario: Restrict SSH access to an EC2 instance so that ONLY traffic from your corporate office IP is allowed.", 
      a: "<strong>Detailed Solution:</strong> Utilize Security Group Inbound rules.<br><ul><li><strong>Implementation:</strong> Edit the Security Group attached to the instance. Remove any rule allowing port 22 from `0.0.0.0/0` (the whole internet).</li><li><strong>Configuration:</strong> Add a new Inbound rule for SSH (TCP Port 22). Set the Source to the specific CIDR block of your corporate public IP (e.g., `203.0.113.50/32`). Only traffic originating from that exact IP will be allowed through the firewall.</li></ul>" 
    },
    { 
      q: "Scenario: Your EC2 instance reaches its limit for network bandwidth, causing packet drops. How do you fix it?", 
      a: "<strong>Detailed Solution:</strong> EC2 network performance is strictly tied to instance size and generation.<br><ul><li><strong>Step 1:</strong> Verify that Enhanced Networking (ENA) is enabled on the instance. This provides higher bandwidth and lower latency.</li><li><strong>Step 2:</strong> If ENA is enabled and you are still maxing out, you MUST change the instance type (e.g., upgrade from `t3.medium` to `m5.large`). In AWS, network bandwidth scales linearly with the size/price of the instance hardware.</li></ul>" 
    },
    { 
      q: "Scenario: Move an existing EC2 instance from a default VPC to a newly created custom VPC.", 
      a: "<strong>Detailed Solution:</strong> You cannot hot-swap the VPC of a running instance.<br><ul><li><strong>Process:</strong> The instance is permanently bound to its original VPC. To move it, you must clone it.</li><li><strong>Steps:</strong> Stop the instance. Select it and click 'Create Image' to generate an AMI. Wait for the AMI to complete. Go to 'Launch Instance', select your new custom AMI, and in the network settings, select your new custom VPC. Once the clone is running and verified, terminate the original.</li></ul>" 
    },
    { 
      q: "Scenario: Grant an EC2 instance access to read files from an S3 bucket securely.", 
      a: "<strong>Detailed Solution:</strong> Never hardcode AWS Access Keys in configuration files or code on the instance.<br><ul><li><strong>Secure Method: IAM Roles.</strong> Create an IAM Role with a policy granting `s3:GetObject` permissions to the specific bucket.</li><li><strong>Execution:</strong> Attach this IAM Role to the EC2 instance as an 'Instance Profile'. The AWS CLI and SDKs running on the instance will automatically query the local instance metadata service (IMDS) to retrieve temporary, rotating credentials to access S3 securely.</li></ul>" 
    },
    { 
      q: "Scenario: Your security team mandates that an existing unencrypted EBS volume must be encrypted immediately.", 
      a: "<strong>Detailed Solution:</strong> You cannot encrypt an existing volume in place. A migration is required.<br><ul><li><strong>Step 1:</strong> Create a snapshot of the unencrypted volume.</li><li><strong>Step 2:</strong> Select the snapshot and click 'Copy Snapshot'. During the copy configuration, check the box for 'Encrypt this snapshot' and select a KMS key.</li><li><strong>Step 3:</strong> Create a new EBS volume from this new encrypted snapshot.</li><li><strong>Step 4:</strong> Stop the instance, swap the old volume out for the new encrypted volume (using the exact same device name, e.g., `/dev/xvda`), and start the instance.</li></ul>" 
    },
    { 
      q: "Scenario: A specific malicious IP address (e.g., a known botnet) is continuously attacking your VPC. Block it.", 
      a: "<strong>Detailed Solution:</strong> Security Groups cannot explicitly DENY traffic. You must use Network ACLs.<br><ul><li><strong>Implementation:</strong> Navigate to the Network ACL associated with the public subnets.</li><li><strong>Configuration:</strong> Add an Inbound Rule with a very low rule number (e.g., Rule #10, making it high priority). Set the type to 'All Traffic', the Source to the malicious IP (e.g., `198.51.100.22/32`), and the Action to **DENY**. This drops the traffic at the subnet boundary before it ever reaches the Security Groups or EC2 instances.</li></ul>" 
    }
  ],
  "Advance Scenario": [
    { 
      q: "Scenario: Design a highly available, secure VPC architecture for a standard 3-tier web application. Describe the subnets.", 
      a: "<strong>Detailed Solution:</strong> High availability requires redundancy across distinct physical locations (Availability Zones) and strict security isolation.<br><ul><li><strong>AZ Strategy:</strong> You must span at least two Availability Zones (e.g., us-east-1a and us-east-1b) to survive a datacenter failure.</li><li><strong>Public Tier (2 Subnets):</strong> One public subnet per AZ. These hold resources that must face the internet directly: Application Load Balancer (ALB) nodes and NAT Gateways.</li><li><strong>App Tier (2 Subnets):</strong> One private subnet per AZ. These hold your EC2 web servers. They receive traffic exclusively from the ALB and route outbound internet traffic through the NAT Gateways. They have no public IPs.</li><li><strong>Data Tier (2 Subnets):</strong> One private subnet per AZ. These hold your databases (RDS Multi-AZ). Strict Security Groups ensure they can only be accessed by the App Tier EC2 instances.</li><li><strong>Summary:</strong> A robust architecture requires a minimum of 6 subnets configured correctly with IGWs, NAT Gateways, and Route Tables.</li></ul>" 
    },
    { 
      q: "Scenario: You need to attach a single EBS volume to multiple EC2 instances simultaneously for a clustered application.", 
      a: "<strong>Detailed Solution:</strong> Standard EBS volumes are strictly single-attach. You need special configurations.<br><ul><li><strong>Option 1 (EBS Multi-Attach):</strong> You can attach a single volume to up to 16 instances concurrently, BUT it requires using high-end Provisioned IOPS (`io1` or `io2`) volumes. Furthermore, you cannot use standard filesystems like ext4; you MUST use a cluster-aware filesystem (like GFS2 or OCFS2) or the OS will corrupt the data.</li><li><strong>Option 2 (EFS - Recommended):</strong> For standard Linux file sharing, do not use EBS. Use Amazon Elastic File System (EFS). It is NFSv4 compliant, serverless, scales infinitely, and can be mounted by thousands of EC2 instances simultaneously without data corruption.</li></ul>" 
    },
    { 
      q: "Scenario: VPC Peering is set up between VPC A and VPC B. VPC B is also peered to VPC C. Can instances in VPC A communicate with VPC C?", 
      a: "<strong>Detailed Solution:</strong> No, AWS networking does not support hop-through routing by default.<br><ul><li><strong>Explanation:</strong> VPC Peering is strictly non-transitive. Just because A trusts B, and B trusts C, does not mean A trusts C.</li><li><strong>Solution 1:</strong> You must explicitly create a direct peering connection between VPC A and VPC C, resulting in a full mesh network.</li><li><strong>Solution 2 (Scale):</strong> If you have 10s or 100s of VPCs, managing a peering mesh is impossible. You should migrate from VPC Peering to an <strong>AWS Transit Gateway</strong>, which acts as a central hub-and-spoke router for all VPCs.</li></ul>" 
    },
    { 
      q: "Scenario: An EC2 instance keeps terminating immediately upon launch. It goes from 'Pending' directly to 'Terminated'. Troubleshoot.", 
      a: "<strong>Detailed Solution:</strong> This indicates a failure before the OS even boots.<br><ul><li><strong>Step 1:</strong> In the EC2 Console, select the instance and look at the 'State transition reason' at the bottom of the details pane.</li><li><strong>Common Cause 1 (EBS Limit):</strong> Your account has reached its EBS volume limit, so the root volume fails to create.</li><li><strong>Common Cause 2 (KMS Permissions):</strong> The AMI is backed by an encrypted snapshot. The IAM user/role launching the instance does not have the `kms:Decrypt` permission for the specific KMS key used to encrypt the AMI.</li><li><strong>Common Cause 3 (Corrupt AMI):</strong> The custom AMI is corrupt or missing critical boot files.</li></ul>" 
    },
    { 
      q: "Scenario: Ensure traffic between your private VPC resources and Amazon S3 never travels over the public internet.", 
      a: "<strong>Detailed Solution:</strong> By default, S3 is a public service. Even if a private instance uses a NAT Gateway, the traffic technically traverses the public AWS backbone to reach S3 public endpoints.<br><ul><li><strong>Solution:</strong> Provision a <strong>VPC Gateway Endpoint</strong> for S3.</li><li><strong>Implementation:</strong> Create the endpoint in your VPC and associate it with the Route Tables of your private subnets. AWS automatically injects a route (e.g., `pl-68a54001`) that hijacks all S3-bound traffic and routes it internally through the AWS private network, completely bypassing NAT Gateways and the public internet, improving security and reducing data transfer costs.</li></ul>" 
    },
    { 
      q: "Scenario: Automate OS patching across 500 heterogeneous EC2 instances (Linux and Windows).", 
      a: "<strong>Detailed Solution:</strong> Manual SSH patching is impossible at scale. Use AWS Systems Manager (SSM).<br><ul><li><strong>Component 1: Patch Manager.</strong> Define a 'Patch Baseline' detailing which severity levels of patches to auto-approve and how many days to wait before applying them.</li><li><strong>Component 2: Resource Groups.</strong> Group your 500 instances logically using tags (e.g., `OS = Linux`, `Env = Prod`).</li><li><strong>Component 3: Maintenance Windows.</strong> Create a schedule (e.g., Sunday 2 AM). Assign the Resource Groups as targets, and register a 'Run Command' task to execute the `AWS-RunPatchBaseline` document. SSM will orchestrate the patching and rebooting automatically.</li></ul>" 
    },
    { 
      q: "Scenario: You need to securely share a custom encrypted EBS snapshot with a completely different AWS account.", 
      a: "<strong>Detailed Solution:</strong> Cross-account sharing with encryption requires two distinct permission configurations.<br><ul><li><strong>Step 1 (Snapshot Policy):</strong> Modify the permissions of the EBS Snapshot. Add the 12-digit Account ID of the target AWS account to explicitly grant them access to read the snapshot.</li><li><strong>Step 2 (KMS Policy):</strong> Because the snapshot is encrypted with a custom Customer Managed Key (CMK) in KMS (you cannot share snapshots encrypted with the default AWS managed key), you must edit the KMS Key Policy. You must add the target Account ID to the key policy, granting them `kms:Decrypt` and `kms:CreateGrant` permissions.</li><li><strong>Step 3 (Target Account):</strong> The target account cannot use the shared snapshot directly. They must immediately copy the shared snapshot to their own account, encrypting it with their own KMS key during the copy.</li></ul>" 
    },
    { 
      q: "Scenario: Architect a disaster recovery plan using the 'Pilot Light' strategy.", 
      a: "<strong>Detailed Solution:</strong> Pilot Light balances rapid recovery time with low ongoing costs.<br><ul><li><strong>Core Concept:</strong> Replicate your critical data to a secondary region, but keep all compute (EC2) resources shut off or scaled to zero until disaster strikes.</li><li><strong>Implementation:</strong> Set up Amazon RDS Cross-Region Read Replicas. Configure Amazon S3 Cross-Region Replication for file assets. Ensure your AMIs are copied to the secondary region. </li><li><strong>Failover Event:</strong> When the primary region goes down, you run an automated CloudFormation/Terraform script that promotes the RDS read replica to a standalone master, provisions an ALB, and launches EC2 instances from the AMIs into an ASG. Finally, update Route 53 DNS to point to the new ALB.</li></ul>" 
    },
    { 
      q: "Scenario: Your VPC has exhausted all available IP addresses in a private subnet, but you need to deploy 50 more instances.", 
      a: "<strong>Detailed Solution:</strong> You cannot retroactively expand a subnet's CIDR block in AWS.<br><ul><li><strong>Option 1 (New Subnet):</strong> If the overarching VPC has unallocated IP space, create a brand new, larger private subnet. Migrate resources slowly, then delete the old subnet. Update route tables accordingly.</li><li><strong>Option 2 (Secondary CIDR):</strong> If the entire VPC is out of space, associate a secondary IPv4 CIDR block with the VPC (e.g., adding `10.2.0.0/16` to a VPC that is already `10.1.0.0/16`). You can then create a new subnet from this secondary block within the same VPC.</li></ul>" 
    },
    { 
      q: "Scenario: EC2 instances in an Auto Scaling Group take 10 minutes to boot because they run massive installation scripts at startup. This causes severe lag during sudden traffic spikes.", 
      a: "<strong>Detailed Solution:</strong> Relying on User-Data scripts to download and compile software dynamically at boot time slows down scaling dramatically.<br><ul><li><strong>Solution 1 (Golden AMIs):</strong> Move the installation process upstream using a tool like HashiCorp Packer. Build a custom 'Golden Image' AMI that has all software, dependencies, and code pre-installed and compiled. The ASG launches this AMI, allowing the instance to serve traffic in seconds instead of minutes.</li><li><strong>Solution 2 (Warm Pools):</strong> Configure an ASG Warm Pool. AWS will pre-launch and pre-configure instances (running the 10-minute script), then put them in a 'Stopped' state. When a spike occurs, AWS simply turns on the stopped instances, which takes seconds, fulfilling the scale-out request instantly.</li></ul>" 
    }
  ]
};

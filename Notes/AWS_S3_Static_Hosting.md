# AWS S3 (Simple Storage Service) & Static Website Hosting

## Overview of AWS S3
AWS S3 is a highly scalable, secure, and performant object storage service. It is widely used for backup, archiving, big data analytics, and website hosting.

### Key Terminology
- **Buckets**: The fundamental container in S3 for data storage. Think of it as a root folder. Bucket names must be globally unique across all of AWS.
- **Objects**: The basic entities stored in S3. Consists of object data and metadata (tags, content-type).
- **Regions**: You choose the geographical AWS Region where Amazon S3 will store the buckets that you create (e.g., `us-east-1`).

---

## Static Website Hosting on AWS S3

You can use Amazon S3 to host a serverless static website. On a static website, individual webpages include static content (HTML, CSS, JavaScript, Images). They do not require server-side processing (like PHP, Python, or Node.js).

### Step-by-Step Guide to Hosting a Static Website

#### Step 1: Create an S3 Bucket
1. Log in to the **AWS Management Console** and navigate to the **S3** service.
2. Click **Create bucket**.
3. Enter a **Bucket name**. 
   > ⚠️ **Important:** If you plan to use a custom domain later (e.g., `www.example.com`), the bucket name MUST match your domain name exactly.
4. Choose your preferred **AWS Region**.
5. Leave default settings for Object Ownership (ACLs disabled).

#### Step 2: Enable Public Access
1. In the bucket creation wizard (or the Permissions tab later), find the **Block Public Access settings for this bucket** section.
2. **Uncheck** the box that says *"Block all public access"*.
3. Check the acknowledgment box confirming you understand the objects will become public.
4. Click **Create bucket**.

#### Step 3: Enable Static Website Hosting
1. Click on your newly created bucket to open it.
2. Navigate to the **Properties** tab.
3. Scroll all the way down to the **Static website hosting** section and click **Edit**.
4. Select **Enable**.
5. For **Index document**, type `index.html`.
6. *(Optional)* For **Error document**, type `error.html`.
7. Click **Save changes**.
8. **Result:** You will be provided a **Bucket website endpoint** (e.g., `http://your-bucket.s3-website-us-east-1.amazonaws.com`). Note this URL down!

#### Step 4: Add a Bucket Policy for Public Read Access
Even though public access isn't blocked, you still need to explicitly grant read permissions to the files using a JSON policy.

1. Go to the **Permissions** tab of your bucket.
2. Scroll down to **Bucket policy** and click **Edit**.
3. Paste the following JSON policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```
4. Click **Save changes**. You will see a red "Public" tag appear on your bucket.

#### Step 5: Upload Your Website Files
1. Go to the **Objects** tab in your bucket.
2. Click **Upload**.
3. Add your `index.html`, CSS files, JavaScript files, and images.
4. Click **Upload** at the bottom.

#### Step 6: View Your Live Website
Go to the Bucket Website Endpoint you noted in Step 3. You should now see your live static website accessible globally over the internet!

---
*(Reference Note: Due to strict anti-scraping policies on Medium, exact images from the reference URLs could not be scraped. However, the steps above mirror the exact AWS console workflow.)*

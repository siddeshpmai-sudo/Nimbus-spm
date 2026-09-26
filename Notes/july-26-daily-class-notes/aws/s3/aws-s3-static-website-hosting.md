# AWS S3 Static website hosting

A complete, step-by-step guide to hosting a serverless static website using Amazon S3.

{% stepper %}
{% step %}
## Create an S3 Bucket

* Log in to the [AWS Management Console](https://console.aws.amazon.com/s3) and navigate to S3.
* Click **Create bucket**.
* Enter a **Bucket name**. _Important:_ If you plan to use a custom domain (e.g., `www.example.com`), the bucket name MUST match your domain name exactly.
* Select your preferred AWS Region.
* Leave default settings for Object Ownership (ACLs disabled).
{% endstep %}

{% step %}
## Enable Public Access

* In the bucket creation wizard (or the Permissions tab later), find the **Block Public Access settings for this bucket** section.
* **Uncheck** the box that says _"Block all public access"_.
* Check the box to acknowledge that the current settings might result in the bucket and the objects within becoming public.
* Click **Create bucket** at the bottom.
{% endstep %}

{% step %}
## Enable Static Website Hosting

* Click on your newly created bucket to open it.
* Go to the **Properties** tab.
* Scroll all the way down to the **Static website hosting** section.
* Click **Edit**.
* Select **Enable**.
* For **Index document**, type `index.html`.
* (Optional) For **Error document**, type `error.html` (or `index.html` if using a Single Page App like React).
* Click **Save changes**.
* _Note down the Bucket website endpoint generated here (e.g., `http://your-bucket.s3-website-us-east-1.amazonaws.com`)._
{% endstep %}

{% step %}
## Add a Bucket Policy for Public Read Access

Even though public access isn't blocked, you still need to explicitly grant read permissions to the files.

* Go to the **Permissions** tab of your bucket.
* Scroll down to **Bucket policy** and click **Edit**.
* Paste the following JSON policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{ "Version": "2012-10-17", "Statement": [ { "Sid": "PublicReadGetObject", "Effect": "Allow", "Principal": "*", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*" } ] }
```

Click **Save changes**.
{% endstep %}

{% step %}
## Upload Your Website Files

* Go to the **Objects** tab in your bucket.
* Click **Upload**.
* Add your `index.html`, CSS files, JavaScript files, and images.
* Click **Upload** at the bottom.
{% endstep %}

{% step %}
## 🎉 View Your Live Website!

Go back to the **Properties** tab, scroll down to **Static website hosting**, and click the **Bucket website endpoint** URL. You should now see your live static website!
{% endstep %}
{% endstepper %}

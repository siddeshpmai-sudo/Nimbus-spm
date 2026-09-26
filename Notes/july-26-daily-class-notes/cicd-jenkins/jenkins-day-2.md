# Jenkins Day 2

**Student Version: Step-by-Step Guide**

## 1. Jenkins Configurations & Default Files

When you install Jenkins on a Linux machine, it doesn't just install a web application; it creates a structured set of files and directories that act as the backbone of your CI/CD pipeline.

**Important Files to Know:**

* `/var/lib/jenkins/`: This is known as `JENKINS_HOME`. It is the most important directory. It contains all your job configurations, plugins, workspace files, and logs. **If you ever need to backup Jenkins, this is the directory you backup.**
* `/etc/default/jenkins` (or `/etc/sysconfig/jenkins`): Historically, this was where you configured startup variables for Jenkins.
* `/lib/systemd/system/jenkins.service`: In modern Linux distributions, this `systemd` service file dictates exactly how the operating system starts, stops, and manages the Jenkins process in the background.

## 2. Changing the Default Jenkins Port

By default, Jenkins runs on port **8080**. However, if you are running other applications, such as Tomcat, Jira, or a Node.js app, on the same server, they will conflict. In such cases, you must change the Jenkins port.

### How to Change the Port (Modern Jenkins & Ubuntu 20.04+)

Modern versions of Jenkins use `systemd` to manage configurations, so editing `/etc/default/jenkins` will no longer work for changing the port.

Follow these steps to safely change the port to `9090`:

{% stepper %}
{% step %}
## Open the systemd override editor

```bash
sudo systemctl edit jenkins
```
{% endstep %}

{% step %}
## Add the port configuration

A blank text editor will open. Type the following exactly as shown:

```ini
[Service]
Environment="JENKINS_PORT=9090"
```
{% endstep %}

{% step %}
## Save and exit

Press `Ctrl+X`, then `Y`, then `Enter`.
{% endstep %}

{% step %}
## Reload systemd so it sees your changes

```bash
sudo systemctl daemon-reload
```
{% endstep %}

{% step %}
## Restart Jenkins to apply the new port

```bash
sudo systemctl restart jenkins
```
{% endstep %}

{% step %}
## Access Jenkins on the new port

Access your Jenkins server in the browser at `http://<your-server-ip>:9090`.
{% endstep %}

{% step %}
### Another method

Edit the below file and change the port&#x20;

`sudo nano /lib/systemd/system/jenkins.service`
{% endstep %}
{% endstepper %}

### Legacy Method (Older Systems Only)

If you are on an older system, use `nano` to edit the default file:

{% stepper %}
{% step %}
## Open the Jenkins default file

```bash
sudo nano /etc/default/jenkins
```
{% endstep %}

{% step %}
## Find the default port

Scroll down until you find:

```ini
HTTP_PORT=8080
```
{% endstep %}

{% step %}
## Change the port

Change it to:

```ini
HTTP_PORT=9090
```
{% endstep %}

{% step %}
## Save, exit, and restart Jenkins

```bash
sudo systemctl restart jenkins
```
{% endstep %}
{% endstepper %}

## 3. Ways to Restart Jenkins

You can restart Jenkins in two different ways depending on what you are doing.

### Method 1: From the Linux Command Line (OS Level)

Use this when you have made changes to the underlying server, such as changing the port or adjusting memory limits.

```bash
sudo systemctl restart jenkins
```

### Method 2: From the Browser (Application Level)

Use this when you have installed new plugins and want to restart Jenkins without logging into the server terminal.

* **Immediate Restart:** Add `/restart` to your Jenkins URL.\
  _(Example: `http://192.168.1.10:8080/restart`)_
* **Safe Restart:** Add `/safeRestart` to your Jenkins URL.\
  _(This tells Jenkins to wait until all currently running jobs finish before it restarts, preventing data corruption or failed builds)._

## 4. Understanding `/lib/systemd/system/jenkins.service`

If you run the following command, you will see the instructions the OS uses to run Jenkins:

```bash
cat /lib/systemd/system/jenkins.service
```

Two very important lines are:

```ini
User=jenkins
Group=jenkins
```

This means the Jenkins application runs under a specific Linux user named `jenkins`, **not** as `root`.

{% hint style="warning" %}
If your Jenkins jobs try to create files in the `/root` directory, they will fail with a **Permission Denied** error.
{% endhint %}

## 5. Manage Jenkins -> System

The **Manage Jenkins -> System** page is the global control center for your Jenkins instance.

Key settings you will find here include:

* **Jenkins URL:** Defines the base URL of your Jenkins server. This must be accurate so that email links and webhooks work correctly.
* **System Admin e-mail address:** The email address that Jenkins uses as the "Sender" when it emails you build alerts.
* **Global Properties:** Here you can define Environment Variables, such as `JAVA_HOME` or custom credentials, that can be accessed by _any_ job running on this server.
* **Extended E-mail Notification:** Where you configure the SMTP server settings to allow Jenkins to send emails.

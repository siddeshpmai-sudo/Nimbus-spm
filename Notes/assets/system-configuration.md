# system configuration

## Home Directory

* Path: `/var/lib/jenkins`
* Where Jenkins stores:
  * Job configs
  * Builds
  * Plugins
  * Logs
  * Credentials (in encrypted form)

***

## System Message

* Text box to display a global banner on the Jenkins homepage.
* Useful for maintenance notifications, downtime alerts, or announcements.

***

## Maven Project Configuration

* Global `MAVEN_OPTS` — Java options for all Maven builds (e.g., memory limits, proxy):

{% code title="MAVEN_OPTS" %}
```
-Xmx1024m -Djava.net.useSystemProxies=true
```
{% endcode %}

* Local Maven Repository:
  * You can override the default `~/.m2/repository`.
  * Useful for caching or sharing repository location on agents.

***

## Executors

* `# of Executors`: Configure how many parallel jobs this master node (or agent) can run.
* Example: `2` means the Jenkins master can run 2 jobs at once.

***

## Labels

* Tags assigned to the node for job targeting (e.g., `linux`, `docker`, `gpu`).

***

## Usage

* Set to “Use this node as much as possible” (default behavior for job scheduling).

***

## Computer Retention Check Interval

* How often (in seconds) Jenkins checks for idle agents for potential disconnection (default: 60s).

***

## Quiet Period

* Wait time (in seconds) before starting a job after it's triggered.
* Example: `5` = Wait 5 seconds before triggering a build.

***

## SCM Checkout Retry Count

* If source code checkout fails, Jenkins will retry this many times.
* Example: `0` = no retries.

***

## Restrict Project Naming

* Limit naming formats for new jobs. If enabled, only allowed patterns can be used.

***

## Jenkins Location

* Jenkins URL:
  * Used in emails, webhooks, CLI interactions.
  * Current: `http://34.230.89.21:8080/`

{% code title="Jenkins URL" %}
```
http://34.230.89.21:8080/
```
{% endcode %}

* System Admin E-mail:
  * Used as the "from" address for Jenkins notifications.
  * Not configured by default; typically set to `nobody@nowhere`.

{% hint style="warning" %}
If the System Admin E-mail is not configured, notifications may use a default or invalid address (`nobody@nowhere`). Configure this to ensure emails are delivered correctly.
{% endhint %}

***

## Global Properties

* Define environment variables and custom tool paths that apply to all jobs and agents.

***

## Tool Locations

* Override automatic tool detection by specifying explicit paths (e.g., Git, Java, Maven, Python).

***

## Disk Space Monitoring Thresholds

* Configure warning levels when disk space is low.

***

## Pipeline Speed / Durability

* Controls how Jenkins saves pipeline state:
  * Default = high durability (safe but slower).
  * Can be tuned for performance vs. resilience.

***

## Usage Statistics

* Sends anonymous usage data to Jenkins developers to help improve the tool.

***

## HTTP Proxy Configuration

* Configure proxy (host, port, username) to allow Jenkins to access the internet (plugins, updates).

***

## Global Build Time Out

* Sets a maximum timeout for all jobs unless overridden per job.

***

## Develocity (Formerly Gradle Enterprise)

* Enterprise build analysis and metrics integration.
* Only used if Develocity is in use.

***

## Timestamper

* Format timestamps for console output logs:
  * System clock format
  * Elapsed time format
* Useful for debugging long pipelines.

***

## Administrative Monitors

* Warnings and health checks about Jenkins (e.g., disk full, plugin updates, security issues).
* You can disable individual alerts if not relevant.

***

## Global Build Discarders

* Cleanup old build data globally to save disk space.
* Example policies: delete builds older than 30 days or keep only the last 10 builds.

***

## Notifications

* Default Notification URL: URL to notify other systems (used in integrations).
* GitHub / GitHub Enterprise Servers:
  * Configure GitHub API tokens, server URLs, webhooks.

***

## Global Shared Libraries

<details>

<summary>Trusted vs Untrusted libraries</summary>

* Trusted:
  * Pipeline libraries with full script access (no sandbox).
  * Used for reusable shared logic (e.g., `@Library('devops-lib')`).
* Untrusted:
  * Libraries run in sandboxed mode (restricted).

</details>

***

## Build-timeout Plugin

* Add timeouts at the build-step level, not just the whole job.

***

## Git Plugin

* Set global Git config used by all jobs:
  * `user.name`
  * `user.email`
* Options for commit summaries, tag actions, credential masking, etc.

***

## Shell

* Path to shell executable (e.g., `/bin/bash`).
* Used for "Execute Shell" steps in freestyle or scripted jobs.

***

## Extended E-mail Notification

* Advanced email settings:
  * SMTP server and port
  * Default suffix (e.g., `@example.com`)
  * Headers like `Precedence: bulk`
  * Default content and templates
  * Ability to test email configuration

***

## Buttons: Save / Apply

* Save: Saves and closes the configuration.
* Apply: Saves without leaving the page.

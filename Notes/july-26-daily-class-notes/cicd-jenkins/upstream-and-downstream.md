# upstream and downstream

## What is Upstream and Downstream in Jenkins?

In Jenkins, **Upstream** and **Downstream** jobs define the build dependency flow between Jenkins jobs (projects/pipelines):

```
job-A  -->  Job-B
 ↑          ↓
Upstream   Downstream
```

## Definitions

* **Upstream Job:** A job that **triggers another job** after it completes.
* **Downstream Job:** A job that is **triggered** after another job finishes.

## Example Scenario (Real-Time)

Let’s say you have a DevOps pipeline:

* **Job-A:** Checkout code from GitHub
* **Job-B:** Build the application
* **Job-C:** Deploy to development environment
* **Job-D:** Run automated tests

Here:

* Job-A is upstream to Job-B.
* Job-B is downstream of Job-A.
* Job-B is upstream to Job-C.
* Job-D is downstream of Job-C.

## Real-World Analogy

Think of a conveyor belt in a factory.

* **Upstream:** The machines earlier in the line, such as raw material prep.
* **Downstream:** The machines later in the line, such as packaging.

If something breaks upstream, downstream cannot proceed.

## How to Set Up Upstream/Downstream in Jenkins

{% stepper %}
{% step %}
### Using Freestyle Projects (Post-Build Actions)

* Go to **Job-A → Configure**.
* Scroll to **Post-build Actions**.
* Click **“Add post-build action” → “Build other projects”**.
* Enter: `Job-B`.
* Save.

Now whenever Job-A runs successfully, it will trigger Job-B (downstream).
{% endstep %}

{% step %}
### Using Build Triggers

* Go to **Job-B → Configure**.
* Scroll to **Build Triggers**.
* Check **Build after other projects are built**.
* Enter: `Job-A`.
* Save.

This means Job-B will be triggered after Job-A (its upstream) completes.
{% endstep %}

{% step %}
### Pipeline Jobs

Example (Declarative Pipeline):

{% code title="Jenkinsfile" %}
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo "Building..."
            }
        }
        stage('Trigger Downstream') {
            steps {
                build job: 'Job-B'
            }
        }
    }
}
```
{% endcode %}
{% endstep %}
{% endstepper %}

## View Upstream/Downstream Links in Jenkins

Jenkins automatically shows these links on the job dashboard:

* **“Upstream Projects”**: Shows which jobs trigger this one.
* **“Downstream Projects”**: Shows which jobs are triggered after this.

Useful for visualizing job chains.

## Real-Time Use Cases

### Microservices Deployment

* **Job-A:** Build Docker image for Service-A.
* **Job-B:** Push image to ECR (downstream).
* **Job-C:** Deploy to Kubernetes (downstream of B).

### Test Automation Pipeline

* **Job-A:** Build app.
* **Job-B:** Run unit tests.
* **Job-C:** Run integration tests (triggered only after unit tests succeed).

## Trigger Conditions for Downstream Jobs

When configuring **Job-A → Post-build Actions → Build other projects**, you can choose when Jenkins triggers the downstream job.

{% stepper %}
{% step %}
### Trigger only if build is stable

**Meaning:** Downstream job will run only if the upstream job finished successfully (exit status 0).

**Use Case:** In a CI/CD pipeline where Job-A builds the code and Job-B runs automated tests — you don't want to run tests unless the build is successful.
{% endstep %}

{% step %}
### Trigger even if the build is unstable

**Meaning:** Triggers downstream even if the upstream job is unstable, such as test failures or warnings, but not if it fails.

Jenkins marks a build unstable when there are warnings or some failed tests while the build still completes.

**Use Case:** Run test reports or send notifications even if some tests fail; maybe deploy to dev on minor issues.
{% endstep %}

{% step %}
### Trigger even if the build fails

**Meaning:** Downstream job will run even if upstream job fails completely (non-zero exit).

**Use Case:** Send failure reports, clean up environment, or rollback previous deployment.
{% endstep %}

{% step %}
### Always trigger, even if the build is aborted

**Meaning:** No matter what happens in Job-A—success, unstable, failure, or manually aborted—Jenkins will trigger Job-B.

**Use Case:** Always run cleanup jobs or always send audit logs / Slack notifications.
{% endstep %}
{% endstepper %}

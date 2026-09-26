# Jenkins Day 4   Shared Libs

## 1. What is a Shared Library?

When managing many Jenkins pipelines, you often repeat the same code (e.g., building a Docker image, sending a Slack message, or deploying to Kubernetes). A **Shared Library** allows you to extract this common logic into a separate Git repository and reuse it across all your Jenkinsfiles.

## 2. Directory Structure

A shared library repository must have a specific folder structure:

```
+- src/             # Object-oriented Groovy classes
+- vars/            # Global variables (Custom Pipeline Steps)
+- resources/       # Non-Groovy files (e.g., config files, bash scripts)
```

{% hint style="info" %}
We will focus primarily on the `vars/` directory, which is used to create custom pipeline steps.
{% endhint %}

## 3. Creating Custom Steps (`vars` folder)

To create a custom step, create a `.groovy` file inside the `vars/` directory. The filename becomes the step name. The file must contain a `call()` method.

### Example 1: `vars/logMessage.groovy`

```groovy
// vars/logMessage.groovy
def call(String message) {
    echo "=========================================="
    echo "INFO: ${message}"
    echo "=========================================="
}
```

### Example 2: `vars/buildDocker.groovy`

```groovy
// vars/buildDocker.groovy
def call(String imageName, String tag) {
    sh "echo 'Building Docker Image...'"
    sh "docker build -t ${imageName}:${tag} ."
    sh "echo 'Build successful for ${imageName}:${tag}'"
}
```

## 4. Configuring the Library in Jenkins

Before you can use the library, Jenkins needs to know where it is.

{% stepper %}
{% step %}
## Go to Jenkins System settings

Go to **Manage Jenkins** > **System**.
{% endstep %}

{% step %}
## Open Global Pipeline Libraries

Scroll to **Global Pipeline Libraries**.
{% endstep %}

{% step %}
## Add the library

Click **Add**:

* **Name:** `my-shared-lib` (You will use this name in your Jenkinsfile).
* **Default version:** `main` (Branch name).
* **Retrieval method:** Modern SCM -> Git -> Provide your Git repository URL.
{% endstep %}

{% step %}
## Save the configuration

Click **Save**.
{% endstep %}
{% endstepper %}

## 5. Using the Library in Your Jenkinsfile

Import the library at the very top of your Jenkinsfile using the `@Library` annotation. The underscore `_` at the end imports all global variables immediately.

### Jenkinsfile

```groovy
@Library('my-shared-lib') _

pipeline {
    agent any
    
    stages {
        stage('Initialization') {
            steps {
                // Calling the custom step from vars/logMessage.groovy
                logMessage('Pipeline has started!')
            }
        }
        
        stage('Build Image') {
            steps {
                // Calling the custom step from vars/buildDocker.groovy
                buildDocker('my-webapp', 'v1.0.0')
            }
        }
    }
    
    post {
        always {
            logMessage('Pipeline execution finished.')
        }
    }
}
```

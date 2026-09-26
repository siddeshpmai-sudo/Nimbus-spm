# pipline options

## Common Jenkins Pipeline Options with Use Cases

| Option                      | Description                               | Example                                          | Real-Time Use Case                                     |
| --------------------------- | ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `buildDiscarder()`          | Controls how many builds to keep.         | `buildDiscarder(logRotator(numToKeepStr: '10'))` | Keep last 10 builds to save disk space.                |
| `disableConcurrentBuilds()` | Prevents concurrent builds.               | `disableConcurrentBuilds()`                      | Avoid conflicts when deploying to same environment.    |
| `timeout()`                 | Sets a timeout for the pipeline or stage. | `timeout(time: 10, unit: 'MINUTES')`             | Fail the build if it hangs beyond 10 minutes.          |
| `timestamps()`              | Adds timestamps to console output.        | `timestamps()`                                   | Helpful in debugging when tracking time.               |
| `ansiColor()`               | Enables ANSI color in logs.               | `ansiColor('xterm')`                             | Use colorized output from shell scripts.               |
| `retry()`                   | Retry block of code if it fails.          | `retry(3) { sh 'curl http://unstable-api' }`     | Retry flaky HTTP call.                                 |
| `preserveStashes()`         | Preserves stashes after the build.        | `preserveStashes()`                              | Use if you stash in one stage and use in post actions. |
| `skipDefaultCheckout()`     | Skip automatic SCM checkout.              | `skipDefaultCheckout()`                          | Use when checkout is manually handled.                 |
| `overrideIndexTriggers()`   | Override the default triggers from SCM.   | `overrideIndexTriggers(true)`                    | Needed in multibranch pipelines sometimes.             |
| `quietPeriod()`             | Wait time before starting a build.        | `quietPeriod(30)`                                | Useful to batch rapid SCM changes.                     |
| `parallelsAlwaysFailFast()` | Stop all parallel stages if one fails.    | `parallelsAlwaysFailFast()`                      | Optimize parallel build efficiency.                    |
| `checkoutToSubdirectory()`  | Clone repo to custom subdirectory.        | `checkoutToSubdirectory('source')`               | Useful for mono-repos or special folder structures.    |

## 🧪 Sample Declarative Pipeline with Options

{% code title="Jenkinsfile" %}
```groovy
pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        ansiColor('xterm')
    }

    stages {
        stage('Build') {
            steps {
                echo "Starting Build..."
                sh 'make build'
            }
        }

        stage('Test') {
            steps {
                echo "Running Tests..."
                sh 'make test'
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
        }
    }
}
```
{% endcode %}

## Full Jenkins Pipeline with All Options

{% code title="Full Jenkinsfile (with all options)" %}
```groovy
pipeline {
    agent any

    options {
        // Discard old builds (keep last 5 builds only)
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '2'))

        // Prevent concurrent builds of the same pipeline
        disableConcurrentBuilds()

        // Add timestamps to console output
        timestamps()

        // ANSI color support for readable output
        ansiColor('xterm')

        // Timeout entire pipeline if it takes longer than 15 minutes
        timeout(time: 15, unit: 'MINUTES')

        // Allow retry logic for unstable tasks (used inside script block, not here directly)
        // Demonstrated below in the script

        // Skip default Git/SCM checkout (we'll do manual checkout)
        skipDefaultCheckout()

        // Set a quiet period of 10 seconds before the build starts
        quietPeriod(10)

        // Preserve stashes after the build
        preserveStashes()

        // If any parallel stage fails, stop all
        parallelsAlwaysFailFast()

        // Check out to a custom subdirectory
        checkoutToSubdirectory('source-code')

        // Override default index triggers (useful for multibranch)
        overrideIndexTriggers(true)
    }

    environment {
        COLOR = "\u001B[32m"
    }

    stages {
        stage('Manual Checkout') {
            steps {
                dir('source-code') {
                    checkout scm
                }
            }
        }

        stage('Build') {
            steps {
                echo "${env.COLOR}Running Build"
                sh 'echo "Compiling code..."'
                stash includes: '**/*.jar', name: 'build-artifacts'
            }
        }

        stage('Test with Retry') {
            steps {
                retry(3) {
                    echo "${env.COLOR}Running flaky test..."
                    sh 'if [ $((RANDOM % 2)) -eq 0 ]; then exit 1; fi'
                }
            }
        }

        stage('Parallel Jobs') {
            parallel {
                stage('Static Analysis') {
                    steps {
                        echo "${env.COLOR}Running static code analysis"
                        sh 'sleep 3'
                    }
                }

                stage('Unit Tests') {
                    steps {
                        echo "${env.COLOR}Running unit tests"
                        sh 'sleep 2'
                        error("Simulated failure") // Will fail fast all parallel
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
            deleteDir()
        }
    }
}
```
{% endcode %}

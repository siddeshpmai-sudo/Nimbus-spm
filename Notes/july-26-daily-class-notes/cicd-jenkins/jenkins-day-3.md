# Jenkins Day 3

## 1. Agent Directives

Agents define _where_ your pipeline runs.

{% tabs %}
{% tab title="agent any" %}
Runs on any available node.

```groovy
pipeline {
    agent any
    stages { ... }
}
```
{% endtab %}

{% tab title="agent none" %}
No global agent. Each stage MUST specify its own agent.

```groovy
pipeline {
    agent none
    stages {
        stage('Build') {
            agent any
            steps { echo 'Building...' }
        }
    }
}
```
{% endtab %}

{% tab title="agent { label '...' }" %}
Runs on an agent with a specific label.

```groovy
pipeline {
    agent {
        label 'salve01'
    }
    stages { ... }
}
```
{% endtab %}

{% tab title="agent { docker { ... } }" %}
Runs inside a Docker container.

```groovy
pipeline {
    agent {
        docker { image 'ubuntu:latest' }
    }
    stages { ... }
}
```
{% endtab %}
{% endtabs %}

## 2. Environment Variables & Parameters

Define global variables and user inputs.

```groovy
pipeline {
    agent any
    environment {
      test = "xy" 
    }
    parameters {
        string(name:'pet', defaultValue:'jimmy', description:'name of pet')
    }
    stages {
        stage('Hello') {
            steps {
                echo "Test var is ${test}"
                print pet
            }
        }
    }
}
```

## 3. Options

Configure job behaviors like timeouts, log rotations, and retries.

```groovy
pipeline {
    agent any
    options {
        timeout(time: 20, unit: 'SECONDS')
        timestamps()
        // retry(3)
        // buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30'))
    }
    stages { ... }
}
```

{% hint style="info" %}
`retry(3)` can also be used inside a specific `steps` block.
{% endhint %}

## 4. Triggers & Downstream Jobs

Automate job executions and trigger other jobs.

```groovy
pipeline {
    agent any
    triggers {
        cron('* * * * *')       // Run on a schedule (time-based)
        // pollSCM('* * * * *') // Check Git for changes periodically
    }
    stages {
        stage('Trigger Downstream') {
            steps {
                build('projectA/test') // Triggers another Jenkins job
            }
        }
    }
}
```

## 5. Parallel Execution

Run stages simultaneously to save time.

```groovy
pipeline {
    agent any
    stages {
        stage('Parallel Stage') {
            parallel {
                stage('Project A') {
                    steps { echo "Running Project A" }
                }
                stage('Project B') {
                    steps { echo "Running Project B" }
                }
            }
        }
    }
}
```

## 6. Changing Directory & Error Handling

Run commands in a specific folder and handle errors.

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                script {
                    sh "mkdir testfolder"
                    dir('testfolder') { // Changes directory
                        try {
                            sh 'mkdir devopstest'
                        } catch (Exception e) {
                            echo 'Folder already exists'
                        }
                    }
                }
            }
        }
    }
}
```

## 7. Post Actions

Execute steps at the end of the pipeline based on the result.

```groovy
pipeline {
    agent any
    stages { ... }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This runs if the build is successful'
        }
        failure {
            cleanWs() // Clean workspace on failure
        }
    }
}
```

{% hint style="info" %}
Available conditions: `always`, `changed`, `fixed`, `aborted`, `failure`, `success`, `unstable`, `cleanup`.
{% endhint %}

## 8. Conditional Execution (`when`)

Run a stage only if a condition is met.

```groovy
pipeline {
    agent any
    parameters {
        string(name:'env_nonprod', defaultValue:'uat')
        string(name:'env_non', defaultValue:'both')
    }
    stages {
        stage('UAT Deployment') {
            when {
                allOf {
                    expression { env_nonprod == 'uat' }
                    expression { env_non == 'both' }
                }
            }
            steps {
                echo 'UAT Options'
            }
        }
    }
}
```

## 9. Real-World Maven Build

Checking out code from Git and building it.

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'siddeshPAT', url: 'https://github.com/Siddeshg672/hello_world_public_war.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }
    }
}
```

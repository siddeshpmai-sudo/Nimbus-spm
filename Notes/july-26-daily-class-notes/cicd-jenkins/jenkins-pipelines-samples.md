# jenkins pipelines samples

## 1. Agent Configuration Examples

### 1.1 Agent: Any (Free Executor/Slave)

**Concept:** Runs on any available agent/executor in Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Running on any available agent'
                sh 'mkdir -p abc'
                sh 'ls -lart'
                sh 'pwd'
            }
        }  
    }
}
```

### 1.2 Agent: None (Schedule Stages on Different Agents)

**Concept:** No global agent. Each stage specifies its own agent for flexibility

```groovy
pipeline {
    agent none
    stages {
        stage('Build') {
            agent any
            steps {
                echo 'Stage 1: Running on any available agent'
                sh 'ls -lart'
                sh 'pwd'
            }
        }
        stage('Test') {
            agent any
            steps {
                echo 'Stage 2: Running on a different agent'
                sh 'ls -lart'
                sh 'pwd'
            }
        }
    }
}
```

### 1.3 Agent: Label (Schedule on Specific Agent)

**Concept:** Run on a specific agent labeled 'slave01'

```groovy
pipeline {
    agent {
        label 'slave01'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Running specifically on slave01'
                sh 'mkdir -p abc'
                sh 'ls -lart'
                sh 'pwd'
            }
        }
    }
}
```

### 1.4 Agent: Docker (Container-Based Execution)

**Concept:** Creates a Docker container and runs pipeline steps inside it

```groovy
pipeline {
    agent {
        docker {
            image 'ubuntu:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    stages {
        stage('Build') {
            steps {
                echo 'Running inside Docker container'
                sh 'mkdir -p abc'
                sh 'ls -lart'
                sh 'pwd'
            }
        }
    }
}
```

## 2. Environment Variables & Variables in Pipelines

### 2.1 Basic Environment Variables

**Concept:** Define pipeline-level environment variables

```groovy
pipeline {
    agent any
    environment {
        APP_NAME = "MyApp"
        BUILD_ENV = "development"
        WORKSPACE_PATH = "${WORKSPACE}"
    }
    stages {
        stage('Setup') {
            steps {
                cleanWs()
                echo "Application: ${APP_NAME}"
                echo "Environment: ${BUILD_ENV}"
                sh 'mkdir -p ${WORKSPACE_PATH}/artifacts'
                sh 'ls -lart'
                sh 'pwd'
            }
        }
    }
}
```

### 2.2 Environment Variables with Shell Variable Expansion

**Concept:** Use double quotes for variable substitution in shell commands

```groovy
pipeline {
    agent any
    environment {
        TOOL_NAME = "Docker"
        FOLDER_NAME = "devops"
    }
    stages {
        stage('Build') {
            steps {
                cleanWs()
                echo 'Hello World'
                sh 'mkdir -p $FOLDER_NAME'
                sh 'ls -lart'
                sh 'pwd'
                echo "BUILD_URL: ${BUILD_URL}"
                sh "echo Tool name is ${TOOL_NAME}"
            }
        }
    }
}
```

## 3. Parameters in Pipelines

### 3.1 Pipeline Parameters with String Input

**Concept:** Accept user input as parameters during build trigger

```groovy
pipeline {
    agent any
    parameters {
        string(name: 'PET_NAME', defaultValue: 'jimmy', description: 'Name of the pet')
        string(name: 'APP_VERSION', defaultValue: '1.0.0', description: 'Application version')
    }
    stages {
        stage('Build') {
            steps {
                echo "Pet Name: ${params.PET_NAME}"
                echo "App Version: ${params.APP_VERSION}"
                sh "echo Selected pet is ${params.PET_NAME}"
            }
        }
    }
}
```

## 4. Pipeline Options

### 4.1 Options: Retry, Build Discarder, Timeout, Timestamps

**Concept:** Control pipeline behavior with global options

```groovy
pipeline {
    agent any
    options {
        retry(3)
        buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    stages {
        stage('Build') {
            steps {
                cleanWs()
                sh '''
                    echo "Creating test files"
                    echo "file1" > a
                    echo "file2" > b
                    echo "file3" > c
                    echo "file4" > d
                '''
                sh 'ls -lart && pwd'
            }
        }
    }
}
```

### 4.2 Stage-Level Retry Option

**Concept:** Retry specific stage steps on failure

```groovy
pipeline {
    agent any
    options {
        timestamps()
        timeout(time: 20, unit: 'SECONDS')
    }
    parameters {
        string(name: 'PET_NAME', defaultValue: 'jimmy', description: 'Name of pet')
    }
    stages {
        stage('Prepare') {
            steps {
                cleanWs()
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
            }
        }
        stage('Build') {
            steps {
                echo 'Hello World'
                sh 'ls -lart'
                sh 'pwd'
                echo "BUILD_URL: ${BUILD_URL}"
                echo "Pet Name: ${params.PET_NAME}"
                retry(3) {
                    sh 'ls -lart'
                    sleep(time: 2, unit: 'SECONDS')
                }
            }
        }
    }
}
```

## 5. Parallel Stages

### 5.1 Running Multiple Stages in Parallel

**Concept:** Execute stages concurrently to reduce build time

```groovy
pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Parallel Execution') {
            parallel {
                stage('Project A') {
                    steps {
                        cleanWs()
                        echo 'ProjectA: Running step 1'
                        sh 'sleep 2'
                        echo 'ProjectA: Running step 2'
                        sh 'sleep 2'
                        echo 'ProjectA: Running step 3'
                    }
                }
                stage('Project B') {
                    steps {
                        echo 'ProjectB: Running step 1'
                        sh 'sleep 2'
                        echo 'ProjectB: Running step 2'
                        sh 'sleep 2'
                        echo 'ProjectB: Running step 3'                        
                    }
                }
            }
        }
        stage('Post Parallel') {
            steps {
                echo 'All parallel stages completed'
            }
        }
    }
}
```

## 6. Try-Catch Error Handling

### 6.1 Exception Handling with Try-Catch

**Concept:** Handle errors gracefully using try-catch blocks

```groovy
pipeline {
    agent any
    options {
        timestamps()
    }
    stages {
        stage('Parallel Build') {
            parallel {
                stage('ProjectA') {
                    steps {
                        cleanWs()
                        echo 'ProjectA: Executing build'
                        sh 'echo ProjectA step 1'
                        sh 'echo ProjectA step 2'
                    }
                }
                stage('ProjectB') {
                    steps {
                        echo 'ProjectB: Executing build'
                        sh 'echo ProjectB step 1'
                        sh 'echo ProjectB step 2'                        
                    }
                }
            }
        }
        stage('Error Handling') {
            steps {
                script {
                    sh 'mkdir -p testfolder'
                    dir('testfolder') {
                        try {
                            sh '''
                                mkdir devopstest
                                echo "hello" > a
                                cat a
                            '''
                            echo 'Test directory created successfully'
                        } catch (Exception e) {
                            echo "Error: Folder might already exist or another error occurred: ${e.message}"
                        }
                        sh 'ls -lart && pwd'
                    }
                }
            }
        }
    }
}
```

## 7. Directory Navigation with dir()

### 7.1 Running Steps in Specific Directory

**Concept:** Execute commands from a specific folder context

```groovy
pipeline {
    agent any
    stages {
        stage('Directory Operations') {
            steps {
                script {
                    sh 'mkdir -p project-workspace'
                    
                    // Execute commands inside specific directory
                    dir('project-workspace') {
                        sh '''
                            echo "Building in: $(pwd)"
                            mkdir -p src/main
                            touch src/main/app.jar
                            ls -lart
                        '''
                    }
                    
                    echo "Back to original workspace: $(pwd)"
                }
            }
        }
    }
}
```

## 8. Triggers

### 8.1 Cron Trigger (Scheduled)

**Concept:** Trigger pipeline at specified time intervals

```groovy
pipeline {
    agent any
    triggers {
        // Runs daily at 2 AM
        cron('0 2 * * *')
    }
    stages {
        stage('Scheduled Build') {
            steps {
                echo 'This job runs on schedule'
                sh 'ls -lart && pwd'
            }
        }
    }
}
```

### 8.2 Poll SCM Trigger

**Concept:** Periodically check SCM for changes and trigger if found

```groovy
pipeline {
    agent any
    triggers {
        // Check SCM every 5 minutes
        pollSCM('H/5 * * * *')
    }
    stages {
        stage('Build') {
            steps {
                cleanWs()
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing SCM changes'
                sh 'ls -lart'
                sh 'pwd'
                retry(3) {
                    sh 'ls -lart'
                }
            }
        }
    }
}
```

## 9. Post Section - Pipeline Notifications

### 9.1 Post Actions: Always, Success, Failure

**Concept:** Execute actions based on pipeline execution status

```groovy
pipeline {
    agent any
    triggers {
        pollSCM('H/5 * * * *')
    }
    stages {
        stage('Build') {
            steps {
                cleanWs()
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
            }
        }
        stage('Test') {
            steps {
                echo 'Hello World'
                sh 'ls -lart'
                sh 'pwd'
                echo "BUILD_URL: ${BUILD_URL}"
                sh 'ls -lart'
            }
        }
    }
    post {
        always {
            echo 'This block ALWAYS runs - Use for cleanup'
            sh 'echo "Pipeline execution finished"'
        }
        success {
            echo 'Build SUCCESS - Trigger downstream job'
            // build('projectA/test')
        }
        failure {
            echo 'Build FAILED - Cleaning workspace'
            cleanWs()
        }
        unstable {
            echo 'Build UNSTABLE - Some tests failed'
        }
        aborted {
            echo 'Build was ABORTED'
        }
    }
}
```

### 9.2 Stage-Level Post Actions

**Concept:** Add post actions to individual stages

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                cleanWs()
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
            }
            post {
                always {
                    echo 'Build stage post-action: ALWAYS'
                }
                success {
                    echo 'Build stage success'
                    // build('projectA/test')
                }
                failure {
                    echo 'Build stage failed'
                    cleanWs()
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing application'
                sh 'ls -lart'
                sh 'pwd'
                echo "BUILD_URL: ${BUILD_URL}"
            }
        }
    }
}
```

## 10. Conditional Execution with When

### 10.1 When: Single Expression

**Concept:** Execute stage only if condition is met

```groovy
pipeline {
    agent any
    stages {
        stage('UAT Deployment') {
            when {
                expression { env.ENVIRONMENT == 'uat' }
            }
            steps {
                cleanWs()
                echo 'Deploying to UAT environment'
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
                echo 'UAT deployment options'
            }
        }
    }
}
```

### 10.2 When: anyOf (OR condition)

**Concept:** Execute if ANY condition is true

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            when {
                anyOf {
                    expression { env.ENVIRONMENT == 'qa' }
                    expression { env.ENVIRONMENT == 'both' }
                }
            }
            steps {
                echo 'Deploying to QA'
                sh 'ls -lart'
                sh 'pwd'
                echo 'QA deployment options'
            }
        }
    }
}
```

### 10.3 When: allOf (AND condition)

**Concept:** Execute if ALL conditions are true

```groovy
pipeline {
    agent any
    stages {
        stage('UAT Deployment') {
            when {
                allOf {
                    expression { env.ENV_NONPROD == 'uat' }
                    expression { env.ENV_TYPE == 'both' }
                }
            }
            steps {
                cleanWs()
                echo 'Deploying to UAT (all conditions met)'
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
                echo 'UAT options'
            }
        }
        stage('QA Deployment') {
            when {
                allOf {
                    expression { env.ENV_NONPROD == 'qa' }
                    expression { env.ENV_TYPE == 'both' }
                }
            }
            steps {
                echo 'Deploying to QA (all conditions met)'
                sh 'ls -lart'
                sh 'pwd'
                echo 'QA options'
            }
        }
    }
}
```

### 10.4 When with Parameters

**Concept:** Use parameters in when conditions

```groovy
pipeline {
    agent any
    parameters {
        string(name: 'ENV_NONPROD', defaultValue: 'uat', description: 'Non-prod environment (uat/qa/both)')
        string(name: 'ENV_TYPE', defaultValue: 'both', description: 'Environment type')
    }
    stages {
        stage('UAT Deployment') {
            when {
                allOf {
                    expression { params.ENV_NONPROD == 'uat' }
                    expression { params.ENV_TYPE == 'both' }
                }
            }
            steps {
                cleanWs()
                echo "Deploying to ${params.ENV_NONPROD}"
                sh '''
                    echo "helloWorld" > a
                    echo "helloWorld" > b
                    echo "helloWorld" > c
                    echo "helloWorld" > d
                '''
                sh 'ls -lart && pwd'
                echo 'UAT deployment started'
            }
        }
        stage('QA Deployment') {
            when {
                allOf {
                    expression { params.ENV_NONPROD == 'qa' }
                    expression { params.ENV_TYPE == 'both' }
                }
            }
            steps {
                echo "Deploying to ${params.ENV_NONPROD}"
                sh 'ls -lart'
                sh 'pwd'
                echo 'QA deployment started'
            }
        }
    }
}
```

## 11. Git & Build Integration

### 11.1 Git Checkout with Credentials

**Concept:** Clone repository with authentication (PAT/SSH)

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                git branch: 'main', 
                    credentialsId: 'github-pat-creds', 
                    url: 'https://github.com/Siddeshg672/hello_world_public_war.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'mvn clean install -DskipTests'
            }
        }
        stage('Package') {
            steps {
                echo 'War file generated in target directory'
                sh 'ls -lart target/'
            }
        }
    }
}
```

### 11.2 Complete Maven Build Pipeline

**Concept:** Full CI pipeline with Git, Build, Test, and Package stages

```groovy
pipeline {
    agent any
    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    environment {
        GIT_REPO = 'https://github.com/Siddeshg672/hello_world_public_war.git'
        ARTIFACT_PATH = 'target/'
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching code from repository...'
                git branch: 'main', 
                    credentialsId: 'github-pat-creds', 
                    url: "${GIT_REPO}"
            }
        }
        stage('Build') {
            steps {
                echo 'Compiling and building...'
                sh 'mvn clean install'
            }
        }
        stage('Test') {
            steps {
                echo 'Running unit tests...'
                sh 'mvn test'
            }
        }
        stage('Package') {
            steps {
                echo 'Packaging application...'
                sh 'ls -lart ${ARTIFACT_PATH}'
            }
        }
    }
    post {
        always {
            echo 'Pipeline execution complete'
        }
        success {
            echo 'Build successful'
        }
        failure {
            echo 'Build failed - Check logs'
        }
    }
}
```

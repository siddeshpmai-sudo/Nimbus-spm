# jenkins parameters

## Executive Summary

Jenkins parameters enable dynamic, reusable pipeline configurations that accept runtime inputs without requiring job reconfiguration. This guide provides production-grade documentation of all 12 parameter types, detailed step-by-step implementation instructions, multiple triggering mechanisms, and real-world use cases optimized for enterprise DevOps environments. As a senior DevOps engineer managing CI/CD infrastructure, understanding parameter semantics, triggering strategies, and cascading parameter patterns is essential for building flexible, maintainable automation frameworks.

## Overview: Why Parameters Matter

Traditional Jenkins workflows require job reconfiguration for every environment change, version specification, or conditional logic. Parameterized builds decouple configuration from execution, enabling a single job to serve multiple purposes. This reduces job proliferation, simplifies maintenance, and implements the DRY principle across your CI/CD pipeline.

Key Benefits for Infrastructure-as-Code practices:

* Single source of truth for automation logic
* Reduced Jenkins configuration drift
* Compliance with infrastructure modularity standards
* Support for complex deployment scenarios with conditional execution

## Parameter Types: Complete Reference

### 1. String Parameter

The foundational parameter type for simple text input.

```groovy
parameters {
    string(name: 'ENVIRONMENT', 
           defaultValue: 'staging', 
           description: 'Target deployment environment')
}
```

Freestyle Job Configuration:

* Add Parameter → String Parameter
* Name: `ENVIRONMENT`
* Default Value: `staging`
* Description: `Target deployment environment`

Usage in Shell:

```bash
#!/bin/bash
echo "Deploying to: $ENVIRONMENT"
aws s3 sync ./dist s3://app-${ENVIRONMENT}/
```

Use case: Environment names, AWS regions, Docker image tags, version numbers, artifact paths.

***

### 2. Text Parameter (Multiline)

Supports multi-line input with preserved formatting.

```groovy
parameters {
    text(name: 'DEPLOYMENT_NOTES', 
         defaultValue: 'Release notes here\n\nTeam: DevOps', 
         description: 'Deployment information and change notes')
}
```

UI Rendering: Text area with automatic line breaks.

Access in Pipeline:

```groovy
stage('Log Deployment') {
    steps {
        script {
            writeFile file: 'deployment.txt', text: params.DEPLOYMENT_NOTES
            sh 'cat deployment.txt'
        }
    }
}
```

Use case: Configuration file content, deployment changelogs, multi-line system properties, YAML manifest content.

***

### 3. Boolean Parameter

Binary flag parameter rendered as a checkbox.

```groovy
parameters {
    booleanParam(name: 'RUN_TESTS', 
                 defaultValue: true, 
                 description: 'Execute test suite?')
    booleanParam(name: 'DEBUG_MODE', 
                 defaultValue: false, 
                 description: 'Enable debug logging?')
}
```

Conditional Execution:

```groovy
stage('Test') {
    when {
        expression { params.RUN_TESTS == true }
    }
    steps {
        sh 'npm test'
    }
}
```

Important note: Jenkins boolean parameters are technically strings (`"true"` or `"false"`). When comparing:

```groovy
// Correct
if (params.DEBUG_MODE == 'true') { ... }
if (params.DEBUG_MODE.toBoolean()) { ... }

// Incorrect
if (params.DEBUG_MODE) { ... }
```

Use case: Feature flags, test execution toggles, logging enablement, optional cleanup tasks, canary deployment decisions.

***

### 4. Choice Parameter

Dropdown selector with predefined options. First value is default.

```groovy
parameters {
    choice(name: 'DEPLOYMENT_REGION', 
           choices: ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1'], 
           description: 'Select AWS region')
    
    choice(name: 'LOG_LEVEL', 
           choices: ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'], 
           description: 'Application log level')
}
```

Validation in Shell:

```bash
case "$DEPLOYMENT_REGION" in
    us-east-1|us-west-2|eu-central-1|ap-southeast-1)
        echo "Valid region: $DEPLOYMENT_REGION"
        ;;
    *)
        echo "Invalid region: $DEPLOYMENT_REGION"
        exit 1
        ;;
esac
```

Use case: Environment selection (prod/staging/dev), build types (release/snapshot), deployment strategies (blue-green/canary/rolling), service tier selection.

***

### 5. Password Parameter

Masked input field for sensitive data. Value is hidden in logs.

```groovy
parameters {
    password(name: 'DB_PASSWORD', 
             defaultValue: '', 
             description: 'Database password for deployment')
}
```

Security considerations:

```groovy
// Avoid logging sensitive data
withEnv(['DB_PASS=' + params.DB_PASSWORD]) {
    sh '''
        export PGPASSWORD=$DB_PASS
        psql -h db.example.com -U admin -c "SELECT version();"
    '''
}
```

Use case: Database credentials, API secrets, webhook tokens, encryption keys. Prefer Jenkins credentials store over password parameters in production.

***

### 6. Credentials Parameter

Integrates with Jenkins' encrypted credentials store. Requires the Credentials Plugin.

```groovy
parameters {
    credentials(name: 'AWS_CREDENTIALS',
                description: 'AWS IAM credentials for deployment',
                credentialType: 'aws',
                required: true,
                defaultValue: 'prod-deployment-role')
}
```

Using in Pipeline:

```groovy
stage('Deploy') {
    steps {
        withAWS(credentials: params.AWS_CREDENTIALS, region: 'us-east-1') {
            sh 'aws s3 ls'
        }
    }
}

withCredentials([usernamePassword(
    credentialsId: params.AWS_CREDENTIALS,
    usernameVariable: 'USERNAME',
    passwordVariable: 'PASSWORD'
)]) {
    sh './deploy.sh'
}
```

Supported credential types include AWS, username/password, SSH keys, secret files, secret text, and certificates.

***

### 7. File Parameter

Accepts file uploads from the build trigger UI. Requires File Parameter Plugin.

```groovy
parameters {
    file(name: 'CONFIG_FILE', 
         description: 'Upload application configuration file')
}
```

Processing uploaded file:

```groovy
stage('Process Config') {
    steps {
        script {
            sh 'ls -la $WORKSPACE/CONFIG_FILE'
            sh 'cat $WORKSPACE/CONFIG_FILE | jq .'
        }
    }
}
```

Example config deployment:

```groovy
pipeline {
    agent any
    parameters {
        file(name: 'APP_CONFIG', description: 'YAML configuration')
    }
    stages {
        stage('Validate') {
            steps {
                sh 'yamllint $WORKSPACE/APP_CONFIG'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f $WORKSPACE/APP_CONFIG'
            }
        }
    }
}
```

Use case: Configuration uploads, test data sets, SSL certificates, environment manifests.

***

### 8. Git Parameter

Dynamically fetches branches, tags, or pull requests. Requires Git Parameter Plugin.

```groovy
parameters {
    gitParameter(type: 'PT_BRANCH',
                 name: 'BRANCH_TO_BUILD',
                 defaultValue: 'master',
                 description: 'Select branch to build',
                 branchFilter: 'origin/(.*)',
                 sortMode: 'DESCENDING_SMART',
                 selectedValue: 'DEFAULT')
}
```

Usage in checkout:

```groovy
stage('Checkout') {
    steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: params.BRANCH_TO_BUILD]],
            userRemoteConfigs: [[url: 'https://github.com/org/repo.git']]
        ])
    }
}
```

Use case: Release deployments, feature branch testing, multi-repo orchestration, GitOps flows.

***

### 9. Run Parameter

Allows selection of previous build numbers.

```groovy
parameters {
    run(name: 'PREVIOUS_BUILD',
        description: 'Select a previous build to analyze')
}
```

Using previous build artifacts:

```groovy
stage('Analyze') {
    steps {
        copyArtifacts(
            projectName: env.JOB_NAME,
            selector: specific(params.PREVIOUS_BUILD),
            target: 'previous-artifacts/'
        )
        sh 'diff -r previous-artifacts/ ./'
    }
}
```

Use case: Build comparison, regression detection, artifact rollback, historical analysis.

***

### 10. Hidden Parameter

Parameters not displayed in the UI. Requires Hidden Parameter Plugin.

```groovy
properties([
    parameters([
        [$class: 'WHideParameterDefinition', 
         name: 'INTERNAL_CONFIG', 
         defaultValue: 'internal-value']
    ])
])
```

Use case: Admin-configured values, internal system parameters, deprecated parameters, policy enforcement.

***

### 11. Active Choices Parameter

Dynamically generates values with Groovy. Requires Active Choices Plugin.

```groovy
[$class: 'ChoiceParameter',
 choiceType: 'PT_SINGLE_SELECT',
 name: 'AVAILABLE_DATABASES',
 script: [
     $class: 'GroovyScript',
     script: '''
         def databases = ['production-db', 'staging-db', 'dev-db']
         return databases
     '''
 ],
 description: 'Select database for query']
```

Use case: Database names, dynamic cloud resource lists, environment inventory, feature flags.

***

### 12. Active Choices Reactive Parameter

Cascading parameters whose values depend on other parameters.

```groovy
[$class: 'ChoiceParameter',
 name: 'REGION',
 script: [
     $class: 'GroovyScript',
     script: 'return ["us-east-1", "us-west-2", "eu-central-1"]'
 ]],

[$class: 'CascadeChoiceParameter',
 name: 'AVAILABILITY_ZONE',
 referencedParameters: 'REGION',
 script: [
     $class: 'GroovyScript',
     script: '''
         def zones = [
             "us-east-1": ["us-east-1a", "us-east-1b", "us-east-1c"],
             "us-west-2": ["us-west-2a", "us-west-2b"],
             "eu-central-1": ["eu-central-1a", "eu-central-1b"]
         ]
         return zones[REGION] ?: []
     '''
 ]
]
```

Use case: Region → AZ, Cluster → Namespace → Pod, multi-level infrastructure selection.

## Adding Parameters to Jobs

### Freestyle Jobs

{% stepper %}
{% step %}
### Configure the job

Open job → Configure
{% endstep %}

{% step %}
### Enable parameterization

Check **This project is parameterized**
{% endstep %}

{% step %}
### Add a parameter

Click **Add Parameter** and choose type
{% endstep %}

{% step %}
### Configure parameter

Set name, default value, description
{% endstep %}

{% step %}
### Use parameters in build steps

Reference parameters (e.g., `$ENVIRONMENT` in shell)
{% endstep %}

{% step %}
### Save and run

Save and use **Build with Parameters** button
{% endstep %}
{% endstepper %}

***

### Declarative Pipeline (Jenkinsfile)

Example multi-parameter deployment pipeline:

```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', 
               choices: ['dev', 'staging', 'production'],
               description: 'Target environment')
        
        string(name: 'APPLICATION_VERSION',
               defaultValue: '1.0.0',
               description: 'Application version to deploy')
        
        booleanParam(name: 'RUN_SMOKE_TESTS',
                     defaultValue: true,
                     description: 'Execute smoke tests post-deployment?')
        
        choice(name: 'DEPLOYMENT_STRATEGY',
               choices: ['rolling', 'blue-green', 'canary'],
               description: 'Deployment strategy')
    }
    
    environment {
        DEPLOY_REGION = 'us-east-1'
        APP_NAME = 'myapp'
    }
    
    stages {
        stage('Validate Parameters') {
            steps {
                script {
                    echo "✓ Parameters Received:"
                    echo "  Environment: ${params.ENVIRONMENT}"
                    echo "  Version: ${params.APPLICATION_VERSION}"
                    echo "  Strategy: ${params.DEPLOYMENT_STRATEGY}"
                    echo "  Run Tests: ${params.RUN_SMOKE_TESTS}"
                }
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    echo "Building ${APP_NAME}:${APPLICATION_VERSION}"
                    docker build -t ${APP_NAME}:${APPLICATION_VERSION} .
                '''
            }
        }
        
        stage('Smoke Tests') {
            when {
                expression { params.RUN_SMOKE_TESTS == 'true' }
            }
            steps {
                sh 'npm test -- --testPathPattern="smoke"'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    switch(params.DEPLOYMENT_STRATEGY) {
                        case 'rolling':
                            sh './deploy-rolling.sh'
                            break
                        case 'blue-green':
                            sh './deploy-blue-green.sh'
                            break
                        case 'canary':
                            sh './deploy-canary.sh'
                            break
                    }
                }
            }
        }
        
        stage('Verify') {
            steps {
                sh '''
                    echo "Verifying deployment in ${ENVIRONMENT}..."
                    curl -f http://app-${ENVIRONMENT}.example.com/health || exit 1
                '''
            }
        }
    }
    
    post {
        always {
            echo "Deployment to ${params.ENVIRONMENT} completed"
        }
        failure {
            mail to: 'devops@example.com',
                 subject: "Deployment Failed: ${APP_NAME} v${params.APPLICATION_VERSION}",
                 body: "Check build logs for details"
        }
    }
}
```

## Triggering Parameterized Builds

### UI Trigger

{% stepper %}
{% step %}
### Open job in Jenkins UI
{% endstep %}

{% step %}
### Click **Build with Parameters**
{% endstep %}

{% step %}
### Fill parameter values
{% endstep %}

{% step %}
### Click **Build**
{% endstep %}
{% endstepper %}

***

### Remote API: buildWithParameters

URL format:

```
/job/{jobname}/buildWithParameters?PARAM1=VALUE1&PARAM2=VALUE2
```

Example:

```bash
curl -X POST \
  'http://jenkins.example.com:8080/job/deploy-app/buildWithParameters?ENVIRONMENT=staging&VERSION=2.1.0&DEBUG=true' \
  -u username:api-token
```

With file parameter:

```bash
curl -X POST \
  -F 'file=@config.yml' \
  -F 'ENVIRONMENT=production' \
  'http://jenkins.example.com:8080/job/ConfigDeploy/buildWithParameters' \
  -u username:api-token
```

***

### Remote API with Token (buildByToken)

Configure:

* Build Triggers → **Trigger builds remotely**
* Authentication token: `SECURE_TOKEN_VALUE`

URL format:

```
/buildByToken/buildWithParameters?token=TOKEN&job=JOBNAME&PARAM=VALUE
```

Example:

```bash
curl -X POST \
  'http://jenkins.example.com:8080/buildByToken/buildWithParameters?token=mytoken&job=deploy-job&ENV=prod&VERSION=1.2.3'
```

***

### Parameterized Trigger Plugin (Job-to-Job)

Using Jenkinsfile:

```groovy
stage('Trigger Deployment') {
    steps {
        build(
            job: 'deploy-application',
            parameters: [
                string(name: 'APP_VERSION', value: '2.0.0'),
                string(name: 'TARGET_ENV', value: 'staging'),
                booleanParam(name: 'RUN_TESTS', value: true)
            ],
            wait: true,
            propagate: true
        )
    }
}
```

## Sample Real-World Use Cases

### Multi-Environment Deployment

```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT',
               choices: ['dev', 'staging', 'production'],
               description: 'Target environment')
        
        string(name: 'VERSION',
               defaultValue: 'latest',
               description: 'Docker image tag')
        
        booleanParam(name: 'ROLLBACK',
                     defaultValue: false,
                     description: 'Rollback to previous version?')
    }
    
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        APP_NAME = 'myapp'
    }
    
    stages {
        stage('Deploy') {
            steps {
                script {
                    sh '''
                        if [ "$ROLLBACK" = "true" ]; then
                            kubectl rollout undo deployment/${APP_NAME} -n ${ENVIRONMENT}
                        else
                            kubectl set image deployment/${APP_NAME} ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${VERSION} -n ${ENVIRONMENT}
                            kubectl rollout status deployment/${APP_NAME} -n ${ENVIRONMENT}
                        fi
                    '''
                }
            }
        }
    }
}
```

***

### Dynamic Kubernetes Debugging with Cascading Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        [$class: 'ChoiceParameter',
         choiceType: 'PT_SINGLE_SELECT',
         name: 'CLUSTER',
         script: [
             $class: 'GroovyScript',
             script: '''
                 return ["prod-us-east", "prod-eu-west", "staging-us-east", "dev-local"]
             '''
         ]],
        
        [$class: 'CascadeChoiceParameter',
         choiceType: 'PT_SINGLE_SELECT',
         name: 'NAMESPACE',
         referencedParameters: 'CLUSTER',
         script: [
             $class: 'GroovyScript',
             script: '''
                 def namespaces = [
                     "prod-us-east": ["default", "monitoring", "ingress-nginx", "kube-system"],
                     "prod-eu-west": ["default", "monitoring", "ingress-nginx"],
                     "staging-us-east": ["default", "testing"],
                     "dev-local": ["default"]
                 ]
                 return namespaces[CLUSTER] ?: ["default"]
             '''
         ]],
        
        [$class: 'CascadeChoiceParameter',
         choiceType: 'PT_MULTI_SELECT',
         name: 'POD_NAMES',
         referencedParameters: 'CLUSTER,NAMESPACE',
         script: [
             $class: 'GroovyScript',
             script: '''
                 def cmd = "kubectl get pods -n ${NAMESPACE} --context ${CLUSTER} -o jsonpath='{.items[*].metadata.name}'"
                 def pods = cmd.execute().text.split()
                 return pods
             '''
         ]]
    }
    
    stages {
        stage('Get Pod Status') {
            steps {
                sh '''
                    echo "Fetching status for pods in cluster: $CLUSTER, namespace: $NAMESPACE"
                    kubectl get pods -n $NAMESPACE --context $CLUSTER
                '''
            }
        }
        
        stage('Execute Debug') {
            steps {
                sh '''
                    for POD in $POD_NAMES; do
                        echo "=== Debugging pod: $POD ==="
                        kubectl exec -it $POD -n $NAMESPACE --context $CLUSTER -- /bin/sh -c 'env | head -20'
                    done
                '''
            }
        }
    }
}
```

***

### Terraform Provisioning with Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'ACTION',
               choices: ['plan', 'apply', 'destroy'],
               description: 'Terraform action')
        
        choice(name: 'ENVIRONMENT',
               choices: ['development', 'staging', 'production'],
               description: 'Target environment')
        
        string(name: 'INSTANCE_COUNT',
               defaultValue: '3',
               description: 'Number of instances')
        
        credentials(name: 'AWS_CREDENTIALS',
                    description: 'AWS credentials for Terraform',
                    credentialType: 'aws',
                    required: true)
        
        booleanParam(name: 'AUTO_APPROVE',
                     defaultValue: false,
                     description: 'Auto-approve Terraform changes?')
    }
    
    environment {
        TF_BACKEND = "s3://terraform-state-${params.ENVIRONMENT}"
        TF_VARS_FILE = "terraform/environments/${params.ENVIRONMENT}.tfvars"
    }
    
    stages {
        stage('Init') {
            steps {
                sh 'terraform init -backend-config="bucket=${TF_BACKEND}" -upgrade'
            }
        }
        
        stage('Plan') {
            steps {
                withAWS(credentials: params.AWS_CREDENTIALS, region: 'us-east-1') {
                    sh '''
                        terraform plan \
                          -var-file="${TF_VARS_FILE}" \
                          -var="instance_count=${INSTANCE_COUNT}" \
                          -out=tfplan
                    '''
                }
            }
        }
        
        stage('Review') {
            when {
                expression { params.ACTION != 'plan' && !params.AUTO_APPROVE }
            }
            steps {
                input 'Proceed with Terraform apply?'
            }
        }
        
        stage('Apply/Destroy') {
            when {
                expression { params.ACTION in ['apply', 'destroy'] }
            }
            steps {
                withAWS(credentials: params.AWS_CREDENTIALS, region: 'us-east-1') {
                    script {
                        if (params.ACTION == 'apply') {
                            sh 'terraform apply tfplan'
                        } else {
                            sh 'terraform destroy -var-file="${TF_VARS_FILE}" -auto-approve'
                        }
                    }
                }
            }
        }
    }
}
```

## Best Practices

* Validate all parameters early in the pipeline (environment names, versions, numeric bounds)
* Avoid logging secrets; use Jenkins credentials + masking
* Use typed parameters (choice/boolean) instead of free text where possible
* Centralize common parameter sets via shared libraries or templates
* Keep parameter names stable and consistent across jobs
* Add clear descriptions so other teams can safely self-service jobs

## Common Troubleshooting Tips

<details>

<summary>Parameters not recognized</summary>

Cause: Name mismatch / case sensitive

Solution: Ensure UI name matches Jenkinsfile and shell usage exactly

</details>

<details>

<summary>Boolean always true</summary>

Cause: String vs boolean confusion

Solution: Use `params.FLAG.toBoolean()` or compare to `"true"`

</details>

<details>

<summary>Git parameter empty</summary>

Cause: Plugin or credential issue

Solution: Verify Git Parameter plugin and repository access

</details>

<details>

<summary>Active Choices failing</summary>

Cause: Groovy errors / missing plugins

Solution: Test script in Script Console and confirm plugin installed

</details>

<details>

<summary>File not uploaded</summary>

Cause: File size limits

Solution: Increase maximum file upload size in Jenkins config

</details>

<details>

<summary>Remote API 404</summary>

Cause: Wrong endpoint

Solution: Use `/buildWithParameters` for parameterized jobs, not `/build`

</details>

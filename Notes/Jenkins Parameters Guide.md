# Jenkins Parameters: Types, Use Cases, and Examples

When you enable **"This project is parameterized"** in Jenkins, you allow users to pass dynamic input into the build process at runtime. This turns a static, hard-coded job into a flexible, reusable pipeline.

Below are the most common parameter types in Jenkins, including their practical use cases and how to use them in a Declarative Pipeline.

---

## 1. String Parameter
A basic text input field that allows the user to type any string of characters.

- **Use Case:** Passing a specific version number, Git branch name, or an environment name (if it's not a strict list).
- **Example Scenario:** You want to let the developer type in the specific Git branch they want to build (e.g., `feature/login-page`).

### Pipeline Example:
```groovy
pipeline {
    agent any
    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Enter the Git branch to build')
    }
    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch: ${params.BRANCH_NAME}"
                // git branch: "${params.BRANCH_NAME}", url: 'https://github.com/example/repo.git'
            }
        }
    }
}
```

---

## 2. Choice Parameter
A dropdown menu that forces the user to select from a predefined list of options. 

- **Use Case:** Preventing user typos by restricting inputs to exact values, such as deployment environments (`dev`, `qa`, `prod`) or specific cloud regions (`us-east-1`, `eu-west-1`).
- **Example Scenario:** You have one deployment job, and you want the user to select which environment the code should be deployed to.

### Pipeline Example:
```groovy
pipeline {
    agent any
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'qa', 'staging', 'prod'], description: 'Select the target environment')
    }
    stages {
        stage('Deploy') {
            steps {
                echo "Deploying application to the ${params.ENVIRONMENT} environment."
                // sh "./deploy.sh --env ${params.ENVIRONMENT}"
            }
        }
    }
}
```

---

## 3. Boolean Parameter
A simple checkbox that returns `true` if checked, and `false` if unchecked.

- **Use Case:** Toggling optional steps in a pipeline, such as enabling/disabling automated tests, forcing a database wipe, or turning on debug logging.
- **Example Scenario:** Running full security scans takes 30 minutes. You want a checkbox to let the developer skip the security scan for quick testing.

### Pipeline Example:
```groovy
pipeline {
    agent any
    parameters {
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Check to run unit tests during build')
    }
    stages {
        stage('Test') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                echo "Running unit tests..."
                // sh "npm test"
            }
        }
    }
}
```

---

## 4. Password Parameter
A masked text field where the input is hidden (shows as `****`) on the screen and in the build logs.

- **Use Case:** Securely passing temporary passwords, API tokens, or secrets that aren't stored permanently in the Jenkins Credentials Manager.
- **Example Scenario:** An operations engineer needs to pass a temporary, one-time-use database admin password to run a specific migration script.

### Pipeline Example:
```groovy
pipeline {
    agent any
    parameters {
        password(name: 'DB_ADMIN_PASS', defaultValue: '', description: 'Enter the database admin password')
    }
    stages {
        stage('Migrate Database') {
            steps {
                // The password is automatically masked in the Jenkins console output
                echo "Applying database migrations..."
                // sh "flyway migrate -password=${params.DB_ADMIN_PASS}"
            }
        }
    }
}
```

---

## 5. File Parameter
Allows the user to browse their local computer and upload a file directly into the Jenkins workspace when triggering the build.

- **Use Case:** Uploading a custom configuration file, a license key, or a specific dataset needed just for this run.
- **Example Scenario:** You have a data-processing job, and the user needs to upload a CSV file that the script will parse and insert into the database.

*Note: The File Parameter is primarily used in Freestyle projects or scripted pipelines via UI configuration, as it is tricky to handle in pure Declarative Pipeline syntax due to how file uploads are processed before the workspace is fully allocated.*

### How it works (Freestyle Concept):
1. User clicks "Build with Parameters".
2. User clicks "Choose File" and selects `data.csv`.
3. Jenkins uploads `data.csv` to the build's workspace.
4. Your shell script step can now simply read `./data.csv` as if it was always there.

---

## Summary
By using parameters, you transform Jenkins from a simple cron-job runner into a powerful, interactive self-service portal for your development and operations teams.

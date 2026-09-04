# Jenkins Shared Libraries - Trainer Guide

## Objective
Teach students how to eliminate code duplication across multiple Jenkins pipelines by abstracting common logic into Jenkins Shared Libraries.

## Session Plan & Flow

### 1. The Problem Statement (5-10 mins)
- Start by showing two different Jenkinsfiles that have identical steps for building a Docker image or sending a Slack notification.
- Ask the students: *"If the Slack API or Docker build arguments change, how many repositories do we need to update?"* (Answer: All of them).
- Introduce **Shared Libraries** as the solution (Write Once, Use Anywhere).

### 2. Explain the Directory Structure (10 mins)
Explain that a shared library is just a Git repository with a specific structure.
- **`vars/`**: Holds global variables/steps that can be called directly in the pipeline (e.g., `vars/logMessage.groovy` becomes a `logMessage()` step). Focus mostly on this for beginners.
- **`src/`**: Standard Java/Groovy source directory for object-oriented classes. (Mention briefly).
- **`resources/`**: Non-Groovy files (like JSON configs or shell scripts) loaded using `libraryResource`.

### 3. Live Demonstration (20 mins)
Walk through the provided demo files in the `Shared-Library-Demo` folder.

**Step A: Creating the Library Code**
- Show `vars/logMessage.groovy`. Explain the `def call(...)` method is required for the script to behave like a step.
- Show `vars/buildDocker.groovy` to demonstrate accepting multiple parameters.

**Step B: Configuring in Jenkins UI**
- Go to **Manage Jenkins -> System**.
- Scroll down to **Global Pipeline Libraries**.
- Add a new library:
  - **Name:** `my-shared-lib` (This is the name used in the `@Library` annotation).
  - **Default version:** `main` or `master`.
  - **Retrieval method:** Modern SCM -> Git -> Provide the repository URL.

**Step C: Using the Library in a Jenkinsfile**
- Show the `Jenkinsfile`.
- Point out the `@Library('my-shared-lib') _` annotation. The `_` means "import everything into the global namespace".
- Run the pipeline and show the logs.

### 4. Student Exercise (15 mins)
- Have students create their own GitHub repository for a shared library.
- Ask them to write a simple step, configure it in their Jenkins, and call it from a pipeline.

## Trainer Tips
- **Common Error:** Forgetting the underscore `_` after the `@Library` annotation.
- Ensure students know that Jenkins clones the shared library repository *before* the main pipeline repository.

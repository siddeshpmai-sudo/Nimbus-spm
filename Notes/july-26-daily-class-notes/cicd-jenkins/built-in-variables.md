# Built in variables

| Variable       | Description                 | Common use                         |
| -------------- | --------------------------- | ---------------------------------- |
| `BUILD_NUMBER` | Current build number        | Docker image tags (`myapp:25`)     |
| `JOB_NAME`     | Jenkins job name            | Notifications, logging             |
| `WORKSPACE`    | Build workspace             | Copying files, builds              |
| `NODE_NAME`    | Agent executing the build   | Troubleshooting distributed builds |
| `BUILD_URL`    | Link to the build           | Slack/Email notifications          |
| `JENKINS_URL`  | Jenkins server URL          | Creating links in reports          |
| `GIT_BRANCH`   | Git branch                  | Branch-specific deployments        |
| `GIT_COMMIT`   | Commit hash                 | Version tracking and rollback      |
| `BRANCH_NAME`  | Multibranch pipeline branch | CI/CD conditions                   |
| `TAG_NAME`     | Git tag                     | Release deployments                |

# cicd flow

I've worked on various Jenkins pipelines to streamline CI/CD processes within our organization. Given the different range of applications, I've created CI/CD pipelines to suit the specific needs of each application. These pipelines incorporate various build tools such as Maven, Sonar, Docker, Tomcat, and others, ensuring seamless integration and deployment workflows.

## CI Process

The CI process consists of the following stages:

{% stepper %}
{% step %}
## Check out the source code

Check out the source code in the Jenkins workspace.
{% endstep %}

{% step %}
## Perform the Sonar scan

Perform the Sonar scan. If the scan result is successful, the build proceeds with other activities in the job; otherwise, the job is aborted.
{% endstep %}

{% step %}
## Create the binaries

Create the binaries (`war`, Docker image, `.exe`) with respect to build tools.
{% endstep %}

{% step %}
## Publish the binaries

Publish the binaries (`war`, Docker image, `.exe`) to the JFrog Artifactory.
{% endstep %}
{% endstepper %}

Once these activities are completed, the CI part is complete and the CD part starts.

Initiate the CD job from the CI job in the post-build section. The CI job triggers the CD job with parameters.

## CD Job for Deploying to Kubernetes Clusters

{% stepper %}
{% step %}
## Check out the manifest repository

Check out the Git repository that contains the manifest file.
{% endstep %}

{% step %}
## Update the manifest file

Update the manifest file with the latest image tag.
{% endstep %}

{% step %}
## Log in to Kubernetes clusters

Log in to the Kubernetes clusters with an IAM user.
{% endstep %}

{% step %}
## Deploy the application

Deploy the application with Kubectl commands on clusters.
{% endstep %}

{% step %}
## Verify the deployment

Once deployment is complete, verify the deployment.
{% endstep %}

{% step %}
## Resolve deployment issues or roll back

If the deployment is not successful, check the application logs and try to fix the issue.

If unable to fix the issue, roll back the application to the previous version.
{% endstep %}
{% endstepper %}

## CD Job for Deploying to Tomcat

Check out the Git repository that contains the Ansible playbook.

The playbook contains the following tasks:

{% stepper %}
{% step %}
## Download and extract binaries

Download the binaries to the Tomcat server and extract the binaries.
{% endstep %}

{% step %}
## Stop Tomcat services

Stop the Tomcat services.
{% endstep %}

{% step %}
## Back up existing files

Take a backup of existing binaries and configuration files.
{% endstep %}

{% step %}
## Copy the latest files

Copy the latest binaries, configuration files, and dependencies to the targeted path.
{% endstep %}

{% step %}
## Start Tomcat and verify deployment

Start the Tomcat service and verify the deployment.
{% endstep %}

{% step %}
## Resolve deployment issues or roll back

If a deployment fails, first examine the application logs to identify and address any issues. If possible, fix the problem; otherwise, initiate a rollback to the previous version of the application.
{% endstep %}
{% endstepper %}

## Kubernetes Deployment Steps

Jenkinsfile to define the steps in a pipeline for deploying a Spring Boot application to an EKS cluster using Jenkins.

The steps include:

* Checking out the Git repository
* Building a JAR
* Building a Docker image
* Pushing the image to ECR
* Integrating Jenkins with the EKS cluster
* Deploying an app to EKS

To do this, select “Pipeline script” under the pipeline section and specify the necessary steps.

```groovy
pipeline {
   tools {
       maven 'Maven3'
   }
   agent any
   stages {
       stage('Checkout') {
           steps {
               checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: '<GIT_REPO_URL>']]])
           }
       }
       stage('Build Jar') {
           steps {
               sh 'mvn clean package'
           }
       }
       stage('Docker Image Build') {
           steps {
               sh 'docker build -t <IMAGE_NAME> .'
           }
       }
       stage('Push Docker Image to ECR') {
           steps {
               withAWS(credentials: '<AWS_CREDENTIALS_ID>', region: '<AWS_REGION>') {
                   sh 'aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <ECR_REGISTRY_ID>'
                   sh 'docker tag <IMAGE_NAME>:latest <ECR_REGISTRY_ID>/<IMAGE_NAME>:latest'
                   sh 'docker push <ECR_REGISTRY_ID>/<IMAGE_NAME>:latest'
               }
           }
       }
       stage('Integrate Jenkins with EKS Cluster and Deploy App') {
           steps {
               withAWS(credentials: '<AWS_CREDENTIALS_ID>', region: '<AWS_REGION>') {
                 script {
                   sh ('aws eks update-kubeconfig --name <EKS_CLUSTER_NAME> --region <AWS_REGION>')
                   sh "kubectl apply -f <K8S_DEPLOY_FILE>.yaml"
               }
               }
       }
   }
   }
}
```

The pipeline has five stages:

{% stepper %}
{% step %}
## Checkout

The “Checkout” stage retrieves the code from a Git repository. It specifies the Git repository URL and the branch to check out, in this case the main branch.

The code is checked out in the Jenkins workspace and is available for the rest of the pipeline to use.
{% endstep %}

{% step %}
## Maven Build

This build stage is responsible for creating a JAR file of the Spring Boot application code. This is done using the Apache Maven build tool.

The steps in this stage include:

* Cleaning any previous build artifacts using the command `mvn clean`.
* Building the JAR file using the command `mvn package`.

This stage compiles the source code into a standalone executable JAR file, which is used in later stages of the pipeline.

Building a JAR file is a one-time process, but it may need to be rebuilt if changes are made to the code or if a new version is being released. Additionally, JAR files can also be repackaged if needed.
{% endstep %}

{% step %}
## Docker Image Build

This stage builds a Docker image using a Dockerfile. The stage runs a shell command using the `sh` step, which runs the `docker build` command.

The `-t` option specifies the name of the image, and the `.` at the end of the command specifies that the build context is the current directory. The image name is specified using the placeholder `<IMAGE_NAME>`.
{% endstep %}

{% step %}
## Push Docker Image to ECR

This stage pushes the Docker image built in the previous stage to Amazon Elastic Container Registry (ECR), a fully-managed Docker container registry service provided by AWS.

The stage uses AWS CLI to authenticate and push the image to the specified ECR repository.
{% endstep %}

{% step %}
## Integrate Jenkins with EKS and deploy

This stage integrates Jenkins with an AWS EKS (Elastic Kubernetes Service) cluster and deploys an application.

By using the `withAWS` block, Jenkins can securely access AWS resources, such as Amazon Elastic Container Registry or Amazon Elastic Kubernetes Service, on behalf of the user.

* The first command updates the `kubectl` configuration to connect to the specified EKS cluster.
* The application is then deployed to the cluster using the `kubectl apply` command and the YAML file for deployment and service.
{% endstep %}
{% endstepper %}

### Trigger the Pipeline

Start the pipeline by clicking “Build Now” in the Jenkins Dashboard.

![](<../../.gitbook/assets/AD_4nXfafcTB0_kJamzesOW4G8TZKBjBsZB2sC3piBw9ewRg1utizqOLINZDNpbamr2uiXEKbdBMs8UDC QCnf26Rzk7WoNn3a2KySUaDfOmT60vgzhs44 uUTpCBPlJ44RnjngAnvCJeDjH490kbTCj8kt1hvwC>)

### Monitor the Pipeline

Monitor the pipeline progress and view the build logs to see if there are any issues that need to be addressed.

![](<../../.gitbook/assets/AD_4nXfIUeT_P2Qblfc4tDwXz8oRP5gwfiShvm0hRtP_2_15AxJ3BchhsxK kjWd4t7qRrEpvao8cezjSUepwo9KbXcTe6GL0ZfYcoxlBbWUWZjzjyzLAzlYtSFiLpgF99Y_geldcu3t_3vIPyGmVGLmy8HaB o>)

### Interact with a Cluster from Terminal

Retrieve the status of an Amazon Elastic Container Service for Kubernetes (EKS) cluster:

```bash
aws eks describe-cluster --region <region-name> --name <cluster-name> --query cluster.status
```

### Update the kubeconfig File

The kubeconfig file is used to manage communication between the Kubernetes command-line tool (`kubectl`) and the cluster. Use the following command to update the kubeconfig file:

```bash
aws eks --region <region-name> update-kubeconfig --name <cluster-name>
```

### Retrieve Data from the Cluster

The following commands retrieve information from a Kubernetes cluster, including lists of all nodes, pods, and services, as well as deployment data:

```bash
kubectl get nodes
```

```bash
kubectl get pods
```

```bash
kubectl get services
```

```bash
kubectl get deployments
```

### Expose the Service

To make a service accessible from outside the cluster, expose it using a LoadBalancer. In this example project, a service has already been deployed through Jenkins and made accessible to the outside world via LoadBalancer.

If your service is not yet accessible from the internet, make it accessible by changing the service type to LoadBalancer before deploying it to the cluster.

![](<../../.gitbook/assets/AD_4nXdRV5WRxJ42v0VFJJ0B2M0zVGIhszxRxiDS6SbxsuTqVfDDlW4qsLmejgBeHqCV6RlecDU0fYh_9ErzfhyLetLyT45UeUlpHD8zG2CqY 0JoyYMI2QlCDx7mjnj_Q_hOtaVqviiUGsYbMNGhqwPTmYwNJQ0>)

### Service Type LoadBalancer

Change your service type to LoadBalancer to make it accessible from the internet. Do this before deploying the service to the cluster.

### Get the External IP

Run the `kubectl get svc` command to get the list of all services in the cluster and their details, including the external IP.

![](<../../.gitbook/assets/AD_4nXdP6ES6gYRfprOVj0DQzmu8cPcgdM1dY55zXToipcahwmMi2uRUgAAVD9W3miA qzwmVTXXekulWJgb3sm0Oiyr_cPmV q6ry3weE__FqG_Bl4waCihJI4jTHFm6D0yc4CKzlCwwtdUzmvamjSLq0pfAoA>)

### Example

To view your application from the internet, open a web browser and enter the external IP address followed by the port number in the following format: `<External-IP>:<PORT>`.

Before doing this, make sure that the port where your service is running is open and accessible.

### Allow the Required Ports

To allow access to the app, configure the security group associated with the worker nodes in the EKS cluster to allow incoming traffic on the port used by the service.

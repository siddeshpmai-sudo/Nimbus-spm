window.interviewData = window.interviewData || {};

window.interviewData["Jenkins"] = {
  "Basic": [
    { 
      q: "What is Jenkins?", 
      a: "<strong>Detailed Solution:</strong> Jenkins is an open-source automation server.<br><ul><li><strong>Function:</strong> It helps automate the non-human parts of the software development process, primarily continuous integration (CI) and continuous delivery (CD).</li><li><strong>Mechanism:</strong> It runs predefined steps (compiling code, running tests, deploying to servers) triggered by code changes in a version control system like Git.</li></ul>" 
    },
    { 
      q: "What is a Jenkinsfile?", 
      a: "<strong>Detailed Solution:</strong> It is the foundation of \"Pipeline-as-Code\".<br><ul><li><strong>Function:</strong> A text file containing the entire definition of a Jenkins Pipeline, including all stages, steps, and error handling.</li><li><strong>Best Practice:</strong> It should be checked into your Git repository alongside your application code. This ensures the CI/CD logic is version-controlled and peer-reviewed just like application code.</li></ul>" 
    },
    { 
      q: "What is the difference between Declarative and Scripted pipelines?", 
      a: "<strong>Detailed Solution:</strong> Jenkins offers two syntaxes for pipelines.<br><ul><li><strong>Declarative:</strong> Uses strict, structured blocks (e.g., <code>pipeline { agent any; stages { ... } }</code>). It is easier to read, write, and maintain, providing pre-defined sections for common tasks like <code>post</code> conditions.</li><li><strong>Scripted:</strong> Uses raw Groovy code running inside a <code>node { ... }</code> block. It provides maximum flexibility and complex programmatic logic, but is harder to maintain and read.</li></ul>" 
    },
    { 
      q: "What is a Jenkins agent?", 
      a: "<strong>Detailed Solution:</strong> A machine (virtual, physical, or container) that connects to the Jenkins controller.<br><ul><li><strong>Function:</strong> The controller (master) handles scheduling and UI, but offloads the actual heavy lifting (compiling, testing) to agents.</li><li><strong>Why it's needed:</strong> Running builds directly on the master is a security risk and causes resource exhaustion. Agents allow distributed, scalable, and isolated build environments (e.g., Windows agents for .NET, Linux for Node.js).</li></ul>" 
    },
    { 
      q: "How do you secure credentials in Jenkins?", 
      a: "<strong>Detailed Solution:</strong> Hardcoding passwords in scripts is a massive security vulnerability.<br><ul><li><strong>Mechanism:</strong> Use the Jenkins Credentials Plugin. You store the secret (password, API key, SSH key) securely encrypted on the Jenkins controller.</li><li><strong>Usage:</strong> In a pipeline, you inject it securely using the <code>withCredentials</code> block or the <code>environment</code> directive. Jenkins will automatically mask the secret as <code>****</code> if it accidentally gets printed in the console logs.</li></ul>" 
    },
    { 
      q: "What is a Multibranch Pipeline?", 
      a: "<strong>Detailed Solution:</strong> An automated pipeline management system.<br><ul><li><strong>Function:</strong> You point Jenkins to a repository (like GitHub). Jenkins scans the repository, discovers all branches, and automatically creates a separate pipeline run for every branch that contains a Jenkinsfile.</li><li><strong>Benefit:</strong> It completely eliminates manual job creation. When a developer creates a new feature branch or Pull Request, Jenkins automatically detects it and runs tests against it.</li></ul>" 
    },
    { 
      q: "How can you trigger a Jenkins job automatically?", 
      a: "<strong>Detailed Solution:</strong> Jenkins supports several automated triggers.<br><ul><li><strong>Webhooks (Push):</strong> The best method. GitHub sends an HTTP POST to Jenkins the instant a commit is made, triggering immediate execution.</li><li><strong>Polling (Pull):</strong> Jenkins checks Git every few minutes (e.g., <code>H/5 * * * *</code>). Inefficient due to high API overhead.</li><li><strong>Cron:</strong> Schedule the job to run at specific times (e.g., nightly builds).</li><li><strong>Upstream:</strong> Job B is triggered automatically when Job A completes successfully.</li></ul>" 
    },
    { 
      q: "What is the 'Workspace' in Jenkins?", 
      a: "<strong>Detailed Solution:</strong> It is a temporary working directory on the agent node.<br><ul><li><strong>Function:</strong> When a build starts, Jenkins checks out the source code from Git into this exact folder on the agent's hard drive. All compilation, testing, and file generation happens here.</li><li><strong>Note:</strong> Workspaces are persistent by default. If a build fails and leaves corrupt files, the next build might fail too unless you explicitly clean the workspace.</li></ul>" 
    },
    { 
      q: "How do you install plugins in Jenkins?", 
      a: "<strong>Detailed Solution:</strong> Plugins extend Jenkins' core capabilities.<br><ul><li><strong>Method 1 (UI):</strong> Go to Manage Jenkins > Manage Plugins > Available tab. Search for the plugin and click 'Install without restart'.</li><li><strong>Method 2 (CLI):</strong> Use the Jenkins CLI tool: <code>java -jar jenkins-cli.jar install-plugin &lt;name&gt;</code>.</li><li><strong>Method 3 (JCasC):</strong> Define required plugins in a `plugins.txt` file and install them programmatically during server bootstrapping.</li></ul>" 
    },
    { 
      q: "What is an artifact in Jenkins?", 
      a: "<strong>Detailed Solution:</strong> An artifact is the tangible output of a successful build process.<br><ul><li><strong>Examples:</strong> Compiled binaries (.jar, .war), Docker images, zip files, or generated test reports.</li><li><strong>Management:</strong> Using the <code>archiveArtifacts</code> step, Jenkins uploads these files from the agent's workspace back to the controller, making them available for users to download from the UI, or passing them to downstream deployment jobs.</li></ul>" 
    }
  ],
  "Scenario Based": [
    { 
      q: "Scenario: Your Jenkins master is running out of disk space. How do you fix this?", 
      a: "<strong>Detailed Solution:</strong> Jenkins natively hoards old build data, which inevitably causes disk exhaustion. You need a multi-pronged cleanup strategy.<br><ul><li><strong>1. Build Discarder:</strong> Immediately edit your job configurations (or Jenkinsfile <code>options</code> block) to include the 'Discard old builds' rule. Set it to keep only the last 10 builds or builds from the last 7 days.</li><li><strong>2. Workspace Cleanup:</strong> Jenkins leaves source code on the agent disks after a build. Use the Workspace Cleanup Plugin to add a <code>post { always { cleanWs() } }</code> step in your pipeline to wipe the workspace after execution.</li><li><strong>3. Artifact Management:</strong> Never store large binary artifacts (.jar, Docker images) permanently on the Jenkins master. Configure pipelines to upload artifacts directly to external repositories like AWS S3 or JFrog Artifactory.</li></ul>" 
    },
    { 
      q: "Scenario: You have a build that works locally but fails in Jenkins. How do you troubleshoot?", 
      a: "<strong>Detailed Solution:</strong> This classic 'works on my machine' issue requires isolating environmental differences.<br><ul><li><strong>Step 1: Check Tool Versions.</strong> Is your laptop running Java 17, but the Jenkins agent defaults to Java 11? Verify Node.js, Python, or Maven versions.</li><li><strong>Step 2: Environment Variables.</strong> Your local shell likely has variables (like paths or keys) that the Jenkins agent lacks. Run <code>sh 'env'</code> in Jenkins to compare.</li><li><strong>Step 3: Permissions.</strong> You run local builds as root/admin. Jenkins agents run under a restricted `jenkins` user. Check for permission denied errors when reading/writing files.</li><li><strong>Step 4: Clean State.</strong> Your local workspace has cached dependencies. The Jenkins workspace downloads fresh. Wipe your local cache and rebuild to replicate the failure.</li></ul>" 
    },
    { 
      q: "Scenario: You need to run tests in parallel on 3 different browsers.", 
      a: "<strong>Detailed Solution:</strong> Running tests sequentially wastes time. You must leverage the Pipeline's parallel capabilities.<br><ul><li><strong>Implementation:</strong> In a Declarative pipeline, use the <code>parallel</code> block inside a stage. Define nested stages for Chrome, Firefox, and Safari.</li><li><strong>Code Example:</strong><br><code>stage('UI Tests') { parallel { stage('Chrome') { steps { sh 'run-chrome' } } stage('Firefox') { steps { sh 'run-firefox' } } } }</code></li><li><strong>Resource Allocation:</strong> Ensure you have enough Jenkins agents/executors available. If you only have 1 executor, the parallel branches will just queue up and run sequentially anyway.</li></ul>" 
    },
    { 
      q: "Scenario: You need to pass a dynamic version number generated in Stage 1 to Stage 3.", 
      a: "<strong>Detailed Solution:</strong> In Jenkins pipelines, environments are not always persistent across stages, especially if they run on different agents.<br><ul><li><strong>Solution 1 (Files & Stashing):</strong> In Stage 1, write the version to a text file (<code>sh 'echo 1.0.5 > version.txt'</code>). Use the <code>stash</code> command to save this file on the controller. In Stage 3, use <code>unstash</code>, read the file, and assign it to a variable. This guarantees the data travels across physical nodes.</li><li><strong>Solution 2 (Groovy Variable):</strong> If using a scripted pipeline or a <code>script {}</code> block, define a global Groovy variable at the top of the Jenkinsfile (<code>def APP_VER = ''</code>). Set it in Stage 1. It will be accessible in Stage 3, provided both stages execute in the same memory context.</li></ul>" 
    },
    { 
      q: "Scenario: You need a job to deploy to Production only if someone manually approves it.", 
      a: "<strong>Detailed Solution:</strong> Automating deployments to production without oversight can be dangerous. Introduce a manual gate.<br><ul><li><strong>Implementation:</strong> Use the <code>input</code> step in your Pipeline before the deployment stage.</li><li><strong>Execution:</strong> The pipeline will pause indefinitely at this step. It will send a notification (via email or Slack) to authorized users. The user logs into Jenkins, sees a prompt asking 'Deploy to Prod?', and clicks 'Proceed' or 'Abort'.</li><li><strong>Security:</strong> You can configure the `submitter` parameter on the input step so only users in the 'Release Managers' group can click the button.</li></ul>" 
    },
    { 
      q: "Scenario: A job is queued for a long time but never executes. Why?", 
      a: "<strong>Detailed Solution:</strong> A hung queue means Jenkins cannot find a suitable environment to run the job.<br><ul><li><strong>Reason 1: Label Mismatch.</strong> The job requests <code>agent { label 'linux-docker' }</code>, but no node connected to the controller has that exact label.</li><li><strong>Reason 2: Exhausted Executors.</strong> You have 5 agents with 2 executors each (10 total slots). If 10 jobs are currently running, the 11th job must wait in the queue until a slot frees up.</li><li><strong>Reason 3: Offline Agents.</strong> The required agent is disconnected due to network issues or an expired SSH key. Check the 'Manage Nodes' page.</li></ul>" 
    },
    { 
      q: "Scenario: A GitHub webhook isn't triggering your Jenkins job.", 
      a: "<strong>Detailed Solution:</strong> The communication link between GitHub and Jenkins is broken.<br><ul><li><strong>1. Accessibility:</strong> Jenkins must be publicly accessible on the internet (e.g., via a public IP or ngrok) for GitHub to send the HTTP POST. If Jenkins is hidden behind a corporate firewall, the webhook will fail.</li><li><strong>2. GitHub Configuration:</strong> Check the GitHub Webhook settings. Is the URL correct (ending in <code>/github-webhook/</code>)? Look at the 'Recent Deliveries' tab in GitHub to see if it returned a 200 OK or a timeout/error.</li><li><strong>3. Jenkins Plugin:</strong> Ensure the 'GitHub Integration Plugin' is installed and configured correctly.</li></ul>" 
    },
    { 
      q: "Scenario: You need to run a Docker container inside a Jenkins pipeline.", 
      a: "<strong>Detailed Solution:</strong> Leveraging Docker ensures the agent always has the exact tools needed without installing them on the host OS.<br><ul><li><strong>Declarative Syntax:</strong> Use the docker agent directive: <code>agent { docker { image 'maven:3.8.1-jdk-11' } }</code>.</li><li><strong>How it works:</strong> Jenkins will automatically pull the image, start the container, mount the workspace inside the container, and execute all `steps` <em>inside</em> that isolated container. When the pipeline finishes, Jenkins destroys the container.</li></ul>" 
    },
    { 
      q: "Scenario: Your build requires downloading massive dependencies every time, making it slow.", 
      a: "<strong>Detailed Solution:</strong> Downloading GBs of Node or Maven packages on every build wastes bandwidth and time. You need caching.<br><ul><li><strong>Solution (Host Mounts):</strong> When using Docker agents, mount the dependency cache directory from the host machine into the container.</li><li><strong>Example (Maven):</strong> <code>agent { docker { image 'maven:3'; args '-v /tmp/.m2:/root/.m2' } }</code>. Now, downloaded dependencies are saved on the host's <code>/tmp/.m2</code> directory. The next time a container spins up, it immediately accesses the cached files instead of downloading them from the internet.</li></ul>" 
    },
    { 
      q: "Scenario: You want to restart a failed pipeline from the middle, rather than from the beginning.", 
      a: "<strong>Detailed Solution:</strong> Re-running a 45-minute pipeline just because the final deployment stage failed due to a network blip is inefficient.<br><ul><li><strong>Solution:</strong> Use the 'Restart from Stage' feature.</li><li><strong>How to use:</strong> In the modern Jenkins UI or Blue Ocean, select the failed build. You will see an option to 'Restart from Stage'. Select the stage that failed. Jenkins will bypass all earlier successful stages, reconstruct the workspace state using hidden stashes, and execute only the remaining steps. This only works for Declarative pipelines.</li></ul>" 
    },
    { 
      q: "Scenario: Send a Slack notification on pipeline failure.", 
      a: "<strong>Detailed Solution:</strong> Alerting the team instantly is a core CI/CD practice.<br><ul><li><strong>Setup:</strong> Install the 'Slack Notification Plugin' and configure a Jenkins Integration inside your Slack workspace to get an authentication token.</li><li><strong>Code:</strong> Add a <code>post</code> block to your pipeline.<br><code>post { failure { slackSend(color: 'danger', message: \"Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\") } }</code>.</li></ul>" 
    },
    { 
      q: "Scenario: Run a pipeline periodically like a cron job.", 
      a: "<strong>Detailed Solution:</strong> Use the built-in triggers directive.<br><ul><li><strong>Code:</strong> Inside the pipeline block, add <code>triggers { cron('H 0 * * *') }</code>.</li><li><strong>Explanation:</strong> This standard cron syntax schedules the job. The <code>H</code> (Hash) is a Jenkins-specific feature that spreads load. Instead of exactly midnight (0 0), 'H 0' tells Jenkins to run it sometime between 12:00 AM and 12:59 AM, preventing server spikes if you schedule 50 jobs this way.</li></ul>" 
    },
    { 
      q: "Scenario: Mask passwords or API keys in console output.", 
      a: "<strong>Detailed Solution:</strong> Leaking secrets in logs is a massive security risk.<br><ul><li><strong>Solution:</strong> Never define secrets as standard environment variables. Use the <code>withCredentials</code> block provided by the Credentials Binding Plugin.</li><li><strong>Example:</strong> <code>withCredentials([string(credentialsId: 'my-api-key', variable: 'API_KEY')]) { sh 'curl -H \"Auth: $API_KEY\" ...' }</code>. Jenkins detects the secret value and automatically replaces it with `****` in the console logs.</li></ul>" 
    },
    { 
      q: "Scenario: Trigger Job B automatically when Job A completes successfully.", 
      a: "<strong>Detailed Solution:</strong> Chaining jobs is useful for separating build and deployment logic.<br><ul><li><strong>Method 1 (Downstream Trigger):</strong> In the Jenkinsfile for Job A, add a step in the post-success block: <code>build job: 'Job_B', wait: false</code>.</li><li><strong>Method 2 (Upstream Trigger):</strong> In the UI configuration for Job B, check 'Build after other projects are built' and enter 'Job A'. This separates the logic entirely.</li></ul>" 
    },
    { 
      q: "Scenario: Allocate an agent with specific hardware (like a GPU) for a machine learning job.", 
      a: "<strong>Detailed Solution:</strong> Use node labels to route jobs to specific hardware.<br><ul><li><strong>Setup:</strong> Go to the configuration page of the agent possessing the GPU. Add the label 'gpu-node' to it.</li><li><strong>Execution:</strong> In your Jenkinsfile, set <code>agent { label 'gpu-node' }</code>. The Jenkins controller will queue the job until that specific node becomes available, ignoring all standard CPU-only nodes.</li></ul>" 
    },
    { 
      q: "Scenario: Archive a test report generated during the build.", 
      a: "<strong>Detailed Solution:</strong> Use the archive artifact step to save files to the controller.<br><ul><li><strong>Code:</strong> In the post-success block, run <code>archiveArtifacts artifacts: 'target/site/jacoco/index.html', allowEmptyArchive: false</code>.</li><li><strong>Result:</strong> Users can navigate to the build page in the UI and click the artifact link to view the HTML report directly in their browser.</li></ul>" 
    },
    { 
      q: "Scenario: Handle a timeout to prevent jobs from hanging forever.", 
      a: "<strong>Detailed Solution:</strong> A hung process (like a script waiting for user input) will consume an executor indefinitely, eventually halting all Jenkins operations.<br><ul><li><strong>Solution:</strong> Use the options block: <code>options { timeout(time: 1, unit: 'HOURS') }</code>.</li><li><strong>Result:</strong> If the pipeline takes longer than 60 minutes, Jenkins will forcibly abort it, free up the executor, and mark the build as failed.</li></ul>" 
    },
    { 
      q: "Scenario: Fetch code from a private Git repository securely.", 
      a: "<strong>Detailed Solution:</strong> Jenkins needs authentication to clone private repos.<br><ul><li><strong>Setup:</strong> Generate an SSH keypair. Add the public key to GitHub as a Deploy Key. Add the private key to Jenkins Credentials.</li><li><strong>Code:</strong> Use the checkout step referencing the credential ID: <code>checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[credentialsId: 'my-github-ssh-key', url: 'git@github.com:user/repo.git']]])</code>.</li></ul>" 
    },
    { 
      q: "Scenario: Skip a deployment stage based on the branch name.", 
      a: "<strong>Detailed Solution:</strong> Use conditional execution directives.<br><ul><li><strong>Implementation:</strong> Inside the stage block, add a <code>when</code> directive.</li><li><strong>Code:</strong> <code>stage('Deploy') { when { branch 'main' } steps { sh 'deploy.sh' } }</code>.</li><li><strong>Result:</strong> If the pipeline is running for a feature branch, Jenkins evaluates the <code>when</code> condition, sees it is false, and instantly skips the entire Deploy stage, marking it as skipped in the UI.</li></ul>" 
    },
    { 
      q: "Scenario: Keep the workspace for debugging if a job fails, but clean it if successful.", 
      a: "<strong>Detailed Solution:</strong> You need conditional cleanup logic in the post block.<br><ul><li><strong>Code:</strong> <br><code>post { success { cleanWs() } failure { echo 'Workspace kept for debugging.' } }</code></li><li><strong>Result:</strong> If the build passes, the workspace is wiped to save disk space. If it fails, the files remain on the agent so a developer can SSH into the agent and inspect the exact state of the files that caused the failure.</li></ul>" 
    }
  ],
  "Advance Scenario": [
    { 
      q: "Scenario: Dynamically provision EC2 agents on demand to save money.", 
      a: "<strong>Detailed Solution:</strong> Static Jenkins agents waste money when idle. You need dynamic infrastructure.<br><ul><li><strong>Setup:</strong> Install the Amazon EC2 Plugin. Provide Jenkins with AWS IAM credentials via an IAM Role attached to the master.</li><li><strong>Configuration:</strong> Add an EC2 cloud in Jenkins. Define an AMI ID, select an Instance Type (e.g., t3.medium), and map it to a label ('linux-build'). Set the 'Idle termination time' to 30 mins.</li><li><strong>Execution:</strong> When a pipeline requests the 'linux-build' label, Jenkins makes an API call to AWS, spins up the EC2 instance, runs the job, and automatically terminates it in AWS if it remains idle for 30 minutes.</li></ul>" 
    },
    { 
      q: "Scenario: Avoid duplicating deployment logic across 100 pipelines.", 
      a: "<strong>Detailed Solution:</strong> Copy-pasting code across 100 Jenkinsfiles creates an unmaintainable nightmare. Abstract the logic.<br><ul><li><strong>Solution:</strong> Implement a <strong>Jenkins Shared Library</strong>.</li><li><strong>How it works:</strong> Create a separate Git repository. Inside a <code>vars/</code> folder, create a file <code>deployToAWS.groovy</code> containing your complex logic.</li><li><strong>Usage:</strong> Configure Jenkins to load this library globally. In your 100 Jenkinsfiles, write <code>@Library('my-shared-lib') _</code> at the top, and then simply call <code>deployToAWS()</code>. Updating the logic in the shared repo updates all 100 pipelines instantly.</li></ul>" 
    },
    { 
      q: "Scenario: The Jenkins controller crashes completely and the EBS volume is corrupt. How do you recover?", 
      a: "<strong>Detailed Solution:</strong> Disaster recovery requires pre-planning using Infrastructure as Code principles.<br><ul><li><strong>Phase 1 (System Settings):</strong> Use <strong>JCasC</strong> (Jenkins Configuration as Code). All Jenkins system settings, credentials, and cloud configs should be defined in a YAML file stored in Git. When spinning up a new master, point it to this YAML to instantly restore the server configuration.</li><li><strong>Phase 2 (Jobs & History):</strong> Jenkins stores all jobs in the <code>$JENKINS_HOME/jobs</code> directory. You must have an automated cron job backing this directory up to an S3 bucket nightly. Restore this folder to the new master, run 'Reload Configuration from Disk', and you are back online.</li></ul>" 
    },
    { 
      q: "Scenario: Fail pipeline if XML test failures exceed a threshold of 5.", 
      a: "<strong>Detailed Solution:</strong> You must programmatically parse test output within the pipeline.<br><ul><li><strong>Implementation:</strong> Wrap Groovy logic in a <code>script {}</code> block.</li><li><strong>Code Logic:</strong> Read the XML file using <code>readFile('test-results.xml')</code>. Parse it using Groovy's <code>XmlSlurper()</code>. Extract the total failure count.</li><li><strong>Condition:</strong> <code>if (failureCount > 5) { error(\"Too many failures: ${failureCount}\") }</code>. The <code>error()</code> step forcefully halts pipeline execution and marks the build as FAILED.</li></ul>" 
    },
    { 
      q: "Scenario: Prevent concurrent deployments to the exact same production environment.", 
      a: "<strong>Detailed Solution:</strong> If two pipelines deploy to production simultaneously, they will corrupt the environment or overwrite each other.<br><ul><li><strong>Solution 1 (Pipeline Level):</strong> Use <code>options { disableConcurrentBuilds() }</code>. This prevents two instances of the exact same pipeline from running at once.</li><li><strong>Solution 2 (Resource Level - Preferred):</strong> Use the <strong>Lockable Resources Plugin</strong>. Create a logical resource named 'prod-env'. Wrap the deployment stage in a lock: <code>lock('prod-env') { sh 'deploy.sh' }</code>. Even if completely different pipelines try to deploy, they must wait until the lock is released.</li></ul>" 
    },
    { 
      q: "Scenario: Execute a pipeline across multiple OS agents and browser types dynamically.", 
      a: "<strong>Detailed Solution:</strong> Manually writing parallel branches for a massive cross-compatibility matrix is tedious. Use the Matrix directive.<br><ul><li><strong>Implementation:</strong> Declarative pipelines support a <code>matrix {}</code> block. Define your axes: one axis for OS (macOS, Windows, Linux) and one for Browser (Chrome, Firefox, Safari).</li><li><strong>Execution:</strong> Jenkins will automatically multiply the axes (3 OS x 3 Browsers = 9 combinations) and dynamically spawn 9 parallel stages, passing the variables into each shell script step.</li></ul>" 
    },
    { 
      q: "Scenario: Safely migrate 500 jobs from an old Jenkins instance to a new one.", 
      a: "<strong>Detailed Solution:</strong> Do not recreate them manually.<br><ul><li><strong>Method 1 (UI):</strong> Install the 'Job Import Plugin' on the new instance, provide credentials for the old instance, and click import.</li><li><strong>Method 2 (Filesystem):</strong> SSH into the old master. Compress the <code>/var/lib/jenkins/jobs/</code> directory into a tarball. SCP the tarball to the new master, extract it into the jobs directory, and click 'Reload Configuration from Disk' in the Jenkins UI.</li></ul>" 
    },
    { 
      q: "Scenario: Perform a zero-downtime Blue/Green deployment via Jenkins.", 
      a: "<strong>Detailed Solution:</strong> The pipeline must orchestrate the deployment and validation before switching traffic.<br><ul><li><strong>Step 1 (Deploy):</strong> Jenkins executes AWS CLI/Terraform to deploy the new code to the 'Green' (inactive) environment.</li><li><strong>Step 2 (Validate):</strong> Jenkins runs integration tests exclusively against the Green environment's private URL.</li><li><strong>Step 3 (Switch):</strong> If tests pass, Jenkins executes a script to update the Route53 DNS record or the ALB target group weight to send 100% of live traffic to the Green environment. The old Blue environment is either terminated or kept as a rollback target.</li></ul>" 
    },
    { 
      q: "Scenario: You are hitting API rate limits when Jenkins constantly polls GitHub for changes.", 
      a: "<strong>Detailed Solution:</strong> Polling (e.g., <code>H/2 * * * *</code>) asks GitHub \"Any changes?\" thousands of times a day, burning API limits.<br><ul><li><strong>Solution:</strong> Switch entirely to a push-based model using GitHub Webhooks.</li><li><strong>Implementation:</strong> Remove the polling trigger. Configure GitHub to send a webhook payload to Jenkins ONLY when a push or PR occurs. This drops API calls to near zero and provides instant build triggers rather than waiting for the next polling cycle.</li></ul>" 
    },
    { 
      q: "Scenario: Analyze code coverage and fail the build if it drops below 80%.", 
      a: "<strong>Detailed Solution:</strong> Enforce code quality gates directly in the CI pipeline.<br><ul><li><strong>Setup:</strong> Ensure the build tool (e.g., Maven/Jacoco) generates a coverage XML report. Install the Jacoco Jenkins Plugin.</li><li><strong>Execution:</strong> Add a post-build step in Jenkins: <code>jacoco execPattern: '**/**.exec', lineCoverageTargets: '80, 0, 0'</code>.</li><li><strong>Result:</strong> Jenkins parses the report. If the line coverage is 79%, Jenkins automatically changes the build status from SUCCESS to UNSTABLE or FAILURE, preventing the code from moving to deployment.</li></ul>" 
    }
  ]
};

# Jenkins Day 3 - Trainer Guide: Advanced Pipeline Concepts

## Objective
By the end of this session, students will understand how to control Jenkins pipeline execution using advanced concepts such as agents, environment variables, options, parameters, triggers, parallel execution, post-build actions, and conditional stages.

## 1. Agent Directives
**Concept:** Explain where and how the pipeline or specific stages execute.
- **`any`**: Runs on any available agent.
- **`none`**: Defined at the top level to ensure each stage explicitly specifies its own agent (useful for distributing workloads).
- **`label`**: Schedules the job on a specific agent with a matching label (e.g., `salve01`).
- **`docker`**: Creates a container from an image (e.g., `ubuntu:latest`) and runs the steps inside it.

*Trainer Tip:* Emphasize the importance of `agent none` for complex CI/CD setups where the build might happen on Linux, but testing on Windows.

## 2. Environment Variables & Parameters
**Concept:** Reusing values and accepting user input.
- **`environment`**: Define key-value pairs (e.g., `test = "xy"`) accessible in all steps.
- **`parameters`**: Allow parameterized builds (e.g., `string`). Explain how they can be referenced just like environment variables.

## 3. Pipeline Options
**Concept:** Configuring job-level behaviors.
- **`retry`**: Retry the whole pipeline or a specific step if it fails.
- **`buildDiscarder(logRotator(...))`**: Clean up old builds to save disk space.
- **`timeout`**: Prevent jobs from hanging infinitely.
- **`timestamps`**: Add timestamps to the console output.

## 4. Triggers & Downstream Jobs
**Concept:** Automating job execution.
- **`cron('* * * * *')`**: Time-based scheduling.
- **`pollSCM('* * * * *')`**: Polls Git/SVN for changes and triggers if there's a new commit.
- **`build('projectA/test')`**: Trigger another Jenkins job from within a pipeline.

## 5. Parallel Execution
**Concept:** Speeding up the pipeline by running stages concurrently.
- Show the syntax of the `parallel` block.
- Explain that stages inside a parallel block run simultaneously to reduce overall execution time.

## 6. Directory Context & Error Handling
**Concept:** Granular control over the workspace and avoiding pipeline failure on non-critical errors.
- **`dir('folder')`**: Switch the workspace context to a specific folder before running commands.
- **`try / catch`**: Groovy-based exception handling to catch script failures (e.g., "folder already exists") without failing the entire pipeline. Note that this needs to be inside a `script {}` block.

## 7. Post-Build Actions
**Concept:** Running steps based on the pipeline's outcome.
- Explain conditions: `always`, `changed`, `fixed`, `aborted`, `failure`, `success`, `unstable`, `cleanup`.
- *Trainer Tip:* Post actions are usually used for notifications (Slack/Email) or cleanup (`cleanWs()`).

## 8. Conditional Execution (`when` block)
**Concept:** Executing stages only if certain criteria are met.
- **`expression`**: Evaluates a Groovy expression (e.g., `env_nonprod == 'uat'`).
- **`anyOf` / `allOf`**: Logical OR/AND operators for combining complex conditions.

## 9. Real-World Example
Walk the students through a complete CI pipeline snippet:
1. Check out code from a Git repository using `git branch: 'main' ...`
2. Build the project using `sh 'mvn clean install'`

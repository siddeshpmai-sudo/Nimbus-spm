# master slave configuration

## 🧰 Prerequisites

1. Jenkins server
2. Slave server with Java installation

## Procedure

{% stepper %}
{% step %}
### Go to Manage Nodes

Manage Jenkins --> Manage Nodes and Clouds --> New Node
{% endstep %}

{% step %}
### Add node

Add the node name as Permanent Agent.
{% endstep %}

{% step %}
### Provide agent details

Provide the information below to add the Jenkins agent:

* **Name:** uniquely identifies an agent within this Jenkins installation
* **Description:**
* **Number of executors:** 2
* **Remote root directory:** /home/ec2-user/maven-agent
* **Labels:** Labels (or tags) are used to group multiple agents into one logical group.
* **Usage:**
  * Use this node as much as possible
  * Only build jobs with label expressions matching this node
* **Launch method:**
  * Launch agent by connecting it to the master
  * Launch agent via execution of command on the controller
* **Custom WorkDir path:** custom Remoting work directory will be used instead of the Agent Root Directory
* **- Use WebSocket \[x]**
* **Availability:**
  * Keep this agent online as much as possible
  * Bring this agent online according to a schedule
  * Bring this agent online when in demand, and take offline when idle
{% endstep %}

{% step %}
### Start the agent on the slave server

Once you save the above configuration, you will get a command which should be executed on the agent. It contains agent.jar, a secret-file, and a jnlp file.

{% code title="start-agent.sh" %}
```bash
echo "secret_key" > secret-file
java -jar agent.jar -jnlpUrl http://<Jenkins_URL>/computer/abc/jenkins-agent.jnlp -secret @secret-file -workDir "/home/ec2-user"
```
{% endcode %}
{% endstep %}

{% step %}
### Use the agent in a job

Once connected, you can create or edit a job to choose this option in the "Restrict where this project can be run" setting.
{% endstep %}
{% endstepper %}

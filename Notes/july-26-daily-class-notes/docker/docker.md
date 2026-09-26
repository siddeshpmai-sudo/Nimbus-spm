# docker

## Learning objectives

### Explain

Describe what Docker packages and why it solves environment drift.

### Operate

Pull, run, inspect, log, stop, start and remove a container.

### Build

Write a Dockerfile, build an image and run it in a browser.

### Reason

Choose ports, mounts, volumes and networks for a basic app.

## Docker fundamentals

**Simple explanation:** Docker packages an application with what it needs so it runs the same way on another computer. Think of an image as a recipe card and a container as the prepared meal.

**Instructor explanation:** Docker uses operating-system-level isolation. The Docker Engine creates containers from layered images. Containers share the host kernel while keeping processes, filesystems and network settings separated. This produces a portable, reproducible application unit without a full guest operating system.

Docker addresses the “works on my machine” problem: different library versions, runtime versions, operating systems and setup steps. Teams standardize the app environment once, then reuse it in development, testing and delivery.

### Consistency

Same dependencies and configuration across developer laptops, CI and servers.

### Portability

Move an image to another compatible Docker host.

### Isolation

Apps receive separated processes, filesystem views and networks.

### Productivity

New teammates start a known environment quickly.

### Docker containers and virtual machines

| Aspect           | Container                                 | Virtual machine                                         |
| ---------------- | ----------------------------------------- | ------------------------------------------------------- |
| Architecture     | App + dependencies on a container runtime | App + guest OS on a hypervisor                          |
| Operating system | Shares host OS kernel                     | Includes a complete guest OS                            |
| Startup          | Usually seconds or less                   | Usually slower because the OS boots                     |
| Resource use     | Usually lighter                           | Usually heavier                                         |
| Isolation        | Process-level isolation                   | Stronger hardware-virtualized boundary                  |
| Typical use      | Apps, services, repeatable tooling        | Different OS needs, legacy systems, stronger separation |

{% hint style="warning" %}
Docker is not a virtual machine. A container is still isolated, but it normally shares the host kernel. Treat that difference as a design and security consideration.
{% endhint %}

## Why organizations use Docker

### Consistency

A Node app uses the same Node version on every laptop.

### Portability

A tested image moves from CI to staging without manual installs.

### Isolation

A Python tool and a Java tool avoid conflicting libraries.

### Fast development

A new developer starts a database with one command.

### Reproducibility

A bug report includes the exact image tag.

### CI/CD

The pipeline builds and tests an image before release.

### Testing

A test suite starts a short-lived database container.

### Microservices

Frontend, API and worker deploy independently.

### Deployment

The platform runs an approved image on many hosts.

### Scaling

A service runs several identical container instances.

### Rollback

The team redeploys an earlier versioned image.

### Onboarding

A README says `docker compose up` instead of ten installs.

### Standardization

Teams use one base image and patch policy.

## Docker core concepts

**Dockerfile**\
↓ `docker build` ↓\
**Image**\
↓ `docker run` ↓\
**Container**

**Image vs container:** an image is a reusable blueprint or class handout; a container is one working copy. One image can create many containers. Removing a container normally does not remove its image. Because container writable layers are disposable, keep important data in a volume or an external service.

### Docker Engine

The service that builds, runs and manages containers.

### Docker Client

The `docker` command-line tool that sends requests to the Engine.

### Image

A read-only package: app, runtime, libraries and defaults.

### Container

A running or stopped instance made from an image.

### Dockerfile

A recipe that describes how to build an image.

### Registry

A server that stores and distributes images.

### Docker Hub

A popular public registry, used by default in many commands.

### Container port

The port where the app listens inside the container.

### Host port

The port exposed on your computer.

### Port mapping

A bridge such as `8080:80` from host port to container port.

### Bind mount

A host folder made available inside a container.

### Named volume

Docker-managed persistent storage.

### Network

A communication space that lets containers reach one another.

### Lifecycle

Created, running, stopped, restarted, removed.

## Essential Docker commands

Read the command, predict the result, then run it. The command reference doubles as your first troubleshooting checklist.

| Command                           | Does                                             | Example                                                 | Expected result                                      | Watch for                                                            |
| --------------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| `docker version`                  | Shows client and server versions.                | `docker version`                                        | Confirms the CLI can reach Docker.                   | Run it before a class demo.                                          |
| `docker info`                     | Shows Engine settings and resources.             | `docker info`                                           | Reports containers, images, storage driver and more. | Long output is normal.                                               |
| `docker pull`                     | Downloads an image.                              | `docker pull nginx:alpine`                              | Image layers download.                               | Always name a tag when reproducibility matters.                      |
| `docker images / docker image ls` | Lists local images.                              | `docker image ls`                                       | Shows repository, tag, image ID and size.            | These commands are equivalent.                                       |
| `docker run`                      | Creates and starts a container.                  | `docker run -d --name demo-web -p 8080:80 nginx:alpine` | A container starts and prints an ID.                 | Without `-d`, the terminal stays attached.                           |
| `docker ps`                       | Lists running containers.                        | `docker ps`                                             | Shows names, status and port mappings.               | Stopped containers do not appear here.                               |
| `docker ps -a`                    | Lists all containers.                            | `docker ps -a`                                          | Shows running and stopped containers.                | Use it when a name already exists.                                   |
| `docker logs`                     | Reads a container’s standard output/error.       | `docker logs demo-web`                                  | Shows app startup and request logs.                  | Use `-f` to follow new logs.                                         |
| `docker exec`                     | Runs a command in an existing running container. | `docker exec -it demo-web sh`                           | Opens an interactive shell.                          | The container must be running; Alpine commonly has `sh`, not `bash`. |
| `docker inspect`                  | Returns detailed JSON metadata.                  | `docker inspect demo-web`                               | Ports, mounts, network and state appear.             | Large output is expected; search it rather than reading every line.  |
| `docker stop`                     | Sends a graceful stop signal.                    | `docker stop demo-web`                                  | Container moves to stopped state.                    | Stopping does not remove it.                                         |
| `docker start`                    | Starts an existing stopped container.            | `docker start demo-web`                                 | Same container and settings return.                  | You cannot change ports on `start`.                                  |
| `docker restart`                  | Stops then starts a container.                   | `docker restart demo-web`                               | Container restarts.                                  | Use when the existing configuration is right.                        |
| `docker rm`                       | Removes a stopped container.                     | `docker rm demo-web`                                    | Container disappears from `docker ps -a`.            | Stop it first, or use `-f` deliberately.                             |
| `docker rmi`                      | Removes an unused image.                         | `docker rmi my-demo-web:1.0`                            | Image is removed.                                    | Containers that use it must be removed first.                        |
| `docker build`                    | Builds an image from a Dockerfile.               | `docker build -t my-demo-web:1.0 .`                     | A tagged local image appears.                        | The final `.` sends the build context.                               |
| `docker tag`                      | Adds another name/tag to an image.               | `docker tag my-demo-web:1.0 my-demo-web:latest`         | A second tag points to the same image.               | Tags are labels, not copies.                                         |
| `docker volume`                   | Manages Docker volumes.                          | `docker volume create demo-data`                        | A named persistent store is created.                 | Volumes outlive containers until removed.                            |
| `docker network`                  | Manages networks.                                | `docker network create demo-network`                    | A network is created.                                | Use custom networks for app stacks.                                  |

## &#x20;live demo: Nginx + HTML

{% hint style="info" %}
**Explain:** A developer has a simple website. Instead of installing and configuring Nginx on every machine, Docker runs Nginx in a known environment.

**Demonstrate:** Keep a browser and terminal side by side.

**Ask:** Where does Nginx run in this demo?

**Expected answer:** Inside a Docker container.

**Key takeaway:** The host only needs Docker; Nginx lives in the container.
{% endhint %}

```bash
docker version
docker info
```

Students should see a Client and Server version. `docker info` shows the Engine is running plus its container/image counts.

{% stepper %}
{% step %}
### Download the image

```bash
docker pull nginx:alpine
docker images
```

`nginx` is the repository name. `alpine` is a small Linux-based tag. Docker pulls it from a registry, commonly Docker Hub.
{% endstep %}

{% step %}
### Run the website

```bash
docker run -d --name demo-web -p 8080:80 nginx:alpine
docker ps
```

**Command anatomy:** `docker` = client; `run` = create and start; `-d` = detached/background; `--name demo-web` = memorable container name; `-p` = publish a port; `nginx:alpine` = image and tag.

**Host port `8080`** maps to **container port `80`**.

Open `http://localhost:8080`. Your browser reaches port 8080 on the host; Docker forwards it to Nginx listening on port 80 in the container.
{% endstep %}

{% step %}
### Inspect and enter

```bash
docker ps
docker ps -a
docker logs demo-web
docker inspect demo-web
docker exec -it demo-web sh
ls /usr/share/nginx/html
exit
```

`docker ps` shows only running containers; `docker ps -a` also shows stopped ones. `inspect` contains state, IP/network, mounts, port mapping and configuration. `exec` runs a command in a running container. `-it` supplies interactive input and a terminal. Alpine uses `sh`. This is not SSH: Docker asks the Engine to create a process in the container. Do not manage containers like long-lived VMs.
{% endstep %}

{% step %}
### Customize with a bind mount

```bash
mkdir docker-demo-site
# Create docker-demo-site/index.html with the content below
docker stop demo-web
docker rm demo-web
docker run -d --name demo-web -p 8080:80 \
  --mount type=bind,src="$PWD/docker-demo-site",dst=/usr/share/nginx/html,readonly \
  nginx:alpine
```

`docker-demo-site/index.html`

```html
<h1>Hello from my Docker demo</h1>
<p>This page is being served by Nginx inside a Docker container.</p>
```

A bind mount connects a host path to a container path. Edit the host file, refresh the browser and Nginx immediately serves the new content. This is useful in development. On Windows PowerShell, path syntax may differ; use its current-directory path convention.
{% endstep %}

{% step %}
### Build an image you own

`Dockerfile`

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

```bash
cd docker-demo-site
docker build -t my-demo-web:1.0 .
docker run -d --name custom-web -p 8081:80 my-demo-web:1.0
docker ps
```

`FROM` selects a base image. `COPY` adds a file from the build context. In `docker build -t my-demo-web:1.0 .`, `-t` sets name and tag, and the final `.` means “send this current folder as the build context.” Open `http://localhost:8081`.

**index.html**\
↓\
**Dockerfile**\
↓ `docker build` ↓\
**Image**\
↓ `docker run` ↓\
**Container**\
↓\
**Browser**
{% endstep %}
{% endstepper %}

## Container lifecycle and storage

**Created** → **Running** → `docker stop` → **Stopped** → `docker start` → **Running** → `docker rm` → **Removed**

```bash
docker stop custom-web
docker ps
docker ps -a
docker start custom-web
docker logs custom-web
docker stop custom-web
docker rm custom-web
```

Containers have a writable layer that disappears with the container. A **bind mount** uses a chosen host directory. A **named volume** is managed by Docker and survives container removal.

```bash
docker volume create demo-data
docker volume ls
docker volume inspect demo-data
```

### Networks

Containers need networks to communicate. Docker commonly uses a default bridge network. In a custom network, containers can normally resolve each other by container name.

```bash
docker network ls
docker network create demo-network
docker network inspect demo-network
```

## Common beginner problems

<details>

<summary>Port already in use</summary>

Error: `Bind for 0.0.0.0:8080 failed`. Pick another host port, such as `-p 8082:80`, or stop the program/container using 8080.

</details>

<details>

<summary>Name already exists</summary>

Run `docker ps -a`. Then remove or reuse the named stopped container: `docker rm CONTAINER`.

</details>

<details>

<summary>Container exits immediately</summary>

Run `docker ps -a`, then `docker logs CONTAINER`. The main process ended or failed.

</details>

<details>

<summary>App cannot be reached</summary>

Check `docker ps` for status and ports, then `docker logs` and `docker inspect`.

</details>

<details>

<summary>Image changes do not appear</summary>

A host edit appears only through a bind mount. For a copied image file, rebuild the image and recreate the container.

</details>

<details>

<summary>Cleanup safely</summary>

Stop then remove the specific demo container. Avoid broad cleanup commands during a shared classroom environment.

</details>

## Docker in real-world DevOps

### CI/CD flow

**Developer**\
↓ Git push ↓\
**CI pipeline**\
↓\
**Docker build**\
↓\
**Tests & scan**\
↓\
**Registry**\
↓\
**Staging / production**

### Build once, deploy the same image

CI builds one versioned image, tests it, pushes it to a registry and deploys that exact tag.

### Microservices

Frontend, backend API, worker and database can use separate images, release cycles and scale counts.

### Onboarding and tests

Docker starts consistent local dependencies and short-lived test environments.

### Rollbacks and scaling

Deploy a prior versioned image to roll back; run more identical containers to handle demand.

## Student exercise: 10–15 minutes

{% stepper %}
{% step %}
Pull `nginx:alpine`.
{% endstep %}

{% step %}
Run it as `student-web` and map host port 8080 to container port 80.
{% endstep %}

{% step %}
Open the browser and see the Nginx welcome page.
{% endstep %}

{% step %}
Check status and logs.
{% endstep %}

{% step %}
Stop it, start it again, then remove it.
{% endstep %}
{% endstepper %}

```bash
docker pull nginx:alpine
docker run -d --name student-web -p 8080:80 nginx:alpine
docker ps
docker logs student-web
docker stop student-web
docker start student-web
docker stop student-web
docker rm student-web
```

### Challenge: build your own page

Create an `index.html` and the Dockerfile shown in the demo. Then:

```bash
docker build -t student-site:1.0 .
docker run -d --name student-site -p 8081:80 student-site:1.0
```

Success check: `http://localhost:8081` displays your own HTML. If it does not, inspect the build output, then use `docker logs student-site` and `docker ps`.

## One-page command cheat sheet

### Discover

```bash
docker version
docker info
docker image ls
docker ps -a
```

### Run and observe

```bash
docker pull IMAGE
docker run -d --name NAME -p HOST:CONTAINER IMAGE
docker logs NAME
docker exec -it NAME sh
```

### Lifecycle

```bash
docker stop NAME
docker start NAME
docker restart NAME
docker rm NAME
```

### Build and data

```bash
docker build -t NAME:TAG .
docker tag SOURCE TARGET
docker volume ls
docker network ls
```

**Final mental model:** Pull an image. Run a container. Publish a port. Observe with `ps` and `logs`. Package your own app with a Dockerfile, build it, then run it.

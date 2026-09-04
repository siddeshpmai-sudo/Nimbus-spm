# Apache Tomcat Directory Structure (DevOps Training Guide)

> [!NOTE]
> For Tomcat training, it's crucial to teach the directory structure from a **DevOps/production troubleshooting perspective**. Students should understand what each directory contains, who uses it, what changes there, and what happens when something goes wrong.

## Overview
A typical Tomcat installation looks like:
```text
/apache-tomcat/
│
├── bin/
├── conf/
├── lib/
├── logs/
├── temp/
├── webapps/
├── work/
└── webapps.dist/     (Ubuntu/Debian installations may have this)
```

The most important directories for DevOps engineers are: `bin/`, `conf/`, `webapps/`, `logs/`, `lib/`, `work/`, and `temp/`.

---

## 1. CATALINA_HOME vs CATALINA_BASE
This is one of the most important concepts to teach.

- **`CATALINA_HOME`**: Points to the Tomcat installation directory (e.g., `/opt/tomcat`). It contains Tomcat's binaries and core files.
- **`CATALINA_BASE`**: Represents the runtime/instance directory (e.g., `/opt/tomcat-instance`). It contains `conf/`, `logs/`, `webapps/`, `work/`, and `temp/`.

**Why are both useful?**
Suppose you want to run two Tomcat instances using the same Tomcat installation. This is useful when running multiple applications or environments on the same server.

```mermaid
graph TD
    A[Tomcat installation] --> B[CATALINA_HOME]
    A --> C[Instance 1]
    C --> D[CATALINA_BASE]
    A --> E[Instance 2]
    E --> F[CATALINA_BASE]
```

> [!TIP]
> **For beginners, simply remember:**
> - `CATALINA_HOME` = Tomcat software
> - `CATALINA_BASE` = Tomcat runtime instance

---

## 2. `bin/` — Tomcat Executables and Startup Scripts
This is the directory students will frequently use while managing Tomcat manually.

### Important files:
- **`startup.sh`**: Starts Tomcat in the background. (e.g., `./startup.sh` or `$CATALINA_HOME/bin/startup.sh`)
- **`shutdown.sh`**: Stops Tomcat.
- **`catalina.sh`**: The most important script. `startup.sh` and `shutdown.sh` internally use this.
  - `./catalina.sh start` -> Starts in background
  - `./catalina.sh run` -> Starts in foreground (excellent for troubleshooting startup errors directly in the terminal)
- **`version.sh`**: Shows Tomcat and Java information.

---

## 3. `conf/` — Configuration Directory
This is probably the **#1 directory** to focus on during Tomcat training.

### `server.xml` — Critical Configuration
Location: `$CATALINA_HOME/conf/server.xml`

This is Tomcat's primary server configuration file.
**Hierarchy:**
```mermaid
graph TD
    A[Server] --> B[Service]
    B --> C[Connector]
    B --> D[Engine]
    D --> E[Host]
    E --> F[Context]
```

**Tomcat Port (Connector):**
Students frequently need to find the Tomcat port.
```xml
<Connector port="8080"
           protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
```
- `8080` → HTTP
- `8443` → HTTPS redirect/secure connector

> [!TIP]
> If someone asks: *"Tomcat is running, but I cannot access the application."*
> Have them check the port: `grep -n "Connector" conf/server.xml`
> Then check if it's listening: `ss -lntp | grep 8080`

**HTTPS Configuration Example:**
```xml
<Connector
    port="8443"
    protocol="org.apache.coyote.http11.Http11NioProtocol"
    SSLEnabled="true"
    scheme="https"
    secure="true"
    keystoreFile="/opt/tomcat/conf/keystore.jks"
    keystorePass="changeit" />
```
> [!NOTE]
> In production, TLS termination is often done at the load balancer (like Nginx) rather than directly in Tomcat.

### `web.xml`
Location: `conf/web.xml`
Global deployment descriptor. Defines default web application behavior.
- `conf/web.xml` -> Global/default configuration
- `WEB-INF/web.xml` -> Application-specific configuration

### `context.xml`
Location: `conf/context.xml`
Contains default Tomcat Context configuration. A Context represents a deployed web application.

### `tomcat-users.xml`
Location: `conf/tomcat-users.xml`
Defines Tomcat users and roles (e.g., for Tomcat Manager).
> [!WARNING]
> **Important security point for students:** Never teach students to use `password="password"` in production, and explain that exposing Tomcat Manager directly to the internet is a severe security risk.

### `catalina.properties` & `logging.properties`
- **`catalina.properties`**: Controls class-loading behavior. Important for `ClassNotFoundException`.
- **`logging.properties`**: Controls Tomcat's Java logging configuration.

---

## 4. `webapps/` — Application Deployment
The second most important directory where applications are deployed (e.g., `ROOT/`, `manager/`, `myapp/`).

### WAR File Deployment
Copy a `.war` file to `webapps/`:
```bash
cp myapp.war /opt/tomcat/webapps/
```
Tomcat automatically extracts it into a folder (`myapp/`). The application URL normally becomes `http://server-ip:8080/myapp`.

### The `ROOT/` Application
`http://server-ip:8080/` points to the `ROOT` application, whereas `http://server-ip:8080/myapp` points to `myapp/`.

### `WEB-INF` Directory
Inside an application (e.g., `myapp/WEB-INF/`), this folder is special. A client cannot directly access resources under it over HTTP.
- **`WEB-INF/classes/`**: Compiled Java classes (`.class`). Important for troubleshooting `ClassNotFoundException`.
- **`WEB-INF/lib/`**: Application-specific JAR files. Important for dependency conflicts.

---

## 5. `logs/` — Production Troubleshooting
The most important directory for DevOps during production issues.

- **`catalina.out`**: First place to check for errors (e.g., `OutOfMemoryError`, `Address already in use`). Use `tail -f logs/catalina.out`.
- **Access Logs** (e.g., `localhost_access_log.txt`): Records HTTP requests (e.g., `GET /myapp HTTP/1.1 200`).

---

## 6. `temp/`, `work/`, and `lib/`
- **`temp/`**: Temporary processing files.
- **`work/`**: Generated runtime working files (e.g., compiled JSPs). If a JSP behaves strangely, this folder is relevant.
- **`lib/`**: Shared Tomcat libraries.
  - `$CATALINA_HOME/lib` -> Tomcat-wide libraries
  - `webapps/myapp/WEB-INF/lib` -> Application-specific libraries

---

## 7. The 5 Paths Students Must Remember

1. **`bin/`**: *How do I start/stop Tomcat?* (`./startup.sh`)
2. **`conf/server.xml`**: *Where is the port configured?* (`grep -n "Connector" conf/server.xml`)
3. **`webapps/`**: *Where is my app deployed?* (`ls -lh webapps/`)
4. **`logs/`**: *Why is my app failing?* (`tail -f logs/catalina.out`)
5. **`work/`**: *Where are compiled JSPs?* (`ls -R work/`)

---

## 8. Production Troubleshooting Flow (Classroom Exercise)
Scenario: *"My application is deployed, but I cannot access it."* (Don't immediately restart Tomcat!)

1. **Check process**: `ps -ef | grep tomcat`
2. **Check port**: `ss -lntp | grep 8080`
3. **Check server.xml**: `grep -n "Connector" conf/server.xml`
4. **Check deployment**: `ls -lh webapps/`
5. **Check logs**: `tail -100 logs/catalina.out`
6. **Test locally**: `curl http://localhost:8080/myapp` (Helps separate a Tomcat problem from a Network/LB problem)

---

## 9. Simple Mental Model

```mermaid
graph TD
    A[TOMCAT] --> B[bin<br/>Manage Tomcat]
    A --> C[conf<br/>Configure Tomcat]
    A --> D[webapps<br/>Deploy Applications]
    A --> E[logs<br/>Troubleshoot]
    A --> F[lib<br/>Libraries]
    A --> G[work<br/>Runtime/Generated Files]
    A --> H[temp<br/>Temporary Files]
```

> [!TIP]
> For a DevOps training session, spend the most time on `bin/`, `conf/server.xml`, `webapps/`, `WEB-INF/`, and `logs/`—these are the paths students will repeatedly use in deployment, troubleshooting, and production support.

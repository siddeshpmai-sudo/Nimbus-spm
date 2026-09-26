# Tomcat Class Notes

## 1. What Is a Web Server?

A web server is software and hardware that uses HTTP (Hypertext Transfer Protocol) and other protocols to respond to client requests made over the World Wide Web. Its main job is to display website content through storing, processing, and delivering webpages to users.

* Examples: Apache HTTP Server, Nginx, Microsoft IIS.

## 2. Use Case of a Web Server

* **Hosting Websites:** Serving static content like HTML, CSS, and images to web browsers.
* **Reverse Proxy / Load Balancing:** Distributing traffic across multiple backend servers (like application servers).
* **Security:** Handling SSL/TLS encryption (HTTPS).

## 3. Tomcat Basics

### What Is Tomcat?

Apache Tomcat is an open-source implementation of the Java Servlet, JavaServer Pages (JSP), Java Expression Language, and Java WebSocket technologies. It is an **Application Server** (specifically a Servlet Container) that provides a "pure Java" HTTP web server environment in which Java code can run.

### Why Tomcat?

* **Lightweight & Fast:** Unlike heavy enterprise servers (like WebLogic or JBoss), Tomcat is lightweight and focuses purely on web applications (Servlets/JSP).
* **Open Source:** Free and widely supported by the community.
* **Industry Standard:** It is the default embedded server for many modern frameworks like Spring Boot.

## 4. EAR, WAR, JAR — Explanation

These are all Java archive formats (which are essentially ZIP files) used to package Java applications, but they serve different purposes:

* **JAR (Java ARchive):**
  * **Contents:** Contains compiled Java classes, metadata, and resources.
  * **Use Case:** Reusable libraries, utility code, or standalone Java applications (e.g., a Spring Boot executable JAR).
* **WAR (Web Application ARchive):**
  * **Contents:** Contains web-related files (HTML, CSS, JS), JSPs, Servlets, and dependent JARs in a specific directory structure (`WEB-INF/`).
  * **Use Case:** Web applications that are meant to be deployed to a web container like Tomcat.
* **EAR (Enterprise Application ARchive):**
  * **Contents:** Contains multiple WARs, JARs, and EJB (Enterprise JavaBeans) modules.
  * **Use Case:** Complex, full-scale enterprise applications deployed on heavy application servers like WebSphere or WildFly (Tomcat natively does not support EARs without extra plugins).

## 5. Deployment to Tomcat

Deploying an application to Tomcat is straightforward. You take your packaged `.war` file and place it into Tomcat's `webapps` directory.

{% stepper %}
{% step %}
### Manual Deployment

Copy the `.war` file to `/opt/tomcat/webapps/`.

Tomcat will automatically extract (explode) the WAR file and start serving it.
{% endstep %}

{% step %}
### Manager App Deployment

Upload the WAR file via Tomcat's Web GUI (Manager app).
{% endstep %}

{% step %}
### Automated CI/CD Deployment

Use Jenkins to build the WAR and securely copy (`scp`) it to the Tomcat server.
{% endstep %}
{% endstepper %}

***

## Reference Materials for Students

* **Maven WebApp Code Repo:** `https://github.com/nimbuswiztech/maven_webapp.git`

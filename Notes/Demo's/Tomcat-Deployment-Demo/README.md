# Nimbus Demo Web Application

A complete Maven WAR project used to demonstrate Jenkins CI/CD deployment to Apache Tomcat.
Built for Nimbus DevOps Training.

## Project Structure
```
Tomcat-Deployment-Demo/
├── Jenkinsfile                              ← The Jenkins CI/CD Pipeline
├── pom.xml                                 ← Maven build configuration
├── README.md
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/nimbus/demo/
    │   │       └── GreetingService.java     ← Sample Java class
    │   └── webapp/
    │       ├── index.jsp                   ← The web page served by Tomcat
    │       └── WEB-INF/
    │           └── web.xml                 ← Web App Deployment Descriptor
    └── test/
        └── java/
            └── com/nimbus/demo/
                └── GreetingServiceTest.java ← JUnit Unit Test
```

## How to Build Locally
```bash
# Build and package into a WAR file
mvn clean package

# The WAR file is created at:
# target/nimbus-webapp.war
```

## How to Deploy Manually
```bash
# Copy the WAR file to Tomcat's webapps directory
sudo cp target/nimbus-webapp.war /opt/tomcat/webapps/

# Tomcat will auto-deploy it. Access at:
# http://<YOUR_SERVER_IP>:8080/nimbus-webapp
```

## Jenkins Pipeline Stages
1. **Checkout Code** — Clones this repository from GitHub.
2. **Unit Test** — Runs `mvn test` to validate the Java code.
3. **Build WAR** — Runs `mvn clean package` to produce `nimbus-webapp.war`.
4. **Approval** — A manual gate requiring human sign-off before deploying.
5. **Deploy to Tomcat** — Copies the WAR to the Tomcat server via SSH.

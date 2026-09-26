# Tomcat\_Video\_Notes

> Based on the video, here is a summary of critical Tomcat directory locations and configuration files used during the deployment process.

## Root and Installation Directory

* **`/opt/tomcat`**: Identified as the primary root installation folder where the application resides.

## Configuration Directories and Files (`/opt/tomcat/conf`)

The `/opt/tomcat/conf` directory stores key configuration parameters.

| File / Path               | Purpose                                                                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`server.xml`**          | Used to modify general server configurations, such as changing the default HTTP connector port from `8080` to `8090`.                                                                  |
| **`tomcat-users.xml`**    | Used to configure user accounts, passwords, and security role permissions (e.g., `manager-gui` and `admin-gui`) for accessing management interfaces.                                   |
| **`context.xml`**         | Accessed to comment out or alter access restriction parameters, allowing external entry into specific parts of the manager application area (e.g., bypassing IP manager restrictions). |
| **`web.xml`**             | Used to govern application-level variables and manage overall deployment behavior.                                                                                                     |
| **`Catalina/localhost/`** | Checked inside the configuration structure for application-specific contexts.                                                                                                          |

## Executable Location (`/opt/tomcat/bin`)

* **`/opt/tomcat/bin`**: Houses standard infrastructure management tools. Contains shell scripts (`.sh`) for Linux and batch files (`.bat`) for Windows to control startup and shutdown operations.

## Application and Log Locations

* **`/opt/tomcat/webapps`**: The storage context where all live dynamic content or WAR files are hosted.
* **`/opt/tomcat/webapps/ROOT`**: Holds the source code (like `index.jsp`) that displays the default Apache Tomcat homepage if no other custom application paths are prioritized.
* **`/opt/tomcat/logs`**: The target folder storing server operation error records and status log history.

## Temporary Download Area (`/tmp`)

* **`/tmp`**: Used to host downloaded installation assets temporarily so leftover residual files can be deleted easily without cluttering the ecosystem.

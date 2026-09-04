# DevOps Concepts: Jenkins RBAC, HTTP/HTTPS, & Tomcat

## 1. Jenkins RBAC (Role-Based Access Control)
> [!NOTE]
> **RBAC in Jenkins** allows you to give users or groups only the specific permissions they need based on their role, following the principle of least privilege.

### Implementation Steps
The most common way to implement RBAC is using the **Role-based Authorization Strategy** plugin.

1. **Install Plugin:** Go to Manage Jenkins → Plugins and install `Role-based Authorization Strategy`.
2. **Enable Strategy:** Go to Manage Jenkins → Security → Authorization and select **Role-Based Strategy**.
3. **Create Roles:** Go to Manage Jenkins → Manage and Assign Roles → Manage Roles.
   - **Global roles:** Jenkins-wide permissions (e.g., `admin`, `developer`).
   - **Item roles:** Permissions for specific jobs/folders (e.g., `project-a-developer` with pattern `project-a/.*`).
   - **Agent roles:** Permissions for specific build agents.
4. **Assign Roles:** Map users/groups to the created roles in "Assign Roles".

### Real-Time Example
- **DevOps Team:** Full job management.
- **Developers:** Read, Build, and Cancel permissions **only** for their specific project.
- **QA Team:** Read and Build permissions for testing projects only.
- **Jenkins Admin:** Full Jenkins administration.

> [!WARNING]
> **Important limitation:** Jenkins' internal user database does NOT natively support creating user groups. 
> 
> **Best Practice:** Use an external authentication system like **LDAP / Active Directory**. The external system handles the user groups (e.g., `developers`), and Jenkins maps that group to a Jenkins role using the Role-Based Authorization Strategy.

---

## 2. HTTP vs HTTPS
| Feature | HTTP | HTTPS |
|---|---|---|
| **Full form** | HyperText Transfer Protocol | HyperText Transfer Protocol Secure |
| **Security** | ❌ Not encrypted | ✅ Encrypted |
| **Default port** | 80 | 443 |
| **Encryption** | No | Yes, using TLS |
| **Data protection** | Vulnerable to sniffing | Protected from interception |
| **Certificate** | Not required | SSL/TLS certificate required |

### How HTTPS Works
1. Client connects to server on port `443`.
2. Server presents TLS certificate.
3. Client validates certificate and a TLS handshake occurs.
4. Encryption keys are established.
5. HTTP communication happens *inside* the encrypted TLS connection.

### DevOps Architecture Example
In production, you generally do not expose Jenkins directly via HTTP on port `8080`. Instead:
```mermaid
graph LR
    A[Internet Client] -- "HTTPS (443)" --> B[Load Balancer / Nginx]
    B -- "HTTP (8080)" --> C[Jenkins Server]
```
The public traffic is encrypted with HTTPS, while the reverse proxy/load balancer forwards internal traffic to Jenkins over HTTP.

---

## 3. Tomcat Ports
> [!NOTE]
> Tomcat's default HTTP application port is **8080**.

### Common Tomcat Ports
| Port | Purpose |
|---|---|
| **8080** | HTTP connector — default application traffic |
| **8443** | HTTPS connector — commonly configured for TLS |
| **8005** | Shutdown port |
| **8009** | AJP connector |

### Configuring the Port
The port configuration is located in `$CATALINA_HOME/conf/server.xml`.
```xml
<Connector port="8080"
           protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
```
To change the port (e.g., to 9090), modify the `port="8080"` attribute to `9090`, then restart Tomcat:
```bash
sudo systemctl restart tomcat
```
Check if it's running on the new port:
```bash
ss -lntp | grep 9090
```

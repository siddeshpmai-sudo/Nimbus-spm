# Apache HTTPD Server

## What is Apache HTTPD?
The Apache HTTP Server (commonly referred to as Apache or HTTPD) is a free and open-source cross-platform web server software. It is one of the world's most widely used web server platforms, powering a massive portion of the internet.

## Core Concepts

- **Daemons and Processes**: Apache runs as a background process (`httpd` on RedHat/CentOS, or `apache2` on Ubuntu/Debian). It listens on port 80 (HTTP) and port 443 (HTTPS) for incoming client requests.
- **Modules**: Apache is highly modular. Features like SSL (`mod_ssl`), URL rewriting (`mod_rewrite`), and security headers can be turned on or off dynamically.
- **Document Root**: The directory where your website's files (HTML, CSS, JS) are stored. By default, this is usually `/var/www/html/`.

## Basic Management Commands (Linux)

To manage the Apache service, use systemd commands:

- **Start the server:** `sudo systemctl start httpd` (or `apache2`)
- **Stop the server:** `sudo systemctl stop httpd`
- **Restart the server (drops connections):** `sudo systemctl restart httpd`
- **Reload the server (graceful, keeps connections alive):** `sudo systemctl reload httpd`
- **Check status:** `sudo systemctl status httpd`
- **Enable on boot:** `sudo systemctl enable httpd`

## Configuration Files

- **Main Configuration**: 
  - RedHat/CentOS: `/etc/httpd/conf/httpd.conf`
  - Ubuntu/Debian: `/etc/apache2/apache2.conf`
- **Virtual Hosts**: Configurations for specific websites are usually stored in `/etc/httpd/conf.d/` or `/etc/apache2/sites-available/`.

## Advanced Configuration: Virtual Hosts

Virtual hosts allow you to host **multiple domains** on a single Apache server instance by routing traffic based on the domain name the user requested.

### Example Virtual Host Configuration

```apache
<VirtualHost *:80>
    # The email address of the server administrator
    ServerAdmin webmaster@example.com
    
    # The domain name
    ServerName www.example.com
    ServerAlias example.com
    
    # The directory where the website files are located
    DocumentRoot "/var/www/example.com/public_html"
    
    # Where to log errors and access requests
    ErrorLog "/var/log/httpd/example.com-error_log"
    CustomLog "/var/log/httpd/example.com-access_log" common
    
    # Directory permissions
    <Directory "/var/www/example.com/public_html">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## Security Best Practices
- **Hide Server Version**: Prevent attackers from knowing your Apache version by setting `ServerTokens Prod` and `ServerSignature Off` in the main config.
- **Disable Directory Listing**: If no `index.html` exists, Apache will list all files in a directory. Prevent this by adding `Options -Indexes` in your `<Directory>` block.
- **Configure SSL/TLS**: Always use `mod_ssl` to enable HTTPS for encrypted communication.

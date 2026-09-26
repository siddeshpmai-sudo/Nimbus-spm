# pluggin installation

## Configure Git Plugin on Jenkins

Git is one of the most popular tools for version control. You can pull code from Git repositories using Jenkins if you use the Git/GitHub plugin.

Follow this article in [YouTube](https://www.youtube.com/watch?v=wgfsVmHnAiM)

{% hint style="info" %}
**Prerequisites**

* Jenkins server [**Get Help Here**](https://www.youtube.com/watch?v=M32O4Yv0ANc)
{% endhint %}

{% stepper %}
{% step %}
### Install Git on Jenkins Server

Install git packages on Jenkins server:

{% code title="Install git" %}
```sh
yum install git -y
```
{% endcode %}
{% endstep %}

{% step %}
### Set Up Git on Jenkins Console

* Install Git plugin without restart:
  * `Manage Jenkins` > `Jenkins Plugins` > `available` > `github`
* Configure Git path:
  * `Manage Jenkins` > `Global Tool Configuration` > `git`
{% endstep %}
{% endstepper %}

## Next Steps

* [x] [Configure Users & Groups in Jenkins](https://youtu.be/jZOqcB32dYM)
* [x] [Secure your Jenkins Server](https://youtu.be/19FmJumnkDc)
* [x] [Jenkins Plugin Installation](https://youtu.be/p_PqPBbjaZ4)
* [x] [Jenkins Master-Slave Configuration](https://youtu.be/hwrYURP4O2k)

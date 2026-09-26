# kill signal

| Signal | Name      | Number | Description & Use Case                                                                      |
| ------ | --------- | ------ | ------------------------------------------------------------------------------------------- |
| 1      | `SIGHUP`  | `-1`   | Hang up – often used to **reload config files**. Example: `kill -1 <pid>` for Nginx reload. |
| 2      | `SIGINT`  | `-2`   | Interrupt – same as pressing `Ctrl+C`. Used to gracefully stop foreground processes.        |
| 3      | `SIGQUIT` | `-3`   | Quit and dump core – like `Ctrl+\`, used for debugging.                                     |
| 9      | `SIGKILL` | `-9`   | **Force kill** – immediate termination, no cleanup. Use only when graceful shutdown fails.  |
| 15     | `SIGTERM` | `-15`  | **Default signal** for `kill`. Asks process to terminate **gracefully**.                    |
| 18     | `SIGCONT` | `-18`  | Continue a paused process (resumes from `SIGSTOP`).                                         |
| 19     | `SIGSTOP` | `-19`  | **Pause** the process (like `Ctrl+Z` in terminal). Can’t be ignored.                        |
| 20     | `SIGTSTP` | `-20`  | Terminal stop (`Ctrl+Z`) – suspends the process in foreground.                              |
| 10     | `SIGUSR1` | `-10`  | User-defined signal 1 – applications can handle it for custom purposes.                     |
| 12     | `SIGUSR2` | `-12`  | User-defined signal 2 – also for application-specific behavior.                             |

# Ping Machine

The ping machine does the following:

- it syncs the list of machines to ping, calling the intranet server, _every hour_
- pings a set of machines, _every minute_
- posts a set of machines for which the state has changed: OK (0) -> Warning (1) -> Critical (2), _every minute, if there are state changes_

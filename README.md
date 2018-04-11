# SNCFDD
Simplest Node JS Cloudflare DynDNS client
Using Cloudflare API (https://www.cloudflare.com) and ipify (https://www.ipify.org/)

Updates a Cloudflare record with the IP from which its executed.

## Install
```
git clone https://github.com/belsierre/sncfdd.git
cd sncfdd
npm install
```

## Config
Open client.js with your favourite example and edit the `cf` JSON object with your data.
```
var cf = {
  authKey: '',
  email: '',
  recordDns: '',
  recordId: '',
  zoneId: ''
};
```

## Run
```
node client.js
```
## Schedule
Example for executing it each 15 minutes in Debian:
```
*/15 * * * * node /path/to/client.js
```

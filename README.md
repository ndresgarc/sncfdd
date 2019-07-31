# SNCFDD

~~Simplest~~ Simple Node JS Cloudflare DynDNS client using Cloudflare API (https://www.cloudflare.com) and Ipify (https://www.ipify.org/)

Updates a Cloudflare record with the IP from which its executed.


## Download

You can clone the repository or download the script from:
https://raw.githubusercontent.com/ndresgarc/sncfdd/master/client.js


## Config

Create a file named config.json or copy example.config.json from the repository (https://raw.githubusercontent.com/ndresgarc/sncfdd/master/example.config.json)

```
{
	"cloudflare": {
		"domains": [
			{
				"name": "subdomain.domain.com",
				"type": "A",
				"recordId": "49411e94adb54e45a4c693e4b822973c", // Randomly generated, just as an example
				"zoneId": "49411e94adb54e45a4c693e4b822973c" // Randomly generated, just as an example
			}
		],
		"email": "myemail@domain.com", // Cloudflare credentials
		"key": "49411e94adb54e45a4c693e4b822973c" // Randomly generated, just as an example, not a real key
	},
	"saveIp": true,
	"log": true
}
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
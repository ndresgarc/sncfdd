var http =  require('http');
var https = require('https');
var fs = require('fs');

var ipifyUrl = 'https://api.ipify.org/?format=json';

var config = require('./config.json');

function log(object) {
	if (config.log) console.log(object);
}

function loopAndUpdate(ip, callback) {
	if (config.cloudflare.domains.length > 0) {
		config.cloudflare.domains.forEach(function(domain){
			updateCloudflareRegister(
				config.cloudflare.email,
				config.cloudflare.token,
				ip,
				domain.name,
				domain.type,
				domain.zoneId,
				domain.recordId
			)
		});
	}
	callback();
}

function updateCloudflareRegister(email, token, ip, domain, type, zone, record) {
	const options = {
		hostname: 'api.cloudflare.com',
		port: 443,
		path: '/client/v4/zones/' + zone + '/dns_records/' + record,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		}
	};
	var request =
		https.request(
			options,
			(response) => {
				log(`statusCode: ${response.statusCode}`)
				response.on('data', (d) => {
					process.stdout.write(d)
				})
			}
		);
		request.on('error', (error) => {
			log(error)
		});
		request.write(
			JSON.stringify({
				"type": type,
				"name": domain,
				"content": ip
			})
		);
		request.end();
}



function saveAsLatestIpAddress(ip) {
	log('New IP saved in ip.json file!');
	
	var data = {
		ip: ip
	};

	fs.writeFileSync('ip.json', JSON.stringify(data));
}

function getCurrentIpAddress() {
  return new Promise((resolve, reject) => {
    http.get(
      'http://api.ipify.org/?format=json',
      (res) => {
  
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            var parsedData = JSON.parse(rawData);
            resolve(parsedData.ip);
          } catch (error) {
            reject(error);
          }
        });
      }
    );
  });
}

function getLatestIpAddress() {
  return new Promise((resolve, reject) => {
    fs.readFile('ip.json', 'utf-8', (error, data) => {
        if (error) {
			reject(error);
        }
		try {
			var parsedData = JSON.parse(data);
			resolve(parsedData.ip);
		} catch (error) {
			reject(error);			
		}
    });
  });
}

let currentIpAddressPromise =
	getCurrentIpAddress()
    .then(
		(response) => {
			return response;
		},
		(error) => {
			return false;
		}
	);

let latestIpAddressPromise =
	getLatestIpAddress()
    .then(
		(response) => {
			return response;
		},
		(error) => {
			return false;
		}
	);
	
Promise.all([currentIpAddressPromise, latestIpAddressPromise]).then(([currentIpAddress, latestIpAddress]) => {

	if (
		currentIpAddress != latestIpAddress ||
		!latestIpAddress 
	) {
		
		log('Current: ' + currentIpAddress);
		
		loopAndUpdate(currentIpAddress, () => {
			log('CF updated!!');
			if (config.saveIp) saveAsLatestIpAddress(currentIpAddress);
		});

	} else {
		log('IP hasn\'t changed from last execution');
	}
  
});
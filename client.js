var request = require('request');

var cf = {
  authKey: '',
  email: '',
  recordDns: '',
  recordId: '',
  zoneId: ''
};

var ipifyUrl = 'https://api.ipify.org/?format=json';

var cfUrl = 'https://api.cloudflare.com/client/v4/zones/' + cf.zoneId + '/dns_records/' + cf.recordId;

request({
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: ipifyUrl,
      method: 'GET'
    },
    function (error, request, body) {
      if (error) {
        console.log(error);
      } else {
        var parsedResponse = JSON.parse(body);
        request(
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Email": cf.email,
              "X-Auth-Key": cf.authKey
            },
            url: cfUrl,
            method: 'PUT',
            json: {
              "type": "A",
              "name": cf.recordDns,
              "content": parsedResponse.ip
            }
          },
          function (error, request, body) {
            console.log(body);
          }
        );

      }
    }
);

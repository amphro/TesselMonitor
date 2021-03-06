var tessel = require('tessel');
// if you're using a si7020 replace this lib with climate-si7020
var climatelib = require('climate-si7005');

var climate = climatelib.use(tessel.port['A']);

climate.on('ready', function () {
    console.log('Connected to si7005');

    // Loop forever
    setImmediate(function loop () {
        climate.readTemperature('f', function (err, temp) {
            climate.readHumidity(function (err, humid) {
                //console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
                notify(temp.toFixed(4));
                setTimeout(loop, 4000);
            });
        });
    });
});

climate.on('error', function(err) {
    console.log('error connecting module', err);
});


function notify(temp) {
    var http = require('http');

    var options = {
        host: '192.168.1.105',
        path: '/api/TEMP',
        port: '8080',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {});
    }

    var req = http.request(options, callback);
    req.write('{"temp":'+temp+'}');
    req.end();
}

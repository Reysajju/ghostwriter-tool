<<<<<<< HEAD
const http = require('http');

const data = JSON.stringify({
    title: 'Node Test Project',
    description: 'Testing from node script',
    userId: '5abfab63-ecc7-43e9-ab18-15fed52141b1'
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/projects',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'user-id': '5abfab63-ecc7-43e9-ab18-15fed52141b1'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
=======
const http = require('http');

const data = JSON.stringify({
    title: 'Node Test Project',
    description: 'Testing from node script',
    userId: '5abfab63-ecc7-43e9-ab18-15fed52141b1'
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/projects',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'user-id': '5abfab63-ecc7-43e9-ab18-15fed52141b1'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14

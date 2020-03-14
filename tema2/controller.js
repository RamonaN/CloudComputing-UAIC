const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);

    // GET Endpoint
    if (reqUrl.pathname == '/books' && req.method === 'GET') {
        console.log('Request Type:' + req.method + ' Endpoint: ' +reqUrl.pathname);
        service.getRequest(req, res);

        // POST Endpoint
    } else if (reqUrl.pathname == '/books' && req.method === 'POST') {
        console.log('Request Type:' +req.method + ' Endpoint: ' +reqUrl.pathname);
        service.postBooks(req, res);

    } else if(reqUrl.pathname == '/book' && req.method === 'POST'){
        console.log('Request Type:' +req.method + ' Endpoint: ' +reqUrl.pathname);
        service.postBook(req, res);
    }
    else if(reqUrl.pathname == '/books' && req.method === 'DELETE'){
        console.log('Request Type:' +req.method + ' Endpoint: ' +reqUrl.pathname);
        service.dropCollection(req, res);
    }
    else if(reqUrl.pathname == '/books' && req.method === 'PUT'){
        console.log('Request Type:' +req.method + ' Endpoint: ' +reqUrl.pathname);
        service.updateCollection(req, res);
    }
     else {
        console.log('Request Type:' +req.method + ' Invalid Endpoint: ' +reqUrl.pathname);
        service.invalidRequest(req, res);

    }
});
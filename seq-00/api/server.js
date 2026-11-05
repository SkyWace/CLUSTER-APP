const http = require ('http');
const os = require ('os');

const port = 3000;

http.createServer(req, res)=> {
    res.writeHead(200,{"content-type" : "application/json; charset-utf-8"});
    res.end(JSON.string)
}
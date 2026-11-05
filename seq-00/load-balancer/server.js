const http = require('http');

const port = 8080;
const backends = ['http://api-1:3000', 'http://api-2:3000', 'http://api-3:3000'].map(url => new URL(url.trim()));

let next = 0;

http.createServer((req, res) => {
    const back = backends[next];
    next = (next + 1) % backends.length;

    const proxy = http.request({
        hostname: backends.hostname,
        port: backends.port,
        method: req.method,
        path: req.url,
        headers: {
            ...req.headers, host: backends.host
        }
    }, upstream => {
        res.writeHead(upstream.statusCode, upstream.headers);
        upstream.pipe(res);
    });

    req.pipe(proxy);
}).listen(port, '0.0.0.0', () => {
    console.log(`Load balencer en écoute sur le port ${port}`)
});
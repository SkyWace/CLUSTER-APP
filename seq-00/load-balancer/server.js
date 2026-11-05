const http = require('http');

const port = 8080;
const backends = ['http://api-1:3000', 'http://api-2:3000', 'http://api-3:3000'].map(url => new URL(url));

let next = 0;

http.createServer((req, res) => {
    const back = backends[next];
    next = (next + 1) % backends.length;

    const proxy = http.request({
        hostname: back.hostname,
        port: back.port,
        method: req.method,
        path: req.url,
        headers: { ...req.headers, host: back.host }
    }, upstream => {
        res.writeHead(upstream.statusCode, upstream.headers);
        upstream.pipe(res);
    });

    // Si une API est down, on renvoie 502 au lieu de faire planter le load-balancer
    proxy.on('error', err => {
        console.error(`Erreur vers ${back.host} : ${err.message}`);
        if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad gateway', backend: back.host }));
    });

    req.pipe(proxy);
}).listen(port, '0.0.0.0', () => {
    console.log(`Load balancer en écoute sur le port ${port}`);
});

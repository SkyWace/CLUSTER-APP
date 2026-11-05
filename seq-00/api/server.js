const http = require('http');
const os = require('os');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
        message: 'Hello from CLUSTER-APP',
        hostname: os.hostname(),
        path: req.url,
        time: new Date().toISOString(),
    }));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`API listening on port ${port}`);
});

// Arrêt propre quand Docker envoie SIGTERM (docker stop)
process.on('SIGTERM', () => server.close(() => process.exit(0)));

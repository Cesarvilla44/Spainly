const http = require('http');
const url = require('url');

// Crear servidor simple para /api/health
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Endpoint /api/health
    if (parsedUrl.pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            message: 'Servidor activo',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Endpoint raíz
    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            message: 'Spainly API Server funcionando',
            endpoints: ['/api/health']
        }));
        return;
    }
    
    // 404 para otras rutas
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        success: false, 
        message: 'Endpoint no encontrado',
        path: parsedUrl.pathname
    }));
});

// Iniciar servidor en puerto 3001
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Servidor API iniciado en http://localhost:${PORT}`);
    console.log(`Endpoint /api/health disponible en http://localhost:${PORT}/api/health`);
});

module.exports = server;

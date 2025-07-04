// server.js
const path = require('node:path');
const fs = require('node:fs');
const { Server } = require('socket.io');
const fastify = require('fastify')({
    logger: true // El logger de Fastify es excelente para desarrollo
});

// Importar los plugins de rutas
const tasksRouter = require('./tasks.js');
const networkRouter = require('./networkRouter.js');
//const { initializeIO } = require('./socketHandler.js'); // Asumiendo que tu lógica de socket está en este archivo

// =============================================================================
// REGISTRO DE PLUGINS (equivalente a app.use() en Express)
// =============================================================================

// Plugin para CORS (reemplaza a app.use(cors()))
fastify.register(require('@fastify/cors'), {
    origin: "*", // Configura esto de forma más restrictiva en producción
    methods: ["GET", "POST", "PUT", "DELETE"]
});

// Plugin para servir archivos estáticos (reemplaza a express.static)
const publicUri = path.join(__dirname, '../public');
fastify.register(require('@fastify/static'), {
    root: publicUri,
    prefix: '/', // Opcional, sirve desde la raíz
});

// =============================================================================
// REGISTRO DE RUTAS
// =============================================================================

// Registrar las rutas de tareas con un prefijo
fastify.register(tasksRouter, { prefix: '/tasks' });

// Registrar las rutas de red con un prefijo
fastify.register(networkRouter, { prefix: '/api/network' });

// =============================================================================
// RUTA PERSONALIZADA /media/*
// =============================================================================
const imageobj = {
    '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.gif': 'gif',
    '.webp': 'webp', '.svg': 'svg+xml', '.bmp': 'bmp', '.ico': 'x-icon',
    '.tiff': 'tiff', '.avif': 'avif', '.apng': 'apng'
};

fastify.get('/media/*', async (request, reply) => {
    // Fastify usa request.params['*'] para el comodín
    const relativePathFromUrl = decodeURIComponent(request.params['*']);
    const filePath = path.resolve('/', relativePathFromUrl);

    fastify.log.info(`Request for: ${request.url}`);
    fastify.log.info(`Attempting to serve file from absolute path: ${filePath}`);

    try {
        const stats = await fs.promises.stat(filePath);

        if (!stats.isFile()) {
            fastify.log.warn(`Path ${filePath} is not a file.`);
            return reply.code(404).send({ error: 'Path is not a file' });
        }

        const extname = path.extname(filePath).toLowerCase();
        let contentType;

        if (extname === '.mp3' || extname === '.wav') {
            contentType = 'audio/' + extname.slice(1);
        } else if (extname === '.mp4' || extname === '.webm') {
            contentType = 'video/' + extname.slice(1);
        } else if (imageobj[extname]) {
            contentType = 'image/' + imageobj[extname];
        } else {
            fastify.log.warn(`Unsupported file type: ${extname} for file ${filePath}`);
            return reply.code(415).send({ error: 'Unsupported file type' });
        }
        
        reply.header('Content-Type', contentType);
        const fileStream = fs.createReadStream(filePath);
        return reply.send(fileStream); // Fastify maneja streams de forma nativa

    } catch (err) {
        if (err.code === 'ENOENT') {
            fastify.log.error(`File not found at ${filePath}:`, err);
            return reply.code(404).send({ error: 'File not found' });
        }
        fastify.log.error(`Error accessing file ${filePath}:`, err);
        return reply.code(500).send({ error: 'Error accessing file' });
    }
});

// =============================================================================
// INICIALIZACIÓN DE SERVIDOR Y SOCKET.IO
// =============================================================================

// Adjuntamos Socket.IO al servidor HTTP subyacente de Fastify
const io = new Server(fastify.server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Para que el networkRouter acceda a la info, usamos decoradores
// Esto es el equivalente a app.locals en Express.
// Supongamos que tienes la info p2p en una variable:
const p2pInfo = {
    instanceName: 'MyAwesomeInstance',
    p2pPort: 9002,
    // ... cualquier otra info
};
fastify.decorate('p2pInfo', p2pInfo);


const port = 9001;
module.exports = { fastify, io, port };
/* const start = async () => {
    try {
        await fastify.listen({ port, host: '0.0.0.0' });
        // La dirección del servidor API ahora está disponible después de listen()
        fastify.decorate('serverAddress', fastify.server.address());
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start(); */
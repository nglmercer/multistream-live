// index.js modificado para manejar detección de duplicados - CommonJS
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const {
    P2P_INSTANCE_NAME_PREFIX,
    API_PORT,
    API_HOST
} = require('./config.js');

const { peerManager } = require('./p2p/peerManager.js');
const { startDiscovery, stopDiscovery } = require('./p2p/discovery.js');
const {
    createTcpServer,
    closeAllConnections: closeP2PConnections
} = require('./p2p/communication.js');

const { io, essapp, httpServer } = require('./routers/index.js');
const { emitter } = require('./routers/Emitter.js');
const { initializeIO } = require('./routers/socket.js');

let p2pTcpServerInstance = null;
let p2pTcpPort = 0;
const p2pInstanceName = `${P2P_INSTANCE_NAME_PREFIX}${os.hostname().replace(/\./g, '_')}_${uuidv4().substring(0, 6)}`;

let expresspapInstance = null;

function handleP2PIncomingMessage(socket, message, socketId) {
    const senderInfo = message.senderInstanceName || `Desconocido(${socketId})`;
    console.log(`[P2P MSG IN] De ${senderInfo}: ${message.text}`);
    emitter.emit('p2p_message_received', {
        from: senderInfo,
        message: message.text,
        timestamp: message.timestamp
    });
}

function handleP2PClientConnected(socket, socketId) {
    console.log(`[P2P SYS] Cliente conectado a nuestro servidor TCP: ${socketId}`);
    emitter.emit('p2p_client_connected', { socketId });
}

function handleP2PClientDisconnected(socket, socketId) {
    console.log(`[P2P SYS] Cliente desconectado de nuestro servidor TCP: ${socketId}`);
    emitter.emit('p2p_client_disconnected', { socketId });
}

async function main() {
    console.log(`[MAIN] Iniciando instancia P2P: ${p2pInstanceName}`);

    try {
        // 1. Iniciar servidor TCP P2P con detección de duplicados
        const serverResult = await createTcpServer(
            handleP2PIncomingMessage,
            handleP2PClientConnected,
            handleP2PClientDisconnected,
            {
                preventDuplicates: true,
                duplicateDetectionMethod: 'lockfile' // 'pidfile' || 'port' || 'lockfile'
            }
        );

        // Verificar si se detectó un duplicado
        if (serverResult === false) {
            console.log(`[MAIN] ⚠️  Una instancia de esta aplicación ya está ejecutándose en este equipo.`);
            console.log(`[MAIN] La aplicación se cerrará para evitar duplicados.`);
            return;
        }

        const { server, port } = serverResult;
        p2pTcpServerInstance = server;
        p2pTcpPort = port;
        console.log(`[MAIN] ✅ Servidor TCP P2P escuchando en el puerto: ${p2pTcpPort}`);

        // 2. Iniciar descubrimiento mDNS
        startDiscovery(p2pInstanceName, p2pTcpPort);
        console.log(`[MAIN] ✅ Descubrimiento mDNS iniciado para ${p2pInstanceName} en puerto ${p2pTcpPort}`);

        // 3. Construir e iniciar el servidor Fastify
        expresspapInstance = httpServer;
        expresspapInstance.listen(API_PORT, () => {
            console.log(`Server running at http://localhost:${API_PORT}`);
        });
        initializeIO(io);
        // Conectar eventos de PeerManager al emitter global
        peerManager.on('peerUp', (service) => {
            console.log(`[P2P SYS] Peer ARRIBA: ${service.name}`);
            emitter.emit('p2p_peer_up', { name: service.name, host: service.host, port: service.port, fqdn: service.fqdn });
        });
        
        peerManager.on('peerDown', (service) => {
            console.log(`[P2P SYS] Peer ABAJO: ${service.name}`);
            emitter.emit('p2p_peer_down', { name: service.name, fqdn: service.fqdn });
        });

        console.log(`[MAIN] 🚀 Aplicación iniciada correctamente`);

    } catch (error) {
        console.error('[MAIN] ❌ Fallo al inicializar la aplicación:', error);
        await gracefulShutdown(1);
    }
}

async function gracefulShutdown(exitCode = 0) {
    console.log('\n[MAIN] 🔄 Cerrando aplicación...');

    if (expresspapInstance) {
        try {
            await expresspapInstance.close();
            console.log('[MAIN] ✅ Servidor Fastify cerrado.');
        } catch (err) {
            console.error('[MAIN] ❌ Error cerrando Fastify:', err);
        }
    }

    try {
        stopDiscovery();
        console.log('[MAIN] ✅ Descubrimiento P2P detenido.');
    } catch (err) {
        console.error('[MAIN] ❌ Error deteniendo descubrimiento P2P:', err);
    }

    if (p2pTcpServerInstance) {
        await new Promise(resolve => {
            p2pTcpServerInstance.close(() => {
                console.log('[MAIN] ✅ Servidor TCP P2P cerrado.');
                resolve();
            });
            closeP2PConnections();
            setTimeout(resolve, 2000);
        });
    } else {
        closeP2PConnections();
    }

    console.log('[MAIN] ✅ Aplicación finalizada.');
    process.exit(exitCode);
}

process.on('SIGINT', () => gracefulShutdown());
process.on('SIGTERM', () => gracefulShutdown());

main().catch(async err => {
    console.error("[MAIN] ❌ Error no manejado en la ejecución principal:", err);
    await gracefulShutdown(1);
});

module.exports = {
    main,
    gracefulShutdown
};
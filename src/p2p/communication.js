// communication.js - Versión con detección de duplicados
const net = require('net');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { P2P_MESSAGE_DELIMITER } = require('../config.js');

// Sockets de clientes conectados A ESTE servidor
const serverClients = new Map();
const outgoingConnections = new Map();

// Configuración para detección de duplicados
const LOCK_FILE = path.join(os.tmpdir(), 'p2p-app.lock');
const PIDFILE = path.join(os.tmpdir(), 'p2p-app.pid');

function generateSocketId(socket) {
    return `${socket.remoteAddress}:${socket.remotePort}`;
}

// OPCIÓN 1: Usando archivo de bloqueo (lockfile)
function acquireLock() {
    try {
        // Intentar crear archivo exclusivo
        const fd = fs.openSync(LOCK_FILE, 'wx');
        fs.writeSync(fd, process.pid.toString());
        fs.closeSync(fd);
        
        // Limpiar al salir
        process.on('exit', () => {
            try {
                fs.unlinkSync(LOCK_FILE);
            } catch (e) {}
        });
        
        return true;
    } catch (error) {
        if (error.code === 'EEXIST') {
            // El archivo existe, verificar si el proceso sigue activo
            try {
                const existingPid = fs.readFileSync(LOCK_FILE, 'utf8');
                const pid = parseInt(existingPid.trim());
                
                // Verificar si el proceso existe
                try {
                    process.kill(pid, 0); // Signal 0 solo verifica existencia
                    console.log(`[TCP Server] Proceso duplicado detectado (PID: ${pid})`);
                    return false; // Proceso ya ejecutándose
                } catch (killError) {
                    // El proceso no existe, eliminar lock file obsoleto
                    fs.unlinkSync(LOCK_FILE);
                    return acquireLock(); // Reintentar
                }
            } catch (readError) {
                // Error leyendo el archivo, eliminar y reintentar
                fs.unlinkSync(LOCK_FILE);
                return acquireLock();
            }
        }
        throw error;
    }
}

// OPCIÓN 2: Usando puerto específico como detector
function checkPortAvailability(port) {
    return new Promise((resolve) => {
        const testServer = net.createServer();
        
        testServer.listen(port, () => {
            testServer.close(() => {
                resolve(true); // Puerto disponible
            });
        });
        
        testServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false); // Puerto en uso = proceso duplicado
            } else {
                resolve(true); // Otro error, asumir disponible
            }
        });
    });
}

// OPCIÓN 3: Usando combinación de PID file y verificación de proceso
function createPidFile() {
    try {
        if (fs.existsSync(PIDFILE)) {
            const existingPid = fs.readFileSync(PIDFILE, 'utf8').trim();
            const pid = parseInt(existingPid);
            
            try {
                // Verificar si el proceso existe
                process.kill(pid, 0);
                console.log(`[TCP Server] Instancia ya ejecutándose (PID: ${pid})`);
                return false;
            } catch (e) {
                // Proceso no existe, eliminar PID file obsoleto
                fs.unlinkSync(PIDFILE);
            }
        }
        
        // Crear nuevo PID file
        fs.writeFileSync(PIDFILE, process.pid.toString());
        
        // Limpiar al salir
        process.on('exit', () => {
            try {
                fs.unlinkSync(PIDFILE);
            } catch (e) {}
        });
        
        return true;
    } catch (error) {
        console.error('[TCP Server] Error manejando PID file:', error);
        return true; // En caso de error, permitir continuar
    }
}

function createTcpServer(onDataCallback, onClientConnected, onClientDisconnected, options = {}) {
    const {
        preventDuplicates = true,
        duplicateDetectionMethod = 'lockfile', // 'lockfile', 'port', 'pidfile'
        specificPort = null // Para método 'port'
    } = options;

    // Verificar duplicados si está habilitado
    if (preventDuplicates) {
        let canStart = true;
        
        switch (duplicateDetectionMethod) {
            case 'lockfile':
                canStart = acquireLock();
                break;
                
            case 'pidfile':
                canStart = createPidFile();
                break;
                
            case 'port':
                if (specificPort) {
                    return checkPortAvailability(specificPort).then(available => {
                        if (!available) {
                            console.log(`[TCP Server] Puerto ${specificPort} en uso - proceso duplicado detectado`);
                            return Promise.resolve(false);
                        }
                        return startTcpServer(specificPort, onDataCallback, onClientConnected, onClientDisconnected);
                    });
                }
                break;
        }
        
        if (!canStart) {
            return Promise.resolve(false);
        }
    }

    return startTcpServer(specificPort || 0, onDataCallback, onClientConnected, onClientDisconnected);
}

function startTcpServer(port, onDataCallback, onClientConnected, onClientDisconnected) {
    const server = net.createServer((socket) => {
        const socketId = generateSocketId(socket);
        console.log(`[TCP Server] Cliente conectado: ${socketId}`);
        serverClients.set(socketId, socket);

        if (onClientConnected) {
            onClientConnected(socket, socketId);
        }

        let P_END_BUFFER = "";
        socket.on('data', (data) => {
            P_END_BUFFER += data.toString('utf8');
            let delimiterIndex;
            while ((delimiterIndex = P_END_BUFFER.indexOf(P2P_MESSAGE_DELIMITER)) > -1) {
                const jsonString = P_END_BUFFER.substring(0, delimiterIndex);
                P_END_BUFFER = P_END_BUFFER.substring(delimiterIndex + P2P_MESSAGE_DELIMITER.length);
                if (jsonString) {
                    try {
                        const message = JSON.parse(jsonString);
                        if (onDataCallback) {
                            onDataCallback(socket, message, socketId);
                        }
                    } catch (e) {
                        console.error(`[TCP Server] Error parseando JSON de ${socketId}:`, e.message);
                        console.error(`[TCP Server] Datos crudos recibidos: ${jsonString}`);
                    }
                }
            }
        });

        socket.on('end', () => {
            console.log(`[TCP Server] Cliente desconectado (end): ${socketId}`);
            serverClients.delete(socketId);
            if (onClientDisconnected) {
                onClientDisconnected(socket, socketId);
            }
        });

        socket.on('error', (err) => {
            console.error(`[TCP Server] Error en socket de ${socketId}:`, err.message);
        });

        socket.on('close', (hadError) => {
            console.log(`[TCP Server] Conexión de cliente cerrada (${hadError ? 'con error' : 'normal'}): ${socketId}`);
            if (serverClients.has(socketId)) {
                serverClients.delete(socketId);
                if (onClientDisconnected) {
                    onClientDisconnected(socket, socketId);
                }
            }
        });
    });

    return new Promise((resolve, reject) => {
        server.listen(port, () => {
            const address = server.address();
            if (address && typeof address !== 'string') {
                console.log(`[TCP Server] Escuchando en ${address.address || '0.0.0.0'}:${address.port}`);
                resolve({ server, port: address.port });
            } else {
                reject(new Error('No se pudo obtener la dirección del servidor.'));
            }
        });
        
        server.on('error', (err) => {
            console.error('[TCP Server] Error de servidor:', err);
            reject(err);
        });
    });
}

function connectToPeer(peer) {
    const peerFqdn = peer.fqdn;

    if (outgoingConnections.has(peerFqdn)) {
        const existingSocket = outgoingConnections.get(peerFqdn);
        if (existingSocket && !existingSocket.destroyed && existingSocket.readyState === 'open') {
            console.log(`[TCP Client] Reutilizando conexión existente a ${peer.name} (${peerFqdn})`);
            return Promise.resolve(existingSocket);
        } else {
            console.log(`[TCP Client] Conexión previa a ${peer.name} no válida, reconectando.`);
            outgoingConnections.delete(peerFqdn);
        }
    }

    return new Promise((resolve, reject) => {
        console.log(`[TCP Client] Intentando conectar a ${peer.name} (${peer.host}:${peer.port})`);
        const socket = net.createConnection({ host: peer.host, port: peer.port }, () => {
            console.log(`[TCP Client] Conectado a ${peer.name} (${peerFqdn})`);
            outgoingConnections.set(peerFqdn, socket);
            resolve(socket);
        });

        socket.on('error', (err) => {
            console.error(`[TCP Client] Error de conexión con ${peer.name} (${peerFqdn}):`, err.message);
            outgoingConnections.delete(peerFqdn);
            reject(err);
        });

        socket.on('close', () => {
            console.log(`[TCP Client] Conexión cerrada con ${peer.name} (${peerFqdn})`);
            outgoingConnections.delete(peerFqdn);
        });

        socket.on('end', () => {
            console.log(`[TCP Client] Conexión finalizada por ${peer.name} (${peerFqdn})`);
        });
    });
}

function sendMessage(socket, messageObject) {
    if (!socket || socket.destroyed || !socket.writable) {
        console.error('[TCP] No se puede enviar mensaje: Socket no escribible o destruido.');
        return false;
    }
    try {
        const jsonString = JSON.stringify(messageObject);
        socket.write(jsonString + P2P_MESSAGE_DELIMITER);
        return true;
    } catch (e) {
        console.error('[TCP] Error serializando mensaje:', e);
        return false;
    }
}

function closeAllConnections() {
    console.log('[TCP] Cerrando todas las conexiones de clientes del servidor...');
    serverClients.forEach(socket => socket.destroy());
    serverClients.clear();

    console.log('[TCP] Cerrando todas las conexiones salientes...');
    outgoingConnections.forEach(socket => socket.destroy());
    outgoingConnections.clear();
}

module.exports = {
    createTcpServer,
    connectToPeer,
    sendMessage,
    closeAllConnections
};
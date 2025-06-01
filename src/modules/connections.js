// =============================================================================
// GESTIÓN DE CONEXIONES DE PLATAFORMAS CON EVENTEMITTER
// =============================================================================

const { WebcastPushConnection, signatureProvider } = require('tiktok-live-connector');
const { createClient } = require('@retconned/kick-js');
const { EventEmitter } = require('events');
const { PlatformType, LiveEvents, tiktokLiveEvents, TIKTOK_CONFIG, SIGNATURE_API_KEY } = require('../constants.js');

// Configuración inicial
signatureProvider.config.extraParams.apiKey = SIGNATURE_API_KEY;

// =============================================================================
// EVENTEMITTER CENTRALIZADO PARA MIDDLEWARE
// =============================================================================
class ConnectionEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0); // Sin límite de listeners
    }
}

const connectionEventEmitter = new ConnectionEventEmitter();

// =============================================================================
// CLASE BASE PARA CONEXIONES
// =============================================================================
class PlatformConnection {
    constructor(uniqueId, options = {}) {
        this.uniqueId = uniqueId;
        this.options = options;
        this.isConnected = false;
        this.isConnecting = false;
        this.isReconnecting = false;
        this.connectionAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000; // 2 segundos
        this.lastReconnectAttempt = 0;
        this.state = {};
        this.eventHandlersInitialized = false;
        this.reconnectTimeout = null;
    }

    normalizeUniqueId(uniqueId) {
        return uniqueId.trim();
    }

    getConnectionKey() {
        return `${this.constructor.name.toLowerCase()}_${this.uniqueId}`;
    }

    getState() {
        return {
            ...this.state,
            isConnected: this.isConnected,
            isConnecting: this.isConnecting,
            isReconnecting: this.isReconnecting,
            connectionAttempts: this.connectionAttempts
        };
    }

    canReconnect() {
        const now = Date.now();
        const timeSinceLastAttempt = now - this.lastReconnectAttempt;
        
        return !this.isConnecting && 
               !this.isReconnecting && 
               this.connectionAttempts < this.maxReconnectAttempts &&
               timeSinceLastAttempt >= this.reconnectDelay;
    }

    resetConnectionState() {
        this.isConnected = false;
        this.isConnecting = false;
        this.isReconnecting = false;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    disconnect() {
        this.resetConnectionState();
        this.connectionAttempts = 0;
    }

    async scheduleReconnect() {
        if (!this.canReconnect()) {
            console.log(`Cannot reconnect ${this.getConnectionKey()}: already connecting or max attempts reached`);
            return;
        }

        this.isReconnecting = true;
        this.connectionAttempts++;
        this.lastReconnectAttempt = Date.now();

        const delay = this.reconnectDelay * Math.pow(2, this.connectionAttempts - 1); // Exponential backoff
        
        console.log(`Scheduling reconnect for ${this.getConnectionKey()} in ${delay}ms (attempt ${this.connectionAttempts}/${this.maxReconnectAttempts})`);

        this.reconnectTimeout = setTimeout(async () => {
            try {
                await this.attemptReconnect();
            } catch (error) {
                console.error(`Reconnect failed for ${this.getConnectionKey()}:`, error.message);
                this.isReconnecting = false;
                
                // Si no se pudo reconectar y no hemos alcanzado el máximo, programar otro intento
                if (this.connectionAttempts < this.maxReconnectAttempts) {
                    this.scheduleReconnect();
                } else {
                    console.error(`Max reconnect attempts reached for ${this.getConnectionKey()}`);
                    connectionEventEmitter.emit('maxReconnectAttemptsReached', {
                        connectionKey: this.getConnectionKey(),
                        uniqueId: this.uniqueId
                    });
                }
            }
        }, delay);
    }

    async attemptReconnect() {
        throw new Error('attemptReconnect must be implemented by subclass');
    }
}

// =============================================================================
// CLASE PARA CONEXIONES DE TIKTOK
// =============================================================================
class TiktokConnection extends PlatformConnection {
    constructor(uniqueId, options) {
        super(uniqueId, options);
        this.tiktokLiveConnection = new WebcastPushConnection(
            this.normalizeUniqueId(uniqueId), 
            TIKTOK_CONFIG
        );
    }

    normalizeUniqueId(uniqueId) {
        uniqueId = uniqueId.trim();
        return uniqueId.startsWith('@') ? uniqueId : '@' + uniqueId;
    }

    async connect() {
        if (this.isConnecting) {
            throw new Error('Already connecting to TikTok');
        }

        this.isConnecting = true;
        
        try {
            const state = await this.tiktokLiveConnection.connect();
            this.isConnected = true;
            this.isConnecting = false;
            this.isReconnecting = false;
            this.connectionAttempts = 0; // Reset counter on successful connection
            this.state = state;
            
            this.initializeEventHandlers();
            
            // Emitir evento de conexión exitosa
            connectionEventEmitter.emit('connected', {
                platform: 'tiktok',
                uniqueId: this.uniqueId,
                state: this.getState()
            });
            
            console.log(`Successfully connected to TikTok: ${this.uniqueId}`);
            return state;
        } catch (err) {
            this.isConnecting = false;
            this.isReconnecting = false;
            
            console.error(`Failed to connect to TikTok ${this.uniqueId}:`, err.message);
            
            // Emitir evento de error de conexión
            connectionEventEmitter.emit('connectionError', {
                platform: 'tiktok',
                uniqueId: this.uniqueId,
                error: err.message
            });
            
            throw err;
        }
    }

    async attemptReconnect() {
        console.log(`Attempting to reconnect to TikTok: ${this.uniqueId}`);
        await this.connect();
    }

    initializeEventHandlers() {
        if (this.eventHandlersInitialized) {
            return;
        }

        console.log(`Initializing TikTok event handlers for ${this.uniqueId}`);
        
        // Limpiar listeners existentes
        this.tiktokLiveConnection.removeAllListeners();
        
        tiktokLiveEvents.forEach(event => {
            this.tiktokLiveConnection.on(event, (data) => {
                // Emitir a través del EventEmitter centralizado
                connectionEventEmitter.emit('platformEvent', {
                    platform: 'tiktok',
                    uniqueId: this.uniqueId,
                    event: event,
                    data: data
                });

                // Manejar eventos de desconexión
                if (event === 'disconnected') {
                    console.log(`TikTok disconnected: ${this.uniqueId}`);
                    this.isConnected = false;
                    
                    // Programar reconexión si es apropiado
                    if (!this.isReconnecting) {
                        this.scheduleReconnect();
                    }
                }
            });
        });
        
        this.eventHandlersInitialized = true;
    }

    disconnect() {
        if (this.tiktokLiveConnection) {
            this.tiktokLiveConnection.removeAllListeners();
            this.tiktokLiveConnection.disconnect();
        }
        this.eventHandlersInitialized = false;
        super.disconnect();
    }
}

// =============================================================================
// CLASE PARA CONEXIONES DE KICK
// =============================================================================
class KickConnection extends PlatformConnection {
    constructor(uniqueId, options) {
        super(uniqueId, options);
        this.kickliveconnector = null;
    }

    normalizeUniqueId(uniqueId) {
        return uniqueId.trim();
    }

    async connect() {
        if (this.isConnecting) {
            throw new Error('Already connecting to Kick');
        }

        this.isConnecting = true;
        
        try {
            this.kickliveconnector = createClient(this.uniqueId, { logger: true });
            
            this.initializeEventHandlers();
            
            await this.kickliveconnector.login({
                type: "tokens",
                credentials: {
                    bearerToken: process.env.BEARER_TOKEN,
                    cookies: process.env.COOKIES,
                },
            });
            
            this.isConnected = true;
            this.isConnecting = false;
            this.isReconnecting = false;
            this.connectionAttempts = 0;
            
            // Emitir evento de conexión exitosa
            connectionEventEmitter.emit('connected', {
                platform: 'kick',
                uniqueId: this.uniqueId,
                state: this.getState()
            });
            
            console.log(`Successfully connected to Kick: ${this.uniqueId}`);
            return this.getState();
        } catch (err) {
            this.isConnecting = false;
            this.isReconnecting = false;
            
            console.error(`Failed to connect to Kick ${this.uniqueId}:`, err.message);
            
            // Emitir evento de error de conexión
            connectionEventEmitter.emit('connectionError', {
                platform: 'kick',
                uniqueId: this.uniqueId,
                error: err.message
            });
            
            throw err;
        }
    }

    async attemptReconnect() {
        console.log(`Attempting to reconnect to Kick: ${this.uniqueId}`);
        await this.connect();
    }

    initializeEventHandlers() {
        if (this.eventHandlersInitialized || !this.kickliveconnector) {
            return;
        }

        console.log(`Initializing Kick event handlers for ${this.uniqueId}`);
        
        LiveEvents.forEach(event => {
            this.kickliveconnector.on(event, (data) => {
                // Emitir a través del EventEmitter centralizado
                connectionEventEmitter.emit('platformEvent', {
                    platform: 'kick',
                    uniqueId: this.uniqueId,
                    event: event,
                    data: data
                });

                // Manejar eventos de desconexión
                if (event === 'disconnected') {
                    console.log(`Kick disconnected: ${this.uniqueId}`);
                    this.isConnected = false;
                    
                    // Programar reconexión si es apropiado
                    if (!this.isReconnecting) {
                        this.scheduleReconnect();
                    }
                }
            });
        });
        
        this.eventHandlersInitialized = true;
    }

    disconnect() {
        if (this.kickliveconnector) {
            this.kickliveconnector.removeAllListeners();
            this.kickliveconnector = null;
        }
        this.eventHandlersInitialized = false;
        super.disconnect();
    }
}

// =============================================================================
// GESTOR DE CONEXIONES CON MIDDLEWARE
// =============================================================================
const platformConnections = {
    [PlatformType.TIKTOK]: new Map(),
    [PlatformType.KICK]: new Map()
};

// Middleware para manejar sockets conectados
const socketConnections = new Map(); // socketId -> Set de connectionKeys

function registerSocketForConnection(socketId, connectionKey) {
    if (!socketConnections.has(socketId)) {
        socketConnections.set(socketId, new Set());
    }
    socketConnections.get(socketId).add(connectionKey);
}

function unregisterSocketForConnection(socketId, connectionKey) {
    if (socketConnections.has(socketId)) {
        socketConnections.get(socketId).delete(connectionKey);
        if (socketConnections.get(socketId).size === 0) {
            socketConnections.delete(socketId);
        }
    }
}

function unregisterSocket(socketId) {
    socketConnections.delete(socketId);
}

// Configurar middleware de EventEmitter
connectionEventEmitter.on('connected', (eventData) => {
    console.log(`Connection established: ${eventData.platform} ${eventData.uniqueId}`);
    
    // Emitir a todos los sockets registrados para esta conexión
    const connectionKey = `${eventData.platform}_${eventData.uniqueId}`;
    socketConnections.forEach((connectionKeys, socketId) => {
        if (connectionKeys.has(connectionKey)) {
            const io = require('../routers/index.js').io; // Asumir que tienes acceso al io
            if (io) {
                io.to(socketId).emit('connected', eventData.state);
            }
        }
    });
});

connectionEventEmitter.on('platformEvent', (eventData) => {
    // Emitir eventos de plataforma a sockets específicos
    const connectionKey = `${eventData.platform}_${eventData.uniqueId}`;
    socketConnections.forEach((connectionKeys, socketId) => {
        if (connectionKeys.has(connectionKey)) {
            const io = require('../routers/index.js').io;
            if (io) {
                io.to(socketId).emit(eventData.event, eventData.data);
            }
        }
    });
});

connectionEventEmitter.on('connectionError', (eventData) => {
    console.error(`Connection error: ${eventData.platform} ${eventData.uniqueId} - ${eventData.error}`);
    
    const connectionKey = `${eventData.platform}_${eventData.uniqueId}`;
    socketConnections.forEach((connectionKeys, socketId) => {
        if (connectionKeys.has(connectionKey)) {
            const io = require('../routers/index.js').io;
            if (io) {
                io.to(socketId).emit('streamEnd', eventData.error);
            }
        }
    });
});

connectionEventEmitter.on('maxReconnectAttemptsReached', (eventData) => {
    console.log(`Max reconnect attempts reached for ${eventData.connectionKey}`);
    
    socketConnections.forEach((connectionKeys, socketId) => {
        if (connectionKeys.has(eventData.connectionKey)) {
            const io = require('../routers/index.js').io;
            if (io) {
                io.to(socketId).emit('maxReconnectAttemptsReached', {
                    uniqueId: eventData.uniqueId
                });
            }
        }
    });
});

async function getOrCreatePlatformConnection(platform, uniqueId, socket) {
    const connections = platformConnections[platform];
    const normalizedId = platform === PlatformType.TIKTOK ?
        (uniqueId.startsWith('@') ? uniqueId : '@' + uniqueId) :
        uniqueId.trim();
    
    console.log(`getOrCreatePlatformConnection: ${platform} ${normalizedId}`);
    
    let connection = connections.get(normalizedId);
    const connectionKey = `${platform}_${normalizedId}`;
    
    // Registrar socket para esta conexión
    if (socket) {
        registerSocketForConnection(socket.id, connectionKey);
    }
    
    if (connection) {
        // Si existe pero no está conectada, intentar reconectar
        if (!connection.isConnected && !connection.isConnecting && !connection.isReconnecting) {
            try {
                await connection.connect();
            } catch (err) {
                throw new Error(`Failed to reconnect to ${platform} ${normalizedId}: ${err.message}`);
            }
        }
        
        // Si está conectada, emitir estado actual al socket
        if (socket && connection.isConnected) {
            socket.emit('connected', connection.getState());
        }
        
        return connection;
    }

    // Crear nueva conexión
    try {
        connection = platform === PlatformType.TIKTOK ?
            new TiktokConnection(normalizedId, { socketId: socket?.id }) :
            new KickConnection(normalizedId, { socketId: socket?.id });
        
        console.log(`Creating new connection: ${platform} ${normalizedId}`);
        await connection.connect();
        connections.set(normalizedId, connection);
        return connection;
    } catch (err) {
        throw new Error(`Failed to create new ${platform} connection for ${normalizedId}: ${err.message}`);
    }
}

function getAllConnectionsInfo() {
    const allConnections = [];
    Object.entries(platformConnections).forEach(([platform, connections]) => {
        connections.forEach((connection, uniqueId) => {
            allConnections.push({
                platform,
                uniqueId: connection.uniqueId,
                connectionKey: connection.getConnectionKey(),
                ...connection.getState()
            });
        });
    });
    return allConnections;
}

// Función para limpiar conexiones de un socket específico
function cleanupSocketConnections(socketId) {
    unregisterSocket(socketId);
    console.log(`Cleaned up connections for socket ${socketId}`);
}

// Función para desconectar todas las conexiones
function disconnectAllConnections() {
    Object.values(platformConnections).forEach(connections => {
        connections.forEach(connection => {
            connection.disconnect();
        });
        connections.clear();
    });
    socketConnections.clear();
    console.log('All connections disconnected');
}

module.exports = {
    PlatformConnection,
    TiktokConnection,
    KickConnection,
    getOrCreatePlatformConnection,
    getAllConnectionsInfo,
    cleanupSocketConnections,
    disconnectAllConnections,
    platformConnections,
    connectionEventEmitter,
    registerSocketForConnection,
    unregisterSocketForConnection
};
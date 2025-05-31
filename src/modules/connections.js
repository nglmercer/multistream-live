// =============================================================================
// GESTIÓN DE CONEXIONES DE PLATAFORMAS
// =============================================================================

const { WebcastPushConnection, signatureProvider } = require('tiktok-live-connector');
const { createClient } = require('@retconned/kick-js');
const { PlatformType, LiveEvents, tiktokLiveEvents, TIKTOK_CONFIG, SIGNATURE_API_KEY } = require('../constants.js');

// Configuración inicial
signatureProvider.config.extraParams.apiKey = SIGNATURE_API_KEY;

// =============================================================================
// CLASE BASE PARA CONEXIONES
// =============================================================================
class PlatformConnection {
    constructor(uniqueId, options = {}) {
        this.uniqueId = uniqueId;
        this.options = options;
        this.isConnected = false;
        this.state = {};
        this.eventHandlersInitialized = false;
    }

    normalizeUniqueId(uniqueId) {
        return uniqueId.trim();
    }

    getState() {
        return this.state;
    }

    disconnect() {
        this.isConnected = false;
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

    async connect(socket) {
        try {
            const state = await this.tiktokLiveConnection.connect();
            this.isConnected = true;
            this.state = state;
            this.initializeEventHandlers(socket);
            if (socket) {
                socket.emit('connected', this.getState());
            }
            return state;
        } catch (err) {
            console.error('Failed to connect to TikTok:', err);
            if (socket) {
                socket.emit('streamEnd', err.message);
            }
            throw err;
        }
    }

    initializeEventHandlers(socket, platform, uniqueId) {
        console.log("initializeEventHandlers", platform, uniqueId);
        tiktokLiveEvents.forEach(event => {
            this.tiktokLiveConnection.removeAllListeners(event);
            this.tiktokLiveConnection.on(event, (data) => {
                socket.emit(event, data);
                if (event === 'disconnected') {
                    console.log(`TikTok ${event} event for ${this.uniqueId}`);
                    this.isConnected = false;
                }
                checkAndReconnectConnections(socket);
            });
        });
        this.eventHandlersInitialized = true;
    }

    disconnect() {
        if (this.tiktokLiveConnection) {
            this.tiktokLiveConnection.disconnect();
            super.disconnect();
        }
    }
}

// =============================================================================
// CLASE PARA CONEXIONES DE KICK
// =============================================================================
class KickConnection extends PlatformConnection {
    constructor(uniqueId, options) {
        super(uniqueId, options);
        this.kickliveconnector = createClient(uniqueId, { logger: true });
    }

    normalizeUniqueId(uniqueId) {
        return uniqueId.trim();
    }

    async connect(socket) {
        try {
            this.isConnected = true;
            console.log("connect", this.uniqueId);
            this.initializeEventHandlers(socket);
            this.kickliveconnector.login({
                type: "tokens",
                credentials: {
                    bearerToken: process.env.BEARER_TOKEN,
                    cookies: process.env.COOKIES,
                },
            });
            if (socket) {
                socket.emit('connected', this.getState());
            }
            return this.state;
        } catch (err) {
            console.error('Failed to connect to Kick:', err);
            throw err;
        }
    }

    initializeEventHandlers(socket) {
        console.log("initializeEventHandlers");
        LiveEvents.forEach(event => {
            this.kickliveconnector.on(event, (data) => {
                socket.emit(event, data);
                console.log(`Kick ${event}`, data);
                if (event === 'disconnected') {
                    console.log(`Kick ${event} event for ${this.uniqueId}`);
                    this.isConnected = false;
                    checkAndReconnectConnections(socket);
                }
            });
        });
    }

    disconnect() {
        if (this.kickliveconnector) {
            this.kickliveconnector = null;
            super.disconnect();
        }
    }
}

// =============================================================================
// GESTOR DE CONEXIONES
// =============================================================================
const platformConnections = {
    [PlatformType.TIKTOK]: new Map(),
    [PlatformType.KICK]: new Map()
};

async function getOrCreatePlatformConnection(platform, uniqueId, socket) {
    const connections = platformConnections[platform];
    const normalizedId = platform === PlatformType.TIKTOK ?
        (uniqueId.startsWith('@') ? uniqueId : '@' + uniqueId) :
        uniqueId.trim();
    
    console.log(`getOrCreatePlatformConnection: ${platform} ${normalizedId}`, connections);
    
    let connection = connections.get(normalizedId);
    if (connection) {
        if (!connection.isConnected) {
            try {
                await connection.connect(socket);
            } catch (err) {
                throw new Error(`Failed to reconnect to ${platform} ${normalizedId}: ${err.message}`);
            }
        }
        if (socket && connection.isConnected) {
            socket.emit('connected', connection.getState());
            connection.initializeEventHandlers(socket, platform, uniqueId);
        }
        return connection;
    }

    try {
        connection = platform === PlatformType.TIKTOK ?
            new TiktokConnection(normalizedId, { socketId: socket.id }) :
            new KickConnection(normalizedId, { socketId: socket.id });
        
        console.log(`conexión: ${platform} ${normalizedId}`);
        await connection.connect(socket);
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
                isConnected: connection.isConnected,
                state: connection.getState()
            });
        });
    });
    return allConnections;
}

async function checkAndReconnectConnections(socket) {
    const allConnections = getAllConnectionsInfo();
    for (const connectionInfo of allConnections) {
        if (!connectionInfo.isConnected) {
            try {
                const connection = platformConnections[connectionInfo.platform].get(connectionInfo.uniqueId);
                if (connection) {
                    console.log(`Attempting to reconnect to ${connectionInfo.platform} ${connectionInfo.uniqueId}`);
                    await connection.connect(socket);
                    console.log(`Successfully reconnected to ${connectionInfo.platform} ${connectionInfo.uniqueId}`);
                }
            } catch (err) {
                console.error(`Failed to reconnect to ${connectionInfo.platform} ${connectionInfo.uniqueId}:`, err);
            }
        }
    }
}

module.exports = {
    PlatformConnection,
    TiktokConnection,
    KickConnection,
    getOrCreatePlatformConnection,
    getAllConnectionsInfo,
    checkAndReconnectConnections,
    platformConnections
};
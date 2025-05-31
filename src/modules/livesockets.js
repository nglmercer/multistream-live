const { WebcastPushConnection, signatureProvider } = require('tiktok-live-connector');
const { createClient } = require('@retconned/kick-js');
const WindowManager = require('./window-manager.js');
const keynut = require("./keycontroll.js");
const windowManager = new WindowManager();
const {
    StorageManager
  } = require('../utils.js');
  const store = new StorageManager("store.json");
  const { RoomManager } = require('../modules/socketManager.js');
const { io } = require('../routers/index.js');
const roomManager = new RoomManager(io);
signatureProvider.config.extraParams.apiKey = "NmYzMGMwNmMzODQ5YmUxYjkzNTI0OTIyMzBlOGZlMjgwNTJhY2JhMWQ0MzhhNWVmMGZmMjgy";
const Livescreated = new Map();

const LiveEvents = ['ready', 'ChatMessage', 'Subscription', 'disconnected', 'login', 'close'];
const tiktokLiveEvents = [
    'chat', 'gift', 'connected', 'disconnected',
    'websocketConnected', 'error', 'member', 'roomUser',
    'like', 'social', 'emote', 'envelope', 'questionNew',
    'subscribe', 'follow', 'share', 'streamEnd'
];
const PlatformType = {
    TIKTOK: 'tiktok',
    KICK: 'kick'
};
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

// Clase específica para TikTok que extiende de PlatformConnection
class TiktokConnection extends PlatformConnection {
    constructor(uniqueId, options) {
        super(uniqueId, options);
        this.tiktokLiveConnection = new WebcastPushConnection(this.normalizeUniqueId(uniqueId), {
            processInitialData: true,
            enableExtendedGiftInfo: true,
            enableWebsocketUpgrade: true,
            requestPollingIntervalMs: 2000,
            requestOptions: { timeout: 10000 },
            websocketOptions: { timeout: 10000 },
        });
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
            // Remove previous listeners
            this.tiktokLiveConnection.removeAllListeners(event);

            this.tiktokLiveConnection.on(event, (data) => {
                socket.emit(event, data);  // Emit directly to the socket
                if (event === 'disconnected') {
                    console.log(`TikTok ${event} event for ${this.uniqueId}`);
                    this.isConnected = false;
                }
                checkAndReconnectConnections(socket); // Intentar reconectar inmediatamente
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
        // Unbind previous event listeners if they exist
        console.log("initializeEventHandlers");
        LiveEvents.forEach(event => {
            this.kickliveconnector.on(event, (data) => {
                socket.emit(event, data);  // Emit directly to the socket
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

// Mapa para mantener las conexiones activas por plataforma
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
    // Verificar conexión existente
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

    // Crear nueva conexión según la plataforma
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
let lastromdata = {};
let shortcutsEnabled = true;
let registeredShortcuts = new Set();




function unregisterGlobalShortcut(accelerator) {
    if (registeredShortcuts.has(accelerator)) {
        globalShortcut.unregister(accelerator);
        registeredShortcuts.delete(accelerator);
        return true;
    }
    return false;
}

function initializeIO(io) {
    io.on('connection', (socket) => {
        checkAndReconnectConnections(socket);
        console.log('A user connected:', socket.id, "disponible connections", Livescreated);
        socket.emit('allConnections', getAllConnectionsInfo());
        socket.emit('shortcuts-event', getshortcuts());
        socket.on('joinRoom', async ({ platform, uniqueId }) => {
            try {
                if (!Object.values(PlatformType).includes(platform)) {
                    throw new Error('Invalid platform specified');
                }
                if (lastromdata.platform === platform && lastromdata.uniqueId === uniqueId) {
                    setTimeout(() => { lastromdata = {} }, 1000);
                    return;
                }
                lastromdata = { platform, uniqueId };
                const connection = await getOrCreatePlatformConnection(platform, uniqueId, socket);

                socket.join(connection.uniqueId);
                console.log(`User ${socket.id} joined ${platform} room: ${connection.uniqueId}`);
                socket.emit('message', {
                    type: 'success',
                    message: `Connected to ${platform} live room: ${connection.uniqueId}`
                });
            } catch (error) {
                socket.emit('message', {
                    type: 'error',
                    message: error.message
                });
            }
        });
        socket.on('join-room', (roomId) => {
            const roomInfo = roomManager.joinRoom(socket, roomId);

            // Notificar a todos en la sala
            roomManager.emitToRoom(roomId, 'user-joined', {
                userId: socket.id,
                usersCount: roomInfo.usersCount
            });
        });
        socket.on('update-window', ({ id, config }) => {
            windowManager.updateWindow(id, config);
        });
        socket.on('create-window', (config) => {
            windowManager.createWindow(config);
        });
        socket.on('close-window', (id) => {
            windowManager.closeWindow(id);
        });
        socket.on('create-overlay', ({ roomId, mapconfig }) => {
            console.log('create-overlay', roomId, mapconfig);
            if (roomManager.roomExists(roomId)) {
                console.log('create-overlay', mapconfig);
                roomManager.emitToRoom(roomId, 'create-overlay', mapconfig);
            }
            // emitimos a todos los usuarios en la sala

        });
        // Enviar lista inicial de ventanas
        socket.emit('window-list',
            Array.from(windowManager.getWindows().entries())
                .map(([id, config]) => ({ id, ...config }))
        );
        socket.on("storemanager", (data) => handleStoreManager(socket, data));
        socket.on("toggle-shortcuts", (enabled) => toggleShortcuts(enabled));
        socket.on("presskey", (key) => handleKeyPress(socket, key));
        socket.on("pressKey2", (key) => handleKeyPress2(socket, key));
        socket.on('disconnect', () => {
            // Limpiar todas las salas donde estaba el usuario
            for (const [roomId, users] of roomManager.rooms.entries()) {
                if (users.has(socket.id)) {
                    roomManager.leaveRoom(socket, roomId);
                    roomManager.emitToRoom(roomId, 'user-left', {
                        userId: socket.id,
                        usersCount: roomManager.getRoomSize(roomId)
                    });
                }
            }
        });
    });
}
function handleKeyPress2(socket, key) {
    try {
        console.log("keypressed2", key);
        keynut.keyboardController.handleKeyPress(key)
    } catch (error) {
        console.error("Error al presionar el teclado:", error);
    }
}
function handleKeyPress(socket, key) {
    console.log("keypressed", key);

    try {
        keynut.keyboardController.parseAndExecuteKeyCommand(key);
        socket.emit("keypressed", key);
    } catch (error) {
        socket.emit("error", error.message);
    }
}
function toggleShortcuts(enabled) {
    shortcutsEnabled = enabled;
    if (enabled) {
        registerAllShortcuts();
    } else {
        unregisterAllShortcuts();
    }
    console.log(`Shortcuts ${enabled ? 'enabled' : 'disabled'}`);
    return shortcutsEnabled;
}
function handleStoreManager(socket, data) {
    console.log("handleStoreManager", data, socket.id);
    if (data.action === 'save') {
        saveshortcuts(data, store);
    } else if (data.action === 'delete') {
        deleteshortcuts(data, store);
        return;
    }
}
function saveshortcuts(data) {
    const shortcuts = getshortcuts(store);
    console.log("saveshortcuts", data, store, shortcuts)
    if (data.oldName && data.oldName !== data.name) {
        delete shortcuts[data.oldName];
    }

    shortcuts[data.name] = data.shortcut;
    store.JSONset('shortcuts', shortcuts);

    if (shortcutsEnabled) {
        unregisterAllShortcuts();
        registerAllShortcuts(store);
    }
    return shortcuts;
}
function deleteshortcuts(data) {
    const shortcuts = getshortcuts();
    console.log("deleteshortcuts", data, shortcuts);

    // Busca el atajo en el objeto shortcuts
    const keystore = Object.entries(shortcuts).find(([key, value]) => key === data.name);
    console.log("keystore", keystore);

    // Si se encuentra el atajo, elimínalo
    if (keystore) {
        const shortcutKey = keystore[0]; // La clave del atajo
        delete shortcuts[shortcutKey]; // Elimina el atajo del objeto

        // Actualiza la base de datos con el objeto shortcuts modificado
        store.JSONset('shortcuts', shortcuts);
    }
}
function unregisterAllShortcuts() {
    registeredShortcuts.clear();
    globalShortcut.unregisterAll();
}
function registerAllShortcuts() {
    const shortcuts = getshortcuts(store);
    Object.entries(shortcuts).forEach(([name, shortcut]) => {
        registerShortcut(name, shortcut);
    });
    console.log("registerAllShortcuts", shortcuts);
}
function registerShortcut(name, shortcut) {
    globalShortcut.unregisterAll();
    if (!shortcut || !Array.isArray(shortcut) || shortcut.length === 0) {
        console.log(`No shortcut found for ${name}`, shortcut);
        return;
    }

    // Convert the array of keys into a properly formatted accelerator string
    const accelerator = shortcut
        .map((key) =>
            key.replace(/\bCtrl\b/i, 'CommandOrControl')
                .replace(/\bAlt\b/i, 'Alt')
                .replace(/\bShift\b/i, 'Shift')
                .replace(/\bMeta\b/i, 'Super')
        )
        .join('+');

    try {
        if (globalShortcut.isRegistered(accelerator)) {
            console.log(`Shortcut already registered: ${name}`, shortcut);
            return;
        }
        //aaa
        globalShortcut.register(accelerator, () => {
            mainWindow.webContents.send('shortcut-triggered', { name, shortcut });
            console.log(`Shortcut triggered: Name = ${name}, Shortcut = ${shortcut}`, accelerator);
            if (!registeredShortcuts.has(accelerator)) {
                registeredShortcuts.add(accelerator);
            }
        });

    } catch (error) {
        console.error(`Failed to register shortcut for ${name}:`, shortcut, error);
    }
}



function getshortcuts() {
    try {
        const shortcuts = store.JSONget('shortcuts') || {};
        console.log("getshortcuts", shortcuts);
        return shortcuts;
    } catch (error) {
        console.error('Error getting shortcuts:', error);
        return {};
    }
}
module.exports = { initializeIO,registerAllShortcuts };
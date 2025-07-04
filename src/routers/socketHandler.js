// =============================================================================
// GESTIÓN DE SOCKETS Y EVENTOS
// =============================================================================

const { RoomManager } = require('../modules/socketManager.js');
const { PlatformType } = require('../constants.js');

// Importaciones de otros módulos
const { 
    getOrCreatePlatformConnection, 
    getAllConnectionsInfo, 
} = require('../modules/connections.js');

// =============================================================================
// INICIALIZACIÓN DE MÓDULOS
// =============================================================================

// =============================================================================
// VARIABLES GLOBALES
// =============================================================================
const Livescreated = new Map();
let lastromdata = {};

// =============================================================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// =============================================================================
function initializeIO(io) {
    const roomManager = new RoomManager(io);
    
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id, "disponible connections", Livescreated);
        
        // Enviar datos iniciales
        socket.emit('allConnections', getAllConnectionsInfo());

        // =============================================================================
        // MANEJADORES DE EVENTOS DE CONEXIÓN
        // =============================================================================
        socket.on('join-platform', async ({ platform, uniqueId }) => {
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

        // =============================================================================
        // MANEJADORES DE EVENTOS DE SALAS
        // =============================================================================
        socket.on('join-room', (roomId) => {
            const roomInfo = roomManager.joinRoom(socket, roomId);
            roomManager.emitToRoom(roomId, 'user-joined', {
                userId: socket.id,
                usersCount: roomInfo.usersCount
            });
        });

        socket.on('create-overlay', ({ roomId, mapconfig }) => {
            console.log('create-overlay', roomId, mapconfig);
            if (roomManager.roomExists(roomId)) {
                console.log('create-overlay', mapconfig);
                roomManager.emitToRoom(roomId, 'create-overlay', mapconfig);
            }
        });
        // =============================================================================
        // MANEJADOR DE DESCONEXIÓN
        // =============================================================================
        socket.on('disconnect', () => {
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

// =============================================================================
// MANEJADORES DE EVENTOS DE TECLAS
// =============================================================================

module.exports = { 
    initializeIO
};
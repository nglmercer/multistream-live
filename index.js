import { WebcastPushConnection, signatureProvider } from 'tiktok-live-connector';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

// Mapa para guardar las instancias de TikTokLiveControl por sala
const Livescreated = new Map();

const LiveEvents = [
    'chat', 'gift', 'connected', 'disconnected',
    'websocketConnected', 'error', 'member', 'roomUser',
    'like', 'social', 'emote', 'envelope', 'questionNew',
    'subscribe', 'follow', 'share', 'streamEnd'
];
signatureProvider.config.extraParams.apiKey = "NmYzMGMwNmMzODQ5YmUxYjkzNTI0OTIyMzBlOGZlMjgwNTJhY2JhMWQ0MzhhNWVmMGZmMjgy";
class TiktokLiveControl {
    constructor(uniqueId, options) {
        this.uniqueId = this.normalizeUniqueId(uniqueId);
        this.tiktokLiveConnection = new WebcastPushConnection(this.uniqueId , {
            processInitialData: true,
            enableExtendedGiftInfo: true,
            enableWebsocketUpgrade: true,
            requestPollingIntervalMs: 2000,
            requestOptions: {
                timeout: 10000
            },
            websocketOptions: {
                timeout: 10000
            },
        });
        this.isConnected = false;
        this.options = options;
        this.state = {}
    }

    // Método para normalizar el uniqueId
    normalizeUniqueId(uniqueId) {
        // Eliminar espacios en blanco
        uniqueId = uniqueId.trim();
        // Asegurarse de que tenga @ al principio
        if (!uniqueId.startsWith('@')) {
            uniqueId = '@' + uniqueId;
        }
        return uniqueId;
    }

    // Método para validar el uniqueId
    static isValidUniqueId(uniqueId) {
        if (!uniqueId) return false;
        uniqueId = uniqueId.trim();
        // Eliminar @ si existe para la validación
        if (uniqueId.startsWith('@')) {
            uniqueId = uniqueId.substring(1);
        }
        // Verificar que tenga al menos 2 caracteres y solo contenga caracteres válidos
        return uniqueId.length >= 2 && /^[a-zA-Z0-9._]+$/.test(uniqueId);
    }

    async connect(socket) {
        try {
            const state = await this.tiktokLiveConnection.connect();
            console.log(`Connected to roomId ${state.roomId}`);
            this.isConnected = true;
            this.initializeEventHandlers();
            this.state = state;
            if (socket) {socket.emit('connected',this.getState())}
            return state;
        } catch (err) {
            console.error('Failed to connect', this.uniqueId, err);
            this.isConnected = false;
            const errorMessage = err.message || err.toString();
            console.log(errorMessage);
            if (socket) {socket.emit('streamEnd',errorMessage)}
            return errorMessage;
        }
    }
    getState() {
        return this.state;
    }
    initializeEventHandlers() {
        LiveEvents.forEach(event => {
            this.tiktokLiveConnection.on(event, (data) => {
                io.to(this.uniqueId).emit(event, data);
                if (event === 'disconnected') {
                    console.log(`${event} event for ${this.uniqueId}`);
                    this.isConnected = false;
                }
            });
        });
    }

    disconnect() {
        if (this.tiktokLiveConnection) {
            this.tiktokLiveConnection.disconnect();
            this.isConnected = false;
        }
    }
}

// Función para obtener o crear una instancia de TiktokLiveControl
async function getOrCreateLiveConnection(uniqueId,socket) {
    // Normalizar el uniqueId
    const normalizedId = uniqueId.startsWith('@') ? uniqueId : '@' + uniqueId;
    
    // Verificar si ya existe una instancia
    let existingConnection = Livescreated.get(normalizedId);
    
    if (existingConnection) {
        // Si existe pero no está conectada, reconectar
        if (!existingConnection.isConnected) {
            try {
                existingConnection.connect(socket);
            } catch (err) {
                throw new Error(`Failed to reconnect to ${normalizedId}: ${err.message}`);
            }
        }
        if (socket && existingConnection.isConnected) {socket.emit('connected',existingConnection.getState())}
        return existingConnection;
    }

    // Validar el uniqueId antes de crear una nueva instancia
    if (!TiktokLiveControl.isValidUniqueId(normalizedId)) {
        throw new Error('Invalid TikTok username format');
    }

    // Crear nueva instancia
    const newConnection = new TiktokLiveControl(normalizedId);
    try {
        await newConnection.connect(socket);
        Livescreated.set(normalizedId, newConnection);
        // set isconnected to true
        newConnection.isConnected = true;
        return newConnection;
    } catch (err) {
        throw new Error(`Failed to create new connection for ${normalizedId}: ${err.message}`);
    }
}
function getLivesInfo(livesMap) {
    // Convertimos el Map a un array de objetos con la información requerida
    return Array.from(livesMap).map(([uniqueId, liveControl]) => ({
        uniqueId: liveControl.uniqueId,
        isConnected: liveControl.isConnected,
        state: liveControl.state
    }));
}

// Ejemplo de uso:
// Conexión con Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id, "disponible connections",Livescreated);
    socket.emit('allromuser',getLivesInfo(Livescreated))
    socket.on('joinRoom', async ({ uniqueId }) => {
        try {
            const connection = await getOrCreateLiveConnection(uniqueId,socket);
            
            // Unir al usuario a la sala normalizada
            socket.join(connection.uniqueId);
            console.log(`User ${socket.id} joined room: ${connection.uniqueId}`);
            
            // Enviar mensaje de bienvenida
            socket.emit('message', {
                type: 'success',
                message: `Connected to TikTok live room: ${connection.uniqueId}`
            });
        } catch (error) {
            socket.emit('message', {
                type: 'error',
                message: error.message
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const port = parseInt(process.env.PORT) || 9000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
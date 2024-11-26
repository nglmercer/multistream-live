import { WebcastPushConnection, signatureProvider } from 'tiktok-live-connector';
import  { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path, { join, dirname } from 'node:path';
import fs from 'node:fs';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import WindowManager from './features/window-manager.js';
const windowManager = new WindowManager();
const essapp = express();
essapp.use(cors());
const httpServer = http.createServer(essapp);
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
const port = parseInt(process.env.PORT) || 9000;
essapp.use(express.static('public'));
class RoomManager {
    constructor(io) {
      this.io = io;
      this.rooms = new Map(); // Almacena información de las salas
    }
  
    // Unir usuario a sala
    joinRoom(socket, roomId) {
      socket.join(roomId);
      
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      
      this.rooms.get(roomId).add(socket.id);
      
      return {
        roomId,
        usersCount: this.rooms.get(roomId).size
      };
    }
  
    // Salir de sala
    leaveRoom(socket, roomId) {
      socket.leave(roomId);
      
      if (this.rooms.has(roomId)) {
        this.rooms.get(roomId).delete(socket.id);
        
        // Eliminar sala si está vacía
        if (this.rooms.get(roomId).size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }
  
    // Emitir a todos los usuarios en una sala
    emitToRoom(roomId, eventName, data) {
      this.io.to(roomId).emit(eventName, data);
    }
  
    // Obtener usuarios en una sala
    getRoomUsers(roomId) {
      return this.rooms.get(roomId) || new Set();
    }
  
    // Verificar si una sala existe
    roomExists(roomId) {
      return this.rooms.has(roomId);
    }
  
    // Obtener número de usuarios en una sala
    getRoomSize(roomId) {
      return this.rooms.get(roomId)?.size || 0;
    }
}
const roomManager = new RoomManager(io);
essapp.get('/media/*', (req, res) => {
    const requestedPath = decodeURIComponent(req.params[0]);
    const filePath = path.resolve(requestedPath);
    const extname = path.extname(filePath).toLowerCase();
    const imageobj = {
      '.jpg': 'jpeg',
      '.jpeg': 'jpeg', 
      '.png': 'png',
      '.gif': 'gif',
      '.webp': 'webp',
      '.svg': 'svg+xml',
      '.bmp': 'bmp',
      '.ico': 'x-icon',
      '.tiff': 'tiff',
      '.avif': 'avif',
      '.apng': 'apng'
    };
  
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).send('File not found');
      }
  
      if (extname === '.mp3' || extname === '.wav') {
        res.setHeader('Content-Type', 'audio/' + extname.slice(1));
      } else if (extname === '.mp4' || extname === '.webm') {
        // Para videos, verificar que estén en formato compatible
        res.setHeader('Content-Type', 'video/' + extname.slice(1));
      } else if (imageobj[extname]) {
        res.setHeader('Content-Type', 'image/' + imageobj[extname]);
      } else {
        return res.status(415).send('Unsupported file type');
      }
  
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  });
function createWindow () {
    const mainWindow = new BrowserWindow({
      webPreferences: {
        preload: join(__dirname, 'preload.js'), // Ruta absoluta al archivo preload        sandbox: false,
      },
    });
    const url = `http://localhost:${port}`
    mainWindow.loadURL(url)
  }
// essapp.get('/', (req, res) => {
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
windowManager.on('window-created', (data) => {
  io.emit('window-created', data);
});

windowManager.on('window-closed', (id) => {
  io.emit('window-closed', id);
});

windowManager.on('window-updated', (data) => {
  io.emit('window-updated', data);
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
app.whenReady().then(() => {
createWindow()
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
})

app.on('window-all-closed', function () {
if (process.platform !== 'darwin') app.quit()
})

// Manejador IPC existente
ipcMain.handle('get-file-paths', async (event, files) => {
const filePaths = files.map(file => file.path);
console.log('Rutas de archivos:', filePaths);
return filePaths;
});
/* import { WebcastPushConnection, signatureProvider } from 'tiktok-live-connector';
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
import WindowManager from './features/window-manager.js'; */
const WindowManager = require('./features/window-manager.js');
const keynut = require("./features/keycontroll.js");
const Store = require('./features/store.js');
const store = new Store();

const { WebcastPushConnection, signatureProvider } = require('tiktok-live-connector');
const  { createClient } = require('@retconned/kick-js'); 
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const { fileURLToPath } = require('url');
const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const { get } = require('node:http');
const windowManager = new WindowManager();
const essapp = express();
essapp.use(cors());
const uri = path.join(__dirname, 'public');

console.log(uri);
const httpServer = http.createServer(essapp);
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
const port = parseInt(process.env.PORT) || 9000;
essapp.use(express.static(uri));
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
let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ruta absoluta al archivo preload        sandbox: false,
    },
  });
  const url = `http://localhost:${port}`
  mainWindow.loadURL(url)
}
  // essapp.get('/', (req, res) => {
    //     res.sendFile(__dirname + '/public/index.html');
    // });
    
signatureProvider.config.extraParams.apiKey = "NmYzMGMwNmMzODQ5YmUxYjkzNTI0OTIyMzBlOGZlMjgwNTJhY2JhMWQ0MzhhNWVmMGZmMjgy";
// Mapa para guardar las instancias de TikTokLiveControl por sala
const Livescreated = new Map();

const LiveEvents = ['ready', 'ChatMessage', 'Subscription', 'disconnected', 'login','close'];
const tiktokLiveEvents = [
    'chat', 'gift', 'connected', 'disconnected',
    'websocketConnected', 'error', 'member', 'roomUser',
    'like', 'social', 'emote', 'envelope', 'questionNew',
    'subscribe', 'follow', 'share', 'streamEnd'
];
// Enum para los tipos de plataforma
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
          this.initializeEventHandlers(socket);
          if (socket) {
              socket.emit('connected', this.getState());
          }
          return this.state;
      } catch (err) {
          console.error('Failed to connect to Kick:', err);
          throw err;
      }
  }

  initializeEventHandlers(socket, platform, uniqueId) {
    // Unbind previous event listeners if they exist
    LiveEvents.forEach(event => {
      // Use standard event unbinding if possible
      if (this.kickliveconnector.off) {
        this.kickliveconnector.off(event);
      }
    });
    LiveEvents.forEach(event => {
      this.kickliveconnector.on(event, (data) => {
        socket.emit(event, data);  // Emit directly to the socket
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
// Función para obtener o crear una instancia de TiktokLiveControl
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
let lastromdata = {};
io.on('connection', (socket) => {
    checkAndReconnectConnections(socket);
    console.log('A user connected:', socket.id, "disponible connections",Livescreated);
    socket.emit('allConnections', getAllConnectionsInfo());
    socket.emit('shortcuts-event', getshortcuts());
    socket.on('joinRoom', async ({ platform, uniqueId }) => {
      try {
        if (!Object.values(PlatformType).includes(platform)) {
          throw new Error('Invalid platform specified');
        }
        if (lastromdata.platform === platform && lastromdata.uniqueId === uniqueId) {
          setTimeout(() => {lastromdata = {}}, 1000);
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
function handleStoreManager(socket, data) {
  console.log("handleStoreManager", data, socket.id);
  if (data.action === 'save') {
    saveshortcuts(data, store);
  } else if (data.action === 'delete') {
    deleteshortcuts(data, store);
    return;
  }
}
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
registerAllShortcuts();

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
let shortcutsEnabled = true;
let registeredShortcuts = new Set();
function registerAllShortcuts() {
    const shortcuts = getshortcuts(store);
    Object.entries(shortcuts).forEach(([name, shortcut]) => {
        registerShortcut(name, shortcut);
    });
    console.log("registerAllShortcuts", shortcuts);
}

function unregisterAllShortcuts() {
    registeredShortcuts.clear();
    globalShortcut.unregisterAll();
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
          console.log(`Shortcut triggered: Name = ${name}, Shortcut = ${shortcut}`,accelerator);
          if (!registeredShortcuts.has(accelerator)) {
            registeredShortcuts.add(accelerator);
          }
      });

  } catch (error) {
      console.error(`Failed to register shortcut for ${name}:`, shortcut, error);
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
function saveshortcuts(data) {
  const shortcuts = getshortcuts(store);
  console.log("saveshortcuts",data,store, shortcuts)  
    if (data.oldName && data.oldName !== data.name) {
      delete shortcuts[data.oldName];
    }
    
    shortcuts[data.name] = data.shortcut;
    store.set('shortcuts', shortcuts);
    
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
    store.set('shortcuts', shortcuts);
  }
}

function getshortcuts() {
  try {
    const shortcuts = store.get('shortcuts') || {};
    console.log("getshortcuts",shortcuts);
    return shortcuts;
    } catch (error) {
        console.error('Error getting shortcuts:', error);
        return {};
    }
}
function unregisterGlobalShortcut(accelerator) {
  if (registeredShortcuts.has(accelerator)) {
    globalShortcut.unregister(accelerator);
    registeredShortcuts.delete(accelerator);
    return true;
  }
  return false;
}

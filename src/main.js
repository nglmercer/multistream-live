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
import WindowManager from './modules/window-manager.js'; */
// =============================================================================
// IMPORTS Y DEPENDENCIAS
// =============================================================================
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');

// Módulos locales
const WindowManager = require('./modules/window-manager.js');
const { registerAllShortcuts } = require('./modules/shortcuts.js');
const { io, essapp, httpServer, port } = require('./routers/index.js');
const { initializeIO } = require('./routers/socket.js');
// =============================================================================
// VARIABLES GLOBALES
// =============================================================================
const windowManager = new WindowManager();
let mainWindow;

// =============================================================================
// CONFIGURACIÓN DE VENTANA PRINCIPAL
// =============================================================================
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });
  
  const url = `http://localhost:${port}`;
  mainWindow.loadURL(url);
}

// =============================================================================
// CONFIGURACIÓN DE WEBSOCKETS Y EVENTOS
// =============================================================================
function setupWebSocketEvents() {
  initializeIO(io);
  
  // Eventos del WindowManager
  windowManager.on('window-created', (data) => {
    io.emit('window-created', data);
  });
  
  windowManager.on('window-closed', (id) => {
    io.emit('window-closed', id);
  });
  
  windowManager.on('window-updated', (data) => {
    io.emit('window-updated', data);
  });
}

// =============================================================================
// MANEJADORES IPC
// =============================================================================
function setupIPCHandlers() {
  ipcMain.handle('get-file-paths', async (event, files) => {
    const filePaths = files.map(file => file.path);
    console.log('Rutas de archivos:', filePaths);
    return filePaths;
  });
}

// =============================================================================
// CONFIGURACIÓN DEL SERVIDOR
// =============================================================================
function startServer() {
  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// =============================================================================
// EVENTOS DE LA APLICACIÓN ELECTRON
// =============================================================================
function setupAppEvents() {
  app.whenReady().then(() => {
    createWindow();
    registerAllShortcuts();
    
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// =============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// =============================================================================
function initializeApp() {
  setupWebSocketEvents();
  setupIPCHandlers();
  startServer();
  setupAppEvents();
}

// Ejecutar la aplicación
initializeApp();
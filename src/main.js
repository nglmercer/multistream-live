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
*/
// =============================================================================
// IMPORTS Y DEPENDENCIAS
// =============================================================================
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');

// Módulos locales
const { io, fastify, port } = require('./routers/index.js');
const {    main,  gracefulShutdown } = require('./initserver.js')
// =============================================================================
// VARIABLES GLOBALES
// =============================================================================
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
// EVENTOS DE LA APLICACIÓN ELECTRON
// =============================================================================
function setupAppEvents() {
  app.whenReady().then(() => {
    createWindow();    
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

setupIPCHandlers();
setupAppEvents();

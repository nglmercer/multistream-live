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
const WindowManager = require('./modules/window-manager.js');
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('node:path');
const { io, essapp, httpServer, port } = require('./routers/index.js');
const { initializeIO,registerAllShortcuts } = require('./modules/livesockets.js');
const windowManager = new WindowManager();

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ruta absoluta al archivo preload        sandbox: false,
    },
  });
  const url = `http://localhost:${port}`
  mainWindow.loadURL(url)
}

initializeIO(io);

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


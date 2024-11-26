import { EventEmitter } from 'events';
import { BrowserWindow, app } from 'electron';
/* const { EventEmitter } = require('events');
const { BrowserWindow, app } = require('electron'); */
class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.windows = new Map();
    this.config = {
      with: 800,
      height: 600,
      alwaysOnTop: false,
      transparent: true,
      ignoreMouseEvents: false,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    }
    app.disableHardwareAcceleration();
  }

  createWindow(config) {
    const childWindow = new BrowserWindow(this.config);

    childWindow.loadURL(config.url || 'https://google.com');
    const id = Date.now().toString();
    this.windows.set(id, { ...config, window: childWindow });

    childWindow.on('closed', () => {
      this.windows.delete(id);
      this.emit('window-closed', id);
    });

    this.emit('window-created', { id, config });
    return id;
  }

  updateWindow(id, config) {
    const windowData = this.windows.get(id);
    if (windowData && windowData.window) {
      const window = windowData.window;
      window.setAlwaysOnTop(config.alwaysOnTop);
      window.setIgnoreMouseEvents(config.ignoreMouseEvents);
      
      this.windows.set(id, { ...windowData, ...config });
      this.emit('window-updated', { id, config });
    }
  }

  closeWindow(id) {
    const windowData = this.windows.get(id);
    if (windowData && windowData.window) {
      windowData.window.close();
    }
  }

  closeAll() {
    this.windows.forEach((windowData) => {
      if (windowData.window) {
        windowData.window.close();
      }
    });
  }

  getWindows() {
    const windowsData = new Map();
    this.windows.forEach((data, id) => {
      const { window, ...config } = data;
      windowsData.set(id, config);
    });
    return windowsData;
  }
}

export default WindowManager;
/* module.exports = WindowManager; */
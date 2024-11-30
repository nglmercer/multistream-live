/* import { EventEmitter } from 'events';
import { BrowserWindow, app, screen } from 'electron'; */
const { EventEmitter } = require('events');
const { BrowserWindow, app, screen } = require('electron');
class WindowManager extends EventEmitter {
  constructor() {
    super();
    this.windows = new Map();
    this.config = {
      width: 800,
      height: 600,
      alwaysOnTop: false,
      transparent: true,
      ignoreMouseEvents: false,
      frame: false,
      x: 0,
      y: 0,
      titleBarStyle: 'hiddenInset',
      titleBarOverlay: {
        color: '#2f3241',
        symbolColor: '#74b1be',
        height: 40
      },
      trafficLightPosition: { x: 16, y: 16 },
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    };
    
    app.disableHardwareAcceleration();
  }

  getScreenSize() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return { width, height };
  }

  createWindow(config) {
    const windowConfig = {
      ...this.config,
      ...config
    };
    
    const childWindow = new BrowserWindow(windowConfig);
        
    // Load the URL
    childWindow.loadURL(config.url || 'https://google.com');
    
    // Add custom styles for the drag region
    childWindow.webContents.on('did-finish-load', () => {
      childWindow.webContents.insertCSS(`
        .titlebar-drag-region {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${windowConfig.titleBarOverlay.height}px;
          background-color: rgba(255,255,255,0.2);
          -webkit-app-region: drag;
          z-index: 999999;
        }
        .titlebar-drag-region:hover {
          background-color: ${windowConfig.titleBarOverlay.color || 'rgba(255,255,255,0.5)'};
        }
        .titlebar-no-drag {
          -webkit-app-region: no-drag;
        }
        
        body {
          margin-top: ${windowConfig.titleBarOverlay.height}px;
        }
      `);
      
      childWindow.webContents.executeJavaScript(`
        const dragRegion = document.createElement('div');
        dragRegion.className = 'titlebar-drag-region';
        document.body.prepend(dragRegion);
      `);
    });
    
    const id = Date.now().toString();
    this.windows.set(id, { 
      ...config, 
      window: childWindow,
      isMaximized: false 
    });

    // Handle window state events
    childWindow.on('maximize', () => {
      const windowData = this.windows.get(id);
      if (windowData) {
        windowData.isMaximized = true;
        this.emit('window-state-changed', { id, isMaximized: true });
      }
    });

    childWindow.on('unmaximize', () => {
      const windowData = this.windows.get(id);
      if (windowData) {
        windowData.isMaximized = false;
        this.emit('window-state-changed', { id, isMaximized: false });
      }
    });

    childWindow.on('closed', () => {
      this.windows.delete(id);
      this.emit('window-closed', id);
    });

    this.emit('window-created', { id, config });
    return id;
  }

  toggleMaximize(id) {
    const windowData = this.windows.get(id);
    if (windowData && windowData.window) {
      if (windowData.window.isMaximized()) {
        windowData.window.unmaximize();
      } else {
        windowData.window.maximize();
      }
    }
  }

  minimize(id) {
    const windowData = this.windows.get(id);
    if (windowData && windowData.window) {
      windowData.window.minimize();
    }
  }

  updateWindow(id, config) {
    const windowData = this.windows.get(id);
    if (windowData && windowData.window) {
      const window = windowData.window;
      window.setAlwaysOnTop(config.alwaysOnTop);
      window.setIgnoreMouseEvents(config.ignoreMouseEvents);
      
      if (config.titleBarOverlay) {
        window.setTitleBarOverlay(config.titleBarOverlay);
      }
      
      this.windows.set(id, { ...windowData, ...config });
      this.emit('window-updated', { id, config });
    }
  }

  refreshWindow(id) {
    const windowData = this.windows.get(id);
    if (windowData && windowData.window) {
      windowData.window.reload();
      this.emit('window-refreshed', id);
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
module.exports = WindowManager;
/* export default WindowManager; */
/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, webUtils,ipcRenderer } = require('electron');
//import { contextBridge, webUtils } from 'electron';
console.log("preload.js")
contextBridge.exposeInMainWorld('electron', {
  showFilePath(file) {
    // It's best not to expose the full file path to the web content if
    // possible.
    const path = webUtils.getPathForFile(file);
    //alert(`Uploaded file path was: ${path}`);
    return path
  },  
});

contextBridge.exposeInMainWorld('electronAPI', {
    onShortcutTriggered: (callback) => ipcRenderer.on('shortcut-triggered', (event, data) => callback(data)),
});

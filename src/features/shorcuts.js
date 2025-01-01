const { globalShortcut } = require('electron');
let shortcutsEnabled = true;
let registeredShortcuts = {};
let laststore = null;
function registerAllShortcuts(store) {
    const shortcuts = getshortcuts(store);
    Object.entries(shortcuts).forEach(([name, shortcut]) => {
        registerShortcut(name, shortcut);
    });
}

function unregisterAllShortcuts() {
    globalShortcut.unregisterAll();
    registeredShortcuts = {};
}
function registerShortcut(name, shortcut) {
    if (!shortcut || !shortcut.replace) {
      console.log(`No shortcut found for ${name}`, shortcut);

      return;
    }
    const accelerator = shortcut.replace(/\bCtrl\b/g, 'CommandOrControl')
                               .replace(/\bAlt\b/g, 'Alt')
                               .replace(/\bShift\b/g, 'Shift')
                               .replace(/\bMeta\b/g, 'Super');
                               
    try {
      globalShortcut.register(accelerator, () => {
        mainWindow.webContents.send('shortcut-triggered', { name, shortcut });
      });
      registeredShortcuts[name] = accelerator;
    } catch (error) {
      console.error(`Failed to register shortcut: ${name}`, error);
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
function saveshortcuts(data, store) {
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
function deleteshortcuts(name, store) {
    const shortcuts = store.get('shortcuts') || {};
    delete shortcuts[name];
    store.set('shortcuts', shortcuts);
    
    if (shortcutsEnabled) {
      unregisterAllShortcuts();
      registerAllShortcuts(store);
    }
    return shortcuts;
}
function getshortcuts(store) {
  try {
    return store.get('shortcuts') || {};
    } catch (error) {
        console.error('Error getting shortcuts:', error);
        return {};
    }
}
module.exports = { toggleShortcuts, saveshortcuts, deleteshortcuts, getshortcuts };
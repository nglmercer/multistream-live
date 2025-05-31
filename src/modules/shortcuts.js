// =============================================================================
// GESTIÓN DE ATAJOS GLOBALES
// =============================================================================

const { globalShortcut } = require('electron');

// =============================================================================
// VARIABLES GLOBALES
// =============================================================================
let shortcutsEnabled = true;
let registeredShortcuts = new Set();
let mainWindow = null;

// =============================================================================
// CONFIGURACIÓN INICIAL
// =============================================================================
function setMainWindow(window) {
    mainWindow = window;
}

// =============================================================================
// GESTIÓN DE ATAJOS
// =============================================================================
function unregisterGlobalShortcut(accelerator) {
    if (registeredShortcuts.has(accelerator)) {
        globalShortcut.unregister(accelerator);
        registeredShortcuts.delete(accelerator);
        return true;
    }
    return false;
}

function unregisterAllShortcuts() {
    registeredShortcuts.clear();
    globalShortcut.unregisterAll();
}

function registerAllShortcuts(store) {
    const shortcuts = getshortcuts(store);
    Object.entries(shortcuts).forEach(([name, shortcut]) => {
        registerShortcut(name, shortcut);
    });
    console.log("registerAllShortcuts", shortcuts);
}

function registerShortcut(name, shortcut) {
    globalShortcut.unregisterAll();
    if (!shortcut || !Array.isArray(shortcut) || shortcut.length === 0) {
        console.log(`No shortcut found for ${name}`, shortcut);
        return;
    }

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

        globalShortcut.register(accelerator, () => {
            if (mainWindow) {
                mainWindow.webContents.send('shortcut-triggered', { name, shortcut });
            }
            console.log(`Shortcut triggered: Name = ${name}, Shortcut = ${shortcut}`, accelerator);
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

// =============================================================================
// GESTIÓN DE ALMACENAMIENTO
// =============================================================================
function saveshortcuts(data, store) {
    const shortcuts = getshortcuts(store);
    console.log("saveshortcuts", data, store, shortcuts);
    
    if (data.oldName && data.oldName !== data.name) {
        delete shortcuts[data.oldName];
    }

    shortcuts[data.name] = data.shortcut;
    store.JSONset('shortcuts', shortcuts);

    if (shortcutsEnabled) {
        unregisterAllShortcuts();
        registerAllShortcuts(store);
    }
    return shortcuts;
}

function deleteshortcuts(data, store) {
    const shortcuts = getshortcuts(store);
    console.log("deleteshortcuts", data, shortcuts);

    const keystore = Object.entries(shortcuts).find(([key, value]) => key === data.name);
    console.log("keystore", keystore);

    if (keystore) {
        const shortcutKey = keystore[0];
        delete shortcuts[shortcutKey];
        store.JSONset('shortcuts', shortcuts);
    }
}

function getshortcuts(store) {
    try {
        const shortcuts = store.JSONget('shortcuts') || {};
        console.log("getshortcuts", shortcuts);
        return shortcuts;
    } catch (error) {
        console.error('Error getting shortcuts:', error);
        return {};
    }
}

function handleStoreManager(socket, data, store) {
    console.log("handleStoreManager", data, socket.id);
    if (data.action === 'save') {
        saveshortcuts(data, store);
    } else if (data.action === 'delete') {
        deleteshortcuts(data, store);
        return;
    }
}

module.exports = {
    setMainWindow,
    unregisterGlobalShortcut,
    unregisterAllShortcuts,
    registerAllShortcuts,
    registerShortcut,
    toggleShortcuts,
    saveshortcuts,
    deleteshortcuts,
    getshortcuts,
    handleStoreManager
};
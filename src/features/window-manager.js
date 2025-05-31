// WindowManagerBase.js
const { EventEmitter } = require('node:events'); // Usar 'node:events' es más moderno
const { BrowserWindow, screen } = require('electron');

class WindowManagerBase extends EventEmitter {
    constructor() {
        super();
        this.windows = new Map(); // Almacena instancias de BrowserWindow por ID
        this.windowConfigs = new Map(); // Almacena la configuración asociada a cada ID
    }

    /**
     * Obtiene el tamaño del área de trabajo de la pantalla principal.
     * @returns {{width: number, height: number}}
     */
    getScreenSize() {
        const primaryDisplay = screen.getPrimaryDisplay();
        return primaryDisplay.workAreaSize;
    }

    /**
     * Crea y registra una nueva ventana. Las clases hijas deben llamar a este método.
     * @param {string} id Un identificador único para la ventana.
     * @param {object} browserWindowOptions Opciones para el constructor de BrowserWindow.
     * @param {object} [customConfig={}] Configuración adicional específica de la aplicación.
     * @returns {BrowserWindow | null} La instancia de BrowserWindow creada o null si falla.
     */
    _createWindow(id, browserWindowOptions, customConfig = {}) {
        if (this.windows.has(id)) {
            console.warn(`Window with ID ${id} already exists. Focusing existing window.`);
            this.getWindow(id)?.focus();
            return this.getWindow(id);
        }

        try {
            const newWindow = new BrowserWindow(browserWindowOptions);
            this.windows.set(id, newWindow);
            this.windowConfigs.set(id, {
                id: id,
                options: browserWindowOptions, // Guarda las opciones de creación
                custom: customConfig,       // Guarda configuración personalizada
                isMaximized: newWindow.isMaximized(),
                isMinimized: newWindow.isMinimized(),
            });

            // Manejadores de eventos básicos
            newWindow.on('closed', () => {
                console.log(`Window ${id} closed.`);
                this.windows.delete(id);
                this.windowConfigs.delete(id);
                this.emit('window-closed', id);
            });

            newWindow.on('maximize', () => this._updateWindowState(id, { isMaximized: true }));
            newWindow.on('unmaximize', () => this._updateWindowState(id, { isMaximized: false }));
            newWindow.on('minimize', () => this._updateWindowState(id, { isMinimized: true }));
            newWindow.on('restore', () => this._updateWindowState(id, { isMinimized: false })); // Cuando se restaura desde minimizado

            console.log(`Window ${id} created successfully.`);
            this.emit('window-created', this.getWindowConfig(id));
            return newWindow;

        } catch (error) {
            console.error(`Failed to create window ${id}:`, error);
            this.emit('window-creation-failed', { id, error });
            // Limpiar si algo se creó parcialmente (aunque BrowserWindow suele lanzar en el constructor)
            this.windows.delete(id);
            this.windowConfigs.delete(id);
            return null;
        }
    }

    /**
     * Actualiza el estado registrado de una ventana (maximizado, minimizado).
     * @private
     */
    _updateWindowState(id, stateChanges) {
        const config = this.windowConfigs.get(id);
        if (config) {
            const updatedConfig = { ...config, ...stateChanges };
            this.windowConfigs.set(id, updatedConfig);
            this.emit('window-state-changed', { id, ...stateChanges });
            // console.log(`Window ${id} state updated:`, stateChanges);
        }
    }

    /**
     * Obtiene la instancia de BrowserWindow por ID.
     * @param {string} id
     * @returns {BrowserWindow | undefined}
     */
    getWindow(id) {
        return this.windows.get(id);
    }

    /**
     * Obtiene la configuración registrada para una ventana por ID.
     * @param {string} id
     * @returns {object | undefined}
     */
    getWindowConfig(id) {
        // Devuelve una copia para evitar modificaciones externas accidentales
        const config = this.windowConfigs.get(id);
        return config ? { ...config } : undefined;
    }

    /**
     * Obtiene la configuración de todas las ventanas gestionadas.
     * @returns {Map<string, object>} Un mapa con ID como clave y configuración como valor.
     */
    getAllWindowConfigs() {
        // Devuelve una nueva Mappa con copias de las configuraciones
        const configs = new Map();
        this.windowConfigs.forEach((config, id) => {
            configs.set(id, { ...config });
        });
        return configs;
    }

    /**
     * Cierra una ventana específica por ID.
     * @param {string} id
     */
    closeWindow(id) {
        const window = this.getWindow(id);
        if (window && !window.isDestroyed()) {
            console.log(`Requesting close for window ${id}`);
            window.close(); // El evento 'closed' se encargará de la limpieza del Map
        } else {
            console.warn(`Window ${id} not found or already destroyed.`);
            // Asegurarse de limpiar si el evento 'closed' no se disparó por alguna razón
            this.windows.delete(id);
            this.windowConfigs.delete(id);
        }
    }

    /**
     * Cierra todas las ventanas gestionadas por esta instancia.
     */
    closeAll() {
        console.log(`Closing all windows managed by ${this.constructor.name}...`);
        // Crear una copia de las claves para evitar problemas al modificar el Map mientras se itera
        const windowIds = Array.from(this.windows.keys());
        windowIds.forEach(id => this.closeWindow(id));
    }

    /**
     * Minimiza una ventana.
     * @param {string} id
     */
    minimize(id) {
        const window = this.getWindow(id);
        if (window && !window.isDestroyed() && window.minimizable) {
            window.minimize();
        }
    }

    /**
     * Maximiza o restaura una ventana.
     * @param {string} id
     */
    toggleMaximize(id) {
        const window = this.getWindow(id);
        if (window && !window.isDestroyed()) {
            if (window.isMaximized()) {
                window.unmaximize();
            } else if (window.maximizable) {
                window.maximize();
            }
        }
    }

    /**
     * Recarga el contenido de una ventana.
     * @param {string} id
     */
    reloadWindow(id) {
        const window = this.getWindow(id);
        if (window && !window.isDestroyed()) {
            window.webContents.reload();
            this.emit('window-reloaded', id);
        }
    }

    /**
     * Envía un mensaje a una ventana específica a través de IPC.
     * @param {string} id El ID de la ventana destino.
     * @param {string} channel El canal IPC.
     * @param {...any} args Argumentos a enviar.
     * @returns {boolean} True si el mensaje fue enviado, false si la ventana no existe o está destruida.
     */
    sendMessage(id, channel, ...args) {
        const window = this.getWindow(id);
        if (window && !window.isDestroyed()) {
            window.webContents.send(channel, ...args);
            return true;
        }
        console.warn(`Cannot send message to window ${id}: Not found or destroyed.`);
        return false;
    }
}

module.exports = WindowManagerBase;
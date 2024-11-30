const databases = {
    eventsDB: { name: 'Events', version: 1, store: 'events' },
    ActionsDB: { name: 'Actions', version: 1, store: 'actions' },
  };

class IndexedDBManager {
    constructor(dbConfig, idbObserver) {
        this.dbConfig = dbConfig;
        this.debouncedSaveData = debounce(this.saveData.bind(this), 300);
        this.debouncedDeleteData = debounce(this.deleteData.bind(this), 300);
        this.debouncedUpdateData = debounce(this.updateData.bind(this), 300);
        this.idbObserver = idbObserver;
        this.newusers = new Set();
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbConfig.name, this.dbConfig.version);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore(this.dbConfig.store, { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: true });
            objectStore.createIndex('type', 'type', { unique: false });
            objectStore.createIndex('path', 'path', { unique: false });
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
        });
    }

    async performTransaction(mode, callback) {
        const db = await this.openDatabase();
        return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.dbConfig.store], mode);
        const objectStore = transaction.objectStore(this.dbConfig.store);
        callback(objectStore, resolve, reject);
        });
    }

    async saveData(data, additionalData = {}) {
        return this.performTransaction('readwrite', (objectStore, resolve, reject) => {
            // If an id is provided but invalid, remove it
            if (typeof data.id !== 'number' || data.id <= 0) {
                delete data.id;
            }

            // Merge additional data if it exists
            if (additionalData && Object.keys(additionalData).length > 0) {
                // Create a new additionalData field or extend existing one
                data.additionalData = {
                    ...(data.additionalData || {}),
                    ...additionalData
                };
            }

            const request = objectStore.add(data);
            request.onsuccess = (event) => {
                data.id = event.target.result;
                resolve(data);
            };
            this.idbobserver('save', data); 
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteData(id) {
        return this.performTransaction('readwrite', (objectStore, resolve, reject) => {
            const request = objectStore.delete(Number(id));
            request.onsuccess = () => {
                resolve(id);
            };
            this.idbobserver('delete', id);
        request.onerror = (event) => reject(event.target.error);
        });
    }

    async updateData(data, additionalData = {}) {
        return this.performTransaction('readwrite', (objectStore, resolve, reject) => {
            // Merge additional data if it exists
            if (additionalData && Object.keys(additionalData).length > 0) {
                // Create a new additionalData field or extend existing one
                data.additionalData = {
                    ...(data.additionalData || {}),
                    ...additionalData
                };
            }

            const request = objectStore.put(data);
            request.onsuccess = () => {
                resolve(data);
            };
            this.idbobserver('update', data);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getDataByName(name) {
        return this.performTransaction('readonly', (objectStore, resolve, reject) => {
        const index = objectStore.index('name');
        const request = index.get(name);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
        });
    }

    async saveOrUpdateDataByName(data, additionalData = {}) {
        try {
            const existingData = await this.getDataByName(data.name);
            if (existingData) {
                // If exists, update the id and merge additional data
                data.id = existingData.id;
                console.log("Updating existing data", data);
                return this.updateData(data, additionalData);
            } else {
                // If not exists, save new record with additional data
                console.log("Saving new data", data);
                return this.saveData(data, additionalData);
            }
        } catch (error) {
            console.error("Error saving or updating data", error);
            return this.saveData(data, additionalData); // Try to save if something fails
        }
    }
    async updateAdditionalData(id, additionalData) {
        try {
            const existingData = await this.getDataById(id);
            if (existingData) {
                // Merge new additional data with existing
                existingData.additionalData = {
                    ...(existingData.additionalData || {}),
                    ...additionalData
                };
                return this.updateData(existingData);
            } else {
                throw new Error(`No record found with ID ${id}`);
            }
        } catch (error) {
            console.error("Error updating additional data:", error);
            throw error;
        }
    }

    async getAllData() {
        return this.performTransaction('readonly', (objectStore, resolve, reject) => {
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
        });
    }

    async exportDatabase() {
        const data = await this.getAllData();
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.dbConfig.name}_backup.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async importDatabase(file) {
        const data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(JSON.parse(event.target.result));
            reader.readAsText(file);
        });

        return this.performTransaction('readwrite', (objectStore, resolve, reject) => {
            const addNextItem = (index) => {
                if (index >= data.length) {
                    resolve();
                    return;
                }
                const request = objectStore.put(data[index]);
                request.onsuccess = () => addNextItem(index + 1);
                request.onerror = (event) => reject(event.target.error);
            };
            addNextItem(0);
        });
    }
        async idbobserver (eventype, data) {
            if (this.idbObserver) {
                this.idbObserver.notify(eventype, data);
            }
        }
        // 1. Método para obtener un registro por ID
        async getDataById(id) {
        return this.performTransaction('readonly', (objectStore, resolve, reject) => {
            const request = objectStore.get(Number(id));
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
        }

        // 2. Método para modificar un campo específico de un registro por su ID
        async updateFieldById(id, fieldName, newValue) {
        try {
            const existingData = await this.getDataById(id);
            if (existingData) {
            // Actualizamos el campo específico
            existingData[fieldName] = newValue;
            return this.updateData(existingData);  // Guardamos el registro actualizado
            } else {
            throw new Error(`No se encontró un registro con el ID ${id}`);
            }
        } catch (error) {
            console.error("Error al actualizar el campo:", error);
        }
        }

        // 3. Método que combina obtener el valor, modificarlo y guardarlo
        async modifyFieldAndSave(id, fieldName, modifyFn) {
        try {
            const existingData = await this.getDataById(id);
            if (existingData) {
            // Modificamos el valor utilizando la función proporcionada
            existingData[fieldName] = modifyFn(existingData[fieldName]);
            return this.updateData(existingData);  // Guardamos el registro actualizado
            } else {
            throw new Error(`No se encontró un registro con el ID ${id}`);
            }
        } catch (error) {
            console.error("Error al modificar y guardar el campo:", error);
        }
    }
}
function debounce(func, wait) {
let timeout;
return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
};
}
class DBObserver {
constructor() {
    this.listeners = [];
}

subscribe(callback) {
    this.listeners.push(callback);
}

unsubscribe(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
}

notify(action, data) {
    this.listeners.forEach(listener => listener(action, data));
}
}
export { databases, IndexedDBManager, DBObserver } 
  
  // Usage example
  // IndexedDBManager.updateData({ name: 'User 1', points: 100 }, 'name');
  // IndexedDBManager.saveData({ na,additionalDatame: 'User 1', points: 100 }, 'name');
  
const databases = {
    eventsDB: { name: 'Events', version: 1, store: 'events' },
    ActionsDB: { name: 'Actions', version: 1, store: 'actions' },
  };

  class IndexedDBManager {
    constructor(dbConfig, idbObserver) {
        this.dbConfig = dbConfig;
        this.idbObserver = idbObserver;
        this.db = null;
    }
    async updateDataById(id, updatedData) {
        return this.executeTransaction(this.dbConfig.store, 'readwrite', (store) => {
            return new Promise((resolve, reject) => {
                // Convertir el id a número si es necesario y es requerido por la clave
                const numericId = typeof id === 'number' ? id : Number(id);
    
                if (isNaN(numericId)) {
                    return reject(new Error(`Invalid id: ${id}. The id must be a valid number.`));
                }
    
                // Intentar obtener el registro con el id especificado
                const getRequest = store.get(numericId);
    
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        // Mezcla los datos existentes con los nuevos datos, manteniendo el id original
                        const newData = { ...getRequest.result, ...updatedData, id: numericId };
                        const putRequest = store.put(newData);
    
                        putRequest.onsuccess = () => {
                            this.idbObserver?.notify('update', newData);
                            resolve(newData);
                        };
                        putRequest.onerror = () => reject(putRequest.error);
                    } else {
                        reject(new Error(`No data found with id ${numericId}`));
                    }
                };
    
                getRequest.onerror = () => reject(getRequest.error);
            });
        });
    } 
    async getDataById(id) {
        return this.executeTransaction(this.dbConfig.store, 'readonly', (store) => {
            return new Promise((resolve, reject) => {
                // Convertir el id a número si es necesario
                const numericId = typeof id === 'number' ? id : Number(id);
                
                if (isNaN(numericId)) {
                    return reject(new Error(`Invalid id: ${id}. The id must be a valid number.`));
                }

                const request = store.get(numericId);

                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result);
                    } else {
                        reject(new Error(`No data found with id ${numericId}`));
                    }
                };

                request.onerror = () => reject(request.error);
            });
        });
    }

    async openDatabase() {
        if (this.db) return this.db;
        
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbConfig.name, this.dbConfig.version);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.dbConfig.store)) {
                    const objectStore = db.createObjectStore(this.dbConfig.store, { keyPath: 'id' });
                    objectStore.createIndex('name', 'name', { unique: true });
                    objectStore.createIndex('type', 'type', { unique: false });
                    objectStore.createIndex('path', 'path', { unique: false });
                }
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    

    async executeTransaction(storeName, mode, callback) {
        const db = await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            
            let result = null;
            
            transaction.oncomplete = () => resolve(result);
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(new Error('Transaction aborted'));
            
            try {
                result = callback(store);
            } catch (error) {
                transaction.abort();
                reject(error);
            }
        });
    }

    async getAllData() {
        return this.executeTransaction(this.dbConfig.store, 'readonly', (store) => {
            return new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }

    findMissingIds(allData) {
        const existingIds = allData.map(item => item.id).sort((a, b) => a - b);
        const missingIds = [];
        let expectedId = 0;

        for (const id of existingIds) {
            while (expectedId < id) {
                missingIds.push(expectedId);
                expectedId++;
            }
            expectedId = id + 1;
        }

        return missingIds;
    }

    async saveData(data) {
        const allData = await this.getAllData();
        let targetId;

        if (typeof data.id !== 'number' || data.id < 0) {
            // Buscar IDs faltantes
            const missingIds = this.findMissingIds(allData);
            
            if (missingIds.length > 0) {
                // Si hay IDs faltantes, usar el primer ID disponible
                targetId = missingIds[0];
            } else {
                // Si no hay IDs faltantes, usar el siguiente ID después del máximo
                const maxId = allData.length > 0 ? Math.max(...allData.map(item => item.id)) : -1;
                targetId = maxId + 1;
            }
        } else {
            targetId = data.id;
        }

        const newData = { ...data, id: targetId };
        const saveorupdata = data.id || targetId >= 0 ? 'update' : 'save';   
        console.log("saveorupdata",saveorupdata,data,targetId)
        return this.executeTransaction(this.dbConfig.store, 'readwrite', (store) => {
            return new Promise((resolve, reject) => {
                const request = store.put(newData);
                request.onsuccess = () => {
                    this.idbObserver?.notify(saveorupdata, newData);
                    resolve(newData);
                };
                request.onerror = () => reject(request.error);
            });
        });
    }

    async deleteData(id) {
        return this.executeTransaction(this.dbConfig.store, 'readwrite', (store) => {
            return new Promise((resolve, reject) => {
                const request = store.delete(Number(id));
                request.onsuccess = () => {
                    this.idbObserver?.notify('delete', id);
                    resolve(id);
                };
                request.onerror = () => reject(request.error);
            });
        });
    }

    async clearDatabase() {
        return this.executeTransaction(this.dbConfig.store, 'readwrite', (store) => {
            return new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => {
                    this.idbObserver?.notify('clear', null);
                    resolve();
                };
                request.onerror = () => reject(request.error);
            });
        });
    }
    static async getAllOrCreate(dbConfig, indexes = []) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbConfig.name, dbConfig.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(dbConfig.store)) {
                    const objectStore = db.createObjectStore(dbConfig.store, { keyPath: 'id' });
                    // Crear índices adicionales si se proporcionan
                    indexes.forEach(index => {
                        objectStore.createIndex(index.name, index.keyPath, { unique: index.unique });
                    });
                }
            };

            request.onsuccess = () => {
                const db = request.result;

                const transaction = db.transaction([dbConfig.store], 'readonly');
                const store = transaction.objectStore(dbConfig.store);

                const getAllRequest = store.getAll();

                getAllRequest.onsuccess = () => {
                    resolve(getAllRequest.result);
                    db.close();
                };

                getAllRequest.onerror = () => {
                    reject(getAllRequest.error);
                    db.close();
                };
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}
async function getAllDataFromDatabase(databaseConfig) {
    return new Promise((resolve) => {
        const request = indexedDB.open(databaseConfig.name, databaseConfig.version);

        request.onupgradeneeded = (event) => {
            // Crear el almacén de objetos si no existe
            const db = event.target.result;
            if (!db.objectStoreNames.contains(databaseConfig.store)) {
                db.createObjectStore(databaseConfig.store, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => {
            const db = request.result;

            // Verificar si el almacén de objetos existe
            if (!db.objectStoreNames.contains(databaseConfig.store)) {
                db.close();
                resolve([]); // Retorna un array vacío si no existe el almacén
                return;
            }

            // Si existe, realizar la transacción para obtener todos los datos
            const transaction = db.transaction([databaseConfig.store], 'readonly');
            const store = transaction.objectStore(databaseConfig.store);

            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
                db.close();
            };

            getAllRequest.onerror = () => {
                resolve([]); // Retorna un array vacío si ocurre un error al leer
                db.close();
            };
        };

        request.onerror = () => {
            resolve([]); // Retorna un array vacío si no se puede abrir la base de datos
        };
    });
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
export { databases, IndexedDBManager, DBObserver, getAllDataFromDatabase } 
  
  // Usage example
  // IndexedDBManager.updateData({ name: 'User 1', points: 100 }, 'name');
  // IndexedDBManager.saveData({ na,additionalDatame: 'User 1', points: 100 }, 'name');
  
const fs = require("fs");
const path = require("path");
const processdirname = process.cwd();

class StorageManager {
  constructor(fileName = 'store.json', basePath = '.', isRelative = false) {
    const initBasepath = isRelative ? processdirname : __dirname;
    this.storePath = path.isAbsolute(basePath) ? basePath : path.join(initBasepath, basePath);

    if (!fs.existsSync(this.storePath)) {
      fs.mkdirSync(this.storePath, { recursive: true });
    }

    this.fileName = fileName;
    this.filePath = path.join(this.storePath, this.fileName);

    if (fs.existsSync(this.filePath)) {
      try {
        const data = fs.readFileSync(this.filePath, { encoding: 'utf8' });
        this.store = JSON.parse(data);
      } catch (error) {
        this.store = {};
        this._saveStore();
      }
    } else {
      this.store = {};
      this._saveStore();
    }
  }

  _saveStore() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.store, null, 2), { encoding: 'utf8' });
  }

  // Métodos originales (pueden seguir siendo útiles para otros propósitos)
  set(key, value) {
    const keyStr = String(key);
    const valueStr =
      value === undefined ? "undefined" : (typeof value === "string" ? value : JSON.stringify(value));
    this.store[keyStr] = valueStr;
    this._saveStore();
  }

  get(key) {
    const keyStr = String(key);
    return this.store[keyStr];
  }

  JSONget(key) {
    const keyStr = String(key);
    if (this.store[keyStr] && typeof this.store[keyStr] === "string") {
      try {
        return JSON.parse(this.store[keyStr]);
      } catch (e) {
        // Podría ser que el string no sea un JSON válido, devolvemos el string
        console.warn(`StorageManager: Value for key "${keyStr}" is not valid JSON. Returning as string.`);
        return this.store[keyStr];
      }
    }
    return this.store[keyStr]; // Podría ser ya un objeto/array si se usó JSONset
  }

  JSONset(key, value) {
    this.store[String(key)] = value; // Almacenamos directamente el objeto/array
    this._saveStore();
  }

  remove(key) {
    const keyStr = String(key);
    if (Object.prototype.hasOwnProperty.call(this.store, keyStr)) {
      delete this.store[keyStr];
      this._saveStore();
    }
  }

  clear() {
    this.store = {};
    this._saveStore();
  }

  keys() {
    return Object.keys(this.store);
  }

  getAll() {
    return this.store;
  }

  setAll(store) {
    this.store = store;
    this._saveStore();
  }

  // --- Nuevos métodos para gestionar arrays de tareas ---

  /**
   * Obtiene el array de tareas para un tipo dado.
   * Si el tipo no existe o no es un array, devuelve un array vacío.
   * @param {string} type - El tipo de tarea.
   * @returns {Array<Object>} - El array de tareas.
   */
  getTasksByType(type) {
    const tasks = this.JSONget(type);
    return Array.isArray(tasks) ? tasks : [];
  }

  /**
   * Añade una nueva tarea al array de un tipo específico.
   * Asigna un ID único y estado 'completed: false' a la tarea.
   * @param {string} type - El tipo de tarea.
   * @param {Object} taskData - Los datos de la tarea a añadir.
   * @returns {Object} - La tarea añadida con su ID y estado.
   */
  addTask(type, taskData) {
    const tasks = this.getTasksByType(type);
    const newTask = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9), // ID único
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    this.JSONset(type, tasks);
    return newTask;
  }

  /**
   * Obtiene una tarea específica por su ID dentro de un tipo.
   * @param {string} type - El tipo de tarea.
   * @param {string} taskId - El ID de la tarea a buscar.
   * @returns {Object|null} - La tarea encontrada o null si no existe.
   */
  getTaskById(type, taskId) {
    const tasks = this.getTasksByType(type);
    return tasks.find(task => task.id === taskId) || null;
  }

  /**
   * Elimina la primera tarea que coincida con el ID proporcionado del array de un tipo.
   * @param {string} type - El tipo de tarea.
   * @param {string} taskId - El ID de la tarea a eliminar.
   * @returns {boolean} - true si la tarea fue eliminada, false en caso contrario.
   */
  removeTask(type, taskId) {
    let tasks = this.getTasksByType(type);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);
    if (tasks.length < initialLength) {
      this.JSONset(type, tasks);
      return true;
    }
    return false;
  }

  /**
   * Marca una tarea como completada o incompleta.
   * @param {string} type - El tipo de tarea.
   * @param {string} taskId - El ID de la tarea a modificar.
   * @param {boolean} completedState - El estado de completitud (true para completa, false para incompleta).
   * @returns {Object|null} - La tarea actualizada o null si no se encontró.
   */
  updateTaskCompletion(type, taskId, completedState = true) {
    const tasks = this.getTasksByType(type);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
      tasks[taskIndex].completed = completedState;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      this.JSONset(type, tasks);
      return tasks[taskIndex];
    }
    return null;
  }
  
  /**
   * Actualiza los datos de una tarea existente.
   * No permite cambiar el ID, completed, createdAt.
   * @param {string} type - El tipo de tarea.
   * @param {string} taskId - El ID de la tarea a actualizar.
   * @param {Object} updates - Un objeto con los campos a actualizar.
   * @returns {Object|null} - La tarea actualizada o null si no se encontró.
   */
  updateTaskData(type, taskId, updates) {
    const tasks = this.getTasksByType(type);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
      // Evitar modificar campos protegidos directamente
      const { id, completed, createdAt, ...allowedUpdates } = updates;
      tasks[taskIndex] = { ...tasks[taskIndex], ...allowedUpdates, updatedAt: new Date().toISOString() };
      this.JSONset(type, tasks);
      return tasks[taskIndex];
    }
    return null;
  }
}

module.exports = StorageManager;
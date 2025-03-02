const path = require('path');
const fs = require('fs');
class StorageManager {
    /**
     * Crea una instancia del StorageManager.
     * @param {string} fileName - El nombre del archivo donde se almacenarán los datos (por ejemplo, 'store.json').
     * @param {string} basePath - La ruta donde se creará o buscará el archivo. Si es relativa se usa process.cwd().
     */
    constructor(fileName, basePath = '.') {
      // Resuelve la ruta absoluta del directorio base.
      this.storePath = path.isAbsolute(basePath) ? basePath : path.join(process.cwd(), basePath);
  
      // Si el directorio no existe, se crea (incluyendo subdirectorios necesarios).
      if (!fs.existsSync(this.storePath)) {
        fs.mkdirSync(this.storePath, { recursive: true });
      }
  
      this.fileName = fileName;
      this.filePath = path.join(this.storePath, this.fileName);
  
      // Si el archivo existe, carga el contenido; de lo contrario, inicializa un objeto vacío.
      if (fs.existsSync(this.filePath)) {
        try {
          const data = fs.readFileSync(this.filePath, { encoding: 'utf8' });
          this.store = JSON.parse(data);
        } catch (error) {
          // Si ocurre algún error al parsear (archivo corrupto, por ejemplo), se reinicia el store.
          this.store = {};
          this._saveStore();
        }
      } else {
        this.store = {};
        this._saveStore();
      }
    }
  
    /**
     * Método privado para guardar el objeto store en el archivo.
     */
    _saveStore() {
      fs.writeFileSync(this.filePath, JSON.stringify(this.store, null, 2), { encoding: 'utf8' });
    }
  
    /**
     * Asigna un valor a una clave.
     * Si la clave ya existe, se reemplaza el valor.
     * @param {*} key - La clave a almacenar (se convertirá a string).
     * @param {*} value - El valor a almacenar (se convierte a string; si no es string se usa JSON.stringify,
     *                     y si es undefined se almacena la cadena "undefined").
     */
    set(key, value) {
      const keyStr = String(key);
      const valueStr =
        value === undefined ? "undefined" : (typeof value === "string" ? value : JSON.stringify(value));
  
      this.store[keyStr] = valueStr;
      this._saveStore();
    }
  
    /**
     * Recupera el valor asociado a la clave.
     * @param {*} key - La clave a buscar (se convierte a string).
     * @returns {string|undefined} - El valor almacenado o undefined si la clave no existe.
     */
    get(key) {
      const keyStr = String(key);
      return this.store[keyStr];
    }
    JSONget(key) {
      const keyStr = String(key);
      if (this.store[keyStr] && typeof this.store[keyStr] === "string") {
        return JSON.parse(this.store[keyStr]);
      }
      return this.store[keyStr];
    }
    JSONset(key,value){
      this.store[key] = value;
      this._saveStore();
    }
    /**
     * Elimina la clave y su valor asociado.
     * @param {*} key - La clave a eliminar (se convierte a string).
     */
    remove(key) {
      const keyStr = String(key);
      if (Object.prototype.hasOwnProperty.call(this.store, keyStr)) {
        delete this.store[keyStr];
        this._saveStore();
      }
    }
  
    /**
     * Elimina todas las claves y valores almacenados.
     */
    clear() {
      this.store = {};
      this._saveStore();
    }
  
    /**
     * Retorna un array con todas las claves almacenadas.
     * @returns {string[]} - Array de claves.
     */
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
  }
module.exports = StorageManager;
/*
const NodedbJson = require('nodedb-json');
const db = new NodedbJson('path/to/db.json');

db.set('name', 'John Doe');
console.log(db.get('name')); // Outputs: John Doe

ES6

import NodedbJson from 'nodedb-json';
const db = new NodedbJson('path/to/db.json');

db.set('name', 'John Doe');
console.log(db.get('name')); // Outputs: John Doe

Basic Operations
Set

db.set("key", "value");

Get

const value = db.get("key");

Update

// Update an object
db.update("key", { newField: "newValue" });

// Update an array item
db.update("arrayKey", (item) => item.id === 1, { name: "Updated Name" });

Delete

// Delete a key
db.delete("key");

// Delete array items using a predicate
db.delete("arrayKey", (item) => item.id === 1);

// Batch delete array items by specified field
db.delete("arrayKey", [1, 3]); // Deletes items with id 1 and 3
db.delete("arrayKey", ["Alice", "Charlie"], "name"); // Deletes items with name 'Alice' and 'Charlie'

Push

db.push("users", { name: "Bob", age: 30 }).push("users", { name: "Charlie", age: 35 });
db.push("users", [
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 },
]);

Advanced Operations
Find

const item = db.find("arrayKey", (item) => item.id === 2);

Filter

const items = db.filter("arrayKey", (item) => item.isActive);*/
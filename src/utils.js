/* import fs from "fs";
import path, { join } from "path";
import https from 'https';
import axios from "axios";
import colors from "colors";
import stripAnsi from "strip-ansi";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */
const fs = require("fs");
const path = require("path");
const https = require('https');
const axios = require("axios");
const colors = require("colors");
const stripAnsi = async (text) => {
    const { default: stripAnsi } = await import('strip-ansi');
    return stripAnsi(text);
};
const { readdir } = require("fs/promises");
const processdirname = process.cwd();
class StorageManager {
  /**
   * Crea una instancia del StorageManager.
   * @param {string} fileName - El nombre del archivo donde se almacenarán los datos (por ejemplo, 'store.json').
   * @param {string} basePath - La ruta donde se creará o buscará el archivo. Si es relativa se usa process.cwd().
   */
  constructor(fileName = 'default.json', basePath = '.', isRelative = false) {
    const initBasepath = isRelative ? processdirname : __dirname;
    // Resuelve la ruta absoluta del directorio base.
    this.storePath = path.isAbsolute(basePath) ? basePath : path.join(initBasepath, basePath);

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

// Ejemplo de uso:e
const storage = new StorageManager('store.json', './data', true);
class LanguageManager {
    static availableLanguages = {};
    static rawDataLanguages = [];
    static allLanguages = [];
  
    // Cargar los lenguajes disponibles desde la carpeta /languages
    static loadAvailableLanguages() {
      const languagesPath = path.join(__dirname, "./data/languages");
  
      if (fs.existsSync(languagesPath)) {
        fs.readdirSync(languagesPath).forEach(file => {
          if (path.extname(file) === ".json") {
            let langFile = JSON.parse(fs.readFileSync(path.join(languagesPath, file), "utf-8"));
            // Guardamos la data original y la info de cada idioma
            LanguageManager.rawDataLanguages = LanguageManager.allLanguages;
            LanguageManager.allLanguages.push(langFile);
            if (
              typeof langFile.info.code !== "undefined" &&
              typeof langFile.info.id !== "undefined" &&
              typeof langFile.info.displayNameEnglish !== "undefined"
            ) {
              LanguageManager.availableLanguages[langFile.info.code] = langFile.info;
            }
          }
        });
        return true;
      }
      return false;
    }
  
    // Obtener la info de un idioma dado su código
    static getLanguageInfo(language) {
      if (Object.keys(LanguageManager.availableLanguages).includes(language)) {
        return LanguageManager.availableLanguages[language];
      }
      return false;
    }
  
    // Traducir todos los marcadores de traducción en un texto
    // Los marcadores tienen el formato {category.key} o {category.key.modificator}
    // Y se pueden reemplazar placeholders de tipo %0%, %1%, etc.
    static translateText(language, text, ...placers) {
      text = text.toString();
  
      if (Object.keys(this.availableLanguages).includes(language)) {
        const languagePath = path.join(__dirname, "./data/languages", language + ".json");
        let translationFile = JSON.parse(fs.readFileSync(languagePath, "utf-8"));
  
        // Buscar marcadores de traducción usando expresión regular
        let searchMatches = text.match(/\{{[0-9a-zA-Z\-_.]+\}}/gm);
  
        if (searchMatches != null) {
          searchMatches.forEach(match => {
            // Eliminar llaves y separar en partes
            let matchClear = match.replaceAll("{", "").replaceAll("}", "");
            let parts = matchClear.split(".");
            if (parts.length >= 2) {
              let category = parts[0];
              let key = parts[1];
              let modificator = parts[2];
  
              // Reemplazar si se encuentra la traducción
              if (typeof translationFile.translations[category]?.[key] !== "undefined") {
                let matchedTranslation = translationFile.translations[category][key];
  
                if (modificator === "upperCase") {
                  matchedTranslation = matchedTranslation.toUpperCase();
                } else if (modificator === "lowerCase") {
                  matchedTranslation = matchedTranslation.toLowerCase();
                }
  
                text = text.replaceAll(match, matchedTranslation);
              }
            }
          });
  
          // Reemplazar los placeholders (%0%, %1%, etc.) con los valores proporcionados
          placers.forEach((replacement, i) => {
            text = text.replaceAll(`%${i}%`, replacement);
          });
        }
        return text;
      }
      // Si no existe el idioma, se devuelve el texto original
      return text;
    }
}
/* // Guardar valores
storage.set('nombre', 'Juan');
storage.set(123, { edad: 30, ciudad: 'Madrid' });
storage.set('algo', undefined);
storage.set(undefined, undefined);
storage.set(null, null);
storage.set(true, true);
storage.set([], []);
storage.set({}, {});
storage.JSONset(false,{
    "name":"name"
})
// Recuperar valores
console.log(storage.get('nombre'));   // "Juan"
console.log(storage.get('123'));      // '{"edad":30,"ciudad":"Madrid"}'
console.log(storage.get('algo'));     // "undefined"

// Listar todas las claves
console.log(storage.keys());          // ["nombre", "123", "algo"]

// Eliminar una clave
storage.remove('nombre');
console.log(storage.keys());          // ["123", "algo"] */

// Limpiar el almacenamiento
//storage.clear();
//console.log(storage.getAll());          // []
const getDataByURL = async (url, cb) => {
  if (cb) {
    axios
    .get(url)
    .then(function (response) {
        cb(response.data);
    })
    .catch(function (error) {
        cb(false);
        return console.error(error.data);
    });
  }
  try {
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      logger.warning(`Failed to fetch data from ${url}:`, error.message);
      return null;
  }
};

class Logger {
    constructor() {
        this.LOGS_DIR = path.join(process.cwd(), "logs");
        this.ensureLogsDirExists();
    }

    // Crear directorio de logs si no existe
    ensureLogsDirExists() {
        if (!fs.existsSync(this.LOGS_DIR)) {
            fs.mkdirSync(this.LOGS_DIR, { recursive: true });
        }
    }

    // Formatear la hora actual
    getTimeFormatted() {
        const dateTime = new Date();
        return `[${dateTime.getHours().toString().padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}.${dateTime.getMilliseconds().toString().padStart(3, "0")}]`;
    }

    // Obtener el nombre del archivo de log
    getLastLogFileName() {
        const dateTime = new Date();
        return `${dateTime.getDate().toString().padStart(2, "0")}-${(dateTime.getMonth() + 1).toString().padStart(2, "0")}-${dateTime.getFullYear()}.log`;
    }

    // Escribir una línea en el archivo de log
    async writeLineToLog(line) {
        const fileName = this.getLastLogFileName();
        const filePath = path.join(this.LOGS_DIR, fileName);

        try {
            await fs.promises.appendFile(filePath, `${line}\n`);
        } catch (err) {
            console.error(colors.red(`Error writing to log file: ${err.message}`));
        }
    }

    // Función auxiliar para formatear y registrar mensajes
    async logMessage(level, colorFn, ...text) {
      const preparedText = `${this.getTimeFormatted()} ${level ? `[${level}] ` : ""}${text.join(" ")}`;
      
      // Mostrar en consola con color
      console.log(colorFn ? colorFn(preparedText) : preparedText);
  
      // Escribir en el log sin colores
      await this.writeLineToLog(stripAnsi(preparedText));
  }

    // Registrar mensajes de log
    log(...text) {
        return this.logMessage("", null, ...text);
    }

    // Registrar mensajes de advertencia
    warning(...text) {
        return this.logMessage("WARN", colors.yellow, ...text);
    }
    warn(...text) {
        return this.logMessage("WARN", colors.yellow, ...text);
    }
    // Registrar mensajes de error
    error(...text) {
        return this.logMessage("ERR", colors.red, ...text);
    }

    // Mostrar mensaje de bienvenida
    WelcomeMessage() {
        console.log("");
        console.log(colors.cyan("your logo ASCII art here"));
        console.log("");
        console.log("");
    }
}
const isObjectsValid = (...objects) => {
  let validCount = 0;
  let summCount = objects.length;
  objects.forEach(function (obj) {
      if (typeof obj !== "undefined" && obj !== null) {
          validCount++;
      }
  });
  return summCount === validCount;
};
const downloadFileFromUrl = (fileConfig) => {
  const {server, url, filePath, cb } =fileConfig;
  try {
      // Validación de parámetros
      if (!isObjectsValid(server, url, filePath)) {
          return cb(false, "Parámetros inválidos");
      }

      // Validación de URL
      if (!isValidUrl(url)) {
          return cb(false, "URL inválida");
      }

      // Construir ruta completa
      const uploadPath = path.join("./servers", server, filePath);

      // Crear directorio si no existe
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

      // Descargar archivo
      axios({
          method: "get",
          url: url,
          responseType: "stream"
      })
      .then(response => {
          const writer = fs.createWriteStream(uploadPath);
          response.data.pipe(writer);

          writer.on("finish", () => cb(true));
          writer.on("error", err => {
              fs.unlink(uploadPath, () => cb(false, err.message));
          });
      })
      .catch(error => {
          cb(false, error.message);
      });

  } catch (error) {
      cb(false, error.message);
  }
};
const isValidUrl = (url) => {
  if (!url || typeof url !== "string") {
      console.warn("isValidUrl: Invalid URL:", url);
      return false;
  }
  try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
      return false;
  }
};

const testForRegexArray = (text, regexArray) => {
  let testResult = false;
  regexArray.forEach((regexpItem) => {
      if (typeof regexpItem == "object" && text.match(regexpItem) !== null) {
          testResult = true;
      } else if (typeof regexpItem == "string" && regexpItem === text) {
          testResult = true;
      }
  });
  return testResult;
};
function generateSecureID(length = 18) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))
  ).join('');
}
const logger = new Logger();
function detectUserLocale() {
  // Idioma predeterminado
  const defaultLocale = "en";
  return storage.get("lang") || defaultLocale;
}
const moveUploadedFile = (server, sourceFile, filePath, cb) => { 
  if (isObjectsValid(server, sourceFile.name)) {
      let uploadPath;
      uploadPath = "./servers/" + server + filePath;
      fs.mkdirSync(path.dirname(uploadPath), {recursive: true});
      sourceFile.mv(uploadPath, function (err) {
          if (err) {
              return cb(err);
          }

          cb(true);
      });
  } else {
      cb(400);
  }
}
const isBase64Valid = (str) => {
  try {
      // Verifica si la cadena es Base64 válida
      return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (err) {
      return false;
  }
};

function getImageBase64(input) {
  // Caso 1: Si es una ruta de archivo válida
  if (typeof input === "string" && fs.existsSync(input)) {
      try {
          const imageBuffer = fs.readFileSync(input);
          return imageBuffer.toString("base64");
      } catch (error) {
          console.error(`Error al leer el archivo: ${input}`, error);
          return null;
      }
  }

  // Caso 2: Si es un buffer
  if (Buffer.isBuffer(input)) {
      return input.toString("base64");
  }

  // Caso 3: Si es una cadena Base64 válida
  if (typeof input === "string" && isBase64Valid(input)) {
      return input; // Ya está en Base64, no es necesario convertirlo
  }

  // Caso por defecto
  return null;
}
const getPlatformInfo = () => {
  const isTermux = process.platform === 'android' || fs.existsSync('/data/data/com.termux');
  const isWindows = process.platform === "win32";
  const isLinux = process.platform === "linux";
  
  return {
      isTermux,
      isWindows, 
      isLinux,
      startScript: isWindows ? "start.bat" : "start.sh"
  };
};
const getSafeFilename = (url) => {
  if (!url || typeof url !== "string") {
      console.warn("isValidUrl: Invalid URL:", url);
      return false;
  }
  const parsed = new URL(url);
  return parsed.pathname
      .split("/")
      .pop()
      .replace(/[^a-z0-9\.]/gi, "_");
};
const fileExists = (filePath) => {
    return fs.existsSync(filePath);
};
const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', (err) => reject(err));
    });
};
const isDataRecent = (data) => {
    const now = new Date();
    const lastUpdated = new Date(data.lastUpdated);
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return (now - lastUpdated) < oneDayInMs;
};
const writeCoresFile = (coresFilePath, data) => {
    storage.JSONset(coresFilePath, data);
};
const readCoresFile = (coresFilePath) => {
    if (storage.JSONget(coresFilePath)) {
        return storage.JSONget(coresFilePath);
    }
    return null;
};
async function getFileNames(directoryPath) {
  try {
      const files = await readdir(directoryPath, { withFileTypes: true });
      return files
          .filter(file => file.isFile()) // Filtrar solo archivos
          .map(file => file.name); // Obtener los nombres de los archivos
  } catch (error) {
      console.error("Error al leer la carpeta:", error);
      return [];
  }
}
/* export { 
  StorageManager, 
  LanguageManager, 
  storage, 
  getDataByURL,
  Logger,
  logger, 
  isObjectsValid, 
  generateSecureID, 
  detectUserLocale,
  testForRegexArray, 
  moveUploadedFile,
  getImageBase64,
  getPlatformInfo,
  downloadFileFromUrl,
  getSafeFilename,
  fileExists,
  fetchData,
  isDataRecent,
  writeCoresFile,
  readCoresFile,
  getFileNames
};
 */
// export commonjs
 module.exports = {
    StorageManager, 
    LanguageManager, 
    storage, 
    getDataByURL,
    Logger,
    logger, 
    isObjectsValid, 
    generateSecureID, 
    detectUserLocale,
    testForRegexArray, 
    moveUploadedFile,
    getImageBase64,
    getPlatformInfo,
    downloadFileFromUrl,
    getSafeFilename,
    fileExists,
    fetchData,
    isDataRecent,
    writeCoresFile,
    readCoresFile,
    getFileNames
};
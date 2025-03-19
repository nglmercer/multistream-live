const net = require("net");
const readline = require("readline");
class LuaServer {
  #connected = false;
  #connectionPromise = null;

  constructor(config = {}) {
    this.config = {
      server: "localhost",
      port: 22122,
      debug: false,
      ...config
    };

    this.client = new net.Socket();
    this.#setupEventListeners();
  }

  #setupEventListeners() {
    this.client
      .on("ready", () => {
        this.#connected = true;
        this.#log("Conexión establecida con el servidor Lua");
      })
      .on("data", (data) => {
        this.#log(`Respuesta del servidor: ${data.toString()}`);
      })
      .on("error", (err) => {
        this.#log(`Error de conexión: ${err.message}`, true);
        this.#connected = false;
      })
      .on("close", () => {
        this.#log("Conexión cerrada");
        this.#connected = false;
      });
  }

  #log(message, isError = false) {
    if (this.config.debug || isError) {
      const logMethod = isError ? console.error : console.log;
      logMethod(`[LuaServer] ${message}`);
    }
  }

  async connect() {
    if (this.#connected) return true;
    
    if (!this.#connectionPromise) {
      this.#connectionPromise = new Promise((resolve, reject) => {
        this.client.connect(this.config.port, this.config.server, () => resolve());
        this.client.once("error", reject);
      });
    }

    try {
      await this.#connectionPromise;
      return true;
    } catch (error) {
      this.#connectionPromise = null;
      throw error;
    }
  }
  async ejecutarLua(command) {
    return this.execute(command);
  }
  async execute(command) {
    try {
      const cleanedCommand = command.replace(/^lua:/, "");
      if (!this.#connected) await this.connect();

      if (!cleanedCommand) {
        throw new Error("Comando Lua no puede estar vacío");
      }

      return new Promise((resolve, reject) => {
        this.client.write(`${cleanedCommand}\n`, (err) => {
          if (err) return reject(err);
          this.#log(`Comando enviado: ${cleanedCommand}`);
          resolve();
        });
      });
    } catch (error) {
      this.#log(`Error ejecutando comando: ${error.message}`, true);
      throw error;
    }
  }

  disconnect() {
    return new Promise((resolve) => {
      if (this.#connected) {
        this.client.end(() => resolve());
      } else {
        resolve();
      }
    });
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}
const luaServer = new LuaServer({
  server: "localhost",
  port: 22122,
  debug: true
});
async function main() {
  try {
    await luaServer.connect();
    console.log("Conectado al servidor Lua. Escribe comandos para ejecutar (o 'exit' para salir).");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on("line", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("Cerrando conexión...");
        await luaServer.disconnect();
        rl.close();
        process.exit(0);
      }

      try {
        await luaServer.execute(input);
      } catch (error) {
        console.error("Error ejecutando comando:", error.message);
      }
    });
  } catch (error) {
    console.error("No se pudo conectar al servidor Lua:", error.message);
  }
}

main();
// escuchamos los argumentos
//module.exports = LuaServer;
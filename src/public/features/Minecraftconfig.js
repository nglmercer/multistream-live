import DynamicTable, { EditModal } from '../components/renderfields.js';
import { getTranslation, translations } from '../translations.js';
import { UserInteractionTracker, logger,showAlert } from '../utils/utils.js'
const minecraftconfig = {
    ip: {
      class: 'input-default',
      type: 'text',
      returnType: 'string',
      label: 'IP',
    },
    port: {
      class: 'input-default',
      type: 'number',
      returnType: 'number',
      label: 'Puerto',
    },
    username: {
      class: 'input-default',
      type: 'text',
      returnType: 'string',
      label: 'Usuario',
    },
    password: {
      class: 'input-default',
      type: 'password',
      returnType: 'string',
      label: 'Contraseña',
    },
    savenbutton: {
      class: 'default-button',
      type: 'button',
      label: getTranslation('connect'),
      callback: async (data,modifiedData) => {
        logger.log("minecraft","minecraftcallback",data,modifiedData);
        localStorage.setItem("MinecraftPluginServer",JSON.stringify(modifiedData));
        handlebotconnect("connect-plugin",modifiedData);
      },
    },
  }
const minecraftdata = localStorage.getItem("MinecraftPluginServer") ? JSON.parse(localStorage.getItem("MinecraftPluginServer")) : {
  ip: "localhost",
  port: 4567,
  username: "nglmercer",
  password: "change_me",
}

const Aformelement = new EditModal(minecraftconfig);

const trackerMultiple = new UserInteractionTracker({autoDestroy: true});
trackerMultiple.addInteractionListener(handlemcconnect);

function handlemcconnect(interaction) {
  logger.log("minecraft","handlemcconnect",interaction);
    handlebotconnect("connect-plugin",minecraftdata);
  
}
const htmlminecraft = Aformelement.ReturnHtml(minecraftdata);
htmlminecraft.classList.add('grid');
//   document.getElementById('sendcommandmc').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const data = Object.fromEntries(new FormData(e.target).entries());
//     sendcommandmc(data.commandinput);
//   });
  
  function handlebotconnect(eventType,data) {
    switch (eventType) {
      // case "connect-bot":
      //   socketManager.emitMessage(eventType,data);
      //   break;
      // case "connect-rcon":
      //   socketManager.emitMessage(eventType,data);
      //   break;
      case "connect-plugin":
        pluginconnect(data);
        break;
      default:
          logger.log("minecraft",`Tipo de evento desconocido: ${eventType}`,data);
    }
  }
  class WebSocketManager {
    constructor(maxReconnectAttempts = 3, reconnectInterval = 1000) {
        this.maxReconnectAttempts = maxReconnectAttempts;
        this.reconnectInterval = reconnectInterval;
        this.reconnectAttempts = 0;
        this.ws = null;
    }
    setCookie(password) {
      // Set cookie with secure attributes
      const cookieValue = password || 'change_me';
      const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
      const cookieString = 
          'x-servertap-key=' + cookieValue + '; ' +
          'SameSite=Strict; ' +
          secure + 
          'Path=/; ' +
          'HttpOnly;';
      
      document.cookie = cookieString;
  }
    connect(wsurl,password) {
        this.ws = new WebSocket(wsurl);
        this.setCookie(password);
  
        this.ws.onopen = () => {
            logger.log("minecraft",'Opened connection');
            this.ws.send(`/say conectado `);
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        };
  
        this.ws.onmessage = (event) => {
            // logger.log("minecraft",'Message from server:', event.data);
            // document.getElementById('output').innerText += '\n' + event.data.replace(/\n/g, '<br>');
        };
  
        this.ws.onerror = (error) => {
            logger.log("minecraft",'WebSocket Error:', error);
        };
  
        this.ws.onclose = () => {
            logger.log("minecraft",'Closed connection');
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                logger.log("minecraft",`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,wsurl);
                setTimeout(() => this.connect(wsurl), this.reconnectInterval);
            } else {
                logger.log("minecraft",'Max reconnect attempts reached. Giving up.');
            }
        };
    }
  
    async sendCommand(command) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(command);
            logger.log("minecraft","Command sent:", command);
        } else {
            await this.waitForConnection();
            this.ws.send(command);
            logger.log("minecraft","Command sent after reconnecting:", command);
        }
    }
  
    async waitForConnection() {
        while (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
  }
  const ws = new WebSocketManager();
  function sendcommandmc(command) {
      ws.sendCommand(command);
      logger.log("minecraft","sendcommandmc", command);
  }
  function pluginconnect(data) {
    let defaultOptions = {
      host: data.ip || "localhost",
      port: data.port || 4567,
      password: data.password || "change_me",
    }
    const wsurl = `ws://${defaultOptions.host}:${defaultOptions.port}/v1/ws/console`;
    setTimeout(() => {
      ws.connect(wsurl, defaultOptions.password);
      ws.sendCommand(`/say conectado `);
    }, 1000);
  }
  export { sendcommandmc, htmlminecraft };
import DynamicTable, { EditModal } from '../components/renderfields.js';
import { getTranslation, translations } from '../translations.js';
import { UserInteractionTracker } from '../utils/utils.js'
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
        console.log("minecraftcallback",data,modifiedData);
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
trackerMultiple.addInteractionListener(async (interaction) => {
    const interacted = trackerMultiple.getAllInteractionsByArray(['click','touchstart','keydown','input']);
    if (interacted) {
      console.log("interacted",interacted);
      handlebotconnect("connect-plugin",minecraftdata);
      trackerMultiple.destroy();
    }
});
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
          console.log(`Tipo de evento desconocido: ${eventType}`,data);
    }
  }
  class WebSocketManager {
    constructor(maxReconnectAttempts = 10, reconnectInterval = 1000) {
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
            console.log('Opened connection');
            this.ws.send(`/say conectado `);
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        };
  
        this.ws.onmessage = (event) => {
            // console.log('Message from server:', event.data);
            // document.getElementById('output').innerText += '\n' + event.data.replace(/\n/g, '<br>');
        };
  
        this.ws.onerror = (error) => {
            console.log('WebSocket Error:', error);
        };
  
        this.ws.onclose = () => {
            console.log('Closed connection');
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,wsurl);
                setTimeout(() => this.connect(wsurl), this.reconnectInterval);
            } else {
                console.log('Max reconnect attempts reached. Giving up.');
            }
        };
    }
  
    async sendCommand(command) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(command);
            console.log("Command sent:", command);
        } else {
            await this.waitForConnection();
            this.ws.send(command);
            console.log("Command sent after reconnecting:", command);
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
      console.log("sendcommandmc", command);
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
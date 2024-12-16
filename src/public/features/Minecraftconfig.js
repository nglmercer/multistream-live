import { getTranslation, translations } from '../translations.js';
import { UserInteractionTracker, logger,showAlert,unflattenObject,flattenObject } from '../utils/utils.js'

const minecraftdata = localStorage.getItem("MinecraftPluginServer") ? JSON.parse(localStorage.getItem("MinecraftPluginServer")) : {
  ip: "localhost",
  port: 4567,
  username: "your minecraft username",
  password: "change_me",
}
const newminecraftform = document.createElement('dynamic-form');
newminecraftform.initialize(minecraftdata);
const minecraftarrayconfig = [
  { name: 'ip', type: 'text', value: 'localhost', placeholder: `IP`},
  { name: 'port', type: 'number', value: 4567, placeholder: `Puerto`},
  { name: 'username', type: 'text', placeholder: `Usuario`},
  { name: 'password', type: 'text', value: 'change_me', placeholder: `Contraseña`},
]
minecraftarrayconfig.forEach(data => {
newminecraftform
  .addField({
    type: data.type,
    name: data.name,
    label: data.name,
    value: data.value,
    placeholder: data.placeholder,
  })
});
newminecraftform.render().toggleDarkMode(true);
newminecraftform.setSubmitButton({
  label: 'Connect',
})
newminecraftform.addEventListener('form-submit', async (e) => {
  const data = e.detail;
  console.log('Datos modificados:', e.detail, data);
  localStorage.setItem("MinecraftPluginServer", JSON.stringify(data));
  handlebotconnect("connect-plugin",data);
});

newminecraftform.addEventListener('form-change', (e) => {
  //console.log('Form values changed:', e.detail);
  localStorage.setItem("MinecraftPluginServer", JSON.stringify(e.detail));
});
const htmlminecraft = newminecraftform
const trackerMultiple = new UserInteractionTracker({autoDestroy: true});
trackerMultiple.addInteractionListener(handlemcconnect);

function handlemcconnect(interaction) {
  logger.log("minecraft","handlemcconnect",interaction);
  handlebotconnect("connect-plugin",minecraftdata);
  
}
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
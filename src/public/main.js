import { showAlert, Counter, compareObjects, replaceVariables, logger, UserInteractionTracker, EvaluerLikes, LocalStorageManager } from './utils/utils.js';
import { Replacetextoread, addfilterword, existuserinArray,adduserinArray } from './features/speechconfig.js';
import { handleleermensaje } from './audio/tts.js';
import { getTranslation, translations } from './translations.js';
import { ActionsManager } from './features/Actions.js';
import { EventsManager } from './features/Events.js';
import { sendcommandmc } from './features/Minecraftconfig.js';
import  socketManager  from './server/socketManager.js';
//import { text } from 'express';
let client = tmi.client();
const overlayfilesmanager = new LocalStorageManager('filePaths');
const socket = io();
const userProfile = document.querySelector('#kicklogin');
userProfile.setConnectionStatus('offline');
userProfile.setPlatform("kick");
const userProfile2 = document.querySelector('#tiktoklogin');
userProfile2.setConnectionStatus('offline');
userProfile2.setPlatform("tiktok");
const userProfile3 = document.querySelector('#twitchlogin');
userProfile3.setConnectionStatus('offline');
userProfile3.setPlatform("twitch");

const loginelements = document.querySelectorAll('#kicklogin')
const loginelements2 = document.querySelectorAll('#tiktoklogin')
const loginelements3 = document.querySelectorAll('#twitchlogin')
loginelements.forEach(element => {
  element.setConnectionStatus('offline');
  element.setPlatform("kick");
  element.addEventListener('userConnected', (e) => {
      console.log('Usuario conectado:', e.detail.username);
      element.setConnectionStatus('away');
      //joinRoom(e.detail.username, e.detail.platform);
      //socket.emit('joinRoom', { uniqueId: e.detail.username, platform: "kick" });
    });
    element.addEventListener('userDisconnected', (e) => {
      console.log('Usuario desconectado' ,e);
  });
})
loginelements2.forEach(element => {
  element.setConnectionStatus('offline');
  element.setPlatform("tiktok");
  element.addEventListener('userConnected', (e) => {
      console.log('Usuario conectado:', e.detail.username);
      element.setConnectionStatus('away');
      //joinRoom(e.detail.username, e.detail.platform);
      //socket.emit('joinRoom', { uniqueId: e.detail.username, platform: "tiktok" });
    });
    element.addEventListener('userDisconnected', (e) => {
      console.log('Usuario desconectado' ,e);
  });
})
loginelements3.forEach(element => {
  element.setConnectionStatus('offline');
  element.setPlatform("twitch");
  element.addEventListener('userConnected', (e) => {
      console.log('Usuario conectado:', e.detail.username);
      element.setConnectionStatus('away');
      //joinRoom(e.detail.username, e.detail.platform);
      changeChannel(e.detail.username, "#", client);
    });
    element.addEventListener('userDisconnected', (e) => {
      console.log('Usuario desconectado' ,e);
  });
})
function joinRoom(roomid, platform = 'tiktok') {
    const roomId = roomid;
    socket.emit('joinRoom', { uniqueId: roomId, platform: platform });
    //console.log("joinRoom",{ uniqueId: roomId, platform: platform })
}
function getAvatarUrl(avatarData, preferredSize = 'large') {
  // Mapeo de nombres de tamaños a keys del objeto
  const sizeMap = {
      'large': 'avatar_large',
      'medium': 'avatar_medium',
      'thumb': 'avatar_thumb'
  };

  // Orden de fallback para los tamaños
  const sizeOrder = ['large', 'medium', 'thumb'];
  
  // Si se proporciona un tamaño preferido, reordenar para intentar ese primero
  if (preferredSize && sizeOrder.includes(preferredSize)) {
      const index = sizeOrder.indexOf(preferredSize);
      sizeOrder.unshift(...sizeOrder.splice(index, 1));
  }

  // Intentar obtener URL del tamaño preferido, con fallback a otros tamaños
  for (const size of sizeOrder) {
      const avatarKey = sizeMap[size];
      const avatarInfo = avatarData[avatarKey];

      if (avatarInfo && 
          avatarInfo.url_list && 
          Array.isArray(avatarInfo.url_list) && 
          avatarInfo.url_list.length > 0) {
          // Preferir WebP si está disponible
          const webpUrl = avatarInfo.url_list.find(url => url.endsWith('.webp'));
          return webpUrl || avatarInfo.url_list[0];
      }
  }

  return ''; // Retornar string vacío si no se encuentra ninguna URL
}
class GetAvatarUrlKick {
  static async getInformation(username) {
      const API = `https://kick.com/api/v1/users/${username}`;
      
      // Verificar si los datos ya están almacenados y coinciden con el usuario
      if (localStorage.getItem("Lastuserinfo") && localStorage.getItem("Lastusername") === username) {
          return JSON.parse(localStorage.getItem("Lastuserinfo"));
      }

      try {
          const response = await fetch(API, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          
          if (!response.ok) {
              throw new Error(`Error al obtener datos: ${response.statusText}`);
          }

          const jsonObject = await response.json();
          
          // Guardar los datos una vez resueltos en localStorage
          localStorage.setItem("Lastusername", username); // Guardar el nombre de usuario sin JSON.stringify
          localStorage.setItem("Lastuserinfo", JSON.stringify(jsonObject));

          console.log('JSON Object:', jsonObject);
          return jsonObject;

      } catch (error) {
          console.error('Error al obtener la información:', error);
      }
  }

  static async getProfilePic(username) {
      // Obtener la información y luego devolver el campo "profilepic"
      const userInfo = await GetAvatarUrlKick.getInformation(username);
      return userInfo ? userInfo.profilepic : null;
  }
}


const trackerMultiple = new UserInteractionTracker({
  // Opcional: destruir automáticamente después de la primera interacción
  autoDestroy: true
});
trackerMultiple.addInteractionListener(handleUserInteraction);
function handleUserInteraction(){
  if (userProfile.state.connected) {
    userProfile.setConnectionStatus('away');
    joinRoom(userProfile.state.username, userProfile.state.platform);
    //if (userProfile.state.platform === 'kick') userProfile.setProfileImage(await GetAvatarUrlKick.getProfilePic(userProfile.state.username));
  };
  if (userProfile2.state.connected) {
    userProfile2.setConnectionStatus('away');
    joinRoom(userProfile2.state.username, userProfile2.state.platform);
  };
}

await client.connect()
.then(() => {
    const hashVal = window.location.hash.slice(1);
    if (hashVal.length) {changeChannel(hashVal, "#", client);}
})
.catch(e => console.error('No se pudo conectar a Twitch:', e));  

const events = ['ready', 'ChatMessage', 'Subscription', 'disconnected', 'error', 'allromuser', 'connected'];
const tiktokLiveEvents = [
  'chat', 'gift', 'connected', 'disconnected',
  'websocketConnected', 'error', 'member', 'roomUser',
  'like', 'social', 'emote', 'envelope', 'questionNew',
  'subscribe', 'follow', 'share', 'streamEnd'
];
const eventstwitch = ["emote","emotes","chat","ban","clear","color","commercial","deletemessage","host","unhost","cheer","bits","cheers",
  "connected","disconnected","maxreconnect","reconnect","action","message","emotesets","whisper","mod","unmod","r9kbeta","r9kmode","r9kbetaoff",
  "r9kmodeoff","subscribers","subscriber","subscribersoff","mods","vips","ban","clear","color","commercial","deletemessage","host","unhost",
  "join","part","subs_on","subs_off","slow","slowmode","slowoff","sub","resub","subgift","anonsubgift","submysterygift","anonsubmysterygift",
  "primepaidupgrade","giftpaidupgrade","anongiftpaidupgrade","raided","newanchor","raid","ritual",
];
const counterchat = new Counter(0, 1000);
const countergift = new Counter(0, 1000);
const countershare = new Counter(0, 1000);
const counterlike = new Counter(0, 1000);
const counterfollow = new Counter(0, 1000);
const countermember = new Counter(0, 1000);
const wss = document.querySelector('ws-status');

wss.addEventListener('ws-connected', () => {
  console.log('ws conectado');
});

wss.addEventListener('ws-message', (event) => {
  console.log('Mensaje recibido:', event);
  let parsedData = JSON.parse(event.data); // Parse the JSON data
  tiktokLiveEvents.forEach(event => {
    tiktokhandlerdata(event,parsedData.data)
  });
});
wss.addEventListener('ws-disconnected', () => {
  console.log('ws desconectado');
});
wss.addEventListener('ws-error', (event) => {
  console.log('Error de conexión:', event.detail);
});
events.forEach(event => {
    socket.on(event, async (data) => {
        Readtext(event, data);
        localStorage.setItem('last'+event, JSON.stringify(data));
        console.log("event",event,data)
        
        switch (event) {
            case 'ready':
              showAlert('success', `Connected`, 3000,data)
              console.log("ready",data)
                userProfile.setProfileImage(await GetAvatarUrlKick.getProfilePic(data.username));
                break;
            case 'ChatMessage':
                const newdata = await mapChatMessagetochat(data);
                HandleAccionEvent('chat',newdata)
                handlechat(newdata);
                Readtext('chat',newdata);
                break;
            default:
              console.log("event",event,data)
                break;
        }
/*         document.getElementById('lasteventParse').innerHTML = JSON.stringify(data);
 */  });
});
tiktokLiveEvents.forEach(event => {
    socket.on(event, async (data) => {
      tiktokhandlerdata(event,data)
 });
});
function tiktokhandlerdata(event,data) {
  console.log("event",event,data)
  Readtext(event, data);
  localStorage.setItem('last'+event, JSON.stringify(data));
  //console.log("event",event,data)
  switch (event) {
    case 'chat':
      HandleAccionEvent('chat',data);
      handlechat(data);
      break;
    case 'gift':
      handlegift(data);
      HandleAccionEvent('gift',data);
      console.log("gift",data)
      break;
    case 'member':
      HandleAccionEvent('welcome',data)
      const eventmember = webcomponentevent(data,defaultEventsMenu,{type:"text",value:'member', class: "gold"});
      appendMessage(eventmember,"eventscontainer",true);
      console.log("member",data)
      break;
    case 'roomUser':
      console.log("roomUser",data)
      break;
    case 'like':
      HandleAccionEvent(event,data, 'isInRange')
      const eventlike = webcomponentevent(data,defaultEventsMenu,{type:"text",value:'like', class: "gold"});
      appendMessage(eventlike,"eventscontainer",true);
      console.log("like",data)
      break;
    case 'follow':
      HandleAccionEvent('follow',data);
      const eventfollow = webcomponentevent(data,defaultEventsMenu,{type:"text",value:'follow', class: "gold"});
      appendMessage(eventfollow,"eventscontainer",true);
      console.log("follow",data)
      break;
    case 'share':
      const eventshare = webcomponentevent(data,defaultEventsMenu,{type:"text",value:'share', class: "gold"});
      appendMessage(eventshare,"eventscontainer",true);
      console.log("share",data)
      break;
    case 'connected':
      if (data.roomInfo?.owner) localStorage.setItem('ownerdata',JSON.stringify(data.roomInfo.owner));
      const lastownerdata = localStorage.getItem('ownerdata');
      if (lastownerdata) userProfile2.setProfileImage(getAvatarUrl(JSON.parse(lastownerdata)));
      console.log(event, data);
      showAlert('success', `Connected`,3000,data)
      break;
    default:
      HandleAccionEvent(event,data)
      console.log("event",event,data)
        break;
  }
}
eventstwitch.forEach(event => {
  client.on(event, (...args) => {
    const lastevent = "lastevent" + event;
    localStorage.setItem(lastevent, JSON.stringify(args));
    localStorage.setItem("lastevent", event);
    const mapdata = mapEvent(event, args);
    const arraylinkstoobject = mapdata.emotes && mapdata.emotes.length > 0 ? mapdata.emotes.map(link => ({ value: link, type: "image" })) : []
    switch (event) {
      case "chat":
        console.log("mapdata emotes",mapdata,mapEvent(event, args),arraylinkstoobject)
          handlechat(mapdata,arraylinkstoobject[0]);
          Readtext(event,mapdata);
          HandleAccionEvent("chat",mapdata);
          break;
      case "cheer":
          handlegift(mapdata);
          Readtext("gift",mapdata);
          HandleAccionEvent("bits",mapdata);
          break;
      default:
        console.log("default map",event,mapEvent(event, args),arraylinkstoobject);
      }
  });
});
async function changeChannel(newChannel, hash = "#", client) { 
  if (!newChannel || newChannel.length <= 2) return;

  // Asegúrate de que el cliente esté conectado
  if (!client.readyState) {
    await client.connect()
    .then(() => {
        const hashVal = window.location.hash.slice(1);
        if (hashVal.length) {
            // Cambia de canal solo si ya estás conectado
            changeChannel(hashVal, "#", client);
        }
          })
      .catch(e => console.error('No se pudo conectar a Twitch:', e));
      console.error('Error: No conectado al servidor.');
      return;
  }

  window.location.hash = newChannel.includes(hash) ? newChannel : '#' + newChannel;

  try {
      // Sal de todos los canales actuales antes de unirte a uno nuevo
      await Promise.all(client.getChannels().map(oldChannel => client.part(oldChannel)));
      const joinedChannel = await client.join(newChannel);
      console.log('Unido al canal:', joinedChannel[0]);
  } catch (e) {
      console.error('Error al cambiar de canal:', e);
  }
}
client.on('connected', (addr, port) => {
  console.log(`Conectado a ${addr}:${port}`);
});
function mapEvent(eventType, eventData) {

  switch (eventType) {
      case "chat":
          return baseData(eventData[1], 2, eventData);
      case "cheer":
          return { ...baseData(eventData[1], 2, eventData), bits: eventData[1].bits };
      case "join":
          return { uniqueId: eventData[1], nickname: eventData[1], isMod: !eventData[2], isSub: !eventData[2] };
      case "sub":
          return baseData(eventData[4],null, eventData);
      case "resub":
          return { ...baseData(eventData[5], null , eventData), nickname: eventData[3], uniqueId: eventData[3] };
      case "subgift":
          return { ...baseData(eventData[5], null , eventData), nickname: eventData[3], uniqueId: eventData[3] };
      case "submysterygift":
          return baseData(eventData[4],null, eventData);
      case "primepaidupgrade":
          return baseData(eventData[3], null, eventData);
      case "giftpaidupgrade":
          return baseData(eventData[4], null, eventData);
      case "raided":
          return { ...baseData(eventData[3], null, eventData), nickname: eventData[1], uniqueId: eventData[1] };
      default:
          return eventData;
  }
}
function baseData(data, commentIndex = null, eventData) {
  let rawcomment = commentIndex !== null ? eventData[commentIndex] : undefined || data["system-msg"];
  return {
      uniqueId: data.username || eventData[1],
      nickname: data["display-name"] || eventData[1],
      isMod: data.mod,
      isSub: data.subscriber,
      isVip: data.vip,
      comment: getMessagestring(rawcomment, data).message,
      emotes: getMessagestring(rawcomment, data).emotes,
      data
  };
}
function getMessagestring(message, { emotes }) {
  if (!emotes) return { message: message, emotes: [] }; // Retorna mensaje original y un array vacío si no hay emotes

  // Array para almacenar los links de los emotes
  const emoteLinks = [];

  // Iterar sobre los emotes para acceder a los IDs y posiciones
  Object.entries(emotes).forEach(([id, positions]) => {
    // Usar solo la primera posición para encontrar la palabra clave del emote
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    // Agregar el link del emote al array
    emoteLinks.push(`https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`);

    // En caso de error, agregar el emote de fallback
    const fallbackLink = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/animated/dark/1.0`;
    emoteLinks.push(fallbackLink);
    
    // Reemplazar la palabra clave del emote con un espacio en blanco
    message = message.replace(stringToReplace, ''); // Reemplaza el emote en el mensaje
  });

  // Retornar el mensaje sin emotes y el array de links de emotes
  return { message: message.trim(), emotes: emoteLinks }; // Elimina espacios en blanco innecesarios
}
async function mapChatMessagetochat(data) {
  return {
    comment: data.content,
    type: data.type,
    uniqueId: data.sender?.username,
    nickname: data.sender?.slug,
    color: data.sender?.indentity?.color,
    profilePictureUrl: await GetAvatarUrlKick.getProfilePic(data.sender?.username),
  }
}

const newtextcontent = {
  user: {
    name: "username",
    value: "uniqueId comment",
  },
  content: [
    { type: 'text', value: "uniqueId = username" },
    { type: 'text', value: "comentario = comment" },
  ],
}
const newnumbercontent = {
  user: {
    name: "username",
    value: "texto de prueba123123123",
  },
  content: [
    { type: 'text', value: "UniqueId" },
    { type: 'text', value: "1 = repeatCount" },
    { type: 'text', value: "rose = giftname" },
  ],
}
const neweventcontent = {
  user: {
    name: "username",
    value: "UniqueId",
  },
  content: [
    { type: 'text', value: "UniqueId" },
    { type: 'text', value: getTranslation('followed') },
  ],
}
const splitfilterwords = (data) => {
  console.log("Callback 1 ejecutado:", data);
  if (data?.comment) {
    const comments = data.comment.match(/.{1,10}/g) || [];
    console.log("comments", comments);
    comments.forEach(comment => {
      if (comment.length < 6) return;
      addfilterword(comment);
    });
  }
};
const filterwordadd = (data) => {
  console.log("Callback 2 ejecutado:", data);
  if (data?.comment && data?.comment.length > 6) {
    addfilterword(data.comment);
  }
}
// Menú genérico
const createMenu = (text, callback) => ({ text, callback });

// Callbacks reutilizables
const callbacks = {
  splitFilterWords: (messageData) => {
    console.log("Split Filter Words clicked", messageData);
    splitfilterwords(messageData.user.value);
  },
  filterWordAdd: (messageData) => {
    console.log("Filter Word Add clicked", messageData);
    filterwordadd(messageData.user.value);
  },
  blockUser: (messageData) => {
    console.log("Block User clicked", messageData);
    adduserinArray(messageData.user.name);
  },
  moreInfo: (messageData) => {
    console.log("More Info clicked", messageData);
  },
  respond: (messageData) => {
    console.log("Respond clicked", messageData);
  },
};

// Menús
const defaultMenuChat = [
  createMenu("filtrar comentarios - dividir", callbacks.splitFilterWords),
  createMenu("filtrar comentario", callbacks.filterWordAdd),
  createMenu("Bloquear usuario", callbacks.blockUser),
];

const defaultEventsMenu = [
  createMenu("mas información", callbacks.moreInfo),
];

const giftMenu = [
  createMenu("Responder", callbacks.respond),
];

// Utilidades
const timeNow = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};

async function lastElement() {
  console.log("lastelement");

  const messageData = JSON.parse(localStorage.getItem("lastChatMessage"));
  let newWebComponentChat = null;

  if (messageData) {
    const newData = await mapChatMessagetochat(messageData);
    HandleAccionEvent("chat", newData);
    console.log("mapChatMessagetochat", newData);

    newWebComponentChat = webcomponentchat(newData, defaultMenuChat, {
      type: "text",
      value: timeNow(),
      class: "bottom-right-0",
    });
  }

  const newMessage1 = webcomponenttemplate(newtextcontent);
  const newMessage2 = webcomponenttemplate(newnumbercontent, giftMenu);
  const newMessage3 = webcomponenttemplate(neweventcontent, giftMenu);

  if (newWebComponentChat) appendMessage(newWebComponentChat, "chatcontainer");
  appendMessage(newMessage1, "chatcontainer");
  appendMessage(newMessage2, "giftcontainer");
  appendMessage(newMessage3, "eventscontainer");
}

function appendMessage(data, container, autoHide = false) {
  const elementWebComponent = document.getElementById(container);
  console.log("appendMessage", data, container, autoHide);
  elementWebComponent.addMessage(data, autoHide);
}

lastElement();

const arrayevents = ["like", "gift", "chat"];

// Funciones de manejo específicas
const handlechat = async (data,aditionaldata = {type:"text",value:timenow(), class: "bottom-right-0"}) => {
  const newhtml = webcomponentchat(data,defaultMenuChat,aditionaldata);
  appendMessage(newhtml,"chatcontainer");
  console.log("chat",data)
}
const handlegift = async (data) => {
  const newhtml = webcomponentgift(data,defaultMenuChat,{type:"text",value:timenow(), class: "bottom-right-0"});
  appendMessage(newhtml,"giftcontainer");
}
function webcomponentchat(data,optionmenuchat = [],additionaldata = {}) {
  return {
    user: {
      name: data.uniqueId,
      photo: data.profilePictureUrl,
      value: data.comment,
      data: data,
    },
    content: [
      { type: 'text', value: data.uniqueId },
      { type: 'text', value: data.comment },
      additionaldata
    //  { type: 'image', value: data.profilePictureUrl }
    ],
    menu: {
      options: optionmenuchat
    }
  };
}
function webcomponentgift(data,optionmenu = [],additionaldata={}){
  return {
    user : {
      name: data.uniqueId,
      photo: data.profilePictureUrl,
      value: data.giftName,
      data: data,
    },
    content: [
      { type: 'text', value: data.uniqueId },
      { type: 'text', value: data.repeatCount },
      { type: 'text', value: data.giftName },
      { type: 'image', value: data.giftPictureUrl },
      additionaldata
    ],
    menu: {
      options: optionmenu
    }
  }
}
function webcomponentevent(data,optionmenu = [],additionaldata={}){
  return {
    user : {
      name: data.uniqueId,
      photo: data.profilePictureUrl,
      value: data.comment,
      data: data,
    },
    content: [
      { type: 'text', value: data.uniqueId },
      additionaldata
    ],
    menu: {
      options: optionmenu
    }
  }
}
function webcomponenttemplate(template = {}, optionmenuchat = defaultMenuChat, newdata = {},additionaldata={}){
  if (template && template.user && template.content && template.content.length > 0) {
    return { ...template, menu: {options: optionmenuchat}};
  }
  return {
    user : newdata,
    content: [
      { type: 'text', value: data.comment },
      additionaldata
    //  { type: 'image', value: data.profilePictureUrl }
    ],
    menu: {
      options: optionmenuchat
    }
  };
}
let lastcomment = ''
function Readtext(eventType = 'chat',data) {
  // especial case if roomuser is welcome
  if (data.uniqueId && existuserinArray(data.uniqueId)) { showAlert('info',`${getTranslation('blacklistuser')} ${data.uniqueId} `); return; }
  if (eventType === 'member') eventType = 'welcome';
  if (eventType === 'chat') {
    const removeHttpLinksRegex = (text) => {
      return text.replace(/(?:^|\s)https?:\/\/\S+/gi, ' link').trim();
  };  
    data.comment = removeHttpLinksRegex(data.comment);
    console.log("data.comment",data.comment,removeHttpLinksRegex(data.comment));
    if(data.comment === lastcomment) {
      return;
    } 
    lastcomment = data.comment;
  }
  Replacetextoread(eventType, data);
}
//Readtext('chat',{uniqueId:"nightbot",comment:"hola  https://www.google.com mira esto"});
const generateobject = (eventType,comparison ) => {
  const comparisonstring = comparison === true ? "isEqual" : comparison
  const keysToCheck = arrayevents.includes(eventType)  ? [{ key: eventType, compare: comparisonstring },{ key: 'eventType', compare: 'isEqual' }] : [{ key: 'eventType', compare: 'isEqual' }]
  console.log("generateobject",eventType,comparisonstring,keysToCheck)
  return keysToCheck
};
async function HandleAccionEvent(eventType,data,comparison = 'isEqual',includetrue = false) {
  const keysToCheck = generateobject(eventType,comparison)
  const callbackFunction = (matchingObject, index, results) => {
    console.log(`Objeto coincidente encontrado en el índice ${index}:`, matchingObject, results);
  };
  const eventslist = {
    chat: data.comment,
    gift: data.giftId,
    like: data.likeCount,
    eventType: eventType,
  }
  const results = compareObjects(eventslist, await EventsManager.getAllData(), keysToCheck, callbackFunction,includetrue);
  console.log('debug',"results HandleAccionEvent",results)
  if (results.validResults.length >= 1 ) {
    results.validResults.forEach(result => {
      processAction(result,data)
    });
  }
}
function processAction(data,userdata) {
  console.log("procesar accion",data)
  if (data.Actions.length > 0) {
    data.Actions.forEach(action => {
      Actionsprocessmanager(action,userdata)
    });
  }
}
const processActioncallbacks = {
  minecraft: (data,userdata) => handleMinecraft(data,userdata),
  tts: (data,userdata) => handletts(data,userdata),
  overlay: (data,userdata) => handleOverlay(data,userdata),
  keypress: (data,userdata) => handleKeypress(data,userdata),
}
async function Actionsprocessmanager(id,userdata) {
  console.log("accionesprocessmanager",id)
  const action = await ActionsManager.getDataById(id)
  console.log("accionesprocessmanager",action)
  if (action) {
    Object.keys(processActioncallbacks).forEach(key => {
      if (action[key]) {
          console.log("accionesprocessmanager",action[key])
        processActioncallbacks[key](action[key],userdata)
      }
    });
  }
}
function handleMinecraft(data,userdata) {
  if (data?.check) {
    console.log("minecraft check",data)
    const replacecommand = replaceVariables(data.command,userdata);
    console.log("replacecommand",replacecommand)
    sendcommandmc(replacecommand);
  } else {
    console.log("minecraft no check",data)
  }
}
function handletts(data,userdata) {
  if (data?.check) {
    console.log("tts check",data)
    const replacecommand = replaceVariables(data.text,userdata);
    console.log("replacecommand",replacecommand)
    handleleermensaje(replacecommand);
  } else {
    console.log("tts no check",data)
  }
}
async function handleOverlay(data, userdata) {
  console.log("overlay", data, userdata);

  if (data?.check) {
    const content = replaceVariables(data.content, userdata);
    console.log("content", content);

    if (data.src && data.src.length > 0) {
      // Crear un array inicial para los elementos que no dependen de promesas
      let srcArray = [];

      if (userdata.profilePictureUrl) {
        srcArray.push({
          nombre: userdata.nickname || userdata.uniqueId,
          path: userdata.profilePictureUrl || userdata.imageUrl || "https://picsum.photos/200/200",
          mediaType: 'image/png',
        });
      }

      if (Array.isArray(data.src)) {
        // Crear un array de promesas para resolver
        const srcPromises = data.src.map(async (src) => {
          const filedata = await overlayfilesmanager.get(src);
          return {
            nombre: filedata.nombre,
            path: filedata.path,
            mediaType: filedata.mediaType || filedata.type,
          };
        });

        // Resolver las promesas y agregar sus resultados al array inicial
        const resolvedSrcs = await Promise.all(srcPromises);
        srcArray = srcArray.concat(resolvedSrcs);
      } else {
        // Procesar un único src
        const filedata = await overlayfilesmanager.get(data.src);
        srcArray.push({
          nombre: filedata.nombre,
          path: filedata.path,
          mediaType: filedata.mediaType || filedata.type,
        });
      }

      // Crear el mapconfig con todos los elementos en src
      const mapconfig = {
        template: 'multi-grid',
        content: content || srcArray[0]?.nombre || srcArray[0]?.path,
        duration: data.duration * 1000,
        src: srcArray,
      };

      // Emitir el overlay con todos los elementos agrupados
      socketManager.emitMessage('create-overlay', { mapconfig, roomId: 'sala1' });
      console.log("overlay check", data, mapconfig);
    }
  }
}
function handleKeypress(data,userdata) {
  if (data?.check) {
      socketManager.emitMessage("presskey",data.key);
  } else {
    console.log("keypress no check",data)
  }
}
function mapdatatooverlay(data,duration,content) {
  const config = {
    template: 'multi-grid',
    content: content || data.nombre || data.path,
    duration: duration * 1000,
    src: [
      {
        nombre: data.nombre,
        path: data.path,
        mediaType: data.mediaType || data.type,
      },
    ],
  };
  return config;
}
// processActioncallbacks
/* setTimeout(() => {
  HandleAccionEvent('chat',{giftId:5655, comment:"qweqweqwe",likeCount: 10,uniqueId: "123123",profilePictureUrl: "https://picsum.photos/200/200",Actions: [],id: undefined},"isEqual",true)
}, 1000); */
const preview = document.getElementById('iframeweb');
preview.setLink('http://localhost:9000/overlaya.html');
preview.addEventListener('linkchanged', (e) => {
    console.log('linkchanged', e);
});
// Webhook send data.event and data.data
const sendWebhookData = async (url,action, data) => {
  const payload = { event: action, payload: data };

  try {
      const response = await fetch(url || '', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Resultado:', result);
  } catch (error) {
      console.error('Error:', error);
  }
};
import { Counter, compareObjects, replaceVariables, logger, UserInteractionTracker, EvaluerLikes, LocalStorageManager } from './utils/utils.js';
import { ChatContainer, ChatMessage, showAlert } from './components/message.js';
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
      socket.emit('joinRoom', { uniqueId: e.detail.username, platform: "kick" });
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
      socket.emit('joinRoom', { uniqueId: e.detail.username, platform: "tiktok" });
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


const trackerMultiple = new UserInteractionTracker();
trackerMultiple.addInteractionListener(async event => {
  try {
  const interacted = trackerMultiple.getAllInteractionsByArray([
    'click', 
    'touchstart', 
    'keydown',
  ]);
  
  //userProfile.setConnectionStatus('offline');
  if (interacted) {
    console.log('Usuario ha interactuado se conectara');
    if (userProfile.state.connected) {
      userProfile.setConnectionStatus('away');
      joinRoom(userProfile.state.username, userProfile.state.platform);
      //if (userProfile.state.platform === 'kick') userProfile.setProfileImage(await GetAvatarUrlKick.getProfilePic(userProfile.state.username));
    };
    if (userProfile2.state.connected) {
      userProfile2.setConnectionStatus('away');
      joinRoom(userProfile2.state.username, userProfile2.state.platform);
    };
    trackerMultiple.destroy()
  }
} catch (error) {
  console.error('Error al detectar interacción:', error);
}
});
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

events.forEach(event => {
    socket.on(event, async (data) => {
        Readtext(event, data);
        localStorage.setItem('last'+event, JSON.stringify(data));
        //console.log("event",event,data)
        
        switch (event) {
            case 'ready':
              showAlert('success', `Connected`);
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
            const eventmember = webcomponentevent(data,defaulteventsmenu,{type:"text",value:'member', class: "gold"});
            appendmessage2(eventmember,"eventscontainer",true);
            console.log("member",data)
            break;
          case 'roomUser':
            console.log("roomUser",data)
            break;
          case 'like':
            HandleAccionEvent(event,data, 'isInRange')
            const eventlike = webcomponentevent(data,defaulteventsmenu,{type:"text",value:'like', class: "gold"});
            appendmessage2(eventlike,"eventscontainer",true);
            console.log("like",data)
            break;
          case 'follow':
            HandleAccionEvent('follow',data);
            const eventfollow = webcomponentevent(data,defaulteventsmenu,{type:"text",value:'follow', class: "gold"});
            appendmessage2(eventfollow,"eventscontainer",true);
            console.log("follow",data)
            break;
          case 'share':
            const eventshare = webcomponentevent(data,defaulteventsmenu,{type:"text",value:'share', class: "gold"});
            appendmessage2(eventshare,"eventscontainer",true);
            console.log("share",data)
            break;
          case 'connected':
            if (data.roomInfo?.owner) localStorage.setItem('ownerdata',JSON.stringify(data.roomInfo.owner));
            const lastownerdata = localStorage.getItem('ownerdata');
            if (lastownerdata) userProfile2.setProfileImage(getAvatarUrl(JSON.parse(lastownerdata)));
            console.log(event, data);
            showAlert('success', `Connected`);
            break;
          default:
            HandleAccionEvent(event,data)
            console.log("event",event,data)
              break;
        }
/*         document.getElementById('lasteventParse').innerHTML = JSON.stringify(data);
 */  });
});
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
/* const textcontent = {
    content: {
      1: ["text", getTranslation('username'),"white"],
      2: ["text", "uniqueId","silver"],
      3: ["text", "comentario = ","gold"],
      4: ["text", "comment","gold"],
      // 4: ["url", "https://example.com", "blue", "Click para ir a mi perfil"]
  
    },
    comment: "texto de prueba123123123",
    // data: {
    //   comment: "texto de prueba123123123",
    //   number: 123,
    //   text: "text",
    // }
  } */
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
/* const numbercontent = {
  content: {
    1: ["text", getTranslation('username'),"white"],
    2: ["text", "uniqueId","silver"],
    3: ["number", 1,"gold"],
    4: ["text", "= repeatCount","gold"],
    5: ["text", "giftname = rose","cyan"],
  },
  data: {
    number: 123,
    text: "text",
  }
} */
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
/* const eventcontent = {
  content: {
    1: ["text", "UniqueId","white"],
    2: ["text", getTranslation('followed'),"yellow"],
  },
  data: {
    number: 123,
    text: "text",
  }
} */
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

const defaultmenuchat = [
  {
    text: 'filtrar comentarios - dividir',
    callback: (messageData) => {
      console.log('Responder clicked', messageData);
      const { user, content } = messageData;
      const { name, value, photo,data } = user;
      console.log('Responder clicked', user, content);
      splitfilterwords(value);
    }
  },
  {
    text: 'filtrar comentario',
    callback: (messageData) => {
      console.log('Responder clicked', messageData);
      const { user, content } = messageData;
      const { name, value, photo,data } = user;
      console.log('Responder clicked', user, content);
      filterwordadd(value);
    }
  },
  {
    text: 'Bloquear usuario',
    callback: (messageData) => {
      console.log('Responder clicked', messageData);
      const { user, content } = messageData;
      const { name, value, photo,data } = user;
      console.log('Responder clicked', user, content);
      adduserinArray(name);
      // create functio to block user example blockuser(name);
    }
  }
];
const defaulteventsmenu = [
  {
    text: 'mas información',
    callback: (messageData) => {
      console.log('Responder clicked', messageData);
      const { user, content } = messageData;
      const { name, value } = user;
      console.log('Responder clicked', user, content);
      // create functio to block user example blockuser(name);
    }
  }
]
const giftmenu = [
  {
    text: 'Responder',
    callback: (messageData) => {
      console.log('Responder clicked', messageData);
    }
  }
]
const timenow = () => {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return timeString;
}
async function lastelement(){
  const messagedata = JSON.parse(localStorage.getItem('lastChatMessage'));
  let newwebcomponentchat = null;
  if (messagedata) {
    const newdata = await mapChatMessagetochat(messagedata);
    HandleAccionEvent('chat',newdata)
    console.log("mapChatMessagetochat",newdata)
    newwebcomponentchat = webcomponentchat(newdata,defaultmenuchat,{type:"text",value:timenow(), class: "bottom-right-0"});
  }
  const newmessage1 = webcomponenttemplate(newtextcontent);
  const newmessage2 = webcomponenttemplate(newnumbercontent,giftmenu);
  const newmessage3 = webcomponenttemplate(neweventcontent,giftmenu);
  
  if(newwebcomponentchat) appendmessage2(newwebcomponentchat,"chatcontainer");
  appendmessage2(newmessage1,"chatcontainer");
  appendmessage2(newmessage2,"giftcontainer");
  appendmessage2(newmessage3,"eventscontainer");

/* function returnchatelement(data) {
  const elementwebcomponent = document.createElement('chat-message');
  elementwebcomponent.setMessageData(data);
  return elementwebcomponent;
} */
}
lastelement();

function appendmessage2(data,container,autohide = false) {
  const elementwebcomponent = document.getElementById(container);
  elementwebcomponent.addMessage(data,autohide);
}
const arrayevents = ["like", "gift", "chat"];

// Funciones de manejo específicas
const handlechat = async (data,aditionaldata = {type:"text",value:timenow(), class: "bottom-right-0"}) => {
  const newhtml = webcomponentchat(data,defaultmenuchat,aditionaldata);
  appendmessage2(newhtml,"chatcontainer");
  console.log("chat",data)
}
const handlegift = async (data) => {
  const newhtml = webcomponentgift(data,defaultmenuchat,{type:"text",value:timenow(), class: "bottom-right-0"});
  appendmessage2(newhtml,"giftcontainer");
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
function webcomponenttemplate(template = {}, optionmenuchat = defaultmenuchat, newdata = {},additionaldata={}){
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
  return arrayevents.includes(eventType) 
    ? [{ key: eventType, compare: comparison },{ key: 'eventType', compare: 'isEqual' }] 
    : [{ key: 'eventType', compare: 'isEqual' }]
};
async function HandleAccionEvent(eventType,data,comparison = 'isEqual') {
  const keysToCheck = generateobject(eventType,comparison)
  const callbackFunction = (matchingObject, index, results) => {
    console.log(`Objeto coincidente encontrado en el índice ${index}:`, matchingObject, results);
  };
  const results = compareObjects(data, await EventsManager.getAllData(), keysToCheck, callbackFunction);
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
/*   minecraft: (data,userdata) => handleMinecraft(data,userdata),
  tts: (data,userdata) => handletts(data,userdata), */
  overlay: (data,userdata) => handleOverlay(data,userdata),
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
function handleOverlay(data,userdata) {
  console.log("overlay",data,userdata)
  if (data?.check) {
    if (data.src && data.src.length > 0) {
      if (Array.isArray(data.src)) {
        data.src.forEach(async (src) => {
          const filedata = await overlayfilesmanager.get(src);
          console.log("overlay check",data,filedata)
        });
      } else {
        const filedata = overlayfilesmanager.get(data.src);
        console.log("overlay check",data,filedata)
      }
    }
/*     const mapconfig = data;
    socketManager.emitMessage('create-overlay', {mapconfig,roomId:'sala1'}); */
  }
}
// processActioncallbacks
setTimeout(() => {
  HandleAccionEvent('gift',{nombre: "coloca tu nombre",eventType: "gift",chat: "default text",like: 10,gift: 5655,Actions: [8],id: undefined})
}, 1000);
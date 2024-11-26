import { Counter, compareObjects, replaceVariables, logger, UserInteractionTracker, EvaluerLikes } from './utils/utils.js';
import { ChatContainer, ChatMessage, showAlert } from './components/message.js';
import { Replacetextoread, addfilterword } from './features/speechconfig.js';
import { handleleermensaje } from './audio/tts.js';
import { getTranslation, translations } from './translations.js';
import { ActionsManager } from './features/Actions.js';
import { EventsManager } from './features/Events.js';
import { sendcommandmc } from './features/Minecraftconfig.js';
const socket = io();
const userProfile = document.querySelector('user-profile');
console.log(userProfile.state);
userProfile.setConnectionStatus('offline');
if (userProfile.state.connected) {
  const trackerMultiple = new UserInteractionTracker();
  trackerMultiple.addInteractionListener(event => {
    const interacted = trackerMultiple.getAllInteractionsByArray([
      'click', 
      'touchstart', 
      'keydown',
    ]);
    
    
    if (interacted) {
      console.log('Usuario ha interactuado se conectara');
      joinRoom(userProfile.state.username);
      trackerMultiple.destroy()
    }
  });
  
    userProfile.setConnectionStatus('away');
}
// Escuchar eventos
userProfile.addEventListener('userConnected', (e) => {
    console.log('Usuario conectado:', e.detail.username, e);
    userProfile.setConnectionStatus('away');
    joinRoom(e.detail.username);
  }); 

userProfile.addEventListener('userDisconnected', (e) => {
    console.log('Usuario desconectado' ,e);
});
function joinRoom(roomid) {
    const roomId = roomid || document.getElementById('roomId').value;
    socket.emit('joinRoom', { uniqueId: roomId });
}
const events = ['chat', 'gift', 'connected', 'disconnected',
    'websocketConnected', 'error', 'member', 'roomUser',
    'like', 'social', 'emote', 'envelope', 'questionNew',
    'subscribe', 'follow', 'share', 'streamEnd'];
const counterchat = new Counter(0, 1000);
const countergift = new Counter(0, 1000);
const countershare = new Counter(0, 1000);
const counterlike = new Counter(0, 1000);
const counterfollow = new Counter(0, 1000);
const countermember = new Counter(0, 1000);
const newChatContainer = new ChatContainer('.chatcontainer', 500);
const newGiftContainer = new ChatContainer('.giftcontainer', 500);
const newEventsContainer = new ChatContainer('.eventscontainer', 200); 
const containerConfig = {
  chat: {
    counter: new Counter(0, 1000),
    container: new ChatContainer('.chatcontainer', 500)
  },
  gift: {
    counter: new Counter(0, 1000),
    container: new ChatContainer('.giftcontainer', 500)
  },
  share: {
    counter: new Counter(0, 1000),
    container: new ChatContainer('.eventscontainer', 200)
  },
  like: {
    counter: new Counter(0, 1000),
    container: new ChatContainer('.eventscontainer', 200)
  },
  follow: {
    counter: new Counter(0, 1000),
    container: new ChatContainer('.eventscontainer', 200)
  },
  member: {
    counter: new Counter(0, 1000),
    container: new ChatContainer('.eventscontainer', 200)
  }
};   
socket.on("allromuser",(data) => {console.log("allromuser",data)})
events.forEach(event => {
    socket.on(event, (data) => {
      Readtext(event, data);
        localStorage.setItem('last'+event, JSON.stringify(data));
        switch (event) {
            case 'member':
                HandleAccionEvent('welcome',data)
                handlemember(data);
                break;
            case 'chat':
              HandleAccionEvent(event,data)
              handlechat(data);
                break;
            case 'gift':
                handlegift(data);
                HandleAccionEvent(event,data)
                // create new eventType special case is bits of gift compare diamondcost
                // if (data.diamondCost) {
                //   HandleAccionEvent("bits",data)
                // }
                break;
            case 'like':
                handlelike(data);
                // object entry o map para modificar data.likeCount para que sea igual al valor de EvaluerLikes.addLike(data)
                Object.assign(data, { likeCount: EvaluerLikes.addLike(data) });
                HandleAccionEvent(event,data, 'isInRange')
                break;
            case 'follow':
                handleFollow(data);
                HandleAccionEvent(event,data)
                break;
            case 'share':
                handleShare(data);
                HandleAccionEvent(event,data)
                break;
            case 'connected':
                userProfile.setConnectionStatus('online');
                if (data.roomInfo?.owner) localStorage.setItem('ownerdata',JSON.stringify(data.roomInfo.owner));
                const lastownerdata = localStorage.getItem('ownerdata');
                if (lastownerdata) userProfile.setProfileImage(getAvatarUrl(JSON.parse(lastownerdata)));
                console.log(event, data);
                showAlert('success', `Connected`);
                break;
            case 'streamEnd':
            case 'disconnected':
            case 'error':
                userProfile.setConnectionStatus('offline');
                showAlert('error', `${event}`);
                console.log(event, data);
                break;
            default:
                HandleAccionEvent(event,data) 
                //console.log(event, data);
                //showAlert('success', `Event ${event}`);
                break;  
        }
/*         document.getElementById('lasteventParse').innerHTML = JSON.stringify(data);
 */  });
});
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
const textcontent = {
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
  }
const numbercontent = {
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
}
const eventcontent = {
  content: {
    1: ["text", "UniqueId","white"],
    2: ["text", getTranslation('followed'),"yellow"],
  },
  data: {
    number: 123,
    text: "text",
  }
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
const callbacksmessage = [splitfilterwords,filterwordadd];
const optionTexts = ['filtrar comentarios - dividir', 'filtrar comentario'];
const message1 = new ChatMessage( `msg${counterchat.increment()}`, 'https://cdn-icons-png.flaticon.com/128/6422/6422200.png', textcontent, callbacksmessage,optionTexts);
const message2 = new ChatMessage( `msg${counterchat.increment()}`, 'https://cdn-icons-png.flaticon.com/128/6422/6422200.png', numbercontent);
const message3 = new ChatMessage( `msg${counterchat.increment()}`, 'https://cdn-icons-png.flaticon.com/128/6422/6422200.png', eventcontent);
// Crear callbacks
newChatContainer.addMessage(message1);
newGiftContainer.addMessage(message2);
newEventsContainer.addMessage(message3);
const arrayevents = ["like", "gift", "chat"];

const messageTemplates = {
  chat: {
    template: (data) => ({
      content: {
        1: ['url', `http://tiktok.com/@${data.uniqueId}`, 'blue', data.nickname],
        2: ['text', data.comment, 'white']
      },
      comment: data.comment
    }),
    alert: null,
    options: callbacksmessage,
    optionTexts: optionTexts,
  },

  gift: {
    template: (data) => ({
      content: {
        1: ['url', `http://tiktok.com/@${data.uniqueId}`, 'blue', data.nickname],
        2: ['text', 'gifted', 'white'],
        3: ['number', data.diamondCount, 'gold'],
        4: ['text', data.giftName, 'gold'],
        5: ['image', data.giftPictureUrl]
      }
    }),
    alert: (data) => `${data.uniqueId} gifted ${data.diamondCount}, ${data.giftName}`
  },

  member: {
    template: (data) => ({
      content: {
        1: ['url', `http://tiktok.com/@${data.uniqueId}`, 'blue', data.nickname],
        2: ['text', 'welcome', 'gold']
      },
      comment: ''
    }),
    alert: null
  },

  like: {
    template: (data) => ({
      content: {
        1: ['url', `http://tiktok.com/@${data.uniqueId}`, 'blue', data.nickname],
        2: ['text', data.likeCount, 'gold'],
        3: ['text', 'likes', 'white']
      },
      comment: ''
    }),
    alert: null
  },

  follow: {
    template: (data) => ({
      content: {
        1: ['url', `http://tiktok.com/@${data.uniqueId}`, 'blue', data.nickname],
        2: ['text', 'followed', 'gold']
      },
      comment: ''
    }),
    alert: null
  },

  share: {
    template: (data) => ({
      content: {
        1: ['url', `http://tiktok.com/@${data.uniqueId}`, 'blue', data.nickname],
        2: ['text', 'shared', 'gold']
      },
      comment: ''
    }),
    alert: null
  }
};
class MessageHandler {
  constructor(containerConfig, messageTemplates) {
    this.containerConfig = containerConfig;
    this.messageTemplates = messageTemplates;
    this.translations = translations;
    this.currentLang = localStorage.getItem('selectedLanguage') || 'es';
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
    }
  }

  getTranslation(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }

  handleMessage(type, data) {
    const config = this.containerConfig[type];
    const template = this.messageTemplates[type];

    if (!config || !template) {
      console.error(`Configuration not found for message type: ${type}`);
      return;
    }

    const parsedData = template.template(data);
    const counter = config.counter;
    const container = config.container;

    const newMessage = new ChatMessage(
      `msg${counter.increment()}`,
      data.profilePictureUrl,
      parsedData,
      template.options,template.optionTexts
    );

    container.addMessage(newMessage);
    console.log(type, data);

    if (template.alert) {
      showAlert('info', template.alert(data), 5000);
    }
  }
}

// Crear instancia del manejador de mensajes
const messageHandler = new MessageHandler(containerConfig, messageTemplates);
messageHandler.setLanguage('es');
// Funciones de manejo específicas
const handlechat = (data) => messageHandler.handleMessage('chat', data);
const handlegift = (data) => messageHandler.handleMessage('gift', data);
const handlemember = (data) => messageHandler.handleMessage('member', data);
const handlelike = (data) => messageHandler.handleMessage('like', data);
const handleFollow = (data) => messageHandler.handleMessage('follow', data);
const handleShare = (data) => messageHandler.handleMessage('share', data);
let lastcomment = ''
function Readtext(eventType = 'chat',data) {
  // especial case if roomuser is welcome
  if (eventType === 'member') eventType = 'welcome';
  if (eventType === 'chat') {
    if(data.comment === lastcomment) {
      return;
    } 
    lastcomment = data.comment;
  }
  Replacetextoread(eventType, data);
}
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
  logger.log('debug',"results HandleAccionEvent",results)
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
}
async function Actionsprocessmanager(id,userdata) {
  console.log("accionesprocessmanager",id)
  const action = await ActionsManager.getDataById(id)
  console.log("accionesprocessmanager",action)
  if (action) {
    Object.keys(processActioncallbacks).forEach(key => {
      if (action[key]) {
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

// setTimeout(() => {
//   HandleAccionEvent('chat',{nombre: "coloca tu nombre",eventType: "chat",chat: "default text",like: 10,gift: 5655,Actions: [],id: undefined})
// }, 1000);
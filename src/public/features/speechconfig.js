import {replaceVariables, logger, ArrayStorageManager, ArrayManagerUI,showAlert, unflattenObject, flattenObject} from '../utils/utils.js';
import { leerMensajes, handleleermensaje } from '../audio/tts.js';
import { voicelistmap } from '../audio/voiceoptions.js';
import { getTranslation, translations } from '../translations.js';
import { filterworddefault } from '../assets/jsondata.js';
const ttsdata = localStorage.getItem('ttsdatastore') ? JSON.parse(localStorage.getItem('ttsdatastore')) : {
    chat: { check: true, text: `uniqueId ${getTranslation('dice')} comment` },
    gift: { check: true, text: `uniqueId ${getTranslation('regalo')} repeatcount giftName` },
    follow: { check: true, text: `uniqueId ${getTranslation('te ah seguido')}` },
    like: { check: false, text: `uniqueId ${getTranslation('le ah dado like')}` },
    share: { check: false, text: `uniqueId ${getTranslation('ah compartido')}` },
    subscribe: { check: true, text: `uniqueId ${getTranslation('se ah suscrito')}` },
    welcome: { check: false, text: `uniqueId ${getTranslation('bienvenido')}` }
};
//console.log("ttsdata",ttsdata, flattenObject(ttsdata),unflattenObject(flattenObject(ttsdata)));
const voicechatconfig = document.createElement('dynamic-form');
voicechatconfig.initialize(flattenObject(ttsdata));

if (!localStorage.getItem('ttsdatastore')) localStorage.setItem('ttsdatastore', JSON.stringify(ttsdata));
const keys = [
    { name: 'chat', text: `uniqueId ${getTranslation('dice')} comment`, check: true },
    { name: 'gift', text: `uniqueId ${getTranslation('regalo')} repeatcount giftName`, check: true },
    { name: 'follow', text: `uniqueId ${getTranslation('te ah seguido')}`, check: true },
    { name: 'like', text: `uniqueId ${getTranslation('le ah dado like')}`, check: false },
    { name: 'share', text: `uniqueId ${getTranslation('ah compartido')}`, check: false },
    { name: 'subscribe', text: `uniqueId ${getTranslation('se ah suscrito')}`, check: true },
    { name: 'welcome', text: `uniqueId ${getTranslation('bienvenido')}`, check: false }
];
class ChatMessageProcessor {
    constructor(initialTimeWindow = 1000, maxTimeWindow = 5000, sendCallback = console.log) {
      this.initialTimeWindow = initialTimeWindow; // Tiempo inicial en milisegundos
      this.maxTimeWindow = maxTimeWindow;         // Máximo tiempo en milisegundos
      this.currentTimeWindow = initialTimeWindow; // Tiempo actual dinámico
      this.messageQueue = new Map();              // Almacena mensajes y sus contadores
      this.sendCallback = sendCallback;           // Función para enviar mensajes
      this.timeout = null;                        // Manejador del timeout para enviar mensajes agrupados
    }
  
    addMessage(message) {
      const currentTime = Date.now();
  
      // Si el mensaje ya existe, actualizamos su contador
      if (this.messageQueue.has(message)) {
        const messageData = this.messageQueue.get(message);
        messageData.count++;
        messageData.lastUpdated = currentTime;
  
        // Extender el tiempo dinámico hasta el máximo permitido
        if (this.currentTimeWindow < this.maxTimeWindow) {
          this.currentTimeWindow = Math.min(
            this.currentTimeWindow + this.initialTimeWindow,
            this.maxTimeWindow
          );
  
          // Reiniciar el timeout para reflejar el nuevo tiempo de espera
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => this.flushMessages(), this.currentTimeWindow);
        }
      } else {
        // Si es un mensaje nuevo, lo añadimos con un contador inicial de 1
        this.messageQueue.set(message, { count: 1, lastUpdated: currentTime });
  
        // Programar el envío de mensajes si no hay un timeout activo
        if (!this.timeout) {
          this.timeout = setTimeout(() => this.flushMessages(), this.currentTimeWindow);
        }
      }
    }
  
    flushMessages() {
      // Enviar todos los mensajes agrupados
      for (const [message, data] of this.messageQueue) {
        const messageText = data.count > 1 ? `${message} x${data.count}` : message;
        this.sendCallback(messageText);
      }
  
      // Limpiar la cola y reiniciar el timeout y la ventana de tiempo
      this.messageQueue.clear();
      clearTimeout(this.timeout);
      this.timeout = null;
      this.currentTimeWindow = this.initialTimeWindow; // Resetear el tiempo dinámico
    }
  
    // Método para actualizar el initialTimeWindow con el valor de maxTimeWindow
    updateInitialTimeWindow(inittime,maxtime) {
    if (inittime) this.initialTimeWindow = inittime;
    if (maxtime) this.maxTimeWindow = maxtime;
    if (this.currentTimeWindow > this.maxTimeWindow) {
        this.initialTimeWindow = this.maxTimeWindow;
        this.currentTimeWindow = this.maxTimeWindow; // También actualizamos el tiempo actual
        }
    }
  }
  
  
  
keys.forEach(({ name, check,text }) => {
    const ischecked = typeof getTTSdatastore()[name]?.check === 'boolean' 
    ? getTTSdatastore()[name]?.check 
    : check;
    voicechatconfig
        .addField({
            type: 'checkbox',
            name: `${name}_check`,
            label: `${name}`,
            value: ischecked,
            checked: ischecked,
        },{rowGroup:`voice${name}`})
        .addField({
            type: 'text',   
            name: `${name}_text`,
            label: `${name}`,
            value: text,
            placeholder: `${name} text`,
            showWhen: {
                field: `${name}_check`,
                value: true
            }
        },{rowGroup:`voice${name}`});
});



console.log("ttsdata",getTTSdatastore(),flattenObject(getTTSdatastore()));
voicechatconfig.render().toggleDarkMode(true);
voicechatconfig.setSubmitButton({ 
    label: getTranslation('savechanges'), 
});
voicechatconfig.addEventListener('form-submit', (e) => {
    const data = unflattenObject(e.detail);
    //console.log('Datos modificados:', e.detail, data);
    localStorage.setItem('ttsdatastore', JSON.stringify(data));
});
voicechatconfig.addEventListener('form-change', (e) => {
    const data = unflattenObject(e.detail);
    //console.log('Form values changed:', e.detail, data);
    localStorage.setItem('ttsdatastore', JSON.stringify(data));
});
function getTTSdatastore() {
    let ttsdatastore = localStorage.getItem('ttsdatastore');
    if (!ttsdatastore) localStorage.setItem('ttsdatastore', JSON.stringify(ttsdata));
    return ttsdatastore ? JSON.parse(ttsdatastore) : ttsdata;
}
let voicesList = [];

// Función para mapear las voces
function mapVoiceList() {
    if (typeof speechSynthesis === "undefined" || speechSynthesis?.getVoices().length === 0) return [];
    const voices = speechSynthesis.getVoices();
    voicesList = voices.map(voice => ({
        value: voice.name,
        label: `${voice.name} (${voice.lang})`,
    }));
    updateVoiceConfig();
    return voicesList;
}

// Función para actualizar la configuración cuando las voces estén disponibles
function updateVoiceConfig() {
    selectvoiceconfig.voice2.selectvoice.options = voicesList;
}

// Función para verificar las voces
function checkVoices() {
    if (typeof speechSynthesis === "undefined") return;
    if (speechSynthesis.getVoices().length > 0) {
        console.log("speechSynthesis.getVoices()", speechSynthesis.getVoices());
        clearInterval(voiceCheckInterval);
        mapVoiceList();
    }
}

// Configuración inicial con array vacío
const selectvoiceconfig = {
    selectvoiceoption: {
        class: 'radio-default',
        type: 'radio',
        returnType: 'string',
        toggleoptions: true,
        options: [{ value: 'selectvoice1', label: 'Voz1' }, { value: 'selectvoice2', label: 'Voz2' }],
    },
    voice1: {
        class: 'input-default',
        type: 'object',
        dataAssociated: 'selectvoice1',
        open: true,
        selectvoice: {
            class: 'select-default',
            type: 'select2',
            returnType: 'string',
            options: voicelistmap, // Inicialmente vacío
        },
        audioQueue: {
            class: 'input-default',
            label: getTranslation('cola de audio'),
            type: 'checkbox',
            returnType: 'boolean',
        },
    },
    voice2: {
        class: 'input-default',
        type: 'object',
        dataAssociated: 'selectvoice2',
        open: true,
        selectvoice: {
            class: 'select-default',
            type: 'select2',
            returnType: 'string',
            options: voicesList, // Inicialmente vacío
        },
        Randomvoice: {
            class: 'input-default',
            label: getTranslation('random voice'),
            type: 'checkbox',
            returnType: 'boolean',
        },
        randomspeed: {
            class: 'input-default',
            label: getTranslation('random speed'),
            type: 'checkbox',
            returnType: 'boolean',
        },
        randompitch: {
            class: 'input-default',
            label: getTranslation('random pitch'),
            type: 'checkbox',
            returnType: 'boolean',
        },
        defaultspeed: {
            class: 'input-default',
            label: getTranslation('default speed'),
            type: 'slider',
            min: 0.1,
            max: 2,
            returnType: 'number',
        },
        defaultpitch: {
            class: 'input-default',
            label: getTranslation('default pitch'),
            type: 'slider',
            min: 0.1,
            max: 2,
            returnType: 'number',
        },
        volume: {
            class: 'max-width-90p',
            label: getTranslation('speech volume'),
            type: 'slider',
            min: 0,
            max: 1,
            returnType: 'number',
        },
    },
    savebutton: {
        class: 'default-button',
        type: 'button',
        label: getTranslation('savechanges'),
        callback: async (data,modifiedData) => {
            console.log("callbackconfig",data,modifiedData);
            localStorage.setItem('voicedatastore', JSON.stringify(modifiedData));
        },
    }
};

// Configuración de los event listeners
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = mapVoiceList;
    setTimeout(mapVoiceList, 1000);
}
const defaultvoicedata = JSON.parse(localStorage.getItem('voicedatastore')) || {
    selectvoiceoption: 'selectvoice1', 
    voice1: {
      selectvoice: 'Conchita',
      audioQueue: true,
    },
    voice2: {
      selectvoice: 'es_ES',
      Randomvoice: true,
      randomspeed: true,
      randompitch: true,
      defaultspeed: 1,
      defaultpitch: 1,
      volume: 1,
    },
};
const voiceCheckInterval = setInterval(checkVoices, 100);
const voiceapiconfig = document.createElement('dynamic-form');
console.log("defaultvoicedata",defaultvoicedata,flattenObject(defaultvoicedata));

voiceapiconfig.initialize(flattenObject(defaultvoicedata));
voiceapiconfig.addField({
    type: 'radio',
    name: 'selectvoiceoption',
    label: 'select voice',
    value: 'selectvoice1',
    placeholder: 'voice option',
    options: [{ value: 'selectvoice1', label: 'voice streamelements' }, { value: 'selectvoice2', label: 'voice webapi' }],
})
.addField({
    type: 'flexible-modal-selector',
    name: 'voice1_selectvoice',
    label: 'voice',
    mode: 'single',
    options: voicelistmap,
    value: 'Conchita',
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice1'
    }
}, { rowGroup: 'voice1' })
.addField({
    type: 'checkbox',
    name: 'voice1_audioQueue',
    label: 'cola de audio',
    value: true,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice1'
    }
}, { rowGroup: 'voice1' })
.addField({
    type: 'flexible-modal-selector',
    name: 'voice2_selectvoice2',
    label: 'voice select',
    value: 'es_ES',
    options: voicesList,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
.addField({
    type: 'checkbox',
    name: 'voice2_Randomvoice',
    label: 'random voice',
    checked: true,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
.addField({
    type: 'checkbox',
    name: 'voice2_randomspeed',
    label: 'random speed',
    checked: true,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
.addField({
    type: 'checkbox',
    name: 'voice2_randompitch',
    label: 'random pitch',
    checked: true,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
.addField({
    type: 'range',
    name: 'voice2_defaultspeed',
    label: 'default speed',
    min: 0.1,
    max: 2,
    step: 0.1,
    value: 2,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
.addField({
    type: 'range',
    name: 'voice2_defaultpitch',
    label: 'default pitch',
    min: 0.1,
    max: 2,
    step: 0.1,
    value: 2,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
.addField({
    type: 'range',
    name: 'voice2_volume',
    label: 'speech volume',
    value: 50,
    showWhen: {
        field: 'selectvoiceoption',
        value: 'selectvoice2'
    }
}, { rowGroup: 'voice2' })
voiceapiconfig.render().toggleDarkMode(true);
voiceapiconfig.addEventListener('form-submit', (e) => {
    const data = unflattenObject(e.detail);
    //console.log('Datos modificados:', e.detail, data);
    localStorage.setItem('voicedatastore', JSON.stringify(data));
});
voiceapiconfig.addEventListener('form-change', (e) => {
    const data = unflattenObject(e.detail);
    //console.log('Form values changed:', e.detail, data);
    localStorage.setItem('voicedatastore', JSON.stringify(data));
});


if (!localStorage.getItem('voicedatastore')) localStorage.setItem('voicedatastore', JSON.stringify(defaultvoicedata));

setTimeout(() => {
  if (mapVoiceList().length > 0) {
    console.log("mapVoiceList",mapVoiceList());
  }
}, 500);
const chatProcessor = new ChatMessageProcessor(500, 3000, (msg) => {
        console.log("chatProcessor",msg)
        handleleermensaje(msg,true);
    }
);
const otherProcessor = new ChatMessageProcessor(3000, 9000, (msg) => {
        console.log("otherProcessor",msg)
        handleleermensaje(msg,true);
    }
);
function Replacetextoread(eventType = 'chat',data) {
    const configtts = getTTSdatastore();
    if (!configtts[eventType] || !configtts[eventType].check) return;
    const textoread = replaceVariables(configtts[eventType].text, data);
    logger.log('speechchat',configtts,textoread,configtts[eventType].text)
    if (existwordinArray(textoread)) { showAlert('info',`${getTranslation('filterword')} ${textoread} `); return; }
    if (data.uniqueId && existuserinArray(data.uniqueId)) { showAlert('info',`${getTranslation('blacklistuser')} ${data.uniqueId} `); return; }
    if (eventType === 'chat') {
        chatProcessor.addMessage(textoread);
    } else {
        otherProcessor.addMessage(textoread);
    }
}   

/* setInterval(() => {
  Replacetextoread('gift',{giftId: "hola angelo con 8lo"})
  Replacetextoread('chat',{comment: "este si se lee"})
},2222)  */

  
const manager = new ArrayStorageManager('filterword');
const bluemanager = new ArrayStorageManager('blacklistusers');
function addfilterword(word) {
manager.add(word);
}
function existwordinArray(word) {
const response = manager.containword(word);
return response;
}
function existuserinArray(word) {
const response = bluemanager.containword(word);
return response;
}
function adduserinArray(word) {
const response = bluemanager.add(word);
return response;
}
export { Replacetextoread, addfilterword,existuserinArray,adduserinArray,voicechatconfig,voiceapiconfig}
// asdasd como seria un metodo para hacer un string a json
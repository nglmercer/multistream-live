import DynamicTable, { EditModal } from '../components/renderfields.js';
import {replaceVariables, logger, ArrayStorageManager, ArrayManagerUI,showAlert} from '../utils/utils.js';
import { leerMensajes, handleleermensaje } from '../audio/tts.js';
import { voicelistmap } from '../audio/voiceoptions.js';
import { getTranslation, translations } from '../translations.js';
import { filterworddefault } from '../assets/jsondata.js';
console.log("filterworddefault",filterworddefault)
const keys = [
    { key: 'chat', text: `uniqueId ${getTranslation('dice')} comment`, check: true },
    { key: 'gift', text: `uniqueId ${getTranslation('regalo')} repeatcount giftName`, check: true },
    { key: 'follow', text: `uniqueId ${getTranslation('te ah seguido')}`, check: true },
    { key: 'like', text: `uniqueId ${getTranslation('le ah dado like')}`, check: false },
    { key: 'share', text: `uniqueId ${getTranslation('ah compartido')}`, check: false },
    { key: 'subscribe', text: `uniqueId ${getTranslation('se ah suscrito')}`, check: true },
    { key: 'welcome', text: `uniqueId ${getTranslation('bienvenido')}`, check: false }
];

const voicechatconfig = document.createElement('dynamic-form');
voicechatconfig.initialize();

keys.forEach(({ key, check,text }) => {
    voicechatconfig
        .addField({
            type: 'checkbox',
            name: `voice${key}_check`,
            label: `voice${key}`,
            value: check,
            checked: check,
        })
        .addField({
            type: 'text',
            name: `voice${key}_text`,
            label: `voice${key}`,
            value: `${text}`,
            placeholder: `voice${key} text`,
            showWhen: {
                field: `voice${key}_check`,
                value: true
            }
        });
});

voicechatconfig.render().toggleDarkMode(true);
voicechatconfig.addEventListener('form-submit', (e) => {
    console.log('Datos modificados:', e.detail);
});
voicechatconfig.addEventListener('form-change', (e) => {
    console.log('Form values changed:', e.detail);
});

const createTTSConfig = (labelText,sumaryText='texto a leer') => ({
    type: 'object',
    class: 'input-default',
    label: sumaryText,
    check: {
        class: 'filled-in flex-reverse-column',
        label: getTranslation('activate'),
        type: 'checkbox',
        returnType: 'boolean',
    },
    text: {
        class: 'input-default',
        label: labelText,
        type: 'text',
        returnType: 'string',
    },
});

const { ttsconfig, ttsdata } = keys.reduce((acc, { key, text, check }) => {
    acc.ttsconfig[key] = createTTSConfig(getTranslation('texttoread'),`${getTranslation('config')} ${getTranslation(key)}`);
    acc.ttsdata[key] = { text, check };
    return acc;
}, { ttsconfig: {}, ttsdata: {} });

console.log(ttsconfig);
console.log(ttsdata);

function getTTSdatastore() {
    const ttsdatastore = localStorage.getItem('ttsdatastore');
    if (!ttsdatastore) localStorage.setItem('ttsdatastore', JSON.stringify(ttsdata));
    return ttsdatastore ? JSON.parse(ttsdatastore) : ttsdata;
}
const callbackconfig = { 
    type: 'button',
    label: getTranslation('savechanges'),
    class: 'default-button',
    callback: async (data,modifiedData) => {
    console.log("editcallback", data,modifiedData);
    localStorage.setItem('ttsdatastore', JSON.stringify(modifiedData));
  }
 };
const configelement = new EditModal({...ttsconfig,savebutton:callbackconfig});
const newElement = document.createElement('div');
newElement.textContent = 'Nuevo contenido';
const htmlvoiceevents = configelement.ReturnHtml(getTTSdatastore());

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

const voiceCheckInterval = setInterval(checkVoices, 100);

const voiceelement = new EditModal(selectvoiceconfig);
const defaultvoicedata = JSON.parse(localStorage.getItem('voicedatastore')) || {
    selectvoiceoption: 'selectvoice1', 
    voice1: {
      selectvoice: 'Conchita',
      audioQueue: true,
    },
    voice2: {
      selectvoice: 'es_ES',
      Randomvoice: false,
      randomspeed: false,
      randompitch: false,
      defaultspeed: 1,
      defaultpitch: 1,
      volume: 1,
    },
};
if (!localStorage.getItem('voicedatastore')) localStorage.setItem('voicedatastore', JSON.stringify(defaultvoicedata));
const htmlvoice = voiceelement.ReturnHtml(defaultvoicedata);

setTimeout(() => {
  if (mapVoiceList().length > 0) {
    voiceelement.updateData(defaultvoicedata);
  }
}, 500);
const testdata = {
    uniqueId: 'testUser',
    comment: 'testComment',
    likeCount: 50,
    repeatCount: 123,
    giftName: 'testgiftName',
    diamondCount: 50,
    followRole: 0,
    userId: 1235646,
    teamMemberLevel: 0,
    subMonth: 0,
}
function Replacetextoread(eventType = 'chat',data) {
    const configtts = getTTSdatastore();
    if (!configtts[eventType] || !configtts[eventType].check) return;
    const textoread = replaceVariables(configtts[eventType].text, data);
    logger.log('speechchat',configtts,textoread,configtts[eventType].text)
    if (existwordinArray(textoread)) { showAlert('info',`${getTranslation('filterword')} ${textoread} `); return; }
    if (data.uniqueId && existuserinArray(data.uniqueId)) { showAlert('info',`${getTranslation('blacklistuser')} ${data.uniqueId} `); return; }
    handleleermensaje(textoread);
}
/* setTimeout(() => {
  Replacetextoread('chat',{comment: "hola angelo con 8lo"})
  Replacetextoread('chat',{comment: "este si se lee"})
},3000) */

  
  // Clase para manejar la UI

// Inicialización
const manager = new ArrayStorageManager('filterwords');
const ui = new ArrayManagerUI(manager,filterworddefault);

// Uso del método getHTML para añadir el componente al DOM
const uiElement = ui.getHTML();
// appContainer.appendChild(uiElement);
const uifunctions = ui.initializeEventListeners(uiElement);

const bluemanager = new ArrayStorageManager('blacklistusers');
const blueui = new ArrayManagerUI(bluemanager,["kickbot","nightbot","examplebot"]);    
const blueuiElement = blueui.getHTML();
const blueuifunctions = blueui.initializeEventListeners(blueuiElement);
//{ loadItems, addItem: handleAddItem, addDefault: handleAddDefault }
function addfilterword(word) {
manager.add(word);
uifunctions.loadItems();
}
function existwordinArray(word) {
const response = manager.containword(word);
//console.log("existwordinArray",response,word)
return response;
}
function existuserinArray(word) {
const response = bluemanager.containword(word);
//console.log("existwordinArray",response,word)
return response;
}
function adduserinArray(word) {
const response = bluemanager.add(word);
blueuifunctions.loadItems();
//console.log("existwordinArray",response,word)
return response;
}
  //existwordinArray("tedesku")
export { Replacetextoread, addfilterword,existuserinArray,adduserinArray, htmlvoice, htmlvoiceevents,uiElement,blueuiElement,voicechatconfig}
// asdasd como seria un metodo para hacer un string a json
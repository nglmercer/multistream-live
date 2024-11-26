import DynamicTable, { EditModal } from '../components/renderfields.js';
import { showAlert } from '../components/message.js';
import {replaceVariables, logger} from '../utils/utils.js';
import { leerMensajes, handleleermensaje } from '../audio/tts.js';
import { voicelistmap } from '../audio/voiceoptions.js';
import { getTranslation, translations } from '../translations.js';
import { filterworddefault } from '../assets/jsondata.js';
const keys = [
    { key: 'chat', text: `uniqueId ${getTranslation('dice')} comment`, check: true },
    { key: 'gift', text:  `uniqueId ${getTranslation('regalo')} repeatcount giftName`, check: true },
    { key: 'follow', text: `uniqueId ${getTranslation('te ah seguido')}`, check: true },
    { key: 'like', text: `uniqueId ${getTranslation('le ah dado like')}`, check: false },
    { key: 'share', text: `uniqueId ${getTranslation('ah compartido')}`, check: false },
    { key: 'subscribe', text: `uniqueId ${getTranslation('se ah suscrito')}`, check: true },
    { key: 'welcome', text:  `uniqueId ${getTranslation('bienvenido')}`, check: false }
];

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
const callbackconfig = { callback: async (data,modifiedData) => {
    console.log("editcallback", data,modifiedData);
    localStorage.setItem('ttsdatastore', JSON.stringify(modifiedData));
  }
  , deletecallback:  undefined };
const configelement = new EditModal('#chatbotconfig',callbackconfig,ttsconfig);
configelement.render(getTTSdatastore());
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
    }
};

// Configuración de los event listeners
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = mapVoiceList;
    setTimeout(mapVoiceList, 1000);
}

const voiceCheckInterval = setInterval(checkVoices, 100);
const callbackvoice = { callback: async (data,modifiedData) => {
  console.log("callbackvoice",data,modifiedData);
  localStorage.setItem('voicedatastore', JSON.stringify(modifiedData));
  }
  , deletecallback:  undefined };
const voiceelement = new EditModal('#voiceconfig',callbackvoice,selectvoiceconfig);
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
voiceelement.render(defaultvoicedata);
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
    handleleermensaje(textoread);
}
/* setTimeout(() => {
  Replacetextoread('chat',{comment: "hola angelo con 8lo"})
  Replacetextoread('chat',{comment: "este si se lee"})
},3000) */
class ArrayStorageManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.items = this.getAll();
    }
  
    getAll() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }
  
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }
  
    validateInput(item) {
        if (typeof item !== 'string') return false;
        if (item.length <= 1) return false;
        return true;
    }
  
    existInItems(text) {
        const normalizedText = text.toLowerCase();
        return this.items.some(item =>
            item.toLowerCase() === normalizedText
        );
    }
    // Verificar si algún item está contenido en el texto
    containswordInitems(text) {
        const normalizedText = text.toLowerCase();
        return this.items.some(item =>
            normalizedText.includes(item.toLowerCase())
        );
    }

    // Verificar si el texto existe como item o contiene algún item
    containword(text) {
        if (!this.validateInput(text)) return false;
        return this.existInItems(text) || this.containswordInitems(text);
    }
    add(item) {
        if (!this.validateInput(item)) return false;
        if (!this.existInItems(item)) {
            this.items.push(item);
            this.saveToStorage();
            return true;
        }
        return false;
    }
  
    remove(item) {
        const initialLength = this.items.length;
        this.items = this.items.filter(existingItem =>
            existingItem.toLowerCase() !== item.toLowerCase()
        );
        if (this.items.length !== initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }
  }
  
  // Clase para manejar la UI
  class ArrayManagerUI {
    constructor(storageManager, idelement) {
        this.manager = storageManager;
        this.setupModal();
        this.setupEventListeners(idelement);
    }
  
    setupModal() {
        const modal = document.createElement('div');
        const storageKeyname = this.manager.storageKey
        modal.innerHTML = `
          <custom-modal modal-type="form" id="ArrayManagerUI">
                <h2 class="modal-title"><translate-text key="${storageKeyname}"></translate-text>
                </h2>
                <div class="input-container">
                    <input type="text" id="itemInput" placeholder="${getTranslation('addelement')}">
                    <button id="addButton" class="open-modal-btn">${getTranslation('add')}</button>
                    <button id="Initialdata" class="open-modal-btn">${getTranslation('default')} ${getTranslation(storageKeyname)}</button>
                </div>
                <div id="errorMessage" class="error-message">
                    El texto debe tener al menos 2 caracteres
                </div>
                <div id="itemsContainer" class="items-container">
                </div>
            </custom-modal>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
    }
  
    setupEventListeners(idelement) {
      const buttonid = idelement ||'openModal';
        // Botón para abrir modal
        document.getElementById(buttonid).addEventListener('click', () => {
            this.openModal();
        });
  
        // Agregar item
        const input = this.modal.querySelector('#itemInput');
        const addButton = this.modal.querySelector('#addButton');
        const Initialdata = this.modal.querySelector('#Initialdata');
        const addItem = (stringtext = input.value.trim()) => {
            const text = stringtext;
            const errorMessage = this.modal.querySelector('#errorMessage');
            errorMessage.style.display = 'none';
           
            if (this.manager.validateInput(text)) {
                if (this.manager.add(text)) {
                    this.createItemElement(text);
                    input.value = '';
                }
            } else {
                errorMessage.style.display = 'block';
            }
        };
        const addDefault = () => {
            filterworddefault.forEach(text => {
                addItem(text);
            });
        };
        Initialdata.addEventListener('click', addDefault);
        addButton.addEventListener('click', addItem);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addItem();
        });
    }
  
    createItemElement(text) {
        const itemsContainer = this.modal.querySelector('#itemsContainer');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
       
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
       
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.onclick = () => {
            this.manager.remove(text);
            itemDiv.remove();
        };
       
        itemDiv.appendChild(textSpan);
        itemDiv.appendChild(deleteButton);
        itemsContainer.appendChild(itemDiv);
    }
  
    loadItems() {
        const itemsContainer = this.modal.querySelector('#itemsContainer');
        itemsContainer.innerHTML = '';
        this.manager.getAll().forEach(item => {
            this.createItemElement(item);
        });
    }
  
    openModal() {
        this.loadItems();
        document.getElementById('ArrayManagerUI').open();
    }
  
    closeModal() {
        document.getElementById('ArrayManagerUI').close();
  }
  }
  
  // Inicialización
  const manager = new ArrayStorageManager('filterwords');
  const ui = new ArrayManagerUI(manager);
  function addfilterword(word) {
    manager.add(word);
    ui.loadItems();
  }
  function existwordinArray(word) {
    const response = manager.containword(word);
    //console.log("existwordinArray",response,word)
    return response;
  }
export { Replacetextoread, addfilterword}
// asdasd como seria un metodo para hacer un string a json
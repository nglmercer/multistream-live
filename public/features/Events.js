import { Giftsparsed, mapselectgift } from '../assets/gifts.js';
import DynamicTable, { EditModal } from '../components/renderfields.js';
import { databases, IndexedDBManager, DBObserver } from '../database/indexdb.js'
import { Counter, TypeofData,ComboTracker, replaceVariables, compareObjects } from '../utils/utils.js'
import showAlert from '../components/alerts.js';
import { GiftElementsManager } from '../components/renderhtml.js'
import { ActionsManager } from './Actions.js'
import { getTranslation, translations } from '../translations.js';
const ObserverEvents = new DBObserver();
const EventsManager = new IndexedDBManager(databases.eventsDB,ObserverEvents);
async function EventsManagermap(data) {
  const alldata = await ActionsManager.getAllData()
/*   console.log("alldatainit",alldata)
  const mapedevents = alldata.map(data => ({
    value: data.id,
    label: data.nombre,
  }))
  console.log("alldata",mapedevents) */
  return  alldata.map(data => ({
    value: data.id,
    label: data.nombre,
  }))
}

// function async que se invoca a si mismo seria:
(async () => {
  const mapedevents = await EventsManagermap()
  console.log("mapedevents",mapedevents)
})()

async function getEventconfig() {
  const eventsconfig = {
    nombre: {
      class: 'input-default',
      type: 'textarea',
      returnType: 'string',
    },
    eventType: {
      class: 'radio-default',
      type: 'radio',
      toggleoptions: true,
      returnType: 'string',
      options: [{ value: 'chat', label: 'Chat' }, { value: 'follow', label: 'Seguimiento' },{ value: 'like', label: 'like'},
      {value: 'share', label: 'compartir'}, { value: 'subscribe', label: 'suscripcion' }, { value: 'gift', label: 'Gift' }],
    },
    chat: {
      label: '',
      class: 'input-default',
      type: 'textarea',
      returnType: 'string',
      dataAssociated: 'chat',
    },
    like: {
      label: '',
      class: 'input-default',
      type: 'number',
      returnType: 'number',
      dataAssociated: 'like',
    },
    gift: {
      class: 'input-default',
      label: '',
      type: 'select2',
      returnType: 'number',
      options: mapselectgift,
      dataAssociated: 'gift',
    },
    Actions: {
      class: 'input-default',
      type: 'multiSelect',
      returnType: 'array',
      options: await EventsManagermap(),
    },
    id: {
      type: 'number',
      returnType: 'number',
      hidden: true,
    }
  };
  return eventsconfig
}

const EventsModal = document.getElementById('EventsModal');
const Buttonform  = document.getElementById('EventsModalButton');
const editcallback = async (data,modifiedData) => {
  console.log("editcallback", data,modifiedData);
  const alldata = await EventsManager.getAllData()
  console.log("alldata",alldata)
  
  const keysToCheck = [
    { key: 'eventType', compare: 'isEqual' },
/*       { key: 'gift', compare: 'isEqual' },
*/      { key: modifiedData.eventType, compare: 'isEqual' }
  ];    
  const callbackFunction = (matchingObject, index, results) => {
    console.log(`Objeto coincidente encontrado en el índice ${index}:`, matchingObject, results);
  };
  
  const results = compareObjects(modifiedData, alldata, keysToCheck, callbackFunction);
  console.log("results",results)
  if (!results.validResults.length >= 1 && !modifiedData.id) {
    EventsModal.close();
    EventsManager.saveData(modifiedData)
    showAlert('success','Se ha guardado el evento')
  } else if (modifiedData.id && results.validResults.length <= 1) {
    EventsModal.close();
    EventsManager.updateData(modifiedData)
    showAlert('success','Se ha guardado el evento')
  } else {
    console.log(modifiedData.id,"id de la base de datos")
    showAlert('error','ya existe un elemento en la base de datos igual')
  }
}
const deletecallback = async (data,modifiedData) => {
  EventsModal.close();
  console.log("deletecallback", data,modifiedData);
}
const callbackconfig = { 
  callback: editcallback, deletecallback:  deletecallback,
  callbacktext: getTranslation('savechanges'),
  deletecallbacktext: getTranslation('close'),
};
const testdata = {
  nombre: getTranslation('nombre_del_evento'),
  eventType: "chat",
  chat: "default text",
  like: 10,
  gift: 5655,
  Actions: [],
  id: undefined,
}
const Formelement = new EditModal('#EventsModalContainer',callbackconfig,await getEventconfig());


Buttonform.className = 'open-modal-btn';
Buttonform.onclick = async () => {
  Formelement.updateconfig(await getEventconfig())
  Formelement.render(testdata);
  Formelement.updateData(testdata) 
  setTimeout(() => {EventsModal.open()}, 200);
};
/*tabla de Eventos para modificar y renderizar todos los datos*/
const callbacktable = async (index,data,modifiedData) => {
  console.log("callbacktable",index,data,modifiedData);
  Formelement.updateconfig(await getEventconfig())
  Formelement.render(modifiedData);
  Formelement.updateData(modifiedData) 
  setTimeout(() => {EventsModal.open()}, 200);
}
const callbacktabledelete = async (index,data,modifiedData) => {
  console.log("callbacktabledelete",index,data,modifiedData);
  table.removeRow(table.getRowIndex(data));
  EventsManager.deleteData(data.id)
}
const configtable = {
    nombre: {
      class: 'input-default',
      type: 'textarea',
      returnType: 'string',
    },     
    eventType: {
      class: 'radio-default',
      type: 'radio',
      toggleoptions: true,
      returnType: 'string',
      options: [{ value: 'chat', label: 'Chat' }, { value: 'follow', label: 'Seguimiento' },{ value: 'like', label: 'like'},
      {value: 'share', label: 'compartir'}, { value: 'subscribe', label: 'suscripcion' }, { value: 'gift', label: 'Gift' }],
    }
}
const tableconfigcallback = {
  callback: callbacktable,
  deletecallback: callbacktabledelete,
  callbacktext: 'Editar',
  deletecallbacktext: 'eliminar',
}
const table = new DynamicTable('#table-containerEvent',tableconfigcallback,configtable);
(async () => {
  const alldata = await EventsManager.getAllData()
  alldata.forEach((data) => {
    table.addRow(data);
  });
  console.log("alldata render table",alldata);
})  (); 
ObserverEvents.subscribe(async (action, data) => {
  if (action === "save") {
    table.clearRows();
    const dataupdate = await EventsManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    });
  } else if (action === "delete") {
/*     table.clearRows();
    const dataupdate = await EventsManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    }); */
  }
  else if (action === "update") {
    table.clearRows();
    const dataupdate = await EventsManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    });
    showAlert ('info', "Actualizado", "1000");
  }
});

const giftlistmanager = new GiftElementsManager(mapselectgift);

// Callback de ejemplo
const handleProductClick = (product) => {
    console.log('Producto seleccionado:', product);
};

// Renderizar los productos
giftlistmanager.renderToElement('giftmap', handleProductClick);


export { getEventconfig, EventsManager }
import DynamicTable, { EditModal } from '../components/renderfields.js';
import { databases, IndexedDBManager, DBObserver } from '../database/indexdb.js'
import { Counter, TypeofData,ComboTracker, replaceVariables, compareObjects } from '../utils/utils.js'
import showAlert from '../components/alerts.js';
import { getTranslation, translations } from '../translations.js';
const ObserverActions = new DBObserver();
const ActionsManager = new IndexedDBManager(databases.ActionsDB,ObserverActions);


const actionsconfig = {
  nombre: {
    class: 'input-default',
    type: 'textarea',
    returnType: 'string',
  }, 
  minecraft:{
    type: 'object',
    label: 'Minecraft Comands',
    open: true,
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    command: {
      class: 'input-default',
      label: '',
      type: 'textarea',
      returnType: 'string',
    },
  },
  tts: {
    label: 'TTS',
    type: 'object',
    open: true,
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    text: {
      class: 'input-default',
      type: 'text',
      returnType: 'string',
    },
  },
  id: {
    type: 'number',
    returnType: 'number',
    hidden: true,
  }
} 

const ActionModal = document.getElementById('ActionModal');
const Buttonform  = document.getElementById('ActionModalButton');
const testdata = {
  nombre: getTranslation('nombre de la accion'),
  minecraft: {
    check: true,
    command: getTranslation('command_mc'),
  },
  tts: {
    check: true,
    text: getTranslation('texttoread'),
  },
  id: undefined,
}
const editcallback = async (data,modifiedData) => {
  const alldata = await ActionsManager.getAllData()
  const keysToCheck = [
    { key: 'nombre', compare: 'isEqual' },
  ];
  const callbackFunction = (matchingObject, index, results) => {
    console.log(`Objeto coincidente encontrado en el índice ${index}:`, matchingObject, results);
  };
  const primerValor = objeto => Object.values(objeto)[0];
  const primeraKey = objeto => Object.keys(objeto)[0];

  const results = compareObjects(modifiedData, alldata, keysToCheck, callbackFunction);
  console.log("results",results)
  if (results.validResults.length >= 1) {
    showAlert('error',`Objeto coincidente, cambie el ${primeraKey(results.coincidentobjects)}:`)
  } else {
    ActionModal.close();
    ActionsManager.saveData(modifiedData)
    showAlert('success','Se ha guardado el evento')
  }
}
const deletecallback =  async (data,modifiedData) => {
  ActionModal.close();
  console.log("deletecallback",data,modifiedData);
  updatedataformmodal(testdata)
} 
const callbackconfig = {
  callback: editcallback,
  deletecallback:  deletecallback,
  callbacktext: getTranslation('savechanges'),
  deletecallbacktext: getTranslation('close'),
};
const Aformelement = new EditModal('#ActionModalContainer',callbackconfig,actionsconfig);

Aformelement.render(testdata);
Buttonform.className = 'open-modal-btn';
Buttonform.onclick = () => {
  updatedataformmodal(testdata)
  ActionModal.open();
};
function updatedataformmodal(data = testdata) {
  Aformelement.updateData(data)
  Aformelement.fillEmptyFields(data)
}

/*tabla de Actions para modificar y renderizar todos los datos*/
const callbacktable = async (index,data,modifiedData) => {
  console.log("callbacktable",data,modifiedData);
  ActionsManager.updateData(modifiedData)
}
const callbacktabledelete = async (index,data,modifiedData) => {
  console.log("callbacktabledelete",data,modifiedData);
  table.removeRow(table.getRowIndex(data));
  ActionsManager.deleteData(data.id)
}
const tableconfigcallback = {
  callback: callbacktable,
  deletecallback: callbacktabledelete,
  callbacktext: getTranslation('savechanges'),
  deletecallbacktext: getTranslation('delete'),
}
const table = new DynamicTable('#table-containerAction',tableconfigcallback,actionsconfig);
(async () => {
  const alldata = await ActionsManager.getAllData()
  alldata.forEach((data) => {
    table.addRow(data);
  });
  console.log("alldata render table",alldata);
})  (); 
ObserverActions.subscribe(async (action, data) => {
  if (action === "save") {
    table.clearRows();
    const dataupdate = await ActionsManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    });
  } else if (action === "delete") {
/*     table.clearRows();
    const dataupdate = await ActionsManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    }); */
  }
  else if (action === "update") {
    // table.clearRows();
    // const dataupdate = await ActionsManager.getAllData();
    // dataupdate.forEach((data) => {
    //   table.addRow(data);
    // });
    showAlert ('info', "Actualizado", "1000");
  }
});
export { actionsconfig,ActionsManager }
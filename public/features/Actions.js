import DynamicTable, { EditModal } from '../components/renderfields.js';
import { databases, IndexedDBManager, DBObserver } from '../database/indexdb.js'
import { Counter, TypeofData,ComboTracker, replaceVariables, compareObjects,UserInteractionTracker } from '../utils/utils.js'
import showAlert from '../components/alerts.js';
import {mapsvgoutline, mapsvgsolid} from "../assets/svg.js"
import { getTranslation, translations } from '../translations.js';
import { sendcommandmc } from './Minecraftconfig.js'
import { Replacetextoread, addfilterword } from './speechconfig.js'
import { mapedarrayobs, arrayobs,executebykeyasync } from './obcontroller.js'
const ObserverActions = new DBObserver();
const ActionsManager = new IndexedDBManager(databases.ActionsDB,ObserverActions);
function replaceNestedValue(obj, path, newValue) {
  const keys = path.split('.');
  const lastKey = keys.pop();

  // Clonar el objeto original profundamente
  const newObject = JSON.parse(JSON.stringify(obj));
  let current = newObject;

  // Recorrer las claves excepto la última
  for (const key of keys) {
      // Crear el objeto anidado si no existe
      if (!current[key]) current[key] = {};
      current = current[key];
  }

  // Cambiar el valor de la clave final
  current[lastKey] = newValue;

  return newObject;
}
function replaceMultipleValues(obj, replacements) {
  const newObject = JSON.parse(JSON.stringify(obj)); // Clonar el objeto original profundamente

  replacements.forEach(({ path, value }) => {
      const keys = path.split('.');
      const lastKey = keys.pop();
      let current = newObject;

      keys.forEach(key => {
          if (!current[key]) current[key] = {}; // Crear el objeto anidado si no existe
          current = current[key];
      });

      current[lastKey] = value; // Cambiar el valor de la clave final
  });

  return newObject;
}
function getallfilesmap(objetc) {
  try {
    console.log("files",objetc);
    const filesmap = objetc.map(file => ({
      value: file.nombre,
      label: file.nombre,
      path: file.path,
      mediaType: file.mediaType || file.type,
      mediaUrl: file.mediaUrl || file.path,
      id: file.id,
    }));
    console.log("filesmap",filesmap);
    return filesmap;
  } catch (error) {
    console.error('Error getting all files:', error);
    return {};
  }
}
const actionsconfig = {
  nombre: {
    class: 'input-default',
    type: 'text',
    returnType: 'string',
  },
  color: {
    class: 'input-default',
    label: 'color',
    type: 'color',
    returnType: 'string',
  },
  minecraft:{
    type: 'object',
    label: 'Minecraft Comands',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    command: {
      class: 'input-default',
      label: '',
      type: 'textarea2',
      returnType: 'string',
    },
  },
  tts: {
    label: 'TTS',
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    text: {
      class: 'input-default',
      type: 'text2',
      returnType: 'string',
    },
  },
  overlay: {
    type: 'object',
    check: {
      class: 'filled-in',
      type: 'checkbox',
      returnType: 'boolean',
      label: 'Overlay action',
    },
    src:{
      class: 'input-default',
      type: 'multiSelect',
      returnType: 'array',
      options: getallfilesmap(JSON.parse(localStorage.getItem('filePaths'))) ,
    },
    duration: {
      class: 'input-default',
      type: 'number',
      returnType: 'number',
      label: 'duration',
    }
  },
/*   obs: {
    type: 'object',
    check: {
      class: 'filled-in',
      type: 'checkbox',
      returnType: 'boolean',
      label: 'OBS action',
    },
    action: {
      class: 'filled-in',
      type: 'select2',
      returnType: 'string2',
      options: mapedarrayobs,
      toggleoptions: true,
    },
  }, */
  save: {
    class: 'default-button',
    type: 'button',
    label: getTranslation('savechanges'),
    callback: async (data,modifiedData,value) => {
      console.log("data",data,modifiedData,value)
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
    },
  },
  close: {
    class: 'default-button deletebutton',
    type: 'button',
    label: getTranslation('close'),
    callback: async (data,modifiedData) => {
      console.log("closebutton",data,modifiedData);
      ActionModal.close();
    },
  },
  id: {
    type: 'number',
    returnType: 'number',
    hidden: true,
  }
}


//console.log(mapgetAllscenesScenenameSceneindex(getlastdatafromstorage("getScenesList",[])?.scenes),"mapgetAllscenesScenenameSceneindex");
function getlastdatafromstorage(key,type=[]) {
    console.log("getlastdatafromstorage",JSON.parse(localStorage.getItem(key)),key);
    const lastdata = JSON.parse(localStorage.getItem(key));
    if (lastdata) return lastdata;
    return type;
}
async function mapgetAllscenesScenenameSceneindex(scenesPromise) {
  // Espera a que la promesa se resuelva antes de proceder
  const scenes = await scenesPromise;
  console.log("mapgetAllscenesScenenameSceneindex",scenes);

  // Ahora que `scenes` es un array, puedes usar `map()`
  return await Promise.all(scenes.map(async (scene) => {
    return {
      value: scene.sceneName,
      label: scene.sceneName,
      sceneIndex: scene.sceneIndex
    };
  }));
}
async function returnlistofsources(sceneNamePromise) {
  const sceneName = await sceneNamePromise;
  console.log("returnlistofsources", sceneName);
  //GetSceneItemList NO EXISTS
  // Create an array to store all promises
  const promises = sceneName.map(scene => 
    GetSceneItemList(scene.sceneName).then(sources => {
      const sourcemapoptions = sources.sceneItems.map(source => ({
        value: source.sceneItemId,
        label: source.sourceName,
        sceneIndex: source.sceneIndex
      }));
      
      // Return an object with the scene name as key
      return {
        [scene.sceneName]: {
          class: 'select-default',
          type: 'select2',
          label: [scene.sceneName]+" sources",
          returnType: 'string',
          options: sourcemapoptions,
          dataAssociated:{
            1: [scene.sceneName]
          },
          hidden: true,
        }
      };
    })
  );

  // Wait for all promises to resolve and combine the results
  const results = await Promise.all(promises);
  
  // Combine all objects into a single object
  return Object.assign({}, ...results);
}
async function returnlistofinputs(arrayinputs) {
  console.log("returnlistofinputs", arrayinputs);
  
  // Verificar que arrayinputs es un array
  if (!Array.isArray(arrayinputs)) {
    console.error("El parámetro no es un array:", arrayinputs);
    return [];  // Retornar un array vacío o manejar el error de otra manera
  }

  const options = arrayinputs.map(input => ({
    value: input.inputName,
    label: input.inputName,
  }));

  console.log("options", options);
  return options;
}

const ActionModal = document.getElementById('ActionModal');
const Buttonform  = document.getElementById('ActionModalButton');
const testdata = {
  nombre: getTranslation('nombre de la accion'),
  color: "#000000",
  minecraft: {
    check: false,
    command: getTranslation('command_mc'),
  },
  tts: {
    check: false,
    text: getTranslation('texttoread'),
  },
  obs: {
    check: true,
    action: 'setCurrentScene',
  },
  params: {
    inputName: 'Camera',
    sceneName: 'Scene',
    duration: 60,
    toggle: true,
    db: 0,
  },
  id: undefined,
}
const Aformelement = new EditModal(actionsconfig,testdata);
const HtmlAformelement = Aformelement.ReturnHtml(testdata);
document.querySelector('#ActionModalContainer').appendChild(HtmlAformelement);
Buttonform.className = 'open-modal-btn';
Buttonform.onclick = () => {
  updatemodaldata(testdata)
  ActionModal.open();
};
function updatemodaldata(data = testdata) {
  Aformelement.updateData(data)
}

/*tabla de Actions para modificar y renderizar todos los datos*/

const tableconfigcallback = {
  callback: async (data,modifiedData) => {
    console.log("callbacktable",data,modifiedData);
    Aformelement.ReturnHtml(actionsconfig);
    Aformelement.updateData(modifiedData)
    ActionModal.open();
  },
  deletecallback:  async (data,modifiedData) => {
    const index = await table.getRowIndex(data);
    //console.log("callbacktabledelete table.getRowIndex(data)",index,data,modifiedData);
    table.removeRow(index);
    ActionsManager.deleteData(data.id)
  },
}
//const renderer = document.getElementById('zone-renderer');
async function execobsaction(data) {
  if (data.obs && data.obs?.check) {
    const valueobsaction = arrayobs[data.obs.action];
    console.log("valueobsaction getValueByKey", valueobsaction);

    if (valueobsaction && typeof valueobsaction.function === 'function') {
      const params = valueobsaction.requiredparams;
      let paramsarray = [];
      
      // Recolectar los parámetros necesarios
      params.forEach((param, index) => {
        console.log("data[param]", data,param);
        const value = data.params[param];
        if (value || value >= 0) paramsarray.push(value); // Asegurarse de que el valor es válido
      });

      console.log("params", params, paramsarray);

      // Si hay parámetros, se ejecuta la función con esos parámetros
      if (paramsarray.length > 0) {
        valueobsaction.function(...paramsarray);
      } else {
        // Si no hay parámetros, se ejecuta otra acción o consulta
        const response = await executebykeyasync(valueobsaction.name);
        console.log("response", response);
      }
    }
  }
}

function getValueByKey(value, object) {
  return object[value];
}
function tablereemplazebutton(data) {
  let copydata = JSON.parse(JSON.stringify(data));
  copydata.forEach((data) => {
    replaceNestedValue(data.actionsconfig,data.buttonkey,data.callback)
  });
  return copydata;
}
const tablereplacements = [
  {
    path: 'save.callback',
    value: tableconfigcallback.callback
  },
  {
    path: 'close.callback',
    value: tableconfigcallback.deletecallback
  },
  {
    path: 'save.label',
    value: getTranslation('savechanges')
  },
  {
    path: 'close.label',
    value: getTranslation('delete')
  }
]
const table = new DynamicTable('#table-containerAction',replaceMultipleValues(actionsconfig,tablereplacements));
(async () => {
  const alldata = await ActionsManager.getAllData()
  // alldata.forEach((data) => {
  //   table.addRow(data);
  // });
  // envez de foreach usar un for
   for (let i = 0; i < alldata.length; i++) {
     table.addRow(alldata[i]);
    //const newbutton = addCustomButton(alldata[i]);
    //renderer.addCustomElement(alldata[i].id,newbutton);
  }
  console.log("alldata render table",alldata);
})  (); 
function addCustomButton(data) {
  const button = document.createElement('custom-button');
  button.id = data.id;
  button.setAttribute('color', data.color);
  button.setAttribute('image',data.image);
  button.textContent = data.nombre;
  button.addCustomEventListener('click', (event) => {
    console.log('Botón principal clickeado',event,data);
    if (data && data.obs) {execobsaction(data)}
  });
  
  console.log(data,"alldata[i]")
  button.setMenuItem(
   (event) => { // nuevo callback
     console.log('Nueva configuración',data);
   },
   'info', // action
   '🔧', // nuevo icono
   'info', // nuevo texto
 );

 // 4. Agregar un nuevo elemento al menú
 button.setMenuItem(
   (event) => {
     console.log('config elemento',data);
   },
   'config',
   '🗑️',
   'config',
 );
 return button;
}
ObserverActions.subscribe(async (action, data) => {
  if (action === "save") {
    // table.clearRows();
    // const dataupdate = await ActionsManager.getAllData();
    // dataupdate.forEach((data) => {
    //   table.addRow(data);
    // });
    console.log("dataupdate",action,data)
    table.addRow(data);
    const newbutton = addCustomButton(data);
    //renderer.addCustomElement(data.id,newbutton);
  } else if (action === "delete") {
/*     table.clearRows();
    const dataupdate = await ActionsManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    }); */
    console.log("dataupdate",action,data)
    //renderer.removeElement(data);
  }
  else if (action === "update") {
    // table.clearRows();
    // const dataupdate = await ActionsManager.getAllData();
    // dataupdate.forEach((data) => {
    //   table.addRow(data);
    // });
    const newbuttonchange = addCustomButton(data);
    //renderer.addCustomElement(data.id,newbuttonchange);
    showAlert ('info', "Actualizado", "1000");
  }
});
export { actionsconfig,ActionsManager }
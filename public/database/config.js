import FormModal from './FormModal'
import DynamicTable from './datatable';
import { getfileId } from './Fileshtml'
import  { IndexedDBManager, databases, DBObserver } from '../utils/indexedDB'
import { getformdatabyid, postToFileHandler, getdatafromserver, getAllDataFromDB, getdataIndexdb, modifyPoints } from '../utils/getdata';
import { replaceVariables } from '../utils/replaceVariables';
import { ws, sendcommandmc } from '../minecraft';
import CounterActions from './timerupdate';
import { giftManager, getdatagiftparsed } from '../utils/Giftdata';
import datajson from '../../json/keyboard.json';
import { socketManager } from '../tiktoksocketdata';
import { handleleermensaje } from '../voice/tts';
import  showAlert  from '../assets/alerts'

// setTimeout(() => {
//   CounterActions.add('add', 60);
//   CounterActions.subtract('subtract', 10);
// }, 1000);
// const filescontent = await postToFileHandler("get-files-in-folder", {});
const ObserverEvents = new DBObserver();
const AccionEventsDBManager = new IndexedDBManager(databases.eventsDB,ObserverEvents);

  class DataEvaluator {
    constructor(configevaldata, eventType) {
        this.configevaldata = configevaldata;
        this.eventType = eventType;
        this.matchedValues = new Map();
    }

    findAndEvaluate(keyPath, keytype, verifykeys, obj) {
        const keys = keyPath.split('.');
        let currentValue = obj;

        // Navegar por el objeto usando keyPath
        for (const key of keys) {
            if (typeof currentValue === 'object' && currentValue !== null && key in currentValue) {
                currentValue = currentValue[key];
            } else {
                currentValue = undefined;
                break;
            }
        }

        // Evaluar según el keytype
        if (keytype === 'any' || (keytype === 'object' && typeof currentValue === 'object')) {
            this.verifyAndSetValue(keyPath, currentValue, verifykeys);
        } else if (currentValue !== undefined && keytype === typeof currentValue) {
            this.verifyAndSetValue(keyPath, currentValue, verifykeys);
        } else {
            this.matchedValues.set(keyPath, null);
        }
    }

    verifyAndSetValue(keyPath, currentValue, verifykeys) {
        if (!Array.isArray(verifykeys)) {
            verifykeys = [verifykeys];
        }

        // Verificar todas las claves en el array verifykeys
        const allMatched = verifykeys.every(verifykey => {
            if (typeof currentValue === 'object' && currentValue[verifykey.key] !== undefined) {
                const valueToCheck = currentValue[verifykey.key];
                return this.isValid(valueToCheck, verifykey);
            } else {
                return false;
            }
        });

        if (allMatched) {
            this.matchedValues.set(keyPath, currentValue);
        } else {
            this.matchedValues.set(keyPath, null);
        }
    }

    isValid(valueToCheck, verifykey) {
        switch (verifykey.type) {
            case 'number':
                if (typeof valueToCheck !== 'number') return false;
                return this.compareNumbers(valueToCheck, verifykey.value, verifykey.compare);
            case 'string':
                return this.compareStrings(valueToCheck, verifykey.value, verifykey.compare);
            case 'boolean':
                return valueToCheck === verifykey.value;
            default:
                return false;
        }
    }
    // actualvalue 100, expectedvalue 100, lowerBound 75, upperBound 125
    compareNumbers(actualValue, expectedValue, compare = '===', tolerancePercentage = 50) {
      const maxDifference = expectedValue * (tolerancePercentage / 100);

      // Define los límites inferior y superior permitidos
      const lowerBound = expectedValue - maxDifference;
      const upperBound = expectedValue + maxDifference;

      switch (compare) {
          case '===':
              // Verifica si el valor actual está dentro del rango permitido  actualValue >= lowerBound && actualValue <= upperBound; // not equals
              return actualValue === expectedValue;
          case '>=':
              // Verifica si el valor actual es mayor o igual al límite inferior permitido
              return actualValue >= expectedValue && actualValue <= upperBound;
          case '<=':
              // Verifica si el valor actual es menor o igual al límite superior permitido
              return actualValue <= expectedValue && actualValue >= lowerBound;
          default:
              return false;
      }
    }

    compareStrings(actualValue, expectedValue, compare = '===') {
      if (!actualValue) return false;
        switch (compare) {
            case '===':
                return expectedValue === actualValue;
            case 'contains':
                return expectedValue.includes(actualValue);
            case 'startsWith':
                return expectedValue.startsWith(actualValue);
            case 'endsWith':
                return expectedValue.endsWith(actualValue);
            default:
                return false;
        }
    }

    evaluate(dataeval, finalCallback) {
      let isValid = true;

      for (let index = 0; index < this.configevaldata.length; index++) {
          const item = this.configevaldata[index];

          this.findAndEvaluate(item.keyname, item.keytype, item.verifykey, dataeval);
          // console.log("findAndEvaluate Eventtype", item.keyname, item.keytype, item.verifykey, dataeval);
          const matchedValue = this.matchedValues.get(item.keyname);
          if (Array.isArray(item.verifykey)) {
            const forceTrueKey = item.verifykey.find(key => key.forceTrue === true);
              if (forceTrueKey) {
                    if (dataeval,item.keyname){
                      const defaultvalue = this.finddefaultMatch(item.keyname, dataeval);
                      // console.log("defaultvalue",defaultvalue,"dataeval",dataeval,"matchedValue",matchedValue);
                      if (dataeval.Evento.chat && this.eventType === defaultvalue.eventType) {
                        // console.log("Eventype",defaultvalue[this.eventType], defaultvalue, this.eventType);
                        if(defaultvalue[this.eventType]=== "default"){
                          if (item.callback) {
                              item.callback(dataeval);
                          continue;
                        }

                        }
                      }
                    }
              }
          }

          if (item.isBlocking && (matchedValue === null || !this.allKeysMatched(matchedValue, item.verifykey))) {
              isValid = false;
              finalCallback(false, index);
              break;
          }

          if (matchedValue !== null && item.callback) {
              item.callback(dataeval);
          }
      }

      if (isValid) {
          finalCallback(true);
      }
  }

    allKeysMatched(currentValue, verifykeys) {
        if (!Array.isArray(verifykeys)) {
            verifykeys = [verifykeys];
        }

        return verifykeys.every(verifykey => {
            if (typeof currentValue === 'object' && currentValue !== null && verifykey.key in currentValue) {
                const valueToCheck = currentValue[verifykey.key];
                const matchresult = this.isValid(valueToCheck, verifykey);
                // console.log("allKeysMatched", matchresult, verifykey,   );
                return matchresult;
            }
            return false;
        });
    }
    finddefaultMatch(currentValue, verifykeys) {
      if (!Array.isArray(verifykeys)) {
          verifykeys = [verifykeys];
      }
      let finddata = false;

      for (const verifykey of verifykeys) {
          if (currentValue && verifykey) {
              // Comprobar si el currentValue tiene la clave de evento deseada
              if (verifykey[currentValue]) {
                  finddata = verifykey[currentValue];
                  break;  // Si encuentras la coincidencia, puedes salir del loop
              }
          }
      }

      return finddata;
  }

}

const EvaluerLikes = new LikeTracker(10000);
// Ejemplo de uso
export async function AccionEventoOverlayEval(eventType = "chat", indexdbdata, userdata = {}) {
  let customoptions = [];
  switch (eventType) {
    case "chat":
      customoptions = [{key: "eventType", value: eventType, type:"string"}, {key: "chat", value: userdata.comment, type:"string", compare: "startsWith", forceTrue: true}]
      break;
    case "gift":
      customoptions = [{key: "eventType", value: eventType, type:"string"}, {key: "gift", value: userdata.giftId, type:"number", compare: "==="}]
      break;
    case "follow":
      customoptions = [{key: "eventType", value: eventType, type:"string"}]
      break;
    case "share":
      customoptions = [{key: "eventType", value: eventType, type:"string"}]
      break;
    case "like":
      const likesvalue = EvaluerLikes.addLike(userdata);
      console.log("like",userdata.likeCount, likesvalue);
      customoptions = [{key: "eventType", value: eventType, type:"string"}, {key: "like", value: likesvalue, type:"number", compare: ">="}]
      break;
    default:
      customoptions = [{key: "eventType", value: eventType, type:"string"}]
      break;
  }
  const configevaldata = [
      { keytype: 'any', keyfind: "object", keyname: "Evento", verifykey: customoptions, callback: (data) => console.log("Evento:", data), isBlocking: true },
      { keytype: 'any', keyfind: "object", keyname: "mediaAudio", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => sendMediaManager(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "mediaImg", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => sendMediaManager(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "mediaVideo", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => sendMediaManager(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "profile", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => sendMediaManager(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "minecraft", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handleMinecraft(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "vrchat", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handleOsc(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "Api", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handleApi(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "Keyboard", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handleKeyboard(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "systempoints", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handleSystempoints(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "tts", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handletts(data, userdata), isBlocking: false },
      { keytype: 'any', keyfind: "object", keyname: "timer", verifykey: [{ key: "check", value: true, type: "boolean" }], callback: (data) => handleTimer(data, userdata), isBlocking: false },
    ];

  for (const data of indexdbdata) {
      const evaluator = new DataEvaluator(configevaldata, eventType);
      evaluator.evaluate(data, (success) => {
          if (success) {
              console.log("Todos los callbacks han sido ejecutados");
          } else {
              // console.log("El proceso fue interrumpido debido a una condición bloqueante.");
          }
      });
  }
}

const asdasdcallackback = async (index, data,modifiedData) => {
  console.log("editcallback", index, data,modifiedData);
  if (modifiedData.id) {
    AccionEventsDBManager.updateData(modifiedData);
  }
}
const deadeasdcallackback = async (index, data,modifiedData) => {
  console.log("deletecallback", index, data,modifiedData);
  if (modifiedData.id) {
    AccionEventsDBManager.deleteData(modifiedData.id);
  }
}
const config = {
  nombre: {
    class: 'input-default',
    type: 'textarea',
    returnType: 'string',
  }, // Especifica el orden de las columnas
  Evento: {
    class: 'input-default',
    // label: 'Evento',
    type: 'object',
    eventType: {
      class: 'select-default',
      type: 'select',
      returnType: 'string',
      options: [{ value: 'chat', label: 'Chat' }, { value: 'follow', label: 'Seguimiento' },{ value: 'like', label: 'like'},
     {value: 'share', label: 'compartir'}, { value: 'subscribe', label: 'suscripcion' }, { value: 'gift', label: 'Gift' }],
    },
    chat: {
      label: 'chat',
      class: 'input-default',
      type: 'textarea',
      returnType: 'string',
      hidden: true,
    },
    like: {
      label: 'like',
      class: 'input-default',
      type: 'number',
      returnType: 'number',
      hidden: true,
    },
    gift: {
      class: 'input-default',
      label: '',
      type: 'select',
      returnType: 'number',
      options: getmapselectgift()
    },
  },
  minecraft:{
    class: 'input-default',
    type: 'object',
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
    class: 'input-default',
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
      label: 'texto a leer',
      type: 'text',
      returnType: 'string',
    },
  },
  timer: {
    class: 'input-default',
    label: 'Temporizador',
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    time: {
      class: 'input-default',
      label: 'tiempo',
      type: 'number',
      returnType: 'number',
    },
    action: {
      class: 'input-default',
      label: 'accion',
      type: 'select',
      returnType: 'string',
      options: [{ value: 'start', label: 'iniciar'}, { value: 'stop', label: 'detener'}, { value: 'add', label: 'sumar tiempo'}, { value: 'subtract', label: 'restar tiempo'}],
    },
  },
  profile: {
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    duration: {
      class: 'input-50px',
      label: 'duration',
      type: 'number',
      returnType: 'number',
    },
    text: {
      class: 'input-default',
      label: '',
      type: 'textarea',
      returnType: 'string',
    },
  },
  mediaAudio: {
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    volume: {
      class: 'max-width-90p',
      label: 'volume',
      type: 'slider',
      min: 0,
      max: 100,
      returnType: 'number',
    },
    duration: {
      class: 'input-50px',
      label: 'duration',
      type: 'number',
      returnType: 'number',
    },
    file: {
      class: 'input-default',
      label: '',
      type: 'select',
      returnType: 'number',
      options: audioOptions
    },
  },
  mediaVideo: {
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    volume: {
      class: 'max-width-90p',
      label: 'volume',
      type: 'slider',
      min: 0,
      max: 100,
      returnType: 'number',
    },
    duration: {
      class: 'input-50px',
      label: 'duration',
      type: 'number',
      returnType: 'number',
    },
    file: {
      class: 'input-default',
      label: '',
      type: 'select',
      returnType: 'number',
      options: videoOptions
    },

  },
  mediaImg: {
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    duration: {
      class: 'input-50px',
      label: 'duration',
      type: 'number',
      returnType: 'number',
    },
    file: {
      class: 'input-default',
      label: '',
      type: 'select',
      returnType: 'number',
      options: imageOptions
    },

  },
  vrchat: {
    class: 'input-default',
    label: 'vrchat',
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    chatbox: {
      class: 'input-default',
      label: '',
      type: 'textarea',
      returnType: 'string',
    },
    input: {
      class: 'input-default',
      label: '',
      type: 'select',
      returnType: 'string',
      options: oscOptions,
    },
  },
  Api:{
    class: 'input-default',
    label: 'Api url',
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    url: {
      class: 'input-default',
      label: '',
      type: 'text',
      returnType: 'string',
    },
    data: {
      class: 'input-default',
      label: '',
      type: 'text',
      returnType: 'string',
    },
  },
  Keyboard: {
    class: 'input-default',
    label: 'Keyboard',
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    keys: {
      class: 'input-default',
      label: '',
      type: 'multiSelect',
      returnType: 'array',
      options: optionskeyboard,
    },
  },
  systempoints: {
    class: 'input-default',
    label: 'System points',
    type: 'object',
    check: {
      class: 'filled-in',
      label: 'check',
      type: 'checkbox',
      returnType: 'boolean',
    },
    points: {
      class: 'input-default',
      label: '',
      type: 'number',
      returnType: 'number',
    },
  },
  id: {
    type: 'number',
    returnType: 'number',
    hidden: true,
  }
};
const table = new DynamicTable('#table-container',editcallback, config,deletecallback);

ObserverEvents.subscribe(async (action, data) => {
  if (action === "save") {
    table.clearRows();
    const dataupdate = await AccionEventsDBManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    });
  } else if (action === "delete") {
/*     table.clearRows();
    const dataupdate = await AccionEventsDBManager.getAllData();
    dataupdate.forEach((data) => {
      table.addRow(data);
    }); */
  }
  else if (action === "update") {
    // table.clearRows();
    // const dataupdate = await AccionEventsDBManager.getAllData();
    // dataupdate.forEach((data) => {
    //   table.addRow(data);
    // });
    showAlert ('info', "Actualizado", "1000");
  }
});
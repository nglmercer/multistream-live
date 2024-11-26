import DynamicTable, { EditModal } from '../components/renderfields.js';
import { getTranslation, translations } from '../translations.js';
import { Counter, TypeofData,ComboTracker, replaceVariables, compareObjects,UserInteractionTracker, logger } from '../utils/utils.js'
import socketManager from '../server/socketManager.js'
const container = document.getElementById('container');
const obsconnectdata = {
    ip: {
      class: 'input-default',
      type: 'text2',
      returnType: 'string',
      label: 'IP',
    },
    port: {
      class: 'input-default',
      type: 'number2',
      returnType: 'number',
      label: 'Puerto',
    },
    auth: {
        type: 'object',
        label: 'Contraseña',
        open: true,
        check: {
            class: 'filled-in',
            label: 'check',
            type: 'checkbox',
            returnType: 'boolean',
        },
        password: {
            class: 'input-default',
            type: 'text2',
            returnType: 'string',
            label: 'Contraseña',
        }
    },
    savebutton: {
        class: 'default-button',
        type: 'button',
        label: getTranslation('connect'),
        callback: async (data,modifiedData) => {
            console.log("callbackconfig",data,modifiedData);
            localStorage.setItem("defaultobsdata",JSON.stringify(modifiedData));
            if (modifiedData.auth.check) {
                socketManager.emitMessage("connectobs",modifiedData.ip,modifiedData.port,modifiedData.auth.password);
            } else {
                socketManager.emitMessage("connectobs",modifiedData.ip,modifiedData.port);
            }
        },
    }
}
const defaultobsdata = JSON.parse(localStorage.getItem("defaultobsdata"))|| {
    ip: "localhost",
    port: 4455,
    auth: {
        check: null,
        password: "change_me",
    }
}
const renderer = document.querySelector('zone-renderer');
const obsformelement = new EditModal(obsconnectdata);
const htmlobselement = obsformelement.ReturnHtml(defaultobsdata);
console.log("obsconnectdata",htmlobselement);

const arrayobs = {
    "getScenesList": { function: (...args) => socketemitkey("getScenesList",...args), name: "getScenesList", requiredparams: [] },
    "getVersion": { function: (...args) => socketemitkey("getVersion",...args), name: "getVersion", requiredparams: [] },
    "getStats": { function: (...args) => socketemitkey("getStats",...args), name: "getStats", requiredparams: [] },
    "getHotkeyList": { function: (...args) => socketemitkey("getHotkeyList",...args), name: "getHotkeyList", requiredparams: [] },
    "getProfileList": { function: (...args) => socketemitkey("getProfileList",...args), name: "getProfileList", requiredparams: [] },
    "getVideoSettings": { function: (...args) => socketemitkey("getVideoSettings",...args), name: "getVideoSettings", requiredparams: [] },            
    "getRecordDirectory": { function: (...args) => socketemitkey("getRecordDirectory",...args), name: "getRecordDirectory", requiredparams: [] },
    "getStreamStatus": { function: (...args) => socketemitkey("getStreamStatus",...args), name: "getStreamStatus", requiredparams: [] },
    "getRecordStatus": { function: (...args) => socketemitkey("getRecordStatus",...args), name: "getRecordStatus", requiredparams: [] },
    "getVirtualCamStatus": { function: (...args) => socketemitkey("getVirtualCamStatus",...args), name: "getVirtualCamStatus", requiredparams: [] },
    "getSceneTransitionList": { function: (...args) => socketemitkey("getSceneTransitionList",...args), name: "getSceneTransitionList", requiredparams: [] },
    "getCurrentSceneTransition": { function: (...args) => socketemitkey("getCurrentSceneTransition",...args), name: "getCurrentSceneTransition", requiredparams: [] },
    "getGroupList": { function: (...args) => socketemitkey("getGroupList",...args), name: "getGroupList", requiredparams: [] },
    "getInputList": { function: (...args) => socketemitkey("getInputList",...args), name: "getInputList", requiredparams: [] },
    "getAudioSources": { function: (...args) => socketemitkey("getAudioSources",...args), name: "getAudioSources", requiredparams: [] },
    "checkconnection": { function: (...args) => socketemitkey("checkconnection",...args), name: "checkconnection", requiredparams: [] },            
    
    "getSourceActive": { function: (...args) => socketemitkey("getSourceActive",...args), name: "getSourceActive", requiredparams: ["sourceName"] },
    "getInputVolume": { function: (...args) => socketemitkey("getInputVolume",...args), name: "getInputVolume", requiredparams: ["inputName"] },//params is inputName
    "setCurrentScene": { function: (...args) => socketemitkey("setCurrentScene",...args), name: "setCurrentScene", requiredparams: ["sceneName"] },
    "createClip": { function: (...args) => socketemitkey("createClip",...args), name: "createClip", requiredparams: ["duration"] },
    "setupReplayBuffer": { function: (...args) => socketemitkey("setupReplayBuffer",...args), name: "setupReplayBuffer", requiredparams: ["duration"] },
    "GetSceneItemList": { function: (...args) => socketemitkey("GetSceneItemList",...args), name: "GetSceneItemList", requiredparams: ["sceneName"] },
    "setSourceVisibility": { function: (...args) => socketemitkey("setSourceVisibility",...args), name: "setSourceVisibility", requiredparams: ["sceneName", "sceneItemId", "toggle"] },//params is sceneName and sceneItemId visivility bolean
    "connect": { function: (...args) => socketemitkey("connect",...args), name: "connect", requiredparams: ["ip","port","auth"] } , 
    


    "setInputVolume": { function: (...args) => socketemitkey("setInputVolume",...args), name: "setInputVolume", requiredparams: ["inputName","db","multiplier"] },//params is inputName and {db:Number(0),multiplier:Number(1)}
    "setAudioMute": { function: (...args) => socketemitkey("setAudioMute",...args), name: "setAudioMute", requiredparams: ["inputName","toggle"] },//params is inputName and mute boolean

};
function socketemitkey(key="getVersion",...args) {
    console.log("socketemitkey",key,...args);
    socketManager.emitMessage(key,...args);
}
const mapedarrayobs = Object.entries(arrayobs).map(([key, value]) => ({ value:key, label: key, requiredparams: value.requiredparams }));
socketManager.on("responseobs",(response,key) => {
    console.log("responseobs",response,key);
    localStorage.setItem(key,JSON.stringify(response));
    if (key === "getInputList") renderavaibleinputs(response);
});
mapedarrayobs.forEach((value,key) => {
    //logger.log("debug",key,value,value.value);
    socketManager.on(value.value, async (...args) => {
      console.log("socketemitkey",key,value.value,...args);
      localStorage.setItem(value.value,JSON.stringify(args));
      //socketManager.emitMessage(key,...args);
    });
  });
// sourceName is a name of scene

const slidercontainer = document.getElementById('SliderContainer');
async function createSlider(sliderconfig, input) {
    //console.log("createSlider",sliderconfig,input);
    if (!sliderconfig) return;
    const configslider = {
        id: input.inputName,
        label: input.inputName,
        value: sliderconfig || 0,
        min: -100,
        max: 0,
        step: 1,
        unit: 'dB',
        theme: 'audio',
        layout: 'stacked',
        // callback: async (value) => {
        //     console.log("callback",value, sliderconfig, input);
        //     // const setInputVolume = await obsController.setInputVolume(input.inputName, {
        //     //     //db: 0, 0db to -inf , -inf to number = -100dB
        //     //     //multiplier: 1 to 0, 0.0 to 1.0
        //     //     db: value,
        //     // });
        //     // console.log("setInputVolume", setInputVolume);
        // }
    }
    slidercontainer.createSlider(configslider);
}
container.addEventListener('sliderChange',async (e) => {
    console.log(`${e.detail.id}: ${e.detail.formattedValue}`,e.detail);
/*     const SetInputVolume = await obsController.setInputVolume(e.detail.label,{
        db: Number(e.detail.value)
    }) */
    //arrayobs.setInputVolume.function([e.detail.label,Number(e.detail.value)]);
    socketManager.emitMessage("setInputVolume",e.detail.label,e.detail.value);
    socketManager.emitMessage("changeInputVolume",{inputName:e.detail.label,db:Number(e.detail.value)});
    //console.log("SetInputVolume",SetInputVolume);
    // Object { value: "-18", label: "Audio Output Capture (PulseAudio)", id: "Audio Output Capture (PulseAudio)", formattedValue: "-18.0dB" }
  });
if (localStorage.getItem("getInputList")) renderavaibleinputs(JSON.parse(localStorage.getItem("getInputList")));
async function renderavaibleinputs(getInputList) {
    //    const getInputList = await obsController.getInputList();
    console.log("GetInputList", getInputList);
    if (getInputList?.inputs) {
        getInputList.inputs.forEach(async input => {
            const inputVolume = input.inputVolumeDb;
            createSlider(inputVolume,input);
            // console.log("inputVolume", inputVolume);
            // const setInputVolume = await obsController.setInputVolume(input.inputName, {
            //     //db: 0, 0db to -inf , -inf to number = -100dB
            //     //multiplier: 1 to 0, 0.0 to 1.0
            //     db: -100,
            // });
            // console.log("setInputVolume", setInputVolume);
        });
    }
}
const functionsmoreused = {
   // connectobs: connectobs,
/*     getAllscenes: getAllscenes,
    getAllinputs: getAllinputs,
    setInputVolume: setInputVolume,
    setAudioMute: setAudioMute,
    getSourceActive: getSourceActive,
    setCurrentScene: setCurrentScene,
    GetSceneItemList: GetSceneItemList,
    setSourceVisibility: setSourceVisibility,
    createClip: createClip,
    executebykeyasync: executebykeyasync */
}
function socketreturnvalue(key) {
    console.log("socketreturn",key);
    socketManager.emitMessage(key);
    return;
}
const functionsWithoutParams = {
    "getScenesList": (...args) => socketreturnvalue("getScenesList",...args),
    "getVersion": (...args) => socketreturnvalue("getVersion",...args),
    "getStats": (...args) => socketreturnvalue("getStats",...args),
    "getHotkeyList": (...args) => socketreturnvalue("getHotkeyList",...args),
    "getProfileList": (...args) => socketreturnvalue("getProfileList",...args),
    "getVideoSettings": (...args) => socketreturnvalue("getVideoSettings",...args),
    "getRecordDirectory": (...args) => socketreturnvalue("getRecordDirectory",...args),
    "getStreamStatus": (...args) => socketreturnvalue("getStreamStatus",...args),
    "getRecordStatus": (...args) => socketreturnvalue("getRecordStatus",...args),
    "getVirtualCamStatus": (...args) => socketreturnvalue("getVirtualCamStatus",...args),
    "getSceneTransitionList": (...args) => socketreturnvalue("getSceneTransitionList",...args),
    "getCurrentSceneTransition": (...args) => socketreturnvalue("getCurrentSceneTransition",...args),
    "getGroupList": (...args) => socketreturnvalue("getGroupList",...args),
    "getInputList": (...args) => socketreturnvalue("getInputList",...args),
    "getAudioSources": (...args) => socketreturnvalue("getAudioSources",...args),
    "checkconnection": (...args) => socketreturnvalue("checkconnection",...args)
};

function getlastdata(key,data) {
    console.log("getlastdata",data);
}
function setlastdata(key,data) {
    console.log("setlastdata",data);
}
async function executebykeyasync(key= "getVersion") {
    const valueobsaction = functionsWithoutParams[key];
    if (valueobsaction) {
        try {
            const response = await valueobsaction();
            return response;
        } catch (error) {
            console.error("Error al ejecutar la función:", error);
            return error;
        }
    }
}
export { mapedarrayobs, arrayobs,htmlobselement,functionsmoreused,executebykeyasync};
// const sliderCreator = new SliderCreator('sliders-container');

// Request with data
//await obs.call('SetCurrentProgramScene', {sceneName: 'Gameplay'});

// Both together now
// const {inputMuted} = obs.call('ToggleInputMute', {inputName: 'Camera'});

import{T as z}from"./socketManager.4y85JQfR.js";import{B as L,L as j}from"./Logger.BU1C1vw5.js";import{r as Q,i as O}from"./lit-element.CdPzzhzS.js";import{T as M,x as $}from"./lit-html.Cs9YtZST.js";import{r as D,n as A}from"./state.k4TxN2nw.js";import{e as K,i as J,t as G}from"./directive.CGE4aKEl.js";import{p as H,v as V,r as P,M as _,m as Z}from"./directive-helpers.CY_bUdrT.js";import{e as X}from"./class-map.D2HkPoOL.js";import"./idb.zra9h0q-.js";import"./UserProcessor.Bu3Kw1mL.js";const Y=["Filiz","Astrid","Tatyana","Maxim","Carmen","Ines","Cristiano","Vitoria","Ricardo","Maja","Jan","Jacek","Ewa","Ruben","Lotte","Liv","Seoyeon","Takumi","Mizuki","Giorgio","Carla","Bianca","Karl","Dora","Mathieu","Celine","Chantal","Penelope","Miguel","Mia","Enrique","Conchita","Geraint","Salli","Matthew","Kimberly","Kendra","Justin","Joey","Joanna","Ivy","Raveena","Aditi","Emma","Brian","Amy","Russell","Nicole","Vicki","Marlene","Hans","Naja","Mads","Gwyneth","Zhiyu","es-ES-Standard-A","it-IT-Standard-A","it-IT-Wavenet-A","ja-JP-Standard-A","ja-JP-Wavenet-A","ko-KR-Standard-A","ko-KR-Wavenet-A","pt-BR-Standard-A","tr-TR-Standard-A","sv-SE-Standard-A","nl-NL-Standard-A","nl-NL-Wavenet-A","en-US-Wavenet-A","en-US-Wavenet-B","en-US-Wavenet-C","en-US-Wavenet-D","en-US-Wavenet-E","en-US-Wavenet-F","en-GB-Standard-A","en-GB-Standard-B","en-GB-Standard-C","en-GB-Standard-D","en-GB-Wavenet-A","en-GB-Wavenet-B","en-GB-Wavenet-C","en-GB-Wavenet-D","en-US-Standard-B","en-US-Standard-C","en-US-Standard-D","en-US-Standard-E","de-DE-Standard-A","de-DE-Standard-B","de-DE-Wavenet-A","de-DE-Wavenet-B","de-DE-Wavenet-C","de-DE-Wavenet-D","en-AU-Standard-A","en-AU-Standard-B","en-AU-Wavenet-A","en-AU-Wavenet-B","en-AU-Wavenet-C","en-AU-Wavenet-D","en-AU-Standard-C","en-AU-Standard-D","fr-CA-Standard-A","fr-CA-Standard-B","fr-CA-Standard-C","fr-CA-Standard-D","fr-FR-Standard-C","fr-FR-Standard-D","fr-FR-Wavenet-A","fr-FR-Wavenet-B","fr-FR-Wavenet-C","fr-FR-Wavenet-D","da-DK-Wavenet-A","pl-PL-Wavenet-A","pl-PL-Wavenet-B","pl-PL-Wavenet-C","pl-PL-Wavenet-D","pt-PT-Wavenet-A","pt-PT-Wavenet-B","pt-PT-Wavenet-C","pt-PT-Wavenet-D","ru-RU-Wavenet-A","ru-RU-Wavenet-B","ru-RU-Wavenet-C","ru-RU-Wavenet-D","sk-SK-Wavenet-A","tr-TR-Wavenet-A","tr-TR-Wavenet-B","tr-TR-Wavenet-C","tr-TR-Wavenet-D","tr-TR-Wavenet-E","uk-UA-Wavenet-A","ar-XA-Wavenet-A","ar-XA-Wavenet-B","ar-XA-Wavenet-C","cs-CZ-Wavenet-A","nl-NL-Wavenet-B","nl-NL-Wavenet-C","nl-NL-Wavenet-D","nl-NL-Wavenet-E","en-IN-Wavenet-A","en-IN-Wavenet-B","en-IN-Wavenet-C","fil-PH-Wavenet-A","fi-FI-Wavenet-A","el-GR-Wavenet-A","hi-IN-Wavenet-A","hi-IN-Wavenet-B","hi-IN-Wavenet-C","hu-HU-Wavenet-A","id-ID-Wavenet-A","id-ID-Wavenet-B","id-ID-Wavenet-C","it-IT-Wavenet-B","it-IT-Wavenet-C","it-IT-Wavenet-D","ja-JP-Wavenet-B","ja-JP-Wavenet-C","ja-JP-Wavenet-D","cmn-CN-Wavenet-A","cmn-CN-Wavenet-B","cmn-CN-Wavenet-C","cmn-CN-Wavenet-D","nb-no-Wavenet-E","nb-no-Wavenet-A","nb-no-Wavenet-B","nb-no-Wavenet-C","nb-no-Wavenet-D","vi-VN-Wavenet-A","vi-VN-Wavenet-B","vi-VN-Wavenet-C","vi-VN-Wavenet-D","sr-rs-Standard-A","lv-lv-Standard-A","is-is-Standard-A","bg-bg-Standard-A","af-ZA-Standard-A","Tracy","Danny","Huihui","Yaoyao","Kangkang","HanHan","Zhiwei","Asaf","An","Stefanos","Filip","Ivan","Heidi","Herena","Kalpana","Hemant","Matej","Andika","Rizwan","Lado","Valluvar","Linda","Heather","Sean","Michael","Karsten","Guillaume","Pattara","Jakub","Szabolcs","Hoda","Naayf"];class B{constructor(e={}){this.cfg=e,this.activeAudio=null}async init(){return console.log(`Initializing ${this.constructor.name}`),!0}isAvailable(){return!1}getVoices(){return[]}async speak(e,t={}){throw console.log(e,t,"speak debug",this.cfg),new Error(`'speak' not implemented in ${this.constructor.name}`)}async generateAudioUrl(e,t={}){throw new Error(`'generateAudioUrl' not implemented in ${this.constructor.name}`)}stop(){this.activeAudio&&(console.log(`Stopping audio for ${this.constructor.name}`),this.activeAudio.pause(),this.activeAudio.oncanplaythrough=null,this.activeAudio.onended=null,this.activeAudio.onerror=null,this.activeAudio.src="",this.activeAudio=null)}}const ee={defaultVoice:"Brian",rate:1,pitch:1,volume:.8,cacheSize:50};class W extends B{static defaultSeCfg=ee;constructor(e={}){const t={...W.defaultSeCfg,...e};super(t),this.endpoint="https://api.streamelements.com/kappa/v2/speech",this.cache=new Map,this.cacheKeys=[],console.log("StreamElementsProvider initialized with cfg:",this.cfg)}async init(){return super.init()}isAvailable(){return!0}getVoices(){return Y.map(e=>({name:e}))}_getFinalOpts(e={}){return{voiceName:e.voiceName??this.cfg.defaultVoice,rate:e.rate??this.cfg.rate,pitch:e.pitch??this.cfg.pitch,volume:e.volume??this.cfg.volume,cacheSize:this.cfg.cacheSize}}async generateAudioUrl(e,t={}){if(!e||typeof e!="string"||e.trim().length===0)return Promise.reject(new Error("Text cannot be empty"));const o=this._getFinalOpts(t),i=`${o.voiceName}|${e}`;if(this.cache.has(i)){console.log(`Cache hit: ${i}`);const r=this.cacheKeys.indexOf(i);return r>-1&&this.cacheKeys.splice(r,1),this.cacheKeys.push(i),this.cache.get(i)}console.log(`Cache miss: ${i}. Fetching...`);const n=new URLSearchParams({voice:o.voiceName,text:e.trim()}),a=`${this.endpoint}?${n.toString()}`;try{const r=await fetch(a);if(!r.ok)throw new Error(`SE API error: ${r.status} ${r.statusText}`);const l=await r.blob();l.type!=="audio/mpeg"&&console.warn(`Unexpected audio format: ${l.type}`);const u=URL.createObjectURL(l);if(this.cacheKeys.length>=o.cacheSize){const f=this.cacheKeys.shift(),c=this.cache.get(f);console.log(`Cache full. Revoking: ${f}`),URL.revokeObjectURL(c),this.cache.delete(f)}return this.cache.set(i,u),this.cacheKeys.push(i),u}catch(r){throw console.error("Error generating SE audio URL:",r),r}}async speak(e,t={}){console.log(e,t,"speak debug",this.cfg),this.stop();const o=this._getFinalOpts(t);try{const i=await this.generateAudioUrl(e,o),n=new Audio(i);return this.activeAudio=n,n.volume=Math.max(0,Math.min(1,o.volume)),n.playbackRate=Math.max(.5,Math.min(4,o.rate)),n.preservesPitch=o.pitch===1&&o.rate!==1,console.log(`Playing audio: "${e}" opts:`,{src:i.substring(0,50)+"...",volume:n.volume,rate:n.playbackRate,preservesPitch:n.preservesPitch}),new Promise((a,r)=>{n.oncanplaythrough=()=>n.play().catch(r),n.onended=()=>{console.log(`Audio finished: "${e}"`),this.activeAudio=null,a()},n.onerror=l=>{console.error(`Error playing audio "${e}":`,l),this.activeAudio=null,r(new Error(`Audio playback error: ${l.message||"Unknown"}`))}})}catch(i){return console.error(`Error in speak "${e}":`,i),this.stop(),Promise.reject(i)}}}const te={defaultVoice:"UK English Female",rate:1,pitch:1,volume:1};class x extends B{static defaultRvCfg=te;constructor(e={}){const t={...x.defaultRvCfg,...e};super(t),this.voices=[],this.initialized=!1,console.log("ResponsiveVoiceProvider initialized with cfg:",this.cfg)}async init(){if(await super.init(),this.isAvailable())try{return await new Promise(e=>setTimeout(e,100)),window.responsiveVoice.getVoices?(this.voices=window.responsiveVoice.getVoices().map(e=>({name:e.name})),this.initialized=!0,console.log(`RV initialized. Found ${this.voices.length} voices.`),!0):(console.warn("RV available, but getVoices not ready."),!1)}catch(e){return console.error("Error during RV initialization:",e),!1}else return console.warn("window.responsiveVoice not found."),!1}isAvailable(){return typeof window<"u"&&!!window.responsiveVoice}getVoices(){return this.initialized||console.warn("Getting voices before RV initialized."),this.voices}_getFinalOpts(e={}){return{voiceName:e.voiceName??this.cfg.defaultVoice,rate:e.rate??this.cfg.rate,pitch:e.pitch??this.cfg.pitch,volume:e.volume??this.cfg.volume}}async speak(e,t={}){if(console.log(e,t,"speak debug",this.cfg),!this.isAvailable())return Promise.reject(new Error("RV lib not available."));if(!this.initialized)return Promise.reject(new Error("RV not initialized. Call init()."));if(!e||typeof e!="string"||e.trim().length===0)return Promise.reject(new Error("Text cannot be empty"));const o=this._getFinalOpts(t);return this.stop(),console.log(`Speaking with RV: "${e}" opts:`,o),new Promise((i,n)=>{const a={rate:Math.max(0,Math.min(1.5,o.rate)),pitch:Math.max(0,Math.min(2,o.pitch)),volume:Math.max(0,Math.min(1,o.volume)),onstart:()=>console.log("RV started."),onend:()=>{console.log(`RV finished: "${e}"`),i()},onerror:r=>{console.error(`RV error for "${e}":`,r);try{window.responsiveVoice.cancel()}catch{}n(new Error(`RV error: ${r?.message||"Unknown"}`))}};try{window.responsiveVoice.speak(e.trim(),o.voiceName,a)}catch(r){console.error("Error calling RV speak:",r),n(r)}})}async generateAudioUrl(e,t={}){return console.warn("RV does not support generating audio URLs."),Promise.reject(new Error("RV does not support audio URL generation."))}stop(){if(this.isAvailable()&&window.responsiveVoice.isPlaying()){console.log("Stopping RV audio.");try{window.responsiveVoice.cancel()}catch(e){console.error("Error calling RV cancel:",e)}}}}const ie={rate:1,pitch:1,volume:1,defaultVoice:null};class oe extends B{constructor(e={}){super({...ie,...e}),this.synth=window.speechSynthesis,this.voices=[],this.currentUtt=null}async init(){return this.isAvailable()?(console.log(`Initializing ${this.constructor.name}`),new Promise(e=>{const t=()=>{this.voices=(this.synth?.getVoices()??[]).map(i=>({name:i.name,lang:i.lang,default:i.default,voiceURI:i.voiceURI,localService:i.localService,_native:i})),console.log(`Loaded ${this.voices.length} voices.`),e(!0)};let o=this.synth?.getVoices()??[];o.length>0?(this.voices=o.map(i=>({name:i.name,lang:i.lang,default:i.default,voiceURI:i.voiceURI,localService:i.localService,_native:i})),console.log(`${this.voices.length} voices available immediately.`),e(!0)):(console.log("Waiting for voiceschanged event..."),this.synth?.addEventListener("voiceschanged",t,{once:!0}),setTimeout(()=>{this.voices.length===0&&t()},1e3))})):(console.warn("Web Speech API not available."),!1)}isAvailable(){return typeof window<"u"&&!!window.speechSynthesis}getVoices(){return this.voices}_createUtt(e,t={}){if(!this.isAvailable())return console.error("Web Speech API not available"),null;const o=new SpeechSynthesisUtterance(e),i={...this.cfg,...t};let n=null;return t.voiceName?n=this.voices.find(a=>a.name===t.voiceName)?._native:i.defaultVoice&&(n=this.voices.find(a=>a.name===i.defaultVoice)?._native),n?o.voice=n:this.voices.length>0&&console.warn("Voice not found, browser default used."),o.rate=Math.max(.1,Math.min(10,parseFloat(i.rate??1))),o.pitch=Math.max(0,Math.min(2,parseFloat(i.pitch??1))),o.volume=Math.max(0,Math.min(1,parseFloat(i.volume??1))),o}async speak(e,t={}){console.log(e,t,"speak debug",this.cfg),this.synth?.speaking&&(console.warn("Synth speaking. Cancelling previous."),this.synth.cancel());const o=this._createUtt(e,t);return o?new Promise((i,n)=>{this.currentUtt=o,o.onend=()=>{console.log("Speech finished."),this.currentUtt=null,i()},o.onerror=a=>{console.error("Speech error:",a),this.currentUtt=null,n(new Error(`Speech error: ${a.error}`))},this.synth.speak(o)}):Promise.reject(new Error("Failed to create utterance."))}async generateAudioUrl(e,t={}){return console.warn("generateAudioUrl for WebSpeech plays audio aloud and is unreliable."),Promise.reject(new Error("WebSpeech audio generation not supported reliably."))}stop(){this.isAvailable()&&((this.synth?.speaking||this.synth?.pending)&&(console.log(`Stopping Web Speech for ${this.constructor.name}`),this.synth.cancel()),this.currentUtt=null)}}function re(){if(typeof window>"u"||!window.speechSynthesis)return console.warn("Web Speech API (speechSynthesis) not available."),Promise.resolve([]);const s=window.speechSynthesis;let e=[];const t=o=>(o||[]).map(i=>({name:i.name,lang:i.lang,default:i.default,voiceURI:i.voiceURI,localService:i.localService,_native:i}));return new Promise(o=>{let i=!1;const n=()=>{if(i)return;const r=s.getVoices()??[];r.length>0?(e=t(r),console.log(`getWebSpeechVoices: Loaded ${e.length} voices.`),i=!0,o(e)):console.warn("getWebSpeechVoices: loadAndResolve triggered, but getVoices() returned empty.")},a=s.getVoices()??[];if(a.length>0){e=t(a),console.log(`getWebSpeechVoices: ${e.length} voices available immediately.`),i=!0,o(e);return}console.log("getWebSpeechVoices: Voices not immediate, waiting for voiceschanged event..."),s.addEventListener("voiceschanged",n,{once:!0}),setTimeout(()=>{if(!i){console.log("getWebSpeechVoices: Timeout reached, attempting final voice load.");const r=s.getVoices()??[];e=t(r),e.length>0?console.log(`getWebSpeechVoices: Loaded ${e.length} voices after timeout.`):console.warn("getWebSpeechVoices: Still no voices found after timeout."),i=!0,o(e)}},1500)})}function R(s){return Array.isArray(s)?s.map(t=>({name:t.name,label:`${t.name}`+(t.lang?` (${t.lang})`:""),value:t.name})):[]}async function ne(){console.log("Building TTS Config Data...");const s=re(),e=new W,t=new x;let o=!1;t.isAvailable()&&(o=await t.init(),console.log("ResponsiveVoice init attempt result:",o));const[i]=await Promise.all([s]),n=R(e.getVoices()),a=R(t.getVoices()),r=R(i);return console.log("Voice counts:",{streamElements:n.length,responsiveVoice:a.length,webSpeech:r.length}),{defaults:{streamElements:{defaultVoice:"Brian",rate:1,pitch:1,volume:.8,cacheSize:50},responsiveVoice:{defaultVoice:"UK English Female",rate:1,pitch:1,volume:1},webSpeech:{defaultVoice:"",rate:1,pitch:1,volume:1}},fieldConfigs:{streamElements:{defaultVoice:{label:"Default Voice (SE)",type:"select",required:!0,options:n},rate:{label:"Rate",type:"number",min:.5,max:4,step:.1,required:!0},pitch:{label:"Pitch",type:"number",min:.5,max:2,step:.1,required:!0},volume:{label:"Volume",type:"number",min:0,max:1,step:.05,required:!0},cacheSize:{label:"Cache Size",type:"number",min:0,max:500,step:1,required:!0}},responsiveVoice:{defaultVoice:{label:"Default Voice (RV)",type:"select",required:!0,options:a},rate:{label:"Rate",type:"number",min:0,max:1.5,step:.1,required:!0},pitch:{label:"Pitch",type:"number",min:0,max:2,step:.1,required:!0},volume:{label:"Volume",type:"number",min:0,max:1,step:.05,required:!0}},webSpeech:{defaultVoice:{label:"Default Voice (Web)",type:"select",required:!1,options:r},rate:{label:"Rate",type:"number",min:.1,max:10,step:.1,required:!0},pitch:{label:"Pitch",type:"number",min:0,max:2,step:.1,required:!0},volume:{label:"Volume",type:"number",min:0,max:1,step:.05,required:!0}}}}}class ae{constructor(e){if(!e||!e.defaults||!e.fieldConfigs)throw new Error("TTSConfigManager requires valid configData upon construction.");this.defaults=e.defaults,this.fieldConfigs=e.fieldConfigs,console.log("TTSConfigManager initialized with data:",this)}_getStorageKey(e){return`ttsConfig_${e}`}loadConfig(e){const t=this._getStorageKey(e),o=this.defaults[e]||{};let i={};try{const a=localStorage.getItem(t);a&&(i=JSON.parse(a))}catch(a){console.error(`Error loading/parsing config for ${e} from localStorage:`,a),i={}}const n={...o};for(const a in o)Object.hasOwnProperty.call(o,a)&&Object.hasOwnProperty.call(i,a)&&i[a]!==void 0&&i[a]!==null&&(typeof i[a]==typeof o[a]?n[a]=i[a]:typeof o[a]=="number"&&!isNaN(Number(i[a]))?n[a]=Number(i[a]):console.warn(`Type mismatch for key "${a}" in ${e} config. Using default.`));return n}saveConfig(e,t){const o=this._getStorageKey(e);try{if(typeof t!="object"||t===null)throw new Error("Invalid config type provided to saveConfig.");const i={...t},n=this.defaults[e]||{};for(const r in i)typeof n[r]=="number"&&typeof i[r]!="number"&&(i[r]=Number(i[r]),isNaN(i[r])&&(i[r]=n[r]));const a=JSON.stringify(i);return localStorage.setItem(o,a),console.log(`Saved config for ${e}:`,i),!0}catch(i){return console.error(`Error saving config for ${e} to localStorage:`,i),!1}}getFieldConfigs(e){return JSON.parse(JSON.stringify(this.fieldConfigs[e]||{}))}}class se{constructor(e,t={mode:"archive"}){if(this.queue=[],this.playedQueue=[],this.isPlaying=!1,this.activeProviderName=null,this.currentAudioPromise=null,this.currentIndex=-1,this.currentAudioId=null,!e||typeof e!="object")throw new Error("AudioQueue requires a valid providers map.");this.providers=e,this.mode=t.mode,this.maxHistorySize=t.maxHistorySize||100,console.log(`AudioQueue initialized in ${this.mode} mode.`)}generateId(){return`audio_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}enqueue(e,t,o={},i=!1){if(console.log(`Enqueueing request: "${e.substring(0,30)}...", Provider: ${t}, Immediate: ${i}`),!e||!t)return Promise.reject(new Error("Text and providerName are required for enqueue."));const n=this.generateId();return i?this.playNow(e,t,o,n):new Promise((a,r)=>{const l={id:n,text:e,providerName:t,options:o,status:"pending",createdAt:new Date,resolve:()=>a(n),reject:r};this.queue.push(l),console.log(`Added to queue. Queue length: ${this.queue.length}`),this._processQueue()})}async playNow(e,t,o={},i){const n=i||this.generateId();if(console.log(`Attempting immediate playback: "${e.substring(0,30)}...", Provider: ${t}`),!e||!t)return Promise.reject(new Error("Text and providerName are required for playNow."));this.stopCurrentPlayback();const a=this.providers[t];if(!a||!a.instance)return console.error(`Immediate Playback Error: Provider "${t}" not found.`),Promise.reject(new Error(`Provider "${t}" not found.`));a.initialized||console.warn(`Immediate Playback Warning: Provider "${t}" is not initialized. Attempting anyway.`),this.isPlaying=!0,this.activeProviderName=t,this.currentAudioId=n;try{return console.log(`Executing immediate speak: ${t} - "${e.substring(0,30)}..."`),this.currentAudioPromise=a.instance.speak(e,o),await this.currentAudioPromise,console.log(`Immediate playback finished: ${t}`),this.mode==="archive"&&this._addToPlayedQueue({id:n,text:e,providerName:t,options:o,status:"completed",createdAt:new Date}),Promise.resolve(n)}catch(r){return console.error(`Immediate playback error with ${t}:`,r),Promise.reject(r)}finally{this.isPlaying=!1,this.activeProviderName=null,this.currentAudioPromise=null,this.currentAudioId=null,this._processQueue()}}async _processQueue(){if(this.isPlaying||this.queue.length===0)return;const e=this.queue.shift();this.currentIndex=0,console.log(`_processQueue: Processing item. Remaining queue: ${this.queue.length}. Text: "${e.text.substring(0,30)}...", Provider: ${e.providerName}`);const t=this.providers[e.providerName];if(!t||!t.instance){console.error(`Queue Error: Provider "${e.providerName}" not found. Skipping.`),e.status="error",e.reject(new Error(`Provider "${e.providerName}" not found.`)),this._processQueue();return}t.initialized||console.warn(`Queue Warning: Provider "${e.providerName}" is not initialized. Attempting anyway.`),this.isPlaying=!0,this.activeProviderName=e.providerName,this.currentAudioId=e.id,e.status="playing";try{console.log(`Executing queued speak: ${e.providerName} - "${e.text.substring(0,30)}..."`),this.currentAudioPromise=t.instance.speak(e.text,e.options),await this.currentAudioPromise,console.log(`Queued playback finished: ${e.providerName}`),e.status="completed",this.mode==="archive"&&this._addToPlayedQueue({id:e.id,text:e.text,providerName:e.providerName,options:e.options,status:"completed",createdAt:e.createdAt}),e.resolve()}catch(o){console.error("Queued playback error:",o),e.status="error",e.reject(o)}finally{console.log("Queued playback finally block"),this.isPlaying=!1,this.activeProviderName=null,this.currentAudioPromise=null,this.currentAudioId=null,this._processQueue()}}_addToPlayedQueue(e){this.playedQueue.push(e),this.playedQueue.length>this.maxHistorySize&&this.playedQueue.shift()}async next(){return this.stopCurrentPlayback(),this.isPlaying=!1,this.mode==="loop"&&this.queue.length>0?(this._processQueue(),!0):this.mode==="archive"&&this.queue.length>0?(this._processQueue(),!0):!1}async previous(){if(this.mode==="loop"){if(this.queue.length>0){const e=this.queue.pop();if(e)return this.queue.unshift(e),this.stopCurrentPlayback(),this._processQueue(),!0}}else if(this.mode==="archive"&&this.playedQueue.length>0){const e=this.playedQueue[this.playedQueue.length-1];return await this.playNow(e.text,e.providerName,e.options),!0}return!1}getAllPendingAudios(){return this.queue.map(e=>({id:e.id,text:e.text,providerName:e.providerName,options:e.options,status:e.status,createdAt:e.createdAt}))}getAllPlayedAudios(){return[...this.playedQueue]}getAudioById(e){const t=this.queue.find(i=>i.id===e);return t?{id:t.id,text:t.text,providerName:t.providerName,options:t.options,status:t.status,createdAt:t.createdAt}:this.playedQueue.find(i=>i.id===e)||null}removeAudioById(e){const t=this.queue.findIndex(i=>i.id===e);if(t!==-1)return this.queue.splice(t,1)[0].reject(new Error("Audio item removed from queue")),!0;const o=this.playedQueue.findIndex(i=>i.id===e);return o!==-1?(this.playedQueue.splice(o,1),!0):!1}moveAudio(e,t){const o=this.queue.findIndex(n=>n.id===e);if(o===-1||t<0||t>=this.queue.length)return!1;const[i]=this.queue.splice(o,1);return this.queue.splice(t,0,i),!0}getCurrentAudio(){return this.currentAudioId?this.getAudioById(this.currentAudioId):null}setMode(e){this.mode=e,console.log(`Queue mode changed to: ${e}`)}getMode(){return this.mode}stopCurrentPlayback(){if(this.isPlaying&&this.activeProviderName){const e=this.providers[this.activeProviderName];if(e&&e.instance){console.log(`Stopping current playback by ${this.activeProviderName}.`);try{e.instance.stop()}catch(t){console.error(`Error trying to stop provider ${this.activeProviderName}:`,t)}}this.currentAudioPromise=null}else console.log("StopCurrentPlayback called, but nothing seems to be playing according to state.")}stopAll(){console.log("Stopping all playback and clearing queue."),this.clearQueue(),this.stopCurrentPlayback()}clearQueue(){this.queue.length>0&&(console.log(`Clearing queue. ${this.queue.length} items removed.`),this.queue.forEach(e=>{e.reject(new Error("Queue cleared by stopAll or clearQueue call."))}),this.queue=[])}clearPlayedQueue(){this.playedQueue=[],console.log("Played queue cleared.")}getQueueLength(){return this.queue.length}getPlayedQueueLength(){return this.playedQueue.length}isCurrentlyPlaying(){return this.isPlaying}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=(s,e,t)=>{const o=new Map;for(let i=e;i<=t;i++)o.set(s[i],i);return o},N=K(class extends J{constructor(s){if(super(s),s.type!==G.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,e,t){let o;t===void 0?t=e:e!==void 0&&(o=e);const i=[],n=[];let a=0;for(const r of s)i[a]=o?o(r,a):a,n[a]=t(r,a),a++;return{values:n,keys:i}}render(s,e,t){return this.dt(s,e,t).values}update(s,[e,t,o]){const i=H(s),{values:n,keys:a}=this.dt(e,t,o);if(!Array.isArray(i))return this.ut=a,n;const r=this.ut??=[],l=[];let u,f,c=0,m=i.length-1,h=0,g=n.length-1;for(;c<=m&&h<=g;)if(i[c]===null)c++;else if(i[m]===null)m--;else if(r[c]===a[h])l[h]=V(i[c],n[h]),c++,h++;else if(r[m]===a[g])l[g]=V(i[m],n[g]),m--,g--;else if(r[c]===a[g])l[g]=V(i[c],n[g]),P(s,l[g+1],i[c]),c++,g--;else if(r[m]===a[h])l[h]=V(i[m],n[h]),P(s,i[c],i[m]),m--,h++;else if(u===void 0&&(u=U(a,h,g),f=U(r,c,m)),u.has(r[c]))if(u.has(r[m])){const w=f.get(a[h]),I=w!==void 0?i[w]:null;if(I===null){const q=P(s,i[c]);V(q,n[h]),l[h]=q}else l[h]=V(I,n[h]),P(s,i[c],I),i[w]=null;h++}else _(i[m]),m--;else _(i[c]),c++;for(;h<=g;){const w=P(s,l[g+1]);V(w,n[h]),l[h++]=w}for(;c<=m;){const w=i[c++];w!==null&&_(w)}return this.ut=a,Z(s,l),M}});var le=Object.defineProperty,y=(s,e,t,o)=>{for(var i=void 0,n=s.length-1,a;n>=0;n--)(a=s[n])&&(i=a(e,t,i)||i);return i&&le(e,t,i),i};class v extends Q{constructor(){super(),this.formData={},this.fieldConfigs={},this.customActions=[],this.darkmode=!1,this.submitButtonText="Save",this.cancelButtonText="Cancel",this.showCancelButton=!1,this.showSubmitButton=!0,this.gridColumns="repeat(auto-fit, minmax(250px, 1fr))",this._initialData={},this._currentData={},this._fieldValidationStates={},this._handleFieldChange=e=>{const t=e.target,o=t?.getAttribute("name");if(!o)return;const i=e.detail?.value!==void 0?e.detail.value:typeof t.getVal=="function"?t.getVal():t.value;this._currentData={...this._currentData,[o]:i},typeof t.isValid=="function"&&(this._fieldValidationStates={...this._fieldValidationStates,[o]:t.isValid()}),this.dispatchEvent(new CustomEvent("field-change",{detail:{fieldName:o,value:i,formData:{...this._currentData}},bubbles:!0,composed:!0}))},this._handleSubmit=e=>{e.preventDefault(),this.validate()?(this._initialData=JSON.parse(JSON.stringify(this._currentData)),this._handleCustomAction("submit")):this._focusFirstInvalidField()},this._handleCancel=()=>{this.reset(),this.dispatchEvent(new CustomEvent("cancel",{detail:null,bubbles:!0,composed:!0}))},this._handleCustomAction=e=>{this.dispatchEvent(new CustomEvent("action",{detail:{...this._currentData,action:e},bubbles:!0,composed:!0}))},this._initializeData()}static{this.styles=O`
        :host {
            display: block;
            font-family: var(--form-font-family, sans-serif);
            padding: var(--form-padding, 15px);
            border: var(--form-border, 1px solid #eee);
            border-radius: var(--form-border-radius, 8px);
            background-color: var(--form-bg-color, #f9f9f9);
            margin-bottom: var(--form-margin-bottom, 15px);
            
            --form-primary-color: #28a745;
            --form-secondary-color: #6c757d;
            --form-danger-color: #dc3545;
            --form-info-color: #007bff;
        }

        :host([darkmode]) {
            background-color: var(--form-bg-color-dark, #333);
            border-color: var(--form-border-color-dark, #555);
            color: var(--form-text-color-dark, #eee);
            
            --form-primary-color: #34ce57;
            --form-secondary-color: #8a939b;
            --form-danger-color: #e74c3c;
            --form-info-color: #3498db;
        }

        .form-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .fields-container {
            display: grid;
            grid-template-columns: var(--form-grid-columns, repeat(auto-fit, minmax(250px, 1fr)));
            gap: var(--form-field-gap, 10px 15px);
            padding: 0.5rem;
            border-bottom: 1px solid var(--form-divider-color, #eee);
        }

        :host([darkmode]) .fields-container {
            border-bottom-color: var(--form-divider-color-dark, #555);
        }

        .field-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .field-wrapper.invalid label {
            color: var(--form-danger-color);
        }

        .field-wrapper.hidden {
            display: none;
        }

        label {
            font-weight: var(--form-label-font-weight, 500);
            font-size: var(--form-label-font-size, 0.9em);
            color: var(--form-label-color, #333);
            text-transform: var(--form-label-transform, capitalize);
            margin: 0;
        }

        :host([darkmode]) label {
            color: var(--form-label-color-dark, #eee);
        }

        c-input {
            margin: 0;
        }

        .form-actions {
            display: flex;
            justify-content: var(--form-actions-justify, flex-end);
            gap: var(--form-actions-gap, 10px);
            flex-wrap: wrap;
        }

        .form-button {
            padding: var(--form-button-padding, 8px 16px);
            cursor: pointer;
            border: 1px solid transparent;
            border-radius: var(--form-button-border-radius, 4px);
            font-size: var(--form-button-font-size, 0.95em);
            font-weight: var(--form-button-font-weight, 500);
            transition: all 0.2s ease;
            background-color: #fff;
            color: #333;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: var(--form-button-min-width, 80px);
        }

        .form-button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-button:active:not(:disabled) {
            transform: translateY(0);
        }

        .form-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .form-button--primary {
            background-color: var(--form-primary-color);
            color: white;
            border-color: var(--form-primary-color);
        }

        .form-button--secondary {
            background-color: var(--form-secondary-color);
            color: white;
            border-color: var(--form-secondary-color);
        }

        .form-button--danger {
            background-color: var(--form-danger-color);
            color: white;
            border-color: var(--form-danger-color);
        }

        .form-button--info {
            background-color: var(--form-info-color);
            color: white;
            border-color: var(--form-info-color);
        }

        .form-button--outline {
            background-color: transparent;
            color: var(--form-secondary-color);
            border-color: var(--form-secondary-color);
        }

        :host([darkmode]) .form-button {
            background-color: var(--form-button-bg-dark, #555);
            border-color: var(--form-button-border-dark, #777);
            color: var(--form-button-text-dark, #eee);
        }

        :host([darkmode]) .form-button:hover:not(:disabled) {
            filter: brightness(1.1);
        }

        .no-fields-message {
            text-align: center;
            color: var(--form-secondary-color);
            font-style: italic;
            padding: 20px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .fields-container {
                grid-template-columns: 1fr;
            }
            
            .form-actions {
                flex-direction: column;
            }
            
            .form-button {
                width: 100%;
            }
        }
    `}willUpdate(e){e.has("formData")&&this._initializeData(),e.has("fieldConfigs")&&this._validateAllFields(),e.has("gridColumns")&&this.style.setProperty("--form-grid-columns",this.gridColumns)}_initializeData(){try{this._initialData=JSON.parse(JSON.stringify(this.formData||{})),this._currentData=JSON.parse(JSON.stringify(this.formData||{}))}catch(e){console.error("LitFormBuilder: Error copying form data",e),this._initialData={},this._currentData={}}}_validateAllFields(){const e={};Object.keys(this.fieldConfigs).forEach(t=>{const o=this.shadowRoot?.querySelector(`c-input[name="${t}"]`);o&&typeof o.isValid=="function"?e[t]=o.isValid():e[t]=!0}),this._fieldValidationStates=e}_focusFirstInvalidField(){const e=this.shadowRoot?.querySelector(".field-wrapper.invalid c-input");e&&typeof e.focus=="function"&&e.focus()}_getFieldValue(e){return this._currentData[e]}_renderField(e,t){const o=this._getFieldValue(e),i=this._fieldValidationStates[e]!==!1,n=`form-field-${e}`,a={"field-wrapper":!0,invalid:!i,hidden:t.hidden===!0};return $`
            <div class=${X(a)}>
                <label for=${n}>
                    ${t.label||e}
                    ${t.required?$`<span style="color: var(--form-danger-color);"> *</span>`:""}
                </label>
                <c-input
                    id=${n}
                    name=${e}
                    type=${t.type||"text"}
                    .value=${o!=null?String(o):""}
                    placeholder=${t.placeholder||""}
                    ?required=${t.required}
                    ?disabled=${t.disabled}
                    ?readonly=${t.readonly}
                    ?multiple=${t.multiple}
                    ?darkmode=${this.darkmode}
                    min=${t.min}
                    max=${t.max}
                    step=${t.step}
                    pattern=${t.pattern||""}
                    title=${t.title||""}
                    .options=${t.options||[]}
                    @change=${this._handleFieldChange}
                ></c-input>
            </div>
        `}_renderActions(){return $`
            <div class="form-actions">
                ${this.showCancelButton?$`
                    <button 
                        type="button" 
                        class="form-button form-button--outline"
                        @click=${this._handleCancel}
                    >
                        ${this.cancelButtonText}
                    </button>
                `:""}

                ${N(this.customActions,e=>e.name,e=>$`
                    <button
                        type="button"
                        class="form-button ${e.className||""}"
                        @click=${()=>this._handleCustomAction(e.name)}
                    >
                        ${e.label}
                    </button>
                `)}

                ${this.showSubmitButton?$`
                    <button 
                        type="submit" 
                        class="form-button form-button--primary"
                    >
                        ${this.submitButtonText}
                    </button>
                `:""}
            </div>
        `}render(){const e=Object.keys(this.fieldConfigs).length>0;return $`
            <form class="form-container" @submit=${this._handleSubmit} novalidate>
                <div class="fields-container">
                    ${e?N(Object.entries(this.fieldConfigs),([t])=>t,([t,o])=>this._renderField(t,o)):$`<div class="no-fields-message">No fields configured</div>`}
                </div>
                ${this._renderActions()}
            </form>
        `}setConfig(e={},t={}){this.formData=e,this.fieldConfigs=t}setData(e={}){this.formData=e}addAction(e,t,o=""){if(!e||!t){console.error("LitFormBuilder: Action name and label are required");return}const i=this.customActions.findIndex(a=>a.name===e),n={name:e,label:t,className:o,type:"button"};i>=0?this.customActions=[...this.customActions.slice(0,i),n,...this.customActions.slice(i+1)]:this.customActions=[...this.customActions,n]}removeAction(e){this.customActions=this.customActions.filter(t=>t.name!==e)}validate(){let e=!0;const t={};return Object.keys(this.fieldConfigs).forEach(o=>{const i=this.shadowRoot?.querySelector(`c-input[name="${o}"]`);let n=!0;i&&typeof i.isValid=="function"&&(n=i.isValid()),t[o]=n,n||(e=!1)}),this._fieldValidationStates=t,e}getCurrentData(){const e={...this._currentData};return Object.keys(this.fieldConfigs).forEach(t=>{const o=this.shadowRoot?.querySelector(`c-input[name="${t}"]`);o&&typeof o.getVal=="function"&&(e[t]=o.getVal())}),e}reset(){this._currentData=JSON.parse(JSON.stringify(this._initialData)),Object.keys(this.fieldConfigs).forEach(e=>{const t=this.shadowRoot?.querySelector(`c-input[name="${e}"]`);t&&typeof t.setVal=="function"&&t.setVal(this._initialData[e])}),this._fieldValidationStates={}}setFieldOptions(e,t){if(!this.fieldConfigs[e]){console.warn(`LitFormBuilder: Field "${e}" not found in configuration`);return}this.fieldConfigs={...this.fieldConfigs,[e]:{...this.fieldConfigs[e],options:t}}}setFieldValue(e,t){this._currentData={...this._currentData,[e]:t};const o=this.shadowRoot?.querySelector(`c-input[name="${e}"]`);o&&typeof o.setVal=="function"&&o.setVal(t)}getFieldValue(e){const t=this.shadowRoot?.querySelector(`c-input[name="${e}"]`);return t&&typeof t.getVal=="function"?t.getVal():this._currentData[e]}}y([A({type:Object})],v.prototype,"formData");y([A({type:Object})],v.prototype,"fieldConfigs");y([A({type:Array})],v.prototype,"customActions");y([A({type:Boolean,reflect:!0})],v.prototype,"darkmode");y([A({type:String})],v.prototype,"submitButtonText");y([A({type:String})],v.prototype,"cancelButtonText");y([A({type:Boolean})],v.prototype,"showCancelButton");y([A({type:Boolean})],v.prototype,"showSubmitButton");y([A({type:String})],v.prototype,"gridColumns");y([D()],v.prototype,"_initialData");y([D()],v.prototype,"_currentData");y([D()],v.prototype,"_fieldValidationStates");customElements.get("form-builder")||customElements.define("form-builder",v);const d=new L("TTS").setLevel(j.LOG);z.on("play_arrow",async s=>{d.log("TiktokEmitter",s),ce(s.user.data.comment)});let C=null,k,T,S={},b;const E=new se(S,{mode:"loop"});function p(s){d.log(`Status: ${s}`)}document.addEventListener("DOMContentLoaded",async()=>{p("Initializing...");try{p("Building configuration (loading voices)..."),T=await ne(),p("Configuration built.")}catch(r){d.error("FATAL: Could not build TTS configuration:",r),p("Error building configuration! Check logger.");return}const s=new ae(T),e=["streamElements","responsiveVoice","webSpeech"];e.forEach(r=>{const l=document.getElementById(`${r}-config`);if(l)try{const u=s.loadConfig(r),f=s.getFieldConfigs(r);d.log(`Setting config for ${r}. Field Configs:`,f,u),(!f||Object.keys(f).length===0)&&d.error(`!!! FieldConfigs for ${r} are empty or invalid.`),f.defaultVoice&&(!f.defaultVoice.options||f.defaultVoice.options.length===0)&&d.warn(`!!! Voice options for ${r} select are empty.`),l.setConfig(u,f),l.addEventListener("action",c=>{d.log(`Config updated for ${r}, saving...`,c.detail),s.saveConfig(r,c.detail)?t(r):alert(`Failed to save configuration for ${r}!`)})}catch(u){d.error(`Error setting up config display for ${r}:`,u)}else d.warn(`Could not find display element for ${r}`)});function t(r){const l=s.loadConfig(r);let u=null,f=Promise.resolve(!1);try{r==="streamElements"?u=new W(l):r==="responsiveVoice"?typeof responsiveVoice<"u"?u=new x(l):d.warn("ResponsiveVoice library not loaded for instantiation."):r==="webSpeech"&&(u=new oe(l)),u&&(f=u.init())}catch(c){d.error(`Error creating provider ${r}:`,c)}u?(S[r]={instance:u,initialized:!1},d.log(`Instantiated ${r} with config:`,l),f.then(c=>{c?(S[r].initialized=!0,d.log(`${r} provider initialized successfully.`),p(`${r} ready.`)):(d.warn(`${r} provider failed to initialize or is not available.`),p(`${r} unavailable.`))}).catch(c=>{d.error(`Error initializing ${r} provider:`,c),p(`${r} init error.`)})):(delete S[r],p(`${r} cannot be created.`))}e.forEach(t);const o=document.getElementById("tts-text"),i=document.getElementById("tts-provider-select")||{value:F()},n=document.getElementById("speak-button"),a=document.getElementById("stop-button");k=S[i.value],i&&i.addEventListener&&(i.value=F(),i?.addEventListener("change",async()=>{b=i.value,localStorage.setItem("selectedProviderName",b)})),d.log("providerSelect.value",i.value),n&&n.addEventListener("click",async()=>{b=i.value;const r=o.value,l=b;if(r&&l)try{p(`Playing immediately with ${l}...`),await E.playNow(r,l),p(`Finished immediate playback with ${l}.`)}catch(u){d.error(`Error playing immediately with ${l}:`,u),p(`Error with ${l}: ${u.message}`)}else d.warn("No text or provider selected for immediate playback.")}),a&&a.addEventListener("click",()=>{C&&S[C]?.instance?(S[C].instance.stop(),p(`Stopped ${C}.`)):(Object.values(S).forEach(r=>r.instance?.stop()),p("Stopped any active speech.")),C=null})});function F(s){if(!b){const e=localStorage.getItem("selectedProviderName");e?b=e:b=s}return b?b||s:"webSpeech"}async function ce(s,e=b,t=!1){if(!k.initialized){p(`${e} provider not yet initialized.`);return}if(k&&k.instance){d.log("rawdata",{textToSpeak:s,Providername:e,playNow:t}),C=e,p(`Speaking with ${e}...`);try{t?(Object.values(S).forEach(o=>o.instance?.stop()),await k.instance.speak(s)):(await E.enqueue(s,e),p(`Finished speaking with ${e}.`))}catch(o){d.error(`Error speaking with ${e}:`,o),p(`Error with ${e}: ${o.message}`)}}}async function we(){E?E.next():d.warn("AudioQueue is empty or not initialized.")}export{we as n,ce as p};

var Kt=Object.defineProperty;var Zt=(n,e,t)=>e in n?Kt(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var b=(n,e,t)=>Zt(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const xt=document.createElement("template");xt.innerHTML=`
  <style>
    :host {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--background, rgba(0,0,0,0.8));
      color: var(--color, white);
      padding: 15px;
      border-radius: 8px;
      max-width: 300px;
      display: none;
      z-index: 1000;
    }
    
    .original {
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .translation {
      margin-top: 5px;
      opacity: 0.9;
    }
  </style>
  <div class="original"></div>
  <div class="translations"></div>
`;class Jt extends HTMLElement{constructor(){super(),this._queue=[],this._current=null,this._timeoutId=null,this.attachShadow({mode:"open"}).appendChild(xt.content.cloneNode(!0))}get delay(){const e=this._queue.length,t=this._calculateSize(this._current);let s;e>2?s=1e3:e<=1?s=1500:s=2500;const i=t/100;return console.log("sizeFactor",s+i*1e3),s+i*1e3}_calculateSize(e){return e?typeof e=="object"?JSON.stringify(e).length:e.length:0}addToQueue(e){this._queue.push(e),this._current||this._processQueue()}_processQueue(){if(this._timeoutId&&clearTimeout(this._timeoutId),this._queue.length===0){this._current=null,this.shadowRoot.host.style.display="none";return}this._current=this._queue.shift(),this._displayCurrent(),this._timeoutId=setTimeout(()=>this._processQueue(),this.delay)}_displayCurrent(){this.shadowRoot.host.style.display="block";const e=this.shadowRoot.querySelector(".original"),t=this.shadowRoot.querySelector(".translations");e.textContent=this._current.input,t.innerHTML=Object.entries(this._current.traducciones).map(([s,i])=>`<div class="translation"><strong>${s}:</strong> ${i}</div>`).join("")}setColor(e){this.setAttribute("color",e),this.shadowRoot.host.style.setProperty("--color",e)}setBackground(e){this.setAttribute("background",e),this.shadowRoot.host.style.setProperty("--background",e)}}customElements.get("translation-queue")||customElements.define("translation-queue",Jt);(()=>{const n=new Map,e=new Promise(t=>{window.addEventListener("pointerdown",t,{once:!0}),window.addEventListener("keydown",t,{once:!0})});return async t=>{try{const s=new Audio;if(s.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",await s.play(),t&&t.id&&n.has(t.id)){const r=n.get(t.id);if(r)return r}const i=new AudioContext(t);return t&&t.id&&n.set(t.id,i),i}catch{if(await e,t&&t.id&&n.has(t.id)){const r=n.get(t.id);if(r)return r}const i=new AudioContext(t);return t&&t.id&&n.set(t.id,i),i}}})();const Xt=n=>new Promise((e,t)=>{const s=new FileReader;s.onload=()=>{if(s.result){const i=JSON.parse(s.result);e(i)}else t("oops")},s.readAsText(n)});function kt(n){var e=atob(n),t=new Uint8Array(e.length);for(let s=0;s<e.length;s++)t[s]=e.charCodeAt(s);return t.buffer}const es={isClientContentMessage:ns,isInterrupted:hs,isModelTurn:ts,isServerContentMessage:os,isSetupCompleteMessage:rs,isToolCall:us,isToolCallCancellationMessage:ls,isToolCallMessage:as,isTurnComplete:cs};function ts(n){var c;const e=n;if(console.log("isModelTurn",n),!e.modelTurn||!e.modelTurn.parts)return n;let t=(c=e.modelTurn)==null?void 0:c.parts;const s=t.filter(a=>a.inlineData&&a.inlineData.mimeType.startsWith("audio/pcm")),i=s.map(a=>{var l;return(l=a.inlineData)==null?void 0:l.data}),r=t.filter(a=>!s.includes(a));if(i.forEach(a=>{if(a){const l=kt(a);console.log("server.audio",`buffer (${l.byteLength})`)}}),ss(n.modelTurn.parts[0]),!r.length){console.log("no hay otros parts",r);return}return t=r,console.log("isModelTurn content",{modelTurn:{parts:t}}),n.modelTurn}function ss(n){if(!n.inlineData){console.log("playAudio",n),is(n);return}ms(n.inlineData.data,n.inlineData.mimeType)}function is(n){try{if(!n||!n.text)throw new Error("La respuesta está vacía o es indefinida.");const e=n.text.trim();if(!e.startsWith("```json")||!e.endsWith("```"))throw new Error("El formato del JSON no es válido.");const t=e.replace(/```json\n|\n```/g,""),s=JSON.parse(t),i=he.getInstance("translation");return i&&i.emit("translation",s),console.log("Respuesta exitosa:",s),s}catch(e){return console.error("Error al parsear la respuesta:",e.message),null}}function se(n,e,t="object"){return n!=null&&typeof n=="object"&&typeof n[e]===t}function ns(n){return se(n,"clientContent")}function rs(n){return se(n,"setupComplete")}function os(n){return se(n,"serverContent")}function as(n){return se(n,"toolCall")}function ls(n){return se(n,"toolCallCancellation")&&ps(n.toolCallCancellation)}function cs(n){return typeof n=="object"&&typeof n.turnComplete=="boolean"}function hs(n){return typeof n=="object"&&n.interrupted===!0}function us(n){if(!n||typeof n!="object")return!1;const e=n;return Array.isArray(e.functionCalls)&&e.functionCalls.every(ds)}function ds(n){if(!n||typeof n!="object")return!1;const e=n;return typeof e.name=="string"&&typeof e.id=="string"&&typeof e.args=="object"&&e.args!==null}function ps(n){return typeof n=="object"&&Array.isArray(n.ids)}class fs{constructor(){this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.audioQueue=[],this.isPlaying=!1,this.currentSource=null,this.analyser=null,this.dataArray=null,this.bufferLength=256,this.rafId=null}async setAudioData(e,t){if(t.includes("audio/pcm")){const s=this.base64ToArrayBuffer(e),i=bs(s,24e3);this.addToQueue(i,"audio/wav")}else this.addToQueue(e,t);this.isPlaying||this.playNextChunk()}addToQueue(e,t){this.audioQueue.push({data:e,mimeType:t})}async decodeAudioData(e,t){try{return await this.audioContext.decodeAudioData(e)}catch(s){throw console.error("Error decoding audio data:",s),s}}base64ToArrayBuffer(e){const t=atob(e),s=t.length,i=new Uint8Array(s);for(let r=0;r<s;r++)i[r]=t.charCodeAt(r);return i.buffer}async playNextChunk(){if(this.audioQueue.length===0){this.isPlaying=!1;return}this.isPlaying=!0;const{data:e,mimeType:t}=this.audioQueue.shift();this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=this.bufferLength,this.dataArray=new Uint8Array(this.analyser.frequencyBinCount);const s=await this.decodeAudioData(e,t),i=this.audioContext.createBufferSource();i.buffer=s,i.connect(this.analyser),this.analyser.connect(this.audioContext.destination),this.setupVisualizer(),i.start(0),this.currentSource=i,i.onended=()=>{cancelAnimationFrame(this.rafId),this.playNextChunk()}}setupVisualizer(){const e=document.querySelector("audio-visualizer");if(!e)return;const t=()=>{this.analyser.getByteTimeDomainData(this.dataArray),e.updateData(this.dataArray),this.rafId=requestAnimationFrame(t)};this.rafId=requestAnimationFrame(t)}stop(){this.currentSource&&(this.currentSource.stop(),this.currentSource.disconnect()),cancelAnimationFrame(this.rafId),this.audioQueue=[],this.isPlaying=!1}updateVisualizerInRealTime(e){const t=document.querySelector("audio-visualizer");if(!t)return;this.visualizerIntervalId&&(clearInterval(this.visualizerIntervalId),this.visualizerIntervalId=null);const s=50,i=e*1e3/s;let r=0;this.visualizerIntervalId=setInterval(()=>{if(r>=i){clearInterval(this.visualizerIntervalId),this.visualizerIntervalId=null;return}const o=r/i,c=this.calculateCurrentSamples(o);t.updateData(c),r++},s)}calculateCurrentSamples(e){try{if(!this.pcmData||this.pcmData.length===0)return new Float32Array(0);const t=Math.floor(e*this.pcmData.length),s=t+Math.floor(this.pcmData.length/this.bufferLength);return this.pcmData.slice(t,s)}catch(t){return console.error("Buffer detached:",t),new Float32Array(0)}}}const gs=new fs;async function ms(n,e){const t=document.querySelector("audio-visualizer");try{if(await gs.setAudioData(n,e),!t){console.error("Visualizador no encontrado");return}}catch(s){console.error("Error al cargar audio:",s)}}function bs(n,e){if(!(n instanceof ArrayBuffer))throw new Error("pcmData debe ser un ArrayBuffer");const t=new Uint8Array(n),s=new ArrayBuffer(44+t.length),i=new DataView(s),r=(c,a)=>{for(let l=0;l<a.length;l++)i.setUint8(c+l,a.charCodeAt(l))};return r(0,"RIFF"),i.setUint32(4,36+t.length,!0),r(8,"WAVE"),r(12,"fmt "),i.setUint32(16,16,!0),i.setUint16(20,1,!0),i.setUint16(22,1,!0),i.setUint32(24,e,!0),i.setUint32(28,e*2,!0),i.setUint16(32,2,!0),i.setUint16(34,16,!0),r(36,"data"),i.setUint32(40,t.length,!0),new Uint8Array(s,44).set(t),s}const I=class I{constructor(e){if(I.instances.has(e))return I.instances.get(e);this.id=e,this.events={},this.history=[],I.instances.set(e,this)}on(e,t){return this.events[e]||(this.events[e]=[]),this.events[e].push(t),this}emit(e,...t){return this.events[e]&&this.events[e].forEach(s=>s(...t)),this}off(e,t){return this.events[e]&&(this.events[e]=this.events[e].filter(s=>s!==t)),this}saveToHistory(e){return this.history.push(e),this}getHistory(){return this.history}clearHistory(){return this.history=[],this}static getInstance(e){if(!I.instances.has(e))throw new Error(`No Emitter instance found with id: ${e}`);return I.instances.get(e)}};b(I,"instances",new Map);let he=I;document.querySelector("#app").innerHTML=`
  <div class="container mx-auto">
  <audio-stream-player id="voiceplayer"></audio-stream-player>
    <call-control-bar state="active"></call-control-bar>
    </div>
`;const Le=document.createElement("translation-queue");document.body.appendChild(Le);const ys=new he("translation");ys.on("translation",n=>{console.log("Translation received:",n),Le.addToQueue(n)});Le.addToQueue({input:"Hola",traducciones:{es:"Hola",en:"Hello"}});const St="Eres una IA de traducción. Tu tarea es recibir un texto en español y devolver un JSON con las traducciones al inglés y japonés. O también, si no se entiende o se hacen gestos, acciones o onomatopeyas, puedes narrarlo en el formato deseado.",vs="<texto original en español usando muchos términos en inglés también>",At=[{label:"traducción al español",value:"es"},{label:"traducción al inglés",value:"en"},{label:"traducción al japonés",value:"jp"},{label:"traducción al portugués",value:"pt"},{label:"traducción al francés",value:"fr"},{label:"traducción al italiano",value:"it"}];function ws(n,e,t){return t.length===0&&(t=At),`
${n}
Formato de salida:  
{  
  "input": "${e}",
  "traducciones": {
    ${t.map(s=>`"${s.value}": "${s.label}"`).join(`,
`)}
  }  
}`}function xs(){var e;const n=document.createElement("custom-modal");n.id="modal_content",n.innerHTML=`
    <custom-input
      type="text"
      id="apikey"
      name="apikey"
      value="${localStorage.getItem("API_KEY")||""}"
      placeholder="API Key"
    ></custom-input>
    <custom-input
      type="textarea"
      id="mainInstruction"
      name="mainInstruction"
      value="${((e=localStorage.getItem("configAPI"))==null?void 0:e.mainInstruction)||St}"
      placeholder="Main Instruction"
    ></custom-input>
    <custom-input
      type="textarea"
      id="inputText"
      name="inputText"
      value="${localStorage.getItem("inputText")||vs}"
      placeholder="Input Text Prompt"
    ></custom-input>
    <enhanced-select multiple
      style="border: 0px;"
      id="select_servers"
      name="select_servers"
    ></enhanced-select>
  `,document.body.appendChild(n),setTimeout(()=>{document.querySelector("#select_servers").setOptions(At)},200),document.querySelectorAll("custom-input").forEach(t=>{t.addEventListener("input-change",()=>{$e()})}),document.querySelector("#select_servers").addEventListener("change",()=>{$e()})}function $e(){const n=Ss();localStorage.setItem("configAPI",JSON.stringify(n))}function ks(){const n=localStorage.getItem("configAPI");if(n){console.log("lastData",JSON.parse(n));const e=JSON.parse(n);As(e)}$e()}function Ss(){const n=document.querySelector("#apikey").getInputValues(),e=document.querySelector("#mainInstruction").getInputValues(),t=document.querySelector("#inputText").getInputValues(),s=document.querySelector("#select_servers").getSelectedOptions(),i=document.querySelector("#select_servers").getValue(),r=ws(e,t,s);return{apikey:n,mainInstruction:e,inputText:t,selectServers:s,selectValue:i,stringInstruction:r}}function As(n){document.querySelector("#apikey").setInputValues(n.apikey),document.querySelector("#mainInstruction").setInputValues(n.mainInstruction||St),document.querySelector("#inputText").setInputValues(n.inputText),n.selectValue&&(console.log("data.selectServers",n.selectValue),document.querySelector("#select_servers").setSelectedValues(n.selectValue))}xs();setTimeout(ks,500);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ce=globalThis,Oe=ce.ShadowRoot&&(ce.ShadyCSS===void 0||ce.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Me=Symbol(),We=new WeakMap;let Et=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Oe&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=We.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&We.set(t,e))}return e}toString(){return this.cssText}};const $t=n=>new Et(typeof n=="string"?n:n+"",void 0,Me),Ct=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Et(t,n,Me)},Es=(n,e)=>{if(Oe)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),i=ce.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},Fe=Oe?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return $t(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$s,defineProperty:Cs,getOwnPropertyDescriptor:_s,getOwnPropertyNames:Ts,getOwnPropertySymbols:Is,getPrototypeOf:Rs}=Object,O=globalThis,Ge=O.trustedTypes,Ls=Ge?Ge.emptyScript:"",xe=O.reactiveElementPolyfillSupport,Q=(n,e)=>n,Ce={toAttribute(n,e){switch(e){case Boolean:n=n?Ls:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},_t=(n,e)=>!$s(n,e),Qe={attribute:!0,type:String,converter:Ce,reflect:!1,hasChanged:_t};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);class V extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Qe){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Cs(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=_s(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Qe}static _$Ei(){if(this.hasOwnProperty(Q("elementProperties")))return;const e=Rs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Q("properties"))){const t=this.properties,s=[...Ts(t),...Is(t)];for(const i of s)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(Fe(i))}else e!==void 0&&t.push(Fe(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Es(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){var r;const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Ce).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){var r;const s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Ce;this._$Em=i,this[i]=c.fromAttribute(t,o.type),this._$Em=null}}requestUpdate(e,t,s){if(e!==void 0){if(s??(s=this.constructor.getPropertyOptions(e)),!(s.hasChanged??_t)(this[e],t))return;this.P(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(t)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}}V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[Q("elementProperties")]=new Map,V[Q("finalized")]=new Map,xe==null||xe({ReactiveElement:V}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=globalThis,ue=Y.trustedTypes,Ye=ue?ue.createPolicy("lit-html",{createHTML:n=>n}):void 0,Tt="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,It="?"+R,Os=`<${It}>`,N=document,X=()=>N.createComment(""),ee=n=>n===null||typeof n!="object"&&typeof n!="function",Pe=Array.isArray,Ms=n=>Pe(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",ke=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Ze=/>/g,M=RegExp(`>|${ke}(?:([^\\s"'>=/]+)(${ke}*=${ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Je=/'/g,Xe=/"/g,Rt=/^(?:script|style|textarea|title)$/i,Ps=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),L=Ps(1),B=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),et=new WeakMap,P=N.createTreeWalker(N,129);function Lt(n,e){if(!Pe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(e):e}const Ns=(n,e)=>{const t=n.length-1,s=[];let i,r=e===2?"<svg>":e===3?"<math>":"",o=W;for(let c=0;c<t;c++){const a=n[c];let l,h,u=-1,d=0;for(;d<a.length&&(o.lastIndex=d,h=o.exec(a),h!==null);)d=o.lastIndex,o===W?h[1]==="!--"?o=Ke:h[1]!==void 0?o=Ze:h[2]!==void 0?(Rt.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=M):h[3]!==void 0&&(o=M):o===M?h[0]===">"?(o=i??W,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,l=h[1],o=h[3]===void 0?M:h[3]==='"'?Xe:Je):o===Xe||o===Je?o=M:o===Ke||o===Ze?o=W:(o=M,i=void 0);const p=o===M&&n[c+1].startsWith("/>")?" ":"";r+=o===W?a+Os:u>=0?(s.push(l),a.slice(0,u)+Tt+a.slice(u)+R+p):a+R+(u===-2?c:p)}return[Lt(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class te{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0;const c=e.length-1,a=this.parts,[l,h]=Ns(e,t);if(this.el=te.createElement(l,s),P.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=P.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Tt)){const d=h[o++],p=i.getAttribute(u).split(R),f=/([.?@])?(.*)/.exec(d);a.push({type:1,index:r,name:f[2],strings:p,ctor:f[1]==="."?zs:f[1]==="?"?Ds:f[1]==="@"?Vs:be}),i.removeAttribute(u)}else u.startsWith(R)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(Rt.test(i.tagName)){const u=i.textContent.split(R),d=u.length-1;if(d>0){i.textContent=ue?ue.emptyScript:"";for(let p=0;p<d;p++)i.append(u[p],X()),P.nextNode(),a.push({type:2,index:++r});i.append(u[d],X())}}}else if(i.nodeType===8)if(i.data===It)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(R,u+1))!==-1;)a.push({type:7,index:r}),u+=R.length-1}r++}}static createElement(e,t){const s=N.createElement("template");return s.innerHTML=e,s}}function q(n,e,t=n,s){var o,c;if(e===B)return e;let i=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const r=ee(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=q(n,i._$AS(n,e.values),i,s)),e}class Bs{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=((e==null?void 0:e.creationScope)??N).importNode(t,!0);P.currentNode=i;let r=P.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new ie(r,r.nextSibling,this,e):a.type===1?l=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(l=new Us(r,this,e)),this._$AV.push(l),a=s[++c]}o!==(a==null?void 0:a.index)&&(r=P.nextNode(),o++)}return P.currentNode=N,i}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class ie{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=q(this,e,t),ee(e)?e===k||e==null||e===""?(this._$AH!==k&&this._$AR(),this._$AH=k):e!==this._$AH&&e!==B&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ms(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==k&&ee(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=te.createElement(Lt(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(t);else{const o=new Bs(i,this),c=o.u(this.options);o.p(t),this.T(c),this._$AH=o}}_$AC(e){let t=et.get(e.strings);return t===void 0&&et.set(e.strings,t=new te(e)),t}k(e){Pe(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new ie(this.O(X()),this.O(X()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class be{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=k,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=k}_$AI(e,t=this,s,i){const r=this.strings;let o=!1;if(r===void 0)e=q(this,e,t,0),o=!ee(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const c=e;let a,l;for(e=r[0],a=0;a<r.length-1;a++)l=q(this,c[s+a],t,a),l===B&&(l=this._$AH[a]),o||(o=!ee(l)||l!==this._$AH[a]),l===k?e=k:e!==k&&(e+=(l??"")+r[a+1]),this._$AH[a]=l}o&&!i&&this.j(e)}j(e){e===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class zs extends be{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===k?void 0:e}}class Ds extends be{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==k)}}class Vs extends be{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=q(this,e,t,0)??k)===B)return;const s=this._$AH,i=e===k&&s!==k||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==k&&(s===k||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Us{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){q(this,e)}}const Se=Y.litHtmlPolyfillSupport;Se==null||Se(te,ie),(Y.litHtmlVersions??(Y.litHtmlVersions=[])).push("3.2.1");const qs=(n,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let i=s._$litPart$;if(i===void 0){const r=(t==null?void 0:t.renderBefore)??null;s._$litPart$=i=new ie(e.insertBefore(X(),r),r,void 0,t??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class U extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qs(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return B}}var yt;U._$litElement$=!0,U.finalized=!0,(yt=globalThis.litElementHydrateSupport)==null||yt.call(globalThis,{LitElement:U});const Ae=globalThis.litElementPolyfillSupport;Ae==null||Ae({LitElement:U});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");class _e extends U{constructor(){super(),this.state="inactive",this.buttonStates={mic:!1,video:!1,cancelvideo:!1,connect:!1},this.activeicons={mic:"mic_off",video:"hangout_video_off",pause:"play_arrow",connect:"play_arrow",screen:"cancel_presentation",configure:"settings"},this.inactiveicons={mic:"mic",video:"videocam",pause:"pause",connect:"pause",screen:"screen_share",configure:"settings"}}firstUpdated(){this.emitevent()}updated(e){e.has("state")&&this.handleStateChange()}handleStateChange(){const e=this.shadowRoot.querySelector(".actions-nav");this.state==="active"?e.classList.remove("disabled"):e.classList.add("disabled")}render(){return L`
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
      <section class="control-tray">
        <canvas style="display: none;" width="480" height="270"></canvas>
        <nav class="actions-nav ${this.state==="inactive"?"disabled":""}">
          ${this.getbutton("mic")}
          ${this.getbutton("video")}
          ${this.getbutton("screen")}
        </nav>
        <div class="connection-container">
          <div class="connection-button-container">
            ${this.getbutton("connect")}
          </div>
          <button class="btn-base"  data-type="state">
          <span class="material-symbols-outlined">${this.state==="active"?"Stream":"Disconnected"}</span>
        </button>
        ${this.getBasebutton("configure","settings")}

      </div>

      </section>
    `}getbutton(e,t){return L`
      <button 
        class="action-button ${e}-button ${this.buttonStates[e]?"active":""}" 
        data-type="${e}"
      >
        <span class="material-symbols-outlined">
          ${this.getButtonIcon(e)}
        </span>
      </button>
    `}getBasebutton(e,t){return L`
      <button 
        class="btn-base ${e}-button action-button" 
        data-type="${e}"
      >
        <span class="material-symbols-outlined">
          ${this.getButtonIcon(e)}
        </span>
      </button>
    `}emitevent(){this.shadowRoot.querySelectorAll("button").forEach(t=>{t.addEventListener("click",s=>{const i=t.getAttribute("data-type");this.toggleButtonState(i),this.dispatchEvent(new CustomEvent("button-click",{detail:{button:t,buttonType:i,state:this.state,buttonState:this.buttonStates[i]},bubbles:!0,composed:!0}))})})}toggleButtonState(e){this.buttonStates={...this.buttonStates,[e]:!this.buttonStates[e]},this.requestUpdate()}getButtonIcon(e){return this.buttonStates[e]?this.activeicons[e]||e:this.inactiveicons[e]||e}}b(_e,"styles",Ct`
    :host {
      display: block;
      font-family: 'Material Symbols Outlined', sans-serif;
    }

    .control-tray {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10px;
      border-radius: 10px;
      color: white;
    }

    .actions-nav {
      display: flex;
      justify-content: center;
      gap: 10px;
      opacity: 1;
      transition: opacity 0.3s;
    }

    .actions-nav.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .action-button {
      background: #3c3c3c;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-base {
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .action-button:hover {
      background: #5c5c5c;
    }

    .action-button .material-symbols-outlined {
      font-size: 24px;
    }

    .connection-container {
      display: flex;
      align-items: center;
      margin: 1rem;
      
    }

    .text-indicator {
      margin-left: 10px;
    }
    .action-button.active {
      background: #5c5c5c;
    }
  `),b(_e,"properties",{state:{type:String,reflect:!0},buttonStates:{type:Object}});customElements.define("call-control-bar",_e);class Hs extends HTMLElement{static get observedAttributes(){return["mode","primary-color","background","secondary-color"]}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this.visualizers=new Map,this.currentVisualizer=null,this.particles=[],this.resizeObserver=new ResizeObserver(()=>this.resize()),this.modes=["wave","bars","circles","particles","plasma","mirror-wave","hexagons","centered-bars","floating-bars"],this.currentMode="wave",this.shadowRoot.innerHTML=`
            <style>
                :host {
                    --primary-color: gray;
                    --secondary-color: #ff00ff;
                    --background: #1a1a1a;
                    --bar-width: 4px;
                    --glow-intensity: 0.8;
                    display: block;
                }
                
                canvas {
                    width: 100%;
                    height: 200px;
                    background: inherit;
                    transition: background 0.3s ease;
                }
            </style>
            <canvas></canvas>
        `,this.canvas=this.shadowRoot.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.registerVisualizers(),this.resize()}registerVisualizers(){this.registerVisualizer("wave",js),this.registerVisualizer("bars",Ws),this.registerVisualizer("centered-bars",Fs),this.registerVisualizer("floating-bars",Gs),this.registerVisualizer("circles",Qs),this.registerVisualizer("pulse",Ys)}startVisualization(){this.isAnimating=!0,this.draw()}stopVisualization(){this.isAnimating=!1}registerVisualizer(e,t){this.visualizers.set(e,new t(this))}connectedCallback(){this.resizeObserver.observe(this.canvas),this.setMode(this.getAttribute("mode")||"wave"),this.startVisualization()}disconnectedCallback(){this.stopVisualization(),this.resizeObserver.disconnect()}updateData(e){e&&(this.dataArray=e,this.draw())}attributeChangedCallback(e,t,s){e==="mode"&&this.modes.includes(s)&&(this.currentMode=s,this.setMode(s)),e==="primary-color"&&this.style.setProperty("--primary-color",s),e==="background"&&this.style.setProperty("--background",s)}resize(){this.canvas.width=this.canvas.clientWidth*2,this.canvas.height=this.canvas.clientHeight*2}draw(){!this.dataArray||!this.currentVisualizer||(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.currentVisualizer.draw(this.dataArray),requestAnimationFrame(()=>this.draw()))}setMode(e){this.visualizers.has(e)&&(this.currentVisualizer=this.visualizers.get(e),this.currentVisualizer.init(),this.currentMode=e)}}class H{constructor(e){this.visualizer=e,this.ctx=e.ctx,this.canvas=e.canvas}init(){}draw(){}}class js extends H{draw(e){const{ctx:t,canvas:s}=this;t.beginPath(),t.lineWidth=2,t.strokeStyle=getComputedStyle(this.visualizer).getPropertyValue("--primary-color");const i=s.width/e.length;let r=0;for(let o=0;o<e.length;o++){const a=e[o]/128*s.height/2;o===0?t.moveTo(r,a):t.lineTo(r,a),r+=i}t.lineTo(s.width,s.height/2),t.stroke()}}class Ws extends H{draw(e){const{ctx:t,canvas:s}=this,i=s.width/e.length*.8,r=s.width/e.length*.2;let o=0;t.fillStyle=getComputedStyle(this.visualizer).getPropertyValue("--primary-color");for(let c=0;c<e.length;c++){const a=e[c]/255*s.height;t.fillRect(o,s.height-a,i,a),o+=i+r}}}class Fs extends H{draw(e){const{ctx:t,canvas:s}=this,i=s.height/2,r=s.width/e.length*.6,o=s.width/e.length*.4;let c=0;t.fillStyle=getComputedStyle(this.visualizer).getPropertyValue("--primary-color");for(let a=0;a<e.length;a++){const l=e[a]/255*i;t.fillRect(c,i-l,r,l*2),c+=r+o}}}class Gs extends H{init(){this.floatOffsets=new Array(128).fill(0)}draw(e){const{ctx:t,canvas:s}=this,i=s.height/2,r=s.width/e.length*.8,o=s.width/e.length*.2;let c=0;t.fillStyle=getComputedStyle(this.visualizer).getPropertyValue("--primary-color");for(let a=0;a<e.length;a++){const l=e[a]/255*i;this.floatOffsets[a]=(this.floatOffsets[a]+.02)%(Math.PI*2);const h=Math.sin(this.floatOffsets[a])*10;t.fillRect(c,i-l+h,r,l),c+=r+o}}}class Qs extends H{init(){this.rotation=0,this.history=new Array(60).fill(0)}draw(e){const{ctx:t,canvas:s}=this,i=s.width/2,r=s.height/2,o=Math.min(s.width,s.height)*.4,c=e.reduce((l,h)=>l+h,0)/e.length;this.history.push(c),this.history.shift(),t.fillStyle=getComputedStyle(this.visualizer).getPropertyValue("--background"),t.fillRect(0,0,s.width,s.height),t.beginPath(),t.strokeStyle=getComputedStyle(this.visualizer).getPropertyValue("--primary-color"),t.lineWidth=4,t.arc(i,r,o*(c/255)*.8,0,Math.PI*2),t.stroke();const a=Math.PI*2/e.length;this.rotation+=.002,e.forEach((l,h)=>{const u=a*h+this.rotation,d=l/255*o*.4;t.beginPath(),t.fillStyle=`hsla(${h/e.length*360}, 70%, 50%, 0.7)`,t.arc(i+Math.cos(u)*o*.6,r+Math.sin(u)*o*.6,d,0,Math.PI*2),t.fill()}),t.strokeStyle=getComputedStyle(this.visualizer).getPropertyValue("--secondary-color"),t.beginPath(),this.history.forEach((l,h)=>{const u=s.width/this.history.length*h,d=s.height-l/255*s.height;h===0?t.moveTo(u,d):t.lineTo(u,d)}),t.stroke()}}class Ys extends H{draw(e){const{ctx:t,canvas:s}=this,i=s.height/2,r=getComputedStyle(this.visualizer).getPropertyValue("--primary-color"),o=2*(e.length-1),a=(s.width-o)/e.length;t.clearRect(0,0,s.width,s.height);for(let l=0;l<e.length;l++){const h=e[l]/255*i,u=l*(a+2);t.fillStyle=r,t.fillRect(u,s.height/2-h/2,a,h)}}}customElements.define("audio-visualizer",Hs);class Ks extends HTMLElement{constructor(){super(),this.isOpen=!1,this.currentMode="dark",this.onOpenCallback=null,this.onCloseCallback=null,this.attachShadow({mode:"open"});const e=`
            <style>
              ${this.getStyles()}
            </style>
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;this.shadowRoot.innerHTML=e,this.overlay=this.shadowRoot.querySelector(".modal-overlay"),this.closeButton=this.shadowRoot.querySelector(".close-button"),this.modalBody=this.shadowRoot.querySelector(".modal-body"),this.setupEventListeners(),this.setMode("dark")}getStyles(){return`
                :host {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                :host([visible]) {
                    opacity: 1;
                }
                .modal-content {
                    padding: 1rem;
                    border-radius: 8px;
                    position: relative;
                    min-width: 360px;
                    min-height: 360px;
                    max-height: 95dvh;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    opacity: 0;
                    transition: all 0.3s ease;
                    transform: scale(0.9);
                }
                :host([visible]) .modal-content {
                    transform: scale(1);
                    opacity: 1;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background-color 0.3s ease;
                }
                
                /* Dark Mode Styles */
                :host(.dark-mode) .modal-overlay {
                    background: rgba(0, 0, 0, 0.5);
                }
                :host(.dark-mode) .modal-content {
                    background: #1c1c1c;
                    color: #f4f4f4;
                }
                
                /* Light Mode Styles */
                :host(.light-mode) .modal-overlay {
                    background: rgba(0, 0, 0, 0.3);
                }
                :host(.light-mode) .modal-content {
                    background: #ffffff;
                    color: #333;
                    border: 1px solid #e0e0e0;
                }
                
                .close-button {
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    border: none;
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    border-radius: 10%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                /* Dark Mode Button */
                :host(.dark-mode) .close-button {
                    background-color: #dc3545;
                    color: white;
                }
                :host(.dark-mode) .close-button:hover {
                    background-color: #c82333;
                }
                
                /* Light Mode Button */
                :host(.light-mode) .close-button {
                    background-color: #f0f0f0;
                    color: #333;
                }
                :host(.light-mode) .close-button:hover {
                    background-color: #e0e0e0;
                }
                
                .modal-body {
                    margin-top: 20px;
                }
                
                ::slotted(*) {
                    max-width: 100%;
                }
      `}connectedCallback(){}setupEventListeners(){this.closeButton.addEventListener("click",()=>this.close()),this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close()})}setMode(e="dark"){["dark","light"].includes(e)||(console.warn("Invalid mode. Using default dark mode."),e="dark"),this.classList.remove("dark-mode","light-mode"),this.classList.add(`${e}-mode`),this.currentMode=e}toggleMode(){const e=this.currentMode==="dark"?"light":"dark";this.setMode(e)}open(e=null){this.onOpenCallback=e,this.style.display="block",this.offsetHeight,this.setAttribute("visible",""),this.isOpen=!0,this.onOpenCallback&&this.onOpenCallback()}close(e=null){this.onCloseCallback=e,this.removeAttribute("visible"),this.isOpen=!1,setTimeout(()=>{this.style.display="none",this.isOpen=!1,this.onCloseCallback&&this.onCloseCallback()},300)}appendChild(e){super.appendChild(e)}setContent(e){for(;this.firstChild;)this.removeChild(this.firstChild);if(typeof e=="string"){const t=document.createElement("div");t.innerHTML=e,this.appendChild(t)}else e instanceof Node&&this.appendChild(e)}getContentContainer(){return this}}customElements.define("custom-modal",Ks);if(!customElements.get("custom-input")){class n extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this.handleInputChange=this.handleInputChange.bind(this)}static get observedAttributes(){return["type","id","name","value","placeholder","disabled","readonly","darkmode","options","required","title","pattern"]}getStyles(){const t=this.hasAttribute("darkmode");return`
          :host {
            display: block;
            margin: inherit;
            color-scheme: light dark;
            margin: 0.5rem;
            padding: 0.5rem;
          }
          
          .input-container {
            display: flex;
            flex-direction: column;
            padding: inherit;
          }
          
          input, textarea, select {
            padding: inherit;
            padding: 0.5rem;  /* Valor de respaldo si no se hereda */
            border: inherit;
            border-color: ${t?"#555":"#ccc"};
            border-radius: 4px;
            font-size: 14px;
            background-color: inherit;
            color: inherit;
          }
          textarea {
            resize: vertical;
            min-height: 100px;
          }
          input:disabled, textarea:disabled, select:disabled {
            background-color: ${t?"#222":"#f5f5f5"};
            cursor: not-allowed;
            color: ${t?"#666":"#888"};
          }
          
          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 30px;
          }
          
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${t?"#555":"#ccc"};
            transition: .4s;
            border-radius: 34px;
          }
          
          .slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 4px;
            bottom: 4px;
            background-color: ${t?"#888":"white"};
            transition: .4s;
            border-radius: 50%;
          }
          
          input:checked + .slider {
            background-color: #2196F3;
          }
          
          input:checked + .slider:before {
            transform: translateX(28px);
          }
          
          input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #2196F3;
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
          }
        `}connectedCallback(){this.render();const t=this.shadowRoot.querySelector("input, textarea, select");t&&(t.addEventListener("input",this.handleInputChange),t.addEventListener("change",this.handleInputChange)),this.shadowRoot.querySelectorAll("form")}disconnectedCallback(){const t=this.shadowRoot.querySelector("input, textarea, select");t&&(t.removeEventListener("input",this.handleInputChange),t.removeEventListener("change",this.handleInputChange)),this.shadowRoot.querySelector(".validate-form")}handleInputChange(t){const s=this.getInputValues();this.dispatchEvent(new CustomEvent("input-change",{detail:{id:this.getAttribute("id"),name:this.getAttribute("name"),value:s},bubbles:!0,composed:!0}))}attributeChangedCallback(t,s,i){s!==i&&this.render()}handleSubmit(t){t.preventDefault(),t.target.checkValidity()&&this.dispatchEvent(new CustomEvent("form-submit",{detail:{id:this.getAttribute("id"),name:this.getAttribute("name"),value:this.getInputValues()},bubbles:!0,composed:!0}))}render(){const t=this.getAttribute("type")||"text",s=this.getAttribute("id"),i=this.getAttribute("name"),r=this.getAttribute("value")||"",o=this.getAttribute("placeholder")||"",c=this.hasAttribute("disabled"),a=this.hasAttribute("readonly"),l=this.getAttribute("options")||"[]",h=this.hasAttribute("required")?"required":"",u=this.getAttribute("title")||"",d=this.getAttribute("pattern")||"",p={type:t,id:s,name:i,value:r,placeholder:o,disabled:c,readonly:a,options:l,required:h,title:u,pattern:d};this.shadowRoot.innerHTML=`
          <style>${this.getStyles()}</style>
          <form class="validate-form">
            <div class="input-container">
              ${this.renderInput(p)}
            </div>
          </form>
        `;const f=this.shadowRoot.querySelector("input, textarea, select");f&&(f.addEventListener("input",this.handleInputChange),f.addEventListener("change",this.handleInputChange))}renderInput(t){const{type:s,id:i,name:r,value:o,placeholder:c,disabled:a,readonly:l,options:h,required:u,title:d,pattern:p}=t,f=u?"required":"";switch(s){case"textarea":return`
              <textarea
                id="${i}"
                name="${r}"
                placeholder="${c}"
                ${a?"disabled":""}
                ${l?"readonly":""}
                ${f}
                  ${d?`title="${d}" oninvalid="this.setCustomValidity('${d}')" oninput="this.setCustomValidity('')"`:""}
                  ${p?`pattern="${p}"`:""}
              >${o}</textarea>
            `;case"checkbox":case"switch":case"boolean":return`
              <label class="switch">
                <input
                  type="checkbox"
                  id="${i}"
                  name="${r}"
                  ${o==="true"?"checked":""}
                  ${a?"disabled":""}
                  ${l?"readonly":""}
                  ${f}
                  ${d?`title="${d}" oninvalid="this.setCustomValidity('${d}')" oninput="this.setCustomValidity('')"`:""}
                  ${p?`pattern="${p}"`:""}
                >
                <span class="slider"></span>
              </label>
            `;case"select":const m=JSON.parse(h);return`
              <select
                id="${i}"
                name="${r}"
                ${a?"disabled":""}
                ${l?"readonly":""}
                ${u?"required":""}
                  ${d?`title="${d}" oninvalid="this.setCustomValidity('${d}')" oninput="this.setCustomValidity('')"`:""}
                  ${p?`pattern="${p}"`:""}
              >
                ${m.map(x=>`
                  <option value="${x.value}" ${x.value===o?"selected":""}>
                    ${x.image?`<img src="${x.image}" alt="${x.label}" style="vertical-align: middle; margin-right: 5px;">`:""}
                    ${x.label}
                  </option>
                `).join("")}
              </select>
            `;case"radio":return JSON.parse(h).map(x=>`
              <label>
                <input
                  type="radio"
                  id="${i}"
                  name="${r}"
                  value="${x.value}"
                  ${x.value===o?"checked":""}
                  ${a?"disabled":""}
                  ${l?"readonly":""}
                >
                ${x.label}
              </label>
            `).join("");default:return`
                <input
                  type="${s==="string"?"text":s}"
                  id="${i}"
                  name="${r}"
                  value="${o}"
                  placeholder="${c}"
                  ${a?"disabled":""}
                  ${l?"readonly":""}
                  ${f}
                  ${d?`title="${d}" oninvalid="this.setCustomValidity('${d}')" oninput="this.setCustomValidity('')"`:""}
                  ${p?`pattern="${p}"`:""}
                >
              `}}getInputValues(){const t=this.shadowRoot.querySelector("input, textarea, select");if(!t)return null;if(t.type==="checkbox")return t.checked;if(t.tagName.toLowerCase()==="textarea"){const r=t.value.trim();return r?r.split(`
`):[]}if(t.tagName.toLowerCase()==="select")return t.value;if(t.type==="radio"){const r=this.shadowRoot.querySelector(`input[name="${t.name}"]:checked`);return r?r.value:null}const s=this.parseValueByType(t),i=this.shadowRoot.querySelectorAll("form");return i&&i.forEach(r=>{r.reportValidity()?r.classList.remove("invalid"):r.classList.add("invalid")}),s}getvalidation(){let t=!1;const s=this.shadowRoot.querySelectorAll("form");return s&&s.forEach(i=>{i.reportValidity()?t=!0:t=!1}),t}parseValueByType(t){t.value;const s=t.type,i=t.value;switch(s){case"number":const r=Number(i);return isNaN(r)?0:r*1;case"text":case"string":return i;default:return i}}setInputValues(t){const s=this.shadowRoot.querySelector("input, textarea, select");if(s){if(s.type==="checkbox")s.checked=!!t;else if(Array.isArray(t)&&s.tagName.toLowerCase()==="textarea")s.value=t.join(`
`);else if(s.tagName.toLowerCase()==="select")s.value=t;else if(s.type==="radio"){const i=this.shadowRoot.querySelector(`input[name="${s.name}"][value="${t}"]`);i&&(i.checked=!0)}else s.value=t;this.handleInputChange()}}resetInputValues(){const t=this.shadowRoot.querySelector("input, textarea, select");t&&(t.type==="checkbox"?t.checked=!1:t.value="",this.handleInputChange())}setOptions(t){this.getAttribute("type")==="select"&&(this.setAttribute("options",JSON.stringify(t)),this.render())}getSelectedOption(){if(this.getAttribute("type")==="select"){const t=this.shadowRoot.querySelector("select");return t?t.value:null}return null}}customElements.define("custom-input",n)}class Zs extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this.selectedValues=[],this.options=[],this.multiple=!1}static get observedAttributes(){return["multiple","grid"]}attributeChangedCallback(e,t,s){e==="multiple"&&(this.multiple=s!==null,this.selectedValues=[],this.render(),this.updateSelections())}connectedCallback(){this.multiple=this.hasAttribute("multiple"),this.render(),this.addEventListeners()}render(){this.shadowRoot.innerHTML=`
        <style>
          :host {
            display: inherit;
            grid-template-columns: inherit;
            grid-template-rows: inherit;
            font-family: Arial, sans-serif;
            border: 0px;
          }
          .select-container {
            border-radius: 4px;
            max-width: ${this.hasAttribute("grid")?"100%":"300px"};
            max-height: 480px;
            overflow-y: auto;
            padding: 8px;
          }
          .preview-container {
            border: 0px;
            margin-bottom: 12px;
            padding: 8px;
            border-bottom: 1px solid #eee;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
          }
          .preview-container img {
            max-width: 100%;
            max-height: 150px;
            object-fit: contain;
          }
          .options-list {
            display: ${this.hasAttribute("grid")?"grid":"flex"};
            flex-direction: column;
            grid-template-columns: repeat(auto-fit, minmax(100px, auto));
            gap: ${this.hasAttribute("grid")?"8px":"4px"};
          }
          .option {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            border: 2px solid transparent;
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: #222c3a;
            border: 3px solid #2e3e53;
          }
          .option:hover {
            background-color: inherit;
            color: inherit;
          }
          .option.selected {
            background-color: inherit;
            color: #32d583;;
            border-color: #32d583;;
            font-weight: 500;
          }
          .option img {
            width: 24px;
            height: 24px;
            object-fit: cover;
            border-radius: 2px;
          }
        </style>
        <div class="select-container">
          <div class="preview-container" style="display: none;"></div>
          <div class="options-list"></div>
        </div>
      `}addEventListeners(){this.shadowRoot.querySelector(".options-list").addEventListener("click",t=>{const s=t.target.closest(".option");s&&(this.multiple?this.toggleOption(s):this.selectOption(s))})}updatePreview(e){const t=this.shadowRoot.querySelector(".preview-container");t.innerHTML="",Array.isArray(e)||(e=e?[e]:[]),e.length>0?(t.style.display="flex",e.forEach(s=>{if(s.img||s.image){const i=document.createElement("img");i.src=s.img||s.image,i.alt=s.label,t.appendChild(i)}else if(s.html){const i=document.createElement("div");i.innerHTML=s.html,t.appendChild(i)}else t.style.display="none"})):t.style.display="none"}toggleOption(e){const t=e.dataset.value,s=this.selectedValues.indexOf(t);s===-1?this.selectedValues.push(t):this.selectedValues.splice(s,1),this.updateSelections();const i=this.options.filter(r=>this.selectedValues.includes(r.value));this.updatePreview(i),this.dispatchEvent(new CustomEvent("change",{detail:i}))}selectOption(e){const t=e.dataset.value,s=this.options.find(i=>i.value===t);console.log("selectedOption",s,t),s&&(this.selectedValues=[t],this.updateSelections(),this.updatePreview(s),this.dispatchEvent(new CustomEvent("change",{detail:s})))}setSelectedValues(e){this.selectedValues=e,this.updateSelections()}updateSelections(){this.shadowRoot.querySelectorAll(".option").forEach(t=>{t.classList.toggle("selected",this.selectedValues.includes(t.dataset.value))})}setOptions(e){this.options=e;const t=this.shadowRoot.querySelector(".options-list");if(t.innerHTML=e.map(s=>{let i="",r="";return(s.img||s.image)&&(i+=`<img src="${s.img||s.image}" alt="${s.label}">`),s.state&&(r=`<span class="state">${s.state}</span>`),i+=`<span>${s.label}</span>`,`
          <div class="option ${this.selectedValues.includes(s.value)?"selected":""}" 
               data-value="${s.value}">
            ${i}
            ${r}
          </div>
        `}).join(""),this.selectedValues.length>0)if(this.multiple){const s=e.filter(i=>this.selectedValues.includes(i.value));this.updatePreview(s)}else{const s=e.find(i=>i.value===this.selectedValues[0]);s&&this.updatePreview(s)}}getValue(){return this.multiple?this.selectedValues:this.selectedValues[0]||null}getSelectedOptions(){const e=this.options.filter(t=>this.selectedValues.includes(t.value));return this.multiple?e:e[0]||null}}customElements.define("enhanced-select",Zs);function Js(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ot={exports:{}};(function(n){var e=Object.prototype.hasOwnProperty,t="~";function s(){}Object.create&&(s.prototype=Object.create(null),new s().__proto__||(t=!1));function i(a,l,h){this.fn=a,this.context=l,this.once=h||!1}function r(a,l,h,u,d){if(typeof h!="function")throw new TypeError("The listener must be a function");var p=new i(h,u||a,d),f=t?t+l:l;return a._events[f]?a._events[f].fn?a._events[f]=[a._events[f],p]:a._events[f].push(p):(a._events[f]=p,a._eventsCount++),a}function o(a,l){--a._eventsCount===0?a._events=new s:delete a._events[l]}function c(){this._events=new s,this._eventsCount=0}c.prototype.eventNames=function(){var l=[],h,u;if(this._eventsCount===0)return l;for(u in h=this._events)e.call(h,u)&&l.push(t?u.slice(1):u);return Object.getOwnPropertySymbols?l.concat(Object.getOwnPropertySymbols(h)):l},c.prototype.listeners=function(l){var h=t?t+l:l,u=this._events[h];if(!u)return[];if(u.fn)return[u.fn];for(var d=0,p=u.length,f=new Array(p);d<p;d++)f[d]=u[d].fn;return f},c.prototype.listenerCount=function(l){var h=t?t+l:l,u=this._events[h];return u?u.fn?1:u.length:0},c.prototype.emit=function(l,h,u,d,p,f){var m=t?t+l:l;if(!this._events[m])return!1;var g=this._events[m],x=arguments.length,C,w;if(g.fn){switch(g.once&&this.removeListener(l,g.fn,void 0,!0),x){case 1:return g.fn.call(g.context),!0;case 2:return g.fn.call(g.context,h),!0;case 3:return g.fn.call(g.context,h,u),!0;case 4:return g.fn.call(g.context,h,u,d),!0;case 5:return g.fn.call(g.context,h,u,d,p),!0;case 6:return g.fn.call(g.context,h,u,d,p,f),!0}for(w=1,C=new Array(x-1);w<x;w++)C[w-1]=arguments[w];g.fn.apply(g.context,C)}else{var oe=g.length,T;for(w=0;w<oe;w++)switch(g[w].once&&this.removeListener(l,g[w].fn,void 0,!0),x){case 1:g[w].fn.call(g[w].context);break;case 2:g[w].fn.call(g[w].context,h);break;case 3:g[w].fn.call(g[w].context,h,u);break;case 4:g[w].fn.call(g[w].context,h,u,d);break;default:if(!C)for(T=1,C=new Array(x-1);T<x;T++)C[T-1]=arguments[T];g[w].fn.apply(g[w].context,C)}}return!0},c.prototype.on=function(l,h,u){return r(this,l,h,u,!1)},c.prototype.once=function(l,h,u){return r(this,l,h,u,!0)},c.prototype.removeListener=function(l,h,u,d){var p=t?t+l:l;if(!this._events[p])return this;if(!h)return o(this,p),this;var f=this._events[p];if(f.fn)f.fn===h&&(!d||f.once)&&(!u||f.context===u)&&o(this,p);else{for(var m=0,g=[],x=f.length;m<x;m++)(f[m].fn!==h||d&&!f[m].once||u&&f[m].context!==u)&&g.push(f[m]);g.length?this._events[p]=g.length===1?g[0]:g:o(this,p)}return this},c.prototype.removeAllListeners=function(l){var h;return l?(h=t?t+l:l,this._events[h]&&o(this,h)):(this._events=new s,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=t,c.EventEmitter=c,n.exports=c})(Ot);var Xs=Ot.exports;const Mt=Js(Xs),{ClientContentMessage:bn,isInterrupted:ei,isModelTurn:ti,isServerContentMessage:si,isSetupCompleteMessage:ii,isToolCallCancellationMessage:ni,isToolCallMessage:ri,isTurnComplete:oi}=es;function Ee(n){return Array.isArray(n)?n:[n]}class ai extends Mt{constructor({url:e,apiKey:t}){super(),this.url=e||"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent",this.url+=`?key=${t}`,this.ws=null,this.isConnecting=!1,this.messageQueue=[],this.connectionRetries=0,this.maxRetries=3,this.connected=!1,this.reconnectionTimeout=null,this.contextQueue=[],this.send=this.send.bind(this),this.connect=this.connect.bind(this),this._sendDirect=this._sendDirect.bind(this),this.handleConnectionError=this.handleConnectionError.bind(this),this.addToContext=this.addToContext.bind(this),this.sendWithContext=this.sendWithContext.bind(this)}log(e,t){const s={date:new Date,type:e,message:t};this.emit("log",s)}async connect(e){if(this.isConnecting)return new Promise(t=>{this.once("connected",()=>t(!0))});this.disconnect(),this.isConnecting=!0;try{const t=new WebSocket(this.url);return t.addEventListener("message",async s=>{s.data instanceof Blob?await this.receive(s.data):console.log("Non-blob message received:",s)}),new Promise((s,i)=>{const r=o=>{this.handleConnectionError(o,t,i)};t.addEventListener("error",r),t.addEventListener("open",o=>{if(!e){this.isConnecting=!1,i(new Error("Invalid config sent to `connect(config)`"));return}this.log(`client.${o.type}`,"Connected to socket"),this.emit("open"),this.connected=!0,this.ws=t,this.isConnecting=!1,this.emit("connected");const c={setup:e};this._sendDirect(c),this.log("client.send","Setup message sent"),this.processMessageQueue(),t.removeEventListener("error",r),t.addEventListener("close",this.handleClose.bind(this)),s(!0)})})}catch(t){throw this.isConnecting=!1,t}}handleConnectionError(e,t,s){this.disconnect(t);const i=`Could not connect to "${this.url}"`;this.log(`server.${e.type}`,i),this.isConnecting=!1,this.connected=!1,s(new Error(i))}handleClose(e){this.connected=!1;let t=e.reason||"";if(t.toLowerCase().includes("error")){const s="ERROR]",i=t.indexOf(s);i>0&&(t=t.slice(i+s.length+1,1/0))}this.log(`server.${e.type}`,`Disconnected ${t?`with reason: ${t}`:""}`),this.emit("close",e),this.connectionRetries<this.maxRetries&&(this.connectionRetries++,setTimeout(()=>{this.connect(this.config).catch(console.error)},1e3*this.connectionRetries))}disconnect(e){return(!e||this.ws===e)&&this.ws?(this.ws.close(),this.ws=null,this.connected=!1,this.log("client.close","Disconnected"),this.reconnectionTimeout&&(clearTimeout(this.reconnectionTimeout),this.reconnectionTimeout=null),!0):!1}processMessageQueue(){for(;this.messageQueue.length>0;){const e=this.messageQueue.shift();this._sendDirect(e)}}async receive(e){const t=await Xt(e);if(ri(t)){this.log("server.toolCall",t),this.emit("toolcall",t.toolCall);return}if(ni(t)){this.log("receive.toolCallCancellation",t),this.emit("toolcallcancellation",t.toolCallCancellation);return}if(ii(t)){this.log("server.send","Setup complete"),this.emit("setupcomplete");return}if(si(t)){const{serverContent:s}=t;if(ei(s)){this.log("receive.serverContent","Interrupted"),this.emit("interrupted");return}if(oi(s)&&(this.log("server.send","Turn complete"),this.emit("turncomplete")),ti(s)){if(!s.modelTurn||!s.modelTurn.parts)return s;const i=s.modelTurn.parts,r=i.filter(a=>a.inlineData&&a.inlineData.mimeType.startsWith("audio/pcm")),o=r.map(a=>{var l;return(l=a.inlineData)==null?void 0:l.data}),c=i.filter(a=>!r.includes(a));if(o.forEach(a=>{if(a){const l=kt(a);this.emit("audio",l),this.log("server.audio",`Buffer (${l.byteLength})`)}}),c.length){const a={modelTurn:{parts:c}};this.emit("content",a),this.log("server.content",t)}}}else console.log("Received unmatched message:",t)}sendRealtimeInput(e){if(!this.connected||this.isConnecting){const i={realtimeInput:{mediaChunks:e}};this.enqueueMessage(i),this.reconnectionTimeout||(this.reconnectionTimeout=setTimeout(()=>{this.connect(this.config).catch(console.error).finally(()=>{this.reconnectionTimeout=null})},1e3));return}const t=e.some(i=>i.mimeType.includes("audio"))&&e.some(i=>i.mimeType.includes("image"))?"audio + video":e.some(i=>i.mimeType.includes("audio"))?"audio":e.some(i=>i.mimeType.includes("image"))?"video":"unknown",s={realtimeInput:{mediaChunks:e}};this._sendDirect(s),this.log("client.realtimeInput",t)}sendToolResponse(e){const t={toolResponse:e};this._sendDirect(t),this.log("client.toolResponse",t)}addToContext(e){e=Ee(e);const t={role:"user",parts:e};this.contextQueue.push(t)}sendWithContext(e,t=!0){e=Ee(e);const s={role:"user",parts:e},r={clientContent:{turns:[...this.contextQueue,s],turnComplete:t}};this._sendDirect(r),this.log("client.send",r)}send(e,t=!0){e=Ee(e);const i={clientContent:{turns:[{role:"user",parts:e}],turnComplete:t}};this._sendDirect(i),this.log("client.send",i)}_sendDirect(e){if(!this.connected){if(this.isConnecting){this.enqueueMessage(e);return}if(this.connectionRetries<this.maxRetries){this.enqueueMessage(e),this.connect(this.config).catch(console.error);return}throw new Error("WebSocket is not connected and max retries exceeded")}if(!this.ws)throw new Error("WebSocket instance is null");const t=JSON.stringify(e);this.ws.send(t)}enqueueMessage(e){this.messageQueue.push(e)}}class li{constructor({url:e,apiKey:t}){this.url=e,this.apiKey=t,this.client=new ai({url:e,apiKey:t}),this.audioStreamer=null,this.connected=!1,this.config={model:"models/gemini-2.0-flash-exp"},this.volume=0}async initializeAudioStreamer(){if(!this.audioStreamer)try{const e=await audioContext({id:"audio-out"});this.audioStreamer=new AudioStreamer(e),await this.audioStreamer.addWorklet("vumeter-out",VolMeterWorket,t=>{this.volume=t.data.volume,console.log("Current Volume:",this.volume)})}catch(e){throw console.error("Failed to initialize audio streamer:",e),e}}attachClientListeners(){const e=()=>{this.connected=!1,console.log("Connection closed.")},t=()=>{this.audioStreamer&&this.audioStreamer.stop()},s=i=>{this.audioStreamer&&this.audioStreamer.addPCM16(new Uint8Array(i))};this.client.on("close",e).on("interrupted",t).on("audio",s)}detachClientListeners(){this.client.off("close").off("interrupted").off("audio")}async connect(e){if(!e)throw new Error("Configuration has not been set");this.client.disconnect(),await this.client.connect(e),this.connected=!0,console.log("Connected successfully!",e)}async disconnect(){this.client.disconnect(),this.connected=!1,console.log("Disconnected successfully.")}}const ae=new Map,ci=(n,e)=>{const t=new Blob([`registerProcessor("${n}", ${e})`],{type:"application/javascript"});return URL.createObjectURL(t)};let hi=class{constructor(e){this.audioQueue=[],this.isPlaying=!1,this.sampleRate=24e3,this.bufferSize=7680,this.processingBuffer=new Float32Array(0),this.scheduledTime=0,this.gainNode=e.createGain(),this.source=e.createBufferSource(),this.isStreamComplete=!1,this.checkInterval=null,this.initialBufferTime=.1,this.endOfQueueAudioSource=null,this.onComplete=()=>{},this.context=e,this.gainNode.connect(this.context.destination),this.addPCM16=this.addPCM16.bind(this)}async addWorklet(e,t,s){let i=ae.get(this.context);if(i&&i[e])return i[e].handlers.push(s),Promise.resolve(this);i||(ae.set(this.context,{}),i=ae.get(this.context)),i[e]={handlers:[s]};const r=ci(e,t);await this.context.audioWorklet.addModule(r);const o=new AudioWorkletNode(this.context,e);return i[e].node=o,this}addPCM16(e){const t=new Float32Array(e.length/2),s=new DataView(e.buffer);for(let r=0;r<e.length/2;r++){const o=s.getInt16(r*2,!0);t[r]=o/32768}const i=new Float32Array(this.processingBuffer.length+t.length);for(i.set(this.processingBuffer),i.set(t,this.processingBuffer.length),this.processingBuffer=i;this.processingBuffer.length>=this.bufferSize;){const r=this.processingBuffer.slice(0,this.bufferSize);this.audioQueue.push(r),this.processingBuffer=this.processingBuffer.slice(this.bufferSize)}this.isPlaying||(this.isPlaying=!0,this.scheduledTime=this.context.currentTime+this.initialBufferTime,this.scheduleNextBuffer())}createAudioBuffer(e){const t=this.context.createBuffer(1,e.length,this.sampleRate);return t.getChannelData(0).set(e),t}scheduleNextBuffer(){for(;this.audioQueue.length>0&&this.scheduledTime<this.context.currentTime+.2;){const t=this.audioQueue.shift(),s=this.createAudioBuffer(t),i=this.context.createBufferSource();this.audioQueue.length===0&&(this.endOfQueueAudioSource&&(this.endOfQueueAudioSource.onended=null),this.endOfQueueAudioSource=i,i.onended=()=>{!this.audioQueue.length&&this.endOfQueueAudioSource===i&&(this.endOfQueueAudioSource=null,this.onComplete())}),i.buffer=s,i.connect(this.gainNode);const r=ae.get(this.context);r&&Object.entries(r).forEach(([c,a])=>{const{node:l,handlers:h}=a;l&&(i.connect(l),l.port.onmessage=function(u){h.forEach(d=>{d.call(l.port,u)})},l.connect(this.context.destination))});const o=Math.max(this.scheduledTime,this.context.currentTime);i.start(o),this.scheduledTime=o+s.duration}if(this.audioQueue.length===0&&this.processingBuffer.length===0)this.isStreamComplete?(this.isPlaying=!1,this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)):this.checkInterval||(this.checkInterval=window.setInterval(()=>{(this.audioQueue.length>0||this.processingBuffer.length>=this.bufferSize)&&this.scheduleNextBuffer()},100));else{const t=(this.scheduledTime-this.context.currentTime)*1e3;setTimeout(()=>this.scheduleNextBuffer(),Math.max(0,t-50))}}stop(){this.isPlaying=!1,this.isStreamComplete=!0,this.audioQueue=[],this.processingBuffer=new Float32Array(0),this.scheduledTime=this.context.currentTime,this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null),this.gainNode.gain.linearRampToValueAtTime(0,this.context.currentTime+.1),setTimeout(()=>{this.gainNode.disconnect(),this.gainNode=this.context.createGain(),this.gainNode.connect(this.context.destination)},200)}async resume(){this.context.state==="suspended"&&await this.context.resume(),this.isStreamComplete=!1,this.scheduledTime=this.context.currentTime+this.initialBufferTime,this.gainNode.gain.setValueAtTime(1,this.context.currentTime)}complete(){this.isStreamComplete=!0,this.processingBuffer.length>0?(this.audioQueue.push(this.processingBuffer),this.processingBuffer=new Float32Array(0),this.isPlaying&&this.scheduleNextBuffer()):this.onComplete()}};const ui=new hi(new AudioContext);ui.resume();const di=`
class AudioProcessingWorklet extends AudioWorkletProcessor {
  // send and clear buffer every 2048 samples, 
  // which at 16khz is about 8 times a second
  buffer = new Int16Array(2048);
  bufferWriteIndex = 0;

  constructor() {
    super();
    this.hasAudio = false;
  }

  process(inputs) {
    if (inputs[0].length) {
      const channel0 = inputs[0][0];
      this.processChunk(channel0);
    }
    return true;
  }

  sendAndClearBuffer(){
    this.port.postMessage({
      event: "chunk",
      data: {
        int16arrayBuffer: this.buffer.slice(0, this.bufferWriteIndex).buffer,
      },
    });
    this.bufferWriteIndex = 0;
  }

  processChunk(float32Array) {
    const l = float32Array.length;
    
    for (let i = 0; i < l; i++) {
      const int16Value = float32Array[i] * 32768;
      this.buffer[this.bufferWriteIndex++] = int16Value;
      if(this.bufferWriteIndex >= this.buffer.length) {
        this.sendAndClearBuffer();
      }
    }

    if(this.bufferWriteIndex >= this.buffer.length) {
      this.sendAndClearBuffer();
    }
  }
}`,pi=`
class VolMeter extends AudioWorkletProcessor {
  volume
  updateIntervalInMS
  nextUpdateFrame

  constructor() {
    super()
    this.volume = 0
    this.updateIntervalInMS = 25
    this.nextUpdateFrame = this.updateIntervalInMS
    this.port.onmessage = event => {
      if (event.data.updateIntervalInMS) {
        this.updateIntervalInMS = event.data.updateIntervalInMS
      }
    }
  }

  get intervalInFrames() {
    return (this.updateIntervalInMS / 1000) * sampleRate
  }

  process(inputs) {
    const input = inputs[0]

    if (input.length > 0) {
      const samples = input[0]
      let sum = 0
      let rms = 0

      for (let i = 0; i < samples.length; ++i) {
        sum += samples[i] * samples[i]
      }

      rms = Math.sqrt(sum / samples.length)
      this.volume = Math.max(rms, this.volume * 0.7)

      this.nextUpdateFrame -= samples.length
      if (this.nextUpdateFrame < 0) {
        this.nextUpdateFrame += this.intervalInFrames
        this.port.postMessage({volume: this.volume})
      }
    }

    return true
  }
}`,tt=(n,e)=>{const t=new Blob([`registerProcessor('${n}', ${e})`],{type:"application/javascript"});return URL.createObjectURL(t)};class fi extends Mt{constructor(e=16e3){super(),this.stream=null,this.audioContext=null,this.source=null,this.recording=!1,this.recordingWorklet=null,this.vuWorklet=null,this.starting=!1,this.targetSampleRate=e,this.resamplingEnabled=!0}async start(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Could not request user media");return this.starting=new Promise(async(e,t)=>{try{if(this.stream=await navigator.mediaDevices.getUserMedia({audio:!0}),this.audioContext=new(window.AudioContext||window.webkitAudioContext),console.log(`Browser's sample rate: ${this.audioContext.sampleRate}`),this.source=this.audioContext.createMediaStreamSource(this.stream),this.resamplingEnabled&&this.audioContext.sampleRate!==this.targetSampleRate){const i=new OfflineAudioContext(1,this.audioContext.sampleRate,this.audioContext.sampleRate),o=this.audioContext.createScriptProcessor(4096,1,1);o.onaudioprocess=c=>{const l=c.inputBuffer.getChannelData(0),h=this.resampleAudio(l,this.audioContext.sampleRate,this.targetSampleRate),u=new Int16Array(h.length);for(let d=0;d<h.length;d++)u[d]=Math.max(-32768,Math.min(32767,Math.round(h[d]*32767)));if(this.recording){const d=this.arrayBufferToBase64(u.buffer);this.emit("data",d)}},this.source.connect(o),o.connect(this.audioContext.destination)}else{const i="audio-recorder-worklet",r=tt(i,di);await this.audioContext.audioWorklet.addModule(r),this.recordingWorklet=new AudioWorkletNode(this.audioContext,i),this.recordingWorklet.port.onmessage=async o=>{const c=o.data.data.int16arrayBuffer;if(c){const a=this.arrayBufferToBase64(c);this.emit("data",a)}},this.source.connect(this.recordingWorklet)}const s="vu-meter";await this.audioContext.audioWorklet.addModule(tt(s,pi)),this.vuWorklet=new AudioWorkletNode(this.audioContext,s),this.vuWorklet.port.onmessage=i=>{this.emit("volume",i.data.volume)},this.source.connect(this.vuWorklet),this.recording=!0,e()}catch(s){t(s)}this.starting=null}),this.starting}resampleAudio(e,t,s){const i=t/s,r=Math.round(e.length/i),o=new Float32Array(r);for(let c=0;c<r;c++){const a=c*i,l=Math.floor(a),h=a-l;l+1<e.length?o[c]=e[l]*(1-h)+e[l+1]*h:o[c]=e[l]}return o}arrayBufferToBase64(e){const t=new Uint8Array(e),s=t.byteLength;let i="";for(let r=0;r<s;r++)i+=String.fromCharCode(t[r]);return window.btoa(i)}stop(){const e=()=>{this.source&&this.source.disconnect(),this.stream&&this.stream.getTracks().forEach(t=>t.stop()),this.audioContext&&this.audioContext.close(),this.stream=void 0,this.recordingWorklet=void 0,this.vuWorklet=void 0,this.audioContext=void 0,this.recording=!1};if(this.starting){this.starting.then(e).catch(console.error);return}e()}}class Pt{constructor(){b(this,"handleStreamEnded",()=>{this.isStreaming=!1,this.stream=null,this.videoElement&&(this.videoElement.srcObject=null),this.notifyListeners()});this.stream=null,this.isStreaming=!1,this.type="webcam",this.eventListeners=new Set,this.videoElement=null}setVideoElement(e){if(!(e instanceof HTMLVideoElement))throw new Error("Element must be an HTMLVideoElement");this.videoElement=e,this.stream&&(this.videoElement.srcObject=this.stream,this.videoElement.play().catch(t=>{console.error("Error playing video:",t)}))}addEventListener(e){return this.eventListeners.add(e),()=>this.eventListeners.delete(e)}notifyListeners(){const e={stream:this.stream,isStreaming:this.isStreaming,type:this.type};this.eventListeners.forEach(t=>t(e))}async start(){try{const e=await navigator.mediaDevices.getUserMedia({video:!0});return this.stream=e,this.isStreaming=!0,this.videoElement&&(this.videoElement.srcObject=this.stream,await this.videoElement.play()),this.stream.getTracks().forEach(t=>{t.addEventListener("ended",this.handleStreamEnded)}),this.notifyListeners(),e}catch(e){throw console.error("Error starting webcam capture:",e),e}}stop(){this.stream&&(this.stream.getTracks().forEach(e=>{e.removeEventListener("ended",this.handleStreamEnded),e.stop()}),this.videoElement&&(this.videoElement.srcObject=null),this.stream=null,this.isStreaming=!1,this.notifyListeners())}getState(){return{type:this.type,start:this.start.bind(this),stop:this.stop.bind(this),isStreaming:this.isStreaming,stream:this.stream}}}class Nt{constructor(){b(this,"handleStreamEnded",()=>{this.isStreaming=!1,this.stream=null,this.videoElement&&(this.videoElement.srcObject=null),this.notifyListeners()});this.stream=null,this.isStreaming=!1,this.type="screen",this.eventListeners=new Set,this.videoElement=null}setVideoElement(e){if(!(e instanceof HTMLVideoElement))throw new Error("Element must be an HTMLVideoElement");this.videoElement=e,this.stream&&(this.videoElement.srcObject=this.stream,this.videoElement.play().catch(t=>{console.error("Error playing video:",t)}))}addEventListener(e){return this.eventListeners.add(e),()=>this.eventListeners.delete(e)}notifyListeners(){const e={stream:this.stream,isStreaming:this.isStreaming,type:this.type};this.eventListeners.forEach(t=>t(e))}async start(){try{const e=await navigator.mediaDevices.getDisplayMedia({video:!0});return this.stream=e,this.isStreaming=!0,this.videoElement&&(this.videoElement.srcObject=this.stream,await this.videoElement.play()),this.stream.getTracks().forEach(t=>{t.addEventListener("ended",this.handleStreamEnded)}),this.notifyListeners(),e}catch(e){throw console.error("Error starting screen capture:",e),e}}stop(){this.stream&&(this.stream.getTracks().forEach(e=>{e.removeEventListener("ended",this.handleStreamEnded),e.stop()}),this.videoElement&&(this.videoElement.srcObject=null),this.stream=null,this.isStreaming=!1,this.notifyListeners())}getState(){return{type:this.type,start:this.start.bind(this),stop:this.stop.bind(this),isStreaming:this.isStreaming,stream:this.stream}}}class st{constructor(e={}){this.fps=e.fps||.5,this.scale=e.scale||.25,this.quality=e.quality||1,this.timeoutId=null,this.isActive=!1,this.mediaCapture=null,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d")}setMediaCapture(e){if(!(e instanceof Pt||e instanceof Nt))throw new Error("Invalid media capture instance");this.stop(),this.mediaCapture=e,this.unsubscribe=this.mediaCapture.addEventListener(t=>{t.isStreaming||this.stop()})}start(e){if(!this.mediaCapture||!this.mediaCapture.stream)throw new Error("No media stream available");this.isActive=!0;const t=this.mediaCapture.stream.getVideoTracks()[0],{width:s,height:i}=t.getSettings();this.canvas.width=s*this.scale,this.canvas.height=i*this.scale;const r=()=>{if(!this.isActive||!this.mediaCapture.isStreaming)return;const o=document.createElement("video");o.srcObject=this.mediaCapture.stream,o.play().then(()=>{this.ctx.drawImage(o,0,0,this.canvas.width,this.canvas.height);const c=this.canvas.toDataURL("image/jpeg",this.quality),a=c.slice(c.indexOf(",")+1);e({mimeType:"image/jpeg",data:a,width:this.canvas.width,height:this.canvas.height,timestamp:Date.now(),sourceType:this.mediaCapture.type}),o.pause(),o.srcObject=null,this.isActive&&(this.timeoutId=window.setTimeout(r,1e3/this.fps))}).catch(c=>{console.error("Error capturing frame:",c),this.stop()})};r()}stop(){this.isActive=!1,this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null),this.unsubscribe&&this.unsubscribe()}setOptions(e={}){this.fps=e.fps??this.fps,this.scale=e.scale??this.scale,this.quality=e.quality??this.quality}getState(){var e;return{isActive:this.isActive,fps:this.fps,scale:this.scale,quality:this.quality,sourceType:((e=this.mediaCapture)==null?void 0:e.type)||null}}}class gi{constructor(){this.videoWrappers=document.querySelectorAll(".video-wrapper"),this.videoContainerGrid=document.querySelector(".video-container-grid"),this.activeVideoSources=new Set}updateContainerVisibility(){this.activeVideoSources.size===0?this.videoContainerGrid.classList.add("hidden"):this.videoContainerGrid.classList.remove("hidden"),this.videoWrappers.forEach(e=>{const t=e.querySelector("video").id;this.activeVideoSources.has(t)?e.classList.remove("hidden"):e.classList.add("hidden")})}addActiveVideoSource(e){this.activeVideoSources.add(e),this.updateContainerVisibility()}removeActiveVideoSource(e){this.activeVideoSources.delete(e),this.updateContainerVisibility()}}var de;(function(n){n.STRING="string",n.NUMBER="number",n.INTEGER="integer",n.BOOLEAN="boolean",n.ARRAY="array",n.OBJECT="object"})(de||(de={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var it;(function(n){n.LANGUAGE_UNSPECIFIED="language_unspecified",n.PYTHON="python"})(it||(it={}));var nt;(function(n){n.OUTCOME_UNSPECIFIED="outcome_unspecified",n.OUTCOME_OK="outcome_ok",n.OUTCOME_FAILED="outcome_failed",n.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(nt||(nt={}));var rt;(function(n){n.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",n.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",n.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",n.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",n.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"})(rt||(rt={}));var ot;(function(n){n.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",n.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",n.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",n.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",n.BLOCK_NONE="BLOCK_NONE"})(ot||(ot={}));var at;(function(n){n.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",n.NEGLIGIBLE="NEGLIGIBLE",n.LOW="LOW",n.MEDIUM="MEDIUM",n.HIGH="HIGH"})(at||(at={}));var lt;(function(n){n.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",n.SAFETY="SAFETY",n.OTHER="OTHER"})(lt||(lt={}));var K;(function(n){n.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",n.STOP="STOP",n.MAX_TOKENS="MAX_TOKENS",n.SAFETY="SAFETY",n.RECITATION="RECITATION",n.LANGUAGE="LANGUAGE",n.OTHER="OTHER"})(K||(K={}));var ct;(function(n){n.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",n.RETRIEVAL_QUERY="RETRIEVAL_QUERY",n.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",n.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",n.CLASSIFICATION="CLASSIFICATION",n.CLUSTERING="CLUSTERING"})(ct||(ct={}));var ht;(function(n){n.MODE_UNSPECIFIED="MODE_UNSPECIFIED",n.AUTO="AUTO",n.ANY="ANY",n.NONE="NONE"})(ht||(ht={}));var ut;(function(n){n.MODE_UNSPECIFIED="MODE_UNSPECIFIED",n.MODE_DYNAMIC="MODE_DYNAMIC"})(ut||(ut={}));var dt;(function(n){n.GENERATE_CONTENT="generateContent",n.STREAM_GENERATE_CONTENT="streamGenerateContent",n.COUNT_TOKENS="countTokens",n.EMBED_CONTENT="embedContent",n.BATCH_EMBED_CONTENTS="batchEmbedContents"})(dt||(dt={}));K.RECITATION,K.SAFETY,K.LANGUAGE;const mi="generativelanguage.googleapis.com",bi=`wss://${mi}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`,pe=yi();function yi(){var e;let n=(e=JSON.parse(localStorage.getItem("configAPI")))==null?void 0:e.apikey;return n&&n!==""||(n="AIzaSyBCvzPEORNt5ktrEA1f7uSQ4zB6H3nqHIc"),n}if(typeof pe!="string"||pe.length<1)throw new Error("set REACT_APP_GEMINI_API_KEY in .env");console.log("API_KEY",pe);const Bt={name:"render_altair",description:"Displays an altair graph in json format.",parameters:{type:de.OBJECT,properties:{json_graph:{type:de.STRING,description:"JSON STRING representation of the graph to render."}},required:["json_graph"]}};var vt;console.log((vt=JSON.parse(localStorage.getItem("configAPI")))==null?void 0:vt.stringInstruction);var wt;const zt={model:"models/gemini-2.0-flash-exp",generationConfig:{temperature:1,top_p:.95,top_k:40,responseModalities:"TEXT",max_output_tokens:1024,speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:"Aoede"}}}},systemInstruction:{parts:[{text:((wt=JSON.parse(localStorage.getItem("configAPI")))==null?void 0:wt.stringInstruction)||`Eres una IA de traducción. Tu tarea es recibir un texto en español y devolver un JSON con las traducciones al inglés y japonés. 
      o tambien si no se entiende o se hacen gestos acciones o onomatopeyas puedes narrarlo en el formato deseado.
    Formato de salida:  
    {  
      "input": "<texto original en español usando muchos terminos en ingles tambien>"
      "traducciones": {
        "es": "<traducción al español>",
        "en": "<traducción al inglés>",  
        "jp": "<traducción al japonés>",
        "pt": "<traducción al portugués>"
      }  
    }  `}]},tools:[{googleSearch:{}},{functionDeclarations:[Bt]}]},vi={instance:null,initialize({url:n,apiKey:e,config:t}){return this.instance||(this.instance=new li({url:n,apiKey:e,config:t}),this.setupEventListeners()),this.instance},setupEventListeners(){this.instance.client.on("toolcall",this.handleToolCall).on("setupcomplete",()=>console.log("Setup complete")).on("interrupted",()=>console.log("Interrupted")).on("turncomplete",()=>console.log("Turn complete"))},handleToolCall(n){const e=n.functionCalls.find(t=>t.name===Bt.name);e&&Ci(e.args.json_graph),n.functionCalls.length&&setTimeout(()=>this.sendToolResponse({functionResponses:n.functionCalls.map(t=>({response:{output:{success:!0}},id:t.id}))}),200)}},S={audioRecorder:new fi,screenCapture:new Nt,webcam:new Pt,extractors:{webcam:new st({fps:1,scale:.5,quality:.8}),screen:new st({fps:1,scale:.5,quality:.8})},active:{webcam:!1,screen:!1}},Ne=vi.initialize({url:bi,apiKey:pe,config:zt}),wi=document.querySelector("call-control-bar");wi.addEventListener("button-click",xi);S.audioRecorder.on("data",n=>$i("audio/pcm;rate=16000",n));Ne.connect(zt);async function xi(n){const{buttonType:e,buttonState:t}=n.detail;switch(console.log("Control:",e,t),e){case"mic":t?S.audioRecorder.start():S.audioRecorder.stop();break;case"screen":t?ki():Ai();break;case"video":t?Si():Ei();break;case"configure":document.querySelector("#modal_content").open();break}}const ne=new gi;ne.updateContainerVisibility();async function ki(){S.screenCapture.start();const n=document.getElementById("screen");S.screenCapture.setVideoElement(n),ne.addActiveVideoSource("screen"),await Dt("screen")}async function Si(){S.webcam.start();const n=document.getElementById("webcam");S.webcam.setVideoElement(n),ne.addActiveVideoSource("webcam"),await Dt("webcam")}function Ai(){S.screenCapture.stop(),ne.removeActiveVideoSource("screen")}function Ei(){S.webcam.stop(),ne.removeActiveVideoSource("webcam")}async function Dt(n){const e=S.extractors[n],t=n==="webcam"?S.webcam:S.screenCapture;if(!S.active[n])try{await t.start(),S.active[n]=!0,e.setMediaCapture(t),await new Promise(s=>setTimeout(s,1e3)),e.start(s=>{Ne.client.sendRealtimeInput([{mimeType:s.mimeType,data:s.data}])})}catch(s){console.error(`Error en ${n}:`,s),S.active[n]=!1,t.stop(),e.stop()}}function $i(n,e){Ne.client.sendRealtimeInput([{mimeType:n,data:e}])}function Ci(n){console.log("Recibido JSON para renderizar:",n)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _i={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ti=n=>(...e)=>({_$litDirective$:n,values:e});class Ii{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Te extends Ii{constructor(e){if(super(e),this.it=k,e.type!==_i.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===k||e==null)return this._t=void 0,this.it=e;if(e===B)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}Te.directiveName="unsafeHTML",Te.resultType=1;const Ri=Ti(Te);function Be(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let D=Be();function Vt(n){D=n}const Z={exec:()=>null};function v(n,e=""){let t=typeof n=="string"?n:n.source;const s={replace:(i,r)=>{let o=typeof r=="string"?r:r.source;return o=o.replace(A.caret,"$1"),t=t.replace(i,o),s},getRegex:()=>new RegExp(t,e)};return s}const A={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:n=>new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}#`),htmlBeginRegex:n=>new RegExp(`^ {0,${Math.min(3,n-1)}}<(?:[a-z].*>|!--)`,"i")},Li=/^(?:[ \t]*(?:\n|$))+/,Oi=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Mi=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,re=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Pi=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Ut=/(?:[*+-]|\d{1,9}[.)])/,qt=v(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,Ut).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),ze=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ni=/^[^\n]+/,De=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Bi=v(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",De).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),zi=v(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Ut).getRegex(),ye="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ve=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Di=v("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Ve).replace("tag",ye).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Ht=v(ze).replace("hr",re).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ye).getRegex(),Vi=v(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Ht).getRegex(),Ue={blockquote:Vi,code:Oi,def:Bi,fences:Mi,heading:Pi,hr:re,html:Di,lheading:qt,list:zi,newline:Li,paragraph:Ht,table:Z,text:Ni},pt=v("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",re).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ye).getRegex(),Ui={...Ue,table:pt,paragraph:v(ze).replace("hr",re).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",pt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ye).getRegex()},qi={...Ue,html:v(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Ve).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Z,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:v(ze).replace("hr",re).replace("heading",` *#{1,6} *[^
]`).replace("lheading",qt).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Hi=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ji=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,jt=/^( {2,}|\\)\n(?!\s*$)/,Wi=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ve=/[\p{P}\p{S}]/u,qe=/[\s\p{P}\p{S}]/u,Wt=/[^\s\p{P}\p{S}]/u,Fi=v(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,qe).getRegex(),Gi=/(?!~)[\p{P}\p{S}]/u,Qi=/(?!~)[\s\p{P}\p{S}]/u,Yi=/(?:[^\s\p{P}\p{S}]|~)/u,Ki=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Zi=v(/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,"u").replace(/punct/g,ve).getRegex(),Ft="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ji=v(Ft,"gu").replace(/notPunctSpace/g,Wt).replace(/punctSpace/g,qe).replace(/punct/g,ve).getRegex(),Xi=v(Ft,"gu").replace(/notPunctSpace/g,Yi).replace(/punctSpace/g,Qi).replace(/punct/g,Gi).getRegex(),en=v("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Wt).replace(/punctSpace/g,qe).replace(/punct/g,ve).getRegex(),tn=v(/\\(punct)/,"gu").replace(/punct/g,ve).getRegex(),sn=v(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),nn=v(Ve).replace("(?:-->|$)","-->").getRegex(),rn=v("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",nn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),fe=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,on=v(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",fe).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Gt=v(/^!?\[(label)\]\[(ref)\]/).replace("label",fe).replace("ref",De).getRegex(),Qt=v(/^!?\[(ref)\](?:\[\])?/).replace("ref",De).getRegex(),an=v("reflink|nolink(?!\\()","g").replace("reflink",Gt).replace("nolink",Qt).getRegex(),He={_backpedal:Z,anyPunctuation:tn,autolink:sn,blockSkip:Ki,br:jt,code:ji,del:Z,emStrongLDelim:Zi,emStrongRDelimAst:Ji,emStrongRDelimUnd:en,escape:Hi,link:on,nolink:Qt,punctuation:Fi,reflink:Gt,reflinkSearch:an,tag:rn,text:Wi,url:Z},ln={...He,link:v(/^!?\[(label)\]\((.*?)\)/).replace("label",fe).getRegex(),reflink:v(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",fe).getRegex()},Ie={...He,emStrongRDelimAst:Xi,url:v(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},cn={...Ie,br:v(jt).replace("{2,}","*").getRegex(),text:v(Ie.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},le={normal:Ue,gfm:Ui,pedantic:qi},F={normal:He,gfm:Ie,breaks:cn,pedantic:ln},hn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ft=n=>hn[n];function _(n,e){if(e){if(A.escapeTest.test(n))return n.replace(A.escapeReplace,ft)}else if(A.escapeTestNoEncode.test(n))return n.replace(A.escapeReplaceNoEncode,ft);return n}function gt(n){try{n=encodeURI(n).replace(A.percentDecode,"%")}catch{return null}return n}function mt(n,e){var r;const t=n.replace(A.findPipe,(o,c,a)=>{let l=!1,h=c;for(;--h>=0&&a[h]==="\\";)l=!l;return l?"|":" |"}),s=t.split(A.splitPipe);let i=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(A.slashPipe,"|");return s}function G(n,e,t){const s=n.length;if(s===0)return"";let i=0;for(;i<s&&(n.charAt(s-i-1)===e&&!t);)i++;return n.slice(0,s-i)}function un(n,e){if(n.indexOf(e[1])===-1)return-1;let t=0;for(let s=0;s<n.length;s++)if(n[s]==="\\")s++;else if(n[s]===e[0])t++;else if(n[s]===e[1]&&(t--,t<0))return s;return-1}function bt(n,e,t,s,i){const r=e.href,o=e.title||null,c=n[1].replace(i.other.outputLinkReplace,"$1");if(n[0].charAt(0)!=="!"){s.state.inLink=!0;const a={type:"link",raw:t,href:r,title:o,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,a}return{type:"image",raw:t,href:r,title:o,text:c}}function dn(n,e,t){const s=n.match(t.other.indentCodeCompensation);if(s===null)return e;const i=s[1];return e.split(`
`).map(r=>{const o=r.match(t.other.beginningSpace);if(o===null)return r;const[c]=o;return c.length>=i.length?r.slice(i.length):r}).join(`
`)}class ge{constructor(e){b(this,"options");b(this,"rules");b(this,"lexer");this.options=e||D}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const s=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?s:G(s,`
`)}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const s=t[0],i=dn(s,t[3]||"",this.rules);return{type:"code",raw:s,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let s=t[2].trim();if(this.rules.other.endingHash.test(s)){const i=G(s,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(s=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:s,tokens:this.lexer.inline(s)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:G(t[0],`
`)}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){let s=G(t[0],`
`).split(`
`),i="",r="";const o=[];for(;s.length>0;){let c=!1;const a=[];let l;for(l=0;l<s.length;l++)if(this.rules.other.blockquoteStart.test(s[l]))a.push(s[l]),c=!0;else if(!c)a.push(s[l]);else break;s=s.slice(l);const h=a.join(`
`),u=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${h}`:h,r=r?`${r}
${u}`:u;const d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,o,!0),this.lexer.state.top=d,s.length===0)break;const p=o.at(-1);if((p==null?void 0:p.type)==="code")break;if((p==null?void 0:p.type)==="blockquote"){const f=p,m=f.raw+`
`+s.join(`
`),g=this.blockquote(m);o[o.length-1]=g,i=i.substring(0,i.length-f.raw.length)+g.raw,r=r.substring(0,r.length-f.text.length)+g.text;break}else if((p==null?void 0:p.type)==="list"){const f=p,m=f.raw+`
`+s.join(`
`),g=this.list(m);o[o.length-1]=g,i=i.substring(0,i.length-p.raw.length)+g.raw,r=r.substring(0,r.length-f.raw.length)+g.raw,s=m.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let s=t[1].trim();const i=s.length>1,r={type:"list",raw:"",ordered:i,start:i?+s.slice(0,-1):"",loose:!1,items:[]};s=i?`\\d{1,9}\\${s.slice(-1)}`:`\\${s}`,this.options.pedantic&&(s=i?s:"[*+-]");const o=this.rules.other.listItemRegex(s);let c=!1;for(;e;){let l=!1,h="",u="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;h=t[0],e=e.substring(h.length);let d=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,C=>" ".repeat(3*C.length)),p=e.split(`
`,1)[0],f=!d.trim(),m=0;if(this.options.pedantic?(m=2,u=d.trimStart()):f?m=t[1].length+1:(m=t[2].search(this.rules.other.nonSpaceChar),m=m>4?1:m,u=d.slice(m),m+=t[1].length),f&&this.rules.other.blankLine.test(p)&&(h+=p+`
`,e=e.substring(p.length+1),l=!0),!l){const C=this.rules.other.nextBulletRegex(m),w=this.rules.other.hrRegex(m),oe=this.rules.other.fencesBeginRegex(m),T=this.rules.other.headingBeginRegex(m),Yt=this.rules.other.htmlBeginRegex(m);for(;e;){const we=e.split(`
`,1)[0];let j;if(p=we,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),j=p):j=p.replace(this.rules.other.tabCharGlobal,"    "),oe.test(p)||T.test(p)||Yt.test(p)||C.test(p)||w.test(p))break;if(j.search(this.rules.other.nonSpaceChar)>=m||!p.trim())u+=`
`+j.slice(m);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||oe.test(d)||T.test(d)||w.test(d))break;u+=`
`+p}!f&&!p.trim()&&(f=!0),h+=we+`
`,e=e.substring(we.length+1),d=j.slice(m)}}r.loose||(c?r.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(c=!0));let g=null,x;this.options.gfm&&(g=this.rules.other.listIsTask.exec(u),g&&(x=g[0]!=="[ ] ",u=u.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:h,task:!!g,checked:x,loose:!1,text:u,tokens:[]}),r.raw+=h}const a=r.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l=0;l<r.items.length;l++)if(this.lexer.state.top=!1,r.items[l].tokens=this.lexer.blockTokens(r.items[l].text,[]),!r.loose){const h=r.items[l].tokens.filter(d=>d.type==="space"),u=h.length>0&&h.some(d=>this.rules.other.anyLine.test(d.raw));r.loose=u}if(r.loose)for(let l=0;l<r.items.length;l++)r.items[l].loose=!0;return r}}html(e){const t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){const t=this.rules.block.def.exec(e);if(t){const s=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:s,raw:t[0],href:i,title:r}}}table(e){var c;const t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;const s=mt(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=(c=t[3])!=null&&c.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(s.length===i.length){for(const a of i)this.rules.other.tableAlignRight.test(a)?o.align.push("right"):this.rules.other.tableAlignCenter.test(a)?o.align.push("center"):this.rules.other.tableAlignLeft.test(a)?o.align.push("left"):o.align.push(null);for(let a=0;a<s.length;a++)o.header.push({text:s[a],tokens:this.lexer.inline(s[a]),header:!0,align:o.align[a]});for(const a of r)o.rows.push(mt(a,o.header.length).map((l,h)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[h]})));return o}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const s=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:s,tokens:this.lexer.inline(s)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const s=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(s)){if(!this.rules.other.endAngleBracket.test(s))return;const o=G(s.slice(0,-1),"\\");if((s.length-o.length)%2===0)return}else{const o=un(t[2],"()");if(o>-1){const a=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let i=t[2],r="";if(this.options.pedantic){const o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],r=o[3])}else r=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(s)?i=i.slice(1):i=i.slice(1,-1)),bt(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let s;if((s=this.rules.inline.reflink.exec(e))||(s=this.rules.inline.nolink.exec(e))){const i=(s[2]||s[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[i.toLowerCase()];if(!r){const o=s[0].charAt(0);return{type:"text",raw:o,text:o}}return bt(s,r,s[0],this.lexer,this.rules)}}emStrong(e,t,s=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!i||i[3]&&s.match(this.rules.other.unicodeAlphaNumeric))return;if(!(i[1]||i[2]||"")||!s||this.rules.inline.punctuation.exec(s)){const o=[...i[0]].length-1;let c,a,l=o,h=0;const u=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+o);(i=u.exec(t))!=null;){if(c=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!c)continue;if(a=[...c].length,i[3]||i[4]){l+=a;continue}else if((i[5]||i[6])&&o%3&&!((o+a)%3)){h+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l+h);const d=[...i[0]][0].length,p=e.slice(0,o+i.index+d+a);if(Math.min(o,a)%2){const m=p.slice(1,-1);return{type:"em",raw:p,text:m,tokens:this.lexer.inlineTokens(m)}}const f=p.slice(2,-2);return{type:"strong",raw:p,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let s=t[2].replace(this.rules.other.newLineCharGlobal," ");const i=this.rules.other.nonSpaceChar.test(s),r=this.rules.other.startingSpaceChar.test(s)&&this.rules.other.endingSpaceChar.test(s);return i&&r&&(s=s.substring(1,s.length-1)),{type:"codespan",raw:t[0],text:s}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){const t=this.rules.inline.autolink.exec(e);if(t){let s,i;return t[2]==="@"?(s=t[1],i="mailto:"+s):(s=t[1],i=s),{type:"link",raw:t[0],text:s,href:i,tokens:[{type:"text",raw:s,text:s}]}}}url(e){var s;let t;if(t=this.rules.inline.url.exec(e)){let i,r;if(t[2]==="@")i=t[0],r="mailto:"+i;else{let o;do o=t[0],t[0]=((s=this.rules.inline._backpedal.exec(t[0]))==null?void 0:s[0])??"";while(o!==t[0]);i=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:i,href:r,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(e){const t=this.rules.inline.text.exec(e);if(t){const s=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:s}}}}class E{constructor(e){b(this,"tokens");b(this,"options");b(this,"state");b(this,"tokenizer");b(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||D,this.options.tokenizer=this.options.tokenizer||new ge,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={other:A,block:le.normal,inline:F.normal};this.options.pedantic?(t.block=le.pedantic,t.inline=F.pedantic):this.options.gfm&&(t.block=le.gfm,this.options.breaks?t.inline=F.breaks:t.inline=F.gfm),this.tokenizer.rules=t}static get rules(){return{block:le,inline:F}}static lex(e,t){return new E(t).lex(e)}static lexInline(e,t){return new E(t).inlineTokens(e)}lex(e){e=e.replace(A.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const s=this.inlineQueue[t];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],s=!1){var i,r,o;for(this.options.pedantic&&(e=e.replace(A.tabCharGlobal,"    ").replace(A.spaceLine,""));e;){let c;if((r=(i=this.options.extensions)==null?void 0:i.block)!=null&&r.some(l=>(c=l.call({lexer:this},e,t))?(e=e.substring(c.raw.length),t.push(c),!0):!1))continue;if(c=this.tokenizer.space(e)){e=e.substring(c.raw.length);const l=t.at(-1);c.raw.length===1&&l!==void 0?l.raw+=`
`:t.push(c);continue}if(c=this.tokenizer.code(e)){e=e.substring(c.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+c.raw,l.text+=`
`+c.text,this.inlineQueue.at(-1).src=l.text):t.push(c);continue}if(c=this.tokenizer.fences(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.heading(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.hr(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.blockquote(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.list(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.html(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.def(e)){e=e.substring(c.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+c.raw,l.text+=`
`+c.raw,this.inlineQueue.at(-1).src=l.text):this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title});continue}if(c=this.tokenizer.table(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.lheading(e)){e=e.substring(c.raw.length),t.push(c);continue}let a=e;if((o=this.options.extensions)!=null&&o.startBlock){let l=1/0;const h=e.slice(1);let u;this.options.extensions.startBlock.forEach(d=>{u=d.call({lexer:this},h),typeof u=="number"&&u>=0&&(l=Math.min(l,u))}),l<1/0&&l>=0&&(a=e.substring(0,l+1))}if(this.state.top&&(c=this.tokenizer.paragraph(a))){const l=t.at(-1);s&&(l==null?void 0:l.type)==="paragraph"?(l.raw+=`
`+c.raw,l.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):t.push(c),s=a.length!==e.length,e=e.substring(c.raw.length);continue}if(c=this.tokenizer.text(e)){e=e.substring(c.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="text"?(l.raw+=`
`+c.raw,l.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):t.push(c);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){var c,a,l;let s=e,i=null;if(this.tokens.links){const h=Object.keys(this.tokens.links);if(h.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)h.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let r=!1,o="";for(;e;){r||(o=""),r=!1;let h;if((a=(c=this.options.extensions)==null?void 0:c.inline)!=null&&a.some(d=>(h=d.call({lexer:this},e,t))?(e=e.substring(h.raw.length),t.push(h),!0):!1))continue;if(h=this.tokenizer.escape(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.tag(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.link(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(h.raw.length);const d=t.at(-1);h.type==="text"&&(d==null?void 0:d.type)==="text"?(d.raw+=h.raw,d.text+=h.text):t.push(h);continue}if(h=this.tokenizer.emStrong(e,s,o)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.codespan(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.br(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.del(e)){e=e.substring(h.raw.length),t.push(h);continue}if(h=this.tokenizer.autolink(e)){e=e.substring(h.raw.length),t.push(h);continue}if(!this.state.inLink&&(h=this.tokenizer.url(e))){e=e.substring(h.raw.length),t.push(h);continue}let u=e;if((l=this.options.extensions)!=null&&l.startInline){let d=1/0;const p=e.slice(1);let f;this.options.extensions.startInline.forEach(m=>{f=m.call({lexer:this},p),typeof f=="number"&&f>=0&&(d=Math.min(d,f))}),d<1/0&&d>=0&&(u=e.substring(0,d+1))}if(h=this.tokenizer.inlineText(u)){e=e.substring(h.raw.length),h.raw.slice(-1)!=="_"&&(o=h.raw.slice(-1)),r=!0;const d=t.at(-1);(d==null?void 0:d.type)==="text"?(d.raw+=h.raw,d.text+=h.text):t.push(h);continue}if(e){const d="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(d);break}else throw new Error(d)}}return t}}class me{constructor(e){b(this,"options");b(this,"parser");this.options=e||D}space(e){return""}code({text:e,lang:t,escaped:s}){var o;const i=(o=(t||"").match(A.notSpaceStart))==null?void 0:o[0],r=e.replace(A.endingNewline,"")+`
`;return i?'<pre><code class="language-'+_(i)+'">'+(s?r:_(r,!0))+`</code></pre>
`:"<pre><code>"+(s?r:_(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){const t=e.ordered,s=e.start;let i="";for(let c=0;c<e.items.length;c++){const a=e.items[c];i+=this.listitem(a)}const r=t?"ol":"ul",o=t&&s!==1?' start="'+s+'"':"";return"<"+r+o+`>
`+i+"</"+r+`>
`}listitem(e){var s;let t="";if(e.task){const i=this.checkbox({checked:!!e.checked});e.loose?((s=e.tokens[0])==null?void 0:s.type)==="paragraph"?(e.tokens[0].text=i+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=i+" "+_(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:i+" ",text:i+" ",escaped:!0}):t+=i+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",s="";for(let r=0;r<e.header.length;r++)s+=this.tablecell(e.header[r]);t+=this.tablerow({text:s});let i="";for(let r=0;r<e.rows.length;r++){const o=e.rows[r];s="";for(let c=0;c<o.length;c++)s+=this.tablecell(o[c]);i+=this.tablerow({text:s})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){const t=this.parser.parseInline(e.tokens),s=e.header?"th":"td";return(e.align?`<${s} align="${e.align}">`:`<${s}>`)+t+`</${s}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${_(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:s}){const i=this.parser.parseInline(s),r=gt(e);if(r===null)return i;e=r;let o='<a href="'+e+'"';return t&&(o+=' title="'+_(t)+'"'),o+=">"+i+"</a>",o}image({href:e,title:t,text:s}){const i=gt(e);if(i===null)return _(s);e=i;let r=`<img src="${e}" alt="${s}"`;return t&&(r+=` title="${_(t)}"`),r+=">",r}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:_(e.text)}}class je{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}}class ${constructor(e){b(this,"options");b(this,"renderer");b(this,"textRenderer");this.options=e||D,this.options.renderer=this.options.renderer||new me,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new je}static parse(e,t){return new $(t).parse(e)}static parseInline(e,t){return new $(t).parseInline(e)}parse(e,t=!0){var i,r;let s="";for(let o=0;o<e.length;o++){const c=e[o];if((r=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&r[c.type]){const l=c,h=this.options.extensions.renderers[l.type].call({parser:this},l);if(h!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){s+=h||"";continue}}const a=c;switch(a.type){case"space":{s+=this.renderer.space(a);continue}case"hr":{s+=this.renderer.hr(a);continue}case"heading":{s+=this.renderer.heading(a);continue}case"code":{s+=this.renderer.code(a);continue}case"table":{s+=this.renderer.table(a);continue}case"blockquote":{s+=this.renderer.blockquote(a);continue}case"list":{s+=this.renderer.list(a);continue}case"html":{s+=this.renderer.html(a);continue}case"paragraph":{s+=this.renderer.paragraph(a);continue}case"text":{let l=a,h=this.renderer.text(l);for(;o+1<e.length&&e[o+1].type==="text";)l=e[++o],h+=`
`+this.renderer.text(l);t?s+=this.renderer.paragraph({type:"paragraph",raw:h,text:h,tokens:[{type:"text",raw:h,text:h,escaped:!0}]}):s+=h;continue}default:{const l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}parseInline(e,t=this.renderer){var i,r;let s="";for(let o=0;o<e.length;o++){const c=e[o];if((r=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&r[c.type]){const l=this.options.extensions.renderers[c.type].call({parser:this},c);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(c.type)){s+=l||"";continue}}const a=c;switch(a.type){case"escape":{s+=t.text(a);break}case"html":{s+=t.html(a);break}case"link":{s+=t.link(a);break}case"image":{s+=t.image(a);break}case"strong":{s+=t.strong(a);break}case"em":{s+=t.em(a);break}case"codespan":{s+=t.codespan(a);break}case"br":{s+=t.br(a);break}case"del":{s+=t.del(a);break}case"text":{s+=t.text(a);break}default:{const l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}}class J{constructor(e){b(this,"options");b(this,"block");this.options=e||D}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}provideLexer(){return this.block?E.lex:E.lexInline}provideParser(){return this.block?$.parse:$.parseInline}}b(J,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class pn{constructor(...e){b(this,"defaults",Be());b(this,"options",this.setOptions);b(this,"parse",this.parseMarkdown(!0));b(this,"parseInline",this.parseMarkdown(!1));b(this,"Parser",$);b(this,"Renderer",me);b(this,"TextRenderer",je);b(this,"Lexer",E);b(this,"Tokenizer",ge);b(this,"Hooks",J);this.use(...e)}walkTokens(e,t){var i,r;let s=[];for(const o of e)switch(s=s.concat(t.call(this,o)),o.type){case"table":{const c=o;for(const a of c.header)s=s.concat(this.walkTokens(a.tokens,t));for(const a of c.rows)for(const l of a)s=s.concat(this.walkTokens(l.tokens,t));break}case"list":{const c=o;s=s.concat(this.walkTokens(c.items,t));break}default:{const c=o;(r=(i=this.defaults.extensions)==null?void 0:i.childTokens)!=null&&r[c.type]?this.defaults.extensions.childTokens[c.type].forEach(a=>{const l=c[a].flat(1/0);s=s.concat(this.walkTokens(l,t))}):c.tokens&&(s=s.concat(this.walkTokens(c.tokens,t)))}}return s}use(...e){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(s=>{const i={...s};if(i.async=this.defaults.async||i.async||!1,s.extensions&&(s.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){const o=t.renderers[r.name];o?t.renderers[r.name]=function(...c){let a=r.renderer.apply(this,c);return a===!1&&(a=o.apply(this,c)),a}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const o=t[r.level];o?o.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),i.extensions=t),s.renderer){const r=this.defaults.renderer||new me(this.defaults);for(const o in s.renderer){if(!(o in r))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;const c=o,a=s.renderer[c],l=r[c];r[c]=(...h)=>{let u=a.apply(r,h);return u===!1&&(u=l.apply(r,h)),u||""}}i.renderer=r}if(s.tokenizer){const r=this.defaults.tokenizer||new ge(this.defaults);for(const o in s.tokenizer){if(!(o in r))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;const c=o,a=s.tokenizer[c],l=r[c];r[c]=(...h)=>{let u=a.apply(r,h);return u===!1&&(u=l.apply(r,h)),u}}i.tokenizer=r}if(s.hooks){const r=this.defaults.hooks||new J;for(const o in s.hooks){if(!(o in r))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;const c=o,a=s.hooks[c],l=r[c];J.passThroughHooks.has(o)?r[c]=h=>{if(this.defaults.async)return Promise.resolve(a.call(r,h)).then(d=>l.call(r,d));const u=a.call(r,h);return l.call(r,u)}:r[c]=(...h)=>{let u=a.apply(r,h);return u===!1&&(u=l.apply(r,h)),u}}i.hooks=r}if(s.walkTokens){const r=this.defaults.walkTokens,o=s.walkTokens;i.walkTokens=function(c){let a=[];return a.push(o.call(this,c)),r&&(a=a.concat(r.call(this,c))),a}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return E.lex(e,t??this.defaults)}parser(e,t){return $.parse(e,t??this.defaults)}parseMarkdown(e){return(s,i)=>{const r={...i},o={...this.defaults,...r},c=this.onError(!!o.silent,!!o.async);if(this.defaults.async===!0&&r.async===!1)return c(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof s>"u"||s===null)return c(new Error("marked(): input parameter is undefined or null"));if(typeof s!="string")return c(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(s)+", string expected"));o.hooks&&(o.hooks.options=o,o.hooks.block=e);const a=o.hooks?o.hooks.provideLexer():e?E.lex:E.lexInline,l=o.hooks?o.hooks.provideParser():e?$.parse:$.parseInline;if(o.async)return Promise.resolve(o.hooks?o.hooks.preprocess(s):s).then(h=>a(h,o)).then(h=>o.hooks?o.hooks.processAllTokens(h):h).then(h=>o.walkTokens?Promise.all(this.walkTokens(h,o.walkTokens)).then(()=>h):h).then(h=>l(h,o)).then(h=>o.hooks?o.hooks.postprocess(h):h).catch(c);try{o.hooks&&(s=o.hooks.preprocess(s));let h=a(s,o);o.hooks&&(h=o.hooks.processAllTokens(h)),o.walkTokens&&this.walkTokens(h,o.walkTokens);let u=l(h,o);return o.hooks&&(u=o.hooks.postprocess(u)),u}catch(h){return c(h)}}}onError(e,t){return s=>{if(s.message+=`
Please report this to https://github.com/markedjs/marked.`,e){const i="<p>An error occurred:</p><pre>"+_(s.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(s);throw s}}}const z=new pn;function y(n,e){return z.parse(n,e)}y.options=y.setOptions=function(n){return z.setOptions(n),y.defaults=z.defaults,Vt(y.defaults),y};y.getDefaults=Be;y.defaults=D;y.use=function(...n){return z.use(...n),y.defaults=z.defaults,Vt(y.defaults),y};y.walkTokens=function(n,e){return z.walkTokens(n,e)};y.parseInline=z.parseInline;y.Parser=$;y.parser=$.parse;y.Renderer=me;y.TextRenderer=je;y.Lexer=E;y.lexer=E.lex;y.Tokenizer=ge;y.Hooks=J;y.parse=y;y.options;y.setOptions;y.use;y.walkTokens;y.parseInline;$.parse;E.lex;const fn=$t(`
  :host {
    display: block;
    padding: 1rem;
    color-scheme: light dark;
  }
  .todo-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
  }
  .todo-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .todo-actions {
    display: flex;
    gap: 8px;
  }
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
  }
  .edit-btn {
    background-color: #3b82f6;
    color: white;
  }
  .edit-btn:hover {
    background-color: #258ee6;
  }
  .delete-btn {
    background-color: #ef4444;
    color: white;
  }
  .delete-btn:hover {
    background-color: #dc2626;
  }
  textarea {
    box-sizing: border-box;
    border-radius: 4px;
  }

  .markdown-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .markdown-editor {
    width: 100%;
    min-height: 100px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
  }

  .markdown-preview {
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .markdown-preview :first-child {
    margin-top: 0;
  }

  .markdown-preview :last-child {
    margin-bottom: 0;
  }

  .preview-header {
    font-size: 0.8em;
    color: #666;
    margin-bottom: 4px;
  }

  .edit-mode .markdown-preview {
    display: block;
  }

  .view-mode .markdown-editor {
    display: none;
  }

  .view-mode .markdown-preview {
    border: none;
    background: none;
    padding: 4px 0;
  }

  .view-mode .preview-header {
    display: none;
  }
`);class Re extends U{constructor(){super(),this.todo={},this.editingId=null}render(){return L`
      <div class="todo-container">
        ${this.renderTodoItem(this.todo)}
      </div>
    `}renderTodoItem(e,t=0){const s=this.editingId===e.id,i=e.tags?e.tags.map(o=>L`<span class="tag">${o}</span>`):"",r=L`
      <div class="todo-item" style="margin-left: ${t*20}px;">
        <input
          type="checkbox"
          .checked=${e.completed}
          @change=${()=>this.toggleComplete(e)}
        />
        <span class="todo-title">${e.title}</span>
        ${i}
        <div class="markdown-container ${s?"edit-mode":"view-mode"}">
          ${s?L`
            <textarea
              class="markdown-editor"
              @input=${o=>this.handleMarkdownInput(o,e)}
              placeholder="${e.task?"Subtask Description":"Task Description"}"
            >${e.description}</textarea>
            <div class="preview-header">Preview:</div>
          `:""}
          <div class="markdown-preview">
            ${Ri(this.renderMarkdown(e.description))}
          </div>
        </div>
        <div class="todo-actions">
          <button
            class="edit-btn"
            @click=${()=>this.toggleEdit(e)}
          >
            ${s?"Save":"Edit"}
          </button>
          <button
            class="delete-btn"
            @click=${()=>this.deleteTodo(e)}
          >
            Delete
          </button>
        </div>
      </div>
      <details>
      <summary>
        ${e.tasks.length} ${e.completed?"(Completed)":"elements"}
      </summary>
      ${e.tasks?e.tasks.map(o=>this.renderTodoItem(o,t+1)):""}

    </details>
    `;return console.log(t,e.tasks.length),t>0?L`
        <details>
          <summary>
            ${e.title} ${e.completed?"(Completed)":""}
          </summary>
          ${r}
        </details>
      `:r}renderMarkdown(e){return e?y(e):""}handleMarkdownInput(e,t){t.description=e.target.value,this.requestUpdate()}toggleEdit(e){this.editingId===e.id?(this.editingId=null,this.dispatchEvent(new CustomEvent("edit-todo",{detail:{item:e},bubbles:!0,composed:!0}))):this.editingId=e.id,this.requestUpdate()}toggleComplete(e){e.completed=!e.completed,this.dispatchEvent(new CustomEvent("task-completed",{detail:{id:e},bubbles:!0,composed:!0})),this.requestUpdate()}deleteTodo(e){this.dispatchEvent(new CustomEvent("delete-todo",{detail:{id:e.id},bubbles:!0,composed:!0}))}}b(Re,"styles",Ct`
    ${fn}
  `),b(Re,"properties",{todo:{type:Object},editingId:{type:String}});customElements.define("todo-component",Re);

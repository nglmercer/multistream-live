import{i as x,n as g,r as w}from"./property.DTDKM9eR.js";import{T as V,x as h}from"./lit-html.Cs9YtZST.js";import{t as I}from"./custom-element.BhZVzxrc.js";import{r as v}from"./state.5GRZVynF.js";import{o as E}from"./unsafe-html.o8VIWoCg.js";import{e as H,i as _,t as $}from"./directive.CGE4aKEl.js";import{e as f}from"./class-map.D2HkPoOL.js";import{a as d}from"./socketManager.C9KItRar.js";import{B as L,L as P}from"./Logger.BU1C1vw5.js";import"./idb.DgU9_DZM.js";import"./UserProcessor.CxcZZZ9m.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const T=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function B(e,t){return(o,n,s)=>{const r=i=>i.renderRoot?.querySelector(e)??null;return T(o,n,{get(){return r(this)}})}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F="important",U=" !"+F,M=H(class extends _{constructor(e){if(super(e),e.type!==$.ATTRIBUTE||e.name!=="style"||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,o)=>{const n=e[o];return n==null?t:t+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:o}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(const n of this.ft)t[n]==null&&(this.ft.delete(n),n.includes("-")?o.removeProperty(n):o[n]=null);for(const n in t){const s=t[n];if(s!=null){this.ft.add(n);const r=typeof s=="string"&&s.endsWith(U);n.includes("-")||r?o.setProperty(n,r?s.slice(0,-11):s,r?F:""):o[n]=s}}return V}});var z=Object.defineProperty,j=Object.getOwnPropertyDescriptor,c=(e,t,o,n)=>{for(var s=n>1?void 0:n?j(t,o):t,r=e.length-1,i;r>=0;r--)(i=e[r])&&(s=(n?i(t,o,s):i(s))||s);return n&&s&&z(t,o,s),s};class D extends CustomEvent{constructor(t){super("user-connected",{detail:t,bubbles:!0,composed:!0})}}class G extends CustomEvent{constructor(t){super("connect",{detail:t,bubbles:!0,composed:!0})}}class O extends CustomEvent{constructor(){super("user-disconnected",{bubbles:!0,composed:!0})}}class q extends CustomEvent{constructor(t){super("connection-status-changed",{detail:t,bubbles:!0,composed:!0})}}const b={twitch:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',kick:'<svg viewBox="0 0 933 300" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H100V66.6667H133.333V33.3333H166.667V0H266.667V100H233.333V133.333H200V166.667H233.333V200H266.667V300H166.667V266.667H133.333V233.333H100V300H0V0ZM666.667 0H766.667V66.6667H800V33.3333H833.333V0H933.333V100H900V133.333H866.667V166.667H900V200H933.333V300H833.333V266.667H800V233.333H766.667V300H666.667V0ZM300 0H400V300H300V0ZM533.333 0H466.667V33.3333H433.333V266.667H466.667V300H533.333H633.333V200H533.333V100H633.333V0H533.333Z"/></svg>',facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'},m={twitch:{color:"#9146FF",hoverColor:"#7C2BFF",textColor:"#FFFFFF",states:{online:"live on Twitch!",offline:"Go live on Twitch",away:"Stream Paused",busy:"Stream Ending Soon"}},youtube:{color:"#FF0000",hoverColor:"#CC0000",textColor:"#FFFFFF",states:{online:"Live on YouTube!",offline:"Go Live on YouTube",away:"Stream Paused",busy:"Ending Stream"}},tiktok:{color:"#000000",hoverColor:"#1a1a1a",textColor:"#FFFFFF",states:{online:"Live on TikTok!",offline:"Go Live on TikTok",away:"Stream Paused",busy:"Ending Stream"}},kick:{color:"#53FC18",hoverColor:"#45D614",textColor:"#000000",states:{online:"live on Kick!",offline:"Start live on Kick",away:"Stream Paused",busy:"Stream Ending Soon"}},facebook:{color:"#1877F2",hoverColor:"#0E5FC1",textColor:"#FFFFFF",states:{online:"Live on",offline:"Go Live",away:"Stream Paused",busy:"Ending Stream"}}};class u{constructor(){this.groupStores=new Map}static getInstance(){return u.instance||(u.instance=new u),u.instance}createGroupStore(t,o,n){if(this.groupStores.has(t)){const p=this.groupStores.get(t);return p.subscribers.add(n),p.componentCount++,p}const s=this.loadStateFromStorage(t),i={state:s?{...o,...s}:o,subscribers:new Set([n]),componentCount:1};return this.groupStores.set(t,i),i}updateGroupState(t,o){const n=this.groupStores.get(t);if(!n)return;const s={...n.state};n.state={...n.state,...o},this.saveStateToStorage(t,n.state),n.subscribers.forEach(r=>{r.syncWithGroupState(n.state,s)})}removeFromGroup(t,o){const n=this.groupStores.get(t);n&&(n.subscribers.delete(o),n.componentCount--,n.componentCount<=0&&this.groupStores.delete(t))}getGroupState(t){return this.groupStores.get(t)?.state||null}loadStateFromStorage(t){try{const o=localStorage.getItem(`userProfileState_${t}`);return o?JSON.parse(o):null}catch(o){return console.error("Failed to load state from storage:",o),null}}saveStateToStorage(t,o){try{localStorage.setItem(`userProfileState_${t}`,JSON.stringify(o))}catch(n){console.error("Failed to save state to storage:",n)}}}function C(e){let t=0,o=0,n=0;return e.length===4?(t=parseInt(e[1]+e[1],16),o=parseInt(e[2]+e[2],16),n=parseInt(e[3]+e[3],16)):e.length===7&&(t=parseInt(e[1]+e[2],16),o=parseInt(e[3]+e[4],16),n=parseInt(e[5]+e[6],16)),`${t}, ${o}, ${n}`}function A(e){const t=m[e]||m.tiktok,o=C(t.color),n=C(t.hoverColor);return{"--platform-color":t.color,"--platform-hover-color":t.hoverColor,"--platform-text-color":t.textColor,"--platform-shadow":`rgba(${o}, 0.3)`,"--platform-hover-shadow":`rgba(${n}, 0.3)`,"--platform-background":`rgba(${o}, 0.1)`,"--button-gradient":`linear-gradient(135deg, ${t.color} 0%, ${t.hoverColor} 100%)`}}let a=class extends w{constructor(){super(...arguments),this.minimal=!1,this.platform="twitch",this._state={connected:!1,username:"",imageUrl:"/favicon.svg",connectionStatus:"offline",platform:"twitch"},this.inputValue="",this.isConnecting=!1,this.groupStoreManager=u.getInstance(),this.uniqueId=Math.random().toString(36).substring(2,9)}connectedCallback(){super.connectedCallback(),this.initializeState()}disconnectedCallback(){super.disconnectedCallback(),this.groupId&&this.groupStoreManager.removeFromGroup(this.groupId,this)}initializeState(){this._state={...this._state,platform:this.platform},this.groupId&&(this.groupStore=this.groupStoreManager.createGroupStore(this.groupId,this._state,this),this._state={...this.groupStore.state}),this.inputValue=this._state.username||""}syncWithGroupState(e,t){this._state={...e},this.inputValue=e.username||"",this.dispatchEvents(t,e),this.requestUpdate()}updateState(e){const t={...this._state};this.groupId&&this.groupStore?this.groupStoreManager.updateGroupState(this.groupId,e):(this._state={...this._state,...e},this.dispatchEvents(t,this._state),this.requestUpdate())}dispatchEvents(e,t){e.connectionStatus!==t.connectionStatus&&this.dispatchEvent(new q({status:t.connectionStatus})),!e.connected&&t.connected&&this.dispatchEvent(new D({username:t.username,state:t})),e.connected&&!t.connected&&this.dispatchEvent(new O)}async handleConnect(){const e=this.inputValue.trim();if(!(!e||this.isConnecting||this._state.connected)){this.isConnecting=!0,this.updateState({connectionStatus:"busy"});try{await this.connect(e)}catch(t){console.error("Connection failed:",t),this.updateState({connected:!1,connectionStatus:"offline"})}finally{this.isConnecting=!1}}}handleButtonClick(e){e.preventDefault(),e.stopPropagation(),this._state.connected?this.disconnect():this.handleConnect()}handleInputChange(e){const o=e.target.value;this.inputValue=o,this._state.connected||this.updateState({username:o})}async connect(e){console.log("Connecting to:",e,"on platform:",this._state.platform),this.dispatchEvent(new G({username:e,platform:this.platform})),d.emit("join-platform",{uniqueId:e,platform:this.platform}),await new Promise(t=>setTimeout(t,500)),this.updateState({connected:!0,username:e,connectionStatus:"online"})}disconnect(){console.log("Disconnecting from:",this._state.platform),this.updateState({connected:!1,connectionStatus:"offline"})}setPlatform(e){m[e]?this.updateState({platform:e}):console.warn(`Platform "${e}" not recognized.`)}setConnectionStatus(e){this.updateState({connectionStatus:e,connected:e!=="offline"})}setProfileImage(e){this.updateState({imageUrl:e||"/favicon.svg"})}getState(){return{...this._state}}renderProfileImage(){return(!this._state.imageUrl||this._state.imageUrl==="/favicon.svg")&&b[this._state.platform]?h`
        <div class="profile-image icon">
          ${E(b[this._state.platform])}
        </div>
      `:h`
        <img 
          class="profile-image" 
          src="${this._state.imageUrl||"/favicon.svg"}" 
          alt="Profile"
        />
      `}getButtonText(){return this.isConnecting?"Connecting...":this._state.connected?"Disconnect":"Connect"}isButtonDisabled(){return this.isConnecting?!0:this._state.connected?!1:this.inputValue.trim().length===0}updated(e){e.has("platform")&&this.platform!==this._state.platform&&this.setPlatform(this.platform)}render(){const e={container:!0,connected:this._state.connected,disconnected:!this._state.connected,minimal:this.minimal},t={"status-indicator":!0,[this._state.connectionStatus]:!0},o={button:!0,connected:this._state.connected,connecting:this.isConnecting};return h`
      <div class="user-profile">
        <div 
          class=${f(e)} 
          style=${M(A(this._state.platform))}
        >
          <div class="profile-wrapper">
            ${this.renderProfileImage()}
            <div 
              class=${f(t)}
              title="Status: ${this._state.connectionStatus}"
            ></div>
          </div>
          <input
            class="input"
            type="text"
            placeholder="Enter your name"
            .value=${this.inputValue}
            ?disabled=${this._state.connected}
            @input=${this.handleInputChange}
          />
          <button 
            class=${f(o)}
            @click=${this.handleButtonClick}
            ?disabled=${this.isButtonDisabled()}
            type="button"
          >
            ${this.getButtonText()}
          </button>
        </div>
      </div>
    `}};a.styles=x`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .user-profile {
      width: 100%;
    }

    .container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      background: var(--platform-background, rgba(145, 70, 255, 0.1));
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .container.connected {
      border-color: var(--platform-color, #9146FF);
      box-shadow: 0 4px 12px var(--platform-shadow, rgba(145, 70, 255, 0.3));
    }

    .container.minimal {
      padding: 8px;
      gap: 8px;
    }

    .profile-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .profile-image {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--platform-color, #9146FF);
    }

    .profile-image.icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--platform-color, #9146FF);
      color: var(--platform-text-color, #FFFFFF);
    }

    .profile-image.icon svg {
      width: 24px;
      height: 24px;
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
    }

    .status-indicator.online {
      background: #10b981;
    }

    .status-indicator.offline {
      background: #6b7280;
    }

    .status-indicator.away {
      background: #f59e0b;
    }

    .status-indicator.busy {
      background: #ef4444;
    }

    .input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .input:focus {
      outline: none;
      border-color: var(--platform-color, #9146FF);
    }

    .input:disabled {
      background: #f3f4f6;
      color: #6b7280;
      cursor: not-allowed;
    }

    .button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--button-gradient, linear-gradient(135deg, #9146FF 0%, #7C2BFF 100%));
      color: var(--platform-text-color, #FFFFFF);
    }

    .button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px var(--platform-hover-shadow, rgba(124, 43, 255, 0.3));
    }

    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .button.connecting {
      opacity: 0.8;
      cursor: wait;
    }

    .button.connected {
      background: #ef4444;
    }

    .button.connected:hover:not(:disabled) {
      background: #dc2626;
    }
  `;c([g({type:Boolean})],a.prototype,"minimal",2);c([g({type:String,attribute:"group-id"})],a.prototype,"groupId",2);c([g({type:String})],a.prototype,"platform",2);c([v()],a.prototype,"_state",2);c([v()],a.prototype,"inputValue",2);c([v()],a.prototype,"isConnecting",2);c([B("input")],a.prototype,"inputElement",2);a=c([I("user-profile")],a);class R{constructor(){this.hasInteracted=!1,this.callbacks=[],this.interactionEvents=["click","keydown","keyup","mousedown","mouseup","touchstart","touchend","pointerdown","pointerup"],this.setupListeners()}setupListeners(){const t=()=>{this.hasInteracted||(this.hasInteracted=!0,this.executeCallbacks(),this.removeListeners())};this.interactionEvents.forEach(o=>{document.addEventListener(o,t,{once:!0,passive:!0})})}removeListeners(){this.interactionEvents.forEach(t=>{document.removeEventListener(t,()=>{})})}async executeCallbacks(){for(const t of this.callbacks)try{await t()}catch(o){console.error("Error ejecutando callback de interacción:",o)}this.callbacks=[]}onUserInteraction(t){this.hasInteracted?t():this.callbacks.push(t)}get userHasInteracted(){return this.hasInteracted}forceInteraction(){this.hasInteracted||(this.hasInteracted=!0,this.executeCallbacks(),this.removeListeners())}}const k=new R,Z=e=>{k.onUserInteraction(e)},J=()=>k.userHasInteracted;new L("userConnect.tsx").setLevel(P.LOG);const S=document.querySelector(".kicklogin"),y=document.querySelector(".tiktoklogin");let l=!1;async function K(){!S||!y||[S,y].forEach(e=>{e.addEventListener("connect",o=>{const n=o.detail;d.emit("join-platform",{uniqueId:n.username,platform:n.platform}),console.log("data",n)}),console.log("loginsState",e.getState());const t=e.getState();if(t&&t.connected){const o=()=>{console.log("callback EXECUTED"),d.emit("join-platform",{uniqueId:t.username,platform:t.platform}),l=setInterval(()=>{l!==!0&&(d.emit("join-platform",{uniqueId:t.username,platform:t.platform}),console.log("callback INTERVAL",l,typeof l))},3e3)};J()?o():Z(o)}d.on("connected",o=>{console.log("CALLBACK connected"),typeof l=="function"&&l(),l=!0})})}document.addEventListener("DOMContentLoaded",async()=>{K()});

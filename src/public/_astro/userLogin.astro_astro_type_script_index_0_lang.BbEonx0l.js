import{i as F,r as w}from"./lit-element.CdPzzhzS.js";import{T as x,x as d}from"./lit-html.Cs9YtZST.js";import{o as V,t as k}from"./custom-element.D25Ik5QF.js";import{n as f,r as g}from"./state.k4TxN2nw.js";import{e as H,i as _,t as $}from"./directive.CGE4aKEl.js";import{e as p}from"./class-map.D2HkPoOL.js";import{B as E,L as P}from"./Logger.BU1C1vw5.js";import{a as m}from"./socketManager.CK2nxta4.js";import"./idb.zra9h0q-.js";import"./UserProcessor.Bu3Kw1mL.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(t,e){return(o,n,s)=>{const r=a=>a.renderRoot?.querySelector(t)??null;return I(o,n,{get(){return r(this)}})}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y="important",L=" !"+y,B=H(class extends _{constructor(t){if(super(t),t.type!==$.ATTRIBUTE||t.name!=="style"||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,o)=>{const n=t[o];return n==null?e:e+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(t,[e]){const{style:o}=t.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const n of this.ft)e[n]==null&&(this.ft.delete(n),n.includes("-")?o.removeProperty(n):o[n]=null);for(const n in e){const s=e[n];if(s!=null){this.ft.add(n);const r=typeof s=="string"&&s.endsWith(L);n.includes("-")||r?o.setProperty(n,r?s.slice(0,-11):s,r?y:""):o[n]=s}}return x}});var D=Object.defineProperty,M=Object.getOwnPropertyDescriptor,c=(t,e,o,n)=>{for(var s=n>1?void 0:n?M(e,o):e,r=t.length-1,a;r>=0;r--)(a=t[r])&&(s=(n?a(e,o,s):a(s))||s);return n&&s&&D(e,o,s),s};class z extends CustomEvent{constructor(e){super("user-connected",{detail:e,bubbles:!0,composed:!0})}}class U extends CustomEvent{constructor(e){super("connect",{detail:e,bubbles:!0,composed:!0})}}class j extends CustomEvent{constructor(){super("user-disconnected",{bubbles:!0,composed:!0})}}class G extends CustomEvent{constructor(e){super("connection-status-changed",{detail:e,bubbles:!0,composed:!0})}}const v={twitch:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',kick:'<svg viewBox="0 0 933 300" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H100V66.6667H133.333V33.3333H166.667V0H266.667V100H233.333V133.333H200V166.667H233.333V200H266.667V300H166.667V266.667H133.333V233.333H100V300H0V0ZM666.667 0H766.667V66.6667H800V33.3333H833.333V0H933.333V100H900V133.333H866.667V166.667H900V200H933.333V300H833.333V266.667H800V233.333H766.667V300H666.667V0ZM300 0H400V300H300V0ZM533.333 0H466.667V33.3333H433.333V266.667H466.667V300H533.333H633.333V200H533.333V100H633.333V0H533.333Z"/></svg>',facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'},h={twitch:{color:"#9146FF",hoverColor:"#7C2BFF",textColor:"#FFFFFF",states:{online:"live on Twitch!",offline:"Go live on Twitch",away:"Stream Paused",busy:"Stream Ending Soon"}},youtube:{color:"#FF0000",hoverColor:"#CC0000",textColor:"#FFFFFF",states:{online:"Live on YouTube!",offline:"Go Live on YouTube",away:"Stream Paused",busy:"Ending Stream"}},tiktok:{color:"#000000",hoverColor:"#1a1a1a",textColor:"#FFFFFF",states:{online:"Live on TikTok!",offline:"Go Live on TikTok",away:"Stream Paused",busy:"Ending Stream"}},kick:{color:"#53FC18",hoverColor:"#45D614",textColor:"#000000",states:{online:"live on Kick!",offline:"Start live on Kick",away:"Stream Paused",busy:"Stream Ending Soon"}},facebook:{color:"#1877F2",hoverColor:"#0E5FC1",textColor:"#FFFFFF",states:{online:"Live on",offline:"Go Live",away:"Stream Paused",busy:"Ending Stream"}}};class l{constructor(){this.groupStores=new Map}static getInstance(){return l.instance||(l.instance=new l),l.instance}createGroupStore(e,o,n){if(this.groupStores.has(e)){const u=this.groupStores.get(e);return u.subscribers.add(n),u.componentCount++,u}const s=this.loadStateFromStorage(e),a={state:s?{...o,...s}:o,subscribers:new Set([n]),componentCount:1};return this.groupStores.set(e,a),a}updateGroupState(e,o){const n=this.groupStores.get(e);if(!n)return;const s={...n.state};n.state={...n.state,...o},this.saveStateToStorage(e,n.state),n.subscribers.forEach(r=>{r.syncWithGroupState(n.state,s)})}removeFromGroup(e,o){const n=this.groupStores.get(e);n&&(n.subscribers.delete(o),n.componentCount--,n.componentCount<=0&&this.groupStores.delete(e))}getGroupState(e){return this.groupStores.get(e)?.state||null}loadStateFromStorage(e){try{const o=localStorage.getItem(`userProfileState_${e}`);return o?JSON.parse(o):null}catch(o){return console.error("Failed to load state from storage:",o),null}}saveStateToStorage(e,o){try{localStorage.setItem(`userProfileState_${e}`,JSON.stringify(o))}catch(n){console.error("Failed to save state to storage:",n)}}}function b(t){let e=0,o=0,n=0;return t.length===4?(e=parseInt(t[1]+t[1],16),o=parseInt(t[2]+t[2],16),n=parseInt(t[3]+t[3],16)):t.length===7&&(e=parseInt(t[1]+t[2],16),o=parseInt(t[3]+t[4],16),n=parseInt(t[5]+t[6],16)),`${e}, ${o}, ${n}`}function O(t){const e=h[t]||h.tiktok,o=b(e.color),n=b(e.hoverColor);return{"--platform-color":e.color,"--platform-hover-color":e.hoverColor,"--platform-text-color":e.textColor,"--platform-shadow":`rgba(${o}, 0.3)`,"--platform-hover-shadow":`rgba(${n}, 0.3)`,"--platform-background":`rgba(${o}, 0.1)`,"--button-gradient":`linear-gradient(135deg, ${e.color} 0%, ${e.hoverColor} 100%)`}}let i=class extends w{constructor(){super(...arguments),this.minimal=!1,this.platform="twitch",this._state={connected:!1,username:"",imageUrl:"/favicon.svg",connectionStatus:"offline",platform:"twitch"},this.inputValue="",this.isConnecting=!1,this.groupStoreManager=l.getInstance(),this.uniqueId=Math.random().toString(36).substring(2,9)}connectedCallback(){super.connectedCallback(),this.initializeState()}disconnectedCallback(){super.disconnectedCallback(),this.groupId&&this.groupStoreManager.removeFromGroup(this.groupId,this)}initializeState(){this._state={...this._state,platform:this.platform},this.groupId&&(this.groupStore=this.groupStoreManager.createGroupStore(this.groupId,this._state,this),this._state={...this.groupStore.state}),this.inputValue=this._state.username||""}syncWithGroupState(t,e){this._state={...t},this.inputValue=t.username||"",this.dispatchEvents(e,t),this.requestUpdate()}updateState(t){const e={...this._state};this.groupId&&this.groupStore?this.groupStoreManager.updateGroupState(this.groupId,t):(this._state={...this._state,...t},this.dispatchEvents(e,this._state),this.requestUpdate())}dispatchEvents(t,e){t.connectionStatus!==e.connectionStatus&&this.dispatchEvent(new G({status:e.connectionStatus})),!t.connected&&e.connected&&this.dispatchEvent(new z({username:e.username,state:e})),t.connected&&!e.connected&&this.dispatchEvent(new j)}async handleConnect(){const t=this.inputValue.trim();if(!(!t||this.isConnecting||this._state.connected)){this.isConnecting=!0,this.updateState({connectionStatus:"busy"});try{await this.connect(t)}catch(e){console.error("Connection failed:",e),this.updateState({connected:!1,connectionStatus:"offline"})}finally{this.isConnecting=!1}}}handleButtonClick(t){t.preventDefault(),t.stopPropagation(),this._state.connected?this.disconnect():this.handleConnect()}handleInputChange(t){const o=t.target.value;this.inputValue=o,this._state.connected||this.updateState({username:o})}async connect(t){console.log("Connecting to:",t,"on platform:",this._state.platform),this.dispatchEvent(new U({username:t,platform:this.platform})),await new Promise(e=>setTimeout(e,500)),this.updateState({connected:!0,username:t,connectionStatus:"online"})}disconnect(){console.log("Disconnecting from:",this._state.platform),this.updateState({connected:!1,connectionStatus:"offline"})}setPlatform(t){h[t]?this.updateState({platform:t}):console.warn(`Platform "${t}" not recognized.`)}setConnectionStatus(t){this.updateState({connectionStatus:t,connected:t!=="offline"})}setProfileImage(t){this.updateState({imageUrl:t||"/favicon.svg"})}getState(){return{...this._state}}renderProfileImage(){return(!this._state.imageUrl||this._state.imageUrl==="/favicon.svg")&&v[this._state.platform]?d`
        <div class="profile-image icon">
          ${V(v[this._state.platform])}
        </div>
      `:d`
        <img 
          class="profile-image" 
          src="${this._state.imageUrl||"/favicon.svg"}" 
          alt="Profile"
        />
      `}getButtonText(){return this.isConnecting?"Connecting...":this._state.connected?"Disconnect":"Connect"}isButtonDisabled(){return this.isConnecting?!0:this._state.connected?!1:this.inputValue.trim().length===0}updated(t){t.has("platform")&&this.platform!==this._state.platform&&this.setPlatform(this.platform)}render(){const t={container:!0,connected:this._state.connected,disconnected:!this._state.connected,minimal:this.minimal},e={"status-indicator":!0,[this._state.connectionStatus]:!0},o={button:!0,connected:this._state.connected,connecting:this.isConnecting};return d`
      <div class="user-profile">
        <div 
          class=${p(t)} 
          style=${B(O(this._state.platform))}
        >
          <div class="profile-wrapper">
            ${this.renderProfileImage()}
            <div 
              class=${p(e)}
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
            class=${p(o)}
            @click=${this.handleButtonClick}
            ?disabled=${this.isButtonDisabled()}
            type="button"
          >
            ${this.getButtonText()}
          </button>
        </div>
      </div>
    `}};i.styles=F`
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
  `;c([f({type:Boolean})],i.prototype,"minimal",2);c([f({type:String,attribute:"group-id"})],i.prototype,"groupId",2);c([f({type:String})],i.prototype,"platform",2);c([g()],i.prototype,"_state",2);c([g()],i.prototype,"inputValue",2);c([g()],i.prototype,"isConnecting",2);c([T("input")],i.prototype,"inputElement",2);i=c([k("user-profile")],i);new E("userConnect.tsx").setLevel(P.LOG);const S=document.querySelector(".kicklogin"),C=document.querySelector(".tiktoklogin");async function q(){!S||!C||[S,C].forEach(t=>{t.addEventListener("connect",o=>{const n=o.detail;m.emit("join-platform",{uniqueId:n.username,platform:n.platform}),console.log("data",n)}),console.log("loginsState",t.getState());const e=t.getState();e&&e.connected&&window.showQueuedDialog({title:`Connect to ${e.platform}`,message:`Are you sure you want to connect as ${e.username}?`,rejectText:"Cancel",acceptText:"Connect",onClose:o=>{console.log("Dialog closed with result:",o),o?m.emit("join-platform",{uniqueId:e.username,platform:e.platform}):t.disconnect()}}).then(o=>{console.log("Dialog result:",o)}).catch(o=>{console.error("Dialog error:",o)})})}document.addEventListener("DOMContentLoaded",async()=>{q()});

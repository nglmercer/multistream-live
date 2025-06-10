import{T as d,K as q,s as A}from"./socketManager.BZAsUqmV.js";import"./voicecomponent.astro_astro_type_script_index_0_lang.gKefQEDA.js";import"./idb.CmwNWw1r.js";import"./Logger.BU1C1vw5.js";import"./UserProcessor.CznKL11N.js";import"./lit-element.CdPzzhzS.js";import"./lit-html.Cs9YtZST.js";import"./state.k4TxN2nw.js";import"./directive.CGE4aKEl.js";import"./directive-helpers.CY_bUdrT.js";import"./class-map.D2HkPoOL.js";console.log("Chat Loaded");async function T(e){return{user:e.sender,comment:e.content,type:e.type,uniqueId:e.sender?.username,nickname:e.sender?.slug,color:e.sender?.indentity?.color,emotes:e.emotes,profilePictureUrl:e.profilePictureUrl}}const I={user:{name:"username",value:"uniqueId comment"},content:[{type:"text",value:"uniqueId = username"},{type:"text",value:"comentario = comment"}]},L={user:{name:"username",value:"texto de prueba123123123"},content:[{type:"text",value:"UniqueId"},{type:"text",value:"1 = repeatCount"},{type:"text",value:"rose = giftname"}]},B={user:{name:"username",value:"UniqueId"},content:[{type:"text",value:"UniqueId"},{type:"text",value:"followed"}]},N=(e,t)=>({text:e,callback:t}),_={respond:e=>{console.log("Respond clicked",e)}},k=[N("Responder",_.respond)],h=()=>{const e=new Date;return`${e.getHours().toString().padStart(2,"0")}:${e.getMinutes().toString().padStart(2,"0")}`};async function $(){console.log("lastelement");const e=localStorage.getItem("TiktokEvents");if(e){const t=JSON.parse(e);console.log("TiktokEvents",t);const n=t.chat,o=t.gift,s=t.like;n&&E(n),o&&C(o),s&&D(s)}else{const t=f(I);l(t,"chatcontainer");const n=f(L,k);l(n,"giftcontainer");const o=f(B,k);l(o,"eventscontainer")}}function l(e,t,n=!1){document.getElementById(t).addMessage(e,n)}const E=async(e,t={type:"text",value:h(),class:"absolute bottom-0 right-0"})=>{const n=M(e,t);l(n,"chatcontainer"),console.log("chat",e)},C=async e=>{const t=F(e,{type:"text",value:h(),class:"absolute bottom-0 right-0"});l(t,"giftcontainer")},D=async e=>{const t=U(e,{type:"text",value:h(),class:"absolute bottom-0 right-0"});l(t,"eventscontainer")},P=async(e,t={type:"text",value:h(),class:"absolute bottom-0 right-0"})=>{const n=await T(e),o=M(n,t);l(o,"chatcontainer")};function M(e,t={}){const n=[{type:"text",value:e.nickname,title:e.uniqueId,class:"username-text"},{type:"text",value:e.comment,class:"chat-message-text"}];return t&&t.type&&n.push(t),{user:{name:e.uniqueId,nickname:e.nickname,photo:e.profilePictureUrl,userBadges:e.userBadges||[],data:e},content:n,containerClass:"grid-layout"}}function F(e,t={}){const n=[{type:"text",value:e.nickname,title:e.uniqueId,class:"username-text"},{type:"text",value:" sent ",class:"event-action-text"},{type:"text",value:e.giftName,class:"event-item-name"},...e.giftPictureUrl?[{type:"image",value:e.giftPictureUrl,class:"message-image event-item-icon"}]:[],...e.repeatCount>0?[{type:"text",value:` x${e.repeatCount}`,class:"event-quantity-text"}]:[]];return t&&t.type&&n.push(t),{user:{name:e.uniqueId,nickname:e.nickname,photo:e.profilePictureUrl,value:e.giftName,userBadges:e.userBadges||[],data:e},content:n,containerClass:"message-content"}}function U(e,t={}){const n=e.label?e.label.replace(/{0:user}/i,"").trim():"",o=[{type:"text",value:e.nickname,title:e.uniqueId,class:"username-text"},{type:"text",value:n,class:"system-message-text"}];return t&&t.type&&o.push(t),{user:{name:e.uniqueId,nickname:e.nickname,photo:e.profilePictureUrl,value:e.label||e.comment||"",userBadges:e.userBadges||[],data:e},content:o}}function f(e={},t={},n={}){return e&&e.user&&e.content&&e.content.length>0?{...e}:{user:t,content:[{type:"text",value:data.comment},n]}}const O=`
<style>
    .dropdown-item {
        background: #222c3a;
        border-radius: 8px;
        padding: 4px 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        height: 48px;
        font-size: 12pt;
        width: 100%;
    }
    .dropdown-item:hover {
        background: #2e3e53;
    }
</style>
`;function y(e,t="custom-popup"){const n=t.startsWith("#")?t:`#${t}`,o=document.querySelector(n);if(!o)return console.error(`Popup con ID '${t}' no encontrado en el DOM`),console.warn("Elementos disponibles con clase popup:",document.querySelectorAll('[class*="popup"]')),!1;if(typeof o.showAtElement!="function")return console.error("El elemento popup no tiene el método 'showAtElement'"),!1;console.log("element openPopup",e);let s;typeof e=="string"?(s=document.querySelector(e),s||(console.error(`Elemento con selector '${e}' no encontrado`),s=o)):e&&e.nodeType===Node.ELEMENT_NODE?s=e:(console.warn("Elemento no válido, usando el popup como referencia"),s=o);try{return o.showAtElement(s),console.log("Popup mostrado exitosamente:",s,t),!0}catch(r){return console.error("Error al mostrar el popup:",r),!1}}function c(e,t,n,o){return{id:e,text:t,icon:n,callback:()=>{o()}}}function x(e,t="custom-popup"){const n=document.querySelector(t);n.options=e}function v(e){return!e||e?.length===0?[]:e.map(n=>({html:`${O}
            <div class="dropdown-item">
                <span class="material-symbols-rounded">${n.icon}</span>
                <span class="default-font">${n.text}</span>
            </div>
        `,callback:o=>n.callback(o)}))}class R extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
        <style>
          :host {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            resize: both;
            overflow: hidden;
          }
          .messages-wrapper {
            position: relative;
            min-height: 100%;
            max-height: 280px;
            overflow-y: auto;
          }
          .maxh-5rem {max-height: 5rem !important;}
          .maxh-10rem {max-height: 10rem !important;}
          .maxh-15rem {max-height: 15rem !important;}
          .maxh-20rem {max-height: 20rem !important;}
          .maxh-25rem {max-height: 25rem !important;}
          .maxh-30rem {max-height: 30rem !important;}
        </style>
        <div class="messages-wrapper" id="messagesWrapper">
          <slot></slot>
        </div>
      `,this.messagesWrapper=this.shadowRoot.querySelector("#messagesWrapper")}connectedCallback(){this.hasAttribute("wrapper-classes")&&(this.messagesWrapper.className+=` ${this.getAttribute("wrapper-classes")}`),this.hasAttribute("wrapper-style")&&(this.messagesWrapper.style.cssText+=this.getAttribute("wrapper-style")),this.messagesWrapper&&new MutationObserver(()=>{this.scrollToBottom()}).observe(this.messagesWrapper,{childList:!0})}addMessage(t,n=!1){const o=document.createElement("chat-message");o.setMessageData(t),o.addEventListener("message-menu",s=>{this.dispatchEvent(new CustomEvent("message-menu",{detail:s.detail,bubbles:!0,composed:!0}))}),this.messagesWrapper.appendChild(o),this.scrollToBottom(),n&&o.setAutoHide(3e3)}scrollToBottom(){this.messagesWrapper.scrollTop=this.messagesWrapper.scrollHeight}}class W extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._currentMessageData=null}setMessageData(t){const{user:n,content:o,containerClass:s}=t;this._data={...t},this.renderMessage(n,o,s)}renderMessage(t,n,o){const s=t.photo?"":this.getRandomColor(),r=t.photo?"":t.name.charAt(0).toUpperCase(),g=z(t.userBadges),S="message-content"+(o?" "+o:"");this.shadowRoot.innerHTML=`
        <style>
        ${this.getStyles()}
        </style>
        <div class="avatar" role="img" aria-label="User avatar">${r}</div>
        <div class="${S}">
            ${g||""}
            </div>
        <button class="menu-button" role="button" aria-haspopup="true" aria-expanded="false">⋮</button>
      `;const u=this.shadowRoot.querySelector(".avatar");t.photo?(u.style.backgroundImage=`url(${t.photo})`,u.style.backgroundSize="cover",u.setAttribute("title",t.name)):u.style.backgroundColor=s;const w=this.shadowRoot.querySelector(".message-content");n.forEach(i=>{const p=i.class||"";let a;i.type==="image"?(a=document.createElement("img"),a.src=i.value,a.alt=i.alt||"message image",a.className=`message-image ${p}`):i.type==="url"?(a=document.createElement("a"),a.href=i.url,a.textContent=i.value,a.className=`message-text message-link ${p}`):(a=document.createElement("p"),a.textContent=i.value,a.className=`message-text ${p}`),this.setAttribute(a,{name:"title",value:i.title}),this.setAttribute(a,{name:"label",value:i.label}),a.classList.add("message-item"),w.appendChild(a)}),w.addEventListener("contextmenu",i=>{i.target.classList.contains("message-text")&&(this.shadowRoot.querySelector(".menu-button").click(),this.EventEmit(i),i.preventDefault())}),this.setupMenu()}setAttribute(t,{name:n,value:o}){n&&o&&t.setAttribute(n,o)}EventEmit(t){const n={...this._data,element:t},o=new CustomEvent("message-menu",{detail:n,bubbles:!0,composed:!0});this.dispatchEvent(o)}getStyles(){return`
          .absolute { position: absolute; }
          .relative { position: relative; }
          .bottom-0 { bottom: 0; }
          .right-0 { right: 0; }
          .ml-1 { margin-left: 4px; }
          .mr-1 { margin-right: 4px; }
          .mx-1 { margin-left: 4px; margin-right: 4px; }

          :host {
            display: flex;
            align-items: flex-start;
            margin-bottom: 4px;
            padding: 5px 8px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            position: relative;
            color: #e0e0e0;
            font-family: sans-serif;
            line-height: 1.4;
          }

          .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 8px;
            flex-shrink: 0;
            background-color: #555;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
          }

          .message-content {
            flex-grow: 1;
            display: flex;
            margin-right: 0.5rem;
            padding-bottom: 10px;
            position: relative;
          }

          .message-content .badges-container {
             display: inline-flex;
             vertical-align: middle;
             margin-right: 5px;
          }

          .message-content .message-item {
             display: inline;
             margin-right: 4px;
             vertical-align: middle;
          }
           .message-content .message-item:last-child {
             margin-right: 0;
           }
          .message-content .message-item .message-text,
          .message-content .message-item .message-link {
             display: inline;
             white-space: normal;
             word-break: break-word;
          }
          .message-content .message-item .message-image {
             display: inline;
             vertical-align: middle;
          }
          .message-content .timestamp-text.absolute {
              position: absolute;
              bottom: -2px;
              right: 0px;
          }

          .grid-layout {
            flex-grow: 1;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            align-items: center;
            row-gap: 3px;
            column-gap: 6px;
            margin-right: 1rem;
            padding-bottom: 10px;
            position: relative;
          }

          .grid-layout .badges-container {
            grid-row: 1;
            grid-column: 1;
            display: inline-flex;
            align-items: center;
            height: 18px;
          }

          .grid-layout .message-item:nth-of-type(1) {
            grid-row: 1;
            grid-column: 2;
            display: inline;
            vertical-align: baseline;
          }

          .grid-layout .message-item:nth-of-type(n+2) {
             grid-row: 2;
             grid-column: 1 / -1;
             display: inline;
             margin-right: 4px;
             vertical-align: middle;
          }
           .grid-layout .message-item:nth-of-type(n+2):last-child {
              margin-right: 0;
           }
           .grid-layout .message-item:nth-of-type(n+2) .message-text,
           .grid-layout .message-item:nth-of-type(n+2) .message-link {
                display: inline;
                white-space: normal;
                word-break: break-word;
           }
            .grid-layout .message-item:nth-of-type(n+2) .message-image {
                display: inline;
                vertical-align: middle;
           }

          .grid-layout .timestamp-text.absolute {
             position: absolute;
             bottom: -2px;
             right: 0;
          }

          .message-text {
            margin: 0; padding: 0; color: inherit;
          }
          .message-link {
            color: #64b5f6; text-decoration: none;
          }
          .message-link:hover { text-decoration: underline; }

          .message-image {
            height: 3rem; width: 3rem; object-fit: contain; margin: 0 2px;
          }

          .username-text { font-weight: bold; color: #ffffff; }
          .chat-message-text { color: #e0e0e0; }
          .event-action-text { color: #b0b0b0; font-size: 0.95em; }
          .event-item-name { color: #e0e0e0; font-weight: 500; }
          .event-quantity-text { font-weight: bold; color: #b0b0b0; font-size: 1.95em; }
          .system-message-text { font-style: italic; color: #a0a0a0; font-size: 0.9em; }
          .timestamp-text { font-size: 0.8em; color: #999; pointer-events: none; line-height: 1; }


          .badges-container {
             align-items: center;
             gap: 3px;
             vertical-align: middle;
             height: 18px;
          }
          .badge {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 1px 4px; border-radius: 3px; font-size: 0.8em;
            font-weight: bold; color: white; height: 16px; line-height: 1;
          }
          .badge-level { background-color: #1E88E5; }
          .badge-team { background-color: #E53935; }
          .badge-subscriber { background-color: transparent; padding: 0; height: 18px; }
          .badge-subscriber img { height: 100%; width: auto; display: block; }
          .badge-unknown { background-color: #757575; }
          .badge-icon { margin-right: 2px; display: inline-block; }


          .menu-button {
            position: absolute; right: 4px; top: 4px; cursor: pointer;
            padding: 3px; background: none; border: none; font-size: 16px;
            color: #aaa; transition: color 0.2s; line-height: 1; z-index: 1;
          }
          .menu-button:hover { color: #fff; }

          :host(.highlighted-message) { background-color: #6A1B9A; color: #ffffff; }
          :host(.highlighted-message) .username-text,
          :host(.highlighted-message) .chat-message-text,
          :host(.highlighted-message) .event-item-name { color: #ffffff; }
          :host(.highlighted-message) .event-action-text,
          :host(.highlighted-message) .event-quantity-text { color: #e0e0e0; }
          :host(.highlighted-message) .timestamp-text { color: #c0c0c0; }
          :host(.highlighted-message) .menu-button { color: #e0e0e0; }
          :host(.highlighted-message) .menu-button:hover { color: #ffffff; }
          :host(.highlighted-message) .badge {}
        `}setupMenu(){this.shadowRoot.querySelector(".menu-button").addEventListener("click",n=>{n.stopPropagation(),this.EventEmit(n)})}getMessageData(){return this._data}getRandomColor(){const t=["#4CAF50","#2196F3","#9C27B0","#F44336","#FF9800"];return t[Math.floor(Math.random()*t.length)]}hide(){this.style.display="none"}remove(){this.parentNode.removeChild(this)}setAutoHide(t){this._autoHideTimeout=t,setTimeout(()=>{this.remove()},t)}}customElements.get("chat-message")||customElements.define("chat-message",W);customElements.get("message-container")||customElements.define("message-container",R);function H(e,{level:t,url:n}){return e===8?{name:"Level",iconSymbol:"⭐"+t,cssClass:"badge-level"}:e===10?{name:"Team Level",iconSymbol:"❤️"+t,cssClass:"badge-team"}:e===6||e===4?{name:e===6?"Top Ranker":"Subscriber",iconSymbol:`<img src='${n}' alt='Top Ranker' style='height: min(24px,100dvh);width: min(24px,100dvw);content-box: fill-box;object-fit: cover;'/>`,cssClass:"badge-subscriber"}:e===1?{name:"Moderator",iconSymbol:"⚔️",cssClass:"badge-subscriber"}:{name:"Unknown Badge",iconSymbol:"❓",cssClass:"badge-unknown"}}function z(e){if(!Array.isArray(e)||e.length===0)return;const t=document.createElement("div");return t.className="badges-container",t.style.display="flex",e.forEach(n=>{const o=H(n.badgeSceneType,n),s=document.createElement("div");s.className=`badge ${o.cssClass}`;const r=document.createElement("span");r.className="badge-icon",r.innerHTML=o.iconSymbol,r.setAttribute("aria-hidden","true"),s.appendChild(r);const g=n.displayType||n.level;s.setAttribute("title",`${o.name} - Level `+g),t.appendChild(s)}),t.outerHTML}const m={userFilter:"userFilter",wordFilter:"wordFilter",whitelist:"whitelist"};d.on("chat",async e=>{E(e)});d.on("gift",async e=>{C(e)});d.on("play_arrow",async e=>{});q.onAny((e,t)=>{const n=A.kickLiveEvents.reduce((o,s)=>(o[s]=s,o),{});e===n.ChatMessage?(console.log("KickEmitter.onAny ChatMessage",t),P(t)):console.log("KickEmitter.onAny else",e,t)});const j=document.getElementById("chatcontainer");j.addEventListener("message-menu",e=>{console.log("event chatcontainer",e.detail);const t=e.detail,o=[{play_arrow:c("play_arrow","play_arrow","play_arrow",()=>{d.emit("play_arrow",t)})}.play_arrow,c("block-comment","block comment","block",()=>{b(m.wordFilter,t.user)}),c("block-user","block User","block",()=>{b(m.userFilter,t.user)}),c("whitelist","add whitelist","favorite",()=>{b(m.whitelist,t.user)})];x(v(o)),console.log("messageData.element",t.element),y(t.element?.originalTarget||t.element?.target)});const K=document.getElementById("giftcontainer");K.addEventListener("message-menu",e=>{console.log("event giftcontainer",e.detail);const t=e.detail,o=[{play_arrow:c("play_arrow","play_arrow","play_arrow",()=>{})}.play_arrow];x(v(o)),y(t.element?.originalTarget||t.element?.target)});const J=document.getElementById("eventscontainer");J.addEventListener("message-menu",e=>{console.log("event eventscontainer",e.detail);const t=e.detail,o=[{play_arrow:c("play_arrow","play_arrow","play_arrow",()=>{})}.play_arrow];x(v(o)),y(t.element?.originalTarget||t.element?.target)});async function b(e,t){const n={userFilter:document.querySelector("user-filter"),wordFilter:document.querySelector("word-filter"),whitelist:document.querySelector("whitelist-filter")};if(!e||!t)return;const o=n[e];if(!(!o||!("addItemProgrammatically"in o)))switch(console.log("filterItem",o),e){case m.userFilter:case m.whitelist:console.log(e,t),o.addItemProgrammatically(t.name);break;case m.wordFilter:console.log(e,t),o.addItemProgrammatically(t.data.comment);break}}document.addEventListener("DOMContentLoaded",()=>{$()});

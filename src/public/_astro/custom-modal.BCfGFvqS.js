import{i as c,r as p}from"./lit-element.CdPzzhzS.js";import{x as l}from"./lit-html.Cs9YtZST.js";import{o as h}from"./unsafe-html.o8VIWoCg.js";import{t as b}from"./custom-element.BhZVzxrc.js";import{n as u,r as g}from"./state.k4TxN2nw.js";var v=Object.defineProperty,f=Object.getOwnPropertyDescriptor,a=(e,t,o,r)=>{for(var i=r>1?void 0:r?f(t,o):t,s=e.length-1,d;s>=0;s--)(d=e[s])&&(i=(r?d(t,o,i):d(i))||i);return r&&i&&v(t,o,i),i};class m extends p{static get properties(){return{title:{type:String,reflect:!0},description:{type:String,reflect:!0},theme:{type:String,reflect:!0},options:{type:Array}}}constructor(){super(),this.title="",this.description="",this.theme="light",this.options=[]}static get styles(){return c`
      :host {
        --dlg-padding: 1.5rem;
        --dlg-border-radius: 8px;
        --dlg-font-family: system-ui, -apple-system, sans-serif;
        --dlg-title-size: 1.5rem;
        --dlg-title-weight: 600;
        --dlg-desc-size: 1rem;
        --dlg-desc-opacity: 0.8;
        --dlg-desc-max-height: 500px;
        --dlg-button-padding: 0.5rem 1rem;
        --dlg-button-radius: 4px;
        --dlg-button-font-size: 0.875rem;
        --dlg-options-gap: 0.5rem;
        --dlg-slot-margin-top: 1rem;
        --transition-speed: 0.2s;

        --dlg-text-color: #1a1a1a;
        --dlg-border-color: #e5e5e5;
        --dlg-bg-color: #ffffff;
        --dlg-button-cancel-bg: #e5e5e5;
        --dlg-button-cancel-text: #1a1a1a;
        --dlg-button-cancel-hover-bg: #d9d9d9;

        --dlg-dark-text-color: #ffffff;
        --dlg-dark-border-color: #333333;
        --dlg-dark-bg-color: #2a2a2a;
        --dlg-dark-button-cancel-bg: #444444;
        --dlg-dark-button-cancel-text: #ffffff;
        --dlg-dark-button-cancel-hover-bg: #555555;

        --dlg-button-save-bg: #007bff;
        --dlg-button-save-text: white;
        --dlg-button-save-hover-bg: #0056b3;
        --dlg-button-delete-bg: #dc3545;
        --dlg-button-delete-text: white;
        --dlg-button-delete-hover-bg: #bd2130;

        display: block;
        font-family: var(--dlg-font-family);
      }

      .container {
        padding: var(--dlg-padding);
        border-radius: var(--dlg-border-radius);
        transition: background-color var(--transition-speed) ease, border-color var(--transition-speed) ease, color var(--transition-speed) ease;
        border: 1px solid var(--dlg-border-color);
        background-color: var(--dlg-bg-color);
        color: var(--dlg-text-color);
      }

      .container.dark {
        border-color: var(--dlg-dark-border-color);
        background-color: var(--dlg-dark-bg-color);
        color: var(--dlg-dark-text-color);
      }

      .title {
        font-size: var(--dlg-title-size);
        font-weight: var(--dlg-title-weight);
        margin: 0 0 0.5rem 0;
      }

      .description {
        font-size: var(--dlg-desc-size);
        opacity: var(--dlg-desc-opacity);
        max-height: var(--dlg-desc-max-height);
        overflow-y: auto;
        margin: 0 0 1rem 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .options {
        display: flex;
        gap: var(--dlg-options-gap);
        flex-wrap: wrap;
        margin-top: var(--dlg-padding);
        justify-content: flex-end;
      }

      ::slotted(*) {
        display: block;
        margin-top: var(--dlg-slot-margin-top);
        margin-bottom: var(--dlg-slot-margin-top);
      }

      button {
        padding: var(--dlg-button-padding);
        border-radius: var(--dlg-button-radius);
        border: none;
        cursor: pointer;
        font-size: var(--dlg-button-font-size);
        font-family: inherit;
        transition: background-color var(--transition-speed) ease, opacity var(--transition-speed) ease;
        background-color: transparent;
        color: inherit;
        border: 1px solid transparent;
      }

      button:hover {
         opacity: 0.85;
      }

      .save-btn {
        background-color: var(--dlg-button-save-bg);
        color: var(--dlg-button-save-text);
        border-color: var(--dlg-button-save-bg);
      }
      .save-btn:hover {
        background-color: var(--dlg-button-save-hover-bg);
        border-color: var(--dlg-button-save-hover-bg);
        opacity: 1;
      }

      .cancel-btn {
        background-color: var(--dlg-button-cancel-bg);
        color: var(--dlg-button-cancel-text);
        border-color: var(--dlg-button-cancel-bg);
      }
      .cancel-btn:hover {
        background-color: var(--dlg-button-cancel-hover-bg);
        border-color: var(--dlg-button-cancel-hover-bg);
        opacity: 1;
      }
      .container.dark .cancel-btn {
        background-color: var(--dlg-dark-button-cancel-bg);
        color: var(--dlg-dark-button-cancel-text);
        border-color: var(--dlg-dark-button-cancel-bg);
      }
      .container.dark .cancel-btn:hover {
        background-color: var(--dlg-dark-button-cancel-hover-bg);
        border-color: var(--dlg-dark-button-cancel-hover-bg);
      }

      .delete-btn {
        background-color: var(--dlg-button-delete-bg);
        color: var(--dlg-button-delete-text);
        border-color: var(--dlg-button-delete-bg);
      }
      .delete-btn:hover {
        background-color: var(--dlg-button-delete-hover-bg);
        border-color: var(--dlg-button-delete-hover-bg);
        opacity: 1;
      }
    `}render(){return l`
      <div class="container ${this.theme}">
        <h2 class="title">${this.title}</h2>
        <pre class="description">${this.description}</pre>
        <slot></slot>
        <div class="options">
          ${this.options.map((t,o)=>l`<button 
              @click=${r=>this._handleOptionClick(r,o)}
              data-index="${o}"
              class="${t.class||""}"
              style="${t.style||""}"
            >${t.label}</button>`)}
        </div>
      </div>
    `}_handleOptionClick(t,o){this.options[o]?.callback&&typeof this.options[o].callback=="function"?this.options[o].callback(t):console.warn(`No valid callback found for option index ${o}`)}}class k extends p{static get properties(){return{visible:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0}}}constructor(){super(),this.visible=!1,this.required=!1}static get styles(){return c`
      :host {
        --overlay-bg: rgba(0, 0, 0, 0.5);
        --dlg-z-index: 1000;
        --transition-duration: 0.3s;
        --content-max-height: 90dvh;
        --content-border-radius: 16px;
        --content-padding: 8px;
        --content-bg: inherit;
        --content-color: inherit;

        display: block;
        background: inherit;
        color: inherit;
      }

      .dialog {
        position: fixed;
        inset: 0;
        background-color: var(--overlay-bg);

        display: flex;
        align-items: center;
        justify-content: center;

        z-index: var(--dlg-z-index);

        opacity: 0;
        visibility: hidden;

        transition: opacity var(--transition-duration) ease,
                    visibility var(--transition-duration) ease;
      }

      .dialog.visible {
        opacity: 1;
        visibility: visible;
      }
    `}render(){return l`
      <div class="dialog ${this.visible?"visible":""}" @click="${this._handleOverlayClick}">
          <slot></slot>
      </div>
    `}_handleOverlayClick(t){t.target===t.currentTarget&&!this.required&&(this.hide(),this.emitClose())}emitClose(){this.dispatchEvent(new CustomEvent("close"))}show(){this.visible=!0}hide(){this.visible=!1}}let n=class extends p{constructor(){super(),this._options=[],this.isVisible=!1,this.posX=0,this.posY=0,this.lastFocusedElement=null,this.handleClickOutsideBound=this.handleClickOutside.bind(this)}get options(){return this._options}set options(e){this._options=[...e],this.requestUpdate()}addOption(e,t){const o=r=>{t(r),this.hide()};return this._options.push({html:e,callback:o}),this.requestUpdate(),this._options.length-1}setOptions(e){this._options=e.map(t=>({html:t.html,callback:o=>{t.callback(o),this.hide()}})),this.requestUpdate()}clearOptions(){this._options=[],this.requestUpdate()}removeOption(e){return e>=0&&e<this._options.length?(this._options.splice(e,1),this.requestUpdate(),!0):!1}show({x:e,y:t}){this.isVisible=!0,e!==void 0&&t!==void 0&&this.moveTo(e,t),this.requestUpdate(),setTimeout(()=>{document.addEventListener("click",this.handleClickOutsideBound)},0)}hide(){this.isVisible=!1,this.requestUpdate(),document.removeEventListener("click",this.handleClickOutsideBound)}moveTo(e,t){const o=this.shadowRoot?.querySelector(".container");if(!o)return;const r=o.getBoundingClientRect(),i=window.innerWidth,s=window.innerHeight;e+r.width>i&&(e=i-r.width-10),t+r.height>s&&(t=s-r.height-10),this.posX=Math.max(0,e),this.posY=Math.max(0,t),this.requestUpdate()}showAtElement(e){const t=e.getBoundingClientRect(),o={x:t.left,y:t.bottom};this.show(o),this.lastFocusedElement=e}handleClickOutside(e){const t=e.composedPath(),o=this.shadowRoot?.querySelector(".container");o&&!t.includes(o)&&(!this.lastFocusedElement||!t.includes(this.lastFocusedElement))&&this.hide()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleClickOutsideBound)}updated(e){super.updated(e);const t=this.shadowRoot?.querySelector(".container");t&&(t.style.display=this.isVisible?"flex":"none",t.style.left=`${this.posX}px`,t.style.top=`${this.posY}px`)}render(){return l`
        <div class="container">
          ${this._options.map(e=>l`
            <div class="popup-option" @click=${e.callback}>
              ${h(e.html)}
            </div>
          `)}
        </div>
      `}};n.styles=c`
    :host {
      display: inline-block;
      color-scheme: light dark;
      font-family: inherit;
    }
    
    .container {
      position: fixed;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      background-color: inherit;
      display: none;
      z-index: 1000;
      justify-content: center;
      flex-direction: column;
      min-width: inherit;
      width: 100%;
      max-width: min(300px, 100%);
      overflow: hidden;
      * {
        padding: 0;
        margin: 0;
        border-radius: 4px;
      }
    }
  
    .popup-option {
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      user-select: none;
      filter: contrast(200%) brightness(150%);
    }
    
    .popup-option:hover { 
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .default-font {
      font-family: sans-serif, Arial, Helvetica;
      font-size: 1.2rem;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-radius: 4px;
    }
    

    
    @media (prefers-color-scheme: dark) {
      .popup-option:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  `;a([u({type:Array})],n.prototype,"_options",2);a([g()],n.prototype,"isVisible",2);a([g()],n.prototype,"posX",2);a([g()],n.prototype,"posY",2);n=a([b("custom-popup")],n);customElements.define("dialog-content",m);customElements.define("dialog-container",k);

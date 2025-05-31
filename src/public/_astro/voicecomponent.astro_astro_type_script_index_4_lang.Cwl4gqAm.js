class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this._options=[],this.container=document.createElement("div"),this.lastFocusedElement=null,this.container.style.cssText=`
            position: fixed;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            background-color: inherit;
            display: none;
            z-index: 1000;
            color-scheme: light dark;
            font-family: inherit;
            justify-content: center;
            align-items: stretch;
            flex-direction: column;
            min-width: inherit;
            width: 100%;
            max-width: 200px;
            border-radius: 4px;
            overflow: hidden;
        `;const o=document.createElement("style");o.textContent=`
            .material-symbols-rounded {
                font-family: inherit;
                font-size: 24px;
                margin-right: 10px;
            }
            .popup-option {
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                user-select: none;
            }
            .popup-option:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
            .default-font {
                font-family: Arial, sans-serif;
            }
            @media (prefers-color-scheme: dark) {
                .popup-option:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }
                /* fallback */
            @font-face {
                font-family: 'Material Symbols Outlined';
                font-style: normal;
                font-weight: 400;
                src: url(/material_icon_font.woff2) format('woff2');
              }
              .material-symbols-outlined {
                font-family: 'Material Symbols Outlined';
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -moz-font-feature-settings: 'liga';
                -moz-osx-font-smoothing: grayscale;
              }
              .material-symbols-rounded {
                font-family: 'Material Symbols Outlined';
                font-size: 1.5rem;
              }
  
        `,this.shadowRoot.appendChild(o),this.shadowRoot.appendChild(this.container),this.handleClickOutside=this.handleClickOutside.bind(this)}get options(){return this._options}set options(o){this._options=o,this.render()}addOption(o,t){return this._options.push({html:o,callback:e=>{t(e),this.hide()}}),this.render(),this._options.length-1}setOptions(o){this._options=o.map(t=>({html:t.html,callback:e=>{t.callback(e),this.hide()}})),this.render()}clearOptions(){this._options=[],this.render()}removeOption(o){return o>=0&&o<this._options.length?(this._options.splice(o,1),this.render(),!0):!1}render(){this.container.innerHTML="",this._options.forEach((o,t)=>{const e=document.createElement("div");e.className="popup-option",e.innerHTML=o.html,e.addEventListener("click",o.callback),this.container.appendChild(e)})}connectedCallback(){this.render()}handleClickOutside(o){const t=o.composedPath();!t.includes(this.container)&&!t.includes(this.lastFocusedElement)&&this.hide()}show(o,t){this.container.style.display="flex",o!==void 0&&t!==void 0&&this.moveTo(o,t),document.addEventListener("click",this.handleClickOutside)}hide(){this.container.style.display="none",document.removeEventListener("click",this.handleClickOutside)}moveTo(o,t){const e=this.container.getBoundingClientRect(),n=window.innerWidth,r=window.innerHeight;o+e.width>n&&(o=n-e.width-10),t+e.height>r&&(t=r-e.height-10),this.container.style.left=`${Math.max(0,o)}px`,this.container.style.top=`${Math.max(0,t)}px`}showAtElement(o){const t=o.getBoundingClientRect();this.show(t.left,t.bottom),this.lastFocusedElement=o}disconnectedCallback(){document.removeEventListener("click",this.handleClickOutside)}}customElements.get("custom-popup")||customElements.define("custom-popup",x);function y(i){try{if(Array.isArray(i)||typeof i=="object"&&i!==null)return i;if(typeof i=="string"&&(i.trim().startsWith("{")||i.trim().startsWith("[")))try{return JSON.parse(i)}catch{const t=i.replace(/([{,]\s*)(\w+)\s*:/g,'$1"$2":').replace(/:\s*'([^']+)'/g,': "$1"');return JSON.parse(t)}return i}catch(o){return console.error("Error al parsear JSON:",o,"Valor recibido:",i),i}}class w extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this._t=this.getAttribute("title")||"",this._d=this.getAttribute("description")||"",this._o=[],this._th=this.getAttribute("theme")||"light",this._init()}static get observedAttributes(){return["title","description","theme"]}attributeChangedCallback(o,t,e){if(t!==e){const n=this.shadowRoot;switch(o){case"title":this._t=e,(n.querySelector(".title")??{}).textContent=this._t;break;case"description":this._d=e,(n.querySelector(".description")??{}).textContent=this._d;break;case"theme":this._th=e||"light";const r=n.querySelector(".container");r&&(r.classList.remove("light","dark"),r.classList.add(this._th));break}}}get options(){return this._o}set options(o){this._o=Array.isArray(o)?o:[],this._updOpts()}_css(){return`
      :host {
        /* Define variables for easier customization */
        --dlg-padding: 1.5rem;
        --dlg-border-radius: 8px;
        --dlg-font-family: system-ui, -apple-system, sans-serif;
        --dlg-title-size: 1.5rem;
        --dlg-title-weight: 600;
        --dlg-desc-size: 1rem;
        --dlg-desc-opacity: 0.8;
        --dlg-desc-max-height: 500px; /* Max height before scroll */
        --dlg-button-padding: 0.5rem 1rem;
        --dlg-button-radius: 4px;
        --dlg-button-font-size: 0.875rem;
        --dlg-options-gap: 0.5rem;
        --dlg-slot-margin-top: 1rem;
        --dlg-transition-speed: 0.2s;

        /* Light Theme Colors (Defaults) */
        --dlg-text-color: #1a1a1a;
        --dlg-border-color: #e5e5e5;
        --dlg-bg-color: #ffffff; /* Added background for completeness */
        --dlg-button-cancel-bg: #e5e5e5;
        --dlg-button-cancel-text: #1a1a1a;
        --dlg-button-cancel-hover-bg: #d9d9d9; /* Corrected hover */

        /* Dark Theme Colors (Applied via .dark class) */
        --dlg-dark-text-color: #ffffff;
        --dlg-dark-border-color: #333333;
        --dlg-dark-bg-color: #2a2a2a; /* Example dark bg */
        --dlg-dark-button-cancel-bg: #444444;
        --dlg-dark-button-cancel-text: #ffffff;
        --dlg-dark-button-cancel-hover-bg: #555555;

        /* Shared Button Colors */
        --dlg-button-save-bg: #007bff;
        --dlg-button-save-text: white;
        --dlg-button-save-hover-bg: #0056b3;
        --dlg-button-delete-bg: #dc3545;
        --dlg-button-delete-text: white;
        --dlg-button-delete-hover-bg: #bd2130;

        /* Host styles */
        display: block;
        font-family: var(--dlg-font-family);
      }

      /* Container holds all content */
      .container {
        padding: var(--dlg-padding);
        border-radius: var(--dlg-border-radius);
        transition: background-color var(--dlg-transition-speed) ease, border-color var(--dlg-transition-speed) ease, color var(--dlg-transition-speed) ease;
        border: 1px solid var(--dlg-border-color);
        background-color: var(--dlg-bg-color);
        color: var(--dlg-text-color);
      }

      /* Dark theme overrides */
      .container.dark {
        border-color: var(--dlg-dark-border-color);
        background-color: var(--dlg-dark-bg-color);
        color: var(--dlg-dark-text-color);
      }

      /* --- Elements --- */
      .title {
        font-size: var(--dlg-title-size);
        font-weight: var(--dlg-title-weight);
        margin: 0 0 0.5rem 0; /* Added some bottom margin */
      }

      .description {
        font-size: var(--dlg-desc-size);
        opacity: var(--dlg-desc-opacity);
        max-height: var(--dlg-desc-max-height);
        overflow-y: auto;
        margin: 0 0 1rem 0; /* Added some bottom margin */
        white-space: pre-wrap; /* Allow wrapping within <pre> */
        word-wrap: break-word; /* Break long words */
      }

      /* Container for dynamically added buttons */
      .options {
        display: flex;
        gap: var(--dlg-options-gap);
        flex-wrap: wrap;
        margin-top: var(--dlg-padding); /* Add space above buttons */
        justify-content: flex-end; /* Align buttons to the right by default */
      }

      /* Default slot for additional content */
      slot {
        display: block;
        margin-top: var(--dlg-slot-margin-top);
        margin-bottom: var(--dlg-slot-margin-top); /* Added bottom margin */
      }

      /* --- Buttons --- */
      button {
        padding: var(--dlg-button-padding);
        border-radius: var(--dlg-button-radius);
        border: none;
        cursor: pointer;
        font-size: var(--dlg-button-font-size);
        font-family: inherit; /* Inherit font from host */
        transition: background-color var(--dlg-transition-speed) ease, opacity var(--dlg-transition-speed) ease;
        background-color: transparent; /* Default button is transparent */
        color: inherit; /* Inherit text color */
        border: 1px solid transparent; /* Add border for consistent sizing */
      }

      button:hover {
         opacity: 0.85; /* Slight fade effect on hover for generic buttons */
      }

      /* Specific button styles */
      .save-btn {
        background-color: var(--dlg-button-save-bg);
        color: var(--dlg-button-save-text);
        border-color: var(--dlg-button-save-bg);
      }
      .save-btn:hover {
        background-color: var(--dlg-button-save-hover-bg);
        border-color: var(--dlg-button-save-hover-bg);
        opacity: 1; /* Override generic hover */
      }

      .cancel-btn {
        background-color: var(--dlg-button-cancel-bg);
        color: var(--dlg-button-cancel-text);
        border-color: var(--dlg-button-cancel-bg);
      }
      .cancel-btn:hover {
        background-color: var(--dlg-button-cancel-hover-bg); /* Corrected hover */
        border-color: var(--dlg-button-cancel-hover-bg);
        opacity: 1;
      }
      /* Dark theme overrides for cancel button */
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
    `}_init(){const o=document.createElement("style");o.textContent=this._css();const t=document.createElement("div");t.className=`container ${this._th}`;const e=document.createElement("h2");e.className="title",e.textContent=this._t;const n=document.createElement("pre");n.className="description",n.textContent=this._d;const r=document.createElement("div");r.className="options";const s=document.createElement("slot");t.append(e,n,s,r),this.shadowRoot.append(o,t),this._updOpts()}_updOpts(){const o=this.shadowRoot.querySelector(".options");if(!o){console.warn("Options container not found in c-dlg shadowRoot.");return}o.innerHTML="",this._o.forEach((t,e)=>{if(!t||typeof t.label>"u"){console.warn(`Invalid option at index ${e}:`,t);return}const n=document.createElement("button");n.textContent=t.label,t.style&&(n.style.cssText=t.style),t.class&&t.class.split(" ").forEach(r=>{r&&n.classList.add(r)}),n.dataset.index=e,n.addEventListener("click",r=>{this._o[e]?.callback&&typeof this._o[e].callback=="function"?this._o[e].callback(r):console.warn(`No valid callback found for option index ${e}`)}),o.appendChild(n)})}}customElements.get("c-dlg")||customElements.define("c-dlg",w);class _ extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this._vis=this.hasAttribute("visible"),this._render()}static get observedAttributes(){return["visible","required"]}attributeChangedCallback(o,t,e){if(t!==e&&o==="visible"){const n=e!==null;this._vis!==n&&(this._vis=n,this._updVis())}}show(){this.hasAttribute("visible")||this.setAttribute("visible","")}hide(){this.hasAttribute("visible")&&this.removeAttribute("visible")}_css(){return`
      :host {
        /* --- Customizable Variables --- */
        --dlg-overlay-bg: rgba(0, 0, 0, 0.5); /* Overlay background color */
        --dlg-z-index: 1000;                  /* Stack order */
        --dlg-transition-duration: 0.3s;       /* Animation speed */
        --dlg-content-max-height: 90dvh;     /* Max height relative to viewport */
        --dlg-content-border-radius: 16px;   /* Dialog box corner rounding */
        --dlg-content-padding: 8px;         /* Padding around the slotted content */
        /* Note: Background and color for .dlg-cnt can be set here or use 'inherit' */
        /* Using inherit allows styling via the <dlg-cont> element itself */
        --dlg-content-bg: inherit;
        --dlg-content-color: inherit;

        /* --- Host Element --- */
        /* The host itself is usually just a block container */
        display: block;
        /* The following inherit properties allow styling the *content* background/color */
        /* by applying styles to the <dlg-cont> element externally. */
        background: inherit; /* Inherits from parent in normal DOM */
        color: inherit;      /* Inherits from parent in normal DOM */
        /* border-radius/padding on host are less useful if .dlg-cnt defines its own */
      }

      /* --- Overlay --- */
      .dlg-ov {
        position: fixed;
        inset: 0; /* Modern equivalent of top/left/width/height = 0/0/100%/100% */
        background-color: var(--dlg-overlay-bg);

        /* Centering */
        display: flex;
        align-items: center;
        justify-content: center;

        z-index: var(--dlg-z-index);

        /* Initial state (hidden) */
        opacity: 0;
        visibility: hidden;

        /* Transition for appearance */
        transition: opacity var(--dlg-transition-duration) ease,
                    visibility var(--dlg-transition-duration) ease;
      }

      /* --- Content Wrapper --- */
      .dlg-cnt {
        /* Intrinsic sizing and scrolling */
        max-height: var(--dlg-content-max-height);
        overflow-y: auto;

        /* Appearance - Inherits from host by default via variables */
        background: var(--dlg-content-bg);
        color: var(--dlg-content-color);
        border-radius: var(--dlg-content-border-radius);
        padding: var(--dlg-content-padding); /* Padding inside the dialog box */
        /* margin: 1rem; /* Optional margin around the dialog */

        /* Initial state for transform */
        transform: scale(0.95);
        /* Transition for pop-in effect */
        transition: transform var(--dlg-transition-duration) ease;

        /* Prevent content from inheriting overlay transitions */
        transition-property: transform;
      }

      /* --- Visible State --- */
      .dlg-ov.visible {
        opacity: 1;
        visibility: visible;
      }

      .dlg-ov.visible .dlg-cnt {
        transform: scale(1); /* Animate to full size */
      }

      /* Removed unused .header styles */
    `}_updVis(){const o=this.shadowRoot?.querySelector(".dlg-ov");if(o&&(o.classList.toggle("visible",this._vis),this._vis)){const t=o.querySelector(".dlg-cnt");t&&typeof t.focus=="function"&&this.shadowRoot.activeElement}}_render(){const o=document.createElement("style");o.textContent=this._css();const t=document.createElement("div");t.className=`dlg-ov ${this._vis?"visible":""}`;const e=document.createElement("div");e.className="dlg-cnt";const n=document.createElement("slot");e.appendChild(n),t.appendChild(e),this.shadowRoot.append(o,t),t.addEventListener("click",r=>{r.target===t&&!this.hasAttribute("required")&&this.hide()})}}customElements.get("dlg-cont")||customElements.define("dlg-cont",_);if(!customElements.get("c-inp")){class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this._hndlInpChg=this._hndlInpChg.bind(this)}static get observedAttributes(){return["type","id","name","value","placeholder","disabled","readonly","darkmode","options","required","title","pattern"]}_css(){const t=this.hasAttribute("darkmode");return`
        :host { display: block; margin: inherit; color-scheme: light dark; margin: 0.5rem; padding: 0.5rem; }
        .inp-cont { display: flex; flex-direction: column; padding: inherit; }
        input, textarea, select { padding: inherit; padding: 0.5rem; border: inherit; border-color: ${t?"#555":"#ccc"}; border-radius: 4px; font-size: 14px; background-color: inherit; color: inherit; }
        textarea { resize: vertical; min-height: 100px; }
        input:disabled, textarea:disabled, select:disabled { background-color: ${t?"#222":"#f5f5f5"}; cursor: not-allowed; color: ${t?"#666":"#888"}; }
        .sw { position: relative; display: inline-block; width: 60px; height: 30px; }
        .sw input { opacity: 0; width: 0; height: 0; }
        .sldr { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${t?"#555":"#ccc"}; transition: .4s; border-radius: 34px; }
        .sldr:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background-color: ${t?"#888":"white"}; transition: .4s; border-radius: 50%; }
        input:checked + .sldr { background-color: #2196F3; }
        input:checked + .sldr:before { transform: translateX(28px); }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #2196F3; box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2); }
        .val-form.invalid input, .val-form.invalid textarea, .val-form.invalid select { border-color: red; box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2); }
      `}connectedCallback(){this._rndr(),this._attachListeners()}disconnectedCallback(){this._removeListeners()}_attachListeners(){const t=this.getAttribute("type"),e=this.shadowRoot;if(t==="radio")e.querySelectorAll('input[type="radio"]').forEach(s=>s.addEventListener("change",this._hndlInpChg));else{const r=e.querySelector("input, textarea, select");r&&(r.addEventListener("input",this._hndlInpChg),r.addEventListener("change",this._hndlInpChg))}const n=e.querySelector(".val-form");n&&n.addEventListener("submit",r=>{r.preventDefault();const s=this.getVal();this.isValid()&&this._hndlSub(r,s)})}_removeListeners(){const t=this.getAttribute("type"),e=this.shadowRoot;if(t==="radio")e.querySelectorAll('input[type="radio"]').forEach(r=>r.removeEventListener("change",this._hndlInpChg));else{const n=e.querySelector("input, textarea, select");n&&(n.removeEventListener("input",this._hndlInpChg),n.removeEventListener("change",this._hndlInpChg))}}_hndlInpChg(t){const e=this.getVal();this.dispatchEvent(new CustomEvent("change",{detail:{id:this.getAttribute("id"),name:this.getAttribute("name"),value:e},bubbles:!0,composed:!0})),this.isValid()}attributeChangedCallback(t,e,n){e!==n&&(this._rndr(),this._removeListeners(),this._attachListeners())}_hndlSub(t,e=null){this.dispatchEvent(new CustomEvent("form-submit",{detail:{id:this.getAttribute("id"),name:this.getAttribute("name"),value:e},bubbles:!0,composed:!0}))}_rndr(){const t=this.getAttribute("type")||"text",e=this.getAttribute("id"),n=this.getAttribute("name"),r=this.getAttribute("value")||"",s=this.getAttribute("placeholder")||"",h=this.hasAttribute("disabled"),u=this.hasAttribute("readonly"),g=this.getAttribute("options")||"[]",l=this.hasAttribute("required"),m=this.getAttribute("title")||"",d=this.getAttribute("pattern")||"",p={t,i:e,n,v:r,p:s,dis:h,ro:u,opts:g,req:l,tit:m,pat:d};this.shadowRoot.innerHTML=`
        <style>${this._css()}</style>
        <form class="val-form" novalidate>
          <div class="inp-cont">
            ${this._rndrInp(p)}
          </div>
          <button type="submit" style="display: none;"></button>
        </form>
      `}_rndrInp(t){const{t:e,i:n,n:r,v:s,p:h,dis:u,ro:g,opts:l,req:m,tit:d,pat:p}=t,f=m?"required":"",v=d?`title="${d}" oninvalid="this.setCustomValidity('${d}')" oninput="this.setCustomValidity('')"`:"",k=p?`pattern="${p}"`:"",c=`id="${n}" name="${r}" ${u?"disabled":""} ${g?"readonly":""} ${f} ${v} ${k}`;switch(e){case"textarea":return`<textarea ${c} placeholder="${h}">${s}</textarea>`;case"checkbox":case"switch":case"boolean":return`<label class="sw"><input type="checkbox" ${c} ${s==="true"?"checked":""}><span class="sldr"></span></label>`;case"select":try{const b=y(l);return`
                    <select ${c}>
                        ${b.map(a=>`<option value="${a.value}" ${a.value===s?"selected":""}>${a.label}</option>`).join("")}
                    </select>`}catch{return console.error("Invalid JSON for options:",l),`<select ${c}></select>`}case"radio":try{return y(l).map(a=>`
                    <label>
                        <input type="radio" id="${n}_${a.value}" name="${r}" value="${a.value}" ${a.value===s?"checked":""} ${u?"disabled":""} ${g?"readonly":""} ${f} ${v}>
                        ${a.label}
                    </label>`).join("")}catch{return console.error("Invalid JSON for options:",l),""}default:return`<input type="${e==="string"?"text":e}" ${c} value="${s}" placeholder="${h}">`}}getVal(){const t=this.shadowRoot;if(this.getAttribute("type")==="radio"){const n=t.querySelector(`input[name="${this.getAttribute("name")}"]:checked`);return n?n.value:null}const e=t.querySelector("input:not([type=radio]), textarea, select");return e?e.type==="checkbox"?e.checked:this._parseVal(e):null}isValid(){const t=this.shadowRoot.querySelector(".val-form");if(!t)return!0;const e=t.checkValidity();return t.classList.toggle("invalid",!e),e}_parseVal(t){const e=t.value;switch(t.type){case"number":return e===""?null:Number(e);default:return e}}setVal(t){const e=this.shadowRoot;if(this.getAttribute("type")==="radio"){const r=e.querySelector(`input[name="${this.getAttribute("name")}"][value="${t}"]`);r&&(r.checked=!0),this._hndlInpChg();return}const n=e.querySelector("input:not([type=radio]), textarea, select");n&&(n.type==="checkbox"?n.checked=!!t:n.value=t??"",this._hndlInpChg())}reset(){const t=this.shadowRoot;if(this.getAttribute("type")==="radio"){t.querySelectorAll('input[type="radio"]').forEach(r=>r.checked=!1),this._hndlInpChg();return}const e=t.querySelector("input:not([type=radio]), textarea, select");e&&(e.type==="checkbox"?e.checked=!1:e.value="",this._hndlInpChg())}setOpts(t){["select","radio"].includes(this.getAttribute("type"))&&this.setAttribute("options",JSON.stringify(t))}getSelOpt(){if(this.getAttribute("type")==="select"){const t=this.shadowRoot.querySelector("select");return t?t.value:null}return null}}customElements.define("c-inp",i)}

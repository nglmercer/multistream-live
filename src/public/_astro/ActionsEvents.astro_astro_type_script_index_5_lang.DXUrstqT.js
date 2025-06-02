import{r as h,i as u}from"./lit-element.CdPzzhzS.js";import{x as s}from"./lit-html.Cs9YtZST.js";import{a as b,o}from"./map.CC3vsOt5.js";import{e as f}from"./class-map.D2HkPoOL.js";import"./directive.CGE4aKEl.js";function m(a){const t=[],e=[];for(const[r,i]of Object.entries(a))if(customElements.get(r))e.push(r);else try{customElements.define(r,i),t.push(r)}catch(n){console.error(`❌ Error registering ${r}:`,n)}return console.log(`✅ Registered ${t.length} components:`,t),e.length>0&&console.log(`⚠️ Skipped ${e.length} already registered:`,e),{registered:t,skipped:e}}function y(a){try{if(Array.isArray(a)||typeof a=="object"&&a!==null)return a;if(typeof a=="string"&&(a.trim().startsWith("{")||a.trim().startsWith("[")))try{return JSON.parse(a)}catch{const e=a.replace(/([{,]\s*)(\w+)\s*:/g,'$1"$2":').replace(/:\s*'([^']+)'/g,': "$1"');return JSON.parse(e)}return a}catch(t){return console.error("Error al parsear JSON:",t,"Valor recibido:",a),a}}class v extends h{static get properties(){return{title:{type:String,reflect:!0},description:{type:String,reflect:!0},theme:{type:String,reflect:!0},options:{type:Array}}}constructor(){super(),this.title="",this.description="",this.theme="light",this.options=[]}static get styles(){return u`
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
        --dlg-transition-speed: 0.2s;

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
        transition: background-color var(--dlg-transition-speed) ease, border-color var(--dlg-transition-speed) ease, color var(--dlg-transition-speed) ease;
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
        transition: background-color var(--dlg-transition-speed) ease, opacity var(--dlg-transition-speed) ease;
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
    `}render(){return s`
      <div class="container ${this.theme}">
        <h2 class="title">${this.title}</h2>
        <pre class="description">${this.description}</pre>
        <slot></slot>
        <div class="options">
          ${this.options.map((t,e)=>s`<button 
              @click=${r=>this._handleOptionClick(r,e)}
              data-index="${e}"
              class="${t.class||""}"
              style="${t.style||""}"
            >${t.label}</button>`)}
        </div>
      </div>
    `}_handleOptionClick(t,e){this.options[e]?.callback&&typeof this.options[e].callback=="function"?this.options[e].callback(t):console.warn(`No valid callback found for option index ${e}`)}}class k extends h{static get properties(){return{visible:{type:Boolean,reflect:!0},required:{type:Boolean,reflect:!0}}}constructor(){super(),this.visible=!1,this.required=!1}static get styles(){return u`
      :host {
        --dlg-overlay-bg: rgba(0, 0, 0, 0.5);
        --dlg-z-index: 1000;
        --dlg-transition-duration: 0.3s;
        --dlg-content-max-height: 90dvh;
        --dlg-content-border-radius: 16px;
        --dlg-content-padding: 8px;
        --dlg-content-bg: inherit;
        --dlg-content-color: inherit;

        display: block;
        background: inherit;
        color: inherit;
      }

      .dlg-ov {
        position: fixed;
        inset: 0;
        background-color: var(--dlg-overlay-bg);

        display: flex;
        align-items: center;
        justify-content: center;

        z-index: var(--dlg-z-index);

        opacity: 0;
        visibility: hidden;

        transition: opacity var(--dlg-transition-duration) ease,
                    visibility var(--dlg-transition-duration) ease;
      }

      .dlg-cnt {
        max-height: var(--dlg-content-max-height);
        overflow-y: auto;

        background: var(--dlg-content-bg);
        color: var(--dlg-content-color);
        border-radius: var(--dlg-content-border-radius);
        padding: var(--dlg-content-padding);

        transform: scale(0.95);
        transition: transform var(--dlg-transition-duration) ease;
        transition-property: transform;
      }

      .dlg-ov.visible {
        opacity: 1;
        visibility: visible;
      }

      .dlg-ov.visible .dlg-cnt {
        transform: scale(1);
      }
    `}render(){return s`
      <div class="dlg-ov ${this.visible?"visible":""}" @click="${this._handleOverlayClick}">
        <div class="dlg-cnt">
          <slot></slot>
        </div>
      </div>
    `}_handleOverlayClick(t){t.target===t.currentTarget&&!this.required&&(console.log("Overlay click event:",t.target===t.currentTarget,this.required),this.hide(),this.emitClose())}emitClose(){this.dispatchEvent(new CustomEvent("close"))}show(){this.visible=!0}hide(){this.visible=!1}}class x extends h{static get properties(){return{type:{type:String,reflect:!0},id:{type:String,reflect:!0},name:{type:String,reflect:!0},value:{type:String},placeholder:{type:String,reflect:!0},disabled:{type:Boolean,reflect:!0},readonly:{type:Boolean,reflect:!0},darkmode:{type:Boolean,reflect:!0},options:{type:Array},required:{type:Boolean,reflect:!0},title:{type:String,reflect:!0},pattern:{type:String,reflect:!0},_isValid:{type:Boolean,state:!0},_internalValue:{state:!0},multiple:{type:Boolean,reflect:!0}}}constructor(){super(),this.type="text",this.disabled=!1,this.readonly=!1,this.darkmode=!1,this.options=[],this.required=!1,this._isValid=!0,this.value="",this._internalValue=""}attributeChangedCallback(t,e,r){if(super.attributeChangedCallback(t,e,r),t==="options"&&r!==e&&typeof r=="string")try{this.options=y(r)}catch(i){console.error(`Error parsing options attribute for c-inp [${this.id||this.name}]:`,i),this.options=[]}t==="value"&&r!==e&&(this._internalValue=this._parseValueForInternal(r))}willUpdate(t){if(t.has("value")&&(this._internalValue=this._parseValueForInternal(this.value)),t.has("multiple")){const e=t.get("multiple");this.multiple&&!e&&!Array.isArray(this._internalValue)?this._internalValue=this._internalValue!==null&&this._internalValue!==void 0&&this._internalValue!==""?[String(this._internalValue)]:[]:!this.multiple&&e&&Array.isArray(this._internalValue)&&(this._internalValue=this._internalValue.length>0?this._internalValue[0]:"")}}_parseValueForInternal(t){if(this.multiple&&this.type==="select"){if(Array.isArray(t))return t.map(String);if(typeof t=="string")try{const e=JSON.parse(t);return Array.isArray(e)?e.map(String):[]}catch{return t?[String(t)]:[]}return[]}return this.type==="checkbox"||this.type==="switch"||this.type==="boolean"?String(t).toLowerCase()==="true":this.type==="number"?t===""||t===null||t===void 0?null:Number(t):t??""}static get styles(){return u`
      :host {
        display: block;
        margin: 0.5rem;
        padding: 0.5rem;
        color-scheme: light dark;
        /* Define variables default aquí para que se puedan sobreescribir */
        --inp-border-color: #ccc;
        --inp-disabled-bg: #f5f5f5;
        --inp-disabled-color: #888;
        --inp-slider-bg: #ccc;
        --inp-slider-knob: white;
      }
      :host([darkmode]) {
         /* Sobreescribe variables para dark mode */
        --inp-border-color: #555;
        --inp-disabled-bg: #222;
        --inp-disabled-color: #666;
        --inp-slider-bg: #555;
        --inp-slider-knob: #888;
      }

      /* Elimina el padding del host para que el contenedor interno lo controle */
      :host { padding: 0; }
      .inp-cont {
        display: flex;
        flex-direction: column;
        padding: 0.5rem; /* Mueve el padding aquí */
      }
       label { /* Estilo para mejor alineación de radios/checkboxes */
           display: inline-flex;
           align-items: center;
           margin-right: 10px;
           cursor: pointer;
       }

      input, textarea, select {
        padding: 0.5rem;
        border: 1px solid var(--inp-border-color); /* Usa la variable */
        border-radius: 4px;
        font-size: 14px;
        background-color: inherit;
        color: inherit;
        box-sizing: border-box; /* Importante para consistencia de tamaño */
        margin: 0; /* Resetea márgenes por defecto */
      }
      option {
        color: slategray;
        background-color: #fff;
        text-indent: 0;
      }
      textarea { resize: vertical; min-height: 80px; } /* Ajustado min-height */

      input:disabled, textarea:disabled, select:disabled {
        background-color: var(--inp-disabled-bg); /* Usa la variable */
        cursor: not-allowed;
        color: var(--inp-disabled-color); /* Usa la variable */
        border: 1px solid var(--inp-disabled-color); /* Usa la variable */
      }
      input:read-only, textarea:read-only  {
        background-color: var(--inp-disabled-bg); /* Usa la variable */
        cursor: not-allowed;
        color: var(--inp-disabled-color); /* Usa la variable */
      }

      .sw { position: relative; display: inline-block; width: 60px; height: 30px; }
      .sw input { opacity: 0; width: 0; height: 0; }
      .sldr { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--inp-slider-bg); transition: .4s; border-radius: 34px; }
      .sldr:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background-color: var(--inp-slider-knob); transition: .4s; border-radius: 50%; }
      input:checked + .sldr { background-color: #2196F3; }
      input:checked + .sldr:before { transform: translateX(28px); }
      input:focus + .sldr {
        border: 1px solid rgb(255, 255, 255); /* Añade un borde al knob cuando el input está enfocado */
      }
      input:not(:read-only):focus,
      textarea:not(:read-only):focus,
      select:focus {
        outline: none;
        border-color: #2196F3;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
        cursor: auto; /* Reestablece el cursor */
      }
      input:focus,
      textarea:focus,
      select:focus {
        outline: none; /* Elimina el contorno predeterminado del navegador */
      }
      select option:checked {
        background-color: rgb(0, 171, 255);
        color: white;             /* Might work in SOME browsers/OS, often ignored */
        font-weight: bold;        /* Often ignored */
      }
      /* Aplica estilo inválido directamente al host o a un contenedor */
      :host([invalid]) .input-element {
         border-color: red !important; /* Usa !important con cuidado, o aumenta especificidad */
         box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2) !important;
      }
      /* Opcional: estilo para el host inválido */
       :host([invalid]) {
          /* Puedes añadir un borde al propio host si quieres */
          /* outline: 1px solid red; */
       }
    `}render(){return this.toggleAttribute("invalid",!this._isValid),s`
      <form class="val-form" @submit="${this._handleSubmit}" novalidate>
        <div class="inp-cont">
          ${this._renderInput()}
        </div>
        <!-- Botón submit oculto si quieres habilitar submit con Enter -->
         <button type="submit" style="display: none;"></button>
      </form>
    `}_renderInput(){const t="input-element";switch(this.type){case"textarea":return s`<textarea
          class=${t}
          id=${o(this.id)}
          name=${o(this.name)}
          .value=${this._internalValue??""}
          placeholder=${o(this.placeholder)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          title=${o(this.title)}
          pattern=${o(this.pattern)}
          @input=${this._handleInputChange}
          @change=${this._handleInputChange}
        ></textarea>`;case"checkbox":case"switch":case"boolean":return s`
          <label class="sw">
            <input
              class=${t}
              type="checkbox"
              id=${o(this.id)}
              name=${o(this.name)}
              .checked=${!!this._internalValue}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              title=${o(this.title)}
              @change=${this._handleInputChange}
            >
            <span class="sldr"></span>
          </label>`;case"select":return s`
      <select
        class=${t}
        id=${o(this.id)}
        name=${o(this.name)}
        .value=${this.multiple?void 0:this._internalValue??""}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        title=${o(this.title)}
        @change=${this._handleInputChange}
        ?multiple=${this.multiple}
      >
        ${this.options.map(e=>{const r=this.multiple?Array.isArray(this._internalValue)&&this._internalValue.includes(String(e.value)):String(e.value)==String(this._internalValue??"");return s`
            <option
              value=${e.value}
              ?selected=${r}
            >${e.label}</option>
          `})}
      </select>`;case"radio":return s`
          ${this.options.map(e=>s`
            <label>
              <input type="radio"
                id=${`${this.id||this.name}_${e.value}`}
                name=${o(this.name)}
                value=${e.value}
                .checked=${e.value==this._internalValue}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                title=${o(this.title)}
                @change=${this._handleInputChange}
              >
              ${e.label}
            </label>
          `)}
        `;default:return s`
          <input
            class=${t}
            type=${this.type==="string"?"text":this.type}
            id=${o(this.id)}
            name=${o(this.name)}
            .value=${this._internalValue??""}
            placeholder=${o(this.placeholder)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            title=${o(this.title)}
            pattern=${o(this.pattern)}
            @input=${this._handleInputChange}
            @change=${this._handleInputChange}
          >`}}_handleInputChange(t){const e=t.target;let r;if(this.type==="select"&&this.multiple)r=Array.from(e.selectedOptions).map(i=>i.value);else if(this.type==="radio"){const i=this.shadowRoot.querySelector(`input[name="${this.name}"]:checked`);r=i?i.value:null}else e.type==="checkbox"?r=e.checked:r=e.value;this._internalValue=this._parseValueForInternal(r),this.value=r==null?"":String(r),this.dispatchEvent(new CustomEvent("change",{detail:{id:this.id,name:this.name,value:this._internalValue},bubbles:!0,composed:!0})),this.isValid()}_handleSubmit(t){t.preventDefault(),this.isValid()?this.dispatchEvent(new CustomEvent("form-submit",{detail:{id:this.id,name:this.name,value:this.getVal()},bubbles:!0,composed:!0})):this._getInternalInputElement()?.reportValidity()}_getInternalInputElement(){return this.type==="radio"?null:this.shadowRoot.querySelector(".input-element")}getVal(){return this._internalValue}isValid(){let t=!0;const e=this._getInternalInputElement();return e?t=e.checkValidity():this.type==="radio"&&this.required&&(t=this.shadowRoot.querySelector(`input[name="${this.name}"]:checked`)!==null),this._isValid=t,t}setVal(t){this._internalValue=this._parseValueForInternal(t),this.value=t==null?"":String(t),this.requestUpdate(),setTimeout(()=>this.isValid(),0)}reset(){let t="";this.type==="checkbox"||this.type==="switch"||this.type==="boolean"?t=!1:this.type==="radio"&&(this.shadowRoot.querySelectorAll(`input[name="${this.name}"]`).forEach(r=>r.checked=!1),t=null),this.setVal(t)}setOpts(t){["select","radio"].includes(this.type)&&(this.options=Array.isArray(t)?t:[])}getSelOpt(){if(this.type==="select"){const t=this._getInternalInputElement();return t?t.value:null}return null}}class $ extends h{static styles=u`
      /* Tus estilos existentes */
      :host {
          display: block; font-family: sans-serif; padding: 15px;
          border: 1px solid #eee; border-radius: 8px;
          background-color: #f9f9f9; margin-bottom: 15px;
      }
      .ef-cont { display: flex; flex-direction: column; gap: 15px; }
      .flds-cont {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;
      }
      .fld-wrp { display: flex; flex-direction: column; gap: 4px; }
      label { font-weight: 500; font-size: 0.9em; color: #333; text-transform: capitalize; }
      c-inp { margin: 0; padding: 0; }
      .fld-wrp.inv label { color: #dc3545; }
      .acts { display: flex; justify-content: flex-end; gap: 10px; }
      button {
          padding: 8px 16px; cursor: pointer; border: 1px solid #ccc;
          border-radius: 4px; font-size: 0.95em; transition: all 0.2s;
          background-color: #fff;
      }
      button:hover { filter: brightness(0.95); }
      .sv-btn { background-color: #28a745; color: white; border-color: #28a745; }
      .sv-btn:hover { background-color: #218838; border-color: #1e7e34; }
      .cncl-btn { background-color: #6c757d; color: white; border-color: #6c757d; }
      .cncl-btn:hover { background-color: #5a6268; border-color: #545b62; }
      :host([darkmode]) { background-color: #333; border-color: #555; }
      :host([darkmode]) label { color: #eee; }
      :host([darkmode]) .flds-cont { border-bottom-color: #555; }
      :host([darkmode]) button { background-color: #555; border-color: #777; color: #eee; }
      :host([darkmode]) button:hover { filter: brightness(1.1); }
      :host([darkmode]) c-inp { color-scheme: dark; }

      /* NUEVO: Estilo para ocultar el wrapper del campo */
      .fld-wrp.hidden { display: none; }
  `;static properties={itm:{type:Object},fCfg:{type:Object},cActs:{type:Array},darkmode:{type:Boolean,reflect:!0},_iItm:{state:!0},_cItm:{state:!0}};constructor(){super(),this.itm={},this._iItm={},this._cItm={},this.fCfg={},this.cActs=[],this.darkmode=!1}willUpdate(t){if(t.has("itm")){const e=this._deepCopy(this.itm);JSON.stringify(e)!==JSON.stringify(this._cItm)&&(this._cItm=e,this._iItm=this._deepCopy(e))}}_deepCopy(t){try{return JSON.parse(JSON.stringify(t||{}))}catch(e){return console.error("Err deep copy",e),{}}}setConfig(t={},e={}){this.itm=this._deepCopy(t),this.fCfg=e||{},this.requestUpdate()}setItem(t={}){this.itm=this._deepCopy(t),this.requestUpdate()}addAct(t,e,r=""){!t||typeof t!="string"||typeof e!="string"||(this.cActs=[...this.cActs.filter(i=>i.nm!==t),{nm:t,lbl:e,cls:r}])}validate(){let t=!0;return this.shadowRoot.querySelectorAll("c-inp").forEach(e=>{const r=e.closest(".fld-wrp");if(r?.classList.contains("hidden")){r?.classList.remove("inv");return}let i=!0;typeof e.isValid=="function"&&(i=e.isValid()),r?.classList.toggle("inv",!i),i||(t=!1)}),t}getData(){return this._deepCopy(this._cItm)}reset(){this._cItm=this._deepCopy(this._iItm),this.requestUpdate(),this.shadowRoot.querySelectorAll(".fld-wrp.inv").forEach(t=>t.classList.remove("inv")),this.shadowRoot.querySelectorAll("c-inp").forEach(t=>{typeof t.isValid=="function"&&t.isValid()})}_hInpChg(t){if(t.target.tagName!=="C-INP")return;let e,r;t.detail?.name!==void 0?{name:e,value:r}=t.detail:(e=t.target.name,e&&typeof t.target.getVal=="function"&&(r=t.target.getVal())),e!==void 0&&(this._cItm[e]!==r&&(this._cItm={...this._cItm,[e]:r},this.dispatchEvent(new CustomEvent("fld-chg",{detail:{n:e,v:r}}))),t.target.closest(".fld-wrp")?.classList.remove("inv")),console.log("Input:",e,"Value:",r)}_hSub(t){t.preventDefault(),this._hSave()}_hActClk(t){const e=t.target.closest("button[data-act]");if(!e)return;const r=e.dataset.act;r==="save"||(r==="cancel"?(this.dispatchEvent(new CustomEvent("cancel-edit")),this.reset()):this.dispatchEvent(new CustomEvent(r,{detail:this.getData()})))}_hSave(){if(this.validate()){const t=this.getData();this._iItm=this._deepCopy(t),this.dispatchEvent(new CustomEvent("save-item",{detail:t}))}else{const t=this.shadowRoot.querySelector(".fld-wrp:not(.hidden).inv c-inp");if(t)try{typeof t.focus=="function"?t.focus():t.shadowRoot?.querySelector("input, select, textarea")?.focus()}catch(e){console.warn("Cant focus inv fld",e)}}}_compareValues(t,e){return typeof e=="boolean"?!(["false","0","",null,void 0].includes(String(t).toLowerCase())||!t)===e:t==null?e==null||e==="":String(t)===String(e)}_shouldFieldBeVisible(t,e){const r=e.showIf;if(!r||!r.field)return!0;const i=r.field,n=this._cItm?.[i],l=r.value,d=r.negate===!0;let c;return Array.isArray(l)?c=l.some(g=>this._compareValues(n,g)):c=this._compareValues(n,l),d?!c:c}render(){return s`
          <form class="ef-cont" @submit=${this._hSub} novalidate>
              <div class="flds-cont">
                  ${b(Object.entries(this.fCfg||{}),([t,e])=>{if(e.hidden)return"";const r=this._shouldFieldBeVisible(t,e),i={"fld-wrp":!0,hidden:!r},n=`ef-${t}-${Date.now()}`,l=this._cItm?.[t],d=e.required&&r;return s`
                          <div class=${f(i)}> 
                              <label for=${n}>${e.label||t}</label>
                              <c-inp
                                  id=${n}
                                  name=${t}
                                  type=${e.type||"text"}
                                  .value=${l} 
                                  placeholder=${o(e.placeholder)}
                                  ?required=${d} 
                                  ?disabled=${e.disabled}
                                  ?readonly=${e.readonly}
                                  pattern=${o(e.pattern)}
                                  title=${o(e.title)}
                                  min=${o(e.min)}
                                  max=${o(e.max)}
                                  step=${o(e.step)}
                                  rows=${o(e.rows)}
                                  cols=${o(e.cols)}
                                  ?multiple=${e.multiple}
                                  .options=${(e.type==="select"||e.type==="radio")&&Array.isArray(e.options)?e.options:void 0}
                                  ?darkmode=${this.darkmode}
                                  @change=${this._hInpChg}
                              ></c-inp>
                          </div>
                      `})}
              </div>
              <div class="acts" @click=${this._hActClk}>
                  <button type="button" class="cncl-btn" data-act="cancel">Cancel</button>
                  <button type="submit" class="sv-btn" data-act="save">Save</button>
                  ${b(this.cActs||[],t=>s`
                      <button type="button" data-act=${t.nm} class=${o(t.cls)}>${t.lbl}</button>
                  `)}
              </div>
          </form>
      `}}class _ extends h{static styles=u`
      /* Estilos (sin cambios) */
      :host { display: block; font-family: sans-serif; margin-bottom: 15px; }
      .dyn-cont { position: relative; }
      .d-card {
          background-color: #fff; border: 1px solid #eee; border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); overflow: hidden;
          display: flex; flex-direction: column; transition: box-shadow 0.2s;
      }
      :host([darkmode]) .d-card { background-color: #333; border-color: #555; color: #eee; }
      .d-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
      :host([darkmode]) .d-card:hover { box-shadow: 0 2px 8px rgba(255,255,255,0.1); }
      .d-hdr {
          background-color: #f5f5f5; padding: 12px 16px; font-weight: bold;
          border-bottom: 1px solid #eee; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
      }
      :host([darkmode]) .d-hdr { background-color: #444; border-bottom-color: #555; }
      .d-cont {
          padding: 16px; flex-grow: 1; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px 15px;
      }
      .d-prop { margin-bottom: 8px; display: flex; flex-direction: column; gap: 2px; }
      .d-prop-lbl {
          font-weight: 500; color: #666; font-size: 0.8em;
          text-transform: capitalize; margin-bottom: 2px;
      }
      :host([darkmode]) .d-prop-lbl { color: #bbb; }
      .d-prop-val { word-break: break-word; font-size: 0.95em; }
      .d-prop-val[data-type="boolean"], .d-prop-val[data-type="switch"], .d-prop-val[data-type="checkbox"] {
          font-style: italic; color: #333;
      }
      :host([darkmode]) .d-prop-val[data-type="boolean"], :host([darkmode]) .d-prop-val[data-type="switch"], :host([darkmode]) .d-prop-val[data-type="checkbox"] {
           color: #ddd;
      }
      .d-acts {
          padding: 10px 16px; display: flex; justify-content: flex-end;
          gap: 8px; background-color: #fafafa; border-top: 1px solid #eee;
      }
      :host([darkmode]) .d-acts { background-color: #3a3a3a; border-top-color: #555; }
      .d-acts button {
          padding: 6px 12px; cursor: pointer; border: 1px solid #ccc;
          border-radius: 4px; font-size: 0.9em; transition: all 0.2s;
          background-color: #fff;
      }
      .d-acts button:hover { filter: brightness(0.95); }
      :host([darkmode]) .d-acts button { background-color: #555; border-color: #777; color: #eee; }
      :host([darkmode]) .d-acts button:hover { filter: brightness(1.1); }
      .ed-btn { background-color: #CCE5FF; border-color: #b8daff; color: #004085; }
      .del-btn { background-color: #F8D7DA; color: #721c24; border-color: #f5c6cb; }
      :host([darkmode]) .ed-btn { background-color: #0056b3; border-color: #0056b3; color: white; }
      :host([darkmode]) .del-btn { background-color: #b81c2c; border-color: #b81c2c; color: white; }
      obj-edit-frm { display: block; }
  `;static properties={mode:{type:String},itm:{type:Object},fCfg:{type:Object},hdrKey:{type:String,attribute:"hdr-key",reflect:!0},cActs:{type:Array},darkmode:{type:Boolean,reflect:!0}};constructor(){super(),this.mode="display",this.itm={},this.fCfg={},this.cActs=[{nm:"delete",lbl:"Eliminar",cls:"del-btn"}],this.darkmode=!1}_deepCopy(t){try{return JSON.parse(JSON.stringify(t||{}))}catch(e){return console.error("Err deep copy",e),{}}}setConfig(t={},e={}){this.itm=this._deepCopy(t),this.fCfg=e||{},this.mode="display"}setItem(t={}){this.itm=this._deepCopy(t),this.mode==="edit"&&this.requestUpdate()}addAct(t,e,r=""){!t||typeof t!="string"||typeof e!="string"||(this.cActs=[...this.cActs.filter(i=>i.nm!==t),{nm:t,lbl:e,cls:r}])}hideAct(t){this.hiddenAct(t)}hiddenAct(t){!t||typeof t!="string"||(this.cActs=this.cActs.filter(e=>e.nm!==t))}_formatVal(t,e){const r=e.type||"text";if(r==="boolean"||r==="switch"||r==="checkbox")return t?e.trueLabel||"Yes":e.falseLabel||"No";if(r==="select"&&Array.isArray(e.options)){const i=e.options.find(n=>String(n.value)===String(t));return i?i.label:t??""}return t==null?"":String(t)}_hDispActClk(t){const e=t.target.closest("button[data-act]");if(!e)return;const r=e.dataset.act,i=this._deepCopy(this.itm);r==="edit"?this.mode="edit":r==="delete"?this.dispatchEvent(new CustomEvent("del-item",{detail:i})):this.dispatchEvent(new CustomEvent(r,{detail:i}))}_hSave(t){this.itm=this._deepCopy(t.detail),this.dispatchEvent(new CustomEvent("item-upd",{detail:this._deepCopy(this.itm)})),this.mode="display"}_hCancel(){this.mode="display"}_compareValues(t,e){return typeof e=="boolean"?!(["false","0","",null,void 0].includes(String(t).toLowerCase())||!t)===e:t==null?e==null||e==="":String(t)===String(e)}_shouldFieldBeVisible(t,e,r){const i=e.showIf;if(!i||!i.field)return!0;const n=i.field,l=r?.[n],d=i.value,c=i.negate===!0;let p;return Array.isArray(d)?p=d.some(g=>this._compareValues(l,g)):p=this._compareValues(l,d),c?!p:p}_renderDisp(){const t=this.hdrKey&&this.itm[this.hdrKey]!==void 0?this.itm[this.hdrKey]:null;return s`
        <div class="d-card">
            ${t!==null?s`<div class="d-hdr">${t}</div>`:""}
            <div class="d-cont">
                ${b(Object.entries(this.fCfg||{}),([e,r])=>{const i=this._shouldFieldBeVisible(e,r,this.itm);return r.hidden||e===this.hdrKey||!i?"":s`
                        <div class="d-prop">
                            <div class="d-prop-lbl">${r.label||e}</div>
                            <div class="d-prop-val" data-type=${r.type||"text"}>${this._formatVal(this.itm[e],r)}</div>
                        </div>
                    `})}
            </div>
            <div class="d-acts" @click=${this._hDispActClk}>
                 <button type="button" class="ed-btn" data-act="edit">Edit</button>
                 ${b(this.cActs||[],e=>s`
                    <button type="button" data-act=${e.nm} class=${o(e.cls)}>${e.lbl}</button>
                 `)}
            </div>
        </div>
    `}_renderEdit(){return s`
          <obj-edit-frm
              .fCfg=${this.fCfg}
              .itm=${this.itm}
              .cActs=${[]}
              ?darkmode=${this.darkmode}
              @save-item=${this._hSave}
              @cancel-edit=${this._hCancel}
          ></obj-edit-frm>
      `}render(){return!this.itm||!this.fCfg||Object.keys(this.fCfg).length===0?s`<p>No item/config.</p>`:s`
          <div class="dyn-cont">
              ${this.mode==="display"?this._renderDisp():this._renderEdit()}
          </div>
      `}}const w={"dyn-obj-disp":_,"obj-edit-frm":$,"c-dlg":v,"dlg-cont":k,"c-inp":x};m(w);

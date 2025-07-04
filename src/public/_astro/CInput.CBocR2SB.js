import{r as b,i as y,n as o}from"./property.DTDKM9eR.js";import{E as $,x as d}from"./lit-html.Cs9YtZST.js";import{r as p}from"./state.5GRZVynF.js";/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=n=>n??$;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function*f(n,e){if(n!==void 0){let r=0;for(const t of n)yield e(t,r++)}}function v(n){if(n==null||typeof n!="string")return n;const e=n.trim();if(!(e.startsWith("{")||e.startsWith("[")))return n;try{return JSON.parse(e)}catch{try{let r=e.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,'$1"$2":');return r=r.replace(/:\s*'([^']*)'/g,': "$1"'),r=r.replace(/,\s*([}\]])/g,"$1"),JSON.parse(r)}catch(r){return console.error("Error al parsear JSON después de intentar corregir:",r,"Valor original:",n),n}}}class V{render(e){const r=e.value==="string"?"text":e.type;return d`
            <input
                class="input-element"
                type=${r}
                id=${i(e.id)}
                name=${i(e.name)}
                .value=${e.internalValue===null||e.internalValue===void 0?"":String(e.internalValue)}
                placeholder=${i(e.placeholder)}
                ?disabled=${e.disabled}
                ?readonly=${e.readonly}
                ?required=${e.required}
                minlength=${i(e.min)}
                maxlength=${i(e.max)}
                step=${i(e.step)}
                title=${i(e.title)}
                pattern=${i(e.pattern)}
                @change=${e.handleInputChange}
                @input=${t=>this.handleInput?.(t,e)}
            >
        `}parseValue(e){return e==null?"":String(e)}handleChange(e,r){return e.target.value}handleInput(e,r){const t=e.target;t.pattern&&t.validity.patternMismatch}isValid(e){const r=e.shadowRoot?.querySelector(".input-element");return r?r.checkValidity():!0}reset(){return""}}class _{render(e){return d`
            <input
                class="input-element"
                type="number"
                id=${i(e.id)}
                name=${i(e.name)}
                .value=${e.internalValue===null||e.internalValue===void 0?"":String(e.internalValue)}
                placeholder=${i(e.placeholder)}
                ?disabled=${e.disabled}
                ?readonly=${e.readonly}
                ?required=${e.required}
                min=${i(e.min)}
                max=${i(e.max)}
                step=${i(e.step)}
                title=${i(e.title)}
                pattern=${i(e.pattern)}
                @change=${e.handleInputChange}
            >
        `}parseValue(e){if(e===""||e===null||e===void 0)return null;const r=Number(e);return isNaN(r)?null:r}handleChange(e,r){const t=e.target;if(t.value==="")return null;const a=t.valueAsNumber;return isNaN(a)?null:a}isValid(e){const r=e.shadowRoot?.querySelector(".input-element");return r?r.checkValidity():!0}reset(){return null}}class S{render(e){return d`
            <textarea
                class="input-element"
                id=${i(e.id)}
                name=${i(e.name)}
                .value=${e.internalValue===null||e.internalValue===void 0?"":String(e.internalValue)}
                placeholder=${i(e.placeholder)}
                ?disabled=${e.disabled}
                ?readonly=${e.readonly}
                ?required=${e.required}
                minlength=${i(e.min)}
                maxlength=${i(e.max)}
                title=${i(e.title)}
                pattern=${i(e.pattern)}
                @change=${e.handleInputChange}
            ></textarea>
        `}parseValue(e){return e==null?"":String(e)}handleChange(e,r){return e.target.value}isValid(e){const r=e.shadowRoot?.querySelector(".input-element");return r?r.checkValidity():!0}reset(){return""}}class E{render(e){const r=e.type==="switch";return d`
            <label class=${r?"sw":"cb-label"}>
                <input
                    class="input-element"
                    type="checkbox"
                    id=${i(e.id)}
                    name=${i(e.name)}
                    .checked=${!!e.internalValue}
                    ?disabled=${e.disabled}
                    ?readonly=${e.readonly}
                    ?required=${e.required}
                    title=${i(e.title)}
                    @change=${e.handleInputChange}
                >
                ${r?d`<span class="sldr"></span>`:e.placeholder?d` <span class="label-text">${e.placeholder}</span>`:""}
            </label>
        `}parseValue(e){return typeof e=="boolean"?e:String(e).toLowerCase()==="true"||e==="on"||e==="1"}handleChange(e,r){return e.target.checked}isValid(e){const r=e.shadowRoot?.querySelector(".input-element");return r?e.required&&!r.checked?!1:r.checkValidity():!0}reset(){return!1}}class g{render(e){return d`
            <select
                class="input-element"
                id=${i(e.id)}
                name=${i(e.name)}
                ?disabled=${e.disabled}
                ?readonly=${e.readonly} 
                ?required=${e.required}
                title=${i(e.title)}
                @change=${e.handleInputChange}
                ?multiple=${e.multiple}
            >
                ${e.placeholder&&!e.multiple&&!e.internalValue?d`<option value="" disabled selected hidden>${e.placeholder}</option>`:""}
                
                ${f(e.options,r=>{let t=!1;return e.multiple&&Array.isArray(e.internalValue)?t=e.internalValue.includes(String(r.value)):t=String(r.value)==String(e.internalValue??""),d`
                        <option value=${r.value} ?selected=${t}>
                            ${r.label}
                        </option>
                    `})}
            </select>
        `}parseValue(e,r=!1){if(r){if(console.log("if (multiple) {",r,e),Array.isArray(e))return e.map(String);if(typeof e=="string")try{const t=v(e);return Array.isArray(t)?t.map(String):e?[String(e)]:[]}catch{return e?[String(e)]:[]}return[]}return e==null?"":String(e)}handleChange(e,r){const t=e.target;return r.multiple?Array.from(t.selectedOptions).map(a=>a.value):t.value}isValid(e){const r=e.shadowRoot?.querySelector(".input-element");return r?r.checkValidity():!0}reset(e){return e.multiple?[]:""}getSelectedOption(e){const r=e.shadowRoot?.querySelector(".input-element");if(r&&!e.multiple){const t=r.options[r.selectedIndex];return t?t.text:null}return null}}class k{render(e){return d`
            <div class="radio-group" role="radiogroup" aria-labelledby=${i(e.name&&e.id?`${e.id}-label`:void 0)}>
                ${f(e.options,r=>d`
                    <label class="radio-label">
                        <input
                            class="input-element"
                            type="radio"
                            id=${`${e.id||e.name}_${r.value}`}
                            name=${i(e.name)}
                            value=${r.value}
                            .checked=${String(r.value)==String(e.internalValue??"")}
                            ?disabled=${e.disabled}
                            ?readonly=${e.readonly} 
                            ?required=${e.required}
                            title=${i(e.title)}
                            @change=${e.handleInputChange}
                        >
                        <span class="label-text">${r.label}</span>
                    </label>
                `)}
            </div>
        `}parseValue(e){return e==null?null:String(e)}handleChange(e,r){const t=e.target;return t.checked?t.value:null}isValid(e){return e.required?e.shadowRoot?.querySelector(`input[name="${e.name}"]:checked`)!==null:!0}reset(){return null}}class w{render(e){return d`
            <input
                class="input-element"
                id=${i(e.id)}
                type="file"
                name=${i(e.name)}
                placeholder=${i(e.placeholder)}
                ?disabled=${e.disabled}
                ?readonly=${e.readonly}
                ?required=${e.required}
                title=${i(e.title)}
                accept=${i(e.pattern)}
                ?multiple=${e.multiple}
                @change=${e.handleInputChange}
            >
        `}parseValue(e){return e instanceof File||e instanceof FileList?e:e==null?null:String(e)}handleChange(e,r){const t=e.target;return t.files?r.multiple?t.files.length>0?t.files:null:t.files.length>0?t.files[0]:null:null}isValid(e){const r=e.shadowRoot?.querySelector(".input-element");return r?r.checkValidity():!0}reset(){return null}}class c{static{this.handlers=new Map}static{const e=new V;this.handlers.set("text",e),this.handlers.set("string",e),this.handlers.set("email",e),this.handlers.set("password",e),this.handlers.set("tel",e),this.handlers.set("url",e),this.handlers.set("date",e),this.handlers.set("time",e),this.handlers.set("datetime-local",e),this.handlers.set("color",e),this.handlers.set("range",e),this.handlers.set("number",new _),this.handlers.set("textarea",new S);const r=new E;this.handlers.set("checkbox",r),this.handlers.set("switch",r),this.handlers.set("boolean",r),this.handlers.set("select",new g),this.handlers.set("radio",new k);const t=new w;this.handlers.set("file",t),this.handlers.set("File",t)}static getHandler(e){const r=this.handlers.get(e.toLowerCase());return r||(console.warn(`Handler for input type '${e}' not found, using text handler.`),this.handlers.get("text"))}static registerHandler(e,r){this.handlers.set(e.toLowerCase(),r)}}var I=Object.defineProperty,s=(n,e,r,t)=>{for(var a=void 0,u=n.length-1,h;u>=0;u--)(h=n[u])&&(a=h(e,r,a)||a);return a&&I(e,r,a),a};function m(n){if(n==null||typeof n!="string")return n;const e=n.trim();if(!(e.startsWith("{")||e.startsWith("[")))return n;try{return JSON.parse(e)}catch{try{let r=e.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,'$1"$2":');return r=r.replace(/:\s*'([^']*)'/g,': "$1"'),r=r.replace(/,\s*([}\]])/g,"$1"),JSON.parse(r)}catch(r){return console.error("Error al parsear JSON después de intentar corregir:",r,"Valor original:",n),n}}}class l extends b{constructor(){super(),this.type="text",this.value="",this.disabled=!1,this.readonly=!1,this.darkmode=!1,this.options=[],this.required=!1,this.multiple=!1,this._isValid=!0,this._updateHandler(),this._internalValue=this._parseValueForInternal(this.value)}_updateHandler(){this._currentHandler=c.getHandler(this.type)}attributeChangedCallback(e,r,t){if(super.attributeChangedCallback(e,r,t),e==="type"&&t!==r&&(this._updateHandler(),this._internalValue=this._parseValueForInternal(this.value)),e==="options"&&t!==r&&typeof t=="string")try{const a=m(t);Array.isArray(a)?this.options=a.every(u=>typeof u=="object"&&"value"in u&&"label"in u)?a:[]:(console.warn(`Options attribute for c-input [${this.id||this.name||"unnamed"}] is not a valid array string. Received:`,t),this.options=[])}catch(a){console.error(`Error parsing options attribute for c-input [${this.id||this.name||"unnamed"}]:`,a),this.options=[]}e==="value"&&t!==r&&(this._internalValue=this._parseValueForInternal(t))}willUpdate(e){if(e.has("type")&&(this._updateHandler(),this._internalValue=this._parseValueForInternal(this.value)),e.has("value")){const r=e.get("value");let t;Array.isArray(this._internalValue)?t=JSON.stringify(this._internalValue):this._internalValue instanceof File||this._internalValue instanceof FileList?t=this.value??"":t=this._internalValue===null||this._internalValue===void 0?"":String(this._internalValue),r!==t&&(this._internalValue=this._parseValueForInternal(this.value))}if(e.has("options")&&typeof this.options=="string")try{const r=m(this.options);Array.isArray(r)?this.options=r.every(t=>typeof t=="object"&&"value"in t&&"label"in t)?r:[]:this.options=[]}catch{this.options=[]}if(e.has("multiple")){const r=e.get("multiple");this.multiple!==r&&(this._internalValue=this._parseValueForInternal(this.value))}}_parseValueForInternal(e){return this._currentHandler?this.type==="select"&&this._currentHandler instanceof g?this._currentHandler.parseValue(e,this.multiple):this._currentHandler.parseValue(e):e==null?null:String(e)}_createContext(){return{id:this.id,name:this.name,value:this.value,placeholder:this.placeholder,disabled:this.disabled,readonly:this.readonly,min:this.min,max:this.max,step:this.step,darkmode:this.darkmode,options:this.options,required:this.required,pattern:this.pattern,multiple:this.multiple,title:this.title,internalValue:this._internalValue,shadowRoot:this.shadowRoot,emitEvent:(e,r)=>this.EmitEvent(e,r),handleInputChange:e=>this._handleInputChange(e),parseValueForInternal:e=>this._parseValueForInternal(e),type:this.type}}static{this.styles=y`
        :host {
            display: block;
            margin-block-start: 0.5rem;
            margin-block-end: 0.5rem;
            /* Habilita herencia de color y fondo para que el componente se integre mejor. */
            color: inherit;
            background-color: transparent;

            /* --- VARIABLES DE DISEÑO --- */
            /* Colores base para Light Mode */
            --inp-text-color: #212529; /* Texto más oscuro para mejor contraste */
            --inp-bg-color: #fff;
            --inp-border-color: #ced4da; /* Gris estándar de Bootstrap, muy legible */
            --inp-border-radius: 0.375rem; /* 6px, un poco más suave */
            
            /* Colores de Foco */
            --inp-focus-border-color: #86b7fe; /* Azul de foco de Bootstrap */
            --inp-focus-shadow-color: rgba(13, 110, 253, 0.25);
            
            /* Colores de Estados */
            --inp-disabled-bg: #e9ecef;
            --inp-disabled-color: #6c757d;
            --inp-disabled-border-color: #ced4da;
            --inp-readonly-bg: #e9ecef; /* A menudo se ve igual que disabled */
            --inp-error-border-color: #dc3545; /* Rojo de error de Bootstrap */
            --inp-error-shadow-color: rgba(220, 53, 69, 0.25);

            /* Colores para el Switch */
            --inp-slider-bg: #ced4da;
            --inp-slider-knob: white;
            --inp-slider-active-bg: #0d6efd; /* Azul primario de Bootstrap */

            /* Dimensiones */
            --inp-padding: 0.5em 0.75em;
            --inp-font-size: 1rem;
            
            /* Propiedades heredables */
            font-size: var(--inp-font-size);
            font-family: inherit; /* Permite que la fuente del host se propague */
        }
        
        /* --- DARK MODE --- */
        :host([darkmode]) {
            color-scheme: dark; /* Pista clave para que el navegador use estilos oscuros por defecto */
            --inp-text-color: #dee2e6;
            --inp-bg-color: #212529;
            --inp-border-color: #495057;
            
            --inp-focus-border-color: #4dabf7;
            --inp-focus-shadow-color: rgba(77, 171, 247, 0.3);
            
            --inp-disabled-bg: #343a40;
            --inp-disabled-color: #6c757d;
            --inp-disabled-border-color: #495057;
            --inp-readonly-bg: #343a40;

            --inp-slider-bg: #495057;
            --inp-slider-knob: #adb5bd;
            --inp-slider-active-bg: #3b82f6; /* Un azul vibrante para dark mode */
        }

        /* --- Contenedor General --- */
        .inp-cont {
            display: flex;
            flex-direction: column;
        }
        
        /* --- ESTILOS GENERALES PARA INPUTS, TEXTAREA, SELECT --- */
        input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), 
        textarea, 
        select {
            padding: var(--inp-padding);
            border: 1px solid var(--inp-border-color);
            border-radius: var(--inp-border-radius);
            font-size: inherit;
            font-family: inherit;
            line-height: 1.5;
            background-color: var(--inp-bg-color);
            color: var(--inp-text-color);
            box-sizing: border-box;
            width: 100%;
            margin: 0;
            transition: border-color 0.2s, box-shadow 0.2s;
            /* Para asegurar que el navegador no ponga un fondo raro en iOS */
            -webkit-appearance: none;
            appearance: none;
        }
        
        /* Re-introducir la flecha en los selects, ya que appearance:none la quita */
        select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
            padding-right: 2.5rem; /* Dejar espacio para la flecha */
        }
        :host([darkmode]) select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23dee2e6' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
        }
        
        /* Para select multiple, no queremos la flecha */
        select[multiple] {
            background-image: none;
            padding-right: var(--inp-padding); /* Resetear el padding */
            min-height: 120px; /* Un poco más de altura por defecto */
        }
        
        /* --- ESTILOS PARA LAS OPCIONES DEL SELECT --- */
        option {
            /* En modo normal, dejamos que el navegador decida los colores */
            color: initial;
            background-color: initial;
        }

        :host([darkmode]) option {
            /* En dark mode, SÍ forzamos los colores para evitar el blanco brillante */
            color: var(--inp-text-color);
            background-color: var(--inp-bg-color);
        }
        
        /* ★★★ LA CLAVE: ESTILO PARA LA OPCIÓN SELECCIONADA ★★★ */
        select option:checked {
            /* Usamos el color de foco para resaltar. !important puede ser necesario
            para sobreescribir los estilos ultra-específicos del User-Agent. */
            background-color: var(--inp-focus-border-color) !important;
            color: white !important;
        }
        
        /* --- ESTILOS DE ESTADO (DISABLED, READONLY, FOCUS, INVALID) --- */
        input:disabled, textarea:disabled, select:disabled {
            background-color: var(--inp-disabled-bg);
            color: var(--inp-disabled-color);
            border-color: var(--inp-disabled-border-color);
            cursor: not-allowed;
            /* Para selects con flecha personalizada, la quitamos en disabled */
            background-image: none;
        }

        input[readonly], textarea[readonly], select[readonly] {
            background-color: var(--inp-readonly-bg);
            cursor: default;
        }

        :host([readonly]) select {
            pointer-events: none;
        }

        input:not([disabled]):focus, textarea:not([disabled]):focus, select:not([disabled]):focus {
            outline: 0;
            border-color: var(--inp-focus-border-color);
            box-shadow: 0 0 0 0.25rem var(--inp-focus-shadow-color);
        }

        :host([invalid]) .input-element:not([type="checkbox"]):not([type="radio"]) {
            border-color: var(--inp-error-border-color) !important;
            box-shadow: 0 0 0 0.25rem var(--inp-error-shadow-color) !important;
        }

        /* --- ESTILOS PARA CHECKBOX, RADIO, SWITCH --- */
        .cb-label, .radio-label, .sw-label {
            display: inline-flex;
            align-items: center;
            gap: 0.5em; /* 'gap' es más moderno que margin-right */
            cursor: pointer;
            user-select: none;
        }

        /* Quitar el padding del contenedor para estos tipos */
        :host([type="radio"]) .inp-cont,
        :host([type="checkbox"]) .inp-cont,
        :host([type="switch"]) .inp-cont {
            padding: 0;
        }

        /* Mejorar el foco para accesibilidad */
        input[type="checkbox"]:focus-visible, 
        input[type="radio"]:focus-visible,
        .sw input:focus-visible + .sldr {
            outline: 2px solid var(--inp-focus-border-color);
            outline-offset: 2px;
            box-shadow: 0 0 0 0.25rem var(--inp-focus-shadow-color);
        }
        
        /* Switch Styles */
        .sw { position: relative; display: inline-block; width: 50px; height: 26px; flex-shrink: 0; }
        .sw input { opacity: 0; width: 0; height: 0; }
        .sldr { position: absolute; cursor: pointer; inset: 0; background-color: var(--inp-slider-bg); transition: .3s; border-radius: 26px; }
        .sldr:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: var(--inp-slider-knob); transition: .3s; border-radius: 50%; }
        input:checked + .sldr { background-color: var(--inp-slider-active-bg); }
        input:checked + .sldr:before { transform: translateX(24px); }

        /* Grupo de Radios */
        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 0.75em;
        }
    `}render(){return this.toggleAttribute("invalid",!this._isValid),d`
            <form class="val-form" @submit="${this._handleSubmit}" novalidate>
                <div class="inp-cont">
                    ${this._currentHandler?.render(this._createContext())}
                </div>
                <button type="submit" style="display: none;"></button>
            </form>
        `}EmitEvent(e,r){this.dispatchEvent(new CustomEvent(e,{detail:r,bubbles:!0,composed:!0}))}_handleInputChange(e){if(!this._currentHandler)return;const r=this._createContext(),t=this._currentHandler.handleChange(e,r);this._internalValue=t,t instanceof File?this.value=t.name:t instanceof FileList?this.value=Array.from(t).map(a=>a.name).join(", "):Array.isArray(t)?this.value=JSON.stringify(t):t==null?this.value="":this.value=String(t),this.EmitEvent("change",{id:this.id,name:this.name,value:this._internalValue,nativeEvent:e}),this.isValid()}_handleSubmit(e){if(e.preventDefault(),this.isValid())this.EmitEvent("form-submit",{id:this.id,name:this.name,value:this.getVal()});else{const r=this._getInternalInputElement();r&&this._hasReportValidity(r)&&r.reportValidity()}}_hasReportValidity(e){return"reportValidity"in e&&typeof e.reportValidity=="function"}_getInternalInputElement(){return this.type==="radio"?this.shadowRoot?.querySelector(".radio-group input:first-of-type"):this.shadowRoot?.querySelector(".input-element")}getVal(){return this._internalValue}isValid(){if(!this._currentHandler)return this._isValid=!0,!0;const e=this._createContext(),r=this._currentHandler.isValid(e);return this._isValid=r,r}setVal(e){this._internalValue=this._parseValueForInternal(e),this._internalValue instanceof File?this.value=this._internalValue.name:this._internalValue instanceof FileList?this.value=Array.from(this._internalValue).map(r=>r.name).join(", "):Array.isArray(this._internalValue)?this.value=JSON.stringify(this._internalValue):this._internalValue===null||this._internalValue===void 0?this.value="":this.value=String(this._internalValue),this.updateComplete.then(()=>{this.isValid(),this.EmitEvent("change",{id:this.id,name:this.name,value:this._internalValue,programmatic:!0})})}reset(){if(!this._currentHandler)return;const e=this._createContext(),r=this._currentHandler.reset(e);this.setVal(r)}setOpts(e){["select","radio"].includes(this.type.toLowerCase())?(this.options=Array.isArray(e)?e:[],this.setVal(this._parseValueForInternal(this.value))):console.warn(`setOpts is only applicable to 'select' or 'radio' types. Current type: ${this.type}`)}getSelOptLabel(){return this.type==="select"&&this._currentHandler?.getSelectedOption?this._currentHandler.getSelectedOption(this._createContext()):null}focus(){const e=this._getInternalInputElement();e&&typeof e.focus=="function"&&e.focus()}static registerInputHandler(e,r){c.registerHandler(e,r)}}s([o({type:String,reflect:!0})],l.prototype,"type");s([o({type:String,reflect:!0})],l.prototype,"name");s([o()],l.prototype,"value");s([o({type:String,reflect:!0})],l.prototype,"placeholder");s([o({type:Boolean,reflect:!0})],l.prototype,"disabled");s([o({type:Boolean,reflect:!0})],l.prototype,"readonly");s([o({type:Number,reflect:!0})],l.prototype,"min");s([o({type:Number,reflect:!0})],l.prototype,"max");s([o({type:Number,reflect:!0})],l.prototype,"step");s([o({type:Boolean,reflect:!0})],l.prototype,"darkmode");s([o({type:Array})],l.prototype,"options");s([o({type:Boolean,reflect:!0})],l.prototype,"required");s([o({type:String,reflect:!0})],l.prototype,"pattern");s([o({type:Boolean,reflect:!0})],l.prototype,"multiple");s([p()],l.prototype,"_isValid");s([p()],l.prototype,"_internalValue");s([p()],l.prototype,"_currentHandler");customElements.get("c-input")||customElements.define("c-input",l);export{i as a,f as o};

import{r as b,i as g}from"./lit-element.CdPzzhzS.js";import{x as d}from"./lit-html.Cs9YtZST.js";import{o as i,a as m}from"./map.CC3vsOt5.js";import{n as o,r as p}from"./state.k4TxN2nw.js";function $(n){if(n==null||typeof n!="string")return n;const e=n.trim();if(!(e.startsWith("{")||e.startsWith("[")))return n;try{return JSON.parse(e)}catch{try{let t=e.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,'$1"$2":');return t=t.replace(/:\s*'([^']*)'/g,': "$1"'),t=t.replace(/,\s*([}\]])/g,"$1"),JSON.parse(t)}catch(t){return console.error("Error al parsear JSON después de intentar corregir:",t,"Valor original:",n),n}}}class V{render(e){const t=e.value==="string"?"text":e.type;return d`
            <input
                class="input-element"
                type=${t}
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
                @input=${r=>this.handleInput?.(r,e)}
            >
        `}parseValue(e){return e==null?"":String(e)}handleChange(e,t){return e.target.value}handleInput(e,t){const r=e.target;r.pattern&&r.validity.patternMismatch}isValid(e){const t=e.shadowRoot?.querySelector(".input-element");return t?t.checkValidity():!0}reset(){return""}}class v{render(e){return d`
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
        `}parseValue(e){if(e===""||e===null||e===void 0)return null;const t=Number(e);return isNaN(t)?null:t}handleChange(e,t){const r=e.target;if(r.value==="")return null;const l=r.valueAsNumber;return isNaN(l)?null:l}isValid(e){const t=e.shadowRoot?.querySelector(".input-element");return t?t.checkValidity():!0}reset(){return null}}class _{render(e){return d`
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
        `}parseValue(e){return e==null?"":String(e)}handleChange(e,t){return e.target.value}isValid(e){const t=e.shadowRoot?.querySelector(".input-element");return t?t.checkValidity():!0}reset(){return""}}class S{render(e){const t=e.type==="switch";return d`
            <label class=${t?"sw":"cb-label"}>
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
                ${t?d`<span class="sldr"></span>`:e.placeholder?d` <span class="label-text">${e.placeholder}</span>`:""}
            </label>
        `}parseValue(e){return typeof e=="boolean"?e:String(e).toLowerCase()==="true"||e==="on"||e==="1"}handleChange(e,t){return e.target.checked}isValid(e){const t=e.shadowRoot?.querySelector(".input-element");return t?e.required&&!t.checked?!1:t.checkValidity():!0}reset(){return!1}}class y{render(e){return d`
            <select
                class="input-element"
                id=${i(e.id)}
                name=${i(e.name)}
                .value=${e.multiple?void 0:e.internalValue===null||e.internalValue===void 0?"":String(e.internalValue)}
                ?disabled=${e.disabled}
                ?readonly=${e.readonly} 
                ?required=${e.required}
                title=${i(e.title)}
                @change=${e.handleInputChange}
                ?multiple=${e.multiple}
            >
                ${e.placeholder&&!e.multiple&&!e.internalValue?d`<option value="" disabled selected hidden>${e.placeholder}</option>`:""}
                ${m(e.options,t=>{let r=!1;return e.multiple?r=Array.isArray(e.internalValue)&&e.internalValue.includes(String(t.value)):r=String(t.value)==String(e.internalValue??""),d`
                        <option value=${t.value} ?selected=${r}>
                            ${t.label}
                        </option>
                    `})}
            </select>
        `}parseValue(e,t=!1){if(t){if(Array.isArray(e))return e.map(String);if(typeof e=="string")try{const r=$(e);return Array.isArray(r)?r.map(String):e?[String(e)]:[]}catch{return e?[String(e)]:[]}return[]}return e==null?"":String(e)}handleChange(e,t){const r=e.target;return t.multiple?Array.from(r.selectedOptions).map(l=>l.value):r.value}isValid(e){const t=e.shadowRoot?.querySelector(".input-element");return t?t.checkValidity():!0}reset(e){return e.multiple?[]:""}getSelectedOption(e){const t=e.shadowRoot?.querySelector(".input-element");if(t&&!e.multiple){const r=t.options[t.selectedIndex];return r?r.text:null}return null}}class k{render(e){return d`
            <div class="radio-group" role="radiogroup" aria-labelledby=${i(e.name&&e.id?`${e.id}-label`:void 0)}>
                ${m(e.options,t=>d`
                    <label class="radio-label">
                        <input
                            class="input-element"
                            type="radio"
                            id=${`${e.id||e.name}_${t.value}`}
                            name=${i(e.name)}
                            value=${t.value}
                            .checked=${String(t.value)==String(e.internalValue??"")}
                            ?disabled=${e.disabled}
                            ?readonly=${e.readonly} 
                            ?required=${e.required}
                            title=${i(e.title)}
                            @change=${e.handleInputChange}
                        >
                        <span class="label-text">${t.label}</span>
                    </label>
                `)}
            </div>
        `}parseValue(e){return e==null?null:String(e)}handleChange(e,t){const r=e.target;return r.checked?r.value:null}isValid(e){return e.required?e.shadowRoot?.querySelector(`input[name="${e.name}"]:checked`)!==null:!0}reset(){return null}}class w{render(e){return d`
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
        `}parseValue(e){return e instanceof File||e instanceof FileList?e:e==null?null:String(e)}handleChange(e,t){const r=e.target;return r.files?t.multiple?r.files.length>0?r.files:null:r.files.length>0?r.files[0]:null:null}isValid(e){const t=e.shadowRoot?.querySelector(".input-element");return t?t.checkValidity():!0}reset(){return null}}class c{static{this.handlers=new Map}static{const e=new V;this.handlers.set("text",e),this.handlers.set("string",e),this.handlers.set("email",e),this.handlers.set("password",e),this.handlers.set("tel",e),this.handlers.set("url",e),this.handlers.set("date",e),this.handlers.set("time",e),this.handlers.set("datetime-local",e),this.handlers.set("color",e),this.handlers.set("range",e),this.handlers.set("number",new v),this.handlers.set("textarea",new _);const t=new S;this.handlers.set("checkbox",t),this.handlers.set("switch",t),this.handlers.set("boolean",t),this.handlers.set("select",new y),this.handlers.set("radio",new k);const r=new w;this.handlers.set("file",r),this.handlers.set("File",r)}static getHandler(e){const t=this.handlers.get(e.toLowerCase());return t||(console.warn(`Handler for input type '${e}' not found, using text handler.`),this.handlers.get("text"))}static registerHandler(e,t){this.handlers.set(e.toLowerCase(),t)}}var I=Object.defineProperty,s=(n,e,t,r)=>{for(var l=void 0,u=n.length-1,h;u>=0;u--)(h=n[u])&&(l=h(e,t,l)||l);return l&&I(e,t,l),l};function f(n){if(n==null||typeof n!="string")return n;const e=n.trim();if(!(e.startsWith("{")||e.startsWith("[")))return n;try{return JSON.parse(e)}catch{try{let t=e.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,'$1"$2":');return t=t.replace(/:\s*'([^']*)'/g,': "$1"'),t=t.replace(/,\s*([}\]])/g,"$1"),JSON.parse(t)}catch(t){return console.error("Error al parsear JSON después de intentar corregir:",t,"Valor original:",n),n}}}class a extends b{constructor(){super(),this.type="text",this.value="",this.disabled=!1,this.readonly=!1,this.darkmode=!1,this.options=[],this.required=!1,this.multiple=!1,this._isValid=!0,this._updateHandler(),this._internalValue=this._parseValueForInternal(this.value)}_updateHandler(){this._currentHandler=c.getHandler(this.type)}attributeChangedCallback(e,t,r){if(super.attributeChangedCallback(e,t,r),e==="type"&&r!==t&&(this._updateHandler(),this._internalValue=this._parseValueForInternal(this.value)),e==="options"&&r!==t&&typeof r=="string")try{const l=f(r);Array.isArray(l)?this.options=l.every(u=>typeof u=="object"&&"value"in u&&"label"in u)?l:[]:(console.warn(`Options attribute for c-input [${this.id||this.name||"unnamed"}] is not a valid array string. Received:`,r),this.options=[])}catch(l){console.error(`Error parsing options attribute for c-input [${this.id||this.name||"unnamed"}]:`,l),this.options=[]}e==="value"&&r!==t&&(this._internalValue=this._parseValueForInternal(r))}willUpdate(e){if(e.has("type")&&(this._updateHandler(),this._internalValue=this._parseValueForInternal(this.value)),e.has("value")){const t=e.get("value");let r;Array.isArray(this._internalValue)?r=JSON.stringify(this._internalValue):this._internalValue instanceof File||this._internalValue instanceof FileList?r=this.value??"":r=this._internalValue===null||this._internalValue===void 0?"":String(this._internalValue),t!==r&&(this._internalValue=this._parseValueForInternal(this.value))}if(e.has("options")&&typeof this.options=="string")try{const t=f(this.options);Array.isArray(t)?this.options=t.every(r=>typeof r=="object"&&"value"in r&&"label"in r)?t:[]:this.options=[]}catch{this.options=[]}if(e.has("multiple")){const t=e.get("multiple");this.multiple!==t&&(this._internalValue=this._parseValueForInternal(this.value))}}_parseValueForInternal(e){return this._currentHandler?this.type==="select"&&this._currentHandler instanceof y?this._currentHandler.parseValue(e,this.multiple):this._currentHandler.parseValue(e):e==null?null:String(e)}_createContext(){return{id:this.id,name:this.name,value:this.value,placeholder:this.placeholder,disabled:this.disabled,readonly:this.readonly,min:this.min,max:this.max,step:this.step,darkmode:this.darkmode,options:this.options,required:this.required,pattern:this.pattern,multiple:this.multiple,title:this.title,internalValue:this._internalValue,shadowRoot:this.shadowRoot,emitEvent:(e,t)=>this.EmitEvent(e,t),handleInputChange:e=>this._handleInputChange(e),parseValueForInternal:e=>this._parseValueForInternal(e),type:this.type}}static{this.styles=g`
        :host {
            display: block; /* Or inline-block depending on desired layout */
            margin-block-start: 0.5rem;
            margin-block-end: 0.5rem;
            color-scheme: light dark; /* Basic dark mode support */
            --inp-text-color: inherit;
            --inp-bg-color: inherit;
            --inp-border-color: #ccc; /* Softer default border */
            --inp-focus-border-color: #2196F3;
            --inp-focus-shadow-color: rgba(33, 150, 243, 0.3);
            --inp-disabled-bg: #f0f0f0;
            --inp-disabled-color: #999;
            --inp-disabled-border-color: #ddd;
            --inp-readonly-bg: #f8f8f8;
            --inp-error-border-color: red;
            --inp-error-shadow-color: rgba(255, 0, 0, 0.2);
            --inp-slider-bg: #ccc;
            --inp-slider-knob: white;
            --inp-slider-active-bg: #2196F3;
            --inp-padding: 0.5em 0.75em; /* Consistent padding */
            --inp-border-radius: 4px;
            --inp-font-size: 1rem;
            font-size: var(--inp-font-size);
        }
        
        :host([darkmode]) {
            --inp-border-color: #555;
            --inp-focus-border-color: #4dabf7; /* Lighter blue for dark mode */
            --inp-focus-shadow-color: rgba(77, 171, 247, 0.3);
            --inp-disabled-bg: #2a2a2a;
            --inp-disabled-color: #777;
            --inp-disabled-border-color: #444;
            --inp-readonly-bg: #222;
            --inp-slider-bg: #555;
            --inp-slider-knob: #ccc;
            --inp-slider-active-bg: #4dabf7;
            --inp-bg-color: #333; /* Darker background for inputs */
            --inp-text-color: #fff; /* Lighter text for dark mode */
        }

        .inp-cont {
            display: flex; /* For potential future label/input alignment */
            flex-direction: column; /* Default stacking */
        }
        
        /* General input styling */
        input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), 
        textarea, 
        select {
            padding: var(--inp-padding);
            border: 1px solid var(--inp-border-color);
            border-radius: var(--inp-border-radius);
            font-size: inherit; /* Inherit from host */
            background-color: var(--inp-bg-color);
            color: var(--inp-text-color);
            box-sizing: border-box;
            width: 100%; /* Make them take full width of container by default */
            margin: 0;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        option { /* For select dropdown */
            color: initial; /* Reset for system appearance */
            background-color: initial;
        }
        
        textarea { 
            resize: vertical; 
            min-height: 80px;
            line-height: 1.5;
        }

        /* States: Disabled and Readonly */
        input:disabled, textarea:disabled, select:disabled,
        input[readonly], textarea[readonly], select[readonly] /* Readonly often styled like disabled */
         {
            background-color: var(--inp-disabled-bg);
            color: var(--inp-disabled-color);
            border-color: var(--inp-disabled-border-color);
            cursor: not-allowed;
        }
        input[readonly], textarea[readonly] {
             background-color: var(--inp-readonly-bg);
             cursor: default; /* Readonly is not "not-allowed" but "no-drop" can be too strong */
        }
        :host([readonly]) select { /* Custom styling for readonly select if needed */
             pointer-events: none; /* Simulate readonly for select */
        }

        /* Focus state */
        input:not([type="checkbox"]):not([type="radio"]):not([disabled]):not([readonly]):focus,
        textarea:not([disabled]):not([readonly]):focus,
        select:not([disabled]):not([readonly]):focus {
            outline: none;
            border-color: var(--inp-focus-border-color);
            box-shadow: 0 0 0 3px var(--inp-focus-shadow-color);
        }

        /* Invalid state */
        :host([invalid]) .input-element:not([type="checkbox"]):not([type="radio"]) {
            border-color: var(--inp-error-border-color) !important;
            box-shadow: 0 0 0 3px var(--inp-error-shadow-color) !important;
        }
        :host([invalid]) .radio-group,
        :host([invalid]) .sw,
        :host([invalid]) .cb-label {
            outline: 2px solid var(--inp-error-border-color); /* Visual cue for group/label types */
            outline-offset: 2px;
        }

        /* Checkbox / Switch / Radio specific styling */
        .cb-label, .radio-label {
            display: inline-flex;
            align-items: center;
            margin-right: 1em; /* Spacing between multiple radios/checkboxes */
            cursor: pointer;
            position: relative; /* For custom styling if needed */
        }
        .cb-label input[type="checkbox"], .radio-label input[type="radio"] {
             margin-right: 0.5em;
        }
        .label-text {
            user-select: none;
        }

        /* Switch Styles */
        .sw { position: relative; display: inline-block; width: 50px; height: 26px; cursor:pointer; }
        .sw input { opacity: 0; width: 0; height: 0; }
        .sldr { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--inp-slider-bg); transition: .3s; border-radius: 26px; }
        .sldr:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: var(--inp-slider-knob); transition: .3s; border-radius: 50%; }
        
        input:checked + .sldr { background-color: var(--inp-slider-active-bg); }
        input:checked + .sldr:before { transform: translateX(24px); }
        
        /* Focus visible for accessibility on switch/checkbox/radio */
        input[type="checkbox"]:focus-visible, 
        input[type="radio"]:focus-visible {
             outline: 2px solid var(--inp-focus-border-color);
             outline-offset: 2px;
        }
        input[type="checkbox"]:focus-visible + .sldr { /* For switch */
            box-shadow: 0 0 0 3px var(--inp-focus-shadow-color);
        }
        
        /* Select multiple styling */
        select[multiple] {
            min-height: 100px; /* Or adjust as needed */
        }
        select option:checked { /* More subtle highlighting for selected options */
            /* background-color: var(--inp-focus-border-color); */
            /* color: white; */
        }
        .radio-group {
            display: flex;
            flex-direction: column; /* or 'row' if preferred */
            gap: 0.5em;
        }
        :host([type="radio"]) .inp-cont, 
        :host([type="checkbox"]) .inp-cont, 
        :host([type="switch"]) .inp-cont {
             padding: 0; /* Remove padding for wrapper of these types */
        }
    `}render(){return this.toggleAttribute("invalid",!this._isValid),d`
            <form class="val-form" @submit="${this._handleSubmit}" novalidate>
                <div class="inp-cont">
                    ${this._currentHandler?.render(this._createContext())}
                </div>
                <button type="submit" style="display: none;"></button>
            </form>
        `}EmitEvent(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_handleInputChange(e){if(!this._currentHandler)return;const t=this._createContext(),r=this._currentHandler.handleChange(e,t);this._internalValue=r,r instanceof File?this.value=r.name:r instanceof FileList?this.value=Array.from(r).map(l=>l.name).join(", "):Array.isArray(r)?this.value=JSON.stringify(r):r==null?this.value="":this.value=String(r),this.EmitEvent("change",{id:this.id,name:this.name,value:this._internalValue,nativeEvent:e}),this.isValid()}_handleSubmit(e){if(e.preventDefault(),this.isValid())this.EmitEvent("form-submit",{id:this.id,name:this.name,value:this.getVal()});else{const t=this._getInternalInputElement();t&&this._hasReportValidity(t)&&t.reportValidity()}}_hasReportValidity(e){return"reportValidity"in e&&typeof e.reportValidity=="function"}_getInternalInputElement(){return this.type==="radio"?this.shadowRoot?.querySelector(".radio-group input:first-of-type"):this.shadowRoot?.querySelector(".input-element")}getVal(){return this._internalValue}isValid(){if(!this._currentHandler)return this._isValid=!0,!0;const e=this._createContext(),t=this._currentHandler.isValid(e);return this._isValid=t,t}setVal(e){this._internalValue=this._parseValueForInternal(e),this._internalValue instanceof File?this.value=this._internalValue.name:this._internalValue instanceof FileList?this.value=Array.from(this._internalValue).map(t=>t.name).join(", "):Array.isArray(this._internalValue)?this.value=JSON.stringify(this._internalValue):this._internalValue===null||this._internalValue===void 0?this.value="":this.value=String(this._internalValue),this.updateComplete.then(()=>{this.isValid(),this.EmitEvent("change",{id:this.id,name:this.name,value:this._internalValue,programmatic:!0})})}reset(){if(!this._currentHandler)return;const e=this._createContext(),t=this._currentHandler.reset(e);this.setVal(t)}setOpts(e){["select","radio"].includes(this.type.toLowerCase())?(this.options=Array.isArray(e)?e:[],this.setVal(this._parseValueForInternal(this.value))):console.warn(`setOpts is only applicable to 'select' or 'radio' types. Current type: ${this.type}`)}getSelOptLabel(){return this.type==="select"&&this._currentHandler?.getSelectedOption?this._currentHandler.getSelectedOption(this._createContext()):null}focus(){const e=this._getInternalInputElement();e&&typeof e.focus=="function"&&e.focus()}static registerInputHandler(e,t){c.registerHandler(e,t)}}s([o({type:String,reflect:!0})],a.prototype,"type");s([o({type:String,reflect:!0})],a.prototype,"name");s([o({type:String})],a.prototype,"value");s([o({type:String,reflect:!0})],a.prototype,"placeholder");s([o({type:Boolean,reflect:!0})],a.prototype,"disabled");s([o({type:Boolean,reflect:!0})],a.prototype,"readonly");s([o({type:Number,reflect:!0})],a.prototype,"min");s([o({type:Number,reflect:!0})],a.prototype,"max");s([o({type:Number,reflect:!0})],a.prototype,"step");s([o({type:Boolean,reflect:!0})],a.prototype,"darkmode");s([o({type:Array})],a.prototype,"options");s([o({type:Boolean,reflect:!0})],a.prototype,"required");s([o({type:String,reflect:!0})],a.prototype,"pattern");s([o({type:Boolean,reflect:!0})],a.prototype,"multiple");s([p()],a.prototype,"_isValid");s([p()],a.prototype,"_internalValue");s([p()],a.prototype,"_currentHandler");customElements.get("c-input")||customElements.define("c-input",a);

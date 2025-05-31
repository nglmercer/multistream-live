import{r as b,i as m}from"./lit-element.CyV8MMp1.js";import{x as d}from"./directive.D03qP3rJ.js";import{n as l,r as c}from"./state.DOXniPlE.js";import{o as r,a as p}from"./map.C-h1YvKv.js";var y=Object.defineProperty,s=(o,e,t,i)=>{for(var n=void 0,u=o.length-1,h;u>=0;u--)(h=o[u])&&(n=h(e,t,n)||n);return n&&y(e,t,n),n};function f(o){if(o==null||typeof o!="string")return o;const e=o.trim();if(!(e.startsWith("{")||e.startsWith("[")))return o;try{return JSON.parse(e)}catch{try{const t=e.replace(/([{,]\s*)(\w+)\s*:/g,'$1"$2":').replace(/:\s*'([^']+)'/g,': "$1"');return JSON.parse(t)}catch(t){return console.error("Error al parsear JSON:",t,"Valor recibido:",o),o}}}class a extends b{constructor(){super(),this.type="text",this.value="",this.disabled=!1,this.readonly=!1,this.darkmode=!1,this.options=[],this.required=!1,this.multiple=!1,this._isValid=!0}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e==="options"&&i!==t&&typeof i=="string")try{const n=f(i);Array.isArray(n)||console.warn(`Options attribute for c-inp [${this.id||this.name}] is not an array`),this.options=Array.isArray(n)?n:[]}catch(n){console.error(`Error parsing options attribute for c-inp [${this.id||this.name}]:`,n),this.options=[]}e==="value"&&i!==t&&(this._internalValue=this._parseValueForInternal(i))}willUpdate(e){if(e.has("value")&&(this._internalValue=this._parseValueForInternal(this.value)),e.has("multiple")){const t=e.get("multiple");this.multiple&&!t&&!Array.isArray(this._internalValue)?this._internalValue=this._internalValue!==null&&this._internalValue!==void 0&&this._internalValue!==""?[String(this._internalValue)]:[]:!this.multiple&&t&&Array.isArray(this._internalValue)&&(this._internalValue=this._internalValue.length>0?this._internalValue[0]:"")}}_parseValueForInternal(e){if(e==null)return this.type==="number"?null:"";if(this.multiple&&this.type==="select"){if(Array.isArray(e))return e.map(String);if(typeof e=="string")try{const t=JSON.parse(e);return Array.isArray(t)?t.map(String):[]}catch{return e?[String(e)]:[]}return[]}if(this.type==="checkbox"||this.type==="switch"||this.type==="boolean")return String(e).toLowerCase()==="true";if(this.type==="number"){if(e===""||e===null||e===void 0)return null;const t=Number(e);return isNaN(t)?null:t}return String(e)}static{this.styles=m`
    :host {
      display: block;
      margin: 0.5rem;
      padding: 0;
      color-scheme: light dark;
      /* Define variables default aquí para que se puedan sobreescribir */
      --inp-border-color: rgba(99, 99, 99, 0.5);
      --inp-disabled-bg: #f5f5f5;
      --inp-disabled-color: #888;
      --inp-slider-bg: #ccc;
      --inp-slider-knob: white;
      --padding: 0.5rem;
      --border: 1px solid var(--inp-border-color);
    }
    
    :host([darkmode]) {
      /* Sobreescribe variables para dark mode */
      --inp-border-color: #555;
      --inp-disabled-bg: #222;
      --inp-disabled-color: #666;
      --inp-slider-bg: #555;
      --inp-slider-knob: #888;
    }

    .inp-cont {
      display: flex;
      flex-direction: column;
      padding: var(--padding);
    }
    
    label {
      display: inline-flex;
      align-items: center;
      margin-right: 10px;
      cursor: pointer;
    }

    input, textarea, select {
      padding: 0.5rem;
      border: var(--border);
      border-radius: 4px;
      font-size: 14px;
      background-color: inherit;
      color: inherit;
      box-sizing: border-box;
      margin: 0;
    }
    
    option {
      color: slategray;
      background-color: #fff;
      text-indent: 0;
    }
    
    textarea { 
      resize: vertical; 
      min-height: 80px;
    }

    input:disabled, textarea:disabled, select:disabled {
      background-color: var(--inp-disabled-bg);
      cursor: not-allowed;
      color: var(--inp-disabled-color);
      border: 1px solid var(--inp-disabled-color);
    }
    
    input:read-only, textarea:read-only {
      background-color: var(--inp-disabled-bg);
      cursor: no-drop;
      color: var(--inp-disabled-color);
    }

    .sw { position: relative; display: inline-block; width: 60px; height: 30px; }
    .sw input { opacity: 0; width: 0; height: 0; }
    .sldr { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--inp-slider-bg); transition: .4s; border-radius: 34px; }
    .sldr:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background-color: var(--inp-slider-knob); transition: .4s; border-radius: 50%; }
    input:checked + .sldr { background-color: #2196F3; }
    input:checked + .sldr:before { transform: translateX(28px); }
    
    input:not(:read-only):focus,
    textarea:not(:read-only):focus,
    select:focus {
      outline: none;
      border-color: #2196F3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      cursor: auto;
    }
    
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
    }
    
    select option:checked {
      background-color: rgb(0, 171, 255);
      color: white;
      font-weight: bold;
    }
    
    :host([invalid]) .input-element {
      border-color: red !important;
      box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2) !important;
    }
  `}render(){return this.toggleAttribute("invalid",!this._isValid),d`
      <form class="val-form" @submit="${this._handleSubmit}" novalidate>
        <div class="inp-cont">
          ${this._renderInput()}
        </div>
        <button type="submit" style="display: none;"></button>
      </form>
    `}_renderInput(){const e="input-element";switch(this.type){case"textarea":return d`<textarea
          class=${e}
          id=${r(this.id)}
          name=${r(this.name)}
          .value=${this._internalValue===null?"":String(this._internalValue)}
          placeholder=${r(this.placeholder)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          title=${r(this.title)}
          pattern=${r(this.pattern)}
          @change=${this._handleInputChange}
        ></textarea>`;case"checkbox":case"switch":case"boolean":return d`
          <label class="sw">
            <input
              class=${e}
              type="checkbox"
              id=${r(this.id)}
              name=${r(this.name)}
              .checked=${!!this._internalValue}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              title=${r(this.title)}
              @change=${this._handleInputChange}
            >
            <span class="sldr"></span>
          </label>`;case"select":return d`
        <select
          class=${e}
          id=${r(this.id)}
          name=${r(this.name)}
          .value=${this.multiple?void 0:this._internalValue===null?"":String(this._internalValue)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          title=${r(this.title)}
          @change=${this._handleInputChange}
          ?multiple=${this.multiple}
        >
          ${p(this.options,t=>{const i=this.multiple?Array.isArray(this._internalValue)&&this._internalValue.includes(String(t.value)):String(t.value)==String(this._internalValue??"");return d`
              <option
                value=${t.value}
                ?selected=${i}
              >${t.label}</option>
            `})}
        </select>`;case"radio":return d`
          ${p(this.options,t=>d`
            <label>
              <input type="radio"
                id=${`${this.id||this.name}_${t.value}`}
                name=${r(this.name)}
                value=${t.value}
                .checked=${t.value==this._internalValue}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                title=${r(this.title)}
                @change=${this._handleInputChange}
              >
              ${t.label}
            </label>
          `)}
        `;case"File":case"file":return d`
                <input
                  class=${e}
                  id=${r(this.id)}
                  type="file"
                  name=${r(this.name)}
                  placeholder=${r(this.placeholder)}
                  ?disabled=${this.disabled}
                  ?readonly=${this.readonly}
                  ?required=${this.required}
                  title=${r(this.title)}
                  pattern=${r(this.pattern)}
                  @change=${this._handleInputChange}
                >`;default:return d`
          <input
            class=${e}
            type=${this.type==="string"?"text":this.type}
            id=${r(this.id)}
            name=${r(this.name)}
            value=${this._internalValue===null?"":String(this._internalValue)}
            placeholder=${r(this.placeholder)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            min=${this.min}
            max=${this.max}
            step=${this.step}
            title=${r(this.title)}
            pattern=${r(this.pattern)}
            @change=${this._handleInputChange}
            @input=${this._handleInputEvent}
          >`}}EmitEvent(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_handleInputEvent(e){const t=e.target;if(t instanceof HTMLInputElement&&t.pattern){const i=new RegExp(t.pattern,"g"),n=t.value.match(i);t.value=n?n.join(""):""}}_handleInputChange(e){const t=e.target;let i;if(this.type==="select"&&this.multiple){const n=t;i=Array.from(n.selectedOptions).map(u=>u.value)}else if(this.type==="radio"){const n=this.shadowRoot?.querySelector(`input[name="${this.name}"]:checked`);i=n?n.value:null}else t.type==="checkbox"?i=t.checked:i=t.value;this._internalValue=this._parseValueForInternal(i),this.value=i==null?"":String(i),this.EmitEvent("change",{id:this.id,name:this.name,value:this._internalValue,target:t}),this.isValid()}_handleSubmit(e){e.preventDefault(),this.isValid()?this.EmitEvent("form-submit",{id:this.id,name:this.name,value:this.getVal()}):this._getInternalInputElement()?.reportValidity()}_getInternalInputElement(){return this.type==="radio"?null:this.shadowRoot?.querySelector(".input-element")}getVal(){return this._internalValue||this.value}isValid(){let e=!0;const t=this._getInternalInputElement();return t?e=t.checkValidity():this.type==="radio"&&this.required&&(e=this.shadowRoot?.querySelector(`input[name="${this.name}"]:checked`)!==null),this._isValid=e,e}setVal(e){this._internalValue=this._parseValueForInternal(e),this.value=e==null?"":String(e),this.requestUpdate(),setTimeout(()=>this.isValid(),0),this.EmitEvent("change",this.getVal())}reset(){let e="";this.type==="checkbox"||this.type==="switch"||this.type==="boolean"?e=!1:this.type==="radio"&&(this.shadowRoot?.querySelectorAll(`input[name="${this.name}"]`)?.forEach(i=>i.checked=!1),e=null),this.setVal(e)}setOpts(e){["select","radio"].includes(this.type)&&(this.options=Array.isArray(e)?e:[])}getSelOpt(){if(this.type==="select"){const e=this._getInternalInputElement();return e?e.value:null}return null}}s([l({type:String,reflect:!0})],a.prototype,"type");s([l({type:String,reflect:!0})],a.prototype,"name");s([l({type:String})],a.prototype,"value");s([l({type:String,reflect:!0})],a.prototype,"placeholder");s([l({type:Boolean,reflect:!0})],a.prototype,"disabled");s([l({type:Boolean,reflect:!0})],a.prototype,"readonly");s([l({type:Number,reflect:!0})],a.prototype,"min");s([l({type:Number,reflect:!0})],a.prototype,"max");s([l({type:Number,reflect:!0})],a.prototype,"step");s([l({type:Boolean,reflect:!0})],a.prototype,"darkmode");s([l({type:Array})],a.prototype,"options");s([l({type:Boolean,reflect:!0})],a.prototype,"required");s([l({type:String,reflect:!0})],a.prototype,"pattern");s([l({type:Boolean,reflect:!0})],a.prototype,"multiple");s([c()],a.prototype,"_isValid");s([c()],a.prototype,"_internalValue");customElements.get("c-input")||customElements.define("c-input",a);

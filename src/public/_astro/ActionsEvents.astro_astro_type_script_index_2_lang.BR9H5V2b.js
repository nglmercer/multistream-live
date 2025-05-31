import{I as p,d as v}from"./idb.Cw0MiLyc.js";import{i as y,r as x}from"./lit-element.CyV8MMp1.js";import{x as n,E as l}from"./directive.D03qP3rJ.js";import{n as u,r as h,t as w}from"./state.DOXniPlE.js";import{e as $}from"./class-map.B3sySxza.js";import"./custom-modal.N6Or44FX.js";import"./CInput.DebFYDzL.js";import"./map.C-h1YvKv.js";var k=Object.defineProperty,C=Object.getOwnPropertyDescriptor,d=(e,t,a,o)=>{for(var r=o>1?void 0:o?C(t,a):t,i=e.length-1,s;i>=0;i--)(s=e[i])&&(r=(o?s(t,a,r):s(r))||r);return o&&r&&k(t,a,r),r};let c=class extends x{constructor(){super(...arguments),this.value=this.getDefaultConfig(),this.config=this.getDefaultConfig(),this.mode="create",this.theme="auto",this.activeTab=0,this.showSensitive=!1,this.methods=["GET","POST","PUT","DELETE","PATCH","HEAD","OPTIONS"],this.bodyTypes=[{value:"json",label:"JSON"},{value:"text",label:"Text"},{value:"form",label:"Form Data"},{value:"urlencoded",label:"URL Encoded"}]}getDefaultConfig(){return{name:"",url:"",method:"GET",headers:[{key:"Content-Type",value:"application/json",enabled:!0}],params:[],body:"",bodyType:"json",auth:{type:"none",token:"",username:"",password:""}}}toggleTheme(){const e=["auto","light","dark"],t=e.indexOf(this.theme);this.theme=e[(t+1)%e.length]}getThemeIcon(){switch(this.theme){case"light":return"☀️";case"dark":return"🌙";default:return"🔄"}}getVal(){return this.getConfig()}getConfig(){return{...this.config}}setVal(e){this.setConfig(e)}setConfig(e){this.config={...e},this.requestUpdate()}reset(){this.config=this.getDefaultConfig(),this.activeTab=0,this.requestUpdate()}validate(){const e=[];if(this.config.name.trim()||e.push("El nombre es requerido"),this.config.url.trim()||e.push("La URL es requerida"),this.config.bodyType==="json"&&this.config.body.trim())try{JSON.parse(this.config.body)}catch{e.push("El cuerpo JSON no es válido")}return{isValid:e.length===0,errors:e}}emitChange(){this.dispatchEvent(new CustomEvent("config-change",{detail:this.getConfig(),bubbles:!0}))}updateConfig(e){this.config={...this.config,...e},this.emitChange(),this.requestUpdate()}addKeyValue(e){const t={key:"",value:"",enabled:!0};this.updateConfig({[e]:[...this.config[e],t]})}updateKeyValue(e,t,a,o){const r=[...this.config[e]];r[t]={...r[t],[a]:o},this.updateConfig({[e]:r})}removeKeyValue(e,t){const a=this.config[e].filter((o,r)=>r!==t);this.updateConfig({[e]:a})}renderKeyValueEditor(e,t,a){return n`
      <div class="key-value-editor">
        ${e.map((o,r)=>n`
          <div class="key-value-row">
            <input
              type="checkbox"
              class="checkbox"
              .checked=${o.enabled}
              @change=${i=>this.updateKeyValue(t,r,"enabled",i.target.checked)}
            />
            <input
              type="text"
              class="input"
              placeholder="Clave"
              .value=${o.key}
              @input=${i=>this.updateKeyValue(t,r,"key",i.target.value)}
            />
            <input
              type=${this.showSensitive||!o.key.toLowerCase().includes("auth")?"text":"password"}
              class="input"
              placeholder="Valor"
              .value=${o.value}
              @input=${i=>this.updateKeyValue(t,r,"value",i.target.value)}
            />
            <button
              class="remove-btn"
              @click=${()=>this.removeKeyValue(t,r)}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        `)}
        <button
          class="add-btn"
          @click=${()=>this.addKeyValue(t)}
        >
          ＋ Agregar ${a}
        </button>
      </div>
    `}render(){return n`
      <div class="config-panel" style="position: relative;">
        <!-- Theme toggle button (opcional) -->
        <button
          class="theme-toggle"
          @click=${this.toggleTheme}
          title="Cambiar tema: ${this.theme}"
        >
          ${this.getThemeIcon()}
        </button>

        <!-- Información básica -->
        <div class="form-group">
          <label class="form-label">Nombre de la configuración</label>
          <input
            type="text"
            class="input"
            placeholder="Mi API Request"
            .value=${this.config.name}
            @input=${e=>this.updateConfig({name:e.target.value})}
          />
        </div>

        <div class="form-group">
          <label class="form-label">Endpoint</label>
          <div class="url-row">
            <select
              class="select"
              .value=${this.config.method}
              @change=${e=>this.updateConfig({method:e.target.value})}
            >
              ${this.methods.map(e=>n`
                <option value=${e}>${e}</option>
              `)}
            </select>
            
            <input
              type="text"
              class="input"
              placeholder="https://api.ejemplo.com/endpoint"
              .value=${this.config.url}
              @input=${e=>this.updateConfig({url:e.target.value})}
            />
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <nav class="tab-nav">
            ${["Parámetros","Headers","Auth","Body"].map((e,t)=>n`
              <button
                class="tab-button ${$({active:this.activeTab===t})}"
                @click=${()=>{this.activeTab=t}}
              >
                ${e}
              </button>
            `)}
            <button
              class="visibility-toggle"
              @click=${()=>{this.showSensitive=!this.showSensitive}}
              title="Mostrar/ocultar valores sensibles"
            >
              ${this.showSensitive?"🙈":"👁️"}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          ${this.activeTab===0?n`
            <div>
              <h3 class="form-label">Parámetros de Query</h3>
              ${this.renderKeyValueEditor(this.config.params,"params","parámetro")}
            </div>
          `:l}

          ${this.activeTab===1?n`
            <div>
              <h3 class="form-label">Headers</h3>
              ${this.renderKeyValueEditor(this.config.headers,"headers","header")}
            </div>
          `:l}

          ${this.activeTab===2?n`
            <div>
              <h3 class="form-label">Autenticación</h3>
              <div class="space-y-4">
                <select
                  class="select"
                  .value=${this.config.auth.type}
                  @change=${e=>{this.updateConfig({auth:{...this.config.auth,type:e.target.value}})}}
                >
                  <option value="none">Sin autenticación</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                </select>

                ${this.config.auth.type==="bearer"?n`
                  <input
                    type=${this.showSensitive?"text":"password"}
                    class="input"
                    placeholder="Token"
                    .value=${this.config.auth.token}
                    @input=${e=>{this.updateConfig({auth:{...this.config.auth,token:e.target.value}})}}
                  />
                `:l}

                ${this.config.auth.type==="basic"?n`
                  <div class="auth-grid">
                    <input
                      type="text"
                      class="input"
                      placeholder="Usuario"
                      .value=${this.config.auth.username}
                      @input=${e=>{this.updateConfig({auth:{...this.config.auth,username:e.target.value}})}}
                    />
                    <input
                      type=${this.showSensitive?"text":"password"}
                      class="input"
                      placeholder="Contraseña"
                      .value=${this.config.auth.password}
                      @input=${e=>{this.updateConfig({auth:{...this.config.auth,password:e.target.value}})}}
                    />
                  </div>
                `:l}
              </div>
            </div>
          `:l}

          ${this.activeTab===3&&!["GET","HEAD"].includes(this.config.method)?n`
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <h3 class="form-label">Cuerpo de la petición</h3>
                <select
                  class="select"
                  style="width: auto;"
                  .value=${this.config.bodyType}
                  @change=${e=>{this.updateConfig({bodyType:e.target.value})}}
                >
                  ${this.bodyTypes.map(e=>n`
                    <option value=${e.value}>${e.label}</option>
                  `)}
                </select>
              </div>
              <textarea
                class="textarea"
                placeholder=${this.config.bodyType==="json"?`{
  "key": "value"
}`:"Contenido del cuerpo"}
                .value=${this.config.body}
                @input=${e=>{this.updateConfig({body:e.target.value})}}
              ></textarea>
            </div>
          `:l}

          ${this.activeTab===3&&["GET","HEAD"].includes(this.config.method)?n`
            <div class="no-body-message">
              Los métodos ${this.config.method} no permiten cuerpo en la petición
            </div>
          `:l}
        </div>
      </div>
    `}};c.styles=y`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
      color-scheme: light dark;
      
      /* Variables CSS para colores - Light theme (default) */
      --bg-primary: #ffffff;
      --bg-secondary: #f9fafb;
      --bg-tertiary: #f3f4f6;
      --border-color: #e5e7eb;
      --border-focus: #3b82f6;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --accent-primary: #3b82f6;
      --accent-hover: #2563eb;
      --danger: #dc2626;
      --danger-bg: #fef2f2;
      --success: #059669;
      --shadow: rgba(0, 0, 0, 0.1);
      --shadow-focus: rgba(59, 130, 246, 0.1);
      --input-bg: #ffffff;
      --disabled-bg: #f9fafb;
      --disabled-text: #9ca3af;
    }

    /* Dark theme automático basado en prefers-color-scheme */
    @media (prefers-color-scheme: dark) {
      :host {
        --bg-primary: #111827;
        --bg-secondary: #1f2937;
        --bg-tertiary: #374151;
        --border-color: #374151;
        --border-focus: #60a5fa;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --text-muted: #9ca3af;
        --accent-primary: #60a5fa;
        --accent-hover: #3b82f6;
        --danger: #f87171;
        --danger-bg: #1f2937;
        --success: #34d399;
        --shadow: rgba(0, 0, 0, 0.3);
        --shadow-focus: rgba(96, 165, 250, 0.2);
        --input-bg: #1f2937;
        --disabled-bg: #374151;
        --disabled-text: #6b7280;
      }
    }

    /* Override manual para forzar dark theme */
    :host([theme="dark"]) {
      --bg-primary: #111827;
      --bg-secondary: #1f2937;
      --bg-tertiary: #374151;
      --border-color: #374151;
      --border-focus: #60a5fa;
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --text-muted: #9ca3af;
      --accent-primary: #60a5fa;
      --accent-hover: #3b82f6;
      --danger: #f87171;
      --danger-bg: #1f2937;
      --success: #34d399;
      --shadow: rgba(0, 0, 0, 0.3);
      --shadow-focus: rgba(96, 165, 250, 0.2);
      --input-bg: #1f2937;
      --disabled-bg: #374151;
      --disabled-text: #6b7280;
    }

    /* Override manual para forzar light theme */
    :host([theme="light"]) {
      --bg-primary: #ffffff;
      --bg-secondary: #f9fafb;
      --bg-tertiary: #f3f4f6;
      --border-color: #e5e7eb;
      --border-focus: #3b82f6;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --accent-primary: #3b82f6;
      --accent-hover: #2563eb;
      --danger: #dc2626;
      --danger-bg: #fef2f2;
      --success: #059669;
      --shadow: rgba(0, 0, 0, 0.1);
      --shadow-focus: rgba(59, 130, 246, 0.1);
      --input-bg: #ffffff;
      --disabled-bg: #f9fafb;
      --disabled-text: #9ca3af;
    }

    .config-panel {
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 1.5rem;
      background: var(--bg-primary);
      color: var(--text-primary);
      box-shadow: 0 1px 3px var(--shadow);
    }

    .input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      outline: none;
      transition: all 0.2s ease;
      width: 100%;
      box-sizing: border-box;
      background: var(--input-bg);
      color: var(--text-primary);
    }

    .input:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--shadow-focus);
    }

    .input:disabled {
      background: var(--disabled-bg);
      color: var(--disabled-text);
      cursor: not-allowed;
    }

    .select {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      outline: none;
      cursor: pointer;
      width: 100%;
      box-sizing: border-box;
      background: var(--input-bg);
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .select:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--shadow-focus);
    }

    .select option {
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .url-row {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
      align-items: center;
    }

    .tabs {
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 1rem;
    }

    .tab-nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .tab-button {
      padding: 0.5rem 0.25rem;
      border: none;
      border-bottom: 2px solid transparent;
      background: none;
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-button.active {
      color: var(--accent-primary);
      border-bottom-color: var(--accent-primary);
    }

    .tab-button:hover:not(.active) {
      color: var(--text-primary);
    }

    .tab-content {
      min-height: 200px;
    }

    .key-value-editor {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .key-value-row {
      display: grid;
      grid-template-columns: auto 1fr 1fr auto;
      gap: 0.5rem;
      align-items: center;
      padding: 0.5rem;
      background: var(--bg-secondary);
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      accent-color: var(--accent-primary);
    }

    .remove-btn {
      padding: 0.5rem;
      color: var(--danger);
      background: none;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: var(--danger-bg);
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: var(--accent-primary);
      background: var(--bg-secondary);
      border: 1px dashed var(--accent-primary);
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }

    .add-btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--accent-hover);
      color: var(--accent-hover);
    }

    .textarea {
      width: 100%;
      height: 150px;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      resize: vertical;
      outline: none;
      box-sizing: border-box;
      background: var(--input-bg);
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .textarea:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--shadow-focus);
    }

    .auth-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .visibility-toggle {
      padding: 0.25rem;
      color: var(--text-secondary);
      background: none;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: color 0.2s;
      margin-left: auto;
    }

    .visibility-toggle:hover {
      color: var(--text-primary);
    }

    .space-y-4 > * + * {
      margin-top: 1rem;
    }

    .no-body-message {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      border: 1px dashed var(--border-color);
    }

    /* Theme toggle button (opcional) */
    .theme-toggle {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.2s ease;
    }

    .theme-toggle:hover {
      background: var(--bg-tertiary);
    }

    @media (max-width: 768px) {
      .url-row {
        grid-template-columns: 1fr;
      }
      
      .auth-grid {
        grid-template-columns: 1fr;
      }
      
      .tab-nav {
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .key-value-row {
        grid-template-columns: 1fr;
        gap: 0.25rem;
      }
    }
  `;d([u({type:Object})],c.prototype,"value",2);d([u({type:String})],c.prototype,"mode",2);d([u({type:String,reflect:!0})],c.prototype,"theme",2);d([h()],c.prototype,"activeTab",2);d([h()],c.prototype,"showSensitive",2);c=d([w("http-request-config")],c);document.getElementById("fetchForm_config");const E=new p(v.ActionsDB),m=document.getElementById("actionButton"),g=document.getElementById("ActionModal");document.addEventListener("DOMContentLoaded",async()=>{try{F(),m?m.addEventListener("click",()=>{T(),b()}):console.warn("Action button not found")}catch(e){console.error("Error during DOM initialization:",e)}});function T(){if(!g){console.warn("Action modal not found");return}g.show()}function F(){const e=document.querySelector(".form-actions");if(!e){console.warn("Form actions container not found");return}e.addEventListener("click",async function(t){try{if(!(t.target instanceof Element))return;const a=t.target.closest("button[data-action]");if(!a)return;const o=a.getAttribute("data-action");if(o==="reset")b(),console.log("Form reset");else if(o==="submit"){const r=S();if(!r){console.error("No form data found");return}await E.saveData(r),console.log("Form submitted successfully:",r)}else console.warn(`Unknown action: ${o}`);t.preventDefault(),t.stopPropagation()}catch(a){console.error("Error handling form action:",a)}})}function S(){try{const e=document.querySelector("#actionForm");if(!e)return console.warn("Action form not found"),null;const t=e.getElementsByTagName("c-input");if(t.length===0)return console.warn("No input fields found"),null;const a={};Array.from(t).forEach(s=>{const f=s.getAttribute("data-field-name");f&&(a[f]=s.value)});const o=document.querySelector("#fetchForm_check"),r=document.querySelector("#fetchForm_config"),i=r?r.getConfig()||r.value:{};return{...a,fetchForm_check:o?.value||"",fetchForm_value:i||{}}}catch(e){return console.error("Error getting form data:",e),null}}function z(e){if(!e||Object.keys(e).length===0){console.warn("No data provided to setFormData");return}try{const t=document.querySelector("#actionForm");if(!t){console.warn("Action form not found");return}const a=t.getElementsByTagName("c-input");Array.from(a).forEach(i=>{const s=i.getAttribute("data-field-name");s&&e[s]!==void 0&&i.setVal(e[s])}),console.log("Setting form data:",e);const o=document.querySelector("#fetchForm_check");o&&o.setVal(e.fetchForm_check);const r=document.querySelector("#fetchForm_config");r&&r.setConfig(e.fetchForm_value||{}),console.log("Form data set successfully")}catch(t){console.error("Error setting form data:",t)}}function b(){try{const e=document.querySelector("#actionForm");if(!e){console.warn("Action form not found");return}const t=e.getElementsByTagName("c-input");Array.from(t).forEach(r=>{r.reset()});const a=document.querySelector("#fetchForm_check");a&&a.setVal(!1);const o=document.querySelector("#fetchForm_config");o&&o.reset(),console.log("Form reset successfully")}catch(e){console.error("Error resetting form:",e)}}export{T as o,z as s};

import{E as y,I as x,d as w}from"./idb.CMvsdVSJ.js";import{i as k,r as $}from"./lit-element.CdPzzhzS.js";import{x as i,E as l}from"./lit-html.Cs9YtZST.js";import{t as E}from"./custom-element.BhZVzxrc.js";import{n as f,r as b}from"./state.k4TxN2nw.js";import{e as C}from"./class-map.D2HkPoOL.js";import"./custom-modal.C9jVXNQQ.js";import"./CInput.Dz4Eadx2.js";import"./directive.CGE4aKEl.js";import"./unsafe-html.o8VIWoCg.js";import"./map.CC3vsOt5.js";const T=new y;var S=Object.defineProperty,F=Object.getOwnPropertyDescriptor,d=(e,t,o,a)=>{for(var r=a>1?void 0:a?F(t,o):t,n=e.length-1,s;n>=0;n--)(s=e[n])&&(r=(a?s(t,o,r):s(r))||r);return a&&r&&S(t,o,r),r};let c=class extends ${constructor(){super(...arguments),this.value=this.getDefaultConfig(),this.config=this.getDefaultConfig(),this.mode="create",this.theme="auto",this.activeTab=0,this.showSensitive=!1,this.methods=["GET","POST","PUT","DELETE","PATCH","HEAD","OPTIONS"],this.bodyTypes=[{value:"json",label:"JSON"},{value:"text",label:"Text"},{value:"form",label:"Form Data"},{value:"urlencoded",label:"URL Encoded"}]}getDefaultConfig(){return{name:"",url:"",method:"GET",headers:[{key:"Content-Type",value:"application/json",enabled:!0}],params:[],body:"",bodyType:"json",auth:{type:"none",token:"",username:"",password:""}}}toggleTheme(){const e=["auto","light","dark"],t=e.indexOf(this.theme);this.theme=e[(t+1)%e.length]}getThemeIcon(){switch(this.theme){case"light":return"☀️";case"dark":return"🌙";default:return"🔄"}}getVal(){return this.getConfig()}getConfig(){return{...this.config}}setVal(e){this.setConfig(e)}setConfig(e){this.config={...e},this.requestUpdate()}reset(){this.config=this.getDefaultConfig(),this.activeTab=0,this.requestUpdate()}validate(){const e=[];if(this.config.name.trim()||e.push("El nombre es requerido"),this.config.url.trim()||e.push("La URL es requerida"),this.config.bodyType==="json"&&this.config.body.trim())try{JSON.parse(this.config.body)}catch{e.push("El cuerpo JSON no es válido")}return{isValid:e.length===0,errors:e}}emitChange(){this.dispatchEvent(new CustomEvent("config-change",{detail:this.getConfig(),bubbles:!0}))}updateConfig(e){this.config={...this.config,...e},this.emitChange(),this.requestUpdate()}addKeyValue(e){const t={key:"",value:"",enabled:!0};this.updateConfig({[e]:[...this.config[e],t]})}updateKeyValue(e,t,o,a){const r=[...this.config[e]];r[t]={...r[t],[o]:a},this.updateConfig({[e]:r})}removeKeyValue(e,t){const o=this.config[e].filter((a,r)=>r!==t);this.updateConfig({[e]:o})}renderKeyValueEditor(e,t,o){return i`
      <div class="key-value-editor">
        ${e.map((a,r)=>i`
          <div class="key-value-row">
            <input
              type="checkbox"
              class="checkbox"
              .checked=${a.enabled}
              @change=${n=>this.updateKeyValue(t,r,"enabled",n.target.checked)}
            />
            <input
              type="text"
              class="input"
              placeholder="Clave"
              .value=${a.key}
              @input=${n=>this.updateKeyValue(t,r,"key",n.target.value)}
            />
            <input
              type=${this.showSensitive||!a.key.toLowerCase().includes("auth")?"text":"password"}
              class="input"
              placeholder="Valor"
              .value=${a.value}
              @input=${n=>this.updateKeyValue(t,r,"value",n.target.value)}
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
          ＋ Agregar ${o}
        </button>
      </div>
    `}render(){return i`
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
              ${this.methods.map(e=>i`
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
            ${["Parámetros","Headers","Auth","Body"].map((e,t)=>i`
              <button
                class="tab-button ${C({active:this.activeTab===t})}"
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
          ${this.activeTab===0?i`
            <div>
              <h3 class="form-label">Parámetros de Query</h3>
              ${this.renderKeyValueEditor(this.config.params,"params","parámetro")}
            </div>
          `:l}

          ${this.activeTab===1?i`
            <div>
              <h3 class="form-label">Headers</h3>
              ${this.renderKeyValueEditor(this.config.headers,"headers","header")}
            </div>
          `:l}

          ${this.activeTab===2?i`
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

                ${this.config.auth.type==="bearer"?i`
                  <input
                    type=${this.showSensitive?"text":"password"}
                    class="input"
                    placeholder="Token"
                    .value=${this.config.auth.token}
                    @input=${e=>{this.updateConfig({auth:{...this.config.auth,token:e.target.value}})}}
                  />
                `:l}

                ${this.config.auth.type==="basic"?i`
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

          ${this.activeTab===3&&!["GET","HEAD"].includes(this.config.method)?i`
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <h3 class="form-label">Cuerpo de la petición</h3>
                <select
                  class="select"
                  style="width: auto;"
                  .value=${this.config.bodyType}
                  @change=${e=>{this.updateConfig({bodyType:e.target.value})}}
                >
                  ${this.bodyTypes.map(e=>i`
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

          ${this.activeTab===3&&["GET","HEAD"].includes(this.config.method)?i`
            <div class="no-body-message">
              Los métodos ${this.config.method} no permiten cuerpo en la petición
            </div>
          `:l}
        </div>
      </div>
    `}};c.styles=k`
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
  `;d([f({type:Object})],c.prototype,"value",2);d([f({type:String})],c.prototype,"mode",2);d([f({type:String,reflect:!0})],c.prototype,"theme",2);d([b()],c.prototype,"activeTab",2);d([b()],c.prototype,"showSensitive",2);c=d([E("http-request-config")],c);async function A(){return new Promise((e,t)=>{try{const o=document.createElement("input");o.type="file",o.accept="application/json",o.onchange=()=>{const a=o.files?.[0];if(!a){t(new Error("No se seleccionó ningún archivo."));return}const r=new FileReader;r.onload=()=>{try{const n=r.result,s=JSON.parse(n);e(s)}catch{t(new Error("El archivo no contiene JSON válido."))}},r.onerror=()=>{t(new Error("Error al leer el archivo."))},r.readAsText(a)},o.click()}catch(o){t(new Error("Error inesperado: "+o.message))}})}function O(e,t){try{const o=JSON.stringify(e,null,2);if(!t){console.warn("faltan options{filename?,mode:download|copy}");return}if(t.mode==="download"){const a=new Blob([o],{type:"application/json"}),r=URL.createObjectURL(a),n=document.createElement("a");n.href=r,n.download=t.filename||"data.json",n.click(),URL.revokeObjectURL(r)}}catch(o){console.error("Error al exportar JSON:",o)}}document.getElementById("fetchForm_config");const D=new x(w.ActionsDB),g=document.getElementById("actionButton"),u=document.getElementById("ActionModal");document.addEventListener("DOMContentLoaded",async()=>{try{q(),g?g.addEventListener("click",()=>{N(),v()}):console.warn("Action button not found")}catch(e){console.error("Error during DOM initialization:",e)}});function N(){if(!u){console.warn("Action modal not found");return}u.show()}function V(){if(!u){console.warn("Action modal not found");return}u.hide()}function q(){const e=document.querySelector(".form-actions");if(!e){console.warn("Form actions container not found");return}e.addEventListener("click",async function(t){try{if(!(t.target instanceof Element))return;const o=t.target.closest("button[data-action]");if(!o)return;const a=o.getAttribute("data-action");if(!a)return;a in h?h[a]():console.warn(`Unknown action: ${a}`),t.preventDefault(),t.stopPropagation()}catch(o){console.error("Error handling form action:",o)}})}const h={reset:()=>{v(),console.log("Form reset")},submit:async()=>{const e=p();if(!e){console.error("No form data found");return}typeof e.id=="string"&&(e.id=parseInt(e.id,10));const t=await D.saveData(e);t&&(V(),console.log("Form submitted successfully:",t),T.emit("actionFormSubmit",t))},export:async()=>{const e=p();if(!e){console.error("No form data found");return}typeof e.id=="string"&&(e.id=parseInt(e.id,10)),await O(e,{mode:"download",filename:e.name}),console.log("exportcallback result",e)},import:async()=>{const e=await A();console.log("importcallback",e),e&&_(e)}};function p(){try{const e=document.querySelector("#actionForm");if(!e)return console.warn("Action form not found"),null;const t=e.getElementsByTagName("c-input");if(t.length===0)return console.warn("No input fields found"),null;const o={};Array.from(t).forEach(s=>{const m=s.getAttribute("data-field-name");m&&(o[m]=s.value)});const a=document.querySelector("#fetchForm_check"),r=document.querySelector("#fetchForm_config"),n=r?r.getConfig()||r.value:{};return{...o,fetchForm_check:a?.value||"",fetchForm_value:n||{}}}catch(e){return console.error("Error getting form data:",e),null}}function _(e){if(!e||Object.keys(e).length===0){console.warn("No data provided to setFormData");return}try{const t=document.querySelector("#actionForm");if(!t){console.warn("Action form not found");return}const o=t.getElementsByTagName("c-input");Array.from(o).forEach(n=>{const s=n.getAttribute("data-field-name");s&&e[s]!==void 0&&n.setVal(e[s])}),console.log("Setting form data:",e);const a=document.querySelector("#fetchForm_check");a&&a.setVal(e.fetchForm_check);const r=document.querySelector("#fetchForm_config");r&&r.setConfig(e.fetchForm_value||{}),console.log("Form data set successfully")}catch(t){console.error("Error setting form data:",t)}}function v(){try{const e=document.querySelector("#actionForm");if(!e){console.warn("Action form not found");return}const t=e.getElementsByTagName("c-input");Array.from(t).forEach(r=>{r.reset()});const o=document.querySelector("#fetchForm_check");o&&o.setVal(!1);const a=document.querySelector("#fetchForm_config");a&&a.reset(),console.log("Form reset successfully")}catch(e){console.error("Error resetting form:",e)}}export{T as a,N as o,_ as s};

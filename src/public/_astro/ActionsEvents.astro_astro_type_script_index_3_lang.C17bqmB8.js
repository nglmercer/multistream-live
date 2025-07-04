import{r as f,i as y,n as l}from"./property.DTDKM9eR.js";import{x as s}from"./lit-html.Cs9YtZST.js";import{t as m}from"./custom-element.BhZVzxrc.js";import{r as d}from"./state.5GRZVynF.js";import{d as v}from"./idbconfig.Dsejn2de.js";import{g as w,i as C}from"./idb.DgU9_DZM.js";var D=Object.defineProperty,$=Object.getOwnPropertyDescriptor,a=(e,t,o,i)=>{for(var r=i>1?void 0:i?$(t,o):t,n=e.length-1,u;n>=0;n--)(u=e[n])&&(r=(i?u(t,o,r):u(r))||r);return i&&r&&D(t,o,r),r};class p extends f{constructor(){super(...arguments),this.dbKey="",this.databaseConfig=null,this.buttonText="",this.buttonClass="",this.disabled=!1,this.isProcessing=!1,this.resolvedConfig=null}connectedCallback(){super.connectedCallback(),this._initializeConfig()}firstUpdated(){this._initializeConfig()}willUpdate(t){(t.has("dbKey")||t.has("databaseConfig"))&&this._initializeConfig()}_initializeConfig(){let t=null;if(this.dbKey){const o=v[this.dbKey];o?t=o:console.warn(`La clave de base de datos '${this.dbKey}' no fue encontrada.`)}else this.databaseConfig&&(t=this.databaseConfig);this.resolvedConfig!==t&&(this.resolvedConfig=t)}get currentConfig(){return this.resolvedConfig}get isDisabled(){return!this.currentConfig||this.disabled||this.isProcessing}_emitStatus(t){this.dispatchEvent(new CustomEvent("operation-status",{detail:t,bubbles:!0,composed:!0}))}get currentButtonText(){return this.buttonText||this.defaultButtonText}get currentButtonClass(){return this.buttonClass||this.defaultButtonClass}static{this.styles=y`
    :host {
      display: inline-block;
      font-family: system-ui, -apple-system, sans-serif;
      color-scheme: light dark;
      
      /* Custom Properties - Light Theme (default) */
      --bg-primary: #ffffff;
      --bg-secondary: #fafafa;
      --bg-tertiary: #f8f9fa;
      --border-color: #e0e0e0;
      --border-input: #ccc;
      --text-primary: #333;
      --text-secondary: #555;
      --text-muted: #666;
      --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      /* Button Colors */
      --btn-primary: #007bff;
      --btn-primary-hover: #0056b3;
      --btn-success: #28a745;
      --btn-success-hover: #1e7e34;
      --btn-secondary: #6c757d;
      --btn-secondary-hover: #545b62;
      --btn-danger: #dc3545;
      --btn-danger-hover: #c82333;
    }

    /* Dark Theme */
    @media (prefers-color-scheme: dark) {
      :host {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --bg-tertiary: #333333;
        --border-color: #404040;
        --border-input: #555;
        --text-primary: #e0e0e0;
        --text-secondary: #b0b0b0;
        --text-muted: #888;
        --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }

    :host([disabled]) {
      pointer-events: none;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      min-width: 120px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-weight: 500;
    }

    .btn-primary { 
      background: var(--btn-primary); 
      color: white; 
    }
    .btn-primary:hover:not(:disabled) { 
      background: var(--btn-primary-hover); 
    }

    .btn-success { 
      background: var(--btn-success); 
      color: white; 
    }
    .btn-success:hover:not(:disabled) { 
      background: var(--btn-success-hover); 
    }

    .btn-secondary { 
      background: var(--btn-secondary); 
      color: white; 
    }
    .btn-secondary:hover:not(:disabled) { 
      background: var(--btn-secondary-hover); 
    }

    .btn-danger { 
      background: var(--btn-danger); 
      color: white; 
    }
    .btn-danger:hover:not(:disabled) { 
      background: var(--btn-danger-hover); 
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    button:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }

    .loading {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .dialog-content {
      padding: 20px;
      background: var(--bg-primary);
      color: var(--text-primary);
      border-radius: 8px;
      min-width: 400px;
      max-width: 90vw;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow);
    }

    .dialog-content h4 {
      margin-top: 0;
      color: var(--text-primary);
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    input[type="file"] {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-input);
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: border-color 0.3s ease, background-color 0.3s ease;
    }

    input[type="file"]:focus {
      outline: none;
      border-color: var(--btn-primary);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .file-info {
      background: var(--bg-tertiary);
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      font-size: 12px;
      color: var(--text-muted);
      border: 1px solid var(--border-color);
    }

    .hidden-input {
      display: none;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      button {
        min-width: auto;
        width: 100%;
      }
      
      .dialog-content {
        min-width: auto;
        width: 95vw;
        margin: 10px;
      }
      
      .button-group {
        flex-direction: column;
      }
    }

    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `}}a([l({type:String,attribute:"db-key"})],p.prototype,"dbKey",2);a([l({type:Object,attribute:!1})],p.prototype,"databaseConfig",2);a([l({type:String})],p.prototype,"buttonText",2);a([l({type:String,attribute:"button-class"})],p.prototype,"buttonClass",2);a([l({type:Boolean,reflect:!0})],p.prototype,"disabled",2);a([d()],p.prototype,"isProcessing",2);a([d()],p.prototype,"resolvedConfig",2);let x=class extends p{get defaultButtonText(){return"Exportar"}get defaultButtonClass(){return"btn-primary"}render(){return s`
      <button 
        class="${this.currentButtonClass}" 
        ?disabled="${this.isDisabled}"
        @click="${this._handleExport}" 
      >
        ${this.isProcessing?s`<span class="loading"></span>Exportando...`:this.currentButtonText}
      </button>
    `}async _handleExport(){const e=this.currentConfig;if(!(!e||this.isProcessing)){this.isProcessing=!0,this.dispatchEvent(new CustomEvent("export-start",{detail:{databaseConfig:e},bubbles:!0,composed:!0}));try{const t=await w(e),o={database:e,exportDate:new Date().toISOString(),recordCount:t.length,data:t},i=new Blob([JSON.stringify(o,null,2)],{type:"application/json"}),r=URL.createObjectURL(i),n=document.createElement("a");n.href=r,n.download=`${e.name}_export_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r),this._emitStatus({message:"Base de datos exportada correctamente.",type:"success",operation:"export",recordCount:t.length}),this.dispatchEvent(new CustomEvent("export-success",{detail:{databaseConfig:e,recordCount:t.length,exportData:o},bubbles:!0,composed:!0}))}catch(t){console.error("Error exportando base de datos:",t),this._emitStatus({message:"Error al exportar la base de datos.",type:"error",operation:"export"}),this.dispatchEvent(new CustomEvent("export-error",{detail:{databaseConfig:e,error:t},bubbles:!0,composed:!0}))}finally{this.isProcessing=!1,this.dispatchEvent(new CustomEvent("export-complete",{detail:{databaseConfig:e},bubbles:!0,composed:!0}))}}}};x=a([m("export-button")],x);let h=class extends p{constructor(){super(...arguments),this.showDialog=!0,this.dialogTitle="",this.warningMessage="Esta acción reemplazará todos los datos existentes.",this.showImportDialog=!1,this.importFile=null}get defaultButtonText(){return"Importar"}get defaultButtonClass(){return"btn-success"}render(){if(!this.currentConfig)return s`<button disabled>Configuración no disponible</button>`;const e=this.dialogTitle||`Importar a ${this.currentConfig.name}`;return s`
      <button 
        class="${this.currentButtonClass}" 
        ?disabled="${this.isDisabled}"
        @click="${this._handleClick}" 
      >
        ${this.isProcessing?s`<span class="loading"></span>Importando...`:this.currentButtonText}
      </button>

      ${this.showDialog&&this.showImportDialog?s`
        <dialog-container ?visible="${this.showImportDialog}" @close="${this._hideImportDialog}">
          <div class="dialog-content">
            <h4>${e}</h4>
            <p><strong>Advertencia:</strong> ${this.warningMessage}</p>
            
            <div class="form-group">
              <label for="import-file">Seleccionar archivo JSON:</label>
              <input 
                type="file" 
                id="import-file"
                accept=".json"
                @change="${this._handleFileChange}"
              />
              ${this.importFile?s`
                <div class="file-info">
                  <strong>Archivo:</strong> ${this.importFile.name}<br>
                  <strong>Tamaño:</strong> ${(this.importFile.size/1024).toFixed(2)} KB
                </div>
              `:""}
            </div>

            <div class="button-group">
              <button 
                class="btn-success"
                @click="${this._handleImport}"
                ?disabled="${!this.importFile||this.isProcessing}"
              >
                ${this.isProcessing?s`<span class="loading"></span>Importando...`:"Confirmar Importación"}
              </button>
              <button 
                class="btn-secondary"
                @click="${this._hideImportDialog}"
                ?disabled="${this.isProcessing}"
              >
                Cancelar
              </button>
            </div>
          </div>
        </dialog-container>
      `:""}

      ${this.showDialog?"":s`
        <input 
          type="file" 
          class="hidden-input"
          accept=".json"
          @change="${this._handleDirectFileChange}"
        />
      `}
    `}_handleClick(){this.showDialog?this._showImportDialog():this.shadowRoot?.querySelector(".hidden-input")?.click()}async _handleImport(){const e=this.currentConfig;if(!(!this.importFile||!e||this.isProcessing)){this.isProcessing=!0,this.dispatchEvent(new CustomEvent("import-start",{detail:{databaseConfig:e,file:this.importFile},bubbles:!0,composed:!0}));try{const t=await this.importFile.text(),o=JSON.parse(t);if(!o.data||!Array.isArray(o.data))throw new Error('Formato de archivo inválido. Se esperaba una propiedad "data" con un array.');await C(e,o.data),this._emitStatus({message:`Base de datos importada. ${o.data.length} registros procesados.`,type:"success",operation:"import",recordCount:o.data.length}),this.dispatchEvent(new CustomEvent("import-success",{detail:{databaseConfig:e,recordCount:o.data.length,importData:o.data},bubbles:!0,composed:!0})),this._hideImportDialog()}catch(t){console.error("Error importando base de datos:",t);const o=t instanceof Error?t.message:"Verifique el formato del archivo.";this._emitStatus({message:`Error al importar: ${o}`,type:"error",operation:"import"}),this.dispatchEvent(new CustomEvent("import-error",{detail:{databaseConfig:e,error:t,file:this.importFile},bubbles:!0,composed:!0}))}finally{this.isProcessing=!1,this.dispatchEvent(new CustomEvent("import-complete",{detail:{databaseConfig:e},bubbles:!0,composed:!0}))}}}_handleDirectFileChange(e){const o=e.target.files?.[0];o&&(this.importFile=o,this._handleImport())}_showImportDialog(){this.showImportDialog=!0,this.importFile=null}_hideImportDialog(){this.showImportDialog=!1,this.importFile=null}_handleFileChange(e){const t=e.target;this.importFile=t.files?.[0]||null}};a([l({type:Boolean,attribute:"show-dialog"})],h.prototype,"showDialog",2);a([l({type:String,attribute:"dialog-title"})],h.prototype,"dialogTitle",2);a([l({type:String,attribute:"warning-message"})],h.prototype,"warningMessage",2);a([d()],h.prototype,"showImportDialog",2);a([d()],h.prototype,"importFile",2);h=a([m("import-button")],h);let c=class extends f{constructor(){super(...arguments),this.databaseConfig=null,this.isExporting=!1,this.isImporting=!1,this.showImportDialog=!1,this.importFile=null}render(){const e=!this.databaseConfig;return s`
      <div class="section">
        <h3>Exportar ${this.databaseConfig?.name||"Base de Datos"}</h3>
        <p>Exporta todos los datos de la base de datos seleccionada a un archivo JSON.</p>
        <div class="button-group">
          <button class="btn-primary" @click="${this._handleExport}" ?disabled="${e||this.isExporting}">
            ${this.isExporting?s`<span class="loading"></span>Exportando...`:"Exportar"}
          </button>
        </div>
      </div>

      <div class="section">
        <h3>Importar a ${this.databaseConfig?.name||"Base de Datos"}</h3>
        <p>Importa datos desde un archivo JSON. Esto reemplazará todos los datos existentes.</p>
        <div class="button-group">
          <button class="btn-success" @click="${this._showImportDialog}" ?disabled="${e||this.isImporting}">
            Importar
          </button>
        </div>
      </div>

      <dialog-container ?visible="${this.showImportDialog}" @close="${this._hideImportDialog}">
        <div class="dialog-content">
            <h4>Importar a ${this.databaseConfig?.name}</h4>
            <p><strong>Advertencia:</strong> Esta acción cambiara todos los elementos anteriors.</p>
            
            <div class="form-group">
              <label for="import-file">Seleccionar archivo JSON:</label>
              <input 
                type="file" 
                id="import-file"
                accept=".json"
                @change="${this._handleFileChange}"
              />
              ${this.importFile?s`
                <div class="file-info">
                  <strong>Archivo:</strong> ${this.importFile.name}<br>
                  <strong>Tamaño:</strong> ${(this.importFile.size/1024).toFixed(2)} KB
                </div>
              `:""}
            </div>

            <div class="button-group">
              <button 
                class="btn-success"
                @click="${this._handleImport}"
                ?disabled="${!this.importFile||this.isImporting}"
              >
                ${this.isImporting?s`<span class="loading"></span>Importando...`:"Confirmar Importación"}
              </button>
              <button 
                class="btn-secondary"
                @click="${this._hideImportDialog}"
                ?disabled="${this.isImporting}"
              >
                Cancelar
              </button>
            </div>
          </div>
      </dialog-container>
    `}_emitStatus(e){this.dispatchEvent(new CustomEvent("operation-status",{detail:e,bubbles:!0,composed:!0}))}async _handleExport(){if(this.databaseConfig){this.isExporting=!0;try{const e=await w(this.databaseConfig),t={database:this.databaseConfig,exportDate:new Date().toISOString(),recordCount:e.length,data:e},o=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(o),r=document.createElement("a");r.href=i,r.download=`${this.databaseConfig.name}_export_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i),this._emitStatus({message:"Base de datos exportada correctamente.",type:"success",operation:"export",recordCount:e.length})}catch(e){console.error("Error exportando base de datos:",e),this._emitStatus({message:"Error al exportar la base de datos.",type:"error",operation:"export"})}finally{this.isExporting=!1}}}async _handleImport(){if(!(!this.importFile||!this.databaseConfig)){this.isImporting=!0;try{const e=await this.importFile.text(),t=JSON.parse(e);if(!t.data||!Array.isArray(t.data))throw new Error('Formato de archivo inválido. Se esperaba una propiedad "data" con un array.');await C(this.databaseConfig,t.data),this._emitStatus({message:`Base de datos importada. ${t.data.length} registros procesados.`,type:"success",operation:"import",recordCount:t.data.length}),this._hideImportDialog()}catch(e){console.error("Error importando base de datos:",e);const t=e instanceof Error?e.message:"Verifique el formato del archivo.";this._emitStatus({message:`Error al importar: ${t}`,type:"error",operation:"import"})}finally{this.isImporting=!1}}}_showImportDialog(){this.showImportDialog=!0,this.importFile=null}_hideImportDialog(){this.showImportDialog=!1,this.importFile=null}_handleFileChange(e){const t=e.target;this.importFile=t.files?.[0]||null}};c.styles=y`
    :host {
        display: block;
        font-family: system-ui, -apple-system, sans-serif;
        color-scheme: light dark;
        
        /* Custom Properties - Light Theme (default) */
        --bg-primary: #ffffff;
        --bg-secondary: #fafafa;
        --bg-tertiary: #f8f9fa;
        --border-color: #e0e0e0;
        --border-input: #ccc;
        --text-primary: #333;
        --text-secondary: #555;
        --text-muted: #666;
        --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        /* Button Colors */
        --btn-primary: #007bff;
        --btn-primary-hover: #0056b3;
        --btn-success: #28a745;
        --btn-success-hover: #1e7e34;
        --btn-secondary: #6c757d;
        --btn-secondary-hover: #545b62;
    }

    /* Dark Theme */
    @media (prefers-color-scheme: dark) {
        :host {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --bg-tertiary: #333333;
        --border-color: #404040;
        --border-input: #555;
        --text-primary: #e0e0e0;
        --text-secondary: #b0b0b0;
        --text-muted: #888;
        --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
    }

    /* Force Light Theme Override */
    :host([theme="light"]) {
        color-scheme: light;
        --bg-primary: #ffffff;
        --bg-secondary: #fafafa;
        --bg-tertiary: #f8f9fa;
        --border-color: #e0e0e0;
        --border-input: #ccc;
        --text-primary: #333;
        --text-secondary: #555;
        --text-muted: #666;
        --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Force Dark Theme Override */
    :host([theme="dark"]) {
        color-scheme: dark;
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --bg-tertiary: #333333;
        --border-color: #404040;
        --border-input: #555;
        --text-primary: #e0e0e0;
        --text-secondary: #b0b0b0;
        --text-muted: #888;
        --shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .section {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-secondary);
        box-shadow: var(--shadow);
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .section h3 {
        margin-top: 0;
        color: var(--text-primary);
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: var(--text-secondary);
    }

    input[type="file"] {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--border-input);
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: border-color 0.3s ease, background-color 0.3s ease;
    }

    input[type="file"]:focus {
        outline: none;
        border-color: var(--btn-primary);
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .button-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        min-width: 120px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
    }

    .btn-primary { 
        background: var(--btn-primary); 
        color: white; 
    }
    .btn-primary:hover:not(:disabled) { 
        background: var(--btn-primary-hover); 
    }

    .btn-success { 
        background: var(--btn-success); 
        color: white; 
    }
    .btn-success:hover:not(:disabled) { 
        background: var(--btn-success-hover); 
    }

    .btn-secondary { 
        background: var(--btn-secondary); 
        color: white; 
    }
    .btn-secondary:hover:not(:disabled) { 
        background: var(--btn-secondary-hover); 
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    button:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }

    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .dialog-content {
        padding: 20px;
        background: var(--bg-primary);
        color: var(--text-primary);
        border-radius: 8px;
        min-width: 400px;
        max-width: 90vw;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
    }

    .dialog-content h4 {
        margin-top: 0;
        color: var(--text-primary);
    }

    .file-info {
        background: var(--bg-tertiary);
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
        font-size: 12px;
        color: var(--text-muted);
        border: 1px solid var(--border-color);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .section {
        margin-bottom: 20px;
        padding: 15px;
        }
        
        .button-group {
        flex-direction: column;
        }
        
        button {
        min-width: auto;
        width: 100%;
        }
        
        .dialog-content {
        min-width: auto;
        width: 95vw;
        margin: 10px;
        }
    }

    /* High Contrast Mode Support */
    @media (prefers-contrast: high) {
        :host {
        --border-color: currentColor;
        --border-input: currentColor;
        }
        
        .section {
        border-width: 2px;
        }
        
        button {
        border: 2px solid transparent;
        }
        
        button:focus {
        border-color: currentColor;
        }
    }

    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
        * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        }
    }
    `;a([l({type:Object,attribute:!1})],c.prototype,"databaseConfig",2);a([d()],c.prototype,"isExporting",2);a([d()],c.prototype,"isImporting",2);a([d()],c.prototype,"showImportDialog",2);a([d()],c.prototype,"importFile",2);c=a([m("database-actions")],c);var _=Object.defineProperty,E=Object.getOwnPropertyDescriptor,g=(e,t,o,i)=>{for(var r=i>1?void 0:i?E(t,o):t,n=e.length-1,u;n>=0;n--)(u=e[n])&&(r=(i?u(t,o,r):u(r))||r);return i&&r&&_(t,o,r),r};let b=class extends f{constructor(){super(...arguments),this.dbKey="",this.databaseConfig=null,this.statusMessage="",this.statusType="success",this.isStatusVisible=!1}updated(e){if(e.has("dbKey")&&this.dbKey){const t=v[this.dbKey];t?this.databaseConfig=t:(console.warn(`La clave de base de datos '${this.dbKey}' no fue encontrada.`),this.databaseConfig=null)}}render(){return this.databaseConfig?s`
        <!-- El título ahora es específico para la DB gestionada -->
        <h2>Gestor para: ${this.databaseConfig.name}</h2>
        
        
        <!-- Usamos directamente el componente de acciones, pasándole la config -->
        <database-actions
        .databaseConfig="${this.databaseConfig}"
        @operation-status="${this._handleOperationStatus}"
        ></database-actions>
        <div 
          class="status-message status-${this.statusType} ${this.isStatusVisible?"visible":""}"
        >
          ${this.statusMessage}
        </div>
    `:s`
        <div class="container">
          <p>Error: La clave de base de datos "${this.dbKey}" no es válida o no ha sido proporcionada.</p>
        </div>
      `}_handleOperationStatus(e){const{message:t,type:o}=e.detail;this.statusMessage=t,this.statusType=o,this.isStatusVisible=!0,setTimeout(()=>{this.isStatusVisible=!1},5e3)}};b.styles=y`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .status-message {
      padding: 10px;
      border-radius: 4px;
      margin: 20px 0;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      visibility: hidden;
    }
    .status-message.visible {
      opacity: 1;
      transform: translateY(0);
      visibility: visible;
    }
    .status-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .status-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  `;g([l({type:String,attribute:"db-key"})],b.prototype,"dbKey",2);g([d()],b.prototype,"databaseConfig",2);g([d()],b.prototype,"statusMessage",2);g([d()],b.prototype,"statusType",2);g([d()],b.prototype,"isStatusVisible",2);b=g([m("single-dbmanager")],b);

import{i as h,r as m}from"./lit-element.CdPzzhzS.js";import{x as l}from"./lit-html.Cs9YtZST.js";import{t as u}from"./custom-element.BhZVzxrc.js";import{n as g,r as n}from"./state.k4TxN2nw.js";import{g as f,i as y,d as x}from"./idb.CMvsdVSJ.js";var v=Object.defineProperty,w=Object.getOwnPropertyDescriptor,c=(t,e,r,a)=>{for(var o=a>1?void 0:a?w(e,r):e,d=t.length-1,p;d>=0;d--)(p=t[d])&&(o=(a?p(e,r,o):p(o))||o);return a&&o&&v(e,r,o),o};let s=class extends m{constructor(){super(...arguments),this.databaseConfig=null,this.isExporting=!1,this.isImporting=!1,this.showImportDialog=!1,this.importFile=null}render(){const t=!this.databaseConfig;return l`
      <div class="section">
        <h3>Exportar ${this.databaseConfig?.name||"Base de Datos"}</h3>
        <p>Exporta todos los datos de la base de datos seleccionada a un archivo JSON.</p>
        <div class="button-group">
          <button class="btn-primary" @click="${this._handleExport}" ?disabled="${t||this.isExporting}">
            ${this.isExporting?l`<span class="loading"></span>Exportando...`:"Exportar"}
          </button>
        </div>
      </div>

      <div class="section">
        <h3>Importar a ${this.databaseConfig?.name||"Base de Datos"}</h3>
        <p>Importa datos desde un archivo JSON. Esto reemplazará todos los datos existentes.</p>
        <div class="button-group">
          <button class="btn-success" @click="${this._showImportDialog}" ?disabled="${t||this.isImporting}">
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
              ${this.importFile?l`
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
                ${this.isImporting?l`<span class="loading"></span>Importando...`:"Confirmar Importación"}
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
    `}_emitStatus(t){this.dispatchEvent(new CustomEvent("operation-status",{detail:t,bubbles:!0,composed:!0}))}async _handleExport(){if(this.databaseConfig){this.isExporting=!0;try{const t=await f(this.databaseConfig),e={database:this.databaseConfig,exportDate:new Date().toISOString(),recordCount:t.length,data:t},r=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=URL.createObjectURL(r),o=document.createElement("a");o.href=a,o.download=`${this.databaseConfig.name}_export_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a),this._emitStatus({message:"Base de datos exportada correctamente.",type:"success",operation:"export",recordCount:t.length})}catch(t){console.error("Error exportando base de datos:",t),this._emitStatus({message:"Error al exportar la base de datos.",type:"error",operation:"export"})}finally{this.isExporting=!1}}}async _handleImport(){if(!(!this.importFile||!this.databaseConfig)){this.isImporting=!0;try{const t=await this.importFile.text(),e=JSON.parse(t);if(!e.data||!Array.isArray(e.data))throw new Error('Formato de archivo inválido. Se esperaba una propiedad "data" con un array.');await y(this.databaseConfig,e.data),this._emitStatus({message:`Base de datos importada. ${e.data.length} registros procesados.`,type:"success",operation:"import",recordCount:e.data.length}),this._hideImportDialog()}catch(t){console.error("Error importando base de datos:",t);const e=t instanceof Error?t.message:"Verifique el formato del archivo.";this._emitStatus({message:`Error al importar: ${e}`,type:"error",operation:"import"})}finally{this.isImporting=!1}}}_showImportDialog(){this.showImportDialog=!0,this.importFile=null}_hideImportDialog(){this.showImportDialog=!1,this.importFile=null}_handleFileChange(t){const e=t.target;this.importFile=e.files?.[0]||null}};s.styles=h`
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
    `;c([g({type:Object,attribute:!1})],s.prototype,"databaseConfig",2);c([n()],s.prototype,"isExporting",2);c([n()],s.prototype,"isImporting",2);c([n()],s.prototype,"showImportDialog",2);c([n()],s.prototype,"importFile",2);s=c([u("database-actions")],s);var C=Object.defineProperty,$=Object.getOwnPropertyDescriptor,b=(t,e,r,a)=>{for(var o=a>1?void 0:a?$(e,r):e,d=t.length-1,p;d>=0;d--)(p=t[d])&&(o=(a?p(e,r,o):p(o))||o);return a&&o&&C(e,r,o),o};let i=class extends m{constructor(){super(...arguments),this.dbKey="",this.databaseConfig=null,this.statusMessage="",this.statusType="success",this.isStatusVisible=!1}updated(t){if(t.has("dbKey")&&this.dbKey){const e=x[this.dbKey];e?this.databaseConfig=e:(console.warn(`La clave de base de datos '${this.dbKey}' no fue encontrada.`),this.databaseConfig=null)}}render(){return this.databaseConfig?l`
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
    `:l`
        <div class="container">
          <p>Error: La clave de base de datos "${this.dbKey}" no es válida o no ha sido proporcionada.</p>
        </div>
      `}_handleOperationStatus(t){const{message:e,type:r}=t.detail;this.statusMessage=e,this.statusType=r,this.isStatusVisible=!0,setTimeout(()=>{this.isStatusVisible=!1},5e3)}};i.styles=h`
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
  `;b([g({type:String,attribute:"db-key"})],i.prototype,"dbKey",2);b([n()],i.prototype,"databaseConfig",2);b([n()],i.prototype,"statusMessage",2);b([n()],i.prototype,"statusType",2);b([n()],i.prototype,"isStatusVisible",2);i=b([u("single-dbmanager")],i);

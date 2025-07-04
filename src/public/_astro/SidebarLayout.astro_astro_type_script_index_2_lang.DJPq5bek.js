import"./ActionsEvents.astro_astro_type_script_index_5_lang.B-YzpAMS.js";import{i as u,n as i,r as f}from"./property.DTDKM9eR.js";import{x as p}from"./lit-html.Cs9YtZST.js";import{t as h}from"./custom-element.BhZVzxrc.js";import{o as x,a as v}from"./CInput.CBocR2SB.js";import{e as m}from"./class-map.D2HkPoOL.js";import"./custom-modal.CgDW9wK3.js";import{r as y}from"./state.5GRZVynF.js";import{C as k}from"./ConfigurableReplacer.CYudszKX.js";import"./tables.N5H2Fe0U.js";import"./directive.CGE4aKEl.js";import"./unsafe-html.o8VIWoCg.js";var _=Object.defineProperty,w=Object.getOwnPropertyDescriptor,s=(e,o,t,r)=>{for(var a=r>1?void 0:r?w(o,t):o,n=e.length-1,c;n>=0;n--)(c=e[n])&&(a=(r?c(o,t,a):c(a))||a);return r&&a&&_(o,t,a),a};let d=class extends f{constructor(){super(...arguments),this.title="",this.description="",this.theme="light",this.options=[]}render(){const e={container:!0,[this.theme]:!0};return p`
      <div class=${m(e)}>
        <h2 class="title">${this.title}</h2>
        <pre class="description">${this.description}</pre>
        <slot></slot>
        <div class="options">
          ${x(this.options,(o,t)=>p`<button 
              @click=${r=>this._handleOptionClick(r,t)}
              data-index="${t}"
              class=${v(o.class)}
              style=${v(o.style)}
            >${o.label}</button>`)}
        </div>
      </div>
    `}_handleOptionClick(e,o){const t=this.options[o];t?.callback&&typeof t.callback=="function"?t.callback(e):console.warn(`No se encontró un callback válido para la opción con índice ${o}`)}};d.styles=u`
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
    
    /* ... el resto de tus estilos van aquí, no necesitan cambios ... */
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
  `;s([i({type:String,reflect:!0})],d.prototype,"title",2);s([i({type:String,reflect:!0})],d.prototype,"description",2);s([i({type:String,reflect:!0})],d.prototype,"theme",2);s([i({type:Array})],d.prototype,"options",2);d=s([h("c-dlg")],d);let b=class extends f{constructor(){super(...arguments),this.visible=!1,this.required=!1}render(){const e={"dlg-ov":!0,visible:this.visible};return p`
      <div class=${m(e)} @click=${this._handleOverlayClick}>
        <div class="dlg-cnt">
          <slot></slot>
        </div>
      </div>
    `}_handleOverlayClick(e){e.target===e.currentTarget&&!this.required&&(this.hide(),this.emitClose())}emitClose(){this.dispatchEvent(new CustomEvent("close"))}show(){this.visible=!0}hide(){this.visible=!1}};b.styles=u`
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

    /* ... el resto de tus estilos van aquí, no necesitan cambios ... */
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
  `;s([i({type:Boolean,reflect:!0})],b.prototype,"visible",2);s([i({type:Boolean,reflect:!0})],b.prototype,"required",2);b=s([h("dlg-cont")],b);var C=Object.defineProperty,$=Object.getOwnPropertyDescriptor,g=(e,o,t,r)=>{for(var a=r>1?void 0:r?$(o,t):o,n=e.length-1,c;n>=0;n--)(c=e[n])&&(a=(r?c(o,t,a):c(a))||a);return r&&a&&C(o,t,a),a};let l=class extends f{constructor(){super(),this.replacements=[],this.removeBackslashes=!0,this.useLocalStorage=!0,this.instanceId="default",this._tableData=[],this._tableKeys=["pattern","dataKey","defaultValue"],this._initializeData()}connectedCallback(){super.connectedCallback(),this._setupTableEvents()}_initializeData(){this._updateTableData()}_setupTableEvents(){this.addEventListener("action",this._handleTableAction.bind(this))}_handleTableAction(e){const{originalAction:o,item:t,index:r}=e.detail;switch(o){case"edit":this._editReplacement(t,r);break;case"delete":this._removeReplacement(t.id);break;default:console.log(`Acción no manejada: ${o}`,t)}}_editReplacement(e,o){const t=prompt("Nuevo patrón:",e.pattern);if(t!==null){const r=prompt("Nueva clave de datos:",e.dataKey);if(r!==null){const a=prompt("Nuevo valor por defecto:",e.defaultValue);a!==null&&this._updateReplacement(e.id,{pattern:t,dataKey:r,defaultValue:a})}}}_updateTableData(){this._tableData=[...this.replacements],this._updateTable()}_updateTable(){this.requestUpdate()}_convertReplacementConfigToItems(e){return Object.entries(e).map(([o,t])=>({id:Date.now()+Math.random(),pattern:o,dataKey:t.dataKey,defaultValue:t.defaultValue}))}_convertItemsToReplacementConfig(e){const o={};return e.forEach(t=>{t.pattern.trim()&&t.dataKey.trim()&&(o[t.pattern]={dataKey:t.dataKey,defaultValue:t.defaultValue})}),o}_addReplacement(){const e={id:Date.now()+Math.random(),pattern:"",dataKey:"",defaultValue:""};this.replacements=[...this.replacements,e],this._updateTableData(),this._notifyChange()}_removeReplacement(e){this.replacements=this.replacements.filter(o=>o.id!==e),this._updateTableData(),this._notifyChange()}_updateReplacement(e,o){this.replacements=this.replacements.map(t=>t.id===e?{...t,...o}:t),this._updateTableData(),this._notifyChange()}_notifyChange(){const e=new CustomEvent("replacements-change",{detail:{replacements:this.replacements},bubbles:!0,composed:!0});this.dispatchEvent(e)}_saveConfiguration(){const e={removeBackslashes:this.removeBackslashes,useLocalStorage:this.useLocalStorage,replacements:this._convertItemsToReplacementConfig(this.replacements)};new k(e).saveConfig(),typeof localStorage<"u"&&localStorage.setItem(`configReplacer_${this.instanceId}`,JSON.stringify(e)),console.log("Configuración guardada:",e),this._showNotification("✅ Configuración guardada exitosamente!")}_exportConfig(){const e={removeBackslashes:this.removeBackslashes,useLocalStorage:this.useLocalStorage,replacements:this._convertItemsToReplacementConfig(this.replacements),exportedAt:new Date().toISOString()},o=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),t=URL.createObjectURL(o),r=document.createElement("a");r.href=t,r.download=`replacer-config-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(t),this._showNotification("📤 Configuración exportada exitosamente!")}_importConfig(){const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=o=>{const t=o.target.files?.[0];if(!t)return;const r=new FileReader;r.onload=a=>{try{const n=JSON.parse(a.target?.result);this.instanceId="default",this.removeBackslashes=n.removeBackslashes??!0,this.useLocalStorage=n.useLocalStorage??!0,n.replacements&&(this.replacements=this._convertReplacementConfigToItems(n.replacements),this._updateTableData()),this._showNotification("✅ Configuración importada exitosamente!"),this._notifyChange()}catch(n){console.error("Error importing config:",n),this._showNotification(`❌ Error al importar configuración: ${n.message}`)}},r.readAsText(t)},e.click()}_showNotification(e){alert(e)}updated(e){super.updated(e),e.has("replacements")&&this._updateTableData()}render(){return p`
      <div class="config-container">
        <section class="config-section">
          <div class="section-header">
            <h2 class="section-title">Configuración de Reemplazos</h2>
            <div class="action-buttons">
              <button 
                type="button" 
                @click=${this._addReplacement}
                class="button button-success"
              >
                ➕ Agregar Reemplazo
              </button>
              <button 
                type="button" 
                @click=${this._saveConfiguration}
                class="button button-success"
              >
                💾 Guardar Configuración
              </button>
              <button 
                type="button" 
                @click=${this._importConfig}
                class="button button-warning"
              >
                📥 Importar Configuración
              </button>
              <button 
                type="button" 
                @click=${this._exportConfig}
                class="button button-info"
              >
                📤 Exportar Configuración
              </button>
            </div>
          </div>
          
          <div class="replacements-container">
            ${this._tableData.length>0?p`
                <div class="table-container">
                  <obj-table
                    .data=${this._tableData}
                    .keys=${this._tableKeys}
                  ></obj-table>
                </div>
              `:p`
                <div class="no-replacements">
                  No hay reemplazos configurados. Haz clic en "Agregar Reemplazo" para comenzar.
                </div>
              `}
          </div>
        </section>
      </div>
    `}};l.styles=u`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      
      /* Variables CSS para temas */
      --primary-color: #007bff;
      --success-color: #28a745;
      --warning-color: #ffc107;
      --info-color: #17a2b8;
      --danger-color: #dc3545;
      --light-color: #f8f9fa;
      --dark-color: #343a40;
      --border-color: #dee2e6;
      --border-radius: 4px;
      --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      --transition: all 0.2s ease-in-out;
    }

    .config-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .config-section {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      margin-bottom: 20px;
      box-shadow: var(--box-shadow);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      background: var(--light-color);
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .section-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--dark-color);
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .button {
      padding: 8px 16px;
      border: none;
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .button:active {
      transform: translateY(0);
    }

    .button-success {
      background-color: var(--success-color);
    }

    .button-success:hover {
      background-color: #218838;
    }

    .button-warning {
      background-color: var(--warning-color);
      color: #212529;
    }

    .button-warning:hover {
      background-color: #e0a800;
    }

    .button-info {
      background-color: var(--info-color);
      color: white;
    }

    .button-info:hover {
      background-color: #138496;
    }

    .button-danger {
      background-color: var(--danger-color);
      color: white;
    }

    .button-danger:hover {
      background-color: #c82333;
    }

    .replacements-container {
      padding: 20px;
    }

    .no-replacements {
      text-align: center;
      padding: 40px 20px;
      color: #6c757d;
      font-style: italic;
    }

    .table-container {
      margin-top: 20px;
    }

    obj-table {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 15px;
      align-items: end;
      padding: 15px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      margin-bottom: 10px;
      background: #f8f9fa;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-weight: 500;
      margin-bottom: 5px;
      color: var(--dark-color);
      font-size: 0.875rem;
    }

    .form-input {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      font-size: 0.875rem;
      transition: var(--transition);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-input-mono {
      font-family: 'Courier New', Consolas, monospace;
    }

    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .action-buttons {
        justify-content: center;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }
  `;g([i({type:Array})],l.prototype,"replacements",2);g([i({type:Boolean})],l.prototype,"removeBackslashes",2);g([i({type:Boolean})],l.prototype,"useLocalStorage",2);g([i({type:String})],l.prototype,"instanceId",2);g([y()],l.prototype,"_tableData",2);g([y()],l.prototype,"_tableKeys",2);l=g([h("replacer-config-form")],l);

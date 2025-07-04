import{r as v,i as h,n as c}from"./property.DTDKM9eR.js";import{x as s,E as u}from"./lit-html.Cs9YtZST.js";import{t as y}from"./custom-element.BhZVzxrc.js";import{r as g}from"./state.5GRZVynF.js";import{e as x}from"./class-map.D2HkPoOL.js";import"./directive.CGE4aKEl.js";var w=Object.defineProperty,$=Object.getOwnPropertyDescriptor,i=(r,t,o,e)=>{for(var a=e>1?void 0:e?$(t,o):t,l=r.length-1,d;l>=0;l--)(d=r[l])&&(a=(e?d(t,o,a):d(a))||a);return e&&a&&w(t,o,a),a};class n extends v{constructor(){super(...arguments),this.data=[],this.keys=[],this.actions=[],this.darkMode=!1}toggleDarkMode(){this.darkMode=!this.darkMode}static{this.styles=h`
    :host {
      display: block;
      --text-color-primary: #212529;
      --text-color-secondary: #6c757d;
      --text-color-muted: #868e96;
      --text-color-link: #007bff;
      --text-color-success: #198754;
      --text-color-danger: #dc3545;
      --text-color-info-on-light: #004085;
      --text-color-danger-on-light: #721c24;
      --text-color-light: #f8f9fa;
      --bg-color-primary: #ffffff;
      --bg-color-secondary: #f8f9fa;
      --bg-color-tertiary: #e9ecef;
      --bg-color-table-header: #f2f2f2;
      --bg-color-table-even-row: #f9f9f9;
      --bg-color-button: #ffffff;
      --bg-color-button-hover-brightness: 0.95;
      --bg-color-button-alt: #f0f0f0;
      --bg-color-button-alt-hover: #e0e0e0;
      --bg-color-edit: #e7f3ff;
      --bg-color-delete: #f8d7da;
      --border-color-primary: #dee2e6;
      --border-color-secondary: #ced4da;
      --border-color-table: #ddd;
      --border-color-edit: #b8daff;
      --border-color-delete: #f5c6cb;
      --shadow-color-soft: rgba(0, 0, 0, 0.08);
      --shadow-color-medium: rgba(0, 0, 0, 0.12);
      --transition-speed: 0.2s;
      --transition-ease: ease-out;
    }

    :host([darkmode]) {
      --text-color-primary: #e9ecef;
      --text-color-secondary: #adb5bd;
      --text-color-muted: #868e96;
      --text-color-link: #64b5f6;
      --text-color-success: #81c784;
      --text-color-danger: #ef9a9a;
      --text-color-info-on-light: #ffffff;
      --text-color-danger-on-light: #ffffff;
      --text-color-light: #e9ecef;
      --bg-color-primary: #212529;
      --bg-color-secondary: #343a40;
      --bg-color-tertiary: #495057;
      --bg-color-table-header: #343a40;
      --bg-color-table-even-row: #2c3034;
      --bg-color-button: #495057;
      --bg-color-button-hover-brightness: 1.1;
      --bg-color-button-alt: #5a6268;
      --bg-color-button-alt-hover: #6c757d;
      --bg-color-edit: #0056b3;
      --bg-color-delete: #c82333;
      --border-color-primary: #495057;
      --border-color-secondary: #6c757d;
      --border-color-table: #454d55;
      --border-color-edit: #004085;
      --border-color-delete: #a71d2a;
      --shadow-color-soft: rgba(255, 255, 255, 0.05);
      --shadow-color-medium: rgba(255, 255, 255, 0.08);
    }

    .ctr {
      background-color: var(--bg-color-primary);
      color: var(--text-color-primary);
    }
    .no-data {
      padding: 15px;
      text-align: center;
      color: var(--text-color-secondary);
      background-color: var(--bg-color-secondary);
      border-radius: 4px;
    }
    button {
      cursor: pointer;
      margin: 0 4px;
      padding: 4px 8px;
      border: 1px solid var(--border-color-secondary);
      border-radius: 3px;
      font-size: 0.9em;
      background-color: var(--bg-color-button);
      color: var(--text-color-primary);
      transition: filter var(--transition-speed) var(--transition-ease), background-color var(--transition-speed) var(--transition-ease);
    }
    button:hover {
      filter: brightness(var(--bg-color-button-hover-brightness));
    }
    .edit-btn {
      background-color: var(--bg-color-edit);
      border-color: var(--border-color-edit);
      color: var(--text-color-info-on-light);
    }
    .delete-btn {
      background-color: var(--bg-color-delete);
      color: var(--text-color-danger-on-light);
      border-color: var(--border-color-delete);
    }
  `}setData(t=[],o=[]){if(!Array.isArray(t)||!Array.isArray(o)){console.error(`${this.constructor.name}: data & keys must be arrays.`),this.data=[],this.keys=[];return}try{this.data=JSON.parse(JSON.stringify(t))}catch(e){console.error(`${this.constructor.name}: Error copying data`,e),this.data=[]}this.keys=[...o]}addItem(t){if(!t||typeof t!="object"){console.error(`${this.constructor.name}: item must be an object.`,t);return}try{this.data=[...this.data,JSON.parse(JSON.stringify(t))]}catch(o){console.error(`${this.constructor.name}: Error copying item`,o)}}addAction(t,o,e=""){if(typeof t!="string"||!t||typeof o!="string"){console.error(`${this.constructor.name}: Invalid action (name, label).`);return}this.actions=[...this.actions.filter(a=>a.name!==t),{name:t,label:o,className:e||""}]}_emitEv(t,o){if(o<0||o>=this.data.length){console.warn(`${this.constructor.name}: Invalid index ${o} for action ${t}`);return}const e=this.data[o],a={originalAction:t,item:JSON.parse(JSON.stringify(e)),index:o};try{this.dispatchEvent(new CustomEvent("internal-action",{detail:a,bubbles:!0,composed:!0}))}catch(l){console.error(`${this.constructor.name}: Error dispatching event internal-action`,l)}}_renderActionsDBButtons(t){let o=[...this.actions];return(this.data.length>0||this.keys.length>0)&&(o.some(e=>e.name==="edit")||o.unshift({name:"edit",label:"Editar",className:"edit-btn"}),o.some(e=>e.name==="delete")||o.push({name:"delete",label:"Eliminar",className:"delete-btn"})),o.map(e=>s`
      <button
        class="${e.className||""} ${e.name==="edit"?"edit-btn":""} ${e.name==="delete"?"delete-btn":""}"
        @click=${()=>this._emitEv(e.name,t)}>
        ${e.label}
      </button>
    `)}}i([c({type:Array})],n.prototype,"data",2);i([c({type:Array})],n.prototype,"keys",2);i([c({type:Array})],n.prototype,"actions",2);i([c({type:Boolean,reflect:!0,attribute:"darkmode"})],n.prototype,"darkMode",2);let f=class extends n{render(){return this.data?.length?this.keys?.length?s`
      <div class="ctr">
        <table>
          <thead>
            <tr>
              ${this.keys.map(r=>s`<th>${r}</th>`)}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.data.map((r,t)=>s`
              <tr data-idx=${t}>
                ${this.keys.map(o=>{const e=r[o];let a=e!=null?String(e):"";return typeof e=="boolean"&&(a=e?"Sí":"No"),s`<td class="${typeof e=="string"&&e.length>50?"wrap":""}">${a}</td>`})}
                <td class="acts-cell">
                  ${this._renderActionsDBButtons(t)}
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `:s`<div class="no-data">No hay claves.</div>`:s`<div class="no-data">No hay datos.</div>`}};f.styles=[n.styles,h`
      :host {
        border: 1px solid var(--border-color-primary);
        border-radius: 5px;
      }
      .ctr { overflow-x: auto; }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95em;
      }
      th, td {
        border: 1px solid var(--border-color-table);
        padding: 8px 10px;
        text-align: left;
        vertical-align: middle;
        white-space: nowrap;
        color: var(--text-color-primary);
      }
      td.wrap { white-space: normal; }
      th {
        background-color: var(--bg-color-table-header);
        font-weight: 600;
        text-transform: capitalize;
        position: sticky;
        top: 0;
        z-index: 1;
        color: var(--text-color-primary);
      }
      tr:nth-child(even) {
        background-color: var(--bg-color-table-even-row);
      }
      tr:hover {
        background-color: var(--bg-color-tertiary);
      }
      .acts-cell {
        width: 1%;
        text-align: center;
        padding: 4px 8px;
      }
      .acts-cell button { margin: 2px; }
    `];f=i([y("object-table-lit")],f);let b=class extends n{constructor(){super(...arguments),this.layout="flex",this.perRow=3,this.hdrKey=null}updated(r){r.has("perRow")&&this.style.setProperty("--per-row",String(this.perRow||3))}render(){if(!this.data?.length)return s`<div class="ctr no-data">No hay datos.</div>`;if(!this.keys?.length)return s`<div class="ctr no-data">No hay claves.</div>`;const r={ctr:!0,grid:this.layout==="grid"};return s`
      <div class=${x(r)}>
        ${this.data.map((t,o)=>s`
          <div class="card" data-idx=${o}>
            ${this.hdrKey&&t[this.hdrKey]!==void 0?s`
              <div class="card-hdr">${t[this.hdrKey]}</div>
            `:u}
            <div class="card-cnt">
              ${this.keys.map(e=>{if(e===this.hdrKey)return u;const a=t[e];let l=a!=null?String(a):"",d="prop-val";return typeof a=="boolean"&&(l=a?"Sí":"No",d+=a?" bool-t":" bool-f"),s`
                  <div class="card-prop">
                    <div class="prop-lbl">${e}</div>
                    <div class="${d}">${l}</div>
                  </div>
                `})}
            </div>
            <div class="card-acts">
              ${this._renderActionsDBButtons(o)}
            </div>
          </div>
        `)}
      </div>
    `}};b.styles=[n.styles,h`
      :host { --per-row: 3; }
      .ctr { display: flex; flex-wrap: wrap; gap: 16px; }
      .ctr.grid { display: grid; grid-template-columns: repeat(var(--per-row, 3), 1fr); }
      .card {
        background-color: var(--bg-color-secondary);
        border: 1px solid var(--border-color-primary);
        border-radius: 8px;
        box-shadow: 0 1px 4px var(--shadow-color-soft);
        overflow: hidden;
        transition: transform var(--transition-speed) var(--transition-ease), box-shadow var(--transition-speed) var(--transition-ease);
        display: flex;
        flex-direction: column;
      }
      .ctr:not(.grid) .card { flex: 1 1 calc(33.333% - 11px); min-width: 250px; }
      .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 3px 10px var(--shadow-color-medium);
      }
      .card-hdr {
        background-color: var(--bg-color-tertiary);
        padding: 10px 15px;
        font-weight: 600;
        border-bottom: 1px solid var(--border-color-primary);
        font-size: 1.05em;
        color: var(--text-color-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .card-cnt { padding: 15px; flex-grow: 1; }
      .card-prop { margin-bottom: 10px; display: flex; flex-direction: column; gap: 2px; }
      .card-prop:last-child { margin-bottom: 0; }
      .prop-lbl {
        font-weight: 500;
        color: var(--text-color-muted);
        font-size: 0.8em;
        text-transform: capitalize;
      }
      .prop-val {
        word-break: break-word;
        font-size: 0.95em;
        color: var(--text-color-primary);
      }
      .prop-val.bool-t { font-style: italic; color: var(--text-color-success); }
      .prop-val.bool-f { font-style: italic; color: var(--text-color-secondary); }
      .card-acts {
        padding: 10px 15px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        background-color: var(--bg-color-tertiary);
        border-top: 1px solid var(--border-color-primary);
        margin-top: auto;
      }
      .card-acts button { padding: 6px 12px; }
      @media (max-width: 992px) { .ctr:not(.grid) .card { flex-basis: calc(50% - 8px); } :host { --per-row: 2; } }
      @media (max-width: 576px) { .ctr:not(.grid) .card { flex-basis: 100%; } :host { --per-row: 1; } }
    `];i([c({type:String,reflect:!0})],b.prototype,"layout",2);i([c({type:Number,attribute:"per-row",reflect:!0})],b.prototype,"perRow",2);i([c({type:String,attribute:"hdr-key",reflect:!0})],b.prototype,"hdrKey",2);b=i([y("object-cards-lit")],b);let p=class extends n{constructor(){super(...arguments),this.fDir="row",this.fWrap="wrap",this.jCont="flex-start",this.aItems="stretch"}render(){if(!this.data?.length)return s`<div class="ctr no-data">No hay datos.</div>`;if(!this.keys?.length)return s`<div class="ctr no-data">No hay claves.</div>`;const r=`flex-direction:${this.fDir};flex-wrap:${this.fWrap};justify-content:${this.jCont};align-items:${this.aItems};`;return s`
      <div class="ctr" style="${r}">
        ${this.data.map((t,o)=>s`
          <div class="flex-item" data-idx=${o}>
            <div class="item-cnt">
              ${this.keys.map(e=>{const a=t[e];let l=a!=null?String(a):"",d="prop-val";return typeof a=="boolean"&&(l=a?"Sí":"No",d+=a?" bool-t":" bool-f"),s`
                  <div class="item-prop">
                    <span class="prop-lbl">${e}</span>
                    <span class="${d}">${l}</span>
                  </div>
                `})}
            </div>
            <div class="item-acts">
              ${this._renderActionsDBButtons(o)}
            </div>
          </div>
        `)}
      </div>
    `}};p.styles=[n.styles,h`
      .ctr { display: flex; gap: 10px; }
      .flex-item {
        border: 1px solid var(--border-color-secondary);
        border-radius: 4px;
        padding: 12px;
        background-color: var(--bg-color-secondary);
        flex: 1 1 220px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 1px 2px var(--shadow-color-soft);
        transition: box-shadow var(--transition-speed);
      }
      .flex-item:hover {
        box-shadow: 0 2px 5px var(--shadow-color-medium);
      }
      .item-cnt { flex-grow: 1; display: flex; flex-direction: column; gap: 5px; }
      .item-prop { font-size: 0.9em; display: flex; gap: 5px; line-height: 1.4; }
      .prop-lbl {
        font-weight: 500;
        color: var(--text-color-primary);
        text-transform: capitalize;
        white-space: nowrap;
      }
      .prop-lbl::after { content: ":"; margin-left: 2px; }
      .prop-val {
        color: var(--text-color-secondary);
        word-break: break-word;
      }
      .prop-val.bool-t { font-style: italic; color: var(--text-color-success); }
      .prop-val.bool-f { font-style: italic; color: var(--text-color-danger); }
      .item-acts {
        display: flex;
        justify-content: flex-end;
        gap: 5px;
        margin-top: auto;
        border-top: 1px solid var(--border-color-primary);
        padding-top: 10px;
      }
      .item-acts button {
        padding: 4px 8px;
        background-color: var(--bg-color-button-alt);
        color: var(--text-color-primary);
        border-color: var(--border-color-secondary);
      }
      .item-acts button:hover {
        background-color: var(--bg-color-button-alt-hover);
        filter: none;
      }
    `];i([c({type:String,attribute:"f-dir",reflect:!0})],p.prototype,"fDir",2);i([c({type:String,attribute:"f-wrap",reflect:!0})],p.prototype,"fWrap",2);i([c({type:String,attribute:"j-cont",reflect:!0})],p.prototype,"jCont",2);i([c({type:String,attribute:"a-items",reflect:!0})],p.prototype,"aItems",2);p=i([y("object-flex-list-lit")],p);let m=class extends v{constructor(){super(...arguments),this.comps={},this.darkMode=!1}toggleDarkMode(){this.darkMode=!this.darkMode}addComp(r,t){if(!r||typeof r!="string"||!t.keys||!Array.isArray(t.keys))return console.error("GM: ID & cfg.keys required."),null;if(this.comps[r])return console.warn(`GM: Comp ID "${r}" exists.`),this.comps[r];const o={type:(t.displayType||"cards").toLowerCase(),title:t.title||"",keys:[...t.keys],data:Array.isArray(t.initialData)?JSON.parse(JSON.stringify(t.initialData)):[],actions:Array.isArray(t.actions)?t.actions.filter(e=>e.name&&e.label):[],options:{...t.displayOptions||{}}};return this.comps={...this.comps,[r]:o},o}getCompCfg(r){return this.comps?.[r]||null}getCompEl(r){return this.shadowRoot?.querySelector(`.comp-wrap[data-comp-id="${r}"] > :not(h3)`)}remComp(r){if(!this.comps?.[r])return console.warn(`GM: Comp ID "${r}" not found.`),!1;const{[r]:t,...o}=this.comps;return this.comps=o,console.log(`GM: Comp "${r}" removed.`),!0}clearAll(){this.comps={},console.log("GM: All comps removed.")}setCompData(r,t,o){const e=this.comps?.[r];if(!e){console.warn(`GM: Comp ID "${r}" not found for setData.`);return}let a=e.data,l=o??e.keys;if(t!==void 0)try{a=Array.isArray(t)?JSON.parse(JSON.stringify(t)):[],Array.isArray(t)||console.warn(`GM: setData for "${r}" received non-array.`)}catch(d){console.error(`GM: Error copying data for ${r}`,d),a=[]}this.comps={...this.comps,[r]:{...e,data:a,keys:l}}}_handleBubbledEvent(r){const t=r.target.closest(".comp-wrap[data-comp-id]"),o=t?.getAttribute("data-comp-id");if(!o||!this.comps?.[o]){t&&console.warn(`GM: Event ${r.type} from unknown compId ${o}`);return}if(r.type!=="internal-action"||!r.detail?.originalAction){console.warn(`GM: Unexpected event caught or missing detail: ${r.type}`,r.detail);return}const{detail:e}=r,a=e.originalAction;console.log(`GM: Action "${a}" from "${o}". Idx: ${e.index}`,e.item),this.dispatchEvent(new CustomEvent("comp-action",{detail:{compId:o,action:a,item:e.item,index:e.index},bubbles:!0,composed:!0}))}_renderManagedComp(r,t){t.data,t.keys,t.actions,this.darkMode;let o;switch(t.type){case"table":o=customElements.get("object-table-lit")?s`
          <object-table-lit
            .data=${t.data}
            .keys=${t.keys}
            .actions=${t.actions}
            .darkMode=${this.darkMode}
          ></object-table-lit>`:s`<div class="error">Error: object-table-lit no está definido.</div>`;break;case"flex":o=customElements.get("object-flex-list-lit")?s`
          <object-flex-list-lit
            .data=${t.data}
            .keys=${t.keys}
            .actions=${t.actions}
            .darkMode=${this.darkMode}
            .fDir=${t.options.flexDirection}
            .fWrap=${t.options.flexWrap}
            .jCont=${t.options.justifyContent}
            .aItems=${t.options.alignItems}
          ></object-flex-list-lit>`:s`<div class="error">Error: object-flex-list-lit no está definido.</div>`;break;case"cards":default:o=customElements.get("object-cards-lit")?s`
          <object-cards-lit
            .data=${t.data}
            .keys=${t.keys}
            .actions=${t.actions}
            .darkMode=${this.darkMode}
            .layout=${t.options.layout}
            .perRow=${t.options.cardsPerRow}
            .hdrKey=${t.options.headerKey}
          ></object-cards-lit>`:s`<div class="error">Error: object-cards-lit no está definido.</div>`,t.type!=="cards"&&console.warn(`GM: Tipo "${t.type}" desconocido para ${r}. Usando 'cards'.`);break}return s`
      <div class="comp-wrap" data-comp-id=${r} ?darkmode=${this.darkMode}>
        ${t.title?s`<button id=${r} class="comp-title"  @click=${()=>this._EmitEv(r)}>${t.title}</button>`:u}
        ${o}
      </div>`}_EmitEv(r,t="default-action"){console.log("GM: Emitiendo acción ",r),this.dispatchEvent(new CustomEvent(t,{detail:r,bubbles:!0,composed:!0}))}render(){return this.darkMode?this.setAttribute("darkmode",""):this.removeAttribute("darkmode"),s`
      <div class="mgr-ctr" @internal-action=${this._handleBubbledEvent}>
        ${Object.entries(this.comps||{}).map(([r,t])=>this._renderManagedComp(r,t))}
      </div>`}};m.styles=h`
    :host {
      display: block;
    }
    .mgr-ctr {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .comp-wrap {
      border: 1px solid var(--border-color-primary);
      border-radius: 6px;
      background-color: var(--bg-color-primary);
      box-shadow: 0 1px 3px var(--shadow-color-soft);
      color: var(--text-color-primary);
    }
    :host([darkmode]) .comp-wrap {
      border: 1px solid var(--border-color-primary);
      background-color: var(--bg-color-primary);
      color: var(--text-color-primary);
    }
    .comp-title {
      margin: 0 0 10px 0;
      font-size: 1.2em;
      color: var(--text-color-primary);
      font-weight: 600;
      border-bottom: 1px solid var(--border-color-secondary);
      padding-bottom: 5px;
    }
    .error {
      color: var(--text-color-danger, red);
      border: 1px solid var(--border-color-danger, red);
      padding: 10px;
      background-color: var(--bg-color-delete, #ffebeb);
      border-radius: 4px;
    }
    :host([darkmode]) .error {
      color: var(--text-color-danger, #ff8a8a);
      border: 1px solid var(--border-color-danger, #a71d2a);
      background-color: var(--bg-color-delete, #c82333);
    }
  `;i([g()],m.prototype,"comps",2);i([c({type:Boolean})],m.prototype,"darkMode",2);m=i([y("grid-manager-lit")],m);function k(r){const t=[],o=[];for(const[e,a]of Object.entries(r))if(customElements.get(e))o.push(e);else try{customElements.define(e,a),t.push(e)}catch(l){console.error(`❌ Error registrando ${e}:`,l)}return console.log(`✅ Registrados ${t.length} componentes:`,t),o.length>0&&console.log(`⚠️ Omitidos ${o.length} ya registrados:`,o),{registered:t,skipped:o}}k({"grid-manager-lit":m,"object-table-lit":f,"object-cards-lit":b,"object-flex-list-lit":p});

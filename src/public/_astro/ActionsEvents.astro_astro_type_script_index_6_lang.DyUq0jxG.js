import{r as p,i as d}from"./lit-element.CdPzzhzS.js";import{x as s}from"./lit-html.Cs9YtZST.js";import{e as f}from"./class-map.D2HkPoOL.js";import"./directive.CGE4aKEl.js";class n extends p{static properties={data:{type:Array},keys:{type:Array},actions:{type:Array},darkMode:{type:Boolean,reflect:!0,attribute:"darkmode"}};constructor(){super(),this.data=[],this.keys=[],this.actions=[],this.darkMode=!1}toggleDarkMode(){this.darkMode=!this.darkMode}static styles=d`
        :host {
            display: block;

            /* --- Paleta de Colores (Modo Claro por defecto) --- */
            --text-color-primary: #212529;
            --text-color-secondary: #6c757d;
            --text-color-muted: #868e96;
            --text-color-link: #007bff;
            --text-color-success: #198754;
            --text-color-danger: #dc3545;
            --text-color-info-on-light: #004085; /* Texto azul sobre fondo claro */
            --text-color-danger-on-light: #721c24; /* Texto rojo oscuro sobre fondo claro */
            --text-color-light: #f8f9fa; /* Texto claro sobre fondo oscuro */

            --bg-color-primary: #ffffff;
            --bg-color-secondary: #f8f9fa; /* Fondos sutilmente diferentes */
            --bg-color-tertiary: #e9ecef; /* Hover, etc. */
            --bg-color-table-header: #f2f2f2;
            --bg-color-table-even-row: #f9f9f9;
            --bg-color-button: #ffffff;
            --bg-color-button-hover-brightness: 0.95;
            --bg-color-button-alt: #f0f0f0;
            --bg-color-button-alt-hover: #e0e0e0;
            --bg-color-edit: #e7f3ff; /* Fondo azul claro */
            --bg-color-delete: #f8d7da; /* Fondo rojo claro */

            --border-color-primary: #dee2e6; /* Bordes principales */
            --border-color-secondary: #ced4da; /* Bordes secundarios, botones */
            --border-color-table: #ddd; /* Bordes tabla */
            --border-color-edit: #b8daff; /* Borde azul */
            --border-color-delete: #f5c6cb; /* Borde rojo */

            --shadow-color-soft: rgba(0, 0, 0, 0.08);
            --shadow-color-medium: rgba(0, 0, 0, 0.12);

            /* Transiciones comunes */
            --transition-speed: 0.2s;
            --transition-ease: ease-out;
        }

        /* --- Paleta de Colores (Modo Oscuro) --- */
        :host([darkmode]) {
            --text-color-primary: #e9ecef; /* Texto principal claro */
            --text-color-secondary: #adb5bd; /* Texto secundario grisáceo */
            --text-color-muted: #868e96;
            --text-color-link: #64b5f6; /* Azul más brillante */
            --text-color-success: #81c784; /* Verde más brillante */
            --text-color-danger: #ef9a9a; /* Rojo más brillante */
            --text-color-info-on-light: #ffffff; /* Texto blanco sobre fondo azul */
            --text-color-danger-on-light: #ffffff; /* Texto blanco sobre fondo rojo */
            --text-color-light: #e9ecef; /* Igual que el primario */

            --bg-color-primary: #212529; /* Fondo principal oscuro */
            --bg-color-secondary: #343a40; /* Fondo secundario oscuro */
            --bg-color-tertiary: #495057; /* Hover oscuro */
            --bg-color-table-header: #343a40;
            --bg-color-table-even-row: #2c3034;
            --bg-color-button: #495057; /* Botones más oscuros */
            --bg-color-button-hover-brightness: 1.1; /* Aclarar al hacer hover */
            --bg-color-button-alt: #5a6268;
            --bg-color-button-alt-hover: #6c757d;
            --bg-color-edit: #0056b3; /* Fondo azul más oscuro */
            --bg-color-delete: #c82333; /* Fondo rojo más oscuro */

            --border-color-primary: #495057; /* Bordes gris oscuro */
            --border-color-secondary: #6c757d;
            --border-color-table: #454d55;
            --border-color-edit: #004085;
            --border-color-delete: #a71d2a;

            --shadow-color-soft: rgba(255, 255, 255, 0.05);
            --shadow-color-medium: rgba(255, 255, 255, 0.08);
        }

        /* Estilos base que usan las variables */
        .ctr { /* Contenedor base */
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
            color: var(--text-color-primary); /* Color de texto para botones normales */
            transition: filter var(--transition-speed) var(--transition-ease), background-color var(--transition-speed) var(--transition-ease);
        }
        button:hover {
            /* Usamos filter brightness para modo claro/oscuro, podría ser cambio directo de color */
            filter: brightness(var(--bg-color-button-hover-brightness));
        }
        .edit-btn {
            background-color: var(--bg-color-edit);
            border-color: var(--border-color-edit);
            color: var(--text-color-info-on-light); /* Texto específico para este fondo */
        }
        .delete-btn {
            background-color: var(--bg-color-delete);
            color: var(--text-color-danger-on-light); /* Texto específico para este fondo */
            border-color: var(--border-color-delete);
        }
    `;setData(r=[],o=[]){if(!Array.isArray(r)||!Array.isArray(o)){console.error(`${this.constructor.name}: data & keys must be arrays.`),this.data=[],this.keys=[];return}try{this.data=JSON.parse(JSON.stringify(r))}catch(e){console.error(`${this.constructor.name}: Error copying data`,e),this.data=[]}this.keys=[...o]}addItem(r){if(!r||typeof r!="object"){console.error(`${this.constructor.name}: item must be an object.`,r);return}try{this.data=[...this.data,JSON.parse(JSON.stringify(r))]}catch(o){console.error(`${this.constructor.name}: Error copying item`,o)}}addAction(r,o,e=""){if(typeof r!="string"||!r||typeof o!="string"){console.error(`${this.constructor.name}: Invalid action (nm, lbl).`);return}this.actions=[...this.actions.filter(a=>a.name!==r),{name:r,label:o,className:e||""}]}_emitEv(r,o){if(o<0||o>=this.data.length){console.warn(`${this.constructor.name}: Invalid index ${o} for action ${r}`);return}const e=this.data[o],a={originalAction:r,item:JSON.parse(JSON.stringify(e)),index:o};try{this.dispatchEvent(new CustomEvent("internal-action",{detail:a,bubbles:!0,composed:!0}))}catch(t){console.error(`${this.constructor.name}: Error dispatching event internal-action`,t)}}_renderActionButtons(r){let o=[...this.actions];return(this.data.length>0||this.keys.length>0)&&(o.some(e=>e.name==="edit")||o.unshift({name:"edit",label:"Editar",className:"edit-btn"}),o.some(e=>e.name==="delete")||o.push({name:"delete",label:"Eliminar",className:"delete-btn"})),o.map(e=>s`
            <button
                class="${e.className||""} ${e.name==="edit"?"edit-btn":""} ${e.name==="delete"?"delete-btn":""}"
                @click=${()=>this._emitEv(e.name,r)}>
                ${e.label}
            </button>
        `)}render(){throw new Error(`${this.constructor.name} must implement render()`)}}class u extends n{static styles=[n.styles,d`
            :host {
                border: 1px solid var(--border-color-primary);
                padding: 10px;
                border-radius: 5px;
                /* El fondo y color principal ya vienen de BaseLitElement :host */
            }
            .ctr { overflow-x: auto; }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 0.95em;
            }
            th, td {
                border: 1px solid var(--border-color-table);
                padding: 8px 10px;
                text-align: left;
                vertical-align: middle;
                white-space: nowrap;
                color: var(--text-color-primary); /* Hereda color de texto */
            }
            td.wrap { white-space: normal; }
            th {
                background-color: var(--bg-color-table-header);
                font-weight: 600;
                text-transform: capitalize;
                position: sticky;
                top: 0;
                z-index: 1;
                color: var(--text-color-primary); /* Color para cabeceras */
            }
            tr:nth-child(even) {
                background-color: var(--bg-color-table-even-row);
            }
            tr:hover {
                background-color: var(--bg-color-tertiary); /* Usamos el color de hover genérico */
            }
            .acts-cell {
                width: 1%;
                text-align: center;
                padding: 4px 8px;
            }
            .acts-cell button { margin: 2px; }
        `];render(){return this.data?.length?this.keys?.length?s`
            <div class="ctr">
                <table>
                    <thead>
                        <tr>
                            ${this.keys.map(r=>s`<th>${r}</th>`)}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.data.map((r,o)=>s`
                            <tr data-idx=${o}>
                                ${this.keys.map(e=>{const a=r[e];let t=a!=null?String(a):"";return typeof a=="boolean"&&(t=a?"Sí":"No"),s`<td class="${typeof a=="string"&&a.length>50?"wrap":""}">${t}</td>`})}
                                <td class="acts-cell">
                                    ${this._renderActionButtons(o)}
                                </td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        `:s`<div class="no-data">No hay claves.</div>`:s`<div class="no-data">No hay datos.</div>`}}class h extends n{static properties={layout:{type:String,reflect:!0},perRow:{type:Number,attribute:"per-row",reflect:!0},hdrKey:{type:String,attribute:"hdr-key",reflect:!0}};constructor(){super(),this.layout="flex",this.perRow=3,this.hdrKey=null}static styles=[n.styles,d`
            :host { --per-row: 3; } /* Se mantiene igual */
            .ctr { display: flex; flex-wrap: wrap; gap: 16px; }
            .ctr.grid { display: grid; grid-template-columns: repeat(var(--per-row, 3), 1fr); }
            /* .no-data ya está estilado en BaseLitElement */
            .card {
                background-color: var(--bg-color-secondary); /* Fondo ligeramente diferente */
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
                color: var(--text-color-primary); /* Color texto cabecera */
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
            .prop-val.bool-t { font-style: italic; color: var(--text-color-success); } /* Usamos success */
            .prop-val.bool-f { font-style: italic; color: var(--text-color-secondary); } /* Usamos secundario */
            .card-acts {
                padding: 10px 15px;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                background-color: var(--bg-color-tertiary);
                border-top: 1px solid var(--border-color-primary);
                margin-top: auto;
            }
            .card-acts button {
                padding: 6px 12px;
                 /* Estilos base de botón ya aplicados */
            }
            /* Media queries se mantienen igual */
            @media (max-width: 992px) { .ctr:not(.grid) .card { flex-basis: calc(50% - 8px); } :host { --per-row: 2; } }
            @media (max-width: 576px) { .ctr:not(.grid) .card { flex-basis: 100%; } :host { --per-row: 1; } }
        `];updated(r){r.has("perRow")&&this.style.setProperty("--per-row",String(this.perRow||3))}render(){if(!this.data?.length)return s`<div class="ctr no-data">No hay datos.</div>`;if(!this.keys?.length)return s`<div class="ctr no-data">No hay claves.</div>`;const r={ctr:!0,grid:this.layout==="grid"};return s`
            <div class=${f(r)}>
                ${this.data.map((o,e)=>s`
                    <div class="card" data-idx=${e}>
                        ${this.hdrKey&&o[this.hdrKey]!==void 0?s`
                            <div class="card-hdr">${o[this.hdrKey]}</div>
                        `:""}
                        <div class="card-cnt">
                            ${this.keys.map(a=>{if(a===this.hdrKey)return"";const t=o[a];let i=t!=null?String(t):"",l="prop-val";return typeof t=="boolean"&&(i=t?"Sí":"No",l+=t?" bool-t":" bool-f"),s`
                                    <div class="card-prop">
                                        <div class="prop-lbl">${a}</div>
                                        <div class="${l}">${i}</div>
                                    </div>
                                `})}
                        </div>
                        <div class="card-acts">
                            ${this._renderActionButtons(e)}
                        </div>
                    </div>
                `)}
            </div>
        `}}class g extends n{static properties={fDir:{type:String,attribute:"f-dir",reflect:!0},fWrap:{type:String,attribute:"f-wrap",reflect:!0},jCont:{type:String,attribute:"j-cont",reflect:!0},aItems:{type:String,attribute:"a-items",reflect:!0}};constructor(){super(),this.fDir="row",this.fWrap="wrap",this.jCont="flex-start",this.aItems="stretch"}static styles=[n.styles,d`
            .ctr { display: flex; gap: 10px; /* Resto controlado por props/style */ }
            /* .no-data ya estilado en BaseLitElement */
            .flex-item {
                border: 1px solid var(--border-color-secondary); /* Borde secundario */
                border-radius: 4px;
                padding: 12px;
                background-color: var(--bg-color-secondary); /* Fondo secundario */
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
                color: var(--text-color-primary); /* Texto primario */
                text-transform: capitalize;
                white-space: nowrap;
            }
            .prop-lbl::after { content: ":"; margin-left: 2px; }
            .prop-val {
                color: var(--text-color-secondary); /* Texto secundario */
                word-break: break-word;
            }
            .prop-val.bool-t { font-style: italic; color: var(--text-color-success); } /* Color de éxito */
            .prop-val.bool-f { font-style: italic; color: var(--text-color-danger); } /* Color de peligro/negativo */
            .item-acts {
                display: flex;
                justify-content: flex-end;
                gap: 5px;
                margin-top: auto;
                border-top: 1px solid var(--border-color-primary); /* Borde primario */
                padding-top: 10px;
            }
            .item-acts button {
                padding: 4px 8px;
                background-color: var(--bg-color-button-alt); /* Botón alternativo */
                color: var(--text-color-primary); /* Heredado */
                 border-color: var(--border-color-secondary); /* Heredado */
            }
            .item-acts button:hover {
                background-color: var(--bg-color-button-alt-hover);
                filter: none; /* Sobrescribir filtro si lo hubiera */
            }
        `];render(){if(!this.data?.length)return s`<div class="ctr no-data">No hay datos.</div>`;if(!this.keys?.length)return s`<div class="ctr no-data">No hay claves.</div>`;const r=`flex-direction:${this.fDir};flex-wrap:${this.fWrap};justify-content:${this.jCont};align-items:${this.aItems};`;return s`
            <div class="ctr" style="${r}">
                ${this.data.map((o,e)=>s`
                    <div class="flex-item" data-idx=${e}>
                        <div class="item-cnt">
                            ${this.keys.map(a=>{const t=o[a];let i=t!=null?String(t):"",l="prop-val";return typeof t=="boolean"&&(i=t?"Sí":"No",l+=t?" bool-t":" bool-f"),s`
                                    <div class="item-prop">
                                        <span class="prop-lbl">${a}</span>
                                        <span class="${l}">${i}</span>
                                    </div>
                                `})}
                        </div>
                        <div class="item-acts">
                            ${this._renderActionButtons(e)}
                        </div>
                    </div>
                `)}
            </div>
        `}}class y extends p{static properties={comps:{type:Object,state:!0},darkMode:{type:Boolean}};constructor(){super(),this.comps={},this.darkMode=!1}toggleDarkMode(){this.darkMode=!this.darkMode}static styles=d`
        :host {
            display: block;
            /* Definir variables aquí si se quiere un control AÚN MÁS global,
               pero por ahora las heredamos de BaseLitElement a través de los hijos */
            /* background-color: var(--manager-bg, #f0f0f0); */ /* Ejemplo */
        }
        .mgr-ctr {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .comp-wrap {
            /* Usamos variables definidas en BaseLitElement */
            border: 1px solid var(--border-color-primary);
            border-radius: 6px;
            background-color: var(--bg-color-primary); /* Fondo principal */
            box-shadow: 0 1px 3px var(--shadow-color-soft);
            color: var(--text-color-primary); /* Color texto general */
        }
        /* Estilos específicos para modo oscuro si el wrapper necesita cambiar */
        :host([darkmode]) .comp-wrap {
             border: 1px solid var(--border-color-primary); /* Ya usa la variable correcta */
             background-color: var(--bg-color-primary); /* Ya usa la variable correcta */
             color: var(--text-color-primary); /* Ya usa la variable correcta */
        }

        .comp-title {
            margin: 0 0 10px 0;
            font-size: 1.2em;
            color: var(--text-color-primary); /* Color texto primario */
            font-weight: 600;
            border-bottom: 1px solid var(--border-color-secondary); /* Borde secundario */
            padding-bottom: 5px;
        }
        .error {
            /* Usar variables para errores si las definimos, o colores directos */
            color: var(--text-color-danger, red);
            border: 1px solid var(--border-color-danger, red);
            padding: 10px;
            background-color: var(--bg-color-delete, #ffebeb); /* Reutilizamos delete o creamos --bg-error */
            border-radius: 4px;
        }
         /* Modo oscuro para errores */
        :host([darkmode]) .error {
            color: var(--text-color-danger, #ff8a8a);
            border: 1px solid var(--border-color-danger, #a71d2a);
            background-color: var(--bg-color-delete, #c82333);
        }
    `;addComp(r,o={}){if(!r||typeof r!="string"||!o.keys||!Array.isArray(o.keys))return console.error("GM: ID & cfg.keys required."),null;if(this.comps[r])return console.warn(`GM: Comp ID "${r}" exists.`),this.comps[r];const e={type:(o.displayType||"cards").toLowerCase(),title:o.title||"",keys:[...o.keys],data:Array.isArray(o.initialData)?JSON.parse(JSON.stringify(o.initialData)):[],actions:Array.isArray(o.actions)?o.actions.filter(a=>a.name&&a.label):[],options:{...o.displayOptions||{}}};return Array.isArray(e.data)||(e.data=[]),this.comps={...this.comps,[r]:e},e}getCompCfg(r){return this.comps?.[r]||null}getCompEl(r){return this.shadowRoot?.querySelector(`.comp-wrap[data-comp-id="${r}"] > :not(h3)`)||null}remComp(r){if(!this.comps?.[r])return console.warn(`GM: Comp ID "${r}" not found.`),!1;const{[r]:o,...e}=this.comps;return this.comps=e,console.log(`GM: Comp "${r}" removed.`),!0}clearAll(){this.comps={},console.log("GM: All comps removed.")}setCompData(r,o,e){const a=this.comps?.[r];if(!a){console.warn(`GM: Comp ID "${r}" not found for setData.`);return}let t=a.data,i=e??a.keys;if(o!==void 0)try{t=Array.isArray(o)?JSON.parse(JSON.stringify(o)):[],Array.isArray(o)||console.warn(`GM: setData for "${r}" received non-array.`)}catch(l){console.error(`GM: Error copying data for ${r}`,l),t=[]}this.comps={...this.comps,[r]:{...a,data:t,keys:i}}}_handleBubbledEvent(r){const o=r.target.closest(".comp-wrap[data-comp-id]"),e=o?.dataset.compId;if(!e||!this.comps?.[e]){o&&console.warn(`GM: Event ${r.type} from unknown compId ${e}`);return}if(r.type!=="internal-action"||!r.detail?.originalAction){console.warn(`GM: Unexpected event caught or missing detail: ${r.type}`,r.detail);return}const{detail:a}=r,t=a.originalAction;console.log(`GM: Action "${t}" from "${e}". Idx: ${a.index}`,a.item),this.dispatchEvent(new CustomEvent("comp-action",{detail:{compId:e,action:t,item:a.item,index:a.index},bubbles:!0,composed:!0}))}_renderManagedComp(r,o){const e={".layout":o.options?.layout,".perRow":o.options?.cardsPerRow,".hdrKey":o.options?.headerKey,".fDir":o.options?.flexDirection,".fWrap":o.options?.flexWrap,".jCont":o.options?.justifyContent,".aItems":o.options?.alignItems},a=Object.entries(e).filter(([,l])=>l!==void 0).reduce((l,[b,m])=>({...l,[b]:m}),{}),t={".data":o.data,".keys":o.keys,".actions":o.actions,".darkMode":this.darkMode};let i;switch(o.type){case"table":i=customElements.get("object-table-lit")?s`
                    <object-table-lit
                        .data=${t[".data"]}
                        .keys=${t[".keys"]}
                        .actions=${t[".actions"]}
                        .darkMode=${t[".darkMode"]}
                        ...=${a}
                    ></object-table-lit>`:s`<div class="error">Err: object-table-lit undef</div>`;break;case"flex":i=customElements.get("object-flex-list-lit")?s`
                    <object-flex-list-lit
                        .data=${t[".data"]}
                        .keys=${t[".keys"]}
                        .actions=${t[".actions"]}
                        .darkMode=${t[".darkMode"]}
                        ...=${a}
                    ></object-flex-list-lit>`:s`<div class="error">Err: object-flex-list-lit undef</div>`;break;case"cards":default:i=customElements.get("object-cards-lit")?s`
                    <object-cards-lit
                        .data=${t[".data"]}
                        .keys=${t[".keys"]}
                        .actions=${t[".actions"]}
                        .darkMode=${t[".darkMode"]}
                        ...=${a}
                    ></object-cards-lit>`:s`<div class="error">Err: object-cards-lit undef</div>`,o.type!=="cards"&&console.warn(`GM: Unknown type "${o.type}" for ${r}. Using cards.`);break}return s`
            <div class="comp-wrap" data-comp-id=${r} ?darkmode=${this.darkMode}>
                ${o.title?s`<h3 class="comp-title">${o.title}</h3>`:""}
                ${i}
            </div>`}render(){return this.darkMode?this.setAttribute("darkmode",""):this.removeAttribute("darkmode"),s`
            <div class="mgr-ctr" @internal-action=${this._handleBubbledEvent}>
                ${Object.entries(this.comps||{}).map(([r,o])=>this._renderManagedComp(r,o))}
            </div>`}}function x(c){const r=[],o=[];for(const[e,a]of Object.entries(c))if(customElements.get(e))o.push(e);else try{customElements.define(e,a),r.push(e)}catch(t){console.error(`❌ Error registering ${e}:`,t)}return console.log(`✅ Registered ${r.length} components:`,r),o.length>0&&console.log(`⚠️ Skipped ${o.length} already registered:`,o),{registered:r,skipped:o}}x({"grid-manager-lit":y,"object-table-lit":u,"object-cards-lit":h,"object-flex-list-lit":g});

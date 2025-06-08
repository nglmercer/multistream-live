import{I as v,d as x}from"./idb.zra9h0q-.js";import{a as h,o as w,s as k}from"./ActionsEvents.astro_astro_type_script_index_2_lang.jfV_pEzW.js";import{r as E,i as u}from"./lit-element.CdPzzhzS.js";import{x as n}from"./lit-html.Cs9YtZST.js";import{t as A}from"./custom-element.BhZVzxrc.js";import{n as d}from"./state.k4TxN2nw.js";import"./class-map.D2HkPoOL.js";import"./directive.CGE4aKEl.js";import"./custom-modal.CP9c9_tL.js";import"./unsafe-html.o8VIWoCg.js";import"./CInput.Dz4Eadx2.js";import"./map.CC3vsOt5.js";var $=Object.defineProperty,_=Object.getOwnPropertyDescriptor,s=(r,o,e,t)=>{for(var a=t>1?void 0:t?_(o,e):o,l=r.length-1,f;l>=0;l--)(f=r[l])&&(a=(t?f(o,e,a):f(a))||a);return t&&a&&$(o,e,a),a};class c extends E{constructor(){super(),this.data=[],this.keys=[],this.actions=[],this.darkMode=!1,this._hiddenActions=new Set}toggleDarkMode(){this.darkMode=!this.darkMode}static{this.styles=u`
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
    `}setData(o=[],e=[]){if(!Array.isArray(o)||!Array.isArray(e)){console.error(`${this.constructor.name}: data & keys must be arrays.`),this.data=[],this.keys=[];return}try{this.data=JSON.parse(JSON.stringify(o))}catch(t){console.error(`${this.constructor.name}: Error copying data`,t),this.data=[]}this.keys=[...e]}addItem(o){if(!o||typeof o!="object"){console.error(`${this.constructor.name}: item must be an object.`,o);return}try{this.data=[...this.data,JSON.parse(JSON.stringify(o))]}catch(e){console.error(`${this.constructor.name}: Error copying item`,e)}}addAction(o,e,t=""){if(typeof o!="string"||!o||typeof e!="string"){console.error(`${this.constructor.name}: Invalid action (nm, lbl).`);return}this.actions=[...this.actions.filter(a=>a.name!==o),{name:o,label:e,className:t||""}]}_emitEv(o,e){if(e<0||e>=this.data.length){console.warn(`${this.constructor.name}: Invalid index ${e} for action ${o}`);return}const t=this.data[e],a={originalAction:o,item:JSON.parse(JSON.stringify(t)),index:e};try{this._dispatchEv("internal-action",a),this._dispatchEv("action",a)}catch(l){console.error(`${this.constructor.name}: Error dispatching event internal-action`,l)}}_dispatchEv(o,e){this.dispatchEvent(new CustomEvent(o,{detail:e,bubbles:!0,composed:!0}))}_renderActionButtons(o){let e=[...this.actions];return(this.data.length>0||this.keys.length>0)&&(!this._isActionHidden("edit")&&!e.some(t=>t.name==="edit")&&e.unshift({name:"edit",label:"Editar",className:"edit-btn"}),!this._isActionHidden("delete")&&!e.some(t=>t.name==="delete")&&e.push({name:"delete",label:"Eliminar",className:"delete-btn"})),e.map(t=>n`
            <button
                class="${t.className||""} ${t.name==="edit"?"edit-btn":""} ${t.name==="delete"?"delete-btn":""}"
                @click=${()=>this._emitEv(t.name,o)}>
                ${t.label}
            </button>
        `)}_isActionHidden(o){return this._hiddenActions.has(o)}hideAction(o){if(typeof o!="string"){console.error(`${this.constructor.name}: actionName must be a string.`);return}this._hiddenActions.add(o),this.actions=this.actions.filter(e=>e.name!==o),this.requestUpdate()}showAction(o,e,t=""){if(typeof o!="string"||typeof e!="string"){console.error(`${this.constructor.name}: actionName and label must be strings.`);return}this._hiddenActions.delete(o),this.addAction(o,e,t),this.requestUpdate()}}s([d({type:Array})],c.prototype,"data",2);s([d({type:Array})],c.prototype,"keys",2);s([d({type:Array})],c.prototype,"actions",2);s([d({type:Boolean,reflect:!0,attribute:"darkmode"})],c.prototype,"darkMode",2);let b=class extends c{constructor(){super(...arguments),this.darkMode=!1}_handleDoubleClick(r){this._handleClick(r,"dblclick")}_handleClick(r,o){r.preventDefault();const e=this.verifyRow(r);if(e===void 0)return;const t=this.data[e];if(!t)return;this._dispatchEv("row-activated",t);const a={item:t,idx:e,type:o};this._dispatchEv("menu",a)}_handleMenuClick(r){this._handleClick(r,"contextmenu")}verifyRow(r){const o=r.currentTarget,e=parseInt(o.dataset.idx||"",10);if(isNaN(e)||e<0||e>=this.data.length){console.warn(`${this.constructor.name}: Invalid index ${e} from row.`);return}return e}render(){return this.data?.length?this.keys?.length?n`
            <div class="ctr">
                <table>
                    <thead>
                        <tr>
                            ${this.keys.map(r=>n`<th>${r}</th>`)}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${this.data.map((r,o)=>n`
                        <tr
                            data-idx=${o}
                            @dblclick=${this._handleDoubleClick}  
                            @contextmenu=${this._handleMenuClick} 
                        >
                            ${this.keys.map(e=>{const t=r[e];let a=t!=null?String(t):"";return typeof t=="boolean"&&(a=t?"Sí":"No"),n`<td class="${typeof t=="string"&&t.length>50?"wrap":""}">${a}</td>`})}
                            <td class="acts-cell">
                                ${this._renderActionButtons(o)}
                            </td>
                        </tr>
                    `)}
                    </tbody>
                </table>
            </div>
        `:n`<div class="no-data">No hay claves.</div>`:n`<div class="no-data">No hay datos.</div>`}};b.styles=[c.styles,u`
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
        `];s([d({type:Boolean,reflect:!0,attribute:"darkmode"})],b.prototype,"darkMode",2);b=s([A("obj-table")],b);const m={editorId:"Action-editor",managerId:"ActionConfigManager",dbConfig:x.ActionsDB},p=document.getElementById(m.editorId),i=document.getElementById(m.managerId),g=new v(m.dbConfig,h);async function C(){(!p||!i)&&console.error("Error: Elementos UI necesarios no encontrados."),i.data=await y(),i.keys=["id","name"],console.log("Inicializando listeners de tabla...",p,i),i.addEventListener("action",async r=>{const{detail:o}=r;if(o.originalAction==="edit"&&(w(),console.log("Editando elemento:",o.item),k(o.item)),o.originalAction==="delete"){const{id:e}=o.item;console.log("Eliminando elemento con ID:",e),window.showDialog(`eliminar elemento con ID: ${e}`,"aceptar","cancelar").then(async t=>{if(console.log("Resultado de la confirmación:",t),t){const a=await g.deleteData(e);h.emit("deleteAction",a)}}).catch(t=>{console.error("Error al mostrar el diálogo de confirmación:",t)})}})}h.onAny(async(r,o)=>{console.log("event",`Evento emitido: ${r}`,o),await D()});setTimeout(()=>{h.emit("exampleEvent",{message:"This is an example event",timestamp:new Date().toISOString()})},5e3);async function y(){return await g.getAllData()}async function D(r=i){const o=r;if(!o){console.error("Error: No se encontró el componente de tabla",o);return}return o.data=await y(),o.data}document.addEventListener("DOMContentLoaded",()=>{C()});

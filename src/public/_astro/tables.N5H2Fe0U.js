import{r as f,i as h,n as l}from"./property.DTDKM9eR.js";import{x as s}from"./lit-html.Cs9YtZST.js";import{t as u}from"./custom-element.BhZVzxrc.js";var p=Object.defineProperty,g=Object.getOwnPropertyDescriptor,i=(a,e,o,r)=>{for(var t=r>1?void 0:r?g(e,o):e,c=a.length-1,b;c>=0;c--)(b=a[c])&&(t=(r?b(e,o,t):b(t))||t);return r&&t&&p(e,o,t),t};class n extends f{constructor(){super(),this.data=[],this.keys=[],this.actions=[],this.darkMode=!1,this._hiddenActions=new Set}toggleDarkMode(){this.darkMode=!this.darkMode}static{this.styles=h`
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
    `}setData(e=[],o=[]){if(!Array.isArray(e)||!Array.isArray(o)){console.error(`${this.constructor.name}: data & keys must be arrays.`),this.data=[],this.keys=[];return}try{this.data=JSON.parse(JSON.stringify(e))}catch(r){console.error(`${this.constructor.name}: Error copying data`,r),this.data=[]}this.keys=[...o]}addItem(e){if(!e||typeof e!="object"){console.error(`${this.constructor.name}: item must be an object.`,e);return}try{this.data=[...this.data,JSON.parse(JSON.stringify(e))]}catch(o){console.error(`${this.constructor.name}: Error copying item`,o)}}addAction(e,o,r=""){if(typeof e!="string"||!e||typeof o!="string"){console.error(`${this.constructor.name}: Invalid action (nm, lbl).`);return}this.actions=[...this.actions.filter(t=>t.name!==e),{name:e,label:o,className:r||""}]}_emitEv(e,o){if(o<0||o>=this.data.length){console.warn(`${this.constructor.name}: Invalid index ${o} for action ${e}`);return}const r=this.data[o],t={originalAction:e,item:JSON.parse(JSON.stringify(r)),index:o};try{this._dispatchEv("internal-action",t),this._dispatchEv("action",t)}catch(c){console.error(`${this.constructor.name}: Error dispatching event internal-action`,c)}}_dispatchEv(e,o){this.dispatchEvent(new CustomEvent(e,{detail:o,bubbles:!0,composed:!0}))}_renderActionsDBButtons(e){let o=[...this.actions];return(this.data.length>0||this.keys.length>0)&&(!this._isActionHidden("edit")&&!o.some(r=>r.name==="edit")&&o.unshift({name:"edit",label:"Editar",className:"edit-btn"}),!this._isActionHidden("delete")&&!o.some(r=>r.name==="delete")&&o.push({name:"delete",label:"Eliminar",className:"delete-btn"})),o.map(r=>s`
            <button
                class="${r.className||""} ${r.name==="edit"?"edit-btn":""} ${r.name==="delete"?"delete-btn":""}"
                @click=${()=>this._emitEv(r.name,e)}>
                ${r.label}
            </button>
        `)}_isActionHidden(e){return this._hiddenActions.has(e)}hideAction(e){if(typeof e!="string"){console.error(`${this.constructor.name}: actionName must be a string.`);return}this._hiddenActions.add(e),this.actions=this.actions.filter(o=>o.name!==e),this.requestUpdate()}showAction(e,o,r=""){if(typeof e!="string"||typeof o!="string"){console.error(`${this.constructor.name}: actionName and label must be strings.`);return}this._hiddenActions.delete(e),this.addAction(e,o,r),this.requestUpdate()}}i([l({type:Array})],n.prototype,"data",2);i([l({type:Array})],n.prototype,"keys",2);i([l({type:Array})],n.prototype,"actions",2);i([l({type:Boolean,reflect:!0,attribute:"darkmode"})],n.prototype,"darkMode",2);let d=class extends n{constructor(){super(...arguments),this.darkMode=!1}_handleDoubleClick(a){this._handleClick(a,"dblclick")}_handleClick(a,e){a.preventDefault();const o=this.verifyRow(a);if(o===void 0)return;const r=this.data[o];if(!r)return;this._dispatchEv("row-activated",r);const t={item:r,idx:o,type:e};this._dispatchEv("menu",t)}_handleMenuClick(a){this._handleClick(a,"contextmenu")}verifyRow(a){const e=a.currentTarget,o=parseInt(e.dataset.idx||"",10);if(isNaN(o)||o<0||o>=this.data.length){console.warn(`${this.constructor.name}: Invalid index ${o} from row.`);return}return o}render(){return this.data?.length?this.keys?.length?s`
            <div class="ctr">
                <table>
                    <thead>
                        <tr>
                            ${this.keys.map(a=>s`<th>${a}</th>`)}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${this.data.map((a,e)=>s`
                        <tr
                            data-idx=${e}
                            @dblclick=${this._handleDoubleClick}  
                            @contextmenu=${this._handleMenuClick} 
                        >
                            ${this.keys.map(o=>{const r=a[o];let t=r!=null?String(r):"";return typeof r=="boolean"&&(t=r?"Sí":"No"),s`<td class="${typeof r=="string"&&r.length>50?"wrap":""}">${t}</td>`})}
                            <td class="acts-cell">
                                ${this._renderActionsDBButtons(e)}
                            </td>
                        </tr>
                    `)}
                    </tbody>
                </table>
            </div>
        `:s`<div class="no-data">No hay claves.</div>`:s`<div class="no-data">No hay datos.</div>`}};d.styles=[n.styles,h`
            :host {
                border: 1px solid var(--border-color-primary);
                border-radius: 5px;
                /* El fondo y color principal ya vienen de BaseLitElement :host */
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
        `];i([l({type:Boolean,reflect:!0,attribute:"darkmode"})],d.prototype,"darkMode",2);d=i([u("obj-table")],d);

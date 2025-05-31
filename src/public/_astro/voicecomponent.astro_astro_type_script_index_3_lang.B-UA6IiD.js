class b extends HTMLElement{constructor(){super(),this._data=[],this._keys=[],this._customActions=[],this._needsRender=!0,this.attachShadow({mode:"open"});const e=document.createElement("style");this._styleElement=e,this._container=document.createElement("div"),this._container.classList.add("display-container"),this.shadowRoot.appendChild(this._styleElement),this.shadowRoot.appendChild(this._container),this._container.addEventListener("click",this._handleActionClick.bind(this))}getStyles(){return console.warn(`${this.constructor.name} should implement getStyles()`),":host { display: block; border: 1px dashed red; padding: 10px; margin-bottom: 10px; } /* Default fallback styles */"}render(){throw new Error(`${this.constructor.name} must implement render()`)}setData(e=[],n=[]){if(!Array.isArray(e)||!Array.isArray(n))console.error(`${this.constructor.name}: data y keys deben ser arrays.`),this._data=[],this._keys=[];else{try{this._data=JSON.parse(JSON.stringify(e))}catch(t){console.error(`${this.constructor.name}: Error deep copying data`,t),this._data=[]}this._keys=[...n]}this._needsRender=!0,this.isConnected&&(this.render(),this._needsRender=!1)}addItem(e){if(e&&typeof e=="object")try{this._data.push(JSON.parse(JSON.stringify(e))),this._needsRender=!0,this.isConnected&&(this.render(),this._needsRender=!1)}catch(n){console.error(`${this.constructor.name}: Error deep copying item to add`,n)}else console.error(`${this.constructor.name}: El item a añadir debe ser un objeto.`,e)}addAction(e,n,t=""){if(typeof e!="string"||!e){console.error(`${this.constructor.name}: actionName debe ser un string no vacío.`);return}if(typeof n!="string"){console.error(`${this.constructor.name}: buttonLabel debe ser un string.`);return}this._customActions=this._customActions.filter(o=>o.name!==e),this._customActions.push({name:e,label:n,className:t||""}),this._needsRender=!0,this._data.length>0&&this.isConnected&&(this.render(),this._needsRender=!1)}_handleActionClick(e){const n=e.target.closest("button[data-action]");if(n){const t=n.dataset.action,o=n.closest("[data-item-index]");let r=null,s=-1;if(o&&o.dataset.itemIndex!==void 0){const i=parseInt(o.dataset.itemIndex,10);!isNaN(i)&&i>=0&&i<this._data.length&&(s=i,r=this._data[i])}else{const i=n.closest(".card-actions, .actions-cell, .item-actions");i&&i._dataItem&&(r=i._dataItem,s=this._data.findIndex(a=>a===r))}if(r){let i;t==="edit"?i="edit-item":t==="delete"?i="delete-item":i=t;try{this.dispatchEvent(new CustomEvent(i,{detail:{item:JSON.parse(JSON.stringify(r)),index:s},bubbles:!0,composed:!0}))}catch(a){console.error(`${this.constructor.name}: Error dispatching event "${i}"`,a)}}else console.warn(`${this.constructor.name}: Botón de acción "${t}" clickeado, pero no se pudo encontrar el data item asociado.`)}}connectedCallback(){this._styleElement.textContent||(this._styleElement.textContent=this.getStyles()),this.shadowRoot.contains(this._container)||this.shadowRoot.appendChild(this._container),this._needsRender&&(this.render(),this._needsRender=!1)}disconnectedCallback(){}_createActionButton(e,n){const t=document.createElement("button");if(t.textContent=e.label,t.dataset.action=e.name,e.className){const o=String(e.className).split(" ").filter(Boolean);o.length>0&&t.classList.add(...o)}return e.name==="edit"&&t.classList.add("edit-btn"),e.name==="delete"&&t.classList.add("delete-btn"),t}}class y extends b{constructor(){super(),this._styleElement.textContent=this.getStyles()}getStyles(){return`
            /* Estilos base del host y contenedor genérico */
            :host {
                display: block;
                font-family: sans-serif;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px; /* Añadido para separación */
            }
            .display-container { /* El contenedor creado en la clase base */
                 /* Estilos específicos si son necesarios para el contenedor de la tabla */
                 overflow-x: auto; /* Permitir scroll horizontal si la tabla es muy ancha */
            }
            .no-data { /* Estilo para cuando no hay datos */
                padding: 15px;
                text-align: center;
                color: #666;
            }

            /* Estilos de la tabla */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 0.95em; /* Tamaño de fuente base */
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px 10px; /* Ajuste de padding */
                text-align: left;
                vertical-align: middle; /* Alinear verticalmente */
                white-space: nowrap; /* Evitar que el texto se rompa por defecto */
            }
            /* Permitir que algunas celdas rompan línea si es necesario */
            td.wrap {
                 white-space: normal;
            }

            th {
                background-color: #f2f2f2; /* Fondo ligero para cabecera */
                font-weight: 600; /* Un poco más de peso */
                text-transform: capitalize;
                position: sticky; /* Cabecera fija si el contenedor tiene overflow */
                top: 0;
                z-index: 1;
            }
            tr:nth-child(even) { /* Rayado ligero para filas pares */
                 background-color: #f9f9f9;
            }
            tr:hover {
                 background-color: #e9e9e9; /* Resaltado al pasar el ratón */
            }

            /* Estilos de los botones de acción */
            button {
                padding: 5px 10px;
                margin-right: 5px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 0.9em; /* Tamaño de fuente ligeramente menor */
                transition: filter 0.2s, background-color 0.2s, border-color 0.2s; /* Transición suave */
                background-color: #fff; /* Fondo blanco por defecto */
            }
            button:last-child {
                margin-right: 0; /* Sin margen derecho en el último botón */
            }
            button:hover {
                filter: brightness(0.9); /* Oscurecer ligeramente */
            }
            button.edit-btn {
                background-color: #e7f3ff; /* Azul muy claro */
                border-color: #b8daff;
                color: #004085;
            }
            button.edit-btn:hover {
                 background-color: #d0e8ff;
            }
            button.delete-btn {
                background-color: #f8d7da; /* Rojo claro */
                color: #721c24;
                border-color: #f5c6cb;
            }
             button.delete-btn:hover {
                 background-color: #f1c1c5;
             }
            /* Puedes añadir aquí estilos para clases de botones personalizados */
            /* button.mi-clase-personalizada { ... } */

            .actions-cell {
                white-space: nowrap; /* Evita que los botones se separen */
                width: 1%; /* Mínimo ancho necesario */
                text-align: center; /* Centrar botones */
                padding: 4px 8px; /* Menos padding para acciones */
            }
        `}render(){if(this._container.innerHTML="",!this._data||this._data.length===0){const s=document.createElement("div");s.classList.add("no-data"),s.textContent="No hay datos para mostrar.",this._container.appendChild(s);return}if(!this._keys||this._keys.length===0){const s=document.createElement("div");s.classList.add("no-data"),s.textContent="No se han definido claves (keys) para mostrar.",this._container.appendChild(s);return}const e=document.createElement("table"),n=document.createElement("thead"),t=document.createElement("tbody"),o=document.createElement("tr");this._keys.forEach(s=>{const i=document.createElement("th");i.textContent=s,o.appendChild(i)});const r=document.createElement("th");r.textContent="Acciones",r.classList.add("actions-cell"),o.appendChild(r),n.appendChild(o),this._data.forEach((s,i)=>{const a=document.createElement("tr");a.dataset.itemIndex=i,this._keys.forEach(p=>{const c=document.createElement("td"),h=s[p];typeof h=="boolean"?(c.textContent=h?"Sí":"No",c.style.textAlign="center"):c.textContent=h!=null?String(h):"",typeof h=="string"&&h.length>50&&c.classList.add("wrap"),a.appendChild(c)});const d=document.createElement("td");d.classList.add("actions-cell");const l=[...this._customActions];l.some(p=>p.name==="edit")||l.unshift({name:"edit",label:"Editar",className:"edit-btn"}),l.some(p=>p.name==="delete")||l.push({name:"delete",label:"Eliminar",className:"delete-btn"}),l.forEach(p=>{d.appendChild(this._createActionButton(p,i))}),a.appendChild(d),t.appendChild(a)}),e.appendChild(n),e.appendChild(t),this._container.appendChild(e)}}customElements.get("object-table")||customElements.define("object-table",y);class g extends b{static get observedAttributes(){return["layout","cards-per-row","header-key"]}constructor(){super(),this._cardLayout="flex",this._cardsPerRow=3,this._headerKeyField=null,this._styleElement.textContent=this.getStyles(),this._updateFromAttributes(),this._updateContainerLayout()}_updateFromAttributes(){this._cardLayout=this.getAttribute("layout")||"flex",this._cardsPerRow=parseInt(this.getAttribute("cards-per-row")||"3",10),this._headerKeyField=this.getAttribute("header-key")}attributeChangedCallback(e,n,t){if(n===t)return;let o=!1;switch(e){case"layout":this._cardLayout=t||"flex",this._updateContainerLayout();break;case"cards-per-row":this._cardsPerRow=parseInt(t||"3",10),this._updateContainerLayout();break;case"header-key":this._headerKeyField=t,o=!0;break}o&&this.isConnected&&this.render()}_updateContainerLayout(){this._container&&(this._container.classList.toggle("grid-layout",this._cardLayout==="grid"),this._container.style.setProperty("--cards-per-row",String(this._cardsPerRow)))}getStyles(){return`
            :host {
                display: block;
                font-family: sans-serif;
                margin-bottom: 15px;
            }

            .display-container { /* El contenedor de la clase base */
                display: flex; /* Por defecto usa flex */
                flex-wrap: wrap;
                gap: 16px;
                /* Variable CSS para controlar columnas en grid */
                --cards-per-row: 3; /* Valor por defecto */
            }

            .display-container.grid-layout {
                display: grid;
                grid-template-columns: repeat(var(--cards-per-row), 1fr);
                gap: 16px;
            }

             .no-data { /* Estilo para cuando no hay datos */
                padding: 20px;
                text-align: center;
                color: #666;
                width: 100%;
                background: #f9f9f9;
                border-radius: 8px;
                /* Ocupa todo el ancho en flex o grid */
                flex-basis: 100%;
                grid-column: 1 / -1;
            }

            .card {
                background-color: #fff;
                border: 1px solid #eee; /* Borde más sutil */
                border-radius: 8px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.08); /* Sombra más suave */
                overflow: hidden;
                transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
                display: flex;
                flex-direction: column;
                /* El tamaño se controla por el contenedor flex/grid */
            }

            /* En layout flex, definir un tamaño base */
            .display-container:not(.grid-layout) .card {
                 flex: 1 1 calc(33.333% - 11px); /* Base 3 por fila (ajustar calc si gap cambia) */
                 min-width: 250px; /* Ancho mínimo antes de envolver */
            }


            .card:hover {
                transform: translateY(-3px);
                box-shadow: 0 3px 10px rgba(0,0,0,0.12);
            }

            .card-header {
                background-color: #f8f9fa; /* Color de fondo ligeramente diferente */
                padding: 10px 15px; /* Ajuste de padding */
                font-weight: 600; /* Más peso */
                border-bottom: 1px solid #eee;
                font-size: 1.05em; /* Ligeramente más grande */
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .card-content {
                padding: 15px;
                flex-grow: 1; /* Permite que el contenido crezca */
            }

            .card-property {
                margin-bottom: 10px; /* Más espacio entre propiedades */
                display: flex;
                flex-direction: column;
                gap: 2px; /* Espacio entre label y value */
            }
             .card-property:last-child {
                 margin-bottom: 0;
             }

            .property-label {
                font-weight: 500;
                color: #555; /* Color de label */
                font-size: 0.8em; /* Tamaño de label */
                text-transform: capitalize;
            }

            .property-value {
                word-break: break-word;
                font-size: 0.95em; /* Tamaño del valor */
                color: #222; /* Color del valor */
            }
             /* Formato especial para booleanos */
             .property-value[data-type="boolean"] {
                 font-style: italic;
                 color: #007bff; /* Azul para 'Sí' */
             }
             .property-value[data-type="boolean"].false {
                 color: #6c757d; /* Gris para 'No' */
             }


            .card-actions {
                padding: 10px 15px;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                background-color: #f8f9fa;
                border-top: 1px solid #eee;
                margin-top: auto; /* Empuja las acciones hacia abajo */
            }

            /* Estilos de botones (pueden heredar o ser específicos) */
            .card-actions button {
                padding: 6px 12px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 0.9em;
                transition: all 0.2s;
                background-color: #fff;
            }
            .card-actions button:hover {
                filter: brightness(0.95);
            }
            .card-actions button.edit-btn {
                background-color: #e7f3ff;
                border-color: #b8daff;
                color: #004085;
            }
             .card-actions button.edit-btn:hover {
                 background-color: #d0e8ff;
            }
            .card-actions button.delete-btn {
                background-color: #f8d7da;
                color: #721c24;
                border-color: #f5c6cb;
            }
             .card-actions button.delete-btn:hover {
                 background-color: #f1c1c5;
             }

            /* Responsive (Ajustes para layout flex y grid) */
            @media (max-width: 992px) {
                 .display-container:not(.grid-layout) .card {
                     flex-basis: calc(50% - 8px); /* 2 por fila (ajustar calc) */
                 }
                 /* Podríamos definir --cards-per-row aquí si quisiéramos cambiarlo */
                 /* :host { --cards-per-row: 2; } */
            }

            @media (max-width: 576px) {
                 .display-container:not(.grid-layout) .card {
                     flex-basis: 100%; /* 1 por fila */
                 }
                 /* :host { --cards-per-row: 1; } */
            }
        `}render(){if(this._container.innerHTML="",this._updateContainerLayout(),!this._data||this._data.length===0){const e=document.createElement("div");e.classList.add("no-data"),e.textContent="No hay datos para mostrar.",this._container.appendChild(e);return}if(!this._keys||this._keys.length===0){const e=document.createElement("div");e.classList.add("no-data"),e.textContent="No se han definido claves (keys) para mostrar.",this._container.appendChild(e);return}this._data.forEach((e,n)=>{const t=document.createElement("div");t.classList.add("card"),t.dataset.itemIndex=n;const o=this._headerKeyField||this.getAttribute("header-key");if(o&&e[o]!==void 0&&e[o]!==null){const i=document.createElement("div");i.classList.add("card-header"),i.textContent=String(e[o]),t.appendChild(i)}const r=document.createElement("div");r.classList.add("card-content"),this._keys.forEach(i=>{if(i===o)return;const a=document.createElement("div");a.classList.add("card-property");const d=document.createElement("div");d.classList.add("property-label"),d.textContent=i;const l=document.createElement("div");l.classList.add("property-value");const p=e[i];typeof p=="boolean"?(l.textContent=p?"Sí":"No",l.dataset.type="boolean",l.classList.toggle("false",!p)):l.textContent=p!=null?String(p):"",a.appendChild(d),a.appendChild(l),r.appendChild(a)}),t.appendChild(r);const s=[...this._customActions];if(s.some(i=>i.name==="edit")||s.unshift({name:"edit",label:"Editar",className:"edit-btn"}),s.some(i=>i.name==="delete")||s.push({name:"delete",label:"Eliminar",className:"delete-btn"}),s.length>0){const i=document.createElement("div");i.classList.add("card-actions"),s.forEach(a=>{i.appendChild(this._createActionButton(a,n))}),t.appendChild(i)}this._container.appendChild(t)})}}customElements.get("object-cards")||customElements.define("object-cards",g);customElements.get("object-grid")||customElements.define("object-grid",class extends g{});class _ extends b{static get observedAttributes(){return["flex-direction","flex-wrap","justify-content","align-items"]}constructor(){super(),this._styleElement.textContent=this.getStyles(),this._updateContainerLayout()}attributeChangedCallback(e,n,t){n!==t&&(this._updateContainerLayout(),this.isConnected&&this.render())}_updateContainerLayout(){this._container&&(this._container.style.flexDirection=this.getAttribute("flex-direction")||"row",this._container.style.flexWrap=this.getAttribute("flex-wrap")||"wrap",this._container.style.justifyContent=this.getAttribute("justify-content")||"flex-start",this._container.style.alignItems=this.getAttribute("align-items")||"stretch")}getStyles(){return`
            :host {
                display: block;
                font-family: sans-serif;
                margin-bottom: 15px;
            }
            .display-container {
                display: flex;
                gap: 10px; /* Espacio entre items */
                /* Otros estilos flex son controlados por atributos */
            }
             .no-data {
                padding: 15px;
                text-align: center;
                color: #666;
                width: 100%;
                flex-basis: 100%; /* Ocupa todo el ancho en flex */
            }

            .flex-item {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 12px; /* Más padding */
                background-color: #fff;
                /* Flex item sizing (ejemplo: crecer/encoger) */
                flex: 1 1 220px; /* Crece, encoge, base de 220px */
                display: flex;
                flex-direction: column; /* Organiza contenido interno verticalmente */
                gap: 8px; /* Espacio interno */
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                transition: box-shadow 0.2s;
            }
            .flex-item:hover {
                 box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .item-content {
                 flex-grow: 1; /* El contenido ocupa el espacio disponible */
                 display: flex;
                 flex-direction: column;
                 gap: 5px; /* Espacio entre propiedades */
            }

            .item-property {
                font-size: 0.9em;
                display: flex; /* Label y value en línea por defecto */
                gap: 5px;
                line-height: 1.4;
            }
            .property-label {
                font-weight: 500;
                color: #333;
                text-transform: capitalize;
                /* margin-right: 5px; */ /* Reemplazado por gap */
                white-space: nowrap; /* Evitar que el label se rompa */
            }
            .property-value {
                color: #555;
                word-break: break-word; /* Permitir que valores largos se rompan */
            }
             /* Formato booleano */
             .property-value[data-type="boolean"] { font-style: italic; }
             .property-value[data-type="boolean"].true { color: #28a745; } /* Verde */
             .property-value[data-type="boolean"].false { color: #dc3545; } /* Rojo */


            .item-actions {
                display: flex;
                justify-content: flex-end;
                gap: 5px;
                margin-top: auto; /* Empujar acciones hacia abajo */
                border-top: 1px solid #eee; /* Separador opcional */
                padding-top: 10px; /* Espacio sobre los botones */
            }

            /* Estilos de botones (pueden ser los mismos que en otros componentes) */
            .item-actions button {
                padding: 4px 8px;
                font-size: 0.85em;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 3px;
                background-color: #f0f0f0;
                transition: filter 0.2s, background-color 0.2s;
            }
            .item-actions button:hover {
                filter: brightness(0.9);
                background-color: #e0e0e0;
            }
            .item-actions button.edit-btn { background-color: #e7f3ff; border-color: #b8daff; color: #004085; }
            .item-actions button.edit-btn:hover { background-color: #d0e8ff; }
            .item-actions button.delete-btn { background-color: #f8d7da; color: #721c24; border-color: #f5c6cb; }
            .item-actions button.delete-btn:hover { background-color: #f1c1c5; }
        `}render(){if(this._container.innerHTML="",this._updateContainerLayout(),!this._data||this._data.length===0){const e=document.createElement("div");e.classList.add("no-data"),e.textContent="No hay datos para mostrar.",this._container.appendChild(e);return}if(!this._keys||this._keys.length===0){const e=document.createElement("div");e.classList.add("no-data"),e.textContent="No se han definido claves (keys) para mostrar.",this._container.appendChild(e);return}this._data.forEach((e,n)=>{const t=document.createElement("div");t.classList.add("flex-item"),t.dataset.itemIndex=n;const o=document.createElement("div");o.classList.add("item-content"),this._keys.forEach(s=>{const i=document.createElement("div");i.classList.add("item-property");const a=document.createElement("span");a.classList.add("property-label"),a.textContent=`${s}:`;const d=document.createElement("span");d.classList.add("property-value");const l=e[s];typeof l=="boolean"?(d.textContent=l?"Sí":"No",d.dataset.type="boolean",d.classList.toggle("true",l),d.classList.toggle("false",!l)):d.textContent=l!=null?String(l):"",i.appendChild(a),i.appendChild(d),o.appendChild(i)}),t.appendChild(o);const r=[...this._customActions];if(r.some(s=>s.name==="edit")||r.unshift({name:"edit",label:"Editar",className:"edit-btn"}),r.some(s=>s.name==="delete")||r.push({name:"delete",label:"Eliminar",className:"delete-btn"}),r.length>0){const s=document.createElement("div");s.classList.add("item-actions"),r.forEach(i=>{s.appendChild(this._createActionButton(i,n))}),t.appendChild(s)}this._container.appendChild(t)})}}customElements.get("object-flex-list")||customElements.define("object-flex-list",_);class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._managedComponents={},this._eventListeners={};const e=document.createElement("style");e.textContent=`
            :host {
                display: block;
                padding: 10px;
            }
            .manager-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .component-wrapper { /* Contenedor para título + componente */
                 border: 1px solid #e0e0e0;
                 border-radius: 6px;
                 padding: 15px;
                 background-color: #fdfdfd;
                 box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            }
            .component-title {
                margin: 0 0 10px 0; /* Más espacio debajo del título */
                font-size: 1.2em; /* Título más grande */
                color: #333;
                font-weight: 600;
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
            }
        `,this._container=document.createElement("div"),this._container.classList.add("manager-container"),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this._container),this._handleComponentEvent=this._handleComponentEvent.bind(this)}connectedCallback(){this._container.addEventListener("edit-item",this._handleComponentEvent),this._container.addEventListener("delete-item",this._handleComponentEvent),Object.keys(this._eventListeners).forEach(e=>{["edit-item","delete-item"].includes(e)||this._container.addEventListener(e,this._handleComponentEvent)}),console.log("GridManager conectado.")}disconnectedCallback(){this._container.removeEventListener("edit-item",this._handleComponentEvent),this._container.removeEventListener("delete-item",this._handleComponentEvent),Object.keys(this._eventListeners).forEach(e=>{["edit-item","delete-item"].includes(e)||this._container.removeEventListener(e,this._handleComponentEvent)}),this._managedComponents={},this._eventListeners={},console.log("GridManager desconectado.")}addComponent(e,n={}){if(!e||typeof e!="string")return console.error("GridManager: Se requiere un ID (string) para añadir un componente."),null;if(this._managedComponents[e])return console.warn(`GridManager: Ya existe un componente con el ID "${e}".`),this._managedComponents[e].element;if(!n.keys||!Array.isArray(n.keys))return console.error(`GridManager: La configuración para "${e}" debe incluir un array 'keys'.`),null;const{keys:t,initialData:o=[],actions:r=[],title:s="",displayType:i="cards",displayOptions:a={}}=n;let d;switch(i.toLowerCase()){case"table":d="object-table";break;case"flex":d="object-flex-list";break;case"cards":default:d="object-cards";break}if(!customElements.get(d))return console.error(`GridManager: El componente <${d}> no está definido.`),null;const l=document.createElement("div");if(l.classList.add("component-wrapper"),l.dataset.componentId=e,s){const c=document.createElement("h3");c.classList.add("component-title"),c.textContent=s,l.appendChild(c)}const p=document.createElement(d);p.id=`managed-${e}`,Array.isArray(r)&&r.forEach(c=>{c.name&&c.label&&!["edit","delete"].includes(c.name)?(p.addAction(c.name,c.label,c.className||""),this._eventListeners[c.name]||(this._container.addEventListener(c.name,this._handleComponentEvent),this._eventListeners[c.name]=!0)):c.name&&c.label||console.warn(`GridManager: Acción inválida para "${e}":`,c)});for(const[c,h]of Object.entries(a)){const u=c.replace(/[A-Z]/g,f=>`-${f.toLowerCase()}`);typeof h=="boolean"?h?p.setAttribute(u,""):p.removeAttribute(u):h!=null&&p.setAttribute(u,String(h))}return p.setData(o,t),l.appendChild(p),this._container.appendChild(l),this._managedComponents[e]={element:p,wrapper:l,config:n},console.log(`GridManager: Componente "${e}" (${d}) añadido.`),p}getComponent(e){return this._managedComponents[e]?this._managedComponents[e].element:null}getComponentConfig(e){return this._managedComponents[e]?this._managedComponents[e].config:null}removeComponent(e){const n=this._managedComponents[e];return n&&n.wrapper?(n.wrapper.remove(),delete this._managedComponents[e],console.log(`GridManager: Componente "${e}" eliminado.`),this._cleanupEventListeners(),!0):(console.warn(`GridManager: No se encontró un componente con el ID "${e}" para eliminar.`),!1)}clearAllComponents(){this._container.innerHTML="",this._managedComponents={},Object.keys(this._eventListeners).forEach(e=>{["edit-item","delete-item"].includes(e)||this._container.removeEventListener(e,this._handleComponentEvent)}),this._eventListeners={},console.log("GridManager: Todos los componentes eliminados.")}_cleanupEventListeners(){const e=new Set;Object.values(this._managedComponents).forEach(n=>{n.element._customActions.forEach(t=>{["edit","delete"].includes(t.name)||e.add(t.name)})}),Object.keys(this._eventListeners).forEach(n=>{!["edit-item","delete-item"].includes(n)&&!e.has(n)&&(this._container.removeEventListener(n,this._handleComponentEvent),delete this._eventListeners[n])})}_handleComponentEvent(e){const n=e.target,t=e.detail,o=e.type,r=n.closest(".component-wrapper"),s=r?r.dataset.componentId:"unknown";if(s==="unknown"){console.warn("GridManager: Evento recibido pero no se pudo determinar el componentId.",e);return}if(!t||t.item===void 0||t.index===void 0){console.warn(`GridManager: Evento "${o}" recibido de "${s}" sin detail esperado ({item, index}).`,e);return}console.log(`GridManager: Evento "${o}" recibido del componente "${s}". Índice: ${t.index}, Datos:`,t.item),this.dispatchEvent(new CustomEvent("component-action",{detail:{componentId:s,action:o,item:t.item,index:t.index,sourceElement:n},bubbles:!0,composed:!0}))}}customElements.get("grid-manager")||customElements.define("grid-manager",x);class C extends HTMLElement{constructor(){super(),this._initialItem={},this._currentItem={},this._fieldConfigs={},this._customActions=[],this.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=this.getStyles(),this._formContainer=document.createElement("form"),this._formContainer.classList.add("edit-form-container"),this._formContainer.setAttribute("novalidate",""),this._fieldsContainer=document.createElement("div"),this._fieldsContainer.classList.add("fields-container"),this._actionsContainer=document.createElement("div"),this._actionsContainer.classList.add("form-actions"),this._formContainer.appendChild(this._fieldsContainer),this._formContainer.appendChild(this._actionsContainer),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this._formContainer),this._handleActionClick=this._handleActionClick.bind(this),this._handleInputChange=this._handleInputChange.bind(this),this._handleSubmit=this._handleSubmit.bind(this)}getStyles(){return`
            :host {
                display: block;
                font-family: sans-serif;
                padding: 15px;
                border: 1px solid #eee;
                border-radius: 8px;
                background-color: #f9f9f9;
                margin-bottom: 15px;
            }

            .edit-form-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .fields-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
                gap: 10px 15px; /* Row and column gap */
                padding-bottom: 15px; /* Space before actions */
                border-bottom: 1px solid #eee;
            }

            /* Style wrapper for label + c-inp */
            .field-wrapper {
                display: flex;
                flex-direction: column;
                gap: 4px; /* Space between label and input */
            }

            label {
                font-weight: 500;
                font-size: 0.9em;
                color: #333;
                text-transform: capitalize;
            }

            /* Target c-inp specifically if needed */
            c-inp {
                 margin: 0; /* Override default margin if c-inp has one */
                 padding: 0; /* Override default padding if c-inp has one */
            }

             /* Add styles for invalid state feedback */
            .field-wrapper.invalid label {
                color: #dc3545; /* Red label */
            }
            /* c-inp itself should handle internal invalid state visuals */


            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            /* Basic button styling (can be refined) */
             button {
                padding: 8px 16px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 0.95em;
                transition: background-color 0.2s, border-color 0.2s, color 0.2s;
                background-color: #fff;
            }

            button:hover {
                filter: brightness(0.95);
            }

            .save-btn {
                background-color: #28a745; /* Green */
                color: white;
                border-color: #28a745;
            }
             .save-btn:hover {
                 background-color: #218838;
                 border-color: #1e7e34;
             }


            .cancel-btn {
                background-color: #6c757d; /* Gray */
                color: white;
                border-color: #6c757d;
            }
            .cancel-btn:hover {
                background-color: #5a6268;
                border-color: #545b62;
            }

            /* Style for custom buttons (example) */
            button.my-custom-class {
                background-color: #007bff;
                color: white;
                border-color: #007bff;
            }
            button.my-custom-class:hover {
                 background-color: #0056b3;
                 border-color: #0056b3;
             }

             /* Dark Mode propagation */
            :host([darkmode]) {
                 background-color: #333;
                 border-color: #555;
             }
            :host([darkmode]) label {
                 color: #eee;
             }
            :host([darkmode]) .fields-container {
                 border-bottom-color: #555;
             }
             :host([darkmode]) button {
                background-color: #555;
                border-color: #777;
                color: #eee;
             }
             :host([darkmode]) button:hover {
                 filter: brightness(1.1);
             }
             /* Ensure c-inp receives darkmode */
             :host([darkmode]) c-inp {
                 color-scheme: dark; /* Hint for c-inp */
             }
        `}setConfig(e={},n={}){try{this._initialItem=JSON.parse(JSON.stringify(e||{})),this._currentItem=JSON.parse(JSON.stringify(e||{}))}catch(t){console.error("ObjectEditForm: Error deep copying item in setConfig",t),this._initialItem={},this._currentItem={}}this._fieldConfigs=n||{},this.isConnected&&this.render()}setItem(e={}){try{this._initialItem=JSON.parse(JSON.stringify(e||{})),this._currentItem=JSON.parse(JSON.stringify(e||{}))}catch(n){console.error("ObjectEditForm: Error deep copying item in setItem",n);return}this.isConnected&&this._updateFieldValues()}addAction(e,n,t=""){if(typeof e!="string"||!e){console.error("ObjectEditForm: actionName must be a non-empty string.");return}if(typeof n!="string"){console.error("ObjectEditForm: buttonLabel must be a string.");return}this._customActions=this._customActions.filter(o=>o.name!==e),this._customActions.push({name:e,label:n,className:t}),this.isConnected&&this._renderActions()}validate(){let e=!0;return this.shadowRoot.querySelectorAll("c-inp").forEach(t=>{const o=t.closest(".field-wrapper");let r=!0;if(typeof t.isValid=="function")r=t.isValid();else{const s=t.shadowRoot?.querySelector("input, select, textarea");s&&typeof s.checkValidity=="function"?r=s.checkValidity():console.warn(`ObjectEditForm: Cannot validate field "${t.getAttribute("name")}". No isValid() or checkValidity() found.`)}r?o&&o.classList.remove("invalid"):(e=!1,o&&o.classList.add("invalid"),console.warn(`Field "${t.getAttribute("name")}" is invalid.`))}),e}getCurrentData(){const e={...this._currentItem};return this.shadowRoot.querySelectorAll("c-inp").forEach(t=>{const o=t.getAttribute("name");if(o)if(typeof t.getVal=="function")e[o]=t.getVal(),console.log("Input:",e[o],"Value:",t.getVal());else{const r=t.shadowRoot?.querySelector("input, select, textarea");r?e[o]=r.type==="checkbox"?r.checked:r.value:console.warn(`ObjectEditForm: Cannot get value for field "${o}". No getVal() or internal input found.`)}}),e}reset(){this.setItem(this._initialItem)}render(){this._renderFields(),this._renderActions()}_renderFields(){if(this._fieldsContainer.innerHTML="",!this._currentItem||!this._fieldConfigs||Object.keys(this._fieldConfigs).length===0){this._fieldsContainer.textContent="No fields configured.";return}const e=this.hasAttribute("darkmode");for(const n in this._fieldConfigs)if(Object.hasOwnProperty.call(this._fieldConfigs,n)){const t=this._fieldConfigs[n];if(t.hidden)continue;const o=this._currentItem?.[n],r=document.createElement("div");r.classList.add("field-wrapper");const s=document.createElement("label"),i=`edit-form-${n}-${Date.now()}`;s.setAttribute("for",i),s.textContent=t.label||n,r.appendChild(s);const a=document.createElement("c-inp");if(a.setAttribute("id",i),a.setAttribute("name",n),a.setAttribute("type",t.type||"text"),o!=null&&(t.type==="checkbox"||t.type==="switch"||t.type==="boolean"?o?(a.setAttribute("checked",""),a.setAttribute("value","true")):a.setAttribute("value","false"):a.setAttribute("value",String(o))),t.placeholder&&a.setAttribute("placeholder",t.placeholder),t.required&&a.setAttribute("required",""),t.disabled&&a.setAttribute("disabled",""),t.readonly&&a.setAttribute("readonly",""),t.pattern&&a.setAttribute("pattern",t.pattern),t.title&&a.setAttribute("title",t.title),t.options&&Array.isArray(t.options))try{a.setAttribute("options",JSON.stringify(t.options))}catch(d){console.error(`ObjectEditForm: Failed to stringify options for field "${n}"`,d)}t.min!==void 0&&a.setAttribute("min",t.min),t.max!==void 0&&a.setAttribute("max",t.max),t.step!==void 0&&a.setAttribute("step",t.step),t.rows!==void 0&&a.setAttribute("rows",t.rows),t.cols!==void 0&&a.setAttribute("cols",t.cols),e&&a.setAttribute("darkmode",""),r.appendChild(a),this._fieldsContainer.appendChild(r),(t.type==="checkbox"||t.type==="switch"||t.type==="boolean")&&Promise.resolve().then(()=>{if(typeof a.setVal=="function")try{a.setVal(!!o)}catch(d){console.error(`ObjectEditForm: Error setting initial value for boolean field "${n}" using setVal`,d)}})}}_renderActions(){this._actionsContainer.innerHTML="";const e=document.createElement("button");e.type="button",e.textContent="Cancel",e.classList.add("cancel-btn"),e.dataset.action="cancel",this._actionsContainer.appendChild(e);const n=document.createElement("button");n.type="submit",n.textContent="Save",n.classList.add("save-btn"),n.dataset.action="save",this._actionsContainer.appendChild(n),this._customActions.forEach(t=>{const o=document.createElement("button");o.type="button",o.textContent=t.label,o.dataset.action=t.name,t.className&&o.classList.add(...t.className.split(" ").filter(Boolean)),this._actionsContainer.appendChild(o)})}_updateFieldValues(){this.shadowRoot.querySelectorAll("c-inp").forEach(n=>{const t=n.getAttribute("name");if(t&&Object.hasOwnProperty.call(this._currentItem,t)){const r=this._currentItem[t];if(typeof n.setVal=="function")try{n.setVal(r)}catch(s){console.error(`ObjectEditForm: Error setting value for field "${t}" using setVal`,s)}else n.type==="checkbox"||n.type==="switch"||n.type==="boolean"?(r?n.setAttribute("checked",""):n.removeAttribute("checked"),n.setAttribute("value",r?"true":"false")):n.setAttribute("value",String(r)),console.warn(`ObjectEditForm: Field "${t}" has no setVal method, attempting attribute update.`)}else if(t)if(typeof n.setVal=="function")try{n.setVal(null)}catch{}else n.removeAttribute("value"),n.removeAttribute("checked");const o=n.closest(".field-wrapper");o&&o.classList.remove("invalid")})}_handleInputChange(e){if(e.target.tagName==="C-INP"&&e.detail&&e.detail.name!==void 0){const{name:n,value:t}=e.detail;this._currentItem[n]=t;const o=e.target.closest(".field-wrapper");o&&o.classList.remove("invalid"),this.dispatchEvent(new CustomEvent("field-change",{detail:{name:n,value:t},bubbles:!0,composed:!0}))}else if(e.target.tagName==="C-INP"){const n=e.target.getAttribute("name");if(n){let t;try{if(typeof e.target.getVal=="function")t=e.target.getVal();else{const o=e.target.shadowRoot?.querySelector("input, select, textarea");o&&(t=o.type==="checkbox"?o.checked:o.value)}if(t!==void 0){this._currentItem[n]=t;const o=e.target.closest(".field-wrapper");o&&o.classList.remove("invalid"),this.dispatchEvent(new CustomEvent("field-change",{detail:{name:n,value:t},bubbles:!0,composed:!0}))}}catch(o){console.error(`ObjectEditForm: Could not get value from c-inp field "${n}" on change event.`,o)}}}}_handleSubmit(e){e.preventDefault(),console.log("Form submit intercepted"),this._handleSaveAction()}_handleActionClick(e){const n=e.target;if(n.tagName==="BUTTON"&&n.dataset.action){const t=n.dataset.action;if(t!=="save")if(t==="cancel")this.dispatchEvent(new CustomEvent("cancel-edit",{detail:null,bubbles:!0,composed:!0})),this.reset();else{const o=this.getCurrentData();this.dispatchEvent(new CustomEvent(t,{detail:o,bubbles:!0,composed:!0}))}}}_handleSaveAction(){if(console.log("Handling save action..."),this.validate()){console.log("Form is valid. Dispatching save-item.");const e=this.getCurrentData();try{this._initialItem=JSON.parse(JSON.stringify(e))}catch(n){console.error("ObjectEditForm: Error updating initialItem after save",n)}this.dispatchEvent(new CustomEvent("save-item",{detail:e,bubbles:!0,composed:!0}))}else{console.warn("ObjectEditForm: Validation failed. Save prevented.");const e=this.shadowRoot.querySelector(".field-wrapper.invalid c-inp");if(e)try{typeof e.focus=="function"?e.focus():e.shadowRoot?.querySelector("input, select, textarea")?.focus()}catch(n){console.warn("ObjectEditForm: Could not focus first invalid field.",n)}}}connectedCallback(){this._actionsContainer.addEventListener("click",this._handleActionClick),this._formContainer.addEventListener("change",this._handleInputChange),this._formContainer.addEventListener("submit",this._handleSubmit),this._fieldsContainer.innerHTML===""&&Object.keys(this._fieldConfigs).length>0?this.render():this._actionsContainer.innerHTML===""&&this._renderActions(),this.hasAttribute("darkmode")&&this.shadowRoot.querySelectorAll("c-inp").forEach(e=>e.setAttribute("darkmode",""))}disconnectedCallback(){this._actionsContainer.removeEventListener("click",this._handleActionClick),this._formContainer.removeEventListener("change",this._handleInputChange),this._formContainer.removeEventListener("submit",this._handleSubmit)}static get observedAttributes(){return["darkmode"]}attributeChangedCallback(e,n,t){if(e==="darkmode"&&n!==t){const o=t!==null;this.shadowRoot.querySelectorAll("c-inp").forEach(r=>{o?r.setAttribute("darkmode",""):r.removeAttribute("darkmode")})}}}customElements.get("object-edit-form")||customElements.define("object-edit-form",C);class v extends HTMLElement{constructor(){super(),this._mode="display",this._currentItem={},this._fieldConfigs={},this._headerKey=null,this._customActions=[],this.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=this.getStyles(),this._container=document.createElement("div"),this._container.classList.add("dynamic-container"),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this._container),this._handleDisplayActionClick=this._handleDisplayActionClick.bind(this),this._handleSave=this._handleSave.bind(this),this._handleCancel=this._handleCancel.bind(this),this._handleExternalFieldChange=this._handleExternalFieldChange.bind(this)}static get observedAttributes(){return["darkmode","header-key"]}attributeChangedCallback(e,n,t){if(n!==t){let o=!1;e==="header-key"&&(this._headerKey=t,o=!0),e==="darkmode"&&(o=!0),o&&this.isConnected&&this.render()}}getStyles(){return`
            :host {
                display: block;
                font-family: sans-serif;
                margin-bottom: 15px;
                /* Ensure container takes up space */
            }

            .dynamic-container {
                 /* Basic container doesn't need much styling itself */
                 position: relative; /* Context for potential absolute elements if needed */
            }

            /* --- Display Mode Styles (mimic ObjectCards card) --- */
            .display-card {
                background-color: #fff;
                border: 1px solid #eee;
                border-radius: 8px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transition: box-shadow 0.2s;
            }
            :host([darkmode]) .display-card {
                background-color: #333;
                border-color: #555;
                color: #eee;
            }

            .display-card:hover {
                 box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            }
            :host([darkmode]) .display-card:hover {
                 box-shadow: 0 2px 8px rgba(255,255,255,0.1);
            }


            .display-header {
                background-color: #f5f5f5;
                padding: 12px 16px;
                font-weight: bold;
                border-bottom: 1px solid #eee;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            :host([darkmode]) .display-header {
                background-color: #444;
                border-bottom-color: #555;
            }

            .display-content {
                padding: 16px;
                flex-grow: 1;
                 /* Simple grid for properties */
                 display: grid;
                 grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                 gap: 10px 15px;
            }


            .display-property {
                margin-bottom: 8px;
                display: flex;
                flex-direction: column; /* Stack label and value */
                gap: 2px;
            }

            .display-property-label {
                font-weight: 500;
                color: #666;
                font-size: 0.8em;
                text-transform: capitalize;
                margin-bottom: 2px;
            }
             :host([darkmode]) .display-property-label {
                 color: #bbb;
             }

            .display-property-value {
                word-break: break-word;
                font-size: 0.95em;
            }
             /* Display boolean/switch values nicely */
             .display-property-value[data-type="boolean"],
             .display-property-value[data-type="switch"],
             .display-property-value[data-type="checkbox"] {
                 font-style: italic;
                 color: #333;
             }
             :host([darkmode]) .display-property-value[data-type="boolean"],
             :host([darkmode]) .display-property-value[data-type="switch"],
             :host([darkmode]) .display-property-value[data-type="checkbox"] {
                  color: #ddd;
             }


            .display-actions {
                padding: 10px 16px;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                background-color: #fafafa;
                border-top: 1px solid #eee;
            }
            :host([darkmode]) .display-actions {
                background-color: #3a3a3a;
                border-top-color: #555;
            }


            /* --- Button Styles (can be shared or specific) --- */
            .display-actions button { /* Basic button style */
                padding: 6px 12px;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 0.9em;
                transition: all 0.2s;
                background-color: #fff;
            }
            .display-actions button:hover { filter: brightness(0.95); }
            :host([darkmode]) .display-actions button {
                 background-color: #555;
                 border-color: #777;
                 color: #eee;
            }
             :host([darkmode]) .display-actions button:hover {
                 filter: brightness(1.1);
             }


            /* Specific button styles */
            .edit-btn { background-color: #CCE5FF; border-color: #b8daff; color: #004085; }
            .delete-btn { background-color: #F8D7DA; color: #721c24; border-color: #f5c6cb; }
             :host([darkmode]) .edit-btn { background-color: #0056b3; border-color: #0056b3; color: white; }
             :host([darkmode]) .delete-btn { background-color: #b81c2c; border-color: #b81c2c; color: white; }

            /* --- Edit Mode Styles --- */
            /* object-edit-form should have its own styles, but we might need positioning */
            object-edit-form {
                display: block; /* Ensure it takes space */
            }
        `}setConfig(e={},n={}){try{this._currentItem=JSON.parse(JSON.stringify(e||{}))}catch(t){console.error("DynamicObjectDisplay: Error deep copying item in setConfig",t),this._currentItem={}}this._fieldConfigs=n||{},this._mode="display",this._headerKey=this.getAttribute("header-key"),this.isConnected&&this.render()}setItem(e={}){try{this._currentItem=JSON.parse(JSON.stringify(e||{}))}catch(n){console.error("DynamicObjectDisplay: Error deep copying item in setItem",n);return}this.isConnected&&this.render()}addAction(e,n,t=""){if(typeof e!="string"||!e||typeof n!="string"){console.error("DynamicObjectDisplay: Invalid arguments for addAction.");return}this._customActions=this._customActions.filter(o=>o.name!==e),this._customActions.push({name:e,label:n,className:t}),this._mode==="display"&&this.isConnected&&this.render()}render(){if(this._container.innerHTML="",!this._currentItem||Object.keys(this._currentItem).length===0||!this._fieldConfigs||Object.keys(this._fieldConfigs).length===0){this._container.textContent="No item or configuration provided.";return}this._mode==="display"?this._renderDisplayView():this._mode==="edit"&&this._renderEditView()}_renderDisplayView(){const e=document.createElement("div");e.classList.add("display-card");const n=this._headerKey||this.getAttribute("header-key");if(n&&this._currentItem[n]!==void 0){const i=document.createElement("div");i.classList.add("display-header"),i.textContent=String(this._currentItem[n]),e.appendChild(i)}const t=document.createElement("div");t.classList.add("display-content");for(const i in this._fieldConfigs)if(i!==n&&!this._fieldConfigs[i]?.hidden&&Object.hasOwnProperty.call(this._fieldConfigs,i)){const a=this._fieldConfigs[i],d=this._currentItem[i],l=document.createElement("div");l.classList.add("display-property");const p=document.createElement("div");p.classList.add("display-property-label"),p.textContent=a.label||i,l.appendChild(p);const c=document.createElement("div");c.classList.add("display-property-value");const h=a.type||"text";if(c.dataset.type=h,h==="boolean"||h==="switch"||h==="checkbox")c.textContent=d?a.trueLabel||"Yes":a.falseLabel||"No";else if(h==="select"&&a.options&&Array.isArray(a.options)){const u=a.options.find(f=>String(f.value)===String(d));c.textContent=u?u.label:d??""}else d==null?c.textContent="":c.textContent=String(d);l.appendChild(c),t.appendChild(l)}e.appendChild(t);const o=document.createElement("div");o.classList.add("display-actions"),o.addEventListener("click",this._handleDisplayActionClick);const r=document.createElement("button");r.textContent="Edit",r.classList.add("edit-btn"),r.dataset.action="edit",o.appendChild(r);const s=document.createElement("button");s.textContent="Delete",s.classList.add("delete-btn"),s.dataset.action="delete",o.appendChild(s),this._customActions.forEach(i=>{const a=document.createElement("button");a.textContent=i.label,a.dataset.action=i.name,i.className&&a.classList.add(...i.className.split(" ").filter(Boolean)),o.appendChild(a)}),e.appendChild(o),this._container.appendChild(e)}_renderEditView(){if(!customElements.get("object-edit-form")){this._container.textContent="Error: object-edit-form component not defined.",console.error("DynamicObjectDisplay: Cannot render edit view, object-edit-form is not defined.");return}const e=document.createElement("object-edit-form");this.hasAttribute("darkmode")?e.setAttribute("darkmode",""):e.removeAttribute("darkmode");try{e.setConfig(JSON.parse(JSON.stringify(this._currentItem)),this._fieldConfigs)}catch(n){console.error("DynamicObjectDisplay: Error setting config on object-edit-form",n),this._container.textContent="Error initializing editor.";return}e.addEventListener("save-item",this._handleSave),e.addEventListener("cancel-edit",this._handleCancel),e.addEventListener("field-change",this._handleExternalFieldChange),this._container.appendChild(e)}_handleDisplayActionClick(e){const n=e.target.closest("button[data-action]");if(!n)return;const t=n.dataset.action;if(t==="edit")this._switchToEdit();else if(t==="delete")try{this.dispatchEvent(new CustomEvent("delete-item",{detail:JSON.parse(JSON.stringify(this._currentItem)),bubbles:!0,composed:!0}))}catch(o){console.error("DynamicObjectDisplay: Error dispatching delete-item event",o)}else try{this.dispatchEvent(new CustomEvent(t,{detail:JSON.parse(JSON.stringify(this._currentItem)),bubbles:!0,composed:!0}))}catch(o){console.error(`DynamicObjectDisplay: Error dispatching custom action "${t}" event`,o)}}_switchToEdit(){this._mode="edit",this.render()}_switchToDisplay(){this._mode="display",this.render()}_handleSave(e){console.log("DynamicObjectDisplay received save-item:",e.detail);try{this._currentItem=JSON.parse(JSON.stringify(e.detail)),this.dispatchEvent(new CustomEvent("item-updated",{detail:JSON.parse(JSON.stringify(this._currentItem)),bubbles:!0,composed:!0})),this._switchToDisplay()}catch(n){console.error("DynamicObjectDisplay: Error processing save-item event",n)}}_handleCancel(e){console.log("DynamicObjectDisplay received cancel-edit"),this._switchToDisplay()}_handleExternalFieldChange(e){}connectedCallback(){this._container.innerHTML===""&&Object.keys(this._fieldConfigs).length>0&&this.render()}disconnectedCallback(){}}customElements.get("dynamic-object-display")||customElements.define("dynamic-object-display",v);

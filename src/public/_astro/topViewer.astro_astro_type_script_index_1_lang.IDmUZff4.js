class b extends HTMLElement{static get observedAttributes(){return["top-count"]}constructor(){super(),this._data=null,this._topCount=3,this.attachShadow({mode:"open"}),this._render()}connectedCallback(){console.log("TopViewersList añadido al DOM.")}attributeChangedCallback(e,s,n){if(console.log(`Atributo '${e}' cambiado de '${s}' a '${n}'`),e==="top-count"){const t=parseInt(n,10);!isNaN(t)&&t>0?this._topCount=t:console.warn(`Valor inválido para top-count: '${n}'. Se usará el valor anterior: ${this._topCount}`),this._data&&this._render()}}updateData(e){if(!e||typeof e!="object"){console.error("updateData requiere un objeto válido.");return}if(!Array.isArray(e.topViewers)){console.error('La propiedad "topViewers" debe ser un array.'),this._data=null,this._render();return}this._data=e,this._render()}_render(){const e=this.shadowRoot;if(!e)return;e.innerHTML="";const s=document.createElement("style");s.textContent=`
          :host {
              display: block; /* Comportamiento por defecto de elementos custom */
              font-family: sans-serif;
              border-radius: 8px;
              margin: 10px auto;
          }
          h3 {
              margin-top: 0;
              padding-bottom: 5px;
          }
          ol {
              list-style: none;
              padding: 0;
              margin: 0;
          }
          li {
              display: flex;
              align-items: center;
              padding: 8px 0;
          }
          li:last-child {
              border-bottom: none;
          }
          .rank {
              font-weight: bold;
              margin-right: 10px;
              min-width: 20px;
              text-align: right;
              color: #555;
          }
          .profile-pic {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
              object-fit: cover; /* Para que la imagen no se deforme */
              border: 1px solid #ddd;
          }
          .user-info {
              flex-grow: 1;
              display: flex;
              flex-direction: column; /* Nombre arriba, monedas abajo */
          }
          .nickname {
              font-weight: bold;
              color: #007bff; /* Un color para destacar */
              font-size: 0.95em;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 200px; /* Evita nombres muy largos */
          }
          .coins {
              font-size: 0.85em;
              color: #666;
          }
          .no-data {
              color: #888;
              font-style: italic;
          }
      `,e.appendChild(s);const n=document.createElement("div");if(this._data&&this._data.topViewers&&Array.isArray(this._data.topViewers)){const{topViewers:t,viewerCount:h}=this._data,p=Array.isArray(t)?t.slice(0,this._topCount):[],f=document.createElement("h3");if(f.textContent=`Top ${p.length} Viewers`+(h?` (de ${h} totales)`:""),n.appendChild(f),p.length>0){const i=document.createElement("ol");p.forEach((r,C)=>{if(!r||!r.user){console.warn("Elemento inválido en topViewers:",r);return}const o=r.user,g=r.coinCount!==void 0?r.coinCount:"N/A",a=document.createElement("li"),m=document.createElement("span");m.className="rank",m.textContent=`${C+1}.`;const l=document.createElement("img");l.className="profile-pic";const x=o.profilePictureUrl||(Array.isArray(o.userDetails?.profilePictureUrls)&&o.userDetails.profilePictureUrls.length>0?o.userDetails.profilePictureUrls[0]:"/favicon.svg");l.src=x,l.alt=`Foto de perfil de ${o.nickname||o.uniqueId}`;const d=document.createElement("div");d.className="user-info";const c=document.createElement("span");c.className="nickname",c.textContent=o.nickname||o.uniqueId||"Usuario Desconocido",c.title=o.nickname||o.uniqueId||"Usuario Desconocido";const u=document.createElement("span");u.className="coins",u.textContent=`Monedas: ${g}`,d.appendChild(c),d.appendChild(u),a.appendChild(m),a.appendChild(l),a.appendChild(d),i.appendChild(a)}),n.appendChild(i)}else{const i=document.createElement("p");i.className="no-data",i.textContent="No hay viewers en el top para mostrar.",n.appendChild(i)}}else{const t=document.createElement("p");t.className="no-data",t.textContent="Esperando datos de los viewers...",n.appendChild(t)}e.appendChild(n)}}customElements.get("top-viewers-list")||customElements.define("top-viewers-list",b);

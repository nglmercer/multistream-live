import{i as d,r as f}from"./lit-element.CdPzzhzS.js";import{x as s}from"./lit-html.Cs9YtZST.js";import{t as m}from"./custom-element.BhZVzxrc.js";import{n as h,r as v}from"./state.k4TxN2nw.js";import{T as g}from"./socketManager.BZAsUqmV.js";import"./idb.CmwNWw1r.js";import"./Logger.BU1C1vw5.js";import"./UserProcessor.CznKL11N.js";var w=Object.defineProperty,C=Object.getOwnPropertyDescriptor,p=(e,r,o,i)=>{for(var t=i>1?void 0:i?C(r,o):r,n=e.length-1,l;n>=0;n--)(l=e[n])&&(t=(i?l(r,o,t):l(t))||t);return i&&t&&w(r,o,t),t};let a=class extends f{constructor(){super(...arguments),this.topCount=3,this._data=null}connectedCallback(){super.connectedCallback(),console.log("TopViewersList añadido al DOM.")}willUpdate(e){e.has("topCount")&&(console.log(`top-count cambiado a: ${this.topCount}`),(isNaN(this.topCount)||this.topCount<=0)&&(console.warn(`Valor inválido para top-count: '${this.topCount}'. Se usará el valor por defecto: 3`),this.topCount=3))}updateData(e){if(!e||typeof e!="object"){console.error("updateData requiere un objeto válido."),this._data=null,this.requestUpdate();return}if(!Array.isArray(e.topViewers)){console.error('La propiedad "topViewers" debe ser un array.'),this._data=null,this.requestUpdate();return}this._data=e,this.requestUpdate()}render(){if(!this._data||!this._data.topViewers||!Array.isArray(this._data.topViewers))return s`
        <p class="no-data">Esperando datos de los viewers...</p>
      `;const{topViewers:e,viewerCount:r}=this._data,o=e.slice(0,this.topCount);return s`
      <h3>
        Top ${o.length} Viewers
        ${r?s` (de ${r} totales)`:""}
      </h3>
      
      ${o.length>0?s`
            <ol>
              ${o.map((i,t)=>this.renderViewerItem(i,t))}
            </ol>
          `:s`<p class="no-data">No hay viewers en el top para mostrar.</p>`}
    `}renderViewerItem(e,r){if(!e||!e.user)return console.warn("Elemento inválido en topViewers:",e),s``;const o=e.user,i=e.coinCount!==void 0?e.coinCount:"N/A",t=o.profilePictureUrl||(Array.isArray(o.userDetails?.profilePictureUrls)&&o.userDetails.profilePictureUrls.length>0?o.userDetails.profilePictureUrls[0]:"/favicon.svg"),n=o.nickname||o.uniqueId||"Usuario Desconocido";return s`
      <li>
        <span class="rank">${r+1}.</span>
        <img
          class="profile-pic"
          src="${t}"
          alt="Foto de perfil de ${n}"
        />
        <div class="user-info">
          <span class="nickname" title="${n}">
            ${n}
          </span>
          <span class="coins">Monedas: ${i}</span>
        </div>
      </li>
    `}};a.styles=d`
    :host {
      display: block;
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
      object-fit: cover;
      border: 1px solid #ddd;
    }

    .user-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .nickname {
      font-weight: bold;
      color: #007bff;
      font-size: 0.95em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    .coins {
      font-size: 0.85em;
      color: #666;
    }

    .no-data {
      color: #888;
      font-style: italic;
    }
  `;p([h({type:Number,attribute:"top-count"})],a.prototype,"topCount",2);p([v()],a.prototype,"_data",2);a=p([m("top-viewers-list")],a);const b={topViewers:[{user:{userId:"1",uniqueId:"user_alpha",nickname:"Alpha Gamer",profilePictureUrl:"/favicon.svg"},coinCount:150},{user:{userId:"2",uniqueId:"beta_viewer",nickname:"Beta Viewer",profilePictureUrl:"/favicon.svg"},coinCount:120},{user:{userId:"3",uniqueId:"gamma_watcher",nickname:"Gamma Watcher",profilePictureUrl:"/favicon.svg"},coinCount:95},{user:{userId:"4",uniqueId:"delta_supporter",nickname:"Delta Supporter",profilePictureUrl:"/favicon.svg"},coinCount:50},{user:{userId:"5",uniqueId:"epsilon_fan",nickname:"Epsilon Fan",profilePictureUrl:"/favicon.svg"},coinCount:25},{user:{userId:"6",uniqueId:"zeta_lurker",nickname:"Zeta Lurker",profilePictureUrl:"/favicon.svg"},coinCount:10}],viewerCount:250},u=document.getElementById("viewerListDefault");function c(e){u&&u.updateData(e)}g.on("roomUser",async e=>{console.log("Evento emitterEvent:",e),c(e)});document.addEventListener("DOMContentLoaded",()=>{c(b)});

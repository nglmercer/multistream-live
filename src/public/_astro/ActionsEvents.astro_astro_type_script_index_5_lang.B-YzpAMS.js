import{r as f,i as y,n as p}from"./property.DTDKM9eR.js";import{x as n}from"./lit-html.Cs9YtZST.js";import{r as v}from"./state.5GRZVynF.js";import{o as u,a as l}from"./CInput.CBocR2SB.js";import{e as k}from"./class-map.D2HkPoOL.js";import"./directive.CGE4aKEl.js";var w=Object.defineProperty,i=(s,t,e,o)=>{for(var r=void 0,d=s.length-1,a;d>=0;d--)(a=s[d])&&(r=a(t,e,r)||r);return r&&w(t,e,r),r};const m=(s,t)=>typeof t=="boolean"?!(["false","0","",null,void 0].includes(String(s).toLowerCase())||!s)===t:s==null?t==null||t==="":String(s)===String(t),x=(s,t)=>{const e=s.showIf;if(!e?.field)return!0;const o=t?.[e.field],{value:r,negate:d=!1}=e;let a;return Array.isArray(r)?a=r.some(g=>m(o,g)):a=m(o,r),d?!a:a},c=s=>{try{return JSON.parse(JSON.stringify(s||{}))}catch(t){return console.error("Error en deepCopy:",t),{}}};class h extends f{constructor(){super(),this.itm={},this.fCfg={},this.cActs=[],this.darkmode=!1,this._iItm={},this._cItm={},this._cItm=c(this.itm),this._iItm=c(this.itm)}static{this.styles=y`
      :host {
          display: block; font-family: sans-serif; padding: 15px;
          border: 1px solid #eee; border-radius: 8px;
          background-color: #f9f9f9; margin-bottom: 15px;
      }
      .ef-cont { display: flex; flex-direction: column; gap: 15px; }
      .flds-cont {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 10px 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;
      }
      .fld-wrp { display: flex; flex-direction: column; gap: 4px; }
      label { font-weight: 500; font-size: 0.9em; color: #333; text-transform: capitalize; }
      c-input { margin: 0; padding: 0; }
      .fld-wrp.inv label { color: #dc3545; }
      .acts { display: flex; justify-content: flex-end; gap: 10px; }
      button {
          padding: 8px 16px; cursor: pointer; border: 1px solid #ccc;
          border-radius: 4px; font-size: 0.95em; transition: all 0.2s;
          background-color: #fff;
      }
      button:hover { filter: brightness(0.95); }
      .sv-btn { background-color: #28a745; color: white; border-color: #28a745; }
      .cncl-btn { background-color: #6c757d; color: white; border-color: #6c757d; }
      :host([darkmode]) { background-color: #333; border-color: #555; }
      :host([darkmode]) label { color: #eee; }
      :host([darkmode]) .flds-cont { border-bottom-color: #555; }
      :host([darkmode]) button { background-color: #555; border-color: #777; color: #eee; }
      :host([darkmode]) c-input { color-scheme: dark; }
      .fld-wrp.hidden { display: none; }
  `}willUpdate(t){if(t.has("itm")){const e=c(this.itm);console.log("changedProperties",t,e),JSON.stringify(e)!==JSON.stringify(this._cItm)&&(this._cItm=e,this._iItm=c(e))}}validate(){let t=!0;return this.shadowRoot?.querySelectorAll("c-input").forEach(e=>{const o=e.closest(".fld-wrp");if(o?.classList.contains("hidden")){o?.classList.remove("inv");return}const r=typeof e.isValid=="function"?e.isValid():!0;o?.classList.toggle("inv",!r),r||(t=!1)}),t}getData(){return c(this._cItm)}reset(){this._cItm=c(this._iItm),this.shadowRoot?.querySelectorAll(".fld-wrp.inv").forEach(t=>t.classList.remove("inv"))}_handleInputChange(t){if(!t.detail||t.detail.name===void 0)return;const{name:e,value:o}=t.detail;this._cItm[e]!==o&&(this._cItm={...this._cItm,[e]:o},this.dispatchEvent(new CustomEvent("fld-chg",{detail:{name:e,value:o},bubbles:!0,composed:!0}))),t.target.closest(".fld-wrp")?.classList.remove("inv")}_handleSubmit(t){t.preventDefault(),this._handleSave()}_handleActionClick(t){const e=t.target.closest("button[data-act]");if(!e)return;const o=e.dataset.act;switch(o){case"save":break;case"cancel":this.dispatchEvent(new CustomEvent("cancel-edit",{bubbles:!0,composed:!0})),this.reset();break;default:o&&this.dispatchEvent(new CustomEvent(o,{detail:this.getData(),bubbles:!0,composed:!0}));break}}_handleSave(){if(this.validate()){const t=this.getData();this._iItm=c(t),this.dispatchEvent(new CustomEvent("save-item",{detail:t,bubbles:!0,composed:!0}))}else this.shadowRoot?.querySelector(".fld-wrp:not(.hidden).inv c-input")?.focus()}render(){return n`
            <form class="ef-cont" @submit=${this._handleSubmit} novalidate>
                <div class="flds-cont">
                    ${u(Object.entries(this.fCfg),([t,e])=>{if(e.hidden)return null;const o=x(e,this._cItm),r={"fld-wrp":!0,hidden:!o},d=!!(e.required&&o),a=`ef-${t}`;return n`
                            <div class=${k(r)}>
                                <label for=${a}>${e.label||t}</label>
                                <c-input
                                    id=${a}
                                    name=${t}
                                    .type=${e.type||"text"}
                                    .value=${this._cItm?.[t]}
                                    placeholder=${l(e.placeholder)}
                                    ?required=${d}
                                    ?disabled=${e.disabled}
                                    ?readonly=${e.readonly}
                                    .pattern=${l(e.pattern)}
                                    .title=${l(e.title)}
                                    .min=${l(e.min)}
                                    .max=${l(e.max)}
                                    .step=${l(e.step)}
                                    .rows=${l(e.rows)}
                                    .cols=${l(e.cols)}
                                    ?multiple=${e.multiple}
                                    .options=${e.options}
                                    ?darkmode=${this.darkmode}
                                    @change=${this._handleInputChange}
                                ></c-input>
                            </div>
                        `})}
                </div>
                <div class="acts" @click=${this._handleActionClick}>
                    <button type="button" class="cncl-btn" data-act="cancel">Cancel</button>
                    <button type="submit" class="sv-btn" data-act="save">Save</button>
                    ${u(this.cActs,t=>n`
                        <button type="button" data-act=${t.nm} class=${l(t.cls)}>${t.lbl}</button>
                    `)}
                </div>
            </form>
        `}}i([p({type:Object})],h.prototype,"itm");i([p({type:Object})],h.prototype,"fCfg");i([p({type:Array})],h.prototype,"cActs");i([p({type:Boolean,reflect:!0})],h.prototype,"darkmode");i([v()],h.prototype,"_iItm");i([v()],h.prototype,"_cItm");class b extends f{constructor(){super(),this.mode="display",this.itm={},this.fCfg={},this.cActs=[],this.darkmode=!1,this.addAct("delete","Eliminar","del-btn")}static{this.styles=y`
      /* Estilos sin cambios, omitidos por brevedad... */
      :host { display: block; font-family: sans-serif; margin-bottom: 15px; }
      .dyn-cont { position: relative; }
      .d-card {
          background-color: #fff; border: 1px solid #eee; border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); overflow: hidden;
          display: flex; flex-direction: column; transition: box-shadow 0.2s;
      }
      :host([darkmode]) .d-card { background-color: #333; border-color: #555; color: #eee; }
      .d-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
      :host([darkmode]) .d-card:hover { box-shadow: 0 2px 8px rgba(255,255,255,0.1); }
      .d-hdr {
          background-color: #f5f5f5; padding: 12px 16px; font-weight: bold;
          border-bottom: 1px solid #eee; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
      }
      :host([darkmode]) .d-hdr { background-color: #444; border-bottom-color: #555; }
      .d-cont {
          padding: 16px; flex-grow: 1; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px 15px;
      }
      .d-prop { margin-bottom: 8px; display: flex; flex-direction: column; gap: 2px; }
      .d-prop-lbl {
          font-weight: 500; color: #666; font-size: 0.8em;
          text-transform: capitalize; margin-bottom: 2px;
      }
      :host([darkmode]) .d-prop-lbl { color: #bbb; }
      .d-prop-val { word-break: break-word; font-size: 0.95em; }
      .d-prop-val[data-type="boolean"], .d-prop-val[data-type="switch"], .d-prop-val[data-type="checkbox"] {
          font-style: italic;
      }
      .d-acts {
          padding: 10px 16px; display: flex; justify-content: flex-end;
          gap: 8px; background-color: #fafafa; border-top: 1px solid #eee;
      }
      :host([darkmode]) .d-acts { background-color: #3a3a3a; border-top-color: #555; }
      .d-acts button {
          padding: 6px 12px; cursor: pointer; border: 1px solid #ccc;
          border-radius: 4px; font-size: 0.9em; transition: all 0.2s;
          background-color: #fff;
      }
      .d-acts button:hover { filter: brightness(0.95); }
      :host([darkmode]) .d-acts button { background-color: #555; border-color: #777; color: #eee; }
      .ed-btn { background-color: #CCE5FF; border-color: #b8daff; color: #004085; }
      .del-btn { background-color: #F8D7DA; color: #721c24; border-color: #f5c6cb; }
      :host([darkmode]) .ed-btn { background-color: #0056b3; border-color: #0056b3; color: white; }
      :host([darkmode]) .del-btn { background-color: #b81c2c; border-color: #b81c2c; color: white; }
    `}addAct(t,e,o=""){if(!t||!e)return;const r=this.cActs.filter(d=>d.nm!==t);this.cActs=[...r,{nm:t,lbl:e,cls:o}]}hideAct(t){t&&(this.cActs=this.cActs.filter(e=>e.nm!==t))}_formatDisplayValue(t,e){const o=e.type||"text";if(o==="boolean"||o==="switch"||o==="checkbox")return t?e.trueLabel||"Sí":e.falseLabel||"No";if(o==="select"&&Array.isArray(e.options)){const r=e.options.find(d=>String(d.value)===String(t));return r?r.label:String(t??"")}return String(t??"")}_handleDisplayAction(t){const e=t.target.closest("button[data-act]");if(!e)return;const o=e.dataset.act,r=c(this.itm);switch(o){case"edit":this.mode="edit";break;case"delete":this.dispatchEvent(new CustomEvent("del-item",{detail:r,bubbles:!0,composed:!0}));break;default:o&&this.dispatchEvent(new CustomEvent(o,{detail:r,bubbles:!0,composed:!0}));break}}_handleSave(t){this.itm=c(t.detail),this.dispatchEvent(new CustomEvent("item-upd",{detail:c(this.itm),bubbles:!0,composed:!0})),this.mode="display"}_handleCancel(){this.mode="display"}_renderDisplay(){const t=this.hdrKey&&this.itm[this.hdrKey]?this.itm[this.hdrKey]:null;return n`
            <div class="d-card">
                ${t?n`<div class="d-hdr">${t}</div>`:""}
                <div class="d-cont">
                    ${u(Object.entries(this.fCfg),([e,o])=>{const r=x(o,this.itm);return o.hidden||e===this.hdrKey||!r?null:n`
                            <div class="d-prop">
                                <div class="d-prop-lbl">${o.label||e}</div>
                                <div class="d-prop-val" data-type=${o.type||"text"}>
                                    ${this._formatDisplayValue(this.itm[e],o)}
                                </div>
                            </div>
                        `})}
                </div>
                <div class="d-acts" @click=${this._handleDisplayAction}>
                    <button type="button" class="ed-btn" data-act="edit">Edit</button>
                    ${u(this.cActs,e=>n`
                        <button type="button" data-act=${e.nm} class=${l(e.cls)}>${e.lbl}</button>
                    `)}
                </div>
            </div>
        `}_renderEdit(){return n`
            <obj-edit-frm
                .fCfg=${this.fCfg}
                .itm=${this.itm}
                ?darkmode=${this.darkmode}
                @save-item=${this._handleSave}
                @cancel-edit=${this._handleCancel}
            ></obj-edit-frm>
        `}render(){return!this.itm||Object.keys(this.fCfg).length===0?n`<p>No hay item o configuración para mostrar.</p>`:n`
            <div class="dyn-cont">
                ${this.mode==="display"?this._renderDisplay():this._renderEdit()}
            </div>
        `}}i([p({type:String})],b.prototype,"mode");i([p({type:Object})],b.prototype,"itm");i([p({type:Object})],b.prototype,"fCfg");i([p({type:String,attribute:"hdr-key"})],b.prototype,"hdrKey");i([p({type:Array})],b.prototype,"cActs");i([p({type:Boolean,reflect:!0})],b.prototype,"darkmode");const $=s=>{Object.entries(s).forEach(([t,e])=>{customElements.get(t)||customElements.define(t,e)})};$({"dyn-obj-disp":b,"obj-edit-frm":h});

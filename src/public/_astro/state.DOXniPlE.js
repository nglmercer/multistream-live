import{e as d,i as h,E as l,t as p,T as f}from"./directive.D03qP3rJ.js";import{f as m,u as y}from"./lit-element.CyV8MMp1.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class u extends h{constructor(t){if(super(t),this.it=l,t.type!==p.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===l||t==null)return this._t=void 0,this.it=t;if(t===f)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}u.directiveName="unsafeHTML",u.resultType=1;const E=d(u);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const P=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const v={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:m},g=(r=v,t,e)=>{const{kind:n,metadata:o}=e;let i=globalThis.litPropertyMetadata.get(o);if(i===void 0&&globalThis.litPropertyMetadata.set(o,i=new Map),i.set(e.name,r),n==="accessor"){const{name:s}=e;return{set(a){const c=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,c,r)},init(a){return a!==void 0&&this.P(s,void 0,r),a}}}if(n==="setter"){const{name:s}=e;return function(a){const c=this[s];t.call(this,a),this.requestUpdate(s,c,r)}}throw Error("Unsupported decorator location: "+n)};function w(r){return(t,e)=>typeof e=="object"?g(r,t,e):((n,o,i)=>{const s=o.hasOwnProperty(i);return o.constructor.createProperty(i,s?{...n,wrapped:!0}:n),s?Object.getOwnPropertyDescriptor(o,i):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $(r){return w({...r,state:!0,attribute:!1})}export{w as n,E as o,$ as r,P as t};

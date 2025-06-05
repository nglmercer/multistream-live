import{E as r,T as n}from"./lit-html.Cs9YtZST.js";import{e as o,i as c,t as u}from"./directive.CGE4aKEl.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class s extends c{constructor(t){if(super(t),this.it=r,t.type!==u.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===r||t==null)return this._t=void 0,this.it=t;if(t===n)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}s.directiveName="unsafeHTML",s.resultType=1;const l=o(s);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const h=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};export{l as o,h as t};

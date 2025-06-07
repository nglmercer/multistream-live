import{i as f,r as u}from"./lit-element.CdPzzhzS.js";import{x as l}from"./lit-html.Cs9YtZST.js";import{t as m}from"./custom-element.BhZVzxrc.js";import{n as d,r as h}from"./state.k4TxN2nw.js";var b=Object.defineProperty,v=Object.getOwnPropertyDescriptor,o=(e,r,t,s)=>{for(var a=s>1?void 0:s?v(r,t):r,c=e.length-1,n;c>=0;c--)(n=e[c])&&(a=(s?n(r,t,a):n(a))||a);return s&&a&&b(r,t,a),a};let i=class extends u{constructor(){super(...arguments),this.searchTerm="",this.readonly=!1,this.items=[],this.newItemValue=""}connectedCallback(){super.connectedCallback(),this.loadFromStorage()}loadFromStorage(){try{const e=localStorage.getItem(this.config.storageKey);if(e){const r=JSON.parse(e);this.items=r.map(t=>({...t,createdAt:new Date(t.createdAt)}))}}catch(e){console.error("Error loading from localStorage:",e),this.items=[]}}saveToStorage(){try{localStorage.setItem(this.config.storageKey,JSON.stringify(this.items)),this.dispatchEvent(new CustomEvent("filter-updated",{detail:{config:this.config,items:this.items.map(e=>e.value),count:this.items.length},bubbles:!0}))}catch(e){console.error("Error saving to localStorage:",e)}}get filteredItems(){return this.searchTerm?this.items.filter(e=>e.value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())):this.items}addItem(){if(!this.newItemValue.trim()||this.readonly)return;let e=this.newItemValue.trim();if(this.config.type==="number"){const t=Number(e);if(isNaN(t)){alert("Please enter a valid number");return}e=t}if(!this.config.allowDuplicates&&this.items.some(t=>t.value===e)){alert("This value already exists");return}if(this.config.maxItems&&this.items.length>=this.config.maxItems){alert(`Maximum ${this.config.maxItems} items allowed`);return}const r={id:crypto.randomUUID(),value:e,createdAt:new Date,type:this.config.type};this.items=[...this.items,r],this.saveToStorage(),this.newItemValue=""}removeItem(e){this.readonly||(this.items=this.items.filter(r=>r.id!==e.id),this.saveToStorage())}clearAll(){this.readonly||confirm("Are you sure you want to clear all items?")&&(this.items=[],this.saveToStorage())}exportData(){const e=this.items.map(a=>a.value),r=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),t=URL.createObjectURL(r),s=document.createElement("a");s.href=t,s.download=`${this.config.id}-export.json`,s.click(),URL.revokeObjectURL(t)}async importData(e){const r=e.target,t=r.files?.[0];if(t){try{const s=await t.text(),a=JSON.parse(s);if(Array.isArray(a)){const c=a.map(n=>({id:crypto.randomUUID(),value:this.config.type==="number"?Number(n):String(n),createdAt:new Date,type:this.config.type}));this.items=[...this.items,...c],this.saveToStorage()}}catch{alert("Error importing data. Please check the file format.")}r.value=""}}render(){const e=this.filteredItems,r=this.config.type==="number"?"number":"text";return l`
        <div class="filter-container">
          <div class="filter-header">
            <h3 class="filter-title">${this.config.title}</h3>
            <span class="filter-badge">${this.config.type}</span>
          </div>
  
          <div class="filter-stats">
            <div class="stat">
              <span>📊</span>
              <span>${this.items.length} items</span>
            </div>
            <div class="stat">
              <span>🔍</span>
              <span>${e.length} shown</span>
            </div>
            ${this.config.maxItems?l`
              <div class="stat">
                <span>📏</span>
                <span>${this.items.length}/${this.config.maxItems} limit</span>
              </div>
            `:""}
          </div>
  
          ${this.readonly?"":l`
            <div class="add-item-form">
              <input
                class="form-input"
                type="${r}"
                placeholder="${this.config.placeholder||`Add new ${this.config.type}...`}"
                .value=${this.newItemValue}
                @input=${t=>this.newItemValue=t.target.value}
                @keydown=${t=>t.key==="Enter"&&this.addItem()}
              />
              <button class="btn btn-primary" @click=${this.addItem}>
                ➕ Add
              </button>
            </div>
  
            <div class="actions-bar">
              <button class="btn btn-danger btn-sm" @click=${this.clearAll} ?disabled=${this.items.length===0}>
                🗑️ Clear All
              </button>
              <button class="btn btn-sm" @click=${this.exportData} ?disabled=${this.items.length===0}>
                📤 Export
              </button>
              <label class="btn btn-sm" style="cursor: pointer;">
                📥 Import
                <input type="file" accept=".json" @change=${this.importData} style="display: none;">
              </label>
            </div>
          `}
  
          <div class="items-list">
            ${e.length===0?l`
              <div class="empty-state">
                <div class="empty-icon">📝</div>
                <p>${this.searchTerm?"No items match your search":"No items yet"}</p>
              </div>
            `:e.map(t=>l`
              <div class="filter-item">
                <span class="item-value">${t.value}</span>
                <span class="item-type">${t.createdAt.toDateString()}</span>
                ${this.readonly?"":l`
                  <div class="item-actions">
                    <button class="btn btn-danger btn-sm" @click=${()=>this.removeItem(t)}>
                      ❌
                    </button>
                  </div>
                `}
              </div>
            `)}
          </div>
        </div>
      `}getItems(){return this.items.map(e=>e.value)}getItemsAsStrings(){return this.items.map(e=>e.value.toString())}getItemsAsNumbers(){return this.items.map(e=>Number(e.value)).filter(e=>!isNaN(e))}hasItem(e){return this.items.some(r=>r.value===e)}addItemProgrammatically(e){const r=this.config.type==="number"?Number(e):String(e);if(this.config.type==="number"&&isNaN(r)||!this.config.allowDuplicates&&this.hasItem(r)||this.config.maxItems&&this.items.length>=this.config.maxItems)return!1;const t={id:crypto.randomUUID(),value:r,createdAt:new Date,type:this.config.type};return this.items=[...this.items,t],this.saveToStorage(),!0}removeItemProgrammatically(e){const r=this.items.length;return this.items=this.items.filter(t=>t.value!==e),this.items.length!==r?(this.saveToStorage(),!0):!1}clearAllItems(){this.items=[],this.saveToStorage()}};i.styles=f`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
      
      /* Light theme variables (default) */
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-tertiary: #f1f5f9;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --border-color: #e2e8f0;
      --accent-color: #3b82f6;
      --accent-hover: #2563eb;
      --error-color: #ef4444;
      --error-hover: #dc2626;
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      --radius: 0.5rem;
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
    }
  
    /* Dark theme variables */
    @media (prefers-color-scheme: dark) {
      :host {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --text-muted: #64748b;
        --border-color: #334155;
        --accent-color: #60a5fa;
        --accent-hover: #3b82f6;
        --error-color: #f87171;
        --error-hover: #ef4444;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3);
      }
    }
  
    .filter-container {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow);
      transition: all 0.2s ease;
      min-height: 150px;
    }
  
    .filter-container:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-1px);
    }
  
    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-sm);
      border-bottom: 2px solid var(--accent-color);
    }
  
    .filter-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
  
    .filter-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--accent-color);
      color: var(--bg-primary);
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }
  
    .filter-stats {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  
    .stat {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }
  
    .add-item-form {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }
  
    .form-input {
      flex: 1;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }
  
    .form-input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-color) 10%, transparent);
    }
  
    .form-input::placeholder {
      color: var(--text-muted);
    }
  
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
  
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  
    .btn-primary {
      background: var(--accent-color);
      color: var(--bg-primary);
    }
  
    .btn-primary:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }
  
    .btn-danger {
      background: var(--error-color);
      color: var(--bg-primary);
    }
  
    .btn-danger:hover:not(:disabled) {
      background: var(--error-hover);
    }
  
    .btn-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.75rem;
    }
  
    .items-list {
      min-height: 50px;
      max-height: 300px;
      overflow-y: auto;
    }
  
    /* Custom scrollbar for dark theme */
    @media (prefers-color-scheme: dark) {
      .items-list::-webkit-scrollbar {
        width: 8px;
      }
      
      .items-list::-webkit-scrollbar-track {
        background: var(--bg-secondary);
      }
      
      .items-list::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 4px;
      }
      
      .items-list::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
      }
    }
  
    .filter-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      margin-bottom: var(--spacing-xs);
      background: var(--bg-primary);
      transition: all 0.2s ease;
    }
  
    .filter-item:hover {
      border-color: var(--accent-color);
      box-shadow: var(--shadow);
    }
  
    .item-value {
      flex: 1;
      font-size: 0.875rem;
      color: var(--text-primary);
    }
  
    .item-type {
      padding: 2px 8px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 500;
    }
  
    .item-actions {
      display: flex;
      gap: var(--spacing-xs);
    }
  
    .empty-state {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--text-muted);
    }
  
    .empty-icon {
      font-size: 2rem;
      margin-bottom: var(--spacing-md);
    }
  
    .actions-bar {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }
  
    /* Smooth transitions for theme changes */
    * {
      transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    }
  `;o([d({type:Object})],i.prototype,"config",2);o([d({type:String})],i.prototype,"searchTerm",2);o([d({type:Boolean})],i.prototype,"readonly",2);o([h()],i.prototype,"items",2);o([h()],i.prototype,"newItemValue",2);i=o([m("base-filter")],i);let p=class extends i{constructor(){super(),this.config={id:"user-filter",title:"User Filter",storageKey:"blockedUsersKeywords",type:"string",placeholder:"Add username or user ID...",allowDuplicates:!1}}};p=o([m("user-filter")],p);let g=class extends i{constructor(){super(),this.config={id:"word-filter",title:"Word Filter",storageKey:"blockedChatKeywords",type:"string",placeholder:"Add word to filter...",allowDuplicates:!1}}};g=o([m("word-filter")],g);const y=document.getElementById("userFilter"),x=document.getElementById("wordFilter");console.log("userFilter wordFilter",{userFilter:y,wordFilter:x});

import{i as d,n as h,r as f}from"./property.DTDKM9eR.js";import{x as c}from"./lit-html.Cs9YtZST.js";import{t as u}from"./custom-element.BhZVzxrc.js";import{r as m}from"./state.5GRZVynF.js";import{n as v}from"./fetchapi.C-M2EFJR.js";var g=Object.defineProperty,y=Object.getOwnPropertyDescriptor,o=(t,e,n,s)=>{for(var a=s>1?void 0:s?y(e,n):e,i=t.length-1,l;i>=0;i--)(l=t[i])&&(a=(s?l(e,n,a):l(a))||a);return s&&a&&g(e,n,a),a};let r=class extends f{constructor(){super(...arguments),this.healthItems=[],this.title="System Health",this._systemStatus="healthy"}updated(t){super.updated(t),t.has("healthItems")&&this._updateSystemStatus()}_updateSystemStatus(){if(!this.healthItems.length){this._systemStatus="unknown";return}const t=this.healthItems.map(e=>e.status||"operational");t.some(e=>e==="error"||e==="offline")?this._systemStatus="critical":t.some(e=>e==="warning"||e==="restarting")?this._systemStatus="warning":t.every(e=>e==="operational")?this._systemStatus="healthy":this._systemStatus="unknown"}_getStatusIcon(t="operational"){return{operational:"check_circle",warning:"warning",error:"error",restarting:"refresh",offline:"cancel"}[t]||"help"}_getStatusText(t="operational"){return{operational:"Operational",warning:"Warning",error:"Error",restarting:"Restarting",offline:"Offline"}[t]||"Unknown"}render(){return c`
      <div class="health-card">
        <div class="card-header">
          <h2>${this.title}</h2>
          <span class="health-status ${this._systemStatus}">
            ${this._systemStatus}
          </span>
        </div>

        <div class="health-items">
          ${this.healthItems.length===0?c`
                <div class="empty-state">
                  <span class="material-symbols-rounded">monitor_heart</span>
                  <p>No services configured</p>
                </div>
              `:this.healthItems.map(t=>c`
                <div class="health-item">
                  <div class="health-info">
                    <span class="material-symbols-rounded status-icon ${t.status||"operational"}">
                      ${this._getStatusIcon(t.status)}
                    </span>
                    <div class="service-details">
                      <span class="service-name">${t.name}</span>
                      <span class="service-meta">
                      ${t.referer?`${t.referer.address}:${t.referer.port}`:`${t.host}:${t.port}`}
                      </span>
                    </div>
                  </div>
                  <span class="status-text">
                    ${this._getStatusText(t.status)}
                  </span>
                </div>
              `)}
        </div>
      </div>
    `}};r.styles=d`
    :host {
      display: block;
    }

    .health-card {
      background-color: var(--color-dark-900, #1a1a1a);
      border: 1px solid var(--color-gray-800, #374151);
      border-radius: var(--border-radius-xl, 12px);
      padding: var(--space-6, 24px);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6, 24px);
    }

    h2 {
      font-size: var(--font-size-xl, 20px);
      font-weight: 600;
      margin: 0;
      color: var(--color-text-primary, #ffffff);
    }

    .health-status {
      padding: var(--space-1, 4px) var(--space-3, 12px);
      border-radius: var(--border-radius-full, 50px);
      font-size: var(--font-size-sm, 14px);
      font-weight: 500;
      text-transform: capitalize;
    }

    .health-status.healthy {
      background-color: rgba(34, 197, 94, 0.1);
      color: var(--color-green-500, #22c55e);
    }

    .health-status.warning {
      background-color: rgba(251, 191, 36, 0.1);
      color: var(--color-yellow-500, #eab308);
    }

    .health-status.critical {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--color-red-500, #ef4444);
    }

    .health-status.unknown {
      background-color: rgba(156, 163, 175, 0.1);
      color: var(--color-gray-400, #9ca3af);
    }

    .health-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 16px);
    }

    .health-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3, 12px);
      background-color: var(--color-dark-800, #2d2d2d);
      border-radius: var(--border-radius-lg, 8px);
      transition: background-color 0.2s ease;
    }

    .health-item:hover {
      background-color: var(--color-dark-700, #404040);
    }

    .health-info {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
    }

    .service-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-1, 4px);
    }

    .service-name {
      color: var(--color-text-primary, #ffffff);
      font-weight: 500;
    }

    .service-meta {
      font-size: var(--font-size-xs, 12px);
      color: var(--color-gray-100,rgb(206, 206, 206));
    }

    .status-icon {
      font-size: 20px;
      font-variation-settings: 'FILL' 1;
    }

    .status-icon.operational {
      color: var(--color-green-500, #22c55e);
    }

    .status-icon.warning {
      color: var(--color-yellow-500, #eab308);
    }

    .status-icon.error {
      color: var(--color-red-500, #ef4444);
    }

    .status-icon.restarting {
      color: var(--color-blue-500, #3b82f6);
      animation: spin 1s linear infinite;
    }

    .status-icon.offline {
      color: var(--color-gray-400, #9ca3af);
    }

    .status-text {
      font-size: var(--font-size-sm, 14px);
      color: var(--color-gray-400, #9ca3af);
      text-transform: capitalize;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .empty-state {
      text-align: center;
      padding: var(--space-8, 32px);
      color: var(--color-gray-500, #6b7280);
    }

    .material-symbols-rounded {
      font-size: 48px;
      font-family: 'Material Symbols Outlined';
      opacity: 0.5;
    }
    
  `;o([h({type:Array})],r.prototype,"healthItems",2);o([h({type:String})],r.prototype,"title",2);o([m()],r.prototype,"_systemStatus",2);r=o([u("system-health")],r);const p=document.querySelector(".mainsystem"),x=[{name:"servidor_local",host:"localhost",port:0,fqdn:"servidor_local",status:"offline"}];async function b(){if(!p)return;const t=await _();console.log(t,typeof t),p.healthItems=Array.isArray(t.peers)?t.peers:x}async function _(){const t=await v.getPeers();if(t)return console.log(t),t}document.addEventListener("DOMContentLoaded",b);

class s extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0}),this._options=[],this.container=document.createElement("div"),this.lastFocusedElement=null;const t=' <link rel="stylesheet" href="/materialSymbols.css" />';this.shadowRoot.innerHTML=t,this.container.style.cssText=`
            position: fixed;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            background-color: inherit;
            display: none;
            z-index: 1000;
            color-scheme: light dark;
            font-family: inherit;
            justify-content: center;
            align-items: stretch;
            flex-direction: column;
            min-width: inherit;
            width: 100%;
            max-width: 200px;
            border-radius: 4px;
            overflow: hidden;
        `;const e=document.createElement("style");e.textContent=`
            .material-symbols-rounded {
                font-family: inherit;
                font-size: 24px;
                margin-right: 10px;
            }
            .popup-option {
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                user-select: none;
            }
            .popup-option:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
            .default-font {
                font-family: Arial, sans-serif;
            }
            @media (prefers-color-scheme: dark) {
                .popup-option:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }
                /* fallback */
@font-face {
    font-family: 'Material Symbols Outlined';
    font-style: normal;
    font-weight: 400;
    src: url(/material_icon_font.woff2) format('woff2');
  }
  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -moz-font-feature-settings: 'liga';
    -moz-osx-font-smoothing: grayscale;
  }
  .material-symbols-rounded {
    font-family: 'Material Symbols Outlined';
    font-size: 1.5rem;
  }
  
        `,this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.container),this.handleClickOutside=this.handleClickOutside.bind(this)}get options(){return this._options}set options(t){this._options=t,this.render()}addOption(t,e){return this._options.push({html:t,callback:i=>{e(i),this.hide()}}),this.render(),this._options.length-1}setOptions(t){this._options=t.map(e=>({html:e.html,callback:i=>{e.callback(i),this.hide()}})),this.render()}clearOptions(){this._options=[],this.render()}removeOption(t){return t>=0&&t<this._options.length?(this._options.splice(t,1),this.render(),!0):!1}render(){this.container.innerHTML="",this._options.forEach((t,e)=>{const i=document.createElement("div");i.className="popup-option",i.innerHTML=t.html,i.addEventListener("click",t.callback),this.container.appendChild(i)})}connectedCallback(){this.render()}handleClickOutside(t){const e=t.composedPath();!e.includes(this.container)&&!e.includes(this.lastFocusedElement)&&this.hide()}show(t,e){this.container.style.display="flex",t!==void 0&&e!==void 0&&this.moveTo(t,e),document.addEventListener("click",this.handleClickOutside)}hide(){this.container.style.display="none",document.removeEventListener("click",this.handleClickOutside)}moveTo(t,e){const i=this.container.getBoundingClientRect(),n=window.innerWidth,o=window.innerHeight;t+i.width>n&&(t=n-i.width-10),e+i.height>o&&(e=o-i.height-10),this.container.style.left=`${Math.max(0,t)}px`,this.container.style.top=`${Math.max(0,e)}px`}showAtElement(t){const e=t.getBoundingClientRect();this.show(e.left,e.bottom),this.lastFocusedElement=t}disconnectedCallback(){document.removeEventListener("click",this.handleClickOutside)}}customElements.get("custom-popup")||customElements.define("custom-popup",s);

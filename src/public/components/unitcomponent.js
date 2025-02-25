function parsePattern(pattern) {
  // Si pattern es null o undefined, retornamos una expresión regular que coincide con cualquier cadena vacía.
  if (pattern == null) return new RegExp('');

  let parsedPattern = '';

  try {
    if (pattern instanceof RegExp) {
      // Si es un objeto RegExp, lo retornamos directamente.
      return pattern;
    } else if (typeof pattern === 'string') {
      // Si la cadena tiene delimitadores tipo "/…/flags", extraemos la parte interna y los flags.
      const literalRegex = /^\/(.*)\/([a-z]*)$/i;
      const match = pattern.match(literalRegex);
      if (match) {
        parsedPattern = match[1];
        const flags = match[2];
        return new RegExp(parsedPattern, flags);
      } else {
        parsedPattern = pattern;
        // Validamos que el patrón sea una expresión regular válida.
        return new RegExp(parsedPattern);
      }
    } else {
      throw new Error('El patrón debe ser una cadena o un objeto RegExp.');
    }
  } catch (error) {
    console.error('Error al parsear el patrón:', error);
    // Si hay un error, devolvemos una expresión regular que coincide con cualquier cadena vacía.
    return new RegExp('');
  }
}
class GameConsole extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.obfuscators = {};
        this.alreadyParsed = [];
        this.currId = 0;
        this.isItFirstLogRefresh = false;
        this.previousConsoleUpdateLength = 0;
        
        // Estilos para códigos Minecraft
        this.styleMap = {
            '§0': 'color:#000000',
            '§1': 'color:#0000AA',
            '§2': 'color:#00AA00',
            '§3': 'color:#00AAAA',
            '§4': 'color:#AA0000',
            '§5': 'color:#AA00AA',
            '§6': 'color:#FFAA00',
            '§7': 'color:#AAAAAA',
            '§8': 'color:#555555',
            '§9': 'color:#5555FF',
            '§a': 'color:#55FF55',
            '§b': 'color:#55FFFF',
            '§c': 'color:#FF5555',
            '§d': 'color:#FF55FF',
            '§e': 'color:#FFFF55',
            '§f': 'color:#FFFFFF',
            '§l': 'font-weight:bold',
            '§m': 'text-decoration:line-through',
            '§n': 'text-decoration:underline',
            '§o': 'font-style:italic'
        };
    }
  
    connectedCallback() {
        this.render();
    }
  
    getStyles() {
        return `
            .console-layout {
                width: 100%;
                height: 100%;
                min-height: 300px;
                background: var(--bg-darker);
                border-radius: 8px;
                box-sizing: border-box;
            }
  
            .console {
                width: 100%;
                height: 100%;
                max-height: 500px;
                overflow-y: auto;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 14px;
                line-height: 1.5;
                color: var(--text-primary);
                padding-right: 8px;
                scroll-behavior: smooth;
            }
  
            .console::-webkit-scrollbar {
                width: 8px;
            }
  
            .console::-webkit-scrollbar-track {
                background: var(--bg-darker);
                border-radius: 4px;
            }
  
            .console::-webkit-scrollbar-thumb {
                background: var(--bg-dark-accent);
                border-radius: 4px;
            }
  
            .console::-webkit-scrollbar-thumb:hover {
                background: var(--bg-dark-accent-lighter);
            }`;
    }
  
    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
            <div class="console-layout">
                <div class="console" id="console-text"></div>
            </div>
        `;
    }
  
    // Minecraft Parser Implementation
    obfuscate(elem, string) {
        const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        const replaceRand = (str, i) => {
            const randChar = String.fromCharCode(randInt(64, 95));
            return str.substr(0, i) + randChar + str.substr(i + 1, str.length);
        };
  
        const initMagic = (el, str) => {
            let i = 0;
            const obsStr = str || el.innerHTML;
            const strLen = obsStr.length;
            
            if (!strLen) return;
            
            if (!this.obfuscators[this.currId]) {
                this.obfuscators[this.currId] = [];
            }
  
            this.obfuscators[this.currId].push(
                window.setInterval(() => {
                    if (i >= strLen) i = 0;
                    let newStr = replaceRand(obsStr, i);
                    el.innerHTML = newStr;
                    i++;
                }, 0)
            );
        };
  
        if (string.indexOf('<br>') > -1) {
            elem.innerHTML = string;
            const listLen = elem.childNodes.length;
            
            for (let nodeI = 0; nodeI < listLen; nodeI++) {
                const currNode = elem.childNodes[nodeI];
                if (currNode.nodeType === 3) {
                    const multiMagic = document.createElement('span');
                    multiMagic.innerHTML = currNode.nodeValue;
                    elem.replaceChild(multiMagic, currNode);
                    initMagic(multiMagic);
                }
            }
        } else {
            initMagic(elem, string);
        }
    }
  
    applyCode(string, codes) {
        const elem = document.createElement('span');
        let obfuscated = false;
  
        string = string.replace(/\x00/g, '');
  
        codes.forEach(code => {
            if (this.styleMap[code]) {
                elem.style.cssText += this.styleMap[code] + ';';
            }
            if (code === '§k') {
                this.obfuscate(elem, string);
                obfuscated = true;
            }
        });
  
        if (!obfuscated) {
            elem.innerHTML = string;
        }
  
        return elem;
    }
  
    mineParse(string) {
        const finalPre = document.createElement('pre');
        const codes = string.match(/§.{1}/g) || [];
        const indexes = [];
        let apply = [];
  
        if (!this.obfuscators[this.currId]) {
            this.obfuscators[this.currId] = [];
        }
  
        string = string.replace(/\n|\\n/g, '<br>');
  
        // Get indexes of all codes
        codes.forEach((code, i) => {
            indexes.push(string.indexOf(code));
            string = string.replace(code, '\x00\x00');
        });
  
        // Handle text before first code
        if (indexes[0] !== 0) {
            finalPre.appendChild(this.applyCode(string.substring(0, indexes[0]), []));
        }
  
        // Process codes and text
        for (let i = 0; i < codes.length; i++) {
            let indexDelta = indexes[i + 1] - indexes[i];
            
            if (indexDelta === 2) {
                while (indexDelta === 2) {
                    apply.push(codes[i]);
                    i++;
                    indexDelta = indexes[i + 1] - indexes[i];
                }
                apply.push(codes[i]);
            } else {
                apply.push(codes[i]);
            }
  
            if (apply.lastIndexOf('§r') > -1) {
                apply = apply.slice(apply.lastIndexOf('§r') + 1);
            }
  
            const strSlice = string.substring(indexes[i], indexes[i + 1]);
            finalPre.appendChild(this.applyCode(strSlice, apply));
        }
  
        this.alreadyParsed.push(finalPre);
        this.currId++;
  
        return {
            parsed: finalPre,
            raw: finalPre.innerHTML
        };
    }
  
    clearObfuscators(id) {
        if (this.obfuscators[id]) {
            this.obfuscators[id].forEach(interval => {
                clearInterval(interval);
            });
            this.alreadyParsed[id] = [];
            this.obfuscators[id] = [];
        }
    }
  
    refreshConsoleLog(serverLog) {
        const consoleTextElem = this.shadowRoot.querySelector('#console-text');
        if (!consoleTextElem) return;
  
        if (serverLog.length === this.previousConsoleUpdateLength) {
            return;
        }
  
        this.previousConsoleUpdateLength = serverLog.length;
        const parsedServerLog = serverLog.split(/\r?\n/);
        consoleTextElem.innerHTML = '';
  
        parsedServerLog.forEach(line => {
            let html_text = '';
            const parsedText = this.parseANSI(this.linkify(this.mineParse(line).raw));
  
            if (parsedText.length > 1) {
                let joinedLine = '';
                parsedText.forEach(item => {
                    let resultText = "<span style='";
                    if (item.bold) {
                        resultText += "font-weight:bold;";
                    }
                    if (item.foreground && item.bold) {
                        resultText += `color:${item.foreground};`;
                    }
                    resultText += `'>${item.text}</span>`;
                    joinedLine += resultText;
                });
                html_text += joinedLine + '<br>';
            } else {
                html_text += parsedText[0].text + '<br>';
            }
  
            consoleTextElem.innerHTML += html_text;
        });
  
        // Handle scrolling
        const scrollHeight = consoleTextElem.scrollHeight - Math.round(consoleTextElem.clientHeight) - 24;
        if (!this.isItFirstLogRefresh) {
            this.isItFirstLogRefresh = true;
            consoleTextElem.scrollTop = scrollHeight;
        } else if ((scrollHeight - consoleTextElem.scrollTop) < 200) {
            consoleTextElem.scrollTop = scrollHeight;
        }
    }
  
    parseANSI(text) {
        // Implementación básica - puedes expandirla según tus necesidades
        return [{ text, bold: false }];
    }
  
    linkify(text) {
        // Implementación básica - puedes expandirla según tus necesidades
        return text;
    }
  }
  
  // Registrar el componente
  customElements.define('game-console', GameConsole);
  class InputCommand extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.commandHistory = []; // Array to store command history
      this.historyIndex = -1; // Index to track position in history
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    getstyles() {
      return `
        :host {
          width: 100%;
          border-radius: 8px;
          box-sizing: border-box;
          border: 1px solid #333;
          font-family: 'Material Symbols Outlined';
        }
        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24
        }
        .input {
          display: flex;
          gap: 8px;
          width: 100%;
          padding: 8px;
          background: var(--bg-darker);
          border-radius: 8px;
          box-sizing: border-box;
        }
  
        #cmd-input {
          flex: 1;
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 8px 12px;
          color: var(--text-primary);
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }
  
        #cmd-input:focus {
          border-color: var(--primary-color);
        }
  
        #cmd-input::placeholder {
          color: var(--text-secondary);
        }
  
        .dark-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 8px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
  
        .dark-btn:hover {
          background: var(--bg-dark-accent);
          border-color: var(--primary-color);
        }
  
        .dark-btn .material-symbols-rounded {
          font-size: 20px;
        }
  
        .icon-only {
          width: 36px;
          height: 36px;
          padding: 0;
        }`;
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <style>${this.getstyles()}</style>
        <div class="input">
          <input type="text" id="cmd-input" placeholder="Enter command"/>
          <button class="dark-btn icon-only">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      `;
    }
  
    setupEventListeners() {
      const button = this.shadowRoot.querySelector('button');
      const input = this.shadowRoot.querySelector('#cmd-input');
  
      button.addEventListener('click', () => {
        this.sendCommand();
      });
  
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.sendCommand();
        } else if (e.key === 'ArrowUp') {
          this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
          this.navigateHistory(1);
        }
      });
    }
  
    sendCommand() {
      const input = this.shadowRoot.querySelector('#cmd-input');
      const command = input.value.trim();
      if (command) {
        // Add command to history
        if (this.historyIndex !== -1 && this.historyIndex < this.commandHistory.length - 1) {
          // Remove all commands ahead of the current index
          this.commandHistory = this.commandHistory.slice(0, this.historyIndex + 1);
        }
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length - 1;
  
        // Dispatch custom event for command sending
        this.dispatchEvent(new CustomEvent('command', {
          detail: { command },
          bubbles: true,
          composed: true
        }));
        input.value = '';
      }
    }
  
    navigateHistory(direction) {
      const input = this.shadowRoot.querySelector('#cmd-input');
      if (this.commandHistory.length === 0) return;
  
      this.historyIndex += direction;
      this.historyIndex = Math.max(0, Math.min(this.historyIndex, this.commandHistory.length - 1));
  
      input.value = this.commandHistory[this.historyIndex];
    }
  }
  
  customElements.define('input-command', InputCommand);
  
  
  class CustomDialog extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
  
      this._title = '';
      this._description = '';
      this._options = [];
      this._theme = 'light';
  
      this.initTemplate();
    }
  
    static get observedAttributes() {
      return ['title', 'description', 'theme'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        switch (name) {
          case 'tittle':
          case 'title':
            this._title = newValue;
            this.shadowRoot.querySelector('.title').textContent = this._title;
            break;
          case 'description':
            this._description = newValue;
            this.shadowRoot.querySelector('.description').textContent = this._description;
            break;
          case 'theme':
            this._theme = newValue;
            this.shadowRoot.querySelector('.container').className = `container ${this._theme}`;
            break;
        }
      }
    }
  
    get options() {
      return this._options;
    }
  
    set options(value) {
      this._options = value;
      this.updateOptions();
    }
  
    createStyles() {
      return `
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
          color: inherit;
        }
  
        .container {
          padding: 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
  
        .container.light {
          border: 1px solid #e5e5e5;
        }
  
        .container.dark {
          border: 1px solid #333333;
        }
  
        .title {
          font-size: 1.5rem;
          font-weight: 600;
        }
  
        .description {
          font-size: 1rem;
          opacity: 0.8;
          max-height: 500px;
          overflow-y: auto;
        }
  
        .options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
  
        slot {
          display: block;
          margin-top: 1rem;
        }
                  button {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }
          button {
            color: inherit;
            background-color: inherit;
          }
          button:hover {
            background-color: inherit;
          }
    
          .save-btn {
            background-color: #007bff;
            color: white;
          }
          .save-btn:hover {
            background-color: #0056b3;
          }
          .cancel-btn {
            background-color: #e5e5e5;
            color: black;
          }
          .cancel-btn:hover {
            background-color: #0056b3;
          }
          .save-btn:hover {
            background-color: #0056b3;
          }
          .delete-btn {
            background-color: #dc3545;
            color: white;
          }
          .delete-btn:hover { 
            background-color: #bd2130;
          }
      `;
    }
  
    initTemplate() {
      const style = document.createElement('style');
      style.textContent = this.createStyles();
      
      const container = document.createElement('div');
      container.className = `container ${this._theme}`;
  
      const title = document.createElement('h2');
      title.className = 'title';
      title.textContent = this._title;
  
      const description = document.createElement('pre');
      description.className = 'description';
      description.textContent = this._description;
  
      const options = document.createElement('div');
      options.className = 'options';
  
      const slot = document.createElement('slot'); // Slot permanece fijo
      slot.id = 'slot';
  
      container.append(title, description,slot, options );
      this.shadowRoot.append(style, container);
  
      this.updateOptions();
    }
  
    updateOptions() {
      const optionsContainer = this.shadowRoot.querySelector('.options');
      optionsContainer.innerHTML = ''; // Limpiar opciones
  
      this._options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option.label;
        button.style = option.style || '';
        button.className = option.class || '';
        button.dataset.index = index;
  
        button.addEventListener('click', () => {
          if (this._options[index]?.callback) {
            this._options[index].callback();
          }
        });
  
        optionsContainer.appendChild(button);
      });
    }
  }
  
  customElements.define('custom-dialog', CustomDialog);
  
    class DialogContainer extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true });
        
        // Estado inicial
        this._isVisible = false;
        this._content = null;
        
        this.render();
      }
    
      static get observedAttributes() {
        return ['visible','required'];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'visible') {
          this._isVisible = newValue !== null;
          this.updateVisibility();
        }
      }
    
      // Métodos públicos para mostrar/ocultar
      show() {
        this._isVisible = true;
        this.setAttribute('visible', '');
        this.updateVisibility();
      }
    
      hide() {
        this._isVisible = false;
        this.removeAttribute('visible');
        this.updateVisibility();
      }
    
      // Método para insertar contenido
      setContent(element) {
        this._content = element;
        this.render();
      }
    
      createStyles() {
        return `
          :host {
            display: block;
            position: relative;
            background: inherit;
            background-color: inherit;
            color: inherit;
            border-radius: inherit;
          }
          .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            /*blur effect*/
            backdrop-filter: blur(4px);
          }
          .dialog-overlay.visible {
            opacity: 1;
            visibility: visible;
          }
          .dialog-content {
            transform: scale(0.95);
            transition: transform 0.3s ease;
            max-height: 90dvh;
            overflow-y: auto;
            background: inherit;
            background-color: inherit;
            color: inherit;
            border-radius: inherit;
            border-radius: 16px;
            padding: inherit;
            margin: inherit;
            padding: 8px;
          }
          .dialog-overlay.visible .dialog-content {
            transform: scale(1);
          }
          .header .avatar {
              grid-area: avatar;
              width: 64px;
              height: 64px;
              background: var(--bg-dark-accent-light);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
          }
  
          .header .username {
              align-self: center;
              grid-area: username;
              font-size: 16pt;
              font-weight: 600;
          }
  
          .header .email {
              align-self: center;
              grid-area: email;
              font-size: 12pt;
              font-weight: 400;
          }
  
        `;
      }
    
      updateVisibility() {
        const overlay = this.shadowRoot.querySelector('.dialog-overlay');
        if (overlay) {
          if (this._isVisible) {
            overlay.classList.add('visible');
          } else {
            overlay.classList.remove('visible');
          }
        }
      }
    
      render() {
        const content = `
          <style>
            ${this.createStyles()}
          </style>
          <div class="dialog-overlay ${this._isVisible ? 'visible' : ''}">
            <div class="dialog-content">
              <slot></slot>
            </div>
          </div>
        `;
        
        this.shadowRoot.innerHTML = content;
    
        // Agregar evento para cerrar al hacer clic fuera
        const overlay = this.shadowRoot.querySelector('.dialog-overlay');
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay && !this.hasAttribute('required')) {
            this.hide();
          }
        });
      }
    }
    customElements.define('dialog-container', DialogContainer);
  /*   const dialog = document.querySelector('custom-dialog');
    dialog.options = [
      {
        label: 'Aceptar',
        callback: () => {
      togglecontent()
        }
      },
      {
        label: 'Cancelar',
            callback: () => {
      togglecontent()
        }
      }
    ];
    
      const dialogContainer = document.getElementById('myDialog');
    dialogContainer.show()
    function togglecontent() {
        const dialogContainer = document.getElementById('myDialog');
            dialogContainer.hide()
        setTimeout(()=>{
              dialogContainer.show()
        },1000)
    } */
        if (!customElements.get('language-selector')) {
        class LanguageSelector extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._langs = [];
            this._selectedLang = null;
            
            this.shadowRoot.innerHTML = `
              <style>
                :host {
                  display: block;
                  background-color: rgb(34, 44, 58);
                  color: rgb(255, 255, 255);
                  padding: 8px;
                  border-radius: 8px;
                  font-family: Arial, sans-serif;
                }
                .lang-list {
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                }
                .lang-item {
                  padding: 14px;
                  gap: 8px;
                  cursor: pointer;
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  border-radius: 8px;
                  background-color: rgb(46, 62, 83);
                  color: rgb(255, 255, 255);
                }
                .lang-item:hover {
                  background-color: rgba(255, 255, 255, 0.1);
                }
                .lang-item.selected {
                  background-color: rgba(50, 213, 131, 0.1);
                  color: rgb(50, 213, 131);
                }
                .author {
                  font-size: 14px;
                  color: rgb(104, 121, 138);
                  margin-left: auto;
                }
                .display-name-english {
                  color: rgb(104, 121, 138);
                }
              </style>
              <ul class="lang-list"></ul>
            `;
          }
        
          static get observedAttributes() {
            return ['selected'];
          }
        
          get langs() {
            return this._langs;
          }
        
          set langs(value) {
            this._langs = value;
            this.render();
          }
        
          get selected() {
            return this._selectedLang;
          }
        
          set selected(value) {
            if (this._selectedLang !== value) {
              this._selectedLang = value;
              this.dispatchEvent(new CustomEvent('language-change', {
                detail: {
                  langCode: value,
                  language: this._langs.find(lang => lang.code === value)
                },
                bubbles: true,
                composed: true
              }));
              this.render();
            }
          }
        
          attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'selected' && oldValue !== newValue) {
              this.selected = newValue;
            }
          }
        
          render() {
            const list = this.shadowRoot.querySelector('.lang-list');
            list.innerHTML = '';
            console.log('Rendering languages:', this._langs);
            if (!this._langs.length) {
              return;
            }
            this._langs.forEach(lang => {
              const li = document.createElement('li');
              li.className = `lang-item ${lang.code === this._selectedLang ? 'selected' : ''}`;
              li.innerHTML = `
                <span class="display-name">${lang.displayName}</span>
                <span class="display-name-english">${lang.displayNameEnglish}</span>
                <span class="author">by ${lang.author}</span>
              `;
              li.addEventListener('click', () => {
                this.selected = lang.code;
              });
              list.appendChild(li);
            });
          }
        }
        
        customElements.define('language-selector', LanguageSelector);
        }
        if (!customElements.get('custom-input')) {
          class CustomInput extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open', delegatesFocus: true });
              this.handleInputChange = this.handleInputChange.bind(this);
            }
        
            static get observedAttributes() {
              return ['type', 'id', 'name', 'value', 'placeholder', 'disabled', 'readonly', 'darkmode', 'options', 'required', 'title', 'pattern'];
            }
        
            getStyles() {
              const darkMode = this.hasAttribute('darkmode');
        
              return `
                :host {
                  display: block;
                  margin: inherit;
                  color-scheme: light dark;
                  margin: 0.4rem;
                  padding: 0.4rem;
                }
                
                .input-container {
                  display: flex;
                  flex-direction: column;
                  padding: inherit;
                }
                
                input, textarea, select {
                  padding: inherit;
                  padding: 0.4rem;  /* Valor de respaldo si no se hereda */
                  border: inherit;
                  border-color: ${darkMode ? '#555' : '#ccc'};
                  border-radius: 6px;
                  font-size: 14px;
                  background-color: inherit;
                  color: inherit;
                }
                  input[type="color"] {
                    padding: 0;
                  }
                textarea {
                  resize: vertical;
                  min-height: 100px;
                }
                input:disabled, textarea:disabled, select:disabled {
                  background-color: ${darkMode ? '#222' : '#f5f5f5'};
                  cursor: not-allowed;
                  color: ${darkMode ? '#666' : '#888'};
                }
                
                .switch {
                  position: relative;
                  display: inline-block;
                  width: 60px;
                  height: 30px;
                }
                
                .switch input {
                  opacity: 0;
                  width: 0;
                  height: 0;
                }
                
                .slider {
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: ${darkMode ? '#555' : '#ccc'};
                  transition: .4s;
                  border-radius: 34px;
                }
                
                .slider:before {
                  position: absolute;
                  content: "";
                  height: 22px;
                  width: 22px;
                  left: 4px;
                  bottom: 4px;
                  background-color: ${darkMode ? '#888' : 'white'};
                  transition: .4s;
                  border-radius: 50%;
                }
                
                input:checked + .slider {
                  background-color: #2196F3;
                }
                
                input:checked + .slider:before {
                  transform: translateX(28px);
                }
                
                input:focus, textarea:focus, select:focus {
                  background-color: ${this.style.backgroundColor || '#222'};
                  outline: none;
                  border-color: #2196F3;
                  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
                }
              `;
            }
        
            connectedCallback() {
              this.render();
              const input = this.shadowRoot.querySelector('input, textarea, select');
              if (input) {
                input.addEventListener('input', this.handleInputChange);
                input.addEventListener('change', this.handleInputChange);
              }
              // Corregimos el manejo del evento submit
              const form = this.shadowRoot.querySelectorAll('form');
            }
          
            disconnectedCallback() {
              const input = this.shadowRoot.querySelector('input, textarea, select');
              if (input) {
                input.removeEventListener('input', this.handleInputChange);
                input.removeEventListener('change', this.handleInputChange);
              }
              // Limpiamos el evento submit
              const form = this.shadowRoot.querySelector('.validate-form');
            }
        
            handleInputChange(event) {
              const value = this.getInputValues();
              this.dispatchEvent(new CustomEvent('input-change', {
                detail: {
                  id: this.getAttribute('id'),
                  name: this.getAttribute('name'),
                  value: value
                },
                bubbles: true,
                composed: true
              }));
            }
        
            attributeChangedCallback(name, oldValue, newValue) {
              if (oldValue !== newValue) {
                this.render();
              }
            }
            handleSubmit(e) {
              e.preventDefault(); // Prevenimos la recarga de la página
              
              // Validamos el formulario
              const form = e.target;
              const isValid = form.checkValidity();
              
              if (isValid) {
                // Disparamos un evento personalizado con los datos del formulario
                this.dispatchEvent(new CustomEvent('form-submit', {
                  detail: {
                    id: this.getAttribute('id'),
                    name: this.getAttribute('name'),
                    value: this.getInputValues()
                  },
                  bubbles: true,
                  composed: true
                }));
              }
            }
            render() {
              const type = this.getAttribute('type') || 'text';
              const id = this.getAttribute('id');
              const name = this.getAttribute('name');
              const value = this.getAttribute('value') || '';
              const placeholder = this.getAttribute('placeholder') || '';
              const disabled = this.hasAttribute('disabled');
              const readonly = this.hasAttribute('readonly');
              const options = this.getAttribute('options') || '[]';
              const required = this.hasAttribute('required') ? 'required' : '';
              const title = this.getAttribute('title') || '';
              const pattern = this.getAttribute('pattern') || '';
              const allarguments = { type, id, name, value, placeholder, disabled, readonly, options, required, title, pattern };
              this.shadowRoot.innerHTML = `
                <style>${this.getStyles()}</style>
                <form class="validate-form">
                  <div class="input-container">
                    ${this.renderInput(allarguments)}
                  </div>
                </form>
              `;
        
              // Reattach event listeners after rendering
              const input = this.shadowRoot.querySelector('input, textarea, select');
              if (input) {
                input.addEventListener('input', this.handleInputChange);
                input.addEventListener('change', this.handleInputChange);
              }
            }
        
            renderInput(allarguments) {
              const { type, id, name, value, placeholder, disabled, readonly, options, required, title, pattern } = allarguments;
              const requiredAttr = required ? 'required' : ''; // This will output just 'required' when needed
              const newpattern = parsePattern(pattern)
              console.log("newpattern",newpattern)
              switch (type) {
                case 'textarea':
                  return `
                    <textarea
                      id="${id}"
                      name="${name}"
                      placeholder="${placeholder}"
                      ${disabled ? 'disabled' : ''}
                      ${readonly ? 'readonly' : ''}
                      ${requiredAttr}
                        ${title ? `title="${title}" oninvalid="this.setCustomValidity('${title}')" oninput="this.setCustomValidity('')"` : ''}
                        ${pattern ? `pattern="${pattern}"` : ''}
                    >${value}</textarea>
                  `;
                
                case 'checkbox':
                case 'switch':
                case 'boolean':
                  return `
                    <label class="switch">
                      <input
                        type="checkbox"
                        id="${id}"
                        name="${name}"
                        ${value === 'true' ? 'checked' : ''}
                        ${disabled ? 'disabled' : ''}
                        ${readonly ? 'readonly' : ''}
                        ${requiredAttr}
                        ${title ? `title="${title}" oninvalid="this.setCustomValidity('${title}')" oninput="this.setCustomValidity('')"` : ''}
                        ${pattern ? `pattern="${pattern}"` : ''}
                      >
                      <span class="slider"></span>
                    </label>
                  `;
                
                case 'select':
                  const optionsArray = JSON.parse(options);
                  return `
                    <select
                      id="${id}"
                      name="${name}"
                      ${disabled ? 'disabled' : ''}
                      ${readonly ? 'readonly' : ''}
                      ${required ? 'required' : ''}
                        ${title ? `title="${title}" oninvalid="this.setCustomValidity('${title}')" oninput="this.setCustomValidity('')"` : ''}
                        ${pattern ? `pattern="${pattern}"` : ''}
                    >
                      ${optionsArray.map(option => `
                        <option value="${option.value}" ${option.value === value ? 'selected' : ''}>
                          ${option.image ? `<img src="${option.image}" alt="${option.label}" style="vertical-align: middle; margin-right: 5px;">` : ''}
                          ${option.label}
                        </option>
                      `).join('')}
                    </select>
                  `;
                
                case 'radio':
                  const radioOptions = JSON.parse(options);
                  return radioOptions.map(option => `
                    <label>
                      <input
                        type="radio"
                        id="${id}"
                        name="${name}"
                        value="${option.value}"
                        ${option.value === value ? 'checked' : ''}
                        ${disabled ? 'disabled' : ''}
                        ${readonly ? 'readonly' : ''}
                      >
                      ${option.label}
                    </label>
                  `).join('');
                
                  default:
                    return `
                      <input
                        type="${type === 'string' ? 'text' : type}"
                        id="${id}"
                        name="${name}"
                        value="${value}"
                        placeholder="${placeholder}"
                        ${disabled ? 'disabled' : ''}
                        ${readonly ? 'readonly' : ''}
                        ${requiredAttr}
                        ${title ? `title="${title}" oninvalid="this.setCustomValidity('${title}')" oninput="this.setCustomValidity('')"` : ''}
                        ${pattern ? `pattern=${newpattern.source}` : ''}
                      >
                    `;
                
              }
            }
        
            getInputValues() {
              const input = this.shadowRoot.querySelector('input, textarea, select');
              if (!input) return null;
            
              if (input.type === 'checkbox') {
                return input.checked;
              }
              
              if (input.tagName.toLowerCase() === 'textarea') {
                const value = input.value.trim();
                return value ? value.split('\n') : [];
              }
            
              if (input.tagName.toLowerCase() === 'select') {
                return input.value;
              }
            
              if (input.type === 'radio') {
                const selectedRadio = this.shadowRoot.querySelector(`input[name="${input.name}"]:checked`);
                return selectedRadio ? selectedRadio.value : null;
              }
            
              const inputvalue = this.parseValueByType(input);
              const validate_form = this.shadowRoot.querySelectorAll('form');
              if (validate_form) {
                validate_form.forEach(form => {
                  const form_validity = form.reportValidity();
                  if (!form_validity) {
                    form.classList.add('invalid');
                  } else {
                    form.classList.remove('invalid');
                  }
              //console.log("form_validity", form_validity);
                });
              }
  
              return inputvalue;
            }
            getvalidation(){
              let isValid = false;
              const validate_form = this.shadowRoot.querySelectorAll('form');
              if (validate_form) {
                validate_form.forEach(form => {
                  const form_validity = form.reportValidity();
                  if (!form_validity) {
                    isValid = false;
                  } else {
                    isValid = true;
                  }
               // console.log("form_validity", form_validity);
                });
              }
              return isValid;
            }
            parseValueByType(input) {
              const valueType = typeof input.value;
              const inputType = input.type;
              const value = input.value;
              switch (inputType) {
                case 'number':
                  const num = Number(value);
                  return isNaN(num) ? 0 : num * 1;
                case 'text':
                case 'string':
                  return value;
                default:
                  return value;
              }
            }
        
            setInputValues(value) {
              const input = this.shadowRoot.querySelector('input, textarea, select');
              if (!input) return;
            
              if (input.type === 'checkbox') {
                input.checked = Boolean(value);
              } else if (Array.isArray(value) && input.tagName.toLowerCase() === 'textarea') {
                input.value = value.join('\n');
              } else if (input.tagName.toLowerCase() === 'select') {
                input.value = value;
              } else if (input.type === 'radio') {
                const radioToSelect = this.shadowRoot.querySelector(`input[name="${input.name}"][value="${value}"]`);
                if (radioToSelect) {
                  radioToSelect.checked = true;
                }
              } else {
                input.value = value;
              }
            
              // Dispatch event when setting values programmatically
              this.handleInputChange();
            }
        
            resetInputValues() {
              const input = this.shadowRoot.querySelector('input, textarea, select');
              if (!input) return;
        
              if (input.type === 'checkbox') {
                input.checked = false;
              } else {
                input.value = '';
              }
        
              // Dispatch event when resetting values
              this.handleInputChange();
            }
        
            setOptions(options) {
              if (this.getAttribute('type') === 'select') {
                this.setAttribute('options', JSON.stringify(options));
                this.render();
              }
            }
        
            getSelectedOption() {
              if (this.getAttribute('type') === 'select') {
                const select = this.shadowRoot.querySelector('select');
                return select ? select.value : null;
              }
              return null;
            }
          }
        
          customElements.define('custom-input', CustomInput);
        }
        class ServerPropertiesElement extends HTMLElement {
          static get observedAttributes() {
              return ['server-id'];
          }
      
          constructor() {
              super();
              this.SWITCH_ELEMENT = '<label class="switch"> <input type="checkbox"$0> <span class="slider round"></span></label>';
              this.NUMBER_INPUT = "<input type='number' value='$0'>";
              this.TEXT_INPUT = "<input type='text' value='$0'>";
              
              // Store original types mapping
              this.propertyTypes = new Map();
              
              // Create shadow DOM
              this.attachShadow({ mode: 'open' });
              
              // Add styles
              this.shadowRoot.innerHTML = `
                  <style>
                  ${this.getStyles()}
                  </style>
                  <table id="sp-table"></table>
                  <button id="save-btn" class="primary-btn hidden">Save Properties</button>
              `;
          }
          getStyles() {
              return `
              :host {
                  width: 100%;
                  border-radius: 8px;
                  box-sizing: border-box;
                  color-scheme: light dark;
              }
                  .hidden {
                      display: none;
                  }
                      .primary-btn {
                      padding: 8px 16px;
                      background: #007bff;
                      color: white;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      }
      
                      .primary-btn:hover {
                      background: #0056b3;
                      }
                      .switch {
                          position: relative;
                          display: inline-block;
                          width: 60px;
                          height: 34px;
                      }
                      
                      .switch input {
                          opacity: 0;
                          width: 0;
                          height: 0;
                      }
                      
                      .slider {
                          position: absolute;
                          cursor: pointer;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          background-color: #ccc;
                          transition: .4s;
                      }
                      
                      .slider:before {
                          position: absolute;
                          content: "";
                          height: 26px;
                          width: 26px;
                          left: 4px;
                          bottom: 4px;
                          background-color: white;
                          transition: .4s;
                      }
                      
                      input:checked + .slider {
                          background-color: #2196F3;
                      }
                      
                      input:checked + .slider:before {
                          transform: translateX(26px);
                      }
                      
                      .slider.round {
                          border-radius: 34px;
                      }
                      
                      .slider.round:before {
                          border-radius: 50%;
                      }
                      
                      table {
                          width: 100%;
                          border-collapse: collapse;
                          table-layout: fixed;
                          border: 1px solid rgb(46, 62, 83, 0.5);
                      }
                      
                      td {
                          padding: 8px;
                          border: 1px solid rgb(46, 62, 83, 0.5);
                      }
                      
                      input[type="text"], input[type="number"] {
                          width: auto;
                          padding: 6px;
                          box-sizing: border-box;
                      }
                          `;
          }
          connectedCallback() {
              this.loadProperties();
              this.shadowRoot.querySelector('#save-btn').addEventListener('click', () => this.emitPropertiesChange());
          }
      
          getValueType(value) {
              if (value === null) {
                  return "null";
              }
              const type = typeof value;
              if (type === "boolean" || type === "number") {
                  return type;
              }
              return "string";
          }
      
          parseValueByType(value, type) {
              switch (type) {
                  case "null":
                      return null;
                  case "boolean":
                      return value === "true" || value === true;
                  case "number":
                      const num = Number(value);
                      return isNaN(num) ? 0 : num;
                  default:
                      return String(value);
              }
          }
      
          async loadProperties() {
              const serverId = this.getAttribute('server-id') || window.localStorage.selectedServer;
              try {
                  const url = `/api/servers/${serverId}/server.properties`;
                  const response = await fetch(url);
                  const result = response.ok ? await response.json() : {};
                  let properties = result.data
                  if (typeof result.data === "string") {
                      // sacar los datos a un objeto ya que es un string con saltos de linea
                      // añadir un filtro si comienza con # o no tiene un split
                      
                      properties = result.data.split('\n').reduce((acc, line) => {
                        // Filtrar líneas que comienzan con '#' o no contienen '='
                        if (!line.startsWith('#') && line.includes('=')) {
                            const [key, value] = line.split('=');
                            // Eliminar espacios en blanco alrededor de la clave y el valor
                            acc[key.trim()] = value.trim();
                        }
                        return acc;
                    }, {});
                  }
                  const table = this.shadowRoot.querySelector('#sp-table');
                  table.innerHTML = ''; // Clear existing content
                  
                  for (const [key, value] of Object.entries(properties)) {
                      // Store original type
                      const originalType = this.getValueType(value);
                      this.propertyTypes.set(key, originalType);
      
                      // Handle display value
                      let displayValue = value;
                      if (originalType === "null") {
                          displayValue = "";
                      }
      
                      // Override specific property types
                      if (key === "server-ip") {
                          this.propertyTypes.set(key, "string");
                      }
      
                      const row = document.createElement('tr');
                      row.innerHTML = `
                          <td>${key}</td>
                          <td>${this.createInput(this.propertyTypes.get(key), displayValue)}</td>
                      `;
                      // Store type information in the row
                      row.dataset.propertyType = this.propertyTypes.get(key);
                      table.appendChild(row);
                  }
                  
              } catch (error) {
                  console.error('Error loading properties:', error);
              }
          }
      
          createInput(type, value) {
              switch (type) {
                  case "boolean":
                      const isChecked = value === true ? " checked" : "";
                      return this.SWITCH_ELEMENT.replace("$0", isChecked);
                  case "number":
                      return this.NUMBER_INPUT.replace("$0", value);
                  case "null":
                      return this.TEXT_INPUT.replace("$0", "");
                  default:
                      return this.TEXT_INPUT.replace("$0", value);
              }
          }
      
          async getPropertiesToSave() {
              const serverId = this.getAttribute('server-id');
              const saveResult = {};
              
              this.shadowRoot.querySelectorAll('#sp-table tr').forEach(row => {
                  const key = row.cells[0].textContent;
                  const inputCell = row.cells[1];
                  const originalType = this.propertyTypes.get(key);
                  
                  let rawValue;
                  const checkbox = inputCell.querySelector('input[type="checkbox"]');
                  if (checkbox) {
                      rawValue = checkbox.checked;
                  } else {
                      rawValue = inputCell.querySelector('input').value;
                  }
      
                  // Parse value according to its original type
                  saveResult[key] = this.parseValueByType(rawValue, originalType);
              });
              const data = {
                  server: serverId,
                  result: saveResult
              }
              return data;
      
          }
          async emitPropertiesChange() {
              const data = await this.getPropertiesToSave();
              console.log("result", data);
              try {
                  if (Object.keys(data).length === 0) {
                      console.log("saveResult is empty");
                      return;
                  }
      
                  this.dispatchEvent(new CustomEvent('save-success', {
                      bubbles: true,
                      composed: true,
                      detail: data,
                  }));
              } catch (error) {
                  console.error('Error saving properties:', error);
              }
          }
      }
      // Register the custom element
      customElements.define('server-properties', ServerPropertiesElement);
      // Define el componente personalizado
      class SystemMonitor extends HTMLElement {
          constructor() {
              super();
              this.attachShadow({ mode: 'open' });
          }
      
          connectedCallback() {
              this.render();
          }
      
          render() {
              this.shadowRoot.innerHTML = `
                  <style>
                      :host {
                          display: block;
                          font-family: Arial, sans-serif;
                          word-wrap: break-word;
                      }
      
                      @media (prefers-color-scheme: dark) {
                          :host {
                              color: #e0e0e0;
                              background-color: #1a1a1a;
                          }
                          table {
                              border-color: #404040;
                          }
                          th, td {
                              border-color: #404040;
                          }
                          th {
                              background-color: #2a2a2a;
                          }
                      }
      
                      @media (prefers-color-scheme: light) {
                          :host {
                              color: #1a1a1a !important;
                              background-color: #ffffff !important;
                          }
                          table {
                              border-color: #ddd;
                          }
                          th, td {
                              border-color: #ddd;
                          }
                          th {
                              background-color: #f5f5f5;
                          }
                      }
      
                      table {
                          width: 100%;
                          border-collapse: collapse;
                          margin: 10px 0;
                          table-layout: fixed;
                      }
      
                      th, td {
                          padding: 8px;
                          border: 1px solid;
                          text-align: left;
                      }
      
                      td {
                          word-break: break-word;
                          overflow-wrap: break-word;
                          hyphens: auto;
                      }
      
                      #enviroment-table td {
                          white-space: pre-wrap;
                          word-wrap: break-word;
                          max-width: 0;
                      }
      
                      .system-info p {
                          margin: 8px 0;
                      }
      
                      sup {
                          font-size: 0.75em;
                      }
                  </style>
                  <div class="system-monitor">
                      <div class="system-info">
                          <h3>{{systemMonitor.os}}</h3>
                          <p>{{systemMonitor.os}}: <span id="os-name"></span></p>
                          <p>{{systemMonitor.osBuild}}: <span id="os-build"></span></p>
                          <p>{{systemMonitor.totalRam}}: <span id="total-ram"></span></p>
                          <p>{{systemMonitor.kubekUptime}}: <span id="kubek-uptime"></span></p>
                          <p>{{systemMonitor.cpuModel}}: <span id="cpu-model"></span></p>
                          <p>{{systemMonitor.cpuSpeed}}: <span id="cpu-speed"></span></p>
                      </div>
                      
                      <h3>{{systemMonitor.environment}}</h3>
                      <table id="enviroment-table">
                          <colgroup>
                              <col style="width: 30%">
                              <col style="width: 70%">
                          </colgroup>
                      </table>
                      
                      <h3>{{systemMonitor.networkInterfaces}}</h3>
                      <table id="networks-table">
                          <colgroup>
                              <col style="width: 30%">
                              <col style="width: 70%">
                          </colgroup>
                      </table>
                      
                      <h3>{{systemMonitor.disks}}</h3>
                      <table id="disks-table">
                          <colgroup>
                              <col style="width: 20%">
                              <col style="width: 20%">
                              <col style="width: 20%">
                              <col style="width: 20%">
                              <col style="width: 20%">
                          </colgroup>
                          <tr>
                              <th>Unidad</th>
                              <th>Usado</th>
                              <th>Libre</th>
                              <th>Total</th>
                              <th>Porcentaje</th>
                          </tr>
                      </table>
                  </div>
              `;
          }
      
          renderdata(data) {
              const getElement = (id) => this.shadowRoot.querySelector(`#${id}`);
              // Procesar variables de entorno
              const envTable = getElement('enviroment-table');
              for (const [key, value] of Object.entries(data.enviroment)) {
                  const row = document.createElement('tr');
                  row.innerHTML = `<th>${key}</th><td>${value}</td>`;
                  envTable.appendChild(row);
              }
      
              // Procesar interfaces de red
              const networkTable = getElement('networks-table');
              for (const [key, value] of Object.entries(data.networkInterfaces)) {
                  const ips = value.map(inner => 
                      `<span>${inner.address} <sup>${inner.family}</sup></span>`
                  ).join('<br>');
                  
                  const row = document.createElement('tr');
                  row.innerHTML = `<th>${key}</th><td>${ips}</td>`;
                  networkTable.appendChild(row);
              }
              // Actualizar información del sistema
              getElement('os-name').innerHTML = 
                  `${data.platform.version} <sup>${data.platform.arch}</sup>`;
              getElement('os-build').textContent = data.platform.release;
              getElement('total-ram').textContent = `${data.totalmem} Mb`;
  
              getElement('cpu-model').textContent = 
                  `${data.cpu.model} (${data.cpu.cores} cores)`;
              getElement('cpu-speed').textContent = `${data.cpu.speed} MHz`;
              const disksTable = getElement('disks-table');
              console.log("disks", data.disks, data);
              data.disks.forEach(disk => {
                let letter, total, used, free, percent;
  
                if (data.platform.name === "Linux") {
                    // Usar las propiedades correctas para Linux
                    letter = disk.mount; // Usar 'mount' en lugar de '_mounted'
                    total = disk.total;  // Los valores ya están en bytes
                    used = disk.used;    // No multiplicar por 1024
                    free = disk.available;
                    percent = disk.use;  // Usar 'use' en lugar de '_capacity'
                } else {
                    // Formato para Windows
                    letter = disk.mount;
                    total = disk.total;
                    used = disk.used;
                    free = disk.available;
                    percent = disk.use;
                }
  
                // Crear fila de la tabla (sin cambios)
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th>${letter}</th>
                    <td>${KubekUtils.humanizeFileSize(used)}</td>
                    <td>${KubekUtils.humanizeFileSize(free)}</td>
                    <td>${KubekUtils.humanizeFileSize(total)}</td>
                    <td>${percent}%</td>
                `;
                disksTable.appendChild(row);
              });
              getElement('kubek-uptime').textContent = 
              KubekUtils.humanizeSeconds(data.uptime);
          }
      }
  
  // Registrar el componente
  customElements.define('system-monitor', SystemMonitor);

      class CustomPopup extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open', delegatesFocus: true });
            this._options = [];
            this.container = document.createElement('div');
            this.lastFocusedElement = null;
            
            this.container.style.cssText = `
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
            `;
        
            const style = document.createElement('style');
            style.textContent = `
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
            `;
        
            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(this.container);
            this.handleClickOutside = this.handleClickOutside.bind(this);
        }
    
        // Getter y setter para las opciones
        get options() {
            return this._options;
        }
    
        set options(newOptions) {
            this._options = newOptions;
            this.render();
        }
    
        // Método para agregar una única opción
        addOption(html, callback) {
            this._options.push({
                html,
                callback: (event) => {
                    callback(event);
                    this.hide();
                }
            });
            this.render();
            return this._options.length - 1; // Retorna el índice de la opción agregada
        }
    
        // Método para establecer múltiples opciones de una vez
        setOptions(options) {
            this._options = options.map(option => ({
                html: option.html,
                callback: (event) => {
                    option.callback(event);
                    this.hide();
                }
            }));
            this.render();
        }
    
        // Método para limpiar todas las opciones
        clearOptions() {
            this._options = [];
            this.render();
        }
    
        // Método para remover una opción específica por índice
        removeOption(index) {
            if (index >= 0 && index < this._options.length) {
                this._options.splice(index, 1);
                this.render();
                return true;
            }
            return false;
        }
    
        render() {
            this.container.innerHTML = '';
            this._options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'popup-option';
                optionElement.innerHTML = option.html;
                optionElement.addEventListener('click', option.callback);
                this.container.appendChild(optionElement);
            });
        }
    
        connectedCallback() {
            this.render();
        }
    
        handleClickOutside(event) {
            const path = event.composedPath();
            if (!path.includes(this.container) && !path.includes(this.lastFocusedElement)) {
                this.hide();
            }
        }
        
        show(x, y) {
            this.container.style.display = 'flex';
            if (x !== undefined && y !== undefined) {
                this.moveTo(x, y);
            }
            document.addEventListener('click', this.handleClickOutside);
        }
        
        hide() {
            this.container.style.display = 'none';
            document.removeEventListener('click', this.handleClickOutside);
        }
        
        moveTo(x, y) {
            const rect = this.container.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
        
            if (x + rect.width > viewportWidth) {
                x = viewportWidth - rect.width - 10;
            }
            if (y + rect.height > viewportHeight) {
                y = viewportHeight - rect.height - 10;
            }
            this.container.style.left = `${Math.max(0, x)}px`;
            this.container.style.top = `${Math.max(0, y)}px`;
        }
        
        showAtElement(element) {
            const rect = element.getBoundingClientRect();
            this.show(rect.left, rect.bottom);
            this.lastFocusedElement = element;
        }
        
        disconnectedCallback() {
            document.removeEventListener('click', this.handleClickOutside);
        }
    }
    
    // Registrar el componente
    customElements.define('custom-popup', CustomPopup);
  class StatusElement extends HTMLElement {
      constructor() {
          super();
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = `
              <style>
                  :host {
                      display: inline-block;
                      padding: 5px 10px;
                      border-radius: 5px;
                      color: white;
                      font-family: Arial, sans-serif;
                  }
                  .status {
                      display: grid;
                      grid-template-columns: 10px 1fr;
                      align-items: center;
                      gap: 5px;
                  }
                  .status-circle {
                      display: inline-block;
                      min-width: 10px;
                      min-height: 10px;
                      width: 10px;
                      height: 10px;
                      border-radius: 50%;
                      margin-right: 5px;
                  }
                  .status-text {
                      display: inline-block;
                  }
              </style>
              <div class="status">
                  <span class="status-circle"></span>
                  <span class="status-text"></span>
              </div>
          `;
          this.statusCircle = this.shadowRoot.querySelector('.status-circle');
          this.statusText = this.shadowRoot.querySelector('.status-text');
      }
  
      static get observedAttributes() {
          return ['status'];
      }
  
      attributeChangedCallback(name, oldValue, newValue) {
          if (name === 'status') {
              this.updateStatus(newValue);
          }
      }
  
      updateStatus(status,statusString) {
          const statusText = status || 'Unknown';
          this.statusText.textContent = statusString || statusText;
  
          // Cambiar el color según el estado
          this.statusCircle.style.backgroundColor = this.getStatusColor(status);
      }
  
      getStatusColor(status) {
          switch (status) {
              case "STOPPING":
              case "STARTING":
              case "stopping":
              case "starting":
                  return 'yellow';
              case "RUNNING":
              case "running":
                  return 'green';
              case "STOPPED":
              case "stopped":
                  return 'red';
              default:
                  return 'gray';
          }
      }
  }
  
  customElements.define('status-element', StatusElement);
  class DropdownComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      
      // Initial render
      this.render();
      this.isHidden = false;
      // Bind methods
      this.toggleDropdown = this.toggleDropdown.bind(this);
    }
    
    static get observedAttributes() {
      return ['button-text', "hidden-button"];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'button-text') {
        this.render();
      } else if (name === 'hidden-button') {
        const button = this.shadowRoot.querySelector('button');
        if (newValue !== null) {
          button.style.display = 'none';
        } else {
          button.style.display = 'grid';
        }
      }
    }
    
    toggleDropdown() {
      const content = this.shadowRoot.querySelector('.dropdown-content');
      content.classList.toggle('active');
      const button =this.shadowRoot.querySelector('button')
      if (content.classList.contains('active')) {
        this.isHidden = false;
        if (button) button.textContent = 'Ocultar';
      } else {
        this.isHidden = true;
        if (button) button.textContent = 'Mostrar';
      }
    }
    hide() {
      const content = this.shadowRoot.querySelector('.dropdown-content');
      const button =this.shadowRoot.querySelector('button')
      this.isHidden = true;
      if (button) button.textContent = 'Mostrar';
      if (content.classList.contains('active')) {
        content.classList.remove('active');
      }
    }
    show() {
      const content = this.shadowRoot.querySelector('.dropdown-content');
      const button =this.shadowRoot.querySelector('button')
  
      this.isHidden = false;
      if (button) button.textContent = 'Ocultar';
      if (!content.classList.contains('active')) {
        content.classList.add('active');
      }
    }
    render() {
      const buttonText = this.getAttribute('button-text');
      this.shadowRoot.innerHTML = `
        <style>
          .dropdown {
            margin-bottom: 20px;
          }
          
          .dropdown-content {
            display: none;
            padding: 6px;
            border: 1px solid;
            border-color: inherit;
            border-radius: 4px;
            gap: 0.5rem;
          }
          
          .dropdown-content.active {
            display: grid;
          }
          
          button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          button:hover {
            background-color: #45a049;
          }
          
          ::slotted(.row) {
            display: flex;
            gap: 1rem;
            align-items: center;
          }
          
          ::slotted(.item) {
            flex: 1;
            background-color: #f5f5f5;
            border-radius: 4px;
          }
        </style>
        
        <div class="dropdown">
        ${buttonText ? `<button>${buttonText}</button>` : ''}
          <div class="dropdown-content">
            <slot></slot>
          </div>
        </div>
      `;
      
      // Add event listener to button
      if (buttonText) {
        this.shadowRoot.querySelector('button').addEventListener('click', this.toggleDropdown);
      }
    }
    
    disconnectedCallback() {
      const button = this.shadowRoot.querySelector('button');
      if (button) {
        button.removeEventListener('click', this.toggleDropdown);
      }
    }
  }
  
  // Register the custom element
  customElements.define('dropdown-component', DropdownComponent);


  class EnhancedSelect extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.selectedValues = [];
      this.options = [];
      this.multiple = false;
    }
  
    static get observedAttributes() {
      return ['multiple', "grid"];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'multiple') {
        this.multiple = newValue !== null;
        // Reset selections when switching modes
        this.selectedValues = [];
        this.render();
        this.updateSelections();
      }
    }
  
    connectedCallback() {
      this.multiple = this.hasAttribute('multiple');
      this.render();
      this.addEventListeners();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inherit;
            grid-template-columns: inherit;
            grid-template-rows: inherit;
            font-family: Arial, sans-serif;
            border: 0px;
          }
          .select-container {
            border-radius: 4px;
            max-width: ${this.hasAttribute('grid') ? '100%' : '300px'};
            max-height: 480px;
            overflow-y: auto;
            padding: 8px;
          }
          .preview-container {
            border: 0px;
            margin-bottom: 12px;
            padding: 8px;
            border-bottom: 1px solid #eee;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
          }
          .preview-container img {
            max-width: 100%;
            max-height: 150px;
            object-fit: contain;
          }
          .options-list {
            display: ${this.hasAttribute('grid') ? 'grid' : 'flex'};
            flex-direction: column;
            grid-template-columns: repeat(auto-fit, minmax(100px, auto));
            gap: ${this.hasAttribute('grid') ? '8px' : '4px'};
          }
          .option {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            border: 2px solid transparent;
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: #222c3a;
            border: 3px solid #2e3e53;
          }
          .option:hover {
            background-color: inherit;
            color: inherit;
          }
          .option.selected {
            background-color: inherit;
            color: #32d583;;
            border-color: #32d583;;
            font-weight: 500;
          }
          .option img {
            width: 24px;
            height: 24px;
            object-fit: cover;
            border-radius: 2px;
          }
        </style>
        <div class="select-container">
          <div class="preview-container" style="display: none;"></div>
          <div class="options-list"></div>
        </div>
      `;
    }
  
    addEventListeners() {
      const optionsList = this.shadowRoot.querySelector('.options-list');
      optionsList.addEventListener('click', (e) => {
        const optionElement = e.target.closest('.option');
        if (optionElement) {
          console.log("optionElement", optionElement);
          if (this.multiple) {
            this.toggleOption(optionElement);
          } else {
            this.selectOption(optionElement);
          }
        }
      });
    }
  
    updatePreview(selectedOptions) {
      const previewContainer = this.shadowRoot.querySelector('.preview-container');
      previewContainer.innerHTML = '';
  
      if (!Array.isArray(selectedOptions)) {
        selectedOptions = selectedOptions ? [selectedOptions] : [];
      }
  
      if (selectedOptions.length > 0) {
        previewContainer.style.display = 'flex';
        selectedOptions.forEach(option => {
          if (option.img || option.image) {
            const img = document.createElement('img');
            img.src = option.img || option.image;
            img.alt = option.label;
            previewContainer.appendChild(img);
          } else if (option.html) {
            const div = document.createElement('div');
            div.innerHTML = option.html;
            previewContainer.appendChild(div);
          } else {
            previewContainer.style.display = 'none';
          }
        });
      } else {
        previewContainer.style.display = 'none';
      }
    }
  
    toggleOption(optionElement) {
      const value = optionElement.dataset.value;
      const index = this.selectedValues.indexOf(value);
      
      if (index === -1) {
        this.selectedValues.push(value);
      } else {
        this.selectedValues.splice(index, 1);
      }
      
      this.updateSelections();
      
      const selectedOptions = this.options.filter(opt => this.selectedValues.includes(opt.value));
      this.updatePreview(selectedOptions);
  
      this.dispatchEvent(new CustomEvent('change', {
        detail: selectedOptions
      }));
    }
  
    selectOption(optionElement) {
      const value = optionElement.dataset.value;
      const selectedOption = this.options.find(opt => opt.value === value);
      console.log("selectedOption", selectedOption, value);
      if (!selectedOption) return;
      
      this.selectedValues = [value];
      this.updateSelections();
      this.updatePreview(selectedOption);
  
      this.dispatchEvent(new CustomEvent('change', {
        detail: selectedOption
      }));
    }
    setSelectedValues(values) {
      this.selectedValues = values;
      this.updateSelections();
    }
    updateSelections() {
      const options = this.shadowRoot.querySelectorAll('.option');
      options.forEach(option => {
        option.classList.toggle('selected', this.selectedValues.includes(option.dataset.value));
      });
    }
  
    setOptions(options) {
      console.log("options EnhancedSelect", options);
      this.options = options;
      const optionsList = this.shadowRoot.querySelector('.options-list');
      
      optionsList.innerHTML = options.map(option => {
        let optionContent = '';
        let optionState = '';
        if (option.img || option.image) {
          optionContent += `<img src="${option.img || option.image}" alt="${option.label}">`;
        }
        if (option.state) {
          optionState = `<span class="state">${option.state}</span>`;
        }
        optionContent += `<span>${option.label}</span>`;
  
        return `
          <div class="option ${this.selectedValues.includes(option.value) ? 'selected' : ''}" 
               data-value="${option.value}">
            ${optionContent}
            ${optionState}
          </div>
        `;
      }).join('');
  
      if (this.selectedValues.length > 0) {
        if (this.multiple) {
          const selectedOptions = options.filter(opt => this.selectedValues.includes(opt.value));
          this.updatePreview(selectedOptions);
        } else {
          const selectedOption = options.find(opt => opt.value === this.selectedValues[0]);
          if (selectedOption) {
            this.updatePreview(selectedOption);
          }
        }
      }
    }
  
    getValue() {
      return this.multiple ? this.selectedValues : this.selectedValues[0] || null;
    }
  
    getSelectedOptions() {
      const selected = this.options.filter(opt => this.selectedValues.includes(opt.value));
      return this.multiple ? selected : selected[0] || null;
    }
  }
  
  customElements.define('enhanced-select', EnhancedSelect);
  class FileExplorer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.currentPath = './';
      this._data = [];
    }
  
    // Utility function to normalize paths
    normalizePath(path) {
      if(!path) return "/"
      // Remove duplicate slashes
      return path.replace(/\/+/g, '/');
    }
  
    // Utility function to format file sizes
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      
      // Calculate the appropriate size unit
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      // Return formatted size with up to 2 decimal places
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  
    static get observedAttributes() {
      return ['current-path'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'current-path' && oldValue !== newValue) {
        this.currentPath = this.normalizePath(newValue);
        this.render();
        // Actualizar el display del path
        document.getElementById('path-display').textContent = `Current Path: ${this.currentPath}`;
      }
    }
  
    set data(value) {
      if (!value) return;
      // Normalize paths in the data before setting
      this._data = value.map(item => ({
        ...item,
        path: this.normalizePath(item.path),
        type: item.type || item.isDirectory ? "directory" : "file",
        lastModified: item.lastModified || item.modified,
      }));
      this.render();
    }
  
    get data() {
      return this._data;
    }
  
    connectedCallback() {
      this.render();
      this.addEventListeners();
    }
  
    addEventListeners() {
      this.shadowRoot.addEventListener('dblclick', (e) => {
        const row = e.target.closest('tr');
        if (row) {
          const item = this._data[row.dataset.index];
          this.dispatchEvent(new CustomEvent('item-dblclick', {
            detail: { item },
            bubbles: true,
            composed: true
          }));
        }
      });
  
      this.shadowRoot.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const row = e.target.closest('tr');
        if (row) {
          const item = this._data[row.dataset.index];
          this.dispatchEvent(new CustomEvent('item-contextmenu', {
            detail: {
              item,
              x: e.clientX,
              y: e.clientY,
              target: e.target
            },
            bubbles: true,
            composed: true
          }));
        }
      });
    }
  
    render() {
      const style = `
        <style>
          :host {
            display: block;
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid rgb(46, 62, 83, 0.5);
          }
          tr:hover {
            background-color: #222;
            cursor: pointer;
          }
          .icon {
            width: 20px;
            height: 20px;
            display: inline-block;
            margin-right: 5px;
          }
          .directory {
            color: #2196F3;
          }
          .file {
            color: #607D8B;
          }
        </style>
      `;
      
      const content = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Path</th>
              <th>Size</th>
              <th>Modified</th>
            </tr>
          </thead>
          <tbody>
            ${this._data.map((item, index) => `
              <tr data-index="${index}" class="${item.type}">
                <td>
                  <span class="icon">${item.type === 'directory' ? '📁' : '📄'}</span>
                  ${item.name}
                </td>
                <td>${item.path}</td>
                <td>${item.type === 'directory' ? '-' : this.formatFileSize(item.size)}</td>
                <td>${this.formatDate(item.lastModified)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      this.shadowRoot.innerHTML = style + content;
    }
    formatDate(dateString) {
      if(!dateString) return "";
      const date = new Date(dateString);
      
      // Get date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
  
      // Format as "YYYY-MM-DD HH:mm:ss"
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  
  }
  
  customElements.define('file-explorer', FileExplorer);
  class SidebarComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.isVisible = false;
      this.serverlist = [];
      this.sidebarItems = [
      ];
    }
  
    static get styles() {
      return `
        <style>
          :host {
            position: fixed;
            left: -100%;
            top: 0;
            bottom: 0;
            z-index: 1000;
            transition: left 0.3s ease-in-out;
            font-family: inherit;
          }
  
          .sidebar {
            position: absolute;
            top: 25%;
            bottom: 25%;
            width: 280px;
            /*add blur effect*/
            backdrop-filter: blur(4px);
            background:  #222c3a73;
            padding: 1rem;
            box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
          }
          .material-symbols-rounded {
                  font-family: 'Material Symbols Outlined';
                  font-size: 1.5rem;
          }
          .sidebar-box {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color, #3a3a3a);
          }
  
          .sidebar-header {
            display: flex;
            justify-content: flex-end;
            padding-bottom: 1rem;
          }
  
          #servers-list-sidebar {
            max-height: 40vh;
            overflow-y: auto;
          }
  
          .sidebar-item, .server-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            margin: 0.25rem 0;
            border-radius: 6px;
            cursor: pointer;
            color: inherit;
            transition: all 0.2s ease;
          }
  
          .sidebar-item:hover, .server-item:hover {
            background: var(--hover-bg, #3a3a3a);
            color: inherit;
          }
  
          .sidebar-item.active {
            background: var(--active-bg, #4a90e2);
            color: white;
            cursor: default;
          }
  
          .material-symbols-rounded {
            font-size: 1.5rem;
          }
          .selected,
          .active {
            background: var(--active-bg, #4a90e2);
            color: white;
            cursor: default;
          }
          .icon-circle-bg {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--primary-color, #4a90e2);
            margin-right: 1rem;
          }
  
          .icon-circle-bg img {
            width: 20px;
            height: 20px;
            object-fit: contain;
          }
  
          button.dark-btn {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0.5rem;
          }
  
          @media (max-width: 400px) {
            .sidebar {
              padding: 0;
            }
          }
            #close-btn {
            background: #bf2121;
            border-radius: 4px;
            padding: 0.2em;
          }
            #close-btn:hover {
            background: red;
          }
        </style>
      `;
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    toggleSidebar(isVisible = !this.isVisible) {
      this.isVisible = isVisible;
      this.style.left = this.isVisible ? '0' : '-100%';
      
      const event = new CustomEvent('toggle-sidebar', {
        detail: { isVisible: this.isVisible },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    }
  
    setServersList(servers) {
      this.serverlist = servers;
      this.loadServersList();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        ${SidebarComponent.styles}
        <div class="sidebar">
          <div class="sidebar-header">
            <button class="dark-btn" id="close-btn">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>
  
          <div class="sidebar-box" id="servers-list-sidebar">
            ${this.createServerList()}
          </div>
  
          <div class="sidebar-box" id="main-menu-sidebar">
            ${this.sidebarItems.map(item => this.createSidebarItem(item)).join('')}
          </div>
        </div>
      `;
    }
  
    createServerList() {
      return `
        <div class="sidebar-item" id="new-server-btn">
          <div class="icon-circle-bg">
            <span class="material-symbols-rounded">add</span>
          </div>
          <span>Create server</span>
        </div>
        ${this.serverlist.map(server => this.createServerItem(server)).join('')}
      `;
    }
    setActiveElement(activeElement) {
      // Desmarcar todos los elementos activos
      this.shadowRoot.querySelectorAll('.sidebar-item.active, .server-item.active').forEach(item => {
        item.classList.remove('active');
      });
      if (!activeElement) return;
      const newServerBtn = this.shadowRoot.querySelector('#new-server-btn');
      if (activeElement.includes("newServer")) {
        newServerBtn.classList.add('selected');
        return;
      }
      // Buscar y marcar el elemento activo en los sidebarItems
      const sidebarItem = this.shadowRoot.querySelector(`.sidebar-item[data-page="${activeElement}"]`);
      if (sidebarItem) {
        sidebarItem.classList.add('active');
        return;
      }
  
      // Buscar y marcar el elemento activo en la lista de servidores
      const serverItem = this.shadowRoot.querySelector(`.server-item[data-server="${activeElement}"]`);
      if (serverItem) {
        serverItem.classList.add('active');
      }
    }
    createSidebarItem(item) {
      return `
        <div class="sidebar-item" data-page="${item.page}">
          <span class="material-symbols-rounded">${item.icon}</span>
          <span>${item.title}</span>
        </div>
      `;
    }
  
    createServerItem(server) {
      return `
        <div class="server-item" data-server="${server.title}">
          <div class="icon-circle-bg">
            <img src="${server.icon}" alt="${server.title}">
          </div>
          <span>${server.title}</span>
        </div>
      `;
    }
  
    setupEventListeners() {
      this.shadowRoot.addEventListener('click', e => {
        const item = e.target.closest('.sidebar-item, .server-item');
        if (!item) return;
  
        if (item.id === 'new-server-btn') {
          this.dispatchNewServerEvent();
          return;
        }
  
        if (item.classList.contains('sidebar-item')) {
          this.handleSidebarItemClick(item);
        } else if (item.classList.contains('server-item')) {
          this.handleServerItemClick(item);
        }
      });
      this.shadowRoot.getElementById('close-btn').addEventListener('click', () => this.toggleSidebar(false));
    }
  
    handleSidebarItemClick(item) {
      this.shadowRoot.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: {
          page: item.dataset.page,
          item: this.sidebarItems.find(i => i.page === item.dataset.page)
        },
        bubbles: true,
        composed: true
      }));
    }
  
    handleServerItemClick(item) {
      const server = item.getAttribute("data-server");
  
      console.log("handleServerItemClick", server);
      if (server) {
        this.dispatchEvent(new CustomEvent('server-change', {
          detail: { server: server },
          bubbles: true,
          composed: true
        }));
      }
    }
  
    dispatchNewServerEvent() {
      this.dispatchEvent(new CustomEvent('new-server', {
        bubbles: true,
        composed: true
      }));
    }
  
    loadServersList() {
      const container = this.shadowRoot.getElementById('servers-list-sidebar');
      container.innerHTML = this.createServerList();
    }
  }
  customElements.define('sidebar-menu', SidebarComponent);
  class CreateServer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.serverlist = [];
    }
  
    getStyles() {
      return `
        <style>
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            --primary-color: #5865F2;
            --active-bg: #5865F2;
            --hover-bg: inherit;
            --hover-bg: rgba(88, 101, 242, 0.1);
            --text-color: inherit;
          }
  
          #servers-list-sidebar {
            max-height: 40vh;
            overflow-y: auto;
            padding: 0.5rem;
            scrollbar-width: thin;
            scrollbar-color: var(--primary-color) transparent;
          }
  
          #servers-list-sidebar::-webkit-scrollbar {
            width: 6px;
          }
  
          #servers-list-sidebar::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 3px;
          }
  
          .sidebar-item, .server-item {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            color: var(--text-color);
            transition: all 0.2s ease;
            cursor: pointer;
            user-select: none;
          }
  
          .sidebar-item:hover:not(.selected),
          .server-item:hover:not(.selected) {
            background: var(--hover-bg);
          }
  
          .selected, .active {
            background: var(--active-bg) !important;
            color: white !important;
          }
  
          .icon-circle-bg {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--primary-color);
            margin-right: 1rem;
            flex-shrink: 0;
            transition: background-color 0.2s ease;
          }
  
          .icon-circle-bg img {
            width: 20px;
            height: 20px;
            object-fit: contain;
            filter: brightness(0) invert(1);
          }
  
          .sidebar-item span.material-symbols-rounded {
            color: white;
            font-size: 1.25rem;
          }
  
          button.dark-btn {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0.5rem;
          }
  
          .server-item span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
  
          #new-server-btn {
            margin-bottom: 1rem;
          }
        </style>
      `;
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
    setActiveElement(activeElement) {
      // Desmarcar todos los elementos activos
      this.shadowRoot.querySelectorAll('.selected').forEach(item => {
        item.classList.remove('selected');
      });
      if (!activeElement) return;
      const newServerBtn = this.shadowRoot.querySelector('#new-server-btn');
      if (activeElement.includes("newServer")) {
        newServerBtn.classList.add('selected');
        return;
      }
      // Buscar y marcar el elemento activo en la lista de servidores
      const serverItem = this.shadowRoot.querySelector(`.server-item[data-server="${activeElement}"]`);
      
      if (serverItem) {
        console.log("activeElement", activeElement, "serverItem", serverItem);
        serverItem.classList.add('active');
        serverItem.classList.add('selected');
      }
    }
    render() {
      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="sidebar-box" id="servers-list-sidebar">
          ${this.createServerList()}
        </div>`;
    }
  
    createServerList() {
      return `
        <div class="sidebar-item" id="new-server-btn">
          <div class="icon-circle-bg">
            <span class="material-symbols-rounded">+</span>
          </div>
          <span>Create server</span>
        </div>
        ${this.serverlist.map(server => this.createServerItem(server)).join('')}
      `;
    }
  
    createServerItem(server) {
      return `
        <div class="server-item" data-server="${server.title}">
          <div class="icon-circle-bg">
            <img src="${server.icon}" alt="${server.title}">
          </div>
          <span>${server.title}</span>
        </div>
      `;
    }
  
    setupEventListeners() {
      this.shadowRoot.addEventListener('click', e => {
        const item = e.target.closest('.sidebar-item, .server-item');
        if (!item) return;
  
        // Remove previous selections
        this.shadowRoot.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  
        if (item.id === 'new-server-btn') {
          this.dispatchNewServerEvent();
          return;
        }
  
        if (item.classList.contains('server-item')) {
          item.classList.add('selected');
          this.handleServerItemClick(item);
        }
      });
    }
    setServersList(servers) {
      this.serverlist = servers;
      this.loadServersList();
    }
    handleServerItemClick(item) {
      const server = item.dataset.server;
      if (server) {
        this.dispatchEvent(new CustomEvent('server-change', {
          detail: { server },
          bubbles: true,
          composed: true
        }));
      }
    }
  
    dispatchNewServerEvent() {
      this.dispatchEvent(new CustomEvent('new-server', {
        bubbles: true,
        composed: true
      }));
    }
  
    loadServersList() {
      const container = this.shadowRoot.getElementById('servers-list-sidebar');
      container.innerHTML = this.createServerList();
    }
  }
  
  customElements.define('server-menu', CreateServer);
  
  class GridSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._selected = null;
    }
  
    static get observedAttributes() {
        return ['data'];
    }
  
    connectedCallback() {
        this.render();
        this.addEventListeners();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data' && oldValue !== newValue) {
            this.render();
        }
    }
    setActiveElement(activeElement) {
      // Desmarcar todos los elementos activos
      this.shadowRoot.querySelectorAll('.sidebar-item.active, .server-item.active').forEach(item => {
        item.classList.remove('active');
      });
      if (!activeElement) return;
    }
    setServersList(servers) {
      this.serverlist = servers;
      this.loadServersList();
    }
    get data() {
        try {
            return JSON.parse(this.getAttribute('data') || '[]');
        } catch {
            return [];
        }
    }
  
    set data(value) {
        this.setAttribute('data', JSON.stringify(value));
    }
  
    get selected() {
        return this._selected;
    }
  
    set selected(value) {
        const oldValue = this._selected;
        this._selected = value;
        if (oldValue !== value) {
            this.dispatchEvent(new CustomEvent('change', {
                detail: { selected: value },
                bubbles: true,
                composed: true
            }));
            this.render();
        }
    }
  
    render() {
        const style = `
            :host {
                display: block;
            }
            .cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                padding: 1rem;
            }
            .card {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
                border: 2px solid #ddd;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .card.active {
                border-color: #4a90e2;
                background-color: rgba(74, 144, 226, 0.1);
            }
            .icon {
                width: 64px;
                height: 64px;
                object-fit: contain;
                margin-bottom: 0.5rem;
            }
            .title {
                text-align: center;
                font-weight: 500;
            }
        `;
  
        const items = this.data.map(item => `
            <div class="card ${this._selected === item.id ? 'active' : ''}" data-id="${item.id}">
                <img class="icon" src="${item.img}" alt="${item.title} logo">
                <span class="title">${item.title}</span>
            </div>
        `).join('');
  
        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="cards-grid">
                ${items}
            </div>
        `;
    }
  
    addEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                const id = card.dataset.id;
                this.selected = id;
                this.render();
            }
        });
    }
  }
  
  // Register the web component
  customElements.define('grid-selector', GridSelector);

  class KubekCircleProgress1 extends HTMLElement {
    // Constructor
    constructor() {
        super();
        this.value = 0;
        this.centerColor = '#000';
        this.bgColor = '#e0e0e0';
        this.activeColor = '#007bff';
        this.radius = 100;
        this.text = '';
    }
  
    // Método para observar los atributos que queremos que sean reactivos
    static get observedAttributes() {
        return ['value', 'center-color', 'bg-color', 'active-color', 'radius', 'text'];
    }
  
    // Método que se llama cuando el elemento es añadido al DOM
    connectedCallback() {
        this.create();
    }
  
    // Método que se llama cuando un atributo observado cambia
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case 'value':
                    this.value = parseFloat(newValue);
                    break;
                case 'center-color':
                    this.centerColor = newValue;
                    break;
                case 'bg-color':
                    this.bgColor = newValue;
                    break;
                case 'active-color':
                    this.activeColor = newValue;
                    break;
                case 'radius':
                    this.radius = parseFloat(newValue);
                    break;
                case 'text':
                    this.text = newValue;
                    break;
            }
            this.refreshColors();
            this.updateText(); // Actualizar el texto cuando cambia el atributo
        }
    }
  
    // Crear el elemento de progreso
    create() {
        this.setAttribute('role', 'progressbar');
        this.classList.add('circle-progress');
        this.style.width = `${this.radius}px`;
        this.style.height = `${this.radius}px`;
        this.innerHTML = `<span class='text'>${this.text || this.value + '%'}</span>`;
        this.refreshColors();
    }
  
    // Obtener el valor del progreso
    getValue() {
        return this.value;
    }
  
    // Establecer el valor del progreso
    setValue(value, updateText = true) {
        this.value = value;
        this.setAttribute('value', value);
        if (updateText) {
            this.text = value + '%';
            this.setAttribute('text', this.text); // Actualizar el atributo text
        }
        this.refreshColors();
        this.updateText(); // Actualizar el texto cuando cambia el valor
    }
  
    // Refrescar los colores del círculo
    refreshColors() {
        this.style.background = this.generateGradient(this.centerColor, this.bgColor, this.activeColor, this.value);
    }
  
    // Establecer el texto dentro del círculo
    setText(text) {
        this.text = text;
        this.setAttribute('text', text);
        this.updateText(); // Actualizar el texto cuando se establece directamente
    }
  
    // Obtener el texto establecido
    getText() {
        return this.text;
    }
  
    // Establecer el color activo
    setActiveColor(color) {
        this.activeColor = color;
        this.setAttribute('active-color', color);
        this.refreshColors();
    }
  
    // Establecer el color del centro
    setCenterColor(color) {
        this.centerColor = color;
        this.setAttribute('center-color', color);
        this.refreshColors();
    }
  
    // Establecer el color de fondo
    setBgColor(color) {
        this.bgColor = color;
        this.setAttribute('bg-color', color);
        this.refreshColors();
    }
  
    // Generar el gradiente para el círculo
    generateGradient(centerColor, bgColor, activeColor, value) {
        return `radial-gradient(closest-side, ${centerColor} 79%, transparent 80% 100%), conic-gradient(${activeColor} ${value}%, ${bgColor} 0)`;
    }
  
    // Método para actualizar el texto dentro del círculo
    updateText() {
        const textElement = this.querySelector('.text');
        if (textElement) {
            textElement.textContent = this.text || this.value + '%';
        }
    }
  }
  
  // Definir el nuevo elemento personalizado
  customElements.define('kubek-circle-progress', KubekCircleProgress1);
  class ActionButtons extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.buttons = [];
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .actions {
            display: flex;
            gap: 8px;
            padding: 8px;
          }
          
          .dark-btn {
            background: #222c3a;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: opacity 0.2s;
          }
          
          .dark-btn:hover {
            background: #2e3e53;
          }
          
          .dark-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .icon-only {
            padding: 8px;
          }
          
          .material-symbols-rounded {
            font-family: 'Material Symbols Outlined';
            font-size: 20px;
          }
          
          .hidden {
            display: none !important;
          }
        </style>
        <div class="actions">
          ${this.buttons.map(btn => this.createButtonHTML(btn)).join('')}
        </div>
      `;
      /** agregar un tooltip a los botones */
      this.shadowRoot.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseover', (e) => {
          const tooltip = button.dataset.tooltip;
          if (tooltip) {
            button.setAttribute('title', tooltip);
            button.classList.add('tooltip');
          }
        });
        button.addEventListener('click', (e) => {
          this.dispatchEvent(new CustomEvent('button-clicked', {
            detail: {
              id: button.id,
              action: button.dataset.action
            }
          }));
        });
      });
    }
  
    createButtonHTML(button) {
      return `
        <button 
          data-tooltip="${button.action}"
          id="${button.id}"
          class="dark-btn ${button.iconOnly ? 'icon-only' : ''}"
          data-action="${button.action}"
          ${button.disabled ? 'disabled' : ''}
        >
          <span class="material-symbols-rounded">${button.icon}</span>
          ${button.iconOnly ? '' : `<span>${button.label}</span>`}
        </button>
      `;
    }
  
    addButton(config) {
      this.buttons.push({
        id: config.id,
        label: config.label || '',
        icon: config.icon,
        iconOnly: config.iconOnly || false,
        action: config.action || '',
        disabled: config.disabled || false
      });
      this.render();
    }
  
    hideButton(buttonId) {
      const btn = this.shadowRoot.getElementById(buttonId);
      if (btn) btn.classList.add('hidden');
    }
  
    showButton(buttonId) {
      const btn = this.shadowRoot.getElementById(buttonId);
      if (btn) btn.classList.remove('hidden');
    }
  
    disableButton(buttonId) {
      const btn = this.shadowRoot.getElementById(buttonId);
      if (btn) btn.disabled = true;
    }
  
    enableButton(buttonId) {
      const btn = this.shadowRoot.getElementById(buttonId);
      if (btn) btn.disabled = false;
    }
    hideAllButtons() {
      const buttons = this.shadowRoot.querySelectorAll('button');
      buttons.forEach(btn => btn.classList.add('hidden'));
    }
  
    showAllButtons() {
      const buttons = this.shadowRoot.querySelectorAll('button');
      buttons.forEach(btn => btn.classList.remove('hidden'));
    }
  
  }
  
  customElements.define('action-buttons', ActionButtons);

  class TaskNotifications extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: block;
          }
          @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 100 700;
            src: url(https://fonts.gstatic.com/icon/font?kit=kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsKTAp49f3jnpQ&skey=b8dc2088854b122f&v=v226) format('woff2');
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
          /* Estilos para el contenedor de notificaciones y cada notificación */
          #notifications-container {
            display: flex;
            flex-direction: column;
          }
          .notification {
            border: 1px solid #193455;
            padding: 10px;
            margin: 5px;
            border-radius: 5px;
            background: #1a1a1a;
            display: flex;
            align-items: center;
          }
          .icon {
            margin-right: 10px;
          }
          .content {
            flex: 1;
          }
          .progress-bar {
            background: #e0e0e0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 4px;
          }
          .progress {
            background: #3f83f8;
            height: 100%;
            width: 0%;
            transition: width 0.3s;
          }
        </style>
        <div id="notifications-container"></div>
      `;
    }
  
    /**
     * Actualiza o agrega notificaciones a partir de un objeto de tareas.
     * Cada key del objeto es el id de la tarea.
     * @param {Object} tasks - Objeto con las tareas.
     */
    updateTasks(tasks) {
      const container = this.shadowRoot.querySelector('#notifications-container');
      for (const id in tasks) {
        if (tasks.hasOwnProperty(id)) {
          const task = tasks[id];
          let notif = container.querySelector(`.notification[data-id="${id}"]`);
          if (notif) {
            // Si la notificación ya existe, se actualiza.
            this._updateNotification(notif, task);
          } else {
            // Si no existe, se crea y se agrega.
            notif = this._createNotification(id, task);
            container.appendChild(notif);
          }
        }
      }
    }
  
    _createNotification(id, task) {
      const notif = document.createElement('div');
      notif.classList.add('notification');
      notif.setAttribute('data-id', id);
      notif.innerHTML = this._getNotificationHTML(task);
      return notif;
    }
  
    _updateNotification(notif, task) {
      notif.innerHTML = this._getNotificationHTML(task);
    }
  
    _getNotificationHTML(task, taskicon = "deployed_code_update") {
      // Seleccionamos el ícono según el tipo o estado de la tarea
      let icon = taskicon;
      if (task.type === 'downloading') {
     // icon = 'cloud_download';
      }
      if (task.status === 'completed') {
        icon = 'check_circle';
      }
      
      // Se arma el HTML de la notificación
      return `
        <span class="material-symbols-outlined icon">${icon}</span>
        <div class="content">
          <strong>${task.filename}</strong>
          ${typeof task.progress !== 'undefined' ? `
            <div class="progress-bar">
              <div class="progress" style="width: ${task.progress}%"></div>
            </div>
            <small>${task.progress}%</small>
          ` : ''}
        </div>
      `;
    }
  }
  
  // Definimos el custom element
  customElements.define('task-notifications', TaskNotifications);
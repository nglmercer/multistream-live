// import en el lado del cliente... html

class CustomSelect extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.options = [];
        this.selectedOption = null;
        this.searchTerm = '';
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    // Getter para la propiedad 'value'
    get value() {
        return this.selectedOption ? this.selectedOption.value : null;
    }

    // Setter para la propiedad 'value'
    set value(newValue) {
        this.setValue(newValue);
    }

    setOptions(options) {
        this.options = options;
        this.renderOptions();
    }

    setValue(value) {
        const option = this.options.find(opt => opt.value === value);
        if (option) {
            this.selectedOption = option;
            this.renderSelectedOption();
        }
    }

    getValue() {
        return this.selectedOption ? this.selectedOption.value : null;
    }

    render() {
        this.shadowRoot.innerHTML = `
<style>
    :host {
        --background-color: #333;
        --text-color: #fff;
        --border-color: #555;
        --option-hover-bg: #444;
        --input-bg: #444;
        --input-text-color: #fff;
    }

    .select-wrapper {
        position: relative;
        width: 200px;
    }

    .selected {
        display: flex;
        align-items: center;
        padding: 8px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        background-color: var(--background-color);
        color: var(--text-color);
    }

    .selected img {
        margin-right: 8px;
        width: 24px;
        height: 24px;
    }

    .dropdown {
        display: none;
        position: absolute;
        top: 100%;
        width: 100%;
        border: 1px solid var(--border-color);
        max-height: 200px;
        overflow-y: auto;
        background: var(--background-color);
        z-index: 10;
    }

    .dropdown.open {
        display: block;
    }

    .option {
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
        color: var(--text-color);
    }

    .option img {
        margin-right: 8px;
        width: 24px;
        height: 24px;
    }

    .option:hover {
        background-color: var(--option-hover-bg);
    }

    .search {
        padding: 8px;
        border-bottom: 1px solid var(--border-color);
        background-color: var(--input-bg);
    }

    .search input {
        width: 100%;
        padding: 4px;
        background-color: var(--input-bg);
        color: var(--input-text-color);
        border: none;
    }

    .search input::placeholder {
        color: #bbb;
    }
</style>

            <div class="select-wrapper">
                <div class="selected">
                    <img src="" alt="" style="display: none;">
                    <span>Seleccione una opción</span>
                </div>
                <div class="dropdown">
                    <div class="search">
                        <input type="text" placeholder="Buscar...">
                    </div>
                    <div class="options"></div>
                </div>
            </div>
        `;
    }

    renderOptions() {
        const optionsContainer = this.shadowRoot.querySelector('.options');
        optionsContainer.innerHTML = '';
        this.options
            .filter(option => option.label.toLowerCase().includes(this.searchTerm.toLowerCase()))
            .forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                optionElement.innerHTML = `
                    ${option.image ? `<img src="${option.image}" alt="${option.value}">` : ''}
                    <span>${option.label}</span>
                `;
                optionElement.addEventListener('click', () => this.selectOption(option));
                optionsContainer.appendChild(optionElement);
            });
    }

    renderSelectedOption() {
        const selectedElement = this.shadowRoot.querySelector('.selected span');
        const selectedImage = this.shadowRoot.querySelector('.selected img');
        
        if (this.selectedOption) {
            selectedElement.textContent = this.selectedOption.label;
            if (this.selectedOption.image) {
                selectedImage.src = this.selectedOption.image;
                selectedImage.style.display = 'block';
            } else {
                selectedImage.style.display = 'none';
            }
        } else {
            selectedElement.textContent = 'Seleccione una opción';
            selectedImage.style.display = 'none';
        }
    }

    setupEventListeners() {
        const selected = this.shadowRoot.querySelector('.selected');
        const dropdown = this.shadowRoot.querySelector('.dropdown');
        const searchInput = this.shadowRoot.querySelector('.search input');

        selected.addEventListener('click', () => {
            console.log("opendqwdas",dropdown)
            dropdown.classList.toggle('open');
        });

        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderOptions();
        });

/*         document.addEventListener('click', (e) => {
            console.log("click123123",e)
            if (!this.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        }); */
    }

    selectOption(option) {
        this.selectedOption = option;
        this.renderSelectedOption();
        this.shadowRoot.querySelector('.dropdown').classList.remove('open');
        this.dispatchEvent(new CustomEvent('change', { detail: option }));
    }
}

customElements.define('custom-select', CustomSelect);
class CustomMultiSelect extends HTMLElement {
  constructor(config) {
      super();
      this.attachShadow({ mode: 'open' });
      this.options = [];
      this.selectedOptions = [];
      this.searchTerm = '';
      this.render();
      this.config = config;
      this.selectlabel = "Seleccione opciones";
  }

  connectedCallback() {
      this.setupEventListeners();
  }

  // Getter para la propiedad 'value'
  get value() {
      return this.selectedOptions.map(opt => opt.value);
  }

  // Setter para la propiedad 'value'
  set value(newValues) {
      if (Array.isArray(newValues)) {
          this.setValues(newValues);
      }
  }

  setOptions(options) {
      this.options = options;
      this.renderOptions();
  }

  setValues(values) {
      // Actualizar las opciones seleccionadas
      this.selectedOptions = this.options.filter(opt => values.includes(opt.value));
      
      // Actualizar la visualización de las opciones seleccionadas en el área superior
      this.renderSelectedOptions();
      
      // Actualizar los checkboxes en el dropdown
      this.updateCheckboxes();

      // Disparar el evento de cambio
      this.dispatchEvent(new CustomEvent('change', { 
          detail: {
              values: this.value,
              selectedOptions: this.selectedOptions
          }
      }));
  }

  updateCheckboxes() {
      // Obtener todas las opciones en el dropdown
      const optionElements = this.shadowRoot.querySelectorAll('.option');
      
      // Actualizar cada opción
      optionElements.forEach(optionElement => {
          const label = optionElement.querySelector('span').textContent;
          const isSelected = this.selectedOptions.some(opt => opt.label === label);
          
          if (isSelected) {
              optionElement.classList.add('selected');
          } else {
              optionElement.classList.remove('selected');
          }
      });
  }

  render() {
      this.shadowRoot.innerHTML = `
      <style>
          :host {
              --background-color: #1a1a1a;
              --text-color: #e0e0e0;
              --border-color: #333;
              --option-hover-bg: #2a2a2a;
              --input-bg: #252525;
              --input-text-color: #e0e0e0;
              --chip-bg: #333;
              --chip-text: #fff;
              --chip-hover: #444;
              --scrollbar-thumb: #444;
              --scrollbar-track: #1a1a1a;
              --checkbox-checked-bg: #4a4a4a;
              --checkbox-border: #555;
          }

          .select-wrapper {
              position: relative;
              width: 300px;
              font-family: system-ui, -apple-system, sans-serif;
          }

          .selected-area {
              min-height: 44px;
              padding: 8px;
              border: 1px solid var(--border-color);
              background-color: var(--background-color);
              color: var(--text-color);
              cursor: pointer;
              border-radius: 4px;
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              align-items: center;
          }

          .chip {
              background-color: var(--chip-bg);
              color: var(--chip-text);
              padding: 4px 8px;
              border-radius: 16px;
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 14px;
          }

          .chip img {
              width: 16px;
              height: 16px;
              border-radius: 50%;
          }

          .chip .remove {
              cursor: pointer;
              margin-left: 4px;
              opacity: 0.7;
          }

          .chip .remove:hover {
              opacity: 1;
          }

          .placeholder {
              color: #666;
          }

          .dropdown {
              display: none;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              margin-top: 4px;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              background: var(--background-color);
              z-index: 1000;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          }

          .dropdown.open {
              display: block;
          }

          .search {
              padding: 8px;
              border-bottom: 1px solid var(--border-color);
          }

          .search input {
              width: 100%;
              padding: 8px;
              background-color: var(--input-bg);
              color: var(--input-text-color);
              border: 1px solid var(--border-color);
              border-radius: 4px;
              outline: none;
          }

          .search input:focus {
              border-color: #505050;
          }

          .options {
              max-height: 200px;
              overflow-y: auto;
              padding: 4px 0;
          }

          .options::-webkit-scrollbar {
              width: 8px;
          }

          .options::-webkit-scrollbar-thumb {
              background: var(--scrollbar-thumb);
              border-radius: 4px;
          }

          .options::-webkit-scrollbar-track {
              background: var(--scrollbar-track);
          }

          .option {
              display: flex;
              align-items: center;
              padding: 8px 12px;
              cursor: pointer;
              color: var(--text-color);
              gap: 8px;
          }

          .option:hover {
              background-color: var(--option-hover-bg);
          }

          .option.selected {
              background-color: var(--checkbox-checked-bg);
          }

          .option img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
          }

          .checkbox {
              width: 16px;
              height: 16px;
              border: 2px solid var(--checkbox-border);
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background-color 0.2s;
          }

          .option.selected .checkbox {
              background-color: var(--chip-bg);
              border-color: var(--chip-bg);
          }

          .option.selected .checkbox::after {
              content: "✓";
              color: var(--chip-text);
              font-size: 12px;
          }
      </style>

      <div class="select-wrapper">
          <div class="selected-area">
              <span class="placeholder">${this.selectlabel}</span>
          </div>
          <div class="dropdown">
              <div class="search">
                  <input type="text" placeholder="Buscar...">
              </div>
              <div class="options"></div>
          </div>
      </div>`;
  }

  renderOptions() {
      const optionsContainer = this.shadowRoot.querySelector('.options');
      optionsContainer.innerHTML = '';
      
      this.options
          .filter(option => option.label.toLowerCase().includes(this.searchTerm.toLowerCase()))
          .forEach(option => {
              const optionElement = document.createElement('div');
              optionElement.classList.add('option');
              if (this.selectedOptions.some(selected => selected.value === option.value)) {
                  optionElement.classList.add('selected');
              }
              
              optionElement.innerHTML = `
                  <div class="checkbox"></div>
                  ${option.image ? `<img src="${option.image}" alt="${option.label}">` : ''}
                  <span>${option.label}</span>
              `;
              
              optionElement.addEventListener('click', () => this.toggleOption(option));
              optionsContainer.appendChild(optionElement);
          });
  }

  renderSelectedOptions() {
      const selectedArea = this.shadowRoot.querySelector('.selected-area');
      const placeholder = selectedArea.querySelector('.placeholder');
      
      // Eliminar los chips existentes
      const existingChips = selectedArea.querySelectorAll('.chip');
      existingChips.forEach(chip => chip.remove());

      if (this.selectedOptions.length === 0) {
          placeholder.style.display = 'block';
      } else {
          placeholder.style.display = 'none';
          
          this.selectedOptions.forEach(option => {
              const chip = document.createElement('div');
              chip.classList.add('chip');
              chip.innerHTML = `
                  ${option.image ? `<img src="${option.image}" alt="${option.label}">` : ''}
                  <span>${option.label}</span>
                  <span class="remove">✕</span>
              `;
              
              chip.querySelector('.remove').addEventListener('click', (e) => {
                  e.stopPropagation();
                  this.toggleOption(option);
              });
              
              selectedArea.appendChild(chip);
          });
      }
  }

  setupEventListeners() {
      const selectedArea = this.shadowRoot.querySelector('.selected-area');
      const dropdown = this.shadowRoot.querySelector('.dropdown');
      const searchInput = this.shadowRoot.querySelector('.search input');

      selectedArea.addEventListener('click', () => {
          dropdown.classList.toggle('open');
          if (dropdown.classList.contains('open')) {
              searchInput.focus();
          }
      });

      searchInput.addEventListener('input', (e) => {
          this.searchTerm = e.target.value;
          this.renderOptions();
      });

      document.addEventListener('click', (e) => {
          if (!this.contains(e.target)) {
              dropdown.classList.remove('open');
          }
      });
  }

  toggleOption(option) {
      const index = this.selectedOptions.findIndex(selected => selected.value === option.value);
      
      if (index === -1) {
          this.selectedOptions.push(option);
      } else {
          this.selectedOptions.splice(index, 1);
      }
      
      this.renderSelectedOptions();
      this.renderOptions();
      this.dispatchEvent(new CustomEvent('change', { 
          detail: {
              values: this.value,
              selectedOptions: this.selectedOptions
          }
      }));
  }
}

customElements.define('custom-multi-select', CustomMultiSelect);
class UserProfile extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
      // Singleton instance
      if (!UserProfile.instance) {
          UserProfile.instance = this;
          
          this.state = {
              connected: false,
              username: '',
              imageUrl: 'https://via.placeholder.com/100/1a1a2e',
              language: 'es',
              connectionStatus: 'offline' // nuevo: 'offline', 'online', 'away', 'busy'
          };

          this.translations = {
              es: {
                  connect: 'Conectar',
                  disconnect: 'Desconectar',
                  placeholder: 'Ingresa tu nombre',
                  status: {
                      offline: 'Desconectado',
                      online: 'En línea',
                      away: 'Ausente',
                      busy: 'Ocupado'
                  }
              },
              en: {
                  connect: 'Connect',
                  disconnect: 'Disconnect',
                  placeholder: 'Enter your name',
                  status: {
                      offline: 'Offline',
                      online: 'Online',
                      away: 'Away',
                      busy: 'Busy'
                  }
              },
              fr: {
                  connect: 'Se connecter',
                  disconnect: 'Se déconnecter',
                  placeholder: 'Entrez votre nom',
                  status: {
                      offline: 'Hors ligne',
                      online: 'En ligne',
                      away: 'Absent',
                      busy: 'Occupé'
                  }
              },
              pt: {
                  connect: 'Conectar',
                  disconnect: 'Desconectar',
                  placeholder: 'Insira seu nome',
                  status: {
                      offline: 'Offline',
                      online: 'Online',
                      away: 'Ausente',
                      busy: 'Ocupado'
                  }
                },
          };
          
          this.loadFromLocalStorage();
      }

      // Registro de instancias
      if (!UserProfile.instances) {
          UserProfile.instances = new Set();
      }
      UserProfile.instances.add(this);

      // Cada instancia mantiene sus propios listeners
      this.activeListeners = new Set();

      this.render();
      return this;
  }

    static get observedAttributes() {
        return ['minimal'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'minimal') {
            this.render();
        }
    }

    get isMinimal() {
        return this.hasAttribute('minimal');
    }

    static updateAllInstances() {
        UserProfile.instances.forEach(instance => {
            instance.render();
        });
    }

    getStyles() {
        // ... (mismos estilos que antes) ...
        return `
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    background-color: #1a1a2e;
                    border-radius: 8px;
                    color: #fff;
                }
                 .status-indicator {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid #1a1a2e;
                    transition: all 0.3s ease;
                }

                .status-indicator[data-status="offline"] {
                    background-color: #808080;
                }

                .status-indicator[data-status="online"] {
                    background-color: #4CAF50;
                }

                .status-indicator[data-status="away"] {
                    background-color: #FFC107;
                }

                .status-indicator[data-status="busy"] {
                    background-color: #f44336;
                }
                /* Estilos para modo minimal */
                :host([minimal]) .container {
                    flex-direction: row;
                    padding: 8px;
                    gap: 10px;
                    background-color: transparent;
                }

                .profile-image {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #4d7cff;
                    box-shadow: 0 0 15px rgba(77, 124, 255, 0.3);
                    transition: all 0.3s ease;
                }

                :host([minimal]) .profile-image {
                    width: 36px;
                    height: 36px;
                    border-width: 2px;
                }
                :host([minimal]) .status-indicator {
                    width: 12px;
                    height: 12px;
                    bottom: 0;
                    right: 0;
                    border-width: 1px;
                }

                .profile-image:hover {
                    transform: scale(1.05);
                    border-color: #4d9cff;
                }

                input {
                    width: 100%;
                    padding: 12px;
                    background-color: #162447;
                    border: 2px solid #4d9cff;
                    border-radius: 8px;
                    color: #fff;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                :host([minimal]) input {
                    padding: 6px;
                }

                input:focus {
                    outline: none;
                    border-color: #e94560;
                    box-shadow: 0 0 10px rgba(233, 69, 96, 0.2);
                }

                input::placeholder {
                    color: #8a8a9e;
                }

                input:disabled {
                    background-color: #1f1f3d;
                    border-color: #404060;
                    cursor: not-allowed;
                }

                button {
                    width: 100%;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #4d7cff 0%, #3b5998 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                :host([minimal]) button {
                    width: auto;
                    padding: 6px 12px;
                    font-size: 12px;
                }

                button:hover {
                    background: linear-gradient(135deg, #5a88ff 0%, #4866ab 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(77, 124, 255, 0.3);
                }

                button:active {
                    transform: translateY(0);
                }

                button.connected {
                    background: linear-gradient(135deg, #e94560 0%, #c23152 100%);
                }

                button.connected:hover {
                    background: linear-gradient(135deg, #f25672 0%, #d4405f 100%);
                }
            .profile-wrapper {
                    position: relative;
                    display: inline-block;
                }
            </style>
        `;
    }

    render() {
      const state = UserProfile.instance.state;
      const currentTranslations = UserProfile.instance.translations[state.language];
      
      this.shadowRoot.innerHTML = `
          ${this.getStyles()}
          <div class="container ${state.connected ? 'connected' : ''}">
              <div class="profile-wrapper">
                  <img 
                      class="profile-image" 
                      src="${state.imageUrl}"
                      alt="Profile"
                  />
                  <div 
                      class="status-indicator" 
                      data-status="${state.connectionStatus}"
                      title="${currentTranslations.status[state.connectionStatus]}"
                  ></div>
              </div>
              <input 
                  type="text"
                  placeholder="${currentTranslations.placeholder}"
                  value="${state.username}"
                  ${state.connected ? 'disabled' : ''}
              />
              <button class="${state.connected ? 'connected' : ''}">
                  ${state.connected ? currentTranslations.disconnect : currentTranslations.connect}
              </button>
          </div>
      `;

      this.setupEventListeners();
  }
    setupEventListeners() {
        // Limpia los listeners anteriores de esta instancia
        this.activeListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.activeListeners.clear();

        const button = this.shadowRoot.querySelector('button');
        const input = this.shadowRoot.querySelector('input');

        // Los handlers usan la instancia singleton para la lógica
        const buttonHandler = () => {
            if (UserProfile.instance.state.connected) {
                UserProfile.instance.disconnect();
            } else if (input.value.trim()) {
                UserProfile.instance.connect(input.value);
            }
        };

        const inputHandler = (e) => {
            UserProfile.instance.state.username = e.target.value;
        };

        button.addEventListener('click', buttonHandler);
        input.addEventListener('input', inputHandler);

        // Guarda las referencias para limpieza
        this.activeListeners.add({ element: button, type: 'click', handler: buttonHandler });
        this.activeListeners.add({ element: input, type: 'input', handler: inputHandler });
    }

    loadFromLocalStorage() {
        const savedState = localStorage.getItem('userProfileState');
        if (savedState) {
            this.state = { ...this.state, ...JSON.parse(savedState) };
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('userProfileState', JSON.stringify(this.state));
    }

    setConnectionStatus(status) {
      if (this !== UserProfile.instance) return;
      
      if (['offline', 'online', 'away', 'busy'].includes(status)) {
          this.state.connectionStatus = status;
          this.saveToLocalStorage();
          UserProfile.updateAllInstances();
          
          this.dispatchEvent(new CustomEvent('connectionStatusChanged', { 
              detail: { status: this.state.connectionStatus }
          }));
      }
  }
    connect(username) {
      if (this !== UserProfile.instance) return;
      
      this.state.connected = true;
      this.state.username = username;
      this.state.imageUrl = 'https://via.placeholder.com/100/4d7cff';
      this.state.connectionStatus = 'online'; // Automáticamente establece online al conectar
      this.saveToLocalStorage();
      UserProfile.updateAllInstances();
      this.dispatchEvent(new CustomEvent('userConnected', { 
          detail: { username: this.state.username }
      }));
  }


    disconnect() {
      if (this !== UserProfile.instance) return;
      
      this.state.connected = false;
      this.state.imageUrl = 'https://via.placeholder.com/100/1a1a2e';
      this.state.username = '';
      this.state.connectionStatus = 'offline'; // Automáticamente establece offline al desconectar
      this.saveToLocalStorage();
      UserProfile.updateAllInstances();
      this.dispatchEvent(new CustomEvent('userDisconnected'));
  }


    setLanguage(lang) {
        if (this !== UserProfile.instance) return;
        
        if (this.translations[lang]) {
            this.state.language = lang;
            this.saveToLocalStorage();
            UserProfile.updateAllInstances();
        }
    }

    setProfileImage(url) {
        if (this !== UserProfile.instance) return;
        
        this.state.imageUrl = url;
        this.saveToLocalStorage();
        UserProfile.updateAllInstances();
    }

    disconnectedCallback() {
        UserProfile.instances.delete(this);
        
        // Limpia los listeners cuando se remueve el elemento
        this.activeListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        
        if (this === UserProfile.instance) {
            UserProfile.instance = null;
        }
    }
}

customElements.define('user-profile', UserProfile);
class ResponsiveNavSidebar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      this.shadowRoot.innerHTML = `
          <style>
          :host {
            --sidebar-width: 250px;
            --sidebar-bg: #333;
            --nav-bg: #333;
            --text-color: #fff;
            --nav-height: 60px;
            --hover-bg: rgba(255, 255, 255, 0.1);
            --active-bg: #555;
          }
            .container {
              height: 100%;
            }
              .menu-item {
                .active {
                background-color: var(--active-bg);
                color: var(--active-color);
              }
              }
            /* Estilos para navegación superior fija */
            .top-nav {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              height: var(--nav-height);
              background: var(--nav-bg);
              color: var(--text-color);
              z-index: 888;
              padding: auto;
            }
    
            .top-nav-content {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
    
            /* Contenedor de items base en el navbar */
            .nav-base-items {
              display: flex;
              align-items: center;
              gap: 20px;
            }
    
            /* Contenedor de items base en el sidebar */
            .sidebar-base-items {
              margin-bottom: 15px;
            }
    
            /* Estilos para el sidebar */
            .sidebar {
              position: fixed;
              left: 0;
              top: 0;
              width: var(--sidebar-width);
              height: 100vh;
              background: var(--sidebar-bg);
              color: var(--text-color);
              overflow-y: auto;
              z-index: 999;
            }
    
            .sidebar-content {
              padding: 20px;
            }
    
            .menu-btn {
              display: none;
              background: none;
              border: none;
              color: var(--text-color);
              font-size: 24px;
              cursor: pointer;
              padding: 10px;
            }
    
            .content {
              margin-left: var(--sidebar-width);
              padding: 20px;
            }
    
            /* Overlay para cerrar el menú en móvil */
            .overlay {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 800;
            }
    
            /* Estilos para elementos del menú */
            ::slotted(.menu-item) {
              padding: 12px 15px;
              display: flex;
              align-items: center;
              gap: 10px;
              cursor: pointer;
              transition: background-color 0.2s;
              border-radius: 4px;
              margin: 5px 0;
            }
    
            ::slotted(.menu-item:hover) {
              background: var(--hover-bg);
            }
    
            ::slotted(.base-item) {
              padding: 12px 15px;
              display: flex;
              align-items: center;
              gap: 10px;
              cursor: pointer;
              transition: background-color 0.2s;
              border-radius: 4px;
              margin: 5px 0;
            }
    
            ::slotted(.base-item:hover) {
              background: var(--hover-bg);
            }
    
            /* Media query para modo responsive */
            @media (max-width: 768px) {
              .top-nav {
                display: flex;
              }
    
              .content {
                margin-left: 0;
                padding-top: calc(var(--nav-height) + 20px);
              }
    
              .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
              }
    
              .sidebar.active {
                transform: translateX(0);
              }
    
              .menu-btn {
                display: block;
              }
    
              .overlay.active {
                display: block;
              }
    
              /* En móvil, ocultamos los items base del sidebar */
              .sidebar-base-items {
                display: none;
              }
    
              /* Y mostramos los del navbar */
              .nav-base-items {
                display: flex;
              }
            }
    
            @media (min-width: 769px) {
              /* En desktop, ocultamos los items base del navbar */
              .nav-base-items {
                display: none;
              }
    
              /* Y mostramos los del sidebar */
              .sidebar-base-items {
                display: block;
              }
            }
          </style>
    
        
        <div class="container">
          <nav class="top-nav">
            <button class="menu-btn">☰</button>
            <div class="nav-base-items">
              <slot name="nav-base-items"></slot>
            </div>
          </nav>
  
          <div class="overlay"></div>
  
          <div class="sidebar">
            <div class="sidebar-base-items">
              <slot name="sidebar-base-items"></slot>
            </div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">
            <slot name="menu-items"></slot>
          </div>
  
          <div class="content">
            <slot name="main-content"></slot>
          </div>
        </div>
      `;
  
      this.menuBtn = this.shadowRoot.querySelector('.menu-btn');
      this.sidebar = this.shadowRoot.querySelector('.sidebar');
      this.overlay = this.shadowRoot.querySelector('.overlay');
  
      this.menuBtn.addEventListener('click', () => this.toggleMenu());
      this.overlay.addEventListener('click', () => this.closeMenu());
    }
  
    toggleMenu() {
      this.sidebar.classList.toggle('active');
      this.overlay.classList.toggle('active');
    }
  
    closeMenu() {
      this.sidebar.classList.remove('active');
      this.overlay.classList.remove('active');
    }
  }
  
  customElements.define('responsive-nav-sidebar', ResponsiveNavSidebar);
  class TranslateText extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.updateContent();
      document.addEventListener('languageChanged', () => this.updateContent());
    }
  
    updateContent() {
      const key = this.getAttribute('key');
      const text = TranslateText.translations[TranslateText.currentLanguage][key] || key;
      this.shadowRoot.textContent = text;
    }
  }
  
  // Definición del componente LanguageSelector mejorado
  class LanguageSelector extends HTMLElement {
    static instances = new Set();
    static STORAGE_KEY = 'selectedLanguage';
    
    // Definición de las etiquetas de idioma
    static languageLabels = {
      es: 'Español',
      en: 'English',
      fr: 'Français',
      pt: 'Português',
    };
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['id'];
    }
  
    connectedCallback() {
      LanguageSelector.instances.add(this);
      
      // Cargar el idioma guardado o usar el predeterminado
      TranslateText.currentLanguage = this.loadStoredLanguage();
      
      this.render();
      
      const select = this.shadowRoot.querySelector('select');
      
      // Establecer el valor inicial desde localStorage
      select.value = TranslateText.currentLanguage;
      
      // Agregar event listener para el cambio
      select.addEventListener('change', (e) => {
        const newLanguage = e.target.value;
        
        // Guardar en localStorage
        this.saveLanguage(newLanguage);
        localStorage.setItem('selectedLanguage', newLanguage);
        // Actualizar todos los selectores
        LanguageSelector.updateAllSelectors(newLanguage, this);
        
        // Actualizar el idioma global
        TranslateText.currentLanguage = newLanguage;
        
        // Disparar evento global de cambio de idioma
        document.dispatchEvent(new Event('languageChanged'));
        
        // Disparar evento personalizado en el selector
        this.dispatchEvent(new CustomEvent('languageChange', {
          detail: {
            language: newLanguage,
            selectorId: this.getAttribute('id'),
            label: LanguageSelector.languageLabels[newLanguage]
          },
          bubbles: true,
          composed: true
        }));
      });
    }
  
    disconnectedCallback() {
      LanguageSelector.instances.delete(this);
    }
  
    // Método para guardar el idioma en localStorage
    saveLanguage(language) {
      try {
        localStorage.setItem(LanguageSelector.STORAGE_KEY, language);
      } catch (e) {
        console.warn('No se pudo guardar el idioma en localStorage:', e);
      }
    }
  
    // Método para cargar el idioma desde localStorage
    loadStoredLanguage() {
      try {
        const storedLanguage = localStorage.getItem(LanguageSelector.STORAGE_KEY);
        return storedLanguage || TranslateText.currentLanguage; // Retorna el almacenado o el predeterminado
      } catch (e) {
        console.warn('No se pudo cargar el idioma desde localStorage:', e);
        return TranslateText.currentLanguage;
      }
    }
  
    static updateAllSelectors(newLanguage, exclude = null) {
      LanguageSelector.instances.forEach(selector => {
        if (selector !== exclude) {
          selector.shadowRoot.querySelector('select').value = newLanguage;
        }
      });
    }
  
    // Método público para obtener el idioma actual
    getValue() {
      return this.shadowRoot.querySelector('select').value;
    }
  
    // Método público para obtener la etiqueta del idioma actual
    getLanguageLabel() {
      const currentLanguage = this.getValue();
      return LanguageSelector.languageLabels[currentLanguage];
    }
  
    render() {
      const style = `
        <style>
          select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 14px;
          }
        </style>
      `;
  
      const currentId = this.getAttribute('id');
      const selectId = currentId ? `id="${currentId}-select"` : '';
  
      this.shadowRoot.innerHTML = `
        ${style}
        <select ${selectId}>
          ${Object.entries(LanguageSelector.languageLabels).map(([code, label]) => 
            `<option value="${code}">${label}</option>`
          ).join('')}
        </select>
      `;
    }
  }
  
  // Configuración global
  const currentLanguage = localStorage.getItem('selectedLanguage') || navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0] || 'es';
  TranslateText.currentLanguage = currentLanguage;
  if (!localStorage.getItem('selectedLanguage')) localStorage.setItem('selectedLanguage',currentLanguage);
  TranslateText.translations = {
    es: {
      hello: 'Hola',
      world: 'Mundo',
      selectlang: 'Seleccionar idioma',
      currentLang: 'Idioma actual',
      selectedLanguage: 'Idioma seleccionado',
      config: 'configuracion',
      configuration: 'Configuración',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      save: 'Guardar',
      close: 'Cerrar',
      delete: 'Eliminar',
      add: 'Agregar',
      edit: 'Editar',
      remove: 'Eliminar',
      select: 'Seleccionar',
      home: 'inicio',
      addaction: 'Añadir acción',
      addevent: 'Añadir evento',
      actiontable: 'Tabla de acciones',
      eventtable: 'Tabla de eventos',
      voicesettings: 'Configuración de voz',
      selectvoice: 'Seleccionar voz',
      allowedusers: 'Usuarios permitidos',
      commenttypes: 'Tipos de comentarios',
      commenttypes1: 'cualquier comentario',
      commenttypes2: 'comentarios que empiezan con punto (.)',
      commenttypes3: 'comentarios que empiezan con barra (/)',
      commenttypes4: 'comandos que empiezan con comando:',
      filterwords: 'Filtrar palabras',
    },
    en: {
      hello: 'Hello',
      world: 'World',
      selectlang: 'Select language',
      currentLang: 'Current language',
      selectedLanguage: 'Selected language',
      configuration: 'Configuration',
      config: 'configuration',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      delete: 'Delete',
      add: 'Add',
      edit: 'Edit',
      remove: 'Remove',
      select: 'Select',
      home: 'home',
      addaction: 'Add action',
      addevent: 'Add event',
      actiontable: 'Action table',
      eventtable: 'Event table',
      voicesettings: 'Voice settings',
      selectvoice: 'Select voice',
      allowedusers: 'Allowed users',
      commenttypes: 'Comment types',
      commenttypes1: 'Any comment',
      commenttypes2: 'Comments starting with dot (.)',
      commenttypes3: 'Comments starting with slash (/)',
      commenttypes4: 'Comments starting with Command:',
      filterwords: 'Filter words',
    },
    fr: {
      hello: 'Bonjour',
      world: 'Monde',
      selectlang: 'Sélectionner la langue',
      currentLang: 'Langue actuelle',
      selectedLanguage: 'Langue sélectionnée',
      configuration: 'Configuration',
      config: 'configurer',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      close: 'Fermer',
      delete: 'Supprimer',
      add: 'Ajouter',
      edit: 'Modifier le',
      remove: 'Supprimer',
      select: 'Sélectionner',
      home: 'Accueil',
      addaction: 'Ajouter action',
      addevent: 'Ajouter événement',
      actiontable: 'Tableau d\'actions',
      eventtable: 'Tableau d\'événements',
      voicesettings: 'Paramètres de la voix',
      selectvoice: 'Sélectionner la voix',
      allowedusers: 'Utilisateurs autorisés',
      commenttypes: 'Types de commentaires',
      commenttypes1: 'N\'importe quel commentaire',
      commenttypes2: 'Commentaires commençant par un point (.)',
      commenttypes3: 'Commentaires commençant par un barre (/)',
      commenttypes4: 'Commentaires commençant par un commande :',
      filterwords: 'Filtrer les mots',
    },
    pt: {
      show: 'Mostrar',
      activate: 'ativar',
      texttoread: 'texto a ler',
      addelement:"Insira um elemento...",
      connect: 'Conectar',
      close: 'Fechar',
      selectlang: 'Selecionar idioma',
      currentLang: 'Idioma atual',
      selectedLanguage: 'Idioma selecionado',
      configuration: 'Configuração',
      config: 'configuração',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      savechanges: 'Salvar alterações',
      save: 'Salvar',
      close: 'Fechar',
      delete: 'Excluir',
      add: 'Adicionar',
      edit: 'Editar',
      remove: 'Remover',
      select: 'Selecionar',
      home: 'home',
      Actions: 'Acções',
      Events: 'Eventos',
      addaction: 'Adicionar ação',
      addevent: 'Adicionar evento',
      actiontable: 'Tabela de ações',
      eventtable: 'Tabela de eventos',
      voicesettings: 'Configurações de voz',
      selectvoice: 'Selecionar voz',
      allowedusers: 'Usuários permitidos',
      commenttypes: 'Tipos de comentários',
      commenttypes1: 'Qualquer comentário',
      commenttypes2: 'Comentários que começam com ponto (.)',
      commenttypes3: 'Comentários que começam com barra (/)',
      commenttypes4: 'Comentários que começam com comando:',
      filterwords: 'Filtrar palavras',
    },
    
  };
  
  // Registro de los componentes
  customElements.define('translate-text', TranslateText);
  customElements.define('language-selector', LanguageSelector);
  class CustomModal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.onOpenCallback = null;
        this.onCloseCallback = null;
        
        // Crear un shadow DOM para evitar conflictos de estilos
        this.attachShadow({ mode: 'open' });
        
        // Crear estructura base del modal
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
       :host {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            /* Agregamos la transición base */
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        /* Cuando está visible */
        :host([visible]) {
            opacity: 1;
        }
        .modal-content {
            background: #1c1c1c;
            padding: 20px;
            border-radius: 5px;
            position: relative;
            min-width: 300px;
            opacity: 0;
        }
        :host([visible]) .modal-content {
            transform: scale(1);
            opacity: 1;
        }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: #dc3545;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    padding: 0;
                    border-radius: 25%;
                }
                .close-button:hover {
                    background-color: #c82333;
                }
                .modal-body {
                    margin-top: 20px;
                }
                /* Slot styling */
                ::slotted(*) {
                    max-width: 100%;
                }
            </style>
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;

        // Agregar la estructura del modal al shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Obtener referencias dentro del shadow DOM
        this.overlay = this.shadowRoot.querySelector('.modal-overlay');
        this.closeButton = this.shadowRoot.querySelector('.close-button');
        this.modalBody = this.shadowRoot.querySelector('.modal-body');
        
        this.setupEventListeners();
    }

    connectedCallback() {
        // No necesitamos hacer nada aquí ya que la estructura se crea en el constructor
    }

    setupEventListeners() {
        console.log("created modal 123123123123123")
        this.closeButton.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
    }

    open(onOpenCallback = null) {
        this.onOpenCallback = onOpenCallback;
        this.style.display = 'block';
        // Forzamos un reflow
        this.offsetHeight;
        this.setAttribute('visible', '');
        this.isOpen = true;
        
        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
    }

    close(onCloseCallback = null) {
        this.onCloseCallback = onCloseCallback;
        this.style.display = 'none';
        this.isOpen = false;
        this.removeAttribute('visible');
        // Esperamos a que termine la animación
        setTimeout(() => {
            this.style.display = 'none';
            this.isOpen = false;
            if (this.onCloseCallback) {
                this.onCloseCallback();
            }
        }, 300); // Mismo tiempo que la transición
    }

    // Método mejorado para agregar contenido
    appendChild(element) {
        // Asegurarse de que el elemento se agregue al light DOM
        super.appendChild(element);
    }

    // Método para limpiar y establecer nuevo contenido
    setContent(content) {
        // Limpiar el contenido actual
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        // Agregar el nuevo contenido
        if (typeof content === 'string') {
            const div = document.createElement('div');
            div.innerHTML = content;
            this.appendChild(div);
        } else if (content instanceof Node) {
            this.appendChild(content);
        }
    }

    getContentContainer() {
        return this;
    }
}

// Registrar el componente
customElements.define('custom-modal', CustomModal);
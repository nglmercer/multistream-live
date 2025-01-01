class toggleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['checked', 'disabled', 'label'];
    }

    connectedCallback() {
        this.render();
        const toggleSwitch = this.shadowRoot.querySelector('#toggleSwitch');
        toggleSwitch.addEventListener('change', () => {
            this.changeState(toggleSwitch);
            this.dispatchEvent(new CustomEvent('toggle-switch-change', {
                detail: {
                    checked: toggleSwitch.checked
                }
            }));
        });
    }

    // Cambia el estado del switch (checked / unchecked)
    changeState(toggleSwitch) {
        const toggleContainer = this.shadowRoot.querySelector('.toggle-container');
        if (toggleSwitch.checked) {
            toggleContainer.classList.add('active');
        } else {
            toggleContainer.classList.remove('active');
        }
    }

    // Obtiene los atributos del componente
    getAttributes() {
        const attributes = {
            checked: this.hasAttribute('checked'),
            disabled: this.hasAttribute('disabled'),
            label: this.getAttribute('label')
        };
        return attributes;
    }

    // Renderiza el componente con sus atributos
    render() {
        const { checked, disabled, label } = this.getAttributes();

        this.shadowRoot.innerHTML = `
        <style>
            .toggle-container {
                display: flex;
                align-items: center;
            }
        
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 25px;
            }
        
            .toggle-switch input {
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
                background-color: #555;
                transition: 0.3s;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 2, 34, 0.3);
            }
        
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                border-radius: 50%;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: 0.3s;
            }
        
            .toggle-switch input:checked + .slider {
                background-color: #4059ff;
                box-shadow: 0 0 10px rgba(64, 77, 255, 0.8);
            }
        
            .toggle-switch input:checked + .slider:before {
                transform: translateX(26px);
            }
        
            .toggle-container.active .toggle-switch input:checked + .slider {
                background-color:rgb(64, 147, 255);
            }
        </style>
        
        <div class="toggle-container">
            <label class="toggle-switch">
                <input type="checkbox" id="toggleSwitch" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                <span class="slider"></span>
            </label>
            <span>${label || 'Toggle'}</span>
        </div>
        `;
    }

    // Método para deshabilitar el checkbox
    disable() {
        const toggleSwitch = this.shadowRoot.querySelector('#toggleSwitch');
        toggleSwitch.disabled = true;
        this.setAttribute('disabled', 'true');
    }

    // Método para habilitar el checkbox
    enable() {
        const toggleSwitch = this.shadowRoot.querySelector('#toggleSwitch');
        toggleSwitch.disabled = false;
        this.removeAttribute('disabled');
    }

    // Método para cambiar el estado del checkbox a "false" (desmarcar)
    setChecked(checked) {
        const toggleSwitch = this.shadowRoot.querySelector('#toggleSwitch');
        toggleSwitch.checked = checked;
        if (checked) {
            this.setAttribute('checked', 'true');
        } else {
            this.removeAttribute('checked');
        }
    }
}

customElements.define('toggle-element', toggleComponent);


class ShortcutForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #121212;
          color: white;
          padding: 16px;
          border-radius: 8px;
          width: 300px;
        }

        h2 {
          text-align: center;
        }

        .shortcut-input {
          padding: 8px;
          margin: 8px 0;
          background-color: #333;
          color: white;
          border: 1px solid #555;
          border-radius: 4px;
        }

        .shortcut-input:focus {
          outline: none;
          border-color: #fff;
        }

        button {
          width: 48%;
          padding: 8px;
          margin: 8px 1%;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        #cancelBtn {
          background-color: #f44336;
        }

        #cancelBtn:hover {
          background-color: #e53935;
        }
      </style>

      <div class="shortcut-form">
        <h2>Add New Shortcut</h2>
        <input type="text" id="shortcutName" placeholder="Shortcut Name" class="shortcut-input"><br>
        <input type="text" id="shortcutKeys" placeholder="Click to record shortcut" readonly class="shortcut-input"><br>
        <button id="saveBtn">Save Shortcut</button>
        <button id="cancelBtn" style="display:none;">Cancel</button>
      </div>
    `;

    this.shortcutName = this.shadowRoot.getElementById('shortcutName');
    this.shortcutInput = this.shadowRoot.getElementById('shortcutKeys');
    this.saveBtn = this.shadowRoot.getElementById('saveBtn');
    this.cancelBtn = this.shadowRoot.getElementById('cancelBtn');

    this.activeKeys = new Set();
    this.currentShortcut = [];
    this.editingShortcutId = null;

    this.shortcutInput.addEventListener('focus', () => this.activeKeys.clear());
    this.shortcutInput.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.shortcutInput.addEventListener('keyup', (e) => this.onKeyUp(e));

    this.saveBtn.addEventListener('click', () => this.saveShortcut());
    this.cancelBtn.addEventListener('click', () => this.resetForm());
  }

  onKeyDown(e) {
    e.preventDefault();
    const key = e.key === ' ' ? 'Space' : e.key;
    if (!this.activeKeys.has(key)) {
      this.activeKeys.add(key);
    } else {
      this.activeKeys.delete(key);
    }
    this.updateShortcutDisplay();
  }

  onKeyUp(e) {
    e.preventDefault();
    if (this.activeKeys.size === 0) {
      this.registerCurrentGroup();
    }
  }

  updateShortcutDisplay() {
    const activeGroup = Array.from(this.activeKeys).join(' + ');
    this.shortcutInput.value = [...this.currentShortcut, activeGroup].filter(Boolean).join(' , ');
  }

  registerCurrentGroup() {
    const activeGroup = Array.from(this.activeKeys).sort().join(' + ');
    if (activeGroup) {
      this.currentShortcut.push(activeGroup);
    }
    this.updateShortcutDisplay();
  }

  saveShortcut() {
    if (this.shortcutInput.value) {
      this.dispatchEvent(new CustomEvent('save-shortcut', {
        detail: {
          name: this.shortcutName.value || this.shortcutInput.value,
          shortcut: Array.from(this.activeKeys),
          oldName: this.editingShortcutId
        }
      }));
      this.resetForm();
    }
  }

  resetForm() {
    this.shortcutName.value = '';
    this.shortcutInput.value = '';
    this.currentShortcut = [];
    this.activeKeys.clear();
    this.editingShortcutId = null;
    this.saveBtn.textContent = 'Save Shortcut';
    this.cancelBtn.style.display = 'none';
  }

  setShortcut({ name, shortcut, id }) {
    this.shortcutName.value = name || '';
    this.currentShortcut = shortcut || [];
    this.editingShortcutId = id || null;
    this.shortcutInput.value = this.currentShortcut.join(' , ');
    this.saveBtn.textContent = id ? 'Update Shortcut' : 'Save Shortcut';
    this.cancelBtn.style.display = id ? 'inline-block' : 'none';
  }
}

customElements.define('shortcut-form', ShortcutForm);

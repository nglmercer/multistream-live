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
    this.lastkey = null;
    this.shortcutInput.addEventListener('focus', () => this.activeKeys.clear());
    this.shortcutInput.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.shortcutInput.addEventListener('keyup', (e) => this.onKeyUp(e));

    this.saveBtn.addEventListener('click', () => this.saveShortcut());
    this.cancelBtn.addEventListener('click', () => this.resetForm());
  }

  onKeyDown(e) {
    e.preventDefault();
    const key = e.key === ' ' ? 'Space' : e.key;
    const specialKeys = ['Alt', 'Control', 'Shift', 'Meta'];

    if (specialKeys.includes(key) || this.specialKeys(this.activeKeys)) {
      this.activeKeys.add(key);
    } else {
      this.activeKeys.clear();
      this.activeKeys.add(key);
    }

    if (this.lastkey === key || this.activeKeys.has(this.lastkey)) {
      this.activeKeys.delete(key);
      this.lastkey = null;
    } else {
      this.lastkey = key;
    }
    
    this.updateShortcutDisplay();
  }

  specialKeys(set) {
    const specialKeys = ['Alt', 'Control', 'Shift', 'Meta'];
    return specialKeys.some(key => set.has(key));
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
    console.log("updateShortcutDisplay",this.shortcutInput.value, this.currentShortcut, this.activeKeys);
  }

  registerCurrentGroup() {
    const activeGroup = Array.from(this.activeKeys).sort().join(' + ');
    if (activeGroup && !this.currentShortcut.includes(activeGroup)) {
      this.currentShortcut.push(activeGroup);
    }
    this.updateShortcutDisplay();
  }

  saveShortcut() {
    if (this.shortcutInput.value) {
      const shortcutCombinations =  Array.from(this.activeKeys);
      this.dispatchEvent(new CustomEvent('save-shortcut', {
        detail: {
          id: this.editingShortcutId,
          name: this.shortcutName.value || this.shortcutInput.value,
          shortcut: shortcutCombinations,
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
    this.lastkey = null;
    this.saveBtn.textContent = 'Save Shortcut';
    this.cancelBtn.style.display = 'none';
  }

  setShortcut({ name, shortcut, id }) {
    this.shortcutName.value = name || '';
    // Ensure shortcut is properly formatted as an array of combinations
    this.currentShortcut = Array.isArray(shortcut) ? shortcut : [shortcut].filter(Boolean);
    this.editingShortcutId = id || null;
    this.shortcutInput.value = this.currentShortcut.join(' , ');
    this.saveBtn.textContent = id ? 'Update Shortcut' : 'Save Shortcut';
    this.cancelBtn.style.display = id ? 'inline-block' : 'none';
  }
}

customElements.define('shortcut-form', ShortcutForm);

class SearchTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [];
    this.actions = [];
    this.hiddenColumns = []; 
    this.hiddensearch = false;
  }
  static get observedAttributes() {
    return ['hidden-columns', 'hiddensearch'];
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const hiddenColumns = this.getAttribute('hidden-columns');
    const hiddensearch = this.getAttribute('hiddensearch');
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
                    border: 1px solid #ddd;

        }
        th, td {
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #111;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
        }
        button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 5px 10px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 12px;
          margin: 2px 2px;
          cursor: pointer;
        }
        .edit {
          background-color:rgb(76, 122, 175);
        }
        .edit:hover {
          background-color: #3d8ae5;
        }
        .delete {
          background-color: #f44336;
        }
          .delete:hover {
            background-color: #e53935;
          }
        .cancel {
          background-color: #f44336;
        }
        .hidden {
          display: none;
        }
        [hidden-column] {
          display: none;
        }
      </style>
      <input class="${hiddensearch ? 'hidden' : ''}" type="text" id="searchInput" placeholder="Buscar...">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Detalles</th>
            <th class="actions-header hidden">Acciones</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    `;
  }

  setHiddenColumns(columns) {
    this.hiddenColumns = columns;
    this.updateColumnVisibility();
  }
  sethiddensearch(value) {
    this.hiddensearch = value;
  }
  updateColumnVisibility() {
    const headers = this.shadowRoot.querySelectorAll('th');
    const rows = this.shadowRoot.querySelectorAll('tbody tr');

    headers.forEach((header, index) => {
      const isHidden = this.hiddenColumns.includes(this.getColumnName(index));
      if (isHidden) {
        header.setAttribute('hidden-column', '');
      } else {
        header.removeAttribute('hidden-column');
      }
    });

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        const isHidden = this.hiddenColumns.includes(this.getColumnName(index));
        if (isHidden) {
          cell.setAttribute('hidden-column', '');
        } else {
          cell.removeAttribute('hidden-column');
        }
      });
    });
  }

  getColumnName(index) {
    switch(index) {
      case 0: return 'id';
      case 1: return 'name';
      case 2: return 'details';
      case 3: return 'actions';
      default: return '';
    }
  }

  // Rest of the existing methods remain the same
  setActions(actions) {
    this.actions = actions;
    const actionsHeader = this.shadowRoot.querySelector('.actions-header');
    actionsHeader.classList.toggle('hidden', this.actions.length === 0);
    this.renderTable();
  }

  setupEventListeners() {
    const searchInput = this.shadowRoot.getElementById('searchInput');
    searchInput.addEventListener('input', () => this.filterTable(searchInput.value));
  }

  setData(data) {
    this.data = data;
    this.renderTable();
  }

  renderTable() {
    const tableBody = this.shadowRoot.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    this.data.forEach(item => {
      const row = document.createElement('tr');
      
      let html = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${this.renderDetails(item)}</td>
      `;

      if (this.actions.length > 0) {
        html += '<td class="actions-cell">' + 
          this.actions.map(action => `
            <button data-action="${action.name}" class="${action.name}">${action.label}</button>
          `).join('') + 
        '</td>';
      }

      row.innerHTML = html;
      
      if (this.actions.length > 0) {
        const buttons = row.querySelectorAll('button');
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            const actionName = button.dataset.action;
            const action = this.actions.find(a => a.name === actionName);
            if (action) {
              this.emitActionEvent(actionName, item);
            }
          });
        });
      }

      tableBody.appendChild(row);
    });
    this.updateColumnVisibility();
  }

  renderDetails(item) {
    const details = Object.entries(item)
      .filter(([key]) => !['id', 'name'].includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    return details;
  }

  filterTable(searchTerm) {
    const filteredData = this.data.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    this.renderFilteredTable(filteredData);
  }

  renderFilteredTable(filteredData) {
    const tableBody = this.shadowRoot.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    filteredData.forEach(item => {
      const row = document.createElement('tr');
      
      let html = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${this.renderDetails(item)}</td>
      `;

      if (this.actions.length > 0) {
        html += '<td class="actions-cell">' + 
          this.actions.map(action => `
            <button data-action="${action.name}">${action.label}</button>
          `).join('') + 
        '</td>';
      }

      row.innerHTML = html;
      
      if (this.actions.length > 0) {
        const buttons = row.querySelectorAll('button');
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            const actionName = button.dataset.action;
            const action = this.actions.find(a => a.name === actionName);
            if (action && action.handler) {
              this.emitActionEvent(actionName, item);
            }
          });
        });
      }

      tableBody.appendChild(row);
    });
    this.updateColumnVisibility();
  }

  emitActionEvent(actionName, item) {
    const event = new CustomEvent('action-triggered', {
      detail: {
        action: actionName,
        item: item
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define('search-table', SearchTable);
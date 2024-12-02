// import en el lado del cliente... html
// Define el componente personalizado
class ModalSelector extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.selectedValues = []; // Para múltiples valores
      this.selectedLabels = [];
      this._hiddenInput = null; // Input oculto para FormData
      this.options = []; // Opciones para el modal
      this.multiple = false; // Modo de selección múltiple

      const template = document.createElement('template');
      template.innerHTML = /*html*/ `
          <style>
              .input-wrapper {
                  position: relative;
                  width: 100%;
              }
              input {
                  box-sizing: content-box;
                  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
                  border: 1px solid #e2e8f0;
                  border-radius: 0.375rem;
                  outline: none;
                  background: white;
                  cursor: pointer;
              }
              input:focus {
                  border-color: #3b82f6;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
              }
              .toggle-btn {
                  position: absolute;
                  right: 0.5rem;
                  top: 50%;
                  transform: translateY(-50%);
                  padding: 0.25rem;
                  background: none;
                  border: none;
                  cursor: pointer;
                  color: #6b7280;
              }
              ::slotted(input[type="hidden"]) {
                  display: none;
              }
              .option {
                  padding: 0.5rem;
                  cursor: pointer;
                  border: 1px solid #e2e8f0;
                  margin-bottom: 0.5rem;
                  border-radius: 0.375rem;
                  background: white;
              }
              .option.selected {
                  background: #3b82f6;
                  color: white;
              }
              .confirm-btn {
                  padding: 0.5rem 1rem;
                  background: #3b82f6;
                  color: white;
                  border: none;
                  border-radius: 0.375rem;
                  cursor: pointer;
              }
          </style>
          <div class="input-wrapper">
              <slot></slot>
              <input type="text" readonly placeholder="Seleccione valores">
              <button class="toggle-btn">▼</button>
          </div>
      `;

      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.input = this.shadowRoot.querySelector('input[type="text"]');
      this.toggleBtn = this.shadowRoot.querySelector('.toggle-btn');

      this.setupEventListeners();
  }

  connectedCallback() {
      if (!this._hiddenInput) {
          this._hiddenInput = document.createElement('input');
          this._hiddenInput.type = 'hidden';
          this._hiddenInput.name = this.getAttribute('name') || '';
          this.appendChild(this._hiddenInput);
      }

      const initialValues = this.getAttribute('value');
      if (initialValues) {
          const values = initialValues.split(',');
          this.setValues(values, values);
      }

      this.multiple = this.hasAttribute('multiple');
  }

  static get observedAttributes() {
      return ['name', 'value', 'multiple'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'name' && this._hiddenInput) {
          this._hiddenInput.name = newValue;
      }
      if (name === 'value' && newValue !== oldValue) {
          const values = newValue.split(',');
          this.setValues(values, values);
      }
      if (name === 'multiple') {
          this.multiple = newValue !== null;
      }
  }

  setValues(values, labels) {
      this.selectedValues = values;
      this.selectedLabels = labels;
      this.input.value = labels.join(', ');
      if (this._hiddenInput) {
          this._hiddenInput.value = values.join(',');
      }

      this.dispatchEvent(new CustomEvent('change', {
          detail: { values, labels },
          bubbles: true,
      }));

      this.dispatchEvent(new Event('input', { bubbles: true }));
  }

  setupEventListeners() {
      const openSelector = () => {
          this.showSelectorModal();
      };

      this.input.addEventListener('click', openSelector);
      this.toggleBtn.addEventListener('click', openSelector);
  }

  async showSelectorModal() {
      try {
          const result = await createSelectorModal({
              selectedValues: this.selectedValues,
              options: this.options,
              multiple: this.multiple, // Pasar modo múltiple
          });
          if (result) {
              this.setValues(result.values, result.labels);
          }
      } catch (error) {
          console.log('Selector cancelado');
      }
  }

  /**
   * Método para establecer opciones externas.
   * @param {Array} options - Lista de opciones con `value`, `label` y `description`.
   */
  setOptions(options) {
      this.options = options;
  }

  get value() {
      return this.multiple ? this.selectedValues : this.selectedValues[0] || '';
  }

  set value(newValue) {
      const values = Array.isArray(newValue) ? newValue : [newValue];
      this.setValues(values, values);
  }
}

customElements.define('modal-selector', ModalSelector);
class PreviewWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.iframe = null;
    this.linkInput = null;
  }

  static get observedAttributes() {
    return ['link', 'showpreview', 'mute'];
  }

  connectedCallback() {
    this.render();
    this.linkInput = this.shadowRoot.querySelector('#linkInput');
    this.copyButton = this.shadowRoot.querySelector('#copyButton');
    this.togglePreviewButton = this.shadowRoot.querySelector('#togglePreviewButton');

    this.copyButton.addEventListener('click', this.copyLink.bind(this));
    this.togglePreviewButton.addEventListener('click', this.togglePreview.bind(this));

    this.showpreview = this.hasAttribute('showpreview') ? this.getAttribute('showpreview') === 'true' : false;
    this.link = this.getAttribute('link') || '';
    this.mute = this.hasAttribute('mute') ? this.getAttribute('mute') === 'true' : false;

    if (this.showpreview) {
      this.createIframe();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'showpreview' && newValue !== oldValue) {
      if (newValue === 'true') {
        this.createIframe();
      } else {
        this.removeIframe();
      }
    }

    if (name === 'link' && newValue !== oldValue) {
      this.setLink(newValue);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          background-color: #fff;
          color: black;
        }
        iframe {
          width: 100%;
          height: 400px;
          border-radius: 8px;
        }
        #linkInput {
          width: auto;
          margin-bottom: 10px;
          padding: 10px;
          background: #f9f9f9;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }
        button {
          margin-top: 10px;
          padding: 8px 16px;
          border: 1px solid #007BFF;
          background-color: #007BFF;
          color: white;
          font-size: 14px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }
        button:focus {
          outline: none;
          box-shadow: 0 0 3px 3px rgba(0, 123, 255, 0.5);
        }

        /* Dark Mode Styles */
        :host([theme="dark"]) {
          background-color: #333;
          color: white;
        }

        :host([theme="dark"]) button {
          background-color: #444;
          border-color: #666;
        }

        :host([theme="dark"]) button:hover {
          background-color: #222;
          border-color: #444;
        }

        :host([theme="dark"]) #linkInput {
          background: #555;
          color: white;
          border-color: #777;
        }

        :host([theme="dark"]) iframe {
          border: none;
        }
      </style>
      <input id="linkInput" type="text" value="${this.link}" disabled>
      <button id="copyButton">Copy Link</button>
      <button id="togglePreviewButton">Toggle Preview</button>
    `;
  }

  createIframe() {
    if (!this.iframe) {
      this.iframe = document.createElement('iframe');
      this.iframe.src = this.link;
      this.iframe.muted = this.mute;
      this.shadowRoot.appendChild(this.iframe);
      this.dispatchEvent(new CustomEvent('linkchanged', {
        detail: { link: this.link }
      }));
    }
  }

  removeIframe() {
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
  }

  setLink(link) {
    this.link = link;
    if (this.linkInput) {
      this.linkInput.value = this.link;
    }
    if (this.iframe) {
      this.iframe.src = this.link;
    }
  }

  showpreview(show) {
    this.showpreview = show;
    this.setAttribute('showpreview', show ? 'true' : 'false');
  }

  changeLink(newLink) {
    this.setLink(newLink);
    this.dispatchEvent(new CustomEvent('linkchanged', {
      detail: { link: newLink }
    }));
  }

  copyLink() {
    navigator.clipboard.writeText(this.link)
      .then(() => {
        console.log('Link copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  toggletheme(theme) {
    if (theme === 'dark') {
      this.setAttribute('theme', 'dark');
    } else {
      this.removeAttribute('theme');
    }
  }

  togglePreview() {
    this.showpreview = !this.showpreview;
    this.setAttribute('showpreview', this.showpreview ? 'true' : 'false');
    if (this.showpreview) {
      this.createIframe();
    } else {
      this.removeIframe();
    }
  }

  updateButtonText(copyText, toggleText) {
    if (this.copyButton) {
      this.copyButton.textContent = copyText;
    }
    if (this.togglePreviewButton) {
      this.togglePreviewButton.textContent = toggleText;
    }
  }
}

customElements.define('preview-webcomponent', PreviewWebComponent);
const colorStyles = `
  /* Text Colors */
  .text-black { color: #000; }
  .text-white { color: #fff; }
  .text-gray-900 { color: #1a202c; }
  .text-gray-800 { color: #2d3748; }
  .text-gray-700 { color: #4a5568; }
  .text-gray-600 { color: #718096; }
  .text-gray-500 { color: #a0aec0; }
  .text-gray-400 { color: #e2e8f0; }
  .text-gray-300 { color: #edf2f7; }
  .text-gray-200 { color: #f7fafc; }
  .text-gray-100 { color: #f8fafc; }
  
  /* Background Colors */
  .bg-black { background-color: #000; }
  .bg-white { background-color: #fff; }
  .bg-gray-900 { background-color: #1a202c; }
  .bg-gray-800 { background-color: #2d3748; }
  .bg-gray-700 { background-color: #4a5568; }
  .bg-gray-600 { background-color: #718096; }
  .bg-gray-500 { background-color: #a0aec0; }
  .bg-gray-400 { background-color: #e2e8f0; }
  .bg-gray-300 { background-color: #edf2f7; }
  .bg-gray-200 { background-color: #f7fafc; }
  .bg-gray-100 { background-color: #f8fafc; }

  /* Border Colors */
  .border-black { border-color: #000; }
  .border-white { border-color: #fff; }
  .border-gray-900 { border-color: #1a202c; }
  .border-gray-800 { border-color: #2d3748; }
  .border-gray-700 { border-color: #4a5568; }
  .border-gray-600 { border-color: #718096; }
  .border-gray-500 { border-color: #a0aec0; }
  .border-gray-400 { border-color: #e2e8f0; }
  .border-gray-300 { border-color: #edf2f7; }
  .border-gray-200 { border-color: #f7fafc; }
  .border-gray-100 { border-color: #f8fafc; }

  /* Primary Colors */
  .text-blue-500 { color: #3b82f6; }
  .text-blue-600 { color: #2563eb; }
  .text-blue-700 { color: #1d4ed8; }
  .text-blue-800 { color: #1e40af; }
  .text-blue-900 { color: #1e3a8a; }
  .text-red-500 { color: #ef4444; }
  .text-red-600 { color: #dc2626; }
  .text-red-700 { color: #b91c1c; }
  .text-yellow-500 { color: #f59e0b; }
  .text-yellow-600 { color: #d97706; }
  .text-green-500 { color: #10b981; }
  .text-green-600 { color: #059669; }

  /* Hover Colors */
  .hover\:bg-blue-500:hover { background-color: #3b82f6; }
  .hover\:bg-blue-600:hover { background-color: #2563eb; }
  .hover\:bg-blue-700:hover { background-color: #1d4ed8; }
  .hover\:bg-blue-800:hover { background-color: #1e40af; }
  .hover\:bg-blue-900:hover { background-color: #1e3a8a; }
  .hover\:bg-red-500:hover { background-color: #ef4444; }
  .hover\:bg-red-600:hover { background-color: #dc2626; }
  .hover\:bg-red-700:hover { background-color: #b91c1c; }
  .hover\:bg-yellow-500:hover { background-color: #f59e0b; }
  .hover\:bg-yellow-600:hover { background-color: #d97706; }
  .hover\:bg-green-500:hover { background-color: #10b981; }
  .hover\:bg-green-600:hover { background-color: #059669; }

  .hover\:text-blue-500:hover { color: #3b82f6; }
  .hover\:text-blue-600:hover { color: #2563eb; }
  .hover\:text-blue-700:hover { color: #1d4ed8; }
  .hover\:text-blue-800:hover { color: #1e40af; }
  .hover\:text-blue-900:hover { color: #1e3a8a; }
  .hover\:text-red-500:hover { color: #ef4444; }
  .hover\:text-red-600:hover { color: #dc2626; }
  .hover\:text-red-700:hover { color: #b91c1c; }
  .hover\:text-yellow-500:hover { color: #f59e0b; }
  .hover\:text-yellow-600:hover { color: #d97706; }
  .hover\:text-green-500:hover { color: #10b981; }
  .hover\:text-green-600:hover { color: #059669; }

  .hover\:border-blue-500:hover { border-color: #3b82f6; }
  .hover\:border-blue-600:hover { border-color: #2563eb; }
  .hover\:border-blue-700:hover { border-color: #1d4ed8; }
  .hover\:border-blue-800:hover { border-color: #1e40af; }
  .hover\:border-blue-900:hover { border-color: #1e3a8a; }
  .hover\:border-red-500:hover { border-color: #ef4444; }
  .hover\:border-red-600:hover { border-color: #dc2626; }
  .hover\:border-red-700:hover { border-color: #b91c1c; }
  .hover\:border-yellow-500:hover { border-color: #f59e0b; }
  .hover\:border-yellow-600:hover { border-color: #d97706; }
  .hover\:border-green-500:hover { border-color: #10b981; }
  .hover\:border-green-600:hover { border-color: #059669; }
`;

class FlexibleModalSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedValues = [];
        this._hiddenInput = null;
        this.options = [];
        this.mode = 'single';
        this.theme = 'dark'
        this.isDarkMode = false;
        this.separator = '||'; // Unique separator to handle values with commas
        const template = document.createElement('template');
        template.innerHTML =/*html*/ `
            <style>
                :host {
                    --bg-primary: white;
                    --bg-secondary: #f8f9fa;
                    --text-primary: black;
                    --text-secondary: #6b7280;
                    --border-color: #e2e8f0;
                    --accent-color: #3b82f6;
                    --accent-light: rgba(59, 130, 246, 0.1);
                    transition: all 0.5s ease-in-out;
                    z-index: 1002;
                }
                :host(.dark) {
                    --bg-primary: #1a202c;
                    --bg-secondary: #2d3748;
                    --text-primary: white;
                    --text-secondary: #cbd5e0;
                    --border-color: #4a5568;
                    --accent-color: #4299e1;
                    --accent-light: rgba(66, 153, 225, 0.1);
                }
                .input-wrapper {
                    position: relative;
                    width: 100%;
                }
                input {
                    box-sizing: content-box;
                    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 0.375rem;
                    outline: none;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    cursor: pointer;
                }
                input:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px var(--accent-light);
                }
                .toggle-btn {
                    position: absolute;
                    right: 0.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    padding: 0.25rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
                ::slotted(input[type="hidden"]) {
                    display: none;
                }
            </style>
            <div class="input-wrapper">
                <slot></slot>
                <input type="text" readonly placeholder="Seleccione un valor">
                <button class="toggle-btn">▼</button>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.input = this.shadowRoot.querySelector('input[type="text"]');
        this.toggleBtn = this.shadowRoot.querySelector('.toggle-btn');

        this.setupEventListeners();
    }


    connectedCallback() {
        // Set mode from attribute
        this.mode = this.getAttribute('mode') || 'single';
        if (!this._hiddenInput) {
            this._hiddenInput = document.createElement('input');
            this._hiddenInput.type = 'hidden';
            this._hiddenInput.name = this.getAttribute('name') || '';
            this.appendChild(this._hiddenInput);
        }
        // Support initial values
        const initialValue = this.getAttribute('value');
        if (initialValue) {
            // Use new parsing method
            const values = this.parseValue(initialValue);
            this.setValues(values);
        }
    }

    static get observedAttributes() {
        return ['name', 'value', 'mode', 'theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'name' && this._hiddenInput) {
            this._hiddenInput.name = newValue;
        }
        
        if (name === 'mode') {
            this.mode = newValue || 'single';
            // Reset selection if mode changes
            this.selectedValues = [];
            this.input.value = '';
            if (this._hiddenInput) this._hiddenInput.value = '';
        }
       
        if (name === 'value' && newValue !== oldValue) {
            // Use new parsing method
            const values = this.parseValue(newValue);
            this.setValues(values);
        }
    }
    parseValue(value) {
        if (!value) return [];

        // If the value contains our separator, split by it
        if (value.includes(this.separator)) {
            return value.split(this.separator).map(v => v.trim());
        }

        // Fallback to comma splitting, but only if the comma is not inside quotes or special values
        return this.splitValueSafely(value);
    }
    splitValueSafely(value) {
        // If no commas, return as single value
        if (!value.includes(',')) return [value.trim()];

        // Use a regex to split while respecting quotes and special characters
        const values = value.match(/(?:[^\s,"]|"(?:\\"|[^"])*")+/g);
        
        return values ? values.map(v => {
            // Remove surrounding quotes if present
            return v.trim().replace(/^["']|["']$/g, '');
        }) : [value.trim()];
    }
    setValues(values) {
      // Ensure values is always an array
      const valuesArray = Array.isArray(values) ? values : [values];
  
      // Normalize values for consistent handling
      const normalizedValues = valuesArray.map(this.normalizeValue);
  
      // Filter out values that are not in the available options
      const availableValues = normalizedValues.filter(value => {
          const matchingOption = this.options.some(option => 
              this.normalizeValue(option.value) === value
          );
          return matchingOption;
      });
  
      // In single mode, take only the first available value
      this.selectedValues = this.mode === 'single' ? availableValues.slice(0, 1) : availableValues;
  
      // Get labels and images for selected values
      const selectedOptions = this.options
          .filter(option => {
              const normalizedOptionValue = this.normalizeValue(option.value);
              return this.selectedValues.includes(normalizedOptionValue);
          });
  
      // Clear previous image if exists
      const existingImage = this.input.previousElementSibling;
      if (existingImage && existingImage.tagName === 'IMG') {
          this.input.parentNode.removeChild(existingImage);
      }
  
      // Update input display
      const labels = selectedOptions.map(option => option.label);
      this.input.value = labels.join(', ');
  
      // Add image if exists in single mode
      if (this.mode === 'single' && selectedOptions[0] && (selectedOptions[0].image || selectedOptions[0].path)) {
          const img = document.createElement('img');
          img.src = (selectedOptions[0].image || selectedOptions[0].path).startsWith('http') ? (selectedOptions[0].image || selectedOptions[0].path) : `/media/${(selectedOptions[0].image || selectedOptions[0].path)}`;
          img.style.cssText = `
              position: absolute;
              left: 70%; 
              top: 50%;
              transform: translateY(-50%);
              width: 2rem;
              height: 2rem;
              object-fit: cover;
              border-radius: 0.25rem;
          `;
          this.input.parentNode.insertBefore(img, this.input);
      }
  
      // Update hidden input using the separator method
      if (this._hiddenInput) {
          this._hiddenInput.value = this.selectedValues.join(this.separator);
      }
  
      // Dispatch events
      this.dispatchEvent(new CustomEvent('change', {
          detail: {
              values: this.selectedValues,
              mode: this.mode
          },
          bubbles: true
      }));
      this.dispatchEvent(new Event('input', { bubbles: true }));
  }
    setupEventListeners() {
        const openSelector = () => {
            this.showSelectorModal();
        };

        this.input.addEventListener('click', openSelector);
        this.toggleBtn.addEventListener('click', openSelector);
    }

    async showSelectorModal() {
      try {
          const result = await this.createSelectorModal({
              selectedValues: this.selectedValues,
              options: this.options, // Ensure always using current options
              mode: this.mode,
              theme: this.isDarkMode ? 'dark' : 'light'
          });
          
          if (result && result.values) {
              this.setValues(result.values);
          }
      } catch (error) {
          console.log('Selector modal cancelled');
      }
  }

    /**
     * Method to create selector modal dynamically based on mode
     */
    async createSelectorModal({ selectedValues, options, mode, theme = 'light' }) {
      return new Promise((resolve, reject) => {
          // Color schemes
          const colors = {
              light: {
                  background: 'white',
                  border: '#e2e8f0',
                  text: 'black',
                  selectedBackground: '#3b82f6',
                  selectedText: 'white',
                  searchBg: 'white',
                  cancelBg: '#f3f4f6'
              },
              dark: {
                  background: '#1e293b', // slate-800
                  border: '#334155', // slate-700
                  text: 'white',
                  selectedBackground: '#2563eb', // blue-600
                  selectedText: 'white',
                  searchBg: '#334155', // slate-700
                  cancelBg: '#334155' // slate-700
              }
          };
  
          const currentColors = colors[theme];
  
          // Crear modal
          const modal = document.createElement('div');
          modal.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1001;
          `;
  
          // Contenedor del contenido
          const modalContent = document.createElement('div');
          modalContent.style.cssText = `
              background: ${currentColors.background};
              border: 1px solid ${currentColors.border};
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              padding: 1rem;
              max-width: 400px;
              width: 90%;
              max-height: 70vh;
              display: flex;
              flex-direction: column;
              color: ${currentColors.text};
          `;
  
          // Buscador
          const searchInput = document.createElement('input');
          searchInput.type = 'text';
          searchInput.placeholder = 'Buscar...';
          searchInput.style.cssText = `
              width: 100%;
              padding: 0.5rem;
              margin-bottom: 1rem;
              border: 1px solid ${currentColors.border};
              border-radius: 0.25rem;
              background-color: ${currentColors.searchBg};
              color: ${currentColors.text};
          `;
  
          // Contenedor de opciones
          const optionList = document.createElement('div');
          optionList.style.cssText = `
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              max-height: 300px;
              overflow-y: auto;
          `;
  
          // Lógica de búsqueda en tiempo real
          searchInput.addEventListener('input', (e) => {
              const searchTerm = e.target.value.toLowerCase().trim();
              optionElements.forEach(optionElement => {
                  const label = optionElement.querySelector('span').textContent.toLowerCase();
                  optionElement.style.display = label.includes(searchTerm) ? '' : 'none';
              });
          });
  
          // Track selected values
          const currentlySelectedValues = new Set(selectedValues);
          const optionElements = [];
  
          // Crear opciones
          options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.style.cssText = `
                display: flex;
                align-items: center;
                padding: 0.5rem;
                border: 1px solid ${currentColors.border};
                border-radius: 0.25rem;
                cursor: pointer;
                background-color: ${currentlySelectedValues.has(option.value) ? currentColors.selectedBackground : currentColors.background};
                color: ${currentlySelectedValues.has(option.value) ? currentColors.selectedText : currentColors.text};
            `;
  
            // Checkbox para modo multi
            if (mode === 'multi') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = currentlySelectedValues.has(option.value);
                checkbox.style.marginRight = '0.5rem';
                checkbox.style.accentColor = currentColors.selectedBackground;
                optionElement.appendChild(checkbox);
            }
  
            // Add image support
            if (option.image || option.path) {
                const img = document.createElement('img');
                img.src = (option.image || option.path).startsWith('http') ? option.image || option.path : `/media/${option.image || option.path}`;
                img.style.cssText = `
                    width: 30px;
                    height: 30px;
                    object-fit: cover;
                    margin-right: 0.5rem;
                    border-radius: 0.25rem;
                `;
                optionElement.appendChild(img);
            }
  
            const label = document.createElement('span');
            label.textContent = option.label;
            optionElement.appendChild(label);
  
              // Lógica de selección
              optionElement.addEventListener('click', () => {
                  if (mode === 'single') {
                      // Modo single: selección inmediata
                      document.body.removeChild(modal);
                      resolve({ values: [option.value] });
                  } else {
                      // Modo multi: toggle selección
                      const checkbox = optionElement.querySelector('input[type="checkbox"]');
                      checkbox.checked = !checkbox.checked;
                      if (checkbox.checked) {
                          currentlySelectedValues.add(option.value);
                          optionElement.style.backgroundColor = currentColors.selectedBackground;
                          optionElement.style.color = currentColors.selectedText;
                      } else {
                          currentlySelectedValues.delete(option.value);
                          optionElement.style.backgroundColor = currentColors.background;
                          optionElement.style.color = currentColors.text;
                      }
                  }
              });
  
              optionElements.push(optionElement);
              optionList.appendChild(optionElement);
          });
  
          // Botones para modo multi
          if (mode === 'multi') {
              const confirmButton = document.createElement('button');
              confirmButton.textContent = 'Confirmar Selección';
              confirmButton.style.cssText = `
                  margin-top: 1rem;
                  padding: 0.5rem 1rem;
                  background-color: ${currentColors.selectedBackground};
                  color: ${currentColors.selectedText};
                  border: none;
                  border-radius: 0.25rem;
                  cursor: pointer;
              `;
  
              confirmButton.addEventListener('click', () => {
                  document.body.removeChild(modal);
                  resolve({
                      values: Array.from(currentlySelectedValues)
                  });
              });
  
              const cancelButton = document.createElement('button');
              cancelButton.textContent = 'Cancelar';
              cancelButton.style.cssText = `
                  margin-top: 1rem;
                  margin-left: 0.5rem;
                  padding: 0.5rem 1rem;
                  background-color: ${currentColors.cancelBg};
                  color: ${currentColors.text};
                  border: 1px solid ${currentColors.border};
                  border-radius: 0.25rem;
                  cursor: pointer;
              `;
  
              cancelButton.addEventListener('click', () => {
                  document.body.removeChild(modal);
                  reject();
              });
  
              // Agregar buscador, lista de opciones y botones
              modalContent.appendChild(searchInput);
              modalContent.appendChild(optionList);
              modalContent.appendChild(confirmButton);
              modalContent.appendChild(cancelButton);
          } else {
              // Modo single: buscador y opciones
              modalContent.appendChild(searchInput);
              modalContent.appendChild(optionList);
          }
  
          // Agregar contenido al modal
          modal.appendChild(modalContent);
  
          // Evento para cerrar al hacer clic fuera
          modal.addEventListener('click', (event) => {
              if (event.target === modal) {
                  document.body.removeChild(modal);
                  reject();
              }
          });
  
          // Prevenir que los clics dentro del contenido se propaguen y cierren el modal
          modalContent.addEventListener('click', (event) => {
              event.stopPropagation();
          });
  
          // Agregar al documento
          document.body.appendChild(modal);
  
          // Enfocar buscador al abrir
          searchInput.focus();
      });
  }
    /**
     * Method to set external options
     * @param {Array} options - List of options with `value`, `label`, and optional `description`
     */
    setOptions(options) {
        this.options = options;
    }
    normalizeValue(value) {
        // For primitive types (number, string, boolean), return as-is
        if (['number', 'string', 'boolean'].includes(typeof value)) {
            return value;
        }
        
        // For objects and arrays, use JSON stringify
        return JSON.stringify(value);
    }

    get value() {
        return this.mode === 'single' ? this.selectedValues[0] : this.selectedValues;
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            this.classList.add('dark');
        } else {
            this.classList.remove('dark');
        }
        
        // Dispatch dark mode change event
        this.dispatchEvent(new CustomEvent('darkModeChange', {
            detail: { isDarkMode: this.isDarkMode },
            bubbles: true
        }));
    }
        set value(newValues) {
        const valuesArray = Array.isArray(newValues) ? newValues : [newValues];
        this.setValues(valuesArray);
    }

}

customElements.define('flexible-modal-selector', FlexibleModalSelector);

class DynamicForm extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.fields = [];
      this.initialState = null;
      this.conditionalFields = new Map(); // Mapa para almacenar las relaciones condicionales
      this.beforeFormElements = []; // Nueva propiedad para almacenar elementos antes del formulario
      this.formConfig = {
          submitLabel: 'Submit',
          class: 'form-default',
          validateOnSubmit: true
      };
      this.boundHandleSubmit = this.handleSubmit.bind(this);
      const template = document.createElement('template');
      template.innerHTML = /*html*/ `
          <style>
          ${colorStyles}
              :host {
                  display: block;
                  font-family: system-ui, -apple-system, sans-serif;
                  width: 100%;
              }
              .form-default {
                  padding: 1rem;
                  border-radius: 0.5rem;
                  background: white;
                  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                  display: grid
              }
              .hidden {
                  display: none;
              }
              .w-full {
                  width: 100%;
              }
              .flex {
                  display: flex;
              }
              .justify-center {
                  justify-content: center;
              }
              .items-center {
                  align-items: center;
              }
              .justify-between {
                  justify-content: space-between;
              }
              .text-justify {
                  text-align: justify;
              }
              .form-group {
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 0.5rem;
                  transition: all 0.5s ease;
                  gap: 0.5rem;
                  label {
                      margin-left: 10px;
                      font-size: 16px;
                  }
              }
              .radio-group {
                  
              }
              .radio-item {
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  flex-wrap: wrap;    
                  flex-flow: row-reverse;
                  justify-content: space-between;
                  label {
                      font-weight: 600;
                  }
              }
              .form-group input[type="checkbox"] {
                  width: 20px; /* Tamaño constante del checkbox */
                  height: 20px; /* Tamaño constante del checkbox */
                  appearance: none; /* Elimina el estilo predeterminado del checkbox */
                  background-color: #f0f0f0; /* Color de fondo cuando no está chequeado */
                  border: 2px solid #ccc; /* Color del borde */
                  border-radius: 4px; /* Bordes redondeados */
                  transition: background-color 0.3s ease, border-color 0.3s ease; /* Transiciones suaves para el color */
                  outline: none; /* Elimina el contorno */
                  cursor: pointer; /* Cambia el cursor al pasar sobre el checkbox */
              }

              .form-group input[type="checkbox"]:checked {
                  background-color: #668ffd; /* Color de fondo cuando está chequeado */
                  border-color: #786bb4; /* Color del borde cuando está chequeado */
              }

              label {
                  display: flex;
                  color: #374151;
              }
              input, select, textarea {
                  width: auto;
                  padding: 0.5rem;
                  border: 1px solid #d1d5db;
                  border-radius: 0.375rem;
                  font-size: 1rem;
              }
              input[type="number"]  {max-width: 5rem; box-sizing: content-box;}
              input:focus, select:focus, textarea:focus {
                  outline: none;
                  border-color: #3b82f6;
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
              }
              .error-message {
                  color: #dc2626;
                  font-size: 0.875rem;
                  margin-top: 0.25rem;
              }
              button[type="submit"] {
                  background-color: #3b82f6;
                  color: white;
                  padding: 0.5rem 1rem;
                  border: none;
                  border-radius: 0.375rem;
                  font-size: 1rem;
                  cursor: pointer;
                  transition: background-color 0.2s;
              }
              button[type="submit"]:hover {
                  background-color: #2563eb;
              }
              .required label::after {
                  content: " *";
                  color: #dc2626;
              }
              .hidden-field {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    transition: 
                        max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        margin 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        padding 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    visibility: hidden;
                }

            .show {
                width: auto;
                opacity: 1;
                transform: scale(1);
                overflow: visible;
            }

              .disabled {
                  pointer-events: none;
                  opacity: 0.5;
              }
          </style>
          <form></form>
      `;

      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.form = this.shadowRoot.querySelector('form');
      const styleTag = this.shadowRoot.querySelector('style');
      styleTag.textContent += `
          /* Dark Mode Styles */
          .form-default.dark-mode {
              background: #1f2937;
              color: #f9fafb;
              box-shadow: 0 1px 3px 0 rgb(255 255 255 / 0.1);
          }
          
          .dark-mode label {
              color: #e5e7eb;
          }
          
          .dark-mode input, 
          .dark-mode select, 
          .dark-mode textarea {
              background-color: #2d3748;
              color: #f9fafb;
              border-color: #4a5568;
          }
          
          .dark-mode input[type="checkbox"] {
              background-color: #4a5568;
              border-color: #718096;
          }
          
          .dark-mode input[type="checkbox"]:checked {
              background-color: #4299e1;
              border-color: #3182ce;
          }
          
          .dark-mode .error-message {
              color: #fc8181;
          }
          
          .dark-mode button[type="submit"] {
              background-color: #4299e1;
              color: white;
          }
          
          .dark-mode button[type="submit"]:hover {
              background-color: #3182ce;
          }
      `;
      this.formConfig.darkMode = false;
      //this.emitchanges();
  }
  reRender(initialData = null) {
    // If initial data is provided, update the initial state
    if (initialData) {
        this.initialState = this._deepClone(initialData);
        console.log("initialState", this.initialState, initialData, this._deepClone(initialData));
        
        // Update field values based on the new initial data  
        this.fields.forEach(field => {
            // Check if the field exists in the initial data
            if (this.initialState[field.name] !== undefined) {
                // Handle different field types
                switch (field.type) {
                    case 'checkbox':
                        // Explicitly set checked state for checkboxes
                        field.checked = !!this.initialState[field.name];
                        break;
                    case 'radio':
                        // For radio buttons, set the value
                        field.value = this.initialState[field.name];
                        break;
                    default:
                        // For other field types, set the value
                        field.value = this.initialState[field.name];
                }
                
                console.log("restoreInitialState", field.name, this.initialState[field.name]);
            }
        });
    }

    // Clear existing form and re-render
    this.render();

    return this;
}
    updateFieldOptions(fieldName, newOptions) {
        // Buscar el campo en la configuración de campos
        const field = this.fields.find(f => f.name === fieldName);
        
        if (field) {
            // Actualizar las opciones en la configuración del campo
            field.options = newOptions;
            
            // Buscar el elemento en el DOM
            const fieldElement = this.form.querySelector(`[name="${fieldName}"]`);
            
            if (fieldElement) {
                switch (field.type) {
                    case 'select':
                        // Limpiar opciones existentes
                        fieldElement.innerHTML = '';
                        
                        // Añadir nuevas opciones
                        newOptions.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.textContent = option.label;
                            fieldElement.appendChild(optionElement);
                        });
                        break;
                    
                    case 'modal-selector':
                    case 'flexible-modal-selector':
                        // Usar el método setOptions del componente personalizado
                        fieldElement.setOptions(newOptions);
                        break;
                    
                    case 'radio':
                        // Rerender el grupo de radio buttons
                        const radioGroup = fieldElement.closest('.radio-group');
                        if (radioGroup) {
                            radioGroup.innerHTML = '';
                            newOptions.forEach(option => {
                                const radioWrapper = document.createElement('div');
                                radioWrapper.className = 'radio-item';
                                
                                const radioInput = document.createElement('input');
                                radioInput.type = 'radio';
                                radioInput.id = `${fieldName}_${option.value}`;
                                radioInput.name = fieldName;
                                radioInput.value = option.value;
                                
                                const radioLabel = document.createElement('label');
                                radioLabel.setAttribute('for', `${fieldName}_${option.value}`);
                                radioLabel.textContent = option.label;
                                
                                radioWrapper.appendChild(radioInput);
                                radioWrapper.appendChild(radioLabel);
                                radioGroup.appendChild(radioWrapper);
                            });
                        }
                        break;
                }
            }
        }
        
        return this;
    }
    updateFieldAttribute(fieldName, attribute, value) {
    const field = this.fields.find(f => f.name === fieldName);
    
    if (field) {
        // Actualizar el atributo en la configuración del campo
        field[attribute] = value;
        
        const fieldElement = this.form.querySelector(`[name="${fieldName}"]`);
        
        if (fieldElement) {
            switch (attribute) {
                case 'required':
                    fieldElement.required = value;
                    break;
                case 'disabled':
                    fieldElement.disabled = value;
                    break;
                case 'min':
                case 'max':
                case 'step':
                    if (fieldElement.tagName === 'INPUT') {
                        fieldElement[attribute] = value;
                    }
                    break;
                // Puedes agregar más casos según sea necesario
            }
        }
    }
    
    return this;
}
_deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
  addBeforeForm(elementConfig) {
      const defaultConfig = {
          type: 'div', // Tipo de elemento por defecto
          content: '', // Contenido del elemento
          className: '', // Clases CSS opcionales
          attributes: {}, // Atributos adicionales
          eventListeners: [] // Listeners de eventos opcionales
      };

      const config = { ...defaultConfig, ...elementConfig };
      
      // Crear el elemento
      const element = document.createElement(config.type);
      
      // Añadir contenido
      if (config.content) {
          element.innerHTML = config.content;
      }
      
      // Añadir clases
      if (config.className) {
          element.className = config.className;
      }
      
      // Añadir atributos
      Object.entries(config.attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
      });
      
      // Añadir event listeners
      config.eventListeners.forEach(({ event, handler }) => {
          element.addEventListener(event, handler);
      });
      
      // Almacenar el elemento para renderizarlo después
      this.beforeFormElements.push(element);
      
      return this;
  }
  initialize(config = {}, initialData = null) {
      // Limpiar estado previo
      this.fields = [];
      this.formConfig = {
          submitLabel: 'Submit',
          class: 'form-default',
          validateOnSubmit: true,
          ...config
      };

      // Si hay datos iniciales, guardarlos como estado inicial
      if (initialData) {
          this.initialState = this._deepClone(initialData);
      }

      // Remover el formulario anterior y crear uno nuevo
      const oldForm = this.shadowRoot.querySelector('form');
      if (oldForm) {
          oldForm.remove();
      }
      
      const newForm = document.createElement('form');
      newForm.className = this.formConfig.class;
      this.shadowRoot.appendChild(newForm);
      this.form = newForm;
      return this;
  }
  setSubmitButton(options = {}) {
    const submitButton = this.form.querySelector('button[type="submit"]');
      if (submitButton) {
          if (options.label) submitButton.textContent = options.label;
          if (options.disabled !== undefined) submitButton.disabled = options.disabled;
          if (options.className) submitButton.className = options.className;
      }
      return this;
  }
  addField(fieldConfig, options = {}) {
      const defaultConfig = {
          type: 'text',
          required: false,
          label: '',
          name: '',
          placeholder: '',
          value: '',
          options: [],
          validators: [],
          errorMessage: '',
          showWhen: null // Nuevo: Configuración para mostrar condicionalmente
      };
      const config = { ...defaultConfig, ...fieldConfig,
          rowGroup: options.rowGroup || null
      };
      // Si el campo tiene condiciones, registrarlas
      if (config.showWhen) {
          const { field: parentField, value: triggerValue } = config.showWhen;
          if (!this.conditionalFields.has(parentField)) {
              this.conditionalFields.set(parentField, []);
          }
          this.conditionalFields.get(parentField).push({
              fieldName: config.name,
              triggerValue
          });
      }

      // Si hay estado inicial y existe un valor para este campo, usarlo
      if (this.initialState && this.initialState[config.name] !== undefined) {
          config.value = this.initialState[config.name];
      }


      this.fields.push(config);
      return this;
  }

  createFieldHTML(field) {
      const wrapper = document.createElement('div');
      wrapper.className = `form-group ${field.required ? 'required' : ''}`;
      wrapper.setAttribute('data-field', field.name);
      //console.log("init field",field)
      if (field.showWhen) {
          wrapper.classList.add('hidden-field');
      }

      const label = document.createElement('label');
      label.textContent = field.label;
      label.setAttribute('for', field.name);
      wrapper.appendChild(label);

      let input;

      //addField config
      switch (field.type) {
          case 'flexible-modal-selector':
              input = document.createElement('flexible-modal-selector');
              input.id = field.name;
              input.setAttribute('name', field.name);
              input.setAttribute('mode', field.mode || 'single');
              console.log(field.theme);
              input.setAttribute('theme', field.theme || 'light');
              input.toggleDarkMode();
              // Configurar el evento change del modal-selector
              input.addEventListener('change', (e) => {
                  // Si hay campos condicionales que dependen de este
                  if (this.conditionalFields.has(field.name)) {
                      this.handleFieldChange(field.name, e.detail.values);
                  }
              });
              
              if (field.options) input.setOptions(field.options);
              // Si hay un valor inicial, establecerlo
              if (field.value) {
                  input.setValues(field.value);
              }
              break;
          case 'modal-selector': // Nuevo tipo para el selector modal
              input = document.createElement('modal-selector');
              input.id = field.name;
              input.setAttribute('name', field.name);
              
              // Configurar el evento change del modal-selector
              input.addEventListener('change', (e) => {
                  // Si hay campos condicionales que dependen de este
                  if (this.conditionalFields.has(field.name)) {
                      this.handleFieldChange(field.name, e.detail.value);
                  }
              });
              if (field.options) input.setOptions(field.options);
              // Si hay un valor inicial, establecerlo
              if (field.value) {
                  input.setValue(field.value, field.valueLabel || field.value);
              }
              break;
          case 'radio':
              const radioContainer = document.createElement('div');
              radioContainer.className = 'radio-group';
              
              field.options.forEach(option => {
                  const radioWrapper = document.createElement('div');
                  radioWrapper.className = 'radio-item';
                  
                  const radioInput = document.createElement('input');
                  radioInput.type = 'radio';
                  radioInput.id = `${field.name}_${option.value}`;
                  radioInput.name = field.name;
                  radioInput.value = option.value;
                  
                  if (field.value === option.value) {
                      radioInput.checked = true;
                  }
                  
                  if (field.required) {
                      radioInput.required = true;
                  }
                  
                  // Agregar evento change para campos condicionales
                  radioInput.addEventListener('change', () => this.handleFieldChange(field.name, option.value));
                  
                  const radioLabel = document.createElement('label');
                  radioLabel.setAttribute('for', `${field.name}_${option.value}`);
                  radioLabel.textContent = option.label;
                  
                  radioWrapper.appendChild(radioInput);
                  radioWrapper.appendChild(radioLabel);
                  radioContainer.appendChild(radioWrapper);
              });
              
              input = radioContainer;
              break;

          case 'select':
              input = document.createElement('select');
              field.options.forEach(option => {
                  const optionElement = document.createElement('option');
                  optionElement.value = option.value;
                  optionElement.textContent = option.label;
                  if (field.value === option.value) {
                      optionElement.selected = true;
                  }
                  input.appendChild(optionElement);
              });
              
              // Agregar evento change para campos condicionales
              if (this.conditionalFields.has(field.name)) {
                  input.addEventListener('change', (e) => this.handleFieldChange(field.name, e.target.value));
              }
              break;
              
          case 'textarea':
              input = document.createElement('textarea');
              input.rows = field.rows || 3;
              input.value = field.value;
              break;
          case 'links':
            // creamos elementos de url solamente de referencia no es un input
              input = document.createElement('div');
              input.className = 'input-default';
              input.innerHTML = `
                <div class="flex flex-row gap-2">
                    <a href="${field.value[0]}" target="_blank" class="text-blue-500 hover:text-blue-600">${field.value[0]}</a>
                    <a href="${field.value[1]}" target="_blank" class="text-blue-500 hover:text-blue-600">${field.value[1]}</a>
                </div>
              `;
              break;
            case 'content':
                input = document.createElement('div');
                if (field.className) input.className = field.className;
                input.innerHTML = `
                  <div class="input-default">
                    ${field.label || field.value}
                  </div>
                `;
                break;
          default:
              //console.log("field",field)
              input = document.createElement('input');
              input.type = field.type;
              input.value = field.value;
              if(field.min) input.min = field.min;
              if(field.max) input.max = field.max;
              if(field.step) input.step = field.step;
              if(field.placeholder) input.placeholder = field.placeholder;
              if(field.required) input.required = true;
              if(field.value) input.value = field.value;
              if(field.checked) input.checked = field.checked;
              if(field.hidden) input.classList.add('hidden');
              if(field.readonly) input.readOnly = true;
              if(field.disabled) input.disabled = true;
              if(field.className) input.className = field.className;
              setTimeout(() => {
                if (input)this.handleFieldChange(field.name, field.checked || field.value);
              }, 100);
              input.addEventListener('change', (e) => {
                  this.handleFieldChange(field.name, e.target.checked || e.target.value);
              });
      }
      
      if (field.type !== 'radio') {
          input.id = field.name;
          input.name = field.name;
          input.placeholder = field.placeholder;
          if (field.required) input.required = true;
      }
      
      wrapper.appendChild(input);
      
      if (field.errorMessage) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.textContent = field.errorMessage;
          wrapper.appendChild(errorDiv);
      }
      
      return wrapper;
  }
  getValues() {
      const formData = new FormData(this.form);
      const values = {};
      
      // Iteramos sobre los campos definidos en lugar de FormData
      this.fields.forEach(field => {
          const element = this.form.querySelector(`[name="${field.name}"]`);
          
          if (!element) return;

          switch (field.type) {
            case 'flexible-modal-selector':
                // For flexible-modal-selector, parse the value
                const rawValue = element.value;
                if (rawValue !== undefined && rawValue !== null) {
                  values[field.name] = typeof rawValue === 'string' && rawValue.includes(',')
                      ? rawValue.split(',').map(v => v.trim())  // Múltiples valores como cadena
                      : Array.isArray(rawValue) 
                          ? rawValue  // Ya es un arreglo
                          : rawValue;  // Número u otro tipo, envuelto en un arreglo
              }
                break;
              case 'checkbox':
                  // Para checkboxes, usamos la propiedad checked
                  values[field.name] = element.checked;
                  break;
                  
              case 'number':
              case 'range':
                  // Para números, convertimos el valor a número
                  const numValue = element.value === '' ? null : Number(element.value);
                  values[field.name] = numValue;
                  break;
                  
              case 'radio':
                  // Para radio buttons, obtenemos el valor del seleccionado
                  const checkedRadio = this.form.querySelector(`input[name="${field.name}"]:checked`);
                  values[field.name] = checkedRadio ? checkedRadio.value : null;
                  break;
                  
              default:
                  // Para el resto de tipos, usamos el valor directo
                  values[field.name] = formData.get(field.name);
          }
      });
      
      return values;
  }

  validateField(field, value) {
      // Modificamos la validación para manejar correctamente los tipos
      if (field.required) {
          switch (field.type) {
              case 'checkbox':
                  // Para checkbox requerido, debe estar marcado
                  if (!value) return 'Este campo es requerido';
                  break;
                  
              case 'number':
              case 'range':
                  // Para números, verificamos que no sea null o undefined
                  if (value === null || value === undefined) return 'Este campo es requerido';
                  break;
                  
              default:
                  // Para otros tipos, verificamos que no esté vacío
                  if (!value && value !== 0) return 'Este campo es requerido';
          }
      }

      // Ejecutamos los validadores personalizados
      for (const validator of field.validators) {
          const errorMessage = validator(value);
          if (errorMessage) return errorMessage;
      }

      return '';
  }


  render() {
      this.form.removeEventListener('submit', this.boundHandleSubmit);
      this.form.innerHTML = '';
      
      // Group fields by row
      const rowGroups = new Map();
      this.fields.forEach(field => {
          if (field.rowGroup) {
              if (!rowGroups.has(field.rowGroup)) {
                  rowGroups.set(field.rowGroup, []);
              }
              rowGroups.get(field.rowGroup).push(field);
          }
      });
              // Render fields
      this.fields.forEach(field => {
          // Skip fields that are part of a row group (they'll be rendered together)
          if (field.rowGroup) return;

          const fieldElement = this.createFieldHTML(field);
          this.form.appendChild(fieldElement);
      });

      rowGroups.forEach(rowFields => {
          const rowContainer = document.createElement('div');
          rowContainer.className = 'form-row';

          rowFields.forEach(field => {
              const fieldElement = this.createFieldHTML(field);
              rowContainer.appendChild(fieldElement);
          });

          this.form.appendChild(rowContainer);
      });
      this.conditionalFields.forEach((_, parentFieldName) => {
          const parentField = this.fields.find(f => f.name === parentFieldName);
          if (parentField) {
              let currentValue;
              if (parentField.type === 'radio') {
                  const checkedRadio = this.form.querySelector(`input[name="${parentFieldName}"]:checked`);
                  currentValue = checkedRadio ? checkedRadio.value : null;
              } else {
                  const input = this.form.querySelector(`[name="${parentFieldName}"]`);
                  currentValue = input ? input.value : null;
              }
              if (currentValue) {
                  this.handleFieldChange(parentFieldName, currentValue);
              }
          }
      });

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = this.formConfig.submitLabel;
      this.form.appendChild(submitButton);

      this.form.addEventListener('submit', this.boundHandleSubmit);
/*       this.fields.forEach(field => {
        const inputs = this.form.querySelectorAll(`[name="${field.name}"]`);
        //console.log("input",input)
        inputs.forEach(input => {
            ['change','input'].forEach(eventType => {
               input.addEventListener(eventType, () => {
                this.emitchanges()
               });
           });
        })
      }); */
      this.beforeFormElements.forEach(element => {
          this.form.appendChild(element);
      });
      return this;
  }
  clearBeforeFormElements() {
      this.beforeFormElements = [];
      return this;
  }
  toggleDarkMode(enabled = !this.formConfig.darkMode) {
      this.formConfig.darkMode = enabled;
      const formContainer = this.shadowRoot.querySelector('.form-default');
      
      if (enabled) {
          formContainer.classList.add('dark-mode');
      } else {
          formContainer.classList.remove('dark-mode');
      }
  }
  emitchanges(){
    this.dispatchEvent(new CustomEvent('form-change', {
                    detail: this.getValues(),
                    bubbles: true,
                    composed: true
                }));
  }
  disconnectedCallback() {
      if (this.form) {
          this.form.removeEventListener('submit', this.boundHandleSubmit);
          const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
          this.toggleDarkMode(prefersDarkScheme.matches);

          prefersDarkScheme.addListener((e) => {
              this.toggleDarkMode(e.matches);
          });

      }
  }
  handleFieldChange(fieldName, value) {
    const dependentFields = this.conditionalFields.get(fieldName) || [];
    this.emitchanges()
    dependentFields.forEach(({ fieldName: dependentFieldName, triggerValue }) => {
        const fieldElement = this.form.querySelector(`[data-field="${dependentFieldName}"]`);
        if (!fieldElement) return;
          // Si triggerValue es un array, verificamos si el valor está incluido
          const shouldShow = Array.isArray(triggerValue) 
            ? triggerValue.includes(value)
            : triggerValue === value;
        
            fieldElement.classList.toggle('hidden-field', !shouldShow);
            
            // Instantly add/remove 'show' class
            if (shouldShow) {
                fieldElement.classList.add('show');
            } else {
                fieldElement.classList.remove('show');
            }


          // Si el campo está oculto, limpiamos su valor
          if (!shouldShow) {
            const input = fieldElement.querySelector('input, select, textarea');
            if (input) {
                if (input.type === 'radio') {
                    const radios = fieldElement.querySelectorAll('input[type="radio"]');
                    radios.forEach(radio => radio.checked = false);
                } else {
                    input.value = '';
                }
            }
        }
      });
  }
  handleSubmit(e) {
      e.preventDefault();
          
      if (this.formConfig.validateOnSubmit) {
          let isValid = true;
          const values = this.getValues();

          this.fields.forEach(field => {
              const errorMessage = this.validateField(field, values[field.name]);
              if (errorMessage) {
                  isValid = false;
                  const fieldElement = this.form.querySelector(`[name="${field.name}"]`);
                  const errorDiv = fieldElement.parentNode.querySelector('.error-message') ||
                      document.createElement('div');
                  errorDiv.className = 'error-message';
                  errorDiv.textContent = errorMessage;
                  if (!fieldElement.parentNode.querySelector('.error-message')) {
                      fieldElement.parentNode.appendChild(errorDiv);
                  }
              }
          });

          if (!isValid) return;
      }

      this.dispatchEvent(new CustomEvent('form-submit', {
          detail: this.getValues(),
          bubbles: true,
          composed: true
      }));
  }

}

customElements.define('dynamic-form', DynamicForm);
class InputField extends HTMLElement {
  #value;
  #changeCallback;

  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.#value = null;
      this.#changeCallback = null;
  }

  static get observedAttributes() {
      return ['type', 'key', 'subkey', 'value', 'cols', 'rows', 'minheight', 'theme'];
  }

  get value() {
      return this.#value;
  }

  set value(newValue) {
      this.#value = newValue;
      this.setAttribute('value', newValue);
  }

  set onChange(callback) {
      this.#changeCallback = callback;
      this.render();
  }

  connectedCallback() {
      this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
          if (name === 'value') {
              this.#value = newValue;
          }
          this.render();
      }
  }

  render() {
      const type = this.getAttribute('type') || 'text';
      const key = this.getAttribute('key') || '';
      const subKey = this.getAttribute('subkey') || '';
      const value = this.getAttribute('value') || '';
      const cols = this.getAttribute('cols') || '50';
      const rows = this.getAttribute('rows') || '4';
      const minHeight = this.getAttribute('minheight') || '100px';
      const theme = this.getAttribute('theme') || 'dark';

      const styles = `
          :host {
              display: block;
              margin: 10px 0;
          }
          
          /* Variables CSS para temas */
          :host {
              --bg-color: ${theme === 'dark' ? '#2a2a2a' : '#ffffff'};
              --text-color: ${theme === 'dark' ? '#ffffff' : '#333333'};
              --border-color: ${theme === 'dark' ? '#444444' : '#cccccc'};
              --focus-color: ${theme === 'dark' ? '#0099ff' : '#007bff'};
              --placeholder-color: ${theme === 'dark' ? '#888888' : '#999999'};
              --resizer-color: ${theme === 'dark' ? '#666666' : '#cccccc'};
              --resizer-hover-color: ${theme === 'dark' ? '#888888' : '#999999'};
          }
          
          .input-container {
              position: relative;
              width: 100%;
          }

          input, textarea {
              padding: 8px;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              font-size: 14px;
              width: 100%;
              box-sizing: border-box;
              background-color: var(--bg-color);
              color: var(--text-color);
              transition: all 0.2s ease;
          }

          textarea {
              min-height: ${minHeight};
              resize: vertical;
              line-height: 1.5;
              overflow: auto;
              position: relative;
          }

          /* Mejora del redimensionador */
          .textarea-wrapper {
              position: relative;
              width: 100%;
          }

          .textarea-wrapper::after {
              content: '';
              position: absolute;
              right: 0;
              bottom: 0;
              width: 16px;
              height: 16px;
              background: 
                  linear-gradient(135deg, 
                  transparent 0%,
                  transparent 50%,
                  var(--resizer-color) 50%,
                  var(--resizer-color) 100%);
              pointer-events: none;
              opacity: 0.7;
              transition: opacity 0.2s ease;
          }

          .textarea-wrapper:hover::after {
              opacity: 1;
              background: 
                  linear-gradient(135deg, 
                  transparent 0%,
                  transparent 50%,
                  var(--resizer-hover-color) 50%,
                  var(--resizer-hover-color) 100%);
          }

          textarea::-webkit-resizer {
              background: transparent;
          }

          input:focus, textarea:focus {
              outline: none;
              border-color: var(--focus-color);
              box-shadow: 0 0 0 2px ${theme === 'dark' ? 'rgba(0,153,255,.25)' : 'rgba(0,123,255,.25)'};
          }

          ::placeholder {
              color: var(--placeholder-color);
              opacity: 1;
          }

          /* Estilo para cuando está deshabilitado */
          input:disabled, textarea:disabled {
              background-color: ${theme === 'dark' ? '#1a1a1a' : '#f5f5f5'};
              cursor: not-allowed;
              opacity: 0.7;
          }

          /* Estilo para el modo de solo lectura */
          input:read-only, textarea:read-only {
              background-color: ${theme === 'dark' ? '#1a1a1a' : '#f5f5f5'};
              cursor: default;
          }
      `;

      let inputElement;
      const subKeyLabel = subKey ? subKey : type;
      const placeholder = `${key} ${subKeyLabel}`;


      inputElement = `
          <div class="input-container">
              <input 
                  type="${type}"
                  value="${value}"
                  placeholder="${placeholder}"
              />
          </div>
      `;
      

      this.shadowRoot.innerHTML = `
          <style>${styles}</style>
          ${inputElement}
      `;

      const input = this.shadowRoot.querySelector('input, textarea');
      input.addEventListener('input', (e) => {
          const returnValue = type === 'number' ? Number(e.target.value) : e.target.value;
          this.#value = returnValue;
          
          if (this.#changeCallback) {
              this.#changeCallback({
                  key: key,
                  subKey: subKey,
                  value: returnValue,
                  element: this
              });
          }
      });
  }
}

// Registrar el componente
customElements.define('input-field', InputField);

// Registrar el componente
class CustomSelect extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.options = [];
      this.selectedOption = null;
      this.searchTerm = '';
      this.selectLabel = 'Select'; // Valor por defecto
      this.render();
  }

  connectedCallback() {
      this.setupEventListeners();
      // Comprobar si existe el atributo label
      if (this.hasAttribute('label')) {
          this.setLabel(this.getAttribute('label'));
      }
  }

  // Getter para la propiedad 'value'
  get value() {
      return this.selectedOption ? this.selectedOption.value : null;
  }

  // Setter para la propiedad 'value'
  set value(newValue) {
      this.setValue(newValue);
  }

  setLabel(label) {
      this.selectLabel = label || "Select";
      this.renderLabel(); // Actualizar el label en el DOM
      return this.selectLabel;
  }

  renderLabel() {
      const selectedElement = this.shadowRoot.querySelector('.selected span');
      if (selectedElement && !this.selectedOption) {
          selectedElement.textContent = this.selectLabel;
      }
  }

  setOptions(options) {
      this.options = options;
      this.renderOptions();
  }

  delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async setValue(value) {
      try {
          // Esperamos 1 segundo
          await this.delay(1000);

          // Esperamos a que la promesa de options se resuelva
          const options = await this.options;
          if (!options || options.length <= 0 || !options.filter || !options.find) return;

          // Buscamos la opción que tenga el valor que buscamos
          const option = options.find(opt => opt.value === value);
          
          if (option) {
              this.selectedOption = option;
              this.renderSelectedOption();
              return true;
          } else {
              //console.warn('Opción no encontrada:', value);
              return false;
          }
      } catch (error) {
          console.error('Error al establecer el valor:', error);
          return false;
      }
  }

  getValue() {
      return this.selectedOption ? this.selectedOption.value : null;
  }

  render() {
      this.shadowRoot.innerHTML = /*html*/`
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
      .option {
        margin-top: 1.5rem;
      }
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
    position: fixed;
    padding: 0.1rem;
    border-bottom: 1px solid var(--border-color);
    background-color: rgba(0, 0, 0, 0.2);
  }

  .search input {
      width: 100%;
      padding: 4px;
      background-color: rgba(0, 0, 0, 0.4);;
      color: var(--input-text-color);
      border: none;
  }
  .search input:focus, .search:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  .search input:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  .search input::placeholder {
      color: #bbb;
  }
</style>

          <div class="select-wrapper">
              <div class="selected">
                  <img src="" alt="" style="display: none;">
                  <span>${this.selectLabel}</span>
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

  async renderOptions() {
    const optionsContainer = this.shadowRoot.querySelector('.options');
    optionsContainer.innerHTML = '';

    try {
        // Esperamos a que la promesa de options se resuelva
        const options = await this.options;
        if (options instanceof Promise) {
            await options;
        }
        if (!options || options.length <= 0 || !options.filter || !options.find) return;

        // Filtramos y renderizamos las opciones después de que la promesa se resuelva
        options
            .filter(option => option.label.toLowerCase().includes(this.searchTerm.toLowerCase()))
            .forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                
                // Verificar si `option.image` es un SVG en texto (option.image || option.path).startsWith('http') ? (option.image || option.path) : `/media/${(option.image || option.path)}`
                let imgSrc = option.image && option.image.startsWith('http') ? option.image : `/media/${option.image}`;
                if (option.image && option.image.length > 50 && option.image.trim().startsWith('<svg')) {
                    // Crear un Blob para el SVG y generar una URL compatible
                    const svgBlob = new Blob([option.image], { type: 'image/svg+xml' });
                    imgSrc = URL.createObjectURL(svgBlob);
                    
                    // Limpiar la URL al desconectar el componente
                    if (!this._blobUrls) this._blobUrls = [];
                    this._blobUrls.push(imgSrc);
                }
                
                optionElement.innerHTML = `
                    ${imgSrc ? `<img src="${imgSrc}" alt="${option.label}">` : ''}
                    <span>${option.label}</span>
                `;
                optionElement.addEventListener('click', () => this.selectOption(option));
                optionsContainer.appendChild(optionElement);
            });
    } catch (error) {
        console.error('Error al cargar las opciones:', error);
    }
  }

  disconnectedCallback() {
      // Limpiar las URLs generadas para liberar memoria
      if (this._blobUrls) {
          this._blobUrls.forEach(url => URL.revokeObjectURL(url));
          this._blobUrls = null;
      }
      super.disconnectedCallback && super.disconnectedCallback();
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
          selectedElement.textContent = this.selectLabel;
          selectedImage.style.display = 'none';
      }
  }

  setupEventListeners() {
      const selected = this.shadowRoot.querySelector('.selected');
      const dropdown = this.shadowRoot.querySelector('.dropdown');
      const searchInput = this.shadowRoot.querySelector('.search input');

      selected.addEventListener('click', () => {
          dropdown.classList.toggle('open');
      });

      searchInput.addEventListener('input', (e) => {
          this.searchTerm = e.target.value;
          this.renderOptions();
      });
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
  setlabel(label) {
    this.renderLabel();
    this.selectlabel = label || "select options";
    return this.selectlabel
  }
  renderLabel() {
    const selectedElement = this.shadowRoot.querySelector('.selected-area.placeholder');
    if (selectedElement) {
        selectedElement.textContent = this.selectLabel;
    }
  }
  async setValues(values) {
    // si this optios es una promesa o si no es un array, entonces esperamos a que se resuelva
      if ( this.options instanceof Promise ) {
        await this.options;
      }
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
              <span class="placeholder">Select</span>
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
        placeholder: 'Entrezvotre nom',
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

    // Initialize static instances map if it doesn't exist
    if (!UserProfile.instances) {
      UserProfile.instances = new Map();
    }

    // Get the group identifier from the attribute
    const groupId = this.getAttribute('group-id');

    // If no group-id is provided, create a unique instance
    if (!groupId) {
      this._state = this.createInitialState();
      this.loadFromLocalStorage();
    } else {
      // Check if an instance for this group already exists
      if (!UserProfile.instances.has(groupId)) {
        // Create new instance for this group
        UserProfile.instances.set(groupId, {
          state: this.createInitialState(),
          elements: new Set()
        });
      }
      
      // Add this element to the group
      const group = UserProfile.instances.get(groupId);
      group.elements.add(this);
      
      // Load state from localStorage if exists
      this.loadFromLocalStorage();
    }

    this.groupId = groupId;
    this.activeListeners = new Set();
    this.render();
    return this;
  }

  createInitialState() {
    return {
      connected: false,
      username: '',
      imageUrl: './favicon.svg',
      language: 'es',
      connectionStatus: 'offline',
      platform: 'tiktok'
    };
  }

  static get observedAttributes() {
    return ['minimal', 'group-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'minimal') {
      this.render();
    } else if (name === 'group-id' && oldValue !== newValue) {
      // Handle group-id change
      if (oldValue) {
        const oldGroup = UserProfile.instances.get(oldValue);
        if (oldGroup) {
          oldGroup.elements.delete(this);
          if (oldGroup.elements.size === 0) {
            UserProfile.instances.delete(oldValue);
          }
        }
      }

      if (newValue) {
        if (!UserProfile.instances.has(newValue)) {
          UserProfile.instances.set(newValue, {
            state: this.createInitialState(),
            elements: new Set()
          });
        }
        UserProfile.instances.get(newValue).elements.add(this);
        this.loadFromLocalStorage();
      } else {
        this._state = this.createInitialState();
        this.loadFromLocalStorage();
      }

      this.groupId = newValue;
      this.render();
    }
  }

  get isMinimal() {
    return this.hasAttribute('minimal');
  }

  get state() {
    return this.groupId ? 
      UserProfile.instances.get(this.groupId).state : 
      this._state;
  }

  set state(value) {
    if (this.groupId) {
      UserProfile.instances.get(this.groupId).state = value;
    } else {
      this._state = value;
    }
  }

  render() {
    const currentTranslations = this.translations[this.state.language];
    const actualimageUrl = this.state.imageUrl ? this.state.imageUrl : this.createInitialState().imageUrl;
    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="container ${this.state.connected ? 'connected' : ''}">
        <div class="profile-wrapper">
          <img 
            class="profile-image" 
            src="${actualimageUrl}"
            alt="Profile"
          />
          <div 
            class="status-indicator" 
            data-status="${this.state.connectionStatus}"
            title="${currentTranslations.status[this.state.connectionStatus]}"
          ></div>
        </div>
        <input 
          type="text"
          placeholder="${currentTranslations.placeholder}"
          value="${this.state.username}"
          ${this.state.connected ? 'disabled' : ''}
        />
        <button class="${this.state.connected ? 'connected' : ''}">
          ${this.state.connected ? currentTranslations.disconnect : currentTranslations.connect}
        </button>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.activeListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.activeListeners.clear();

    const button = this.shadowRoot.querySelector('button');
    const input = this.shadowRoot.querySelector('input');

    const buttonHandler = () => {
      if (this.state.connected) {
        this.disconnect();
      } else if (input.value.trim()) {
        this.connect(input.value);
      }
    };

    const inputHandler = (e) => {
      this.state.username = e.target.value;
    };

    button.addEventListener('click', buttonHandler);
    input.addEventListener('input', inputHandler);

    this.activeListeners.add({ element: button, type: 'click', handler: buttonHandler });
    this.activeListeners.add({ element: input, type: 'input', handler: inputHandler });
  }

  updateGroupElements() {
    if (this.groupId) {
      const group = UserProfile.instances.get(this.groupId);
      group.elements.forEach(element => {
        if (element !== this) {
          element.render();
        }
      });
    }
  }

  getStyles() {
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
        :host([minimal]) .container {
          flex-direction: row;
          padding: 8px;
          gap: 0px;
          background-color: transparent;
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
        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #4d7cff;
          box-shadow: 0 0 10px rgba(77, 124, 255, 0.3);
          transition: all 0.3s ease;
        }
        .profile-image:hover {
          transform: scale(1.05);
          border-color: #4d9cff;
        }
        input {
          width: 100%;
          padding: 12px;
          background-color: #162447;
          border: 3px solid #4d9cff;
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

  connect(username) {
    this.state.connected = true;
    this.state.username = username;
    this.state.imageUrl = './favicon.svg';
    this.state.connectionStatus = 'online';
    this.saveToLocalStorage();
    this.render();
    this.updateGroupElements();
    this.dispatchEvent(new CustomEvent('userConnected', { 
      detail: { username: this.state.username }
    }));
  }

  disconnect() {
    this.state.connected = false;
    this.state.imageUrl = './favicon.svg';
    this.state.connectionStatus = 'offline';
    this.saveToLocalStorage();
    this.render();
    this.updateGroupElements();
    this.dispatchEvent(new CustomEvent('userDisconnected'));
  }
  setPlatform(platform) {
    this.state.platform = platform;
    this.saveToLocalStorage();
  }
  setConnectionStatus(status) {
    if (['offline', 'online', 'away', 'busy'].includes(status)) {
      this.state.connectionStatus = status;
      this.saveToLocalStorage();
      this.render();
      this.updateGroupElements();
      this.dispatchEvent(new CustomEvent('connectionStatusChanged', { 
        detail: { status: this.state.connectionStatus }
      }));
    }
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.state.language = lang;
      this.saveToLocalStorage();
      this.render();
      this.updateGroupElements();
    }
  }

  setProfileImage(url) {
    this.state.imageUrl = url;
    this.saveToLocalStorage();
    this.render();
    this.updateGroupElements();
  }

  loadFromLocalStorage() {
    const key = this.groupId ? `userProfileState_${this.groupId}` : 'userProfileState';
    const savedState = localStorage.getItem(key);
    if (savedState) {
      this.state = { ...this.state, ...JSON.parse(savedState) };
    }
  }

  saveToLocalStorage() {
    const key = this.groupId ? `userProfileState_${this.groupId}` : 'userProfileState';
    localStorage.setItem(key, JSON.stringify(this.state));
  }

  disconnectedCallback() {
    if (this.groupId) {
      const group = UserProfile.instances.get(this.groupId);
      if (group) {
        group.elements.delete(this);
        if (group.elements.size === 0) {
          UserProfile.instances.delete(this.groupId);
        }
      }
    }
    
    // Clean up listeners
    this.activeListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
  }
}

customElements.define('user-profile', UserProfile);
class ResponsiveNavSidebar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      this.shadowRoot.innerHTML = /*html*/`
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
            @media (max-width: 800px) {
              .top-nav {
                display: flex;
              }
    
              .content {
                height: 100%;
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
                      .section {
            display: none;
          }
          
          .section.active {
            display: block;
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

    // Add event delegation for menu items
    this.addEventListener('click', (event) => {
      const menuItem = event.target.closest('[data-section]');
      if (menuItem) {
        this.showSection(menuItem.getAttribute('data-section'));
        this.closeMenu(); // Optional: close menu after selection
      }
    });
  }

  toggleMenu() {
    this.sidebar.classList.toggle('active');
    this.overlay.classList.toggle('active');
  }

  closeMenu() {
    this.sidebar.classList.remove('active');
    this.overlay.classList.remove('active');
  }

  /**
   * Show a specific section by its data-section value
   * @param {string} sectionName - The name of the section to show
   */
  showSection(sectionName) {
    // Find all sections within the main-content slot
    const sections = this.querySelector('slot[name="main-content"]')
      .assignedElements()
      .filter(el => el.classList.contains('section'));
    
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show the selected section
    const activeSection = sections.find(
      section => section.getAttribute('data-section') === sectionName
    );

    if (activeSection) {
      activeSection.classList.add('active');
    }
  }
  }
  
  customElements.define('responsive-nav-sidebar', ResponsiveNavSidebar);
  class TabManager extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.setupTabs();
    }
  
    render() {
      this.shadowRoot.innerHTML = /*html */`
        <style>
          :host {
            display: block;
          }
          
          .tab-content {
            position: relative;
            overflow: hidden;
            height: 100%;
            min-height: 50dvh;
          }
  
          ::slotted([data-tab-content]) {
            opacity: 0;
            visibility: hidden;
            position: absolute;
            width: 100%;
            transform: translateX(20px);
            transition: all 0.3s ease-in-out;
          }
  
          ::slotted([data-tab-content].active) {
            opacity: 1;
            visibility: visible;
            position: relative;
            transform: translateX(0);
          }
        </style>
        <slot name="tab-buttons"></slot>
        <div class="tab-content">
          <slot name="tab-content"></slot>
        </div>
      `;
    }
  
    setupTabs() {
      // Get all tab buttons and content
      const tabButtons = document.querySelectorAll('[data-tab-button]');
      const tabContents = document.querySelectorAll('[data-tab-content]');
      
      // Get last active tab from localStorage or default to last tab
      const lastActiveTab = localStorage.getItem('activeTab') || 
        tabButtons[tabButtons.length - 1]?.getAttribute('data-tab-button');
  
      // Setup click handlers for tab buttons
      tabButtons.forEach(button => {
        const tabId = button.getAttribute('data-tab-button');
        
        // Set initial active state
        if (tabId === lastActiveTab) {
          this.activateTab(button, tabButtons, tabContents);
        }
  
        button.addEventListener('click', () => {
          this.activateTab(button, tabButtons, tabContents);
        });
      });
  
      // If no active tab, activate the last one
      if (!localStorage.getItem('activeTab') && tabButtons.length) {
        this.activateTab(
          tabButtons[tabButtons.length - 1], 
          tabButtons, 
          tabContents
        );
      }
    }
  
    activateTab(selectedButton, allButtons, allContents) {
      const tabId = selectedButton.getAttribute('data-tab-button');
      
      // Update buttons state
      allButtons.forEach(button => {
        button.classList.remove('active');
      });
      selectedButton.classList.add('active');
  
      // Update content state
      allContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('data-tab-content') === tabId) {
          content.classList.add('active');
        }
      });
  
      // Save active tab to localStorage
      localStorage.setItem('activeTab', tabId);
    }
  }
  
  // Register the web component
  customElements.define('tab-manager', TabManager);
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
        this.currentMode = 'dark'; // Default to dark mode
        this.onOpenCallback = null;
        this.onCloseCallback = null;
        
        // Create shadow DOM
        this.attachShadow({ mode: 'open' });
        
        // Create base modal structure
        const template = document.createElement('template');
        template.innerHTML = /*html*/`
            <style>
                :host {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                :host([visible]) {
                    opacity: 1;
                }
                .modal-content {
                    padding: 1rem;
                    border-radius: 8px;
                    position: relative;
                    min-width: 300px;
                    max-height: 95dvh;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    opacity: 0;
                    transition: all 0.3s ease;
                    transform: scale(0.9);
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
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background-color 0.3s ease;
                }
                
                /* Dark Mode Styles */
                :host(.dark-mode) .modal-overlay {
                    background: rgba(0, 0, 0, 0.5);
                }
                :host(.dark-mode) .modal-content {
                    background: #1c1c1c;
                    color: #f4f4f4;
                }
                
                /* Light Mode Styles */
                :host(.light-mode) .modal-overlay {
                    background: rgba(0, 0, 0, 0.3);
                }
                :host(.light-mode) .modal-content {
                    background: #ffffff;
                    color: #333;
                    border: 1px solid #e0e0e0;
                }
                
                .close-button {
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    border: none;
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    border-radius: 10%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                /* Dark Mode Button */
                :host(.dark-mode) .close-button {
                    background-color: #dc3545;
                    color: white;
                }
                :host(.dark-mode) .close-button:hover {
                    background-color: #c82333;
                }
                
                /* Light Mode Button */
                :host(.light-mode) .close-button {
                    background-color: #f0f0f0;
                    color: #333;
                }
                :host(.light-mode) .close-button:hover {
                    background-color: #e0e0e0;
                }
                
                .modal-body {
                    margin-top: 20px;
                }
                
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

        // Add modal structure to shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        // Get references within shadow DOM
        this.overlay = this.shadowRoot.querySelector('.modal-overlay');
        this.closeButton = this.shadowRoot.querySelector('.close-button');
        this.modalBody = this.shadowRoot.querySelector('.modal-body');
        
        this.setupEventListeners();
        
        // Set default to dark mode
        this.setMode('dark');
    }

    connectedCallback() {
        // No additional setup needed in connectedCallback
    }

    setupEventListeners() {
        this.closeButton.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
    }

    // New method to set mode
    setMode(mode = 'dark') {
        // Validate mode
        if (!['dark', 'light'].includes(mode)) {
            console.warn('Invalid mode. Using default dark mode.');
            mode = 'dark';
        }

        // Remove existing mode classes
        this.classList.remove('dark-mode', 'light-mode');
        
        // Add new mode class
        this.classList.add(`${mode}-mode`);
        this.currentMode = mode;
    }

    // Toggle between dark and light modes
    toggleMode() {
        const newMode = this.currentMode === 'dark' ? 'light' : 'dark';
        this.setMode(newMode);
    }

    open(onOpenCallback = null) {
        this.onOpenCallback = onOpenCallback;
        this.style.display = 'block';
        // Force reflow
        this.offsetHeight;
        this.setAttribute('visible', '');
        this.isOpen = true;
        
        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
    }

    close(onCloseCallback = null) {
        this.onCloseCallback = onCloseCallback;
        this.removeAttribute('visible');
        this.isOpen = false;
        
        // Wait for transition to complete
        setTimeout(() => {
            this.style.display = 'none';
            this.isOpen = false;
            if (this.onCloseCallback) {
                this.onCloseCallback();
            }
        }, 300); // Same as transition time
    }

    appendChild(element) {
        // Ensure element is added to light DOM
        super.appendChild(element);
    }

    setContent(content) {
        // Clear current content
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        // Add new content
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

customElements.define('custom-modal', CustomModal);

class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.events = {};  // Almacena los event listeners personalizados
    this.menuItems = [
      { action: 'config', icon: '⚙️', label: 'Config' },
      { action: 'info', icon: 'ℹ️', label: 'Info' }
    ];
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        .button-container {
          display: inline-block;
          position: relative;
          border: none;
          cursor: pointer;
          background-color: var(--button-color, #007bff);
          color: white;
          padding: 0;
          border-radius: 5px;
          overflow: visible; /* Cambiado de hidden a visible */
          word-wrap: break-word;   /* Permite que las palabras largas se rompan */
          text-overflow: ellipsis; /* Mostrar '...' cuando el texto no cabe */
          text-align: center;
          font-size: 16px;
          height: 100%;
          width: 100%;
        }

        .button-image {
          width: 100%;
          height: 95%;
          max-width: 300px;
          object-fit: cover;
          display: none;
          pointer-events: none; /* Ignora todos los eventos de mouse y toque */
        }

        .button-text {
          padding: 10px;
        }

        .menu {
          display: none;
        position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          border-radius: 4px;
          padding: 5px;
          font-size: 12px;
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
          z-index: 1000; /* Asegura que esté por encima de otros elementos */
        }

        /* Añadir una flecha al menú */
        .menu::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }

        .menu-icon {
          margin: 0 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px 5px;
          white-space: nowrap; /* Evita que el texto se rompa */
        }

        .menu-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .menu-icon span {
          margin-left: 5px;
        }

        /* Modificar el comportamiento del hover */
        .button-container:hover .menu {
          display: flex;
          flex-direction: column;
        }
      </style>

      <div class="button-container">
        <img class="button-image" src="" alt="Button Icon" draggable="false"/>
        <span class="button-text"><slot></slot></span>
        <div class="menu"></div>
      </div>
    `;

    this.renderMenu();
    this.setupInitialEvents();
  }

  renderMenu() {
    const menu = this.shadowRoot.querySelector('.menu');
    menu.innerHTML = this.menuItems.map(item => `
      <div class="menu-icon" data-action="${item.action}">
        ${item.icon}
        <span>${item.label}</span>
      </div>
    `).join('');
  }

  setupInitialEvents() {
    const buttonContainer = this.shadowRoot.querySelector('.button-container');
    const menu = this.shadowRoot.querySelector('.menu');

    // Detener la propagación de clics en el menú
    menu.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
    });

    // Evento principal del botón
    buttonContainer.addEventListener('click', (event) => {
      if (this.events.click) {
        this.events.click(event);
      } else {
        console.log(`Botón principal ID: ${this.id} ha sido presionado`);
      }
    });

    // Configurar eventos del menú
    this.setupMenuEvents();
  }

  setupMenuEvents() {
    const menuIcons = this.shadowRoot.querySelectorAll('.menu-icon');
    menuIcons.forEach(icon => {
      const action = icon.getAttribute('data-action');
      
      // Eliminar eventos anteriores si existen
      const clone = icon.cloneNode(true);
      icon.parentNode.replaceChild(clone, icon);
      
      // Agregar el nuevo evento
      clone.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        if (this.events[action]) {
          this.events[action](event);
        } else {
          console.log(`Botón ID: ${this.id} - Acción: ${action}`);
        }
      });
    });
  }

  // Método para agregar o actualizar elementos del menú
  setMenuItem(callback,action, icon, label) {
    const existingItemIndex = this.menuItems.findIndex(item => item.action === action);
    
    if (existingItemIndex !== -1) {
      this.menuItems[existingItemIndex] = { action, icon, label };
    } else {
      this.menuItems.push({ action, icon, label });
    }

    if (callback) {
      this.events[action] = callback;
    }

    this.renderMenu();
    this.setupMenuEvents();
  }

  // Método para remover elementos del menú
  removeMenuItem(action) {
    this.menuItems = this.menuItems.filter(item => item.action !== action);
    delete this.events[action];
    this.renderMenu();
    this.setupMenuEvents();
  }

  // Método para agregar event listeners personalizados
  addCustomEventListener(eventName, callback) {
    this.events[eventName] = callback;
    if (eventName === 'click') return; // Si es el evento principal del botón
    this.setupMenuEvents(); // Actualizar eventos del menú
  }

  // Método para remover event listeners
  removeCustomEventListener(eventName) {
    delete this.events[eventName];
    if (eventName === 'click') return; // Si es el evento principal del botón
    this.setupMenuEvents(); // Actualizar eventos del menú
  }

  static get observedAttributes() {
    return ['color', 'image', 'text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot) return;

    switch (name) {
      case 'color':
        this.shadowRoot.querySelector('.button-container').style.setProperty('--button-color', newValue);
        break;
      case 'image':
        this.handleImage(newValue);
        break;
      case 'text':
        this.textContent = newValue;
        break;
    }
  }
  handleImage(value) {
    const imageElement = this.shadowRoot.querySelector('.button-image');
    const buttonText = this.shadowRoot.querySelector('.button-text');
    
    // Verifica si es un SVG en formato de texto
    if (value.length > 25 && value.trim().startsWith('<svg')) {
      // Crea un Blob a partir del texto SVG
      const svgBlob = new Blob([value], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Asigna la URL del Blob como src del <img>
      imageElement.src = svgUrl;
      imageElement.style.display = 'block';

      // Limpia la URL cuando el componente se desconecta para liberar memoria
      if (!this._blobUrl) {
        this._blobUrl = svgUrl;
      } else {
        URL.revokeObjectURL(this._blobUrl);
        this._blobUrl = svgUrl;
      }
    } else {
      // Si es una URL, usarla directamente en el <img>
      imageElement.src = value;
      imageElement.style.display = value ? 'block' : 'none';
    }

    buttonText.style.display = 'block';
  }
  // Método para establecer propiedades
  setProperties({ color, image, text }) {
    if (color) this.setAttribute('color', color);
    if (image) this.setAttribute('image', image);
    if (text) this.textContent = text;
  }
}

customElements.define('custom-button', CustomButton);
class ZoneRenderer extends HTMLElement {
  constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.elements = []; // Array en lugar de Map
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.gridSize = 5;
        this.storageKey = 'gridManagerIndexMapping';
        this.indexMapping = this.loadIndexMapping() || {};
        this.initialize();
    }
    loadIndexMapping() {
          const saved = JSON.parse(localStorage.getItem(this.storageKey));
          this.indexMapping = saved ? saved : {};
          return this.indexMapping;
    }
    saveIndexMapping() {
      try {
          localStorage.setItem(this.storageKey, JSON.stringify(this.indexMapping));
      } catch (error) {
          console.error('Error saving index mapping:', error);
          }
      }

      // Get indexGridElement for an id
      getIndexGridElement(id) {
          console.log("getIndexGridElement",this.indexMapping,this.loadIndexMapping()[id])
          return this.indexMapping[id] ?? id;
      }

      // Set indexGridElement for an id
      setIndexGridElement(id, index) {
          this.indexMapping[id] = index;
          console.log("setIndexGridElement",this.indexMapping)
          this.saveIndexMapping();
      }
    initialize() {
        this.render();
        this.setupEventListeners();
        this.loadIndexMapping();

    }

    getTotalPages() {
        return Math.max(1, Math.ceil(Math.max(...Array.from(this.elements.keys()), -1) + 1) / this.itemsPerPage);
    }

    generateGrid() {
      let grid = '';
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      
      for (let i = 0; i < this.itemsPerPage; i++) {
          const elementId = startIndex + i;
          const element = this.elements[elementId];
          
          // Puedes añadir una clase diferente si el elemento está vacío
          const isEmpty = !element;
          
          const templategrid = `
              <div class="element-slot ${isEmpty ? 'empty' : ''}" data-id="${elementId}">
                  <div class="element-content">
                      <slot name="element-${elementId}"></slot>
                  </div>
                  <div class="element-id">${elementId}</div>
              </div>
          `;

          grid += templategrid;
      }
      
      return grid;
  }

    render() {
      const totalPages = this.getTotalPages();
      const template = /*html*/ `
          <style>${this.styles}</style>
          <div class="controls">
              <div class="pagination">
                  <button id="prevPage" ${this.currentPage === 1 ? 'disabled' : ''}>←</button>
                  <span>Página ${this.currentPage} de ${totalPages}</span>
                  <button id="nextPage" ${this.currentPage >= totalPages ? 'disabled' : ''}>→</button>
                  <slot name="pagination"></slot>
              </div>
          </div>
          <div class="container">
              ${this.generateGrid()}
          </div>
      `;
      
      this.shadowRoot.innerHTML = template;
      this.setupEventListeners();
  }

    addCustomElement(id, element) {
      // Si el elemento ya existe en el DOM, lo actualizamos
      const existindex = this.getIndexGridElement(id)
      console.log("addCustomElement existindex",id,existindex)
      this.setIndexGridElement(id, existindex);
      const existingElement = this.querySelector(`[slot="element-${id}"]`);
      if (existingElement) {
          existingElement.remove();
      }

      // Si es string HTML, creamos un elemento contenedor
      if (typeof element === 'string') {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = element;
          element = wrapper;
      }

      // Asignamos el slot al elemento
      element.slot = `element-${id}`;

      // Añadimos el elemento al array
      // Aseguramos que el array tenga el tamaño necesario
      if (id >= this.elements.length) {
          this.elements.length = id + 1;
      }
      this.elements[id] = element;

      // Añadimos el elemento al DOM
      this.appendChild(element);

      // Actualizamos la vista si es necesario
      if (this.isElementInCurrentPage(id)) {
          this.render();
      }
      return true;
  }

    getElementById(id) {
        return this.querySelector(`[slot="element-${id}"]`);
    }

    updateElementById(id, content) {
        const existingElement = this.querySelector(`[slot="element-${id}"]`);
        if (existingElement) {
            existingElement.remove();
        }
        if (typeof content === 'string') {
          existingElement.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          // hay que eliminar el contenido anterior
          this.appendChild(content);
          if (this.isElementInCurrentPage(id)) {
            this.render();
        }
        }

        return true;
    }

    // Método auxiliar para calcular el total de páginas
    getTotalPages() {
      // Modificar para contar solo elementos no undefined
      const validElements = this.elements.filter(element => element !== undefined);
      return Math.max(1, Math.ceil(validElements.length / this.itemsPerPage));
    }
  
    initialize() {
      this.render();
      this.setupEventListeners();
    }

    setupEventListeners() {
      const prevButton = this.shadowRoot.getElementById('prevPage');
      const nextButton = this.shadowRoot.getElementById('nextPage');
      
      prevButton.addEventListener('click', () => this.previousPage());
      nextButton.addEventListener('click', () => this.nextPage());
      
      // Configurar drag and drop
      this.setupDragAndDrop();
    }

    // Método para verificar si un elemento está en la página actual
    isElementInCurrentPage(id) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return id >= startIndex && id < endIndex;
    }
  
    // Método para obtener la posición disponible más cercana
    getNextAvailablePosition() {
      let position = 0;
      while (this.elements[position] !== undefined) {
          position++;
      }
      return position;
  }

    swapElements(sourceId, targetId) {
        console.log("Antes del swap:", {
            sourceId,
            targetId,
            sourceElement: this.elements[sourceId],
            targetElement: this.elements[targetId],
            fullArray: [...this.elements]
        });

        // Verificar que ambos elementos existen
        if (this.elements[sourceId] === undefined || this.elements[targetId] === undefined) {
            console.error("Uno o ambos elementos no existen");
            return;
        }
        this.setIndexGridElement(sourceId, targetId);
        this.setIndexGridElement(targetId, sourceId);
        // Guardar elementos en variables temporales
        const temp = this.elements[sourceId];
        this.elements[sourceId] = this.elements[targetId];
        this.elements[targetId] = temp;

        // Actualizar el último ID movido
        this.lastMovedId = sourceId;

        console.log("Después del swap:", {
            sourceId,
            targetId,
            sourceElement: this.elements[sourceId],
            targetElement: this.elements[targetId],
            fullArray: [...this.elements],
            lastMovedId: this.lastMovedId
        });
        
        // Actualizar los slots de los elementos
        if (this.elements[sourceId]) {
            this.elements[sourceId].slot = `element-${sourceId}`;
        }
        if (this.elements[targetId]) {
            this.elements[targetId].slot = `element-${targetId}`;
        }

        this.render();
    }

    removeElement(elementId) {
        if (elementId < this.elements.length && elementId >= 0) {
            // Remover el elemento del DOM si existe
            const elementToRemove = this.querySelector(`[slot="element-${elementId}"]`);
            if (elementToRemove) {
                elementToRemove.remove();
            }

            // Eliminar el elemento del array
            this.elements[elementId] = undefined;
            
            // Si se elimina el elemento en el último ID movido, mantener ese ID
            if (elementId === this.lastMovedId) {
                // El lastMovedId se mantiene para que el próximo elemento se coloque aquí
                console.log(`Elemento eliminado en lastMovedId: ${this.lastMovedId}`);
            }
            
            // Actualizar la página actual si está vacía
            const totalPages = this.getTotalPages();
            if (this.currentPage > totalPages) {
                this.currentPage = Math.max(1, totalPages);
            }

            this.render();
        }
    }
  
  
    replaceElement(elementId, newElement) {
      if (this.elements[elementId] !== undefined) {
          this.elements[elementId] = newElement;
          this.render();
      }
  }
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    }
  
    nextPage() {
      const totalPages = this.getTotalPages();
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.render();
      }
    }
  

    setupDragAndDrop() {
      const slots = this.shadowRoot.querySelectorAll('.element-slot');
      
      slots.forEach(slot => {
        slot.draggable = true;
        
        slot.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', slot.dataset.id);
          console.log("dragstart")
        });
        
        slot.addEventListener('dragover', (e) => {
          e.preventDefault();
          console.log("dragover")
        });
        
        slot.addEventListener('drop', (e) => {
          e.preventDefault();
          console.log("drop")
          const sourceId = parseInt(e.dataTransfer.getData('text/plain'));
          const targetId = parseInt(slot.dataset.id);
          
          if (sourceId !== targetId) {
            this.swapElements(sourceId, targetId);
            console.log("swap",sourceId,targetId)
          }
        });
      });
    }
  
    // Actualizar estilos para incluir los nuevos elementos
    get styles() {
      return /*css*/ `
        ${super.styles || ''}
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .container {
          display: grid;
          grid-template-columns: repeat(${this.gridSize}, 1fr);
          gap: 10px;
          padding: 20px;
          min-height: 500px;
          background: rgba(0, 0, 0, 0.253);
          border-radius: 8px;
        }
        
        .element-slot {
          background: white;
          border: 2px dashed #ccc;
          border-radius: 4px;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .element-slot:hover {
          border-color: #666;
        }
        
        .controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          background: #007bff;
          color: white;
          cursor: pointer;
        }
        
        button:hover {
          background: #0056b3;
        }
        
        .pagination {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .element-slot {
            position: relative;
            background: #1a1a1a;
            border: 2px dashed #3b3939;
            border-radius: 4px;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 10px;
        }
        
        .element-content {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        
        .element-id {
          position: absolute;
          top: 5px;
          left: 5px;
          background: rgba(0,0,0,0.1);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 12px;
        }
        
        .custom-element {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;
    }
  }
  
  // Registrar el componente
  customElements.define('zone-renderer', ZoneRenderer);
  class TabsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._panels = new Map();
        this._lastIndex = -1; // Cambiamos _tabCount por _lastIndex para mejor semántica
    }

    connectedCallback() {
        // Crear estructura base del componente
        const wrapper = document.createElement('div');
        wrapper.classList.add('tabs');

        const tabButtons = document.createElement('div');
        tabButtons.classList.add('tab-buttons');

        const tabPanels = document.createElement('div');
        tabPanels.classList.add('tab-panels');

        wrapper.appendChild(tabButtons);
        wrapper.appendChild(tabPanels);

        // Agregar estilos
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync( /*css*/ `
            :host {
                display: block;
                background-color: #1a1a1a;
                color: #ffffff;
                padding: 1rem;
                font-family: Arial, sans-serif;
            }
            .tabs {
                border-radius: 8px;
                overflow: hidden;
            }
            .tab-buttons {
                overflow: auto;
                display: flex;
                background-color: #2d2d2d;
                border-bottom: 2px solid #3d3d3d;
            }
            .tab-button {
                padding: 12px 24px;
                border: none;
                background: none;
                color: #ffffff;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s;
            }
            .tab-button:hover {
                background-color: #3d3d3d;
            }
            .tab-button.active {
                background-color: #4d4d4d;
                border-bottom: 2px solid #007bff;
            }
            .tab-content {
                display: none;
                padding: 20px;
                background-color: #2d2d2d;
                height: 100%;
                max-height: 75dvh;
                overflow: auto;
            }
            .tab-content.active {
                display: block;
            }
            ::slotted(*) {
                color: #ffffff;
            }
        `);

        this.shadowRoot.adoptedStyleSheets = [styleSheet];
        this.shadowRoot.appendChild(wrapper);

        // Procesar los tabs iniciales
        this.processTabs();

        // Observar cambios en los hijos
        this._observer = new MutationObserver((mutations) => {
            this.processTabs();
        });
        this._observer.observe(this, { 
            childList: true, 
            subtree: true, 
            attributes: true,
            attributeFilter: ['tab-title', 'slot'] 
        });
    }

    disconnectedCallback() {
        this._observer.disconnect();
    }

    processTabs() {
        const tabButtons = this.shadowRoot.querySelector('.tab-buttons');
        const tabPanels = this.shadowRoot.querySelector('.tab-panels');

        // Limpiar contenido existente manteniendo la estructura
        tabButtons.innerHTML = '';
        tabPanels.innerHTML = '';
        
        // Mantener el Map pero limpiar su contenido
        const oldPanels = new Map(this._panels);
        this._panels.clear();

        // Obtener todos los elementos que tienen un slot asignado
        const elements = Array.from(this.children).filter(child => 
            child.hasAttribute('slot') || child.hasAttribute('tab-title')
        );

        // Si no hay elementos con slot, no hacer nada más
        if (elements.length === 0) {
            this._lastIndex = -1;
            return;
        }

        // Procesar los elementos
        elements.forEach((element) => {
            let slotName = element.getAttribute('slot');
            let index;
            
            // Si tiene slot, extraer el índice
            if (slotName && slotName.startsWith('tab-')) {
                index = parseInt(slotName.replace('tab-', ''));
            } else {
                // Si no tiene slot, asignar el siguiente índice disponible
                index = this._lastIndex + 1;
                slotName = `tab-${index}`;
                element.setAttribute('slot', slotName);
            }

            // Actualizar _lastIndex si es necesario
            this._lastIndex = Math.max(this._lastIndex, index);

            // Crear o reutilizar el botón
            const button = document.createElement('button');
            button.classList.add('tab-button');
            button.textContent = element.getAttribute('tab-title') || `Tab ${index + 1}`;
            if (this._panels.size === 0) button.classList.add('active');

            // Crear contenedor de contenido
            const content = document.createElement('div');
            content.classList.add('tab-content');
            if (this._panels.size === 0) content.classList.add('active');

            // Crear slot
            const slot = document.createElement('slot');
            slot.name = slotName;

            // Almacenar referencia
            this._panels.set(slotName, {
                button,
                content,
                slot,
                panel: element
            });

            // Agregar elementos al DOM
            content.appendChild(slot);
            tabButtons.appendChild(button);
            tabPanels.appendChild(content);

            // Event listener
            button.addEventListener('click', () => this.activateTab(index));
        });
    }

    createTab(title = null, index = null) {
        // Si no se proporciona un índice, usar el siguiente disponible
        if (index === null) {
            index = this._lastIndex + 1;
        }
        this._lastIndex = Math.max(this._lastIndex, index);
        
        const slotName = `tab-${index}`;
        
        // Si el tab ya existe, solo actualizar el título
        if (this._panels.has(slotName)) {
            if (title) {
                this.setTabTitle(index, title);
            }
            return index;
        }

        // Crear elementos del tab
        const button = document.createElement('button');
        button.classList.add('tab-button');
        button.textContent = title || `Tab ${index + 1}`;
        if (this._panels.size === 0) button.classList.add('active');

        const content = document.createElement('div');
        content.classList.add('tab-content');
        if (this._panels.size === 0) content.classList.add('active');

        const slot = document.createElement('slot');
        slot.name = slotName;

        // Almacenar referencia
        this._panels.set(slotName, {
            button,
            content,
            slot,
            panel: null
        });

        // Agregar elementos al DOM
        content.appendChild(slot);
        this.shadowRoot.querySelector('.tab-buttons').appendChild(button);
        this.shadowRoot.querySelector('.tab-panels').appendChild(content);

        // Event listener
        button.addEventListener('click', () => this.activateTab(index));

        return index;
    }

    addContent(index, element) {
        const slotName = `tab-${index}`;
        
        // Si el tab no existe, créalo
        if (!this._panels.has(slotName)) {
            this.createTab(null, index);
        }

        // Asignar slot y agregar elemento
        element.slot = slotName;
        this.appendChild(element);
        
        // Actualizar panel en la referencia
        const panelInfo = this._panels.get(slotName);
        if (panelInfo) {
            panelInfo.panel = element;
        }
    }

    setTabTitle(index, title) {
        const slotName = `tab-${index}`;
        const panelInfo = this._panels.get(slotName);
        
        if (panelInfo) {
            panelInfo.button.textContent = title;
            if (panelInfo.panel) {
                panelInfo.panel.setAttribute('tab-title', title);
            }
        }
    }
    activateTab(index) {
      const slotName = `tab-${index}`;
      this._panels.forEach((panelInfo, key) => {
          const isActive = key === slotName;
          panelInfo.button.classList.toggle('active', isActive);
          panelInfo.content.classList.toggle('active', isActive);
      });
  }
    removeContent(index, element) {
        if (element.parentNode === this) {
            this.removeChild(element);
        }
    }

    getPanel(index) {
        return this._panels.get(`tab-${index}`)?.panel;
    }
}

customElements.define('custom-tabs', TabsComponent);
class CustomSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['id', 'label', 'value', 'min', 'max', 'step', 'unit', 'theme', 'layout'];
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  getThemeStyles() {
    const themes = {
      default: `
        input[type="range"] {
          background: #ddd;
        }
        input[type="range"]::-webkit-slider-thumb {
          background: #2196F3;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #1976D2;
        }
      `,
      dark: `
        input[type="range"] {
          background: #444;
        }
        input[type="range"]::-webkit-slider-thumb {
          background: #9c27b0;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #7b1fa2;
        }
      `,
      minimal: `
        input[type="range"] {
          background: #e0e0e0;
          height: 4px;
        }
        input[type="range"]::-webkit-slider-thumb {
          background: #424242;
          width: 16px;
          height: 16px;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #212121;
        }
      `,
      audio: `
        input[type="range"] {
          background: linear-gradient(to right, transparent, #4CAF40, #4CAF50, #4CAF60, #FFC107, #f44336);
          height: 6px;
        }
        input[type="range"]::-webkit-slider-thumb {
          background: #fff;
          border: 2px solid #666;
          width: 18px;
          height: 18px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #f5f5f5;
          border-color: #333;
        }
      `
    };

    return themes[this.getAttribute('theme')] || themes.default;
  }
  getLayoutStyles() {
    const layout = this.getAttribute('layout') || 'vertical';
    
    const layouts = {
      vertical: `
        .slider-container {
          flex-direction: column;
          gap: 0.5rem;
        }
      `,
      horizontal: `
        .slider-container {
          flex-direction: row;
          align-items: center;
          gap: 1rem;
        }
        label {
          min-width: 100px;
        }
        input[type="range"] {
          flex: 1;
        }
        .value-display {
          min-width: 60px;
          text-align: right;
        }
      `,
      stacked: `
        .slider-container {
          flex-direction: column;
          gap: 0.5rem;
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        label {
          margin-right: 1rem;
        }
        input[type="range"] {
          width: 100%;
          margin-top: 0.5rem;
        }
      `
    };

    return layouts[layout] || layouts.vertical;
  }
  formatValue(value) {
    const unit = this.getAttribute('unit') || '%';
    // Si es un número decimal, mostrar solo 1 decimal
    return `${parseFloat(value).toFixed(1)}${unit}`;
  }

  render() {
    const id = this.getAttribute('id');
    const label = this.getAttribute('label') || 'Slider';
    const value = this.getAttribute('value') || 50;
    const min = this.getAttribute('min') || 0;
    const max = this.getAttribute('max') || 100;
    const step = this.getAttribute('step') || 1;
    const layout = this.getAttribute('layout') || 'vertical'; // vertical | horizontal

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 0.5rem 0;
          font-family: Arial, sans-serif;
        }
        .slider-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-weight: bold;
          user-select: none;
        }
        input[type="range"] {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
          transition: all 0.2s ease;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
        }
        .value-display {
          font-size: 0.9rem;
          user-select: none;
        }
        ${this.getLayoutStyles()}
        ${this.getThemeStyles()}
      </style>
      ${layout === 'stacked' ? `
        <div class="slider-container">
          <div class="header-container">
            <label for="${id}">${label}</label>
            <span class="value-display">${this.formatValue(value)}</span>
          </div>
          <input 
            type="range" 
            id="${id}"
            value="${value}"
            min="${min}"
            max="${max}"
            step="${step}"
          >
        </div>
      ` : `
        <div class="slider-container">
          <label for="${id}">${label}</label>
          <input 
            type="range" 
            id="${id}"
            value="${value}"
            min="${min}"
            max="${max}"
            step="${step}"
          >
          <span class="value-display">${this.formatValue(value)}</span>
        </div>
      `}
    `;
  }

  setupListeners() {
    const slider = this.shadowRoot.querySelector('input');
    const valueDisplay = this.shadowRoot.querySelector('.value-display');

    slider.addEventListener('input', (e) => {
      valueDisplay.textContent = this.formatValue(e.target.value);
      this.dispatchEvent(new CustomEvent('sliderInput', {
        detail: {
          value: e.target.value,
          label: this.getAttribute('label'),
          id: this.getAttribute('id'),
          formattedValue: this.formatValue(e.target.value)
        },
        bubbles: true,
        composed: true
      }));
    });

    slider.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('sliderChange', {
        detail: {
          value: e.target.value,
          label: this.getAttribute('label'),
          id: this.getAttribute('id'),
          formattedValue: this.formatValue(e.target.value),
        },
        bubbles: true,
        composed: true
      }));
    });
  }

  setValue(value) {
    const slider = this.shadowRoot.querySelector('input');
    const valueDisplay = this.shadowRoot.querySelector('.value-display');
    slider.value = value;
    valueDisplay.textContent = this.formatValue(value);
  }

  getValue() {
    return this.shadowRoot.querySelector('input').value;
  }
}


// Definición del contenedor de sliders
class SliderContainer extends HTMLElement {
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
          padding: 1rem;
        }
        .sliders-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        ::slotted(custom-slider) {
          margin: 0.25rem 0;
        }
      </style>
      <div class="sliders-wrapper">
        <slot></slot>
      </div>
    `;
  }

  createSlider(config) {
    const slider = document.createElement('custom-slider');
    
    // Configurar todos los atributos posibles
    const attributes = [
      'id', 'label', 'value', 'min', 'max', 
      'step', 'unit', 'theme', 'layout'
    ];
    
    attributes.forEach(attr => {
      if (config[attr] !== undefined) {
        slider.setAttribute(attr, config[attr]);
      }
    });
    
    this.appendChild(slider);
    return slider;
  }

  removeSlider(id) {
    const slider = this.querySelector(`custom-slider[id="${id}"]`);
    if (slider) {
      slider.remove();
    }
  }
}
customElements.define('custom-slider', CustomSlider);
customElements.define('slider-container', SliderContainer);

class ConnectionStatus extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Creamos el shadow DOM

    // Elementos internos
    this._status = 'disconnected'; // Estado inicial
    this._message = 'Desconectado';

    // Creamos la estructura HTML dentro del shadow DOM
    this.shadowRoot.innerHTML = /*html*/`
      <style>
      :host {
        display: flex;
        align-items: center;
        font-family: Arial, sans-serif;
      }

      .flex {
        display: flex;
      }

      .status-circle {
        width: 1.2rem; /* Ajustamos el tamaño del círculo */
        height: 1.2rem;
        border-radius: 50%;
        background-color: gray; /* Color por defecto */
        margin-right: 10px;
        transition: background-color 0.5s ease; /* Animación para el color */
      }

      .status-text {
        font-size: 16px;
        font-weight: bold;
        transition: color 0.5s ease; /* Animación para el texto */
      }
      </style>
      <div class="flex">
        <div class="status-circle"></div>
        <span class="status-text">${this._message}</span>
      </div>
    `;
  }

  // Observar el atributo 'status' para detectar cambios
  static get observedAttributes() {
    return ['status'];
  }

  // Callback que se llama cuando el atributo cambia
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'status') {
      this._status = newValue;
      this._updateStatus();
    }
  }

  // Función que actualiza el estado y el color del círculo
  _updateStatus() {
    const circle = this.shadowRoot.querySelector('.status-circle');
    const text = this.shadowRoot.querySelector('.status-text');
    
    switch (this._status) {
      case 'disconnected':
        circle.style.backgroundColor = 'gray';
        text.textContent = 'Desconectado';
        text.style.color = 'gray'; // Cambiar color del texto a gris
        break;
      case 'connecting':
        circle.style.backgroundColor = 'yellow';
        text.textContent = 'Conectando...';
        text.style.color = 'orange'; // Cambiar color del texto a amarillo
        break;
      case 'connected':
        circle.style.backgroundColor = 'green';
        text.textContent = 'Conectado';
        text.style.color = 'green'; // Cambiar color del texto a verde
        break;
      default:
        circle.style.backgroundColor = 'gray';
        text.textContent = 'Desconectado';
        text.style.color = 'gray'; // Cambiar color del texto a gris
        break;
    }
  }
}

// Registramos el componente customizado
customElements.define('connection-status', ConnectionStatus);

class CustomColorPicker extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.selectedColor = '#000000';
      this.render();
  }

  get value() {
      return this.selectedColor;
  }

  set value(newValue) {
      this.selectedColor = newValue;
      this.updateColorPreview();
  }

  render() {
      this.shadowRoot.innerHTML = /*html*/`
          <style>
              :host {
                  display: block;
              }
              
              .color-picker-container {
                  display: flex;
                  align-items: center;
                  gap: 10px;
              }

              .color-preview-input {
                  position: relative;
                  width: 50px;
                  height: 50px;
                  cursor: pointer;
              }

              input[type="color"] {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 0;
                  cursor: pointer;
              }

              .color-preview {
                  width: 100%;
                  height: 100%;
                  border: 2px solid #ccc;
                  border-radius: 4px;
                  background-color: ${this.selectedColor};
              }

              .color-value {
                  font-family: monospace;
                  padding: 5px 10px;
                  border-radius: 4px;
                  font-size: 14px;
              }
              @media (width < 500px) {
                .color-picker-container {
                  display: grid;
                  width: 100%;
                }
                .color-preview-input{
                  justify-self: center;
                  justify-content: center;
                }
              }
          </style>

          <div class="color-picker-container">
              <div class="color-preview-input">
                  <div class="color-preview"></div>
                  <input type="color" value="${this.selectedColor}">
              </div>
              <span class="color-value">${this.selectedColor}</span>
          </div>
      `;

      this.setupEventListeners();
  }

  setupEventListeners() {
      const colorInput = this.shadowRoot.querySelector('input[type="color"]');
      colorInput.addEventListener('input', (e) => {
          this.selectedColor = e.target.value;
          this.updateColorPreview();
          this.dispatchEvent(new CustomEvent('change', {
              detail: { value: this.selectedColor }
          }));
      });
  }

  updateColorPreview() {
      const preview = this.shadowRoot.querySelector('.color-preview');
      const valueDisplay = this.shadowRoot.querySelector('.color-value');
      const colorInput = this.shadowRoot.querySelector('input[type="color"]');
      
      if (preview && valueDisplay && colorInput) {
          preview.style.backgroundColor = this.selectedColor;
          valueDisplay.textContent = this.selectedColor;
          colorInput.value = this.selectedColor;
      }
  }
}

// Registrar el componente
customElements.define('custom-color-picker', CustomColorPicker);
class Queue {
  constructor() {
    this.items = [];
    this.currentIndex = -1;
  }

  enqueue(element) {
    this.items.push(element);
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getCurrent() {
    if (this.currentIndex >= 0 && this.currentIndex < this.items.length) {
      return this.items[this.currentIndex];
    }
    return null;
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      return this.getCurrent();
    }
    return null;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.getCurrent();
    }
    return null;
  }

  hasMore() {
    return this.currentIndex < this.items.length - 1;
  }
}

class Controlmedia {
  constructor(audioPlayer) {
    this.audioPlayer = audioPlayer;
    this.songQueue = new Queue();
    this.isPlaying = false;
  }

  nextAudio() {
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
    if (!this.songQueue.isEmpty() && this.songQueue.next()) {
      this.playNextAudio();
    } else {
      this.isPlaying = false;
    }
  }

  playNextAudio() {
    const audioUrl = this.songQueue.getCurrent();
    if (audioUrl) {
      this.audioPlayer.src = audioUrl;
      this.audioPlayer.load();
      this.audioPlayer.play();
    }
  }

  playPreviousAudio() {
    const audioUrl = this.songQueue.previous();
    if (audioUrl) {
      this.audioPlayer.src = audioUrl;
      this.audioPlayer.load();
      this.audioPlayer.play();
    }
  }

  addSong(audioUrl) {
    if (audioUrl) {
      this.songQueue.enqueue(audioUrl);
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.kickstartPlayer();
      }
    }
  }

  kickstartPlayer() {
    this.songQueue.next(); // Comenzar en la primera canción
    this.isPlaying = true;
    this.playNextAudio();

    this.audioPlayer.onended = () => {
      this.nextAudio();
    };
  }
}

class AudioPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.audioElement = document.createElement('audio');
    this.controlmedia = new Controlmedia(this.audioElement);
    this.render();
    this.setupEventListeners();
  }

  addToQueue(source) {
    this.controlmedia.addSong(source);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .audio-player {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1rem;
        }
        .audio-player button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 0.5rem;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 1rem;
          cursor: pointer;
        }
        .audio-player input[type="range"] {
          width: 200px;
        }
      </style>
      <div class="audio-player">
        <button id="prev-btn">Prev</button>
        <button id="play-btn">Play</button>
        <button id="next-btn">Next</button>
        <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="0.5">
      </div>
    `;
    this.playBtn = this.shadowRoot.getElementById('play-btn');
    this.prevBtn = this.shadowRoot.getElementById('prev-btn');
    this.nextBtn = this.shadowRoot.getElementById('next-btn');
    this.volumeSlider = this.shadowRoot.getElementById('volume-slider');
  }

  setupEventListeners() {
    this.playBtn.addEventListener('click', () => {
      if (this.audioElement.paused) {
        this.controlmedia.playNextAudio();
      } else {
        this.audioElement.pause();
      }
    });

    this.prevBtn.addEventListener('click', () => {
      this.controlmedia.playPreviousAudio();
    });

    this.nextBtn.addEventListener('click', () => {
      this.controlmedia.nextAudio();
    });

    this.volumeSlider.addEventListener('input', (event) => {
      this.audioElement.volume = event.target.value;
    });
  }
}

customElements.define('audio-player', AudioPlayer);

class ImageUrlInputComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Estructura y estilos del componente
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: auto;
          gap: 0.2rem;
          max-width: 28rem;
          width: auto;
        }
        .url-input {
          padding: 8px;
          width: 90%;
          margin: auto;
          background-color: #333;
          color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .preview {
          display: none;
          max-width: 100%;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin: auto;
          max-width: 10rem;
        }
        .error {
          color: red;
          font-size: 0.9em;
          margin-top: 5px;
        }
        .suggestions {
          display: none;
          border: 1px solid #ccc;
          background-color: #fff;
          color: #333;
          border-radius: 4px;
          width: 100%;
          max-height: 100px;
          overflow-y: auto;
          margin-top: 0;
          font-size: 0.9em;
        }
        .suggestion-item {
          padding: 8px;
          cursor: pointer;
        }
        .suggestion-item:hover {
          background-color: #f0f0f0;
        }
      </style>
      <div class="container">
        <input type="text" class="url-input" placeholder="Pega el enlace de la imagen aquí">
        <div class="suggestions"></div>
        <img class="preview" alt="Vista previa de la imagen">
        <div class="error"></div>
      </div>
    `;

    this.urlInput = this.shadowRoot.querySelector('.url-input');
    this.suggestionsDiv = this.shadowRoot.querySelector('.suggestions');
    this.previewImage = this.shadowRoot.querySelector('.preview');
    this.errorDiv = this.shadowRoot.querySelector('.error');

    // Eventos
    this.urlInput.addEventListener('focus', this.showSuggestions.bind(this));
    this.urlInput.addEventListener('blur', this.hideSuggestions.bind(this));
    this.urlInput.addEventListener('input', this.handleInputChange.bind(this));
  }

  connectedCallback() {
    this.updateSuggestions();
  }

  handleInputChange() {
    const url = this.urlInput.value.trim();
    this.clearError();
    this.previewImage.style.display = 'none';

    if (url) {
      this.validateAndDisplayImage(url);
    }
  }

  validateAndDisplayImage(url) {
    const img = new Image();
    img.onload = () => {
      this.previewImage.src = url;
      this.previewImage.style.display = 'block';
      this.saveUrl(url);
      this.dispatchUrlEvent(url);
    };
    img.onerror = () => this.showError("La URL proporcionada no es una imagen válida.");
    img.src = url;
  }

  showError(message) {
    this.errorDiv.textContent = message;
  }

  clearError() {
    this.errorDiv.textContent = '';
  }

  dispatchUrlEvent(url) {
    const urlEvent = new CustomEvent('image-url-selected', {
      detail: { url },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(urlEvent);
  }

  saveUrl(url) {
    let urls = JSON.parse(localStorage.getItem('recentUrls')) || [];
    urls = [url, ...urls.filter((u) => u !== url)].slice(0, 5);
    localStorage.setItem('recentUrls', JSON.stringify(urls));
    this.updateSuggestions();
  }

  updateSuggestions() {
    const urls = JSON.parse(localStorage.getItem('recentUrls')) || [];
    this.suggestionsDiv.innerHTML = urls.map((url) => `
      <div class="suggestion-item" data-url="${url}">${url}</div>
    `).join('');

    // Asigna un evento a cada sugerencia para colocarla en el input al hacer clic
    this.suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', (event) => {
        const selectedUrl = event.currentTarget.getAttribute('data-url');
        this.setInputValue(selectedUrl);
        this.hideSuggestions();
      });
    });
  }

  showSuggestions() {
    this.suggestionsDiv.style.display = 'block';
  }

  hideSuggestions() {
    setTimeout(() => { // Retraso para permitir el click en la sugerencia
      this.suggestionsDiv.style.display = 'none';
    }, 100);
  }

  setInputValue(url) {
    this.urlInput.value = url;
    this.handleInputChange();
  }
}

customElements.define('image-url-input-component', ImageUrlInputComponent);
// Función auxiliar para generar un color aleatorio (sin cambios)
function getRandomColor(string) {
  let randomChar = string ||Math.random().toString(36).substring(2, 15);
  return getColorByChar(randomChar);
  //return '#' + Math.floor(Math.random()*16777215).toString(16);
}
function getColorByChar(char) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  // Asignar un índice único para cada carácter del alfabeto
  const lowerChar = char.toLowerCase();
  const index = alphabet.indexOf(lowerChar);

  // Si no es un carácter alfabético, devuelve un color por defecto
  if (index === -1) return '#ff5733'; // Ejemplo de color por defecto

  // Convertir índice a un color HSL saturado y con luminosidad moderada
  const hue = (index / alphabet.length) * 360; // Distribuir colores uniformemente en el espectro
  const saturation = 85; // Alta saturación
  const lightness = 45; // Moderada luminosidad para evitar tonos muy claros o muy oscuros

  // Convertir HSL a HEX
  return hslToHex(hue, saturation, lightness);
}

// Función para convertir HSL a HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
class MessageContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: relative;
        }
        .messages-wrapper {
          position: relative;
          min-height: 100%;
          max-height: 280px;
          overflow-y: auto;
        }
        .maxh-5rem {max-height: 5rem !important;}
        .maxh-10rem {max-height: 10rem !important;}
        .maxh-15rem {max-height: 15rem !important;}
        .maxh-20rem {max-height: 20rem !important;}
        .maxh-25rem {max-height: 25rem !important;}
        .maxh-30rem {max-height: 30rem !important;}
      </style>
      <div class="messages-wrapper" id="messagesWrapper">
        <slot></slot>
      </div>
    `;

    this.messagesWrapper = this.shadowRoot.querySelector('#messagesWrapper');
  }

  connectedCallback() {
    // Aplicar clases desde un atributo
    if (this.hasAttribute('wrapper-classes')) {
      this.messagesWrapper.className += ` ${this.getAttribute('wrapper-classes')}`;
    }

    // Aplicar estilo dinámico desde un atributo
    if (this.hasAttribute('wrapper-style')) {
      this.messagesWrapper.style.cssText += this.getAttribute('wrapper-style');
    }

    // Observador para detectar cambios en el contenedor principal
    if (this.messagesWrapper) {
      const observer = new MutationObserver(() => {
        this.scrollToBottom();
      });
      observer.observe(this.messagesWrapper, { childList: true });
    }
  }

  addMessage(messageData, autoHide = false) {
    const message = document.createElement('chat-message');

    message.setMessageData(messageData);
    this.messagesWrapper.appendChild(message);
    this.scrollToBottom();
    if (autoHide) message.setAutoHide(3000);
  }

  scrollToBottom() {
    this.messagesWrapper.scrollTop = this.messagesWrapper.scrollHeight;
  }
}

class ChatMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._menuOptions = [];
    this._createMenuPortal();

    // Sistema de seguimiento de posición
    this._positionTracker = {
      scrollListeners: new Set(),
      resizeObserver: null,
      intersectionObserver: null,
    };
  }

  connectedCallback() {
    this._setupPositionTracking();
    this._handleClickOutside = this._handleClickOutside.bind(this);
    document.addEventListener('click', this._handleClickOutside);
    const autoHideAttr = this.getAttribute('auto-hide');
    if (autoHideAttr) {
      this.setAutoHide(Number(autoHideAttr));
    }
  }

  disconnectedCallback() {
    this._cleanupPositionTracking();
    document.removeEventListener('click', this._handleClickOutside);
    if (this._menuPortal && this._menuPortal.parentNode) {
      this._menuPortal.parentNode.removeChild(this._menuPortal);
    }
  }

  _createMenuPortal() {
    this._menuPortal = document.createElement('div');
    this._menuPortal.className = 'menu-portal';
    Object.assign(this._menuPortal.style, {
      position: 'fixed',
      zIndex: '1000',
      display: 'none',
      pointerEvents: 'none' // Importante: permite clicks a través del contenedor
    });
    
    this._menuPortal.innerHTML = `
      <style>
        .menu-options {
          position: absolute;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          min-width: 120px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          pointer-events: auto; /* Restaura interactividad solo para el menú */
        }
        .menu-option {
          padding: 8px 12px;
          cursor: pointer;
          background: none;
          border: none;
          text-align: left;
          width: 100%;
          font-family: inherit;
          font-size: 14px;
          color: #333;
        }
        .menu-option:hover {
          background-color: #f0f0f0;
        }
      </style>
      <div class="menu-options" role="menu"></div>
    `;
    
    document.body.appendChild(this._menuPortal);
  }

  _setupPositionTracking() {
    // 1. Rastrear todos los contenedores con scroll
    this._trackScrollContainers();
    
    // 2. Observar cambios en el tamaño
    this._setupResizeObserver();
    
    // 3. Observar visibilidad
    this._setupIntersectionObserver();
  }

  _trackScrollContainers() {
    // Encontrar todos los contenedores con scroll hasta el root
    let element = this.parentElement;
    while (element && element !== document.body) {
      if (this._hasScrollableOverflow(element)) {
        element.addEventListener('scroll', () => this._updateMenuPosition());
        this._positionTracker.scrollListeners.add(element);
      }
      element = element.parentElement;
    }
    
    // También rastrear scroll del window
    window.addEventListener('scroll', () => this._updateMenuPosition());
    this._positionTracker.scrollListeners.add(window);
  }

  _hasScrollableOverflow(element) {
    const style = window.getComputedStyle(element);
    return ['auto', 'scroll'].includes(style.overflowY) || 
           ['auto', 'scroll'].includes(style.overflow);
  }

  _setupResizeObserver() {
    this._positionTracker.resizeObserver = new ResizeObserver(() => {
      this._updateMenuPosition();
    });
    this._positionTracker.resizeObserver.observe(this);
  }

  _setupIntersectionObserver() {
    this._positionTracker.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting && this._menuPortal.style.display !== 'none') {
          this._hideMenu();
        }
      },
      { threshold: 0 }
    );
    this._positionTracker.intersectionObserver.observe(this);
  }

  _cleanupPositionTracking() {
    // Limpiar listeners de scroll
    this._positionTracker.scrollListeners.forEach(element => {
      if (element === window) {
        window.removeEventListener('scroll', () => this._updateMenuPosition());
      } else {
        element.removeEventListener('scroll', () => this._updateMenuPosition());
      }
    });
    this._positionTracker.scrollListeners.clear();
    
    // Desconectar observers
    if (this._positionTracker.resizeObserver) {
      this._positionTracker.resizeObserver.disconnect();
    }
    if (this._positionTracker.intersectionObserver) {
      this._positionTracker.intersectionObserver.disconnect();
    }
  }

  _updateMenuPosition() {
    if (!this._menuPortal || this._menuPortal.style.display === 'none') return;

    const buttonRect = this.shadowRoot.querySelector('.menu-button').getBoundingClientRect();
    const menuOptions = this._menuPortal.querySelector('.menu-options');
    
    // Verificar si el botón está visible en la ventana
    if (buttonRect.top < 0 || 
        buttonRect.bottom > window.innerHeight ||
        buttonRect.left < 0 || 
        buttonRect.right > window.innerWidth) {
      this._hideMenu();
      return;
    }

    // Calcular la mejor posición para el menú
    const viewportHeight = window.innerHeight;
    const menuHeight = menuOptions.offsetHeight;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const showBelow = spaceBelow >= menuHeight || buttonRect.top < menuHeight;
    // Posicionar el menú
    Object.assign(this._menuPortal.style, {
      top: showBelow ? `${buttonRect.bottom}px` : `${buttonRect.top - menuHeight}px`,
      left: `${Math.min(buttonRect.right, window.innerWidth - menuOptions.offsetWidth)}px`
    });
  }

  _handleClickOutside(event) {
    if (!this._menuPortal.contains(event.target) && 
        !this.shadowRoot.querySelector('.menu-button').contains(event.target)) {
      this._hideMenu();
    }
  }
    // Método para configurar el auto-ocultamiento
  setAutoHide(timeout) {
    if (typeof timeout === 'number' && timeout > 0) {
      setTimeout(() => {
        this._startFadeOut();
      }, timeout);
    }
  }

  _startFadeOut() {
    // Agregar la clase de desvanecimiento
    this.classList.add('fade-out');

    // Esperar al final de la animación para ocultar completamente el elemento
    const animationDuration = parseFloat(
      getComputedStyle(this).getPropertyValue('--fade-duration') || '1'
    ) * 1000;

    setTimeout(() => {
      this.style.display = 'none';
    }, animationDuration);
  }
  static get observedAttributes() {
    return ['auto-hide'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'auto-hide' && newValue) {
      this.setAutoHide(Number(newValue));
    }
  }
  setMessageData(data) {
    const { user, content, menu } = data;
    this._data = { user, content };
    this._menuOptions = (menu && Array.isArray(menu.options)) ? menu.options : [];
    this.renderMessage(user, content);
    this.setupMenu();
  }

  renderMessage(user, content) {
    const bgColor = user.photo ? '' : getRandomColor(user.name.charAt(0).toUpperCase());
    const initial = user.photo ? '' : user.name.charAt(0).toUpperCase();
  
    this.shadowRoot.innerHTML = /*html*/`
      <style>
        :host {
          display: flex;
          margin-bottom: 10px;
          position: relative;
        }
        img {
          max-width: 100%;
          max-height: 250px;
          height: auto;
          width: auto;
          display: block;
          margin-bottom: 5px; /* Espaciado entre imagen y texto */
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }
        .message-content {
          display: flex;
          flex-direction: column; /* Elementos en columna */
          flex-grow: 1;
          margin-right: 30px;
          padding:0;
          gap: 0;
        }
        p {
          margin: 0;
          padding: 0;
        }
        .bottom-right-0 {
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .menu-button {
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
          padding: 5px;
          background: none;
          border: none;
          font-size: 16px;
          color: #666;
          transition: color 0.2s;
        }
        .menu-button:hover {
          color: #333;
        }
      </style>
      <div class="avatar" role="img" aria-label="User avatar">${initial}</div>
      <div class="message-content"></div>
      <button class="menu-button" role="button" aria-haspopup="true" aria-expanded="false">⋮</button>
    `;
  
    const avatar = this.shadowRoot.querySelector('.avatar');
    if (user.photo) {
      avatar.style.backgroundImage = `url(${user.photo})`;
      avatar.style.backgroundSize = 'cover';
    } else {
      avatar.style.backgroundColor = bgColor;
    }
  
    const messageContent = this.shadowRoot.querySelector('.message-content');
    console.log("content webcomponent",content)
    content.forEach(item => {
      const messageItem = document.createElement('div');
      const classNameitem = item.class ? item.class : 'message-item';
      messageItem.className = `${classNameitem}`;
  
      if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.value;
        img.alt = `message image`;
        messageItem.appendChild(img);
      }
  
      if (item.type === 'text') {
        const p = document.createElement('p');
        p.textContent = item.value;
        p.className = `message-text ${classNameitem}`;
        messageItem.appendChild(p);
      }
      if (item.type === 'url') {
        const a = document.createElement('a')
        a.href = item.url;
        a.textContent = item.value;
        a.className = `message-text ${classNameitem}`;
        messageItem.appendChild(a);
      }
      messageContent.appendChild(messageItem);
    });
  }
  

  setupMenu() {
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    const menuOptions = this._menuPortal.querySelector('.menu-options');

    // Limpiar opciones anteriores
    menuOptions.innerHTML = '';

    // Agregar nuevas opciones
    this._menuOptions.forEach(option => {
      if (typeof option.callback === 'function') {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('menu-option');
        button.setAttribute('role', 'menuitem');
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          option.callback(this.getMessageData());
          this._hideMenu();
        });
        menuOptions.appendChild(button);
      }
    });

    // Manejar clicks en el botón del menú
    menuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      
      if (!isExpanded) {
        this._showMenu();
      } else {
        this._hideMenu();
      }
    });
  }

  _showMenu() {
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    menuButton.setAttribute('aria-expanded', 'true');
    this._menuPortal.style.display = 'block';
    this._updateMenuPosition();
  }

  _hideMenu() {
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    menuButton.setAttribute('aria-expanded', 'false');
    this._menuPortal.style.display = 'none';
  }

  getMessageData() {
    return this._data;
  }

  getRandomColor() {
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#F44336', '#FF9800'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

customElements.define('chat-message', ChatMessage);
customElements.define('message-container', MessageContainer);

class LocalStorageManager {
  constructor(key) {
    this.key = key;
    this.initializeStorage();
  }

  async initializeStorage() {
    try {
      const currentData = await this.getAll();
      if (!currentData.length) {
        await this.saveItems([]);
      }
    } catch (error) {
      this.handleError('Error initializing storage', error);
    }
  }

  deepCopy(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      this.handleError('Error creating deep copy', error);
      return null;
    }
  }

  // Método para generar un nuevo ID único o reusar un ID existente
  generateUniqueId(items, proposedId = null) {
    // Convertir ID a número si es un string
    proposedId = proposedId !== null ? Number(proposedId) : null;

    const existingIds = new Set(items.map(item => item.id));
    
    // Encontrar espacios vacíos
    const findEmptySpace = () => {
      for (let i = 0; i <= items.length; i++) {
        if (!existingIds.has(i)) {
          return i;
        }
      }
      return items.length;
    };

    // Si se propone un ID específico
    if (proposedId !== null) {
      // Si el ID propuesto no existe, usarlo
      if (!existingIds.has(proposedId)) {
        return proposedId;
      }
      
      // Buscar el primer espacio vacío
      return findEmptySpace();
    }
    
    // Si no hay ID propuesto, encontrar el primer espacio vacío
    return findEmptySpace();
  }

  // Método para asegurar que un objeto tenga un ID único
  ensureObjectHasId(item, items) {
    const itemCopy = this.deepCopy(item);
    
    // Convertir ID a número si es un string
    if (itemCopy.id !== undefined) {
      itemCopy.id = Number(itemCopy.id);
    }
    
    // Generar o ajustar el ID
    itemCopy.id = this.generateUniqueId(items, itemCopy.id);
    
    return itemCopy;
  }

  async add(item) {
    try {
      const items = await this.getAll();
      
      // Aseguramos que el item tenga un ID único
      const itemWithId = this.ensureObjectHasId(item, items);
      
      // Verificamos si ya existe un objeto similar
      const exists = items.some(existingItem =>
        this.areObjectsEqual(existingItem, itemWithId)
      );
      
      if (!exists) {
        items.push(itemWithId);
        await this.saveItems(items);
        return itemWithId.id;
      }
      
      return false;
    } catch (error) {
      this.handleError('Error adding item', error);
    }
  }

  // Los demás métodos permanecen igual que en la versión anterior
  async remove(identifier) {
    try {
      const items = await this.getAll();
      // Convertir identificador a número si es posible
      const numIdentifier = isNaN(Number(identifier)) ? identifier : Number(identifier);
      
      const updatedItems = items.filter(item =>
        item.id !== numIdentifier && item.name !== numIdentifier
      );
      
      if (updatedItems.length !== items.length) {
        await this.saveItems(updatedItems);
        return true;
      }
      return false;
    } catch (error) {
      this.handleError('Error removing item', error);
    }
  }

  async get(identifier) {
    try {
      const items = await this.getAll();
      // Convertir identificador a número si es posible
      const numIdentifier = isNaN(Number(identifier)) ? identifier : Number(identifier);
      
      const item = items.find(item =>
        item.id === numIdentifier || item.name === numIdentifier
      );
      
      return item ? this.deepCopy(item) : null;
    } catch (error) {
      this.handleError('Error getting item', error);
    }
  }

  async getAll() {
    try {
      const items = localStorage.getItem(this.key);
      return items ? this.deepCopy(JSON.parse(items)) : [];
    } catch (error) {
      this.handleError('Error getting all items', error);
    }
  }

  async saveItems(items) {
    try {
      const itemsCopy = this.deepCopy(items);
      localStorage.setItem(this.key, JSON.stringify(itemsCopy));
    } catch (error) {
      this.handleError('Error saving items', error);
    }
  }

  async clear() {
    try {
      await this.saveItems([]);
    } catch (error) {
      this.handleError('Error clearing storage', error);
    }
  }

  async exists(item) {
    try {
      const items = await this.getAll();
      const itemWithId = this.ensureObjectHasId(item, items);
      
      return items.some(existingItem =>
        this.areObjectsEqual(existingItem, itemWithId)
      );
    } catch (error) {
      this.handleError('Error checking existence', error);
    }
  }

  areObjectsEqual(obj1, obj2) {
    try {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    } catch (error) {
      this.handleError('Error comparing objects', error);
      return false;
    }
  }

  handleError(message, error) {
    console.error(message, error);
    throw error;
  }
}
class GridContainer extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.items = new Map(); // Usamos Map para mantener un registro de elementos con ID
      this.nextId = 0; // Counter para generar IDs únicos
      this.render();
  }

    render() {
      this.shadowRoot.innerHTML = /*html */`
          <style>
              :host {
                  display: block;
                  width: 100%;
              }
              :host(.dark-mode) {
                  background-color: #1a202c;
                  color: #f7fafc;
              }
              .container {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(200px, auto));
                  gap: 1rem;
                  height: 100dvh;
                  padding: 1rem;
                  overflow-y: auto;
              }
              .search-container {
                  padding: 1rem;
              }
              input {
                  width: 100%;
                  padding: 0.5rem;
                  border: 1px solid #e2e8f0;
                  border-radius: 0.25rem;
                  margin-bottom: 1rem;
                  background-color: #ffffff;
                  color: #1a202c;
              }
              :host(.dark-mode) input {
                  background-color: #2d3748;
                  color: #f7fafc;
                  border: 1px solid #4a5568;
              }
              .grid-item {
                  background-color: #ffffff;
                  border: 1px solid #e2e8f0;
                  border-radius: 0.5rem;
                  padding: 1rem;
                  cursor: pointer;
                  max-width: 25rem;
                  transition: transform 0.2s, background-color 0.2s;
              }
              .grid-item:hover {
                  transform: scale(1.02);
              }
              :host(.dark-mode) .grid-item {
                  background-color: #2d3748;
                  border: 1px solid #4a5568;
              }
              .grid-item img, .grid-item video {
                  width: 100%;
                  height: auto;
                  object-fit: cover;
                  border-radius: 0.25rem;
                  margin-bottom: 0.5rem;
              }
              .item-content {
                    position: relative;
                }

                .delete-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: rgba(255, 0, 0, 0.7);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .delete-btn:hover {
                    background-color: rgba(255, 0, 0, 0.9);
                }

                .delete-btn.hidden {
                    display: none !important;
                }
              .hidden {
                  display: none !important;
              }
          </style>
          <div class="search-container">
              <input type="text" placeholder="Buscar elementos..." class="search-input">
          </div>
          <div class="container"></div>
      `;

      this.container = this.shadowRoot.querySelector('.container');
      this.searchInput = this.shadowRoot.querySelector('.search-input');

      this.searchInput.addEventListener('input', (e) => {
          this.filterItems(e.target.value);
      });
  }

  toggleDarkMode(isDark) {
    if (isDark) {
        this.classList.add('dark-mode');
    } else {
        this.classList.remove('dark-mode');
    }
  }

  filterItems(searchText) {
    this.items.forEach((itemData, id) => {
        const input = itemData.element.querySelector('.content');
        const text = input ? input.value.toLowerCase() : '';
        const searchLower = searchText.toLowerCase();
        
        if (text.includes(searchLower)) {
            itemData.element.classList.remove('hidden');
        } else {
            itemData.element.classList.add('hidden');
        }
    });
}

  // Método para añadir un nuevo elemento
  addItem(content, mediaUrl = '', mediaType = '', additionalData = {}) {
    const id = this._generateId();
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.dataset.id = id;
    
    let mediaElement = '';
    if (mediaUrl) {
        if (mediaType.includes('video')) {
            mediaElement = `<video src="/media/${mediaUrl}" controls></video>`;
        } else {
            mediaElement = `<img src="/media/${mediaUrl}" alt="${content || 'Item media'}">`;
        }
    }

    item.innerHTML = `
        <div class="item-content">
            ${mediaElement}
            <input class="content" type="text" value="${content}" readonly>
            <button class="delete-btn hidden">🗑️</button>
        </div>
    `;

    // Añadir eventos de hover para mostrar/ocultar botón de eliminar
    item.addEventListener('mouseenter', () => {
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.classList.remove('hidden');
    });

    item.addEventListener('mouseleave', () => {
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.classList.add('hidden');
    });

    // Evento para eliminar el elemento
    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se dispare el evento de click del item
        this.removeItem(id);
    });

    item.addEventListener('click', () => {
        const detail = {
            id,
            content,
            mediaUrl,
            mediaType,
            additionalData,
        };
        
        const event = new CustomEvent('itemClick', {
            detail,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    });

    this.container.appendChild(item);
    this.items.set(id, {
        element: item,
        content,
        mediaUrl,
        mediaType
    });
    this._emitchanges();
    return id;
  }
  _emitchanges() {
    this.dispatchEvent(new CustomEvent('change', {
                    detail: this.getAllItems(),
                    bubbles: true,
                    composed: true
                }));
  }
  // Método para limpiar todos los elementos
  clearAll() {
      this.container.innerHTML = '';
      this.items.clear();
      this.nextId = 0;
  }

  // Método para modificar un elemento específico
  updateItem(id, newContent, newMediaUrl = '', newMediaType = '') {
      const itemData = this.items.get(id);
      if (!itemData) {
          throw new Error(`No se encontró el elemento con ID: ${id}`);
      }

      let mediaElement = '';
      if (newMediaUrl) {
          if (newMediaType === 'video') {
              mediaElement = `<video src="${newMediaUrl}" controls></video>`;
          } else {
              mediaElement = `<img src="${newMediaUrl}" alt="Item media">`;
          }
      }

      itemData.element.innerHTML = `
          ${mediaElement}
          <div class="content">${newContent}</div>
      `;

      // Actualizar los datos almacenados
      itemData.content = newContent;
      itemData.mediaUrl = newMediaUrl;
      itemData.mediaType = newMediaType;
  }

  // Método para eliminar un elemento específico
  removeItem(id) {
      const itemData = this.items.get(id);
      if (!itemData) {
          throw new Error(`No se encontró el elemento con ID: ${id}`);
      }

      itemData.element.remove();
      this.items.delete(id);

      // Emitir evento de eliminación
      const event = new CustomEvent('itemRemoved', {
          detail: { id, element: itemData },
          bubbles: true,
          composed: true
      });
      this.dispatchEvent(event);
      this._emitchanges();
  }

  // Método para obtener todos los elementos
  getAllItems() {
      const items = {};
      this.items.forEach((value, key) => {
          items[key] = {
              content: value.content,
              mediaUrl: value.mediaUrl,
              mediaType: value.mediaType
          };
      });
      return items;
  }

  // Método privado para generar IDs únicos
  _generateId() {
      return `item-${this.nextId++}`;
  }
}

// Registrar el componente
customElements.define('grid-container', GridContainer);
class DragAndDropComponent extends HTMLElement {
  constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
          .drop-area {
              border: 2px dashed #ccc;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
              color: #666;
              font-family: Arial, sans-serif;
              transition: all 0.3s ease;
              cursor: pointer;
          }
          .drop-area:hover, .drop-area:active {
              background-color: #f0f8ff;
              border-color: #666;
          }
          .drop-area.highlight {
              background-color: #f0f8ff;
          }
          input[type="file"] {
              display: none;
          }
          label {
              display: block;
              width: 100%;
              height: 100%;
              cursor: pointer;
          }
      `;

      const container = document.createElement('div');
      container.classList.add('drop-area');

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.id = 'fileInput';
      
      const label = document.createElement('label');
      label.htmlFor = 'fileInput';
      label.textContent = 'Arrastra y suelta archivos aquí o haz clic para seleccionar';

      fileInput.addEventListener('change', (e) => {
          const files = e.target.files;
          const event = new CustomEvent('change', {
                detail: files,
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
          for (const file of files) {
              processDroppedFile(file, e);
              const event = new CustomEvent('DroppedFile', {
                  detail: { file },
                  bubbles: true,
                  composed: true
              });
              this.dispatchEvent(event);
          }
      });

      container.appendChild(label);
      container.appendChild(fileInput);
      
      shadow.appendChild(style);
      shadow.appendChild(container);

      this.setupDragAndDrop(container);
  }

  setupDragAndDrop(dropArea) {
      const preventDefaults = (e) => {
          e.preventDefault();
          e.stopPropagation();
      };

      const highlight = () => dropArea.classList.add('highlight');
      const unhighlight = () => dropArea.classList.remove('highlight');

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
          dropArea.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, unhighlight, false);
      });

      dropArea.addEventListener('drop', this.handleDrop.bind(this), false);
  }

  handleDrop(e) {
      const files = e.dataTransfer.files;
      for (const file of files) {
          processDroppedFile(file,e);
          const event = new CustomEvent('DroppedFile', {
            detail: { file },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
      }
  }
  
}
const filePaths = new LocalStorageManager('filePaths');
(async () => {
  const files = await filePaths.getAll();
  console.log(files);
 
  /*
  const galeriaElementos = document.querySelector('galeria-elementos');
  galeriaElementos.addEventListener('elemento-agregado', (e) => {
      console.log('Elemento agregado:', e.detail);
  });

  galeriaElementos.addEventListener('elemento-eliminado', (e) => {
      console.log('Elemento eliminado:', e.detail);
  });
  files.forEach(file => galeriaElementos.agregarElemento(file));
galeriaElementos.agregarElemento({
          nombre: 'archivo.txt',
          path: 'c:/user/example/archivo.txt',
          size: 123456,
          type: 'text/plain',
          lastModified: 1679488000000
      });
      galeriaElementos.agregarElemento({
          nombre: 'archivo.img',
          path: 'c:/user/example/archivo.img',
          size: 123456,
          type: 'image/webp',
          lastModified: 1679488000000
      });
      galeriaElementos.agregarElemento({
          nombre: 'video.mp4',
          path: 'c:/user/example/video.mp4',
          size: 9876543,
          type: 'video/mp4',
          lastModified: 1679488000000
      }); */
})();
async function processDroppedFile(file,e) {
  if (file.path) {
      await processFileWithPath(file);
  } else {
      await processFileWithoutPath(file);
  }
}
async function processFileWithPath(file) {
  console.log('Archivo cargado:', file);
  filePaths.add(parseFile(file));
  console.log(filePaths.getAll());
}
async function processFileWithoutPath(file) {
  console.log('processFileWithoutPath Archivo cargado:', file);
  if (electron && file){ 
      const filePath = electron.showFilePath(file);
      Object.assign(file, { path: filePath });
      filePaths.add(parseFile(file));
      const allFiles = await filePaths.getAll();
      console.log("processFileWithoutPath",allFiles, file);
  } else {    
      console.log('No se pudo obtener la ruta del archivo');
  }
}

function parseFile(file) {
  const filePath = file.path;
  return {
      nombre: file.name,
      path: filePath,
      size: file.size,
      type: file.type,
  };
}
customElements.define('drag-and-drop', DragAndDropComponent);
class GaleriaElementos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('galeria-elementos-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.elementos = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchBar = this.shadowRoot.querySelector('.search-bar');
        searchBar.addEventListener('input', () => this.filtrarElementos());

        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const nombre = e.target.dataset.nombre;
                const id = e.target.dataset.id;
                this.borrarElemento(nombre, id);
            }
        });
    }

    agregarElemento(elemento) {
        this.elementos.push(elemento);
        this.renderizarElementos();

        // Disparar un evento personalizado cuando se agrega un elemento
        const event = new CustomEvent('elemento-agregado', {
            detail: { elemento },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    borrarElemento(nombre, id) {
        this.elementos = this.elementos.filter(elem => elem.nombre !== nombre) || this.elementos.filter(elem => elem.id !== id);
        this.renderizarElementos();
        const event = new CustomEvent('elemento-eliminado', {
            detail: { id, nombre },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    obtenerElementoPorNombre(nombre) {
        return this.elementos.find(elem => elem.nombre === nombre);
    }

    obtenerElementoPorId(id) {
        return this.elementos.find(elem => elem.id === id);
    }

    filtrarElementos() {
        const searchTerm = this.shadowRoot.querySelector('.search-bar').value.toLowerCase();
        const elementosFiltrados = this.elementos.filter(elem => 
            elem.nombre.toLowerCase().includes(searchTerm) ||
            elem.path.toLowerCase().includes(searchTerm)
        );
        this.renderizarElementos(elementosFiltrados);
    }

    renderizarElementos(elementos = this.elementos) {
        const gallery = this.shadowRoot.querySelector('.gallery');
        gallery.innerHTML = '';

        elementos.forEach(elem => {
            const item = document.createElement('div');
            item.className = 'item';

            const icon = this.getIconForType(elem.type, elem.path);
            const size = this.formatSize(elem.size);
            const date = new Date(elem.lastModified).toLocaleDateString('es-ES');

            item.innerHTML = `
                ${icon}
                <div class="item-name">${elem.nombre}</div>
                <div class="item-info">${size} - ${date}</div>
                <div class="item-tooltip">${elem.nombre}<br>${elem.path}</div>
                <button class="delete-btn" data-nombre="${elem.nombre}" data-id="${elem.id}">×</button>
            `;

            gallery.appendChild(item);
        });
    }

    getElementbyType(type, src) {
        const defaultsrc = '📄';
        const srcclean = src.replace('file://', '');
        const htmlelement = {
            'image': `<img src="/media/${srcclean}" alt="Imagen">`,
            'video': `<video src="/media/${srcclean}" alt="video" controls></video>`,
            'audio': `<audio src="/media/${srcclean}" alt="audio" controls></audio>`,
            'text': `<div class="item-icon">${defaultsrc}</div>`,
            'default': `<div class="item-icon">${defaultsrc}</div>`
        };

        if (!src || !type) return htmlelement['default'];
        
        // Verificar el tipo de archivo
        if (type.startsWith('image')) return htmlelement['image'];
        if (type.startsWith('video')) return htmlelement['video'];
        if (type.startsWith('audio')) return htmlelement['audio'];
        if (type.startsWith('text')) return htmlelement['text'];
        
        return htmlelement['default'];
    }

    getIconForType(type, src) {
        return this.getElementbyType(type, src);
    }

    formatSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}

customElements.define('galeria-elementos', GaleriaElementos);
const themes = {
  default: {
    container: 'bg-gray-900/95 rounded-2xl p-6 shadow-xl',
    text: 'text-xl font-semibold text-gray-100',
    media: 'rounded-lg max-w-full',
    animation: 'slide-fade',
    layout: 'flex-col',
    textAnimation: 'text-pop'
  },
  neon: {
    container: 'bg-purple-900/90 rounded-xl p-6 shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-500',
    text: 'text-xl font-bold text-purple-100 drop-shadow-[0_0_5px_rgba(147,51,234,0.5)]',
    media: 'rounded-lg max-w-full border-2 border-purple-500',
    animation: 'bounce-fade',
    layout: 'flex-col-reverse',
    textAnimation: 'text-wave'
  },
  minimal: {
    container: 'bg-white/95 rounded-md p-4 shadow-sm',
    text: 'text-lg font-medium text-gray-800',
    media: 'rounded-md max-w-full',
    animation: 'slide-simple',
    layout: 'flex-row',
    textAnimation: 'text-pop'
  },
  gaming: {
    container: 'bg-red-600/95 rounded-3xl p-6 shadow-2xl border-2 border-yellow-400',
    text: 'text-2xl font-black text-yellow-300 uppercase',
    media: 'rounded-xl max-w-full border-2 border-yellow-400',
    animation: 'shake-fade',
    layout: 'flex-row-reverse',
    textAnimation: 'text-glitch'
  },
  retro: {
    container: 'bg-green-900/90 rounded-none p-6 border-4 border-green-400',
    text: 'text-2xl font-mono text-green-400',
    media: 'rounded-none border-4 border-green-400 max-w-full',
    animation: 'slide-fade',
    layout: 'flex-col',
    textAnimation: 'text-rotate'
  }
};
const animations = {
  'slide-fade': {
    enter: 'slideIn 2s ease-out, fadeIn 2s ease-out',
    exit: 'slideOut 2s ease-in, fadeOut 2s ease-in'
  },
  'bounce-fade': {
    enter: 'bounceIn 2s cubic-bezier(0.36, 0, 0.66, -0.56), fadeIn 2s ease-out',
    exit: 'bounceOut 2s cubic-bezier(0.34, 1.56, 0.64, 1), fadeOut 2s ease-in'
  },
  'slide-simple': {
    enter: 'slideIn 2s ease-out',
    exit: 'slideOut 2s ease-in'
  },
  'shake-fade': {
    enter: 'shakeIn 0.8s ease-out, fadeIn 2s ease-out',
    exit: 'shakeOut 0.8s ease-in, fadeOut 2s ease-in'
  }
};

class DonationAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._theme = 'default';
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'theme' && oldValue !== newValue) {
      this._theme = newValue;
      this.render();
    }
  }

  set alert(value) {
    this._alert = value;
    this.render();
  }

  get alert() {
    return this._alert;
  }

  set theme(value) {
    if (themes[value]) {
      this.setAttribute('theme', value);
    }
  }

  get theme() {
    return this._theme;
  }

  connectedCallback() {
    const animation = animations[themes[this._theme].animation];
    this.style.animation = animation.enter;
  }

  disconnectedCallback() {
    const animation = animations[themes[this._theme].animation];
    this.style.animation = animation.exit;
  }

  animateText(text, animationClass) {
    return text.split('').map((char, i) => 
      char === ' ' 
        ? ' '
        : `<span class="text-animation ${animationClass}" style="animation-delay: ${i * 0.05}s">${char}</span>`
    ).join('');
  }

  renderMediaGrid(items, type, theme) {
    const isVideo = type === 'video';
    const isAudio = type === 'audio';
    const columns = Math.min(items.length, 2);

    return `
      <div class="media-grid columns-${columns}">
        ${items.map(src => {
          const sanitizedSrc = src.startsWith('http') ? src : `/media/${src}`;
          
          if (isVideo) {
            return `
              <video autoplay loop muted class="media-item">
                <source src="${sanitizedSrc}" type="video/mp4">
              </video>
            `;
          } else if (isAudio) {
            return `
              <audio controls class="media-item">
                <source src="${sanitizedSrc}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            `;
          } else {
            return `
              <img src="${sanitizedSrc}" alt="Donation media" class="media-item" />
            `;
          }
        }).join('')}
      </div>
      `;
  }
  getallTypesrender(){
      return ['multi-image','video-grid','image-grid','video-image','image','video','text']
  }
  renderContent(alert, theme) {
      let mediaprefix = "/media/";
      if(alert.image && alert.image.startsWith("http") || alert.video && alert.video.startsWith("http")){
          mediaprefix = "";
      }
    switch (alert.type) {
      case 'multi-image':
        const sanitizedImages = alert.images.map(img => 
          img.startsWith('http') ? img : `/media/${img}`
        );
        return this.renderMediaGrid(sanitizedImages, 'image', theme);
      case 'video-grid':
        const sanitizedVideos = alert.videos.map(video => 
          video.startsWith('http') ? video : `/media/${video}`
        );
        return this.renderMediaGrid(sanitizedVideos, 'video', theme);
      case 'image-grid':
        const sanitizedGridImages = alert.images.map(img => 
          img.startsWith('http') ? img : `/media/${img}`
        );
        return this.renderMediaGrid(sanitizedGridImages, 'image', theme);
      case 'video-image':
        const videoSrc = alert.video.startsWith('http') ? alert.video : `/media/${alert.video}`;
        const imageSrc = alert.image.startsWith('http') ? alert.image : `/media/${alert.image}`;
        return `
          <div class="media-combo">
            <video autoplay loop muted class="media-item">
              <source src="${videoSrc}" type="video/mp4">
            </video>
            <img src="${imageSrc}" alt="Donation media" class="media-item" />
          </div>
        `;
      case 'image':
        const imgSrc = alert.content.startsWith('http') ? alert.content : `/media/${alert.content}`;
        return `<img src="${imgSrc}" alt="Donation alert" class="media-item" />`;
      case 'video':
        const vidSrc = alert.content.startsWith('http') ? alert.content : `/media/${alert.content}`;
        return `
          <video autoplay loop muted class="media-item">
            <source src="${vidSrc}" type="video/mp4">
          </video>
        `;
      case 'text':
      default:
        return `<div class="text-content">${this.animateText(alert.content, theme.textAnimation)}</div>`;
    }
  }
  render() {
    const alert = this._alert;
    if (!alert) return;

    const theme = themes[this._theme];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          position: fixed;
          align-items: center;
          justify-content: center;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          pointer-events: none;
        }
      * {
        transition: all 0.2s ease-in-out;
      }
        .alert-container {
          max-width: 90dvw;
          margin: 0 auto;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background: ${theme.container.background || 'rgba(17, 24, 39, 0.95)'};
          border: ${theme.container.border || 'none'};
        }

        .content {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-direction: ${theme.layout.replace('flex-', '')};
        }

        .text-content {
          font-size: ${theme.text.size || '1.25rem'};
          font-weight: ${theme.text.weight || '600'};
          color: ${theme.text.color || '#f3f4f6'};
          font-family: ${theme.text.family || 'system-ui, -apple-system, sans-serif'};
        }

        .media-item {
          max-width: 90%;
          border-radius: ${theme.media.borderRadius || '0.5rem'};
          border: ${theme.media.border || 'none'};
        }

        .media-grid {
          display: grid;
          gap: 0.5rem;
        }

        .columns-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .media-combo {
          display: flex;
          gap: 0.5rem;
        }

        .media-combo .media-item {
          width: 50%;
        }

        .text-animation {
          display: inline-block;
        }

        /* Animation classes from style.css */
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes waveY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .text-pop { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
        .text-wave { animation: waveY 2s ease-in-out infinite; }
        .text-rotate { animation: rotate 2s linear infinite; }
        .text-glitch { animation: glitch 0.3s linear infinite; }
      </style>

      <div class="alert-container">
        <div class="content">
          ${this.renderContent(alert, theme)}
          ${alert.text ? `<div class="text-content">${this.animateText(alert.text, theme.textAnimation)}</div>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('donation-alert', DonationAlert);
class WindowManager extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.windows = new Map();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /*html */`
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        .window-list {
          display: grid;
          gap: 1rem;
        }
        .window-card {
          background-color: #2d3748;
          border-radius: 0.5rem;
          padding: 1rem;
          color: white;
        }
        .window-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .window-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
        }
        .close-btn {
          color: #ef4444;
          cursor: pointer;
        }
        .close-btn:hover {
          color: #dc2626;
        }
        .option-label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .option-label input {
          margin-right: 0.5rem;
        }
      </style>
      <div class="window-list" id="windowsList"></div>
    `;
  }

  addWindow(id, config) {
    // Validate config
    const defaultConfig = {
      url: 'New Window',
      alwaysOnTop: false,
      transparent: false,
      ignoreMouseEvents: false
    };
    const mergedConfig = { ...defaultConfig, ...config };

    // Create window card
    const card = document.createElement('div');
    card.className = 'window-card';
    card.innerHTML = `
      <div class="window-header">
        <h3>${mergedConfig.url}</h3>
        <button class="close-btn" data-id="${id}">Cerrar</button>
      </div>
      <div class="window-options">
        <label class="option-label">
          <input type="checkbox" 
            ${mergedConfig.alwaysOnTop ? 'checked' : ''} 
            data-property="alwaysOnTop" 
            data-id="${id}">
          Siempre Visible
        </label>
        <label class="option-label">
          <input type="checkbox" 
            ${mergedConfig.transparent ? 'checked' : ''} 
            data-property="transparent" 
            data-id="${id}">
          Transparente
        </label>
        <label class="option-label">
          <input type="checkbox" 
            ${mergedConfig.ignoreMouseEvents ? 'checked' : ''} 
            data-property="ignoreMouseEvents" 
            data-id="${id}">
          Ignorar Mouse
        </label>
      </div>
    `;

    // Add event listeners
    card.querySelector('.close-btn').addEventListener('click', this.closeWindow.bind(this));
    card.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', this.updateWindow.bind(this));
    });

    // Store window config and append card
    this.windows.set(id, mergedConfig);
    this.shadowRoot.getElementById('windowsList').appendChild(card);
  }

  updateWindow(event) {
    const checkbox = event.target;
    const id = checkbox.dataset.id;
    const property = checkbox.dataset.property;
    
    // Get current config and update
    const currentConfig = this.windows.get(id) || {};
    const newConfig = { 
      ...currentConfig, 
      [property]: checkbox.checked 
    };

    // Update local map
    this.windows.set(id, newConfig);

    // Dispatch custom event for external handling
    this.dispatchEvent(new CustomEvent('window-update', {
      detail: { id, config: newConfig }
    }));
  }

  closeWindow(event) {
    const id = event.target.dataset.id;
    
    // Remove from map
    this.windows.delete(id);

    // Remove from DOM
    event.target.closest('.window-card').remove();

    // Dispatch custom event for external handling
    this.dispatchEvent(new CustomEvent('window-close', {
      detail: { id }
    }));
  }
  deleteWindow(id) {
    // Remove from windows map
    this.windows.delete(id);
  
    // Find and remove the corresponding HTML element
    const windowsList = this.shadowRoot.getElementById('windowsList');
    const windowCard = windowsList.querySelector(`.window-card [data-id="${id}"]`)?.closest('.window-card');
    
    if (windowCard) {
      windowCard.remove();
  
      // Dispatch a custom event to notify external listeners
      this.dispatchEvent(new CustomEvent('window-close', {
        detail: { id }
      }));
    }
  }
  // Method to get all current windows
  getWindows() {
    return Array.from(this.windows.entries());
  }
}

// Define the custom element
customElements.define('window-manager', WindowManager);

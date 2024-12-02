import { getTranslation, translations } from '../translations.js';
import { logger } from '../utils/utils.js'
class DynamicTable {
  constructor(containerSelector,config = {}) {
      this.config = config;
      this.container = document.querySelector(containerSelector);
      this.columns = this.getOrderedColumns(config);
      this.HtmlContainer = document.createElement('table');
      this.HtmlContainer.classList.add('dynamic-table');
      this.container.appendChild(this.HtmlContainer);
      this.canClear = true;
      this.rows = []; // Array para mantener referencia a las filas
      this.createHeader();
  }
  getOrderedColumns(config) {
    return Object.keys(config);
  }

  getMaxColumns() {
    return this.columns.filter(key => !(this.config[key] && this.config[key].hidden)).length + 1;
  }

  createHeader() {
    const header = this.HtmlContainer.createTHead();
    const headerRow = header.insertRow();

    this.columns.forEach((key) => {
      if (this.config[key] && this.config[key].hidden) {
        return; // No añadimos encabezado para columnas ocultas
      }
      const th = document.createElement('th');
      th.textContent = getTranslation(key);
      //textcontent translation
      th.dataset.key = key;
      th.className = 'w-1/6';
      headerRow.appendChild(th);
    });

  }

  addRow(data) {
    const row = new DynamicRow(data, this.columns, this.config);
    row.renderRow(this.HtmlContainer);
    this.rows.push({
        htmlRow: row,
        index: this.rows.length
    });
    return this.rows.length - 1; // Retorna el índice de la fila añadida
}

  hideColumn(columnKey) {
    const headerCells = this.HtmlContainer.tHead.rows[0].cells;
    for (let i = 0; i < headerCells.length; i++) {
      if (headerCells[i].dataset.key === columnKey) {
        headerCells[i].style.display = 'none';
      }
    }

    for (let row of this.HtmlContainer.rows) {
      const cells = row.cells;
      for (let i = 0; i < cells.length; i++) {
        if (this.columns[i] === columnKey) {
          cells[i].style.display = 'none';
        }
      }
    }
  }

  clearRows() {
    while (this.HtmlContainer.rows.length > 1) {
      this.HtmlContainer.deleteRow(1);
    }
  }
  addRow(data) {
    const row = new DynamicRow(data, this.columns, this.config);
    row.renderRow(this.HtmlContainer);
    this.rows.push({
        htmlRow: row,
        index: this.rows.length
    });
    return this.rows.length - 1; // Retorna el índice de la fila añadida
}

removeRow(index) {
    if (index >= 0 && index <= this.rows.length) {
        // Eliminar la fila del DOM
        this.HtmlContainer.deleteRow(index + 1); // +1 porque el índice 0 es el header
        
        // Eliminar la fila del array de filas
        this.rows.splice(index, 1);
        
        // Actualizar los índices de las filas restantes
        this.rows.forEach((row, i) => {
            row.index = i;
        });
        
        return true;
    }
    return false;
}

getRowAt(index) {
    if (index >= 0 && index <= this.rows.length) {
        return this.rows[index].data;
    }
    return null;
}
// usando async y await

async getRowIndex(searchData) {
  //logger.log("renderhtml","getRowIndex", searchData);
  
  for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      const rowdata = await row.htmlRow.data; // Suponiendo que `data` es una promesa en `htmlRow`
      
      const matches = Object.keys(searchData).every(key => 
          JSON.stringify(rowdata[key]) === JSON.stringify(searchData[key])
      );
      
      if (matches) {
          return i; // Devolver el índice si los datos coinciden
      }
  }
  
  return -1; // Devolver -1 si no se encontró ninguna coincidencia
}



updateRows(data, clearInterval = 2000) {
    if (this.canClear) {
        this.clearRows();
        this.canClear = false;
        setTimeout(() => {
            this.canClear = true;
        }, clearInterval);
    }
    return this.addRow(data);
}
}
class DynamicRow {
  static IGNORED_PROPERTIES = [
    'class',
    'open',
    'label',
    'type',
    'dataAssociated',
    'hidden'
  ];
  static INPUT_CREATORS = {
    "button": "createButtonElement",
    "checkbox": "createCheckboxElement",
    "color": "createColorField",
    "number": "createNumberElement",
    "number2": "createNumberElement2",
    "select": "createSelectElement",
    "select2": "createSelect2Element",
    "slider": "createSliderElement",
    "text": "createTextElement",
    "string": "createTextElement",
    "text2": "createTextElement2",
    "string2": "createTextElement2",
    "image": "createImageElement",
    "textarea": "createtexareaElement",
    "textarea2": "createtexareaElement",
    "multiSelect": "createMultiSelectElement",
    "multiSelect2": "createMultiSelectElement", 
  }
  constructor(data, columns, config) {
    this.data = {...data } || {};
    this.originalData = { ...data };
    this.columns = columns;
    this.config = config;
    this.modifiedData = { ...data };
    this.currentElements = this.Renderall();
    this.updateData(data);
  }

  Renderall() {
    const container = document.createElement('div');
    container.classList.add('dynamic-row-container');

    this.columns.forEach(async (key) => {
      const typeConfig = this.config[key];
      const value = this.data[key];

      if (typeConfig?.hidden) {
        return;
      }

      if (typeConfig?.type === 'object') {
        container.appendChild(this.renderObjectType(key, value, typeConfig));
      } else {
        const inputElement = this.createInputElement(key, null, value, typeConfig, container);
        if (inputElement) {
          container.appendChild(inputElement);
        } else {
          container.textContent = value !== undefined ? value : '';
        }
      }
    });

    return container;
  }
  renderRow(HtmlContainer){
    const row = HtmlContainer.insertRow();
    let cellIndex = 0;
    this.columns.forEach((key) => {
      const typeConfig = this.config[key];

      if (typeConfig && typeConfig.hidden) {
        return;
      }

      const cell = row.insertCell(cellIndex++);
      const value = this.data[key];

      if (typeConfig && typeConfig.type === 'object') {
        const objectContainer = document.createElement('details');
        if (typeConfig.open) {
          objectContainer.setAttribute('open', '');
        }
        const summary = document.createElement('summary');
        //logger.log("renderhtml","typeConfig summary", typeConfig, key);
        summary.textContent = typeConfig.label || `${getTranslation('show')} ${getTranslation(key)}`;

        objectContainer.appendChild(summary);

        Object.keys(typeConfig).forEach(subKey => {
          if (subKey === 'type' || subKey === 'open') return;

          const subConfig = typeConfig[subKey];
          const subValue = value ? value[subKey] : undefined;
          const inputElement = this.createInputElement(key, subKey, subValue, subConfig, cell);

          if (inputElement) {
            const wrapper = document.createElement('div');
            if (subConfig) {
              wrapper.appendChild(inputElement);
            }
            objectContainer.appendChild(wrapper);
          }
        });

        cell.appendChild(objectContainer);
      } else {
        const inputElement = this.createInputElement(key, null, value, typeConfig, cell);
        //logger.log("renderhtml","inputElement", inputElement);
        if (inputElement) {
          cell.appendChild(inputElement);
        } else {
          cell.textContent = value !== undefined ? value : '';
        }
      }
    });
  }
  renderObjectType(key, value, typeConfig) {
    const objectContainer = document.createElement('details');
    
    if (typeConfig.open) {
      objectContainer.setAttribute('open', '');
    }

    const summary = document.createElement('summary');
    summary.textContent = typeConfig.label || `${getTranslation('show')} ${getTranslation(key)}`;
    objectContainer.appendChild(summary);

    Object.keys(typeConfig).forEach(async (subKey) => {
      if (DynamicRow.IGNORED_PROPERTIES.includes(subKey)) return;

      const subConfig = typeConfig[subKey];
      const subValue = value?.[subKey];
      let inputElement = this.createInputElement(key, subKey, subValue, subConfig, objectContainer);

      if (inputElement) {

        if (subConfig.label && subConfig.label !== '' && subConfig.type !== 'checkbox') {
          const label = document.createElement('label');
          label.textContent = subConfig.label;
          inputElement.appendChild(label);
        }
        objectContainer.appendChild(inputElement);
      }
    });

    return objectContainer;
  }

  createInputElement(key, subKey, value, typeConfig, HtmlContainer) {
    if (value === undefined && DynamicRow.IGNORED_PROPERTIES.includes(subKey)) {
      return null;
    }

    let inputElement;
    const inputType = typeConfig?.type || 'text';

    const inputCreators = {
      slider: () => this.createSliderElement(key, subKey, value, typeConfig),
      checkbox: () => this.createCheckboxElement(key, subKey, value, typeConfig),
      number: () => this.createNumberElement(key, subKey, value),
      number2: () => this.createNumberElement2(key, subKey, value),
      text: () => this.createTextElement(key, subKey, value),
      string: () => this.createTextElement(key, subKey, value),
      text2: () => this.createTextElement2(key, subKey, value),
      string2: () => this.createTextElement2(key, subKey, value),
      image: () => this.createImageElement(key, subKey, value),
      textarea: () => this.createtexareaElement(key, subKey, value),
      textarea2: () => this.createtexareaElement(key, subKey, value),
      select: () => this.createSelectElement(key, subKey, value, typeConfig, HtmlContainer),
      select2: () => this.createSelect2Element(key, subKey, value, typeConfig, HtmlContainer),
      multiSelect: () => this.createMultiSelectElement(key, subKey, value, typeConfig),
      multiSelect2: () => this.createMultiSelectElement2(key, subKey, value, typeConfig),
      color: () => this.createColorField(key, subKey, value, typeConfig, HtmlContainer),
      radio: () => this.createRadioElement(key, subKey, value, typeConfig, HtmlContainer),
      button: () => this.createButtonElement(key, subKey, value, typeConfig, HtmlContainer),
      callback: () => null
    };

    inputElement = (inputCreators[inputType] || inputCreators.text)();

    if (typeConfig?.class) {
      inputElement.className = typeConfig.class;
    }

    if (typeConfig?.dataAssociated) {
      setAttributes(inputElement, 'data-associated', typeConfig.dataAssociated);
    }

    return inputElement || document.createTextNode('');
  }
  createButtonElement(key, subKey, value, typeConfig, HtmlContainer) {
    const inputElement = document.createElement('button');
    inputElement.type = 'button';
    inputElement.textContent = typeConfig.label || subKey || key;
    inputElement.className = typeConfig.class;
    inputElement.addEventListener('click', () => {if (typeConfig.callback) typeConfig.callback(this.data,this.modifiedData,this.columns)});
    return inputElement;
  }
  createTextElement2(key, subKey, value) {
    const inputElement = createInputField({
      type: 'text',
      key,
      subKey,
      value,
      cols: '50',
      rows: '4',
      minHeight: '100px',
      onChange: ({value}) => this.updateModifiedData(key, subKey, value)
    });

    return inputElement;
  }
  createNumberElement2(key, subKey, value) {
    const inputElement = createInputField({
      type: 'number',
      key,
      subKey,
      value,
      onChange: ({value}) => this.updateModifiedData(key, subKey, value)
    });

    return inputElement;
  }
  createImageElement(key, subKey, value) {
    const inputElement = document.createElement('image-url-input-component');
    inputElement.addEventListener('image-url-selected', (event) => {
      const url = event.detail.url;
      this.updateModifiedData(key, subKey, url);
    });
    if (value) inputElement.setInputValue(value);
    return inputElement;
  }
  async createSelectElement(key, subKey, value, typeConfig, HtmlContainer) {
    const divElement = document.createElement('div');
    divElement.classList.add('div-select');
    const selectElement = document.createElement('select');
    selectElement.id = key;
    selectElement.classList.add('select');
    
    // Solución 1: Verificar que options sea un array y esperar si es una promesa
    if (typeConfig.options) {
        let options = typeConfig.options;
        
        // Si options es una promesa, esperamos a que se resuelva
        if (options instanceof Promise) {
            options = await options;
        }
        
        // Verificamos que sea un array antes de usar forEach
        if (Array.isArray(options)) {
            // Usamos un for...of en lugar de forEach para manejar async/await correctamente
            for (const option of options) {
                const optionElement = document.createElement('option');
                
                if (typeof option.value === 'object') {
                    optionElement.value = option.value.index;
                    optionElement.textContent = option.label;
                    optionElement.selected = option.value.index === value;
                } else {
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    optionElement.selected = option.value === value;
                }
                
                selectElement.appendChild(optionElement);
            }
        } else {
            console.warn('typeConfig.options no es un array:', options);
        }
    }

    selectElement.value = value;

    if (typeConfig.toggleoptions) {
        setTimeout(() => this.handletoggleoptions(subKey, value, HtmlContainer), 500);
    }

    selectElement.addEventListener('change', () => {
        this.updateModifiedData(key, subKey, selectElement.value);
        if (typeConfig.toggleoptions) {
            this.handletoggleoptions(subKey, selectElement.value, HtmlContainer);
        }
    });

    const labelElement = document.createElement('label');
    divElement.appendChild(selectElement);
    
    if (typeConfig.label) {
        labelElement.classList.add('label');
        labelElement.setAttribute('for', key);
        divElement.appendChild(labelElement);
    }

    return divElement;
}

  createSelect2Element(key, subKey, value, typeConfig, HtmlContainer) { 
    const divElement = document.createElement('div');
    const selectComponent = document.createElement('custom-select');
    selectComponent.setOptions(typeConfig.options);
    selectComponent.setValue(value);  // Establecer valor predeterminado
    if (typeConfig.toggleoptions) setTimeout(this.handletoggleoptions(subKey, value, HtmlContainer), 500);
    // Añadir el evento change
    selectComponent.addEventListener('change', (e) => {
        logger.log("renderhtml",'Seleccionado:', e.detail);
        logger.log("renderhtml",'Valor:', selectComponent.getValue());
        logger.log("renderhtml",'mySelect:', selectComponent.value);
        this.updateModifiedData(key, subKey, selectComponent.value);
        if (typeConfig.toggleoptions) this.handletoggleoptions(subKey, selectComponent.value, HtmlContainer);
        
      });

    const labelElement = document.createElement('label');
    divElement.appendChild(selectComponent);
    if (typeConfig.label) {
      selectComponent.setLabel(typeConfig.label);
      labelElement.classList.add('label');
      labelElement.setAttribute('for', key);
      divElement.appendChild(labelElement);
    } else {
      selectComponent.setLabel(key);
    }
    return divElement
  }
  createRadioElement(key, subKey, value, typeConfig, HtmlContainer) {
    const divElement = document.createElement('div');
    divElement.classList.add('div-radio-group');
    const uniquename = key + '_' + Math.random().toString(36).substring(2, 15);
    logger.log("renderhtml","select",typeConfig);

    if (typeConfig.options) {
        typeConfig.options.forEach(async (option) => {
            const radioWrapper = document.createElement('div');
            radioWrapper.classList.add('radio-wrapper');
            
            const radioElement = document.createElement('input');
            radioElement.type = 'radio';
            radioElement.name = uniquename;
            radioElement.id = `${key}_${option.value}`; // Unique ID for each radio
            radioElement.value = typeof option.value === 'object' ? option.value.index : option.value;
            radioElement.checked = radioElement.value == value; // Marca como seleccionado si coincide con el valor actual
            
            const labelElement = document.createElement('label');
            labelElement.textContent = option.label;
            labelElement.classList.add('label');
            labelElement.setAttribute('for', radioElement.id);

            radioWrapper.appendChild(radioElement);
            radioWrapper.appendChild(labelElement);
            divElement.appendChild(radioWrapper);

            // Listener para actualizar el valor seleccionado
            radioElement.addEventListener('change', () => {
                if (radioElement.checked) {
                    this.updateModifiedData(key, subKey, radioElement.value);
                    if (typeConfig.toggleoptions) {
                        this.handletoggleoptions(subKey, radioElement.value, HtmlContainer);
                    }
                }
            });
        });
    }

    if (typeConfig.toggleoptions) {
        setTimeout(() => {
            this.handletoggleoptions(subKey, value, HtmlContainer);
        }, 500);
    }

    return divElement;
  }

  createSliderElement(key, subKey, value, typeConfig) {
    const inputElement = document.createElement('input');
    inputElement.type = 'range';
    inputElement.min = typeConfig.min || 0;
    inputElement.max = typeConfig.max || 100;
    inputElement.step = typeConfig.step || inputElement.max / 10;
    inputElement.value = value;

    inputElement.addEventListener('input', () => {
      const returnValue = typeConfig.returnType === 'number' ? Number(inputElement.value) : inputElement.value;
      this.updateModifiedData(key, subKey, returnValue);
    });

    return inputElement;
  }

  createCheckboxElement(key, subKey, value, typeConfig) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('checkbox-wrapper'); // Clase para ajustar el tamaño

    const inputElement = document.createElement('input');
    inputElement.type = 'checkbox';
    inputElement.checked = value;
    inputElement.id = `${key}_${subKey}_${Math.random().toString(36).substring(2, 15)}`; // Generar un id único
    inputElement.className = 'checkbox-4';
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', inputElement.id); // Relacionar el label con el checkbox
    labelElement.textContent = typeConfig.label || subKey; // Texto del label o ajusta según tus necesidades

    inputElement.addEventListener('change', () => {
      const returnValue = inputElement.checked;
      this.updateModifiedData(key, subKey, returnValue);
    });

    wrapper.appendChild(inputElement);
    wrapper.appendChild(labelElement);

    return wrapper;
  }

  createNumberElement(key, subKey, value) {
    const inputElement = document.createElement('input');
    inputElement.type = 'number';
    inputElement.value = value;
    const subkeylabel = subKey ? subKey : inputElement.type
    inputElement.placeholder = key + ' ' + subkeylabel ;

    inputElement.addEventListener('input', () => {
      const returnValue = Number(inputElement.value);
      this.updateModifiedData(key, subKey, returnValue);
    });

    return inputElement;
  }

  createTextElement(key, subKey, value) {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = value || '';
    const subkeylabel = subKey ? subKey : inputElement.type
    inputElement.placeholder = key + ' ' +subkeylabel;

    inputElement.addEventListener('input', () => {
      const returnValue = inputElement.value;
      this.updateModifiedData(key, subKey, returnValue);
    });

    return inputElement;
  }
  createtexareaElement(key, subKey, value) {
    const inputElement = document.createElement('textarea');
    inputElement.value = value || '';
    inputElement.autocomplete = 'on';
    const subkeylabel = subKey ? subKey : inputElement.type
    inputElement.placeholder = key + ' ' +subkeylabel;
    // logger.log("renderhtml","createtexareaElement", key, subKey, value);
    inputElement.cols = 50;
    inputElement.addEventListener('input', () => {
      const returnValue = inputElement.value;
      this.updateModifiedData(key, subKey, returnValue);
    });
    return inputElement;
  }
  createMultiSelectElement(key, subKey, value, typeConfig) {
    const fieldConfig = {
      label: typeConfig.label,
      options: typeConfig.options,
      name: key,
    };
    logger.log("renderhtml","createMultiSelectElement", fieldConfig,value);
    const multiSelectField = createMultiSelectField(fieldConfig, (selectedValues) => {
      this.updateModifiedData(key, subKey, selectedValues);
    }, value);

    return multiSelectField;
  }
  createColorField(key, subKey, value, typeConfig, HtmlContainer) {
    const fieldConfig = {
      label: typeConfig.label,
      options: typeConfig.options,
      name: key,
    };
    // logger.log("renderhtml","createMultiSelectElement", fieldConfig,value);
    const colorField = createColorField(fieldConfig, (selectedColor) => {
      this.updateModifiedData(key, subKey, selectedColor);
    }, value);
    return colorField;
  }
  updateModifiedData(key, subKey, value) {
    if (subKey) {
      if (!this.modifiedData[key]) {
        this.modifiedData[key] = {};
      }
      this.modifiedData[key][subKey] = value;
    } else {
      this.modifiedData[key] = value;
    }
  }
  handletoggleoptions(key, subKey, HtmlContainer, dataAttributes = []) {
    const dataAbase = 'data-associated';
    dataAttributes.push(`${dataAbase}-0`,`${dataAbase}-1`,`${dataAbase}-2`, dataAbase);
    
    // Crear el selector combinando todos los atributos
    const selector = dataAttributes.map(attr => `[${attr}]`).join(',');
    const fields = HtmlContainer.querySelectorAll(selector);
    
    if (!fields.length) return;

    // Primero hacemos fade out de todos los elementos
    fields.forEach(field => {
      field.style.opacity = '0';
    });

    // Esperamos a que termine la transición de fade out
    setTimeout(() => {
      fields.forEach(field => {
        // Verificar si alguno de los atributos coincide con subKey
        const matches = dataAttributes.some(attr =>
          field.getAttribute(attr) === subKey
        ) || field.getAttribute(dataAbase) === key;

        if (matches) {
          field.style.display = 'block';
          // Aplicamos fade in solo a los elementos que deben mostrarse
          setTimeout(() => {
            field.style.opacity = '1';
          }, 150);
        } else {
          field.style.display = 'none';
        }
      });
    }, 500); // Este tiempo debe coincidir con la duración de la transición
  }
  updateData(newData) {
    this.data = { ...newData };
    this.originalData = { ...newData };
    this.modifiedData = { ...newData };
    // Limpiar el contenedor actual donde se están mostrando los divs

    const newDivs = this.Renderall();
    this.currentElements = newDivs;
  }
  ReturncurrentElements(){
    return this.currentElements;
  }
}
function createMultiSelectField1(field, onChangeCallback, value) {
  const container = document.createElement('div');
  container.classList.add('input-field', 'col', 's12', 'gap-padding-margin-10');

  const label = document.createElement('label');
  label.textContent = field.label;

  // Campo de búsqueda
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Buscar...';
  searchInput.classList.add('search-input', 'center-text');

  // Contenedor de las opciones
  const gridSelect = document.createElement('div');
  gridSelect.classList.add('grid-select');

  // Función para renderizar las opciones
  function renderOptions(options) {
    gridSelect.innerHTML = '';  // Limpiar las opciones actuales
    options.forEach(option => {
      const checkbox = document.createElement('label');
      checkbox.classList.add('grid-select__option');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = field.name;
      // Guardamos directamente el valor del objeto, no su versión string
      input.value = typeof option.value === 'object' ? option.value.index : option.value;
      input.dataset.id = option.id;
      input.classList.add('filled-in');

      // Comprobar si esta opción está seleccionada y marcarla
      if (Array.isArray(value) && value.includes(String(input.value))) {
        input.checked = true; // Marcar como seleccionado
      }

      const labelText = document.createElement('span');
      labelText.textContent = option.label;

      // Escuchar cambios en los checkboxes y pasar el valor actualizado al callback
      input.addEventListener('change', () => {
        const selectedValues = Array.from(gridSelect.querySelectorAll('input[type="checkbox"]:checked'))
          .map(checkbox => checkbox.value); // Ahora estamos pasando los valores correctos
        onChangeCallback(selectedValues);
      });

      checkbox.appendChild(input);
      checkbox.appendChild(labelText);
      gridSelect.appendChild(checkbox);
    });
  }
  logger.log("renderhtml","field",field)
  // Inicializar las opciones
  renderOptions(field.options);

  // Filtrar opciones en base al texto ingresado en el buscador
  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const options = gridSelect.querySelectorAll('.grid-select__option');

    options.forEach(option => {
      const labelText = option.querySelector('span').textContent.toLowerCase();
      if (labelText.includes(searchTerm)) {
        option.classList.remove('hidden');
      } else {
        option.classList.add('hidden');
      }
    });
  });

  container.appendChild(label);
  container.appendChild(searchInput);  // Agregar el campo de búsqueda
  container.appendChild(gridSelect);

  return container;
}
function createMultiSelectField(field, onChangeCallback, initialValue) {
  // Create container div
  const container = document.createElement('div');
  container.classList.add('input-field', 'col', 's12', 'gap-padding-margin-10');

  // Create label if needed
  if (field.label) {
      const label = document.createElement('label');
      label.textContent = field.label;
      container.appendChild(label);
  }

  // Create the custom multi-select element
  const multiSelect = document.createElement('flexible-modal-selector');
  
  multiSelect.id = field.name;
  multiSelect.setAttribute('name', field.name);
  multiSelect.setAttribute('mode', field.mode || 'multi');
  logger.log(field.theme);
  multiSelect.setAttribute('theme', field.theme || 'light');
  multiSelect.toggleDarkMode();
  // Configurar el evento change del modal-selector
  multiSelect.addEventListener('change', (e) => {
      // Si hay campos condicionales que dependen de este
          onChangeCallback(e.detail.values);
      
  });
  
  if (field.options) multiSelect.setOptions(field.options);
  // Si hay un valor inicial, establecerlo
  logger.log("renderhtml","createMultiSelectElement", field,initialValue);
  if (field.value || initialValue) {
      multiSelect.setValues(initialValue || field.value);
  }

  container.appendChild(multiSelect);
  return container;
}
function createColorField(field, onChangeCallback, initialValue) {
  const container = document.createElement('div');
  container.classList.add('input-field', 'col', 's12', 'gap-padding-margin-10');

  if (field.label) {
      const label = document.createElement('label');
      label.textContent = field.label;
      container.appendChild(label);
  }

  const colorPicker = document.createElement('custom-color-picker');
  
  if (initialValue) {
      colorPicker.value = initialValue;
  }

  colorPicker.addEventListener('change', (event) => {
      const selectedColor = event.detail.value;
      if (typeof onChangeCallback === 'function') {
          onChangeCallback(selectedColor);
      }
  });

  container.appendChild(colorPicker);
  return container;
}
function createInputField({
  type = 'text',
  key = '',
  subKey = '',
  value = '',
  cols = '50',
  rows = '4',
  minHeight = '100px',
  onChange = null
} = {}) {
  const inputField = document.createElement('input-field');
  
  // Establecer atributos
  inputField.setAttribute('type', type);
  inputField.setAttribute('key', key);
  if (subKey) inputField.setAttribute('subkey', subKey);
  if (value) inputField.setAttribute('value', value);
  if (type === 'textarea') {
      inputField.setAttribute('cols', cols);
      inputField.setAttribute('rows', rows);
      inputField.setAttribute('minheight', minHeight);
  }
  
  // Establecer callback si existe
  if (onChange) {
      inputField.onChange = onChange;
  }
  
  return inputField;
}
function setAttributes(element, attribute, value) {
  if (typeof value === 'object' && value !== null) {
      // Si es un objeto, itera sobre sus propiedades
      Object.entries(value).forEach(([key, val]) => {
          element.setAttribute(`${attribute}-${key}`, val);
      });
  } else {
      // Si no es un objeto, establece el atributo directamente
      element.setAttribute(attribute, value);
  }
}
export class EditModal {
  constructor(config = {},data = {}) {
    this.config = config;
    // this.HtmlContainer = document.createElement('div');
    this.columns = this.getOrderedElements(config); // Establece las columnas en el orden deseado
    this.renderelement = new DynamicRow( data, this.columns, this.config);
  }
  render(data,HtmlContainer) {
    this.renderelement = new DynamicRow(data, this.columns, this.config);
    const renderhtml = this.renderelement.Renderall();
    if (HtmlContainer) document.querySelector(HtmlContainer).appendChild(renderhtml);
    logger.log("renderhtml","renderhtml", renderhtml);
  }
  ReturnHtml(data){
    this.renderelement = new DynamicRow(data, this.columns, this.config);
    const renderhtml = this.renderelement.Renderall();
    return renderhtml;
  }
  ReturncurrentElements(){
    return this.renderelement.currentElements;
  }
  getOrderedElements(config) {
    return Object.keys(config);
  }
  updateData(newData) {
    this.renderelement.updateData(newData)
  }
  updateconfig(newConfig) {
    this.config = newConfig
  }
}

export default DynamicTable;

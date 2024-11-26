// Configuración de los elementos HTML
const configHtmlElement = {
    voiceSettings: {
      card: {
        title: 'General Settings',
        voices: [
          {
            id: 'selectvoice1',
            label: 'Voz1',
            assigned: 'voiceSelectContainer1',
            elements: [
              {
                elementType: 'select',
                id: 'voiceSelect1',
                name: 'voiceSelect1',
                label: 'select voice',
                className: 'select select-info browser-default w-full'
              },
              {
                elementType: 'checkbox',
                id: 'audiolist',
                name: 'audiolist',
                label: 'Cola de audio',
                className: 'filled-in',
                checked: true
              }
            ]
          },
          {
            id: 'selectvoice2',
            label: 'Voz2',
            assigned: 'voiceSelectContainer2',
            elements: [
              {
                elementType: 'select',
                id: 'voiceSelect2',
                name: 'voiceSelect2',
                className: 'select select-info browser-default'
              },
              {
                elementType: 'checkbox',
                id: 'randomVoice',
                name: 'randomVoice',
                label: 'Random Voice',
                checked: true
              },
              {
                elementType: 'checkbox',
                id: 'randomSpeed',
                name: 'randomSpeed',
                label: 'random speed',
                subElement: {
                  elementType: 'range',
                  id: 'randomSpeedValue',
                  name: 'randomSpeedValue',
                  className: 'range range-sm',
                  min: 0.1,
                  max: 2,
                  step: 0.1,
                  value: 1
                }
              },
              {
                elementType: 'checkbox',
                id: 'randomPitch',
                name: 'randomPitch',
                label: 'random pitch',
                subElement: {
                  elementType: 'range',
                  id: 'randomPitchValue',
                  name: 'randomPitchValue',
                  className: 'range range-sm',
                  min: 0.1,
                  max: 2,
                  step: 0.1,
                  value: 1
                }
              },
              {
                elementType: 'range',
                id: 'default-speed',
                name: 'default-speed',
                label: 'Default Speed',
                className: 'range range-sm'
              },
              {
                elementType: 'range',
                id: 'default-pitch',
                name: 'default-pitch',
                label: 'Default Pitch',
                className: 'range range-sm'
              },
              {
                elementType: 'range',
                id: 'volume',
                name: 'volume',
                label: 'Speech Volume',
                className: 'range range-sm',
                min: 0,
                max: 1,
                step: 0.1,
                value: 1
              }
            ]
          }
        ]
      }
    }
  };
  
  class VoiceSettingsGenerator {
    constructor(config) {
      this.config = config;
      this.formData = {};
    }
  
    createElements() {
      const card = document.createElement('div');
      card.className = 'card';
  
      const header = this.createHeader();
      card.appendChild(header);
  
      const content = this.createContent();
      card.appendChild(content);
  
      return card;
    }
  
    createHeader() {
      const header = document.createElement('div');
      header.className = 'card-header';
      
      const title = document.createElement('h2');
      title.className = 'card-title';
      title.textContent = this.config.voiceSettings.card.title;
      
      header.appendChild(title);
      return header;
    }
  
    createContent() {
      const content = document.createElement('div');
      content.className = 'card-content';
  
      const subContent = document.createElement('div');
      subContent.className = 'card-subcontent';
  
      this.config.voiceSettings.card.voices.forEach(voice => {
        const radioLabel = document.createElement('label');
        radioLabel.className = 'flex';
        radioLabel.setAttribute('for', voice.id);
  
        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'selectvoice');
        radio.id = voice.id;
        radio.className = 'radio checked:bg-blue-300 float-start';
        if (voice.id === 'selectvoice1') radio.checked = true;
  
        const span = document.createElement('span');
        span.textContent = voice.label;
  
        radioLabel.appendChild(radio);
        radioLabel.appendChild(span);
        subContent.appendChild(radioLabel);
  
        const elementsContainer = document.createElement('div');
        elementsContainer.id = voice.assigned;
        elementsContainer.className = 'relative m-3 content-center';
        
        voice.elements.forEach(element => {
          const wrapper = this.createElementWrapper(element);
          elementsContainer.appendChild(wrapper);
        });
  
        subContent.appendChild(elementsContainer);
  
        radio.addEventListener('change', () => {
          this.toggleContainers(voice.assigned);
        });
      });
  
      content.appendChild(subContent);
      return content;
    }
  
    createElementWrapper(elementConfig) {
      const wrapper = document.createElement('div');
      wrapper.className = 'flex items-center gap-2';
  
      const label = document.createElement('label');
      label.setAttribute('for', elementConfig.id);
      
      if (elementConfig.label) {
        const span = document.createElement('span');
        span.textContent = elementConfig.label;
        label.appendChild(span);
      }
  
      const element = this.createElement(elementConfig);
      label.appendChild(element);
  
      if (elementConfig.subElement) {
        const subElement = this.createElement(elementConfig.subElement);
        wrapper.appendChild(label);
        wrapper.appendChild(subElement);
      } else {
        wrapper.appendChild(label);
      }
  
      return wrapper;
    }
  
    createElement(config) {
      const element = document.createElement(config.elementType === 'select' ? 'select' : 'input');
      
      // Establecer atributos usando setAttribute
      if (config.elementType !== 'select') {
        element.setAttribute('type', config.elementType);
      }
      if (config.id) element.id = config.id;
      if (config.name) element.setAttribute('name', config.name);
      if (config.className) element.className = config.className;
      if (config.min !== undefined) element.setAttribute('min', config.min);
      if (config.max !== undefined) element.setAttribute('max', config.max);
      if (config.step !== undefined) element.setAttribute('step', config.step);
      if (config.value !== undefined) element.value = config.value;
      if (config.checked !== undefined) element.checked = config.checked;
  
      element.addEventListener('change', () => {
        this.updateFormData(element);
      });
  
      return element;
    }
  
    toggleContainers(activeId) {
      const containers = document.querySelectorAll('[id^="voiceSelectContainer"]');
      containers.forEach(container => {
        container.style.display = container.id === activeId ? 'block' : 'none';
      });
    }
  
    updateFormData(element) {
      this.formData[element.name] = element.type === 'checkbox' ? 
        element.checked : 
        element.value;
    }
  
    getFormData() {
      return this.formData;
    }
  }
  
  // Inicializar y usar el generador
  const generator = new VoiceSettingsGenerator(configHtmlElement);
  const settingsElement = generator.createElements();
  
  // Agregar al DOM
/*   document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('settings-container');
    if (container) {
      container.appendChild(settingsElement);
      generator.toggleContainers('voiceSelectContainer1');
    }
  });
  
  // Obtener datos del formulario
  function getAllFormData() {
    return generator.getFormData();
  }
  setTimeout(()=>{
  console.log("awdasdasd",getAllFormData())},1000) */
class ProgressOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentValue = 0;
        this.goal = 100;
        this.text = 'Progreso';
        this.textPosition = 'inside-center'; // Posición del texto
        this.complete = false;
        this.barHeight = '20px';
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 100%;
                    font-family: sans-serif;
                    margin-block: 10px;
                    padding-block: 10px;
                }
                .progress-container {
                    z-index: -1;
                    width: 100%;
                    overflow: hidden;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    position: absolute;
                    background-color: var(--background-color, #e0e0e0);
                    border-radius: var(--border-radius, 5px);
                }
                .progress-bar {
                    height: var(--bar-height, 20px);
                    width: 0%;
                    background-color: var(--bar-color, #4caf50);
                    transition: width 0.3s ease;
                }
                .progress-text {
                    position: absolute;
                    font-size: var(--font-size, 14px);
                    font-weight: var(--font-weight, normal);
                    color: var(--text-color, black);
                    -webkit-text-stroke: var(--text-stroke, 0px transparent);
                    white-space: nowrap;
                }
            </style>
            <div class="progress-text"></div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        `;

        this.progressBar = this.shadowRoot.querySelector('.progress-bar');
        this.progressContainer = this.shadowRoot.querySelector('.progress-container');
        this.progressText = this.shadowRoot.querySelector('.progress-text');

        this.updateProgress();
    }

    static get observedAttributes() {
        return ['goal', 'current-value', 'text', 'text-position',
                'bar-color', 'background-color', 'text-color', 
                'font-size', 'font-weight', 'bar-height', 
                'border-radius', 'text-stroke'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'goal'){
            this.goal = Number(newValue) || 100;
            this.complete = this.currentValue > this.goal ? true : false;
        }
        if (name === 'current-value') this.currentValue = Number(newValue) || 0;
        if (name === 'text') this.text = newValue || 'Progreso';
        if (name === 'text-position') this.textPosition = newValue || 'inside-center';

        this.updateStyles(name, newValue);
        this.updateProgress();
    }

    updateStyles(name, value) {
        switch (name) {
            case 'background-color':
                this.progressContainer.style.backgroundColor = value || '#e0e0e0';
                break;
            case 'bar-color':
                this.progressBar.style.backgroundColor = value || '#4caf50';
                break;
            case 'text-color':
                this.progressText.style.color = value || 'black';
                break;
            case 'font-size':
                this.progressText.style.fontSize = value || '14px';
                break;
            case 'font-weight':
                this.progressText.style.fontWeight = value || 'normal';
                break;
            case 'bar-height':
                this.barHeight = value || '20px';
                this.progressBar.style.height = this.barHeight;
                this.progressContainer.style.height = this.barHeight;
                break;
            case 'border-radius':
                this.progressContainer.style.borderRadius = value || '5px';
                break;
            case 'text-stroke':
                this.progressText.style.webkitTextStroke = value || '0px transparent';
                break;
        }
    }

    updateProgress() {
        const percentage = Math.min((this.currentValue / this.goal) * 100, 100);
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${this.text} ${this.currentValue}/${this.goal}`;

        // Establecer posición del texto
        this.setTextPosition();

        if (this.currentValue >= this.goal && !this.complete) {
            this.complete = true;
            console.log(this.text, this.currentValue, this.goal, this.complete);
            this.dispatchEvent(new CustomEvent('goalReached', {
                detail: { text: this.text, currentValue: this.currentValue, goal: this.goal },
                bubbles: true,
                composed: true
            }));
        }

    }

    setTextPosition() {
        if (this.textPosition.startsWith('inside')) {
            this.progressText.style.position = 'relative';
            this.progressText.style.textAlign = this.getAlignment();
        } else {
            this.progressText.style.position = 'relative';
            this.progressText.style.textAlign = this.getAlignment();
            this.progressText.style.transform = `translateY(${this.barHeight})`;
        }
    }

    getAlignment() {
        let textAlign = this.textPosition.includes('-') ? this.textPosition.split('-')[1] : this.textPosition;
        switch (textAlign) {
            case 'outside-left': return 'left';
            case 'inside-left': return 'left';
            case 'outside-center': return 'center';
            case 'inside-center': return 'center';
            case 'outside-right': return 'right';
            case 'inside-right': return `right`;
            case 'left': return 'left';
            case 'center': return 'center';
            case 'right': return 'right';
            default: return '100%';
        }
    }
}

customElements.define('progress-overlay', ProgressOverlay);


// 🔹 Ejemplo de uso con colores personalizados:
const progress = document.createElement('progress-overlay');


// 🔹 Escuchar evento cuando se alcance la meta
progress.addEventListener('goalReached', (event) => {
    console.log('¡Meta alcanzada!', JSON.stringify(event.detail));
});
class GoalManager {
    constructor(id, goal = 100, currentValue = 0, text = 'Progreso', autoIncreaseBy = 100,style) {
        this.id = id; // ID único para el elemento
        this.goal = goal; // Objetivo inicial
        this.currentValue = currentValue; // Valor actual inicial
        this.text = text; // Nombre o texto descriptivo
        this.autoIncreaseBy = autoIncreaseBy; // Cantidad para aumentar el objetivo automáticamente (0 para desactivar)
        this.lastValue = 0; // Último valor registrado para el aumento automático
        this.element = null; // Referencia al elemento creado
        this.style = style;
        this.createElement(); // Crear el elemento al instanciar
    }

    // Crear el elemento progress-overlay y configurarlo
    createElement() {
        // Verificar si ya existe un elemento con este ID
        if (document.getElementById(this.id)) {
            throw new Error(`Ya existe un elemento con el ID '${this.id}'`);
        }

        this.element = document.createElement('progress-overlay');
        this.element.setAttribute('id', this.id);
        this.element.setAttribute('goal', this.goal);
        this.element.setAttribute('current-value', this.currentValue);
        this.element.setAttribute('text', this.text);

        // Estilos opcionales por defecto (personalizables)
        this.changeStyle(this.style);

        document.body.appendChild(this.element);
        return this.element;
    }
    changeStyle(style) {
        if (style) this.style = style;
        console.log("style", this.style);
        if (!this.style) this.style = {};
        this.element.setAttribute('bar-color', this.style.barColor || '#4caf50');
        this.element.setAttribute('background-color', this.style.backgroundColor || '#e0e0e0');
        this.element.setAttribute('text-color', this.style.textColor || 'black');
        this.element.setAttribute('font-size', this.style.fontSize || '16px');
        this.element.setAttribute('bar-height', this.style.barHeight || '32px');
        this.element.setAttribute('text-position', this.style.textPosition || 'inside-center');
        this.element.setAttribute('border-radius', this.style.borderRadius || '10px');
        this.element.setAttribute('text-stroke', this.style.textStroke || '0px transparent');
    }
    // Actualizar el valor actual y manejar el aumento automático del objetivo
    update(currentValue) {
        this.currentValue = currentValue;
        this.element.setAttribute('current-value', this.currentValue);

        // Si autoIncreaseBy está habilitado y se supera el umbral
        if (this.autoIncreaseBy > 0 && this.currentValue >= this.lastValue + this.autoIncreaseBy) {
            this.setGoal(this.currentValue + this.autoIncreaseBy);
            this.lastValue = this.currentValue;
        }
    }

    // Establecer un nuevo objetivo manualmente
    setGoal(newGoal) {
        this.goal = newGoal;
        this.element.setAttribute('goal', this.goal);
    }

    // Eliminar el elemento del DOM
    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    // Obtener el elemento HTML asociado
    getElement() {
        return this.element;
    }
}

// Ejemplo de uso
// Crear varias instancias
/* const manager1 = new GoalManager('progress1', 200, 50, 'Meta a', 100);
const manager2 = new GoalManager('progress2', 150, 20, 'Meta b', 0); // Sin aumento automático */
// funcion para crear elementos con un json
const initconfig = [
    {
        id: 'progress1',
        goal: 200,
        currentValue: 50,
        text: 'Meta a',
        autoIncreaseBy: 100,
        style: {
            barColor: '#4caf50',
            backgroundColor: '#e0e0e0',
            textColor: 'black',
            fontSize: '32px',
            barHeight: '64px',
            textPosition: 'inside-center',
            borderRadius: '10px',
            textStroke: '0.5px gray'
        }
    }
]
function createbyconfig(config) {
    const manager = new GoalManager(config.id, config.goal, config.currentValue, config.text, config.autoIncreaseBy, config.style);
    return manager;
}

const encodedConfig = encodeURIComponent(JSON.stringify(initconfig));

// Crear la URL con el parámetro
const newUrl = `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`;

console.log("Nueva URL:", newUrl);
function getConfigFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const configString = params.get('config');
    
    if (configString) {
        try {
            return JSON.parse(decodeURIComponent(configString));
        } catch (error) {
            console.error("Error al parsear la configuración:", error);
            return null;
        }
    }
    return null;
}

// Recuperar la configuración desde la URL
const retrievedConfig = getConfigFromUrl();

if (retrievedConfig) {
    console.log("Configuración recuperada:", retrievedConfig);
    const manager1 = createbyconfig(retrievedConfig[0]);
    
    // Crear elementos con un json
    // Simular actualizaciones
    setInterval(() => {
        manager1.update(manager1.currentValue + 25); // Aumenta en 25, con aumento automático del goal
        console.log(`Progress 1: ${manager1.currentValue}/${manager1.goal}`);
    }, 1000);
/*     const manager2 = createbyconfig(retrievedConfig[1]);

    setInterval(() => {
        console.log(`Progress 2: ${manager2.currentValue}/${manager2.goal}`);
        if (manager2.currentValue >= manager2.goal) {
            console.log('Meta 2 alcanzada, eliminando...');
        //    manager2.remove();
        } else {
            manager2.update(manager2.currentValue + 10); // Aumenta en 10, sin cambiar el goal
    
        }
    }, 1000);
    
    // Escuchar evento de meta alcanzada desde el elemento
    manager1.getElement().addEventListener('goalReached', (event) => {
        console.log('¡Meta 1 alcanzada!', JSON.stringify(event.detail));
    }); */
}

const widget_form = document.querySelector('.widget_form');
widget_form.show();
const widget_content = document.querySelector('.widget_content');
const options = [
  {
    label: 'Option 1',
    callback: () => {
        const allinputs = document.querySelectorAll('custom-input');
        allinputs.forEach(input => {
        console.log(input.getInputValues());
      });
    },
    class: 'save-btn'
  },
  {
    label: 'Option 2',
    callback: () => {
      console.log('Option 2 selected');
    },
    class: 'cancel-btn'
  }
  
];
widget_content.options = options;
widget_content.addEventListener('button-clicked', (event) => {
  console.log('Button clicked:', event.detail);
});
const config1 =     {
  id: 'progress1',
  goal: 200,
  currentValue: 50,
  text: 'Meta a',
  autoIncreaseBy: 100,
  style: {
      barColor: '#4caf50',
      backgroundColor: '#e0e0e0',
      textColor: 'black',
      fontSize: '32px',
      barHeight: '64px',
      textPosition: 'inside-center',
      borderRadius: '10px',
      textStroke: '0.5px gray'
  }
}
const formDialog = document.querySelector('.formdialog');
const selectoptions = {
    textPosition : ['inside-center', 'inside-left', 'inside-right', 'outside-left', 'outside-center', 'outside-right'],
    barHeight: ['20px', '30px', '40px', '50px'],
    borderRadius: ['5px', '10px', '15px', '20px'],
    textStroke: ['0px transparent', '0.5px gray', '1px black']
}
function parsedoptions(options){
    const parsedoptions = options.map(option => {
        return { value: option, text: option, label: option };
    });
    return parsedoptions;
}
console.log(parsedoptions(selectoptions.textPosition));
const inputsConfig = [
  { id: 'inputID', name: 'inputID', value: 'Widget', placeholder: 'your widget name', title: 'inputID', pattern: '[a-zA-Z0-9]+', type: 'text' },
  { id: 'goal', name: 'goal', value: '100', placeholder: 'your widget name', title: 'inputID', type: 'number' },
  { id: 'currentValue', name: 'currentValue', value: '0', placeholder: 'your widget name', title: 'inputID', type: 'number' },
  { id: 'inputText', name: 'inputText', value: 'my goal', placeholder: 'your widget name', title: 'inputID' },
  { id: 'autoIncreaseBy', name: 'autoIncreaseBy', value: '100', placeholder: 'your widget name', title: 'inputID', type: 'number' },
  { id: 'style_barColor', name: 'style_barColor', value: '#4caf50', placeholder: 'your widget name', title: 'inputID', type: 'color' },
  { id: 'style_backgroundColor', name: 'style_backgroundColor', value: '#e0e0e0', placeholder: 'your widget name', title: 'inputID', type: 'color' },
  { id: 'style_textColor', name: 'style_textColor', value: 'black', placeholder: 'your widget name', title: 'inputID', type: 'color' },
  { id: 'style_fontSize', name: 'style_fontSize', value: '32', placeholder: 'your widget name', title: 'inputID', type: 'number' },
  { id: 'style_barHeight', name: 'style_barHeight', value: '64', placeholder: 'your widget name', title: 'inputID', type: 'number' },
  { id: 'style_textPosition', name: 'style_textPosition', value: 'inside-center', placeholder: 'your widget name', title: 'inputID', type: 'select', options: parsedoptions(selectoptions.textPosition) },
  { id: 'style_borderRadius', name: 'style_borderRadius', value: '10', placeholder: 'your widget name', title: 'inputID', type: 'number' },
  { id: 'style_textStroke', name: 'style_textStroke', value: '0.5px gray', placeholder: 'your widget name', title: 'inputID' },
];

inputsConfig.forEach(config => {
  const inputElement = createCustomInput(config);
  formDialog.appendChild(inputElement);
});


function createCustomInput({ id, name, value, placeholder, title, pattern, type, options }) {
  const input = document.createElement('custom-input');
  input.setAttribute('id', id);
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  input.setAttribute('placeholder', name);
  input.setAttribute('title', title);
  input.setAttribute('type', type);
    if (options) {
        input.setAttribute('options', JSON.stringify(options));
    }
  if (pattern) {
      input.setAttribute('pattern', pattern);
  }
  return input;
}

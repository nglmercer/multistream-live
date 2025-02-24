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
        if (name === 'goal') this.goal = Number(newValue) || 100;
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
        this.setTextPosition(percentage);

        if (this.currentValue >= this.goal && !this.complete) {
            this.complete = true;
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
progress.setAttribute('goal', '200');
progress.setAttribute('current-value', '50');
progress.setAttribute('text', 'meta');
progress.setAttribute('bar-color', 'orange');
progress.setAttribute('background-color', '#ddd');
progress.setAttribute('text-color', 'white');
progress.setAttribute('font-size', '32px');
progress.setAttribute('font-weight', 'bold');
progress.setAttribute('bar-height', '190px');
progress.setAttribute('border-radius', '10px');
progress.setAttribute('text-stroke', '0.8px black');
progress.setAttribute('text-position', 'inside-center');
document.body.appendChild(progress);

// 🔹 Simular incremento de progreso
var testInterval = setInterval(() => {
    let newValue = parseInt(progress.getAttribute('current-value')) + 25;
    progress.setAttribute('current-value', newValue);
    if (newValue >= 250) {
        progress.setAttribute('goal', '500');
    }
}, 1000);

// 🔹 Escuchar evento cuando se alcance la meta
progress.addEventListener('goalReached', (event) => {
    console.log('¡Meta alcanzada!', JSON.stringify(event.detail));
});

class GiftElementsManager {
    constructor(items, config = {}) {
        this.items = items;
        this.defaultConfig = {
            containerClass: 'default-container',
            itemClass: 'default-item',
            imageClass: 'default-image',
            labelClass: 'default-label',
            ...config
        };
    }

    createSingleElement(item, customCallback, additionalClass = '') {
        const container = document.createElement('div');
        container.className = `${this.defaultConfig.itemClass} ${additionalClass}`.trim();

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.label;
        image.className = this.defaultConfig.imageClass;

        const label = document.createElement('span');
        label.textContent = item.label;
        label.className = this.defaultConfig.labelClass;

        const price = document.createElement('span');
        price.textContent = `${item.value}`;
        price.className = 'default-price';

        container.appendChild(image);
        container.appendChild(label);
        container.appendChild(price);

        if (customCallback) {
            container.addEventListener('click', () => customCallback(item));
        }

        return container;
    }

    renderToElement(containerId, callback, additionalClass = '') {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`No se encontró el elemento con id: ${containerId}`);
        }

        const wrapper = document.createElement('div');
        wrapper.className = this.defaultConfig.containerClass;

        this.items.forEach(item => {
            const element = this.createSingleElement(item, callback, additionalClass);
            wrapper.appendChild(element);
        });

        container.appendChild(wrapper);
        return wrapper;
    }
}

export { GiftElementsManager };
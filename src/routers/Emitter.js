class Emitter {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push({ callback, once: false });
        return () => this.off(event, callback);
    }

    once(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push({ callback, once: true });
        return () => this.off(event, callback);
    }

    off(event, callback) {
        const listeners = this.listeners.get(event);
        if (!listeners) return;
        this.listeners.set(
            event,
            listeners.filter(listener => listener.callback !== callback)
        );
        if (this.listeners.get(event).length === 0) {
            this.listeners.delete(event);
        }
    }

    emit(event, data) {
        const listeners = this.listeners.get(event) || [];
        const wildcardListeners = this.listeners.get('*') || [];

        // Ejecutar listeners del evento específico
        for (const listener of listeners.slice()) {
            listener.callback(data);
        }

        // Ejecutar listeners globales ('*') con ambos argumentos: event y data
        for (const listener of wildcardListeners.slice()) {
            listener.callback(event, data);
        }

        // Limpiar "once"
        this._cleanup(event);
        this._cleanup('*');
    }

    _cleanup(event) {
        const listeners = this.listeners.get(event);
        if (!listeners) return;

        this.listeners.set(event, listeners.filter(listener => !listener.once));
        if (this.listeners.get(event).length === 0) {
            this.listeners.delete(event);
        }
    }

    removeAllListeners(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }

    listenerCount(event) {
        const listeners = this.listeners.get(event);
        return listeners ? listeners.length : 0;
    }

    eventNames() {
        return Array.from(this.listeners.keys());
    }

    listeners(event) {
        const listeners = this.listeners.get(event);
        return listeners ? listeners.map(l => l.callback) : [];
    }

    hasListeners(event) {
        return this.listenerCount(event) > 0;
    }
}


const emitter = new Emitter();
module.exports = {
    emitter
}   
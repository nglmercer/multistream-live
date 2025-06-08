// discovery.js
const { Bonjour } = require('bonjour-service');
const { peerManager } = require('./peerManager.js');
const { P2P_SERVICE_TYPE, P2P_SERVICE_PROTOCOL } = require('../config.js');

let bonjourInstance;
let publishedService = null;

function startDiscovery(instanceName, portToAnnounce) {
    if (bonjourInstance) {
        console.warn('[Discovery] El descubrimiento ya está iniciado.');
        return;
    }

    bonjourInstance = new Bonjour();

    // Anunciar nuestro servicio
    publishedService = bonjourInstance.publish({
        name: instanceName, // Este es el nombre de NUESTRA instancia
        type: P2P_SERVICE_TYPE,
        protocol: P2P_SERVICE_PROTOCOL,
        port: portToAnnounce,
        txt: { // Metadatos adicionales opcionales
            id: instanceName, // Útil para una identificación más robusta
            timestamp: Date.now().toString()
        }
    });
    console.log(`[Discovery] Servicio publicado: ${instanceName} en puerto ${portToAnnounce} (tipo: ${P2P_SERVICE_TYPE})`);

    // Encontrar otros servicios
    const browser = bonjourInstance.find({ type: P2P_SERVICE_TYPE, protocol: P2P_SERVICE_PROTOCOL });

    browser.on('up', (service) => {
        // No añadirnos a nosotros mismos si nos encontramos (aunque bonjour debería manejarlo)
        if (service.name === instanceName && service.port === portToAnnounce) {
            return;
        }
        peerManager.addPeer(service);
    });

    browser.on('down', (service) => {
        // El evento 'down' de bonjour usualmente pasa el objeto servicio tal cual fue 'up'
        peerManager.removePeer(service);
    });

    console.log(`[Discovery] Buscando servicios '${P2P_SERVICE_TYPE}'...`);
    return publishedService;
}

function stopDiscovery() {
    return new Promise((resolve) => {
        if (publishedService) {
            publishedService.stop(() => {
                console.log('[Discovery] Servicio desanunciado.');
                publishedService = null;
                if (bonjourInstance) {
                    bonjourInstance.destroy(() => {
                        console.log('[Discovery] Instancia Bonjour destruida.');
                        bonjourInstance = null;
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        } else if (bonjourInstance) {
            bonjourInstance.destroy(() => {
                console.log('[Discovery] Instancia Bonjour destruida (sin servicio publicado).');
                bonjourInstance = null;
                resolve();
            });
        } else {
            console.log('[Discovery] No hay instancia Bonjour para detener.');
            resolve();
        }
    });
}

module.exports = {
    startDiscovery,
    stopDiscovery
};
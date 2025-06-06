// peerManager.js
const EventEmitter = require('events');

class PeerManager extends EventEmitter {
    constructor() {
        super();
        // Usamos el fqdn (fully qualified domain name) como clave ya que es único en mDNS.
        // ej: "MiNodoApp_hostname_uuid._mi-app-com._tcp.local."
        this.peers = new Map(); // key: service.fqdn, value: service details
    }

    addPeer(service) {
        if (!service || !service.fqdn) {
            console.warn('[PeerManager] Intento de añadir servicio inválido:', service);
            return;
        }
        const existingPeer = this.peers.get(service.fqdn);
        this.peers.set(service.fqdn, { ...service });

        if (!existingPeer) {
            console.log(`[PeerManager] Peer ARRIBA: ${service.name} (${service.fqdn}) en ${service.host}:${service.port}`);
            this.emit('peerUp', service);
        } else {
            // Podrías emitir 'peerUpdated' si necesitas reaccionar a cambios en un peer existente
            // console.log(`[PeerManager] Peer ACTUALIZADO: ${service.name} (${service.fqdn})`);
        }
    }

    removePeer(service) {
        if (service && service.fqdn && this.peers.has(service.fqdn)) {
            const removedPeer = this.peers.get(service.fqdn);
            this.peers.delete(service.fqdn);
            console.log(`[PeerManager] Peer ABAJO: ${removedPeer.name} (${removedPeer.fqdn})`);
            this.emit('peerDown', removedPeer);
        }
    }

    getPeerByFqdn(fqdn) {
        return this.peers.get(fqdn);
    }

    // Encuentra un peer por su nombre de instancia (el que publicamos)
    getPeerByName(instanceName) {
        for (const peer of this.peers.values()) {
            if (peer.name === instanceName) {
                return peer;
            }
        }
        return null;
    }

    getAllPeers() {
        return Array.from(this.peers.values());
    }
}

const peerManager = new PeerManager();

module.exports = {
    PeerManager,
    peerManager
};
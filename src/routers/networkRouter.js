// src/routers/networkRouter.js
const express = require('express');
const { peerManager } = require('../p2p/peerManager.js');
const { connectToPeer, sendMessage } = require('../p2p/communication.js');

// Crear el router
const router = express.Router();

// Middleware para verificar que p2pInfo esté disponible
function requireP2PInfo(req, res, next) {
    if (!req.app.locals.p2pInfo) {
        return res.status(500).json({ 
            error: 'Información P2P no disponible. El servidor P2P podría no estar inicializado.' 
        });
    }
    next();
}

// GET /peers - Obtener lista de peers
router.get('/peers', (req, res) => {
    try {
        const peers = peerManager.getAllPeers().map(p => ({
            name: p.name,
            host: p.host,
            port: p.port,
            fqdn: p.fqdn,
            txt: p.txt || {},
            ...p
        }));
        res.json({ peers });
    } catch (error) {
        console.error('Error obteniendo peers:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /peers/:peerName/send - Enviar mensaje a un peer específico
router.post('/peers/:peerName/send', requireP2PInfo, async (req, res) => {
    try {
        const { peerName } = req.params;
        const { message } = req.body;

        // Validar el mensaje
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'El campo "message" (string) es requerido en el body.' 
            });
        }

        // Buscar el peer
        const peer = peerManager.getPeerByName(peerName);
        if (!peer) {
            return res.status(404).json({ 
                error: `Peer "${peerName}" no encontrado.` 
            });
        }

        // Intentar enviar el mensaje
        const { instanceName: localInstanceName } = req.app.locals.p2pInfo;
        const socket = await connectToPeer(peer);
        
        const messagePayload = {
            senderInstanceName: localInstanceName,
            text: message,
            timestamp: new Date().toISOString()
        };

        if (sendMessage(socket, messagePayload)) {
            res.json({ 
                success: true, 
                message: `Mensaje enviado a ${peer.name}.` 
            });
        } else {
            res.status(500).json({ 
                error: 'Fallo al enviar mensaje, el socket podría estar cerrado.' 
            });
        }
    } catch (error) {
        console.error(`Error enviando mensaje a ${req.params.peerName}:`, error.message);
        res.status(500).json({ 
            error: `No se pudo enviar el mensaje: ${error.message}` 
        });
    }
});

// GET /info - Obtener información del servidor P2P y API
router.get('/info', requireP2PInfo, (req, res) => {
    try {
        const { instanceName, p2pPort } = req.app.locals.p2pInfo;
        
        // Obtener información del servidor Express
        const serverAddress = req.app.locals.serverAddress || {};
        
        res.json({
            p2pInstanceName: instanceName,
            p2pTcpPort: p2pPort,
            apiHost: serverAddress.address || 'unknown',
            apiPort: serverAddress.port || 'unknown'
        });
    } catch (error) {
        console.error('Error obteniendo información del servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
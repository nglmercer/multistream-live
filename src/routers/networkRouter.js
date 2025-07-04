// networkRouter.js
const { peerManager } = require('../p2p/peerManager.js');
const { connectToPeer, sendMessage } = require('../p2p/communication.js');

async function networkRoutes(fastify, options) {

    // Hook que reemplaza al middleware requireP2PInfo
    const requireP2PInfo = async (request, reply) => {
        // Accedemos a la información a través del decorador que definimos en server.js
        if (!fastify.p2pInfo) {
            reply.code(500).send({
                error: 'Información P2P no disponible. El servidor P2P podría no estar inicializado.'
            });
        }
    };
    
    // GET /peers
    fastify.get('/peers', async (request, reply) => {
        try {
            const peers = peerManager.getAllPeers().map(p => ({
                name: p.name, host: p.host, port: p.port, fqdn: p.fqdn,
                txt: p.txt || {}, ...p
            }));
            reply.send({ peers });
        } catch (error) {
            fastify.log.error('Error obteniendo peers:', error);
            reply.code(500).send({ error: 'Error interno del servidor' });
        }
    });

    // POST /peers/:peerName/send
    fastify.post('/peers/:peerName/send', { preHandler: [requireP2PInfo] }, async (request, reply) => {
        try {
            const { peerName } = request.params;
            const { message } = request.body;

            if (!message || typeof message !== 'string') {
                return reply.code(400).send({
                    error: 'El campo "message" (string) es requerido en el body.'
                });
            }

            const peer = peerManager.getPeerByName(peerName);
            if (!peer) {
                return reply.code(404).send({ error: `Peer "${peerName}" no encontrado.` });
            }

            const { instanceName: localInstanceName } = fastify.p2pInfo;
            const socket = await connectToPeer(peer);
            
            const messagePayload = {
                senderInstanceName: localInstanceName,
                text: message,
                timestamp: new Date().toISOString()
            };

            if (sendMessage(socket, messagePayload)) {
                reply.send({ success: true, message: `Mensaje enviado a ${peer.name}.` });
            } else {
                reply.code(500).send({ error: 'Fallo al enviar mensaje, el socket podría estar cerrado.' });
            }
        } catch (error) {
            fastify.log.error(`Error enviando mensaje a ${request.params.peerName}:`, error.message);
            reply.code(500).send({ error: `No se pudo enviar el mensaje: ${error.message}` });
        }
    });

    // GET /info
    fastify.get('/info', { preHandler: [requireP2PInfo] }, async (request, reply) => {
        try {
            const { instanceName, p2pPort } = fastify.p2pInfo;
            // Accedemos a la dirección del servidor a través del decorador
            const serverAddress = fastify.serverAddress || {};
            
            reply.send({
                p2pInstanceName: instanceName,
                p2pTcpPort: p2pPort,
                apiHost: serverAddress.address || 'unknown',
                apiPort: serverAddress.port || 'unknown'
            });
        } catch (error) {
            fastify.log.error('Error obteniendo información del servidor:', error);
            reply.code(500).send({ error: 'Error interno del servidor' });
        }
    });
}

module.exports = networkRoutes;
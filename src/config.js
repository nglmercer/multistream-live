// config.js
const P2P_SERVICE_TYPE = 'apiserver-com';
const P2P_SERVICE_PROTOCOL = 'tcp';
const P2P_INSTANCE_NAME_PREFIX = 'MinecraftNodeApp_';
const P2P_MESSAGE_DELIMITER = '\n';

// Podrías añadir configuraciones de Fastify aquí también si lo deseas
const API_HOST = '0.0.0.0';
const API_PORT = getPortFromArgs() || process.env.PORT || 9001;

function getPortFromArgs(prefix = "--port=") {
    // Convierte el prefijo a minúsculas para la comparación
    const lowerCasePrefix = prefix.toLowerCase();
    console.log("process.argv", process.argv);
    
    // Busca un argumento que, convertido a minúsculas, empiece con el prefijo
    const arg = process.argv.find(arg => arg.toLowerCase().startsWith(lowerCasePrefix));
    
    if (arg) {
        const port = arg.split('=')[1];
        return parseInt(port, 10);
    }
    return null;
}

console.log(API_PORT, getPortFromArgs());

module.exports = {
    P2P_SERVICE_TYPE,
    P2P_SERVICE_PROTOCOL,
    P2P_INSTANCE_NAME_PREFIX,
    P2P_MESSAGE_DELIMITER,
    API_HOST,
    API_PORT
};
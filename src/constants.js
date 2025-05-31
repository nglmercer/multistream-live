const path = require('node:path');
// =============================================================================
// CONSTANTES GLOBALES
// =============================================================================

const PlatformType = {
    TIKTOK: 'tiktok',
    KICK: 'kick'
};

const LiveEvents = ['ready', 'ChatMessage', 'Subscription', 'disconnected', 'login', 'close'];

const tiktokLiveEvents = [
    'chat', 'gift', 'connected', 'disconnected',
    'websocketConnected', 'error', 'member', 'roomUser',
    'like', 'social', 'emote', 'envelope', 'questionNew',
    'subscribe', 'follow', 'share', 'streamEnd'
];

const TIKTOK_CONFIG = {
    processInitialData: true,
    enableExtendedGiftInfo: true,
    enableWebsocketUpgrade: true,
    requestPollingIntervalMs: 2000,
    requestOptions: { timeout: 10000 },
    websocketOptions: { timeout: 10000 }
};

const SIGNATURE_API_KEY = "NmYzMGMwNmMzODQ5YmUxYjkzNTI0OTIyMzBlOGZlMjgwNTJhY2JhMWQ0MzhhNWVmMGZmMjgy";
const uri = path.join(__dirname, '../public');

module.exports = {
    PlatformType,
    LiveEvents,
    tiktokLiveEvents,
    TIKTOK_CONFIG,
    SIGNATURE_API_KEY,
    uri
};

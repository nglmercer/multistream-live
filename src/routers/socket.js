const { RoomManager } = require('../modules/socketManager.js');
const { io } = require('../routers/index.js');
const roomManager = new RoomManager(io);
module.exports = { roomManager };
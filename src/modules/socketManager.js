class RoomManager {
    constructor(io) {
      this.io = io;
      this.rooms = new Map(); // Almacena información de las salas
    }
  
    // Unir usuario a sala
    joinRoom(socket, roomId) {
      socket.join(roomId);
      
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      
      this.rooms.get(roomId).add(socket.id);
      
      return {
        roomId,
        usersCount: this.rooms.get(roomId).size
      };
    }
  
    // Salir de sala
    leaveRoom(socket, roomId) {
      socket.leave(roomId);
      
      if (this.rooms.has(roomId)) {
        this.rooms.get(roomId).delete(socket.id);
        
        // Eliminar sala si está vacía
        if (this.rooms.get(roomId).size === 0) {
          this.rooms.delete(roomId);
        }
      }
    }
  
    // Emitir a todos los usuarios en una sala
    emitToRoom(roomId, eventName, data) {
      this.io.to(roomId).emit(eventName, data);
    }
  
    // Obtener usuarios en una sala
    getRoomUsers(roomId) {
      return this.rooms.get(roomId) || new Set();
    }
  
    // Verificar si una sala existe
    roomExists(roomId) {
      return this.rooms.has(roomId);
    }
  
    // Obtener número de usuarios en una sala
    getRoomSize(roomId) {
      return this.rooms.get(roomId)?.size || 0;
    }
}
module.exports = { RoomManager };
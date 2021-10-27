const Room = require('./room');
const User = require('./user');

class Rooms {
    constructor() {
        this.rooms = [];
    }

    // returns the new room
    createRoom = (userId, roomId) => {
        const room = new Room(userId, roomId, true);
        this.rooms.push(room);
        return room;
    }

    // returns the new user
    addUserToRoom = (user, username, roomId) => {
        const room = this.rooms.find(room => room.id === roomId);
        if (!room) {
            return null;
        }
        const user = new User(userId, username, false);
        room.addUser(user);
        return room
    }

    // returns the user
    removeUserFromRoom = (userId, roomId) => {
        const room = this.rooms.find(room => room.id === roomId);
        if (!room) {
            return null;
        }
        room.removeUser(userId);
        return room;
    }

    // returns the room
    changeRoomCharacteristics = (userId, roomId, newCharacteristics) => {
        const room = this.rooms.find(room => room.id === roomId);
        if (!room) {
            return null;
        }
        room.changeCharacteristics(userId, newCharacteristics);
        return room;
    }
}

module.exports = Rooms;
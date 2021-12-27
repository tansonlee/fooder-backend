const { generateRoomId, generateUserId } = require("../utilities");
const Room = require("./room");
const User = require("./user");

class Rooms {
  constructor() {
    this.rooms = [];
  }

  // returns roomid and userid
  createRoom = (username) => {
    const newRoomId = generateRoomId();
    const newUserId = generateUserId();
    const room = new Room(username, newUserId, newRoomId, true);
    this.rooms.push(room);
    return { roomId: newRoomId, userId: newUserId };
  };

  // returns the new user
  addUserToRoom = (username, roomId) => {
    const room = this.rooms.find((room) => room.id === roomId);
    if (!room) {
      return null;
    }
    const user = new User(username, userId, false);
    room.addUser(user);

    return room.getCurrentUsers();
  };

  // returns the user
  removeUserFromRoom = (userId, roomId) => {
    const room = this.rooms.find((room) => room.id === roomId);
    if (!room) {
      return null;
    }
    room.removeUser(userId);
    return room;
  };

  // returns the room
  changeRoomCharacteristics = (userId, roomId, newCharacteristics) => {
    const room = this.rooms.find((room) => room.id === roomId);
    if (!room) {
      return null;
    }
    room.changeCharacteristics(userId, newCharacteristics);
    return room;
  };
}

module.exports = Rooms;

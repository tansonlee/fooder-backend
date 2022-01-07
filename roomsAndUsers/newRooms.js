const { generateRoomId } = require("../utilities");

class Rooms {
  constructor() {
    this.data = {};
  }

  addRoom() {
    const roomId = generateRoomId();
    this.data[roomId] = {
      users: {},
      matchedRestaurants: [],
    };
    return roomId;
  }
  addUserToRoom(username, userId, roomId) {
    this.data[roomId].users[userId] = {
      username: username,
      acceptedRestaurants: [],
    };
  }
  // returns true if there is a match between all users
  acceptRestaurant(roomId, userId, restaurantId) {
    this.data[roomId].users[userId].acceptedRestaurants.push(restaurantId);
    if (
      this.checkForMatch(roomId, restaurantId) &&
      !this.data[roomId].matchedRestaurants.includes(restaurantId)
    ) {
      this.data[roomId].matchedRestaurants.push(restaurantId);
      return true;
    }
    return false;
  }
  // returns true if there is a match between all users
  checkForMatch(roomId, restaurantId) {
    const userArray = Object.values(this.data[roomId].users);
    for (const user of userArray) {
      if (!user.acceptedRestaurants.includes(restaurantId)) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Rooms;

const { generateRoomId } = require("../utilities");

class Rooms {
	// this.data is an object like this:
	// {
	//   room1: {
	//     users: {
	//       user1: {
	//         username: "user1",
	//         acceptedRestaurants: [restaurantId1, restaurantId2],
	//         isOwner: true,
	//         userId: "sadfasdf234234HJSDKF"
	//       }
	//     },
	//     matchedRestaurants: [restaurantId1, restaurantId2]
	//   }
	// }

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
	addUserToRoom(username, userId, roomId, isOwner) {
		if (!(roomId in this.data)) return;

		this.data[roomId].users[userId] = {
			username: username,
			acceptedRestaurants: [],
			isOwner: isOwner,
			userId: userId,
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
	getRoomUsers(roomId) {
		const userArray = Object.values(this.data[roomId].users);
		return userArray;
	}
	getMatchedRestaurants(roomId) {
		return this.data[roomId].matchedRestaurants;
	}
}

module.exports = Rooms;

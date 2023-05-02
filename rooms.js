const { generateRoomId } = require('./utilities');

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

	isValidRoomId(roomId) {
		return roomId in this.data;
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

	computeMatches(roomId) {
		const allAcceptedRestaurants = Object.values(this.data[roomId].users).map(
			user => user.acceptedRestaurants
		);
		const numberOfUsers = Object.keys(this.data[roomId].users).length;
		const acceptedRestaurantCounts = {};
		const flattenedAcceptedRestaurants = allAcceptedRestaurants.flat();
		for (const restaurant of flattenedAcceptedRestaurants) {
			if (restaurant in acceptedRestaurantCounts) {
				acceptedRestaurantCounts[restaurant] += 1;
			} else {
				acceptedRestaurantCounts[restaurant] = 1;
			}
		}
		const matchedRestaurants = Object.keys(acceptedRestaurantCounts).filter(
			restaurant => acceptedRestaurantCounts[restaurant] === numberOfUsers
		);
		this.data[roomId].matchedRestaurants = matchedRestaurants;
	}

	// returns { hasNewOwner: Boolean, newOwner: String | null}
	removeUserFromRoom(userId, roomId) {
		// room does not exist
		if (!(roomId in this.data)) return { hasNewOwner: false, newOwner: null };

		const user = this.data[roomId].users[userId];
		delete this.data[roomId].users[userId];

		this.computeMatches(roomId);

		// if there are no more users, delete the room
		if (Object.keys(this.data[roomId].users).length === 0) {
			delete this.data[roomId];
			return {
				hasNewOwner: false,
				newOwner: null,
			};
		}

		if (user.isOwner && Object.keys(this.data[roomId].users).length > 0) {
			// if the user is the owner, assign a new random owner
			const newOwner = Object.values(this.data[roomId].users)[0];
			newOwner.isOwner = true;
			return {
				hasNewOwner: true,
				newOwner: newOwner.userId,
			};
		}
		return {
			hasNewOwner: false,
			newOwner: null,
		};
	}

	// returns true if there is a match between all users
	acceptRestaurant(roomId, userId, restaurantId) {
		this.data[roomId].users[userId].acceptedRestaurants.push(restaurantId);
		// if (
		// 	this.checkForMatch(roomId, restaurantId) &&
		// 	!this.data[roomId].matchedRestaurants.includes(restaurantId)
		// ) {
		// 	this.data[roomId].matchedRestaurants.push(restaurantId);
		// 	return true;
		// }
		// return false;
		this.computeMatches(roomId);
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
		if (!(roomId in this.data)) {
			return;
		}
		const userArray = Object.values(this.data[roomId].users);
		return userArray;
	}
	getMatchedRestaurants(roomId) {
		return this.data[roomId].matchedRestaurants;
	}
}

module.exports = Rooms;

class Room {
	constructor(username, userId, roomId, isAdmin) {
		this.roomId = roomId;
		this.users = [];
		this.currentFoodChoices = [];
		this.characteristics = {
			location: "",
		};

		this.addUser(new User(username, userId, isAdmin));
	}

	addUser(user) {
		this.users.push(user);
	}

	removeUser(userId) {
		this.users = this.users.filter(user => user.id !== userId);
	}

	// characteristics is an object for example { location: "waterloo" }
	changeCharacteristics(userId, characteristics) {
		if (!this.users.find(user => user.id === userId)) {
			return null;
		}
		this.characteristics = { ...this.characteristics, ...characteristics };
	}

	getCurrentUsers = () => {
		return this.users.map(user => user.username);
	};
}

modules.exports = Room;

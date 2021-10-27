
class Room {
    constructor(roomId) {
        this.roomId = roomId;
        this.users = [];
        this.currentFoodChoices = [];
        this.characteristics = {
            location: ""
        }
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
        this.characteristics = {...this.characteristics, ...characteristics};
    }
}

modules.exports = Room;
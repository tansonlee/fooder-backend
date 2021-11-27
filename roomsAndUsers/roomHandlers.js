const Rooms = new (require("./rooms"))();

// when a room is created, a username is needed
// a room id and user id are generated and returned
const handleCreateRoom = username => {
	console.log(`creating a room by ${username}`);
	const { userId, roomId } = Rooms.createRoom(username);
	return { userId, roomId };
};

// when joining a room, a username and room id are needed
// a user id is generated and returned
// the usernames of all current users are sent to the joining user
const handleJoinRoom = io => (username, roomId) => {
	console.log(`${username} joining room ${roomId}`);
	// add user to the room
	const currentUsers = Rooms.addUserToRoom(username, roomId);

	// emit to all other users in the room this user joined
	io.to(roomId).emit("user_joined", currentUsers);
};

// when a user leaves a room, a username and room id are needed
// the userId of the person who left is returned
const handleLeaveRoom = io => (userId, roomId) => {
	console.log(`${user} leaving room ${roomId}`);
	// remove user from the room
	const user = Rooms.removeUserFromRoom(userId, roomId);

	// emit to all other users in the room this user left
	io.to(roomId).emit("user_left", userId);
};

const handleChangeRoomCharacteristics = io => (userId, roomId, newCharacteristics) => {
	console.log(
		`${user} changing room ${roomId} characteristics to ${newCharacteristics.toString()}`
	);
	const room = Rooms.changeRoomCharacteristics(userId, roomId, newCharacteristics);

	// emit to all other users in the room the new characteristics
	io.to(roomId).emit("room_characteristics_changed", room);
};

module.exports = {
	handleCreateRoom,
	handleJoinRoom,
	handleLeaveRoom,
	handleChangeRoomCharacteristics,
};

const Rooms = new (require('./rooms'))();

const handleCreateRoom = (io, socket) => (userId, username) => {
    console.log(`creating a room by ${username}`)
    // use the socket.id as the roomId like how he does it: https://www.youtube.com/watch?v=jD7FnbI76Hg&ab_channel=TraversyMedia
    const room = Rooms.createRoom(userId, username, socket.id)

    // emit to all users that there is a new possible room to join
    io.emit("new_room", room)
}

const handleJoinRoom = io => (userId, username, roomId) => {
    console.log(`${username} joining room ${roomId}`)
    // add user to the room
    const user = Rooms.addUserToRoom(userId, username, roomId)

    // emit to all other users in the room this user joined
    io.to(roomId).emit("user_joined", user)
  }

const handleLeaveRoom = io => (userId, roomId) => {
    console.log(`${user} leaving room ${roomId}`)
    // remove user from the room
    const user = Rooms.removeUserFromRoom(userId, roomId)

    // emit to all other users in the room this user left
    io.to(roomId).emit("user_left", user)
}

const handleChangeRoomCharacteristics = io => (userId, roomId, newCharacteristics) => {
    console.log(`${user} changing room ${roomId} characteristics to ${newCharacteristics.toString()}`)
    const room = Rooms.changeRoomCharacteristics(userId, roomId, newCharacteristics)

    // emit to all other users in the room the new characteristics
    io.to(roomId).emit("room_characteristics_changed", room)
}

module.exports = {
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveRoom,
    handleChangeRoomCharacteristics
}

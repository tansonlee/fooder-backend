const ROOM_ID_LENGTH = 6;

// a 6 character ID contatining only capital letters
const generateRoomId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return id;
};

// a random 16 character alpha numeric string
const generateUserId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 16; i++) {
    id += characters[Math.floor(Math.random() * characters.length)];
  }
  return id;
};

const findRoomId = (roomSet) => {
  let room;
  roomSet.forEach((item) => {
    if (item.length == ROOM_ID_LENGTH) {
      room = item;
    }
  });
  return room;
};

module.exports = { generateRoomId, generateUserId, findRoomId };

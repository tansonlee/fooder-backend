const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotEnv = require("dotenv").config();
const axios = require("axios");

const {
	handleCreateRoom,
	handleJoinRoom,
	handleLeaveRoom,
	handleChangeRoomCharacteristics,
} = require("./roomsAndUsers/roomHandlers");

const port = process.env.PORT || 3000;

let allRestaurants = [];
let acceptedRestaurants = [];

const getRestaurants = async () => {
	try {
		const yelpRes = await axios.get(process.env.YELP_RESTAURANT_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${process.env.YELP_API_KEY}`,
			},
			params: {
				location: "Waterloo, Ontario",
			},
		});
		allRestaurants = yelpRes.data.businesses;
	} catch (error) {
		console.error(error);
	}
};
getRestaurants();

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/prototype.html");
});

app.get("/restaurants", (req, res) => {
	restaurantList = allRestaurants.map(restaurant => {
		return restaurant.name;
	});
	res.json({
		restaurants: restaurantList,
	});
});

io.on("connection", socket => {
	console.log(socket);
	socket.on("accept restaurant", restaurant => {
		console.log("accepted:", restaurant);
		acceptedRestaurants = [...acceptedRestaurants, restaurant];
		io.emit("new match", restaurant);
	});
	socket.on("chat message", msg => {
		console.log("new msg", msg);
		io.emit("chat message", msg);
	});
	console.log("a user has connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});

	// user creates a new room
	socket.on("create_room", handleCreateRoom(io, socket));

	// user joins an existing room
	socket.on("join_room", handleJoinRoom(io));

	// user leaves a room
	socket.on("leave_room", handleLeaveRoom(io));

	// changing a room's characteristics
	// newCharacteristics is an object with the new characteristics
	socket.on("change_room_characteristics", handleChangeRoomCharacteristics(io));
});

server.listen(port, () => {
	console.log("listening on *:3000");
});

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotEnv = require("dotenv").config();
const axios = require("axios");
const bodyParser = require("body-parser");
const Rooms = require("./roomsAndUsers/newRooms");

const { findRoomId } = require("./utilities");

const port = process.env.PORT || 3000;

let rooms = new Rooms();

const getRestaurants = async location => {
	try {
		const yelpRes = await axios.get(process.env.YELP_RESTAURANT_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${process.env.YELP_API_KEY}`,
			},
			params: {
				// location: "Waterloo, Ontario",
				location,
			},
		});
		return yelpRes.data.businesses;
	} catch (error) {
		console.error(error);
		return error;
	}
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.status(200).send("Hello World! Server is running");
});

// app.get("/restaurants", async (req, res) => {
// 	restaurantList = await getRestaurants();
// 	restaurantList = restaurantList.map(restaurant => {
// 		return restaurant.name;
// 	});
// 	res.json({
// 		restaurants: restaurantList,
// 	});
// });

app.post("/create-room", (req, res) => {
	console.log(`POST to /create-room`);
	const roomId = rooms.addRoom();
	res.status(200).json({ roomId });
});

io.on("connection", socket => {
	// user joins a room, emit to all users in the room the updated list of all usernames
	socket.on("JOIN_ROOM", ({ username, roomId }) => {
		console.log(
			`on JOIN_ROOM: ${username} joined room ${roomId}, socket.rooms is: ${JSON.stringify(
				socket.rooms
			)}`
		);
		socket.join(roomId);
		rooms.addUserToRoom(username, socket.id, roomId);

		const usernames = rooms.getRoomUsers(roomId);
		console.log(`emit NEW_ROOM_USERS: ${usernames}`);
		io.in(roomId).emit("NEW_ROOM_USERS", usernames);
	});

	// room owner requests the list of restaurants from yelp, emit to all users in the room the list of restaurants
	socket.on("GET_RESTAURANTS", async ({ location }) => {
		console.log(`on GET_RESTAURANTS: location=${location}`);
		const room = findRoomId(socket.rooms);
		const restaurants = await getRestaurants(location);
		console.log(`emit FOUND_RESTAURANTS: ${restaurants.map(e => e.name)}`);
		io.in(room).emit("FOUND_RESTAURANTS", restaurants);
	});

	// user accepts a restaurant, if there is a match for all users, emit to all users in the room the updated list of matched restaurants
	socket.on("ACCEPT_RESTAURANT", ({ restaurantId }) => {
		console.log(`on ACCEPT_RESTAURANT: restaurantId=${restaurantId}`);
		const roomId = findRoomId(socket.rooms);
		const userId = socket.id;
		const hasMatch = rooms.acceptRestaurant(roomId, userId, restaurantId);
		if (hasMatch) {
			console.log(`emit MATCHES_FOUND`);
			// socket.emit("MATCHES_FOUND", rooms.getMatchedRestaurants(roomId));
			io.in(roomId).emit("MATCHES_FOUND", rooms.getMatchedRestaurants(roomId));
		}
	});
});

// if you send a text to someone, link to app store

server.listen(port, () => {
	console.log(`listening on port: ${port}`);
});

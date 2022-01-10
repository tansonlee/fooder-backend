const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const dotEnv = require("dotenv").config();
const cors = require("cors");
const io = require("socket.io")(server, {
	cors: {
		// origin: process.env.APP_ENDPOINT,
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});
const axios = require("axios");
const bodyParser = require("body-parser");
const Rooms = require("./roomsAndUsers/newRooms");
app.use(
	cors({
		// origin: process.env.APP_ENDPOINT,
		origin: "http://localhost:3000",
	})
);

const { findRoomId } = require("./utilities");

const port = process.env.PORT || 3001;

let rooms = new Rooms();

const getRestaurants = async (location, radius, price) => {
	try {
		const yelpRes = await axios.get(process.env.YELP_RESTAURANT_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${process.env.YELP_API_KEY}`,
			},
			params: {
				// location: "Waterloo, Ontario",
				location: location,
				radius: radius,
				price: price.join(", "),
				open_now: true,
				limit: 40,
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

// coordinates are something like this: 43.6532,-79.3832
app.get("/address/:coordinates", async (req, res) => {
	try {
		const [lat, lng] = req.params.coordinates.split(",");
		const ep = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPEN_CAGE_API_KEY}`;
		console.log("ep", ep);
		const response = await axios.get(ep);
		console.log("response", response.data);
		const address = response.data.results[0].formatted;
		res.json({
			success: true,
			address: address,
		});
	} catch (e) {
		console.error(e);
		res.json({ success: false, error: e });
	}
});

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
	socket.on("GET_RESTAURANTS", async ({ location, radius, price }) => {
		console.log(`on GET_RESTAURANTS: location=${location}`);
		const room = findRoomId(socket.rooms);
		const restaurants = await getRestaurants(location, radius, price);
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

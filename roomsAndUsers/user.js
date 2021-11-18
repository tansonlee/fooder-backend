class User {
	constructor(username, userId, isAdmin) {
		this.id = userId;
		this.username = username;
		this.isAdmin = isAdmin;
	}
}

modules.exports = User;

db = db.getSiblingDB("app")

db.createUser({
	user: "app-user",
	pwd: "password",
	roles: [
		{ role: "readWrite", db: "app" },
		{ role: "dbAdmin", db: "app" }
	]
})

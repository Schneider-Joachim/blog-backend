import Sequelize from "sequelize";
import PostModel from "./Post.js";
import UserModel from "./User.js";
import bcrypt from "bcrypt";


let db; 
if (process.env.RDS_HOSTNAME) {
	console.log("Connecting to RDS", process.env.RDS_HOSTNAME);
	// if we're running on elasticbeanstalk, use elasticbeanstalk connection
	db = new Sequelize(`postgres://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`, {
		logging: false,
	})
} else {
	console.log("Connecting to local database");
	// if we're running locally, use the localhost connection
	db = new Sequelize("postgres://worktime@localhost:5432/blog", {
		logging: false,
	});
}

// const db = new Sequelize("postgres://worktime@localhost:5432/blog");
const Post = PostModel(db);
const User = UserModel(db);

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to DB successfully");

		await db.sync(); // sync by creating the tables based off our models if they don't exist already
	} catch (error) {
		console.error(error);
		console.error("PANIC! DB POBLEM!");
	}

	// Post.belongsTo(User, { foreignKey: "authorID" });

};

//#10 seeding the database
const createFirstUser = async () => {
	const users = await User.findAll({});
	if (users.length === 0) {
		User.create({
			email: "max",
			password: bcrypt.hashSync("supersecret", 10),
		});
	}
};

const createSecondUser = async () => {
	const secondUser = await User.findOne({
		where: { email: "testymctesterson" },
	});
	if (!secondUser) {
		User.create({
			email: "testymctesterson",
			password: bcrypt.hashSync("secret", 10),
		});
	}
};

const serverStarted = async () => { 
	const user = await User.findOne({ email: "sj@gmail.com" });
	if (!user) {
		await User.create({
			email:"sj@gmail.com",
			firstName: "Snites",
			password: bcrypt.hashSync("Okurr", 10),
		});
	}
};

connectToDB().then(() => {
	createFirstUser();
	createSecondUser();
	serverStarted();
});

export { db, Post, User };


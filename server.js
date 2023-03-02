import express from "express";
import cors from "cors";
import { db, Post, User } from "./db/db.js";
import bcrypt from "bcrypt";

const server = express();
server.use(cors({ credentials: true, origin: ["http://localhost:3000", "https://evnowsite.com", "https://www.evnowsite.com"] }));
server.use(express.json());

server.get("/", (req, res) => {
	res.send("Server on");
}); 

server.post("/newPost", async (req, res)=>{
    await Post.create(req.body);
    res.send({status: "ok"});
});

server.get("/posts", async (req,res) => {
    const posts = await Post.findAll();
    res.send({ posts })
});

server.get("/post/:id", async (req, res) => {
	const post = await Post.findByPk(req.params.id);
	res.send({ post });
});

server.delete("/post/:id", async (req, res) => {
	const post = await Post.findByPk(req.params.id);
	await post.destroy();
	res.send({ deleted: "DELETED"});
});


server.post("/login", async (req, res) => {
	res.send({ loggedIn: true });
});


// bind to the correct port that AWS assigns us
let port = 3001; 
if (process.env.PORT) {
	port = process.env.PORT;
}

//#9 run express API server in background to listen for incoming requests
server.listen(port, () => {
	console.log("Server running.");
});

// server.listen(3001, () => {
// 	console.log("Yo! Server is running on port 3001! Yea!");
// });
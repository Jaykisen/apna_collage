const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 5050;
const MONGO_URL = "mongodb://root:example@mongo:27017/?authSource=admin";
const DB_NAME = "newdatabase";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Also parse JSON body if needed
app.use(express.static("public")); // Serve frontend from /public

const client = new MongoClient(MONGO_URL);

let db;

// Initialize Mongo connection once at server start
async function initMongo() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db(DB_NAME);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

initMongo();

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch users");
  }
});

// POST new user
app.post("/addUser", async (req, res) => {
  try {
    const userObj = req.body;
    const result = await db.collection("users").insertOne(userObj);
    console.log("User inserted with id:", result.insertedId);
    res.status(201).send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add user");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


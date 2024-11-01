const express = require("express");
const app = express();
const { connectDB, mongoURI } = require("./db");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const serviceAccount = require(process.env.GOOGLE_CLOUD_CREDENTIALS_PATH);

app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

const projectSchema = new mongoose.Schema({
  title: String,
  technology: String,
  partners: String,
  description: String,
});

const Project = mongoose.model("Project", projectSchema);

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// db collection
const researchCollection = client.db("mydatabase").collection("projects");

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// getting user id
var admin = require("firebase-admin");

// var serviceAccount = require("./firebase/job-site-f3932-firebase-adminsdk-yn3tj-c83834d58f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/submit", async (req, res) => {
  // const { title, technology, partners, description } = req.body;
  const research = req.body;
  // const newProject = new Project({ title, technology, partners, description });

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  const token = authHeader.split(" ")[1]; // Bearer token

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    // await newProject.save();
    // console.log("User ID:", userId, "Data:", req.body.data);
    await researchCollection.insertOne({ ...research, userId });

    res.status(201).send({ message: "Project saved successfully" });
  } catch (error) {
    console.error("Error saving project:", error);
    res
      .status(500)
      .send({ error: "Failed to save project", details: error.message });
  }
});

app.get("/researches", async (req, res) => {
  const cursor = researchCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

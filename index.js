const express = require("express");
const app = express();
const { connectDB, mongoURI } = require("./db");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
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

app.post("/submit", async (req, res) => {
  // const { title, technology, partners, description } = req.body;
  const research = req.body;
  // const newProject = new Project({ title, technology, partners, description });

  try {
    // await newProject.save();
    await researchCollection.insertOne(research);
    res.status(201).send({ message: "Project saved successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to save project" });
  }
});

app.get("/researches", async (req, res) => {
  const cursor = researchCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

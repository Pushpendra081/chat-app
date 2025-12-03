import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { connectDB } from "./library/db.js";

// Create express app and HTTP server

const app = express();
const server = http.createServer(app);

// middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req,res) => res.send("Server is Live"));

// connect to mongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT)) ;
const multer = require("multer");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { uploadFile, downloadFile } = require("./utils/s3-ops");
const port = 3003;
const crypto = require("crypto");
const fs = require("fs");
const s3 = require("./utils/s3-config");
const { Pool } = require("pg");
const path = require("path");
const app = express();
const HOST = "http://localhost:3003";


app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// PSQL Connection Code

const pool = new Pool({
  user: "moon-admin",
  host: "localhost",
  database: "moon",
  password: "admin",
  port: 5432,
});

// room broadcasting code
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);
    socket.to(roomId).emit("userJoined", `${socket.id} joined room ${roomId}`);
  });

  // Handle leaving a room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`Client left room: ${roomId}`);
    socket.to(roomId).emit("userLeft", `${socket.id} left room ${roomId}`);
  });

  // Handle broadcasting a message to a room (e.g., play a track)
  socket.on("broadcastToRoom", ({ roomId, message }) => {
    socket.to(roomId).emit("broadcastMessage", message);
  });

  // Audio broadcasting to the client endpoint
  socket.on("requestAudio", (roomId) => {
    const audioUrl = `${HOST}/sample.mp3`;
    io.to(roomId).emit("playAudio", { url: audioUrl });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// temporary storage for file uploads
const upload = multer({ dest: "uploads/" });

app.get("/download-file", async (req, res) => {
  // Extract the objectKey from the query parameter
  const { objectKey } = req.query;

  if (!objectKey) {
    return res.status(400).send("No objectKey provided");
  }

  const bucketName = "moon-music-files"; // Replace with your actual bucket name

  try {
    // Use your download function to download the file and get the local path
    if(await downloadFile(bucketName, objectKey) == true){
      res.send('File download successful.')
    }

    
  } catch (error) {
    console.error("Error in file download:", error);
    res.status(500).send("Error downloading the file");
  }
});

app.post("/upload-file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const hash = crypto
    .createHash("md5")
    .update(req.file.originalname)
    .digest("hex");
  const bucketName = "moon-music-files"; // Replace with your actual bucket name
  const key = `${hash}.mp3`; // The hash is used as the key for storage

  uploadFile(req.file.path, bucketName, key)
    .then(() => {
      fs.unlinkSync(req.file.path); // Clean up the file from the local filesystem

      // Insert song name and key into the PostgreSQL database
      const insertQuery =
        "INSERT INTO song_index(song_name, key) VALUES($1, $2)";
      pool.query(insertQuery, [req.file.originalname, key], (err, result) => {
        if (err) {
          console.error("Error saving to database:", err);
          return res.status(500).send("Error saving file info to database.");
        }
        // Send response only after both upload and DB insert are successful
        res.send(`File uploaded successfully and info saved to database.`);
      });
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      res.status(500).send("Error uploading file.");
    });
});

app.get("/", (req, res) => {
  res.send("Hello from Music Service!");
});

server.listen(port, () => {
  console.log(`Music service listening at http://localhost:${port}`);
});

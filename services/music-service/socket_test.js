const io = require("socket.io-client");
const socket = io("http://localhost:3003");

socket.on("connect", () => {
  console.log("Connected to server");

  // Join a room
  socket.emit("joinRoom", "testRoom");

  // Listen for a welcome message or other users joining
  socket.on("userJoined", (msg) => {
    console.log(msg);
  });

  // Test sending a message to the room
  socket.emit("broadcastToRoom", {
    roomId: "testRoom",
    message: "Hello, room!",
  });

  socket.on("broadcastMessage", (message) => {
    console.log("Message from room:", message);
  });
});

socket.on('playAudio', (data) => {
    const audio = new Audio(data.url);
    audio.play()
      .then(() => console.log("Audio playing..."))
      .catch(error => console.log("Error playing audio:", error));
  });

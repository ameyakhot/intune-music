const express = require("express");
const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello from User Service!");
});

app.listen(port, () => {
  console.log(`User service listening at http://localhost:${port}`);
});

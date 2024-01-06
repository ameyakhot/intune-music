const express = require("express");
const app = express();
const port = 3003;

app.get("/", (req, res) => {
  res.send("Hello from Music Service!");
  res.send("ok.")
});

app.listen(port, () => {
  console.log(`User service listening at http://localhost:${port}`);
});

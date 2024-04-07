const express = require("express");
const cors = require("cors"); // Import the cors middleware
const main = require("./db.js");
const users = require("./Routes/CreateUser.js");

const app = express();

app.use(cors()); // Enable CORS for all routes

// Other middleware and route handlers...

const port = 8080;
main();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", users);
app.use("/", require("./Routes/DisplayData.js"));
app.use("/", require("./Routes/OrderData.js"));
app.get("/", (req, res) => {
  res.send("server working well");
});

app.listen(port, () => {
  console.log(`App is listening port ${port}`);
});

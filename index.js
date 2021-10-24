/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");
const geoRoutes = require("./routes/geo");
const verifyToken = require("./routes/verifyToken");

app.get("/", (req, res) => {
  res.send("Welcome to the auth system");
});

app.get("/api/user/profile", verifyToken, (req, res) => {
  res.send("This is the user profile");
});

app.use("/api/users", authRoutes);
app.use("/api/geo-data", geoRoutes);

mongoose
  .connect(
    "mongodb+srv://nyuihjknear@cluster0.a669d.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));

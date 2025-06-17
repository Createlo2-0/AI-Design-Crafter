const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db } = require("./src/config/firebase");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

//DB Connectivity
db.listCollections()
  .then((collections) => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });

// server
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

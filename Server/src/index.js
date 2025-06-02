require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check route for Firebase
app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
  res.json({ status: "API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
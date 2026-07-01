require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const projectRoutes = require("./routes/projects");
const messageRoutes = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(express.json());

const allowedOrigins = (process.env.CLIENT_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

// ---- Routes ----
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState, // 1 = connected
    time: new Date().toISOString(),
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---- DB connection + server start ----
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

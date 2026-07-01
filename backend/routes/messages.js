const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// POST /api/messages -> submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are all required" });
    }
    const saved = await Message.create({ name, email, message });
    res.status(201).json({ success: true, message: "Message sent successfully", data: saved });
  } catch (err) {
    res.status(400).json({ error: "Failed to send message", details: err.message });
  }
});

// GET /api/messages -> (admin) list all messages, newest first
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages", details: err.message });
  }
});

module.exports = router;

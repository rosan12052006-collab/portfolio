const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    category: { type: String, default: "Web" }, // e.g. Web, Mobile, AI/ML, Tool
    image: { type: String, default: "" }, // URL to screenshot/cover image
    liveUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // for manual sorting
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);

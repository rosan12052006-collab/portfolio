// Run with: node seed.js
// Populates the database with a few sample projects so the site isn't empty.
// Edit the `sampleProjects` array with your own real projects before running.

require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("./models/Project");

const sampleProjects = [
  {
    title: "promptc — Natural Language App Compiler",
    summary:
      "Converts plain English app descriptions into validated, structured configs and runnable Flask applications.",
    description:
      "A 5-stage deterministic compiler pipeline that takes a plain-English app description and turns it into a validated, structured config — then generates a fully runnable Flask application from that config automatically. Stages: intent extraction, system design, schema generation, validation + repair, and execution.",
    techStack: ["Python", "Flask", "SQLite", "HTML", "CSS", "JavaScript"],
    category: "AI/Tools",
    image: "assets/projects/promptc.png",
    liveUrl: "https://promptc-compiler.onrender.com",
    repoUrl: "https://github.com/rosan12052006-collab/promptc-compiler",
    featured: true,
    order: 1,
  },
  {
    title: "TaskLedger — Full Stack Task Management Platform",
    summary:
      "A task management app with real-time updates, automated email reminders, and persistent storage.",
    description:
      "A production-ready task management platform with JWT authentication, real-time updates via Socket.IO, automated email reminders through Nodemailer, and persistent storage on MongoDB Atlas.",
    techStack: ["React", "Node.js", "Express.js", "MongoDB Atlas", "JWT", "Socket.IO", "Nodemailer"],
    category: "Web",
    image: "assets/projects/taskledger.png",
    liveUrl: "https://taskledger-eyb2.vercel.app",
    repoUrl: "https://github.com/rosan12052006-collab/taskledger",
    featured: true,
    order: 2,
  },
  {
    title: "The Corner Shop — Full Stack E-Commerce Platform",
    summary:
      "An online store with authentication, role-based access, and real-time cart management.",
    description:
      "A production-ready e-commerce platform with JWT authentication, role-based access control, real-time cart management, and persistent storage on MongoDB Atlas. Built end-to-end with Express and Mongoose.",
    techStack: ["Node.js", "Express.js", "MongoDB Atlas", "Mongoose", "JWT", "bcrypt", "HTML5", "CSS3", "JavaScript"],
    category: "Web",
    image: "assets/projects/ecommerce.png",
    liveUrl: "https://ecommerce-app-lemon-delta.vercel.app",
    repoUrl: "https://github.com/rosan12052006-collab/ecommerce-app",
    featured: true,
    order: 3,
  },
  {
    title: "Inkwell — Full Stack Blog Platform",
    summary:
      "A community blogging platform with JWT authentication and RESTful APIs.",
    description:
      "A production-ready blogging platform with JWT authentication, RESTful APIs, and real-time data persistence — built with React, Node.js, Express, and MongoDB Atlas.",
    techStack: ["React", "Node.js", "Express.js", "MongoDB Atlas", "JWT", "Axios", "React Router"],
    category: "Web",
    image: "assets/projects/inkwell.png",
    liveUrl: "https://blogplatform2-8v8u.vercel.app",
    repoUrl: "https://github.com/rosan12052006-collab/blogplatform2",
    featured: false,
    order: 4,
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB. Seeding...");
    await Project.deleteMany({});
    await Project.insertMany(sampleProjects);
    console.log(`Inserted ${sampleProjects.length} sample projects.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed error:", err.message);
    process.exit(1);
  });

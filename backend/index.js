require("dotenv").config();
const express = require("express");
const app = express();
const connect = require("./db/connect");
const User = require("./models/user");
const Post = require("./models/posts");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const notFound = require("./middleware/notfound");
const BadRequest = require("./errors/badRequest");
const unAuthenticated = require("./errors/unauthenticated");
const errorHandlerMiddleware = require("./middleware/errorhandler");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        const parts = file.originalname.split(".");
        const ext = parts[parts.length - 1];
        cb(null, `${Date.now()}.${ext}`);
    },
});

const uploadMiddleware = multer({ storage });

// Middlewares
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

// Routes

// Register Route
app.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userData = await User.create({ username, password });
    res.json({ data: userData });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Login Route
app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new BadRequest("Missing credentials"));
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new unAuthenticated("Invalid Username"));
    }

    const pass = await user.comparePassword(password);
    if (!pass) {
      return next(new unAuthenticated("Invalid Password"));
    }

    const token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful" });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Profile Route
app.get("/profile", async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new unAuthenticated("No token provided"));
  }

  try {
    const tokenInfo = await jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(tokenInfo);
  } catch (error) {
    next(new unAuthenticated("Invalid token"));
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }).json({ message: "Logged out successfully" });
});

// Create Post Route
app.post("/createPost", uploadMiddleware.single('file'), async (req, res, next) => {
  const { filename } = req.file;
  
  const { title, summary, content } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return next(new unAuthenticated("No token provided"));
  }

  try {
    const tokenInfo = await jwt.verify(token, process.env.JWT_SECRET);
    const post = await Post.create({
      title,
      summary,
      content,
      cover: filename,
      author: tokenInfo.id,
    });
    res.json(post);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Get All Posts Route
app.get("/post", async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(
        posts.map((post) => ({
            ...post.toJSON(),
            cover: `/uploads/${post.cover}`
        }))
    );
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Get Single Post by ID Route
app.get("/post/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("author", ["username"]);
    if (!post) {
      return next(new BadRequest("Post not found"));
    }
    res.json({
        ...post.toJSON(),
        cover: `/uploads/${post.cover}`
    });
  } catch (error) { 
    next(error); // Pass the error to the error-handling middleware
  }
});

// Error Handling Middleware
app.use(errorHandlerMiddleware);

// Start Server
async function start() {
  const port = process.env.PORT || 4000;
  try {
    await connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

start();

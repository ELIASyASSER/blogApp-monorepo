const jwt = require("jsonwebtoken");
const User = require("../models/user")
const Post = require("../models/posts")
const  BadRequest= require("../errors/unauthenticated")
const  unAuthenticated= require("../errors/unauthenticated")
const register = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const userData = await User.create({ username, password });
        res.json({ data: userData });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
}

const login =  async (req, res, next) => {
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
        .cookie("token", token, { httpOnly: true,sameSite:"lax",secure:false })
        .json({ message: "Login successful" });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
}

const profile = async (req, res, next) => {
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
}
 
const logout =  (req, res) => {
    res.cookie("token", "", { httpOnly: true }).json({ message: "Logged out successfully" });
}

const posts =  async (req, res, next) => {
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
    }

const singlePost =  async (req, res, next) => {
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
}

const deletePost =async(req,res,next)=>{

    const {id} = req.body
    console.log(id);
    
    try {
        const post = await Post.findByIdAndDelete(id)
        res.json("deleted successfully ...")
    } catch (error) {
        next(error)
    }
}

const createPost =  async (req, res, next) => {
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
}


module.exports = {
    register,
    login,
    logout,
    profile,
    createPost,
    posts,
    singlePost,
    deletePost
}
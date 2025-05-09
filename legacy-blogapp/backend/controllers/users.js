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
        .cookie("token", token, { httpOnly: true,sameSite:"lax"})
        .json({ message: "Login successful" });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    } 

}   

const profile = async (req, res, next) => {
    
    
    try {
        res.status(200).json(req.info);
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

const editPost = async (req,res,next)=>{
    
    const{id,title,summary,content,cover} = req.body
    const { filename } = req.file;
    try {
        const postDoc =  await Post.findById(id)
        const isAuthor = postDoc.author == req.info.id
        if(!isAuthor){
            return next(new BadRequest("You Can't Modify This Post"))
        }
    await postDoc.updateOne({
        title,
        summary,
        content,
        cover:filename
        
    })
        res.status(200).json(postDoc)
    } catch (error) {
        next(error)
    }

}


const deletePost =async(req,res,next)=>{

    const {id} = req.params
    try {
        // const post = await Post.findByIdAndDelete(id)
        const postDoc = await Post.findById(id)
        if(!postDoc){
            return next(new BadRequest("Post Not Found"))
        
        }
        const isAuthor = postDoc.author.equals(req.info.id) 
        
        if(!isAuthor){
            return next(new BadRequest("You Can't Delete This Post"))
        }      
            await Post.deleteOne({_id :postDoc._id})
            res.status(200).json({message:"Post Deleted Successfuly"})
        

    } catch (error) {
        next(error)
    }
}

const createPost =  async (req,res,next) => {
    const { filename } = req.file;
    const { title, summary, content } = req.body;
    
    try {

    const post = await Post.create({
            title,
            summary,
            content,
            cover: filename,
            author: req.info.id,
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
    deletePost,
    editPost,
}
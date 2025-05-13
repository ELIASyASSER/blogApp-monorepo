import mongoose from "mongoose"
const postSchema = new mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    cover:String,
    author:{type:mongoose.Types.ObjectId,ref:"User"}

},{timestamps:true})

export const postModel =mongoose.models.Post || mongoose.model("Post",postSchema)



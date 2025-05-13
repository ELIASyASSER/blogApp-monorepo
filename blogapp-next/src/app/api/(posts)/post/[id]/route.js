import { connectToDb } from "@/lib/utils";
import { authMiddleware } from "@/middleware/auth";
import {  postModel } from "@/models/post";
import { NextResponse } from "next/server";

// Disable the body parser for this specific route
// app/api/posts/[id]/route.js


export const GET = async (req, { params }) => {
    
    try {
        const id = params?.id;
        await connectToDb();
    // const post = await PostModel.find(id).populate("author", ["username"]);
    const post = await postModel.findById(id).populate("author");
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const postData = {
      ...post.toJSON(),
      cover: `/uploads/${post.cover}`,
    };

    return NextResponse.json(postData, { status: 200 });
  } catch (error) {
    console.error("GET /post/:id   error:", error);
    return NextResponse.json(
      { message: "Failed to get the post"+error.message },
      { status: 500 }
    );
  }
};


export const DELETE = async (req, { params }) => {    
    try {
      await connectToDb()
        const data =  authMiddleware(req)
        const id = params.id
        // const post = await Post.findByIdAndDelete(id)
        const postDoc = await postModel.findById(id)
        if(!postDoc){
            return NextResponse.json({message:"Post Not Found"},{status:400})
        
        }
        const isAuthor = await postDoc.author.equals(data.id) 
        console.log('is author',isAuthor)
        
        if(!isAuthor){
            return NextResponse.json({message:"You Can't Delete This Post"},{status:400})

        }      
            await postModel.deleteOne({_id :postDoc._id})
            return NextResponse.json({message:"Post Deleted Successfuly"},{status:200})

        

    } catch (error) {
        console.log(error.message)
            return NextResponse.json(
      { message: "Failed to delete the post"+error.message },
      { status: 500 })
    }
}







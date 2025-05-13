import { connectToDb } from "@/lib/utils";
import { postModel } from "@/models/post";
import { userModel } from "@/models/user";
export async function GET() {
  try {

    await connectToDb();

    const posts = await postModel.find({})
      .populate("author", ["username"])
      .sort({ createdAt: -1 });


    const postsWithImagePaths = posts.map((post) => ({
      ...post.toObject(),
      cover: `/uploads/${post.cover}`,
    }));

    return new Response(JSON.stringify(postsWithImagePaths), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.log("Error fetching posts:", error.message);

    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

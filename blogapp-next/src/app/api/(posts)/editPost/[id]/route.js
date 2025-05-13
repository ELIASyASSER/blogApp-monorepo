import { writeFile } from 'fs/promises';
import { connectToDb } from '@/lib/utils';
import path from 'path';

import { postModel } from '@/models/post';
import { authMiddleware } from '@/middleware/auth';
export async function PUT(req) {


  try {

    const data = await req.formData();
    const id = data.get('id');
    const title = data.get('title');

    const summary = data.get('summary');
    const content = data.get('content');
    const file = data.get('file'); // 'file' should match the key in FormData
    
    // Check if post ID exists
    if (!id) {
  
      return new Response(JSON.stringify({ message: 'Post ID is required' }), { status: 400 });

  } 

  let filename;
    // Find the post by ID
    const postDoc = await postModel.findById(id);
    
    if (!postDoc) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }


    // Handle file upload if a new file is provided

    // ✅ Check if it's an actual File object

  
    let cover = postDoc.cover;

    if (file && typeof file.arrayBuffer === 'function') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      filename = Date.now() + '-' + file.name;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer); // Save the file to the filesystem

      cover = filename

    }
    // Authenticate the user
    const user = authMiddleware(req);

    await connectToDb();


    // Check if the user is the author of the post
    if (postDoc.author.toString() !== user.id.toString()) {
      return new Response(JSON.stringify({ message: 'You can not modify this post' }), { status: 403 });
    }

    await postDoc.updateOne({
      title:title,
      summary:summary,
      content:content,
      cover:cover
    
    })


    return new Response(JSON.stringify(postDoc), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), {

      status: 500
    });
  }
}

import { writeFile } from 'fs/promises';
import path from 'path';
import { connectToDb } from '@/lib/utils';
import { postModel } from '@/models/post';
import { authMiddleware } from '@/middleware/auth';

export async function POST(req) {
  try {
    const data = await req.formData();

    const title = data.get('title');
    const summary = data.get('summary');
    const content = data.get('content');
    const file = data.get('file'); // 'file' must match the key in FormData

    if (!file) {
      return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    // Ensure uploads folder exists
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + '-' + file.name;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const user =  authMiddleware(req);

    await connectToDb();

    const newPost = await postModel.create({
      title,
      summary,
      content,
      cover: filename,
      author: user.id
    });

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500
    });
  }
}

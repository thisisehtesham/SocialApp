import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/lib/mongodb';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { image, caption, userId } = body;

    if (!image || !caption) {
      return Response.json({ error: 'Image and caption required' }, { status: 400 });
    }

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: 'social-app/posts',
    });

    const client = await clientPromise;
    const db = client.db();

    const newPost = {
      userId,
      caption,
      imageUrl: uploaded.secure_url,
      createdAt: new Date(),
      likes: [],
      comments: [],
    };

    const result = await db.collection('posts').insertOne(newPost);

    return Response.json({ message: 'Post uploaded', postId: result.insertedId });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Failed to upload post' }, { status: 500 });
  }
}
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  const { postId, text } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const comment = { text, createdAt: new Date() };

  await db.collection('posts').updateOne(
    { _id: new ObjectId(postId) },
    { $push: { comments: comment } }
  );

  return Response.json({ message: 'Comment added', comment });
}

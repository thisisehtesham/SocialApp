import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  const { postId } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const session = await getServerSession(authOptions);

  await db.collection('posts').updateOne(
  { _id: new ObjectId(postId) },
  {
    $inc: { likesCount: 1 },
    $addToSet: { likes: postId },
  }
);

  return Response.json({ message: 'Liked' });
}

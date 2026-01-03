import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const posts = await db.collection('posts').find().toArray();
  return Response.json(posts);
}

export async function DELETE(req, { params }) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('posts').deleteOne({ _id: new ObjectId(params.id) });
  return Response.json({ message: 'Post deleted' });
}

export async function PATCH(req, { params }) {
  const { hidden } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('posts').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { hidden: !!hidden } }
  );
  return Response.json({ message: 'Post updated' });
}

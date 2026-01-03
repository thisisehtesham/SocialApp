import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  const { text } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('announcements').insertOne({
    text,
    createdAt: new Date(),
  });
  return Response.json({ message: 'Announcement added' });
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const announcements = await db.collection('announcements').find().sort({ createdAt: -1 }).toArray();
  return Response.json(announcements);
}

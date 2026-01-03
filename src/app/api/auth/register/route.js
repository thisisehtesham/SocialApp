import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const existing = await db.collection('users').findOne({ email });
  if (existing) return Response.json({ error: 'User already exists' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  await db.collection('users').insertOne({
    username,
    email,
    password: hashed,
    createdAt: new Date(),
  });

  return Response.json({ message: 'User registered' });
}

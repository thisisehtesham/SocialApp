import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return Response.json({ message: 'Login successful', token, user });
}

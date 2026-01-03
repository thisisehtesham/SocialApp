'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    if (res.ok) router.push('/login');
    else alert(data.error);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Register</h2>

        <input
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          onClick={handleRegister}
          className="w-full py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 border-2 border-blue-500 transition-all duration-300"
        >
          Register
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            href="/en/login"
            className="text-blue-500 hover:underline text-sm mt-1 font-medium"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

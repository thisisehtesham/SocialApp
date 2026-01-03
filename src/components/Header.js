'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { usePathname, useRouter } from 'next/navigation';
import { isAdmin } from '@/utils/isAdmin';

export default function Header({ dict, currentLocale }) {
  const { data: session, status  } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.includes('/login') || pathname.includes('/register')) {
    return null;
  }

    const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  const handleLogin = () => {
    router.push(`/${currentLocale}/login`);
  };

  const admin = session?.user && isAdmin(session.user);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-4 px-6 md:px-24 lg:px-36 flex justify-between items-center border-b border-gray-200">
      <Link href="/" className="text-lg font-bold text-blue-600">
        SocialApp
      </Link>
      <nav className="flex gap-4 items-center">
        {status === 'loading' ? null : session ? (
          <>
            <Link href={`/${currentLocale}/profile/${session.user.name}`} className="hover:underline">
              {dict.profile}
            </Link>
            {admin && (
              <Link href={`/${currentLocale}/admin`} className="hover:underline text-purple-600">
                {dict.admin || 'Admin'}
              </Link>
            )}
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              {dict.logout}
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="text-blue-600 hover:underline">
            {dict.login}
          </button>
        )}
        <LanguageSwitcher currentLocale={currentLocale} />
      </nav>
    </header>
  );
}

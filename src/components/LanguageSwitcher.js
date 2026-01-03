'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ currentLocale }) {
  const pathname = usePathname();
  const locales = ['en', 'hi'];

  const removeLocale = (path) => {
    return path.replace(new RegExp(`^/(${locales.join('|')})`), '');
  };

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${removeLocale(pathname)}`}
          className={`px-2 py-1 rounded-lg ${
            currentLocale === locale ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
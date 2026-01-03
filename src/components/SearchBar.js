'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ dict, search, sort }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(search);
  const [filter, setFilter] = useState(sort);

  const handleSearch = () => {
    const q = new URLSearchParams();
    if (query) q.set('search', query);
    if (filter) q.set('sort', filter);
    router.push(`${pathname}?${q.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 sticky top-20">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={dict.search}
        className="border p-2 flex-1 rounded-lg"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="newest">{dict.newest}</option>
        <option value="oldest">{dict.oldest}</option>
        <option value="popular">{dict.popular}</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        {dict.search_btn}
      </button>
    </div>
  );
}

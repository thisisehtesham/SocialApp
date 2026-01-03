"use client";

import { useSession } from "next-auth/react";

export default function Sidebar({ dict }) {
  const { data: session } = useSession();

  return (
    <div className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Profile Section */}
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <div className="p-4 text-center relative">
            <h4 className="mt-8 font-medium">{session?.user?.name}</h4>
            <p className="text-gray-500 text-sm">{session?.user?.email}</p>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-sm py-2 hover:bg-gray-200 px-2 rounded">
                <span>{dict.sidebar.profile_views}</span>
                <span className="text-blue-500 font-semibold">36</span>
              </div>
              <div className="flex justify-between text-sm py-2 hover:bg-gray-200 px-2 rounded">
                <span>{dict.sidebar.post_impressions}</span>
                <span className="text-blue-500 font-semibold">114</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="font-medium mb-2">{dict.sidebar.recent}</p>
          {dict.sidebar.groups.map((group, index) => (
            <div
              key={index}
              className="flex items-center py-2 hover:bg-gray-200 rounded px-2"
            >
              <span className="text-sm">{group}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

export default function Widget({ dict }) {
  return (
    <div className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Social News Widget */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">{dict.widget.social_news} ℹ️</h4>
          </div>
          <ul className="space-y-3">
            {dict.widget.social_news_items.map((item, index) => (
              <li key={index} className="hover:bg-gray-200 p-1 rounded cursor-pointer">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.time} • {item.readers} {dict.widget.readers}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Today's Top Courses Widget */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">{dict.widget.top_courses} ℹ️</h4>
          </div>
          <ul className="space-y-3">
            {dict.widget.course_items.map((item, index) => (
              <li key={index} className="hover:bg-gray-200 p-1 rounded cursor-pointer">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
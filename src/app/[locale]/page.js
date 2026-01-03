import clientPromise from '@/lib/mongodb';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import { getDictionary } from '@/lib/i18n';
import UploadForm from '@/components/UploadForm';
import Widget from '@/components/Widget';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params, searchParams }) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const locale = awaitedParams?.locale || 'en';
  const { search = '', sort = 'newest' } = awaitedSearchParams;
  const dict = await getDictionary(locale);

  try {
    const client = await clientPromise;
    const db = client.db();

    // Get announcements
    const announcements = await db.collection('announcements')
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    // Handle search
    const users = await db.collection('users')
      .find({ username: new RegExp(search, 'i') })
      .toArray();
    
    const userIds = users.map((u) => u._id?.toString()).filter(Boolean);

    // Sort options
    const sortOption = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { likes: -1 },
    }[sort] || { createdAt: -1 };

    // Get posts with null checks
    const postsRaw = await db
      .collection('posts')
      .find({
        $or: [
          { caption: { $regex: search, $options: 'i' } },
          ...(userIds.length ? [{ userId: { $in: userIds } }] : []),
        ],
        userId: { $exists: true, $ne: null }
      })
      .sort(sortOption)
      .toArray();

    // Transform posts with safe conversion
    const posts = postsRaw.map((post) => {
      if (!post.userId) return null;
      
      return {
        ...post,
        _id: post._id?.toString(),
        userId: post.userId.toString(),
        createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
        likes: post.likes || [],
        comments: post.comments || []
      };
    }).filter(Boolean);

    return (
    <>
      <Sidebar dict={dict} />
      <div className="flex-1 max-w-2xl">
        {/* Search Bar */}
        <div className="bg-white mb-4 p-4 rounded-lg shadow">
          <SearchBar search={search} sort={sort} dict={dict} />
        </div>

        {/* Upload Form */}
        <div className="mb-4">
          <UploadForm dict={dict} />
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            {announcements.map((a) => (
              <div key={a._id} className="flex items-start mb-2 last:mb-0">
                <span className="text-yellow-600 mr-2">📢</span>
                <p className="text-yellow-800">{a.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">{dict.no_posts}</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow">
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>
      <Widget dict={dict} />
    </>
  );
} catch (error) {
    console.error('Error loading posts:', error);
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4 text-red-500">{dict.home_title}</h1>
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            {dict.error_loading}
          </div>
        </div>
      </div>
    );
  }
}
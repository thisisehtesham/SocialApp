import clientPromise from "@/lib/mongodb";
import PostCard from "@/components/PostCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db
    .collection("users")
    .find({}, { projection: { username: 1 } })
    .toArray();

  return users.map((user) => ({
    username: user.username,
  }));
}

export default async function ProfilePage({ params }) {
  const awaitedParams = params;
  const username = decodeURIComponent(awaitedParams.username);

  const client = await clientPromise;
  const db = client.db();

  // Find user by username
  const user = await db.collection("users").findOne({ username });
  if (!user) return <p className="text-center p-8">User not found</p>;

  // Find posts where userId matches
  const posts = await db
    .collection("posts")
    .find({ userId: user.username })
    .sort({ createdAt: -1 })
    .toArray();

  const formattedPosts = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {user.username}&#39;s Profile
        </h1>
        <p className="text-gray-500 mb-4">
          Joined on {new Date(user.createdAt).toDateString()}
        </p>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Posts</h2>

      {formattedPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formattedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

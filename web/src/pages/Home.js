import React, { useEffect, useState } from 'react';
import { postService } from '../services/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await postService.getFeed();
      setPosts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <h1>🐝 BeedBuzz Feed</h1>
      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts yet. Start sharing!</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post">
              <h3>{post.caption}</h3>
              <p>❤️ {post.likesCount} | 💬 {post.commentsCount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;

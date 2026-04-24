import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { getPosts } from '../utils/storage.js';
import { isAuthenticated } from '../utils/auth.js';

export function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setLatestPosts(sorted.slice(0, 3));
  }, []);

  function handlePostClick(postId) {
    if (authenticated) {
      navigate(`/blog/${postId}`);
    } else {
      navigate('/login');
    }
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  function truncateContent(content, maxLength = 120) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trimEnd() + '…';
  }

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description: 'Create and publish blog posts with an intuitive writing experience. Share your thoughts with the world.',
    },
    {
      icon: '🔐',
      title: 'Role-Based Access',
      description: 'Secure role-based access control with admin and user roles. Manage who can create, edit, and delete content.',
    },
    {
      icon: '⚡',
      title: 'Instant & Local',
      description: 'No server required. All data is stored locally in your browser for instant performance and complete privacy.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Welcome to <span className="text-indigo-200">WriteSpace</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100 leading-relaxed">
              A modern blogging platform where ideas come to life. Write, share, and discover stories that matter.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {authenticated ? (
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-8 py-3 text-base font-medium text-indigo-700 bg-white rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Go to Dashboard
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-indigo-700 bg-white rounded-lg hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    Get Started Free
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Why WriteSpace?</h2>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to start blogging, right in your browser.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-gray-200 p-8 text-center transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-xl bg-indigo-50 text-3xl mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
              <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                Discover what our community has been writing about.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-left transition-shadow hover:shadow-md group"
                >
                  <div className="border-t-4 border-indigo-500 rounded-t -mt-6 -mx-6 mb-5" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs">
                      {post.authorRole === 'admin' ? '👑' : '📖'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{post.authorName}</p>
                      <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {truncateContent(post.content)}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">✍️ WriteSpace</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/blogs" className="text-sm hover:text-white transition-colors">
                Blogs
              </Link>
              <Link to="/login" className="text-sm hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm hover:text-white transition-colors">
                Register
              </Link>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
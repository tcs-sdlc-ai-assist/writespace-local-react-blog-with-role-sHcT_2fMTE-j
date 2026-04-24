import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { getCurrentUser, isAdmin } from '../utils/auth.js';
import { getPosts, addPost, updatePost } from '../utils/storage.js';

export function WriteBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = getCurrentUser();
  const admin = isAdmin();

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === editId);

      if (!post) {
        setError('Post not found.');
        return;
      }

      const canEdit = admin || (user && post.authorId === user.userId);
      if (!canEdit) {
        setError('You do not have permission to edit this post.');
        return;
      }

      setIsEditMode(true);
      setEditPostId(post.id);
      setTitle(post.title);
      setContent(post.content);
    }
  }, [searchParams, admin, user]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    if (title.length > 100) {
      setError('Title must be 100 characters or less.');
      return;
    }

    if (content.length > 2000) {
      setError('Content must be 2000 characters or less.');
      return;
    }

    setLoading(true);

    if (isEditMode) {
      const result = updatePost({
        id: editPostId,
        title: title.trim(),
        content: content.trim(),
      });

      if (result.success) {
        navigate(`/blog/${editPostId}`);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } else {
      const result = addPost({
        title: title.trim(),
        content: content.trim(),
        authorId: user.userId,
        authorName: user.displayName,
        authorRole: user.role,
      });

      if (result.success) {
        navigate(`/blog/${result.post.id}`);
      } else {
        setError(result.error);
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    if (isEditMode && editPostId) {
      navigate(`/blog/${editPostId}`);
    } else {
      navigate('/blogs');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? 'Update your post below.'
              : 'Share your thoughts with the community.'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={`text-xs ${
                    title.length > 100 ? 'text-rose-500' : 'text-gray-400'
                  }`}
                >
                  {title.length}/100
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                required
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={`text-xs ${
                    content.length > 2000 ? 'text-rose-500' : 'text-gray-400'
                  }`}
                >
                  {content.length}/2000
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditMode
                    ? 'Updating…'
                    : 'Publishing…'
                  : isEditMode
                    ? 'Update Post'
                    : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
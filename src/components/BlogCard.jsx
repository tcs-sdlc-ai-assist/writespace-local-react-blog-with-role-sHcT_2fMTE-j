import { Link } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

export function BlogCard({ post }) {
  const user = getCurrentUser();
  const admin = isAdmin();

  const canEdit = admin || (user && post.authorId === user.userId);

  function truncateContent(content, maxLength = 150) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trimEnd() + '…';
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
      <div className="border-t-4 border-indigo-500" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getAvatar(post.authorRole)}
            <div>
              <p className="text-sm font-medium text-gray-700">{post.authorName}</p>
              <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {canEdit && (
            <Link
              to={`/write?edit=${post.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit post"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          )}
        </div>

        <Link to={`/blog/${post.id}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {truncateContent(post.content)}
          </p>
        </Link>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Read more
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
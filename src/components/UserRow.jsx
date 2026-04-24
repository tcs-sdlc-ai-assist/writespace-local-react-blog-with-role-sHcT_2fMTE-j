import { getCurrentUser } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

export function UserRow({ user, onDelete }) {
  const currentUser = getCurrentUser();

  const isCurrentUser = currentUser && currentUser.userId === user.id;
  const isAdmin = user.role === 'admin';
  const canDelete = !isAdmin && !isCurrentUser;

  return (
    <>
      {/* Desktop: table row */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-sm text-gray-600">@{user.username}</span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
              user.role === 'admin'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          {canDelete ? (
            <button
              onClick={() => onDelete(user.id)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          ) : (
            <span className="text-xs text-gray-400">
              {isAdmin ? 'Protected' : 'Current user'}
            </span>
          )}
        </td>
      </tr>

      {/* Mobile: card */}
      <div className="md:hidden bg-white rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
              user.role === 'admin'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
        {canDelete && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => onDelete(user.id)}
              className="w-full inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete User
            </button>
          </div>
        )}
      </div>
    </>
  );
}
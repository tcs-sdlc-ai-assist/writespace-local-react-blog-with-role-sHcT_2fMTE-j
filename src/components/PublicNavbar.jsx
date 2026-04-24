import { Link } from 'react-router-dom';
import { isAuthenticated, isAdmin, getCurrentUser } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

export function PublicNavbar() {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  const admin = isAdmin();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">✍️ WriteSpace</span>
          </Link>

          <div className="flex items-center gap-3">
            {authenticated && user ? (
              <>
                <div className="flex items-center gap-2">
                  {getAvatar(user.role)}
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user.displayName}
                  </span>
                </div>
                <Link
                  to={admin ? '/admin' : '/blogs'}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
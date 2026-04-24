import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAdmin, logout } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const admin = isAdmin();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function isActive(path) {
    return location.pathname === path;
  }

  function navLinkClass(path) {
    const base = 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors';
    if (isActive(path)) {
      return `${base} text-indigo-600 bg-indigo-50`;
    }
    return `${base} text-gray-600 hover:text-indigo-600 hover:bg-gray-50`;
  }

  function mobileNavLinkClass(path) {
    const base = 'block px-3 py-2 text-sm font-medium rounded-lg transition-colors';
    if (isActive(path)) {
      return `${base} text-indigo-600 bg-indigo-50`;
    }
    return `${base} text-gray-600 hover:text-indigo-600 hover:bg-gray-50`;
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">✍️ WriteSpace</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link to="/blogs" className={navLinkClass('/blogs')}>
                Blogs
              </Link>
              <Link to="/write" className={navLinkClass('/write')}>
                Write
              </Link>
              {admin && (
                <>
                  <Link to="/admin" className={navLinkClass('/admin')}>
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                {getAvatar(user.role)}
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    admin
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {admin ? 'Admin' : 'User'}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/blogs"
              className={mobileNavLinkClass('/blogs')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className={mobileNavLinkClass('/write')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Write
            </Link>
            {admin && (
              <>
                <Link
                  to="/admin"
                  className={mobileNavLinkClass('/admin')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className={mobileNavLinkClass('/admin/users')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Users
                </Link>
              </>
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-200">
            {user && (
              <div className="flex items-center gap-2 mb-3">
                {getAvatar(user.role)}
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    admin
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {admin ? 'Admin' : 'User'}
                </span>
              </div>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
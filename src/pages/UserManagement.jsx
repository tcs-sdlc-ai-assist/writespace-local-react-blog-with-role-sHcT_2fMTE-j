import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { UserRow } from '../components/UserRow.jsx';
import { getCurrentUser, isAdmin } from '../utils/auth.js';
import { getUsers, addUser, removeUser } from '../utils/storage.js';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const user = getCurrentUser();
  const admin = isAdmin();

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    const allUsers = getUsers();
    const adminUser = {
      id: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    setUsers([adminUser, ...allUsers]);
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!displayName.trim() || !username.trim() || !password.trim()) {
      setFormError('All fields are required.');
      return;
    }

    if (password.length < 4) {
      setFormError('Password must be at least 4 characters.');
      return;
    }

    if (username.trim().toLowerCase() === 'admin') {
      setFormError('Username is reserved.');
      return;
    }

    setLoading(true);

    const result = addUser({
      username: username.trim(),
      displayName: displayName.trim(),
      password: password.trim(),
      role,
    });

    if (result.success) {
      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccessMessage('User created successfully.');
      loadUsers();
    } else {
      setFormError(result.error);
    }

    setLoading(false);
  }

  function handleDeleteClick(userId) {
    setDeleteUserId(userId);
    setShowDeleteConfirm(true);
    setError('');
  }

  function handleDelete() {
    setDeleting(true);
    const result = removeUser(deleteUserId);

    if (result.success) {
      loadUsers();
    } else {
      setError(result.error);
    }

    setDeleting(false);
    setShowDeleteConfirm(false);
    setDeleteUserId(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Gradient Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
            <p className="mt-1 text-indigo-200">
              Create, view, and manage platform users.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Create User Form */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            {formError && (
              <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3">
                <p className="text-sm text-rose-600">{formError}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                <p className="text-sm text-emerald-600">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {loading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <span className="text-sm text-gray-500">{users.length} total</span>
          </div>

          {users.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-xl bg-indigo-50 text-3xl mb-5">
                👥
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Create your first user using the form above.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <UserRow key={u.id} user={u} onDelete={handleDeleteClick} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {users.map((u) => (
                  <UserRow key={u.id} user={u} onDelete={handleDeleteClick} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-rose-50 text-2xl mb-4">
              🗑️
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete User
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { getUsers, addUser, getSession, setSession, clearSession } from './storage.js';

const ADMIN_USER = {
  id: 'admin',
  username: 'admin',
  displayName: 'Admin',
  password: 'admin',
  role: 'admin',
};

export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  if (username.toLowerCase() === ADMIN_USER.username && password === ADMIN_USER.password) {
    setSession({
      userId: ADMIN_USER.id,
      username: ADMIN_USER.username,
      role: ADMIN_USER.role,
      displayName: ADMIN_USER.displayName,
    });
    return { success: true, user: ADMIN_USER };
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid username or password.' };
  }

  setSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  });

  return { success: true, user };
}

export function logout() {
  clearSession();
}

export function register({ username, displayName, password }) {
  if (!username || !displayName || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  if (username.toLowerCase() === 'admin') {
    return { success: false, error: 'Username is reserved.' };
  }

  const result = addUser({
    username,
    displayName,
    password,
    role: 'user',
  });

  if (!result.success) {
    return result;
  }

  setSession({
    userId: result.user.id,
    username: result.user.username,
    role: result.user.role,
    displayName: result.user.displayName,
  });

  return { success: true, user: result.user };
}

export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

export function isAdmin() {
  const session = getSession();
  if (!session) return false;
  return session.role === 'admin';
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return session;
}
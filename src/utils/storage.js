const USERS_KEY = 'ws_users';
const POSTS_KEY = 'ws_posts';
const SESSION_KEY = 'ws_session';

function readFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return null;
  }
}

function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
    return { success: false, error: 'Failed to save data. localStorage may be unavailable or full.' };
  }
}

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

// --- Users ---

export function getUsers() {
  const users = readFromStorage(USERS_KEY);
  if (!Array.isArray(users)) return [];
  return users;
}

export function addUser(user) {
  if (!user || !user.username || !user.displayName || !user.password || !user.role) {
    return { success: false, error: 'Invalid user data. All fields are required.' };
  }

  const users = getUsers();
  const duplicate = users.some(
    (u) => u.username.toLowerCase() === user.username.toLowerCase()
  );
  if (duplicate) {
    return { success: false, error: 'Username is already taken.' };
  }

  const newUser = {
    id: user.id || generateId(),
    username: user.username,
    displayName: user.displayName,
    password: user.password,
    role: user.role,
  };

  users.push(newUser);
  const result = writeToStorage(USERS_KEY, users);
  if (!result.success) return result;
  return { success: true, user: newUser };
}

export function removeUser(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: 'User not found.' };
  }

  if (users[index].role === 'admin') {
    return { success: false, error: 'Cannot delete admin user.' };
  }

  users.splice(index, 1);
  const result = writeToStorage(USERS_KEY, users);
  if (!result.success) return result;
  return { success: true };
}

// --- Posts ---

export function getPosts() {
  const posts = readFromStorage(POSTS_KEY);
  if (!Array.isArray(posts)) return [];
  return posts;
}

export function addPost(post) {
  if (!post || !post.title || !post.content || !post.authorId || !post.authorName) {
    return { success: false, error: 'Invalid post data. Title, content, and author info are required.' };
  }

  if (post.title.length > 100) {
    return { success: false, error: 'Title must be 100 characters or less.' };
  }

  if (post.content.length > 2000) {
    return { success: false, error: 'Content must be 2000 characters or less.' };
  }

  const posts = getPosts();
  const now = new Date().toISOString();

  const newPost = {
    id: post.id || generateId(),
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    authorName: post.authorName,
    authorRole: post.authorRole || 'user',
    createdAt: now,
    updatedAt: now,
  };

  posts.push(newPost);
  const result = writeToStorage(POSTS_KEY, posts);
  if (!result.success) return result;
  return { success: true, post: newPost };
}

export function updatePost(post) {
  if (!post || !post.id || !post.title || !post.content) {
    return { success: false, error: 'Invalid post data. ID, title, and content are required.' };
  }

  if (post.title.length > 100) {
    return { success: false, error: 'Title must be 100 characters or less.' };
  }

  if (post.content.length > 2000) {
    return { success: false, error: 'Content must be 2000 characters or less.' };
  }

  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index === -1) {
    return { success: false, error: 'Post not found.' };
  }

  const updatedPost = {
    ...posts[index],
    title: post.title,
    content: post.content,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updatedPost;
  const result = writeToStorage(POSTS_KEY, posts);
  if (!result.success) return result;
  return { success: true, post: updatedPost };
}

export function removePost(postId) {
  if (!postId) {
    return { success: false, error: 'Post ID is required.' };
  }

  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    return { success: false, error: 'Post not found.' };
  }

  posts.splice(index, 1);
  const result = writeToStorage(POSTS_KEY, posts);
  if (!result.success) return result;
  return { success: true };
}

// --- Session ---

export function getSession() {
  const session = readFromStorage(SESSION_KEY);
  if (!session || !session.userId || !session.username) return null;
  return session;
}

export function setSession(session) {
  if (!session || !session.userId || !session.username || !session.role || !session.displayName) {
    return;
  }
  writeToStorage(SESSION_KEY, {
    userId: session.userId,
    username: session.username,
    role: session.role,
    displayName: session.displayName,
  });
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Error clearing session from localStorage:', e);
  }
}
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm">
        👑
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm">
      📖
    </div>
  );
}
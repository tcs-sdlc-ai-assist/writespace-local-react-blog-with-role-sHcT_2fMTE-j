export function StatCard({ label, value, icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      value: 'text-indigo-700',
      border: 'border-indigo-100',
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      value: 'text-violet-700',
      border: 'border-violet-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      value: 'text-emerald-700',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      value: 'text-amber-700',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      value: 'text-rose-700',
      border: 'border-rose-100',
    },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text}`}>{label}</p>
          <p className={`mt-2 text-3xl font-bold ${colors.value}`}>{value}</p>
        </div>
        {icon && (
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colors.bg} text-2xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
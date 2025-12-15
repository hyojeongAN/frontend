export default function KpiCard({ title, value, diff, color = 'text-white' }) {
  return (
    <div className="bg-[#1A1C21] rounded-xl p-5 shadow-md">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>

      {diff !== undefined && (
        <p className={`text-sm mt-2 ${diff >= 0 ? 'text-red-400' : 'text-green-400'}`}>
          {diff >= 0 ? `▲ ${diff}%` : `▼ ${Math.abs(diff)}%`}
        </p>
      )}
    </div>
  );
}

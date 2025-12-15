export default function StatusBanner({ errorCount }) {
  const isDanger = errorCount > 100;

  return (
    <div
      className={`p-4 rounded-xl mb-6 flex items-center gap-2
      ${isDanger ? 'bg-red-900/40 text-red-300' : 'bg-green-900/30 text-green-300'}`}
    >
      {isDanger ? (
        <>⚠ 시스템 에러가 급증하고 있습니다</>
      ) : (
        <>✅ 시스템 상태가 안정적입니다</>
      )}
    </div>
  );
}

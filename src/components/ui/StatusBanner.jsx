export default function StatusBanner({ errorCount }) {
  const count = Number(errorCount ?? 0);

  let status = 'safe';

  if (count >= 11) status = 'danger';
  else if (count >= 1) status = 'warning';

  const styleMap = {
    safe: 'bg-green-900/30 text-green-300',
    warning: 'bg-yellow-900/30 text-yellow-300',
    danger: 'bg-red-900/40 text-red-300',
  };

  const messageMap = {
    safe: '✅ 시스템 상태가 안정적입니다',
    warning: '⚠ 에러가 일부 발생하고 있습니다',
    danger: '🚨 시스템 에러가 급증하고 있습니다',
  };

  return (
    <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 ${styleMap[status]}`}>
      {messageMap[status]} (총 {count}건)
    </div>
  );
}

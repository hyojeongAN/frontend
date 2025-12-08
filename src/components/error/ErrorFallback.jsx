export default function ErrorFallback({ onRetry }) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark: border-gray-700">
            <h2 className="text-xl font-semibold text-red-500 mb-2">
                문제가 발생했습니다
            </h2>
            <p calssName="text-gray-700 dark:text-gray-300 mb-4">
                작업 중 에러가 발생했지만 시스템에 자동 보고되었습니다.
            </p>
            <button 
                className="bg-blue-600 text-white py-2 px-4 riunded-lg hover:bg-blue-700"
                onClick={onRetry}>
                다시 시도
            </button>
        </div>
    );
}
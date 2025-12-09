import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import ErrorLevelTag from '../components/error/ErrorLevelTag';

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]); // 현재 화면에 보여질 로그들
  const [allFetchedLogs, setAllFetchedLogs] = useState([]); // 서버에서 받아온 전체 로그 (백엔드 페이징 안 될 경우 사용)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [expandedLogId, setExpandedLogId] = useState(null); // 상세보기 토글 ID

  // 필터 UI에 보이는 임시 상태
  const [tempFilterLevel, setTempFilterLevel] = useState('');
  const [tempSearchKeyword, setTempSearchKeyword] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // 실제 API 호출에 사용되는 필터 상태
  const [currentFilterLevel, setCurrentFilterLevel] = useState('');
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState('');
  const [currentStartDate, setCurrentStartDate] = useState('');
  const [currentEndDate, setCurrentEndDate] = useState('');

  // 프론트엔드 페이징 시뮬레이션용 상태
  const [displayLimit, setDisplayLimit] = useState(15); // 현재 화면에 보여줄 최대 로그 개수 (15개씩 더보기)
  const [hasMoreLogs, setHasMoreLogs] = useState(true); // 더 가져올 로그가 있는지 여부

  // 날짜 포맷 함수 (YYYY-MM-DDTHH:mm:ss 형식)
  const formatDateTimeForBackend = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // 에러 로그 API 호출 함수 (백엔드가 모든 데이터를 한 번에 준다고 가정)
  const fetchErrorLogs = async (params) => {
    try {
      const response = await axios.get('/logs/search', { params });
      return response.data; // 모든 로그가 배열 형태로 들어올 것임
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('로그를 가져오는 중 오류가 발생했습니다.');
      return []; // 에러 발생 시 빈 배열 반환
    }
  };

  // 초기 로딩 및 필터 변경 시 호출되는 useEffect
  // 백엔드에서 모든 필터링된 로그를 한 번에 받아와 프론트에서 페이징 시뮬레이션
  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError(null);
      
      // 서버에 보낼 파라미터 (page, size 없이 필터만 보냄)
      const params = {
        level: currentFilterLevel,
        keyword: currentSearchKeyword,
        startDate: formatDateTimeForBackend(currentStartDate),
        endDate: formatDateTimeForBackend(currentEndDate),
      };
      // 빈 값은 파라미터에서 제거 (axios가 자체적으로 처리할 수도 있지만 명시적으로)
      Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

      console.log('API Params for fetching all logs:', params);

      const response = await fetchErrorLogs(params); // 필터링된 '모든' 로그를 서버에서 받아옴
      setAllFetchedLogs(response); // 받아온 모든 로그를 allFetchedLogs에 저장
      
      setLogs(response.slice(0, displayLimit)); // allFetchedLogs에서 displayLimit만큼 잘라서 화면에 보여줄 로그에 저장
      setHasMoreLogs(response.length > displayLimit); // 전체 로그가 displayLimit보다 많으면 '더보기' 가능
      setLoading(false);
    };

    // currentFilterLevel, currentSearchKeyword, currentStartDate, currentEndDate 또는 displayLimit이 변경될 때만 실행
    // displayLimit이 변경되는 경우는 loadMore 버튼 클릭 시. 이 경우엔 기존 로그에 추가하는 로직이 필요하므로 handleLoadMore에서 직접 logs를 업데이트
    // 따라서 이 useEffect는 초기 로드 및 필터 변경 시만 allFetchedLogs를 업데이트
    if (!loading) { // 불필요한 중복 실행 방지 (loading이 false일 때만 실행)
        loadLogs();
    }
  }, [currentFilterLevel, currentSearchKeyword, currentStartDate, currentEndDate]); // displayLimit 의존성 제거

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    // 임시 필터 값들을 실제 필터 값으로 업데이트
    setCurrentFilterLevel(tempFilterLevel);
    setCurrentSearchKeyword(tempSearchKeyword);
    setCurrentStartDate(tempStartDate);
    setCurrentEndDate(tempEndDate);

    setDisplayLimit(15); // 검색 버튼 누르면 displayLimit을 다시 초기화
    setHasMoreLogs(true); // 검색하면 다시 더보기 가능하다고 가정
  };

  // '더보기' 버튼 클릭 핸들러 (프론트엔드에서 데이터 슬라이싱)
  const handleLoadMore = () => {
    if (loading || !hasMoreLogs) return; // 로딩 중이거나 더 볼 로그 없으면 아무것도 안 함

    const nextLimit = displayLimit + 15; // 다음 보여줄 로그 개수 (현재 개수 + 15)
    setLogs(allFetchedLogs.slice(0, nextLimit)); // allFetchedLogs에서 nextLimit만큼 잘라서 logs에 저장
    setHasMoreLogs(allFetchedLogs.length > nextLimit); // 모든 로그 개수가 nextLimit보다 많으면 '더보기' 가능
    setDisplayLimit(nextLimit); // displayLimit 업데이트
  };

  // 로그 상세보기 토글 핸들러
  const toggleDetails = (id) => {
    setExpandedLogId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Error Logs</h1>

      <div className="mb-4 flex space-x-2 items-center">
        <select value={tempFilterLevel} onChange={e => setTempFilterLevel(e.target.value)} className='flex-none w-32 border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <option value="">-- 레벨 --</option>
          <option value="ERROR">ERROR</option>
          <option value="WARN">WARN</option>
          <option value="INFO">INFO</option>
        </select>
        <input type="text" placeholder="메시지 또는 소스 검색" value={tempSearchKeyword} onChange={e => setTempSearchKeyword(e.target.value)} className="flex-grow min-w-[150px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="datetime-local" value={tempStartDate} onChange={e => setTempStartDate(e.target.value)} className="flex-none w-[200px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" step="1" title="시작 일시" />
        <input type="datetime-local" value={tempEndDate} onChange={e => setTempEndDate(e.target.value)} className="flex-none w-[200px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" step="1" title="종료 일시" />

        <button onClick={handleSearch} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          검색
        </button>
      </div>

      {loading && <div className="p-4">로딩 중...</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {logs.length === 0 && !loading && <div className="p-4 text-gray-500">표시할 에러 로그가 없습니다.</div>}

      {logs.length > 0 && (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm text-gray-800 dark:text-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Id</th>
                  <th className="p-3 text-center">Level</th>
                  <th className="p-3 text-center">Message</th>
                  <th className="p-3 text-center">Source</th>
                  <th className="p-3 text-center">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <React.Fragment key={log.id}>
                    <tr onClick={() => toggleDetails(log.id)} className={`border-b dark:border-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-700 cursor-pointer ${expandedLogId === log.id ? 'bg-blue-50 dark:bg-gray-700' : ''}`}>
                      <td className="p-3 text-center">{log.id}</td>
                      <td className="p-3"><ErrorLevelTag level={log.level} /></td>
                      <td className="p-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-center" title={log.message}>{log.message}</td>
                      <td className="p-3">{log.source}</td>
                      <td className="p-3 text-center">{new Date(log.timestamp).toLocaleString('ko-KR')}</td>
                    </tr>
                    {expandedLogId === log.id && (
                      <tr className='bg-gray-50 dark:bg-gray-800'>
                        <td colSpan="5" className='p-4 border-t border-gray-200 dark:border-gray-600'>
                          <div className="text-sm space-y-2">
                            <p className='font-bold'>Full Message:</p>
                            <pre className='whitespace-pre-wrap font-mono text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded-md overflow-x-auto'>
                              {log.message}
                            </pre>

                            <p className='font-bold mt-3'>Source:</p>
                            <pre className='whitespace-pre-wrap font-mono text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded-md overflow-x-auto'>
                              {log.source}
                            </pre>

                            <p className='font-bold'>Timestamp:</p>
                            <p className='text-xs'>{new Date(log.timestamp).toLocaleString('ko-KR')}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {hasMoreLogs && !loading && ( // 로딩 중이 아니고, 더 볼 로그가 있으며, 현재 로그가 하나라도 있을 때만 버튼 보이기
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded"
                disabled={loading} // 로딩 중일 때는 버튼 비활성화
              >
                더보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
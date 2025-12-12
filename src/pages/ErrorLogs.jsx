import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import ErrorLevelTag from '../components/error/ErrorLevelTag';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]); // 현재 화면에 보여질 로그들
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedLogId, setExpandedLogId] = useState(null); // 상세보기 토글 ID

  // URL 파라미터들을 가져옴
  const [searchParams] = useSearchParams();

  const initialLevel = searchParams.get('level') || '';
  const initialKeyword = searchParams.get('keyword') || '';
  const initialStartDate = searchParams.get('startDate') || '';
  const initialEndDate = searchParams.get('endDate') || '';

  // 필터 UI에 보이는 임시 상태
  const [tempFilterLevel, setTempFilterLevel] = useState(initialLevel);
  const [tempSearchKeyword, setTempSearchKeyword] = useState(initialKeyword);
  const [tempStartDate, setTempStartDate] = useState(initialStartDate);
  const [tempEndDate, setTempEndDate] = useState(initialEndDate);

  // 실제 API 호출에 사용되는 필터 상태
  const [currentFilterLevel, setCurrentFilterLevel] = useState(initialLevel);
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState(initialKeyword);
  const [currentStartDate, setCurrentStartDate] = useState(initialStartDate);
  const [currentEndDate, setCurrentEndDate] = useState(initialEndDate);

  // 백엔드 페이징을 위한 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호 (백엔드로 보냄)
  const [totalPages, setTotalPages] = useState(0); // 백엔드에서 받은 총 페이지 수
  const logsPerPage = 15; // 한 페이지당 로그 개수 (백엔드 @PageableDefault.size와 맞춰야 함)

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

  // 에러 로그 API 호출 함수 (이제 백엔드가 Page 객체로 응답하는 것을 가정)
  const fetchErrorLogs = async (params) => {
    setLoading(true); // 로딩 시작
    setError(null);

    try {
      const response = await axiosInstance.get('/logs/search', { params });
      setLoading(false); // 로딩 끝

      // 백엔드가 Page 객체 형태로 응답할 것이므로, content와 totalPages를 추출
      if (response.data && response.data.content) {
        setTotalPages(response.data.totalPages); // 's' 누락 없도록 주의!
        return response.data.content; // 로그 데이터(배열)만 반환
      } else {
        console.error("Unexpected response data format:", response.data);
        setError("로그 데이터 형식이 올바르지 않습니다.");
        return [];
      }

    } catch (err) {
      setLoading(false); // 로딩 끝
      console.error('Error fetching logs:', err);
      setError('로그를 가져오는 중 오류가 발생했습니다.');
      return [];
    }
  };

  // 초기 로딩 및 필터/페이지 변경 시 호출되는 useEffect
  useEffect(() => {
    const loadLogs = async () => {
      // 서버에 보낼 파라미터 (level, keyword, startDate, endDate, page, size 포함!)
      const params = {
        level: currentFilterLevel || null,
        keyword: currentSearchKeyword,
        startDate: formatDateTimeForBackend(currentStartDate),
        endDate: formatDateTimeForBackend(currentEndDate),
        page: currentPage, // 현재 페이지 번호!
        size: logsPerPage, // 한 페이지당 로그 개수!
      };
      Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

      console.log('Fetching logs with params:', params); // 파라미터 제대로 넘어가는지 확인

      const fetchedLogContent = await fetchErrorLogs(params);
      
      // 초기 로딩 시 (currentPage === 0) 또는 필터 변경 시에는 기존 로그를 새로 받은 로그로 교체
      // '더보기' 버튼을 눌렀을 때는 (currentPage > 0) 기존 로그에 새로 받은 로그를 추가
      if (currentPage === 0) {
        setLogs(fetchedLogContent);
      } else {
        setLogs(prevLogs => [...prevLogs, ...fetchedLogContent]);
      }
    };

    loadLogs();
  }, [currentFilterLevel, currentSearchKeyword, currentStartDate, currentEndDate, currentPage]); // logsPerPage는 상수이므로 의존성 배열에서 제외
  // currentPage가 바뀌면 이 useEffect가 다시 실행되어 다음 페이지를 가져옴!

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setCurrentFilterLevel(tempFilterLevel);
    setCurrentSearchKeyword(tempSearchKeyword);
    setCurrentStartDate(tempStartDate);
    setCurrentEndDate(tempEndDate);

    setCurrentPage(0); // 검색 시에는 항상 첫 페이지(0)부터 다시 시작!
    setTotalPages(0); // 검색 시 총 페이지 수도 초기화 (새로운 검색 결과에 따라 다시 설정될 것)

    const newSearchParams = new URLSearchParams();
    if (tempFilterLevel) newSearchParams.set('level', tempFilterLevel);
    if (tempSearchKeyword) newSearchParams.set('keyword', tempSearchKeyword);
    if (tempStartDate) newSearchParams.set('startDate', tempStartDate);
    if (tempEndDate) newSearchParams.set('endDate', tempEndDate);
    newSearchParams.set('page', '0');

    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

  // '더보기' 버튼 클릭 핸들러 (이제 백엔드에서 다음 페이지를 요청)
  const handleLoadMore = () => {
    // 로딩 중이 아니고, 아직 다음 페이지가 남아있다면
    // currentPage가 totalPages보다 작을 때 다음 페이지가 존재한다는 뜻
    if (!loading && (currentPage < totalPages - 1)) {
      setCurrentPage(prevPage => prevPage + 1); // 현재 페이지 번호 증가 -> useEffect 트리거 -> 다음 페이지 요청
    }
  };

  // '더보기' 버튼을 보여줄지 말지 결정하는 변수
  const showLoadMoreButton = !loading && (currentPage < totalPages - 1);


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
          <option value="FATAL">FATAL</option>
        </select>
        <input type="text" placeholder="메시지 또는 소스 검색" value={tempSearchKeyword} onChange={e => setTempSearchKeyword(e.target.value)} className="flex-grow min-w-[150px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="datetime-local" value={tempStartDate ? moment(tempStartDate).format('YYYY-MM-DDTHH:mm:ss') : ''} onChange={e => setTempStartDate(e.target.value)} className="flex-none w-[200px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" step="1" title="시작 일시" />
        <input type="datetime-local" value={tempEndDate ? moment(tempEndDate).format('YYYY-MM-DDTHH:mm') : ''} onChange={e => setTempEndDate(e.target.value)} className="flex-none w-[200px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" step="1" title="종료 일시" />

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
          {showLoadMoreButton && (
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
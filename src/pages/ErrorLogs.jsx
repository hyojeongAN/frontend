import axios from '../api/axiosConfig';
import React, { useEffect, useState } from 'react';
import ErrorLevelTag from '../components/error/ErrorLevelTag';

export default function ErrorLogs() {
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchErrorLogs = async () => {
    try {
      const response = await axios.get('/logs');
      return response.data;
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("로그를 가져오는데 실패했습니다.");
      return [];
    }
  };

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError(null);
      const fetchedLogs = await fetchErrorLogs();
      setLogs(fetchedLogs);
      setLoading(false);
    };

    loadLogs();
  }, []);

  if (loading) {
    return <div className="p-6">로그를 불러오는 중...</div>
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }
  if (logs.length === 0) {
    return <div className="p-6">표시할 에러 로그가 없습니다.</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Error Logs</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-conter">Id</th>
              <th className="p-3 text-center">Level</th>
              <th className="p-3 text-center">Message</th>
              <th className="p-3 text-center">source</th>
              <th className="p-3 text-center">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b dark:border-gray-700">
                <td className="p-3">{log.id}</td>
                <td className="p-3"><ErrorLevelTag level={log.level} /></td>
                <td className="p-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={log.message}>{log.message}</td>
                <td className="p-3">{log.source}</td>
                <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
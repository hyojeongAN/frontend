import React from 'axios';
import { useState, serEffect, useEffect } from 'react';
import styled from 'styled-components';

const Logitem = styled.li
`
  list-style: none; // 리스트 마커 제거
  background-color: #f0f0f0; // 밝은 배경
  border-radius: 4px;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  font-family: 'monospace';
  color: #333;

  // 다크모드일 때 색상 변경 예시 (나중에 테마 설정과 연동 가능)
  body.dark & {
    background-color: #333;
    color: #e0e0e0;
  }
`;

const CriticalLogItem = styled(LogItem)`
  background-color: #ffcccc; // 빨간색 계열
  color: #a00; // 진한 빨간색
  body.dark & {
    background-color: #5c0a0a;
    color: #ff9999;
  }
`;

const WarningLogItem = styled(LogItem)`
  background-color: #fffacd; // 노란색 계열
  color: #8b6100; // 진한 노란색
  body.dark & {
    background-color: #4b3e00;
    color: #ffdd88;
  }
`;

function ErrorLogList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>에러 로그 목록</h2>
      <ul>
        {logs.map(log => {
          let CurrentLogItem = LogItem; // 기본값
          if (log.level === 'CRITICAL' || log.level === 'ERROR') {
            CurrentLogItem = CriticalLogItem;
          } else if (log.level === 'WARNING') {
            CurrentLogItem = WarningLogItem;
          }
          
          return (
            <CurrentLogItem key={log.id}>
              [{log.level}] {log.message} (발생시각: {log.timestamp})
            </CurrentLogItem>
          );
        })}
        {logs.length === 0 && <LogItem>아직 에러 로그가 없습니다.</LogItem>}
      </ul>
    </div>
  );
}

export default ErrorLogList;
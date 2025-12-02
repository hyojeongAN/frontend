import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/logs')
      .then(res => {
        console.log("받아온 로그 데이터: ", res.data);
        setLogs(res.data);
      })
      .catch(err => console.error(err));
  }, []);

 return (
    <ul>
      {logs.map(log => <li key={log.id}>{log.message}</li>)}
    </ul>
 );

}
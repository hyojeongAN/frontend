import axios from '../api/axiosConfig';
import React, { useEffect, useState } from 'react';

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/logs')
      .then(res => serLogs(res.data))
      .catch(err => console.error(err));
  }, []);

 return (
    <ul>
      {logs.map(log => <li key={log.id}>{log.message}</li>)}
    </ul>
 );

}
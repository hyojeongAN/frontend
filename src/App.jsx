import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

function ErrorLogList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  })

  return (
    <ul>
      {logs.map(log =>(
        <li key={log.id}>
          [{log.level}] {log.message} ({log.timestamp})
        </li>
      ))}
    </ul>
  );

}

function App() {

}

export default App;

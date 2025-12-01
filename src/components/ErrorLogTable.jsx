export default function ErrorLogTable() {
    return (
        <table>
            <thead>
                <tr>
                    <th>Error Message</th>
                    <th>File/Line</th>
                    <th>Status</th>
                    <th>First Seen</th>
                    <th>Last Occurred</th>
                </tr>
            </thead>
            <tbody>
                {localStorage.map(log => (
                    <tr key={log.id} className={log.status}>
                        <td>{log.message}</td>
                        <td>{log.fileLine}</td>
                        <td>{log.status}</td>
                        <td>{log.firstSeen}</td>
                        <td>{log.lastOccurred}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default function ConsolePanel({ logs }) {
    return (
        <div className="bg-black text-green-400 font-mono text-sm p-3 mt-4 rounded h-48 overflow-y-auto">
            <h2 className="text-white mb-2">🖥️ Console</h2>
            {logs.length === 0 ? (
                <p className="text-gray-400">No logs yet.</p>
            ) : (
                logs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                ))
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';

// 1. Defined Styles at the TOP to prevent [eslint] errors
const containerStyle = { padding: '40px', backgroundColor: '#1a1a2e', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
const monitorCard = { background: '#16213e', padding: '20px', borderRadius: '10px', border: '1px solid #0f3460', textAlign: 'center' };
const logBox = { background: '#000', padding: '15px', marginTop: '30px', borderRadius: '5px', height: '200px', overflowY: 'scroll', color: '#00ff00', border: '1px solid #333' };

const MyWorkspace = () => {
    const [cpuLoad, setCpuLoad] = useState(45);
    const [logs, setLogs] = useState(["[SYS] System Initialized...", "[AUTH] Admin Logged In"]);

    // 2. Mock "Real-Time" Logic (UI Only)
    useEffect(() => {
        const interval = setInterval(() => {
            const newLoad = Math.floor(Math.random() * 20) + 40;
            setCpuLoad(newLoad);
            setLogs(prev => [`[LOG] Activity detected at ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 5)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={containerStyle}>
            <header style={{ borderBottom: '2px solid #e94560', paddingBottom: '10px', marginBottom: '30px' }}>
                <h1>FRONTEND LIVE MONITORING</h1>
                <p>Status: <span style={{ color: '#00ff00' }}>ONLINE</span> | Port: 3000</p>
            </header>

            <div style={gridStyle}>
                <div style={monitorCard}>
                    <h3>CPU LOAD</h3>
                    <h2 style={{ color: '#e94560' }}>{cpuLoad}%</h2>
                </div>
                <div style={monitorCard}>
                    <h3>UI LATENCY</h3>
                    <h2 style={{ color: '#00d2ff' }}>14ms</h2>
                </div>
                <div style={monitorCard}>
                    <h3>UPTIME</h3>
                    <h2 style={{ color: '#00ff00' }}>99.9%</h2>
                </div>
            </div>

            <div style={logBox}>
                <h4>{">"} LIVE_SYSTEM_LOGS</h4>
                {logs.map((log, i) => <div key={i} style={{ marginBottom: '5px' }}>{log}</div>)}
            </div>
        </div>
    );
};

export default MyWorkspace;
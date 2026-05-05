import React, { useState, useEffect } from 'react';

// --- UI Styling Toolkit ---
const dashboardStyle = {
    backgroundColor: '#0a0a0c',
    minHeight: '100vh',
    color: '#e0e0e0',
    padding: '40px',
    fontFamily: "'Fira Code', monospace"
};

const glassCard = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px'
};

const statusDot = (active) => ({
    height: '10px',
    width: '10px',
    backgroundColor: active ? '#00ff41' : '#ff3131',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '10px',
    boxShadow: active ? '0 0 10px #00ff41' : 'none'
});

const ProjectTaskView = () => {
    const [terminalLines, setTerminalLines] = useState(["> Initializing workspace..."]);
    const [uptime, setUptime] = useState(0);

    // Real-time Simulation
    useEffect(() => {
        const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
        const logInterval = setInterval(() => {
            const logs = [
                "[SYSTEM] Spring Boot microservices operational.",
                "[DB] PostgreSQL connection pool optimized.",
                "[UI] Angular components rendered successfully.",
                "[AUTH] JWT Handshake verified.",
                "[DEPLOY] Pushing build to local environment..."
            ];
            setTerminalLines(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev.slice(0, 5)]);
        }, 4000);

        return () => {
            clearInterval(timer);
            clearInterval(logInterval);
        };
    }, []);

    return (
        <div style={dashboardStyle}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: '#00d4ff', margin: 0 }}>DEV_WORKSPACE_v2.0</h1>
                    <p style={{ opacity: 0.6 }}>Ramani R // Full-Stack Architecture</p>
                </div>
                <div style={glassCard}>
                    <span style={statusDot(true)}></span> SYSTEM_LIVE: {uptime}s
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                
                {/* Real-Time Terminal Log */}
                <div style={{ ...glassCard, borderLeft: '4px solid #00d4ff' }}>
                    <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Live Activity Console</h3>
                    <div style={{ backgroundColor: '#000', padding: '15px', borderRadius: '8px', minHeight: '180px' }}>
                        {terminalLines.map((line, i) => (
                            <div key={i} style={{ color: i === 0 ? '#00ff41' : '#888', marginBottom: '8px' }}>
                                {i === 0 ? "> " : "  "} {line}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack Pulse */}
                <div style={glassCard}>
                    <h3 style={{ marginTop: 0 }}>Tech Stack Distribution</h3>
                    <div style={{ marginTop: '20px' }}>
                        {[
                            { name: 'Java / Spring', val: 90, col: '#f89820' },
                            { name: 'React / Angular', val: 85, col: '#61dbfb' },
                            { name: 'PostgreSQL / Mongo', val: 75, col: '#336791' }
                        ].map((tech) => (
                            <div key={tech.name} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span>{tech.name}</span>
                                    <span>{tech.val}%</span>
                                </div>
                                <div style={{ background: '#222', height: '6px', borderRadius: '3px', marginTop: '5px' }}>
                                    <div style={{ background: tech.col, width: `${tech.val}%`, height: '100%', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Quick-Links (Frontend Only) */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                <div style={{ ...glassCard, flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                    <h4>Shopping Mall UI</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Frontend Prototype</p>
                </div>
                <div style={{ ...glassCard, flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                    <h4>Spring API</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Backend Services</p>
                </div>
                <div style={{ ...glassCard, flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                    <h4>ML Predictor</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Python Integration</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectTaskView;
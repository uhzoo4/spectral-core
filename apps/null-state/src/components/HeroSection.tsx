
export default function HeroSection() {
  return (
    <div className="hud-layer">
      {/* Top Title and Control Bar */}
      <div className="title-container">
        <div className="hud-title-card">
          <h1 className="neon-text">NULL_STATE_MATRIX</h1>
          <p>Reusable Cinematic Engine // Phase 6</p>
        </div>
      </div>

      {/* Bottom Console and Metric Row */}
      <div className="hud-bottom-row">
        {/* Left Side Typewriter Logs overlay */}
        <div className="hud-panel console-logger" style={{ pointerEvents: 'none' }}>
          <div className="metric-label" style={{ marginBottom: '0.4rem', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '0.2rem' }}>
            TELEMETRY_STREAM // SYSTEM_LOGS
          </div>
          {/* This element is directly targeted and populated by NarrativeSystem */}
          <div id="narrative-telemetry-hud" className="console-msg" style={{ fontFamily: 'inherit', fontSize: '0.75rem', color: '#cbd5e1' }}>
            &gt; Awaiting presence...
          </div>
        </div>

        {/* Right Side Status Panel */}
        <div className="hud-panel hud-status-bar" style={{ pointerEvents: 'auto' }}>
          <div className="metric-group">
            <span className="metric-label">STATUS</span>
            <span className="metric-val flex items-center">
              <span className="status-indicator" />
              SECURE
            </span>
          </div>

          <div className="metric-group">
            <span className="metric-label">FRAME_PACING</span>
            <span id="hud-fps-val" className="metric-val neon-text-green">
              0.00ms
            </span>
          </div>

          <div className="metric-group">
            <span className="metric-label">ELAPSED_TIME</span>
            <span id="hud-time-val" className="metric-val">
              0.00s
            </span>
          </div>

          <div className="metric-group">
            <span className="metric-label">POOL_VEC</span>
            <span id="hud-vec-pool" className="metric-val">
              0 / 0
            </span>
          </div>

          <div className="metric-group">
            <span className="metric-label">POOL_MAT</span>
            <span id="hud-mat-pool" className="metric-val">
              0 / 0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

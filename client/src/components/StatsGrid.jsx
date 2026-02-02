export default function StatsGrid({ stats }) {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon total">📊</div>
                <div className="stat-content">
                    <h3>{stats.total || 0}</h3>
                    <p>Total Tasks</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon pending">⏳</div>
                <div className="stat-content">
                    <h3>{stats.pending || 0}</h3>
                    <p>Pending</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon in-progress">🔄</div>
                <div className="stat-content">
                    <h3>{stats.inProgress || 0}</h3>
                    <p>In Progress</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon completed">✅</div>
                <div className="stat-content">
                    <h3>{stats.completed || 0}</h3>
                    <p>Completed</p>
                </div>
            </div>
        </div>
    );
}

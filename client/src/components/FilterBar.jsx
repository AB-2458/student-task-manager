export default function FilterBar({ filters, onFilterChange }) {
    return (
        <div className="filter-bar">
            <span className="filter-label">🔍 Filter by:</span>

            <select
                className="form-select"
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
            >
                <option value="">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
            </select>

            <select
                className="form-select"
                value={filters.priority}
                onChange={(e) => onFilterChange('priority', e.target.value)}
            >
                <option value="">All Priority</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
            </select>
        </div>
    );
}

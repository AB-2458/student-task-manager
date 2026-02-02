export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No due date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in-progress': return 'In Progress';
            case 'completed': return 'Completed';
            default: return status;
        }
    };

    const handleStatusClick = (e) => {
        e.stopPropagation();
        const statuses = ['pending', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(task.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        onStatusChange(nextStatus);
    };

    return (
        <div className="task-card" onClick={onEdit}>
            <div className={`task-priority-indicator ${task.priority}`}></div>

            <div className="task-content">
                <h3 className="task-title">
                    {task.title}
                    <span
                        className={`task-status ${task.status}`}
                        onClick={handleStatusClick}
                        title="Click to change status"
                    >
                        {getStatusLabel(task.status)}
                    </span>
                </h3>
                <div className="task-meta">
                    {task.subject && (
                        <span className="task-meta-item">
                            📚 {task.subject}
                        </span>
                    )}
                    <span className="task-meta-item">
                        📅 {formatDate(task.dueDate)}
                    </span>
                    <span className="task-meta-item">
                        {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority} priority
                    </span>
                </div>
            </div>

            <div className="task-actions">
                <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    ✏️ Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';

const SUBJECTS = [
    'Mathematics',
    'Science',
    'History',
    'English',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'Art',
    'Music',
    'Other'
];

export default function TaskModal({ task, onSave, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                subject: task.subject || '',
                dueDate: task.dueDate || '',
                priority: task.priority || 'medium',
                status: task.status || 'pending'
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Task title is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSave(formData);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">{task ? 'Edit Task' : 'Create New Task'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="Enter task title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-textarea"
                                placeholder="Enter task description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <select
                                    name="subject"
                                    className="form-select"
                                    value={formData.subject}
                                    onChange={handleChange}
                                >
                                    <option value="">Select subject</option>
                                    {SUBJECTS.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    className="form-input"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    name="priority"
                                    className="form-select"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="low">🟢 Low</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="high">🔴 High</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="pending">⏳ Pending</option>
                                    <option value="in-progress">🔄 In Progress</option>
                                    <option value="completed">✅ Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
